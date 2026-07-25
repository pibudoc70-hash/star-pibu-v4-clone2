import "dotenv/config";
import express from "express";
import compression from "compression";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { imageCache, imageNotFoundCache } from "./imageCache";
import { imageProxyLimiter, trpcLimiter, healthLimiter } from "./rateLimits";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { startOtpCleanupScheduler } from "../otpCleanup";
import { collectKeywordTrendsHandler } from "./scheduled";
import { initializeWebSocketServer } from "./websocket";
import { registerRssFeed } from "../rss";
import { registerSitemapDynamic } from "../sitemap";
import { securityHeadersMiddleware } from "./securityHeaders";
import { validateEnv } from "./envSchema";
import { sql as sqlRaw } from "drizzle-orm";
import crypto from "crypto";

// [Step51-C] 팝업 이미지 SSRF 화이트리스트 호스트 패턴
// iitm.ac.in 은 이 사이트와 무관한 템플릿 잔재이므로 제거.
const POPUP_IMAGE_WHITELIST = [
  /\.cloudfront\.net$/,
  /^img\.youtube\.com$/,
];

// [Step51-C] 이미지 프록시 응답 크기 상한 (storageProxy 와 동일 기준)
const MAX_POPUP_BYTES = 5 * 1024 * 1024;

function isAllowedPopupHost(hostname: string): boolean {
  return POPUP_IMAGE_WHITELIST.some((pattern) => pattern.test(hostname));
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // 환경변수 검증 (DB 연결보다 먼저) — 실패 시 즉시 종료
  const env = validateEnv();
  console.log(
    `[Boot] Environment validated (NODE_ENV=${env.NODE_ENV}, PORT=${env.PORT})`,
  );

  const app = express();
  const server = createServer(app);

  // DB 연결 부팅 검증: 연결 실패 시 서버가 뜨지 못하도록 즉시 종료
  // (getDb() 가 undefined를 반환하는 상태로 서버가 뜨면 모든 요청이 500 에러가 나므로
  //  차라리 부팅 실패로 만들어 배포 시스템이 재시도하거나 알람을 보내도록 유도)
  try {
    const { getDb } = await import("../db/connection");
    await getDb(); // 실패 시 throw → 아래 catch 로 진입
    console.log("[Boot] Database connection verified (SELECT 1 OK)");
  } catch (err) {
    console.error(
      "[FATAL] Database connection failed:",
      err instanceof Error ? err.message : err,
    );
    console.error("[FATAL] Check DATABASE_URL and network reachability.");
    process.exit(1);
  }

  // Express 기본 서버 정보 노출 방지
  app.disable("x-powered-by");
  // Cloudflare/리버스 프록시 뒤에서 실제 클라이언트 IP 를 얻기 위함
  // (레이트 리미팅이 프록시 IP 하나에 몰려 전체 사용자가 차단되는 것을 방지)
  app.set("trust proxy", 1);
  // ── 보안 헤더 미들웨어 (가장 먼저 적용) ───────────────────────────────────────────
  app.use(securityHeadersMiddleware);

  // gzip/brotli 압축: 텍스트 응답(HTML, JSON, JS, CSS) 크기 축소
  // threshold: 1KB 이상 응답에만 압축 적용 (작은 응답은 오히려 오버헤드)
  app.use(
    compression({
      threshold: 1024,
      level: 6, // 0(무압축)~9(최대압축), 6이 속도·압축률 균형점
      filter: (req, res) => {
        // 이미지 프록시는 이미 최적화된 바이너리 → 압축 제외 (CPU 낙비 방지)
        if (req.path.startsWith("/api/storage")) return false;
        if (req.path.startsWith("/api/youtube-thumbnail")) return false;
        if (req.path.startsWith("/api/popup-image")) return false;
        return compression.filter(req, res);
      },
    }),
  );

  // body-parser: 1mb 제한 (일반 API 요청에 충분, DoS 벡터 축소)
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  // ── 레이트 리미팅 (공개 엔드포인트 보호) ─────────────────────────────────
  app.use("/healthz", healthLimiter);
  app.use("/api/storage", imageProxyLimiter);
  // [Step51-D] /manus-storage 는 301 리다이렉트만 수행하므로 리미터 대상에서 제외
  // (외부 fetch 없음 → 이중 소모 방지)
  app.use("/api/youtube-thumbnail", imageProxyLimiter);
  app.use("/api/popup-image", imageProxyLimiter);
  app.use("/api/trpc", trpcLimiter);

  // ── 헬스체크 (로드밸런서 · 모니터링용) ─────────────────────────────────────
  app.get("/healthz", async (_req, res) => {
    const started = Date.now();
    try {
      const { getDb } = await import("../db/connection");
      const db = await getDb();
      await db.execute(sqlRaw`SELECT 1`);
      res.status(200).json({
        status: "ok",
        db: "ok",
        uptimeSec: Math.round(process.uptime()),
        latencyMs: Date.now() - started,
        env: process.env.NODE_ENV ?? "unknown",
      });
    } catch (err) {
      res.status(503).json({
        status: "degraded",
        db: "fail",
        error: err instanceof Error ? err.message : String(err),
        uptimeSec: Math.round(process.uptime()),
      });
    }
  });

  registerStorageProxy(app);
  // YouTube 썸네일 프록시 라우터 (LRU 캐시 적용)
  app.get('/api/youtube-thumbnail/:videoId', async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
      res.status(400).send('Missing videoId');
      return;
    }

    const cacheKey = `yt:${videoId}`;

    try {
      // 0. 음수 캐시: 최근 404 로 확인된 리소스는 외부 요청 없이 즉시 404
      if (imageNotFoundCache.has(cacheKey)) {
        res.status(404).send("Not found (cached)");
        return;
      }
      // 1. LRU 캐시 조회
      const cached = imageCache.get(cacheKey);
      if (cached) {
        console.log(`[YouTubeThumbnailProxy] [cache hit] videoId=${videoId}`);
        const ifNoneMatch = req.get("If-None-Match");
        if (ifNoneMatch === `"${cached.etag}"`) {
          res.status(304).end();
          return;
        }
        res.set('Content-Type', cached.contentType);
        res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        res.set('ETag', `"${cached.etag}"`);
        res.set('Vary', 'Accept, Accept-Encoding');
        res.set('Access-Control-Allow-Origin', '*');
        res.send(cached.buffer);
        return;
      }

      // 2. maxresdefault.jpg 시도 → 실패 시 hqdefault.jpg 폴백
      const urls = [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      ];
      
      let imgResp: Response | null = null;
      for (const url of urls) {
        try {
          const resp = await fetch(url, {
            redirect: "error", // [Step51-C] 화이트리스트 밖으로의 리다이렉트 차단
            signal: AbortSignal.timeout(8000),
          });
          if (resp.ok) {
            imgResp = resp;
            break;
          }
        } catch (_e) {
          // 다음 URL 시도
        }
      }
      
      if (!imgResp) {
        // 모든 폴백이 실패한 최종 실패 지점에만 음수 캐시 기록
        imageNotFoundCache.set(cacheKey, true);
        res.status(404).send('Thumbnail not found');
        return;
      }

      // 3. 이미지 바이트 가져오기
      // [Step51-C] Content-Length 기반 사전 차단
      const ytDeclaredLen = Number(imgResp.headers.get("content-length") || 0);
      if (ytDeclaredLen > MAX_POPUP_BYTES) {
        res.status(413).type("text/plain").send("Payload too large");
        return;
      }
      const buffer = Buffer.from(await imgResp.arrayBuffer());
      // [Step51-C] 실제 버퍼 크기 검사 (캐시에 넣기 전)
      if (buffer.byteLength > MAX_POPUP_BYTES) {
        res.status(413).type("text/plain").send("Payload too large");
        return;
      }
      const etag = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 16);

      // 4. LRU 캐시에 저장
      imageCache.set(cacheKey, { buffer, contentType: 'image/jpeg', etag });

      // 5. If-None-Match 확인
      const ifNoneMatch = req.get("If-None-Match");
      if (ifNoneMatch === `"${etag}"`) {
        res.status(304).end();
        return;
      }

      res.set('Content-Type', 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.set('ETag', `"${etag}"`);
      res.set('Vary', 'Accept, Accept-Encoding');
      res.set('Access-Control-Allow-Origin', '*');
      res.send(buffer);
    } catch (err) {
      console.error('[YouTubeThumbnailProxy] error:', err);
      res.status(502).send('Failed to fetch thumbnail');
    }
  });
  
  // 팝업 이미지 프록시 라우터 (LRU 캐시 + SSRF 방어)
  app.get('/api/popup-image', async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      res.status(400).send('Missing or invalid url parameter');
      return;
    }

    // SSRF 방어: URL 파싱 및 화이트리스트 검증
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (_e) {
      res.status(400).send('Invalid url parameter');
      return;
    }

    if (parsedUrl.protocol !== 'https:') {
      res.status(400).send('Only https URLs are allowed');
      return;
    }

    if (!isAllowedPopupHost(parsedUrl.hostname)) {
      res.status(400).send('URL host not allowed');
      return;
    }

    const cacheKey = `popup:${url}`;
    try {
      // 0. 음수 캐시: 최근 404 로 확인된 리소스는 외부 요청 없이 즉시 404
      if (imageNotFoundCache.has(cacheKey)) {
        res.status(404).send("Not found (cached)");
        return;
      }
      // 1. LRU 캐시 조회
      const cached = imageCache.get(cacheKey);
      if (cached) {
        console.log(`[PopupImageProxy] [cache hit] url=${url}`);
        const ifNoneMatch = req.get("If-None-Match");
        if (ifNoneMatch === `"${cached.etag}"`) {
          res.status(304).end();
          return;
        }
        res.set('Content-Type', cached.contentType);
        res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        res.set('ETag', `"${cached.etag}"`);
        res.set('Vary', 'Accept, Accept-Encoding');
        res.set('Access-Control-Allow-Origin', '*');
        res.send(cached.buffer);
        return;
      }

      // 2. 원본 이미지 가져오기
      const resp = await fetch(url, {
        redirect: "error", // [Step51-C] 화이트리스트 밖으로의 리다이렉트 차단
        signal: AbortSignal.timeout(8000),
      });
      if (!resp.ok) {
        // 404 실패 시에만 음수 캐시 기록 (SSRF 403 등 다른 오류는 제외)
        if (resp.status === 404) {
          imageNotFoundCache.set(cacheKey, true);
        }
        res.status(resp.status).send('Failed to fetch image');
        return;
      }

      // 3. 이미지 바이트 가져오기
      // [Step51-C] Content-Length 기반 사전 차단
      const popupDeclaredLen = Number(resp.headers.get("content-length") || 0);
      if (popupDeclaredLen > MAX_POPUP_BYTES) {
        res.status(413).type("text/plain").send("Payload too large");
        return;
      }
      const contentType = resp.headers.get('content-type') || 'image/jpeg';
      const buffer = Buffer.from(await resp.arrayBuffer());
      // [Step51-C] 실제 버퍼 크기 검사 (캐시에 넣기 전)
      if (buffer.byteLength > MAX_POPUP_BYTES) {
        res.status(413).type("text/plain").send("Payload too large");
        return;
      }
      const etag = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 16);

      // 4. LRU 캐시에 저장
      imageCache.set(cacheKey, { buffer, contentType, etag });

      // 5. If-None-Match 확인
      const ifNoneMatch = req.get("If-None-Match");
      if (ifNoneMatch === `"${etag}"`) {
        res.status(304).end();
        return;
      }

      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.set('ETag', `"${etag}"`);
      res.set('Vary', 'Accept, Accept-Encoding');
      res.set('Access-Control-Allow-Origin', '*');
      res.send(buffer);
    } catch (err) {
      console.error('[PopupImageProxy] error:', err);
      res.status(502).send('Failed to fetch image');
    }
  });
  
  registerOAuthRoutes(app);
  registerRssFeed(app);
  registerSitemapDynamic(app);

  // NOTE: /sitemap.xml is served as a static file from client/public/sitemap.xml
  // (via express.static in serveStatic). The dynamic route that was here has been
  // removed because it only contained fragment URLs (#about, #doctors, etc.) and
  // was shadowing the comprehensive static sitemap.xml.
  // Source of truth: client/public/sitemap.xml
  // Heartbeat 스케줄러 핸들러
  app.post("/api/scheduled/collectKeywordTrends", collectKeywordTrendsHandler);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError({ error, path, type }) {
        // INTERNAL_SERVER_ERROR 만 기록 (클라이언트 입력 오류는 로그 노이즈이므로 제외)
        if (error.code === "INTERNAL_SERVER_ERROR") {
          console.error(
            `[tRPC:ERROR] ${type} ${path ?? "<no-path>"} — ${error.message}`,
          );
          if (error.cause) console.error("[tRPC:CAUSE]", error.cause);
          if (error.stack) console.error(error.stack);
        }
      },
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = env.PORT;
  let port: number;

  if (process.env.NODE_ENV === "development") {
    // 개발 환경: 포트 충돌 시 자동 탐색 (기존 동작 유지)
    port = await findAvailablePort(preferredPort);
    if (port !== preferredPort) {
      console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
    }
  } else {
    // 프로덕션 환경: 지정 포트가 사용 불가면 즉시 종료
    // 로드밸런서/헬스체크가 특정 포트를 기대하므로 자동 전환은 위험
    const available = await isPortAvailable(preferredPort);
    if (!available) {
      console.error(
        `[FATAL] Port ${preferredPort} is not available in production. Exiting.`,
      );
      process.exit(1);
    }
    port = preferredPort;
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    // P2-1: 만료된 OTP 레코드 정리 스케줄러 (6시간 간격)
    startOtpCleanupScheduler();
    // WebSocket 서버 초기화
    initializeWebSocketServer(server);
  });

  // Graceful shutdown: 진행 중인 요청을 완료한 후 프로세스 종료
  // 컨테이너 오케스트레이터(k8s, ECS 등)가 SIGTERM 을 보내면 즉시 죽지 않고
  // 최대 10초간 기존 연결 처리를 마무리한 뒤 종료한다.
  const shutdown = (signal: string) => {
    console.log(`[Shutdown] ${signal} received, closing server gracefully...`);

    // 강제 종료 타임아웃: 10초 내 정상 종료가 안 되면 강제 exit
    const forceExitTimer = setTimeout(() => {
      console.error("[Shutdown] Forced exit after 10s timeout");
      process.exit(1);
    }, 10_000);

    server.close(async (err) => {
      clearTimeout(forceExitTimer);
      try {
        const { closeDb } = await import("../db/connection");
        await closeDb();
      } catch (dbErr) {
        console.error("[Shutdown] DB pool close failed:", dbErr);
      }
      if (err) {
        console.error("[Shutdown] Error during server.close:", err);
        process.exit(1);
      }
      console.log("[Shutdown] Server closed cleanly");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // 처리되지 않은 예외 로깅 (프로세스는 죽지 않도록 방어)
  process.on("unhandledRejection", (reason) => {
    console.error("[UnhandledRejection]", reason);
  });
  process.on("uncaughtException", (err) => {
    console.error("[UncaughtException]", err);
    // uncaughtException 은 프로세스 상태가 불안정하므로 graceful shutdown 트리거
    shutdown("uncaughtException");
  });
}

startServer().catch(console.error);

import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { imageCache } from "./imageCache";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { startOtpCleanupScheduler } from "../otpCleanup";
import { collectKeywordTrendsHandler } from "./scheduled";
import { initializeWebSocketServer } from "./websocket";
import { registerRssFeed } from "../rss";
import { registerSitemapDynamic } from "../sitemap";
import { securityHeadersMiddleware } from "./securityHeaders";
import crypto from "crypto";

// 팝업 이미지 SSRF 화이트리스트 호스트 패턴
const POPUP_IMAGE_WHITELIST = [
  /\.cloudfront\.net$/,
  /^img\.youtube\.com$/,
  /\.iitm\.ac\.in$/,
];

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
  const app = express();
  const server = createServer(app);

  // ── 보안 헤더 미들웨어 (가장 먼저 적용) ──────────────────────────────────────
  app.use(securityHeadersMiddleware);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
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
          const resp = await fetch(url);
          if (resp.ok) {
            imgResp = resp;
            break;
          }
        } catch (_e) {
          // 다음 URL 시도
        }
      }
      
      if (!imgResp) {
        res.status(404).send('Thumbnail not found');
        return;
      }

      // 3. 이미지 바이트 가져오기
      const buffer = Buffer.from(await imgResp.arrayBuffer());
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
      const resp = await fetch(url);
      if (!resp.ok) {
        res.status(resp.status).send('Failed to fetch image');
        return;
      }

      // 3. 이미지 바이트 가져오기
      const contentType = resp.headers.get('content-type') || 'image/jpeg';
      const buffer = Buffer.from(await resp.arrayBuffer());
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
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    // P2-1: 만료된 OTP 레코드 정리 스케줄러 (6시간 간격)
    startOtpCleanupScheduler();
    // WebSocket 서버 초기화
    initializeWebSocketServer(server);
  });
}

startServer().catch(console.error);

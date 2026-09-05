import { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import path from "path";
import expressStaticGzip from "express-static-gzip";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { injectPageSeoMeta } from "./seoMeta";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    // HMR WebSocket을 Express 서버와 같은 HTTP 서버에 바인딩
    // clientPort를 지정하지 않으면 Vite가 기본값(5173)을 사용하여
    // 프록시 환경에서 WebSocket 연결 실패가 발생함
    hmr: {
      server,
      clientPort: parseInt(process.env.PORT || "3000"),
    },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // /api/* 경로는 SPA fallback에서 제외 — tRPC/OAuth/storage 요청에 HTML 반환 방지
    // 이 가드가 없으면 서버 재시작 중 Vite 미들웨어가 tRPC 요청을 가로채 HTML을 반환할 수 있음
    if (url.startsWith("/api/") || url.startsWith("/api/storage/")) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      const template = await fs.promises.readFile(clientTemplate, "utf-8");
      const page = injectPageSeoMeta(await vite.transformIndexHtml(url, template), req.originalUrl);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(
    expressStaticGzip(distPath, {
      enableBrotli: true,
      // Brotli가 준비된 해시 JS·CSS를 우선 전송하고, 지원하지 않는 클라이언트는
      // 원본 파일을 global compression middleware의 기존 gzip/identity 경로로 보낸다.
      orderPreference: ["br"],
      // SPA shell은 아래 fallback에서 no-cache 정책으로만 제공한다.
      index: false,
      serveStatic: {
      // etag/lastModified 는 express-static 기본값(true) 유지
      setHeaders: (res, filePath) => {
        // 사전 압축 파일도 원본 확장자의 MIME 및 캐시 정책을 기준으로 제공한다.
        const sourcePath = filePath.endsWith(".br") ? filePath.slice(0, -3) : filePath;
        if (filePath.endsWith(".br")) {
          res.setHeader(
            "Content-Type",
            sourcePath.endsWith(".css") ? "text/css; charset=utf-8" : "text/javascript; charset=utf-8",
          );
        }
        if (/\.(js|css)$/i.test(sourcePath)) {
          res.setHeader("Vary", "Accept-Encoding");
        }
        // HTML: 배포 즉시 반영을 위해 캐시 안 함
        if (sourcePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
          return;
        }
        // Vite 빌드 산출물: 파일명에 해시가 붙어있으므로 90일 immutable
        if (/\.(js|css|woff2?|ttf|otf|eot)$/i.test(sourcePath)) {
          res.setHeader("Cache-Control", "public, max-age=7776000, immutable");
          return;
        }
        // 이미지·미디어: 파일명에 해시가 없을 수도 있으므로 30일
        if (/\.(png|jpe?g|webp|avif|svg|ico|gif|mp4|webm)$/i.test(sourcePath)) {
          res.setHeader("Cache-Control", "public, max-age=2592000");
          return;
        }
        // 그 외 (JSON, txt 등): 5분
        res.setHeader("Cache-Control", "public, max-age=300");
      },
      },
    }),
  );

  // fall through to index.html if the file doesn't exist
  // /api/* 경로는 SPA fallback에서 제외 — storage/tRPC 요청에 HTML 반환 방지
  app.use("*", (req, res) => {
    if (req.originalUrl.startsWith("/api/")) {
      res.status(404).send("Not found");
      return;
    }
    // SPA fallback: index.html은 항상 최신 버전 제공
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    try {
      const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf8");
      res.type("html").send(injectPageSeoMeta(template, req.originalUrl));
    } catch {
      res.status(500).send("Unable to load application shell");
    }
  });
}

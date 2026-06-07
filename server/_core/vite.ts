import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  // viteConfig.server에는 host:true 등 독립 서버 설정이 포함되어 있어
  // middlewareMode와 충돌할 수 있으므로 server 키를 serverOptions로 완전히 덮어씀
  const { server: _unusedServerConfig, ...restViteConfig } = viteConfig as any;

  const serverOptions = {
    middlewareMode: true,
    // HMR WebSocket을 Express HTTP 서버에 직접 바인딩
    // - server: HTTP 서버 인스턴스 (WebSocket upgrade 이벤트 공유)
    // - clientPort: 브라우저가 WS 연결할 포트 (프록시 환경에서는 외부 포트 = 3000)
    // - host: "0.0.0.0" 으로 모든 인터페이스에서 수신
    hmr: {
      server,
      host: "0.0.0.0",
      clientPort: parseInt(process.env.PORT || "3000"),
    },
    allowedHosts: true as const,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  };

  const vite = await createViteServer({
    ...restViteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // /api/* 및 /manus-storage/* 경로는 SPA fallback에서 제외
    // tRPC/OAuth/storage 요청에 HTML이 반환되는 것을 방지
    if (url.startsWith("/api/") || url.startsWith("/manus-storage/")) {
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
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
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

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

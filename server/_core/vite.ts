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
    // HMR 설정:
    // hmr: false 는 @vitejs/plugin-react의 React Fast Refresh preamble 주입을 막아
    // "can't detect preamble" 에러를 유발하므로 사용 금지.
    // server 객체를 전달하여 Express HTTP 서버와 WebSocket 업그레이드를 공유.
    // 프록시 환경에서 WebSocket 연결 경고가 발생할 수 있지만 기능에는 영향 없음.
    hmr: { server },
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

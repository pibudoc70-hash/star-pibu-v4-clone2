import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024; // 1MB per log file
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6); // Trim to 60% to avoid constant re-trimming

type LogSource = "browserConsole" | "networkRequests" | "sessionReplay";

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    // Keep newest lines (from end) that fit within 60% of maxSize
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    /* ignore trim errors */
  }
}

function writeToLogFile(source: LogSource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);

  // Format entries with timestamps
  const lines = entries.map((entry) => {
    const ts = new Date().toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });

  // Append to log file
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");

  // Trim if exceeds max size
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

/**
 * Vite plugin to collect browser debug logs
 * - POST /__manus__/logs: Browser sends logs, written directly to files
 * - Files: browserConsole.log, networkRequests.log, sessionReplay.log
 * - Auto-trimmed when exceeding 1MB (keeps newest entries)
 */
function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",

    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true,
            },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      // POST /__manus__/logs: Browser sends logs (written directly to files)
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = (payload: any) => {
          // Write logs directly to files
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };

        const reqBody = (req as { body?: unknown }).body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    cssCodeSplit: true,
    target: "es2020",
    // [P0-OPT] 모바일 첫 로딩 최적화: 홈에서 불필요한 청크 preload 제거
    // Vite는 모든 manualChunks를 자동으로 modulepreload하므로,
    // 홈페이지에서 사용하지 않는 청크는 manualChunks에서 제외하여
    // 불필요한 preload 링크 생성 방지
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React 코어 — 가장 먼저 캐시되어야 하는 vendor
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          // tRPC + React Query
          if (id.includes("@trpc") || id.includes("@tanstack/react-query")) {
            return "vendor-trpc";
          }
          // Lucide 아이콘 (큰 패키지)
          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }
          // [P0-OPT] KaTeX + streamdown: manualChunks에서 제거
          // 이유: Home 첫 진입에서 modulepreload 대상이 되어 291KB gzip 선로드 발생
          // katex (88KB gzip): AI 채팅/관리자 페이지에서만 사용
          // streamdown (203KB gzip): AI 채팅 페이지에서만 사용
          // → Rollup 기본 청킹에 맡기면 사용 페이지에서만 dynamic import로 로드됨
          // if (id.includes("katex")) { return "vendor-katex"; }
          // if (id.includes("streamdown")) { return "vendor-streamdown"; }
          // [P0-OPT] treatments-data: manualChunks에서 제거
          // 이유: Home 첫 진입에서 modulepreload 대상이 되어 396KB gzip 선로드 발생
          // treatments-data (396KB gzip): 시술 페이지에서만 사용
          // → Rollup 기본 청킹에 맡기면 사용 페이지에서만 dynamic import로 로드됨
          // if (id.includes("data/treatments")) {
          //   return "data-treatments";
          // }
          // [P0-OPT] 관리자 페이지 청크 분리 제거
          // 이유: 모바일 홈에서 불필요한 1.2MB 청크 preload 방지
          // 관리자 페이지 접근 시 동적 import로 로드됨
          // if (id.includes("pages/Admin")) {
          //   return "page-admin";
          // }
          
          // [P0-OPT] 시술/장비 페이지 청크 분리 제거
          // 이유: 홈페이지에서 사용하지 않는 149KB 청크 preload 방지
          // if (id.includes("pages/Treatment") || id.includes("pages/Equipment")) {
          //   return "page-treatments-equipment";
          // }
          
          // [P0-OPT] 랜딩 페이지 청크 분리 제거
          // 이유: 홈페이지에서 사용하지 않는 682KB 청크 preload 방지
          // if (id.includes("pages/Landing")) {
          //   return "page-landings";
          // }
          // 나머지 node_modules는 Rollup 기본 청킹에 맡김
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

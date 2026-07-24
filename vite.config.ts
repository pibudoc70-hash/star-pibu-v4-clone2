import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import { visualizer } from "rollup-plugin-visualizer";

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

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime(),
  vitePluginManusDebugCollector(),
  // 번들 청크 그래프 시각화: pnpm build 실행 시 dist/stats.html 생성
  // 열어보면 어떤 라이브러리가 어떤 청크에 얼마나 들어갔는지 확인 가능
  visualizer({
    filename: "dist/stats.html",
    gzipSize: true,
    brotliSize: true,
    template: "treemap",
    open: false, // CI 환경에서 자동으로 브라우저 열리는 것 방지
  }) as Plugin,
];

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
    chunkSizeWarningLimit: 800, // 기본 500KB → 800KB (초대형 청크만 경고)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ── 1. React 코어 (거의 모든 페이지가 사용) ──
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "vendor-react";
          }

          // ── 2. tRPC + React Query (데이터 페칭 계층) ──
          if (
            id.includes("@trpc/") ||
            id.includes("@tanstack/react-query") ||
            id.includes("superjson")
          ) {
            return "vendor-trpc";
          }

          // ── 3. Radix UI 프리미티브 (shadcn/ui 기반) ──
          if (id.includes("@radix-ui/")) {
            return "vendor-radix";
          }

          // ── 4. Framer Motion (애니메이션, ~40KB gzip) ──
          if (id.includes("framer-motion")) {
            return "vendor-motion";
          }

          // ── 5. Recharts (관리자 통계 차트, 홈에서는 불필요) ──
          if (id.includes("recharts") || id.includes("d3-")) {
            return "vendor-charts";
          }

          // ── 6. Date/Form 유틸 ──
          if (
            id.includes("date-fns") ||
            id.includes("react-day-picker") ||
            id.includes("react-hook-form") ||
            id.includes("@hookform/") ||
            id.includes("zod")
          ) {
            return "vendor-forms";
          }

          // ── 7. Lucide 아이콘 ──
          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }

          // ── 8. XLSX + streamdown + katex (관리자/AI 전용, 홈에서 절대 불필요) ──
          if (
            id.includes("xlsx") ||
            id.includes("streamdown") ||
            id.includes("katex")
          ) {
            return "vendor-heavy";
          }

          // ── 9. 관리자 페이지 코드 (홈 초기 청크에서 완전 분리) ──
          if (id.includes("/pages/Admin") || id.includes("/pages/admin/")) {
            return "page-admin";
          }

          // ── 10. 언어별 랜딩 페이지 (홈에서는 불필요) ──
          if (
            id.includes("/pages/LandingEN") ||
            id.includes("/pages/LandingJA") ||
            id.includes("/pages/LandingZH")
          ) {
            return "page-landings";
          }

          // ── 11. 시술·장비 상세 데이터 (대용량 상수, 상세 페이지에서만) ──
          if (id.includes("/data/treatments") || id.includes("/data/equipment")) {
            return "data-treatments";
          }

          // ── 12. 나머지 node_modules 는 Rollup 자동 분할에 맡김 ──
          //     (return 없으면 Rollup 이 청크 그래프 기반으로 알아서 분리)
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

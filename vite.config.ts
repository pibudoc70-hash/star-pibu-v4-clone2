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

/**
 * KaTeX CSS externalize 플러그인
 *
 * streamdown은 수식이 있을 때 `import('katex/dist/katex.min.css')`를 동적으로 호출한다.
 * Vite가 이 CSS를 번들에 포함시키면 KaTeX 폰트 파일 59개(~1MB)가 dist/public/assets/에
 * 복사된다. 이 플러그인은 해당 import를 빈 모듈로 대체하여 폰트 파일을 배포 패키지에서
 * 제외한다. KaTeX CSS는 client/index.html에서 jsDelivr CDN으로 직접 로드한다.
 *
 * 참고: streamdown 내부에는 이미 `/cdn/katex/${version}/katex.min.css` 경로로
 * CDN 링크를 동적 삽입하는 로직(In 함수)이 있으나, ESM 빌드에서는 실행되지 않아
 * Vite의 CSS 번들링이 먼저 동작한다. 따라서 이 플러그인으로 번들링을 차단한다.
 */
function externalizeKatexCssPlugin(): Plugin {
  return {
    name: "externalize-katex-css",
    // enforce: "pre"로 Vite CSS 플러그인보다 먼저 실행
    enforce: "pre",
    apply: "build",
    resolveId(id) {
      // katex CSS import를 빈 모듈로 리다이렉트 (폰트 파일 번들 제외)
      // enforce: "pre"로 Vite의 CSS 플러그인보다 먼저 실행되어 dynamic import도 가로체진다
      if (id.includes("katex") && id.endsWith(".css")) {
        return "\0katex-css-noop";
      }
    },
    load(id) {
      if (id === "\0katex-css-noop") {
        // 빈 CSS 모듈 반환 — KaTeX CSS는 index.html의 CDN 링크로 로드됨
        return "/* KaTeX CSS is loaded via CDN in index.html */";
      }
    },
  };
}

/**
 * 홈에 불필요한 청크의 <link rel="modulepreload"> 를 index.html 에서 제거한다.
 *
 * Vite 는 manualChunks 로 지정된 모든 청크를 index.html 에 자동으로 preload
 * 링크로 추가한다. 하지만 관리자 페이지, 언어별 랜딩, 대용량 vendor 청크는
 * 홈에서 즉시 로드할 필요가 없다. 이 링크들만 제거하면 브라우저는 실제 필요
 * 시점(라우트 이동 시)에 lazy 로드한다.
 *
 * dynamic import 로 참조되는 청크는 자동으로 lazy 로드되므로 preload 링크만
 * 제거해도 동작에는 문제없다.
 */
function stripUnusedModulePreloadPlugin(chunksToStrip: string[]): Plugin {
  return {
    name: "strip-unused-modulepreload",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        /<link[^>]+rel=["']modulepreload["'][^>]*>/g,
        (match) => {
          const shouldStrip = chunksToStrip.some((chunk) => match.includes(chunk));
          return shouldStrip ? "" : match;
        },
      );
    },
  };
}

function developmentOnly(plugin: Plugin): Plugin {
  return { ...plugin, apply: "serve" };
}

function auditedPretendardSegmentsPlugin(): Plugin {
  const manifestPath = path.join(PROJECT_ROOT, "reports", "pretendard-db-segment-manifest.json");
  const primaryUrl = "/manus-storage/PretendardVariable-korean-primary_693508b2.woff2";
  const secondaryUrl = "/manus-storage/PretendardVariable-korean-secondary_441758ac.woff2";

  return {
    name: "audited-pretendard-segments",
    transformIndexHtml(html) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
        primary: { unicodeRange: string[] };
        secondary: { unicodeRange: string[] };
      };
      const face = (url: string, unicodeRange: string[]) => [
        "@font-face{font-family:'Pretendard Web';font-weight:45 920;font-style:normal;font-display:swap;",
        `src:url('${url}') format('woff2-variations');unicode-range:${unicodeRange.join(",")}}`,
      ].join("");
      const css = `${face(primaryUrl, manifest.primary.unicodeRange)}${face(secondaryUrl, manifest.secondary.unicodeRange)}`;
      return html.replace("</head>", `<style data-pretendard-db-segments>${css}</style></head>`);
    },
  };
}

const plugins = [
  react(),
  tailwindcss(),
  // visual editor source location, browser log collector, and Manus preview
  // runtime are development-only and must not be in visitor-facing assets.
  developmentOnly(jsxLocPlugin()),
  developmentOnly(vitePluginManusRuntime()),
  developmentOnly(vitePluginManusDebugCollector()),
  // KaTeX CSS를 CDN으로 전환: 폰트 파일 59개(~1MB) 배포 패키지 제외
  // KaTeX CSS는 client/index.html에서 jsDelivr CDN으로 직접 로드됨
  externalizeKatexCssPlugin(),
  auditedPretendardSegmentsPlugin(),
  // 홈에 불필요한 청크의 modulepreload 링크를 index.html에서 제거
  // 이 청크들은 실제 라우트 이동 시 lazy 로드됨
  stripUnusedModulePreloadPlugin([
    "vendor-heavy",    // xlsx, katex (관리자·특수 페이지)
    "vendor-charts",   // recharts (관리자 통계 페이지)
  ]),
];

export default defineConfig(({ command }) => ({
  // 운영에서만 /assets 투명 프록시를 우회해 앱 서버의 사전 압축 협상을 사용한다.
  // 개발 서버와 HMR은 기존 루트 경로를 유지한다.
  base: command === "build" ? "/__static/" : "/",
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
      // 대형 의료 콘텐츠 번들에서 동시 파일 작업이 과도하게 늘어나는 것을 방지한다.
      // 산출물과 런타임 청크 구성은 유지하고 build-time 메모리 피크만 낮춘다.
      maxParallelFileOps: 1,
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

          // ── 8. XLSX (관리자/AI 전용, 홈에서 절대 불필요) ──
          // streamdown은 lazy import로 전환되어 Rollup 자동 분할에 맡김.
          // streamdown을 vendor-heavy에 강제 묶으면 300+ 언어 하이라이터 청크가
          // 모두 vendor-heavy에 딸려와 1.2MB 단일 청크가 생성됨.
          // 자동 분할 시 각 언어 청크는 실제 사용 시에만 lazy load됨.
          if (
            id.includes("xlsx") ||
            id.includes("katex")
          ) {
            return "vendor-heavy";
          }

          // ── 9. 나머지 node_modules 는 Rollup 자동 분할에 맡김 ──
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
}));

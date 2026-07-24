/**
 * Lighthouse 자동 실측 스크립트 — Step 11 (Chromium 폴백 추가)
 *
 * 사용법:
 *   pnpm build && pnpm start &
 *   node scripts/lighthouse-audit.mjs
 *
 * Chromium 우선순위:
 *   1. chrome-launcher 로 시스템 Chrome/Chromium 사용
 *   2. Playwright 가 이미 설치한 chromium 경로 폴백
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import fs from "node:fs/promises";

const BASE_URL = process.env.LH_AUDIT_URL || "http://localhost:3000";
const OUT_JSON = "lighthouse-report.json";
const OUT_HTML = "lighthouse-report.html";

async function launchChrome() {
  // 1차 시도: chrome-launcher 로 시스템 Chrome/Chromium 사용
  try {
    return await chromeLauncher.launch({
      chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
    });
  } catch (err) {
    console.warn("[lighthouse] chrome-launcher 실패, playwright chromium 폴백 시도");
  }

  // 2차 시도: Playwright 가 이미 설치한 chromium 경로 사용
  try {
    const { chromium } = await import("playwright");
    const executablePath = chromium.executablePath();
    console.log(`[lighthouse] Playwright chromium 경로: ${executablePath}`);
    return await chromeLauncher.launch({
      chromePath: executablePath,
      chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
    });
  } catch (err) {
    console.error("[lighthouse] playwright chromium 폴백도 실패:", err.message);
    throw err;
  }
}

async function main() {
  console.log(`[lighthouse] 실측 대상: ${BASE_URL}`);
  const chrome = await launchChrome();

  const options = {
    logLevel: "error",
    output: ["json", "html"],
    onlyCategories: ["performance"],
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4, // Slow 4G
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    port: chrome.port,
  };

  const runnerResult = await lighthouse(BASE_URL, options);
  await fs.writeFile(OUT_JSON, runnerResult.report[0]);
  await fs.writeFile(OUT_HTML, runnerResult.report[1]);

  const lhr = runnerResult.lhr;
  const perf = Math.round(lhr.categories.performance.score * 100);
  const lcp = lhr.audits["largest-contentful-paint"].numericValue;
  const cls = lhr.audits["cumulative-layout-shift"].numericValue;
  const tbt = lhr.audits["total-blocking-time"].numericValue;
  const fcp = lhr.audits["first-contentful-paint"].numericValue;
  const si = lhr.audits["speed-index"].numericValue;

  console.log("\n════════ Lighthouse 모바일 실측 ════════");
  console.log(`Performance 점수 : ${perf}`);
  console.log(`LCP              : ${(lcp / 1000).toFixed(2)}s`);
  console.log(`FCP              : ${(fcp / 1000).toFixed(2)}s`);
  console.log(`CLS              : ${cls.toFixed(3)}`);
  console.log(`TBT              : ${Math.round(tbt)}ms`);
  console.log(`Speed Index      : ${(si / 1000).toFixed(2)}s`);
  console.log(`\n리포트: ${OUT_HTML}`);
  console.log("════════════════════════════════════════\n");

  await chrome.kill();
  // exit code: Performance 80 미만이면 1
  process.exit(perf >= 80 ? 0 : 1);
}

main().catch((err) => {
  console.error("[lighthouse] 환경 오류:", err.message);
  console.error("힌트: GitHub Actions 환경 또는 로컬에 Chromium 설치 후 재시도");
  process.exit(2); // 2 = 환경 문제 (1 = 성능 실패)
});

/**
 * Lighthouse 자동 실측 스크립트.
 *
 * 사용법:
 *   pnpm build && pnpm start &
 *   node scripts/lighthouse-audit.mjs
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import fs from "node:fs/promises";

const BASE_URL = process.env.LH_AUDIT_URL || "http://localhost:3000";
const OUT_JSON = "lighthouse-report.json";
const OUT_HTML = "lighthouse-report.html";

async function main() {
  console.log(`[lighthouse] 실측 대상: ${BASE_URL}`);
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
  });

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
  console.error("[lighthouse] 오류:", err);
  process.exit(1);
});

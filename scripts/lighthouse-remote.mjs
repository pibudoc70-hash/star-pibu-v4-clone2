/**
 * PageSpeed Insights 원격 측정 스크립트.
 *
 * 사용법:
 *   node scripts/lighthouse-remote.mjs https://star-pibu.com
 *   node scripts/lighthouse-remote.mjs https://star-pibu.com/en
 *
 * 환경변수:
 *   PSI_API_KEY  (선택) — 없어도 무료 티어로 동작. 있으면 rate limit 여유.
 *   PSI_STRATEGY (선택) — "mobile" (기본) 또는 "desktop"
 */
import fs from "node:fs/promises";

const url = process.argv[2] || process.env.PSI_TARGET_URL;
if (!url) {
  console.error("[lighthouse-remote] URL 인자가 필요합니다.");
  console.error("  예: node scripts/lighthouse-remote.mjs https://star-pibu.com");
  process.exit(2);
}

const strategy = process.env.PSI_STRATEGY || "mobile";
const apiKey = process.env.PSI_API_KEY;

const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
apiUrl.searchParams.set("url", url);
apiUrl.searchParams.set("strategy", strategy);
apiUrl.searchParams.append("category", "PERFORMANCE");
apiUrl.searchParams.append("category", "ACCESSIBILITY");
apiUrl.searchParams.append("category", "BEST_PRACTICES");
apiUrl.searchParams.append("category", "SEO");
if (apiKey) apiUrl.searchParams.set("key", apiKey);

console.log(`[lighthouse-remote] 대상: ${url} (${strategy})`);
console.log("[lighthouse-remote] PSI API 호출 중... (30-60초 소요)");

const resp = await fetch(apiUrl);
if (!resp.ok) {
  console.error(`[lighthouse-remote] PSI API 실패: ${resp.status}`);
  console.error(await resp.text());
  process.exit(2);
}

const data = await resp.json();
const lh = data.lighthouseResult;
if (!lh) {
  console.error("[lighthouse-remote] Lighthouse 결과 없음");
  process.exit(2);
}

const scores = {
  performance: Math.round((lh.categories.performance?.score ?? 0) * 100),
  accessibility: Math.round((lh.categories.accessibility?.score ?? 0) * 100),
  bestPractices: Math.round((lh.categories["best-practices"]?.score ?? 0) * 100),
  seo: Math.round((lh.categories.seo?.score ?? 0) * 100),
};

const metrics = {
  lcp: lh.audits["largest-contentful-paint"]?.numericValue,
  fcp: lh.audits["first-contentful-paint"]?.numericValue,
  cls: lh.audits["cumulative-layout-shift"]?.numericValue,
  tbt: lh.audits["total-blocking-time"]?.numericValue,
  si: lh.audits["speed-index"]?.numericValue,
  tti: lh.audits["interactive"]?.numericValue,
};

const opportunities = lh.audits
  ? Object.values(lh.audits)
      .filter((a) => a.details?.type === "opportunity" && a.numericValue > 0)
      .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        title: a.title,
        savingsMs: Math.round(a.numericValue),
      }))
  : [];

const fieldData = data.loadingExperience?.metrics
  ? {
      lcp: data.loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
      fid: data.loadingExperience.metrics.FIRST_INPUT_DELAY_MS?.percentile,
      cls: data.loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile,
      inp: data.loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT?.percentile,
    }
  : null;

const report = {
  url,
  strategy,
  timestamp: new Date().toISOString(),
  scores,
  metrics,
  fieldData,
  opportunities,
};

const outPath = `psi-report-${strategy}-${Date.now()}.json`;
await fs.writeFile(outPath, JSON.stringify(report, null, 2));

console.log("\n════════ PageSpeed Insights 실측 ════════");
console.log(`URL          : ${url}`);
console.log(`Strategy     : ${strategy}`);
console.log(`Performance  : ${scores.performance}`);
console.log(`A11y         : ${scores.accessibility}`);
console.log(`Best Practice: ${scores.bestPractices}`);
console.log(`SEO          : ${scores.seo}`);
console.log("──────── Lab Metrics ────────");
if (metrics.lcp) console.log(`LCP          : ${(metrics.lcp / 1000).toFixed(2)}s`);
if (metrics.fcp) console.log(`FCP          : ${(metrics.fcp / 1000).toFixed(2)}s`);
if (metrics.cls != null) console.log(`CLS          : ${metrics.cls.toFixed(3)}`);
if (metrics.tbt) console.log(`TBT          : ${Math.round(metrics.tbt)}ms`);
if (metrics.si) console.log(`Speed Index  : ${(metrics.si / 1000).toFixed(2)}s`);
if (fieldData) {
  console.log("──────── Field Data (실사용자) ────────");
  if (fieldData.lcp) console.log(`LCP p75      : ${fieldData.lcp}ms`);
  if (fieldData.inp) console.log(`INP p75      : ${fieldData.inp}ms`);
  if (fieldData.cls != null) console.log(`CLS p75      : ${(fieldData.cls / 100).toFixed(3)}`);
}
if (opportunities.length > 0) {
  console.log("──────── 개선 기회 Top 5 ────────");
  opportunities.forEach((o, i) => {
    console.log(`${i + 1}. ${o.title} (예상 절감 ${o.savingsMs}ms)`);
  });
}
console.log(`\n리포트 저장: ${outPath}`);
console.log("═════════════════════════════════════════\n");

process.exit(scores.performance >= 80 ? 0 : 1);

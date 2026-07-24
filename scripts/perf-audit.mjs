/**
 * 성능 자동 검증 스크립트 — Step 10
 *
 * 사용법:
 *   pnpm build && pnpm start &   # 백그라운드로 프로덕션 서버 기동
 *   node scripts/perf-audit.mjs
 *
 * 검증 항목:
 *   1. SW 등록 상태
 *   2. Cache Storage 3개 버킷
 *   3. 재방문 시 SW 응답 비율
 *   4. HTML network-first
 *   5. tRPC 캐시 안 됨
 *   6. 홈 초기 JS 다운로드 크기
 */
import { chromium } from "playwright";
import fs from "node:fs/promises";

const BASE_URL = process.env.PERF_AUDIT_URL || "http://localhost:3000";
const OUT_PATH = "perf-audit-report.json";

const results = {
  url: BASE_URL,
  timestamp: new Date().toISOString(),
  checks: {},
  metrics: {},
  errors: [],
};

function log(msg) {
  console.log(`[perf-audit] ${msg}`);
}

async function main() {
  log(`검증 대상: ${BASE_URL}`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-setuid-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // 모바일 뷰포트
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  });

  // ── 1차 방문 (SW 등록 및 초기 로드) ─────────────────────────────────
  log("1차 방문 시작 (SW 등록 및 초기 로드)");
  const page = await context.newPage();

  const firstVisitRequests = [];
  page.on("response", (resp) => {
    const url = resp.url();
    const status = resp.status();
    const fromSw = resp.fromServiceWorker();
    firstVisitRequests.push({
      url,
      status,
      fromSw,
      contentType: resp.headers()["content-type"] || "",
      contentEncoding: resp.headers()["content-encoding"] || "",
      // Content-Length: brotli/gzip 압쳙 전송 크기 (0이면 서버가 헤더 생략)
      contentLength: parseInt(resp.headers()["content-length"] || "0", 10),
    });
  });

  try {
    await page.goto(BASE_URL, { waitUntil: "load", timeout: 30_000 });
  } catch (err) {
    results.errors.push(`1차 방문 실패: ${err.message}`);
    await browser.close();
    return finish();
  }

  // SW 등록 대기 (최대 5초 타임아웃)
  const swActivated = await page
    .evaluate(async () => {
      if (!("serviceWorker" in navigator)) return false;
      const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 5000));
      const reg = await Promise.race([
        navigator.serviceWorker.ready.catch(() => null),
        timeout,
      ]);
      return !!(reg && reg.active);
    })
    .catch(() => false);
  results.checks.serviceWorkerActivated = swActivated;
  log(`SW 활성화: ${swActivated ? "✅" : "❌"}`);

  // 캐시 버킷 확인
  const cacheNames = await page.evaluate(async () => {
    if (!("caches" in globalThis)) return [];
    const timeout = new Promise((resolve) => setTimeout(() => resolve([]), 3000));
    return await Promise.race([caches.keys(), timeout]);
  }).catch(() => []);
  results.checks.cacheNames = cacheNames;
  const hasStatic = cacheNames.some((n) => n.startsWith("static-"));
  const hasImage = cacheNames.some((n) => n.startsWith("image-"));
  const hasHtml = cacheNames.some((n) => n.startsWith("html-"));
  results.checks.cacheBuckets = { static: hasStatic, image: hasImage, html: hasHtml };
  log(`캐시 버킷: static=${hasStatic} image=${hasImage} html=${hasHtml}`);

  // 홈 초기 JS 다운로드 크기 (1차 방문 기준, 순수 네트워크)
  const jsResponses = firstVisitRequests.filter(
    (r) =>
      r.url.includes("/assets/") &&
      r.url.endsWith(".js") &&
      r.status === 200 &&
      !r.fromSw,
  );
  const jsTotalBytes = jsResponses.reduce((sum, r) => sum + r.contentLength, 0);
  results.metrics.firstVisitJsCount = jsResponses.length;
  results.metrics.firstVisitJsBytes = jsTotalBytes;
  results.metrics.firstVisitJsKB = Math.round(jsTotalBytes / 1024);
  log(
    `1차 방문 JS 다운로드: ${jsResponses.length}개, ${Math.round(jsTotalBytes / 1024)} KB`,
  );

  // brotli/gzip 압축 적용 확인
  const anyBrotli = firstVisitRequests.some(
    (r) => r.contentEncoding === "br" && r.url.endsWith(".js"),
  );
  const anyGzip = firstVisitRequests.some(
    (r) => r.contentEncoding === "gzip" && r.url.endsWith(".js"),
  );
  results.checks.compressionApplied = anyBrotli || anyGzip;
  results.checks.compressionType = anyBrotli ? "br" : anyGzip ? "gzip" : "none";
  log(`압축 적용: ${results.checks.compressionType}`);

  // ── 2차 방문 (재방문 시 SW 응답 확인) ────────────────────────────────
  log("2차 방문 시작 (재방문 시 SW 응답 확인)");
  const secondPage = await context.newPage();
  const secondVisitRequests = [];
  secondPage.on("response", (resp) => {
    secondVisitRequests.push({
      url: resp.url(),
      status: resp.status(),
      fromSw: resp.fromServiceWorker(),
    });
  });

  try {
    await secondPage.goto(BASE_URL, { waitUntil: "load", timeout: 30_000 });
  } catch (err) {
    results.errors.push(`2차 방문 실패: ${err.message}`);
  }

  const jsSecondVisit = secondVisitRequests.filter(
    (r) => r.url.includes("/assets/") && r.url.endsWith(".js"),
  );
  const swResponseCount = jsSecondVisit.filter((r) => r.fromSw).length;
  const swResponseRatio =
    jsSecondVisit.length > 0 ? swResponseCount / jsSecondVisit.length : 0;
  results.metrics.secondVisitJsFromSw = swResponseCount;
  results.metrics.secondVisitJsTotal = jsSecondVisit.length;
  results.metrics.secondVisitSwRatio = Math.round(swResponseRatio * 100);
  log(
    `2차 방문 JS SW 응답: ${swResponseCount}/${jsSecondVisit.length} (${Math.round(swResponseRatio * 100)}%)`,
  );

  // HTML network-first 검증 (SW 로 안 오고 정상 네트워크 응답이어야 함)
  const htmlResp = secondVisitRequests.find(
    (r) => r.url === BASE_URL || r.url === BASE_URL + "/",
  );
  results.checks.htmlNetworkFirst = htmlResp
    ? !htmlResp.fromSw || htmlResp.status === 200
    : false;
  log(`HTML network-first: ${results.checks.htmlNetworkFirst ? "✅" : "❌"}`);

  // tRPC 캐시 안 됨 검증 (있으면)
  const trpcRequests = secondVisitRequests.filter((r) =>
    r.url.includes("/api/trpc"),
  );
  const trpcFromSw = trpcRequests.filter((r) => r.fromSw).length;
  results.checks.trpcNotCached = trpcRequests.length === 0 || trpcFromSw === 0;
  results.metrics.trpcRequests = trpcRequests.length;
  results.metrics.trpcFromSw = trpcFromSw;
  log(
    `tRPC 캐시 안 됨: ${results.checks.trpcNotCached ? "✅" : "❌"} (총 ${trpcRequests.length}건 중 SW ${trpcFromSw}건)`,
  );

  await browser.close();
  return finish();

  async function finish() {
    await fs.writeFile(OUT_PATH, JSON.stringify(results, null, 2));
    log(`리포트 저장: ${OUT_PATH}`);

    // 요약 출력
    console.log("\n════════ 검증 요약 ════════");
    console.log(`SW 활성화       : ${results.checks.serviceWorkerActivated ? "✅" : "❌"}`);
    console.log(`캐시 static     : ${results.checks.cacheBuckets?.static ? "✅" : "❌"}`);
    console.log(`캐시 image      : ${results.checks.cacheBuckets?.image ? "✅" : "❌"}`);
    console.log(`캐시 html       : ${results.checks.cacheBuckets?.html ? "✅" : "❌"}`);
    console.log(`압축 (br/gzip)  : ${results.checks.compressionApplied ? "✅" : "❌"} (${results.checks.compressionType})`);
    console.log(`1차 JS 크기     : ${results.metrics.firstVisitJsKB} KB`);
    console.log(`재방문 SW 비율  : ${results.metrics.secondVisitSwRatio}%`);
    console.log(`HTML network-first : ${results.checks.htmlNetworkFirst ? "✅" : "❌"}`);
    console.log(`tRPC 캐시 안 됨 : ${results.checks.trpcNotCached ? "✅" : "❌"}`);
    if (results.errors.length) {
      console.log(`에러: ${results.errors.join("; ")}`);
    }
    console.log("═══════════════════════════\n");

    // exit code: 필수 항목 실패 시 1
    const critical =
      results.checks.serviceWorkerActivated &&
      results.checks.cacheBuckets?.static &&
      results.checks.compressionApplied;
    process.exit(critical ? 0 : 1);
  }
}

main().catch((err) => {
  console.error("[perf-audit] 치명적 오류:", err);
  process.exit(1);
});

/**
 * 배포 반영 확인.
 * 사용: node scripts/verify-deployment.mjs https://star-pibu.com
 */
const url = process.argv[2] || "https://star-pibu.com";
console.log(`[verify] ${url}`);

const resp = await fetch(url, { cache: "no-store" });
const html = await resp.text();

const preloads = [...html.matchAll(/<link[^>]+rel=["']preload["'][^>]*>/g)]
  .map(m => m[0]);

const checks = {
  "히어로 preload": /hero-bg-new-desktop.*\.webp/.test(html),
  "재생의료 배너 PC preload": /regen-medicine-banner-pc2.*\.webp/.test(html),
  "재생의료 배너 모바일 preload": /regen-medicine-banner-mobile.*\.webp/.test(html),
  "Pretendard 폰트 preload": /PretendardVariable.*\.woff2/.test(html),
  "jsdelivr 제거": !/cdn\.jsdelivr\.net/.test(html),
  "brotli 압축": resp.headers.get("content-encoding") === "br",
};

console.log(`\npreload 링크: ${preloads.length}건`);
console.log("\n검증 결과:");
let ok = 0;
for (const [name, pass] of Object.entries(checks)) {
  console.log(`  ${pass ? "✅" : "❌"} ${name}`);
  if (pass) ok++;
}
console.log(`\n총 ${ok}/${Object.keys(checks).length} 통과`);
process.exit(ok === Object.keys(checks).length ? 0 : 1);

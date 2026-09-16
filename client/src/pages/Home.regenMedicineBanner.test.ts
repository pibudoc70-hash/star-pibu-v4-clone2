import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const resultsSource = readFileSync(resolve(process.cwd(), "client/src/components/ResultsStatisticsSection.tsx"), "utf8");

describe("approved regenerative medicine banner", () => {
  it("renders the supplied managed banner only through the RESULTS & STATISTICS card section", () => {
    expect(homeSource).toContain("<ResultsStatisticsSection showRegenerativeMedicineBanner />");
    expect(homeSource).not.toContain('regen-medicine-banner-pc2_430fd36f_89f4a3e5.webp');
    expect(resultsSource).toContain('/manus-storage/regen-medicine-banner-pc2_430fd36f_89f4a3e5.webp');
    expect(resultsSource).not.toContain('regen-medicine-banner-mobile_1fe7ea14');
    expect(resultsSource).not.toContain('/manus-storage/regen-medicine-banner-pc2_430fd36f.webp');
  });

  it("keeps the banner directly after the three-card grid at the same container width", () => {
    const gridPosition = resultsSource.indexOf('grid grid-cols-1 md:grid-cols-3 gap-6');
    const bannerPosition = resultsSource.indexOf('data-testid="regenerative-medicine-banner"');

    expect(gridPosition).toBeGreaterThan(-1);
    expect(bannerPosition).toBeGreaterThan(gridPosition);
    expect(resultsSource).toContain('className="w-full"');
    expect(resultsSource).toContain('className="block w-full max-w-[92%]');
    expect(resultsSource).toContain('https://star-pibu.com/notice/90001');
    expect(resultsSource).toContain('보건복지부 지정 첨단재생의료 실시기관');
    expect(resultsSource).not.toContain('체담재생의료');
  });
});

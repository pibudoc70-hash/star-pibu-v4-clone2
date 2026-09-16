import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const resultsSource = readFileSync(resolve(process.cwd(), "client/src/components/ResultsStatisticsSection.tsx"), "utf8");

describe("홈 초기 이미지 preload 우선순위", () => {
  it("LCP hero만 high-priority preload하고 below-fold 배너는 preload하지 않는다", () => {
    expect(indexHtml).toContain('href="/manus-storage/hero-background-0000_d3dee03d.webp"');
    expect(indexHtml).toContain('type="image/webp"');
    expect(indexHtml).toContain('fetchpriority="high"');
    expect(indexHtml).not.toContain('href="/api/storage/regen-medicine-banner-pc2_e6271aa5_5f2ea459.webp"');
    expect(indexHtml).not.toContain('href="/api/storage/regen-medicine-banner-mobile_1fe7ea14_b3d1a716.webp"');
  });

  it("below-fold RESULTS 재생의료 배너는 lazy·low priority로 가져온다", () => {
    expect(resultsSource).toContain('regen-medicine-banner-pc2_430fd36f_89f4a3e5.webp');
    expect(resultsSource).toContain('loading="lazy"');
    expect(resultsSource).toContain('fetchPriority="low"');
    expect(resultsSource).not.toContain('loading="eager"');
    expect(resultsSource).not.toContain('fetchPriority="high"');
  });
});

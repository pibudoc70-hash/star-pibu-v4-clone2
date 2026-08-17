import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

describe("홈 초기 이미지 preload 우선순위", () => {
  it("LCP hero만 high-priority preload하고 below-fold 배너는 preload하지 않는다", () => {
    expect(indexHtml).toContain('href="/api/storage/hero-bg-new-desktop_2f8a8ccf_482fcfca.webp"');
    expect(indexHtml).toContain('fetchpriority="high"');
    expect(indexHtml).not.toContain('href="/api/storage/regen-medicine-banner-pc2_e6271aa5_5f2ea459.webp"');
    expect(indexHtml).not.toContain('href="/api/storage/regen-medicine-banner-mobile_1fe7ea14_b3d1a716.webp"');
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("approved regenerative medicine banner", () => {
  it("uses the supplied managed banner for both responsive picture rendering and image fallback", () => {
    const bannerSource = homeSource.slice(
      homeSource.indexOf("첨단재생의료 실시기관 배너"),
      homeSource.indexOf("{/* 2. SPECIAL EVENT", homeSource.indexOf("첨단재생의료 실시기관 배너")),
    );

    expect(bannerSource).toContain('/manus-storage/regen-medicine-banner-pc2_430fd36f_89f4a3e5.webp');
    expect(bannerSource).not.toContain('regen-medicine-banner-mobile_1fe7ea14');
    expect(bannerSource).not.toContain('/manus-storage/regen-medicine-banner-pc2_430fd36f.webp');
  });

  it("uses the correct 첨단재생의료 wording while preserving the notice link", () => {
    const bannerSource = homeSource.slice(
      homeSource.indexOf("첨단재생의료 실시기관 배너"),
      homeSource.indexOf("{/* 2. SPECIAL EVENT", homeSource.indexOf("첨단재생의료 실시기관 배너")),
    );

    expect(bannerSource).toContain('https://star-pibu.com/notice/90001');
    expect(bannerSource).toContain('보건복지부 지정 첨단재생의료 실시기관');
    expect(bannerSource).not.toContain('체담재생의료');
  });
});

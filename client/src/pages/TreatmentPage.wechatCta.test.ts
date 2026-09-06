import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/TreatmentPage.tsx"), "utf8");

describe("TreatmentPage Chinese WeChat CTA", () => {
  it("uses the approved Simplified and Traditional Chinese labels", () => {
    expect(source).toContain('ctaKakao: "微信咨询"');
    expect(source).toContain('ctaKakao: "微信諮詢"');
    expect(source).not.toContain("微信和误");
    expect(source).not.toContain("微信談詢");
  });

  it("keeps both Chinese locales on the existing in-page WeChat route", () => {
    expect(source).toContain('currentLang === "zh" || currentLang === "zh-TW" ? "#wechat"');
    expect(source).toContain('target={currentLang === "zh" || currentLang === "zh-TW" ? undefined : "_blank"}');
    expect(source).toContain('rel={currentLang === "zh" || currentLang === "zh-TW" ? undefined : "noopener noreferrer"}');
    expect(source).toContain('currentLang === "ja" ? "https://lin.ee/tyuRdUc"');
    expect(source).toContain('"https://pf.kakao.com/_HNyGC"');
  });
});

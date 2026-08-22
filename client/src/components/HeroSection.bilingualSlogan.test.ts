import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/HeroSection.tsx"),
  "utf8",
);
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("PC Hero bilingual slogan motion", () => {
  it("uses a desktop-only CSS cross-fade for Korean and English while preserving non-Korean locale copy", () => {
    expect(source).toContain('className="hero-desktop-slogan-toggle"');
    expect(source).toContain('className="hero-desktop-slogan-line hero-desktop-slogan-en"');
    expect(source).toContain('className="hero-desktop-slogan-line hero-desktop-slogan-ko"');
    expect(source).toContain('text={t.hero.subtitle}');
    expect(source).not.toContain("const desktopSlogan");
    expect(css).toContain("@keyframes heroDesktopSloganEn");
    expect(css).toContain("@keyframes heroDesktopSloganKo");
  });

  it("keeps the mobile slogan branch separate from the desktop transition", () => {
    const mobileSection = source.slice(source.indexOf("{/* ── 모바일 레이아웃"));
    expect(mobileSection).toMatch(/showKo\s*\?\s*<>신뢰와 과학이<br\s*\/>경험으로 완성되는 곳<\/>/);
    expect(mobileSection).toMatch(/:\s*<>Where Experience,<br\s*\/>Trust, and Science Meet<\/>}/);
  });
});

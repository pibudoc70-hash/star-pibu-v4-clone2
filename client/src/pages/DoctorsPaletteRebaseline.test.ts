import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const css = read("client/src/index.css");
const doctors = read("client/src/pages/Doctors.tsx");
const equipment = read("client/src/pages/Equipment3.tsx");
const eventPage = read("client/src/pages/Event.tsx");
const about = read("client/src/pages/About.tsx");
const directions = read("client/src/pages/Directions.tsx");
const notice = read("client/src/pages/Notice.tsx");
const management = read("client/src/pages/ManagementDeviceFaq.tsx");
const foreignGuide = read("client/src/pages/ForeignGuide.tsx");
const foreignPriceList = read("client/src/pages/ForeignPriceList.tsx");
const research = read("client/src/pages/Research.tsx");

const desktopPalette = css.slice(
  css.indexOf("/* Desktop public-subpage palette"),
  css.indexOf("/* 통증관리 native disclosure")
);

describe("Doctors desktop palette rebaseline", () => {
  it("records the actual Doctors header, body, text, and accent color values", () => {
    expect(css).toContain(".dr-page-header--doctors {");
    expect(css).toContain("var(--brand-bg-card)");
    expect(css).toContain("var(--brand-bg-alt)");
    expect(css).toContain("--brand-bg: #FAF8F5");
    expect(css).toContain("--brand-text: #2C2C2C");
    expect(css).toContain("--color-gold-primary: #C4A882");
    expect(css).toContain("--color-gold-deep: #A8895E");
  });

  it("reapplies the exact Doctors header palette only at desktop widths", () => {
    expect(desktopPalette).toContain("@media (min-width: 768px)");
    expect(desktopPalette).toContain("#FDFAF7 0%, #F5F0EB 100%");
    expect(desktopPalette).toContain(".dr-page-header-eyebrow { color: #B89A5A; }");
    expect(desktopPalette).toContain(".dr-page-header-title { color: #1A1A1A; }");
    expect(desktopPalette).toContain(".dr-page-header-tagline { color: #6B5C3E; }");
  });

  it("uses Doctors body, card, text, and accent values for Equipment3 on desktop", () => {
    expect(desktopPalette).toContain("--equipment-list-page-bg: #FAF8F5");
    expect(desktopPalette).toContain("--equipment-list-surface: #FFFFFF");
    expect(desktopPalette).toContain("--equipment-list-panel: #F5F0EB");
    expect(desktopPalette).toContain("--equipment-list-text: #2C2C2C");
    expect(desktopPalette).toContain("--equipment-list-accent: #C4A882");
    expect(desktopPalette).toContain("--equipment-list-button: #A8895E");
    expect(equipment).toContain('className="equipment-list-page min-h-screen"');
  });

  it("keeps every requested public subpage on the shared title or body palette path", () => {
    for (const source of [eventPage, about, directions, notice, management, research, foreignPriceList]) {
      expect(source).toContain("dr-page-header");
    }
    expect(foreignGuide).toContain("foreign-guide-page");
    expect(foreignGuide).toContain("foreign-guide-header");
    expect(foreignGuide).toContain("--foreign-guide-header-bg");
    expect(foreignPriceList).toContain("foreign-price-list-page");
    expect(research).toContain("research-domestic-section");
  });

  it("preserves the existing mobile branches while moving no page structure", () => {
    expect(about).toContain('className="md:hidden py-16 md:py-24 bg-white"');
    expect(directions).toContain("directions-transport-section");
    expect(doctors).toContain("dr-mobile-tabbar");
  });
});

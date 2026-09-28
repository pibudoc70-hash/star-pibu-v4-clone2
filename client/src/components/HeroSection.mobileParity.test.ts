import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const css = read("client/src/index.css");
const hero = read("client/src/components/HeroSection.tsx");
const popup = read("client/src/components/UltheraThermagePromotionPopup.tsx");
const mobileParityBlock = css.split("Homepage mobile hero and promotion parity")[1] ?? "";

describe("homepage mobile hero and promotion parity", () => {
  it("limits parity changes to a mobile media query while keeping shared hero data intact", () => {
    expect(mobileParityBlock).toContain("@media (max-width: 767px)");
    expect(mobileParityBlock).not.toContain("@media (min-width");
    expect(hero).toContain("stats={statsData}");
    expect(hero).toContain("Where Experience,");
    expect(hero).toContain("Trust, and Science Meet");
  });

  it("uses the approved desktop overlay, centered image focal point, and transparent editorial stats", () => {
    expect(mobileParityBlock).toContain("object-position: center center !important;");
    expect(mobileParityBlock).toContain("rgba(58,45,33,0.76)");
    expect(mobileParityBlock).toContain("rgba(49,38,28,0.48)");
    expect(mobileParityBlock).toContain("background: transparent !important;");
    expect(mobileParityBlock).toContain("color: rgba(255,255,255,0.97) !important;");
  });

  it("matches the desktop promotion dim and removes only the mobile control-bar chrome", () => {
    expect(popup).toContain("md:bg-[rgba(28,22,17,0.74)]");
    expect(mobileParityBlock).toContain("background: rgba(28,22,17,0.74) !important;");
    expect(mobileParityBlock).toContain('[data-testid="promotion-hide-today-control"]');
    expect(mobileParityBlock).toContain("Keep 52px touch targets");
    expect(popup).toContain("min-h-[52px]");
    expect(popup).toContain("size-[52px]");
  });
});

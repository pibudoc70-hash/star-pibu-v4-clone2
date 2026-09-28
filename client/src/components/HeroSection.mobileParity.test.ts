import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const css = read("client/src/index.css");
const hero = read("client/src/components/HeroSection.tsx");
const popup = read("client/src/components/UltheraThermagePromotionPopup.tsx");
const mobileParityBlock = css.split("Homepage mobile hero and promotion parity")[1] ?? "";
const mobilePlacementBlock = css.split("Homepage mobile hero cluster placement")[1] ?? "";
const mobileBreathingRoomBlock = css.split("Homepage mobile hero breathing room")[1] ?? "";

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

  it("centers only the mobile hero content cluster and reserves room below its scroll control", () => {
    expect(mobilePlacementBlock).toContain("@media (max-width: 767px)");
    expect(mobilePlacementBlock).not.toContain("@media (min-width");
    expect(mobilePlacementBlock).toContain("height: 100svh !important;");
    expect(mobilePlacementBlock).toContain("justify-content: center !important;");
    expect(mobilePlacementBlock).toContain("gap: clamp(1.25rem, 3.5svh, 2rem) !important;");
    expect(mobilePlacementBlock).toContain("padding-bottom: 0 !important;");
    expect(mobilePlacementBlock).toContain("object-position: 62% center !important;");
    expect(mobilePlacementBlock).toContain("max-height: 650px");
  });

  it("keeps mobile copy unchanged while separating statistics and removing the local text box", () => {
    expect(mobileBreathingRoomBlock).toContain("@media (max-width: 767px)");
    expect(mobileBreathingRoomBlock).not.toContain("font-size:");
    expect(mobileBreathingRoomBlock).not.toContain("hero-mobile-top-group::before");
    expect(mobileBreathingRoomBlock).not.toContain("radial-gradient");
    expect(mobileBreathingRoomBlock).toContain("margin-bottom: clamp(1.75rem, 4svh, 2.25rem) !important;");
    expect(mobileBreathingRoomBlock).toContain("margin-bottom: clamp(1.25rem, 2.8svh, 1.5rem) !important;");
    expect(mobileBreathingRoomBlock).toContain("gap: clamp(4.5rem, 8svh, 5.5rem) !important;");
    expect(mobileBreathingRoomBlock).toContain("line-height: 1.75 !important;");
    expect(mobileBreathingRoomBlock).toContain("margin-top: clamp(0.5rem, 1.3svh, 0.75rem) !important;");
    expect(mobileBreathingRoomBlock).toContain("background: transparent !important;");
    expect(mobileBreathingRoomBlock).toContain("backdrop-filter: none !important;");
    expect(mobileBreathingRoomBlock).toContain("hero-stats-wrap");
    expect(mobileBreathingRoomBlock).toContain("hero-mobile-scroll-arrow");
    expect(mobileBreathingRoomBlock).toContain("margin-top: 0 !important;");
    expect(css).toContain("rgba(58,45,33,0.42)");
    expect(css).toContain("rgba(58,45,33,0.50)");
  });
});

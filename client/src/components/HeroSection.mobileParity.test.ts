import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const css = read("client/src/index.css");
const hero = read("client/src/components/HeroSection.tsx");
const popup = read("client/src/components/UltheraThermagePromotionPopup.tsx");
const extractBlock = (startMarker: string, endMarker: string) => {
  const start = css.indexOf(startMarker);
  return start === -1 ? "" : css.slice(start, css.indexOf(endMarker, start));
};
const mobileParityBlock = extractBlock("Homepage mobile hero and promotion parity", "Homepage mobile hero cluster placement");
const mobilePlacementBlock = extractBlock("Homepage mobile hero cluster placement", "Homepage mobile hero breathing room");
const mobileBreathingRoomBlock = extractBlock("Homepage mobile hero breathing room", "Homepage mobile section rhythm");

describe("homepage mobile hero and promotion parity", () => {
  it("limits parity changes to a mobile media query while keeping shared hero data intact", () => {
    expect(mobileParityBlock).toContain("@media (max-width: 767px)");
    expect(mobileParityBlock).not.toContain("@media (min-width");
    expect(hero).toContain("stats={statsData}");
    expect(hero).toContain("Where Experience,");
    expect(hero).toContain("Trust, and Science Meet");
  });

  it("uses the shared dark-navy overlay, centered image focal point, and transparent editorial stats", () => {
    expect(mobileParityBlock).toContain("object-position: center center !important;");
    expect(css).toContain("--hero-overlay-gradient:");
    expect(css).toContain("--hero-vignette-gradient:");
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
    expect(mobileBreathingRoomBlock).toContain("hero-mobile-slogan-wrap");
    expect(mobileBreathingRoomBlock).toContain("translateY(clamp(1.75rem, 4.5svh, 2.75rem)) !important;");
    expect(mobileBreathingRoomBlock).toContain("hero-mobile-bottom-group");
    expect(mobileBreathingRoomBlock).toContain("translateY(clamp(1.25rem, 3.2svh, 2rem)) !important;");
    expect(mobileBreathingRoomBlock).toContain("object-position: 66% 48% !important;");
    expect(mobileBreathingRoomBlock).toContain("margin-top: clamp(0.5rem, 1.3svh, 0.75rem) !important;");
    expect(mobileBreathingRoomBlock).toContain("background: transparent !important;");
    expect(mobileBreathingRoomBlock).toContain("backdrop-filter: none !important;");
    expect(mobileBreathingRoomBlock).toContain("hero-stats-wrap");
    expect(mobileBreathingRoomBlock).toContain("hero-mobile-scroll-arrow");
    expect(mobileBreathingRoomBlock).toContain("margin-top: 0 !important;");
    expect(mobileBreathingRoomBlock).toContain("translateY(0.75rem) !important;");
    expect(css).toContain("--hero-background-blur: 3.5px;");
    expect(css).toContain("--hero-background-brightness: 0.66;");
  });
});

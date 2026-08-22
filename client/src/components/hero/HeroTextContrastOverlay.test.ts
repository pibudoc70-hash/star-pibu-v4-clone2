import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const overlays = readFileSync(
  resolve(process.cwd(), "client/src/components/hero/HeroOverlays.tsx"),
  "utf8",
);
const layers = readFileSync(
  resolve(process.cwd(), "client/src/components/hero/HeroBackgroundLayers.tsx"),
  "utf8",
);

describe("Hero text contrast overlay", () => {
  it("adds a non-interactive low-opacity gradient behind the central text area", () => {
    expect(overlays).toContain("export function HeroTextContrastOverlay()");
    expect(overlays).toContain('className="absolute inset-0 pointer-events-none"');
    expect(overlays).toContain("radial-gradient(ellipse 58% 42% at 50% 47%");
    expect(overlays).toContain("rgba(3,8,20,0.34)");
  });

  it("places the overlay in the background layer stack before Hero content", () => {
    expect(layers).toContain("HeroTextContrastOverlay");
    expect(layers).toMatch(/<HeroDarkOverlay\s*\/>[\s\S]*<HeroTextContrastOverlay\s*\/>/);
  });
});

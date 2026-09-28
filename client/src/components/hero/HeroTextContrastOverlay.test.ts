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
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Hero text contrast overlay", () => {
  it("adds a non-interactive shared low-opacity gradient behind the central text area", () => {
    expect(overlays).toContain("export function HeroTextContrastOverlay()");
    expect(overlays).toContain('className="absolute inset-0 pointer-events-none"');
    expect(overlays).toContain('"var(--hero-text-contrast-gradient)"');
    expect(css).toContain("--hero-text-contrast-gradient:");
    expect(css).toContain("radial-gradient(ellipse 58% 42% at 50% 47%");
  });

  it("places the overlay in the background layer stack before Hero content", () => {
    expect(layers).toContain("HeroTextContrastOverlay");
    expect(layers).toMatch(/<HeroDarkOverlay\s*\/>[\s\S]*<HeroTextContrastOverlay\s*\/>/);
  });
});

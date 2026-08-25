import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "../../../..");
const constantsSource = readFileSync(resolve(projectRoot, "client/src/components/hero/constants.ts"), "utf8");
const heroSource = readFileSync(resolve(projectRoot, "client/src/components/HeroSection.tsx"), "utf8");
const indexSource = readFileSync(resolve(projectRoot, "client/index.html"), "utf8");

describe("Hero approved WebP background delivery", () => {
  it("defines the supplied managed WebP background for every viewport while retaining viewport-specific logos", () => {
    expect(constantsSource).toContain('HERO_BACKGROUND_IMAGE = "/manus-storage/hero-background-0000_d3dee03d.webp"');
    expect(constantsSource).toContain("desktopWebp: HERO_BACKGROUND_IMAGE");
    expect(constantsSource).toContain("mobilePortraitWebp: HERO_BACKGROUND_IMAGE");
    expect(constantsSource).toContain("desktopJpg: HERO_BACKGROUND_IMAGE");
    expect(constantsSource).toContain("mobilePortraitJpg: HERO_BACKGROUND_IMAGE");
    expect(constantsSource).not.toContain("desktopAvif:");
    expect(constantsSource).not.toContain("mobilePortraitAvif:");
    expect(constantsSource).toContain('HERO_LOGO_IMAGE = "/manus-storage/star_logo_d0ae8bbf_8a004167.webp"');
    expect(constantsSource).toContain('HERO_MOBILE_LOGO_IMAGE = "/manus-storage/star-logo-mobile_77b7502d_83869d29.webp"');
    expect(constantsSource).not.toContain("HERO_LOGO_IMAGE_AVIF");
  });

  it("serves the approved WebP directly without the failing AVIF candidate while preserving the direct WebP logo renderer", () => {
    expect(heroSource).toContain('srcSet={HERO_IMAGES.desktopWebp} type="image/webp"');
    expect(heroSource).toContain('srcSet={HERO_IMAGES.mobilePortraitWebp} type="image/webp"');
    expect(heroSource).not.toContain('type="image/avif"');
    expect(heroSource).toContain('src={HERO_LOGO_IMAGE}');
    expect(heroSource).toContain('src={HERO_MOBILE_LOGO_IMAGE}');
    expect(heroSource).not.toContain('HERO_LOGO_IMAGE_AVIF');
    expect(heroSource).not.toContain('usePicture={false}');
  });

  it("preloads the same approved desktop WebP resource selected by the Hero picture", () => {
    expect(indexSource).toContain('href="/manus-storage/hero-background-0000_d3dee03d.webp"');
    expect(indexSource).toMatch(/rel="preload" as="image" type="image\/webp"[\s\S]{0,160}fetchpriority="high"/);
  });
});

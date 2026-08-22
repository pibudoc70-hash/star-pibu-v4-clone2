import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "../../../..");
const constantsSource = readFileSync(resolve(projectRoot, "client/src/components/hero/constants.ts"), "utf8");
const heroSource = readFileSync(resolve(projectRoot, "client/src/components/HeroSection.tsx"), "utf8");
const indexSource = readFileSync(resolve(projectRoot, "client/index.html"), "utf8");

describe("Hero next-generation image delivery", () => {
  it("defines a managed Hero AVIF asset while retaining WebP backgrounds and logo", () => {
    expect(constantsSource).toContain('desktopAvif: "/manus-storage/hero_ae3f2e80.avif"');
    expect(constantsSource).toContain('mobilePortraitAvif: "/manus-storage/hero_ae3f2e80.avif"');
    expect(constantsSource).toContain('desktopWebp: "/api/storage/hero-bg-new-desktop_2f8a8ccf_482fcfca.webp"');
    expect(constantsSource).toContain('HERO_LOGO_IMAGE = "/api/storage/star_logo_d0ae8bbf.webp"');
    expect(constantsSource).not.toContain("HERO_LOGO_IMAGE_AVIF");
  });

  it("serves AVIF before WebP for backgrounds while preserving the direct WebP logo renderer", () => {
    expect(heroSource).toMatch(/type="image\/avif"[\s\S]{0,220}type="image\/webp"/);
    expect(heroSource).toContain('src={HERO_LOGO_IMAGE}');
    expect(heroSource).not.toContain('HERO_LOGO_IMAGE_AVIF');
    expect(heroSource).not.toContain('usePicture={false}');
  });

  it("preloads the same desktop AVIF resource selected by the Hero picture", () => {
    expect(indexSource).toContain('href="/manus-storage/hero_ae3f2e80.avif"');
    expect(indexSource).toMatch(/rel="preload" as="image" type="image\/avif"[\s\S]{0,160}fetchpriority="high"/);
  });
});

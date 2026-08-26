import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const headerSource = readFileSync(resolve(projectRoot, "client/src/components/Header.tsx"), "utf8");
const heroConstantsSource = readFileSync(resolve(projectRoot, "client/src/components/hero/constants.ts"), "utf8");
const starLogoSource = readFileSync(resolve(projectRoot, "client/src/components/StarLogo.tsx"), "utf8");

describe("approved logo asset recovery", () => {
  it("uses the supplied managed desktop logo for the header and desktop hero", () => {
    expect(headerSource).toContain('src="/manus-storage/star_logo_d0ae8bbf_8a004167.webp"');
    expect(heroConstantsSource).toContain('HERO_LOGO_IMAGE = "/manus-storage/star_logo_d0ae8bbf_8a004167.webp"');
    expect(starLogoSource).toContain('const LOGO_URL = "/manus-storage/star_logo_d0ae8bbf_8a004167.webp"');
  });

  it("uses the supplied managed mobile logo and removes the broken storage paths", () => {
    expect(heroConstantsSource).toContain('HERO_MOBILE_LOGO_IMAGE = "/manus-storage/star-logo-mobile_77b7502d_83869d29.webp"');
    expect(headerSource).not.toContain('/api/storage/star_logo_d0ae8bbf.webp');
    expect(heroConstantsSource).not.toContain('/api/storage/star_logo_d0ae8bbf.webp');
    expect(heroConstantsSource).not.toContain('/manus-storage/star-logo-mobile_77b7502d.webp');
    expect(starLogoSource).not.toContain('/api/storage/star-logo_64a097b7_50456ffb.gif');
  });
});

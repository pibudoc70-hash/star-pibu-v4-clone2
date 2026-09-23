import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");

const cssSource = read("client/src/index.css");
const liftingSource = read("client/src/components/LiftingPositioning.tsx");
const managementSource = read("client/src/components/ManagementDevicesSection.tsx");
const facilitySource = read("client/src/components/FacilitySection.tsx");
const youtubeSource = read("client/src/components/YouTubeSection.tsx");
const contactSource = read("client/src/components/ContactSection.tsx");

const desktopSurfaceStart = cssSource.indexOf("/* Desktop equipment list: retain individual tabs/cards");
const desktopSurfaceRules = cssSource.slice(
  desktopSurfaceStart,
  cssSource.indexOf("/* `/doctors` direct-page header", desktopSurfaceStart),
);

describe("desktop surface cleanup", () => {
  it("uses the prescribed two-tone sequence from the opening lifting summary through homepage sections", () => {
    expect(liftingSource).toContain('className="home-surface-a bg-[#fbf8f2]');
    expect(cssSource).toContain(".home-surface-a {\n    background: #FAF8F5;");
    expect(cssSource).toContain(".home-surface-b {\n    background: #F3EEE7;");
  });

  it("removes desktop-only outer surfaces while preserving mobile component markup", () => {
    expect(managementSource).toContain("management-devices__grid-surface");
    expect(managementSource).toContain('section-subtitle body-text text-[var(--color-gold-light)] md:hidden');
    expect(cssSource).toContain(".management-devices__grid-surface {\n    background: transparent !important;");
    expect(cssSource).toContain("border: 0 !important;");
    expect(desktopSurfaceRules).toContain(".equipment-list__search");
    expect(desktopSurfaceRules).toContain("background: transparent !important;");
  });

  it("hides only the requested desktop helper copy and retains mobile alternatives", () => {
    expect(facilitySource).toContain('className="section-subtitle md:hidden"');
    expect(youtubeSource).toContain('className="section-subtitle body-text md:hidden"');
    expect(youtubeSource).toContain('className="mb-6 text-lg font-semibold text-gray-900 md:hidden"');
    expect(youtubeSource).toContain('className="youtube-shorts-heading mb-6 text-lg font-semibold md:hidden"');
  });

  it("uses STAR DERMATOLOGY as the desktop contact eyebrow while retaining localized mobile copy", () => {
    expect(contactSource).toContain('<span className="hidden md:inline">STAR DERMATOLOGY</span>');
    expect(contactSource).toContain('<span className="md:hidden">{locationInfo}</span>');
  });
});

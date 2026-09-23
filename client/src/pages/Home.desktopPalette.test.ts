import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const homeSource = readFileSync(resolve(root, "client/src/pages/Home.tsx"), "utf8");
const cssSource = readFileSync(resolve(root, "client/src/index.css"), "utf8");
const overlaysSource = readFileSync(resolve(root, "client/src/components/hero/HeroOverlays.tsx"), "utf8");
const doctorsSource = readFileSync(resolve(root, "client/src/components/DoctorsSection.tsx"), "utf8");
const facilitySource = readFileSync(resolve(root, "client/src/components/FacilitySection.tsx"), "utf8");
const managementSource = readFileSync(resolve(root, "client/src/components/ManagementDevicesSection.tsx"), "utf8");
const youtubeSource = readFileSync(resolve(root, "client/src/components/YouTubeSection.tsx"), "utf8");
const koSource = readFileSync(resolve(root, "client/src/lib/i18n.ko.ts"), "utf8");

describe("homepage desktop palette and label refinement", () => {
  it("keeps every deferred home surface in the warm palette system", () => {
    for (const surface of [
      "section-bg-cream",
      "section-bg-warm",
      "section-bg-cream-soft",
      "section-bg-dark-brown",
      "section-bg-gold-soft",
      "section-bg-warm-alt",
      "section-bg-dark-brown-mid",
    ]) {
      expect(homeSource).toContain(surface);
    }

    expect(cssSource).toContain("Homepage desktop surface harmony");
    expect(cssSource).toContain("@media (min-width: 768px)");
    expect(cssSource).toContain(".section-bg-dark-brown {\n    background: #F2ECE4;");
    expect(cssSource).toContain(".section-bg-dark-brown-mid {\n    background: #F5F0EA;");
    expect(cssSource).toContain(".section-bg-gold-soft {\n    background: #F3EEE7;");
  });

  it("uses warm neutral desktop hero overlays without changing mobile overlay literals", () => {
    expect(overlaysSource).toContain("rgba(58,45,33,0.76)");
    expect(overlaysSource).toContain("rgba(49,38,28,0.48)");
    expect(overlaysSource).toContain("rgba(4,8,22,0.72)");
  });

  it("uses English desktop eyebrow labels while retaining localized mobile labels", () => {
    expect(doctorsSource).toContain('<span className="hidden md:inline">MEDICAL TEAM</span>');
    expect(facilitySource).toContain('<span className="hidden md:inline">CLINIC FACILITIES</span>');
    expect(managementSource).toContain('<span className="hidden md:inline">CARE DEVICES</span>');
    expect(doctorsSource).toContain('<span className="md:hidden">{t.doctors.teamLabel ?? t.doctors.label}</span>');
    expect(facilitySource).toContain('<span className="md:hidden">{fc.sectionTitle}</span>');
    expect(managementSource).toContain('<span className="md:hidden">{md.eyebrow ?? "MANAGEMENT DEVICES"}</span>');
  });

  it("keeps desktop YouTube card copy readable on the shared warm surface", () => {
    expect(youtubeSource).toContain('className="youtube-video-title p-3"');
    expect(youtubeSource).toContain('className="youtube-video-title-text text-xs md:text-sm');
    expect(cssSource).toContain(".youtube-video-title {");
    expect(cssSource).toContain(".youtube-video-title-text,");
  });

  it("uses the requested Korean Directions subtitle", () => {
    expect(koSource).toContain('subtitle: "스타피부과 쉽게 찾아오세요."');
    expect(koSource).not.toContain('subtitle: "스타피부과 쉽게 찾아보세요."');
  });
});

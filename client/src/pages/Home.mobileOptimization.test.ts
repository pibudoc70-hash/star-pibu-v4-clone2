import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const css = read("client/src/index.css");
const management = read("client/src/components/ManagementDevicesSection.tsx");
const results = read("client/src/components/ResultsStatisticsSection.tsx");
const facility = read("client/src/components/FacilitySection.tsx");
const youtube = read("client/src/components/YouTubeSection.tsx");
const faq = read("client/src/components/FAQSection.tsx");
const specialEvents = read("client/src/components/SpecialEventSection.tsx");
const doctors = read("client/src/components/DoctorsSection.tsx");
const treatments = read("client/src/components/TreatmentsEquipmentSection.tsx");
const contact = read("client/src/components/ContactSection.tsx");
const commaBreak = read("client/src/components/MobileCommaBreak.tsx");
const philosophy = read("client/src/components/PhilosophySection.tsx");
const home = read("client/src/pages/Home.tsx");
const lifting = read("client/src/components/LiftingPositioning.tsx");

const mobileHomeBlock = css.split("Homepage mobile-only content-density pass")[1]?.split("\n}")[0] ?? "";
const mobileTitleBlock = css.split("Homepage mobile title unification")[1] ?? "";

describe("homepage mobile-only optimization", () => {
  it("scopes the density pass to the mobile media query and excludes protected sections", () => {
    const targetSelector = "html body #main-content section:is(#management-devices, #about, #results-statistics, #facility, .youtube-section-root, #faq)";
    expect(css).toContain(`@media (max-width: 767px) {\n  ${targetSelector}`);
    expect(mobileHomeBlock).toContain(targetSelector);
    expect(css).toContain(`@layer components {\n  @media (max-width: 767px) {`);
    expect(mobileHomeBlock).not.toContain(":is(#events");
    expect(mobileHomeBlock).not.toContain(":is(#pain-management");
    expect(mobileHomeBlock).not.toContain(":is(#doctors");
    expect(mobileHomeBlock).not.toContain(":is(#treatments");
  });

  it("preserves all content while exposing mobile-only control hooks", () => {
    expect(management).toContain("management-device-card");
    expect(management).toContain('<span className="md:hidden">CARE DEVICES</span>');
    expect(results).toContain("results-statistics__cards");
    expect(facility).toContain('<span className="md:hidden">CLINIC FACILITIES</span>');
    expect(youtube).toContain("youtube-section-root");
    expect(youtube).toContain("youtube-videos-row");
    expect(youtube).toContain("youtube-shorts-row");
    expect(faq).toContain("faq-tabs-scroll");
  });

  it("uses horizontal swipe layouts for only the dense, nonprotected mobile rows", () => {
    expect(mobileHomeBlock).toContain("#results-statistics .results-statistics__cards");
    expect(mobileHomeBlock).toContain(".youtube-videos-row");
    expect(mobileHomeBlock).toContain(".youtube-shorts-row");
    expect(mobileHomeBlock).toContain("#faq .faq-tabs-scroll");
    expect(mobileHomeBlock).toContain("scroll-snap-type: x mandatory");
  });

  it("keeps final desktop copy and one approved surface system authoritative on mobile", () => {
    expect(css).toContain("Homepage alternating section surfaces");
    expect(css).toContain("--home-section-bg-a: #FAF8F5;");
    expect(css).toContain("--home-section-bg-b: #F3EEE7;");
    expect(css).toContain(".home-page .home-section-surface--a {");
    expect(css).toContain(".home-page .home-section-surface--b {");
    expect(mobileHomeBlock).not.toContain("#main-content #management-devices,\n  #main-content #results-statistics");
    expect(mobileHomeBlock).toContain("color: var(--brand-text, #2C2C2C) !important;");
    expect(mobileHomeBlock).toContain("#management-devices .section-subtitle,");
    expect(mobileHomeBlock).toContain(".youtube-section-root .section-subtitle,");
    expect(mobileHomeBlock).toContain("#management-devices .management-device-card > div > span.hidden");
    expect(mobileHomeBlock).toContain('#faq div.hidden[class~="md:block"]');
    expect(philosophy).toContain("philosophy-mobile-image");
  });

  it("uses one mobile-only title system for every homepage title wrapper", () => {
    for (const source of [specialEvents, doctors, treatments, management, results, facility, youtube, faq, contact]) {
      expect(source).toContain("mobile-home-section-header");
    }
    expect(mobileTitleBlock).toContain("@media (max-width: 767px)");
    expect(mobileTitleBlock).toContain(".mobile-home-section-header");
    expect(mobileTitleBlock).toContain("text-align: center !important;");
    expect(mobileTitleBlock).toContain("word-break: keep-all !important;");
    expect(mobileTitleBlock).toContain(".mobile-comma-break");
  });

  it("reuses one locale string and exposes comma breaks only through mobile CSS", () => {
    expect(commaBreak).toContain('text.split(",")');
    expect(commaBreak).toContain('className="mobile-comma-break hidden"');
    expect(specialEvents).toContain("<MobileCommaBreak text={subtitleMap[lang] ?? subtitleMap.ko} />");
    expect(doctors).toContain("<MobileCommaBreak text={t.doctors.tagline} />");
    expect(treatments).toContain("<MobileCommaBreak text={tr.subtitle} />");
  });

  it("uses one 48-pixel mobile rhythm across every homepage section only below md", () => {
    expect(home).toContain('<div className="home-page min-h-screen">');
    expect(home).toContain('<main id="main-content" className="home-main"');
    expect(lifting).toContain("lifting-positioning-summary");
    expect(lifting).toContain("mobile-home-section-header--lifting");
    expect(css).toContain("Homepage mobile section rhythm");
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain("--home-mobile-section-padding-top: 3rem;");
    expect(css).toContain("--home-mobile-section-padding-bottom: 3rem;");
    expect(css).toContain("--home-mobile-eyebrow-to-title-gap: 0.625rem;");
    expect(css).toContain("--home-mobile-title-to-subtitle-gap: 0.9375rem;");
    expect(css).toContain("--home-mobile-title-block-to-content-gap: 1.875rem;");
    expect(css).toContain("#main-content.home-main :is(");
    expect(css).toContain(".home-page #contact");
    for (const selector of [".lifting-positioning-summary", "#events", "#doctors", "#treatments", "#management-devices", "#about", "#results-statistics", "#facility", ".youtube-section-root", "#faq", "#contact"]) {
      expect(css).toContain(selector);
    }
    expect(css).toContain("mobile-home-section-header--lifting");
    expect(css).toContain("word-break: keep-all !important;");
    expect(css).toContain("min-height: 0 !important;");
    expect(css).toContain("margin: var(--home-mobile-title-to-subtitle-gap) auto 0 !important;");
    expect(css).toContain(".mobile-home-section-header--lifting {");
    expect(css).toContain("margin-bottom: 0 !important;");
    expect(css).toContain(".philosophy-mobile-header > .section-eyebrow:last-child {");
    expect(css).toContain("margin: var(--home-mobile-title-to-subtitle-gap) 0 0 !important;");
    expect(css).not.toContain("section#events {\n      padding-bottom: 3rem !important;");
    expect(css).not.toContain("section#doctors {\n      padding-top: 2.5rem !important;");
    expect(css).not.toContain("section#treatments {\n      padding-top: 2.5rem !important;");
  });
});

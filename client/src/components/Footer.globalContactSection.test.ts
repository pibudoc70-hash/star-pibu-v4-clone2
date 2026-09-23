import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const footerSource = read("client/src/components/Footer.tsx");
const contactSource = read("client/src/components/ContactSection.tsx");
const directionsSource = read("client/src/pages/Directions.tsx");

const pageSources = [
  "client/src/pages/Home.tsx",
  "client/src/pages/Equipment2.tsx",
  "client/src/pages/Equipment3.tsx",
  "client/src/pages/Equipment3Detail.tsx",
  "client/src/pages/Equipment2Detail.tsx",
  "client/src/pages/TreatmentDetail.tsx",
  "client/src/pages/TreatmentPage.tsx",
  "client/src/pages/Doctors.tsx",
  "client/src/pages/Event.tsx",
  "client/src/pages/About.tsx",
  "client/src/pages/Directions.tsx",
  "client/src/pages/ForeignGuide.tsx",
  "client/src/pages/Notice.tsx",
  "client/src/pages/NoticeDetail.tsx",
].map(read);

const formerDuplicateSources = [
  "client/src/pages/Home.tsx",
  "client/src/pages/Equipment2.tsx",
  "client/src/pages/Equipment3.tsx",
  "client/src/pages/Event.tsx",
  "client/src/pages/LandingEN.tsx",
  "client/src/pages/LandingJA.tsx",
  "client/src/pages/LandingZH.tsx",
  "client/src/pages/LandingZHTW.tsx",
  "client/src/pages/About.tsx",
].map(read);

describe("global footer contact section", () => {
  it("renders the shared contact section immediately before the site footer by default", () => {
    expect(footerSource).toContain('import ContactSection from "@/components/ContactSection"');
    expect(footerSource).toContain("showContactSection?: boolean");
    expect(footerSource).toContain("{showContactSection && <ContactSection />}");
  });

  it("uses the established warm-beige background for the common section", () => {
    expect(contactSource).toContain('backgroundColor: "var(--brand-bg-warm)"');
    expect(contactSource).not.toContain("faq-section-bg");
  });

  it("removes every former page-level contact section duplicate", () => {
    formerDuplicateSources.forEach((source) => {
      expect(source).not.toContain('from "@/components/ContactSection"');
      expect(source).not.toContain("<ContactSection");
    });
  });

  it("keeps the common footer path for representative public pages", () => {
    pageSources.forEach((source) => {
      expect(source.includes("<MainLayout") || source.includes("<Footer")).toBe(true);
    });
  });

  it("keeps the location panel and transport guidance together in the dedicated directions body", () => {
    expect(directionsSource).toContain("transportationTitle");
    expect(directionsSource).toContain("carTitle");
    expect(directionsSource).toContain("transitTitle");
    expect(directionsSource).toContain("<MainLayout showContactSection={false}>");
    expect(directionsSource).toContain('import ContactSection from \'@/components/ContactSection\'');
    expect(directionsSource).toContain("<ContactSection showHeader={false} />");
    expect(directionsSource).not.toContain("LocationLinkPanel");
    expect(directionsSource).not.toContain("map.kakao.com");
  });

  it("removes duplicate address and transport details from the foreign guide", () => {
    const foreignGuideSource = read("client/src/pages/ForeignGuide.tsx");
    expect(foreignGuideSource).toContain("<Footer />");
    expect(foreignGuideSource).not.toContain("t.access.address");
    expect(foreignGuideSource).not.toContain("foreignGuide.transportation");
  });

  it("removes the page-level access block from the about page", () => {
    const aboutSource = read("client/src/pages/About.tsx");
    expect(aboutSource).not.toContain("accessLabels");
    expect(aboutSource).not.toContain("t.access.address");
  });
});

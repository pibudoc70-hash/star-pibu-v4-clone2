import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const equipmentSource = read("client/src/pages/Equipment3.tsx");
const doctorsSource = read("client/src/pages/Doctors.tsx");
const aboutSource = read("client/src/pages/About.tsx");
const eventSource = read("client/src/pages/Event.tsx");
const directionsSource = read("client/src/pages/Directions.tsx");
const mainLayoutSource = read("client/src/components/MainLayout.tsx");
const footerSource = read("client/src/components/Footer.tsx");
const cssSource = read("client/src/index.css");

describe("requested public page structure refinements", () => {
  it("adds the established title-band hierarchy above Equipment3 content", () => {
    expect(equipmentSource).toContain('aria-labelledby="equipment3-page-title"');
    expect(equipmentSource).toContain("STAR DERMATOLOGY");
    expect(equipmentSource).toContain("TREATMENTS &amp; EQUIPMENT");
    expect(equipmentSource).toContain("dr-page-header-subtitle");
    expect(equipmentSource).toContain('id="equipment3-page-title"');
    expect(equipmentSource).not.toContain('<h1 className="sr-only">{pageTitle}</h1>');
  });

  it("gives Doctors the aligned, softer header treatment", () => {
    expect(doctorsSource).toContain("dr-page-header--doctors pt-28 pb-12 sm:pt-32 sm:pb-16");
    expect(cssSource).toContain(".dr-page-header--doctors");
    expect(cssSource).toContain("var(--brand-bg-card)");
  });

  it("removes About's duplicate care-guide section and routes its doctor CTA directly", () => {
    expect(aboutSource).toContain('href="/doctors"');
    expect(aboutSource).not.toContain('href="/#doctors"');
    expect(aboutSource).not.toContain("{t.hours.title}");
    expect(aboutSource).not.toContain("t.hours.rows.map");
  });

  it("uses STAR EVENT as the Korean standalone event page title", () => {
    expect(eventSource).toContain('ko: {\n    eyebrow: "STAR DERMATOLOGY",\n    title: "STAR EVENT"');
  });

  it("keeps Directions' location surface in-page and excludes only its footer duplicate", () => {
    expect(directionsSource).toContain("<MainLayout showContactSection={false}>");
    expect(directionsSource).toContain("<ContactSection />");
    expect(directionsSource).toContain('id="directions-page-title"');
    expect(directionsSource).toContain("DIRECTIONS");
    expect(mainLayoutSource).toContain("showContactSection?: boolean");
    expect(footerSource).toContain("showContactSection && <ContactSection />");
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "../../..");
const indexCss = readFileSync(resolve(projectRoot, "client/src/index.css"), "utf8");

const readableBodyFiles = [
  "ConsultationFormSection.tsx",
  "EventsSection.tsx",
  "FAQSection.tsx",
  "ManagementDevicesSection.tsx",
  "PhilosophySection.tsx",
  "ReservationSection.tsx",
  "ResultsSection.tsx",
  "SpecialEventSection.tsx",
  "TreatmentsEquipmentSection.tsx",
  "YouTubeSection.tsx",
];

describe("mobile typography ownership", () => {
  it("does not impose a global 14px minimum on paragraph, list, or span tags", () => {
    expect(indexCss).not.toContain("p, li, span:not(.section-eyebrow)");
    expect(indexCss).toContain(".body-text {\n  font-size: max(0.875rem, 14px);");
    expect(indexCss).toContain(".section-subtitle:not(.body-text) {");
    expect(indexCss).toContain("input:not([type=\"checkbox\"]):not([type=\"radio\"])");
    expect(indexCss).not.toMatch(/^\s{2}\.text-xs\s*\{\s*font-size:/m);
  });

  it("assigns the readable-text minimum only to explanatory section paragraphs", () => {
    for (const file of readableBodyFiles) {
      const source = readFileSync(resolve(projectRoot, `client/src/components/${file}`), "utf8");
      expect(source).toContain("section-subtitle body-text");
    }

    const facilitySource = readFileSync(resolve(projectRoot, "client/src/components/FacilitySection.tsx"), "utf8");
    expect(facilitySource).not.toContain("section-subtitle body-text");
  });
});

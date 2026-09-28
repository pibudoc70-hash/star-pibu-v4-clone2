import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const treatmentsSource = readFileSync(resolve(process.cwd(), "client/src/components/TreatmentsEquipmentSection.tsx"), "utf8");
const globalCss = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("TreatmentsEquipmentSection spacing", () => {
  it("uses the shared mobile section rhythm without changing treatment cards or category interactions", () => {
    expect(treatmentsSource).toContain('id="treatments"');
    expect(treatmentsSource).toContain("<CategoryTabList");
    expect(treatmentsSource).toContain("<EquipmentTreatmentCard");
    expect(treatmentsSource).not.toContain("PainManagementGuide");
    expect(globalCss).toContain("--home-mobile-section-padding-top: 3rem;");
    expect(globalCss).toContain("--home-mobile-section-padding-bottom: 3rem;");
    expect(globalCss).toContain("#treatments,");
    expect(globalCss).toContain("padding-top: var(--home-mobile-section-padding-top) !important;");
    expect(globalCss).toContain("padding-bottom: var(--home-mobile-section-padding-bottom) !important;");
  });
});

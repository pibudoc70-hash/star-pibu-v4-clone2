import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const treatmentsSource = readFileSync(resolve(process.cwd(), "client/src/components/TreatmentsEquipmentSection.tsx"), "utf8");
const globalCss = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("TreatmentsEquipmentSection spacing", () => {
  it("halves only the surrounding section padding without changing treatment cards or category interactions", () => {
    expect(treatmentsSource).toContain('id="treatments"');
    expect(treatmentsSource).toContain("<CategoryTabList");
    expect(treatmentsSource).toContain("<EquipmentTreatmentCard");
    expect(treatmentsSource).not.toContain("PainManagementGuide");
    expect(globalCss).toContain("section#treatments {\n      padding-top: 2.5rem !important;\n      padding-bottom: 2.5rem !important;");
    expect(globalCss).toContain("#treatments {\n    padding-top: 3rem !important;\n    padding-bottom: 3rem !important;");
  });
});

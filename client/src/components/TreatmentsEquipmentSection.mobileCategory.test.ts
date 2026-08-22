import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sectionSource = readFileSync(
  resolve(process.cwd(), "client/src/components/TreatmentsEquipmentSection.tsx"),
  "utf8",
);

const tabListSource = readFileSync(
  resolve(process.cwd(), "client/src/components/treatments/CategoryTabList.tsx"),
  "utf8",
);

describe("TreatmentsEquipmentSection mobile category detail", () => {
  it("keeps mobile category content inline with a row-local expand and close contract", () => {
    expect(sectionSource).toContain("mobileExpandedId");
    expect(sectionSource).toContain("onMobileTabToggle");
    expect(sectionSource).toContain("handleMobileCategoryClose");
    expect(sectionSource).toContain("treatment-mobile-category-detail");
  });

  it("renders selected mobile category detail immediately after its category button", () => {
    expect(tabListSource).toContain("mobileActiveId");
    expect(tabListSource).toContain("renderMobileDetail");
    expect(tabListSource).toContain("col-span-2");
  });

  it("returns the mobile viewport to the category list after close", () => {
    expect(sectionSource).toContain("scrollIntoView");
    expect(sectionSource).toContain('behavior: "smooth"');
    expect(tabListSource).toContain('id="treatment-mobile-category-list"');
  });
});

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

const tabButtonSource = readFileSync(
  resolve(process.cwd(), "client/src/components/treatments/CategoryTabButton.tsx"),
  "utf8",
);

const stylesSource = readFileSync(
  resolve(process.cwd(), "client/src/index.css"),
  "utf8",
);

describe("TreatmentsEquipmentSection mobile category detail", () => {
  it("keeps mobile category content inline with a row-local expand and close contract", () => {
    expect(sectionSource).toContain("mobileExpandedId");
    expect(sectionSource).toContain("onMobileTabToggle");
    expect(sectionSource).not.toContain("handleMobileCategoryClose");
    expect(sectionSource).toContain("treatment-mobile-category-detail");
  });

  it("renders selected mobile category detail immediately after its category button", () => {
    expect(tabListSource).toContain("mobileActiveId");
    expect(tabListSource).toContain("renderMobileDetail");
    expect(tabListSource).toContain("col-span-2");
  });

  it("uses the selected category button as the only mobile close control", () => {
    expect(sectionSource).not.toContain("handleMobileCategoryClose");
    expect(sectionSource).not.toContain("mobileClosingId");
    expect(tabListSource).not.toContain("onMobileDetailClose");
    expect(tabListSource).toContain("onClick={onMobileTabToggle ?? onTabChange}");
    expect(tabListSource).toContain('id="treatment-mobile-category-list"');
  });

  it("shows all mobile category items without duplicate close controls", () => {
    expect(sectionSource).toContain("filteredTreatments.map((item, i) => (");
    expect(sectionSource).not.toContain('aria-controls="treatments-mobile-grid"');
    expect(sectionSource).not.toContain("mobile-category-detail-close-footer");
    expect(tabListSource).not.toContain("mobile-category-detail-close-top");
  });

  it("keeps the inline detail in the shared animated shell", () => {
    expect(tabListSource).toContain("mobile-category-detail-shell");
    expect(tabListSource).toContain('data-state="open"');
    expect(stylesSource).toContain(".mobile-category-detail-shell");
    expect(stylesSource).toContain("prefers-reduced-motion: reduce");
  });

  it("keeps the mobile category controls compact without shrinking interactive targets", () => {
    expect(sectionSource).toContain('rounded-2xl px-3 py-3 mb-3 sm:px-4 sm:py-4 sm:mb-4');
    expect(sectionSource).toContain('gap-2 mb-2 px-3 py-2.5 rounded-xl transition-all duration-200 sm:mb-4');
    expect(sectionSource).toContain('grid gap-3 py-3');
    expect(tabListSource).toContain('grid grid-cols-2 gap-x-2 gap-y-1.5 sm:hidden');
    expect(tabButtonSource).toContain('aria-expanded={isSm ? isActive : undefined}');
  });

  it("shows each mobile category as an expandable control with a stateful chevron", () => {
    expect(tabButtonSource).toContain("ChevronDown, ChevronUp, Star");
    expect(tabButtonSource).toContain('aria-expanded={isSm ? isActive : undefined}');
    expect(tabButtonSource).toContain('aria-controls={isSm && isActive ? `mobile-category-detail-${id}` : undefined}');
    expect(tabButtonSource).toContain('isActive ? <ChevronUp size={15} /> : <ChevronDown size={15} />');
    expect(tabButtonSource).toContain('aria-hidden="true"');
  });

  it("removes only the mobile detail shell chrome and category icons", () => {
    expect(stylesSource).toContain("Homepage mobile treatment category detail cleanup");
    expect(stylesSource).toContain(".treatment-mobile-category-detail");
    expect(stylesSource).toContain("background: transparent !important");
    expect(stylesSource).toContain(".cat-tab-btn-sm .cat-tab-icon");
    expect(stylesSource).toContain("display: none");
  });

  it("does not retain a pain-management category, hash handler, or inline guide in Treatments & Equipment", () => {
    expect(sectionSource).not.toContain("PAIN_MANAGEMENT_CATEGORY_ID");
    expect(sectionSource).not.toContain("PainManagementGuide");
    expect(sectionSource).not.toContain("getPainManagementCategory");
  });
});

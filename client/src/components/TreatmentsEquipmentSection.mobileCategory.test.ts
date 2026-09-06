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
    expect(sectionSource).toContain("handleMobileCategoryClose");
    expect(sectionSource).toContain("treatment-mobile-category-detail");
  });

  it("renders selected mobile category detail immediately after its category button", () => {
    expect(tabListSource).toContain("mobileActiveId");
    expect(tabListSource).toContain("renderMobileDetail");
    expect(tabListSource).toContain("col-span-2");
  });

  it("returns the mobile viewport to the precisely centered category list after close", () => {
    expect(sectionSource).toContain("window.visualViewport?.height");
    expect(sectionSource).toContain("window.scrollTo");
    expect(sectionSource).toContain('behavior: "smooth"');
    expect(tabListSource).toContain('id="treatment-mobile-category-list"');
  });

  it("offers one top close below the selected category row and one footer close after category content", () => {
    expect(tabListSource).toContain("onMobileTabToggle");
    expect(tabListSource).toContain("onMobileDetailClose");
    expect(tabListSource).toContain("mobile-category-detail-close-top");
    expect(sectionSource).toContain("mobile-category-detail-close-footer");
    expect(sectionSource).toContain("onMobileDetailClose={handleMobileCategoryClose}");
  });

  it("shows all mobile category items at once while retaining the footer close control", () => {
    expect(sectionSource).toContain("filteredTreatments.map((item, i) => (");
    expect(sectionSource).not.toContain('aria-controls="treatments-mobile-grid"');
    expect(sectionSource).toContain("mobile-category-detail-close-footer");
  });

  it("uses the existing localized collapse label for both mobile close controls", () => {
    expect(tabListSource).toContain("mobileCloseLabel");
    expect(tabListSource).toContain("{mobileCloseLabel}");
    expect(sectionSource).toContain("mobileCloseLabel={tr.collapseBtn}");
  });

  it("keeps detail mounted through an accessible fade-out lifecycle before returning to the grid", () => {
    expect(sectionSource).toContain("mobileClosingId");
    expect(tabListSource).toContain("mobile-category-detail-shell");
    expect(tabListSource).toContain('data-state={isClosing ? "closing" : "open"}');
    expect(stylesSource).toContain(".mobile-category-detail-shell");
    expect(stylesSource).toContain(".mobile-category-detail-shell[data-state=\"closing\"]");
    expect(stylesSource).toContain("prefers-reduced-motion: reduce");
  });

  it("keeps the mobile category controls compact without shrinking interactive targets", () => {
    expect(sectionSource).toContain('rounded-2xl px-3 py-3 mb-3 sm:px-4 sm:py-4 sm:mb-4');
    expect(sectionSource).toContain('gap-2 mb-2 px-3 py-2.5 rounded-xl transition-all duration-200 sm:mb-4');
    expect(sectionSource).toContain('grid gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4');
    expect(tabListSource).toContain('grid grid-cols-2 gap-x-2 gap-y-1.5 sm:hidden');
    expect(tabListSource).toContain('min-h-11');
  });

  it("shows each mobile category as an expandable control with a stateful chevron", () => {
    expect(tabButtonSource).toContain("ChevronDown, ChevronUp, Star");
    expect(tabButtonSource).toContain('aria-expanded={isSm ? isActive : undefined}');
    expect(tabButtonSource).toContain('aria-controls={isSm && isActive ? `mobile-category-detail-${id}` : undefined}');
    expect(tabButtonSource).toContain('isActive ? <ChevronUp size={15} /> : <ChevronDown size={15} />');
    expect(tabButtonSource).toContain('aria-hidden="true"');
  });

  it("does not retain a pain-management category, hash handler, or inline guide in Treatments & Equipment", () => {
    expect(sectionSource).not.toContain("PAIN_MANAGEMENT_CATEGORY_ID");
    expect(sectionSource).not.toContain("PainManagementGuide");
    expect(sectionSource).not.toContain("getPainManagementCategory");
  });
});

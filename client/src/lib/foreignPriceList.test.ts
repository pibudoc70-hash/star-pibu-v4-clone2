import { describe, expect, it } from "vitest";
import { FOREIGN_PRICE_CATEGORIES, FOREIGN_PRICE_LIST_UPDATED, getLocalizedForeignPriceCategories } from "./foreignPriceList";

describe("foreign patient price list data", () => {
  it("공유 수가표의 9개 category와 34개 가격 항목을 보존한다", () => {
    expect(FOREIGN_PRICE_CATEGORIES).toHaveLength(9);
    expect(FOREIGN_PRICE_CATEGORIES.flatMap((category) => category.items)).toHaveLength(34);
  });

  it("핵심 리프팅 가격과 별도 수면마취비를 실제 수가표 값으로 제공한다", () => {
    const lifting = FOREIGN_PRICE_CATEGORIES.find((category) => category.id === "lifting");

    expect(lifting?.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Ultherapy Prime", details: "100 lines", price: "₩440,000" }),
      expect.objectContaining({ name: "Thermage FLX", details: "Face · 600 shots", price: "₩2,400,000" }),
      expect.objectContaining({ name: "Sedation fee", price: "₩110,000", note: "Separate fee for lifting procedures" }),
    ]));
  });

  it("수정일과 VAT 포함 원칙을 페이지에 표시할 수 있는 source metadata를 제공한다", () => {
    expect(FOREIGN_PRICE_LIST_UPDATED).toBe("August 13, 2026");
  });

  it.each([
    ["ja", "リフティング"],
    ["zh", "提升紧致"],
    ["zh-TW", "拉提緊緻"],
  ] as const)("%s 가격표도 실제 34개 가격과 현지화 category label을 유지한다", (locale, liftingLabel) => {
    const categories = getLocalizedForeignPriceCategories(locale);

    expect(categories).toHaveLength(9);
    expect(categories.flatMap((category) => category.items)).toHaveLength(34);
    expect(categories[0]?.label).toBe(liftingLabel);
    expect(categories[0]?.items[0]).toMatchObject({ name: expect.any(String), price: "₩440,000" });
  });
});

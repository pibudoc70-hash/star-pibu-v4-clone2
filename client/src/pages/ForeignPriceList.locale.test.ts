import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(resolve(process.cwd(), "client/src/pages/ForeignPriceList.tsx"), "utf8");

describe("ForeignPriceList locale rendering", () => {
  it("현지화된 category data를 filter 탭과 table에 공통으로 사용한다", () => {
    expect(pageSource).toContain("const categories = getLocalizedForeignPriceCategories(locale);");
    expect(pageSource).toContain("{categories.map((category) => (");
    expect(pageSource).not.toContain("{FOREIGN_PRICE_CATEGORIES.map((category) => (");
  });

  it("일본어·중국어 route에서 현지화된 home back label을 제공한다", () => {
    expect(pageSource).toContain('back: "ホームへ戻る"');
    expect(pageSource).toContain('back: "返回首页"');
    expect(pageSource).toContain('back: "返回首頁"');
  });
});

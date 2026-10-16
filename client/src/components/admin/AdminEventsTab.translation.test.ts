import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/admin/AdminEventsTab.tsx"), "utf8");

describe("AdminEventsTab foreign-language event translation", () => {
  it("separates Simplified and Traditional Chinese into independent management tabs", () => {
    expect(source).toContain('type TargetLang = "ko" | "en" | "ja" | "zh" | "zh-TW"');
    expect(source).toContain('zh: "中文（简体）"');
    expect(source).toContain('"zh-TW": "中文（繁體）"');
    expect(source).toContain('const LANG_TABS: TargetLang[] = ["ko", "en", "ja", "zh", "zh-TW"]');
  });

  it("places an automatic translation action beside the new-event action for foreign tabs", () => {
    expect(source).toContain('data-testid="event-auto-translate-button"');
    expect(source).toContain('activeLang !== "ko"');
    expect(source).toContain("새 이벤트 추가");
  });

  it("translates Korean event copy into the active tab fields before saving", () => {
    expect(source).toContain("handleTranslateCurrentLanguageForm");
    expect(source).toContain("targetLang: activeLang");
    for (const field of ["title", "subtitle", "desc", "content", "productName", "cta", "badge", "tag", "anesthesiaFee"]) {
      expect(source).toContain(`${field}: eventForm.${field} || ""`);
    }
    expect(source).toContain("const priceLabelEntries = priceRows");
    expect(source).toContain("field: `priceRows.${index}.label`");
    expect(source).toContain("priceRows: translatedPriceRows");
    expect(source).toContain("Object.fromEntries(translations)");
  });
});

/**
 * i18nText.test.ts
 * pickLocalized / pickLocalizedFaq 헬퍼 단위 테스트
 */
import { describe, it, expect } from "vitest";
import { pickLocalized, pickLocalizedFaq } from "../client/src/lib/i18nText";
import type { LocalizedString, LocalizedFaq } from "../client/src/lib/i18nText";

describe("pickLocalized", () => {
  const full: LocalizedString = {
    ko: "한국어",
    en: "English",
    ja: "日本語",
    zh: "中文",
  };

  it("ko → ko", () => {
    expect(pickLocalized(full, "ko")).toBe("한국어");
  });

  it("en → en", () => {
    expect(pickLocalized(full, "en")).toBe("English");
  });

  it("ja → ja", () => {
    expect(pickLocalized(full, "ja")).toBe("日本語");
  });

  it("zh → zh", () => {
    expect(pickLocalized(full, "zh")).toBe("中文");
  });

  it("en missing → ko fallback", () => {
    const partial: LocalizedString = { ko: "한국어" };
    expect(pickLocalized(partial, "en")).toBe("한국어");
  });

  it("ja missing → en fallback", () => {
    const partial: LocalizedString = { ko: "한국어", en: "English" };
    expect(pickLocalized(partial, "ja")).toBe("English");
  });

  it("ja missing, en missing → ko fallback", () => {
    const partial: LocalizedString = { ko: "한국어" };
    expect(pickLocalized(partial, "ja")).toBe("한국어");
  });

  it("zh missing → en fallback", () => {
    const partial: LocalizedString = { ko: "한국어", en: "English" };
    expect(pickLocalized(partial, "zh")).toBe("English");
  });

  it("zh missing, en missing → ko fallback", () => {
    const partial: LocalizedString = { ko: "한국어" };
    expect(pickLocalized(partial, "zh")).toBe("한국어");
  });

  it("en whitespace-only → ko fallback", () => {
    const partial: LocalizedString = { ko: "한국어", en: "   " };
    expect(pickLocalized(partial, "en")).toBe("한국어");
  });
});

describe("pickLocalizedFaq", () => {
  const full: LocalizedFaq = {
    ko: [{ question: "질문ko", answer: "답변ko" }],
    en: [{ question: "Q en", answer: "A en" }],
    ja: [{ question: "質問ja", answer: "回答ja" }],
    zh: [{ question: "问题zh", answer: "答案zh" }],
  };

  it("ko → ko faq", () => {
    expect(pickLocalizedFaq(full, "ko")).toEqual(full.ko);
  });

  it("en → en faq", () => {
    expect(pickLocalizedFaq(full, "en")).toEqual(full.en);
  });

  it("ja → ja faq", () => {
    expect(pickLocalizedFaq(full, "ja")).toEqual(full.ja);
  });

  it("zh → zh faq", () => {
    expect(pickLocalizedFaq(full, "zh")).toEqual(full.zh);
  });

  it("en missing → ko faq fallback", () => {
    const partial: LocalizedFaq = { ko: full.ko! };
    expect(pickLocalizedFaq(partial, "en")).toEqual(full.ko);
  });

  it("ja missing → en faq fallback", () => {
    const partial: LocalizedFaq = { ko: full.ko!, en: full.en };
    expect(pickLocalizedFaq(partial, "ja")).toEqual(full.en);
  });

  it("undefined faq → empty array", () => {
    expect(pickLocalizedFaq(undefined, "ko")).toEqual([]);
  });
});

describe("treatments data integrity", () => {
  it("ulthera has all 4 languages in name", async () => {
    const { ulthera } = await import("../client/src/data/treatments/ulthera");
    expect(ulthera.name.ko).toBeTruthy();
    expect(ulthera.name.en).toBeTruthy();
    expect(ulthera.name.ja).toBeTruthy();
    expect(ulthera.name.zh).toBeTruthy();
  });

  it("thermage has all 4 languages in seoTitle", async () => {
    const { thermage } = await import("../client/src/data/treatments/thermage");
    expect(thermage.seoTitle.ko).toBeTruthy();
    expect(thermage.seoTitle.en).toBeTruthy();
    expect(thermage.seoTitle.ja).toBeTruthy();
    expect(thermage.seoTitle.zh).toBeTruthy();
  });

  it("under-eye-fat has faq in all 4 languages", async () => {
    const { underEyeFat } = await import("../client/src/data/treatments/under-eye-fat");
    expect(underEyeFat.faq?.ko?.length).toBeGreaterThan(0);
    expect(underEyeFat.faq?.en?.length).toBeGreaterThan(0);
    expect(underEyeFat.faq?.ja?.length).toBeGreaterThan(0);
    expect(underEyeFat.faq?.zh?.length).toBeGreaterThan(0);
  });

  it("TREATMENT_DATA has 3 entries", async () => {
    const { TREATMENT_DATA } = await import("../client/src/data/treatments/index");
    expect(Object.keys(TREATMENT_DATA)).toHaveLength(3);
    expect(TREATMENT_DATA["ulthera"]).toBeDefined();
    expect(TREATMENT_DATA["thermage"]).toBeDefined();
    expect(TREATMENT_DATA["under-eye-fat"]).toBeDefined();
  });

  it("getTreatmentBySlug returns undefined for unknown slug", async () => {
    const { getTreatmentBySlug } = await import("../client/src/data/treatments/index");
    expect(getTreatmentBySlug("unknown-slug")).toBeUndefined();
    expect(getTreatmentBySlug(undefined)).toBeUndefined();
  });
});

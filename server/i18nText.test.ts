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

  it("TREATMENT_DATA has 7 entries (PR-32: 4 new slugs added)", async () => {
    const { TREATMENT_DATA } = await import("../client/src/data/treatments/index");
    // Original 3 (PR-24)
    expect(TREATMENT_DATA["ulthera"]).toBeDefined();
    expect(TREATMENT_DATA["thermage"]).toBeDefined();
    expect(TREATMENT_DATA["under-eye-fat"]).toBeDefined();
    // New 4 (PR-32)
    expect(TREATMENT_DATA["ulthera-classic"]).toBeDefined();
    expect(TREATMENT_DATA["pico-laser"]).toBeDefined();
    expect(TREATMENT_DATA["ruby-pico-laser"]).toBeDefined();
    expect(TREATMENT_DATA["rosacea"]).toBeDefined();
    expect(Object.keys(TREATMENT_DATA)).toHaveLength(7);
  });

  it("getTreatmentBySlug returns undefined for unknown slug", async () => {
    const { getTreatmentBySlug } = await import("../client/src/data/treatments/index");
    expect(getTreatmentBySlug("unknown-slug")).toBeUndefined();
    expect(getTreatmentBySlug(undefined)).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 회귀 방지: inline lang 삼항 제거 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("Step 2 i18n 일관성 — inline lang 삼항 제거 검증", () => {
  const { readFileSync } = require("node:fs");
  const nodePath = require("node:path");
  const root = process.cwd();

  it("TreatmentsEquipmentSection.tsx에 time/recovery 필드 inline lang 삼항이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(root, "client/src/components/TreatmentsEquipmentSection.tsx"),
      "utf8",
    );
    // item.timeEn ?? item.time 형태의 inline 삼항이 없어야 함
    expect(src).not.toMatch(/lang === ["']en["'] \? \(item\.timeEn/);
    expect(src).not.toMatch(/lang === ["']en["'] \? \(item\.recoveryEn/);
    // getText 훅을 사용해야 함
    expect(src).toMatch(/getText\(item\.time, item\.timeEn/);
    expect(src).toMatch(/getText\(item\.recovery, item\.recoveryEn/);
  });

  it("Map.tsx에 mapLabel/mapAddress i18n 키를 사용해야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(root, "client/src/components/Map.tsx"),
      "utf8",
    );
    // t.access.mapViewLabel 키를 사용해야 함
    expect(src).toMatch(/t\.access\.mapViewLabel/);
    expect(src).toMatch(/t\.access\.mapAddressShort/);
  });

  it("i18n.ts access 타입에 mapViewLabel/mapAddressShort 키가 정의되어야 한다", () => {
    // i18n.ts는 조립 파일이므로 타입 정의는 i18n.types.ts에서 검사 (STRUCT-I18N-1)
    const src = readFileSync(
      nodePath.resolve(root, "client/src/lib/i18n.types.ts"),
      "utf8",
    );
    expect(src).toMatch(/mapViewLabel\??:/);
    expect(src).toMatch(/mapAddressShort\??:/);
  });

  it("i18n.ts 4개 언어 모두 mapViewLabel 값이 있어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.ko.access.mapViewLabel).toBeTruthy();
    expect(i18n.en.access.mapViewLabel).toBeTruthy();
    expect(i18n.ja.access.mapViewLabel).toBeTruthy();
    expect(i18n.zh.access.mapViewLabel).toBeTruthy();
  });

  it("i18n.ts 4개 언어 모두 mapAddressShort 값이 있어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.ko.access.mapAddressShort).toBeTruthy();
    expect(i18n.en.access.mapAddressShort).toBeTruthy();
    expect(i18n.ja.access.mapAddressShort).toBeTruthy();
    expect(i18n.zh.access.mapAddressShort).toBeTruthy();
  });
});

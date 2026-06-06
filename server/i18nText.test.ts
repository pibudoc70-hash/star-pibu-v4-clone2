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

// ─────────────────────────────────────────────────────────────────────────────
// P1 수정 회귀 방지 테스트 (PR-QA-P1)
// ─────────────────────────────────────────────────────────────────────────────
describe("PR-QA-P1: i18n.zh.ts 오탈자 수정 회귀 방지", () => {
  it("zh cta_kakao가 '咋讯' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.zh.hero.cta_kakao).not.toContain("咋讯");
    expect(i18n.zh.hero.cta_kakao).toContain("咨询");
  });

  it("zh cta_reserve가 '咋讯' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.zh.hero.cta_reserve).not.toContain("咋讯");
  });

  it("zh hours.title이 '诊疗安内' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.zh.hours.title).not.toContain("安内");
    expect(i18n.zh.hours.title).toBe("诊疗时间");
  });

  it("zh equipmentConsultBtn이 '和设备和论' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.zh.treatments.equipmentConsultBtn).not.toContain("和设备和论");
    expect(i18n.zh.treatments.equipmentConsultBtn).toContain("咨询");
  });

  it("zh floatingCta.callAria가 '和论' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.zh.floatingCta.callAria).not.toContain("和论");
    expect(i18n.zh.floatingCta.callAria).toContain("咨询");
  });

  it("zh results.treatmentResults에 '珑点去除' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    const items = i18n.zh.results.treatmentResults;
    const allImprovements = items.flatMap((item: { improvements: string[] }) => item.improvements).join(" ");
    expect(allImprovements).not.toContain("珑点去除");
  });

  it("zh results.treatmentResults에 '改善波山红' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    const items = i18n.zh.results.treatmentResults;
    const allImprovements = items.flatMap((item: { improvements: string[] }) => item.improvements).join(" ");
    expect(allImprovements).not.toContain("改善波山红");
  });
});

describe("PR-QA-P1: i18n.ja.ts 오탈자 수정 회귀 방지", () => {
  it("ja access.hoursNote가 '昂休み' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.ja.access.hoursNote).not.toContain("昂休み");
    expect(i18n.ja.access.hoursNote).toContain("昼休み");
  });

  it("ja access.parkingLabel이 '驐車場' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.ja.access.parkingLabel).not.toContain("驐車場");
    expect(i18n.ja.access.parkingLabel).toBe("駐車場");
  });

  it("ja footer.privacy가 '方针' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.ja.footer.privacy).not.toContain("方针");
    expect(i18n.ja.footer.privacy).toContain("方針");
  });

  it("ja doctors.careers에 '蔽山' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    const allCareers = i18n.ja.doctors.list.flatMap((d: { careers: string[] }) => d.careers).join(" ");
    expect(allCareers).not.toContain("蔽山");
  });

  it("ja doctors.careers에 'スタ皮膚科' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    const allCareers = i18n.ja.doctors.list.flatMap((d: { careers: string[] }) => d.careers).join(" ");
    expect(allCareers).not.toContain("スタ皮膚科");
  });

  it("ja reviews에 '膚トーン' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    const allTexts = i18n.ja.reviews.items.map((r: { text: string }) => r.text).join(" ");
    expect(allTexts).not.toContain("膚トーン");
  });

  it("ja reviews에 '膚の弾力' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    const allTexts = i18n.ja.reviews.items.map((r: { text: string }) => r.text).join(" ");
    expect(allTexts).not.toContain("膚の弾力");
  });
});

describe("PR-QA-P1: i18n doctors.teamLabel 추가 검증", () => {
  it("i18n.types.ts에 doctors.teamLabel 필드가 정의되어야 한다", () => {
    const { readFileSync } = require("node:fs");
    const nodePath = require("node:path");
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/lib/i18n.types.ts"),
      "utf8",
    );
    expect(src).toMatch(/teamLabel\??:/);
  });

  it("4개 언어 모두 doctors.teamLabel 값이 있어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.ko.doctors.teamLabel).toBeTruthy();
    expect(i18n.en.doctors.teamLabel).toBeTruthy();
    expect(i18n.ja.doctors.teamLabel).toBeTruthy();
    expect(i18n.zh.doctors.teamLabel).toBeTruthy();
  });
});

describe("PR-QA-P1: i18n access.mapAriaLabel/mapMarkerTitle 추가 검증", () => {
  it("4개 언어 모두 access.mapAriaLabel 값이 있어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.ko.access.mapAriaLabel).toBeTruthy();
    expect(i18n.en.access.mapAriaLabel).toBeTruthy();
    expect(i18n.ja.access.mapAriaLabel).toBeTruthy();
    expect(i18n.zh.access.mapAriaLabel).toBeTruthy();
  });

  it("4개 언어 모두 access.mapMarkerTitle 값이 있어야 한다", async () => {
    const { i18n } = await import("../client/src/lib/i18n");
    expect(i18n.ko.access.mapMarkerTitle).toBeTruthy();
    expect(i18n.en.access.mapMarkerTitle).toBeTruthy();
    expect(i18n.ja.access.mapMarkerTitle).toBeTruthy();
    expect(i18n.zh.access.mapMarkerTitle).toBeTruthy();
  });
});

describe("PR-QA-P1: useCountUp locale 파라미터 추가 검증", () => {
  it("useCountUp.ts에 locale 파라미터가 있어야 한다", () => {
    const { readFileSync } = require("node:fs");
    const nodePath = require("node:path");
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/hooks/useCountUp.ts"),
      "utf8",
    );
    expect(src).toMatch(/lang\?: string/);
    expect(src).toMatch(/LANG_TO_LOCALE/);
    expect(src).not.toMatch(/toLocaleString\(["']ko-KR["']\)/);
  });

  it("HeroSection.tsx가 useCountUp에 lang을 전달해야 한다", () => {
    const { readFileSync } = require("node:fs");
    const nodePath = require("node:path");
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/HeroSection.tsx"),
      "utf8",
    );
    expect(src).toMatch(/useCountUp\(.*lang\)/);
  });

  it("ResultsSection.tsx가 useCountUp에 lang을 전달해야 한다", () => {
    const { readFileSync } = require("node:fs");
    const nodePath = require("node:path");
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/ResultsSection.tsx"),
      "utf8",
    );
    expect(src).toMatch(/useCountUp\(.*lang\)/);
  });
});

describe("PR-QA-P1: YouTubeSection ?? fallback 제거 검증", () => {
  it("YouTubeSection.tsx에 i18n 키에 대한 ?? 한국어 fallback이 없어야 한다", () => {
    const { readFileSync } = require("node:fs");
    const nodePath = require("node:path");
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/YouTubeSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/yt\.\w+ \?\? ['"][가-힣]/);
    expect(src).not.toMatch(/yt\.\w+ \?\? 'YouTube/);
  });
});

describe("PR-QA-P1: DoctorsSection aria-label/eyebrow 하드코딩 제거 검증", () => {
  it("DoctorsSection.tsx에 aria-label 한국어 하드코딩이 없어야 한다", () => {
    const { readFileSync } = require("node:fs");
    const nodePath = require("node:path");
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/DoctorsSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/aria-label="의료진 소개"/);
    expect(src).toMatch(/aria-label=\{t\.doctors\.label\}/);
  });

  it("DoctorsSection.tsx에 'Medical Team' 하드코딩 문자열이 없어야 한다", () => {
    const { readFileSync } = require("node:fs");
    const nodePath = require("node:path");
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/DoctorsSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/>Medical Team</);
    expect(src).toMatch(/t\.doctors\.teamLabel/);
  });
});

/**
 * i18nText.test.ts
 * pickLocalized / pickLocalizedFaq 헬퍼 단위 테스트
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import nodePath from "node:path";
import { pickLocalized, pickLocalizedFaq } from "../../client/src/lib/i18nText";
import type { LocalizedString, LocalizedFaq } from "../../client/src/lib/i18nText";

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
    const { ulthera } = await import("../../client/src/data/treatments/ulthera");
    expect(ulthera.name.ko).toBeTruthy();
    expect(ulthera.name.en).toBeTruthy();
    expect(ulthera.name.ja).toBeTruthy();
    expect(ulthera.name.zh).toBeTruthy();
  });

  it("thermage has all 4 languages in seoTitle", async () => {
    const { thermage } = await import("../../client/src/data/treatments/thermage");
    expect(thermage.seoTitle.ko).toBeTruthy();
    expect(thermage.seoTitle.en).toBeTruthy();
    expect(thermage.seoTitle.ja).toBeTruthy();
    expect(thermage.seoTitle.zh).toBeTruthy();
  });

  it("under-eye-fat has faq in all 4 languages", async () => {
    const { underEyeFat } = await import("../../client/src/data/treatments/under-eye-fat");
    expect(underEyeFat.faq?.ko?.length).toBeGreaterThan(0);
    expect(underEyeFat.faq?.en?.length).toBeGreaterThan(0);
    expect(underEyeFat.faq?.ja?.length).toBeGreaterThan(0);
    expect(underEyeFat.faq?.zh?.length).toBeGreaterThan(0);
  });

  it("TREATMENT_DATA has 7 entries (PR-32: 4 new slugs added)", async () => {
    const { TREATMENT_DATA } = await import("../../client/src/data/treatments/index");
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
    const { getTreatmentBySlug } = await import("../../client/src/data/treatments/index");
    expect(getTreatmentBySlug("unknown-slug")).toBeUndefined();
    expect(getTreatmentBySlug(undefined)).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 회귀 방지: inline lang 삼항 제거 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("Step 2 i18n 일관성 — inline lang 삼항 제거 검증", () => {
  // readFileSync via top-level import (see below)
  // nodePath via top-level import (see below)
  const root = process.cwd();

  it("EquipmentTreatmentCard.tsx에 time/recovery 필드 inline lang 삼항이 없어야 한다", () => {
    // Step 4 리팩토링: 인라인 TreatmentCard 함수가 EquipmentTreatmentCard.tsx로 분리됨
    const src = readFileSync(
      nodePath.resolve(root, "client/src/components/treatments/EquipmentTreatmentCard.tsx"),
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
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.ko.access.mapViewLabel).toBeTruthy();
    expect(i18n.en.access.mapViewLabel).toBeTruthy();
    expect(i18n.ja.access.mapViewLabel).toBeTruthy();
    expect(i18n.zh.access.mapViewLabel).toBeTruthy();
  });

  it("i18n.ts 4개 언어 모두 mapAddressShort 값이 있어야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.ko.access.mapAddressShort).toBeTruthy();
    expect(i18n.en.access.mapAddressShort).toBeTruthy();
    expect(i18n.ja.access.mapAddressShort).toBeTruthy();
    expect(i18n.zh.access.mapAddressShort).toBeTruthy();
  });
});

describe("Directions 다국어·지도 회귀 방지", () => {
  it("5개 언어 모두 Directions의 필수 라벨과 버튼 텍스트를 제공한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    for (const lang of ["ko", "en", "ja", "zh", "zh-TW"] as const) {
      const directions = i18n[lang].directions;
      expect(directions.title).toBeTruthy();
      expect(directions.subtitle).toBeTruthy();
      expect(directions.addressLabel).toBeTruthy();
      expect(directions.phoneLabel).toBeTruthy();
      expect(directions.hoursLabel).toBeTruthy();
      expect(directions.copyAddress).toBeTruthy();
      expect(directions.kakaoMap).toBeTruthy();
      expect(directions.naverMap).toBeTruthy();
      expect(directions.googleMaps).toBeTruthy();
      expect(directions.mapTitle).toBeTruthy();
    }
  });

  it("5개 언어의 홈·Footer·Directions는 서면역 도보 시간을 3분으로 일치시킨다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    const expectedWalkText = {
      ko: "3분",
      ja: "徒歩3分",
      zh: "步行3分钟",
      "zh-TW": "步行3分鐘",
    } as const;

    const englishWalkPattern = /3(?:-minute|-min| min) walk/;
    const englishValues = [
      i18n.en.access.subway,
      i18n.en.access.transitDesc,
      i18n.en.directions.subwayInfo,
      i18n.en.footer.subwayInfo,
    ];
    for (const value of englishValues) {
      expect(value).toMatch(englishWalkPattern);
    }

    for (const [lang, walkText] of Object.entries(expectedWalkText) as Array<[keyof typeof expectedWalkText, string]>) {
      expect(i18n[lang].access.subway).toContain(walkText);
      expect(i18n[lang].access.transitDesc).toContain(walkText);
      expect(i18n[lang].directions.subwayInfo).toContain(walkText);
      expect(i18n[lang].footer.subwayInfo).toContain(walkText);
    }
  });

  it("Directions는 공통 지도 SDK와 언어별 오류 대체 링크를 사용한다", () => {
    const src = readFileSync(nodePath.resolve(process.cwd(), "client/src/pages/Directions.tsx"), "utf8");
    const mapSrc = readFileSync(nodePath.resolve(process.cwd(), "client/src/components/Map.tsx"), "utf8");
    expect(src).toMatch(/import \{ MapView \} from '@\/components\/Map'/);
    expect(src).toMatch(/<MapView/);
    expect(src).toMatch(/initialCenter=\{\{ lat: 35\.1572312, lng: 129\.0581932 \}\}/);
    expect(src).toMatch(/errorFallback=\{\(/);
    expect(src).toMatch(/mapFallbackUrl/);
    expect(src).toMatch(/mapFallbackLabel/);
    expect(src).not.toMatch(/maps\.google\.com\/maps/);
    expect(mapSrc).toMatch(/addListener\(map, 'tilesloaded'/);
    expect(mapSrc).toMatch(/setMapError\(true\)/);
  });

  it("Directions의 길찾기 버튼은 링크와 버튼을 중첩하지 않는다", () => {
    const src = readFileSync(nodePath.resolve(process.cwd(), "client/src/pages/Directions.tsx"), "utf8");
    expect(src).toMatch(/className=\{buttonVariants\(\{ className: "w-full bg-yellow-400/);
    expect(src).toMatch(/className=\{buttonVariants\(\{ className: "w-full bg-green-600/);
    expect(src).toMatch(/className=\{buttonVariants\(\{ className: "w-full bg-\[#4285F4\]/);
    expect(src).not.toMatch(/<Button/);
    expect(src).not.toMatch(/<a[\s\S]{0,80}<button/);
  });

  it("외국어 Directions는 언어별 Google Maps 길찾기를, 한국어는 카카오·네이버 지도를 유지한다", () => {
    const src = readFileSync(nodePath.resolve(process.cwd(), "client/src/pages/Directions.tsx"), "utf8");
    expect(src).toMatch(/www\.google\.com\/maps\/dir/);
    expect(src).toMatch(/hl=\$\{mapLanguage\[lang\]\}/);
    expect(src).toMatch(/lang === 'ko'/);
    expect(src).toMatch(/t\.directions\.googleMaps/);
    expect(src).toMatch(/HOSPITAL\.kakaoMapUrl/);
    expect(src).toMatch(/HOSPITAL\.naverMapUrl/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// P1 수정 회귀 방지 테스트 (PR-QA-P1)
// ─────────────────────────────────────────────────────────────────────────────
describe("PR-QA-P1: i18n.zh.ts 오탈자 수정 회귀 방지", () => {
  it("zh cta_kakao가 '咋讯' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.zh.hero.cta_kakao).not.toContain("咋讯");
    expect(i18n.zh.hero.cta_kakao).toContain("咨询");
  });

  it("zh cta_reserve가 '咋讯' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.zh.hero.cta_reserve).not.toContain("咋讯");
  });

  it("zh hours.title이 '诊疗安内' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.zh.hours.title).not.toContain("安内");
    expect(i18n.zh.hours.title).toBe("诊疗时间");
  });

  it("zh equipmentConsultBtn이 '和设备和论' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.zh.treatments.equipmentConsultBtn).not.toContain("和设备和论");
    expect(i18n.zh.treatments.equipmentConsultBtn).toContain("咨询");
  });

  it("zh floatingCta.callAria가 '和论' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.zh.floatingCta.callAria).not.toContain("和论");
    expect(i18n.zh.floatingCta.callAria).toContain("咨询");
  });

  it("zh results.treatmentResults에 '珑点去除' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    const items = i18n.zh.results.treatmentResults;
    const allImprovements = items.flatMap((item: { improvements: string[] }) => item.improvements).join(" ");
    expect(allImprovements).not.toContain("珑点去除");
  });

  it("zh results.treatmentResults에 '改善波山红' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    const items = i18n.zh.results.treatmentResults;
    const allImprovements = items.flatMap((item: { improvements: string[] }) => item.improvements).join(" ");
    expect(allImprovements).not.toContain("改善波山红");
  });
});

describe("PR-QA-P1: i18n.ja.ts 오탈자 수정 회귀 방지", () => {
  it("ja access.hoursNote가 '昂休み' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.ja.access.hoursNote).not.toContain("昂休み");
    expect(i18n.ja.access.hoursNote).toContain("昼休み");
  });

  it("ja access.parkingLabel이 '驐車場' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.ja.access.parkingLabel).not.toContain("驐車場");
    expect(i18n.ja.access.parkingLabel).toBe("駐車場");
  });

  it("ja footer.privacy가 '方针' 오탈자를 포함하지 않아야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.ja.footer.privacy).not.toContain("方针");
    expect(i18n.ja.footer.privacy).toContain("方針");
  });

  it("ja doctors.careers에 '蔽山' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    const allCareers = i18n.ja.doctors.list.flatMap((d: { careers: string[] }) => d.careers).join(" ");
    expect(allCareers).not.toContain("蔽山");
  });

  it("ja doctors.careers에 'スタ皮膚科' 오탈자가 없어야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    const allCareers = i18n.ja.doctors.list.flatMap((d: { careers: string[] }) => d.careers).join(" ");
    expect(allCareers).not.toContain("スタ皮膚科");
  });

  it("ja에 출처가 검증되지 않은 정적 후기 리소스가 없어야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.ja).not.toHaveProperty("reviews");
  });
});

describe("PR-QA-P1: i18n doctors.teamLabel 추가 검증", () => {
  it("i18n.types.ts에 doctors.teamLabel 필드가 정의되어야 한다", () => {
    // readFileSync via top-level import (see below)
    // nodePath via top-level import (see below)
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/lib/i18n.types.ts"),
      "utf8",
    );
    expect(src).toMatch(/teamLabel\??:/);
  });

  it("4개 언어 모두 doctors.teamLabel 값이 있어야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.ko.doctors.teamLabel).toBeTruthy();
    expect(i18n.en.doctors.teamLabel).toBeTruthy();
    expect(i18n.ja.doctors.teamLabel).toBeTruthy();
    expect(i18n.zh.doctors.teamLabel).toBeTruthy();
  });
});

describe("PR-QA-P1: i18n access.mapAriaLabel/mapMarkerTitle 추가 검증", () => {
  it("4개 언어 모두 access.mapAriaLabel 값이 있어야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.ko.access.mapAriaLabel).toBeTruthy();
    expect(i18n.en.access.mapAriaLabel).toBeTruthy();
    expect(i18n.ja.access.mapAriaLabel).toBeTruthy();
    expect(i18n.zh.access.mapAriaLabel).toBeTruthy();
  });

  it("4개 언어 모두 access.mapMarkerTitle 값이 있어야 한다", async () => {
    const { i18n } = await import("../../client/src/lib/i18n");
    expect(i18n.ko.access.mapMarkerTitle).toBeTruthy();
    expect(i18n.en.access.mapMarkerTitle).toBeTruthy();
    expect(i18n.ja.access.mapMarkerTitle).toBeTruthy();
    expect(i18n.zh.access.mapMarkerTitle).toBeTruthy();
  });
});

describe("PR-QA-P1: useCountUp locale 파라미터 추가 검증", () => {
  it("useCountUp.ts에 locale 파라미터가 있어야 한다", () => {
    // readFileSync via top-level import (see below)
    // nodePath via top-level import (see below)
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/hooks/useCountUp.ts"),
      "utf8",
    );
    expect(src).toMatch(/lang\?: string/);
    expect(src).toMatch(/LANG_TO_LOCALE/);
    expect(src).not.toMatch(/toLocaleString\(["']ko-KR["']\)/);
  });

  it("HeroSection.tsx가 useCountUp에 lang을 전달해야 한다", () => {
    // readFileSync via top-level import (see below)
    // nodePath via top-level import (see below)
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/HeroSection.tsx"),
      "utf8",
    );
    expect(src).toMatch(/useCountUp\(.*lang\)/);
  });

  it("ResultsSection.tsx가 useCountUp에 lang을 전달해야 한다", () => {
    // readFileSync via top-level import (see below)
    // nodePath via top-level import (see below)
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/ResultsSection.tsx"),
      "utf8",
    );
    expect(src).toMatch(/useCountUp\(.*lang\)/);
  });
});

describe("PR-QA-P1: YouTubeSection ?? fallback 제거 검증", () => {
  it("YouTubeSection.tsx에 i18n 키에 대한 ?? 한국어 fallback이 없어야 한다", () => {
    // readFileSync via top-level import (see below)
    // nodePath via top-level import (see below)
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
    // readFileSync via top-level import (see below)
    // nodePath via top-level import (see below)
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/DoctorsSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/aria-label="의료진 소개"/);
    expect(src).toMatch(/aria-label=\{t\.doctors\.label\}/);
  });

  it("DoctorsSection.tsx에 'Medical Team' 하드코딩 문자열이 없어야 한다", () => {
    // readFileSync via top-level import (see below)
    // nodePath via top-level import (see below)
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/DoctorsSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/>Medical Team</);
    expect(src).toMatch(/t\.doctors\.teamLabel/);
  });
});

// ─── Round-2 Senior Review Regression Tests ──────────────────────────────────

describe("Round-2 P1: FAQSection ctaLabel/ctaDesc i18n 키 적용 검증", () => {
  // readFileSync via top-level import (see below)
  // nodePath via top-level import (see below)

  it("FAQSection.tsx에 lang 삼항 ctaLabel/ctaDesc 하드코딩이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/FAQSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/isZH \? "微信和我联系"/);
    expect(src).not.toMatch(/isJA \? "LINE\u3067\u76f8\u8ac7"/);
    expect(src).not.toMatch(/faqCtaLabel = isZH/);
    expect(src).toMatch(/faqCtaLabel = faq\.ctaLabel/);
    expect(src).toMatch(/faqCtaDesc = faq\.ctaDesc/);
  });

  it("i18n 4개 언어 파일에 faq.ctaLabel/ctaDesc 키가 존재해야 한다", () => {
    const langs = ["ko", "en", "ja", "zh"];
    for (const lang of langs) {
      const src = readFileSync(
        nodePath.resolve(process.cwd(), `client/src/lib/i18n.${lang}.ts`),
        "utf8",
      );
      expect(src, `${lang}: faq.ctaLabel 누락`).toMatch(/ctaLabel:/);
      expect(src, `${lang}: faq.ctaDesc 누락`).toMatch(/ctaDesc:/);
    }
  });

  it("i18n.types.ts에 faq.ctaLabel/ctaDesc 타입이 선언되어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/lib/i18n.types.ts"),
      "utf8",
    );
    expect(src).toMatch(/ctaLabel: string/);
    expect(src).toMatch(/ctaDesc: string/);
  });
});

describe("Round-2 P1: TreatmentCard lang 삼항 제거 검증", () => {
  // readFileSync via top-level import (see below)
  // nodePath via top-level import (see below)

  it("TreatmentCard.tsx에 lang 삼항 ctaLabel 하드코딩이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/treatments/TreatmentCard.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/isZH \? "WeChat\u548c\u6211\u8054\u7cfb"/);
    expect(src).not.toMatch(/isJA \? "LINE\u3067\u76f8\u8ac7"/);
    expect(src).toMatch(/t\.treatments\.modalConsultBtn/);
  });

  it("TreatmentCard.tsx에 기대효과/자세히 보기 한국어 하드코딩이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/treatments/TreatmentCard.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/✨ 기대효과/);
    expect(src).not.toMatch(/자세히 보기/);
    expect(src).not.toMatch(/상세 보기/);
    expect(src).not.toMatch(/상세 정보/);
  });

  it("TreatmentCard.tsx에 t.treatments.modalTime/modalEffect/modalSessions 키가 사용되어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/treatments/TreatmentCard.tsx"),
      "utf8",
    );
    expect(src).toMatch(/t\.treatments\.modalTime/);
    expect(src).toMatch(/t\.treatments\.modalEffect/);
    expect(src).toMatch(/t\.treatments\.modalSessions/);
    expect(src).toMatch(/t\.treatments\.modalDetailBtn/);
  });
});

describe("Round-2 P1: EquipmentPanel fallback 제거 검증", () => {
  // readFileSync via top-level import (see below)
  // nodePath via top-level import (see below)

  it("EquipmentPanel.tsx에 한국어 ?? fallback이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/treatments/EquipmentPanel.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/\?\? "\uc811\uae30"/);
    expect(src).not.toMatch(/\?\? `\+\$\{items\.length - 4\}\uac1c \ub354 \ubcf4\uae30`/);
    expect(src).not.toMatch(/\?\? "\uc0c1\uc138 \uc124\uba85"/);
    expect(src).not.toMatch(/\?\? "\uad8c\uc7a5 \ud69f\uc218"/);
    expect(src).not.toMatch(/\?\? "\uae30\ub300 \ud6a8\uacfc"/);
  });

  it("EquipmentPanel.tsx에 aria-label 한국어 하드코딩이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/treatments/EquipmentPanel.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/\uC7A5\uBE44 \uC0C1\uC138 \uBCF4\uAE30/);
    expect(src).toMatch(/tr\.modalDetailBtn/);
  });

  it("EquipmentPanel.tsx에 DialogTitle 한국어 하드코딩이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/treatments/EquipmentPanel.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/\uC0C1\uC138 \uC815\uBCF4/);
    expect(src).toMatch(/tr\.modalDetailBtn/);
  });
});

describe("Round-2 P1: HeroSection scrollLabel fallback 제거 검증", () => {
  // readFileSync via top-level import (see below)
  // nodePath via top-level import (see below)

  it("HeroSection.tsx에 scrollLabel ?? 'Scroll' fallback이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/HeroSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/scrollLabel \?\? "Scroll"/);
    expect(src).toMatch(/t\.hero\.scrollLabel/);
  });

  it("HeroSection.tsx에 aria-label 한국어 하드코딩이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/HeroSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/aria-label="\uC544\uB798\uB85C \uC2A4\uD06C\uB864"/);
  });
});

describe("Round-2 P1: ContactSection mapAriaLabel/mapMarkerTitle fallback 제거 검증", () => {
  // readFileSync via top-level import (see below)
  // nodePath via top-level import (see below)

  it("ContactSection.tsx에 mapAriaLabel 한국어 fallback이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/ContactSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/mapAriaLabel \?\? "\uC2A4\uD0C0\uD53C\uBD80\uACFC \uC704\uCE58 \uC9C0\uB3C4/);
    expect(src).toMatch(/aria-label=\{mapTitle\}/);
    expect(src).toMatch(/title=\{mapTitle\}/);
  });

  it("ContactSection.tsx에 mapMarkerTitle 한국어 fallback이 없어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/components/ContactSection.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/mapMarkerTitle \?\? "\uC2A4\uD0C0\uD53C\uBD80\uACFC \uC11C\uBA74/);
  });
});
describe("Round-2 P2: noindex 페이지 pageType=\"admin\" 명시 검증", () => {
  // readFileSync via top-level import (see below)
  // nodePath via top-level import (see below)

  it("Privacy.tsx SeoHead에 pageType=\"admin\"이 명시되어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/pages/Privacy.tsx"),
      "utf8",
    );
    expect(src).toMatch(/pageType="admin"/);
  });

  it("NotFound.tsx SeoHead에 pageType=\"admin\"이 명시되어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/pages/NotFound.tsx"),
      "utf8",
    );
    expect(src).toMatch(/pageType="admin"/);
  });

  it("Reserve.tsx SeoHead에 pageType=\"admin\"이 명시되어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/pages/Reserve.tsx"),
      "utf8",
    );
    expect(src).toMatch(/pageType="admin"/);
  });
});
describe("1: i18n.ja.ts modalConsultBtn LINE 수정 검증", () => {
  // readFileSync via top-level import (see below)
  // nodePath via top-level import (see below)

  it("i18n.ja.ts treatments.modalConsultBtn이 LINE 기반이어야 한다", () => {
    const src = readFileSync(
      nodePath.resolve(process.cwd(), "client/src/lib/i18n.ja.ts"),
      "utf8",
    );
    expect(src).not.toMatch(/modalConsultBtn: "KakaoTalk\u3067\u76f8\u8ac7\u3059\u308b"/);
    expect(src).toMatch(/modalConsultBtn: "LINE\u3067\u76f8\u8ac7\u3059\u308b"/);
  });
});

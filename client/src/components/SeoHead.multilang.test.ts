/**
 * SeoHead 다국어 SEO 상수 회귀 방지 테스트
 *
 * 목적:
 *   - OG_IMAGE_LOCALIZED: 4개 언어별 OG 이미지 URL이 올바른 manus-storage 경로인지 검증
 *   - SITE_NAME_LOCALIZED: 4개 언어별 사이트명이 올바르게 설정되어 있는지 검증
 *   - LANG_TO_OG_LOCALE: BCP 47 locale 코드 매핑 정확성 검증
 *   - ALL_OG_LOCALES: 전체 locale 목록 완전성 검증
 *   - buildHreflangs: 언어별 hreflang URL 생성 정확성 검증
 *   - COMMON_HREFLANGS: 공통 hreflang 목록 완전성 검증
 *   - [R18-P2-8] SEO_PRESETS: pageType → schema 조합 검증
 *   - [R18-P2-8] buildClinicJsonLd: MedicalBusiness 스키마 출력 검증
 *   - [R18-P2-8] buildWebSiteJsonLd: WebSite 스키마 출력 검증
 *   - [R18-P2-8] buildBreadcrumbJsonLd: BreadcrumbList 스키마 출력 검증
 */
import { describe, it, expect } from "vitest";
import {
  OG_IMAGE_LOCALIZED,
  SITE_NAME_LOCALIZED,
  LANG_TO_OG_LOCALE,
  ALL_OG_LOCALES,
  COMMON_HREFLANGS,
  BASE_URL,
  buildHreflangs,
  SEO_PRESETS,
  buildClinicJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
} from "./SeoHead";

describe("OG_IMAGE_LOCALIZED", () => {
  const SUPPORTED_LANGS = ["ko", "en", "ja", "zh"] as const;

  it("4개 언어 모두 OG 이미지 URL이 정의되어 있어야 한다", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(OG_IMAGE_LOCALIZED[lang]).toBeDefined();
      expect(OG_IMAGE_LOCALIZED[lang].length).toBeGreaterThan(0);
    }
  });

  it("모든 OG 이미지 URL이 manus-storage 또는 api/storage 경로를 사용해야 한다", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(OG_IMAGE_LOCALIZED[lang]).toMatch(/^\/(?:manus-storage|api\/storage)\//);
    }
  });

  it("ko OG 이미지 URL이 올바른 경로여야 한다", () => {
    expect(OG_IMAGE_LOCALIZED.ko).toBe("/api/storage/og-image-ko_5fc1105f.jpg");
  });

  it("en OG 이미지 URL이 올바른 경로여야 한다", () => {
    expect(OG_IMAGE_LOCALIZED.en).toBe("/api/storage/og-image-en_dc8cb653.jpg");
  });

  it("ja OG 이미지 URL이 올바른 경로여야 한다", () => {
    expect(OG_IMAGE_LOCALIZED.ja).toBe("/api/storage/og-image-ja_273d0e42.jpg");
  });

  it("zh OG 이미지 URL이 올바른 경로여야 한다", () => {
    expect(OG_IMAGE_LOCALIZED.zh).toBe("/api/storage/og-image-zh_31a7313b.jpg");
  });

  it("구 cloudfront URL이 남아있지 않아야 한다 (회귀 방지)", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(OG_IMAGE_LOCALIZED[lang]).not.toContain("cloudfront.net");
    }
  });
});

describe("SITE_NAME_LOCALIZED", () => {
  it("ko 사이트명이 한국어여야 한다", () => {
    expect(SITE_NAME_LOCALIZED.ko).toBe("부산 서면 스타피부과");
  });

  it("en 사이트명이 영어여야 한다", () => {
    expect(SITE_NAME_LOCALIZED.en).toBe("Star Dermatology Busan");
  });

  it("ja 사이트명이 일본어여야 한다", () => {
    expect(SITE_NAME_LOCALIZED.ja).toBe("釜山スター皮膚科");
  });

  it("zh 사이트명이 중국어여야 한다", () => {
    expect(SITE_NAME_LOCALIZED.zh).toBe("釜山STAR皮肤科");
  });

  it("4개 언어 모두 사이트명이 정의되어 있어야 한다", () => {
    for (const lang of ["ko", "en", "ja", "zh"]) {
      expect(SITE_NAME_LOCALIZED[lang]).toBeDefined();
      expect(SITE_NAME_LOCALIZED[lang].length).toBeGreaterThan(0);
    }
  });
});

describe("LANG_TO_OG_LOCALE", () => {
  it("ko → ko_KR 매핑이 올바르다", () => {
    expect(LANG_TO_OG_LOCALE.ko).toBe("ko_KR");
  });

  it("en → en_US 매핑이 올바르다", () => {
    expect(LANG_TO_OG_LOCALE.en).toBe("en_US");
  });

  it("ja → ja_JP 매핑이 올바르다", () => {
    expect(LANG_TO_OG_LOCALE.ja).toBe("ja_JP");
  });

  it("zh → zh_CN 매핑이 올바르다", () => {
    expect(LANG_TO_OG_LOCALE.zh).toBe("zh_CN");
  });
});

describe("ALL_OG_LOCALES", () => {
  it("4개 locale이 모두 포함되어 있어야 한다", () => {
    expect(ALL_OG_LOCALES).toContain("ko_KR");
    expect(ALL_OG_LOCALES).toContain("en_US");
    expect(ALL_OG_LOCALES).toContain("ja_JP");
    expect(ALL_OG_LOCALES).toContain("zh_CN");
  });

  it("정확히 5개 locale이 있어야 한다 (zh-TW 포함)", () => {
    expect(ALL_OG_LOCALES).toHaveLength(5);
    expect(ALL_OG_LOCALES).toContain("zh_TW");
  });
});

describe("COMMON_HREFLANGS", () => {
  it("ko, en, ja, zh, zh-TW, x-default 6개 항목이 있어야 한다", () => {
    expect(COMMON_HREFLANGS).toHaveLength(6);
    const zhTW = COMMON_HREFLANGS.find((h) => h.hreflang === "zh-TW");
    expect(zhTW).toBeDefined();
    expect(zhTW!.href).toBe(`${BASE_URL}/zh-tw`);
  });

  it("ko hreflang이 BASE_URL 루트를 가리켜야 한다", () => {
    const ko = COMMON_HREFLANGS.find((h) => h.hreflang === "ko");
    expect(ko).toBeDefined();
    expect(ko!.href).toBe(`${BASE_URL}/`);
  });

  it("en hreflang이 /en 경로를 가리켜야 한다", () => {
    const en = COMMON_HREFLANGS.find((h) => h.hreflang === "en");
    expect(en).toBeDefined();
    expect(en!.href).toBe(`${BASE_URL}/en`);
  });

  it("ja hreflang이 /ja 경로를 가리켜야 한다", () => {
    const ja = COMMON_HREFLANGS.find((h) => h.hreflang === "ja");
    expect(ja).toBeDefined();
    expect(ja!.href).toBe(`${BASE_URL}/ja`);
  });

  it("zh hreflang이 /zh 경로를 가리켜야 한다", () => {
    const zh = COMMON_HREFLANGS.find((h) => h.hreflang === "zh");
    expect(zh).toBeDefined();
    expect(zh!.href).toBe(`${BASE_URL}/zh`);
  });

  it("x-default hreflang이 BASE_URL 루트를 가리켜야 한다", () => {
    const xDefault = COMMON_HREFLANGS.find((h) => h.hreflang === "x-default");
    expect(xDefault).toBeDefined();
    expect(xDefault!.href).toBe(`${BASE_URL}/`);
  });
});

describe("buildHreflangs", () => {
  it("koPath만 전달하면 en/ja/zh는 기본 경로를 사용해야 한다", () => {
    const result = buildHreflangs("/about");
    expect(result.find((h) => h.hreflang === "ko")!.href).toBe(`${BASE_URL}/about`);
    expect(result.find((h) => h.hreflang === "en")!.href).toBe(`${BASE_URL}/en`);
    expect(result.find((h) => h.hreflang === "ja")!.href).toBe(`${BASE_URL}/ja`);
    expect(result.find((h) => h.hreflang === "zh")!.href).toBe(`${BASE_URL}/zh`);
    expect(result.find((h) => h.hreflang === "x-default")!.href).toBe(`${BASE_URL}/about`);
  });

  it("모든 경로를 전달하면 각 언어별 경로가 올바르게 생성되어야 한다", () => {
    const result = buildHreflangs("/", "/en", "/ja", "/zh");
    expect(result.find((h) => h.hreflang === "ko")!.href).toBe(`${BASE_URL}/`);
    expect(result.find((h) => h.hreflang === "en")!.href).toBe(`${BASE_URL}/en`);
    expect(result.find((h) => h.hreflang === "ja")!.href).toBe(`${BASE_URL}/ja`);
    expect(result.find((h) => h.hreflang === "zh")!.href).toBe(`${BASE_URL}/zh`);
  });

  it("결과에 6개 항목(ko, en, ja, zh, zh-TW, x-default)이 있어야 한다", () => {
    const result = buildHreflangs("/");
    expect(result).toHaveLength(6);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// [R18-P2-8] SEO_PRESETS 출력 테스트 (pageType → schema 조합 검증)
// ─────────────────────────────────────────────────────────────────────────────

describe("SEO_PRESETS", () => {
  it("home 프리셋은 MedicalBusiness + WebSite 스키마를 모두 포함해야 한다", () => {
    expect(SEO_PRESETS.home.includeMedicalSchema).toBe(true);
    expect(SEO_PRESETS.home.includeWebSiteSchema).toBe(true);
  });

  it("treatment 프리셋은 MedicalBusiness만 포함해야 한다", () => {
    expect(SEO_PRESETS.treatment.includeMedicalSchema).toBe(true);
    expect(SEO_PRESETS.treatment.includeWebSiteSchema).toBe(false);
  });

  it("default 프리셋은 MedicalBusiness만 포함해야 한다", () => {
    expect(SEO_PRESETS.default.includeMedicalSchema).toBe(true);
    expect(SEO_PRESETS.default.includeWebSiteSchema).toBe(false);
  });

  it("admin 프리셋은 스키마를 포함하지 않아야 한다", () => {
    expect(SEO_PRESETS.admin.includeMedicalSchema).toBe(false);
    expect(SEO_PRESETS.admin.includeWebSiteSchema).toBe(false);
  });

  it("SEO_PRESETS에 4개 pageType이 모두 정의되어 있어야 한다", () => {
    const keys = Object.keys(SEO_PRESETS);
    expect(keys).toContain("home");
    expect(keys).toContain("treatment");
    expect(keys).toContain("default");
    expect(keys).toContain("admin");
    expect(keys).toHaveLength(4);
  });
});

describe("buildClinicJsonLd", () => {
  it("@type이 MedicalBusiness를 포함해야 한다", () => {
    const schema = buildClinicJsonLd();
    const types = schema["@type"] as string | string[];
    const typeList = Array.isArray(types) ? types : [types];
    expect(typeList).toContain("MedicalBusiness");
  });

  it("@context가 https://schema.org여야 한다", () => {
    const schema = buildClinicJsonLd();
    expect(schema["@context"]).toBe("https://schema.org");
  });

  it("name 필드가 존재해야 한다", () => {
    const schema = buildClinicJsonLd();
    expect(typeof schema["name"]).toBe("string");
    expect((schema["name"] as string).length).toBeGreaterThan(0);
  });

  it("address 필드가 존재해야 한다", () => {
    const schema = buildClinicJsonLd();
    expect(schema["address"]).toBeDefined();
  });

  it("telephone 필드가 존재해야 한다", () => {
    const schema = buildClinicJsonLd();
    expect(typeof schema["telephone"]).toBe("string");
  });

  it("url 필드가 BASE_URL을 포함해야 한다", () => {
    const schema = buildClinicJsonLd();
    expect(schema["url"]).toContain("star-pibu.com");
  });
});

describe("buildWebSiteJsonLd", () => {
  it("@type이 WebSite여야 한다", () => {
    const schema = buildWebSiteJsonLd();
    expect(schema["@type"]).toBe("WebSite");
  });

  it("url 필드가 BASE_URL이어야 한다", () => {
    const schema = buildWebSiteJsonLd();
    expect(schema["url"]).toBe("https://star-pibu.com");
  });

  it("name 필드가 존재해야 한다", () => {
    const schema = buildWebSiteJsonLd();
    expect(typeof schema["name"]).toBe("string");
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("빈 배열을 전달하면 itemListElement가 비어있어야 한다", () => {
    const schema = buildBreadcrumbJsonLd([]);
    // seoHelpers는 빈 배열에도 빈 BreadcrumbList를 반환하도록 설계됨
    // null 반환 또는 빈 itemListElement 중 하나여야 함
    if (schema === null) {
      expect(schema).toBeNull();
    } else {
      const list = schema["itemListElement"] as unknown[];
      expect(list).toHaveLength(0);
    }
  });

  it("@type이 BreadcrumbList여야 한다", () => {
    const schema = buildBreadcrumbJsonLd([{ name: "홈", url: "https://star-pibu.com/" }]);
    expect(schema?.["@type"]).toBe("BreadcrumbList");
  });

  it("itemListElement 배열 길이가 입력 배열과 일치해야 한다", () => {
    const items = [
      { name: "홈", url: "https://star-pibu.com/" },
      { name: "시술", url: "https://star-pibu.com/treatments" },
    ];
    const schema = buildBreadcrumbJsonLd(items);
    const list = schema?.["itemListElement"] as unknown[];
    expect(list).toHaveLength(2);
  });

  it("각 ListItem에 position, name, item 필드가 있어야 한다", () => {
    const schema = buildBreadcrumbJsonLd([{ name: "홈", url: "https://star-pibu.com/" }]);
    const item = (schema?.["itemListElement"] as Record<string, unknown>[])[0];
    expect(item["position"]).toBe(1);
    expect(item["name"]).toBe("홈");
    expect(item["item"]).toBe("https://star-pibu.com/");
  });
});

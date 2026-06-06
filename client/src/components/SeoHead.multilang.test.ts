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
} from "./SeoHead";

describe("OG_IMAGE_LOCALIZED", () => {
  const SUPPORTED_LANGS = ["ko", "en", "ja", "zh"] as const;

  it("4개 언어 모두 OG 이미지 URL이 정의되어 있어야 한다", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(OG_IMAGE_LOCALIZED[lang]).toBeDefined();
      expect(OG_IMAGE_LOCALIZED[lang].length).toBeGreaterThan(0);
    }
  });

  it("모든 OG 이미지 URL이 manus-storage 경로를 사용해야 한다", () => {
    for (const lang of SUPPORTED_LANGS) {
      expect(OG_IMAGE_LOCALIZED[lang]).toMatch(/^\/manus-storage\//);
    }
  });

  it("ko OG 이미지 URL이 올바른 경로여야 한다", () => {
    expect(OG_IMAGE_LOCALIZED.ko).toBe("/manus-storage/og-image-ko_5fc1105f.jpg");
  });

  it("en OG 이미지 URL이 올바른 경로여야 한다", () => {
    expect(OG_IMAGE_LOCALIZED.en).toBe("/manus-storage/og-image-en_dc8cb653.jpg");
  });

  it("ja OG 이미지 URL이 올바른 경로여야 한다", () => {
    expect(OG_IMAGE_LOCALIZED.ja).toBe("/manus-storage/og-image-ja_273d0e42.jpg");
  });

  it("zh OG 이미지 URL이 올바른 경로여야 한다", () => {
    expect(OG_IMAGE_LOCALIZED.zh).toBe("/manus-storage/og-image-zh_31a7313b.jpg");
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

  it("정확히 4개 locale이 있어야 한다", () => {
    expect(ALL_OG_LOCALES).toHaveLength(4);
  });
});

describe("COMMON_HREFLANGS", () => {
  it("ko, en, ja, zh, x-default 5개 항목이 있어야 한다", () => {
    expect(COMMON_HREFLANGS).toHaveLength(5);
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

  it("결과에 5개 항목(ko, en, ja, zh, x-default)이 있어야 한다", () => {
    const result = buildHreflangs("/");
    expect(result).toHaveLength(5);
  });
});

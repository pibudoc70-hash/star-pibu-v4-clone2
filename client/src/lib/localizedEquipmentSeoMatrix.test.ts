import { describe, expect, it } from "vitest";
import { getLocalizedUrl } from "./localizedPath";
import { BASE_URL, buildHreflangs } from "./seoHelpers";

type Locale = "ko" | "en" | "ja" | "zh" | "zh-TW";

/**
 * 2026-08-28 공개 sitemap-global.xml에서 추출한 활성·번역 완결 장비 상세 slug 72건.
 * 장비 등록 또는 locale 완결성 변경 시 sitemap 전수 검증과 함께 이 목록을 갱신한다.
 */
const ACTIVE_LOCALIZED_EQUIPMENT_SLUGS = `
aptos
bbl-laser
bbl-%EB%A0%88%EC%9D%B4%EC%A0%80
bbl-%EC%8A%A4%ED%82%A8%ED%83%80%EC%9D%B4%ED%8A%B8
belotero-revive
blood-stem-cell
botox-injection
drt-%EC%A7%84%ED%94%BC%EC%9E%AC%EC%83%9D%EC%88%A0
enlighten-ruby-pico-3rd
excel-v-plus
fat-stem-cell
lumenis-one-pigment
lumenis-one-rosacea
maqx
metacell-mct
miraDry-acne
mirajet-scar
sculptra-volume
ultherapy-thermage-lift-rejuran
under-eye-fat-repositioning
%EA%B3%A0%EB%B0%94%EC%95%BC%EC%8B%9C-%EC%A0%88%EC%97%B0%EC%B9%A8
%EB%84%A4%EC%98%A4%EC%A0%A0-%ED%94%8C%EB%9D%BC%EC%A6%88%EB%A7%88
%EB%89%B4-%EC%9A%B8%ED%8A%B8%EB%9D%BC-%ED%8E%84%EC%8A%A4-%EC%95%99%EC%BD%94%EB%A5%B4-%EC%8A%A4%EC%B9%B4-fx
%EB%8B%A4%ED%95%9C%EC%A6%9D-%EB%B3%B4%ED%86%A1%EC%8A%A4
%EB%9D%BC%EC%85%88%EB%93%9C-%EC%9A%B8%ED%8A%B8%EB%9D%BC
%EB%9F%B0%EC%B9%98%ED%83%80%EC%9E%84-%EB%88%88%EB%B0%91%EB%A0%88%EC%9D%B4%EC%A0%80
%EB%A6%AC%EC%A5%AC%EB%9E%80-%ED%9E%90%EB%9F%AC
%EB%A6%AC%EC%A5%AC%EB%9E%80-%ED%9E%90%EB%9F%AC-%ED%94%8C%EB%9F%AC%EC%8A%A4
%EB%A6%AC%ED%88%AC%EC%98%A4
%EB%A6%AC%ED%8F%AC%EC%85%8B
%EB%AA%A8%EB%9E%98%EC%95%8C-%ED%94%BC%EB%B6%80%EC%9D%B4%EC%8B%9D
%EB%AA%A8%EB%9E%98%EC%95%8C-%ED%94%BC%EB%B6%80%EC%9D%B4%EC%8B%9D-2
%EB%B2%84%EC%B8%84rf
%EB%B2%A8%EB%A1%9C%EC%8B%9C%ED%8B%B0-%EC%97%91%EC%8B%9C%EB%A8%B8-v7
%EB%B2%A8%EB%A1%9C%EC%8B%9C%ED%8B%B0-%EC%97%91%EC%8B%9C%EB%A8%B8-v7-2
%EC%84%B8%EB%A5%B4%ED%94%84
%EC%8A%88%EB%A7%81%ED%81%AC-%EC%9C%A0%EB%8B%88%EB%B2%84%EC%8A%A4
%EC%8A%A4%ED%82%A8%EB%B6%80%EC%8A%A4%ED%84%B0
%EC%8B%9C%EB%84%88%EC%A7%80
%EC%8D%A8%EB%A7%88%EC%A7%80FLX
%EC%95%84%EB%93%9C%EB%B0%94-tx
%EC%95%84%EB%B9%84%ED%81%B4%EB%A6%AC%EC%96%B4
%EC%95%84%ED%86%A0%ED%94%BC-%ED%94%BC%EB%B6%80%EC%97%BC-%EB%B3%B5%ED%95%A9-%EC%B9%98%EB%A3%8C
%EC%97%91%EC%85%80-vplus
%EC%97%91%EC%85%80-%ED%86%A0%EC%9A%B0
%EC%97%91%EC%86%8C%EC%A2%80
%EC%98%A4%EB%8B%88%EC%BD%94
%EC%98%A8%EB%8B%A4
%EC%9A%B8%EC%8E%84%EB%9D%BC%ED%94%BC%ED%94%84%EB%9D%BC%EC%9E%84
%EC%9C%A4%EA%B3%BD-%EC%A3%BC%EC%82%AC
%EC%A0%84%EC%8B%A0-%EC%9E%90%EC%99%B8%EC%84%A0-%EA%B4%91%EC%84%A0-%EC%B9%98%EB%A3%8C%EA%B8%B0
%EC%A0%84%EC%8B%A0-%EC%9E%90%EC%99%B8%EC%84%A0-%EA%B4%91%EC%84%A0-%EC%B9%98%EB%A3%8C%EA%B8%B0-2
%EC%A4%84%EA%B8%B0%EC%84%B8%ED%8F%AC%EC%B9%98%EB%A3%8C
%EC%A5%AC%EB%B2%A0%EB%A3%A9
%EC%A5%AC%EB%B2%A0%EB%A3%A9-%EB%B3%BC%EB%A5%A8
%EC%A5%B4-%ED%94%84%EB%A1%9C%ED%94%84%EB%9D%BD%EC%85%94%EB%84%90
%EC%A5%B4-%ED%97%A4%EC%9D%BC%EB%A1%9C
%EC%B9%B4%ED%94%84%EB%A6%AC
%EC%BD%9C%EB%9D%BC%EA%B2%90-%EC%A3%BC%EC%82%AC
%ED%81%90%EC%96%B4%EB%A7%A5%EC%8A%A4
%ED%85%90%EC%8D%A8%EB%A7%88
%ED%85%90%EC%8E%84%EB%9D%BC
%ED%8A%B8%EB%A6%AC%EB%8B%88%ED%8B%B0-%EB%A6%AC%ED%94%84%ED%86%A0%EB%8B%9D
%ED%8A%B8%EB%A6%AC%ED%95%84-%ED%94%84%EB%A1%9C
%ED%8E%9C%ED%86%A0-9900
%ED%8E%9C%ED%86%A0-9900-2
%ED%94%84%EB%A1%9C%ED%8C%8C%EC%9A%B4%EB%93%9C
%ED%94%8C%EB%9D%BC%EB%93%80%EC%98%A4
%ED%94%8C%EB%9E%98%ED%8B%B0%EB%84%98-ptt
%ED%95%80%ED%8F%AC%EC%9D%B8%ED%8A%B8
%ED%95%84%EB%9F%AC
%ED%9E%90%EB%9F%AC-1064
`.trim().split("\n").map((slug) => decodeURIComponent(slug));

const LOCALES: Array<{ locale: Locale; prefix: string }> = [
  { locale: "ko", prefix: "" },
  { locale: "en", prefix: "/en" },
  { locale: "ja", prefix: "/ja" },
  { locale: "zh", prefix: "/zh" },
  { locale: "zh-TW", prefix: "/zh-tw" },
];

function localizedEquipmentPath(locale: Locale, slug: string): string {
  const prefix = LOCALES.find((candidate) => candidate.locale === locale)?.prefix;
  if (prefix === undefined) throw new Error(`Unsupported locale: ${locale}`);
  return `${prefix}/equipment3/${slug}`;
}

describe("active localized equipment detail SEO URL matrix", () => {
  it("locks the currently indexed set of 72 localization-complete equipment detail pages", () => {
    expect(ACTIVE_LOCALIZED_EQUIPMENT_SLUGS).toHaveLength(72);
    expect(new Set(ACTIVE_LOCALIZED_EQUIPMENT_SLUGS).size).toBe(72);
  });

  it.each(ACTIVE_LOCALIZED_EQUIPMENT_SLUGS)("keeps canonical and hreflang contracts for %s", (slug) => {
    const paths = Object.fromEntries(
      LOCALES.map(({ locale }) => [locale, localizedEquipmentPath(locale, slug)]),
    ) as Record<Locale, string>;
    const hreflangs = buildHreflangs(paths.ko, paths.en, paths.ja, paths.zh, paths["zh-TW"]);

    expect(hreflangs).toEqual([
      { hreflang: "ko", href: `${BASE_URL}${paths.ko}` },
      { hreflang: "en", href: `${BASE_URL}${paths.en}` },
      { hreflang: "ja", href: `${BASE_URL}${paths.ja}` },
      { hreflang: "zh", href: `${BASE_URL}${paths.zh}` },
      { hreflang: "zh-TW", href: `${BASE_URL}${paths["zh-TW"]}` },
      { hreflang: "x-default", href: `${BASE_URL}${paths.ko}` },
    ]);

    LOCALES.forEach(({ locale }) => {
      const canonical = getLocalizedUrl(locale, `/equipment3/${slug}`);
      expect(canonical).toBe(`${BASE_URL}${paths[locale]}`);
      expect(canonical).not.toContain("?");
      expect(canonical).not.toContain("#");
    });
  });
});

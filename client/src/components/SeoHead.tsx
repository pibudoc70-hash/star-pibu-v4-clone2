/**
 * SeoHead - 범용 SEO 메타태그 컴포넌트
 * react-helmet-async 기반으로 title, description, OG, Twitter, canonical,
 * hreflang, og:locale, JSON-LD 구조화 데이터를 선언적으로 주입합니다.
 *
 * 사용법:
 *   <SeoHead
 *     title="페이지 제목"
 *     description="페이지 설명"
 *     canonical="https://www.star-pibu.com/treatments/ulthera"
 *     ogImage="https://cdn.example.com/image.jpg"
 *     ogLocale="ko_KR"
 *     ogLocaleAlternates={["en_US", "ja_JP", "zh_CN"]}
 *     jsonLd={[{ "@context": "https://schema.org", ... }]}
 *   />
 */
import { Helmet } from "react-helmet-async";

/** Schema.org JSON-LD 구조화 데이터 타입 */
export type JsonLdSchema = Record<string, unknown>;

export interface SeoHeadProps {
  /** <title> 태그 값 */
  title: string;
  /** meta description */
  description?: string;
  /** meta keywords */
  keywords?: string;
  /** canonical URL */
  canonical?: string;
  /** OG/Twitter 이미지 URL */
  ogImage?: string;
  /** OG URL (canonical과 다를 경우 별도 지정) */
  ogUrl?: string;
  /** OG type (default: "website") */
  ogType?: string;
  /** JSON-LD 구조화 데이터 배열 */
  jsonLd?: JsonLdSchema[];
  /** hreflang 언어 대체 URL 목록 */
  hreflangs?: { hreflang: string; href: string }[];
  /** noindex 여부 (관리자 페이지 등) */
  noindex?: boolean;
  /**
   * og:locale (BCP 47 형식, e.g. "ko_KR", "en_US", "ja_JP", "zh_CN")
   * 미지정 시 기본값 "ko_KR" 적용
   */
  ogLocale?: string;
  /** og:locale:alternate 목록 */
  ogLocaleAlternates?: string[];
}

export const SITE_NAME = "부산 서면 스타피부과";
export const BASE_URL = "https://www.star-pibu.com";

/** 공통 hreflang 목록 (모든 페이지에서 재사용) */
export const COMMON_HREFLANGS = [
  { hreflang: "ko", href: `${BASE_URL}/` },
  { hreflang: "en", href: `${BASE_URL}/en` },
  { hreflang: "ja", href: `${BASE_URL}/ja` },
  { hreflang: "zh", href: `${BASE_URL}/zh` },
  { hreflang: "x-default", href: `${BASE_URL}/` },
];

/** 다국어 og:locale 매핑 */
export const LANG_TO_OG_LOCALE: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

/** 다국어 og:locale:alternate 목록 */
export const ALL_OG_LOCALES = ["ko_KR", "en_US", "ja_JP", "zh_CN"];

export default function SeoHead({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogUrl,
  ogType = "website",
  jsonLd,
  hreflangs,
  noindex = false,
  ogLocale = "ko_KR",
  ogLocaleAlternates,
}: SeoHeadProps) {
  const resolvedOgUrl = ogUrl ?? canonical ?? BASE_URL;
  const alternates = ogLocaleAlternates ?? ALL_OG_LOCALES.filter((l) => l !== ogLocale);

  return (
    <Helmet>
      {/* 기본 메타 */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* hreflang */}
      {hreflangs?.map(({ hreflang, href }) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={resolvedOgUrl} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:locale" content={ogLocale} />
      {alternates.map((loc) => (
        <meta key={loc} property="og:locale:alternate" content={loc} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD 구조화 데이터 */}
      {jsonLd?.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

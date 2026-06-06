// SeoHead.tsx — SEO 메타 컴포넌트 (STRUCT-SEO-2)
// 상수/헬퍼는 @/lib/seoHelpers에서 관리, 기존 import 경로 유지를 위해 re-export
import { Helmet } from "react-helmet-async";
import {
  JsonLdSchema,
  SITE_NAME,
  BASE_URL,
  SITE_NAME_LOCALIZED,
  OG_IMAGE_LOCALIZED,
  COMMON_HREFLANGS,
  LANG_TO_OG_LOCALE,
  ALL_OG_LOCALES,
  buildHreflangs,
  buildClinicJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seoHelpers";

// Re-export for backward compatibility (기존 import 경로 유지)
export type { JsonLdSchema } from "@/lib/seoHelpers";
export {
  SITE_NAME,
  BASE_URL,
  SITE_NAME_LOCALIZED,
  OG_IMAGE_LOCALIZED,
  COMMON_HREFLANGS,
  LANG_TO_OG_LOCALE,
  ALL_OG_LOCALES,
  buildHreflangs,
  buildClinicJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seoHelpers";

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
  /** 페이지별 추가 JSON-LD 구조화 데이터 배열 */
  jsonLd?: JsonLdSchema[];
  /** hreflang 언어 대체 URL 목록 */
  hreflangs?: { hreflang: string; href: string }[];
  /** noindex 여부 */
  noindex?: boolean;
  /** og:locale (BCP 47 형식, e.g. "ko_KR") */
  ogLocale?: string;
  /** og:locale:alternate 목록 */
  ogLocaleAlternates?: string[];
  /** og:site_name 언어별 사이트명 오버라이드 */
  ogSiteName?: string;
  /**
   * MedicalBusiness 스키마 삽입 여부 (기본값: true)
   * - true  → buildClinicJsonLd() 삽입
   * - false → MedicalBusiness 스키마 제외
   */
  includeMedicalSchema?: boolean;
  /**
   * WebSite 스키마 삽입 여부 (기본값: false)
   * 홈페이지("/")에만 true로 설정하세요.
   */
  includeWebSiteSchema?: boolean;
}

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
  ogSiteName,
  includeMedicalSchema,
  includeWebSiteSchema = false,
}: SeoHeadProps) {
  const resolvedOgUrl = ogUrl ?? canonical ?? BASE_URL;
  const resolvedSiteName = ogSiteName ?? SITE_NAME;
  const alternates = ogLocaleAlternates ?? ALL_OG_LOCALES.filter((l) => l !== ogLocale);
  const shouldIncludeMedical = includeMedicalSchema ?? true;
  const baseSchemas: JsonLdSchema[] = [
    ...(shouldIncludeMedical ? [buildClinicJsonLd()] : []),
    ...(includeWebSiteSchema ? [buildWebSiteJsonLd()] : []),
  ];
  const allSchemas = [...baseSchemas, ...(jsonLd ?? [])];
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
      <meta property="og:site_name" content={resolvedSiteName} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={resolvedOgUrl} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && ogImage.startsWith("https://") && <meta property="og:image:secure_url" content={ogImage} />}
      {ogImage && <meta property="og:image:type" content="image/png" />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      {ogImage && <meta property="og:image:alt" content={title} />}
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
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

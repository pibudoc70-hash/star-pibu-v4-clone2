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
  buildFAQPageJsonLd,
  buildLocalBusinessJsonLd,
  SEO_PRESETS,
  type SeoPageType,
} from "@/lib/seoHelpers";

// Re-export for backward compatibility (기존 import 경로 유지)
export type { JsonLdSchema } from "@/lib/seoHelpers";
export type { SeoPageType } from "@/lib/seoHelpers";
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
  buildFAQPageJsonLd,
  buildLocalBusinessJsonLd,
  buildPersonListJsonLd,
  buildVideoObjectListJsonLd,
  buildEventJsonLd,
  SEO_PRESETS,
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
   * [G항목] 페이지 타입 프리셋 (SEO_PRESETS 참조)
   * - "home"      → WebSite + MedicalBusiness 스키마 모두 포함
   * - "treatment" → MedicalBusiness 스키마만 포함
   * - "default"   → MedicalBusiness 스키마만 포함
   * - "admin"     → 스키마 없음 + 자동 noindex
   */
  pageType?: SeoPageType;
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
  pageType = "default",
}: SeoHeadProps) {
  const resolvedOgUrl = ogUrl ?? canonical ?? BASE_URL;
  const resolvedSiteName = ogSiteName ?? SITE_NAME;
  const alternates = ogLocaleAlternates ?? ALL_OG_LOCALES.filter((l) => l !== ogLocale);
  // [R21-P1-4] deprecated boolean fallback 제거 완료
  // includeMedicalSchema/includeWebSiteSchema prop 제거 → pageType 프리셋만 사용
  const preset = SEO_PRESETS[pageType];
  const shouldIncludeMedical = preset.includeMedicalSchema;
  const shouldIncludeWebSite = preset.includeWebSiteSchema;
  // [R20-P2-8] admin pageType은 자동 noindex 정책화
  // pageType="admin"이면 noindex prop을 명시하지 않아도 noindex 적용
  // 이로 인해 실수로 noindex를 빠뜨려도 admin 페이지는 항상 noindex
  const effectiveNoindex = noindex || pageType === "admin";
  const baseSchemas: JsonLdSchema[] = [
    ...(shouldIncludeMedical ? [buildClinicJsonLd()] : []),
    ...(shouldIncludeWebSite ? [buildWebSiteJsonLd()] : []),
  ];
  const allSchemas = [...baseSchemas, ...(jsonLd ?? [])];
  return (
    <Helmet>
      {/* 기본 메타 */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {effectiveNoindex && <meta name="robots" content="noindex, nofollow" />}
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
      {ogImage && <meta property="og:image:type" content={ogImage.endsWith('.webp') ? 'image/webp' : ogImage.endsWith('.jpg') || ogImage.endsWith('.jpeg') ? 'image/jpeg' : 'image/png'} />}
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

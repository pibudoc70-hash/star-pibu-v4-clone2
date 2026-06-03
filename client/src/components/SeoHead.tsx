/**
 * SeoHead - 범용 SEO 메타태그 컴포넌트
 * react-helmet-async 기반으로 title, description, OG, Twitter, canonical,
 * JSON-LD 구조화 데이터를 선언적으로 주입합니다.
 *
 * 사용법:
 *   <SeoHead
 *     title="페이지 제목"
 *     description="페이지 설명"
 *     canonical="https://www.star-pibu.com/treatments/ulthera"
 *     ogImage="https://cdn.example.com/image.jpg"
 *     jsonLd={[{ "@context": "https://schema.org", ... }]}
 *   />
 */
import { Helmet } from "react-helmet-async";

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
  jsonLd?: Record<string, unknown>[];
  /** hreflang 언어 대체 URL 목록 */
  hreflangs?: { hreflang: string; href: string }[];
  /** noindex 여부 (관리자 페이지 등) */
  noindex?: boolean;
}

const SITE_NAME = "부산 서면 스타피부과";
const BASE_URL = "https://www.star-pibu.com";

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
}: SeoHeadProps) {
  const resolvedOgUrl = ogUrl ?? canonical ?? BASE_URL;

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

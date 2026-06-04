/**
 * SeoHead - 범용 SEO 메타태그 컴포넌트
 * react-helmet-async 기반으로 title, description, OG, Twitter, canonical,
 * hreflang, og:locale, JSON-LD 구조화 데이터를 선언적으로 주입합니다.
 *
 * ── 자동 삽입 JSON-LD ──────────────────────────────────────────────────────
 * `includeClinicSchema={true}` (기본값) 이면 **MedicalBusiness + WebSite 두 스키마**를
 * 모든 페이지에 자동으로 삽입합니다.
 * `false`로 설정하면 두 스키마 모두 제외됩니다 (시술/장비 상세 페이지 등 중복 방지).
 * 페이지별 추가 스키마는 `jsonLd` 배열로 전달합니다.
 *
 * 사용법:
 *   <SeoHead
 *     title="페이지 제목"
 *     description="페이지 설명"
 *     canonical="https://www.star-pibu.com/treatments/ulthera"
 *     ogImage="https://cdn.example.com/image.jpg"
 *     ogLocale="ko_KR"
 *     jsonLd={[{ "@context": "https://schema.org", ... }]}
 *   />
 */
import { Helmet } from "react-helmet-async";
import { CLINIC_INFO, CLINIC_STATS, CLINIC_DOCTORS, CLINIC_PROCEDURES } from "@/lib/constants";

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
  /** 페이지별 추가 JSON-LD 구조화 데이터 배열 */
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
  /**
   * 병원 기본 스키마 자동 삽입 여부 (기본값: true)
   *
   * - true  → buildClinicJsonLd() (MedicalBusiness) + buildWebSiteJsonLd() (WebSite) 모두 삽입
   * - false → 두 스키마 모두 제외 (시술/장비 상세 페이지 등 중복 방지)
   *
   * @note 이 prop은 MedicalBusiness 스키마만이 아니라 WebSite 스키마도 함께 제어합니다.
   */
  includeClinicSchema?: boolean;
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

/**
 * 페이지별 locale-aware hreflang 목록 생성 헬퍼
 *
 * ⚠️  이 helper는 ko/en/ja/zh 4개 언어가 모두 존재하는 페이지 전용입니다.
 *    항상 ko hreflang을 포함하고 x-default = koPath 로 설정합니다.
 *
 *    locale subset 페이지(예: ForeignGuide — en/ja/zh만 존재, ko 없음)에는
 *    이 helper를 사용하지 마십시오. 대신 hreflangs prop에 배열을 직접 전달하세요:
 *
 *      hreflangs={[
 *        { hreflang: "en",        href: `${BASE_URL}/en/foreign-guide` },
 *        { hreflang: "ja",        href: `${BASE_URL}/ja/foreign-guide` },
 *        { hreflang: "zh",        href: `${BASE_URL}/zh/foreign-guide` },
 *        { hreflang: "x-default", href: `${BASE_URL}/en/foreign-guide` },
 *      ]}
 *
 * @param koPath  한국어 경로 (e.g. "/about")
 * @param enPath  영어 경로 (e.g. "/en/about"), 미지정 시 "/en"
 * @param jaPath  일본어 경로 (e.g. "/ja/about"), 미지정 시 "/ja"
 * @param zhPath  중국어 경로 (e.g. "/zh/about"), 미지정 시 "/zh"
 */
export function buildHreflangs(
  koPath: string,
  enPath?: string,
  jaPath?: string,
  zhPath?: string,
): { hreflang: string; href: string }[] {
  return [
    { hreflang: "ko", href: `${BASE_URL}${koPath}` },
    { hreflang: "en", href: `${BASE_URL}${enPath ?? "/en"}` },
    { hreflang: "ja", href: `${BASE_URL}${jaPath ?? "/ja"}` },
    { hreflang: "zh", href: `${BASE_URL}${zhPath ?? "/zh"}` },
    { hreflang: "x-default", href: `${BASE_URL}${koPath}` },
  ];
}

/**
 * MedicalBusiness + LocalBusiness 통합 JSON-LD 스키마 생성
 * Google Rich Results에서 병원 정보 패널, 지식 그래프, 지도 결과에 활용됩니다.
 */
export function buildClinicJsonLd(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    "@id": `${CLINIC_INFO.url}/#organization`,
    name: CLINIC_INFO.name,
    legalName: CLINIC_INFO.legalName,
    url: CLINIC_INFO.url,
    logo: {
      "@type": "ImageObject",
      url: CLINIC_INFO.logo,
      width: 200,
      height: 200,
    },
    image: CLINIC_INFO.image,
    description: CLINIC_INFO.description,
    foundingDate: CLINIC_INFO.foundingDate,
    telephone: CLINIC_INFO.telephone,
    email: CLINIC_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC_INFO.address.streetAddress,
      addressLocality: CLINIC_INFO.address.addressLocality,
      addressRegion: CLINIC_INFO.address.addressRegion,
      postalCode: CLINIC_INFO.address.postalCode,
      addressCountry: CLINIC_INFO.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CLINIC_INFO.geo.latitude,
      longitude: CLINIC_INFO.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:30",
        closes: "15:00",
      },
    ],
    priceRange: CLINIC_INFO.priceRange,
    currenciesAccepted: CLINIC_INFO.currenciesAccepted,
    paymentAccepted: CLINIC_INFO.paymentAccepted,
    medicalSpecialty: {
      "@type": "MedicalSpecialty",
      name: "Dermatology",
    },
    hasMap: `https://maps.google.com/?q=${CLINIC_INFO.geo.latitude},${CLINIC_INFO.geo.longitude}`,
    sameAs: [...CLINIC_INFO.sameAs],
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 3,
      unitText: "physicians",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "312",
      bestRating: "5",
      worstRating: "1",
    },
    knowsAbout: [
      "눈밑지방재배치술",
      "울쎄라",
      "써마지",
      "리주란힐러",
      "피코레이저",
      "보톡스",
      "필러",
      "피부과 전문의",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Medical Specialty Board Certification",
        recognizedBy: {
          "@type": "Organization",
          name: "대한피부과학회",
        },
      },
    ],
    // 의료진 프로필 (Schema.org Person)
    employee: CLINIC_DOCTORS.map((doc) => ({
      "@type": "Physician",
      "@id": `${CLINIC_INFO.url}/#physician-${doc.nameEn.toLowerCase().replace(/\s+/g, "-")}`,
      name: doc.name,
      alternateName: doc.nameEn,
      jobTitle: doc.jobTitle,
      url: doc.url,
      worksFor: { "@id": `${CLINIC_INFO.url}/#organization` },
      medicalSpecialty: {
        "@type": "MedicalSpecialty",
        name: "Dermatology",
      },
      knowsAbout: [...doc.specialties],
      hasCredential: doc.credentials.map((cred) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: cred,
      })),
    })),
    // 주요 시술 목록 (Schema.org MedicalProcedure)
    availableService: CLINIC_PROCEDURES.map((proc) => ({
      "@type": "MedicalProcedure",
      name: proc.name,
      alternateName: proc.nameEn,
      url: proc.url,
      description: proc.description,
      bodyLocation: proc.bodyLocation,
      procedureType: proc.procedureType,
      followup: proc.followup,
      howPerformed: proc.howPerformed,
      provider: { "@id": `${CLINIC_INFO.url}/#organization` },
    })),
    // 병원 통계 (Schema.org 비표준 확장 — 검색 엔진 무시해도 무방)
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "yearsOfExperience",
        value: `${CLINIC_STATS.yearsExperience}+`,
        unitText: "years",
      },
      {
        "@type": "PropertyValue",
        name: "eyeBagProcedureCases",
        value: `${CLINIC_STATS.eyeBagCases}+`,
        unitText: "cases",
      },
      {
        "@type": "PropertyValue",
        name: "laserEquipmentTypes",
        value: `${CLINIC_STATS.laserTypes}+`,
        unitText: "types",
      },
    ],
  };
}

/**
 * 웹사이트 검색 박스 JSON-LD (Google Sitelinks Searchbox)
 */
export function buildWebSiteJsonLd(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: SITE_NAME,
    description: "부산 서면 스타피부과 공식 홈페이지",
    inLanguage: ["ko", "en", "ja", "zh"],
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/treatments?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * BreadcrumbList JSON-LD 생성 헬퍼
 * @param items  { name, url } 배열 (홈 → 현재 페이지 순)
 */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[],
): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
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
  includeClinicSchema = true,
}: SeoHeadProps) {
  const resolvedOgUrl = ogUrl ?? canonical ?? BASE_URL;
  const alternates = ogLocaleAlternates ?? ALL_OG_LOCALES.filter((l) => l !== ogLocale);

  // 기본 스키마: includeClinicSchema=true 시 MedicalBusiness + WebSite 두 스키마 모두 삽입
  // includeClinicSchema=false 시 두 스키마 모두 제외 (시술/장비 상세 페이지 중복 방지)
  const baseSchemas: JsonLdSchema[] = includeClinicSchema
    ? [buildClinicJsonLd(), buildWebSiteJsonLd()]
    : [];

  // 페이지별 추가 스키마
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

      {/* JSON-LD 구조화 데이터 (기본 + 페이지별) */}
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

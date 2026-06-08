// SEO 상수 및 JSON-LD 헬퍼 함수 — SeoHead.tsx에서 분리 (STRUCT-SEO-1)
// 기존 import 경로 유지: import { ... } from '@/components/SeoHead' (re-export됨)
import { CLINIC_INFO, CLINIC_STATS } from "@/lib/constants";
import { CLINIC_DOCTORS, CLINIC_PROCEDURES } from "@/lib/clinic-data";
// [R20-P2-9] 에셋 URL 중앙 관리 → assetConfig.ts
import { OG_IMAGES } from "@/lib/assetConfig";

/**
 * JsonLdSchema — JSON-LD 스키마 타입
 *
 * [R19-P2] Record<string, unknown> → 전용 타입으로 강화
 * - @context와 @type은 모든 유효한 JSON-LD에 필수
 * - 나머지 필드는 스키마별로 다르므로 unknown 허용
 */
export type JsonLdSchema = {
  "@context": string;
  "@type": string | string[];
  [key: string]: unknown;
};

export const SITE_NAME = "부산 서면 스타피부과";
export const BASE_URL = "https://www.star-pibu.com";

/** 언어별 사이트명 (og:site_name, JSON-LD name 필드에 사용) */
export const SITE_NAME_LOCALIZED: Record<string, string> = {
  ko: "부산 서면 스타피부과",
  en: "Star Dermatology Busan",
  ja: "釜山スター皮膚科",
  zh: "釜山STAR皮肤科",
};

/**
 * 언어별 OG 이미지 URL (SNS 공유 시 사용, 1200×630px)
 *
 * [R20-P2-9] URL 정의는 lib/assetConfig.ts에서 중앙 관리
 * 여기서는 re-export하여 기존 import 경로를 유지
 */
export const OG_IMAGE_LOCALIZED: Record<string, string> = OG_IMAGES;

/**
 * 공통 hreflang 목록 — 홈페이지(루트) 전용
 *
 * ⚠️  x-default 정책:
 *   - COMMON_HREFLANGS: x-default = BASE_URL + "/" (루트 홈페이지 고정)
 *     → 홈페이지 전용 상수이므로 x-default는 항상 루트를 가리킴
 *   - buildHreflangs(): x-default = koPath (페이지별 한국어 경로)
 *     → 페이지별 hreflang 생성 시 koPath가 x-default로 설정됨
 *
 * 두 방식의 x-default 정책이 다른 것은 의도적입니다:
 *   - COMMON_HREFLANGS는 홈페이지 전용이므로 루트가 x-default
 *   - buildHreflangs는 개별 페이지용이므로 koPath가 x-default
 *
 * [R23-P1] 정책 불일치 문서화 — 혼용 방지
 */
export const COMMON_HREFLANGS = [
  { hreflang: "ko", href: `${BASE_URL}/` },
  { hreflang: "en", href: `${BASE_URL}/en` },
  { hreflang: "ja", href: `${BASE_URL}/ja` },
  { hreflang: "zh", href: `${BASE_URL}/zh` },
  // x-default: 홈페이지 루트 고정 (buildHreflangs의 koPath 기반 x-default와 다름)
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
 * x-default 정책: koPath가 항상 x-default로 설정됩니다.
 *   - 한국어 콘텐츠가 없는 subset 페이지에서는 이 함수를 사용하지 마세요.
 *   - subset 페이지에서는 x-default를 영어 경로로 설정하는 것이 올바릅니다.
 *
 * @param koPath  한국어 경로 (e.g. "/about") — x-default로도 사용됨
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
  // [R17-P2] 런타임 가드: path는 '/'(루트) 또는 '/'로 시작해야 함
  if (process.env.NODE_ENV !== "production") {
    const paths = [koPath, enPath, jaPath, zhPath].filter(Boolean) as string[];
    const invalid = paths.filter((p) => p !== "/" && !p.startsWith("/"));
    if (invalid.length > 0) {
      console.warn(
        `[buildHreflangs] path는 '/'(루트) 또는 '/'로 시작해야 합니다. ` +
        `잘못된 값: ${invalid.join(", ")}`
      );
    }
    // [R21-P1-5] subset 페이지 오용 방지 가드:
    // koPath가 '/ko/' 프리픽스로 시작하면 subset 페이지에서 잘못 사용하는 것일 수 있음
    // (ko 콘텐츠가 없는 페이지는 koPath가 없어야 하므로)
    if (enPath?.startsWith("/") && !enPath.startsWith("/en")) {
      console.warn(
        `[buildHreflangs] enPath가 '/en'으로 시작하지 않습니다: ${enPath}. ` +
        `영어 경로는 '/en/...' 형식이어야 합니다.`
      );
    }
    if (jaPath?.startsWith("/") && !jaPath.startsWith("/ja")) {
      console.warn(
        `[buildHreflangs] jaPath가 '/ja'으로 시작하지 않습니다: ${jaPath}. ` +
        `일본어 경로는 '/ja/...' 형식이어야 합니다.`
      );
    }
    if (zhPath?.startsWith("/") && !zhPath.startsWith("/zh")) {
      console.warn(
        `[buildHreflangs] zhPath가 '/zh'로 시작하지 않습니다: ${zhPath}. ` +
        `중국어 경로는 '/zh/...' 형식이어야 합니다.`
      );
    }
  }
  return [
    { hreflang: "ko", href: `${BASE_URL}${koPath}` },
    { hreflang: "en", href: `${BASE_URL}${enPath ?? "/en"}` },
    { hreflang: "ja", href: `${BASE_URL}${jaPath ?? "/ja"}` },
    { hreflang: "zh", href: `${BASE_URL}${zhPath ?? "/zh"}` },
    // x-default 정책: koPath가 항상 x-default로 설정됨
    // subset 페이지(예: ForeignGuide)에서는 이 함수 대신 hreflangs prop에 배열을 직접 전달할 것
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
  // [R17-P2] 런타임 가드: 빈 배열 전달 시 경고 + 최소 1개 항목 필요
  if (process.env.NODE_ENV !== "production" && items.length === 0) {
    console.warn(
      "[buildBreadcrumbJsonLd] items 배열이 비어 있습니다. " +
      "최소한 [홈, 현재 페이지] 2개 항목을 전달하세요."
    );
  }
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

/**
 * [G항목] SEO_PRESETS: 페이지 타입별 스키마 삽입 프리셋
 * - boolean 조합 대신 pageType 단일 prop으로 추상화
 *
 * 사용 예:
 *   <SeoHead pageType="home" ... />
 *   <SeoHead pageType="treatment" ... />
 *   <SeoHead pageType="default" ... />
 */
export type SeoPageType = "home" | "treatment" | "default" | "admin";

/** SeoPreset 타입 정의 */
export type SeoPreset = { includeMedicalSchema: boolean; includeWebSiteSchema: boolean };

export const SEO_PRESETS = {
  // [R19-P2] satisfies 적용: 타입 추론 유지 + 정확성 제약
  // 새 SeoPageType 키 추가 시 컴파일러가 누락 감지
  /** 홈페이지: WebSite + MedicalBusiness 스키마 모두 포함 */
  home: { includeMedicalSchema: true, includeWebSiteSchema: true },
  /** 시술/장비 상세 페이지: MedicalBusiness 스키마만 포함 */
  treatment: { includeMedicalSchema: true, includeWebSiteSchema: false },
  /** 일반 페이지 (접근 안내, 의료진 등): MedicalBusiness 스키마만 포함 */
  default: { includeMedicalSchema: true, includeWebSiteSchema: false },
  /** 관리자 페이지: 스키마 없음 + noindex */
  admin: { includeMedicalSchema: false, includeWebSiteSchema: false },
} satisfies Record<SeoPageType, SeoPreset>;


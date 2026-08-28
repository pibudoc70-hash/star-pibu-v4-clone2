// SEO 상수 및 JSON-LD 헬퍼 함수 — SeoHead.tsx에서 분리 (STRUCT-SEO-1)
// 기존 import 경로 유지: import { ... } from '@/components/SeoHead' (re-export됨)
import { CLINIC_INFO, CLINIC_STATS, SEO_CLINIC_META } from "@/lib/constants";
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
export const BASE_URL = "https://star-pibu.com";

/** 언어별 사이트명 (og:site_name, JSON-LD name 필드에 사용) */
export const SITE_NAME_LOCALIZED: Record<string, string> = {
  ko: "부산 서면 스타피부과",
  en: "Star Dermatology Busan",
  ja: "釜山スター皮膚科",
  zh: "釜山STAR皮肤科",
  "zh-TW": "釜山STAR皮膚科",
};

export type SchemaLocale = "ko" | "en" | "ja" | "zh" | "zh-TW";

const SCHEMA_LOCALES: readonly SchemaLocale[] = ["ko", "en", "ja", "zh", "zh-TW"];

const CLINIC_SCHEMA_COPY: Record<SchemaLocale, { name: string; description: string }> = {
  ko: {
    name: SITE_NAME_LOCALIZED.ko,
    description: "부산 서면 위치한 피부과 전문의 클리닉. 눈밑지방재배치술, 울쎄라피, 써마지, 리주란 등 전문의가 직접 시술합니다.",
  },
  en: {
    name: SITE_NAME_LOCALIZED.en,
    description: "Star Dermatology is a dermatologist-led clinic in Seomyeon, Busan, providing individualized dermatologic care plans.",
  },
  ja: {
    name: SITE_NAME_LOCALIZED.ja,
    description: "釜山・西面の皮膚科専門医によるクリニックです。お一人おひとりの肌状態に合わせた診療計画をご案内します。",
  },
  zh: {
    name: SITE_NAME_LOCALIZED.zh,
    description: "STAR皮肤科位于釜山西面，由皮肤科专科医生根据个人皮肤状况提供诊疗方案。",
  },
  "zh-TW": {
    name: SITE_NAME_LOCALIZED["zh-TW"],
    description: "STAR皮膚科位於釜山西面，由皮膚科專科醫師依個人膚況提供診療規劃。",
  },
};

export function normalizeSchemaLocale(locale: string | undefined): SchemaLocale {
  return SCHEMA_LOCALES.includes(locale as SchemaLocale) ? locale as SchemaLocale : "ko";
}

export function schemaLocaleFromOgLocale(ogLocale: string | undefined): SchemaLocale {
  const matched = Object.entries(LANG_TO_OG_LOCALE).find(([, value]) => value === ogLocale)?.[0];
  return normalizeSchemaLocale(matched);
}

export function withSchemaLanguage(schema: JsonLdSchema, locale: string | undefined): JsonLdSchema {
  return { ...schema, inLanguage: normalizeSchemaLocale(locale) };
}

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
  { hreflang: "ko", href: `${BASE_URL}` },
  { hreflang: "en", href: `${BASE_URL}/en` },
  { hreflang: "ja", href: `${BASE_URL}/ja` },
  { hreflang: "zh", href: `${BASE_URL}/zh` },
  { hreflang: "zh-TW", href: `${BASE_URL}/zh-tw` },
  // x-default: 홈페이지 루트 고정 (buildHreflangs의 koPath 기반 x-default와 다름)
  { hreflang: "x-default", href: `${BASE_URL}` },
];

/** 다국어 og:locale 매핑 */
export const LANG_TO_OG_LOCALE: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
  "zh-TW": "zh_TW",
};

/** 다국어 og:locale:alternate 목록 */
export const ALL_OG_LOCALES = ["ko_KR", "en_US", "ja_JP", "zh_CN", "zh_TW"];

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
 * @param enPath  영어 경로 (e.g. "/en/about"), 미지정 시 koPath 기반으로 생성
 * @param jaPath  일본어 경로 (e.g. "/ja/about"), 미지정 시 koPath 기반으로 생성
 * @param zhPath  중국어 경로 (e.g. "/zh/about"), 미지정 시 koPath 기반으로 생성
 * @param zhTWPath 번체 중국어 경로 (e.g. "/zh-tw/about"), 미지정 시 koPath 기반으로 생성
 */
export function buildHreflangs(
  koPath: string,
  enPath?: string,
  jaPath?: string,
  zhPath?: string,
  zhTWPath?: string,
): { hreflang: string; href: string }[] {
  // [R17-P2] 런타임 가드: path는 '/'(루트) 또는 '/'로 시작해야 함
  if (process.env.NODE_ENV !== "production") {
    const paths = [koPath, enPath, jaPath, zhPath, zhTWPath].filter(Boolean) as string[];
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
    if (zhTWPath?.startsWith("/") && !zhTWPath.startsWith("/zh-tw")) {
      console.warn(
        `[buildHreflangs] zhTWPath가 '/zh-tw'로 시작하지 않습니다: ${zhTWPath}. ` +
        `번체 중국어 경로는 '/zh-tw/...' 형식이어야 합니다.`
      );
    }
  }
  const localizedPath = (prefix: "en" | "ja" | "zh" | "zh-tw", explicitPath?: string) =>
    explicitPath ?? (koPath === "/" ? `/${prefix}` : `/${prefix}${koPath}`);
  return [
    { hreflang: "ko", href: `${BASE_URL}${koPath}` },
    { hreflang: "en", href: `${BASE_URL}${localizedPath("en", enPath)}` },
    { hreflang: "ja", href: `${BASE_URL}${localizedPath("ja", jaPath)}` },
    { hreflang: "zh", href: `${BASE_URL}${localizedPath("zh", zhPath)}` },
    { hreflang: "zh-TW", href: `${BASE_URL}${localizedPath("zh-tw", zhTWPath)}` },
    // x-default 정송: koPath가 항상 x-default로 설정됨
    // subset 페이지(예: ForeignGuide)에서는 이 함수 대신 hreflangs prop에 배열을 직접 전달할 것
    { hreflang: "x-default", href: `${BASE_URL}${koPath}` },
  ];
}

/**
 * [DRY] openingHoursSpecification 파싱 공통 헬퍼
 *
 * 형식: "Mo-Fr 10:00-19:00" 또는 "Sa 09:30-15:00"
 * buildClinicJsonLd / buildLocalBusinessJsonLd 두 곳에서 동일 로직이 중복되어 있었으므로
 * 단일 함수로 추출하여 유지보수 위험 제거.
 *
 * @param openingHours  CLINIC_INFO.openingHours 배열 ("Day HH:MM-HH:MM" 형식)
 * @returns Schema.org OpeningHoursSpecification 배열
 */
export function buildOpeningHoursSpec(
  openingHours: readonly string[],
): { "@type": string; dayOfWeek: string[]; opens: string; closes: string }[] {
  const DAY_MAP: Record<string, string> = {
    Mo: "Monday", Tu: "Tuesday", We: "Wednesday",
    Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday",
  };
  const DAY_ORDER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  return openingHours.map((spec) => {
    const [daysPart, timesPart] = spec.split(" ");
    const [opens, closes] = timesPart.split("-");
    const days = daysPart.includes("-")
      ? (() => {
          const [startDay, endDay] = daysPart.split("-");
          const si = DAY_ORDER.indexOf(startDay);
          const ei = DAY_ORDER.indexOf(endDay);
          return DAY_ORDER.slice(si, ei + 1).map((d) => DAY_MAP[d] ?? d);
        })()
      : [DAY_MAP[daysPart] ?? daysPart];
    return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
  });
}

/**
 * MedicalBusiness + LocalBusiness 통합 JSON-LD 스키마 생성
 * Google Rich Results에서 병원 정보 패널, 지식 그래프, 지도 결과에 활용됩니다.
 *
 * [SRP-DI] 인자 주입 패턴 적용:
 * - 기본값 = 현재 상수 (프로덕션 코드 동일하게 동작)
 * - 테스트에서는 목(mock) 데이터를 주입하여 외부 의존성 격리 가능
 */
export function buildClinicJsonLd(
  clinicInfo = CLINIC_INFO,
  clinicStats = CLINIC_STATS,
  seoClinicMeta = SEO_CLINIC_META,
  clinicDoctors = CLINIC_DOCTORS,
  clinicProcedures = CLINIC_PROCEDURES,
): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "MedicalClinic", "LocalBusiness"],
    "@id": `${clinicInfo.url}/#organization`,
    name: clinicInfo.name,
    alternateName: clinicInfo.legalName,
    legalName: clinicInfo.legalName,
    url: clinicInfo.url,
    logo: {
      "@type": "ImageObject",
      url: clinicInfo.logo,
      width: 200,
      height: 200,
    },
    image: clinicInfo.image,
    description: clinicInfo.description,
    foundingDate: clinicInfo.foundingDate,
    telephone: clinicInfo.telephone,
    email: clinicInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinicInfo.address.streetAddress,
      addressLocality: clinicInfo.address.addressLocality,
      addressRegion: clinicInfo.address.addressRegion,
      postalCode: clinicInfo.address.postalCode,
      addressCountry: clinicInfo.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: clinicInfo.geo.latitude,
      longitude: clinicInfo.geo.longitude,
    },
    // [DRY] buildOpeningHoursSpec 공통 헬퍼 사용 (buildLocalBusinessJsonLd와 동일 로직 공유)
    openingHoursSpecification: buildOpeningHoursSpec(clinicInfo.openingHours),
    // 점심시간 특별 영업시간 (지역 검색 최적화)
    specialOpeningHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: seoClinicMeta.lunchBreak.dayOfWeek,
        opens: seoClinicMeta.lunchBreak.opens,
        closes: seoClinicMeta.lunchBreak.closes,
        description: seoClinicMeta.lunchBreak.description,
      },
    ],
    priceRange: clinicInfo.priceRange,
    currenciesAccepted: clinicInfo.currenciesAccepted,
    paymentAccepted: clinicInfo.paymentAccepted,
    medicalSpecialty: {
      "@type": "MedicalSpecialty",
      name: "Dermatology",
    },
    hasMap: `https://maps.google.com/?q=${clinicInfo.geo.latitude},${clinicInfo.geo.longitude}`,
    sameAs: [...clinicInfo.sameAs],
    // [SRP-DI] 파라미터로 주입된 seoClinicMeta 사용
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: seoClinicMeta.physicianCount,
      unitText: "physicians",
    },
    knowsAbout: [...seoClinicMeta.knowsAbout],
    // 서비스 제공 지역 세분화 (지역 검색 범위 확장)
    areaServed: seoClinicMeta.areaServed.map((area) => ({
      "@type": area.type,
      name: area.name,
      alternateName: area.nameKo,
    })),
    // 편의시설 정보 (주차, 엘리베이터, 다국어 상담 등)
    amenityFeature: seoClinicMeta.amenityFeature.map((f) => ({
      "@type": "LocationFeatureSpecification",
      name: f.name,
      value: f.value,
    })),
    // 시술 카탈로그 (제공 서비스 목록)
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: seoClinicMeta.offerCatalog.name,
      itemListElement: seoClinicMeta.offerCatalog.itemListElement.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalProcedure",
          name: item.name,
          url: item.url,
        },
      })),
    },
    hasCredential: seoClinicMeta.hasCredential.map((cred) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: cred.credentialCategory,
      recognizedBy: {
        "@type": "Organization",
        name: cred.recognizedBy,
      },
    })),
    // [SRP-DI] 파라미터로 주입된 clinicDoctors 사용
    employee: clinicDoctors.map((doc) => {
      const d = doc as typeof doc & {
        honorificPrefix?: string;
        nationality?: string;
        memberOf?: Array<{ name: string; url?: string }>;
        award?: readonly string[];
        workLocation?: { name: string; address: string };
        availableService?: readonly string[];
        knowsAbout?: readonly string[];
      };
      const physician: Record<string, unknown> = {
        "@type": "Physician",
        "@id": `${clinicInfo.url}/#physician-${doc.nameEn.toLowerCase().replace(/\s+/g, "-")}`,
        name: doc.name,
        alternateName: doc.nameEn,
        ...(d.honorificPrefix && { honorificPrefix: d.honorificPrefix }),
        jobTitle: doc.jobTitle,
        url: doc.url,
        image: doc.image,
        description: doc.description,
        ...(d.nationality && { nationality: d.nationality }),
        worksFor: { "@id": `${clinicInfo.url}/#organization` },
        medicalSpecialty: [
          { "@type": "MedicalSpecialty", name: "Dermatology" },
          ...doc.specialties.map((s) => ({ "@type": "MedicalSpecialty", name: s })),
        ],
        knowsAbout: d.knowsAbout ? [...d.knowsAbout] : [...doc.specialties],
        hasCredential: doc.credentials.map((cred) => ({
          "@type": "EducationalOccupationalCredential",
          credentialCategory: cred,
        })),
        ...(doc.sameAs.length > 0 && { sameAs: [...doc.sameAs] }),
        ...(doc.alumniOf && doc.alumniOf.length > 0 && {
          alumniOf: doc.alumniOf.map((school) => ({
            "@type": "EducationalOrganization",
            name: school.name,
            ...(school.url && { url: school.url }),
          }))
        }),
        ...(d.memberOf && d.memberOf.length > 0 && {
          memberOf: d.memberOf.map((org) => ({
            "@type": "MedicalOrganization",
            name: org.name,
            ...(org.url && { url: org.url }),
          }))
        }),
        ...(d.award && d.award.length > 0 && { award: [...d.award] }),
        ...(d.workLocation && {
          workLocation: {
            "@type": "Place",
            name: d.workLocation.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: d.workLocation.address,
              addressLocality: "부산광역시",
              addressCountry: "KR",
            },
          }
        }),
        ...(d.availableService && d.availableService.length > 0 && {
          availableService: d.availableService.map((svc) => ({
            "@type": "MedicalProcedure",
            name: svc,
            provider: { "@id": `${clinicInfo.url}/#organization` },
          }))
        }),
      };
      // undefined 필드 제거
      Object.keys(physician).forEach(key => physician[key] === undefined && delete physician[key]);
      return physician;
    }),
    // [SRP-DI] 파라미터로 주입된 clinicProcedures 사용
    availableService: clinicProcedures.map((proc) => ({
      "@type": "MedicalProcedure",
      name: proc.name,
      alternateName: proc.nameEn,
      url: proc.url,
      description: proc.description,
      bodyLocation: proc.bodyLocation,
      procedureType: proc.procedureType,
      followup: proc.followup,
      howPerformed: proc.howPerformed,
      provider: { "@id": `${clinicInfo.url}/#organization` },
    })),
    // 병원 통계 (Schema.org 비표준 확장 — 검색 엔진 무시해도 무방)
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "yearsOfExperience",
        value: `${clinicStats.yearsExperience}+`,
        unitText: "years",
      },
      {
        "@type": "PropertyValue",
        name: "eyeBagProcedureCases",
        value: `${clinicStats.eyeBagCases}+`,
        unitText: "cases",
      },
      {
        "@type": "PropertyValue",
        name: "laserEquipmentTypes",
        value: `${clinicStats.laserTypes}+`,
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
    inLanguage: ["ko", "en", "ja", "zh", "zh-TW"],
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
  };
}

export function buildLocalizedClinicJsonLd(locale: string | undefined): JsonLdSchema {
  const normalizedLocale = normalizeSchemaLocale(locale);
  const copy = CLINIC_SCHEMA_COPY[normalizedLocale];
  return withSchemaLanguage({ ...buildClinicJsonLd(), name: copy.name, description: copy.description }, normalizedLocale);
}

export function buildLocalizedWebSiteJsonLd(locale: string | undefined): JsonLdSchema {
  const normalizedLocale = normalizeSchemaLocale(locale);
  const copy = CLINIC_SCHEMA_COPY[normalizedLocale];
  return withSchemaLanguage({ ...buildWebSiteJsonLd(), name: copy.name, description: copy.description }, normalizedLocale);
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
 * LocalBusiness JSON-LD 스키마 생성 헬퍼 (지역 검색 최적화)
 * Google Maps, Naver, Kakao 지역 검색 및 Google Local Services Ads에 활용
 *
 * [SRP-DI] 인자 주입 패턴 적용:
 * - 기본값 = 현재 상수 (프로덕션 코드 동일하게 동작)
 * - 테스트에서는 목(mock) 데이터를 주입하여 외부 의존성 격리 가능
 */
/** @deprecated 기존 호출부 호환용 별칭입니다. 병원 entity는 buildClinicJsonLd가 단일 정본입니다. */
export const buildLocalBusinessJsonLd = buildClinicJsonLd;

/**
 * FAQPage JSON-LD 스키마 생성 헬퍼 (AI 검색 최적화)
 * Google AI Overviews, ChatGPT, Perplexity에서 직접 인용되는 질문답변 스키마
 *
 * @param items  { question, answer } 배열
 */
export function buildFAQPageJsonLd(
  items: { question: string; answer: string }[],
): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
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


// ── 추가 JSON-LD 헬퍼 (AI 검색 최적화) ───────────────────────────────────────

/**
 * Person/Physician JSON-LD 스키마 생성 헬퍼
 * 의료진 페이지에서 개별 의사 정보를 구조화하여 AI 검색 인용 강화
 */
export function buildPersonListJsonLd(
  doctors: typeof CLINIC_DOCTORS,
): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "스타피부과 의료진",
    description: "부산 서면 스타피부과 피부과 전문의 소개",
    numberOfItems: doctors.length,
    itemListElement: doctors.map((doc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Physician",
        "@id": `${BASE_URL}/#doctor-${index + 1}`,
        name: doc.name,
        alternateName: doc.nameEn,
        honorificPrefix: (doc as Record<string, unknown>).honorificPrefix ?? "Dr.",
        jobTitle: doc.jobTitle,
        description: doc.description,
        image: doc.image,
        url: doc.url,
        sameAs: [...(doc.sameAs ?? [])],
        worksFor: {
          "@type": "MedicalBusiness",
          "@id": `${BASE_URL}/#organization`,
          name: "부산 서면 스타피부과",
          url: BASE_URL,
        },
        hasCredential: (doc.credentials ?? []).map((cred: string) => ({
          "@type": "EducationalOccupationalCredential",
          credentialCategory: cred,
        })),
        knowsAbout: [...(doc.specialties ?? [])],
        alumniOf: (doc.alumniOf ?? []).map((school: { name: string; url?: string }) => ({
          "@type": "EducationalOrganization",
          name: school.name,
          ...(school.url && { url: school.url }),
        })),
        memberOf: ((doc as Record<string, unknown>).memberOf as Array<{ name: string; url?: string }> ?? []).map((org) => ({
          "@type": "MedicalOrganization",
          name: org.name,
          ...(org.url && { url: org.url }),
        })),
      },
    })),
  };
}

/**
 * VideoObject JSON-LD 스키마 생성 헬퍼
 * YouTube 영상을 구조화하여 Google Video 검색 노출 강화
 */
export function buildVideoObjectListJsonLd(
  videos: { title: string; videoId: string; description?: string }[],
): JsonLdSchema | null {
  const validVideos = videos.filter(({ videoId }) =>
    /^[A-Za-z0-9_-]{11}$/.test(videoId),
  );
  if (validVideos.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "스타피부과 YouTube 영상",
    description: "부산 서면 스타피부과 시술 안내 및 원장 강의 영상",
    itemListElement: validVideos.map((v, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        description: v.description ?? `스타피부과 ${v.title} 영상`,
        thumbnailUrl: `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`,
        uploadDate: "2024-01-01",
        contentUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${v.videoId}`,
        publisher: {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "부산 서면 스타피부과",
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/favicon.png`,
          },
        },
      },
    })),
  };
}

/**
 * Event JSON-LD 스키마 생성 헬퍼
 * 이벤트/프로모션 페이지에서 Google 이벤트 검색 결과 노출 강화
 */
export function buildEventJsonLd(event: {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  url: string;
  image?: string;
}): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate ?? new Date().toISOString().split("T")[0],
    ...(event.endDate && { endDate: event.endDate }),
    url: event.url,
    ...(event.image && { image: event.image }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "부산 서면 스타피부과",
      address: {
        "@type": "PostalAddress",
        streetAddress: "서면로 74 아이온시티빌딩 4층",
        addressLocality: "부산진구",
        addressRegion: "부산",
        postalCode: "47280", // [Step59-A] NAP 일관성: 47296 → 47280 (constants.ts 정본)
        addressCountry: "KR",
      },
    },
    organizer: {
      "@type": "MedicalBusiness",
      "@id": `${BASE_URL}/#organization`,
      name: "부산 서면 스타피부과",
      url: BASE_URL,
      telephone: "+82-51-818-7007",
    },
    offers: {
      "@type": "Offer",
      url: event.url,
      availability: "https://schema.org/InStock",
      validFrom: event.startDate ?? new Date().toISOString().split("T")[0],
    },
  };
}

// ── AEO: 연구자 Person 스키마 ────────────────────────────────────────────────
export function buildResearcherJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://star-pibu.com/#dr-cho",
    name: "조시형",
    alternateName: ["Cho Si-Hyung", "조시형 원장"],
    honorificPrefix: "Dr.",
    jobTitle: "피부과 전문의 · 의학박사",
    url: "https://star-pibu.com/#dr-cho",
    worksFor: {
      "@type": "MedicalClinic",
      name: "부산 서면 스타피부과",
      url: "https://star-pibu.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "서면로 74 아이온시티빌딩 4층",
        addressLocality: "부산진구",
        addressRegion: "부산광역시",
        addressCountry: "KR",
      },
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "부산대학교 의과대학", url: "https://med.pusan.ac.kr" },
      { "@type": "CollegeOrUniversity", name: "인제대학교 의과대학", url: "https://med.inje.ac.kr" },
    ],
    knowsAbout: [
      "피부과학", "미용피부외과", "레이저 치료", "리프팅",
      "눈밑지방재배치", "액취증", "다한증", "남성형 탈모",
      "흉터치료", "색소질환", "융합성 망상 유두종증",
      "Dermatologic Surgery", "Cosmetic Dermatology",
      "Tumescent Liposuction", "Androgenetic Alopecia",
    ],
    memberOf: [
      { "@type": "Organization", name: "대한피부과학회", url: "https://www.derma.or.kr" },
      { "@type": "Organization", name: "미국피부과학회 (AAD)", url: "https://www.aad.org" },
      { "@type": "Organization", name: "대한미용피부외과학회" },
      { "@type": "Organization", name: "대한레이저학회" },
      { "@type": "Organization", name: "대한코스메틱피부과학회" },
      { "@type": "Organization", name: "대한비만학회" },
      { "@type": "Organization", name: "대한임상메조테라피연구회" },
      { "@type": "Organization", name: "부산경남 피부과 개원의 협의회" },
    ],
    sameAs: [
      "https://pubmed.ncbi.nlm.nih.gov/?term=Cho+Si-Hyung%5BAuthor%5D",
      "https://www.youtube.com/@starpibu",
      "https://blog.naver.com/starpibu",
    ],
  };
}

// ── AEO: 논문 목록 ItemList + ScholarlyArticle ──────────────────────────────
export interface PaperJsonLdInput {
  id: number;
  titleEn?: string;
  journal: string;
  year: string;
  authors: string;
  category: "international" | "domestic";
  pmid?: string;
  doi?: string;
  citations?: number;
  resolvedTitle?: string;
}

export function buildScholarlyArticleListJsonLd(papers: PaperJsonLdInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "조시형 원장 학술 논문 목록",
    description:
      "부산 서면 스타피부과 조시형 대표원장이 국내외 학술지에 게재한 연구 논문 목록",
    numberOfItems: papers.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: papers.map((p, i) => {
      const year = (p.year.match(/\d{4}/) ?? [])[0];
      const identifiers = [
        ...(p.pmid ? [{ "@type": "PropertyValue", propertyID: "PMID", value: p.pmid }] : []),
        ...(p.doi ? [{ "@type": "PropertyValue", propertyID: "DOI", value: p.doi }] : []),
      ];
      const primaryUrl = p.doi
        ? `https://doi.org/${p.doi}`
        : p.pmid
        ? `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`
        : undefined;

      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "ScholarlyArticle",
          name: p.resolvedTitle ?? p.titleEn ?? `${p.journal} (${p.year})`,
          ...(p.titleEn && p.resolvedTitle && p.titleEn !== p.resolvedTitle
            ? { alternateName: p.titleEn }
            : {}),
          author: p.authors
            .split(/,\s*/)
            .filter(Boolean)
            .map((n) => ({ "@type": "Person", name: n.trim() })),
          ...(year ? { datePublished: year } : {}),
          isPartOf: { "@type": "Periodical", name: p.journal },
          inLanguage: p.category === "international" ? "en" : "ko",
          ...(identifiers.length ? { identifier: identifiers } : {}),
          ...(primaryUrl ? { url: primaryUrl, sameAs: primaryUrl } : {}),
          ...(p.citations !== undefined
            ? {
                interactionStatistic: {
                  "@type": "InteractionCounter",
                  interactionType: "https://schema.org/CiteAction",
                  userInteractionCount: p.citations,
                },
              }
            : {}),
          creator: { "@id": "https://star-pibu.com/#dr-cho" },
          publisher: {
            "@type": "Organization",
            name: p.category === "international" ? "International Journal" : "대한피부과학회",
          },
        },
      };
    }),
  };
}

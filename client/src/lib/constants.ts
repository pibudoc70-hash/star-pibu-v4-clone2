/**
 * STAR 피부과 - 공통 상수 모음
 *
 * 이 파일은 사이트 전체에서 재사용되는 핵심 수치/상수를 중앙 관리합니다.
 * 수치 변경 시 이 파일 한 곳만 수정하면 모든 컴포넌트에 자동 반영됩니다.
 */

// ── 병원 연락처 ────────────────────────────────────────────────────────────────
export const CLINIC_TEL = "051-818-2300";
export const CLINIC_TEL_INTL = "+82-51-818-2300";
export const KAKAO_URL = "https://pf.kakao.com/_HNyGC";
export const NAVER_BOOK_URL = "https://booking.naver.com/booking/13/bizes/209080";
export const LINE_URL = "https://lin.ee/tyuRdUc";
export const WECHAT_ID = "star2006beauty";

// ── 핵심 통계 (단일 소스 of truth) ────────────────────────────────────────────
/**
 * CLINIC_STATS: 병원 주요 수치 상수
 * - i18n.ts의 about.stats와 동일한 수치를 공유합니다.
 * - 숫자 변경 시 이 파일과 i18n.ts 두 곳을 함께 수정하세요.
 *
 * 다국어 레이블은 i18n.ts의 t.about.stats[n].label을 사용하고,
 * 숫자/단위만 이 상수를 참조합니다.
 */
export const CLINIC_STATS = {
  /** 피부과 전문의 경력 (년) */
  yearsExperience: 20,
  /** 눈밑지방재배치술 시술 건수 (례) */
  eyeBagCases: 4000,
  /** 보유 프리미엄 레이저 종류 (종) */
  laserTypes: 50,
  /** 고객 만족도 (%) */
  satisfactionRate: 95,
  /** 의사 1인당 환자 비율 (1:N → N) */
  doctorPatientRatio: 1,
} as const;

/** 다국어 단위 레이블 */
export const STAT_UNITS = {
  years: { ko: "년", en: "+yrs", ja: "年", zh: "年" },
  cases: { ko: "례", en: "+", ja: "例", zh: "例" },
  types: { ko: "종", en: "+", ja: "種", zh: "种" },
  percent: { ko: "%", en: "%", ja: "%", zh: "%" },
  ratio: { ko: ":1", en: ":1", ja: ":1", zh: ":1" },
} as const;

export type StatLang = keyof typeof STAT_UNITS.years;

// ── 병원 정보 (구조화 데이터 JSON-LD용) ───────────────────────────────────────────────────────────────────────────────────
export const CLINIC_INFO = {
  name: "스타피부과",
  legalName: "의료법인 스타피부과",
  url: "https://www.star-pibu.com",
  logo: "https://www.star-pibu.com/logo.png",
  image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/patient-consultation-mobile_e2474e05.jpg",
  telephone: "+82-51-818-2300",
  email: "star2006beauty@naver.com",
  foundingDate: "2006",
  description: "부산 서면 위치한 피부과 전문의 클리닉. 눈밑지방재배치술, 울쓰라피, 써마지, 리주란 등 전문의가 직접 시술합니다.",
  address: {
    streetAddress: "부산광역시 부산진구 범일로 97 아이온시티빌딩 4층",
    addressLocality: "부산진구",
    addressRegion: "부산광역시",
    postalCode: "47296",
    addressCountry: "KR",
  },
  geo: {
    latitude: 35.1579,
    longitude: 129.0597,
  },
  openingHours: [
    "Mo-Fr 10:00-19:00",
    "Sa 10:00-16:00",
  ],
  specialOpeningHours: [
    // 수요일 연장진료 (10:00-20:30)
    "We 10:00-20:30",
  ],
  priceRange: "₩₩₩",
  currenciesAccepted: "KRW",
  paymentAccepted: "Cash, Credit Card",
  medicalSpecialty: "Dermatology",
  sameAs: [
    "https://pf.kakao.com/_HNyGC",
    "https://booking.naver.com/booking/13/bizes/209080",
  ],
} as const;


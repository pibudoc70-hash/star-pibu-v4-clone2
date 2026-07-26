/**
 * STAR 피부과 - 공통 상수 모음
 *
 * 이 파일은 사이트 전체에서 재사용되는 핵심 수치/상수를 중앙 관리합니다.
 * 수치 변경 시 이 파일 한 곳만 수정하면 모든 컴포넌트에 자동 반영됩니다.
 */
// [R21-P1-7] 클리닉 대표 이미지 단일 소스: assetConfig.ts에서 관리
import { CLINIC_REPRESENTATIVE_IMAGE } from "@/lib/assetConfig";

// ── 병원 연락처 ────────────────────────────────────────────────────────────────
export const CLINIC_TEL = "051-818-2300";
export const CLINIC_TEL_INTL = "+82-51-818-2300";
export const KAKAO_URL = "https://pf.kakao.com/_HNyGC";
export const NAVER_BOOK_URL = "https://booking.naver.com/booking/13/bizes/209080";
/** [Step59-B] 네이버 플레이스 페이지 — 리뷰·길찾기 유입 경로 (sameAs 배열과 동일한 URL) */
export const NAVER_PLACE_URL = "https://place.naver.com/hospital/12020103";
export const LINE_URL = "https://lin.ee/tyuRdUc";
export const WECHAT_ID = "star2006beauty";

// ── 핵심 통계 (단일 소스 of truth) ────────────────────────────────────────────
/**
 * CLINIC_STATS: 병원 주요 수치 상수
 *
 * ## 설계 의도 — 이중 관리가 아닌 역할 분리
 *
 * | 소스 | 목적 |
 * |---|---|
 * | `CLINIC_STATS` (constants.ts) | 순수 숫자 값 — `useCountUp` 애니메이션 + JSON-LD 스키마 |
 * | `i18n.*.ts > about.stats` | 완성된 다국어 표시 문자열 ("20년+" 등) |
 * | `useClinicStats` 훅 | 두 소스를 연결하여 단일 API 제공 |
 *
 * 숫자 변경 시 이 파일을 수정하면 `useCountUp`과 JSON-LD에 자동 반영됩니다.
 * 표시 문자열(다국어 레이블)은 `client/src/lib/i18n.*.ts`의 `about.stats`를 함께 수정하세요.
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

/**
 * 다국어 stat suffix 레이블 (숫자 뒤에 붙는 완전한 suffix, + 포함)
 *
 * 렌더링 정책:
 *   - 이 상수를 그대로 숫자 뒤에 붙인다. 렌더링 레이어에서 추가 "+"를 붙이지 않는다.
 *   - 기대 표시: ko=20년+, en=20+yrs, ja=20年+, zh=20年+
 *
 * ResultsStatisticsSection, HeroSection, PhilosophySection 모두 이 정책을 따른다.
 */
export const STAT_UNITS = {
  years:   { ko: "년+",  en: "+yrs", ja: "年+",  zh: "年+"  },
  cases:   { ko: "례+",  en: "+",    ja: "例+",  zh: "例+"  },
  types:   { ko: "종+",  en: "+",    ja: "種+",  zh: "种+"  },
  percent: { ko: "%",   en: "%",    ja: "%",   zh: "%"   },
  ratio:   { ko: ":1",  en: ":1",   ja: ":1",  zh: ":1"  },
} as const;

export type StatLang = keyof typeof STAT_UNITS.years;

// [R22-P1-6] CLINIC_STATS 키와 STAT_UNITS 키 연결 타입
// CLINIC_STATS의 각 숫자 값에 대응하는 STAT_UNITS 키를 명시적으로 매핑
// 이 타입을 통해 렌더링 레이어에서 올바른 suffix를 사용하는지 컴파일 타임에 검증 가능
export type StatKey = keyof typeof STAT_UNITS;
export type ClinicStatKey = keyof typeof CLINIC_STATS;

/**
 * CLINIC_STATS 키 → STAT_UNITS 키 매핑
 * 렌더링 레이어에서 올바른 suffix를 선택하는 단일 소스
 */
export const CLINIC_STAT_UNIT_MAP = {
  yearsExperience:    "years",
  eyeBagCases:        "cases",
  laserTypes:         "types",
  satisfactionRate:   "percent",
  doctorPatientRatio: "ratio",
} as const satisfies Record<ClinicStatKey, StatKey>;

// ── 병원 정보 (구조화 데이터 JSON-LD용) ───────────────────────────────────────────────────────────────────────────────────
export const CLINIC_INFO = {
  name: "스타피부과",
  legalName: "의료법인 스타피부과",
  url: "https://star-pibu.com",
  logo: "https://star-pibu.com/logo.png",
  // [R21-P1-7] 클리닉 대표 이미지 단일 소스: assetConfig.CLINIC_REPRESENTATIVE_IMAGE
  // 이미지 URL 변경 시 assetConfig.ts만 수정하면 자동 반영됨
  image: CLINIC_REPRESENTATIVE_IMAGE,
  telephone: "+82-51-818-2300",
  email: "starpibu@naver.com",
  foundingDate: "2006",
  description: "부산 서면 위치한 피부과 전문의 클리닉. 눈밑지방재배치술, 울쎄라피, 써마지, 리주란 등 전문의가 직접 시술합니다.",
  address: {
    // 기준값: 부산광역시 부산진구 서면로 74 아이온시티빌딩 (4층 접수·진료 / 2층 줄기세포 연구센터)
    // 우편번호 47280 (부산광역시 부산진구 서면로 74 기준)
    streetAddress: "부산광역시 부산진구 서면로 74 아이온시티빌딩 4층",
    addressLocality: "부산진구",
    addressRegion: "부산광역시",
    postalCode: "47280",
    addressCountry: "KR",
  },
  geo: {
    latitude: 35.1579,
    longitude: 129.0597,
  },
  openingHours: [
    "Mo-Fr 10:00-19:00",
    "Sa 09:30-15:00",
  ],
  specialOpeningHours: [],
  priceRange: "₩₩",
  currenciesAccepted: "KRW",
  paymentAccepted: "Cash, Credit Card",
  medicalSpecialty: "Dermatology",
  sameAs: [
    "https://place.naver.com/hospital/12020103",
    "https://www.instagram.com/starpibu",
    "https://www.youtube.com/@starpibu",
    "https://pf.kakao.com/_HNyGC",
    "https://booking.naver.com/booking/13/bizes/209080",
  ],
} as const;


// ── SEO JSON-LD 전용 메타 (buildClinicJsonLd 하드코딩 제거용) ─────────────────────────
// [R24-P1-4] seoHelpers.ts 하드코딩 운영 정보 → constants 단일 소스 정책
/**
 * SEO JSON-LD 전용 운영 메타 상수.
 * buildClinicJsonLd()에서 직접 참조하여 하드코딩을 제거합니다.
 */
export const SEO_CLINIC_META = {
  /** 의료진 수 (numberOfEmployees.value) */
  physicianCount: 3,
  /** 집계 평점 */
  aggregateRating: {
    ratingValue: "4.9",
    reviewCount: "312",
    bestRating: "5",
    worstRating: "1",
  },
  /**
   * 대표 리뷰 샘플 (Schema.org Review)
   * 지역 검색 결과에서 리뷰 스니펫 노출 강화
   */
  reviews: [
    {
      author: "네이버 예약 이용자 A",
      reviewRating: "5",
      reviewBody: "써마지 FLX 시술을 받았는데 원장님이 직접 시술해 주셔서 믿음이 갔습니다. 리프팅 효과가 확실히 느껴졌어요.",
      datePublished: "2024-11-01",
    },
    {
      author: "네이버 예약 이용자 B",
      reviewRating: "5",
      reviewBody: "눈밑지방재배치 수술 후 다크서클이 많이 개선됐습니다. 조원장님 경험이 풍부하셔서 안심하고 받을 수 있었어요.",
      datePublished: "2024-10-15",
    },
    {
      author: "네이버 예약 이용자 C",
      reviewRating: "5",
      reviewBody: "울쎄라피 프라임 받고 피부 탄력이 좋아졌습니다. 직접 시술이라 신뢰가 가고 결과도 만족스러워요.",
      datePublished: "2024-09-20",
    },
  ],
  /**
   * 편의시설 정보 (Schema.org LocationFeatureSpecification)
   * 지역 검색 결과에서 편의시설 정보 노출
   */
  amenityFeature: [
    { name: "주차 가능", value: true },
    { name: "엘리베이터", value: true },
    { name: "휠체어 접근 가능", value: true },
    { name: "영어 상담 가능", value: true },
    { name: "일본어 상담 가능", value: true },
    { name: "중국어 상담 가능", value: true },
    { name: "카카오톡 상담", value: true },
    { name: "네이버 예약", value: true },
  ],
  /**
   * 서비스 제공 지역 (Schema.org areaServed)
   * 지역 검색 범위 세분화
   */
  areaServed: [
    { type: "City", name: "Busan", nameKo: "부산" },
    { type: "AdministrativeArea", name: "Busanjin-gu", nameKo: "부산진구" },
    { type: "AdministrativeArea", name: "Seomyeon", nameKo: "서면" },
    { type: "AdministrativeArea", name: "Gyeongnam", nameKo: "경남" },
  ],
  /**
   * 점심시간 / 공휴일 특별 영업시간
   * specialOpeningHoursSpecification 스키마용
   */
  lunchBreak: {
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "13:00",
    closes: "14:00",
    description: "점심시간 (13:00-14:00)",
  },
  /** 진료 분야 키워드 (knowsAbout) */
  knowsAbout: [
    // 핵심 시술
    "눈밑지방재배치술",
    "울쎄라피 프라임",
    "울쎄라",
    "써마지 FLX",
    "써마지",
    "리주란힐러",
    "피코레이저 토닝",
    "피코레이저",
    "보톡스",
    "필러",
    // 전문 분야
    "피부과 전문의",
    "리프팅",
    "안티에이징",
    "색소치료",
    "피부재생",
    "홍조 치료",
    "로사시아",
    "여드름 치료",
    "흉터 치료",
    "모공 개선",
    "백반증 치료",
    "액취증 치료",
    "다한증 치료",
    // 기술 시그널
    "HIFU 리프팅",
    "RF 리프팅",
    "비수술 리프팅",
    // 지역 시그널
    "부산 피부과",
    "서면 피부과",
    "부산 리프팅",
    "부산진구 피부과",
  ],
  /** 자격증/인증 (hasCredential) */
  hasCredential: [
    {
      credentialCategory: "Medical Specialty Board Certification",
      recognizedBy: "대한피부과학회",
    },
    {
      credentialCategory: "Medical Specialty Board Certification",
      recognizedBy: "대한의사협회",
    },
  ],
  /**
   * 시술 카탈로그 (hasOfferCatalog)
   * Google 지역 검색에서 제공 서비스 목록 노출
   */
  offerCatalog: {
    name: "스타피부과 시술 메뉴",
    itemListElement: [
      { name: "울쎄라피 프라임", url: "https://star-pibu.com/equipment3/울써라피-프라임" },
      { name: "써마지 FLX", url: "https://star-pibu.com/equipment3/써마지-flx" },
      { name: "눈밑지방재배치", url: "https://star-pibu.com/equipment3/눈밑지방재배치" },
      { name: "리주란힐러", url: "https://star-pibu.com/equipment3/리주란힐러" },
      { name: "피코레이저 토닝", url: "https://star-pibu.com/equipment3/피코레이저" },
      { name: "보톡스", url: "https://star-pibu.com/equipment3/보톡스" },
      { name: "필러", url: "https://star-pibu.com/equipment3/필러" },
    ],
  },
} as const;

// ── 의료진 프로필 + 주요 시술 목록 (JSON-LD 스키마용) ─────────────────────────
// [R16-P2-3] lib/clinic-data.ts로 분리 — seoHelpers.ts에서 직접 import
// 하위 호환성을 위해 re-export 유지 (기존 import 경로가 있다면 계속 동작)
export { CLINIC_DOCTORS, CLINIC_PROCEDURES } from "@/lib/clinic-data";

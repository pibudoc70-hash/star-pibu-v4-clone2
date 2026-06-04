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
  description: "부산 서면 위치한 피부과 전문의 클리닉. 눈밑지방재배치술, 울쎄라피, 써마지, 리주란 등 전문의가 직접 시술합니다.",
  address: {
    // 기준값: 부산광역시 부산진구 서면로 74 아이온시티빌딩 (4층 접수·진료 / 2층 줄기세포 연구센터)
    // 우편번호 47189 (부산진구 서면로 74 기준)
    streetAddress: "부산광역시 부산진구 서면로 74 아이온시티빌딩 4층",
    addressLocality: "부산진구",
    addressRegion: "부산광역시",
    postalCode: "47189",
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


// ── 의료진 프로필 (JSON-LD Person 스키마용) ────────────────────────────────────
export const CLINIC_DOCTORS = [
  {
    name: "조시형",
    nameEn: "Cho Si-hyung",
    jobTitle: "피부과 전문의 · 의학박사",
    jobTitleEn: "Dermatologist, MD, PhD",
    url: "https://www.star-pibu.com/#doctors",
    sameAs: [] as string[],
    credentials: [
      "피부과 전문의",
      "부산대학병원 피부과 수련",
      "인제대 피부과 교수 역임",
      "부산경남울산피부과의사회 회장 역임",
      "써마지 FLX 공식 자문의",
      "미국 피부과 학회 정회원(AAD)",
    ],
    specialties: ["눈밑지방재배치", "리프팅", "울쎄라", "써마지", "흉터치료", "색소치료"],
  },
  {
    name: "우혜진",
    nameEn: "Woo Hye-jin",
    jobTitle: "피부과 전문의",
    jobTitleEn: "Dermatologist, MD",
    url: "https://www.star-pibu.com/#doctors",
    sameAs: [] as string[],
    credentials: [
      "피부과 전문의",
      "카톨릭의대 피부과 수련",
      "카톨릭의대 피부과 외래교수 역임",
      "대한 피부과 학회 정회원",
      "미국 피부과 학회 정회원(AAD)",
    ],
    specialties: ["리프팅", "울쎄라", "써마지", "흉터치료", "색소치료", "피부질환"],
  },
  {
    name: "이기욱",
    nameEn: "Lee Gi-wook",
    jobTitle: "피부과 전문의 · 의학박사",
    jobTitleEn: "Dermatologist, MD, PhD",
    url: "https://www.star-pibu.com/#doctors",
    sameAs: [] as string[],
    credentials: [
      "피부과 전문의",
      "고신대학교 의과대학 의학박사",
      "고신대학교 의과대학 피부과 외래교수",
      "대한 피부과학회 정회원",
      "대한 피부과의사회 정회원",
    ],
    specialties: ["리프팅", "울쎄라", "써마지", "색소치료", "백반증", "피부질환"],
  },
] as const;

// ── 주요 시술 목록 (JSON-LD MedicalProcedure 스키마용) ──────────────────────────
export const CLINIC_PROCEDURES = [
  {
    name: "울쎄라피 프라임",
    nameEn: "Ultherapy Prime",
    url: "https://www.star-pibu.com/treatments/ulthera",
    description: "집속 초음파(HIFU)로 SMAS층까지 자극하는 FDA 승인 비수술 리프팅 시술. 시술 당일 일상 복귀 가능.",
    bodyLocation: "얼굴, 목, 데콜테",
    procedureType: "Noninvasive",
    followup: "1~2회 (6~12개월 간격)",
    howPerformed: "집속 초음파(HIFU) 에너지를 피부 깊은 층인 SMAS(근막층)까지 전달하여 리프팅 효과 유도",
  },
  {
    name: "써마지 FLX",
    nameEn: "Thermage FLX",
    url: "https://www.star-pibu.com/treatments/thermage",
    description: "4세대 고주파(RF) 리프팅 장비. 콜라겐 재생 및 피부 탄력 개선. 조시형 원장 공식 자문의.",
    bodyLocation: "얼굴, 목, 눈가, 바디",
    procedureType: "Noninvasive",
    followup: "1~2회 (6~12개월 간격)",
    howPerformed: "고주파(RF) 에너지로 피부 깊은 층의 콜라겐을 가열하여 즉각적인 수축 효과와 장기적인 콜라겐 재생 유도",
  },
  {
    name: "눈밑지방재배치",
    nameEn: "Under-eye Fat Repositioning",
    url: "https://www.star-pibu.com/treatments/under-eye-fat",
    description: "4,000례 이상 경험. 눈밑 과잉 지방을 눈물고랑으로 재배치하여 다크서클과 눈밑 볼록함을 동시에 개선.",
    bodyLocation: "눈밑, 눈물고랑",
    procedureType: "Surgical",
    followup: "1회 (반영구적 효과)",
    howPerformed: "눈 아래 과잉 지방을 제거하지 않고 꺼진 눈물고랑 부위로 재배치하여 자연스러운 눈밑 라인 형성",
  },
  {
    name: "리주란힐러",
    nameEn: "Rejuran Healer",
    url: "https://www.star-pibu.com",
    description: "연어 DNA(PN) 성분으로 피부 재생 및 탄력 개선. 피부 속부터 근본적인 재생을 유도하는 항노화 시술.",
    bodyLocation: "얼굴 전체",
    procedureType: "Minimally Invasive",
    followup: "4~6회 (2~4주 간격)",
    howPerformed: "연어 DNA(PN) 성분을 진피층에 주입하여 피부 재생 인자 활성화",
  },
  {
    name: "피코레이저 토닝",
    nameEn: "Pico Laser Toning",
    url: "https://www.star-pibu.com",
    description: "피코초 단위 레이저로 색소 분해 및 피부 톤 개선. 기미·잡티·모공 개선에 효과적.",
    bodyLocation: "얼굴 전체",
    procedureType: "Noninvasive",
    followup: "5~10회 (1~2주 간격)",
    howPerformed: "피코초(1조분의 1초) 단위 레이저 펄스로 색소 입자를 미세 분쇄하여 자연 배출 유도",
  },
] as const;

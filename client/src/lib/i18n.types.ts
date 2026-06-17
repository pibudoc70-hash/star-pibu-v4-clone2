// i18n 타입 정의 및 공통 상수 — i18n.ts에서 분리 (STRUCT-I18N-1)
/**
 * STAR 피부과 다국어 콘텐츠 데이터
 * 언어: ko(한국어) | en(English) | ja(日本語) | zh(中文)
 *
 * 일본어 출처: OTOMO 부산 (otomo-busan.com/star/)
 * 중국어: 기존 홈페이지 구조 기반 번역
 * 영어: 영어권 외국인 환자 안내
 */

export type Lang = "ko" | "en" | "ja" | "zh";

export const langLabels: Record<Lang, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

export const langCodes: Record<Lang, string> = {
  ko: "KO",
  en: "EN",
  ja: "JP",
  zh: "CN",
};

export const langFlags: Record<Lang, string> = {
  ko: "🇰🇷",
  en: "🇺🇸",
  ja: "🇯🇵",
  zh: "🇨🇳",
};

export interface I18nContent {
  nav: {
    home: string;
    about: string;
    treatments: string;
    equipment: string;
    equipment3: string;
    equipment2: string;
    doctors: string;
    facility: string;
    contact: string;
    foreignGuide: string;
    research: string;
  };
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    floor: string;
    cta_call: string;
    cta_kakao: string;
    cta_reserve: string;
    /** 스크롤 인디케이터 레이블 (언어별 스크롤 힌트 텍스트) */
    scrollLabel?: string;
  };
  about: {
    label: string;
    title: string;
    desc: string;
    stats: Array<{ num: string; label: string }>;
    values: Array<{ letter: string; title: string; desc: string }>;
    /** 환자 상담 이미지 alt 텍스트 */
    consultationAlt: string;
  };
  hours: {
    label: string;
    title: string;
    rows: Array<{ day: string; time: string }>;
    note: string;
  };
  access: {
    label: string;
    title: string;
    address: string;
    subway: string;
    bus: string;
    parking: string;
    // ContactSection labels (CONTACT-P2-A)
    locationInfo?: string;
    sectionTitle?: string;
    addressLabel?: string;
    phoneLabel?: string;
    hoursLabel?: string;
    hoursNote?: string;
    transitLabel?: string;
    transitDesc?: string;
    parkingLabel?: string;
    parkingDesc?: string;
    kakaoMapLabel?: string;
    kakaoChat?: string;
    naverMap?: string;
    copyAddress?: string;
    copiedLabel: string;  // [R7] optional → required (4개 언어 모두 존재 확인)
    /** Map.tsx 구글맵/카카오맵 보기 레이블 */
    mapViewLabel: string;  // [R8] optional → required (4개 언어 모두 존재 확인)
    /** Map.tsx 주소 단철형 */
    mapAddressShort: string;  // [R8] optional → required (4개 언어 모두 존재 확인)
    /** 지도 컨테이너 aria-label */
    mapAriaLabel?: string;
    /** 지도 마커 title */
    mapMarkerTitle?: string;
    // P0-3: ContactSection.tsx 인라인 4중 삼항 제거 — i18n 키로 중앙화
    /** 구글맵 마커 팝업: 병원명 */
    mapPopupClinicName: string;
    /** 구글맵 마커 팝업: 주소 1줄 */
    mapPopupAddrLine1: string;
    /** 구글맵 마커 팝업: 주소 2줄 (건물명 등) */
    mapPopupAddrLine2: string;
    /** 구글맵 마커 팝업: 지하철 출구 정보 */
    mapPopupExitLabel: string;
    /** 구글맵 마커 팝업: 도보 시간 */
    mapPopupWalkLabel: string;
  };
  doctors: {
    label: string;
    title: string;
    list: Array<{
      /** doctors 배열의 id와 매핑되는 고유 식별자 (인덱스 기반 merge 제거) */
      id: number;
      name: string;
      title: string;
      specialty: string;
      intro?: string | string[];
      careers: string[];
      /** 의사별 전문 시술 목록 (언어별 번역) */
      specialties?: string[];
    }>;
    /** 섹션 슬로건 */
    tagline: string;
    /** 피부과전문의 N인 */
    specialistCount: string;
    /** 원장 배지 */
    badge: string;
    /** 피부과전문의 2줄 배지 */
    dermBadge: string;
    /** 전문 시술 레이블 */
    specialtyTitle: string;
    /** 학력·경력·자격 레이블 */
    credentialsTitle: string;
    /** 모바일 스와이프 힌트 */
    swipeHint: string;
    /** 데스크탑 좌측 레일 아이브로우 (예: "Medical Team") */
    teamLabel: string;  // [R8] optional → required (4개 언어 모두 존재 확인)
    /** 의사 탭 버튼 aria-label (예: "{name} 의사 선택") */
    selectDoctorLabel?: string;
    /** 자격증 확장 버튼 aria-label */
    expandCredentialsLabel?: string;
    /** 자격증 접기 버튼 aria-label */
    collapseCredentialsLabel?: string;
    /** 도트 네비게이션 버튼 aria-label (예: "{name} 의사로 이동") */
    dotNavLabel?: string;
  };
  treatments: {
    label: string;
    title: string;
    subtitle: string;
    sortLabel: string;
    sortPopular: string;
    sortName: string;
    sortTime: string;
    noResults: string;
    noResultsHint: string;
    modalTime: string;
    modalRecovery: string;
    modalSessions: string;
    modalEffect: string;
    modalDetailBtn: string;
    modalConsultBtn: string;
    collapseBtn: string;
    moreBtn: string;
    /** 카드 회복 기간 접두어 */
    recoveryPrefix: string;
    /** 관련 장비 패널 헤더 */
    equipmentRelated: string;
    /** 장비 수량 단위 — {n} 치환 */
    equipmentUnits: string;
    /** 장비 상세 준비 중 */
    equipmentDetailPending: string;
    /** 장비 상담 버튼 */
    equipmentConsultBtn: string;
    /** 주의사항 레이블 */
    caution: string;
    categories: Array<{ name: string; items: string[] }>;
  };
  foreignGuide: {
    title: string;
    subtitle: string;
    steps: Array<{ step: string; title: string; desc: string }>;
    tips: string[];
    cta: string;
    transportation: {
      title: string;
      methods: Array<{ name: string; desc: string }>;
    };
    currency: {
      title: string;
      info: string;
      methods: Array<{ name: string; desc: string }>;
    };
    interpretation: {
      title: string;
      desc: string;
      services: Array<{ name: string; desc: string }>;
    };
  };
  footer: {
    address: string;
    tel: string;
    fax: string;
    email: string;
    copyright: string;
    quickMenu: string;
    mainTreatments: string;
    contactInfo: string;
    brandDesc: string;
    faxLabel: string;
    subwayInfo: string;
    nonCovered: string;
    privacy: string;
    bizInfo: string;
  };
  floatingCta: {
    call: string;
    kakao: string;
    reserve: string;
    callAria: string;
    kakaoAria: string;
    reserveAria: string;
  };
  results: {
    sectionTitle: string;
    sectionSubtitle: string;
    stats: Array<{ label: string; desc: string }>;
    whyTitle: string;
    whyItems: Array<{ title: string; desc: string }>;
    treatmentResultsTitle: string;
    treatmentResults: Array<{ treatment: string; period: string; improvements: string[] }>;
    notices: string[];
    disclaimer: string;
  };
  reviews: {
    eyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    ratingSource: string;
    moreReviews: string;
    swipeHint: string;
    prevLabel: string;
    nextLabel: string;
    items: Array<{ name: string; age: string; treatment: string; text: string; platform: string; rating: number; date: string }>;
  };
  facility: {
    sectionTitle: string;
    sectionSubtitle: string;
    highlights: Array<{ label: string }>;
    images: Array<{ label: string; desc: string }>;
    zoomHint: string;
    /** 슬라이드 이전 버튼 aria-label */
    prevSlideLabel: string;
    /** 슬라이드 다음 버튼 aria-label */
    nextSlideLabel: string;
    /** 자동재생 일시정지 버튼 aria-label */
    pauseAutoplayLabel: string;
    /** 자동재생 시작 버튼 aria-label */
    playAutoplayLabel: string;
    /** 슬라이드 이동 버튼 aria-label ({n} 치환) */
    goToSlideLabel: string;
    /** 라이트박스 닫기 버튼 aria-label */
    closeLightboxLabel: string;
  };
  events: {
    eyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    filterAll: string;
    filterNew: string;
    filterEvent: string;
    filterNotice: string;
    filterEtc: string;
    loading: string;
    viewDetail: string;
    views: string;
    empty: string;
    categories: string[];
    noEvents: string;
    readMore: string;
    featured: string;
    /** SPECIAL EVENT 섹션 empty state 제목 */
    specialEmptyTitle: string;
    /** SPECIAL EVENT 섹션 empty state 설명 */
    specialEmptyDesc: string;
  };
  managementDevices: {
    /** 스크롤 이전 버튼 aria-label */
    scrollPrevLabel?: string;
    /** 스크롤 다음 버튼 aria-label */
    scrollNextLabel?: string;
    sectionTitle: string;
    sectionSubtitle: string;
    items: Array<{ name: string; desc: string }>;
  };
  welcomePopup: {
    title: string;
    subtitle: string;
    cta_kakao: string;
    cta_reserve: string;
    cta_call: string;
    dismiss: string;
    dismissToday: string;
  };
  eventDetail: {
    loading: string;
    notFound: string;
    backToList: string;
    views: string;
    intro: string;
    cta_kakao: string;
    cta_call: string;
    directions: string;
    address: string;
    tel: string;
    viewMap: string;
  };
  treatmentDetail: {
    backToHome: string;
    duration: string;
    recovery: string;
    price: string;
    effect: string;
    popular: string;
    faqTitle: string;
    notFound: string;
    backBtn: string;
    ctaConsult: string;
    ctaReserve: string;
  };
  faq: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: Array<{ equipment: string; questions: Array<{ q: string; a: string }> }>;
    ctaLabel: string;
    ctaDesc: string;
  };
  contact: {
    phone: string;
    sms: string;
    kakao: string;
    businessInfo: string;
  };
  youtube: {
    sectionTitle: string;
    sectionSubtitle: string;
    latestVideos: string;
    shorts: string;
    visitChannel: string;
    close: string;
    // P1-1: optional → required 승격 — 4개 언어 모두 값 쳄워져 있음 확인
    loadingLabel: string;
    errorLabel: string;
    errorMessage: string;
    retry: string;
    playVideo: string;
    playShorts: string;
    closeModal: string;
  };
  reservation: {
    sectionTitle: string;
    sectionSubtitle: string;
    loginCta: string;
    guestCta: string;
  };
  treatmentPage: {
    backHome: string;
    recovery: string;
    intro: string;
    effects: string;
    video: string;
    caution: string;
    ctaKakao: string;
    ctaCall: string;
    ctaBook: string;
    otherTreatments: string;
    notFound: string;
    notFoundBack: string;
  };
  researchPage: {
    heroEyebrow: string;
    heroTitle: string;
    heroDesc: string;
    statIntl: string;
    statDomestic: string;
    statCitations: string;
    intlJournalTitle: string;
    intlJournalSubtitle: string;
    domesticJournalTitle: string;
    domesticJournalSubtitle: string;
    presentationsTitle: string;
    presentationsSubtitle: string;
    trainingsTitle: string;
    trainingsSubtitle: string;
    membershipsTitle: string;
    membershipsSubtitle: string;
    badgeIntl: string;
    badgeDomestic: string;
    badgeCitations: string;
    pubmedLabel: string;
    papers: Array<{
      id: number;
      title: string;
      detail: string;
    }>;
    presentations: Array<{
      id: number;
      title: string;
      event: string;
      detail: string;
    }>;
    trainings: Array<{
      id: number;
      detail: string;
      location: string;
    }>;
    memberships: string[];
  };
  consultation: {
    eyebrow: string;
    title: string;
    subtitle: string;
    namePlaceholder: string;
    nameLabel: string;
    phonePlaceholder: string;
    phoneLabel: string;
    concernLabel: string;
    concernPlaceholder: string;
    messagePlaceholder: string;
    messageLabel: string;
    privacyLabel: string;
    privacyLink: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    successNote: string;
    resetBtn: string;
    errorRequired: string;
    errorPhone: string;
    errorMessage: string;
    errorPrivacy: string;
    errorRateLimit: string;
    errorGeneric: string;
    quickTitle: string;
    quickPlaceholder: string;
    quickBtn: string;
    concerns: string[];
  };
}


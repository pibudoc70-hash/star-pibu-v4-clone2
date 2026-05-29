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
    doctors: string;
    facility: string;
    contact: string;
    foreignGuide: string;
  };
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    floor: string;
    cta_call: string;
    cta_kakao: string;
    cta_reserve: string;
  };
  about: {
    label: string;
    title: string;
    desc: string;
    stats: Array<{ num: string; label: string }>;
    values: Array<{ letter: string; title: string; desc: string }>;
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
  };
  doctors: {
    label: string;
    title: string;
    list: Array<{
      name: string;
      title: string;
      specialty: string;
      intro?: string | string[];
      careers: string[];
    }>;
  };
  treatments: {
    label: string;
    title: string;
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
  };
  managementDevices: {
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
    items: Array<{ equipment: string; questions: Array<{ q: string; a: string }> }>
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
}

export const i18n: Record<Lang, I18nContent> = {
  ko: {
    nav: {
      home: "홈",
      about: "피부과 소개",
      treatments: "시술·장비소개",
      equipment: "장비 소개",
      doctors: "피부과전문의",
      facility: "시설안내",
      contact: "오시는 길",
      foreignGuide: "外國語 案內",
    },
    hero: {
      title: "스타피부과",
      subtitle: "당신의 피부가 가장 눈부신 순간",
      badge: "Since 2006",
      floor: "부산 서면 아이온시티빌딩 4층 접수·진료 | 2층 줄기세포 연구센터",
      cta_call: "051-818-2300",
      cta_kakao: "카카오톡 상담",
      cta_reserve: "네이버 예약",
    },
    about: {
      label: "About Us",
      title: "빛나는 피부의 시작",
      desc: "2006년 부산 서면에서 문을 연 스타피부과는 지난 20여 년간 오직 고객의 피부만을 고민해 왔습니다. 세계적인 프리미엄 레이저 장비와 검증된 치료 프로토콜을 통해 의료 서비스의 질을 높였으며, 교수출신 피부과전문의의 20년 이상 풍부한 임상 경험의 노하우를 바탕으로 최상의 결과를 약속드립니다.",
      stats: [
        { num: "20년+", label: "피부과전문의 경력" },
        { num: "4,000례+", label: "눈밑지방재배치술" },
        { num: "50종+", label: "프리미엄 레이저" },
      ],
      values: [
        { letter: "S", title: "Special Guest", desc: "모든 환자분은 우리에게 가장 특별한 분입니다. 개개인의 고민에 귀 기울이는 1:1 맞춤 진료를 실천합니다." },
        { letter: "T", title: "Top Quality", desc: "다양한 프리미엄 레이저와 앞선 의료 기술로 언제나 수준 높은 치료 결과를 선사합니다." },
        { letter: "A", title: "Attractive Atmosphere", desc: "예약제를 통해 대기 시간을 줄이고, 오직 치료에만 집중할 수 있는 편안한 환경을 제공합니다." },
        { letter: "R", title: "Responsibility", desc: "치료 설명과 경과 관찰에 책임감을 갖고, 결과에 만족하실 때까지 함께합니다." },
      ],
    },
    hours: {
      label: "진료시간",
      title: "진료 안내",
      rows: [
        { day: "월·화·수·목·금", time: "10:00 – 19:00" },
        { day: "토요일", time: "09:30 – 15:00" },
        { day: "일·공휴일", time: "휴진" },
      ],
      note: "평일 점심시간 13:00 – 14:00 · 토요일 점심시간 없이 진료",
    },
    access: {
      label: "오시는 길",
      title: "오시는 길",
      address: "부산광역시 부산진구 서면로 74 아이온시티빌딩 2·4층",
      subway: "지하철 1·2호선 서면역 5번·7번 출구 도보 3분",
      bus: "서면교차로 정류장 하차",
      parking: "아이온시티 건물 내 주차 가능",
    },
    doctors: {
      label: "Doctors",
      title: "피부과전문의 3인",
      list: [
        {
          name: "조시형",
          title: "원장",
          specialty: "피부과 전문의 · 의학박사",
          intro: `2006년 부산 서면에서 첫 진료를 시작한 이래, 어느덧 20년이 넘는 시간 동안 수많은 환자분들의 피부 고민을 마주해 왔습니다.
피부 치료는 단순히 장비를 사용하는 기술이 아니라, 환자의 피부 상태를 정확히 읽어내는 '안목'에서 시작됩니다. 무리한 시술보다는 가장 안전하고 자연스러운 결과를 지향합니다.
앞으로도 변함없이 정직하고 숙련된 진료로 여러분의 피부 건강을 지켜드리겠습니다.`,
          careers: [
            "피부과 전문의",
            "부산대학병원 피부과 수련",
            "인제대 피부과 교수역임",
            "인제대, 부산대 외래교수역임",
            "부산경남울산피부과의사회 회장 역임",
            "써마지 FLX 자문의",
            "미국 피부과 학회 정회원(AAD)",
            "현) 스타피부과 원장",
          ],
        },
        {
          name: "우혜진",
          title: "원장",
          specialty: "피부과 전문의",
          intro: `피부과 전문의로서 환자분들의 피부 건강을 최우선으로 생각합니다.
정확한 진단과 맞춤형 치료를 통해 최고의 결과를 제공하기 위해 노력하겠습니다.`,
          careers: [
            "피부과 전문의",
            "카톨릭의대 피부과 수련",
            "카톨릭의대 피부과 외래교수 역임",
            "대한 피부과 학회 정회원",
            "미국 피부과 학회 정회원(AAD)",
            "전) 고운세상 김양제 피부과원장",
          ],
        },
        {
          name: "이기욱",
          title: "원장",
          specialty: "피부과 전문의 · 의학박사",
          intro: `의학박사로서 최신 피부과학 지식을 바탕으로 환자분들께 최고 수준의 의료 서비스를 제공합니다.
안전하고 효과적인 치료를 통해 여러분의 피부 건강을 지켜드리겠습니다.`,
          careers: [
            "피부과 전문의",
            "고신대학교 의과대학 의학박사",
            "고신대학교 의과대학 피부과 외래교수",
            "대한 피부과학회 정회원",
            "대한 피부과의사회 정회원",
            "전) 아름다운피부과 원장",
          ],
        },
      ],
    },
    treatments: {
      label: "시술 안내",
      title: "주요 시술 및 장비",
      categories: [
        { name: "리프팅·탄력", items: ["울쎄라피 프라임", "써마지 FLX", "세르프", "실루엣 리프트"] },
        { name: "볼륨·주사", items: ["스컬트라", "히알루론산 필러", "보톡스"] },
        { name: "눈밑·성형", items: ["눈밑지방재배치", "런치타임 눈밑레이저", "한관종 제거"] },
        { name: "색소·문신제거", items: ["피코레이저", "루비피코레이저", "문신제거", "기미 토닝"] },
        { name: "홍조·혈관확장", items: ["엑셀V+", "시너지"] },
        { name: "여드름", items: ["아비클리어", "플라듀오"] },
        { name: "흉터·모공", items: ["앙코르레이저", "DRT", "화상·여드름 흉터 제거"] },
        { name: "피부질환", items: ["백반증 엑시머레이저", "건선·아토피", "손발톱 무좀", "다한증 보톡스"] },
      ],
    },
    foreignGuide: {
      title: "외국인 환자 안내",
      subtitle: "스타피부과는 외국인 환자를 환영합니다",
      steps: [
        { step: "01", title: "예약", desc: "카카오톡 또는 전화로 예약해 주세요. 영어·중국어·일본어 상담 가능합니다." },
        { step: "02", title: "방문", desc: "서면역 5·7번 출구에서 도보 3분. 아이온시티빌딩 4층입니다." },
        { step: "03", title: "상담·시술", desc: "전문의가 직접 피부 상태를 진단하고 최적의 시술을 안내해 드립니다." },
        { step: "04", title: "사후 관리", desc: "시술 후 관리 방법을 안내해 드리며, 귀국 후에도 온라인 상담이 가능합니다." },
      ],
      tips: [
        "예약 시 여권 정보가 필요합니다",
        "신용카드(Visa/Mastercard) 결제 가능합니다",
        "영수증 발급 가능합니다",
        "주차는 아이온시티 건물 내 가능합니다",
      ],
      cta: "지금 예약하기",
      transportation: {
        title: "교통 안내",
        methods: [
          { name: "지하철", desc: "서면역 1·2호선 5번·7번 출구에서 도보 3분" },
          { name: "버스", desc: "서면교차로 정류장 하차 후 도보 2분" },
          { name: "택시", desc: "부산진구 서면로 74 아이온시티빌딩 4층" },
          { name: "자동차", desc: "아이온시티 건물 내 주차장 이용 가능 (1시간 무료)" },
        ],
      },
      currency: {
        title: "결제 및 환전",
        info: "신용카드 결제 시 자동 환전되며, 현금 결제도 가능합니다",
        methods: [
          { name: "신용카드", desc: "Visa, Mastercard, American Express 모두 가능" },
          { name: "현금", desc: "한국 원화(KRW) 현금 결제 가능" },
          { name: "환전", desc: "인근 은행 및 환전소에서 환전 가능 (서면역 주변)" },
          { name: "국제송금", desc: "필요시 사전 상담 가능" },
        ],
      },
      interpretation: {
        title: "통역 서비스",
        desc: "외국인 환자를 위해 다국어 상담 및 통역 서비스를 제공합니다",
        services: [
          { name: "영어 상담", desc: "영어 가능한 의료진이 직접 상담 (예약 시 요청)" },
          { name: "일본어 상담", desc: "OTOMO 부산(otomo-busan.com)을 통한 전문 통역 서비스" },
          { name: "중국어 상담", desc: "중국어 가능한 의료진 또는 전문 통역사 배치" },
          { name: "기타 언어", desc: "예약 시 사전 요청하면 통역사 배치 가능" },
        ],
      },
    },
    footer: {
      address: "부산광역시 부산진구 서면로 74 아이온시티빌딩 2·4층",
      tel: "051-818-2300",
      fax: "051-818-2310",
      email: "starpibu@naver.com",
      copyright: "© 스타피부과의원. All rights reserved.",
    },
    results: {
      sectionTitle: "스타피부과를 선택하는 이유",
      sectionSubtitle: "20년 이상의 경력을 가진 피부과 전문의가 직접 담당하는 안전하고 자연스러운 결과",
      stats: [
        { label: "전문의 경력", desc: "2006년 개원 이래" },
        { label: "환자 만족도", desc: "네이버 리뷰 기준" },
        { label: "누적 시술 건수", desc: "안전하고 검증된 시술" },
        { label: "원장 직접 시술", desc: "모든 시술 원장 직접 담당" },
      ],
      whyTitle: "스타피부과만의 차별점",
      whyItems: [
        { title: "검증된 경험", desc: "20년 이상 피부과 임상 경험으로 안전하고 신뢰할 수 있는 시술 제공" },
        { title: "환자 중심 진료", desc: "1:1 맞춤 상담으로 개인의 피부 상태에 최적화된 시술 계획 수립" },
        { title: "최신 장비", desc: "국내 최고 수준의 레이저 및 시술 장비로 최상의 결과 보장" },
      ],
      treatmentResultsTitle: "주요 시술별 기대 효과",
      treatmentResults: [
        { treatment: "눈밑지방재배치", period: "시술 후 4주", improvements: ["다크서클 개선", "눈밑 볼록함 해소", "자연스러운 눈밑 라인"] },
        { treatment: "써마지 FLX", period: "시술 후 3개월", improvements: ["피부 탄력 강화", "콜라겐 재생", "전체적인 피부 개선"] },
        { treatment: "울쎄라 프라임", period: "시술 후 6주", improvements: ["SMAS층 리프팅", "피부 탄력 개선", "주름 완화"] },
        { treatment: "루비피코레이저", period: "3~5회 시술 후", improvements: ["기미·잡티 개선", "피부 톤 밝아짐", "색소 침착 방지"] },
        { treatment: "색소 치료", period: "4~6회 시술 후", improvements: ["기미·검버섯 개선", "피부 톤 균일화", "잡티 제거"] },
        { treatment: "안면홍조 치료", period: "3회 치료 후", improvements: ["홍조 완화", "모세혈관 축소", "균일한 피부 톤"] },
      ],
      notices: [
        "모든 시술 결과는 환자 개인에 따라 다를 수 있습니다",
        "시술 전 반드시 전문의 1:1 상담을 받으시기 바랍니다",
      ],
      disclaimer: "본 정보는 의료 정보 제공 목적이며, 진단·치료를 대체할 수 없습니다. 정확한 상담은 전문의와 직접 상담하시기 바랍니다.",
    },
    reviews: {
      eyebrow: "환자 후기",
      sectionTitle: "환자 후기",
      sectionSubtitle: "스타피부과를 찾아주신 환자분들의 생생한 후기입니다",
      ratingSource: "네이버 리뷰 기준",
      moreReviews: "더 많은 후기 보기",
      swipeHint: "← 스와이프 →",
      prevLabel: "이전",
      nextLabel: "다음",
      items: [
        { name: "김**", age: "", treatment: "눈밑지방재배치", text: "다크서클이 정말 심했는데 시술 후 한 달 만에 눈이 확 밝아졌어요. 자연스럽고 만족합니다!", platform: "Naver", rating: 5, date: "" },
        { name: "이**", age: "", treatment: "피코레이저", text: "기미가 많았는데 3회 시술로 정말 많이 개선됐어요. 피부톤도 밝아지고 만족합니다.", platform: "Naver", rating: 5, date: "" },
        { name: "박**", age: "", treatment: "울쎄라피 프라임", text: "리프팅 효과가 정말 좋습니다. 자연스럽고 회복 기간도 짧아서 좋아요.", platform: "Naver", rating: 5, date: "" },
        { name: "최**", age: "", treatment: "써마지 FLX", text: "써마지 받고 나서 피부 탄력이 확실히 좋아졌어요. 원장님이 꼼꼼하게 설명해 주셔서 믿음이 갔고, 시술 후 관리도 친절하게 안내해 주셨습니다.", platform: "Naver", rating: 5, date: "" },
        { name: "정**", age: "", treatment: "울쎄라피 프라임", text: "서면에서 울쎄라 맞으러 여러 군데 상담 다녔는데 스타피부과가 제일 전문적이었어요. 원장님이 직접 시술해 주시고 효과도 확실합니다. 강력 추천해요!", platform: "Naver", rating: 5, date: "" },
        { name: "한**", age: "", treatment: "레이저 토닝", text: "잡티 때문에 고민이 많았는데 몇 번 시술 받고 나서 확실히 피부가 맑아졌어요. 직원분들도 너무 친절하고 시설도 깔끔해서 자주 오게 되는 것 같아요.", platform: "Naver", rating: 5, date: "" },
        { name: "윤**", age: "", treatment: "눈밑지방재배치", text: "눈밑 수술 고민을 오래 했는데 원장님이 상담에서 부작용 걱정 없이 자세히 설명해 주셔서 결정했어요. 수술 후 회복도 빠르고 결과가 너무 자연스러워서 만족합니다.", platform: "Naver", rating: 5, date: "" },
        { name: "강**", age: "", treatment: "피코레이저", text: "오랫동안 고민했던 기미가 3회 만에 많이 옅어졌어요. 피부과 전문의 원장님이 직접 시술해 주시니 안심이 되고, 효과도 기대 이상입니다!", platform: "Naver", rating: 5, date: "" },
        { name: "조**", age: "", treatment: "써마지 FLX", text: "40대인데 써마지 받고 나서 주변에서 얼굴이 어떻게 된 거냐고 물어볼 정도로 달라졌어요. 통증도 생각보다 적었고 회복도 빨랐습니다. 정말 만족해요.", platform: "Naver", rating: 5, date: "" },
      ],
    },
    facility: {
      sectionTitle: "시설 안내",
      sectionSubtitle: "최신 의료 장비와 쾌적한 환경",
      highlights: [
        { label: "최신 레이저 장비" },
        { label: "피부과 전문의 경력 20년 이상" },
        { label: "청결한 시술실" },
        { label: "편안한 대기실" },
      ],
      images: [
        { label: "외관", desc: "부산 서면 아이온시티빌딩" },
        { label: "대기실", desc: "호텔식 인테리어의 쾌적한 대기실" },
        { label: "상담실", desc: "프라이빗한 상담 공간" },
        { label: "시술실", desc: "최신 의료 장비가 갖춰진 시술실" },
        { label: "시술실 상세", desc: "고급 의료 장비 구성" },
        { label: "대기실 상세", desc: "편안한 휴식 공간" },
      ],
      zoomHint: "이미지를 클릭하여 확대보기",
    },
    events: {
      eyebrow: "이벤트",
      sectionTitle: "이벤트 & 공지사항",
      sectionSubtitle: "스타피부과의 최신 소식을 확인하세요",
      filterAll: "전체",
      filterNew: "신시술",
      filterEvent: "이벤트",
      filterNotice: "공지사항",
      filterEtc: "기타",
      loading: "로딩 중...",
      viewDetail: "자세히 보기",
      views: "조회",
      empty: "현재 이용 가능한 이벤트가 없습니다",
      categories: ["전체", "신시술", "이벤트", "공지사항", "기타"],
      noEvents: "현재 이용 가능한 이벤트가 없습니다",
      readMore: "자세히 보기",
      featured: "주요 이벤트",
    },
    managementDevices: {
      sectionTitle: "관리 장비",
      sectionSubtitle: "스타피부과 관리 장비",
      items: [
        { name: "워터필 필링", desc: "피부 클렌징 및 보습" },
        { name: "이온 도입", desc: "유효 성분 침투 강화" },
        { name: "초음파 케어", desc: "피부 진정 및 흡수 촉진" },
        { name: "LED 광선 치료", desc: "피부 재생 및 진정" },
        { name: "고주파 케어", desc: "피부 탄력 및 리프팅" },
        { name: "미세전류", desc: "피부 탄력 개선" },
        { name: "냉각 케어", desc: "시술 후 진정 및 냉각" },
        { name: "산소 케어", desc: "피부 활성화 및 재생" },
      ],
    },
    welcomePopup: {
      title: "스타피부과 이벤트",
      subtitle: "지금 확인하세요",
      cta_kakao: "카카오톡 상담",
      cta_reserve: "온라인 예약",
      cta_call: "전화 예약",
      dismiss: "닫기",
      dismissToday: "오늘은 표시하지 않기",
    },
    eventDetail: {
      loading: "로딩 중...",
      notFound: "이벤트를 찾을 수 없습니다.",
      backToList: "이벤트 목록으로",
      views: "조회",
      intro: "이벤트 상세",
      cta_kakao: "카카오톡 상담",
      cta_call: "전화 예약",
      directions: "오시는 길",
      address: "부산 서면 아이온시티빌딩 2·4층",
      tel: "051-818-2300",
      viewMap: "지도 보기",
    },
    treatmentDetail: {
      backToHome: "홈으로",
      duration: "시술 시간",
      recovery: "회복 기간",
      price: "가격",
      effect: "기대 효과",
      popular: "인기",
      faqTitle: "자주 묻는 질문",
      notFound: "시술 정보를 찾을 수 없습니다.",
      backBtn: "돌아가기",
      ctaConsult: "카카오톡 상담",
      ctaReserve: "네이버 예약",
    },
    faq: {
      sectionTitle: "자주 묻는 질문",
      sectionSubtitle: "시술에 대한 궁금한 점을 해결하세요",
      items: [
        {
          equipment: "울쎄라",
          questions: [
            { q: "울쎄라는 어떤 시술인가요?", a: "울쎄라는 초음파(HIFU) 에너지를 이용한 리프팅 시술로, 피부 깊숙이 열을 전달하여 콜라겐을 재생시킵니다. 수술 없이 피부를 당겨주는 효과가 있습니다." },
            { q: "시술 후 회복 기간은?", a: "즉시 일상생활이 가능하며, 약간의 홍조나 붓기가 있을 수 있지만 1~2일 내 가라앉습니다." },
            { q: "효과는 언제부터 나타나나요?", a: "시술 직후부터 효과를 느낄 수 있으며, 콜라겐 재생이 완료되는 3개월 후 최고의 효과를 경험합니다." },
            { q: "시술 간격은 얼마나 되나요?", a: "보통 6개월~1년 간격으로 시술을 권장합니다." },
          ]
        },
        {
          equipment: "써마지",
          questions: [
            { q: "써마지와 울쎄라의 차이점은?", a: "써마지는 RF(고주파) 에너지를 사용하며, 울쎄라는 초음파를 사용합니다. 써마지는 피부 표면부터 깊은 층까지 균일하게 열을 전달하며, 두 시술을 병용하면 더 좋은 효과를 얻을 수 있습니다." },
            { q: "시술 시간은 얼마나 걸리나요?", a: "부위에 따라 30분~1시간 30분 정도 소요됩니다." },
            { q: "통증이 있나요?", a: "약간의 열감이 있지만 통증은 거의 없습니다. 시술 전 마취크림을 도포하여 편안하게 시술받을 수 있습니다." },
            { q: "효과 지속 기간은?", a: "개인차가 있지만 보통 1~2년 정도 효과가 지속됩니다." },
          ]
        },
        {
          equipment: "세르프",
          questions: [
            { q: "세르프는 어떤 시술인가요?", a: "세르프(XERF)는 고주파를 이용한 최신 리프팅 기술로, 빠른 시술 시간과 뛰어난 효과가 특징입니다. 피부 탄력 개선과 리프팅 효과가 동시에 나타납니다." },
            { q: "한 번의 시술로 효과가 있나요?", a: "네, 한 번의 시술로도 즉각적인 효과를 볼 수 있으며, 정기적인 시술로 더 좋은 결과를 유지할 수 있습니다." },
            { q: "시술 후 주의사항은?", a: "시술 후 2~3일간 강한 자외선 노출을 피하고, 보습 관리를 철저히 해주세요." },
          ]
        },
        {
          equipment: "눈밑지방재배치",
          questions: [
            { q: "눈밑지방재배치란 무엇인가요?", a: "눈밑에 불룩하게 튀어나온 지방을 재배치하여 눈밑 꺼짐을 개선하는 시술입니다. 절개 없이 자연스러운 결과를 얻을 수 있습니다." },
            { q: "시술 후 회복 기간은?", a: "약 1~2주 정도 붓기와 멍이 있을 수 있으며, 2~4주 후 자연스러운 모습으로 회복됩니다." },
            { q: "재발 가능성이 있나요?", a: "지방을 제거하는 것이 아닌 재배치하는 시술이므로 재발 가능성이 낮습니다." },
          ]
        },
        {
          equipment: "엔라이튼",
          questions: [
            { q: "엔라이튼은 어떤 레이저인가요?", a: "엔라이튼은 피코초(Picosecond) 레이저로, 기존 나노초 레이저보다 1,000배 빠른 속도로 에너지를 전달합니다. 색소 분해 효율이 뛰어나 기미, 잡티, 문신 제거에 탁월한 효과를 발휘합니다." },
            { q: "시술 횟수는 몇 회 정도 필요한가요?", a: "증상의 깊이와 색소 농도에 따라 다르지만, 일반적으로 기미·잡티는 3~5회, 문신 제거는 5~10회 정도 권장합니다. 전문의 상담 후 개인 맞춤 계획을 수립합니다." },
            { q: "시술 후 회복 기간은 어떻게 되나요?", a: "시술 직후 약간의 홍조와 열감이 있을 수 있으며, 대부분 당일 일상생활이 가능합니다. 딱지가 생기는 경우 1~2주 내 자연스럽게 탈락합니다." },
            { q: "기존 레이저 토닝과 차이점은 무엇인가요?", a: "기존 레이저 토닝은 나노초 단위의 에너지를 사용하는 반면, 엔라이튼은 피코초 단위로 에너지를 전달해 색소를 더 미세하게 분쇄합니다. 주변 조직 손상이 적고 효과는 더 뛰어납니다." },
            { q: "시술 후 주의사항은 무엇인가요?", a: "시술 후 2주간 자외선 차단제를 꼼꼼히 바르고, 직사광선을 피해야 합니다. 사우나·찜질방·과격한 운동은 1주일 정도 자제하시고, 처방받은 재생 크림을 꾸준히 사용해 주세요." },
          ]
        },
        {
          equipment: "엑셀V+",
          questions: [
            { q: "엑셀V+는 어떤 시술인가요?", a: "엑셀V+는 혈관·색소 레이저로, 532nm와 1064nm 두 가지 파장을 이용해 홍조, 실핏줄, 혈관종, 붉은 흉터, 색소성 병변 등을 효과적으로 치료합니다." },
            { q: "어떤 피부 고민에 효과적인가요?", a: "안면 홍조, 모세혈관 확장증, 딸기코(주사), 혈관종, 체리 혈관종, 기미·잡티, 붉은 흉터, 여드름 후 홍반 등 다양한 혈관·색소 문제에 효과적입니다." },
            { q: "시술 시 통증이 있나요?", a: "시술 부위에 따라 고무줄로 튕기는 듯한 가벼운 통증이 있을 수 있습니다. 필요에 따라 마취 크림을 도포하여 불편함을 최소화합니다." },
            { q: "시술 후 멍이나 딱지가 생기나요?", a: "혈관 치료 후 일시적으로 멍이 생길 수 있으며, 보통 1~2주 내 사라집니다. 색소 치료 시 미세한 딱지가 생길 수 있으나 자연스럽게 탈락합니다." },
            { q: "몇 회 시술이 필요한가요?", a: "증상의 종류와 정도에 따라 다르지만, 안면 홍조·혈관 확장은 평균 3~5회, 색소 병변은 2~4회 정도 권장합니다. 개인 상태에 따라 전문의가 맞춤 계획을 안내합니다." },
          ]
        },
        {
          equipment: "리쥬란",
          questions: [
            { q: "리쥬란은 어떤 시술인가요?", a: "리쥬란은 연어 DNA(PDRN)에서 추출한 폴리뉴클레오타이드(PN) 성분을 피부에 주입하는 피부 재생 시술입니다. 손상된 세포를 복구하고 콜라겐 생성을 촉진하여 피부 탄력과 윤기를 개선합니다." },
            { q: "리쥬란 힐러와 리쥬란 아이의 차이점은?", a: "리쥬란 힐러는 얼굴 전체 피부 재생에 사용되며, 리쥬란 아이는 눈가 전용으로 더 묽은 농도로 제조되어 얇은 눈가 피부에 적합합니다. 두 제품 모두 PN 성분을 기반으로 합니다." },
            { q: "시술 후 효과는 언제부터 나타나나요?", a: "시술 후 1~2주부터 피부 결이 개선되는 것을 느낄 수 있으며, 3~4회 시술 후 콜라겐 재생이 활발해지면서 탄력과 윤기가 눈에 띄게 향상됩니다." },
            { q: "시술 후 붓기나 멍이 생기나요?", a: "주사 시술이므로 주사 자국과 함께 약간의 붓기가 생길 수 있습니다. 대부분 1~3일 내 가라앉으며, 멍이 드는 경우도 있지만 1주일 내 사라집니다." },
            { q: "시술 간격과 횟수는 어떻게 되나요?", a: "처음에는 2~4주 간격으로 4회 정도 집중 시술을 권장하며, 이후 3~6개월 간격으로 유지 관리 시술을 받으시면 효과를 오래 지속할 수 있습니다." },
          ]
        },
      ]
    },
    contact: {
      phone: "051-818-2300",
      sms: "010-5855-3201",
      kakao: "@스타피부과",
      businessInfo: "사업자등록번호: 605-24-84306 | 이메일: starpibu@naver.com",
    },
    youtube: {
      sectionTitle: "피부과전문의가 알려주는 피부이야기",
      sectionSubtitle: "스타피부과 유튜브 채널에서 더 많은 정보를 확인하세요",
      latestVideos: "최신 영상",
      shorts: "쇼츠",
      visitChannel: "유튜브 채널 방문하기",
      close: "닫기",
    },
    reservation: {
      sectionTitle: "온라인 예약",
      sectionSubtitle: "간편하게 예약하고 대기 없이 방문하세요",
      loginCta: "로그인하고 예약하기",
      guestCta: "비회원으로 예약하기",
    },
    treatmentPage: {
      backHome: "홈으로 돌아가기",
      recovery: "회복기간",
      intro: "시술 소개",
      effects: "기대 효과",
      video: "시술 영상",
      caution: "주의사항",
      ctaKakao: "카카오톡 상담",
      ctaCall: "전화 상담",
      ctaBook: "예약 신청",
      otherTreatments: "다른 시술 보기",
      notFound: "시술 정보를 찾을 수 없습니다.",
      notFoundBack: "홈으로 돌아가기",
    },
  },

  en: {
    nav: {
      home: "Home",
      about: "About Us",
      treatments: "Treatments & Equipment",
      equipment: "Equipment",
      doctors: "Doctors",
      facility: "Facility",
      contact: "Directions",
      foreignGuide: "Foreign Patient Guide",
    },
    hero: {
      title: "STAR Dermatology",
      subtitle: "Where Natural Beauty Begins",
      badge: "Since 2006",
      floor: "Busan Seomyeon ION City Bldg. 4F Reception & Treatment | 2F Stem Cell Research Center",
      cta_call: "+82-51-818-2300",
      cta_kakao: "KakaoTalk",
      cta_reserve: "Naver Booking",
    },
    about: {
      label: "About Us",
      title: "Welcome to STAR Dermatology",
      desc: "Since our founding in 2006, STAR Dermatology in Busan's Seomyeon district has provided personalized 1:1 consultations led directly by board-certified dermatologists. With over 50 original laser devices and specialists with 20+ years of experience, we deliver outstanding results tailored to each patient.",
      stats: [
        { num: "4,000+", label: "Under-Eye Fat Repositioning" },
        { num: "20+ yrs", label: "Board-Certified Specialists" },
        { num: "50+", label: "Original Laser Devices" },
      ],
      values: [
        { letter: "S", title: "Special Guest", desc: "Every patient is our most special guest. We practice personalized 1:1 consultations that truly listen to each individual's concerns." },
        { letter: "T", title: "Top Quality", desc: "With diverse premium laser devices and advanced medical technology, we consistently deliver outstanding treatment results." },
        { letter: "A", title: "Attractive Atmosphere", desc: "Our appointment-based system minimizes waiting time, providing a comfortable environment where you can focus solely on your treatment." },
        { letter: "R", title: "Responsibility", desc: "We take full responsibility for treatment explanations and follow-up care, staying with you until you are completely satisfied with the results." },
      ],
    },
    hours: {
      label: "Hours",
      title: "Clinic Hours",
      rows: [
        { day: "Mon – Fri", time: "10:00 – 19:00" },
        { day: "Saturday", time: "09:30 – 15:00" },
        { day: "Sun & Holidays", time: "Closed" },
      ],
      note: "Weekday lunch break 13:00 – 14:00 · No lunch break on Saturdays",
    },
    access: {
      label: "Directions",
      title: "How to Get Here",
      address: "ION City Building 2F & 4F, 74 Seomyeon-ro, Busanjin-gu, Busan",
      subway: "Subway Line 1 & 2 – Seomyeon Station Exit 5 or 7, 3-min walk",
      bus: "Get off at Seomyeon Intersection stop",
      parking: "Parking available inside ION City Building",
    },
    doctors: {
      label: "Our Doctors",
      title: "Meet Our Specialists",
      list: [
        {
          name: "Dr. Cho Si-hyung",
          title: "Director",
          specialty: "Board-Certified Dermatologist · MD, PhD",
          intro: [
            "Since opening in Busan Seomyeon in 2006, I have spent over 20 years listening to the skin concerns of countless patients.",
            "Skin treatment is not merely a technique of using equipment — it begins with the insight to accurately read each patient's skin condition. I always pursue the safest and most natural results rather than aggressive procedures.",
            "I will continue to provide honest, skilled care to protect your skin health."
          ],
          careers: [
            "Board-Certified Dermatologist",
            "Residency at Pusan National University Hospital, Dermatology",
            "Former Professor, Inje University Dermatology",
            "Former Adjunct Professor, Inje & Pusan National University",
            "Former President, Busan·Gyeongnam·Ulsan Dermatology Association",
            "Medical Advisor, Thermage FLX",
            "Member, American Academy of Dermatology (AAD)",
            "Current Director, STAR Dermatology Clinic",
          ],
        },
        {
          name: "Dr. Woo Hye-jin",
          title: "Director",
          specialty: "Board-Certified Dermatologist",
          intro: [
            "As a board-certified dermatologist, I place your skin health as my top priority.",
            "I strive to deliver the best results through accurate diagnosis and personalized treatment."
          ],
          careers: [
            "Board-Certified Dermatologist",
            "Residency at Catholic University Medical School, Dermatology",
            "Former Adjunct Professor, Catholic University Medical School, Dermatology",
            "Member, Korean Dermatological Association",
            "Member, American Academy of Dermatology (AAD)",
            "Former Director, Gowoon Sesang Kim Yang-je Dermatology",
          ],
        },
        {
          name: "Dr. Lee Ki-wook",
          title: "Director",
          specialty: "Board-Certified Dermatologist · MD, PhD",
          intro: [
            "As a medical doctor with a PhD, I provide the highest level of medical service based on the latest dermatological knowledge.",
            "I am committed to protecting your skin health through safe and effective treatments."
          ],
          careers: [
            "Board-Certified Dermatologist",
            "MD, PhD — Kosin University College of Medicine",
            "Adjunct Professor, Kosin University College of Medicine, Dermatology",
            "Member, Korean Dermatological Association",
            "Member, Korean Dermatology Practitioners Association",
            "Former Director, Areumdaun Dermatology Clinic",
          ],
        },
      ],
    },
    treatments: {
      label: "Treatments",
      title: "Popular Treatments & Equipment",
      categories: [
        { name: "Lifting & Firming", items: ["Ultherapy Prime", "Thermage FLX", "XERF", "Silhouette Lift"] },
        { name: "Volume & Injections", items: ["Sculptra", "Hyaluronic Acid Filler", "Botox"] },
        { name: "Under-Eye & Contouring", items: ["Under-Eye Fat Repositioning", "Lunch-Time Under-Eye Laser", "Syringoma Removal"] },
        { name: "Pigmentation & Tattoo Removal", items: ["Pico Laser", "Ruby Pico Laser", "Tattoo Removal", "Melasma Toning"] },
        { name: "Redness & Vascular", items: ["Excel V+", "Synergy"] },
        { name: "Acne", items: ["Abiclaire", "Pladuo"] },
        { name: "Scars & Pores", items: ["Encore Laser", "DRT", "Burn & Acne Scar Removal"] },
        { name: "Skin Conditions", items: ["Vitiligo Excimer Laser", "Psoriasis & Atopy", "Nail Fungus Laser", "Hyperhidrosis Botox"] },
      ],
    },
    foreignGuide: {
      title: "Foreign Patient Guide",
      subtitle: "STAR Dermatology Welcomes International Patients",
      steps: [
        { step: "01", title: "Book", desc: "Reserve via KakaoTalk or phone. Consultations available in English, Chinese, and Japanese." },
        { step: "02", title: "Visit", desc: "3-min walk from Seomyeon Station Exit 5 or 7. ION City Building, 4th Floor." },
        { step: "03", title: "Consult & Treat", desc: "Our specialists personally assess your skin and recommend the most suitable treatment." },
        { step: "04", title: "Aftercare", desc: "We provide detailed post-treatment care instructions. Online consultations available after you return home." },
      ],
      tips: [
        "Passport information required at booking",
        "Credit card payment accepted (Visa / Mastercard)",
        "Official receipts available upon request",
        "Parking available inside ION City Building",
      ],
      cta: "Book Now",
      transportation: {
        title: "Getting Here",
        methods: [
          { name: "Subway", desc: "Seomyeon Station (Line 1 & 2), Exit 5 or 7 – 3-minute walk" },
          { name: "Bus", desc: "Get off at Seomyeon Intersection stop – 2-minute walk" },
          { name: "Taxi", desc: "74 Seomyeon-ro, Busanjin-gu, Busan (ION City Building, 4F)" },
          { name: "Car", desc: "Parking available in ION City Building (1st hour free)" },
        ],
      },
      currency: {
        title: "Payment & Currency Exchange",
        info: "Credit cards are automatically converted at current exchange rates. Cash payments in Korean Won also accepted.",
        methods: [
          { name: "Credit Cards", desc: "Visa, Mastercard, American Express all accepted" },
          { name: "Cash", desc: "Korean Won (KRW) cash payment available" },
          { name: "Currency Exchange", desc: "Exchange offices available near Seomyeon Station" },
          { name: "International Transfer", desc: "Bank transfer available upon prior consultation" },
        ],
      },
      interpretation: {
        title: "Interpretation Services",
        desc: "We provide multilingual consultation and interpretation services for international patients",
        services: [
          { name: "English Consultation", desc: "English-speaking doctors available (request at booking)" },
          { name: "Japanese Consultation", desc: "Professional interpretation via OTOMO Busan (otomo-busan.com)" },
          { name: "Chinese Consultation", desc: "Chinese-speaking doctors or professional interpreters available" },
          { name: "Other Languages", desc: "Interpreters can be arranged upon request at booking" },
        ],
      },
    },
    footer: {
      address: "ION City Building 2F & 4F, 74 Seomyeon-ro, Busanjin-gu, Busan, Korea",
      tel: "+82-51-818-2300",
      fax: "051-818-2310",
      email: "starpibu@naver.com",
      copyright: "© STAR Dermatology Clinic. All rights reserved.",
    },
    results: {
      sectionTitle: "Why Choose STAR Dermatology",
      sectionSubtitle: "Safe and natural results delivered directly by a board-certified dermatologist with over 20 years of experience",
      stats: [
        { label: "Years of Experience", desc: "Est. 2006" },
        { label: "Patient Satisfaction", desc: "Based on Naver reviews" },
        { label: "Total Procedures", desc: "Safe and proven treatments" },
        { label: "Doctor-Performed", desc: "All procedures by our doctors" },
      ],
      whyTitle: "What Sets Us Apart",
      whyItems: [
        { title: "Proven Expertise", desc: "Over 20 years of clinical dermatology experience for safe and trustworthy treatments" },
        { title: "Patient-Centered Care", desc: "1:1 personalized consultations to create the optimal treatment plan for your skin" },
        { title: "State-of-the-Art Equipment", desc: "Top-tier laser and treatment devices for the best possible results" },
      ],
      treatmentResultsTitle: "Expected Results by Treatment",
      treatmentResults: [
        { treatment: "Under-Eye Fat Repositioning", period: "4 weeks post-treatment", improvements: ["Dark circle improvement", "Reduced under-eye puffiness", "Natural under-eye contour"] },
        { treatment: "Thermage FLX", period: "3 months post-treatment", improvements: ["Enhanced skin firmness", "Collagen regeneration", "Overall skin improvement"] },
        { treatment: "Ultherapy Prime", period: "6 weeks post-treatment", improvements: ["SMAS layer lifting", "Improved skin elasticity", "Wrinkle reduction"] },
        { treatment: "Ruby Pico Laser", period: "After 3-5 sessions", improvements: ["Melasma & spot improvement", "Brighter skin tone", "Pigmentation prevention"] },
        { treatment: "Pigmentation Treatment", period: "After 4-6 sessions", improvements: ["Melasma & age spot improvement", "Even skin tone", "Spot removal"] },
        { treatment: "Facial Redness Treatment", period: "After 3 sessions", improvements: ["Redness reduction", "Capillary shrinkage", "Even skin tone"] },
      ],
      notices: [
        "Individual results may vary",
        "A 1:1 consultation with a specialist is required before any procedure",
      ],
      disclaimer: "This information is provided for educational purposes only and does not replace professional medical diagnosis or treatment. Please consult directly with our specialists for accurate advice.",
    },
    reviews: {
      eyebrow: "Patient Reviews",
      sectionTitle: "Patient Reviews",
      sectionSubtitle: "Real testimonials from our satisfied patients",
      ratingSource: "Based on Naver reviews",
      moreReviews: "View More Reviews",
      swipeHint: "← Swipe →",
      prevLabel: "Previous",
      nextLabel: "Next",
      items: [
        { name: "Kim**", age: "", treatment: "Under-Eye Fat Repositioning", text: "My dark circles were severe, but after the procedure, my eyes brightened within a month. Very natural and satisfied!", platform: "Naver", rating: 5, date: "" },
        { name: "Lee**", age: "", treatment: "Pico Laser", text: "I had many age spots, and after 3 sessions they improved significantly. My skin tone is also brighter now.", platform: "Naver", rating: 5, date: "" },
        { name: "Park**", age: "", treatment: "Ultherapy Prime", text: "The lifting effect is excellent. Very natural results with minimal recovery time. Highly satisfied!", platform: "Naver", rating: 5, date: "" },
        { name: "Choi**", age: "", treatment: "Thermage FLX", text: "My skin elasticity improved noticeably after Thermage. The doctor explained everything thoroughly, which gave me confidence. Post-treatment care guidance was also very kind.", platform: "Naver", rating: 5, date: "" },
        { name: "Jung**", age: "", treatment: "Ultherapy Prime", text: "I consulted at several clinics in Seomyeon for Ultherapy and STAR Dermatology was the most professional. The doctor performed the procedure personally and the results are outstanding. Highly recommend!", platform: "Naver", rating: 5, date: "" },
        { name: "Han**", age: "", treatment: "Laser Toning", text: "I had many skin concerns but after a few sessions my skin became noticeably clearer. The staff are so kind and the facility is spotless — I keep coming back!", platform: "Naver", rating: 5, date: "" },
        { name: "Yoon**", age: "", treatment: "Under-Eye Fat Repositioning", text: "I had been considering under-eye surgery for a long time. The doctor explained everything in detail during consultation, which eased my concerns. Recovery was fast and the results look incredibly natural.", platform: "Naver", rating: 5, date: "" },
        { name: "Kang**", age: "", treatment: "Pico Laser", text: "Age spots I had struggled with for years faded significantly after just 3 sessions. Having a board-certified dermatologist perform the procedure directly gave me great peace of mind. Results exceeded expectations!", platform: "Naver", rating: 5, date: "" },
        { name: "Cho**", age: "", treatment: "Thermage FLX", text: "In my 40s, after Thermage people around me started asking what I did to my face — it changed that much. Pain was less than expected and recovery was quick. Very satisfied.", platform: "Naver", rating: 5, date: "" },
      ],
    },
    facility: {
      sectionTitle: "Facility",
      sectionSubtitle: "State-of-the-art equipment and comfortable environment",
      highlights: [
        { label: "Latest Laser Equipment" },
        { label: "Experienced Medical Staff" },
        { label: "Clean Treatment Rooms" },
        { label: "Comfortable Waiting Area" },
      ],
      images: [
        { label: "Exterior", desc: "ION City Building, Seomyeon, Busan" },
        { label: "Waiting Area", desc: "Hotel-style comfortable waiting room" },
        { label: "Consultation Room", desc: "Private consultation space" },
        { label: "Treatment Room", desc: "State-of-the-art treatment facility" },
        { label: "Treatment Room Detail", desc: "Advanced medical equipment setup" },
        { label: "Waiting Area Detail", desc: "Comfortable rest space" },
      ],
      zoomHint: "Click image to zoom",
    },
    events: {
      eyebrow: "Events",
      sectionTitle: "Events & News",
      sectionSubtitle: "Stay updated with the latest from STAR Dermatology",
      filterAll: "All",
      filterNew: "New Treatments",
      filterEvent: "Events",
      filterNotice: "Announcements",
      filterEtc: "Other",
      loading: "Loading...",
      viewDetail: "View Details",
      views: "Views",
      empty: "No events currently available",
      categories: ["All", "New Treatments", "Events", "Announcements", "Other"],
      noEvents: "No events currently available",
      readMore: "View Details",
      featured: "Featured Event",
    },
    managementDevices: {
      sectionTitle: "Management Devices",
      sectionSubtitle: "STAR Dermatology Management Equipment",
      items: [
        { name: "Water Peel", desc: "Skin cleansing and hydration" },
        { name: "Ion Infusion", desc: "Enhanced active ingredient penetration" },
        { name: "Ultrasound Care", desc: "Skin soothing and absorption promotion" },
        { name: "LED Light Therapy", desc: "Skin regeneration and calming" },
        { name: "RF Care", desc: "Skin elasticity and lifting" },
        { name: "Microcurrent", desc: "Improved skin elasticity" },
        { name: "Cooling Care", desc: "Post-treatment soothing and cooling" },
        { name: "Oxygen Care", desc: "Skin activation and regeneration" },
      ],
    },
    welcomePopup: {
      title: "STAR Dermatology Event",
      subtitle: "Check it out now",
      cta_kakao: "KakaoTalk Consultation",
      cta_reserve: "Online Booking",
      cta_call: "Phone Booking",
      dismiss: "Close",
      dismissToday: "Don't show today",
    },
    eventDetail: {
      loading: "Loading...",
      notFound: "Event not found.",
      backToList: "Back to Events",
      views: "Views",
      intro: "Event Details",
      cta_kakao: "KakaoTalk Consultation",
      cta_call: "Phone Booking",
      directions: "Directions",
      address: "ION City Building 2F & 4F, Seomyeon, Busan",
      tel: "+82-51-818-2300",
      viewMap: "View Map",
    },
    treatmentDetail: {
      backToHome: "Home",
      duration: "Treatment Time",
      recovery: "Recovery Period",
      price: "Price",
      effect: "Expected Results",
      popular: "Popular",
      faqTitle: "Frequently Asked Questions",
      notFound: "Treatment information not found.",
      backBtn: "Back",
      ctaConsult: "KakaoTalk Consultation",
      ctaReserve: "Naver Booking",
    },
    faq: {
      sectionTitle: "Frequently Asked Questions",
      sectionSubtitle: "Find answers to your questions about our treatments",
      items: [
        {
          equipment: "Ultherapy",
          questions: [
            { q: "What is Ultherapy?", a: "Ultherapy uses focused ultrasound (HIFU) energy to lift and tighten skin without surgery. It delivers heat deep into the skin to stimulate collagen production." },
            { q: "What is the recovery time?", a: "There is no downtime. You may experience slight redness or swelling that subsides within 1-2 days." },
            { q: "When will I see results?", a: "You may notice immediate improvements, with optimal results appearing around 3 months as collagen regenerates." },
            { q: "How often should I get treated?", a: "We recommend treatments every 6 months to 1 year." },
          ]
        },
        {
          equipment: "Thermage",
          questions: [
            { q: "What is the difference between Thermage and Ultherapy?", a: "Thermage uses RF (radiofrequency) energy while Ultherapy uses ultrasound. Thermage delivers uniform heat from the surface to deeper layers. Combining both treatments can provide even better results." },
            { q: "How long does the procedure take?", a: "Depending on the treatment area, the procedure takes 30 minutes to 1.5 hours." },
            { q: "Is it painful?", a: "There is a slight warming sensation but minimal pain. A numbing cream is applied before the procedure for comfort." },
            { q: "How long do results last?", a: "Results typically last 1-2 years, though this varies by individual." },
          ]
        },
        {
          equipment: "XERF (Serf)",
          questions: [
            { q: "What is XERF?", a: "XERF is a cutting-edge RF lifting technology featuring fast treatment time and excellent results. It simultaneously improves skin elasticity and provides a lifting effect." },
            { q: "Can I see results after one treatment?", a: "Yes, you can see immediate results after one treatment. Regular treatments help maintain and improve results over time." },
            { q: "What are the post-treatment precautions?", a: "Avoid strong sun exposure for 2-3 days after treatment and maintain proper moisturizing care." },
          ]
        },
        {
          equipment: "Lower Eyelid Fat Repositioning",
          questions: [
            { q: "What is lower eyelid fat repositioning?", a: "This procedure repositions the protruding fat under the eyes to improve hollowness. Natural-looking results can be achieved without incisions." },
            { q: "What is the recovery time?", a: "Swelling and bruising may occur for 1-2 weeks, with full recovery to a natural appearance in 2-4 weeks." },
            { q: "Is recurrence possible?", a: "Since the fat is repositioned rather than removed, the recurrence rate is very low." },
          ]
        },
        {
          equipment: "Enlighten",
          questions: [
            { q: "What is Enlighten laser?", a: "Enlighten is a picosecond laser that delivers energy 1,000 times faster than conventional nanosecond lasers. It excels at breaking down pigment with superior efficiency, making it highly effective for melasma, age spots, and tattoo removal." },
            { q: "How many sessions are needed?", a: "It depends on the depth and concentration of pigment. Generally, 3–5 sessions are recommended for melasma and age spots, while tattoo removal typically requires 5–10 sessions. A personalized plan is created after consultation." },
            { q: "What is the recovery time?", a: "Slight redness and warmth may occur immediately after treatment, but most patients can resume daily activities the same day. Any scabbing will naturally fall off within 1–2 weeks." },
            { q: "How is Enlighten different from traditional laser toning?", a: "Traditional laser toning uses nanosecond energy, while Enlighten delivers energy in picoseconds, fragmenting pigment into much finer particles. This results in less surrounding tissue damage and superior effectiveness." },
            { q: "What are the post-treatment precautions?", a: "Apply sunscreen diligently for 2 weeks after treatment and avoid direct sunlight. Refrain from saunas, hot baths, and vigorous exercise for about 1 week, and use the prescribed regenerating cream consistently." },
          ]
        },
        {
          equipment: "Excel V+",
          questions: [
            { q: "What is Excel V+?", a: "Excel V+ is a vascular and pigment laser that uses two wavelengths (532nm and 1064nm) to effectively treat redness, spider veins, hemangiomas, red scars, and pigmented lesions." },
            { q: "What skin concerns does it treat?", a: "It is effective for facial redness, telangiectasia, rosacea, hemangiomas, cherry angiomas, melasma, age spots, red scars, and post-acne erythema." },
            { q: "Is the treatment painful?", a: "There may be a mild snapping sensation depending on the treatment area. A numbing cream can be applied beforehand to minimize discomfort." },
            { q: "Will I have bruising or scabbing afterward?", a: "Temporary bruising may occur after vascular treatment and typically fades within 1–2 weeks. Minor scabbing may form after pigment treatment but will naturally fall off." },
            { q: "How many sessions are recommended?", a: "This varies by condition. Facial redness and vascular issues typically require 3–5 sessions, while pigmented lesions require 2–4 sessions. Your doctor will create a customized plan." },
          ]
        },
        {
          equipment: "Rejuran",
          questions: [
            { q: "What is Rejuran?", a: "Rejuran is a skin regeneration treatment that injects polynucleotides (PN) extracted from salmon DNA into the skin. It repairs damaged cells and stimulates collagen production to improve skin elasticity and radiance." },
            { q: "What is the difference between Rejuran Healer and Rejuran Eye?", a: "Rejuran Healer is used for full-face skin regeneration, while Rejuran Eye is formulated at a lower concentration specifically for the delicate skin around the eyes. Both are PN-based." },
            { q: "When will I see results?", a: "Improvements in skin texture can be felt within 1–2 weeks after treatment. After 3–4 sessions, collagen regeneration becomes more active, and elasticity and radiance improve noticeably." },
            { q: "Will there be swelling or bruising?", a: "As an injection treatment, minor swelling at injection sites may occur and typically subsides within 1–3 days. Bruising is possible but usually resolves within 1 week." },
            { q: "What is the recommended treatment schedule?", a: "An intensive course of 4 sessions every 2–4 weeks is recommended initially. Maintenance sessions every 3–6 months thereafter will help sustain the results long-term." },
          ]
        },
      ]
    },
    contact: {
      phone: "+82-51-818-2300",
      sms: "010-5855-3201",
      kakao: "@starpibu",
      businessInfo: "Business Reg. No.: 605-24-84306 | Email: starpibu@naver.com",
    },
    youtube: {
      sectionTitle: "Skin Stories from Our Dermatologists",
      sectionSubtitle: "Visit our YouTube channel for more information",
      latestVideos: "Latest Videos",
      shorts: "Shorts",
      visitChannel: "Visit YouTube Channel",
      close: "Close",
    },
    reservation: {
      sectionTitle: "Online Reservation",
      sectionSubtitle: "Book easily and visit without waiting",
      loginCta: "Log in & Book",
      guestCta: "Book as Guest",
    },
    treatmentPage: {
      backHome: "Back to Home",
      recovery: "Recovery",
      intro: "About This Treatment",
      effects: "Expected Effects",
      video: "Treatment Video",
      caution: "Precautions",
      ctaKakao: "KakaoTalk Consultation",
      ctaCall: "Call Us",
      ctaBook: "Book Now",
      otherTreatments: "Other Treatments",
      notFound: "Treatment information not found.",
      notFoundBack: "Back to Home",
    },
  },

  ja: {
    nav: {
      home: "ホーム",
      about: "クリニック紹介",
      treatments: "施術案内·設備紹介",
      equipment: "設備紹介",
      doctors: "医師紹介",
      facility: "施設案内",
      contact: "アクセス",
      foreignGuide: "外国語案内",
    },
    hero: {
      title: "スター皮膚科",
      subtitle: "自然な変化を生み出すクリニック",
      badge: "Since 2006",
      floor: "釜山西面 アイオンシティビル 4F 受付・診療 | 2F 幹細胞研究センター",
      cta_call: "+82-51-818-2300",
      cta_kakao: "カカオ相談",
      cta_reserve: "LINE予約",
    },
    about: {
      label: "クリニック紹介",
      title: "スター皮膚科について",
      desc: "釜山・西面交差点の前に位置するスター皮膚科は、2006年に開設して以来、患者様のご期待に応え、皆様に美しさと最高の診療結果をお届けするため、日々努力を重ねております。皮膚科専門医としての使命を持って、継続的に最新のレーザー機器を導入し、患者一人一人の肌タイプに最適化された診療システムを構築しています。",
      stats: [
        { num: "4,000+", label: "クマ取り施術数" },
        { num: "20年+", label: "教授出身専門医" },
        { num: "50+", label: "オリジナルレーザー機器" },
      ],
      values: [
        { letter: "S", title: "Special Guest", desc: "すべての患者様は私たちにとって最も大切な方です。お一人お一人のお悩みに耳を傍ける1対1のオーダーメイド診療を実践しています。" },
        { letter: "T", title: "Top Quality", desc: "多様なプレミアムレーザーと先進医療技術により、常に高水準の治療結果を提供します。" },
        { letter: "A", title: "Attractive Atmosphere", desc: "予約制により待ち時間を短縮し、治療のみに集中できる心地よい環境を提供します。" },
        { letter: "R", title: "Responsibility", desc: "治療の説明と経過観察に責任感を持ち、結果にご満足いただけるまでともに歩みます。" },
      ],
    },
    hours: {
      label: "診療時間",
      title: "診療案内",
      rows: [
        { day: "平日（月〜金）", time: "10:00 – 19:00" },
        { day: "土曜日", time: "09:30 – 15:00" },
        { day: "日・祝日", time: "休診" },
      ],
      note: "平日昼休み 13:00 – 14:00 · 土曜日は昼休みなし",
    },
    access: {
      label: "アクセス",
      title: "アクセス",
      address: "釜山広域市釜山鎮区西面路74 アイオンシティビル 2・4階",
      subway: "地下鉄1・2号線 西面駅 5番・7番出口から徒歩3分",
      bus: "西面交差点バス停下車",
      parking: "アイオンシティビル内駐車場利用可",
    },
    doctors: {
      label: "医師紹介",
      title: "皮膚科専門医のご紹介",
      list: [
        {
          name: "チョ・シヒョン",
          title: "院長",
          specialty: "皮膚科専門医 · 医学博士",
          intro: [
            "2006年に釜山西面で初めて診察を開始して以来、いつのまにか20年以上の歳月が流れ、数多くの患者様の皮膚のお悩みと向き合ってきました。",
            "皮膚治療は単に機器を使う技術ではなく、患者の皮膚状態を正確に読み取る「洞察力」から始まります。無理な施術よりも、最も安全で自然な結果を常に目指しています。",
            "これからも変わらず、正直で熱練された診察で皆様の皮膚健康を守り続けます。"
          ],
          careers: [
            "皮膚科専門医",
            "釜山大学病院 皮膚科 研修",
            "仁済大学 皮膚科 教授歴任",
            "仁済大学・釜山大学 外来教授歴任",
            "釜山・慶南・蔽山皮膚科医師会 会長歴任",
            "サーマジFLX アドバイザリー医",
            "米国皮膚科学会（AAD）正会員",
            "現) スタ皮膚科 院長",
          ],
        },
        {
          name: "ウ・ヘジン",
          title: "院長",
          specialty: "皮膚科専門医",
          intro: [
            "皮膚科専門医として、患者様の皮膚健康を最優先に考えています。",
            "正確な診断とオーダーメイドの治療で最高の結果を提供できるよう努めます。"
          ],
          careers: [
            "皮膚科専門医",
            "カトリック医科大学 皮膚科 研修",
            "カトリック医科大学 皮膚科 外来教授歴任",
            "大韓皮膚科学会 正会員",
            "米国皮膚科学会（AAD）正会員",
            "前) ゴウンセサン キムヤンジェ皮膚科 院長",
          ],
        },
        {
          name: "イ・ギウク",
          title: "院長",
          specialty: "皮膚科専門医 · 医学博士",
          intro: [
            "医学博士として、最新の皮膚科学の知識を基に最高水準の医療サービスを提供します。",
            "安全で効果的な治療で皮膚健康を守ります。"
          ],
          careers: [
            "皮膚科専門医",
            "医学博士 — 高神大学医科学部",
            "高神大学医科学部 皮膚科 外来教授",
            "大韓皮膚科学会 正会員",
            "大韓皮膚科医師会 正会員",
            "前) アルムダウン皮膚科 院長",
          ],
        },
      ],
    },
    treatments: {
      label: "施術案内",
      title: "主要施術·設備",
      categories: [
        { name: "リフティング·弾力", items: ["ウルセラピープライム", "サーマジFLX", "XERF", "シルエットリフト"] },
        { name: "ボリューム·注射", items: ["スカルプトラ", "ヒアルロン酸フィラー", "ボトックス"] },
        { name: "目の下·輪郭", items: ["目の下脂肪再配置", "ランチタイム目の下レーザー", "汗管腫除去"] },
        { name: "色素·タトゥー除去", items: ["ピコレーザー", "ルビーピコレーザー", "タトゥー除去", "肝斑トーニング"] },
        { name: "赤み·血管拡張", items: ["エクセルV+", "シナジー"] },
        { name: "ニキビ", items: ["アビクレア", "プラデュオ"] },
        { name: "傷跡·毛穴", items: ["アンコールレーザー", "DRT", "火傷·ニキビ傷跡除去"] },
        { name: "皮膚疾患", items: ["白斑エキシマレーザー", "乾癬·アトピー", "爪水虫レーザー", "多汗症ボトックス"] },
      ],
    },
    foreignGuide: {
      title: "外国人患者様へ",
      subtitle: "スター皮膚科は外国人患者様を歓迎いたします",
      steps: [
        { step: "01", title: "ご予約", desc: "LINEまたはお電話でご予約ください。日本語でのお問い合わせはLINE（@star2006derm）をご利用ください。" },
        { step: "02", title: "ご来院", desc: "西面駅5・7番出口から徒歩3分。アイオンシティビル4階です。" },
        { step: "03", title: "カウンセリング・施術", desc: "専門医が直接お肌の状態を診断し、最適な施術をご提案いたします。" },
        { step: "04", title: "アフターケア", desc: "施術後のケア方法をご案内いたします。帰国後もオンライン相談が可能です。" },
      ],
      tips: [
        "ご予約の際はパスポート情報が必要です",
        "クレジットカード（Visa/Mastercard）でのお支払いが可能です",
        "領収書の発行が可能です",
        "アイオンシティビル内に駐車場がございます",
      ],
      cta: "今すぐ予約する",
      transportation: {
        title: "交通案内",
        methods: [
          { name: "地下鉄", desc: "西面駅1·2号線 5番·7番出口から徒歩3分" },
          { name: "バス", desc: "西面交差点バス停下車後 徒歩2分" },
          { name: "タクシー", desc: "釜山鎮区西面路74 アイオンシティビル4階" },
          { name: "自動車", desc: "アイオンシティビル内駐車場利用可（1時間無料）" },
        ],
      },
      currency: {
        title: "決済·両替",
        info: "クレジットカード決済時は自動的に現在のレートで両替されます。韓国ウォン現金での決済も可能です。",
        methods: [
          { name: "クレジットカード", desc: "Visa、Mastercard、American Express すべて対応" },
          { name: "現金", desc: "韓国ウォン（KRW）現金決済可能" },
          { name: "両替", desc: "西面駅周辺の銀行·両替所で両替可能" },
          { name: "国際送金", desc: "事前相談で銀行送金対応可能" },
        ],
      },
      interpretation: {
        title: "通訳サービス",
        desc: "外国人患者様向けに多言語相談·通訳サービスを提供いたします",
        services: [
          { name: "日本語対応", desc: "OTOMO釜山（otomo-busan.com）を通じた専門通訳サービス" },
          { name: "英語相談", desc: "英語対応医師による直接相談（予約時にご要望ください）" },
          { name: "中国語相談", desc: "中国語対応医師または専門通訳者配置" },
          { name: "その他の言語", desc: "予約時にご要望いただければ通訳者の配置が可能です" },
        ],
      },
    },
    footer: {
      address: "釜山広域市釜山鎮区西面路74 アイオンシティビル 2・4階",
      tel: "+82-51-818-2300",
      fax: "051-818-2310",
      email: "starpibu@naver.com",
      copyright: "© スター皮膚科. All rights reserved.",
    },
    results: {
      sectionTitle: "スター皮膚科を選ぶ理由",
      sectionSubtitle: "20年以上の経験を持つ皮膚科専門医が直接担当する安全で自然な結果",
      stats: [
        { label: "専門医の経験", desc: "2006年開院以来" },
        { label: "患者満足度", desc: "Naverレビュー基準" },
        { label: "累積施術件数", desc: "安全で実績のある施術" },
        { label: "院長直接施術", desc: "全ての施術を院長が直接担当" },
      ],
      whyTitle: "スター皮膚科の差別化",
      whyItems: [
        { title: "実績ある経験", desc: "20年以上の皮膚科臨床経験による安全で信頼できる施術の提供" },
        { title: "患者中心の診療", desc: "1対1のカスタムカウンセリングで個人の肌状態に最適化された施術プランを策定" },
        { title: "最新設備", desc: "国内最高水準のレーザーおよび施術機器で最高の結果を保証" },
      ],
      treatmentResultsTitle: "主要施術別の期待効果",
      treatmentResults: [
        { treatment: "目の下脂肪再配置", period: "施術後4週", improvements: ["クマ改善", "目の下の膜らみ解消", "自然な目の下ライン"] },
        { treatment: "サーマジFLX", period: "施術後3ヶ月", improvements: ["肌の弾力強化", "コラーゲン再生", "全体的な肌改善"] },
        { treatment: "ウルセラピープライム", period: "施術後6週", improvements: ["SMAS層リフティング", "肌の弾力改善", "シワ改善"] },
        { treatment: "ルビーピコレーザー", period: "3～5回施術後", improvements: ["シミ·くすみ改善", "肌トーン改善", "色素沈着予防"] },
        { treatment: "色素治療", period: "4～6回施術後", improvements: ["シミ·老人斑改善", "肌トーン均一化", "シミ除去"] },
        { treatment: "顔の赤み治療", period: "3回治療後", improvements: ["赤み軽減", "毛細血管縮小", "均一な肌トーン"] },
      ],
      notices: [
        "全ての施術結果は個人差がございます",
        "施術前に必ず専門医による1対1のカウンセリングをお受けください",
      ],
      disclaimer: "本情報は教育目的で提供されており、医学的診断·治療に代わるものではありません。正確なご相談は専門医に直接お問い合わせください。",
    },
    reviews: {
      eyebrow: "患者様の声",
      sectionTitle: "患者様の声",
      sectionSubtitle: "スター皮膚科をご利用いただいた患者様からの生のご意見です",
      ratingSource: "Naverレビュー基準",
      moreReviews: "もっと見る",
      swipeHint: "← スワイプ →",
      prevLabel: "前へ",
      nextLabel: "次へ",
      items: [
        { name: "金**", age: "", treatment: "目の下脂肪再配置", text: "クマがとても酷かったのですが、施術後1ヶ月で目がぱっと明るくなりました。自然で満足です！", platform: "Naver", rating: 5, date: "" },
        { name: "李**", age: "", treatment: "ピコレーザー", text: "シミが多かったのですが、3回の施術で大幅に改善されました。膚トーンも明るくなり満足です。", platform: "Naver", rating: 5, date: "" },
        { name: "朴**", age: "", treatment: "ウルセラピープライム", text: "リフティング効果が本当に良いです。自然で回復期間も短いので良かったです。", platform: "Naver", rating: 5, date: "" },
        { name: "崔**", age: "", treatment: "サーマジーFLX", text: "サーマジー後、膚の弾力が確実に改善しました。先生が丁寧に説明してくださったので安心できました。強くお勧めします！", platform: "Naver", rating: 5, date: "" },
        { name: "鄭**", age: "", treatment: "ウルセラピープライム", text: "西面でウルセラのカウンセリングを何度も受けましたが、スター皮膚科が最も専門的でした。先生が直接施術してくださり、効果も確かです。", platform: "Naver", rating: 5, date: "" },
        { name: "韓**", age: "", treatment: "レーザートーニング", text: "シミやシミで悩んでいましたが、数回の施術で膚が明るくなりました。スタッフもとても親切で、施術室も清潔です。", platform: "Naver", rating: 5, date: "" },
        { name: "尹**", age: "", treatment: "目の下脂肪再配置", text: "目の下の手術を長年考えていましたが、先生の丁寧な説明で安心して決めました。回復も早く、結果も自然で大満足です。", platform: "Naver", rating: 5, date: "" },
        { name: "姜**", age: "", treatment: "ピコレーザー", text: "長年悩んでいたシミが3回の施術で大幅淡くなりました。皮膚科専門医の先生が直接施術してくださるので安心です。期待以上の効果でした！", platform: "Naver", rating: 5, date: "" },
        { name: "趙**", age: "", treatment: "サーマジーFLX", text: "40代でサーマジーを受けた後、周りから顔がどうなったのかと聴かれるほど変わりました。痛みも少なく、回復も早かったです。大満足です！", platform: "Naver", rating: 5, date: "" },
      ],
    },
    facility: {
      sectionTitle: "施設案内",
      sectionSubtitle: "最新医療機器と快適な環境",
      highlights: [
        { label: "最新レーザー機器" },
        { label: "経験豊富な医療スタッフ" },
        { label: "清潔な施術室" },
        { label: "快適な待合室" },
      ],
      images: [
        { label: "外観", desc: "釜山西面 アイオンシティビル" },
        { label: "待合室", desc: "ホテル式インテリアの快適な待合室" },
        { label: "相談室", desc: "プライベートな相談空間" },
        { label: "施術室", desc: "最新医療機器が備わった施術室" },
        { label: "施術室詳細", desc: "高度な医療機器構成" },
        { label: "待合室詳細", desc: "快適な休息スペース" },
      ],
      zoomHint: "画像をクリックして拡大表示",
    },
    events: {
      eyebrow: "イベント",
      sectionTitle: "イベント·お知らせ",
      sectionSubtitle: "スター皮膚科の最新情報をご確認ください",
      filterAll: "全て",
      filterNew: "新施術",
      filterEvent: "イベント",
      filterNotice: "お知らせ",
      filterEtc: "その他",
      loading: "読み込み中...",
      viewDetail: "詳細を見る",
      views: "閲覧",
      empty: "現在利用可能なイベントはありません",
      categories: ["全て", "新施術", "イベント", "お知らせ", "その他"],
      noEvents: "現在利用可能なイベントはありません",
      readMore: "詳細を見る",
      featured: "主推イベント",
    },
    managementDevices: {
      sectionTitle: "ケア機器",
      sectionSubtitle: "スター皮膚科 ケア機器",
      items: [
        { name: "ウォーターピーリング", desc: "肌クレンジングと保湿" },
        { name: "イオン導入", desc: "有効成分浸透強化" },
        { name: "超音波ケア", desc: "肌鎮静と吸収促進" },
        { name: "LED光線治療", desc: "肌再生と鎮静" },
        { name: "高周波ケア", desc: "肌弾力とリフティング" },
        { name: "微弱電流", desc: "肌弾力改善" },
        { name: "冷却ケア", desc: "施術後の鎮静とクーリング" },
        { name: "酸素ケア", desc: "肌の活性化と再生" },
      ],
    },
    welcomePopup: {
      title: "スター皮膚科イベント",
      subtitle: "今すぐ確認する",
      cta_kakao: "KakaoTalk相談",
      cta_reserve: "オンライン予約",
      cta_call: "電話予約",
      dismiss: "閉じる",
      dismissToday: "本日は表示しない",
    },
    eventDetail: {
      loading: "読み込み中...",
      notFound: "イベントが見つかりません。",
      backToList: "イベント一覧へ",
      views: "閲覧",
      intro: "イベント詳細",
      cta_kakao: "KakaoTalk相談",
      cta_call: "電話予約",
      directions: "アクセス",
      address: "釜山西面 アイオンシティビル 2F・4F",
      tel: "+82-51-818-2300",
      viewMap: "地図を見る",
    },
    treatmentDetail: {
      backToHome: "ホームへ",
      duration: "施術時間",
      recovery: "回復期間",
      price: "料金",
      effect: "期待できる効果",
      popular: "人気",
      faqTitle: "よくある質問",
      notFound: "施術情報が見つかりません。",
      backBtn: "戻る",
      ctaConsult: "KakaoTalk相談",
      ctaReserve: "Naver予約",
    },
    faq: {
      sectionTitle: "よくある質問",
      sectionSubtitle: "施術に関するご質問にお答えします",
      items: [
        {
          equipment: "ウルセラ",
          questions: [
            { q: "ウルセラとはどんな施術ですか？", a: "ウルセラは超音波（HIFU）エネルギーを使ったリフティング施術で、皮膚の深部に熱を届けてコラーゲンを再生させます。手術なしで肌を引き上げる効果があります。" },
            { q: "施術後の回復期間は？", a: "すぐに日常生活が可能です。軽い赤みや腫れが出ることがありますが、1〜2日で治まります。" },
            { q: "効果はいつから現れますか？", a: "施術直後から効果を感じることができ、コラーゲン再生が完了する3ヶ月後に最高の効果を実感できます。" },
            { q: "施術の間隔はどのくらいですか？", a: "通常6ヶ月〜1年の間隔での施術をお勧めします。" },
          ]
        },
        {
          equipment: "サーマジ",
          questions: [
            { q: "サーマジとウルセラの違いは？", a: "サーマジはRF（高周波）エネルギーを使用し、ウルセラは超音波を使用します。サーマジは皮膚表面から深層まで均一に熱を届けます。両施術を組み合わせるとより良い効果が得られます。" },
            { q: "施術時間はどのくらいかかりますか？", a: "部位によって30分〜1時間30分程度かかります。" },
            { q: "痛みはありますか？", a: "軽い熱感はありますが、ほとんど痛みはありません。施術前に麻酔クリームを塗布して快適に施術を受けられます。" },
            { q: "効果の持続期間は？", a: "個人差はありますが、通常1〜2年程度効果が持続します。" },
          ]
        },
        {
          equipment: "セルフ（XERF）",
          questions: [
            { q: "XERFとはどんな施術ですか？", a: "XERFは高周波を使った最新リフティング技術で、短い施術時間と優れた効果が特徴です。肌の弾力改善とリフティング効果が同時に現れます。" },
            { q: "1回の施術で効果がありますか？", a: "はい、1回の施術でも即効性のある効果を感じることができます。定期的な施術でより良い結果を維持できます。" },
            { q: "施術後の注意事項は？", a: "施術後2〜3日間は強い紫外線を避け、しっかりと保湿ケアを行ってください。" },
          ]
        },
        {
          equipment: "目の下の脂肪再配置",
          questions: [
            { q: "目の下の脂肪再配置とは何ですか？", a: "目の下に膨らんだ脂肪を再配置して、目の下のくぼみを改善する施術です。切開なしで自然な結果を得ることができます。" },
            { q: "施術後の回復期間は？", a: "1〜2週間程度腫れや内出血が出ることがありますが、2〜4週間後に自然な状態に回復します。" },
            { q: "再発の可能性はありますか？", a: "脂肪を除去するのではなく再配置する施術なので、再発の可能性は低いです。" },
          ]
        },
        {
          equipment: "エンライトン",
          questions: [
            { q: "エンライトンとはどんなレーザーですか？", a: "エンライトンはピコ秒（Picosecond）レーザーで、従来のナノ秒レーザーより1,000倍速くエネルギーを照射します。色素分解効率が非常に高く、シミ、そばかす、タトゥー除去に優れた効果を発揮します。" },
            { q: "何回の施術が必要ですか？", a: "色素の深さと濃度によりますが、シミ・そばかすは3〜5回、タトゥー除去は5〜10回程度が目安です。専門医との相談後、個人に合わせたプランを作成します。" },
            { q: "施術後の回復期間はどのくらいですか？", a: "施術直後に軽い赤みや熱感が出ることがありますが、ほとんどの方は当日から日常生活が可能です。かさぶたができた場合は1〜2週間で自然に取れます。" },
            { q: "従来のレーザートーニングとの違いは？", a: "従来のレーザートーニングはナノ秒単位のエネルギーを使用しますが、エンライトンはピコ秒単位で色素をより細かく砕きます。周囲組織へのダメージが少なく、効果はより優れています。" },
            { q: "施術後の注意事項は何ですか？", a: "施術後2週間は日焼け止めをしっかり塗り、直射日光を避けてください。サウナ・岩盤浴・激しい運動は1週間程度控え、処方された再生クリームを継続的に使用してください。" },
          ]
        },
        {
          equipment: "エクセルV+",
          questions: [
            { q: "エクセルV+とはどんな施術ですか？", a: "エクセルV+は血管・色素レーザーで、532nmと1064nmの2つの波長を使用して、赤ら顔、毛細血管拡張、血管腫、赤いニキビ跡、色素性病変などを効果的に治療します。" },
            { q: "どんな肌の悩みに効果的ですか？", a: "顔の赤み、毛細血管拡張症、酒さ（ロザセア）、血管腫、チェリー血管腫、シミ・そばかす、赤いニキビ跡、ニキビ後の紅斑など、様々な血管・色素の問題に効果的です。" },
            { q: "施術時に痛みはありますか？", a: "部位によって輪ゴムで弾かれるような軽い痛みを感じることがあります。必要に応じて麻酔クリームを塗布し、不快感を最小限に抑えます。" },
            { q: "施術後に内出血やかさぶたができますか？", a: "血管治療後に一時的な内出血が生じることがあり、通常1〜2週間で消えます。色素治療後は微細なかさぶたができることがありますが、自然に取れます。" },
            { q: "何回の施術が必要ですか？", a: "症状の種類と程度によりますが、顔の赤み・血管拡張は平均3〜5回、色素性病変は2〜4回程度が目安です。個人の状態に応じて専門医が計画を立てます。" },
          ]
        },
        {
          equipment: "リジュラン",
          questions: [
            { q: "リジュランとはどんな施術ですか？", a: "リジュランはサーモンDNA（PDRN）から抽出したポリヌクレオチド（PN）成分を皮膚に注入する肌再生施術です。損傷した細胞を修復しコラーゲン生成を促進することで、肌の弾力とツヤを改善します。" },
            { q: "リジュランヒーラーとリジュランアイの違いは？", a: "リジュランヒーラーは顔全体の肌再生に使用され、リジュランアイは目元専用でより薄い濃度に製造されており、薄い目元の皮膚に適しています。どちらもPN成分が基本です。" },
            { q: "効果はいつから現れますか？", a: "施術後1〜2週間から肌のキメが改善されるのを感じることができ、3〜4回の施術後にコラーゲン再生が活発になり、弾力とツヤが目に見えて向上します。" },
            { q: "施術後に腫れや内出血はありますか？", a: "注射施術のため、注射跡と共に軽い腫れが生じることがあります。ほとんどは1〜3日で治まり、内出血が出ることもありますが1週間以内に消えます。" },
            { q: "施術の間隔と回数はどのくらいですか？", a: "最初は2〜4週間隔で4回程度の集中施術をお勧めし、その後は3〜6ヶ月ごとのメンテナンス施術で効果を長く維持することができます。" },
          ]
        },
      ]
    },
    contact: {
      phone: "+82-51-818-2300",
      sms: "010-5855-3201",
      kakao: "@starpibu",
      businessInfo: "事業者登録番号: 605-24-84306 | Email: starpibu@naver.com",
    },
    youtube: {
      sectionTitle: "皮膚科専門医が教える肆の話",
      sectionSubtitle: "スター皮膚科のYouTubeチャンネルでもっと多くの情報をご確認ください",
      latestVideos: "最新動画",
      shorts: "ショート",
      visitChannel: "YouTubeチャンネルを訪問する",
      close: "閉じる",
    },
    reservation: {
      sectionTitle: "オンライン予約",
      sectionSubtitle: "簡単に予約して待ちなしでご来院ください",
      loginCta: "ログインして予約",
      guestCta: "会員登録なしで予約",
    },
    treatmentPage: {
      backHome: "ホームに戻る",
      recovery: "回復期間",
      intro: "施術の紹介",
      effects: "期待できる効果",
      video: "施術動画",
      caution: "注意事項",
      ctaKakao: "KakaoTalk相談",
      ctaCall: "電話相談",
      ctaBook: "予約申請",
      otherTreatments: "他の施術を見る",
      notFound: "施術情報が見つかりません。",
      notFoundBack: "ホームに戻る",
    },
  },

  zh: {
    nav: {
      home: "首页",
      about: "医院介绍",
      treatments: "诊疗项目·设备介绍",
      equipment: "设备介绍",
      doctors: "医生介绍",
      facility: "设施介绍",
      contact: "交通指南",
      foreignGuide: "外语服务",
    },
    hero: {
      title: "STAR皮肤科",
      subtitle: "打造自然美丽的专业皮肤科",
      badge: "Since 2006",
      floor: "釜山西面 爱恩城大厦 4楼 接待·诊疗 | 2楼 干细胞研究中心",
      cta_call: "+82-51-818-2300",
      cta_kakao: "WeChat咨询",
      cta_reserve: "LINE咨询",
    },
    about: {
      label: "医院介绍",
      title: "关于STAR皮肤科",
      desc: "STAR皮肤科位于釜山西面十字路口前，自2006年开业以来，始终以患者为中心，致力于提供最优质的医疗服务。作为皮肤科专科医生，我们持续研究各类皮肤疾病，不断引进最新激光设备，为每位患者构建个性化的诊疗方案。",
      stats: [
        { num: "4,000+", label: "眼袋脂肪重置" },
        { num: "20年+", label: "教授出身专科医" },
        { num: "50+", label: "原装激光设备" },
      ],
      values: [
        { letter: "S", title: "Special Guest", desc: "每位患者对我们来说都是最特别的人。我们实行认真倾听每个人烦恼的1对1个性化诊疗。" },
        { letter: "T", title: "Top Quality", desc: "凭借多样的高级激光设备和先进医疗技术，始终提供高水平的治疗效果。" },
        { letter: "A", title: "Attractive Atmosphere", desc: "通过预约制减少等候时间，提供只需专注于治疗的舒适环境。" },
        { letter: "R", title: "Responsibility", desc: "认真进行治疗说明和预后观察，直到您对结果满意为止。" },
      ],
    },
    hours: {
      label: "诊疗时间",
      title: "诊疗安内",
      rows: [
        { day: "周一至周五", time: "10:00 – 19:00" },
        { day: "周六", time: "09:30 – 15:00" },
        { day: "周日·法定节假日", time: "休诊" },
      ],
      note: "平日午休 13:00 – 14:00 · 周六不设午休",
    },
    access: {
      label: "交通指南",
      title: "交通指南",
      address: "釜山广域市釜山镇区西面路74 爱恩城大厦 2·4楼",
      subway: "地铁1·2号线 西面站 5号·7号出口步行3分钟",
      bus: "西面交叉路口公交站下车",
      parking: "爱恩城大厦内停车场可用",
    },
    doctors: {
      label: "医生介绍",
      title: "皮肤科专科医生介绍",
      list: [
        {
          name: "赵时享",
          title: "院长",
          specialty: "皮肤科专科医生 · 医学博士",
          intro: [
            "自2006年在釜山西面开诊以来，不知不觉已经走过20年之久，在此期间面对了无数患者的皮肤烦恼。",
            "皮肤治疗不仅仅是使用设备的技术，更要从准确判读患者皮肤状态的「眼力」开始。我始终追求最安全、最自然的效果，而非过度治疗。",
            "未来我将一如既往，以诚实和精湛的诊疗为您的皮肤健康护航。"
          ],
          careers: [
            "皮肤科专科医生",
            "釜山大学医院 皮肤科 住院医师",
            "仁济大学 皮肤科 教授（前）",
            "仁济大学·釜山大学 外聘教授（前）",
            "釜山·庆南·蔽山皮肤科医师会 会长（前）",
            "热玛吉FLX 顾问医生",
            "美国皮肤科学会（AAD）正会员",
            "现) 星皮肤科 院长",
          ],
        },
        {
          name: "吴惠进",
          title: "院长",
          specialty: "皮肤科专科医生",
          intro: [
            "作为皮肤科专科医生，我将患者的皮肤健康放在首位。",
            "通过准确诊断和个性化治疗，努力为您提供最佳效果。"
          ],
          careers: [
            "皮肤科专科医生",
            "天主教医科大学 皮肤科 住院医师",
            "天主教医科大学 皮肤科 外聘教授（前）",
            "韩国皮肤科学会 正会员",
            "美国皮肤科学会（AAD）正会员",
            "前) 高恩世界 金杨济皮肤科 院长",
          ],
        },
        {
          name: "李基沃",
          title: "院长",
          specialty: "皮肤科专科医生 · 医学博士",
          intro: [
            "作为医学博士，基于最新皮肤科学知识为患者提供最高水平的医疗服务。",
            "通过安全有效的治疗保护您的皮肤健康。"
          ],
          careers: [
            "皮肤科专科医生",
            "医学博士 — 高神大学医科学部",
            "高神大学医科学部 皮肤科 外聘教授",
            "韩国皮肤科学会 正会员",
            "韩国皮肤科医师会 正会员",
            "前) 美丽皮肤科 院长",
          ],
        },
      ],
    },
    treatments: {
      label: "诊疗项目",
      title: "主要诊疗项目·设备",
      categories: [
        { name: "提升·紧致", items: ["欧活素提升疗法", "热磁治疗FLX", "XERF", "线雕提升"] },
        { name: "丰盈·注射", items: ["舒颜萃", "玻尿酸填充", "肉毒素"] },
        { name: "眼袋·轮廓", items: ["眼袋脂肪重置", "午间眼袋激光", "汗管瘤去除"] },
        { name: "色素·纹身去除", items: ["皮科激光", "红宝石皮科激光", "纹身去除", "黄褐斑调色"] },
        { name: "红血丝·血管扩张", items: ["Excel V+", "协同治疗"] },
        { name: "痤疮", items: ["Abiclaire", "Pladuo"] },
        { name: "疤痕·毛孔", items: ["Encore激光", "DRT", "烧伤·痘疤去除"] },
        { name: "皮肤疾病", items: ["白癜风准分子激光", "银屑病·特应性皮炎", "甲癣激光", "多汗症肉毒素"] },
      ],
    },
    foreignGuide: {
      title: "外国患者服务",
      subtitle: "STAR皮肤科欢迎外国患者",
      steps: [
        { step: "01", title: "预约", desc: "请通过WeChat或电话预约。我们提供中文咨询服务。" },
        { step: "02", title: "到院", desc: "地铁西面站5·7号出口步行3分钟。爱恩城大厦4楼。" },
        { step: "03", title: "咨询·治疗", desc: "专科医生将直接诊断您的皮肤状况，为您推荐最适合的治疗方案。" },
        { step: "04", title: "术后护理", desc: "我们将为您提供详细的术后护理指导，回国后也可进行在线咨询。" },
      ],
      tips: [
        "预约时需要护照信息",
        "支持信用卡（Visa/Mastercard）付款",
        "可开具收据",
        "爱恩城大厦内有停车场",
      ],
      cta: "立即预约",
      transportation: {
        title: "交通指南",
        methods: [
          { name: "地铁", desc: "西面站1·2号线 5号·7号出口步行3分钟" },
          { name: "公交", desc: "西面交叉路口公交站下车后步行2分钟" },
          { name: "出租车", desc: "釜山镇区西面路74 爱恩城大厦4楼" },
          { name: "自驾", desc: "爱恩城大厦内停车场可用（首小时免费）" },
        ],
      },
      currency: {
        title: "支付与换汇",
        info: "信用卡支付时按当前汇率自动换汇。也接受韩元现金支付。",
        methods: [
          { name: "信用卡", desc: "接受Visa、Mastercard、American Express" },
          { name: "现金", desc: "接受韩元（KRW）现金支付" },
          { name: "换汇", desc: "西面站周边银行和换汇所可进行换汇" },
          { name: "国际转账", desc: "提前咨询可进行银行转账" },
        ],
      },
      interpretation: {
        title: "翻译服务",
        desc: "为外国患者提供多语言咨询和翻译服务",
        services: [
          { name: "中文咨询", desc: "中文医生或专业翻译可用（预约时请求）" },
          { name: "日语咨询", desc: "通过OTOMO釜山(otomo-busan.com)提供专业翻译服务" },
          { name: "英语咨询", desc: "英语医生或专业翻译可用" },
          { name: "其他语言", desc: "预约时请求可安排翻译人员" },
        ],
      },
    },
    footer: {
      address: "釜山广域市釜山镇区西面路74 爱恩城大厦 2·4楼",
      tel: "+82-51-818-2300",
      fax: "051-818-2310",
      email: "starpibu@naver.com",
      copyright: "© STAR皮肤科. All rights reserved.",
    },
    results: {
      sectionTitle: "选择STAR皮肤科的理由",
      sectionSubtitle: "拥有20年以上经验的皮肤科专科医生亲自操作，提供安全自然的效果",
      stats: [
        { label: "专科医生经验", desc: "2006年开院至今" },
        { label: "患者满意度", desc: "基于Naver评价" },
        { label: "累计手术件数", desc: "安全有效的手术" },
        { label: "院长亲自操作", desc: "所有手术均由院长亲自操作" },
      ],
      whyTitle: "STAR皮肤科的独特之处",
      whyItems: [
        { title: "丰富的临床经验", desc: "20年以上的皮肤科临床经验，提供安全可信赖的治疗" },
        { title: "以患者为中心的诊疗", desc: "1对1的个性化和诊询，制定适合您肌肤状况的最优治疗方案" },
        { title: "最新设备", desc: "国内最高水平的激光和治疗设备，确保最佳效果" },
      ],
      treatmentResultsTitle: "主要手术预期效果",
      treatmentResults: [
        { treatment: "眼袋脂肪重置", period: "术后4周", improvements: ["黑眼圈改善", "眼袋消除", "自然眼下轮廓"] },
        { treatment: "热磁治疗FLX", period: "术后3个月", improvements: ["增强肌肤紧致度", "胶原蛋白再生", "整体肌肤改善"] },
        { treatment: "欧活素提升疗法", period: "术后6周", improvements: ["SMAS层提升", "改善肌肤弹性", "淡化皱纹"] },
        { treatment: "红宝石皮科激光", period: "3-5次术后", improvements: ["色斑改善", "肤色提亮", "防止色素沉着"] },
        { treatment: "色素治疗", period: "4-6次术后", improvements: ["色斑·老年斑改善", "均匀肤色", "珑点去除"] },
        { treatment: "面部红血丝治疗", period: "3次治疗后", improvements: ["改善波山红", "收缩毛细血管", "均匀肤色"] },
      ],
      notices: [
        "所有手术效果因人而异",
        "术前必须接受1对1专科医生咨询",
      ],
      disclaimer: "本信息仅供教育目的，不能替代医学诊断或治疗。请直接咨询我们的专科医生获取准确建议。",
    },
    reviews: {
      eyebrow: "患者评价",
      sectionTitle: "患者评价",
      sectionSubtitle: "来自满意患者的真实评价",
      ratingSource: "基于Naver评价",
      moreReviews: "查看更多评价",
      swipeHint: "← 滑动 →",
      prevLabel: "上一个",
      nextLabel: "下一个",
      items: [
        { name: "金**", age: "", treatment: "眼袋脂肪重置", text: "我的黑眼圈非常严重，术后一个月眼睛就亮了起来。效果自然，非常满意！", platform: "Naver", rating: 5, date: "" },
        { name: "李**", age: "", treatment: "皮科激光", text: "我有很多色斑，3次治疗后改善明显。肤色也变亮了，很满意。", platform: "Naver", rating: 5, date: "" },
        { name: "朴**", age: "", treatment: "欧活素提升疗法", text: "提升效果非常好。效果自然，恢复期也很短，非常满意！", platform: "Naver", rating: 5, date: "" },
        { name: "崔**", age: "", treatment: "热玛吉FLX", text: "热玛吉后皮肤弹力明显改善。医生详细说明，让我很放心。术后护理指导也很贴心。强烈推荐！", platform: "Naver", rating: 5, date: "" },
        { name: "郑**", age: "", treatment: "欧活素提升疗法", text: "在西面和多家诊所和谈过，星山皮肤科最专业。医生亲自操作，效果十分明显。强烈推荐！", platform: "Naver", rating: 5, date: "" },
        { name: "韩**", age: "", treatment: "激光调色", text: "常年烦恼的色斑经过几次治疗后明显淡化。工作人员非常亲切，设施干净整洁。很喜欢这里！", platform: "Naver", rating: 5, date: "" },
        { name: "尹**", age: "", treatment: "眼袋脂肪重置", text: "考虑眼袋手术很久了，医生在和谈中详细说明，让我消除了顾虑。术后恢复快，效果非常自然，很满意。", platform: "Naver", rating: 5, date: "" },
        { name: "姜**", age: "", treatment: "皮科激光", text: "困扰已久的色斑经3次治疗后明显淡化。由皮肤科专科医生亲自操作，十分放心。效果超出预期！", platform: "Naver", rating: 5, date: "" },
        { name: "赵**", age: "", treatment: "热玛吉FLX", text: "40多岁做了热玛吉后，周围的人都问我脸怎么了，变化如此明显。疼痛感比想象中少，恢复也很快。非常满意！", platform: "Naver", rating: 5, date: "" },
      ],
    },
    facility: {
      sectionTitle: "设施介绍",
      sectionSubtitle: "先进医疗设备和舒适环境",
      highlights: [
        { label: "最新激光设备" },
        { label: "经验丰富的医疗团队" },
        { label: "洁净的手术室" },
        { label: "舒适的等候区" },
      ],
      images: [
        { label: "外观", desc: "釜山西面爱恩城大厦" },
        { label: "等候区", desc: "酒店式内装的舒适等候区" },
        { label: "咨询室", desc: "私密的咨询空间" },
        { label: "手术室", desc: "配备最新医疗设备的手术室" },
        { label: "手术室详情", desc: "先进医疗设备配置" },
        { label: "等候区详情", desc: "舒适的休息区" },
      ],
      zoomHint: "点击图像放大",
    },
    events: {
      eyebrow: "活动",
      sectionTitle: "活动与公告",
      sectionSubtitle: "为您带来STAR皮肤科的最新资讯",
      filterAll: "全部",
      filterNew: "新手术",
      filterEvent: "活动",
      filterNotice: "公告",
      filterEtc: "其他",
      loading: "加载中...",
      viewDetail: "查看详情",
      views: "浏览",
      empty: "目前没有可用的活动。",
      categories: ["全部", "新手术", "活动", "公告", "其他"],
      noEvents: "目前没有可用的活动。",
      readMore: "查看详情",
      featured: "主推活动",
    },
    managementDevices: {
      sectionTitle: "护理设备",
      sectionSubtitle: "STAR皮肤科 护理设备",
      items: [
        { name: "水洗剖光", desc: "肌肤清洁与保湿" },
        { name: "离子导入", desc: "加强有效成分渗透" },
        { name: "超声波护理", desc: "肌肤镇静与促进吸收" },
        { name: "LED光疗", desc: "肌肤再生与镇静" },
        { name: "高频护理", desc: "肌肤弹性与提升" },
        { name: "微电流", desc: "改善肌肤弹性" },
        { name: "冷却护理", desc: "术后镇静与冷却" },
        { name: "氧气护理", desc: "肌肤活化与再生" },
      ],
    },
    welcomePopup: {
      title: "STAR皮肤科活动",
      subtitle: "立即查看",
      cta_kakao: "WeChat咨询",
      cta_reserve: "在线预约",
      cta_call: "电话预约",
      dismiss: "关闭",
      dismissToday: "今日不再显示",
    },
    eventDetail: {
      loading: "加载中...",
      notFound: "未找到该活动。",
      backToList: "返回活动列表",
      views: "浏览",
      intro: "活动详情",
      cta_kakao: "WeChat咨询",
      cta_call: "电话预约",
      directions: "交通指南",
      address: "釜山西面 爱恩城大厦 2F、4F",
      tel: "+82-51-818-2300",
      viewMap: "查看地图",
    },
    treatmentDetail: {
      backToHome: "首页",
      duration: "治疗时间",
      recovery: "恢复期",
      price: "价格",
      effect: "预期效果",
      popular: "热门",
      faqTitle: "常见问题",
      notFound: "未找到该治疗项目。",
      backBtn: "返回",
      ctaConsult: "WeChat咨询",
      ctaReserve: "LINE咨询",
    },
    faq: {
      sectionTitle: "常见问题",
      sectionSubtitle: "解答您对治疗的疑问",
      items: [
        {
          equipment: "超声刀",
          questions: [
            { q: "超声刀是什么治疗？", a: "超声刀利用聚焦超声波（HIFU）能量进行提升紧肤治疗，将热量传递到皮肤深层，刺激胶原蛋白再生。无需手术即可达到提升效果。" },
            { q: "治疗后的恢复期是多久？", a: "治疗后可立即恢复日常生活，可能会有轻微红肿，通常1-2天内消退。" },
            { q: "什么时候能看到效果？", a: "治疗后即可感受到效果，胶原蛋白再生完成后约3个月时效果最佳。" },
            { q: "治疗间隔是多久？", a: "通常建议每6个月至1年进行一次治疗。" },
          ]
        },
        {
          equipment: "热玛吉",
          questions: [
            { q: "热玛吉和超声刀有什么区别？", a: "热玛吉使用RF（射频）能量，超声刀使用超声波。热玛吉从皮肤表面到深层均匀传递热量，两种治疗结合使用效果更佳。" },
            { q: "治疗需要多长时间？", a: "根据治疗部位，需要30分钟至1.5小时。" },
            { q: "会痛吗？", a: "会有轻微热感，但几乎没有疼痛感。治疗前会涂抹麻醉霜，让您舒适地接受治疗。" },
            { q: "效果能持续多久？", a: "因人而异，通常效果可持续1-2年。" },
          ]
        },
        {
          equipment: "XERF",
          questions: [
            { q: "XERF是什么治疗？", a: "XERF是利用射频的最新提升技术，特点是治疗时间短、效果显著。可同时改善皮肤弹性和提升效果。" },
            { q: "一次治疗就有效果吗？", a: "是的，一次治疗即可看到即时效果，定期治疗可维持并改善效果。" },
            { q: "治疗后注意事项有哪些？", a: "治疗后2-3天内避免强烈紫外线照射，并做好保湿护理。" },
          ]
        },
        {
          equipment: "眼袋脂肪重置",
          questions: [
            { q: "眼袋脂肪重置是什么？", a: "将眼睛下方突出的脂肪重新定位，改善眼下凹陷的手术。无需切开即可获得自然的效果。" },
            { q: "治疗后的恢复期是多久？", a: "可能会有1-2周的肿胀和淤青，2-4周后恢复自然状态。" },
            { q: "会复发吗？", a: "由于是重置脂肪而非去除，复发可能性很低。" },
          ]
        },
        {
          equipment: "皮秒激光(Enlighten)",
          questions: [
            { q: "皮秒激光是什么？", a: "皮秒激光(Enlighten)是一种皮秒级激光，能量传递速度比传统纳秒激光快1000倍。色素分解效率极高，对黄褐斑、色斑和文身去除效果卓越。" },
            { q: "需要做几次治疗？", a: "根据色素深度和浓度而定，黄褐斑和色斑通常建议3-5次，文身去除通常需要5-10次。专业医生会在咨询后制定个性化方案。" },
            { q: "治疗后的恢复期是多久？", a: "治疗后可能有轻微红肿和热感，大多数患者当天即可恢复日常生活。如有结痂，通常在1-2周内自然脱落。" },
            { q: "与传统激光嫩肤有什么区别？", a: "传统激光嫩肤使用纳秒级能量，而皮秒激光以皮秒级能量将色素分解得更细。对周围组织损伤更小，效果更优越。" },
            { q: "治疗后注意事项有哪些？", a: "治疗后2周内认真涂抹防晒霜，避免直射阳光。约1周内避免桑拿、汗蒸和剧烈运动，并持续使用处方再生霜。" },
          ]
        },
        {
          equipment: "Excel V+",
          questions: [
            { q: "Excel V+是什么治疗？", a: "Excel V+是血管和色素激光，利用532nm和1064nm两种波长有效治疗红斑、毛细血管扩张、血管瘤、红色疤痕和色素性病变。" },
            { q: "对哪些皮肤问题有效？", a: "对面部潮红、毛细血管扩张症、玫瑰痤疮、血管瘤、樱桃状血管瘤、黄褐斑、色斑、红色疤痕、痘后红斑等各种血管和色素问题均有效。" },
            { q: "治疗时会痛吗？", a: "根据治疗部位，可能会感到轻微的弹射感。可根据需要涂抹麻醉霜，将不适感降至最低。" },
            { q: "治疗后会有淤青或结痂吗？", a: "血管治疗后可能出现暂时性淤青，通常在1-2周内消退。色素治疗后可能形成细小结痂，但会自然脱落。" },
            { q: "需要做几次治疗？", a: "根据症状类型和程度而定，面部红斑和血管扩张平均需要3-5次，色素性病变需要2-4次。医生会根据个人情况制定计划。" },
          ]
        },
        {
          equipment: "利朱兰(Rejuran)",
          questions: [
            { q: "利朱兰是什么治疗？", a: "利朱兰是将从鲑鱼DNA(PDRN)中提取的多聚核苷酸(PN)成分注射到皮肤的肌肤再生治疗。修复受损细胞并促进胶原蛋白生成，改善皮肤弹性和光泽。" },
            { q: "利朱兰Healer和利朱兰Eye有什么区别？", a: "利朱兰Healer用于全脸肌肤再生，利朱兰Eye是专为眼周设计的，浓度更低，适合眼周薄嫩的皮肤。两种产品均以PN成分为基础。" },
            { q: "什么时候能看到效果？", a: "治疗后1-2周可感受到肌肤纹理的改善，经过3-4次治疗后，胶原蛋白再生更加活跃，弹性和光泽明显提升。" },
            { q: "治疗后会有肿胀或淤青吗？", a: "作为注射治疗，注射部位可能出现轻微肿胀，通常在1-3天内消退。可能出现淤青，但通常在1周内消失。" },
            { q: "治疗间隔和次数是多少？", a: "建议最初每2-4周进行4次集中治疗，之后每3-6个月进行一次维护治疗，可以长期保持效果。" },
          ]
        },
      ]
    },
    contact: {
      phone: "+82-51-818-2300",
      sms: "010-5855-3201",
      kakao: "@starpibu",
      businessInfo: "营业执照号: 605-24-84306 | 邮筱: starpibu@naver.com",
    },
    youtube: {
      sectionTitle: "皮肤科专家为您讲解皮肤故事",
      sectionSubtitle: "请访问星皮肤科YouTube频道了解更多信息",
      latestVideos: "最新视频",
      shorts: "短视频",
      visitChannel: "访问YouTube频道",
      close: "关闭",
    },
    reservation: {
      sectionTitle: "在线预约",
      sectionSubtitle: "轻松预约，无需等候即可就诊",
      loginCta: "登录并预约",
      guestCta: "以访客身份预约",
    },
    treatmentPage: {
      backHome: "返回首页",
      recovery: "恢复期",
      intro: "项目介绍",
      effects: "预期效果",
      video: "项目视频",
      caution: "注意事项",
      ctaKakao: "WeChat咨询",
      ctaCall: "电话咨询",
      ctaBook: "预约申请",
      otherTreatments: "查看其他项目",
      notFound: "未找到该项目信息。",
      notFoundBack: "返回首页",
    },
  },
};

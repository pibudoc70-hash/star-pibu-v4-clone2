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

export interface I18nContent {
  nav: {
    home: string;
    events: string;
    doctors: string;
    treatments: string;
    about: string;
    facility: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    stats: Array<{ num: string; label: string }>;
    cta_call: string;
    cta_kakao: string;
    cta_reserve: string;
    floor: string;
  };
  doctors: {
    label: string;
    title: string;
  };
  treatments: {
    label: string;
    title: string;
  };
  events: {
    label: string;
    title: string;
    viewAll: string;
    detail: string;
    views: string;
  };
  facility: {
    label: string;
    title: string;
  };
  reviews: {
    label: string;
    title: string;
    more: string;
  };
  footer: {
    address: string;
    hours: string;
    privacy: string;
    nonCovered: string;
    copyright: string;
  };
  cta: {
    kakao: string;
    naver: string;
    call: string;
  };
  admin: {
    dashboard: string;
    events: string;
    popups: string;
    users: string;
    logout: string;
  };
  directions: {
    title: string;
    address: string;
    hours: string;
    transit: string;
  };
}

const ko: I18nContent = {
  nav: {
    home: "홈",
    events: "이벤트",
    doctors: "피부과전문의",
    treatments: "시술·장비소개",
    about: "피부과 소개",
    facility: "시설안내",
    contact: "오시는 길",
  },
  hero: {
    title: "스타피부과",
    subtitle: "당신의 피부가 가장 눈부신 순간",
    stats: [
      { num: "20년+", label: "피부과전문의 경력" },
      { num: "4,000건+", label: "눈밑지방재배치시술" },
      { num: "50종+", label: "프리미엄 레이저" },
    ],
    cta_call: "051-818-2300",
    cta_kakao: "카카오톡 상담",
    cta_reserve: "네이버 예약",
    floor: "부산 서면 아이온시티빌딩 4층 접수·진료 | 2층 줄기세포 연구센터",
  },
  doctors: {
    label: "DOCTORS",
    title: "피부과 전문의",
  },
  treatments: {
    label: "TREATMENTS & EQUIPMENT",
    title: "시술·장비 소개",
  },
  events: {
    label: "EVENTS & NOTICE",
    title: "이벤트 & 공지",
    viewAll: "전체 보기",
    detail: "자세히 보기",
    views: "조회",
  },
  facility: {
    label: "FACILITY",
    title: "시설 안내",
  },
  reviews: {
    label: "REVIEWS",
    title: "고객 후기",
    more: "더 많은 후기 보기",
  },
  footer: {
    address: "부산광역시 부산진구 서면로 19 아이온시티빌딩 4층",
    hours: "평일 10:00–19:00 | 토요일 10:00–16:00 | 일·공휴일 휴진",
    privacy: "개인정보처리방침",
    nonCovered: "비급여 진료안내",
    copyright: "© 2024 STAR Dermatologic Clinic. All rights reserved.",
  },
  cta: {
    kakao: "카카오톡 상담",
    naver: "네이버 예약",
    call: "전화 상담",
  },
  admin: {
    dashboard: "관리자 대시보드",
    events: "이벤트 관리",
    popups: "팝업 관리",
    users: "사용자 관리",
    logout: "로그아웃",
  },
  directions: {
    title: "오시는 길",
    address: "주소",
    hours: "진료 시간",
    transit: "교통편 안내",
  },
};

const en: I18nContent = {
  nav: {
    home: "Home",
    events: "Events",
    doctors: "Doctors",
    treatments: "Treatments",
    about: "About",
    facility: "Facility",
    contact: "Directions",
  },
  hero: {
    title: "STAR Dermatologic Clinic",
    subtitle: "Your Most Radiant Skin Moment",
    stats: [
      { num: "20+", label: "Years of Expertise" },
      { num: "4,000+", label: "Under-Eye Procedures" },
      { num: "50+", label: "Premium Lasers" },
    ],
    cta_call: "051-818-2300",
    cta_kakao: "KakaoTalk",
    cta_reserve: "Naver Booking",
    floor: "4F Ion City Bldg, Seomyeon, Busan | 2F Stem Cell Research Center",
  },
  doctors: {
    label: "DOCTORS",
    title: "Dermatology Specialists",
  },
  treatments: {
    label: "TREATMENTS & EQUIPMENT",
    title: "Treatments & Equipment",
  },
  events: {
    label: "EVENTS & NOTICE",
    title: "Events & Notice",
    viewAll: "View All",
    detail: "Learn More",
    views: "views",
  },
  facility: {
    label: "FACILITY",
    title: "Our Facility",
  },
  reviews: {
    label: "REVIEWS",
    title: "Patient Reviews",
    more: "View More Reviews",
  },
  footer: {
    address: "4F Ion City Bldg, 19 Seomyeon-ro, Busanjin-gu, Busan",
    hours: "Weekdays 10:00–19:00 | Sat 10:00–16:00 | Sun & Holidays Closed",
    privacy: "Privacy Policy",
    nonCovered: "Non-covered Services",
    copyright: "© 2024 STAR Dermatologic Clinic. All rights reserved.",
  },
  cta: {
    kakao: "KakaoTalk",
    naver: "Naver Booking",
    call: "Call Us",
  },
  admin: {
    dashboard: "Admin Dashboard",
    events: "Manage Events",
    popups: "Manage Popups",
    users: "Manage Users",
    logout: "Logout",
  },
  directions: {
    title: "Directions",
    address: "Address",
    hours: "Hours",
    transit: "Getting Here",
  },
};

const ja: I18nContent = {
  nav: {
    home: "ホーム",
    events: "イベント",
    doctors: "皮膚科専門医",
    treatments: "施術・機器",
    about: "クリニック紹介",
    facility: "施設案内",
    contact: "アクセス",
  },
  hero: {
    title: "スター皮膚科",
    subtitle: "あなたの肌が最も輝く瞬間",
    stats: [
      { num: "20年+", label: "皮膚科専門医経歴" },
      { num: "4,000件+", label: "目の下脂肪再配置" },
      { num: "50種+", label: "プレミアムレーザー" },
    ],
    cta_call: "051-818-2300",
    cta_kakao: "カカオトーク相談",
    cta_reserve: "ネイバー予約",
    floor: "釜山西面アイオンシティビル4F 受付・診療 | 2F 幹細胞研究センター",
  },
  doctors: {
    label: "DOCTORS",
    title: "皮膚科専門医",
  },
  treatments: {
    label: "TREATMENTS & EQUIPMENT",
    title: "施術・機器紹介",
  },
  events: {
    label: "EVENTS & NOTICE",
    title: "イベント・お知らせ",
    viewAll: "すべて見る",
    detail: "詳しく見る",
    views: "閲覧",
  },
  facility: {
    label: "FACILITY",
    title: "施設案内",
  },
  reviews: {
    label: "REVIEWS",
    title: "患者様の声",
    more: "もっと見る",
  },
  footer: {
    address: "釜山広域市釜山鎮区西面路19 アイオンシティビル4F",
    hours: "平日 10:00–19:00 | 土曜 10:00–16:00 | 日・祝日 休診",
    privacy: "個人情報処理方針",
    nonCovered: "自由診療案内",
    copyright: "© 2024 STAR Dermatologic Clinic. All rights reserved.",
  },
  cta: {
    kakao: "カカオトーク",
    naver: "ネイバー予約",
    call: "電話相談",
  },
  admin: {
    dashboard: "管理者ダッシュボード",
    events: "イベント管理",
    popups: "ポップアップ管理",
    users: "ユーザー管理",
    logout: "ログアウト",
  },
  directions: {
    title: "アクセス",
    address: "住所",
    hours: "診療時間",
    transit: "交通案内",
  },
};

const zh: I18nContent = {
  nav: {
    home: "首页",
    events: "活动",
    doctors: "皮肤科专家",
    treatments: "治疗·设备",
    about: "诊所介绍",
    facility: "设施介绍",
    contact: "交通指南",
  },
  hero: {
    title: "STAR皮肤科",
    subtitle: "让您的肌肤绽放最耀眼的光彩",
    stats: [
      { num: "20年+", label: "皮肤科专家经历" },
      { num: "4,000例+", label: "眼袋脂肪重置手术" },
      { num: "50种+", label: "高端激光设备" },
    ],
    cta_call: "051-818-2300",
    cta_kakao: "KakaoTalk咨询",
    cta_reserve: "Naver预约",
    floor: "釜山西面爱恩城市大厦4楼 接诊·诊疗 | 2楼 干细胞研究中心",
  },
  doctors: {
    label: "DOCTORS",
    title: "皮肤科专家",
  },
  treatments: {
    label: "TREATMENTS & EQUIPMENT",
    title: "治疗·设备介绍",
  },
  events: {
    label: "EVENTS & NOTICE",
    title: "活动与公告",
    viewAll: "查看全部",
    detail: "了解更多",
    views: "浏览",
  },
  facility: {
    label: "FACILITY",
    title: "设施介绍",
  },
  reviews: {
    label: "REVIEWS",
    title: "患者评价",
    more: "查看更多评价",
  },
  footer: {
    address: "釜山广域市釜山镇区西面路19号爱恩城市大厦4楼",
    hours: "工作日 10:00–19:00 | 周六 10:00–16:00 | 周日及节假日 休诊",
    privacy: "隐私政策",
    nonCovered: "自费诊疗指南",
    copyright: "© 2024 STAR Dermatologic Clinic. All rights reserved.",
  },
  cta: {
    kakao: "KakaoTalk",
    naver: "Naver预约",
    call: "电话咨询",
  },
  admin: {
    dashboard: "管理员仪表板",
    events: "活动管理",
    popups: "弹窗管理",
    users: "用户管理",
    logout: "退出登录",
  },
  directions: {
    title: "交通指南",
    address: "地址",
    hours: "诊疗时间",
    transit: "交通方式",
  },
};

export const i18n: Record<Lang, I18nContent> = { ko, en, ja, zh };

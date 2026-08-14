export type EquipmentDetailQuoteLang = "ko" | "en" | "ja" | "zh" | "zh-TW";

export type EquipmentDetailQuote = {
  heading: string;
  locationLabel: string;
  location: string;
  hoursLabel: string;
  hours: string;
  providerLabel: string;
  provider: string;
  painManagementLabel: string;
  painManagement: string;
};

export const EQUIPMENT_DETAIL_QUOTES: Record<EquipmentDetailQuoteLang, EquipmentDetailQuote> = {
  ko: {
    heading: "진료·시술 안내",
    locationLabel: "위치",
    location: "부산광역시 부산진구 서면로 74, 아이온시티빌딩 2·4층",
    hoursLabel: "진료시간",
    hours: "평일 10:00–19:00 · 토요일 09:30–15:00 · 일요일·공휴일 휴진 · 평일 점심시간 13:00–14:00",
    providerLabel: "시술 주체",
    provider: "피부과 전문의가 상담부터 시술까지 직접 담당합니다.",
    painManagementLabel: "통증·진정 관리",
    painManagement: "통증 관리가 필요한 시술은 상담 후 크림마취·국소마취·수면마취(진정) 등 적절한 방법을 검토하며, 피부과 전문의가 전 과정을 관리합니다.",
  },
  en: {
    heading: "Clinic & Treatment Information",
    locationLabel: "Location",
    location: "ION City Building, 2F & 4F, 74 Seomyeon-ro, Busanjin-gu, Busan, Korea",
    hoursLabel: "Clinic Hours",
    hours: "Mon–Fri 10:00–19:00 · Sat 09:30–15:00 · Closed Sundays and public holidays · Weekday lunch break 13:00–14:00",
    providerLabel: "Treatment Provider",
    provider: "A board-certified dermatologist personally provides consultation and treatment.",
    painManagementLabel: "Pain & Sedation Management",
    painManagement: "For procedures that require pain management, topical anesthetic cream, local anesthesia, or sedation may be considered after consultation, and a board-certified dermatologist manages the full process.",
  },
  ja: {
    heading: "診療・施術のご案内",
    locationLabel: "所在地",
    location: "釜山広域市釜山鎮区 Seomyeon-ro 74、アイオンシティビル 2・4階",
    hoursLabel: "診療時間",
    hours: "平日 10:00–19:00 · 土曜日 09:30–15:00 · 日曜・祝日休診 · 平日昼休み 13:00–14:00",
    providerLabel: "施術担当",
    provider: "皮膚科専門医がカウンセリングから施術まで直接担当します。",
    painManagementLabel: "痛み・鎮静管理",
    painManagement: "痛みへの配慮が必要な施術では、相談のうえ麻酔クリーム・局所麻酔・鎮静などを検討し、皮膚科専門医が全過程を管理します。",
  },
  zh: {
    heading: "诊疗与治疗信息",
    locationLabel: "地址",
    location: "韩国釜山广域市釜山镇区 Seomyeon-ro 74，爱恩城大厦 2、4层",
    hoursLabel: "诊疗时间",
    hours: "周一至周五 10:00–19:00 · 周六 09:30–15:00 · 周日及法定节假日休诊 · 工作日午休 13:00–14:00",
    providerLabel: "治疗主体",
    provider: "由皮肤科专科医生亲自负责从咨询到治疗的全过程。",
    painManagementLabel: "疼痛与镇静管理",
    painManagement: "对于需要疼痛管理的治疗，医生会在咨询后评估表面麻醉膏、局部麻醉或镇静等合适方式，并由皮肤科专科医生管理全过程。",
  },
  "zh-TW": {
    heading: "診療與療程資訊",
    locationLabel: "地址",
    location: "韓國釜山廣域市釜山鎮區 Seomyeon-ro 74，愛奧城市大廈 2、4樓",
    hoursLabel: "診療時間",
    hours: "週一至週五 10:00–19:00 · 週六 09:30–15:00 · 週日及國定假日休診 · 平日午休 13:00–14:00",
    providerLabel: "療程主體",
    provider: "由皮膚科專科醫師親自負責從諮詢到療程的全過程。",
    painManagementLabel: "疼痛與鎮靜管理",
    painManagement: "針對需要疼痛管理的療程，醫師會在諮詢後評估表面麻醉膏、局部麻醉或鎮靜等合適方式，並由皮膚科專科醫師管理全過程。",
  },
};

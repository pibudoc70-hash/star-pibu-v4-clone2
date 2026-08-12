/**
 * STAR 피부과 이벤트 & 공지 데이터
 * EventsSection + EventDetail 페이지 공유 데이터 소스
 */
import { ReactNode } from "react";

export interface EventItem {
  id: string;
  type: "이벤트" | "공지";
  badge: string;
  badgeColor: string;
  hot: boolean;
  featured: boolean;
  title: string;
  subtitle?: string;
  tag?: string;
  desc: string;
  // 상세 페이지용 풍부한 내용
  fullDesc: string;
  highlights?: string[];
  priceTable?: Array<{ label: string; original?: string; price: string }>;
  priceNote?: string;
  period?: string;
  date: string;
  views: number;
  // Featured 카드 스타일
  accent?: string;
  accentDark?: string;
  accentBg?: string;
  iconBg?: string;
  iconType?: "zap" | "sparkles" | "bell" | "tag";
  cta?: string;
  deviceImage?: string;  // 장비 이미지 CDN URL
  deviceImageAlt?: string;
  deviceImage2?: string;  // 두 번째 장비 이미지 (울써마지 등 복수 장비용)
  deviceImage2Alt?: string;
}

export const events: EventItem[] = [
  {
    id: "cerf-2026",
    type: "이벤트",
    badge: "진행중",
    badgeColor: "#E57373",
    hot: true,
    featured: true,
    title: "세르프 리프팅 도입 특가전",
    subtitle: "CERF Lifting",
    tag: "NEW 장비 도입",
    desc: "스타피부과 확장 이전을 기념하여 최신 세르프 리프팅 장비 도입 특가 이벤트를 진행합니다. 한정 수량으로 진행되오니 서둘러 예약하세요.",
    fullDesc: `스타피부과가 아이온시티빌딩으로 확장 이전하며 최신 세르프(CERF) 리프팅 장비를 도입했습니다.\n\n세르프는 고강도 집속 RF(Radio Frequency) 에너지를 피부 깊은 층에 전달하여 콜라겐 재생을 촉진하고, 절개 없이 자연스러운 리프팅 효과를 제공하는 차세대 리프팅 장비입니다.\n\n도입 기념 특가로 한정 수량만 진행되오니, 지금 바로 카카오톡으로 문의해 주세요.`,
    highlights: [
      "절개 없는 비침습적 리프팅",
      "당일 일상 복귀 가능",
      "피부과 전문의 직접 시술",
      "확장 이전 기념 한정 특가",
    ],
    priceTable: [
      { label: "300샷", original: "100만원", price: "80만원" },
      { label: "600샷", original: "200만원", price: "150만원" },
    ],
    priceNote: "* VAT 포함 / 선착순 한정",
    period: "2026. 03. 12 ~ 소진 시 종료",
    date: "2026. 03. 12",
    views: 309,
    accent: "#81C7C9",
    accentDark: "#4A9FA2",
    accentBg: "linear-gradient(135deg, #EEF9F9 0%, #D4F0F1 100%)",
    iconBg: "#C8ECEE",
    iconType: "zap",
    cta: "이벤트 문의",
    deviceImage: "/api/storage/cerf-device-v2_f0ba33a0_982683d2.png",
    deviceImageAlt: "XERF 세르프 리프팅 장비",
  },
  {
    id: "notice-move-2026",
    type: "공지",
    badge: "공지",
    badgeColor: "#4A6FA5",
    hot: false,
    featured: false,
    title: "접수 및 진료 이전 안내",
    desc: "스타피부과 서면점이 아이온시티빌딩 4층(진료·접수) 및 2층(줄기세포수술센터)으로 확장 이전하였습니다. 많은 이용 부탁드립니다.",
    fullDesc: `스타피부과 서면점이 아이온시티빌딩으로 확장 이전하였습니다.\n\n▶ 접수·진료: 아이온시티빌딩 4층\n▶ 줄기세포 연구센터: 아이온시티빌딩 2층\n\n주소: 부산광역시 부산진구 서면로 74 아이온시티빌딩 2·4층\n\n지하철 1·2호선 서면역 5번·7번 출구에서 도보 3분 거리입니다. 주차는 아이온시티 건물 내 주차장을 이용하실 수 있습니다.\n\n더 넓고 쾌적한 환경에서 더 나은 의료 서비스를 제공할 수 있도록 최선을 다하겠습니다.`,
    highlights: [
      "4층: 접수 및 진료",
      "2층: 줄기세포 연구센터",
      "서면역 5·7번 출구 도보 3분",
      "건물 내 주차 가능",
    ],
    date: "2026. 03. 03",
    views: 154,
    iconType: "bell",
    cta: "오시는 길 보기",
  },
  {
    id: "ulthermage-encore-2026",
    type: "이벤트",
    badge: "앵콜",
    badgeColor: "#9CA3AF",
    hot: false,
    featured: true,
    title: "부산 리프팅 이벤트 앵콜전",
    subtitle: "Ultherapy Prime + Thermage FLX",
    tag: "울쎄라피 × 써마지",
    desc: "큰 호응에 힘입어 울쎄라피 프라임 + 써마지 FLX 패키지 앵콜 이벤트를 진행합니다. 두 가지 프리미엄 리프팅을 한 번에 경험하세요.",
    fullDesc: `지난 울써마지 이벤트에 보내주신 큰 호응에 힘입어 앵콜 이벤트를 진행합니다.\n\n울쎄라피 프라임은 집속초음파 기술을 적용한 울쎄라피의 최신 업그레이드 버전으로, 넓은 시술 부위에 정밀하게 에너지를 전달하도록 설계되었습니다.\n\n써마지 FLX는 4세대 고주파 리프팅 장비입니다. 피부 깊은 층에 고주파 에너지를 전달해 탄력 관리에 활용됩니다.\n\n두 가지 프리미엄 리프팅을 함께 상담해 보세요.`,
    highlights: [
      "울쎄라피 프라임 + 써마지 FLX 패키지",
      "조시형 원장 공식 자문의 장비",
      "당일 일상 복귀 가능",
      "피부과 교수 출신 전문의 직접 시술",
    ],
    priceTable: [
      { label: "패키지 A", original: "350만원", price: "상담 후 결정" },
      { label: "패키지 B", original: "500만원", price: "상담 후 결정" },
    ],
    priceNote: "* 정확한 가격은 카카오톡 상담을 통해 안내드립니다",
    period: "2026. 01. 02 ~ 종료",
    date: "2026. 01. 02",
    views: 1917,
    accent: "#4A6FA5",
    accentDark: "#2D4A7A",
    accentBg: "linear-gradient(135deg, #EEF2FA 0%, #D6E1F5 100%)",
    iconBg: "#C8D8F0",
    iconType: "sparkles",
    cta: "이벤트 문의",
    deviceImage: "/api/storage/ultherapy-prime-v2_a733133e_db3b55de.jpg",
    deviceImageAlt: "울쎄라피 프라임 + 써마지 FLX 장비",
    deviceImage2: "/api/storage/thermage-flx-device2_f28cc552_b29a60f0.png",
    deviceImage2Alt: "써마지 FLX 장비",
  },
  {
    id: "ulthermage-2025",
    type: "이벤트",
    badge: "종료",
    badgeColor: "#9CA3AF",
    hot: false,
    featured: false,
    title: "부산 울써마지 리프팅 이벤트",
    desc: "울쎄라피 + 써마지 FLX 동시 시술 특가 이벤트. 두 가지 리프팅을 한 번에 경험하세요.",
    fullDesc: `울쎄라피와 써마지 FLX를 동시에 시술하는 특가 이벤트를 진행했습니다.\n\n이 이벤트는 종료되었습니다. 현재 진행 중인 이벤트는 '세르프 리프팅 도입 특가전'과 '부산 리프팅 이벤트 앵콜전'을 확인해 주세요.`,
    highlights: [
      "울쎄라피 + 써마지 FLX 동시 시술",
      "당일 일상 복귀",
    ],
    period: "2025. 12. 11 ~ 종료",
    date: "2025. 12. 11",
    views: 1857,
    iconType: "tag",
    cta: "현재 이벤트 보기",
  },
  {
    id: "calendar-2025",
    type: "이벤트",
    badge: "종료",
    badgeColor: "#9CA3AF",
    hot: false,
    featured: false,
    title: "2026년 탁상달력 무료증정",
    desc: "스타피부과를 방문해 주시는 모든 분께 2026년 탁상달력을 무료로 증정합니다.",
    fullDesc: `스타피부과를 방문해 주시는 모든 분께 2026년 탁상달력을 무료로 증정하는 이벤트를 진행했습니다.\n\n이 이벤트는 종료되었습니다. 현재 진행 중인 이벤트를 확인해 주세요.`,
    highlights: ["방문 고객 전원 증정", "수량 소진 시 종료"],
    period: "2025. 11. 20 ~ 종료",
    date: "2025. 11. 20",
    views: 272,
    iconType: "tag",
    cta: "현재 이벤트 보기",
  },
  {
    id: "ultherapy-prime-launch-2025",
    type: "이벤트",
    badge: "종료",
    badgeColor: "#9CA3AF",
    hot: false,
    featured: false,
    title: "울쎄라피 프라임 도입 기념 이벤트",
    desc: "울쎄라피 프라임 도입을 기념하여 진행한 특가 이벤트입니다.",
    fullDesc: `울쎄라피 프라임 도입을 기념하여 진행한 특가 이벤트입니다.\n\n울쎄라피 프라임은 집속초음파 기술로 넓은 시술 부위에 정밀하게 에너지를 전달하도록 설계되었습니다.\n\n이 이벤트는 종료되었습니다. 현재 진행 중인 이벤트를 확인해 주세요.`,
    highlights: [
      "울쎄라피 프라임 도입 기념",
      "집속초음파 기술 적용",
      "기존 대비 더 넓은 커버리지",
    ],
    period: "2025. 11. 07 ~ 종료",
    date: "2025. 11. 07",
    views: 1896,
    iconType: "sparkles",
    cta: "현재 이벤트 보기",
  },
];

export const featuredEvents = events.filter((e) => e.featured);
export const listEvents = events.filter((e) => !e.featured);

export function getEventById(id: string): EventItem | undefined {
  return events.find((e) => e.id === id);
}

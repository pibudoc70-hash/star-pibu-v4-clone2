/*
 * TreatmentsSection - 스타피부과 대표시술 섹션
 * Design: Modern Clinical Edge - 민트/네이비 듀오톤
 * 리프팅·탄력: 3그룹 분류 (써마지FLX / 울쎄라피 그룹 / 기타 리프팅 장비)
 */
import { useState } from "react";
import { ArrowRight, Clock, RefreshCw, Sparkles, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

const tabs = [
  { id: "BEST", label: "BEST" },
  { id: "리프팅·탄력", label: "리프팅·탄력" },
  { id: "눈밑·성형", label: "눈밑·성형" },
  { id: "색소·문신제거", label: "색소·문신제거" },
  { id: "여드름·흉터·홍조", label: "여드름·흉터·홍조" },
  { id: "무좀·액취증·다한증", label: "무좀·액취증·다한증" },
];

// ── 리프팅 그룹 데이터 ──────────────────────────────────────────────────────
const CDN2 = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

const liftingGroups = [
  {
    id: "ultherapy",
    label: "울쎄라피 그룹",
    labelEn: "Ultherapy Group",
    groupColor: "#C8860A",
    description: "울쎄라피 프라임 정품 병원 · 초음파 SMAS 리프팅",
    items: [
      {
        name: "울쎄라피 프라임",
        nameEn: "Ultherapy Prime",
        desc: "리프팅 만족도 1위 울쎄라피의 최신 업그레이드 버전. 더 넓은 면적을 빠르게 커버하며 탁월한 리프팅 효과.",
        time: "60~90분",
        recovery: "당일 일상",
        badge: "인기",
        badgeColor: "#C8860A",
        image: `${CDN}/울쎄라피프라임_1_0daba485.png`,
        best: true,
      },
      {
        name: "울쎄라",
        nameEn: "Ulthera",
        desc: "초음파 에너지로 SMAS층까지 자극하는 정통 리프팅. 자연스러운 피부 탄력 회복.",
        time: "60~90분",
        recovery: "당일 일상",
        badge: null,
        badgeColor: "",
        image: `${CDN}/울쎄라_fbd556da.jpg`,
        best: false,
      },
    ],
  },
  {
    id: "thermage",
    label: "써마지 FLX",
    labelEn: "Thermage FLX",
    groupColor: "#9C5FA5",
    description: "4세대 고주파 리프팅의 정점 · 조시형 원장 공식 자문의 병원",
    items: [
      {
        name: "써마지 FLX",
        nameEn: "Thermage FLX",
        desc: "4세대 고주파 리프팅의 정점. 피부 깊은 층 콜라겐을 자극해 탄력 개선과 주름 완화에 탁월. 조시형 원장 공식 자문의.",
        time: "45~90분",
        recovery: "당일 일상",
        badge: "자문의",
        badgeColor: "#9C5FA5",
        image: `${CDN}/써마지FLX_20a90462.png`,
        best: true,
      },
    ],
  },
  {
    id: "others",
    label: "기타 리프팅 장비",
    labelEn: "Other Lifting Devices",
    groupColor: "#4A6FA5",
    description: "세르프 · 텐쎄라 · 온다 · 슈링크 유니버스 · 트리니티 · 버츄RF · 텐써마 · 프로파운드 · 라페라 · 인텐스 슈링크 · 에너젯 울트라 · 엑실리스 울트라 · 더마샤인 프로 · 쥴 헤일로/스킨타이트",
    items: [
      {
        name: "세르프",
        nameEn: "CERF",
        desc: "최신 고강도 RF 리프팅 장비. 절개 없이 자연스러운 리프팅 효과와 피부 탄력 개선. 확장 기념 특가 진행 중.",
        time: "60~90분",
        recovery: "당일 일상",
        badge: "이벤트",
        badgeColor: "#E57373",
        image: `${CDN}/세르프_a8ccb139.png`,
        best: true,
      },
      {
        name: "텐쎄라",
        nameEn: "Tensera",
        desc: "고주파와 초음파를 동시에 활용한 복합 리프팅. 피부 탄력과 윤곽 개선에 효과적인 프리미엄 시술.",
        time: "40~60분",
        recovery: "당일 일상",
        badge: null,
        badgeColor: "",
        image: `${CDN}/텐써마_2b7e3a1f.png`,
        best: false,
      },
      {
        name: "온다",
        nameEn: "ONDA",
        desc: "마이크로파 에너지로 지방세포를 선택적으로 파괴. 턱살·볼살 등 부분 윤곽 개선에 탁월.",
        time: "30~60분",
        recovery: "1~3일",
        badge: null,
        badgeColor: "",
        image: `${CDN}/온다_8a3c9635.png`,
        best: false,
      },
      {
        name: "슈링크 유니버스",
        nameEn: "Shrink Universe",
        desc: "집속 초음파 리프팅의 업그레이드 버전. 다양한 깊이의 에너지 전달로 효과적인 리프팅.",
        time: "40~60분",
        recovery: "당일 일상",
        badge: null,
        badgeColor: "",
        image: `${CDN2}/intense_shrink_device_497f97c6.jpg`,
        best: false,
      },
      {
        name: "트리니티 리프토닝",
        nameEn: "Trinity Liftoning",
        desc: "리프팅과 토닝을 동시에. 피부 탄력과 색조 개선을 한 번에 해결하는 복합 에너지 시술.",
        time: "40~60분",
        recovery: "당일 일상",
        badge: null,
        badgeColor: "",
        image: `${CDN}/트리니티리프토닝_ae069042.png`,
        best: false,
      },
      {
        name: "버츄RF",
        nameEn: "Virtue RF",
        desc: "마이크로니들 RF 시술. 피부 깊은 층에 RF 에너지를 전달해 탄력과 모공 개선.",
        time: "40~60분",
        recovery: "3~5일",
        badge: null,
        badgeColor: "",
        image: `${CDN}/버츄RF_d5248119.png`,
        best: false,
      },
      {
        name: "텐써마",
        nameEn: "Tensuma",
        desc: "3세대 고주파 리프팅 장비. 피부 깊은 층 콜라겐을 자극해 탄력 개선과 주름 완화에 효과적.",
        time: "40~60분",
        recovery: "당일 일상",
        badge: null,
        badgeColor: "",
        image: `${CDN}/큐어맥스_6a680589.png`,
        best: false,
      },
      {
        name: "프로파운드",
        nameEn: "Profound RF",
        desc: "마이크로니들 RF 에너지로 피부 깊은 층까지 자극. 탄력 개선과 리프팅 효과가 탁월한 프리미엄 시술.",
        time: "60~90분",
        recovery: "5~7일",
        badge: null,
        badgeColor: "",
        image: `${CDN}/프로파운드_93be7410.png`,
        best: false,
      },
      {
        name: "라페라",
        nameEn: "LAFERRA",
        desc: "고주파 에너지를 이용한 비침습적 리프팅. 피부 탄력 개선과 주름 완화에 효과적인 최신 장비.",
        time: "40~60분",
        recovery: "당일 일상",
        badge: "NEW",
        badgeColor: "#2E7D32",
        image: `${CDN2}/lafera_device_51c00701.jpg`,
        best: false,
      },
      {
        name: "인텐스 슈링크",
        nameEn: "Intense Shrink",
        desc: "슈링크의 강화 버전. 더 강력한 에너지로 깊은 층까지 자극하여 탁월한 리프팅 효과.",
        time: "40~60분",
        recovery: "당일 일상",
        badge: null,
        badgeColor: "",
        image: `${CDN2}/intense_shrink_device_497f97c6.jpg`,
        best: false,
      },
      {
        name: "에너젯 울트라",
        nameEn: "EnerJet Ultra",
        desc: "제트 인젝션 기술로 약물을 피부 깊은 층에 무침 주입. 리프팅과 피부 재생을 동시에.",
        time: "30~50분",
        recovery: "1~2일",
        badge: null,
        badgeColor: "",
        image: `${CDN2}/enerjet_device_03fc0d73.webp`,
        best: false,
      },
      {
        name: "엑실리스 울트라",
        nameEn: "Exilis Ultra",
        desc: "RF와 초음파를 결합한 BTL 복합 리프팅. 피부 탄력 개선과 지방 감소를 동시에.",
        time: "30~60분",
        recovery: "당일 일상",
        badge: null,
        badgeColor: "",
        image: `${CDN2}/exilis_device_addd0ab6.png`,
        best: false,
      },
      {
        name: "더마샤인 프로",
        nameEn: "DermaShine Pro",
        desc: "수분 공급과 리프팅을 동시에. 히알루론산을 피부 깊은 층에 주입해 즉각적인 탄력과 광채 개선.",
        time: "30~50분",
        recovery: "당일 일상",
        badge: null,
        badgeColor: "",
        image: `${CDN2}/dermashine_device_4b690d79.webp`,
        best: false,
      },
      {
        name: "쥴 헤일로/스킨타이트",
        nameEn: "Juvederm Halo / Skintyte",
        desc: "하이브리드 프랙셔널 레이저 시술. 피부 표면과 깊은 층을 동시에 치료해 탄력·색조·질감을 한 번에 개선.",
        time: "45~60분",
        recovery: "3~5일",
        badge: null,
        badgeColor: "",
        image: `${CDN}/슈링크_6ee40d79.png`,
        best: false,
      },
    ],
  },
];

// ── 기타 시술 데이터 ──────────────────────────────────────────────────────
const otherTreatments = [
  // 눈밑·성형
  {
    category: "눈밑·성형",
    best: true,
    name: "눈밑지방재배치",
    nameEn: "Under-eye Fat Repositioning",
    desc: "4,000례 이상의 풍부한 경험. 다크서클과 눈밑 볼록함을 동시에 개선하는 스타피부과 대표 시술. 절개 없이 자연스러운 결과.",
    time: "30~60분",
    recovery: "3~7일",
    price: "상담 후 결정",
    badge: "BEST",
    badgeColor: "#4A6FA5",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop",
  },
  {
    category: "눈밑·성형",
    best: false,
    name: "눈밑지방제거",
    nameEn: "Under-eye Fat Removal",
    desc: "눈밑 지방을 직접 제거하는 시술. 심한 눈밑 볼록함 개선에 효과적.",
    time: "30~60분",
    recovery: "5~7일",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop",
  },
  {
    category: "눈밑·성형",
    best: false,
    name: "필러 시술",
    nameEn: "Filler Treatment",
    desc: "히알루론산 필러로 눈밑 꺼짐, 팔자주름, 볼 볼륨 등을 자연스럽게 개선.",
    time: "20~40분",
    recovery: "1~3일",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
  },
  {
    category: "눈밑·성형",
    best: false,
    name: "보톡스",
    nameEn: "Botox",
    desc: "눈가 주름, 이마 주름, 사각턱, 종아리 등 다양한 부위에 적용 가능한 보툴리눔 독소 시술.",
    time: "10~20분",
    recovery: "당일 일상",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
  },
  // 색소·문신제거
  {
    category: "색소·문신제거",
    best: true,
    name: "피코레이저",
    nameEn: "Pico Laser",
    desc: "기미·잡티·문신 제거에 탁월. 피코초 단위의 초단파 레이저로 색소 분해. 주변 조직 손상 최소화.",
    time: "20~40분",
    recovery: "3~5일",
    price: "상담 후 결정",
    badge: "인기",
    badgeColor: "#4A6FA5",
    image: `${CDN}/피코슈어_20d65c44.png`,
  },
  {
    category: "색소·문신제거",
    best: false,
    name: "레이저 토닝",
    nameEn: "Laser Toning",
    desc: "저출력 레이저로 기미·색소를 점진적으로 개선. 피부 톤 균일화와 미백 효과.",
    time: "20~30분",
    recovery: "당일 일상",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/스타워커_b95a35a4.png`,
  },
  {
    category: "색소·문신제거",
    best: false,
    name: "IPL 광치료",
    nameEn: "IPL Phototherapy",
    desc: "넓은 파장의 빛으로 색소, 혈관, 피부결을 동시에 개선하는 복합 광치료.",
    time: "20~40분",
    recovery: "1~3일",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/bbl-removebg-preview_f5544d44.png`,
  },
  {
    category: "색소·문신제거",
    best: false,
    name: "점·검버섯 제거",
    nameEn: "Mole & Age Spot Removal",
    desc: "레이저를 이용한 점, 검버섯, 비립종 등 피부 병변 제거. 흉터 최소화.",
    time: "10~30분",
    recovery: "5~7일",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/디스커버리피코_41237d61.png`,
  },
  // 여드름·흉터·홍조
  {
    category: "여드름·흉터·홍조",
    best: true,
    name: "안면홍조 치료",
    nameEn: "Rosacea Treatment",
    desc: "Excel V+ 혈관 레이저로 안면홍조, 모세혈관 확장, 붉은 피부를 효과적으로 개선.",
    time: "20~40분",
    recovery: "1~3일",
    price: "상담 후 결정",
    badge: "특화",
    badgeColor: "#E57373",
    image: `${CDN}/엑셀V_70001aa7.png`,
  },
  {
    category: "여드름·흉터·홍조",
    best: false,
    name: "여드름 치료",
    nameEn: "Acne Treatment",
    desc: "아비클리어·플래티넘PTT 등 최신 여드름 레이저 치료. 염증성 여드름부터 블랙헤드까지 맞춤 치료.",
    time: "20~40분",
    recovery: "1~3일",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/아비클리어_3d94823e.png`,
  },
  {
    category: "여드름·흉터·홍조",
    best: false,
    name: "여드름 흉터 치료",
    nameEn: "Acne Scar Treatment",
    desc: "카프리레이저·틱셀·플라듀오 등 최신 장비로 여드름 흉터를 효과적으로 개선.",
    time: "30~60분",
    recovery: "3~7일",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/플라듀오_5670ee42.png`,
  },
  {
    category: "여드름·흉터·홍조",
    best: false,
    name: "흉터 치료",
    nameEn: "Scar Treatment",
    desc: "수술 흉터, 외상 흉터, 켈로이드 등 다양한 흉터를 레이저와 주사로 개선.",
    time: "20~40분",
    recovery: "3~7일",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/틱셀_fba3887b.png`,
  },
  // 무좀·액취증·다한증
  {
    category: "무좀·액취증·다한증",
    best: false,
    name: "손발톱무좀 치료",
    nameEn: "Nail Fungus Treatment",
    desc: "레이저를 이용한 손발톱무좀 치료. 약물 부작용 없이 안전하고 효과적인 치료.",
    time: "20~40분",
    recovery: "당일 일상",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/오니코_46e4998f.png`,
  },
  {
    category: "무좀·액취증·다한증",
    best: false,
    name: "액취증 치료",
    nameEn: "Axillary Odor Treatment",
    desc: "미라드라이 프레쉬로 겨드랑이 땀샘을 영구적으로 제거. 땀과 냄새를 동시에 해결.",
    time: "60~90분",
    recovery: "3~5일",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/미라드라이_07125c02.png`,
  },
  {
    category: "무좀·액취증·다한증",
    best: false,
    name: "다한증 치료",
    nameEn: "Hyperhidrosis Treatment",
    desc: "보톡스 주사 또는 레이저를 이용한 다한증 치료. 손·발·겨드랑이 과도한 땀 분비 개선.",
    time: "20~40분",
    recovery: "당일 일상",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/에너젯_afcf856d.png`,
  },
  {
    category: "무좀·액취증·다한증",
    best: false,
    name: "백반증 치료",
    nameEn: "Vitiligo Treatment",
    desc: "엑시머 레이저를 이용한 백반증 치료. 색소 세포를 자극하여 자연스러운 피부색 회복.",
    time: "20~40분",
    recovery: "당일 일상",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/엑시머V7_5a8a4340.jpg`,
  },
  {
    category: "무좀·액취증·다한증",
    best: false,
    name: "내성발톱 치료",
    nameEn: "Ingrown Nail Treatment",
    desc: "내성발톱으로 인한 통증과 염증을 근본적으로 해결. 레이저 및 교정 치료로 재발 방지.",
    time: "20~30분",
    recovery: "1~3일",
    price: "상담 후 결정",
    badge: null,
    badgeColor: "",
    image: `${CDN}/펜토9900_4e088bc1.png`,
  },
];

// BEST에 보여줄 리프팅 시술 (best=true인 것)
const liftingBestItems = liftingGroups.flatMap((g) => g.items.filter((i) => i.best));

// 루비피코레이저 추가
const rubyPicoLaser = {
  category: "색소·문신제거",
  best: true,
  name: "루비피코레이저",
  nameEn: "Ruby Pico Laser",
  desc: "3세대 피코초 레이저. 기미·잡티·색소 제거에 탁월하며 피부 톤 개선 및 콜라겐 생성 유도.",
  time: "20~40분",
  recovery: "3~5일",
  price: "상담 후 결정",
  badge: "추천",
  badgeColor: "#4A6FA5",
  image: `${CDN}/인라이튼루비피코_43c3fbfb.png`,
};

// 주요시술 순서: 눈밑지방재배치, 써마지FLX, 울쎄라프라임, 안면홍조치료, 루비피코레이저
const allBestTreatments: any[] = [
  otherTreatments.find((t) => t.name === "눈밑지방재배치"),
  { ...liftingBestItems.find((i) => i.name === "써마지 FLX"), category: "리프팅·탄력", price: "상담 후 결정" },
  { ...liftingBestItems.find((i) => i.name === "울쎄라피 프라임"), category: "리프팅·탄력", price: "상담 후 결정" },
  otherTreatments.find((t) => t.name === "안면홍조 치료"),
  rubyPicoLaser,
].filter(Boolean);

// ── 카드 컴포넌트 ──────────────────────────────────────────────────────────
function TreatmentCard({ t, i, price = "상담 후 결정" }: { t: any; i: number; price?: string }) {
  const [mobileOverlay, setMobileOverlay] = useState(false);

  return (
    <div
      className="treatment-card group"
      style={{ animation: `cardFadeIn 0.35s ease ${Math.min(i * 0.06, 0.4)}s both` }}
    >
      {/* 이미지 영역 */}
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ height: "190px", background: "#f0f4f8" }}
        onClick={() => setMobileOverlay((v) => !v)}
      >
        <img
          src={t.image}
          alt={t.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          style={{ padding: "10px" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {t.badge && (
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white z-10"
            style={{ background: t.badgeColor }}
          >
            {t.badge}
          </span>
        )}
        {/* 호버 오버레이 (PC: hover, 모바일: 탭 토글) */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300 ${
            mobileOverlay ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{
            background: "linear-gradient(to top, rgba(31,41,55,0.94) 0%, rgba(31,41,55,0.6) 55%, transparent 100%)",
          }}
        >
          <p className="text-xs font-semibold mb-0.5 font-montserrat" style={{ color: "#81C7C9" }}>
            {t.nameEn}
          </p>
          <p className="text-sm font-bold text-white mb-1 leading-snug">{t.name}</p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.82)" }}>
            {t.desc}
          </p>
          <div className="flex gap-3 mb-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
              <Clock size={10} /> {t.time}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
              <RefreshCw size={10} /> 회복 {t.recovery}
            </span>
          </div>
          {/* 상담 버튼 */}
          <a
            href="https://pf.kakao.com/_HNyGC"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all hover:brightness-110 active:scale-95"
            style={{ background: "#FEE500", color: "#3C1E1E" }}
          >
            <MessageCircle size={12} />
            카카오톡 상담 문의
          </a>
        </div>
      </div>

      {/* 내용 */}
      <div className="p-5">
        <p className="text-xs font-semibold mb-1 font-montserrat" style={{ color: "#81C7C9" }}>
          {t.nameEn}
        </p>
        <h3 className="text-lg font-bold mb-2" style={{ color: "#1F2937" }}>
          {t.name}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280" }}>
          {t.desc}
        </p>

        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1 text-xs" style={{ color: "#9CA3AF" }}>
            <Clock size={12} />
            {t.time}
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: "#9CA3AF" }}>
            <RefreshCw size={12} />
            회복 {t.recovery}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#4A6FA5" }}>
            <Sparkles size={12} />
            {price}
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={`/treatment/${encodeURIComponent(t.name)}`}
            className="flex-1 flex items-center justify-center gap-1 text-sm font-semibold transition-all hover:gap-2 py-2 px-3 rounded-lg"
            style={{ color: "white", background: "#4A6FA5" }}
          >
            상세 정보
            <ArrowRight size={14} />
          </a>
          <a
            href="https://pf.kakao.com/_HNyGC"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 text-sm font-semibold transition-all hover:gap-2 py-2 px-3 rounded-lg"
            style={{ color: "#4A6FA5", border: "1px solid #4A6FA5" }}
          >
            상담 문의
            <MessageCircle size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── 리프팅 그룹 아코디언 ──────────────────────────────────────────────────
function LiftingGroupSection({
  group,
  defaultOpen = false,
}: {
  group: (typeof liftingGroups)[0];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="mb-6 rounded-2xl overflow-hidden border"
      style={{ borderColor: `${group.groupColor}40`, background: `${group.groupColor}06` }}
    >
      {/* 헤더 */}
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{ background: `${group.groupColor}12` }}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="w-1.5 h-8 rounded-full flex-shrink-0"
            style={{ background: group.groupColor }}
          />
          <div>
            <p className="text-xs font-semibold tracking-wider" style={{ color: group.groupColor }}>
              {group.labelEn}
            </p>
            <h3 className="text-lg font-bold leading-tight" style={{ color: "#1F2937" }}>
              {group.label}
            </h3>
          </div>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0"
            style={{ background: group.groupColor }}
          >
            {group.items.length}개 시술
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs hidden sm:block" style={{ color: "#9CA3AF" }}>
            {group.description}
          </span>
          <div style={{ color: group.groupColor }}>
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </button>

      {/* 카드 그리드 */}
      {open && (
        <div className="p-6" style={{ animation: "cardFadeIn 0.3s ease both" }}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {group.items.map((item, i) => (
              <TreatmentCard
                key={`${group.id}-${item.name}`}
                t={item}
                i={i}
                price="상담 후 결정"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────
export default function TreatmentsSection() {
  const [activeTab, setActiveTab] = useState("BEST");

  const filteredOther =
    activeTab === "BEST" || activeTab === "리프팅·탄력"
      ? []
      : otherTreatments.filter((t) => t.category === activeTab);

  const sectionRef = useSectionReveal(60);

  return (
    <section ref={sectionRef} id="treatments" className="py-24 bg-white">
      <div className="container">
        {/* 헤더 */}
        <div className="text-center mb-12 reveal-heading">
          <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: "#81C7C9" }}>
            시술 안내
          </p>
          <h2
            className="mb-4"
            style={{
              color: "#1F2937",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 800,
            }}
          >
            스타피부과 대표 시술
          </h2>
          <div className="star-divider mx-auto mb-6" />
          <p className="text-sm" style={{ color: "#6B7280" }}>
            20년 이상의 경력을 가진 피부과 전문의가 직접 시술하는 검증된 프로그램
          </p>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={
                activeTab === tab.id
                  ? { background: "#4A6FA5", color: "white", border: "1px solid #4A6FA5" }
                  : { background: "#F8FAFC", color: "#6B7280", border: "1px solid #E5F4F4" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* BEST 탭 */}
        {activeTab === "BEST" && (
          <div
            key="tab-best"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ animation: "cardFadeIn 0.4s ease both" }}
          >
            {allBestTreatments.map((t, i) => (
              <TreatmentCard key={`best-${t.name}`} t={t} i={i} price="상담 후 결정" />
            ))}
          </div>
        )}

        {/* 리프팅·탄력 탭 */}
        {activeTab === "리프팅·탄력" && (
          <div key="tab-lifting" style={{ animation: "cardFadeIn 0.4s ease both" }}>
            {/* 안내 배너 */}
            <div
              className="rounded-2xl p-6 mb-8 flex flex-wrap items-center gap-4"
              style={{
                background: "linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 100%)",
                border: "1px solid #C7D2FE",
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold tracking-wider mb-1" style={{ color: "#4A6FA5" }}>
                  LIFTING & TIGHTENING
                </p>
                <h3 className="text-xl font-bold mb-1" style={{ color: "#1F2937" }}>
                  리프팅·탄력 시술 라인업
                </h3>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  써마지 FLX 자문의 병원 · 울쎄라피 프라임 정품 병원 · 다양한 리프팅 장비 보유
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#9C5FA5" }}>
                  써마지 자문의
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#C8860A" }}>
                  울쎄라피 정품
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#4A6FA5" }}>
                  11종 장비
                </span>
              </div>
            </div>

            {/* 그룹별 아코디언 */}
            {liftingGroups.map((group, idx) => (
              <LiftingGroupSection key={group.id} group={group} defaultOpen={idx === 0} />
            ))}
          </div>
        )}

        {/* 기타 탭 */}
        {activeTab !== "BEST" && activeTab !== "리프팅·탄력" && (
          <div
            key={`tab-${activeTab}`}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ animation: "cardFadeIn 0.4s ease both" }}
          >
            {filteredOther.map((t, i) => (
              <TreatmentCard key={`${activeTab}-${t.name}`} t={t} i={i} price={t.price} />
            ))}
          </div>
        )}

        {/* 하단 CTA */}
        <div className="text-center mt-12">
          <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
            더 많은 시술이 궁금하신가요?
          </p>
          <a
            href="https://pf.kakao.com/_HNyGC"
            target="_blank"
            rel="noopener noreferrer"
            className="star-navy-btn inline-flex"
          >
            전체 시술 상담하기
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

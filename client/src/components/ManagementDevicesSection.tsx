import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── 장비 데이터 타입 ──────────────────────────────────────────────────────
interface Device {
  id: string;
  name: string;
  nameEn: string;
  shortDesc: string;
  imgId: string;
}

// ── CDN 경로 ──────────────────────────────────────────────────────────────
const CDN = "https://d36hbw14aib5lz.cloudfront.net/310519663478405399/QdQ7tySKssCV8bdRzPPxg4";

// ── 장비 이미지 맵 (CDN URL) ──────────────────────────────────────────────
const deviceImages: Record<string, string> = {
  sonopeel: `${CDN}/sonopeel.png`,
  porederm: `${CDN}/porederm.png`,
  airbubble: `${CDN}/airbubble.png`,
  oxyjet: `${CDN}/oxyjet.png`,
  inbio: `${CDN}/inbio.png`,
  flawless: `${CDN}/flawless.png`,
  dermalight: `${CDN}/dermalight.png`,
  fray: `${CDN}/fray.png`,
  ionzyme: `${CDN}/ionzyme.png`,
  healingbright: `${CDN}/healingbright.png`,
  mesoskin: `${CDN}/mesoskin.png`,
  ultraduo: `${CDN}/ultraduo.png`,
  triplemultigel: `${CDN}/triplemultigel.png`,
  ldm: `${CDN}/ldm.png`,
  ilumi: `${CDN}/ilumi.png`,
  transkin: `${CDN}/transkin.png`,
};

// ── 장비 데이터 ──────────────────────────────────────────────────────────
const devices: Device[] = [
  {
    id: "1",
    name: "소노필",
    nameEn: "SONOPEEL",
    shortDesc:
      "초음파 진동에너지와 이온의 전기적 특성을 이용하여 피부 각질을 제거하고 영양 성분을 깊이 침투시키는 복합 관리 장비입니다.",
    imgId: "sonopeel",
  },
  {
    id: "2",
    name: "포어덤",
    nameEn: "POREDERM",
    shortDesc:
      "전기 전공법을 이용하여 바늘 없이 고농도 비타민을 진피층 깊숙이 직접 투여하는 무침 약물 전달 장비입니다.",
    imgId: "porederm",
  },
  {
    id: "3",
    name: "에어버블",
    nameEn: "AIR BUBBLE THERAPY",
    shortDesc:
      "순수 산소와 함께 활성 성분을 피부에 분사하여 노폐물을 제거하고 혈액순환을 개선하며 세포 재생력을 촉진하는 장비입니다.",
    imgId: "airbubble",
  },
  {
    id: "4",
    name: "옥시젯",
    nameEn: "OXYET-LIRO",
    shortDesc:
      "바늘 없는 메조테라피 방식으로 산소와 활성 성분을 피부에 안전하고 효과적으로 침투시켜 수분과 광채를 개선하는 장비입니다.",
    imgId: "oxyjet",
  },
  {
    id: "5",
    name: "인바이오",
    nameEn: "INBIO 880",
    shortDesc:
      "절개 없이 고주파를 인체에 직접 가하여 콜라겐 재생을 촉진하고 피부 탄력과 리프팅 효과를 극대화하는 비침습 관리 장비입니다.",
    imgId: "inbio",
  },
  {
    id: "6",
    name: "플로리스",
    nameEn: "FLAWLESS",
    shortDesc:
      "고압 침투 초음파를 이용하여 피부 처짐과 주름을 개선하는 비침습 리프팅 장비입니다.",
    imgId: "flawless",
  },
  {
    id: "7",
    name: "광선조사기",
    nameEn: "DERMA LIGHT",
    shortDesc:
      "복합 광학 이중시스템으로 세포 분열을 활성화하고 피부 재생을 촉진하며 레이저 시술 후 회복을 보조하는 광선 조사 장비입니다.",
    imgId: "dermalight",
  },
  {
    id: "8",
    name: "에프레이",
    nameEn: "F-RAY",
    shortDesc:
      "빛의 원리를 이용하여 얼굴 표면의 주름·모공 깊이를 3D로 정밀 분석하고 시술 전후 데이터를 제공하는 피부 진단 장비입니다.",
    imgId: "fray",
  },
  {
    id: "9",
    name: "이온자임",
    nameEn: "IONZYME",
    shortDesc:
      "전기이온 영동법과 초음파를 동시에 이용해 고농도 비타민을 피부에 직접 침투시켜 미백과 항산화 효과를 제공하는 장비입니다.",
    imgId: "ionzyme",
  },
  {
    id: "10",
    name: "힐링브라이트",
    nameEn: "HEALING BRIGHT",
    shortDesc:
      "특수 파장의 광에너지를 조사하여 세포 활성화와 진피 치유를 촉진하고 피부 재생 및 시술 후 회복을 단축시키는 장비입니다.",
    imgId: "healingbright",
  },
  {
    id: "11",
    name: "메조스킨",
    nameEn: "MESOSKIN",
    shortDesc:
      "특허 받은 마이크로 침으로 피부 표면에 채널을 열어 영양 성분을 심층 침투시키고 콜라겐 생성을 자극하는 최소 침습 장비입니다.",
    imgId: "mesoskin",
  },
  {
    id: "12",
    name: "울트라듀오",
    nameEn: "ULTRADUO",
    shortDesc:
      "강한 자극 없이 세포 단위의 콜라겐 활성과 히알루론산 합성을 자연스럽게 유도하여 수분과 탄력을 동시에 개선하는 장비입니다.",
    imgId: "ultraduo",
  },
  {
    id: "13",
    name: "트리플물광젯",
    nameEn: "SUPERSONIC TECHNOLOGY",
    shortDesc:
      "초미세 솔루션 물방울을 피부 속 깊숙이 전달하여 콜라겐 형성을 돕고 수분을 집중 공급하는 무침 물광 관리 장비입니다.",
    imgId: "triplemultigel",
  },
  {
    id: "14",
    name: "LDM",
    nameEn: "LDM",
    shortDesc:
      "국소 동적 마이크로마사지 방식의 초음파로 피부 수분 보유력을 강화하고 피부 톤을 개선하며 염증성 피부 케어에 적합한 장비입니다.",
    imgId: "ldm",
  },
  {
    id: "15",
    name: "일루미",
    nameEn: "ILUMI-ST",
    shortDesc:
      "레이저 시술 후 착색각화 현상을 완화하고 세포 재생을 광범위하게 촉진하여 색소 침착을 예방하고 피부를 안정화하는 장비입니다.",
    imgId: "ilumi",
  },
  {
    id: "16",
    name: "트랜스킨",
    nameEn: "TRANS SKIN",
    shortDesc:
      "콜라겐 성분을 피부 조직 깊숙이 침투시켜 피부 손상 회복과 항노화 탄력 강화, 건조·손상 피부 집중 케어를 제공하는 장비입니다.",
    imgId: "transkin",
  },
];

// ── 개별 카드 컴포넌트 ──────────────────────────────────────────────────────
function DeviceCard({ device }: { device: Device }) {
  const imgUrl = deviceImages[device.imgId] ?? `${CDN}/${device.imgId}.png`;

  return (
    <div
      className="bg-white rounded-lg overflow-hidden flex flex-col text-left flex-shrink-0 h-full"
      style={{
        boxShadow: "0 1px 6px rgba(209,171,103,0.10)",
      }}
    >
      {/* 상단 금선 */}
      <div className="h-1 w-full" style={{ background: "#d1ab67" }} />

      {/* 이미지 + 타이틀 가로 레이아웃 */}
      <div className="flex gap-3 px-4 py-3">
        {/* 원형 아이콘 */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ background: "#f5f0e8", border: "2px solid #d1ab67" }}
        >
          <img
            src={imgUrl}
            alt={device.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 타이틀 + 영문명 */}
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-bold leading-tight" style={{ color: "#1A2B4A" }}>
            {device.name}
          </h3>
          <span
            className="tracking-wide uppercase mt-1 text-xs"
            style={{ color: "#d1ab67", fontWeight: 100, fontSize: "10px" }}
          >
            {device.nameEn}
          </span>
        </div>
      </div>

      {/* 설명 텍스트 (왼쪽 정렬) */}
      <div className="px-4 pb-3">
        <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#6B7280", textAlign: "left" }}>
          {device.shortDesc}
        </p>
      </div>
    </div>
  );
}

// ── 섹션 컴포넌트 ──────────────────────────────────────────────────────────
export default function ManagementDevicesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ── 스크롤 상태 확인 ──
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // ── 스크롤 함수 ──
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 200 : 320;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  // ── 터치 스와이프 ──
  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      scroll(diff > 0 ? "right" : "left");
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="container">
        {/* 제목 */}
        <div className="text-center mb-8 sm:mb-12">
          <p
            className="text-xs sm:text-sm tracking-widest uppercase mb-2"
            style={{ color: "#d1ab67" }}
          >
            MANAGEMENT DEVICES
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3" style={{ color: "#1A2B4A" }}>
            피부의 빛을 깨우는 스킨케어
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "#d1ab67" }}>
            보이지 않는 피부 속 깊은 층까지 설세하고 정교하게 케어합니다.
          </p>
        </div>

        {/* 캐러셀 컨테이너 */}
        <div className="relative">
          {/* 스크롤 컨테이너 */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex gap-4 overflow-x-auto scroll-smooth px-3 sm:px-4"
            style={{
              scrollBehavior: "smooth",
              scrollSnapType: "x mandatory",
              width: "100%",
            }}
          >
            {/* 모든 장비를 1줄로 표시 */}
            {devices.map((device, index) => (
              <div key={`device-${index}`} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4" style={{ marginRight: "12px" }}>
                <DeviceCard device={device} />
              </div>
            ))}
          </div>

          {/* 이전 버튼 */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 sm:-translate-x-12 md:-translate-x-16 z-10 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="이전"
            >
              <ChevronLeft className="size-20 sm:w-6 sm:h-6" style={{ color: "#d1ab67" }} />
            </button>
          )}

          {/* 다음 버튼 */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 sm:translate-x-12 md:translate-x-16 z-10 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="다음"
            >
              <ChevronRight className="size-20 sm:w-6 sm:h-6" style={{ color: "#d1ab67" }} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

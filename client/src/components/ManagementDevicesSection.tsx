/**
 * ManagementDevicesSection - 스타피부과 관리장비 섹션 (순수 캐러셀)
 * 가로 1줄로 옆으로 흘러가는 캐러셀
 * 이전/다음 버튼 + 터치 스와이프 지원
 * 클릭 기능 없음 - 순수 정보 표시
 */
import { useLang } from "@/contexts/LangContext";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";

// 장비별 직접 URL 매핑
const deviceImages: Record<string, string> = {
  sonopeel: `${CDN}/sonopeel_53d2c9d1.jpg`,
  porederm: `${CDN}/porederm_new_896695b4.jpg`,
  airbubble: `${CDN}/airbubble_9631da26.jpg`,
  oxyet: `${CDN}/oxyet_a81daa05.jpg`,
  inbio: `${CDN}/inbio_new_f3628f96.jpg`,
  flawless: `${CDN}/flawless_48eb550e.jpg`,
  dermalight: `${CDN}/dermalight_new_0effb3eb.jpg`,
  fray: `${CDN}/fray_66504ffe.jpg`,
  ionzyme: `${CDN}/ionzyme_ec731187.png`,
  healingbright: `${CDN}/healingbright_d060a2aa.jpg`,
  mesoskin: `${CDN}/mesoskin_new_32137830.jpg`,
  ultraduo: `${CDN}/ultraduo_af289409.jpg`,
  supersonic: `${CDN}/supersonic_5df47d2e.jpg`,
  ldm: `${CDN}/ldm_ac66d69e.jpg`,
  ilumi: `${CDN}/ilumi_new_3d286596.jpg`,
  transskin: `${CDN}/transskin_67357f56.jpg`,
};

interface Device {
  name: string;
  nameEn: string;
  shortDesc: string;
  imgId: string;
}

const devices: Device[] = [
  {
    name: "소노필",
    nameEn: "SONOPEEL",
    shortDesc: "초음파 진동에너지와 이온의 전기적 특성을 이용하여 피부 각질을 제거하고 영양 성분을 깊이 침투시키는 복합 관리 장비입니다.",
    imgId: "sonopeel",
  },
  {
    name: "포어덤",
    nameEn: "POREDERM",
    shortDesc: "전기 전공법을 이용하여 바늘 없이 고농도 비타민을 진피층 깊숙이 직접 투여하는 무침 약물 전달 장비입니다.",
    imgId: "porederm",
  },
  {
    name: "에어버블",
    nameEn: "Air Bubble Therapy",
    shortDesc: "순수 산소와 함께 활성 성분을 피부에 분사하여 노폐물을 제거하고 혈액순환을 개선하며 세포 재생력을 촉진하는 장비입니다.",
    imgId: "airbubble",
  },
  {
    name: "옥시젯",
    nameEn: "Oxyet-Liro",
    shortDesc: "바늘 없는 메조테라피 방식으로 산소와 활성 성분을 피부에 안전하고 효과적으로 침투시켜 수분과 광채를 개선하는 장비입니다.",
    imgId: "oxyet",
  },
  {
    name: "인바이오",
    nameEn: "InBio 880",
    shortDesc: "절개 없이 고주파를 인체에 직접 가하여 콜라겐 재생을 촉진하고 피부 탄력과 리프팅 효과를 극대화하는 비침습 관리 장비입니다.",
    imgId: "inbio",
  },
  {
    name: "플로리스",
    nameEn: "Flawless",
    shortDesc: "고압 침투 초음파를 이용하여 피부 처짐과 주름을 개선하는 비침습 리프팅 장비입니다.",
    imgId: "flawless",
  },
  {
    name: "광선조사기",
    nameEn: "DERMA LIGHT",
    shortDesc: "복합 광학 이중시스템으로 세포 분열을 활성화하고 피부 재생을 촉진하며 레이저 시술 후 회복을 보조하는 광선 조사 장비입니다.",
    imgId: "dermalight",
  },
  {
    name: "에프레이",
    nameEn: "F-RAY",
    shortDesc: "빛의 원리를 이용하여 얼굴 표면의 주름·모공 깊이를 3D로 정밀 분석하고 시술 전후 데이터를 제공하는 피부 진단 장비입니다.",
    imgId: "fray",
  },
  {
    name: "이온자임",
    nameEn: "IONZYME",
    shortDesc: "전기이온 영동법과 초음파를 동시에 이용해 고농도 비타민을 피부에 직접 침투시켜 미백과 항산화 효과를 제공하는 장비입니다.",
    imgId: "ionzyme",
  },
  {
    name: "힐링브라이트",
    nameEn: "Healing Bright",
    shortDesc: "특수 파장의 광에너지를 조사하여 세포 활성화와 진피 치유를 촉진하고 피부 재생 및 시술 후 회복을 단축시키는 장비입니다.",
    imgId: "healingbright",
  },
  {
    name: "메조스킨",
    nameEn: "MesoSkin",
    shortDesc: "특허 받은 마이크로 침으로 피부 표면에 채널을 열어 영양 성분을 심층 침투시키고 콜라겐 생성을 자극하는 최소 침습 장비입니다.",
    imgId: "mesoskin",
  },
  {
    name: "울트라듀오",
    nameEn: "UltraDuo",
    shortDesc: "강한 자극 없이 세포 단위의 콜라겐 활성과 히알루론산 합성을 자연스럽게 유도하여 수분과 탄력을 동시에 개선하는 장비입니다.",
    imgId: "ultraduo",
  },
  {
    name: "트리플물광젯",
    nameEn: "Supersonic Technology",
    shortDesc: "초미세 솔루션 물방울을 피부 속 깊숙이 전달하여 콜라겐 형성을 돕고 수분을 집중 공급하는 무침 물광 관리 장비입니다.",
    imgId: "supersonic",
  },
  {
    name: "LDM",
    nameEn: "LDM",
    shortDesc: "국소 동적 마이크로마사지 방식의 초음파로 피부 수분 보유력을 강화하고 피부 톤을 개선하며 염증성 피부 케어에 적합한 장비입니다.",
    imgId: "ldm",
  },
  {
    name: "일루미",
    nameEn: "Ilumi-ST",
    shortDesc: "레이저 시술 후 착색각화 현상을 완화하고 세포 재생을 광범위하게 촉진하여 색소 침착을 예방하고 피부를 안정화하는 장비입니다.",
    imgId: "ilumi",
  },
  {
    name: "트랜스킨",
    nameEn: "Trans Skin",
    shortDesc: "콜라겐 성분을 피부 조직 깊숙이 침투시켜 피부 손상 회복과 항노화 탄력 강화, 건조·손상 피부 집중 케어를 제공하는 장비입니다.",
    imgId: "transskin",
  },
];

// 언어별 섹션 헤더 설명 텍스트
const managementDescriptions: Record<string, string> = {
  ko: "최신 관리장비를 통해 피부 깊은 곳부터 체계적으로 케어합니다.",
  en: "We provide systematic skin care from deep within using the latest management devices.",
  ja: "最新のケア機器を使用して、肌の深部から体系的にケアします。",
  zh: "通过最新护理设备，从皮肤深层进行系统性护理。",
};

// ── 개별 카드 컴포넌트 ──────────────────────────────────────────────────────
function DeviceCard({ device }: { device: Device }) {
  const imgUrl = deviceImages[device.imgId] ?? `${CDN}/${device.imgId}.png`;

  return (
    <div
      className="bg-white rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 text-left border border-transparent hover:border-yellow-300 flex-shrink-0"
      style={{ boxShadow: "0 1px 6px rgba(209,171,103,0.10)", width: "calc(25% - 12px)" }}
    >
      {/* 상단 골드 라인 */}
      <div className="h-1 w-full" style={{ background: "#d1ab67" }} />

      {/* 이미지 */}
      <div
        className="w-full h-24 overflow-hidden flex items-center justify-center"
        style={{ background: "#f5f0e8" }}
      >
        <img
          src={imgUrl}
          alt={device.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 장비명 + 영문명 + 설명 */}
      <div className="px-3 py-2 flex flex-col flex-1">
        <h3 className="text-xs font-bold leading-tight" style={{ color: "#1A2B4A" }}>
          {device.name}
        </h3>
        <span
          className="tracking-wide uppercase mt-0.5 text-xs"
          style={{ color: "#d1ab67", fontWeight: 100, fontSize: "10px" }}
        >
          {device.nameEn}
        </span>
        <p className="text-xs leading-relaxed mt-1 flex-1" style={{ color: "#6B7280" }}>
          {device.shortDesc}
        </p>
      </div>
    </div>
  );
}

// ── 섹션 컴포넌트 ─────────────────────────────────────────────────────────────
export default function ManagementDevicesSection() {
  const { t, lang } = useLang();
  const desc = managementDescriptions[lang] ?? managementDescriptions.ko;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      // 모바일에서는 작은 스크롤 양, 데스크톱에서는 큰 스크롤 양
      const isMobile = window.innerWidth < 640;
      const scrollAmount = isMobile ? 200 : 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 600);
    }
  };

  // 터치 스와이프 지원
  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) scroll("right");
    if (touchEnd - touchStart > 50) scroll("left");
  };

  return (
    <section id="management-devices" className="py-12 sm:py-16 md:py-20" style={{ background: "#faf7f0" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-6 sm:mb-10 md:mb-12">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-2 sm:mb-3"
            style={{ color: "#d1ab67", fontWeight: 300 }}
          >
            Management Devices
          </p>
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
            style={{ color: "#1A2B4A" }}
          >
            피부의 빛을 깨우는 스킨케어
          </h2>
          <p className="max-w-xl mx-auto leading-relaxed text-sm sm:text-base" style={{ color: "#d1ab67" }}>
            <span className="sm:hidden">보이지 않는 피부 속 깊은 층까지<br />섬세하고 정교하게 케어합니다.</span><span className="hidden sm:inline">보이지 않는 피부 속 깊은 층까지 섬세하고 정교하게 케어합니다.</span>
          </p>
        </div>

        {/* 캐러셀 컨테이너 */}
        <div className="relative">
          {/* 스크롤 컨테이너 - 1줄 캐러셀 */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex overflow-x-auto gap-3 sm:gap-4 pb-3 sm:pb-4 scroll-smooth"
            style={{ scrollBehavior: "smooth", scrollSnapType: "x mandatory" }}
          >
            {/* 모든 장비를 1줄로 표시 */}
            {devices.map((device, index) => (
              <div key={`device-${index}`} className="flex-shrink-0" style={{ width: "calc(50% - 6px) sm:calc(33.333% - 9px) md:calc(25% - 12px)" }}>
                <DeviceCard device={device} />
              </div>
            ))}
          </div>

          {/* 이전 버튼 */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 sm:-translate-x-12 md:-translate-x-16 p-1.5 sm:p-2 rounded-full transition hover:bg-gray-200"
              style={{ color: "#d1ab67" }}
              aria-label="이전"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
          )}

          {/* 다음 버튼 */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 sm:translate-x-12 md:translate-x-16 p-1.5 sm:p-2 rounded-full transition hover:bg-gray-200"
              style={{ color: "#d1ab67" }}
              aria-label="다음"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

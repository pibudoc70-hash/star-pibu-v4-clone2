/**
 * ManagementDevicesSection - 스타피부과 관리장비 섹션 (리디자인)
 * PC: 3열 그리드, 모바일: 2열 그리드
 * 카드: 아이콘 + 장비명 + 한줄 설명
 * 클릭 시 모달에서 상세 설명 표시
 */
import { useLang } from "@/contexts/LangContext";
import { useState } from "react";
import { X } from "lucide-react";

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
  fullDesc: string;
  imgId: string;
}

const devices: Device[] = [
  {
    name: "소노필",
    nameEn: "SONOPEEL",
    shortDesc: "피부 각질 제거 및 영양 침투",
    fullDesc: "초음파 진동에너지와 이온의 전기적 특성을 이용하여 피부 각질을 제거하고 영양 성분을 깊이 침투시키는 복합 관리 장비입니다.",
    imgId: "sonopeel",
  },
  {
    name: "포어덤",
    nameEn: "POREDERM",
    shortDesc: "무침 약물 전달 장비",
    fullDesc: "전기 전공법을 이용하여 바늘 없이 고농도 비타민을 진피층 깊숙이 직접 투여하는 무침 약물 전달 장비입니다.",
    imgId: "porederm",
  },
  {
    name: "에어버블",
    nameEn: "Air Bubble Therapy",
    shortDesc: "산소 분사로 노폐물 제거",
    fullDesc: "순수 산소와 함께 활성 성분을 피부에 분사하여 노폐물을 제거하고 혈액순환을 개선하며 세포 재생력을 촉진하는 장비입니다.",
    imgId: "airbubble",
  },
  {
    name: "옥시젯",
    nameEn: "Oxyet-Liro",
    shortDesc: "산소 메조테라피",
    fullDesc: "바늘 없는 메조테라피 방식으로 산소와 활성 성분을 피부에 안전하고 효과적으로 침투시켜 수분과 광채를 개선하는 장비입니다.",
    imgId: "oxyet",
  },
  {
    name: "인바이오",
    nameEn: "InBio 880",
    shortDesc: "고주파 콜라겐 재생",
    fullDesc: "절개 없이 고주파를 인체에 직접 가하여 콜라겐 재생을 촉진하고 피부 탄력과 리프팅 효과를 극대화하는 비침습 관리 장비입니다.",
    imgId: "inbio",
  },
  {
    name: "플로리스",
    nameEn: "Flawless",
    shortDesc: "초음파 리프팅",
    fullDesc: "고압 침투 초음파를 이용하여 피부 처짐과 주름을 개선하는 비침습 리프팅 장비입니다.",
    imgId: "flawless",
  },
  {
    name: "광선조사기",
    nameEn: "DERMA LIGHT",
    shortDesc: "세포 활성화 및 회복 보조",
    fullDesc: "복합 광학 이중시스템으로 세포 분열을 활성화하고 피부 재생을 촉진하며 레이저 시술 후 회복을 보조하는 광선 조사 장비입니다.",
    imgId: "dermalight",
  },
  {
    name: "에프레이",
    nameEn: "F-RAY",
    shortDesc: "3D 피부 진단 분석",
    fullDesc: "빛의 원리를 이용하여 얼굴 표면의 주름·모공 깊이를 3D로 정밀 분석하고 시술 전후 데이터를 제공하는 피부 진단 장비입니다.",
    imgId: "fray",
  },
  {
    name: "이온자임",
    nameEn: "IONZYME",
    shortDesc: "미백 및 항산화 효과",
    fullDesc: "전기이온 영동법과 초음파를 동시에 이용해 고농도 비타민을 피부에 직접 침투시켜 미백과 항산화 효과를 제공하는 장비입니다.",
    imgId: "ionzyme",
  },
  {
    name: "힐링브라이트",
    nameEn: "Healing Bright",
    shortDesc: "광에너지 재생 촉진",
    fullDesc: "특수 파장의 광에너지를 조사하여 세포 활성화와 진피 치유를 촉진하고 피부 재생 및 시술 후 회복을 단축시키는 장비입니다.",
    imgId: "healingbright",
  },
  {
    name: "메조스킨",
    nameEn: "MesoSkin",
    shortDesc: "마이크로 침 영양 침투",
    fullDesc: "특허 받은 마이크로 침으로 피부 표면에 채널을 열어 영양 성분을 심층 침투시키고 콜라겐 생성을 자극하는 최소 침습 장비입니다.",
    imgId: "mesoskin",
  },
  {
    name: "울트라듀오",
    nameEn: "UltraDuo",
    shortDesc: "수분 및 탄력 개선",
    fullDesc: "강한 자극 없이 세포 단위의 콜라겐 활성과 히알루론산 합성을 자연스럽게 유도하여 수분과 탄력을 동시에 개선하는 장비입니다.",
    imgId: "ultraduo",
  },
  {
    name: "트리플물광젯",
    nameEn: "Supersonic Technology",
    shortDesc: "무침 물광 집중 공급",
    fullDesc: "초미세 솔루션 물방울을 피부 속 깊숙이 전달하여 콜라겐 형성을 돕고 수분을 집중 공급하는 무침 물광 관리 장비입니다.",
    imgId: "supersonic",
  },
  {
    name: "LDM",
    nameEn: "LDM",
    shortDesc: "초음파 마이크로마사지",
    fullDesc: "국소 동적 마이크로마사지 방식의 초음파로 피부 수분 보유력을 강화하고 피부 톤을 개선하며 염증성 피부 케어에 적합한 장비입니다.",
    imgId: "ldm",
  },
  {
    name: "일루미",
    nameEn: "Ilumi-ST",
    shortDesc: "색소 침착 예방 및 안정화",
    fullDesc: "레이저 시술 후 착색각화 현상을 완화하고 세포 재생을 광범위하게 촉진하여 색소 침착을 예방하고 피부를 안정화하는 장비입니다.",
    imgId: "ilumi",
  },
  {
    name: "트랜스킨",
    nameEn: "Trans Skin",
    shortDesc: "손상 피부 집중 케어",
    fullDesc: "콜라겐 성분을 피부 조직 깊숙이 침투시켜 피부 손상 회복과 항노화 탄력 강화, 건조·손상 피부 집중 케어를 제공하는 장비입니다.",
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
function DeviceCard({ device, onClick }: { device: Device; onClick: () => void }) {
  const imgUrl = deviceImages[device.imgId] ?? `${CDN}/${device.imgId}.png`;

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 text-left border border-transparent hover:border-yellow-300"
      style={{ boxShadow: "0 1px 6px rgba(209,171,103,0.10)" }}
    >
      {/* 상단 골드 라인 */}
      <div className="h-1 w-full" style={{ background: "#d1ab67" }} />

      {/* 이미지 */}
      <div
        className="w-full h-32 overflow-hidden flex items-center justify-center"
        style={{ background: "#f5f0e8" }}
      >
        <img
          src={imgUrl}
          alt={device.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 장비명 + 영문명 + 한줄 설명 */}
      <div className="px-3 py-3 flex flex-col flex-1">
        <h3 className="text-sm font-bold leading-tight" style={{ color: "#1A2B4A" }}>
          {device.name}
        </h3>
        <span
          className="tracking-wide uppercase mt-1 text-xs"
          style={{ color: "#d1ab67", fontWeight: 100 }}
        >
          {device.nameEn}
        </span>
        <p className="text-xs leading-relaxed mt-2 flex-1" style={{ color: "#6B7280" }}>
          {device.shortDesc}
        </p>
      </div>
    </button>
  );
}

// ── 모달 컴포넌트 ──────────────────────────────────────────────────────────────
function DeviceModal({ device, onClose }: { device: Device | null; onClose: () => void }) {
  if (!device) return null;

  const imgUrl = deviceImages[device.imgId] ?? `${CDN}/${device.imgId}.png`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold" style={{ color: "#1A2B4A" }}>
            {device.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} style={{ color: "#d1ab67" }} />
          </button>
        </div>

        {/* 이미지 */}
        <div
          className="w-full h-48 overflow-hidden flex items-center justify-center"
          style={{ background: "#f5f0e8" }}
        >
          <img
            src={imgUrl}
            alt={device.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 콘텐츠 */}
        <div className="p-4">
          <span
            className="tracking-wide uppercase text-xs"
            style={{ color: "#d1ab67", fontWeight: 100 }}
          >
            {device.nameEn}
          </span>
          <p className="text-sm leading-relaxed mt-3" style={{ color: "#6B7280" }}>
            {device.fullDesc}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 섹션 컴포넌트 ─────────────────────────────────────────────────────────────
export default function ManagementDevicesSection() {
  const { t, lang } = useLang();
  const md = t.managementDevices;
  const desc = managementDescriptions[lang] ?? managementDescriptions.ko;
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  return (
    <section id="management-devices" className="py-14 sm:py-20" style={{ background: "#faf7f0" }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-3"
            style={{ color: "#d1ab67", fontWeight: 300 }}
          >
            Management Devices
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "#1A2B4A" }}
          >
            피부의 빛을 깨우는 스킨케어
          </h2>
          <p className="max-w-xl mx-auto leading-relaxed" style={{ color: "#d1ab67", fontSize: "18px" }}>
            <span className="sm:hidden">보이지 않는 피부 속 깊은 층까지<br />섬세하고 정교하게 케어합니다.</span><span className="hidden sm:inline">보이지 않는 피부 속 깊은 층까지 섬세하고 정교하게 케어합니다.</span>
          </p>
        </div>

        {/* 장비 그리드 - PC: 3열, 모바일: 2열 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {devices.map((device, idx) => (
            <DeviceCard
              key={idx}
              device={device}
              onClick={() => setSelectedDevice(device)}
            />
          ))}
        </div>
      </div>

      {/* 모달 */}
      <DeviceModal
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </section>
  );
}

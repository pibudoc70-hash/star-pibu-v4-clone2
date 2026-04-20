/**
 * ManagementDevicesSection - 스타피부과 관리장비 섹션
 * 16개 관리장비를 카드 그리드로 표시 (좌측 동그라미 이미지 포함)
 * 다국어: 섹션 헤더는 useLang(), 장비 데이터는 한국어 고정 (nameEn 배지는 영문 유지)
 */
import { useLang } from "@/contexts/LangContext";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";

// 장비별 직접 URL 매핑 (파일 확장자가 다양하여 직접 관리)
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
  desc: string;
  imgId: string;
}

const devices: Device[] = [
  {
    name: "소노필",
    nameEn: "SONOPEEL",
    desc: "초음파 진동에너지와 이온의 전기적 특성을 이용하여 피부 각질을 제거하고 영양 성분을 깊이 침투시키는 복합 관리 장비입니다.",
    imgId: "sonopeel",
  },
  {
    name: "포어덤",
    nameEn: "POREDERM",
    desc: "전기 전공법을 이용하여 바늘 없이 고농도 비타민을 진피층 깊숙이 직접 투여하는 무침 약물 전달 장비입니다.",
    imgId: "porederm",
  },
  {
    name: "에어버블",
    nameEn: "Air Bubble Therapy",
    desc: "순수 산소와 함께 활성 성분을 피부에 분사하여 노폐물을 제거하고 혈액순환을 개선하며 세포 재생력을 촉진하는 장비입니다.",
    imgId: "airbubble",
  },
  {
    name: "옥시젯",
    nameEn: "Oxyet-Liro",
    desc: "바늘 없는 메조테라피 방식으로 산소와 활성 성분을 피부에 안전하고 효과적으로 침투시켜 수분과 광채를 개선하는 장비입니다.",
    imgId: "oxyet",
  },
  {
    name: "인바이오",
    nameEn: "InBio 880",
    desc: "절개 없이 고주파를 인체에 직접 가하여 콜라겐 재생을 촉진하고 피부 탄력과 리프팅 효과를 극대화하는 비침습 관리 장비입니다.",
    imgId: "inbio",
  },
  {
    name: "플로리스",
    nameEn: "Flawless",
    desc: "고압 침투 초음파를 이용하여 피부 처짐과 주름을 개선하는 비침습 리프팅 장비입니다.",
    imgId: "flawless",
  },
  {
    name: "광선조사기",
    nameEn: "DERMA LIGHT",
    desc: "복합 광학 이중시스템으로 세포 분열을 활성화하고 피부 재생을 촉진하며 레이저 시술 후 회복을 보조하는 광선 조사 장비입니다.",
    imgId: "dermalight",
  },
  {
    name: "에프레이",
    nameEn: "F-RAY",
    desc: "빛의 원리를 이용하여 얼굴 표면의 주름·모공 깊이를 3D로 정밀 분석하고 시술 전후 데이터를 제공하는 피부 진단 장비입니다.",
    imgId: "fray",
  },
  {
    name: "이온자임",
    nameEn: "IONZYME",
    desc: "전기이온 영동법과 초음파를 동시에 이용해 고농도 비타민을 피부에 직접 침투시켜 미백과 항산화 효과를 제공하는 장비입니다.",
    imgId: "ionzyme",
  },
  {
    name: "힐링브라이트",
    nameEn: "Healing Bright",
    desc: "특수 파장의 광에너지를 조사하여 세포 활성화와 진피 치유를 촉진하고 피부 재생 및 시술 후 회복을 단축시키는 장비입니다.",
    imgId: "healingbright",
  },
  {
    name: "메조스킨",
    nameEn: "MesoSkin",
    desc: "특허 받은 마이크로 침으로 피부 표면에 채널을 열어 영양 성분을 심층 침투시키고 콜라겐 생성을 자극하는 최소 침습 장비입니다.",
    imgId: "mesoskin",
  },
  {
    name: "울트라듀오",
    nameEn: "UltraDuo",
    desc: "강한 자극 없이 세포 단위의 콜라겐 활성과 히알루론산 합성을 자연스럽게 유도하여 수분과 탄력을 동시에 개선하는 장비입니다.",
    imgId: "ultraduo",
  },
  {
    name: "트리플물광젯",
    nameEn: "Supersonic Technology",
    desc: "초미세 솔루션 물방울을 피부 속 깊숙이 전달하여 콜라겐 형성을 돕고 수분을 집중 공급하는 무침 물광 관리 장비입니다.",
    imgId: "supersonic",
  },
  {
    name: "LDM",
    nameEn: "LDM",
    desc: "국소 동적 마이크로마사지 방식의 초음파로 피부 수분 보유력을 강화하고 피부 톤을 개선하며 염증성 피부 케어에 적합한 장비입니다.",
    imgId: "ldm",
  },
  {
    name: "일루미",
    nameEn: "Ilumi-ST",
    desc: "레이저 시술 후 착색각화 현상을 완화하고 세포 재생을 광범위하게 촉진하여 색소 침착을 예방하고 피부를 안정화하는 장비입니다.",
    imgId: "ilumi",
  },
  {
    name: "트랜스킨",
    nameEn: "Trans Skin",
    desc: "콜라겐 성분을 피부 조직 깊숙이 침투시켜 피부 손상 회복과 항노화 탄력 강화, 건조·손상 피부 집중 케어를 제공하는 장비입니다.",
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
      className="bg-white rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 6px rgba(209,171,103,0.10)" }}
    >
      {/* 상단 골드 라인 */}
      <div className="h-0.5 w-full" style={{ background: "#d1ab67" }} />

      {/* 이미지 + 장비명/영문명 */}
      <div className="px-3 pt-3 pb-2 flex items-center gap-3">
        {/* 동그라미 이미지 */}
        <div
          className="flex-shrink-0 rounded-full overflow-hidden"
          style={{
            width: 52,
            height: 52,
            background: "#f5f0e8",
            border: "2px solid #e8dfc8",
          }}
        >
          <img
            src={imgUrl}
            alt={device.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 장비명 + 영문명 */}
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-bold leading-tight" style={{ color: "#1A2B4A" }}>
            {device.name}
          </h3>
          <span
            className="tracking-wide uppercase mt-0.5"
            style={{ color: "#d1ab67", fontSize: "10px", fontWeight: 100 }}
          >
            {device.nameEn}
          </span>
        </div>
      </div>

      {/* 설명 */}
      <div className="px-3 pb-3 flex-1">
        <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
          {device.desc}
        </p>
      </div>
    </div>
  );
}

// ── 섹션 컴포넌트 ─────────────────────────────────────────────────────────────
export default function ManagementDevicesSection() {
  const { t, lang } = useLang();
  const md = t.managementDevices;
  const desc = managementDescriptions[lang] ?? managementDescriptions.ko;

  return (
    <section id="management-devices" className="py-14 sm:py-20" style={{ background: "#faf7f0" }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-14">
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

        {/* 장비 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {devices.map((device, idx) => (
            <DeviceCard key={idx} device={device} />
          ))}
        </div>
      </div>
    </section>
  );
}

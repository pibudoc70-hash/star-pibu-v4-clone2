import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";

// ── 장비 데이터 타입 ──────────────────────────────────────────────────────────
interface Device {
  id: string;
  name: string;
  nameEn: string;
  nameJa: string;
  nameZh: string;
  shortDesc: string;
  shortDescEn: string;
  shortDescJa: string;
  shortDescZh: string;
  imgId: string;
}

// ── CDN 경로 ──────────────────────────────────────────────────────────────────
const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";

// ── 장비 이미지 맵 (완전한 URL) ────────────────────────────────────────────────
const deviceImages: Record<string, string> = {
  sonopeel: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sonopeel_53d2c9d1.jpg",
  porederm: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/porederm_new_896695b4.jpg",
  airbubble: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/airbubble_9631da26.jpg",
  oxyjet: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/oxyet_a81daa05.jpg",
  inbio: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/inbio_new_f3628f96.jpg",
  flawless: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/flawless_48eb550e.jpg",
  dermalight: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/dermalight_new_0effb3eb.jpg",
  fray: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/fray_66504ffe.jpg",
  ionzyme: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/ionzyme_ec731187.png",
  healingbright: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/healingbright_d060a2aa.jpg",
  mesoskin: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/mesoskin_new_32137830.jpg",
  ultraduo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/ultraduo_af289409.jpg",
  triplemultigel: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/supersonic_5df47d2e.jpg",
  ldm: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/ldm_ac66d69e.jpg",
  ilumi: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/ilumi_new_3d286596.jpg",
  transkin: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/transskin_67357f56.jpg",
};

// ── 장비 데이터 (4개 언어 완전 번역) ─────────────────────────────────────────
const devices: Device[] = [
  {
    id: "1",
    name: "소노필",
    nameEn: "SONOPEEL",
    nameJa: "ソノピール",
    nameZh: "超声波去角质",
    shortDesc: "초음파 진동에너지와 이온의 전기적 특성을 이용하여 피부 각질을 제거하고 영양 성분을 깊이 침투시키는 복합 관리 장비입니다.",
    shortDescEn: "A multi-functional device that uses ultrasonic vibration energy and ionic electrical properties to exfoliate skin and deeply penetrate active ingredients.",
    shortDescJa: "超音波振動エネルギーとイオンの電気的特性を利用して皮膚の角質を除去し、栄養成分を深く浸透させる複合ケア機器です。",
    shortDescZh: "利用超声波振动能量和离子电特性去除皮肤角质，并将营养成分深度渗透的复合护理设备。",
    imgId: "sonopeel",
  },
  {
    id: "2",
    name: "포어덤",
    nameEn: "POREDERM",
    nameJa: "ポアダーム",
    nameZh: "无针导入仪",
    shortDesc: "전기 전공법을 이용하여 바늘 없이 고농도 비타민을 진피층 깊숙이 직접 투여하는 무침 약물 전달 장비입니다.",
    shortDescEn: "A needle-free drug delivery device that uses electroporation to directly deliver high-concentration vitamins deep into the dermis without needles.",
    shortDescJa: "電気穿孔法を利用して針なしで高濃度ビタミンを真皮層の奥深くに直接投与する無針薬物送達機器です。",
    shortDescZh: "利用电穿孔技术，无需针头直接将高浓度维生素输送至真皮深层的无针药物传递设备。",
    imgId: "porederm",
  },
  {
    id: "3",
    name: "에어버블",
    nameEn: "AIR BUBBLE THERAPY",
    nameJa: "エアバブルセラピー",
    nameZh: "气泡氧疗",
    shortDesc: "순수 산소와 함께 활성 성분을 피부에 분사하여 노폐물을 제거하고 혈액순환을 개선하며 세포 재생력을 촉진하는 장비입니다.",
    shortDescEn: "A device that sprays active ingredients along with pure oxygen onto the skin to remove waste, improve blood circulation, and promote cell regeneration.",
    shortDescJa: "純酸素と共に活性成分を皮膚に噴射し、老廃物を除去して血液循環を改善し、細胞再生力を促進する機器です。",
    shortDescZh: "将活性成分与纯氧一起喷射到皮肤上，去除废物、改善血液循环并促进细胞再生的设备。",
    imgId: "airbubble",
  },
  {
    id: "4",
    name: "옥시젯",
    nameEn: "OXYET-LIRO",
    nameJa: "オキシジェット",
    nameZh: "氧气水光注射",
    shortDesc: "바늘 없는 메조테라피 방식으로 산소와 활성 성분을 피부에 안전하고 효과적으로 침투시켜 수분과 광채를 개선하는 장비입니다.",
    shortDescEn: "A needle-free mesotherapy device that safely and effectively penetrates oxygen and active ingredients into the skin to improve moisture and radiance.",
    shortDescJa: "針なしのメソセラピー方式で酸素と活性成分を皮膚に安全かつ効果的に浸透させ、水分と輝きを改善する機器です。",
    shortDescZh: "采用无针中胚层疗法，将氧气和活性成分安全有效地渗透到皮肤中，改善水分和光泽的设备。",
    imgId: "oxyjet",
  },
  {
    id: "5",
    name: "인바이오",
    nameEn: "INBIO 880",
    nameJa: "インバイオ880",
    nameZh: "高频射频仪",
    shortDesc: "절개 없이 고주파를 인체에 직접 가하여 콜라겐 재생을 촉진하고 피부 탄력과 리프팅 효과를 극대화하는 비침습 관리 장비입니다.",
    shortDescEn: "A non-invasive device that applies high-frequency energy directly to the body without incisions to stimulate collagen regeneration and maximize skin elasticity and lifting effects.",
    shortDescJa: "切開なしで高周波を人体に直接加えてコラーゲン再生を促進し、皮膚の弾力とリフティング効果を最大化する非侵襲ケア機器です。",
    shortDescZh: "无需切开，直接对人体施加高频能量，促进胶原蛋白再生，最大化皮肤弹力和提升效果的非侵入性护理设备。",
    imgId: "inbio",
  },
  {
    id: "6",
    name: "플로리스",
    nameEn: "FLAWLESS",
    nameJa: "フローリス",
    nameZh: "高压超声提升仪",
    shortDesc: "고압 침투 초음파를 이용하여 피부 처짐과 주름을 개선하는 비침습 리프팅 장비입니다.",
    shortDescEn: "A non-invasive lifting device that uses high-pressure penetrating ultrasound to improve skin sagging and wrinkles.",
    shortDescJa: "高圧浸透超音波を利用して皮膚のたるみとしわを改善する非侵襲リフティング機器です。",
    shortDescZh: "利用高压穿透超声波改善皮肤松弛和皱纹的非侵入性提升设备。",
    imgId: "flawless",
  },
  {
    id: "7",
    name: "광선조사기",
    nameEn: "DERMA LIGHT",
    nameJa: "光線照射器",
    nameZh: "光疗照射仪",
    shortDesc: "복합 광학 이중시스템으로 세포 분열을 활성화하고 피부 재생을 촉진하며 레이저 시술 후 회복을 보조하는 광선 조사 장비입니다.",
    shortDescEn: "A light irradiation device with a dual optical system that activates cell division, promotes skin regeneration, and supports recovery after laser treatments.",
    shortDescJa: "複合光学二重システムで細胞分裂を活性化し、皮膚再生を促進し、レーザー施術後の回復を補助する光線照射機器です。",
    shortDescZh: "采用复合光学双系统，激活细胞分裂、促进皮肤再生并辅助激光治疗后恢复的光线照射设备。",
    imgId: "dermalight",
  },
  {
    id: "8",
    name: "에프레이",
    nameEn: "F-RAY",
    nameJa: "エフレイ",
    nameZh: "皮肤3D诊断仪",
    shortDesc: "빛의 원리를 이용하여 얼굴 표면의 주름·모공 깊이를 3D로 정밀 분석하고 시술 전후 데이터를 제공하는 피부 진단 장비입니다.",
    shortDescEn: "A skin diagnostic device that uses light principles to precisely analyze wrinkle and pore depth on the face in 3D and provides before/after treatment data.",
    shortDescJa: "光の原理を利用して顔面のしわ・毛穴の深さを3Dで精密分析し、施術前後のデータを提供する皮膚診断機器です。",
    shortDescZh: "利用光学原理对面部皱纹和毛孔深度进行3D精密分析，并提供治疗前后数据的皮肤诊断设备。",
    imgId: "fray",
  },
  {
    id: "9",
    name: "이온자임",
    nameEn: "IONZYME",
    nameJa: "イオンザイム",
    nameZh: "离子导入仪",
    shortDesc: "전기이온 영동법과 초음파를 동시에 이용해 고농도 비타민을 피부에 직접 침투시켜 미백과 항산화 효과를 제공하는 장비입니다.",
    shortDescEn: "A device that uses electro-ionic iontophoresis and ultrasound simultaneously to directly penetrate high-concentration vitamins into the skin for whitening and antioxidant effects.",
    shortDescJa: "電気イオン泳動法と超音波を同時に利用して高濃度ビタミンを皮膚に直接浸透させ、美白と抗酸化効果を提供する機器です。",
    shortDescZh: "同时利用电离子导入法和超声波，将高浓度维生素直接渗透到皮肤中，提供美白和抗氧化效果的设备。",
    imgId: "ionzyme",
  },
  {
    id: "10",
    name: "힐링브라이트",
    nameEn: "HEALING BRIGHT",
    nameJa: "ヒーリングブライト",
    nameZh: "光疗修复仪",
    shortDesc: "특수 파장의 광에너지를 조사하여 세포 활성화와 진피 치유를 촉진하고 피부 재생 및 시술 후 회복을 단축시키는 장비입니다.",
    shortDescEn: "A device that irradiates special wavelength light energy to promote cell activation and dermal healing, shortening skin regeneration and post-treatment recovery.",
    shortDescJa: "特殊波長の光エネルギーを照射して細胞活性化と真皮治癒を促進し、皮膚再生および施術後の回復を短縮する機器です。",
    shortDescZh: "照射特殊波长光能，促进细胞活化和真皮愈合，缩短皮肤再生和治疗后恢复时间的设备。",
    imgId: "healingbright",
  },
  {
    id: "11",
    name: "메조스킨",
    nameEn: "MESOSKIN",
    nameJa: "メゾスキン",
    nameZh: "微针导入仪",
    shortDesc: "특허 받은 마이크로 침으로 피부 표면에 채널을 열어 영양 성분을 심층 침투시키고 콜라겐 생성을 자극하는 최소 침습 장비입니다.",
    shortDescEn: "A minimally invasive device that uses patented micro-needles to open channels on the skin surface, deeply penetrate active ingredients, and stimulate collagen production.",
    shortDescJa: "特許取得のマイクロ針で皮膚表面にチャンネルを開き、栄養成分を深層浸透させてコラーゲン生成を刺激する最小侵襲機器です。",
    shortDescZh: "使用专利微针在皮肤表面开通通道，深层渗透营养成分并刺激胶原蛋白生成的微创设备。",
    imgId: "mesoskin",
  },
  {
    id: "12",
    name: "울트라듀오",
    nameEn: "ULTRADUO",
    nameJa: "ウルトラデュオ",
    nameZh: "超声双频仪",
    shortDesc: "강한 자극 없이 세포 단위의 콜라겐 활성과 히알루론산 합성을 자연스럽게 유도하여 수분과 탄력을 동시에 개선하는 장비입니다.",
    shortDescEn: "A device that naturally induces cellular collagen activation and hyaluronic acid synthesis without strong stimulation, simultaneously improving moisture and elasticity.",
    shortDescJa: "強い刺激なしに細胞単位のコラーゲン活性とヒアルロン酸合成を自然に誘導し、水分と弾力を同時に改善する機器です。",
    shortDescZh: "无需强烈刺激，自然诱导细胞级胶原蛋白活化和透明质酸合成，同时改善水分和弹力的设备。",
    imgId: "ultraduo",
  },
  {
    id: "13",
    name: "트리플물광젯",
    nameEn: "SUPERSONIC TECHNOLOGY",
    nameJa: "トリプルウォータージェット",
    nameZh: "三重水光注射仪",
    shortDesc: "초미세 솔루션 물방울을 피부 속 깊숙이 전달하여 콜라겐 형성을 돕고 수분을 집중 공급하는 무침 물광 관리 장비입니다.",
    shortDescEn: "A needle-free hydro-glow device that delivers ultra-fine solution droplets deep into the skin to support collagen formation and intensively supply moisture.",
    shortDescJa: "超微細溶液の水滴を皮膚の奥深くに届けてコラーゲン形成を助け、水分を集中供給する無針水光ケア機器です。",
    shortDescZh: "将超微细溶液水滴深入输送至皮肤内部，帮助胶原蛋白形成并集中补充水分的无针水光护理设备。",
    imgId: "triplemultigel",
  },
  {
    id: "14",
    name: "LDM",
    nameEn: "LDM",
    nameJa: "LDM",
    nameZh: "LDM局部动态微按摩",
    shortDesc: "국소 동적 마이크로마사지 방식의 초음파로 피부 수분 보유력을 강화하고 피부 톤을 개선하며 염증성 피부 케어에 적합한 장비입니다.",
    shortDescEn: "An ultrasound device using local dynamic micro-massage to strengthen skin moisture retention, improve skin tone, and care for inflammatory skin conditions.",
    shortDescJa: "局所動的マイクロマッサージ方式の超音波で皮膚の水分保持力を強化し、肌のトーンを改善し、炎症性皮膚ケアに適した機器です。",
    shortDescZh: "采用局部动态微按摩方式的超声波，增强皮肤保湿能力、改善肤色，适合炎症性皮肤护理的设备。",
    imgId: "ldm",
  },
  {
    id: "15",
    name: "일루미",
    nameEn: "ILUMI-ST",
    nameJa: "イルミ",
    nameZh: "光子嫩肤仪",
    shortDesc: "레이저 시술 후 착색각화 현상을 완화하고 세포 재생을 광범위하게 촉진하여 색소 침착을 예방하고 피부를 안정화하는 장비입니다.",
    shortDescEn: "A device that alleviates post-laser pigmentation and keratinization, broadly promotes cell regeneration, prevents hyperpigmentation, and stabilizes the skin.",
    shortDescJa: "レーザー施術後の着色角化現象を緩和し、細胞再生を広範囲に促進して色素沈着を予防し、皮膚を安定化する機器です。",
    shortDescZh: "缓解激光治疗后的色素角化现象，广泛促进细胞再生，预防色素沉着并稳定皮肤的设备。",
    imgId: "ilumi",
  },
  {
    id: "16",
    name: "트랜스킨",
    nameEn: "TRANS SKIN",
    nameJa: "トランスキン",
    nameZh: "胶原蛋白导入仪",
    shortDesc: "콜라겐 성분을 피부 조직 깊숙이 침투시켜 피부 손상 회복과 항노화 탄력 강화, 건조·손상 피부 집중 케어를 제공하는 장비입니다.",
    shortDescEn: "A device that penetrates collagen components deep into skin tissue to restore skin damage, strengthen anti-aging elasticity, and provide intensive care for dry and damaged skin.",
    shortDescJa: "コラーゲン成分を皮膚組織の奥深くに浸透させて皮膚損傷の回復と抗老化弾力強化、乾燥・損傷皮膚の集中ケアを提供する機器です。",
    shortDescZh: "将胶原蛋白成分深度渗透至皮肤组织，修复皮肤损伤、强化抗衰老弹力，为干燥受损皮肤提供集中护理的设备。",
    imgId: "transkin",
  },
];

// ── 언어별 텍스트 선택 헬퍼 ──────────────────────────────────────────────────
// [MAINT-P1-1] getDeviceText → @/hooks/useLocalizedText 공유 hook으로 이동됨

// ── 개별 카드 컴포넌트 ──────────────────────────────────────────────────────────
function DeviceCard({ device }: { device: Device }) {
  const imgUrl = deviceImages[device.imgId] ?? `${CDN}/${device.imgId}.png`;
  const { getText } = useLocalizedText();
  const displayName = getText(device.name, device.nameEn, device.nameJa, device.nameZh);
  const displayDesc = getText(device.shortDesc, device.shortDescEn, device.shortDescJa, device.shortDescZh);

  return (
    <div
      className="rounded-lg overflow-hidden flex flex-col text-left flex-shrink-0 h-full"
      style={{
        background: "#F5F1ED",
        boxShadow: "none",
      }}
    >
      {/* 상단 금선 */}
      <div className="h-1 w-full" style={{ background: "#d1ab67" }} />

      {/* 이미지 + 타이틀 가로 레이아웃 */}
      <div className="flex gap-3 px-4 py-4 md:py-5">
        {/* 원형 아이콘 */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ background: "#f5f0e8", border: "2px solid #d1ab67" }}
        >
          <OptimizedImage
            src={imgUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            width={64}
            height={64}
          />
        </div>

        {/* 타이틀 + 영문명 */}
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-bold leading-tight" style={{ color: "#1A2B4A" }}>
            {displayName}
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
      <div className="px-4 pb-4 md:pb-5">
        <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#6B7280", textAlign: "left" }}>
          {displayDesc}
        </p>
      </div>
    </div>
  );
}

// ── 섹션 컴포넌트 ──────────────────────────────────────────────────────────────
export default function ManagementDevicesSection() {
  const { t, lang } = useLang();
  const md = t.managementDevices;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-20" style={{ background: "#FDFAF6" }}>
      <div className="container">
        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12">
          <p
            className="text-xs sm:text-sm tracking-widest uppercase mb-2"
            style={{ color: "#d1ab67", fontFamily: "Montserrat, sans-serif" }}
          >
            MANAGEMENT DEVICES
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3" style={{ color: "#1A2B4A" }}>
            {md.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "#d1ab67" }}>
            {md.sectionSubtitle}
          </p>
        </div>

        {/* 스크롤 컨테이너 */}
        <div className="relative">
          {/* 좌측 화살표 */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full shadow-md -translate-x-3"
              style={{ background: "white", border: "1px solid #e8dfc8", color: "#d1ab67" }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* 우측 화살표 */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full shadow-md translate-x-3"
              style={{ background: "white", border: "1px solid #e8dfc8", color: "#d1ab67" }}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 hide-scrollbar"
            style={{ scrollSnapType: "x mandatory" }}
            onScroll={updateScrollButtons}
          >
            <div
              className="grid gap-4"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${devices.length}, minmax(200px, 1fr))`,
                width: "max-content",
                minWidth: "100%",
              }}
            >
              {devices.map((device) => (
                <div
                  key={device.id}
                  style={{ scrollSnapAlign: "start", width: "200px" }}
                >
                  <DeviceCard device={device} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

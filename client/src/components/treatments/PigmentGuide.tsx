/**
 * PigmentGuide.tsx — 색소·문신 탭 전용 카테고리 소개 섹션
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Sun, Eraser, Target, ShieldCheck, Award } from "lucide-react";

type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

const HERO: ML = {
  ko: "색소·문신 제거\n맑고 균일한 피부톤으로",
  en: "Pigment & Tattoo Removal\nFor Clear, Even Skin Tone",
  ja: "色素・タトゥー除去\n明るく均一な肌トーンへ",
  zh: "色素·纹身去除\n打造清透均匀肤色",
};
const HERO_SUB: ML = {
  ko: "기미, 주근깨, 잡티, 문신 등 다양한 색소 문제를 피코초 레이저와 BBL 등 최신 장비로 효과적으로 치료합니다. 피부 타입에 맞는 맞춤 치료로 부작용 없이 맑은 피부를 되찾아 드립니다.",
  en: "Melasma, freckles, age spots, and tattoos are effectively treated with the latest devices including picosecond lasers and BBL. Personalized treatment for your skin type restores clear skin without side effects.",
  ja: "シミ、そばかす、くすみ、タトゥーなどさまざまな色素問題をピコ秒レーザーやBBLなどの最新機器で効果的に治療します。肌タイプに合わせたカスタム治療で副作用なく明るい肌を取り戻します。",
  zh: "黄褐斑、雀斑、色斑、纹身等各种色素问题，通过皮秒激光、BBL等最新设备进行有效治疗。针对肤质的定制化治疗，无副作用地恢复清透肌肤。",
};

// 병무청 배너 다국어
const MILITARY_TITLE: ML = {
  ko: "부산지방병무청 문신제거 지정 협력 피부과",
  en: "Designated Tattoo Removal Partner Clinic\nof Busan Regional Military Manpower Administration",
  ja: "釜山地方兵務庁 タトゥー除去指定協力皮膚科",
  zh: "釜山地方兵务厅 纹身去除指定合作皮肤科",
};
const MILITARY_DESC: ML = {
  ko: "스타피부과는 부산지방병무청과 업무 협약을 체결한 공식 지정 협력 피부과입니다. 병역 이행자를 위한 문신 제거 시술을 전문적으로 지원하며, 안전하고 체계적인 치료를 제공합니다.",
  en: "Star Dermatology is an officially designated partner clinic that has signed a business agreement with the Busan Regional Military Manpower Administration. We professionally support tattoo removal procedures for military service members, providing safe and systematic treatment.",
  ja: "スター皮膚科は釜山地方兵務庁と業務協約を締結した公式指定協力皮膚科です。兵役履行者のためのタトゥー除去施術を専門的に支援し、安全で体系的な治療を提供します。",
  zh: "STAR皮肤科是与釜山地方兵务厅签订业务协议的官方指定合作皮肤科。专业支持服役人员的纹身去除手术，提供安全、系统的治疗。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Target,
    title: { ko: "피코초 레이저 — 정밀 색소 분해", en: "Picosecond Laser — Precise Pigment Breakdown", ja: "ピコ秒レーザー — 精密色素分解", zh: "皮秒激光 — 精准色素分解" },
    desc: { ko: "1조분의 1초 단위의 초단파 레이저로 색소 입자를 미세하게 분쇄합니다. 주변 조직 손상 없이 색소만 선택적으로 제거합니다.", en: "Ultra-short picosecond pulses shatter pigment particles into tiny fragments without damaging surrounding tissue, selectively removing only the pigment.", ja: "1兆分の1秒単位の超短パルスレーザーで色素粒子を微細に粉砕します。周囲組織を傷つけずに色素のみを選択的に除去します。", zh: "万亿分之一秒的超短脉冲激光将色素颗粒精细粉碎，不损伤周围组织，选择性地去除色素。" },
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: Sun,
    title: { ko: "BBL 광치료 — 전체적인 피부톤 개선", en: "BBL Phototherapy — Overall Skin Tone Improvement", ja: "BBL光治療 — 全体的な肌トーン改善", zh: "BBL光疗 — 全面改善肤色" },
    desc: { ko: "광범위 파장의 BBL 광치료로 기미, 잡티, 홍조를 동시에 개선합니다. 피부 전체 톤을 균일하게 밝혀줍니다.", en: "BBL phototherapy with broad-spectrum wavelengths simultaneously improves melasma, age spots, and redness, evenly brightening the overall skin tone.", ja: "広範囲波長のBBL光治療でシミ、くすみ、紅潮を同時に改善します。肌全体のトーンを均一に明るくします。", zh: "宽谱BBL光疗同时改善黄褐斑、色斑和红肌，均匀提亮整体肤色。" },
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    icon: Eraser,
    title: { ko: "문신 제거 — 색상별 맞춤 레이저", en: "Tattoo Removal — Color-specific Laser", ja: "タトゥー除去 — 色別カスタムレーザー", zh: "纹身去除 — 按颜色定制激光" },
    desc: { ko: "문신 색상에 따라 최적의 레이저 파장을 선택합니다. 검정, 파랑, 빨강, 녹색 등 다양한 색상의 문신을 효과적으로 제거합니다.", en: "The optimal laser wavelength is selected based on tattoo color. Black, blue, red, green, and other colored tattoos are effectively removed.", ja: "タトゥーの色に応じて最適なレーザー波長を選択します。黒、青、赤、緑などさまざまな色のタトゥーを効果的に除去します。", zh: "根据纹身颜色选择最优激光波长。有效去除黑色、蓝色、红色、绿色等各种颜色的纹身。" },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: ShieldCheck,
    title: { ko: "부작용 최소화 — 피부 타입 맞춤", en: "Minimized Side Effects — Skin Type Customization", ja: "副作用最小化 — 肌タイプカスタム", zh: "最小化副作用 — 肤质定制" },
    desc: { ko: "한국인 피부 특성에 맞는 치료 프로토콜로 색소침착 등 부작용 위험을 최소화합니다. 피부과 전문의가 직접 진단 후 시술합니다.", en: "Treatment protocols tailored to Korean skin characteristics minimize the risk of side effects such as post-inflammatory hyperpigmentation. Directly diagnosed and treated by board-certified dermatologists.", ja: "韓国人の肌特性に合わせた治療プロトコルで色素沈着などの副作用リスクを最小化します。皮膚科専門医が直接診断後に施術します。", zh: "针对韩国人肤质特点的治疗方案，将色素沉着等副作用风险降至最低。由皮肤科专科医生亲自诊断后操作。" },
    color: "#4A6FA5",
    bg: "#EFF6FF",
  },
];

const TARGETS_LABEL: ML = { ko: "이런 분께 추천드립니다", en: "Recommended For", ja: "こんな方にお勧めします", zh: "推荐人群" };
const TARGETS: ML[] = [
  { ko: "기미, 주근깨, 잡티로 고민이신 분", en: "Those troubled by melasma, freckles, or age spots", ja: "シミ、そばかす、くすみでお悩みの方", zh: "受黄褐斑、雀斑、色斑困扰的人" },
  { ko: "문신 제거를 원하시는 분 (눈썹, 아이라인, 몸 문신 포함)", en: "Those seeking tattoo removal (including eyebrow, eyeliner, body tattoos)", ja: "タトゥー除去を希望する方（眉、アイライン、ボディタトゥー含む）", zh: "希望去除纹身的人（包括眉毛、眼线、身体纹身）" },
  { ko: "피부톤이 불균일하고 칙칙해 보이는 분", en: "Those with uneven, dull skin tone", ja: "肌トーンが不均一でくすんで見える方", zh: "肤色不均匀、暗沉的人" },
  { ko: "레이저 치료 후 색소침착이 남아 있는 분", en: "Those with post-laser hyperpigmentation", ja: "レーザー治療後に色素沉着が残っている方", zh: "激光治疗后仍有色素沉着的人" },
];

export default function PigmentGuide() {
  const { lang } = useLang();
  return (
    <div className="space-y-8">
      {/* 히어로 배너 */}
      <section>
        <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", border: "1.5px solid #FDE68A" }}>
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{ background: "#D97706", color: "#fff" }}>PIGMENT & TATTOO</span>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug" style={{ color: "#92400E" }}>{t(HERO, lang)}</h2>
          <p className="text-sm text-amber-700 max-w-xl mx-auto leading-relaxed">{t(HERO_SUB, lang)}</p>
        </div>
      </section>

      {/* 부산지방병무청 지정 협력 피부과 배너 */}
      <section>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "2px solid #1B3A6B", background: "linear-gradient(135deg, #0F2044 0%, #1B3A6B 60%, #2455A4 100%)" }}
        >
          {/* 상단 타이틀 영역 */}
          <div className="px-5 pt-5 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award size={20} style={{ color: "#FFD700" }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#FFD700" }}>OFFICIAL DESIGNATION</span>
              <Award size={20} style={{ color: "#FFD700" }} />
            </div>
            <h3
              className="text-base sm:text-lg font-extrabold leading-snug whitespace-pre-line"
              style={{ color: "#FFFFFF" }}
            >
              {t(MILITARY_TITLE, lang)}
            </h3>
          </div>

          {/* 협약식 사진 */}
          <div className="px-4 pb-4">
            <img
              src="/manus-storage/sub_02_img15_1bbef814.png"
              alt={lang === "en"
                ? "MOU signing ceremony between Busan Regional Military Manpower Administration and Star Dermatology for tattoo removal"
                : lang === "ja"
                ? "釜山地方兵務庁とスター皮膚科のタトゥー除去業務協約締結式"
                : lang === "zh"
                ? "釜山地方兵务厅与STAR皮肤科纹身去除业务协议签署仪式"
                : "부산지방병무청 × 스타피부과 문신제거 업무 협약식"}
              className="w-full rounded-xl object-cover"
              style={{ maxHeight: "260px", objectPosition: "center" }}
            />
          </div>

          {/* 설명 텍스트 */}
          <div
            className="mx-4 mb-4 rounded-xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <p className="text-xs sm:text-sm leading-relaxed text-center" style={{ color: "rgba(255,255,255,0.9)" }}>
              {t(MILITARY_DESC, lang)}
            </p>
          </div>

          {/* 하단 배지 */}
          <div className="flex justify-center gap-3 pb-5 flex-wrap px-4">
            {[
              lang === "en" ? "Official Designated Clinic" : lang === "ja" ? "公式指定協力皮膚科" : lang === "zh" ? "官方指定合作皮肤科" : "공식 지정 협력 피부과",
              lang === "en" ? "MOU Signed 2019" : lang === "ja" ? "2019年業務協約締結" : lang === "zh" ? "2019年签署业务协议" : "2019년 업무 협약 체결",
              lang === "en" ? "Military Service Support" : lang === "ja" ? "兵役履行者支援" : lang === "zh" ? "服役人员支持" : "병역 이행자 우대",
            ].map((badge, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(255,215,0,0.15)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.4)" }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 특별함 4가지 */}
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{lang === "en" ? "Why Choose Star Dermatology for Pigment & Tattoo?" : lang === "ja" ? "色素・タトゥー治療の特別さ" : lang === "zh" ? "色素·纹身治疗的特别之处" : "스타피부과 색소·문신 치료의 특별함"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f, i) => { const Icon = f.icon; return (
            <div key={i} className="rounded-2xl p-4 flex gap-3 items-start" style={{ background: f.bg, border: `1.5px solid ${f.color}22` }}>
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: f.color + "20" }}><Icon size={18} style={{ color: f.color }} /></div>
              <div><h4 className="font-bold text-sm mb-1" style={{ color: f.color }}>{t(f.title, lang)}</h4><p className="text-xs text-gray-600 leading-relaxed">{t(f.desc, lang)}</p></div>
            </div>
          ); })}
        </div>
      </section>

      {/* 추천 대상 */}
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{t(TARGETS_LABEL, lang)}</h3>
        <div className="rounded-2xl p-5" style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}>
          <ul className="space-y-3">{TARGETS.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-amber-900"><CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#D97706" }} /><span>{t(item, lang)}</span></li>))}</ul>
        </div>
      </section>
    </div>
  );
}

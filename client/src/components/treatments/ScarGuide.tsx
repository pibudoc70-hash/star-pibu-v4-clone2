/**
 * ScarGuide.tsx — 흉터·모공 탭 전용 카테고리 소개 섹션
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Layers, Zap, Shield, Microscope } from "lucide-react";

type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

const HERO: ML = {
  ko: "흉터·모공 치료\n피부 재생의 시작",
  en: "Scar & Pore Treatment\nThe Beginning of Skin Regeneration",
  ja: "傷跡・毛穴治療\n肌再生の始まり",
  zh: "疤痕·毛孔治疗\n肌肤再生的开始",
};
const HERO_SUB: ML = {
  ko: "여드름 흉터, 모공, 수두 자국 등 다양한 피부 결 문제를 레이저와 고주파 기술로 근본적으로 개선합니다. 스타피부과는 50여 종의 장비로 피부 타입과 흉터 유형에 맞는 맞춤 치료를 제공합니다.",
  en: "Acne scars, enlarged pores, and chickenpox marks are fundamentally improved with laser and RF technology. Star Dermatology offers personalized treatment with over 50 devices tailored to skin type and scar type.",
  ja: "ニキビ跡、毛穴、水痘の跡などさまざまな肌のテクスチャー問題をレーザーと高周波技術で根本的に改善します。スター皮膚科は50種以上の機器で肌タイプと傷跡タイプに合わせたカスタム治療を提供します。",
  zh: "痘疤、毛孔粗大、水痘疤痕等各种肌肤纹理问题，通过激光和射频技术从根本上改善。STAR皮肤科拥有50余种设备，提供针对肤质和疤痕类型的定制化治疗。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Layers,
    title: { ko: "다층 피부 재생", en: "Multi-layer Skin Regeneration", ja: "多層皮膚再生", zh: "多层肌肤再生" },
    desc: { ko: "표피부터 진피층까지 단계적으로 자극하여 콜라겐 생성을 촉진하고 피부 결을 근본적으로 개선합니다.", en: "Stimulating from the epidermis to the dermis promotes collagen production and fundamentally improves skin texture.", ja: "表皮から真皮層まで段階的に刺激してコラーゲン生成を促進し、肌のキメを根本的に改善します。", zh: "从表皮到真皮层逐步刺激，促进胶原蛋白生成，从根本上改善肌肤纹理。" },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: Zap,
    title: { ko: "레이저 + 고주파 복합 치료", en: "Laser + RF Combination Therapy", ja: "レーザー＋高周波複合治療", zh: "激光+射频复合治疗" },
    desc: { ko: "단일 치료보다 복합 치료가 효과적입니다. 레이저와 고주파를 병행하여 흉터 깊이와 모공 크기를 동시에 개선합니다.", en: "Combination therapy is more effective than single treatment. Laser and RF together improve scar depth and pore size simultaneously.", ja: "単一治療より複合治療が効果的です。レーザーと高周波を併用して傷跡の深さと毛穴のサイズを同時に改善します。", zh: "复合治疗比单一治疗更有效。激光与射频联合，同时改善疤痕深度和毛孔大小。" },
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: Microscope,
    title: { ko: "흉터 유형별 맞춤 치료", en: "Customized Treatment by Scar Type", ja: "傷跡タイプ別カスタム治療", zh: "按疤痕类型定制治疗" },
    desc: { ko: "아이스픽, 박스카, 롤링 등 흉터 유형에 따라 최적의 장비와 치료법을 선택하여 효과를 극대화합니다.", en: "Optimal devices and treatments are selected based on scar type — icepick, boxcar, rolling — to maximize results.", ja: "アイスピック、ボックスカー、ローリングなど傷跡タイプに応じて最適な機器と治療法を選択し、効果を最大化します。", zh: "根据冰锥型、箱车型、滚动型等疤痕类型选择最优设备和治疗方案，最大化效果。" },
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    icon: Shield,
    title: { ko: "피부과 전문의 직접 시술", en: "Direct Treatment by Board-certified Dermatologist", ja: "皮膚科専門医による直接施術", zh: "皮肤科专科医生亲自操作" },
    desc: { ko: "모든 흉터·모공 치료는 피부과 전문의가 직접 진단하고 시술합니다. 개인 피부 상태에 맞는 최적의 치료 계획을 수립합니다.", en: "All scar and pore treatments are directly diagnosed and performed by board-certified dermatologists, with an optimal treatment plan tailored to each individual's skin condition.", ja: "すべての傷跡・毛穴治療は皮膚科専門医が直接診断し施術します。個人の肌状態に合わせた最適な治療計画を立てます。", zh: "所有疤痕和毛孔治疗均由皮肤科专科医生亲自诊断和操作，制定针对个人肤质的最优治疗方案。" },
    color: "#4A6FA5",
    bg: "#EFF6FF",
  },
];

const TARGETS_LABEL: ML = { ko: "이런 분께 추천드립니다", en: "Recommended For", ja: "こんな方にお勧めします", zh: "推荐人群" };
const TARGETS: ML[] = [
  { ko: "여드름 흉터(아이스픽·박스카·롤링)로 고민이신 분", en: "Those troubled by acne scars (icepick, boxcar, rolling)", ja: "ニキビ跡（アイスピック・ボックスカー・ローリング）でお悩みの方", zh: "受痘疤（冰锥型·箱车型·滚动型）困扰的人" },
  { ko: "모공이 넓고 피부 결이 거칠어 고민이신 분", en: "Those with enlarged pores and rough skin texture", ja: "毛穴が広く肌のキメが粗くてお悩みの方", zh: "毛孔粗大、肌肤纹理粗糙的人" },
  { ko: "수두 자국, 외상성 흉터가 있으신 분", en: "Those with chickenpox marks or traumatic scars", ja: "水痘の跡や外傷性傷跡がある方", zh: "有水痘疤痕或外伤性疤痕的人" },
  { ko: "피부 재생 치료를 통해 탄력 있는 피부를 원하시는 분", en: "Those seeking elastic, regenerated skin through treatment", ja: "皮膚再生治療でハリのある肌を望む方", zh: "希望通过肌肤再生治疗获得弹性肌肤的人" },
];

export default function ScarGuide() {
  const { lang } = useLang();
  return (
    <div className="space-y-8">
      <section>
        <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #FFFBEB 100%)", border: "1.5px solid #DDD6FE" }}>
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{ background: "#7C3AED", color: "#fff" }}>SCAR & PORE</span>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug" style={{ color: "#4C1D95" }}>{t(HERO, lang)}</h2>
          <p className="text-sm text-purple-700 max-w-xl mx-auto leading-relaxed">{t(HERO_SUB, lang)}</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{lang === "en" ? "Why Choose Star Dermatology for Scar & Pore?" : lang === "ja" ? "傷跡・毛穴治療の特別さ" : lang === "zh" ? "疤痕·毛孔治疗的特别之处" : "스타피부과 흉터·모공 치료의 특별함"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f, i) => { const Icon = f.icon; return (
            <div key={i} className="rounded-2xl p-4 flex gap-3 items-start" style={{ background: f.bg, border: `1.5px solid ${f.color}22` }}>
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: f.color + "20" }}><Icon size={18} style={{ color: f.color }} /></div>
              <div><h4 className="font-bold text-sm mb-1" style={{ color: f.color }}>{t(f.title, lang)}</h4><p className="text-xs text-gray-600 leading-relaxed">{t(f.desc, lang)}</p></div>
            </div>
          ); })}
        </div>
      </section>
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{t(TARGETS_LABEL, lang)}</h3>
        <div className="rounded-2xl p-5" style={{ background: "#F5F3FF", border: "1.5px solid #DDD6FE" }}>
          <ul className="space-y-3">{TARGETS.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-purple-900"><CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#7C3AED" }} /><span>{t(item, lang)}</span></li>))}</ul>
        </div>
      </section>
    </div>
  );
}

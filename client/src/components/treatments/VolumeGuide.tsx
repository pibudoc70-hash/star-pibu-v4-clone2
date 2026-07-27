/**
 * VolumeGuide.tsx — 볼륨·부스터 탭 전용 카테고리 소개 섹션
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Droplets, Sparkles, Heart, Star } from "lucide-react";

type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

const HERO: ML = {
  ko: "볼륨·부스터 치료\n피부 속부터 채우는 생기",
  en: "Volume & Booster Treatment\nVitality from Within",
  ja: "ボリューム・ブースター治療\n肌の内側から満たす生気",
  zh: "丰盈·提亮治疗\n由内而外焕发活力",
};
const HERO_SUB: ML = {
  ko: "스컬트라, 쥬베룩, 엑소좀, 줄기세포 등 최신 볼륨 부스터 치료로 피부 탄력과 볼륨을 동시에 개선합니다. 자연스러운 윤기와 생기를 되찾아 드립니다.",
  en: "The latest volume booster treatments including Sculptra, Juvelook, exosomes, and stem cells simultaneously improve skin elasticity and volume, restoring natural radiance and vitality.",
  ja: "スカルプトラ、ジュベルック、エクソソーム、幹細胞などの最新ボリュームブースター治療で肌の弾力とボリュームを同時に改善します。自然なツヤと生気を取り戻します。",
  zh: "Sculptra、Juvelook、外泌体、干细胞等最新丰盈提亮治疗，同时改善肌肤弹性和丰盈度，恢复自然光泽与活力。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Droplets,
    title: { ko: "콜라겐 자극 — 장기 지속 효과", en: "Collagen Stimulation — Long-lasting Effects", ja: "コラーゲン刺激 — 長期持続効果", zh: "胶原蛋白刺激 — 长效持久" },
    desc: { ko: "스컬트라, 쥬베룩 등 콜라겐 자극제는 피부 자체의 콜라겐 생성을 유도하여 자연스럽고 오래 지속되는 볼륨을 만들어 줍니다.", en: "Collagen stimulators like Sculptra and Juvelook induce the skin's own collagen production, creating natural and long-lasting volume.", ja: "スカルプトラ、ジュベルックなどのコラーゲン刺激剤は、肌自体のコラーゲン生成を誘導し、自然で長持ちするボリュームを作ります。", zh: "Sculptra、Juvelook等胶原蛋白刺激剂诱导肌肤自身产生胶原蛋白，打造自然持久的丰盈效果。" },
    color: "#DB2777",
    bg: "#FDF2F8",
  },
  {
    icon: Sparkles,
    title: { ko: "엑소좀·줄기세포 — 세포 재생", en: "Exosome & Stem Cell — Cellular Regeneration", ja: "エクソソーム・幹細胞 — 細胞再生", zh: "外泌体·干细胞 — 细胞再生" },
    desc: { ko: "엑소좀과 줄기세포 치료는 피부 세포 재생을 촉진하여 피부 질감, 탄력, 윤기를 근본적으로 개선합니다.", en: "Exosome and stem cell treatments promote skin cell regeneration, fundamentally improving skin texture, elasticity, and radiance.", ja: "エクソソームと幹細胞治療は皮膚細胞の再生を促進し、肌のキメ、弾力、ツヤを根本的に改善します。", zh: "外泌体和干细胞治疗促进皮肤细胞再生，从根本上改善肌肤纹理、弹性和光泽。" },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: Heart,
    title: { ko: "스킨부스터 — 즉각적인 수분 공급", en: "Skin Booster — Immediate Hydration", ja: "スキンブースター — 即時保湿", zh: "肌肤提亮 — 即时补水" },
    desc: { ko: "리쥬란, 쥬베룩 등 스킨부스터는 피부 깊숙이 수분과 영양을 공급하여 즉각적인 윤기와 탄력을 선사합니다.", en: "Skin boosters like Rejuran and Juvelook deliver moisture and nutrients deep into the skin, providing immediate radiance and elasticity.", ja: "リジュラン、ジュベルックなどのスキンブースターは肌の深部に水分と栄養を供給し、即座のツヤと弾力をもたらします。", zh: "Rejuran、Juvelook等肌肤提亮产品将水分和营养输送至肌肤深层，立即赋予光泽和弹性。" },
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    icon: Star,
    title: { ko: "자연스러운 볼륨 — 과하지 않게", en: "Natural Volume — Not Overdone", ja: "自然なボリューム — やりすぎない", zh: "自然丰盈 — 恰到好处" },
    desc: { ko: "과도한 볼륨이 아닌 자연스러운 윤곽을 목표로 합니다. 피부과 전문의가 개인 얼굴형과 피부 상태에 맞는 최적의 치료량을 결정합니다.", en: "The goal is natural contour, not excessive volume. Board-certified dermatologists determine the optimal treatment amount for each individual's face shape and skin condition.", ja: "過度なボリュームではなく自然な輪郭を目指します。皮膚科専門医が個人の顔型と肌状態に合わせた最適な治療量を決定します。", zh: "目标是自然轮廓，而非过度丰盈。皮肤科专科医生根据个人脸型和肤质确定最优治疗量。" },
    color: "#D97706",
    bg: "#FFFBEB",
  },
];

const TARGETS_LABEL: ML = { ko: "이런 분께 추천드립니다", en: "Recommended For", ja: "こんな方にお勧めします", zh: "推荐人群" };
const TARGETS: ML[] = [
  { ko: "얼굴 볼륨이 빠지고 꺼져 보이는 분", en: "Those whose face has lost volume and looks sunken", ja: "顔のボリュームが失われてくぼんで見える方", zh: "面部失去丰盈感、看起来凹陷的人" },
  { ko: "피부 탄력이 저하되고 처짐이 느껴지는 분", en: "Those experiencing reduced skin elasticity and sagging", ja: "肌の弾力が低下してたるみを感じる方", zh: "肌肤弹性下降、感觉松弛的人" },
  { ko: "피부 윤기와 생기를 되찾고 싶으신 분", en: "Those wanting to restore skin radiance and vitality", ja: "肌のツヤと生気を取り戻したい方", zh: "希望恢复肌肤光泽和活力的人" },
  { ko: "자연스러운 동안 효과를 원하시는 분", en: "Those seeking a natural youthful appearance", ja: "自然な若見え効果を望む方", zh: "希望自然年轻化效果的人" },
];

export default function VolumeGuide() {
  const { lang } = useLang();
  return (
    <div className="space-y-8">
      <section>
        <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #F5F3FF 100%)", border: "1.5px solid #FBCFE8" }}>
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{ background: "#DB2777", color: "#fff" }}>VOLUME & BOOSTER</span>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug" style={{ color: "#831843" }}>{t(HERO, lang)}</h2>
          <p className="text-sm text-pink-700 max-w-xl mx-auto leading-relaxed">{t(HERO_SUB, lang)}</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{lang === "en" ? "Why Choose Star Dermatology for Volume & Booster?" : lang === "ja" ? "ボリューム・ブースター治療の特別さ" : lang === "zh" ? "丰盈·提亮治疗的特别之处" : "스타피부과 볼륨·부스터 치료의 특별함"}</h3>
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
        <div className="rounded-2xl p-5" style={{ background: "#FDF2F8", border: "1.5px solid #FBCFE8" }}>
          <ul className="space-y-3">{TARGETS.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-pink-900"><CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#DB2777" }} /><span>{t(item, lang)}</span></li>))}</ul>
        </div>
      </section>
    </div>
  );
}

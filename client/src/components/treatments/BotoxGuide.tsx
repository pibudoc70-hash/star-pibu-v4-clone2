/**
 * BotoxGuide.tsx — 보톡스·필러 탭 전용 카테고리 소개 섹션
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Syringe, Clock, Smile, ShieldCheck } from "lucide-react";

type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

const HERO: ML = {
  ko: "보톡스·필러\n자연스러운 동안 윤곽",
  en: "Botox & Filler\nNatural Youthful Contour",
  ja: "ボトックス・フィラー\n自然な若見え輪郭",
  zh: "肉毒素·填充\n自然年轻化轮廓",
};
const HERO_SUB: ML = {
  ko: "주름 개선과 볼륨 보충을 위한 보톡스·필러 시술. 과하지 않은 자연스러운 결과를 위해 피부과 전문의가 직접 시술합니다. 빠른 시술 시간과 즉각적인 효과로 바쁜 일상 속에서도 부담 없이 받으실 수 있습니다.",
  en: "Botox and filler treatments for wrinkle improvement and volume restoration. Board-certified dermatologists perform the procedure directly for natural, not overdone results. Quick procedure time and immediate effects make it easy to fit into a busy schedule.",
  ja: "シワ改善とボリューム補充のためのボトックス・フィラー施術。やりすぎない自然な結果のために皮膚科専門医が直接施術します。施術時間が短く即効性があるため、忙しい日常でも気軽に受けられます。",
  zh: "用于改善皱纹和补充丰盈度的肉毒素和填充治疗。皮肤科专科医生亲自操作，追求自然不过度的效果。操作时间短、效果即时，即使日程繁忙也可轻松进行。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Syringe,
    title: { ko: "정밀한 주입 기술", en: "Precise Injection Technique", ja: "精密な注入技術", zh: "精准注射技术" },
    desc: { ko: "해부학적 지식을 바탕으로 한 정밀한 주입 기술로 자연스러운 결과를 만들어 냅니다. 과도한 시술 없이 원하는 부위만 정확하게 개선합니다.", en: "Precise injection techniques based on anatomical knowledge create natural results, accurately improving only the desired areas without over-treatment.", ja: "解剖学的知識に基づいた精密な注入技術で自然な結果を生み出します。過度な施術なく望む部位だけを正確に改善します。", zh: "基于解剖学知识的精准注射技术打造自然效果，精确改善目标部位，不过度治疗。" },
    color: "#4A6FA5",
    bg: "#EFF6FF",
  },
  {
    icon: Clock,
    title: { ko: "빠른 시술 — 점심시간에도 가능", en: "Quick Procedure — Even During Lunch Break", ja: "短時間施術 — ランチタイムでも可能", zh: "快速操作 — 午休时间也可进行" },
    desc: { ko: "보톡스는 10~20분, 필러는 20~40분 내에 시술이 완료됩니다. 일상으로 바로 복귀 가능하며 별도의 회복 기간이 필요하지 않습니다.", en: "Botox takes 10-20 minutes, filler 20-40 minutes. Immediate return to daily activities with no recovery period required.", ja: "ボトックスは10〜20分、フィラーは20〜40分で施術完了。日常にすぐ復帰でき、別途回復期間は不要です。", zh: "肉毒素10-20分钟，填充20-40分钟即可完成。可立即恢复日常活动，无需额外恢复期。" },
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    icon: Smile,
    title: { ko: "자연스러운 표정 유지", en: "Natural Expression Maintained", ja: "自然な表情を維持", zh: "保持自然表情" },
    desc: { ko: "표정 근육의 움직임을 완전히 차단하지 않고 자연스러운 표정을 유지하면서 주름을 개선합니다. 어색하지 않은 자연스러운 결과를 추구합니다.", en: "Wrinkles are improved while maintaining natural expressions without completely blocking facial muscle movement, pursuing natural and non-awkward results.", ja: "表情筋の動きを完全に遮断せず、自然な表情を維持しながらシワを改善します。不自然でない自然な結果を追求します。", zh: "在不完全阻断表情肌运动的情况下改善皱纹，同时保持自然表情，追求自然不尴尬的效果。" },
    color: "#DB2777",
    bg: "#FDF2F8",
  },
  {
    icon: ShieldCheck,
    title: { ko: "정품 인증 제품 사용", en: "Certified Authentic Products", ja: "正規品認証製品を使用", zh: "使用正品认证产品" },
    desc: { ko: "식품의약품안전처 허가를 받은 정품 보톡스와 필러만 사용합니다. 안전성과 효과가 검증된 제품으로 안심하고 시술받으실 수 있습니다.", en: "Only authentic botox and fillers approved by the Ministry of Food and Drug Safety are used. You can receive treatment with confidence using products with verified safety and efficacy.", ja: "食品医薬品安全処の許可を受けた正規品のボトックスとフィラーのみを使用します。安全性と効果が検証された製品で安心して施術を受けられます。", zh: "仅使用获得食品药品安全处批准的正品肉毒素和填充剂。使用安全性和有效性经过验证的产品，让您放心接受治疗。" },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

const TARGETS_LABEL: ML = { ko: "이런 분께 추천드립니다", en: "Recommended For", ja: "こんな方にお勧めします", zh: "推荐人群" };
const TARGETS: ML[] = [
  { ko: "이마, 눈가, 미간 주름이 신경 쓰이시는 분", en: "Those bothered by forehead, eye corner, or frown line wrinkles", ja: "額、目尻、眉間のシワが気になる方", zh: "在意额头、眼角、眉间皱纹的人" },
  { ko: "팔자주름, 입가 주름으로 고민이신 분", en: "Those troubled by nasolabial folds or perioral wrinkles", ja: "ほうれい線、口元のシワでお悩みの方", zh: "受法令纹、口周皱纹困扰的人" },
  { ko: "볼, 턱선 등 얼굴 윤곽을 개선하고 싶으신 분", en: "Those wanting to improve facial contour such as cheeks or jawline", ja: "頬、フェイスラインなど顔の輪郭を改善したい方", zh: "希望改善脸颊、下颌线等面部轮廓的人" },
  { ko: "사각턱, 종아리 보톡스를 원하시는 분", en: "Those seeking masseter or calf botox", ja: "エラ、ふくらはぎボトックスを希望する方", zh: "希望进行咬肌或小腿肉毒素注射的人" },
];

export default function BotoxGuide() {
  const { lang } = useLang();
  return (
    <div className="space-y-8">
      <section>
        <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)", border: "1.5px solid #BFDBFE" }}>
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{ background: "#4A6FA5", color: "#fff" }}>BOTOX & FILLER</span>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug" style={{ color: "#1E3A5F" }}>{t(HERO, lang)}</h2>
          <p className="text-sm text-blue-700 max-w-xl mx-auto leading-relaxed">{t(HERO_SUB, lang)}</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{lang === "en" ? "Why Choose Star Dermatology for Botox & Filler?" : lang === "ja" ? "ボトックス・フィラー治療の特別さ" : lang === "zh" ? "肉毒素·填充治疗的特别之处" : "스타피부과 보톡스·필러의 특별함"}</h3>
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
        <div className="rounded-2xl p-5" style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE" }}>
          <ul className="space-y-3">{TARGETS.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-blue-900"><CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#4A6FA5" }} /><span>{t(item, lang)}</span></li>))}</ul>
        </div>
      </section>
    </div>
  );
}

/**
 * RosaceaGuide.tsx — 홍조·혈관 탭 전용 카테고리 소개 섹션
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Thermometer, Waves, Eye, ShieldCheck } from "lucide-react";

type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

const HERO: ML = {
  ko: "홍조·혈관 치료\n고른 피부톤을 되찾다",
  en: "Rosacea & Vascular Treatment\nRestoring Even Skin Tone",
  ja: "紅潮・血管治療\n均一な肌トーンを取り戻す",
  zh: "红肌·血管治疗\n恢复均匀肤色",
};
const HERO_SUB: ML = {
  ko: "안면홍조, 실핏줄, 주사(酒渣), 혈관 확장 등 다양한 혈관성 피부 문제를 레이저와 광치료로 효과적으로 치료합니다. 붉은 피부 고민을 근본적으로 해결해 드립니다.",
  en: "Various vascular skin problems including facial redness, spider veins, rosacea, and vascular dilation are effectively treated with laser and phototherapy. We fundamentally resolve your red skin concerns.",
  ja: "顔面紅潮、毛細血管拡張、酒さ、血管拡張などさまざまな血管性皮膚問題をレーザーと光治療で効果的に治療します。赤い肌の悩みを根本的に解決します。",
  zh: "面部潮红、毛细血管扩张、玫瑰痤疮、血管扩张等各种血管性皮肤问题，通过激光和光疗有效治疗。从根本上解决红肌烦恼。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Thermometer,
    title: { ko: "혈관 선택적 레이저", en: "Vascular-selective Laser", ja: "血管選択的レーザー", zh: "血管选择性激光" },
    desc: { ko: "혈관 내 헤모글로빈만 선택적으로 흡수하는 파장의 레이저로 주변 피부 손상 없이 혈관만 정밀하게 치료합니다.", en: "Lasers with wavelengths selectively absorbed by hemoglobin in blood vessels precisely treat only the vessels without damaging surrounding skin.", ja: "血管内のヘモグロビンのみを選択的に吸収する波長のレーザーで、周囲の皮膚を傷つけずに血管だけを精密に治療します。", zh: "使用选择性被血管内血红蛋白吸收的波长激光，在不损伤周围皮肤的情况下精准治疗血管。" },
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  {
    icon: Waves,
    title: { ko: "BBL 광치료 — 전반적 홍조 개선", en: "BBL Phototherapy — Overall Redness Improvement", ja: "BBL光治療 — 全体的な紅潮改善", zh: "BBL光疗 — 全面改善红肌" },
    desc: { ko: "광범위 파장의 BBL 광치료로 안면홍조와 피부 전체 붉은기를 동시에 개선합니다. 피부 톤을 균일하게 정돈해 줍니다.", en: "BBL phototherapy with broad-spectrum wavelengths simultaneously improves facial redness and overall skin redness, evening out skin tone.", ja: "広範囲波長のBBL光治療で顔面紅潮と肌全体の赤みを同時に改善します。肌トーンを均一に整えます。", zh: "宽谱BBL光疗同时改善面部潮红和整体肌肤红色调，均匀整理肤色。" },
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: Eye,
    title: { ko: "주사(酒渣) 전문 치료", en: "Specialized Rosacea Treatment", ja: "酒さ専門治療", zh: "玫瑰痤疮专业治疗" },
    desc: { ko: "주사(로사세아)는 단순 홍조와 달리 전문적인 치료가 필요합니다. 피부과 전문의가 주사 단계를 정확히 진단하고 맞춤 치료를 제공합니다.", en: "Rosacea requires specialized treatment unlike simple redness. Board-certified dermatologists accurately diagnose the stage of rosacea and provide customized treatment.", ja: "酒さ（ロザセア）は単純な紅潮と異なり専門的な治療が必要です。皮膚科専門医が酒さの段階を正確に診断しカスタム治療を提供します。", zh: "玫瑰痤疮与简单红肌不同，需要专业治疗。皮肤科专科医生准确诊断玫瑰痤疮阶段，提供定制化治疗。" },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: ShieldCheck,
    title: { ko: "생활 습관 관리 병행", en: "Lifestyle Management in Conjunction", ja: "生活習慣管理の併用", zh: "结合生活习惯管理" },
    desc: { ko: "홍조·혈관 치료는 레이저 시술과 함께 자극 요인 관리가 중요합니다. 전문의 상담을 통해 생활 습관 개선 방법도 안내해 드립니다.", en: "Managing trigger factors alongside laser treatment is important for rosacea and vascular treatment. Specialist consultations also provide guidance on lifestyle improvements.", ja: "紅潮・血管治療はレーザー施術とともに刺激要因の管理が重要です。専門医相談を通じて生活習慣改善方法もご案内します。", zh: "红肌和血管治疗中，激光操作与刺激因素管理同样重要。通过专科医生咨询，也会提供生活习惯改善指导。" },
    color: "#15803D",
    bg: "#F0FDF4",
  },
];

const TARGETS_LABEL: ML = { ko: "이런 분께 추천드립니다", en: "Recommended For", ja: "こんな方にお勧めします", zh: "推荐人群" };
const TARGETS: ML[] = [
  { ko: "얼굴이 쉽게 붉어지고 홍조가 오래 지속되는 분", en: "Those whose face easily flushes and redness persists", ja: "顔がすぐに赤くなり紅潮が長続きする方", zh: "脸部容易潮红且红色持续时间长的人" },
  { ko: "코, 뺨, 이마에 실핏줄이 보이는 분", en: "Those with visible spider veins on nose, cheeks, or forehead", ja: "鼻、頬、額に毛細血管が見える方", zh: "鼻子、脸颊、额头可见毛细血管的人" },
  { ko: "주사(로사세아) 진단을 받으셨거나 의심되는 분", en: "Those diagnosed with or suspected of rosacea", ja: "酒さ（ロザセア）と診断されたか疑われる方", zh: "被诊断为或疑似玫瑰痤疮的人" },
  { ko: "음주, 온도 변화 시 유독 심해지는 홍조로 고민이신 분", en: "Those troubled by redness that worsens with alcohol or temperature changes", ja: "飲酒や温度変化で特にひどくなる紅潮でお悩みの方", zh: "饮酒或温度变化时红肌明显加重的人" },
];

export default function RosaceaGuide() {
  const { lang } = useLang();
  return (
    <div className="space-y-8">
      <section>
        <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: "linear-gradient(135deg, #FEF2F2 0%, #FFFBEB 100%)", border: "1.5px solid #FECACA" }}>
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{ background: "#DC2626", color: "#fff" }}>ROSACEA & VASCULAR</span>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug" style={{ color: "#7F1D1D" }}>{t(HERO, lang)}</h2>
          <p className="text-sm text-red-700 max-w-xl mx-auto leading-relaxed">{t(HERO_SUB, lang)}</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{lang === "en" ? "Why Choose Star Dermatology for Rosacea & Vascular?" : lang === "ja" ? "紅潮・血管治療の特別さ" : lang === "zh" ? "红肌·血管治疗的特别之处" : "스타피부과 홍조·혈관 치료의 특별함"}</h3>
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
        <div className="rounded-2xl p-5" style={{ background: "#FEF2F2", border: "1.5px solid #FECACA" }}>
          <ul className="space-y-3">{TARGETS.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-red-900"><CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#DC2626" }} /><span>{t(item, lang)}</span></li>))}</ul>
        </div>
      </section>
    </div>
  );
}

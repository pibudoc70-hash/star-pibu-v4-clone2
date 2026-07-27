/**
 * HyperhidrosisGuide.tsx — 액취증·다한증 탭 전용 카테고리 소개 섹션
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Wind, Zap, Clock, ShieldCheck } from "lucide-react";

type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

const HERO: ML = {
  ko: "액취증·다한증 치료\n자신감 있는 일상으로",
  en: "Hyperhidrosis & Bromhidrosis Treatment\nBack to a Confident Daily Life",
  ja: "腋臭症・多汗症治療\n自信のある日常へ",
  zh: "腋臭·多汗症治疗\n重拾自信的日常生活",
};
const HERO_SUB: ML = {
  ko: "과도한 땀 분비와 액취증으로 일상이 불편하셨나요? 미라드라이, 리포셋, 보톡스 등 다양한 치료 옵션으로 근본적인 해결책을 제공합니다. 피부과 전문의가 증상에 맞는 최적의 치료를 안내해 드립니다.",
  en: "Has excessive sweating and bromhidrosis been causing discomfort in your daily life? We provide fundamental solutions with various treatment options including miraDry, Liposet, and Botox. Board-certified dermatologists guide you to the optimal treatment for your symptoms.",
  ja: "過度な発汗と腋臭症で日常が不便でしたか？ミラドライ、リポセット、ボトックスなど様々な治療オプションで根本的な解決策を提供します。皮膚科専門医が症状に合った最適な治療をご案内します。",
  zh: "过度出汗和腋臭让您日常生活不便吗？通过miraDry、Liposet、肉毒素等多种治疗方案提供根本解决方案。皮肤科专科医生为您指导最适合症状的治疗方法。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Zap,
    title: { ko: "미라드라이 — 영구적 땀샘 제거", en: "miraDry — Permanent Sweat Gland Elimination", ja: "ミラドライ — 永久的な汗腺除去", zh: "miraDry — 永久消除汗腺" },
    desc: { ko: "마이크로파 에너지로 겨드랑이 땀샘을 영구적으로 제거합니다. 1~2회 시술로 효과가 지속되며 액취증과 다한증을 동시에 해결합니다.", en: "Microwave energy permanently eliminates underarm sweat glands. Effects last with 1-2 treatments, simultaneously resolving bromhidrosis and hyperhidrosis.", ja: "マイクロ波エネルギーで脇の汗腺を永久的に除去します。1〜2回の施術で効果が持続し、腋臭症と多汗症を同時に解決します。", zh: "微波能量永久消除腋下汗腺。1-2次治疗效果持续，同时解决腋臭和多汗症。" },
    color: "#4A6FA5",
    bg: "#EFF6FF",
  },
  {
    icon: Wind,
    title: { ko: "다한증 보톡스 — 즉각적 효과", en: "Hyperhidrosis Botox — Immediate Effect", ja: "多汗症ボトックス — 即効性", zh: "多汗症肉毒素 — 即时效果" },
    desc: { ko: "보톡스 주사로 땀샘 신경을 차단하여 과도한 땀 분비를 억제합니다. 시술 후 1~2주 내에 효과가 나타나며 6~12개월 지속됩니다.", en: "Botox injections block sweat gland nerves to suppress excessive sweating. Effects appear within 1-2 weeks after treatment and last 6-12 months.", ja: "ボトックス注射で汗腺神経を遮断して過度な発汗を抑制します。施術後1〜2週間以内に効果が現れ6〜12ヶ月持続します。", zh: "肉毒素注射阻断汗腺神经，抑制过度出汗。治疗后1-2周内出现效果，持续6-12个月。" },
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    icon: Clock,
    title: { ko: "리포셋 — 지방·땀샘 동시 제거", en: "Liposet — Simultaneous Fat & Sweat Gland Removal", ja: "リポセット — 脂肪・汗腺同時除去", zh: "Liposet — 同时去除脂肪和汗腺" },
    desc: { ko: "고주파 에너지로 겨드랑이 지방과 땀샘을 동시에 제거합니다. 겨드랑이 볼록함과 다한증·액취증을 한 번에 해결할 수 있습니다.", en: "Radio frequency energy simultaneously removes underarm fat and sweat glands. Underarm bulging and hyperhidrosis/bromhidrosis can be resolved at once.", ja: "高周波エネルギーで脇の脂肪と汗腺を同時に除去します。脇のふくらみと多汗症・腋臭症を一度に解決できます。", zh: "射频能量同时去除腋下脂肪和汗腺。可一次性解决腋下凸起和多汗症·腋臭问题。" },
    color: "#DB2777",
    bg: "#FDF2F8",
  },
  {
    icon: ShieldCheck,
    title: { ko: "증상별 맞춤 치료 계획", en: "Customized Treatment Plan by Symptom", ja: "症状別カスタム治療計画", zh: "按症状定制治疗方案" },
    desc: { ko: "액취증과 다한증의 정도, 부위, 생활 패턴에 따라 최적의 치료 방법을 선택합니다. 전문의 상담을 통해 개인별 맞춤 치료 계획을 수립합니다.", en: "The optimal treatment method is selected based on the severity, location, and lifestyle patterns of bromhidrosis and hyperhidrosis. Individual customized treatment plans are established through specialist consultations.", ja: "腋臭症と多汗症の程度、部位、生活パターンに応じて最適な治療方法を選択します。専門医相談を通じて個別カスタム治療計画を策定します。", zh: "根据腋臭和多汗症的程度、部位和生活模式选择最佳治疗方法。通过专科医生咨询制定个人定制治疗方案。" },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

const TARGETS_LABEL: ML = { ko: "이런 분께 추천드립니다", en: "Recommended For", ja: "こんな方にお勧めします", zh: "推荐人群" };
const TARGETS: ML[] = [
  { ko: "겨드랑이 냄새로 대인 관계에 불편함을 느끼시는 분", en: "Those experiencing discomfort in social relationships due to underarm odor", ja: "脇の臭いで対人関係に不便を感じている方", zh: "因腋下异味在人际关系中感到不便的人" },
  { ko: "땀이 많아 옷에 땀 자국이 자주 생기시는 분", en: "Those who frequently have sweat stains on clothes due to excessive sweating", ja: "汗が多くて服に汗染みがよくできる方", zh: "因出汗过多经常在衣服上留下汗渍的人" },
  { ko: "손발 다한증으로 악수나 일상 활동이 불편하신 분", en: "Those uncomfortable with handshakes or daily activities due to palmar/plantar hyperhidrosis", ja: "手足の多汗症で握手や日常活動が不便な方", zh: "因手脚多汗症导致握手或日常活动不便的人" },
  { ko: "기존 치료(데오도란트, 약물)로 효과를 보지 못하신 분", en: "Those who have not seen results from existing treatments (deodorants, medication)", ja: "既存の治療（デオドラント、薬物）で効果がなかった方", zh: "现有治疗（止汗剂、药物）无效的人" },
];

export default function HyperhidrosisGuide() {
  const { lang } = useLang();
  return (
    <div className="space-y-8">
      <section>
        <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)", border: "1.5px solid #BFDBFE" }}>
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{ background: "#4A6FA5", color: "#fff" }}>HYPERHIDROSIS & BROMHIDROSIS</span>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug" style={{ color: "#1E3A5F" }}>{t(HERO, lang)}</h2>
          <p className="text-sm text-blue-700 max-w-xl mx-auto leading-relaxed">{t(HERO_SUB, lang)}</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{lang === "en" ? "Why Choose Star Dermatology for Hyperhidrosis?" : lang === "ja" ? "液臭症・多汗症治療の特別さ" : lang === "zh" ? "腋臭·多汗症治疗的特别之处" : "스타피부과 액취증·다한증 치료의 특별함"}</h3>
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

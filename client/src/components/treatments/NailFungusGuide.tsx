/**
 * NailFungusGuide.tsx — 손·발톱무좀 탭 전용 카테고리 소개 섹션
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Zap, ShieldCheck, Clock, Microscope } from "lucide-react";

type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

const HERO: ML = {
  ko: "손·발톱무좀 치료\n건강한 손발톱을 되찾다",
  en: "Nail Fungus Treatment\nRestoring Healthy Nails",
  ja: "爪水虫治療\n健康な爪を取り戻す",
  zh: "甲癣治疗\n恢复健康指甲",
};
const HERO_SUB: ML = {
  ko: "손발톱무좀(조갑진균증)은 먹는 약의 부작용 없이 레이저로 효과적으로 치료할 수 있습니다. 핀포인트, 힐러 1064 등 전문 레이저 장비로 무좀균을 직접 제거합니다.",
  en: "Nail fungus (onychomycosis) can be effectively treated with laser without the side effects of oral medication. Specialized laser devices like Pinpointe and Healer 1064 directly eliminate fungal organisms.",
  ja: "爪水虫（爪甲真菌症）は内服薬の副作用なしにレーザーで効果的に治療できます。ピンポイント、ヒーラー1064などの専門レーザー機器で水虫菌を直接除去します。",
  zh: "甲癣（甲真菌病）可以通过激光有效治疗，无需口服药物的副作用。使用Pinpointe、Healer 1064等专业激光设备直接消灭真菌。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Zap,
    title: { ko: "레이저 — 먹는 약 없이 치료", en: "Laser — Treatment Without Oral Medication", ja: "レーザー — 内服薬なしで治療", zh: "激光 — 无需口服药物治疗" },
    desc: { ko: "레이저는 손발톱을 통과하여 무좀균에 열을 가해 직접 제거합니다. 간 독성 등 먹는 항진균제의 부작용 없이 안전하게 치료합니다.", en: "Laser passes through the nail to apply heat directly to fungal organisms, eliminating them. Treatment is safe without the side effects of oral antifungals such as liver toxicity.", ja: "レーザーは爪を通過して水虫菌に熱を加えて直接除去します。肝毒性などの内服抗真菌薬の副作用なく安全に治療します。", zh: "激光穿透指甲对真菌施加热量直接消灭。无口服抗真菌药肝毒性等副作用，安全治疗。" },
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    icon: Microscope,
    title: { ko: "정확한 진균 감별 진단", en: "Accurate Fungal Differential Diagnosis", ja: "正確な真菌鑑別診断", zh: "准确的真菌鉴别诊断" },
    desc: { ko: "손발톱 변색이 모두 무좀은 아닙니다. 피부과 전문의가 현미경 검사로 무좀균 감염 여부를 정확히 확인한 후 치료합니다.", en: "Not all nail discoloration is fungal. Board-certified dermatologists confirm fungal infection through microscopic examination before treatment.", ja: "爪の変色がすべて水虫とは限りません。皮膚科専門医が顕微鏡検査で水虫菌感染の有無を正確に確認してから治療します。", zh: "并非所有指甲变色都是甲癣。皮肤科专科医生通过显微镜检查准确确认真菌感染后再进行治疗。" },
    color: "#4A6FA5",
    bg: "#EFF6FF",
  },
  {
    icon: Clock,
    title: { ko: "꾸준한 치료로 완치 가능", en: "Complete Cure Possible with Consistent Treatment", ja: "継続的な治療で完治可能", zh: "坚持治疗可完全治愈" },
    desc: { ko: "손발톱무좀은 손발톱이 완전히 자라나는 기간(6~12개월)에 맞춰 꾸준히 치료해야 합니다. 치료 계획을 세우고 정기적으로 방문하시면 완치가 가능합니다.", en: "Nail fungus requires consistent treatment aligned with the time it takes for nails to fully grow (6-12 months). A complete cure is possible with a treatment plan and regular visits.", ja: "爪水虫は爪が完全に生え変わる期間（6〜12ヶ月）に合わせて継続的に治療する必要があります。治療計画を立てて定期的に来院すれば完治が可能です。", zh: "甲癣需要配合指甲完全生长的时间（6-12个月）坚持治疗。制定治疗计划并定期复诊，可以完全治愈。" },
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: ShieldCheck,
    title: { ko: "재발 방지 교육", en: "Recurrence Prevention Education", ja: "再発防止教育", zh: "预防复发教育" },
    desc: { ko: "치료 후 재발 방지를 위한 생활 습관 교육을 제공합니다. 신발 관리, 발 위생, 공중 시설 이용 시 주의사항 등을 안내해 드립니다.", en: "Lifestyle education is provided to prevent recurrence after treatment, including guidance on shoe care, foot hygiene, and precautions when using public facilities.", ja: "治療後の再発防止のための生活習慣教育を提供します。靴の管理、足の衛生、公共施設利用時の注意事項などをご案内します。", zh: "提供治疗后预防复发的生活习惯教育，包括鞋子护理、足部卫生、使用公共设施时的注意事项等指导。" },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

const TARGETS_LABEL: ML = { ko: "이런 분께 추천드립니다", en: "Recommended For", ja: "こんな方にお勧めします", zh: "推荐人群" };
const TARGETS: ML[] = [
  { ko: "손발톱이 두꺼워지고 변색되어 고민이신 분", en: "Those troubled by thickened and discolored nails", ja: "爪が厚くなり変色してお悩みの方", zh: "指甲增厚变色的人" },
  { ko: "먹는 항진균제 복용이 어려우신 분 (간 질환, 약물 상호작용 등)", en: "Those who have difficulty taking oral antifungals (liver disease, drug interactions, etc.)", ja: "内服抗真菌薬の服用が難しい方（肝疾患、薬物相互作用など）", zh: "难以口服抗真菌药的人（肝病、药物相互作用等）" },
  { ko: "오랫동안 무좀 치료를 받아왔지만 효과가 없으신 분", en: "Those who have received long-term fungal treatment without results", ja: "長期間水虫治療を受けてきたが効果がない方", zh: "长期接受甲癣治疗但无效的人" },
  { ko: "여름철 샌들을 신기 부끄러울 정도로 손발톱 상태가 나쁜 분", en: "Those whose nail condition is too embarrassing to wear sandals in summer", ja: "夏にサンダルを履くのが恥ずかしいほど爪の状態が悪い方", zh: "指甲状况差到夏天不敢穿凉鞋的人" },
];

export default function NailFungusGuide() {
  const { lang } = useLang();
  return (
    <div className="space-y-8">
      <section>
        <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)", border: "1.5px solid #BBF7D0" }}>
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{ background: "#15803D", color: "#fff" }}>NAIL FUNGUS</span>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug" style={{ color: "#14532D" }}>{t(HERO, lang)}</h2>
          <p className="text-sm text-green-700 max-w-xl mx-auto leading-relaxed">{t(HERO_SUB, lang)}</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{lang === "en" ? "Why Choose Star Dermatology for Nail Fungus?" : lang === "ja" ? "爪水虫治療の特別さ" : lang === "zh" ? "甲癣治疗的特别之处" : "스타피부과 손·발톱무좀 치료의 특별함"}</h3>
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
        <div className="rounded-2xl p-5" style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}>
          <ul className="space-y-3">{TARGETS.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-green-900"><CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#15803D" }} /><span>{t(item, lang)}</span></li>))}</ul>
        </div>
      </section>
    </div>
  );
}

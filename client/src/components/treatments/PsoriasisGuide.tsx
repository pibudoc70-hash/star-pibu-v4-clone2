/**
 * PsoriasisGuide.tsx — 건선·아토피 탭 전용 카테고리 소개 섹션
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Sun, Activity, Heart, Stethoscope } from "lucide-react";

type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

const HERO: ML = {
  ko: "건선·아토피 치료\n만성 피부 질환의 전문 관리",
  en: "Psoriasis & Atopic Dermatitis\nSpecialized Management of Chronic Skin Conditions",
  ja: "乾癬・アトピー治療\n慢性皮膚疾患の専門管理",
  zh: "银屑病·特应性皮炎治疗\n慢性皮肤病的专业管理",
};
const HERO_SUB: ML = {
  ko: "건선, 아토피 피부염 등 만성 피부 질환은 꾸준한 전문 치료가 중요합니다. 자외선 광선 치료와 엑시머 레이저로 면역 반응을 조절하여 증상을 효과적으로 완화합니다.",
  en: "Chronic skin conditions like psoriasis and atopic dermatitis require consistent specialized treatment. UV phototherapy and excimer laser regulate immune responses to effectively alleviate symptoms.",
  ja: "乾癬、アトピー性皮膚炎などの慢性皮膚疾患は継続的な専門治療が重要です。紫外線光線治療とエキシマレーザーで免疫反応を調節し症状を効果的に緩和します。",
  zh: "银屑病、特应性皮炎等慢性皮肤病需要持续的专业治疗。紫外线光疗和准分子激光调节免疫反应，有效缓解症状。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Sun,
    title: { ko: "자외선 광선 치료 (NBUVB)", en: "Narrowband UVB Phototherapy", ja: "ナローバンドUVB光線治療", zh: "窄谱UVB光疗" },
    desc: { ko: "311nm 협대역 자외선 B(NBUVB)는 건선과 아토피 치료의 표준 광선 치료법입니다. 면역 세포 활성을 억제하여 염증을 줄이고 증상을 완화합니다.", en: "311nm narrowband UVB is the standard phototherapy for psoriasis and atopic treatment. It suppresses immune cell activity to reduce inflammation and alleviate symptoms.", ja: "311nmナローバンドUVBは乾癬とアトピー治療の標準光線治療法です。免疫細胞活性を抑制して炎症を減らし症状を緩和します。", zh: "311nm窄谱UVB是银屑病和特应性皮炎治疗的标准光疗方法。通过抑制免疫细胞活性减少炎症并缓解症状。" },
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: Activity,
    title: { ko: "엑시머 레이저 — 국소 집중 치료", en: "Excimer Laser — Localized Intensive Treatment", ja: "エキシマレーザー — 局所集中治療", zh: "准分子激光 — 局部集中治疗" },
    desc: { ko: "308nm 엑시머 레이저는 병변 부위에만 집중적으로 자외선을 조사합니다. 전신 광선 치료보다 빠른 효과와 적은 부작용이 특징입니다.", en: "308nm excimer laser irradiates UV only on lesion areas intensively. It features faster results and fewer side effects than full-body phototherapy.", ja: "308nmエキシマレーザーは病変部位にのみ集中的に紫外線を照射します。全身光線治療より早い効果と少ない副作用が特徴です。", zh: "308nm准分子激光仅对病变部位集中照射紫外线。与全身光疗相比，效果更快，副作用更少。" },
    color: "#4A6FA5",
    bg: "#EFF6FF",
  },
  {
    icon: Heart,
    title: { ko: "장기 관리 계획 수립", en: "Long-term Management Planning", ja: "長期管理計画の策定", zh: "制定长期管理方案" },
    desc: { ko: "건선과 아토피는 완치보다 관리가 중요한 질환입니다. 재발 방지와 증상 최소화를 위한 개인별 장기 관리 계획을 함께 수립합니다.", en: "Psoriasis and atopic dermatitis are conditions where management is more important than cure. Individual long-term management plans are established together to prevent recurrence and minimize symptoms.", ja: "乾癬とアトピーは完治より管理が重要な疾患です。再発防止と症状最小化のための個別長期管理計画を一緒に策定します。", zh: "银屑病和特应性皮炎是管理比治愈更重要的疾病。共同制定个人长期管理方案，以防止复发并最小化症状。" },
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    icon: Stethoscope,
    title: { ko: "피부과 전문의 정밀 진단", en: "Precise Diagnosis by Board-certified Dermatologist", ja: "皮膚科専門医による精密診断", zh: "皮肤科专科医生精准诊断" },
    desc: { ko: "건선과 아토피는 유사한 다른 피부 질환과 감별 진단이 필요합니다. 피부과 전문의의 정밀 진단으로 정확한 치료를 받으실 수 있습니다.", en: "Psoriasis and atopic dermatitis require differential diagnosis from similar skin conditions. Precise diagnosis by board-certified dermatologists ensures accurate treatment.", ja: "乾癬とアトピーは類似した他の皮膚疾患との鑑別診断が必要です。皮膚科専門医の精密診断で正確な治療を受けられます。", zh: "银屑病和特应性皮炎需要与类似皮肤病进行鉴别诊断。通过皮肤科专科医生的精准诊断，获得准确的治疗。" },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

const TARGETS_LABEL: ML = { ko: "이런 분께 추천드립니다", en: "Recommended For", ja: "こんな方にお勧めします", zh: "推荐人群" };
const TARGETS: ML[] = [
  { ko: "건선으로 인한 비늘 모양 피부 병변이 있으신 분", en: "Those with scaly skin lesions due to psoriasis", ja: "乾癬による鱗状の皮膚病変がある方", zh: "因银屑病出现鳞状皮肤病变的人" },
  { ko: "아토피 피부염으로 가려움증과 습진이 반복되는 분", en: "Those with recurring itching and eczema from atopic dermatitis", ja: "アトピー性皮膚炎でかゆみと湿疹が繰り返す方", zh: "因特应性皮炎反复出现瘙痒和湿疹的人" },
  { ko: "기존 치료에 효과가 없어 새로운 치료를 찾으시는 분", en: "Those seeking new treatment after existing treatments have been ineffective", ja: "既存の治療に効果がなく新しい治療を探している方", zh: "现有治疗无效、寻求新治疗方案的人" },
  { ko: "재발이 잦아 장기 관리 계획이 필요하신 분", en: "Those with frequent recurrence who need a long-term management plan", ja: "再発が多く長期管理計画が必要な方", zh: "复发频繁、需要长期管理方案的人" },
];

export default function PsoriasisGuide() {
  const { lang } = useLang();
  return (
    <div className="space-y-8">
      <section>
        <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #F0FDF4 100%)", border: "1.5px solid #FDE68A" }}>
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{ background: "#D97706", color: "#fff" }}>PSORIASIS & ATOPIC</span>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug" style={{ color: "#78350F" }}>{t(HERO, lang)}</h2>
          <p className="text-sm text-amber-700 max-w-xl mx-auto leading-relaxed">{t(HERO_SUB, lang)}</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">{lang === "en" ? "Why Choose Star Dermatology for Psoriasis & Atopic?" : lang === "ja" ? "乾癬・アトピー治療の特別さ" : lang === "zh" ? "银屑病·特应性皮炎治疗的特别之处" : "스타피부과 건선·아토피 치료의 특별함"}</h3>
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
        <div className="rounded-2xl p-5" style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}>
          <ul className="space-y-3">{TARGETS.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-sm text-amber-900"><CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#D97706" }} /><span>{t(item, lang)}</span></li>))}</ul>
        </div>
      </section>
    </div>
  );
}

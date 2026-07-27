/**
 * AcneGuide.tsx — 여드름 탭 전용 카테고리 소개 섹션
 * Equipment3.tsx에서 여드름 탭 선택 시 카드 그리드 상단에 표시
 * 참고: StemCellGuide.tsx 패턴 동일 적용
 * 출처: star-pibu.co.kr/sub/sub_02_01.html
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Users, Zap, ShieldCheck } from "lucide-react";

// ── 다국어 헬퍼 ──────────────────────────────────────────────────────────────
type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

// ── 콘텐츠 데이터 ────────────────────────────────────────────────────────────
const HERO: ML = {
  ko: "여드름, 여드름 흉터, 피지 분비!\n근본 원인을 개선하는 신개념 여드름 치료",
  en: "Acne, Acne Scars & Sebum!\nNext-generation treatment targeting the root cause",
  ja: "ニキビ・ニキビ跡・皮脂分泌！\n根本原因を改善する新概念のニキビ治療",
  zh: "痤疮、痤疮疤痕、皮脂分泌！\n针对根本原因的新概念痤疮治疗",
};

const HERO_SUB: ML = {
  ko: "피지선만을 타겟으로 하므로 다른 피부 조직에 피해가 없으며, 시술 후 바로 화장·일상생활이 가능합니다.",
  en: "Targets only sebaceous glands with no damage to surrounding tissue. Makeup and daily activities are possible immediately after treatment.",
  ja: "皮脂腺のみをターゲットにするため他の皮膚組織へのダメージがなく、施術後すぐにメイク・日常生活が可能です。",
  zh: "仅针对皮脂腺，不损伤其他皮肤组织，治疗后可立即化妆、正常生活。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Zap,
    title: { ko: "피지선 직접 타겟", en: "Direct Sebaceous Gland Targeting", ja: "皮脂腺への直接アプローチ", zh: "直接靶向皮脂腺" },
    desc: { ko: "피지선까지 효과적으로 에너지가 전달되어 여드름 개선 효과가 높습니다.", en: "Energy is effectively delivered to the sebaceous glands for high acne improvement.", ja: "皮脂腺まで効果的にエネルギーが届き、ニキビ改善効果が高いです。", zh: "能量有效传递至皮脂腺，痤疮改善效果显著。" },
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: ShieldCheck,
    title: { ko: "안전한 쿨링 시스템", en: "Safe Cooling System", ja: "安全なクーリングシステム", zh: "安全冷却系统" },
    desc: { ko: "효과적인 쿨링 시스템으로 표피층에는 손상 없이 안전한 시술이 가능합니다.", en: "Effective cooling system allows safe treatment without damaging the epidermis.", ja: "効果的なクーリングシステムにより表皮層を傷つけず安全な施術が可能です。", zh: "高效冷却系统，不损伤表皮层，安全施术。" },
    color: "#0369A1",
    bg: "#EFF6FF",
  },
  {
    icon: CheckCircle2,
    title: { ko: "지속적인 개선 효과", en: "Lasting Improvement", ja: "持続的な改善効果", zh: "持续改善效果" },
    desc: { ko: "여드름 근본 원인인 피지선 치료를 통해 지속적인 여드름 개선이 가능합니다.", en: "Treating the root cause — sebaceous glands — enables lasting acne improvement.", ja: "ニキビの根本原因である皮脂腺を治療することで持続的な改善が可能です。", zh: "通过治疗痤疮根本原因——皮脂腺，实现持续改善。" },
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    icon: Users,
    title: { ko: "다양한 부가 효과", en: "Multiple Additional Benefits", ja: "多様な付加効果", zh: "多种附加效果" },
    desc: { ko: "여드름뿐만 아니라 붉음증 개선, 모공 축소 효과까지 기대할 수 있습니다.", en: "Beyond acne, expect improvements in redness and pore reduction.", ja: "ニキビだけでなく赤みの改善、毛穴縮小効果も期待できます。", zh: "除痤疮外，还可期待改善红肿、缩小毛孔的效果。" },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

const TARGETS_LABEL: ML = { ko: "이런 분께 추천드립니다", en: "Recommended For", ja: "こんな方にお勧めします", zh: "推荐人群" };
const TARGETS: ML[] = [
  { ko: "여드름 후유증 흉터 자국으로 고민이신 분", en: "Those troubled by post-acne scars", ja: "ニキビ後の瘢痕跡でお悩みの方", zh: "有痤疮后遗疤痕烦恼的人" },
  { ko: "과한 피지 분비와 큰 모공, 블랙헤드 때문에 고민이신 분", en: "Those with excess sebum, enlarged pores, or blackheads", ja: "過剰な皮脂分泌・大きな毛穴・黒ずみでお悩みの方", zh: "因皮脂分泌过多、毛孔粗大、黑头烦恼的人" },
  { ko: "만성적으로 턱·입 주변, 볼 주위에 나타나는 여드름으로 고민이신 분", en: "Those with chronic acne around the chin, mouth, or cheeks", ja: "慢性的に顎・口周り・頬にニキビが出る方", zh: "慢性下巴、嘴周围、脸颊反复长痘的人" },
  { ko: "성인 여드름, 화농성 여드름으로 깨끗한 피부를 원하시는 분", en: "Adults with hormonal or cystic acne seeking clear skin", ja: "大人ニキビ・化膿性ニキビで綺麗な肌を望む方", zh: "成人痤疮、化脓性痤疮想要清洁肌肤的人" },
];

// ── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function AcneGuide() {
  const { lang } = useLang();

  return (
    <div className="space-y-8">
      {/* ── 1. 히어로 소개 ── */}
      <section>
        <div
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{ background: "linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)", border: "1.5px solid #FDE68A" }}
        >
          <span
            className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
            style={{ background: "#D97706", color: "#fff" }}
          >
            ACNE CLINIC
          </span>
          <h2
            className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug"
            style={{ color: "#92400E" }}
          >
            {t(HERO, lang)}
          </h2>
          <p className="text-sm text-amber-700 max-w-xl mx-auto leading-relaxed">
            {t(HERO_SUB, lang)}
          </p>
        </div>
      </section>

      {/* ── 2. 스타피부과 여드름 치료의 특별함 ── */}
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">
          {lang === "en" ? "Why Star Dermatology for Acne?"
            : lang === "ja" ? "スター皮膚科のニキビ治療の特別さ"
            : lang === "zh" ? "星皮肤科痤疮治疗的特别之处"
            : "스타피부과 여드름 치료의 특별함"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-2xl p-4 flex gap-3 items-start"
                style={{ background: f.bg, border: `1.5px solid ${f.color}22` }}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: f.color + "20" }}
                >
                  <Icon size={18} style={{ color: f.color }} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: f.color }}>
                    {t(f.title, lang)}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{t(f.desc, lang)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. 시술 대상 ── */}
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">
          {t(TARGETS_LABEL, lang)}
        </h3>
        <div
          className="rounded-2xl p-5"
          style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}
        >
          <ul className="space-y-3">
            {TARGETS.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-amber-900">
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#D97706" }} />
                <span>{t(item, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

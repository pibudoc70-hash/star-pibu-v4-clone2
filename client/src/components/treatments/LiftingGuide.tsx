/**
 * LiftingGuide.tsx — 리프팅·탄력 탭 전용 카테고리 소개 섹션
 * Equipment3.tsx에서 리프팅·탄력 탭 선택 시 카드 그리드 상단에 표시
 * 참고: AcneGuide.tsx / StemCellGuide.tsx 패턴 동일 적용
 * 출처: star-pibu.co.kr/sub/sub_02_10.html
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Users, Layers, Sparkles, FlaskConical } from "lucide-react";

// ── 다국어 헬퍼 ──────────────────────────────────────────────────────────────
type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

// ── 콘텐츠 데이터 ────────────────────────────────────────────────────────────
const HERO: ML = {
  ko: "안티에이징 효과를 극대화한\n복합 리프팅",
  en: "Complex Lifting for\nMaximum Anti-Aging Effect",
  ja: "アンチエイジング効果を最大化した\n複合リフティング",
  zh: "最大化抗衰老效果的\n复合提升治疗",
};

const HERO_SUB: ML = {
  ko: "하나의 시술로는 부족했던 효과, 다양한 레이저 복합시술로 빈틈없이 완벽한 피부를 탄생시키다! 각 레이저의 한계를 상호보완하여 피부 겉부터 속까지 모든 층을 공략합니다.",
  en: "Where a single treatment falls short, our multi-laser complex approach delivers comprehensive results — targeting every skin layer from surface to deep tissue.",
  ja: "1つの施術では足りなかった効果を、多様なレーザー複合施術で隙間なく完璧な肌へ。各レーザーの限界を相互補完し、肌の表面から内部まで全ての層にアプローチします。",
  zh: "单一疗法效果不足，多种激光复合疗法全面改善肌肤，相互补充各激光的局限，从表皮到深层全面攻克。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Layers,
    title: { ko: "피부 전 층 동시 공략", en: "All Skin Layers Targeted", ja: "皮膚全層への同時アプローチ", zh: "同时攻克皮肤全层" },
    desc: {
      ko: "SMAS(근막층)부터 진피층, 피하층까지 각 레이저가 담당 층을 분담하여 즉각적이고 강력한 리프팅 효과를 제공합니다.",
      en: "From the SMAS fascia to the dermis and subcutaneous layer, each laser targets its designated layer for immediate, powerful lifting.",
      ja: "SMAS（筋膜層）から真皮層、皮下層まで各レーザーが担当層を分担し、即効的で強力なリフティング効果を提供します。",
      zh: "从SMAS筋膜层到真皮层、皮下层，各激光分工负责，提供即时强效提升效果。",
    },
    color: "#1D4ED8",
    bg: "#EFF6FF",
  },
  {
    icon: FlaskConical,
    title: { ko: "개인 맞춤형 복합 시술", en: "Personalized Combination", ja: "個人맞춤型複合施術", zh: "个性化复合疗法" },
    desc: {
      ko: "표피 두께, 콜라겐 생성도, 피부 나이 등 개개인의 피부 상태를 과학적으로 분석하여 전문의가 직접 맞춤 설계합니다.",
      en: "Our specialists scientifically analyze each patient's skin thickness, collagen density, and skin age to design a personalized treatment plan.",
      ja: "表皮の厚さ、コラーゲン生成度、皮膚年齢など個々の皮膚状態を科学的に分析し、専門医が直接カスタム設計します。",
      zh: "专业医生科学分析每位患者的表皮厚度、胶原蛋白生成度、皮肤年龄，量身定制治疗方案。",
    },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: Sparkles,
    title: { ko: "검증된 정품 장비 사용", en: "Certified Original Equipment", ja: "認証済み正規品機器の使用", zh: "使用经认证的正品设备" },
    desc: {
      ko: "스타피부과는 검증된 기기와 정품 팁만을 사용합니다. 최상의 장비는 최고의 기술과 만났을 때 더욱 효과적입니다.",
      en: "Star Dermatology uses only certified devices and genuine tips. The best equipment delivers even better results when combined with expert technique.",
      ja: "スター皮膚科は認証済み機器と正規品チップのみを使用します。最高の機器は最高の技術と出会ったとき、より効果的です。",
      zh: "星皮肤科仅使用经认证的设备和正品耗材。最佳设备与顶级技术结合，效果更加显著。",
    },
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: Users,
    title: { ko: "풍부한 임상 경험", en: "Extensive Clinical Experience", ja: "豊富な臨床経験", zh: "丰富的临床经验" },
    desc: {
      ko: "풍부한 임상 경험과 노하우로 효과를 높여 드립니다. 피부과 전문의가 직접 시술하여 안전하고 확실한 결과를 보장합니다.",
      en: "Our extensive clinical experience and know-how maximize results. Board-certified dermatologists perform every procedure for safe, reliable outcomes.",
      ja: "豊富な臨床経験とノウハウで効果を高めます。皮膚科専門医が直接施術し、安全で確実な結果をお約束します。",
      zh: "凭借丰富的临床经验和专业技术提升效果。皮肤科专科医生亲自操作，保证安全可靠的结果。",
    },
    color: "#15803D",
    bg: "#F0FDF4",
  },
];

const TARGETS_LABEL: ML = {
  ko: "이런 분께 추천드립니다",
  en: "Recommended For",
  ja: "こんな方にお勧めします",
  zh: "推荐人群",
};

const TARGETS: ML[] = [
  {
    ko: "이중턱과 볼살, 심술보 등으로 고민이신 분",
    en: "Those troubled by double chin, chubby cheeks, or jowls",
    ja: "二重顎・頬肉・たるみでお悩みの方",
    zh: "有双下巴、脸颊松弛、赘肉烦恼的人",
  },
  {
    ko: "수술 없이 얼굴이 작아 보이고 싶으신 분",
    en: "Those who want a slimmer face without surgery",
    ja: "手術なしで小顔に見せたい方",
    zh: "不想手术却想要小脸效果的人",
  },
  {
    ko: "주름 개선과 V라인을 동시에 원하시는 분",
    en: "Those seeking both wrinkle improvement and a V-line",
    ja: "シワ改善とVラインを同時に望む方",
    zh: "同时希望改善皱纹和打造V脸的人",
  },
  {
    ko: "피부결, 모공, 볼륨 등 전체적인 피부 개선 효과를 원하시는 분",
    en: "Those wanting overall skin improvement including texture, pores, and volume",
    ja: "肌質・毛穴・ボリュームなど全体的な肌改善効果を望む方",
    zh: "希望全面改善肤质、毛孔、轮廓等的人",
  },
  {
    ko: "양악 및 윤곽 수술 후 턱선 관리를 원하시는 분",
    en: "Those who want jawline care after orthognathic or contouring surgery",
    ja: "両顎・輪郭手術後の顎ラインのケアを望む方",
    zh: "双颌及轮廓手术后希望进行下颌线管理的人",
  },
];

// ── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function LiftingGuide() {
  const { lang } = useLang();

  return (
    <div className="space-y-8">
      {/* ── 1. 히어로 소개 ── */}
      <section>
        <div
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #EDE9FE 100%)", border: "1.5px solid #BFDBFE" }}
        >
          <span
            className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
            style={{ background: "#1D4ED8", color: "#fff" }}
          >
            LIFTING CLINIC
          </span>
          <h2
            className="text-xl sm:text-2xl font-extrabold mb-3 whitespace-pre-line leading-snug"
            style={{ color: "#1E3A8A" }}
          >
            {t(HERO, lang)}
          </h2>
          <p className="text-sm text-blue-700 max-w-xl mx-auto leading-relaxed">
            {t(HERO_SUB, lang)}
          </p>
        </div>
      </section>

      {/* ── 2. 복합 리프팅의 특별함 ── */}
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">
          {lang === "en"
            ? "Why Choose Complex Lifting?"
            : lang === "ja"
            ? "複合リフティングの特別さ"
            : lang === "zh"
            ? "复合提升的特别之处"
            : "복합 리프팅의 특별함"}
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
          style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE" }}
        >
          <ul className="space-y-3">
            {TARGETS.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-blue-900">
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
                <span>{t(item, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

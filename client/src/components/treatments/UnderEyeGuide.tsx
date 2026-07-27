/**
 * UnderEyeGuide.tsx — 눈밑지방재배치 탭 전용 카테고리 소개 섹션
 * Equipment3.tsx에서 눈밑지방재배치 탭 선택 시 카드 그리드 상단에 표시
 * 참고: AcneGuide.tsx / LiftingGuide.tsx 패턴 동일 적용
 * 출처: under-eye-fat.ts 데이터 + star-pibu.co.kr/sub/sub_02_11.html
 */
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Eye, Sparkles, ShieldCheck, Clock } from "lucide-react";
import { CLINIC_STATS } from "@/lib/constants";

// ── 다국어 헬퍼 ──────────────────────────────────────────────────────────────
type ML = { ko: string; en: string; ja: string; zh: string };
const t = (ml: ML, lang: string) =>
  lang === "en" ? ml.en : lang === "ja" ? ml.ja : lang === "zh" ? ml.zh : ml.ko;

// ── 시술 건수 ─────────────────────────────────────────────────────────────────
const _n = CLINIC_STATS.eyeBagCases.toLocaleString("ko-KR");

// ── 콘텐츠 데이터 ────────────────────────────────────────────────────────────
const HERO: ML = {
  ko: `${_n}례 이상의 경험\n다크서클과 눈밑 볼록함을 동시에 개선`,
  en: `Over ${_n} Cases of Experience\nSimultaneously Improve Dark Circles & Under-eye Puffiness`,
  ja: `${_n}例以上の経験\nクマと目の下のふくらみを同時に改善`,
  zh: `${_n}例以上丰富经验\n同时改善黑眼圈与眼下膨出`,
};

const HERO_SUB: ML = {
  ko: "눈 아래 과잉 축적된 지방을 제거하지 않고 꺼진 눈물고랑(tear trough) 부위로 재배치하여 다크서클과 눈밑 볼록함을 동시에 개선하는 스타피부과 대표 시술입니다.",
  en: "Star Dermatology's signature procedure repositions excess under-eye fat into the sunken tear trough — simultaneously improving dark circles and under-eye puffiness without removal.",
  ja: "目の下に過剰に蓄積した脂肪を除去せず、くぼんだ涙溝部位に再配置することで、クマと目の下のふくらみを同時に改善するスター皮膚科の代表施術です。",
  zh: "不切除眼下多余脂肪，而是将其重新填充至凹陷的泪沟区域，同时改善黑眼圈和眼下膨出，是STAR皮肤科的招牌施术。",
};

const FEATURES: { icon: typeof CheckCircle2; title: ML; desc: ML; color: string; bg: string }[] = [
  {
    icon: Eye,
    title: { ko: "지방 재배치 — 제거 없이 자연스럽게", en: "Fat Repositioning — Natural Without Removal", ja: "脂肪再配置 — 除去なしで自然に", zh: "脂肪重置 — 不切除，自然改善" },
    desc: {
      ko: "지방을 제거하지 않고 재배치하는 방식으로 시술 후 지방 공동이나 외관 변형이 거의 없고, 자연스러운 눈밑 라인을 기대할 수 있습니다.",
      en: "Because fat is repositioned rather than removed, there is virtually no hollow appearance or contour deformity after the procedure, and a natural under-eye contour can be expected.",
      ja: "脂肪を除去せず再配置する方式のため、施術後の脂肪空洞や外観変形がほとんどなく、自然な目の下のラインが期待できます。",
      zh: "由于是重置而非切除脂肪，术后几乎不会出现脂肪空洞或外观变形，可期待自然的眼下轮廓。",
    },
    color: "#4A6FA5",
    bg: "#EFF6FF",
  },
  {
    icon: ShieldCheck,
    title: { ko: "최소 절개 — 흉터 위험 최소화", en: "Minimal Incision — Reduced Scarring Risk", ja: "最小切開 — 傷跡リスクを最小化", zh: "最小切口 — 降低疤痕风险" },
    desc: {
      ko: "절개를 최소화하여 흉터 위험을 낮추고, 국소마취 후 진행하므로 통증도 최소화됩니다. 환자 요청 시 모니터링 진정 옵션도 제공합니다.",
      en: "Minimal incisions reduce scarring risk, and local anesthesia minimizes discomfort. Monitored sedation is available upon patient request.",
      ja: "切開を最小限に抑えて傷跡リスクを低減し、局所麻酔を使用するため痛みも最小化されます。患者様のご要望によりモニタリング鎮静オプションも提供します。",
      zh: "最小化切口降低疤痕风险，局部麻醉减轻疼痛。患者有需要时可提供监测镇静选项。",
    },
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    icon: Sparkles,
    title: { ko: "반영구적 효과 — 1회 시술", en: "Semi-permanent Results — 1 Session", ja: "半永久的効果 — 1回施術", zh: "半永久效果 — 1次施术" },
    desc: {
      ko: "지방을 재배치하는 방식이므로 반영구적인 효과를 기대할 수 있습니다. 1회 시술로 오랫동안 유지되는 자연스러운 눈밑 라인을 만들어 드립니다.",
      en: "Because fat is repositioned, the results are semi-permanent. A single session creates a natural under-eye contour that lasts for years.",
      ja: "脂肪を再配置する方式のため、半永久的な効果が期待できます。1回の施術で長期間維持される自然な目の下のラインを作ります。",
      zh: "由于是重置脂肪，效果为半永久性。一次施术即可打造长期维持的自然眼下轮廓。",
    },
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: Clock,
    title: { ko: "30~60분 시술 · 3~7일 회복", en: "30–60 Min Procedure · 3–7 Day Recovery", ja: "30〜60分施術 · 3〜7日回復", zh: "30～60分钟施术 · 3～7天恢复" },
    desc: {
      ko: "시술 시간은 30~60분으로 비교적 짧고, 회복 기간은 3~7일입니다. 완전한 결과 확인까지는 4~8주가 소요됩니다.",
      en: "The procedure takes 30–60 minutes, with a recovery period of 3–7 days. Full results can be assessed after 4–8 weeks.",
      ja: "施術時間は30〜60分と比較的短く、回復期間は3〜7日です。完全な結果の確認には4〜8週間かかります。",
      zh: "施术时间30～60分钟，恢复期3～7天。完整效果需4～8周才能评估。",
    },
    color: "#D97706",
    bg: "#FFFBEB",
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
    ko: "다크서클이 심하고 눈 아래가 항상 피곤해 보이는 분",
    en: "Those with severe dark circles who always look tired",
    ja: "クマがひどく、目の下がいつも疲れて見える方",
    zh: "黑眼圈严重、眼下总是看起来疲惫的人",
  },
  {
    ko: "눈밑 지방이 볼록하게 튀어나와 고민이신 분",
    en: "Those troubled by protruding under-eye fat pockets",
    ja: "目の下の脂肪がふくらんでいてお悩みの方",
    zh: "眼下脂肪膨出烦恼的人",
  },
  {
    ko: "눈물고랑(애교살 아래 꺼진 부분)이 깊어 그늘져 보이는 분",
    en: "Those with deep tear troughs creating shadowed hollows under the eyes",
    ja: "涙溝（애교살の下のくぼんだ部分）が深く影になって見える方",
    zh: "泪沟（眼下凹陷部分）深、形成阴影的人",
  },
  {
    ko: "필러 시술보다 더 자연스럽고 오래가는 효과를 원하시는 분",
    en: "Those seeking more natural and longer-lasting results than filler",
    ja: "フィラー施術よりも自然で長持ちする効果を望む方",
    zh: "希望比填充剂更自然、更持久效果的人",
  },
  {
    ko: "수술적 방법 없이 눈밑을 개선하고 싶으신 분",
    en: "Those who want to improve the under-eye area without major surgery",
    ja: "手術的な方法なしに目の下を改善したい方",
    zh: "不想进行大手术却想改善眼下的人",
  },
];

// ── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function UnderEyeGuide() {
  const { lang } = useLang();

  return (
    <div className="space-y-8">
      {/* ── 1. 히어로 소개 ── */}
      <section>
        <div
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)", border: "1.5px solid #BFDBFE" }}
        >
          <span
            className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
            style={{ background: "#4A6FA5", color: "#fff" }}
          >
            UNDER-EYE CLINIC
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

      {/* ── 2. 시술 특징 4가지 ── */}
      <section>
        <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-4 text-center">
          {lang === "en"
            ? "Why Choose Under-eye Fat Repositioning?"
            : lang === "ja"
            ? "目の下脂肪再配置の特別さ"
            : lang === "zh"
            ? "眼下脂肪重置术的特别之处"
            : "눈밑지방재배치의 특별함"}
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
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#4A6FA5" }} />
                <span>{t(item, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

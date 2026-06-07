/**
 * StemCellComparisonTable
 * 혈액줄기세포 vs 지방줄기세포 비교표 UI
 * - stem_cell 카테고리 탭 선택 시 시술 카드 위에 표시
 * - 4개 언어 지원 (ko / en / ja / zh)
 */
import { Check, X, Minus } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

// ── 비교 데이터 ────────────────────────────────────────────────────────────────
type CellValue = "good" | "better" | "moderate" | "low" | string;

interface CompareRow {
  label:   { ko: string; en: string; ja: string; zh: string };
  blood:   { value: CellValue; note?: { ko: string; en: string; ja: string; zh: string } };
  fat:     { value: CellValue; note?: { ko: string; en: string; ja: string; zh: string } };
}

const ROWS: CompareRow[] = [
  {
    label: { ko: "채취 방법", en: "Collection Method", ja: "採取方法", zh: "采集方式" },
    blood: { value: "채혈 (약 20~30ml)", note: { ko: "간단한 채혈만으로 준비", en: "Simple blood draw", ja: "簡単な採血のみ", zh: "简单采血即可" } },
    fat:   { value: "지방흡입 (약 50~100ml)", note: { ko: "소량 지방 채취 필요", en: "Minor liposuction required", ja: "少量の脂肪採取が必要", zh: "需少量抽脂" } },
  },
  {
    label: { ko: "줄기세포 수량", en: "Stem Cell Yield", ja: "幹細胞量", zh: "干细胞数量" },
    blood: { value: "moderate", note: { ko: "상대적으로 적은 양", en: "Relatively smaller yield", ja: "比較的少量", zh: "相对较少" } },
    fat:   { value: "better", note: { ko: "혈액 대비 수십 배 많음", en: "Tens of times more than blood", ja: "血液の数十倍", zh: "比血液多数十倍" } },
  },
  {
    label: { ko: "시술 시간", en: "Procedure Time", ja: "施術時間", zh: "治疗时间" },
    blood: { value: "60~90분", note: { ko: "비교적 짧은 시간", en: "Relatively short", ja: "比較的短時間", zh: "时间较短" } },
    fat:   { value: "90~120분", note: { ko: "지방 채취 과정 포함", en: "Includes fat collection", ja: "脂肪採取を含む", zh: "含脂肪采集过程" } },
  },
  {
    label: { ko: "회복 기간", en: "Recovery Period", ja: "回復期間", zh: "恢复期" },
    blood: { value: "good", note: { ko: "1~3일 (짧은 회복)", en: "1–3 days (quick recovery)", ja: "1〜3日（短い回復）", zh: "1~3天（快速恢复）" } },
    fat:   { value: "moderate", note: { ko: "3~7일 (채취 부위 포함)", en: "3–7 days (incl. donor site)", ja: "3〜7日（採取部位含む）", zh: "3~7天（含采集部位）" } },
  },
  {
    label: { ko: "이상반응 위험", en: "Adverse Reaction Risk", ja: "異常反応リスク", zh: "不良反应风险" },
    blood: { value: "low", note: { ko: "자가세포 사용으로 매우 낮음", en: "Very low (autologous cells)", ja: "自家細胞で非常に低い", zh: "自体细胞，极低" } },
    fat:   { value: "low", note: { ko: "자가세포 사용으로 매우 낮음", en: "Very low (autologous cells)", ja: "自家細胞で非常に低い", zh: "自体细胞，极低" } },
  },
  {
    label: { ko: "효과 지속", en: "Effect Duration", ja: "効果持続", zh: "效果持续" },
    blood: { value: "good", note: { ko: "수개월~1년", en: "Several months to 1 year", ja: "数ヶ月〜1年", zh: "数月至1年" } },
    fat:   { value: "better", note: { ko: "1년 이상 (더 긴 지속)", en: "1+ year (longer lasting)", ja: "1年以上（より長い）", zh: "1年以上（持续更久）" } },
  },
  {
    label: { ko: "주요 적응증", en: "Main Indications", ja: "主な適応症", zh: "主要适应症" },
    blood: { value: "피부 재생·탄력·수분", note: { ko: "전반적 피부 노화 개선", en: "Overall skin aging improvement", ja: "全般的な皮膚老化改善", zh: "整体皮肤老化改善" } },
    fat:   { value: "깊은 주름·볼륨·재생", note: { ko: "심한 노화·볼륨 감소 개선", en: "Severe aging & volume loss", ja: "重度の老化・ボリューム減少", zh: "严重老化及容量减少" } },
  },
  {
    label: { ko: "권장 대상", en: "Recommended For", ja: "推奨対象", zh: "推荐人群" },
    blood: { value: "초기 노화·간편 시술 선호", note: { ko: "빠른 회복 원하는 분", en: "Those seeking quick recovery", ja: "早い回復を望む方", zh: "希望快速恢复者" } },
    fat:   { value: "중등도 이상 노화·프리미엄", note: { ko: "강력한 효과 원하는 분", en: "Those seeking stronger effects", ja: "強力な効果を望む方", zh: "希望更强效果者" } },
  },
];

// ── 값 렌더 헬퍼 ───────────────────────────────────────────────────────────────
function ValueBadge({ value, lang }: { value: CellValue; lang: string }) {
  const labels: Record<string, Record<string, string>> = {
    good:     { ko: "양호", en: "Good",     ja: "良好",   zh: "良好" },
    better:   { ko: "우수", en: "Better",   ja: "優秀",   zh: "优秀" },
    moderate: { ko: "보통", en: "Moderate", ja: "普通",   zh: "一般" },
    low:      { ko: "낮음", en: "Low",      ja: "低い",   zh: "低" },
  };

  if (value === "good") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "#DCFCE7", color: "#166534" }}>
        <Check size={12} strokeWidth={2.5} /> {labels.good[lang] ?? labels.good.ko}
      </span>
    );
  }
  if (value === "better") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "#D1FAE5", color: "#065F46" }}>
        <Check size={12} strokeWidth={2.5} /> {labels.better[lang] ?? labels.better.ko}
      </span>
    );
  }
  if (value === "moderate") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "#FEF9C3", color: "#854D0E" }}>
        <Minus size={12} strokeWidth={2.5} /> {labels.moderate[lang] ?? labels.moderate.ko}
      </span>
    );
  }
  if (value === "low") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "#DCFCE7", color: "#166534" }}>
        <Check size={12} strokeWidth={2.5} /> {labels.low[lang] ?? labels.low.ko}
      </span>
    );
  }
  // 텍스트 값
  return <span className="text-sm font-medium" style={{ color: "#1F2937" }}>{value}</span>;
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
export default function StemCellComparisonTable() {
  const { lang } = useLang();

  const headings = {
    ko: { title: "혈액줄기세포 vs 지방줄기세포", subtitle: "두 치료법의 주요 특징을 한눈에 비교해 보세요", item: "비교 항목", blood: "혈액줄기세포", fat: "지방줄기세포" },
    en: { title: "Blood vs Fat Stem Cell", subtitle: "Compare the key features of both therapies at a glance", item: "Category", blood: "Blood Stem Cell", fat: "Fat Stem Cell" },
    ja: { title: "血液幹細胞 vs 脂肪幹細胞", subtitle: "2つの治療法の主な特徴を一目で比較できます", item: "比較項目", blood: "血液幹細胞", fat: "脂肪幹細胞" },
    zh: { title: "血液干细胞 vs 脂肪干细胞", subtitle: "一目了然地比较两种疗法的主要特点", item: "比较项目", blood: "血液干细胞", fat: "脂肪干细胞" },
  };
  const h = headings[lang as keyof typeof headings] ?? headings.ko;

  return (
    <div
      className="rounded-2xl overflow-hidden mb-8"
      style={{ border: "1.5px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
    >
      {/* 헤더 배너 */}
      <div
        className="px-6 py-5 text-center"
        style={{ background: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)" }}
      >
        <p className="text-xs tracking-widest mb-1 font-montserrat" style={{ color: "#6EE7B7", fontWeight: 300 }}>
          STEM CELL COMPARISON
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{h.title}</h3>
        <p className="text-sm" style={{ color: "#A7F3D0" }}>{h.subtitle}</p>
      </div>

      {/* 테이블 — 데스크탑 */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7280", width: "26%", borderBottom: "2px solid #E5E7EB" }}>
                {h.item}
              </th>
              {/* 혈액줄기세포 헤더 */}
              <th className="px-5 py-3.5 text-center text-sm font-bold" style={{ color: "#065F46", borderBottom: "2px solid #E5E7EB", width: "37%" }}>
                <div className="flex flex-col items-center gap-1">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold" style={{ background: "#059669" }}>
                    B
                  </span>
                  {h.blood}
                </div>
              </th>
              {/* 지방줄기세포 헤더 */}
              <th className="px-5 py-3.5 text-center text-sm font-bold" style={{ color: "#7C3AED", borderBottom: "2px solid #E5E7EB", width: "37%" }}>
                <div className="flex flex-col items-center gap-1">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold" style={{ background: "#7C3AED" }}>
                    F
                  </span>
                  {h.fat}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, idx) => (
              <tr
                key={idx}
                style={{ background: idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}
              >
                {/* 항목명 */}
                <td className="px-5 py-4 text-sm font-semibold" style={{ color: "#374151" }}>
                  {row.label[lang as keyof typeof row.label] ?? row.label.ko}
                </td>
                {/* 혈액줄기세포 값 */}
                <td className="px-5 py-4 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <ValueBadge value={row.blood.value} lang={lang} />
                    {row.blood.note && (
                      <span className="text-xs" style={{ color: "#6B7280" }}>
                        {row.blood.note[lang as keyof typeof row.blood.note] ?? row.blood.note.ko}
                      </span>
                    )}
                  </div>
                </td>
                {/* 지방줄기세포 값 */}
                <td className="px-5 py-4 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <ValueBadge value={row.fat.value} lang={lang} />
                    {row.fat.note && (
                      <span className="text-xs" style={{ color: "#6B7280" }}>
                        {row.fat.note[lang as keyof typeof row.fat.note] ?? row.fat.note.ko}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드형 레이아웃 */}
      <div className="sm:hidden divide-y divide-gray-100">
        {ROWS.map((row, idx) => (
          <div key={idx} className="px-4 py-4" style={{ background: idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB" }}>
            {/* 항목명 */}
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#9CA3AF" }}>
              {row.label[lang as keyof typeof row.label] ?? row.label.ko}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* 혈액줄기세포 */}
              <div className="rounded-xl p-3" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "#065F46" }}>{h.blood}</p>
                <div className="flex flex-col gap-1">
                  <ValueBadge value={row.blood.value} lang={lang} />
                  {row.blood.note && (
                    <span className="text-xs mt-1" style={{ color: "#6B7280" }}>
                      {row.blood.note[lang as keyof typeof row.blood.note] ?? row.blood.note.ko}
                    </span>
                  )}
                </div>
              </div>
              {/* 지방줄기세포 */}
              <div className="rounded-xl p-3" style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "#7C3AED" }}>{h.fat}</p>
                <div className="flex flex-col gap-1">
                  <ValueBadge value={row.fat.value} lang={lang} />
                  {row.fat.note && (
                    <span className="text-xs mt-1" style={{ color: "#6B7280" }}>
                      {row.fat.note[lang as keyof typeof row.fat.note] ?? row.fat.note.ko}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 안내 */}
      <div className="px-5 py-4 text-center" style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          {lang === "en" && "※ The appropriate treatment is determined through individual consultation with the attending physician."}
          {lang === "ja" && "※ 適切な治療法は担当医師との個別カウンセリングにより決定されます。"}
          {lang === "zh" && "※ 适合的治疗方法将通过与主治医生的个别咨询后决定。"}
          {(lang === "ko" || !["en","ja","zh"].includes(lang)) && "※ 적합한 치료법은 담당 의료진과의 개별 상담을 통해 결정됩니다."}
        </p>
      </div>
    </div>
  );
}

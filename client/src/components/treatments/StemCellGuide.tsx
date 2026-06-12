/**
 * StemCellGuide.tsx
 *
 * 줄기세포 치료 탭 상단에 표시되는 환자 친화적 안내 섹션.
 *
 * 구성:
 *  1. 줄기세포 치료란? — 핵심 개념 3가지 카드
 *  2. SVF vs 지방배양줄기세포 차이점 — 비교 테이블 + 선택 가이드
 *  3. 치료 흐름 — 단계별 타임라인
 *
 * 다국어: ko / en / ja / zh
 * 의존: useLang (LangContext)
 */
import { useLang } from "@/contexts/LangContext";
import { Droplets, Zap, ShieldCheck, Clock, Microscope, FlaskConical, ChevronRight, Info } from "lucide-react";

// ── 타입 ──────────────────────────────────────────────────────────────────────
type L = { ko: string; en: string; ja: string; zh: string };
function t(l: L, lang: string) {
  return l[lang as keyof L] ?? l.ko;
}

// ── 데이터 ────────────────────────────────────────────────────────────────────
const WHAT_IS: { icon: React.ElementType; color: string; bg: string; title: L; body: L }[] = [
  {
    icon: Droplets,
    color: "#2E7D32",
    bg: "#F0FDF4",
    title: {
      ko: "자가세포 치료",
      en: "Autologous Cell Therapy",
      ja: "自家細胞治療",
      zh: "自体细胞疗法",
    },
    body: {
      ko: "내 몸에서 채취한 혈액 또는 지방에서 줄기세포를 분리하여 다시 피부에 주입합니다. 타인의 세포나 합성 물질을 사용하지 않아 거부반응·이상반응 위험이 매우 낮습니다.",
      en: "Stem cells are separated from your own blood or fat and re-injected into the skin. Since no foreign cells or synthetic substances are used, the risk of rejection or adverse reactions is very low.",
      ja: "自分の血液または脂肪から幹細胞を分離して皮膚に再注入します。他人の細胞や合成物質を使用しないため、拒絶反応・異常反応のリスクが非常に低いです。",
      zh: "从自身血液或脂肪中分离干细胞后重新注入皮肤。不使用他人细胞或合成物质，排斥反应和不良反应风险极低。",
    },
  },
  {
    icon: Zap,
    color: "#B45309",
    bg: "#FFFBEB",
    title: {
      ko: "피부 재생 원리",
      en: "Skin Regeneration Mechanism",
      ja: "皮膚再生の仕組み",
      zh: "皮肤再生原理",
    },
    body: {
      ko: "주입된 줄기세포는 손상된 피부 세포 주변에서 성장인자·사이토카인을 분비하여 콜라겐·엘라스틴 합성을 촉진합니다. 피부 탄력 회복, 주름 완화, 피부톤 개선 효과를 기대할 수 있습니다.",
      en: "Injected stem cells secrete growth factors and cytokines around damaged skin cells, stimulating collagen and elastin synthesis. You can expect improved skin elasticity, reduced wrinkles, and better skin tone.",
      ja: "注入された幹細胞は損傷した皮膚細胞の周辺で成長因子・サイトカインを分泌し、コラーゲン・エラスチンの合成を促進します。皮膚弾力回復、しわ軽減、肌トーン改善が期待できます。",
      zh: "注入的干细胞在受损皮肤细胞周围分泌生长因子和细胞因子，促进胶原蛋白和弹性蛋白合成。可期待皮肤弹力恢复、皱纹减少、肤色改善等效果。",
    },
  },
  {
    icon: ShieldCheck,
    color: "#1D4ED8",
    bg: "#EFF6FF",
    title: {
      ko: "안전성과 지속성",
      en: "Safety & Longevity",
      ja: "安全性と持続性",
      zh: "安全性与持久性",
    },
    body: {
      ko: "자가세포를 사용하므로 알레르기 반응이 없으며, 효과는 수개월~1년 이상 지속됩니다. 필러나 보톡스와 달리 피부 자체의 재생력을 높이는 근본적 치료입니다.",
      en: "Since autologous cells are used, there are no allergic reactions, and effects last from several months to over a year. Unlike fillers or Botox, it is a fundamental treatment that enhances the skin's own regenerative capacity.",
      ja: "自家細胞を使用するためアレルギー反応がなく、効果は数ヶ月〜1年以上持続します。フィラーやボトックスと異なり、皮膚自体の再生力を高める根本的な治療です。",
      zh: "使用自体细胞，无过敏反应，效果持续数月至1年以上。与填充剂或肉毒素不同，这是提升皮肤自身再生能力的根本性治疗。",
    },
  },
];

// ── SVF vs 지방배양줄기세포 비교 데이터 ──────────────────────────────────────
const COMPARISON_ROWS: { label: L; svf: L; cultured: L; highlight?: "svf" | "cultured" | "both" }[] = [
  {
    label: { ko: "정식 명칭", en: "Official Name", ja: "正式名称", zh: "正式名称" },
    svf: {
      ko: "SVF (Stromal Vascular Fraction)\n기질혈관분획",
      en: "SVF (Stromal Vascular Fraction)",
      ja: "SVF（間質血管分画）",
      zh: "SVF（基质血管组分）",
    },
    cultured: {
      ko: "지방유래 줄기세포\n(ADSC, Adipose-Derived Stem Cell)",
      en: "ADSC (Adipose-Derived Stem Cell)",
      ja: "脂肪由来幹細胞（ADSC）",
      zh: "脂肪源干细胞（ADSC）",
    },
  },
  {
    label: { ko: "세포 준비 방법", en: "Cell Preparation", ja: "細胞準備方法", zh: "细胞制备方法" },
    svf: {
      ko: "지방 채취 → 효소 처리 → 원심분리\n(당일 시술 가능)",
      en: "Fat harvest → Enzymatic digestion → Centrifugation\n(Same-day procedure)",
      ja: "脂肪採取→酵素処理→遠心分離\n（当日施術可能）",
      zh: "采集脂肪→酶处理→离心分离\n（当日可手术）",
    },
    cultured: {
      ko: "지방 채취 → SVF 분리 → 실험실 배양(2~4주)\n(별도 배양 기간 필요)",
      en: "Fat harvest → SVF isolation → Lab culture (2–4 weeks)\n(Requires separate culture period)",
      ja: "脂肪採取→SVF分離→実験室培養（2〜4週間）\n（別途培養期間が必要）",
      zh: "采集脂肪→SVF分离→实验室培养（2~4周）\n（需要单独培养期）",
    },
    highlight: "svf",
  },
  {
    label: { ko: "세포 순도", en: "Cell Purity", ja: "細胞純度", zh: "细胞纯度" },
    svf: {
      ko: "혼합 세포군\n(줄기세포 + 혈관내피세포 + 면역세포 등)",
      en: "Mixed cell population\n(Stem cells + Endothelial + Immune cells)",
      ja: "混合細胞群\n（幹細胞＋血管内皮細胞＋免疫細胞等）",
      zh: "混合细胞群\n（干细胞+血管内皮细胞+免疫细胞等）",
    },
    cultured: {
      ko: "고순도 줄기세포\n(불필요한 세포 제거 후 순수 ADSC만 농축)",
      en: "High-purity stem cells\n(Pure ADSC concentrated after removing unwanted cells)",
      ja: "高純度幹細胞\n（不要な細胞を除去後、純粋なADSCのみを濃縮）",
      zh: "高纯度干细胞\n（去除不需要的细胞后浓缩纯ADSC）",
    },
    highlight: "cultured",
  },
  {
    label: { ko: "세포 수", en: "Cell Count", ja: "細胞数", zh: "细胞数量" },
    svf: {
      ko: "중간 수준\n(지방 50ml 기준 약 1~5×10⁷개)",
      en: "Moderate\n(~1–5×10⁷ cells per 50ml fat)",
      ja: "中程度\n（脂肪50ml基準で約1〜5×10⁷個）",
      zh: "中等水平\n（50ml脂肪约1~5×10⁷个）",
    },
    cultured: {
      ko: "매우 많음\n(배양 후 수십억 개까지 증식 가능)",
      en: "Very high\n(Can expand to billions after culture)",
      ja: "非常に多い\n（培養後、数十億個まで増殖可能）",
      zh: "非常多\n（培养后可增殖至数十亿个）",
    },
    highlight: "cultured",
  },
  {
    label: { ko: "시술 당일 가능 여부", en: "Same-Day Procedure", ja: "当日施術可否", zh: "当日手术可行性" },
    svf: {
      ko: "가능\n(채취~주입 동일 날 완료)",
      en: "Yes\n(Harvest to injection completed same day)",
      ja: "可能\n（採取〜注入を同日に完了）",
      zh: "可以\n（采集到注射当天完成）",
    },
    cultured: {
      ko: "불가\n(배양 완료 후 별도 방문 필요)",
      en: "No\n(Separate visit required after culture)",
      ja: "不可\n（培養完了後に別途来院が必要）",
      zh: "不可\n（培养完成后需单独就诊）",
    },
    highlight: "svf",
  },
  {
    label: { ko: "주요 적응증", en: "Main Indications", ja: "主な適応症", zh: "主要适应症" },
    svf: {
      ko: "초중기 피부 노화\n탄력 저하·피부결 개선·수분 보충",
      en: "Early-to-mid skin aging\nElasticity loss, texture improvement, hydration",
      ja: "初中期の皮膚老化\n弾力低下・肌質改善・水分補給",
      zh: "初中期皮肤老化\n弹力下降、肌肤质感改善、补水",
    },
    cultured: {
      ko: "중등도 이상 노화·깊은 주름\n볼륨 감소·심한 피부 손상",
      en: "Moderate-to-severe aging, deep wrinkles\nVolume loss, severe skin damage",
      ja: "中等度以上の老化・深いしわ\nボリューム減少・重度の皮膚損傷",
      zh: "中度以上老化、深皱纹\n容量减少、严重皮肤损伤",
    },
  },
  {
    label: { ko: "회복 기간", en: "Recovery Period", ja: "回復期間", zh: "恢复期" },
    svf: {
      ko: "3~5일\n(채취 부위 경미한 붓기)",
      en: "3–5 days\n(Mild swelling at harvest site)",
      ja: "3〜5日\n（採取部位の軽度の腫れ）",
      zh: "3~5天\n（采集部位轻微肿胀）",
    },
    cultured: {
      ko: "5~7일\n(배양 과정 추가로 전체 기간 더 김)",
      en: "5–7 days\n(Longer overall due to culture process)",
      ja: "5〜7日\n（培養過程が追加されるため全体期間が長い）",
      zh: "5~7天\n（因培养过程整体时间更长）",
    },
  },
  {
    label: { ko: "비용 수준", en: "Cost Level", ja: "費用水準", zh: "费用水平" },
    svf: {
      ko: "중간 수준",
      en: "Moderate",
      ja: "中程度",
      zh: "中等",
    },
    cultured: {
      ko: "높음\n(배양 비용 포함)",
      en: "Higher\n(Includes culture costs)",
      ja: "高い\n（培養費用を含む）",
      zh: "较高\n（含培养费用）",
    },
  },
];

// ── 치료 흐름 (SVF 기준) ──────────────────────────────────────────────────────
const FLOW_SVF: { step: number; title: L; body: L; time: L }[] = [
  {
    step: 1,
    title: { ko: "사전 상담", en: "Consultation", ja: "事前カウンセリング", zh: "事前咨询" },
    body: {
      ko: "피부 상태 진단, 치료 목표 설정, 적합한 줄기세포 치료 유형 결정",
      en: "Skin diagnosis, treatment goal setting, determining the appropriate stem cell therapy type",
      ja: "皮膚状態診断、治療目標設定、適切な幹細胞治療タイプの決定",
      zh: "皮肤状态诊断、治疗目标设定、确定适合的干细胞治疗类型",
    },
    time: { ko: "30분", en: "30 min", ja: "30分", zh: "30分钟" },
  },
  {
    step: 2,
    title: { ko: "지방 채취", en: "Fat Harvest", ja: "脂肪採取", zh: "脂肪采集" },
    body: {
      ko: "복부·허벅지 등에서 국소마취 후 소량의 지방(50~100ml) 채취",
      en: "Small amount of fat (50–100ml) harvested from abdomen or thighs under local anesthesia",
      ja: "腹部・太ももなどに局所麻酔後、少量の脂肪（50〜100ml）を採取",
      zh: "局部麻醉后从腹部、大腿等部位采集少量脂肪（50~100ml）",
    },
    time: { ko: "20~30분", en: "20–30 min", ja: "20〜30分", zh: "20~30分钟" },
  },
  {
    step: 3,
    title: { ko: "줄기세포 분리·농축", en: "Isolation & Concentration", ja: "幹細胞分離・濃縮", zh: "干细胞分离浓缩" },
    body: {
      ko: "효소 처리 및 원심분리로 SVF 분리. 배양 치료 시 추가 2~4주 배양 과정 진행",
      en: "SVF isolated via enzymatic treatment and centrifugation. For cultured therapy, additional 2–4 week culture process",
      ja: "酵素処理と遠心分離でSVFを分離。培養治療の場合は追加で2〜4週間の培養過程を実施",
      zh: "通过酶处理和离心分离SVF。培养治疗时进行额外2~4周培养过程",
    },
    time: { ko: "1~2시간 (SVF) / 2~4주 (배양)", en: "1–2 hrs (SVF) / 2–4 wks (Cultured)", ja: "1〜2時間（SVF）/ 2〜4週間（培養）", zh: "1~2小时（SVF）/ 2~4周（培养）" },
  },
  {
    step: 4,
    title: { ko: "피부 주입", en: "Skin Injection", ja: "皮膚注入", zh: "皮肤注射" },
    body: {
      ko: "노화 부위에 정밀 미세 주사. 필요 시 레이저·고주파 시술과 병행 가능",
      en: "Precise micro-injection into aging areas. Can be combined with laser or RF treatments if needed",
      ja: "老化部位に精密マイクロ注射。必要に応じてレーザー・高周波施術との併用も可能",
      zh: "对老化部位进行精准微注射。必要时可与激光、射频治疗联合使用",
    },
    time: { ko: "30~60분", en: "30–60 min", ja: "30〜60分", zh: "30~60分钟" },
  },
  {
    step: 5,
    title: { ko: "회복 및 효과 발현", en: "Recovery & Results", ja: "回復と効果発現", zh: "恢复与效果显现" },
    body: {
      ko: "시술 후 3~7일 붓기·멍 가능. 1~3개월 내 피부 재생 효과 점진적 발현",
      en: "Possible swelling/bruising 3–7 days post-procedure. Gradual skin regeneration effects within 1–3 months",
      ja: "施術後3〜7日間、腫れ・あざが出る場合あり。1〜3ヶ月以内に皮膚再生効果が徐々に現れる",
      zh: "术后3~7天可能出现肿胀瘀青。1~3个月内皮肤再生效果逐渐显现",
    },
    time: { ko: "1~3개월 (효과 완성)", en: "1–3 months (full effect)", ja: "1〜3ヶ月（効果完成）", zh: "1~3个月（效果完成）" },
  },
];

// ── 선택 가이드 ───────────────────────────────────────────────────────────────
const CHOICE_GUIDE: { icon: React.ElementType; color: string; bg: string; border: string; title: L; points: L[] }[] = [
  {
    icon: Droplets,
    color: "#2E7D32",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    title: { ko: "SVF가 적합한 경우", en: "When SVF is Recommended", ja: "SVFが適している場合", zh: "适合SVF的情况" },
    points: [
      { ko: "초중기 피부 노화 (탄력 저하, 피부결 거칠어짐)", en: "Early-to-mid skin aging (elasticity loss, rough texture)", ja: "初中期の皮膚老化（弾力低下、肌質の粗さ）", zh: "初中期皮肤老化（弹力下降、肌肤粗糙）" },
      { ko: "빠른 회복이 필요한 분 (당일 시술 완료)", en: "Those needing quick recovery (same-day procedure)", ja: "早い回復が必要な方（当日施術完了）", zh: "需要快速恢复的人（当天完成手术）" },
      { ko: "비교적 합리적인 비용으로 줄기세포 치료를 원하는 분", en: "Those seeking stem cell therapy at a relatively reasonable cost", ja: "比較的リーズナブルな費用で幹細胞治療を希望する方", zh: "希望以相对合理费用进行干细胞治疗的人" },
      { ko: "전반적인 피부 수분·광채 개선이 목표인 분", en: "Those aiming for overall skin hydration and radiance improvement", ja: "全体的な皮膚水分・光沢改善が目標の方", zh: "以全面改善皮肤水分和光泽为目标的人" },
    ],
  },
  {
    icon: FlaskConical,
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    title: { ko: "지방배양줄기세포가 적합한 경우", en: "When Cultured ADSC is Recommended", ja: "脂肪培養幹細胞が適している場合", zh: "适合脂肪培养干细胞的情况" },
    points: [
      { ko: "중등도 이상의 심한 피부 노화 (깊은 주름, 볼륨 감소)", en: "Moderate-to-severe skin aging (deep wrinkles, volume loss)", ja: "中等度以上の重度の皮膚老化（深いしわ、ボリューム減少）", zh: "中度以上严重皮肤老化（深皱纹、容量减少）" },
      { ko: "더 많은 줄기세포로 강력한 재생 효과를 원하는 분", en: "Those seeking stronger regeneration with more stem cells", ja: "より多くの幹細胞で強力な再生効果を望む方", zh: "希望通过更多干细胞获得强效再生效果的人" },
      { ko: "장기적이고 지속적인 효과를 원하는 프리미엄 치료 희망자", en: "Those seeking premium treatment with long-lasting effects", ja: "長期的で持続的な効果を望むプレミアム治療希望者", zh: "希望获得长期持续效果的高端治疗需求者" },
      { ko: "2~4주 대기 기간이 가능한 분", en: "Those who can wait 2–4 weeks for culture", ja: "2〜4週間の待機期間が可能な方", zh: "可以等待2~4周培养期的人" },
    ],
  },
];

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
export default function StemCellGuide() {
  const { lang } = useLang();

  const SECTION_LABELS = {
    whatIs: { ko: "줄기세포 치료란?", en: "What is Stem Cell Therapy?", ja: "幹細胞治療とは？", zh: "什么是干细胞治疗？" },
    whatIsDesc: {
      ko: "내 몸의 세포를 활용해 피부 스스로 재생하도록 돕는 자연 친화적 치료입니다.",
      en: "A nature-friendly treatment that helps the skin regenerate itself using your own cells.",
      ja: "自分の細胞を活用して皮膚が自ら再生するのを助ける自然親和的な治療です。",
      zh: "利用自身细胞帮助皮肤自我再生的自然友好型治疗。",
    },
    compare: { ko: "SVF vs 지방배양줄기세포 — 무엇이 다른가요?", en: "SVF vs Cultured ADSC — What's the Difference?", ja: "SVF vs 脂肪培養幹細胞 — 何が違うの？", zh: "SVF vs 脂肪培养干细胞 — 有什么区别？" },
    compareDesc: {
      ko: "두 치료 모두 지방에서 줄기세포를 얻지만, 세포 준비 방법과 적응증이 다릅니다.",
      en: "Both therapies obtain stem cells from fat, but differ in cell preparation method and indications.",
      ja: "どちらの治療も脂肪から幹細胞を得ますが、細胞準備方法と適応症が異なります。",
      zh: "两种治疗都从脂肪中获取干细胞，但细胞制备方法和适应症不同。",
    },
    flow: { ko: "치료 과정은 어떻게 진행되나요?", en: "How Does the Treatment Process Work?", ja: "治療過程はどのように進むの？", zh: "治疗过程是如何进行的？" },
    flowDesc: {
      ko: "SVF 기준 당일 시술 흐름입니다. 배양 치료는 3단계에서 2~4주 추가됩니다.",
      en: "Same-day procedure flow based on SVF. Cultured therapy adds 2–4 weeks at step 3.",
      ja: "SVF基準の当日施術の流れです。培養治療はステップ3で2〜4週間追加されます。",
      zh: "基于SVF的当天手术流程。培养治疗在第3步增加2~4周。",
    },
    choiceGuide: { ko: "어떤 치료가 나에게 맞을까요?", en: "Which Treatment is Right for Me?", ja: "どの治療が自分に合っているの？", zh: "哪种治疗适合我？" },
    choiceDesc: {
      ko: "아래 기준을 참고하되, 최종 결정은 반드시 담당 의료진과 상담 후 결정하세요.",
      en: "Use the guide below as a reference, but always consult with your physician for the final decision.",
      ja: "以下の基準を参考にしつつ、最終決定は必ず担当医師との相談後に決めてください。",
      zh: "参考以下标准，但最终决定请务必与主治医生咨询后确定。",
    },
    svfLabel: { ko: "SVF (당일 시술)", en: "SVF (Same-Day)", ja: "SVF（当日施術）", zh: "SVF（当日手术）" },
    culturedLabel: { ko: "지방배양줄기세포 (ADSC)", en: "Cultured ADSC", ja: "脂肪培養幹細胞（ADSC）", zh: "脂肪培养干细胞（ADSC）" },
    highlight: { ko: "유리", en: "Advantage", ja: "有利", zh: "优势" },
    consultNote: {
      ko: "※ 위 내용은 일반적인 안내이며, 개인 피부 상태에 따라 다를 수 있습니다. 정확한 치료 계획은 담당 의료진과 상담 후 결정됩니다.",
      en: "※ The above is general guidance and may vary depending on individual skin condition. The exact treatment plan is determined after consultation with your physician.",
      ja: "※ 上記は一般的な案内であり、個人の皮膚状態によって異なる場合があります。正確な治療計画は担当医師との相談後に決定されます。",
      zh: "※ 以上为一般性说明，可能因个人皮肤状况而有所不同。具体治疗方案将在与主治医生咨询后确定。",
    },
  };

  return (
    <div className="space-y-10 mb-10">
      {/* ── 1. 줄기세포 치료란? ── */}
      <section aria-labelledby="stemcell-what-is">
        <div className="text-center mb-6">
          <p className="text-xs tracking-widest font-montserrat font-light mb-2" style={{ color: "var(--color-gold-primary)" }}>
            STEM CELL THERAPY
          </p>
          <h3 id="stemcell-what-is" className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-2">
            {t(SECTION_LABELS.whatIs, lang)}
          </h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {t(SECTION_LABELS.whatIsDesc, lang)}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHAT_IS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{ background: item.bg, border: `1.5px solid ${item.color}22` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: item.color + "18" }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <h4 className="font-bold text-sm mb-2" style={{ color: item.color }}>
                  {t(item.title, lang)}
                </h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  {t(item.body, lang)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 2. SVF vs 지방배양줄기세포 비교 ── */}
      <section aria-labelledby="stemcell-compare">
        <div className="text-center mb-6">
          <p className="text-xs tracking-widest font-montserrat font-light mb-2" style={{ color: "var(--color-gold-primary)" }}>
            SVF vs CULTURED ADSC
          </p>
          <h3 id="stemcell-compare" className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-2">
            {t(SECTION_LABELS.compare, lang)}
          </h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {t(SECTION_LABELS.compareDesc, lang)}
          </p>
        </div>

        {/* 데스크탑 테이블 */}
        <div className="hidden sm:block rounded-2xl overflow-hidden" style={{ border: "1.5px solid #E5E7EB", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
                <th className="px-5 py-4 text-left font-semibold text-gray-500 w-[26%]">
                  {lang === "ko" ? "비교 항목" : lang === "en" ? "Category" : lang === "ja" ? "比較項目" : "比较项目"}
                </th>
                <th className="px-5 py-4 text-center font-bold w-[37%]" style={{ color: "#2E7D32" }}>
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold" style={{ background: "#2E7D32" }}>
                      <Droplets size={14} />
                    </span>
                    {t(SECTION_LABELS.svfLabel, lang)}
                  </div>
                </th>
                <th className="px-5 py-4 text-center font-bold w-[37%]" style={{ color: "#7C3AED" }}>
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold" style={{ background: "#7C3AED" }}>
                      <FlaskConical size={14} />
                    </span>
                    {t(SECTION_LABELS.culturedLabel, lang)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
                  <td className="px-5 py-4 font-semibold text-gray-700 text-xs">
                    {t(row.label, lang)}
                  </td>
                  <td
                    className="px-5 py-4 text-center text-xs leading-relaxed"
                    style={{
                      color: row.highlight === "svf" ? "#166534" : "#374151",
                      background: row.highlight === "svf" ? "#F0FDF4" : undefined,
                      fontWeight: row.highlight === "svf" ? 600 : 400,
                    }}
                  >
                    {row.highlight === "svf" && (
                      <span className="inline-block mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#DCFCE7", color: "#166534" }}>
                        {t(SECTION_LABELS.highlight, lang)}
                      </span>
                    )}
                    <div className="whitespace-pre-line">{t(row.svf, lang)}</div>
                  </td>
                  <td
                    className="px-5 py-4 text-center text-xs leading-relaxed"
                    style={{
                      color: row.highlight === "cultured" ? "#5B21B6" : "#374151",
                      background: row.highlight === "cultured" ? "#F5F3FF" : undefined,
                      fontWeight: row.highlight === "cultured" ? 600 : 400,
                    }}
                  >
                    {row.highlight === "cultured" && (
                      <span className="inline-block mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#EDE9FE", color: "#5B21B6" }}>
                        {t(SECTION_LABELS.highlight, lang)}
                      </span>
                    )}
                    <div className="whitespace-pre-line">{t(row.cultured, lang)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드형 */}
        <div className="sm:hidden space-y-3">
          {COMPARISON_ROWS.map((row, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
              <div className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wide" style={{ background: "#F3F4F6" }}>
                {t(row.label, lang)}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                <div
                  className="p-3 text-xs leading-relaxed"
                  style={{
                    background: row.highlight === "svf" ? "#F0FDF4" : "#FAFAFA",
                    color: row.highlight === "svf" ? "#166534" : "#374151",
                  }}
                >
                  <p className="font-bold text-[10px] mb-1" style={{ color: "#2E7D32" }}>SVF</p>
                  {row.highlight === "svf" && (
                    <span className="inline-block mb-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: "#DCFCE7", color: "#166534" }}>
                      {t(SECTION_LABELS.highlight, lang)}
                    </span>
                  )}
                  <div className="whitespace-pre-line">{t(row.svf, lang)}</div>
                </div>
                <div
                  className="p-3 text-xs leading-relaxed"
                  style={{
                    background: row.highlight === "cultured" ? "#F5F3FF" : "#FAFAFA",
                    color: row.highlight === "cultured" ? "#5B21B6" : "#374151",
                  }}
                >
                  <p className="font-bold text-[10px] mb-1" style={{ color: "#7C3AED" }}>ADSC</p>
                  {row.highlight === "cultured" && (
                    <span className="inline-block mb-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: "#EDE9FE", color: "#5B21B6" }}>
                      {t(SECTION_LABELS.highlight, lang)}
                    </span>
                  )}
                  <div className="whitespace-pre-line">{t(row.cultured, lang)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. 선택 가이드 ── */}
      <section aria-labelledby="stemcell-choice">
        <div className="text-center mb-6">
          <h3 id="stemcell-choice" className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-2">
            {t(SECTION_LABELS.choiceGuide, lang)}
          </h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {t(SECTION_LABELS.choiceDesc, lang)}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHOICE_GUIDE.map((guide, i) => {
            const Icon = guide.icon;
            return (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{ background: guide.bg, border: `1.5px solid ${guide.border}` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: guide.color + "20" }}
                  >
                    <Icon size={18} style={{ color: guide.color }} />
                  </div>
                  <h4 className="font-bold text-sm" style={{ color: guide.color }}>
                    {t(guide.title, lang)}
                  </h4>
                </div>
                <ul className="space-y-2">
                  {guide.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-700">
                      <ChevronRight size={13} className="mt-0.5 flex-shrink-0" style={{ color: guide.color }} />
                      <span>{t(point, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. 치료 흐름 ── */}
      <section aria-labelledby="stemcell-flow">
        <div className="text-center mb-6">
          <h3 id="stemcell-flow" className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-2">
            {t(SECTION_LABELS.flow, lang)}
          </h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {t(SECTION_LABELS.flowDesc, lang)}
          </p>
        </div>
        <div className="relative">
          {/* 세로 연결선 (데스크탑) */}
          <div className="hidden sm:block absolute left-[28px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-200 via-amber-200 to-purple-200" />
          <div className="space-y-3">
            {FLOW_SVF.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                {/* 스텝 번호 */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-sm"
                  style={{
                    background: i === 0 ? "#2E7D32" : i === 1 ? "#B45309" : i === 2 ? "#1D4ED8" : i === 3 ? "#7C3AED" : "#374151",
                  }}
                >
                  <span className="text-[10px] font-light opacity-80">STEP</span>
                  <span className="text-lg leading-none">{step.step}</span>
                </div>
                {/* 내용 */}
                <div
                  className="flex-1 rounded-2xl p-4"
                  style={{ background: "#FFFFFF", border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h4 className="font-bold text-sm text-gray-800">{t(step.title, lang)}</h4>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock size={10} />
                      {t(step.time, lang)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{t(step.body, lang)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 주의 안내 ── */}
      <div
        className="rounded-xl p-4 flex gap-3 items-start"
        style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
      >
        <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#B45309" }} />
        <p className="text-xs text-amber-800 leading-relaxed">
          {t(SECTION_LABELS.consultNote, lang)}
        </p>
      </div>
    </div>
  );
}

import { Activity, ChevronDown, ClipboardCheck, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import type { Lang } from "@/lib/i18n.types";

export const PAIN_MANAGEMENT_CATEGORY_ID = "pain-management";
export type PainManagementLang = "ko" | "en" | "ja" | "zh" | "zh-TW";

type Step = { icon: string; title: string; body: string };
type Faq = { question: string; answer: string };
type GuideCopy = {
  eyebrow: string;
  heroTitle: string;
  title: string;
  intro: string;
  visualHeading: string;
  visualCaption: string;
  careCheckpoints: string[];
  steps: Step[];
  experienceHeading: string;
  experienceBody: string;
  monitoringHeading: string;
  monitoringIntro: string;
  monitoringPoints: string[];
  beforeAfterHeading: string;
  beforeTitle: string;
  before: string[];
  afterTitle: string;
  after: string[];
  faqHeading: string;
  faqs: Faq[];
  closing: string;
};

export const PAIN_MANAGEMENT_CONTENT: Record<PainManagementLang, GuideCopy> = {
  ko: {
    eyebrow: "PAIN MANAGEMENT",
    heroTitle: "통증에 대한 두려움까지 고려하는 것이 시술 계획의 중요한 시작입니다",
    title: "개인별 통증관리 3단계",
    intro: "통증에 대한 걱정까지 고려하는 것이 시술 계획의 중요한 시작입니다. 스타피부과는 시술 특성과 환자 상태를 함께 살펴 통증관리 방법을 단계적으로 검토합니다.",
    visualHeading: "한눈에 보는 개인별 통증관리 3단계",
    visualCaption: "시술 특성과 개인 상태를 확인한 뒤, 필요한 단계만 의료진이 검토합니다.",
    careCheckpoints: ["사전 확인", "시술 중 관찰", "회복 안내"],
    steps: [
      { icon: "도포로 부담 완화", title: "① 연고마취", body: "시술 부위와 방법을 고려해 연고마취 적용 여부를 검토합니다. 적용 시간과 범위는 개인 상태와 의료진 안내에 따라 달라질 수 있습니다." },
      { icon: "필요 부위 진통", title: "② 주사 진통", body: "통증 조절이 더 필요한 부위에는 주사 진통 방법을 검토할 수 있습니다. 적용 여부와 방법은 시술 계획 및 개인 상태를 바탕으로 의료진이 안내합니다." },
      { icon: "사전 평가 후 검토", title: "③ 수면진정/수면마취", body: "수면진정/수면마취는 모든 시술에 일괄 적용되는 방법이 아닙니다. 필요 시 의료진의 사전 평가 후 시술 특성과 환자 상태에 맞는 선택지로 검토합니다." },
    ],
    experienceHeading: "20년 수면진정/수면마취 운영 경험",
    experienceBody: "스타피부과는 20년 동안 수면진정/수면마취 시술을 운영하며, 시술 전에는 건강 상태와 복용약, 알레르기, 과거력을 확인하고 의료진의 판단에 따라 개별 계획을 검토해 왔습니다. 시술 중에는 환자 상태를 지속적으로 살피고, 회복 단계에서는 필요한 안내와 귀가 관련 확인을 중요하게 관리합니다.",
    monitoringHeading: "시술 중 모니터링",
    monitoringIntro: "Kohden SpO₂ 모니터와 혈압측정기를 갖추고 환자 상태를 지속적으로 살핍니다. 관찰의 범위와 방법은 시술 및 개인 상태에 따라 달라질 수 있습니다.",
    monitoringPoints: ["Kohden SpO₂ 모니터를 통한 산소포화도 확인", "혈압측정기를 통한 혈압 변화 확인", "시술 전 확인사항을 바탕으로 한 의료진 관찰", "회복 단계의 상태 확인과 개별 안내"],
    beforeAfterHeading: "시술 전·후 안내",
    beforeTitle: "시술 전",
    before: ["건강상태·복용약·알레르기·과거력 확인 — 개인 상태에 따라 달라질 수 있음", "의료진 상담과 시술 방법·통증관리 계획 확인 — 개인 상태에 따라 달라질 수 있음", "개별 안내 사항 확인 — 개인 상태에 따라 달라질 수 있음"],
    afterTitle: "시술 후",
    after: ["회복 관찰과 의료진 안내 확인 — 개인 상태에 따라 달라질 수 있음", "보호자와의 귀가 여부 확인 — 개인 상태에 따라 달라질 수 있음", "운전·중요 의사결정 제한 등 의료진 안내 준수 — 개인 상태에 따라 달라질 수 있음"],
    faqHeading: "자주 묻는 질문",
    faqs: [
      { question: "모든 시술에 수면진정/수면마취가 필요한가요?", answer: "아닙니다. 시술 특성, 건강 상태, 복용약, 불안 및 통증 정도를 의료진이 함께 확인한 뒤 필요 시 수면진정/수면마취를 검토합니다." },
      { question: "연고마취와 주사 진통은 어떻게 결정되나요?", answer: "시술 부위와 방법, 통증에 대한 민감도, 건강 상태 등을 의료진이 종합해 연고마취 또는 주사 진통의 적용 여부와 순서를 개별 안내합니다." },
      { question: "모니터링은 어떻게 이뤄지나요?", answer: "Kohden SpO₂ 모니터와 혈압측정기를 바탕으로 환자 상태를 지속적으로 살피며, 관찰 방법과 범위는 시술 및 개인 상태에 따라 달라질 수 있습니다." },
      { question: "시술 전 무엇을 알려야 하나요?", answer: "건강상태, 복용약, 알레르기, 과거력과 임신 가능성 등을 상담 시 알려주세요. 확인 내용에 따라 시술 계획과 안내가 개인별로 달라질 수 있습니다." },
    ],
    closing: "통증에 대한 걱정까지 고려하는 것이, 시술 계획의 중요한 시작입니다.",
  },
  en: {
    eyebrow: "PAIN MANAGEMENT",
    heroTitle: "Considering fear of discomfort is an important beginning to a procedure plan.",
    title: "Three Steps of Individualized Pain Management",
    intro: "Considering concerns about discomfort is an important first step in planning a procedure. Star Dermatology reviews the procedure and each patient’s condition to consider pain-management options in stages.",
    visualHeading: "Individualized pain-management path at a glance",
    visualCaption: "After reviewing the procedure and individual condition, the medical team considers only the steps that may be needed.",
    careCheckpoints: ["Pre-procedure review", "Observation during care", "Recovery guidance"],
    steps: [
      { icon: "Topical support", title: "1. Topical anesthetic", body: "The care team reviews whether topical anesthetic is appropriate for the treatment area and procedure. The timing and coverage may vary according to individual condition and medical guidance." },
      { icon: "Local pain control", title: "2. Injectable pain control", body: "For areas that may require additional pain control, an injectable option may be considered. The approach is explained by the medical team based on the treatment plan and individual condition." },
      { icon: "After medical assessment", title: "3. Sedation / anesthesia", body: "Sedation or anesthesia is not routinely applied to every procedure. When needed, it is considered as an option after a medical assessment of the procedure and the patient’s condition." },
    ],
    experienceHeading: "20 years of sedation/anesthesia procedure operations",
    experienceBody: "For 20 years, Star Dermatology has operated procedures involving sedation or anesthesia, reviewing health status, medication use, allergies, and medical history before the procedure. The team places importance on observing the patient during the procedure and providing recovery and discharge guidance afterward.",
    monitoringHeading: "Monitoring during the procedure",
    monitoringIntro: "A Kohden SpO₂ monitor and blood-pressure monitor are used to observe the patient’s condition continuously. The scope and method of observation may vary by procedure and individual condition.",
    monitoringPoints: ["Check oxygen saturation with a Kohden SpO₂ monitor", "Check blood-pressure changes with a blood-pressure monitor", "Medical observation based on pre-procedure findings", "Condition check and individualized guidance during recovery"],
    beforeAfterHeading: "Before and after the procedure",
    beforeTitle: "Before",
    before: ["Review health status, medication use, allergies, and medical history — may vary by individual condition", "Consult with the medical team and review the procedure and pain-management plan — may vary by individual condition", "Confirm individualized instructions — may vary by individual condition"],
    afterTitle: "After",
    after: ["Recovery observation and confirmation of medical guidance — may vary by individual condition", "Confirm whether discharge with a guardian is appropriate — may vary by individual condition", "Follow medical guidance on driving and important decision-making limits — may vary by individual condition"],
    faqHeading: "Frequently asked questions",
    faqs: [
      { question: "Does every procedure require sedation or anesthesia?", answer: "No. The medical team reviews the procedure, health status, medications, anxiety, and discomfort level, then considers sedation or anesthesia only when needed." },
      { question: "How are topical anesthetic and injectable pain control selected?", answer: "The medical team considers the treatment area, method, pain sensitivity, and health status, then provides individualized guidance on the appropriate option and order." },
      { question: "How is monitoring performed?", answer: "A Kohden SpO₂ monitor and blood-pressure monitor support continuous observation. The monitoring method and scope may vary by the procedure and individual condition." },
      { question: "What should I disclose before a procedure?", answer: "Please share your health status, medications, allergies, medical history, and possible pregnancy during consultation. The plan and guidance may vary with the information provided." },
    ],
    closing: "Considering concerns about discomfort is an important beginning to a treatment plan.",
  },
  ja: {
    eyebrow: "PAIN MANAGEMENT",
    heroTitle: "痛みに対する不安まで考えることが、施術計画の大切な出発点です。",
    title: "個別の痛み管理・3段階",
    intro: "痛みに対するご不安まで考えることが、施術計画の大切な出発点です。スター皮膚科では、施術の特性と患者様の状態を確認しながら、痛み管理の方法を段階的に検討します。",
    visualHeading: "ひと目でわかる個別の痛み管理の流れ",
    visualCaption: "施術の特性と個別の状態を確認し、必要な段階だけを医療スタッフが検討します。",
    careCheckpoints: ["施術前確認", "施術中の観察", "回復のご案内"],
    steps: [
      { icon: "塗布による配慮", title: "1. 麻酔クリーム", body: "施術部位と方法を考慮し、麻酔クリームの適用を検討します。適用時間と範囲は、個別の状態と医療スタッフの案内によって異なる場合があります。" },
      { icon: "必要部位の鎮痛", title: "2. 注射による鎮痛", body: "より痛みの調整が必要な部位には、注射による鎮痛を検討することがあります。適用の可否と方法は、施術計画と個別の状態をもとに医療スタッフがご案内します。" },
      { icon: "事前評価後に検討", title: "3. 鎮静／麻酔", body: "鎮静／麻酔は、すべての施術に一律で適用される方法ではありません。必要に応じ、医療スタッフの事前評価後に、施術特性と患者様の状態に合う選択肢として検討します。" },
    ],
    experienceHeading: "鎮静／麻酔を伴う施術運営 20年の経験",
    experienceBody: "スター皮膚科は20年間、鎮静／麻酔を伴う施術を運営し、施術前には健康状態、服用薬、アレルギー、既往歴を確認しながら個別の計画を検討してきました。施術中の状態観察と、回復段階での案内・帰宅に関する確認を大切に管理しています。",
    monitoringHeading: "施術中のモニタリング",
    monitoringIntro: "Kohden SpO₂モニターと血圧計を備え、患者様の状態を継続して確認します。観察の範囲と方法は、施術および個別の状態により異なる場合があります。",
    monitoringPoints: ["Kohden SpO₂モニターによる酸素飽和度の確認", "血圧計による血圧変化の確認", "施術前確認事項にもとづく医療スタッフの観察", "回復段階での状態確認と個別案内"],
    beforeAfterHeading: "施術前・後のご案内",
    beforeTitle: "施術前",
    before: ["健康状態・服用薬・アレルギー・既往歴の確認 — 個別の状態により異なる場合があります", "医療スタッフとの相談と施術・痛み管理計画の確認 — 個別の状態により異なる場合があります", "個別案内の確認 — 個別の状態により異なる場合があります"],
    afterTitle: "施術後",
    after: ["回復観察と医療スタッフ案内の確認 — 個別の状態により異なる場合があります", "保護者との帰宅が適切かの確認 — 個別の状態により異なる場合があります", "運転や重要な意思決定の制限など、医療スタッフの案内を守る — 個別の状態により異なる場合があります"],
    faqHeading: "よくあるご質問",
    faqs: [
      { question: "すべての施術に鎮静／麻酔が必要ですか？", answer: "いいえ。施術特性、健康状態、服用薬、不安や痛みの程度を医療スタッフが確認し、必要に応じて鎮静／麻酔を検討します。" },
      { question: "麻酔クリームと注射による鎮痛はどう決めますか？", answer: "施術部位・方法、痛みへの感受性、健康状態などを総合し、医療スタッフが適用の可否と順序を個別にご案内します。" },
      { question: "モニタリングはどのように行われますか？", answer: "Kohden SpO₂モニターと血圧計をもとに状態を継続して確認します。観察方法と範囲は、施術と個別の状態により異なる場合があります。" },
      { question: "施術前に何を伝える必要がありますか？", answer: "健康状態、服用薬、アレルギー、既往歴、妊娠の可能性などを相談時にお知らせください。内容により計画と案内が個別に異なる場合があります。" },
    ],
    closing: "痛みに対するご不安まで考えることが、施術計画の大切な出発点です。",
  },
  zh: {
    eyebrow: "PAIN MANAGEMENT",
    heroTitle: "将对不适的恐惧纳入考虑，是制定治疗计划的重要起点。",
    title: "个性化疼痛管理 3 个步骤",
    intro: "将对不适的担忧纳入考虑，是制定治疗计划的重要起点。STAR皮肤科会结合治疗特点与患者状态，分阶段评估疼痛管理方式。",
    visualHeading: "一目了然的个性化疼痛管理流程",
    visualCaption: "确认治疗特点和个人状态后，医护人员仅评估可能需要的阶段。",
    careCheckpoints: ["治疗前确认", "治疗中观察", "恢复说明"],
    steps: [
      { icon: "表麻舒缓", title: "1. 表面麻醉膏", body: "会根据治疗部位和方式评估是否使用表面麻醉膏。使用时间和范围可能因个人状态及医护人员说明而有所不同。" },
      { icon: "局部镇痛", title: "2. 注射镇痛", body: "对于可能需要进一步疼痛控制的部位，可评估注射镇痛方式。是否适用及具体方法将由医护人员依据治疗计划和个人状态说明。" },
      { icon: "评估后考虑", title: "3. 镇静／麻醉", body: "镇静／麻醉并非适用于所有治疗的固定方式。如有需要，会在医护人员事前评估后，作为符合治疗特点和患者状态的选项加以考虑。" },
    ],
    experienceHeading: "镇静／麻醉治疗运营 20 年经验",
    experienceBody: "STAR皮肤科已运营涉及镇静／麻醉的治疗20年，治疗前会确认健康状态、用药、过敏与既往病史，并依据医疗判断评估个别计划。治疗中重视持续观察患者状态，恢复阶段也重视必要说明与回家相关确认。",
    monitoringHeading: "治疗中的监测",
    monitoringIntro: "配备Kohden SpO₂监测仪与血压计，持续观察患者状态。观察范围与方法可能因治疗及个人状态而有所不同。",
    monitoringPoints: ["通过Kohden SpO₂监测仪确认血氧饱和度", "通过血压计确认血压变化", "基于治疗前确认事项进行医护观察", "恢复阶段的状态确认与个别说明"],
    beforeAfterHeading: "治疗前后说明",
    beforeTitle: "治疗前",
    before: ["确认健康状态、用药、过敏与既往病史 — 可能因个人状态而有所不同", "与医护人员咨询并确认治疗及疼痛管理计划 — 可能因个人状态而有所不同", "确认个别说明事项 — 可能因个人状态而有所不同"],
    afterTitle: "治疗后",
    after: ["恢复观察并确认医护人员说明 — 可能因个人状态而有所不同", "确认是否适合与陪护人员一同回家 — 可能因个人状态而有所不同", "遵守有关驾驶和重要决策限制等医护人员说明 — 可能因个人状态而有所不同"],
    faqHeading: "常见问题",
    faqs: [
      { question: "所有治疗都需要镇静／麻醉吗？", answer: "不需要。医护人员会结合治疗特点、健康状态、用药、焦虑和不适程度确认后，仅在需要时考虑镇静／麻醉。" },
      { question: "表面麻醉膏和注射镇痛如何决定？", answer: "医护人员会综合治疗部位、方式、疼痛敏感度与健康状态，并就是否适用及顺序提供个别说明。" },
      { question: "监测是如何进行的？", answer: "会使用Kohden SpO₂监测仪和血压计持续观察患者状态。监测方式与范围可能因治疗和个人状态而有所不同。" },
      { question: "治疗前需要告知什么？", answer: "请在咨询时告知健康状态、用药、过敏、既往病史及可能怀孕情况。治疗计划与说明可能因确认内容而有所不同。" },
    ],
    closing: "将对不适的担忧纳入考虑，是治疗计划的重要起点。",
  },
  "zh-TW": {
    eyebrow: "PAIN MANAGEMENT",
    heroTitle: "將對不適的恐懼納入考量，是規劃療程的重要起點。",
    title: "個人化疼痛管理 3 個步驟",
    intro: "將對不適的擔憂納入考量，是規劃療程的重要起點。STAR皮膚科會綜合療程特性與患者狀態，分階段評估疼痛管理方式。",
    visualHeading: "一目瞭然的個人化疼痛管理流程",
    visualCaption: "確認療程特性與個人狀態後，醫護人員僅評估可能需要的階段。",
    careCheckpoints: ["療程前確認", "療程中觀察", "恢復說明"],
    steps: [
      { icon: "表麻舒緩", title: "1. 表面麻醉膏", body: "會依療程部位與方式評估是否使用表面麻醉膏。使用時間與範圍可能因個人狀態及醫護人員說明而有所不同。" },
      { icon: "局部鎮痛", title: "2. 注射鎮痛", body: "對於可能需要進一步疼痛控制的部位，可評估注射鎮痛方式。是否適用及具體方法將由醫護人員依療程計畫與個人狀態說明。" },
      { icon: "評估後考量", title: "3. 鎮靜／麻醉", body: "鎮靜／麻醉並非適用於所有療程的固定方式。如有需要，會在醫護人員事前評估後，作為符合療程特性與患者狀態的選項加以考量。" },
    ],
    experienceHeading: "鎮靜／麻醉療程營運 20 年經驗",
    experienceBody: "STAR皮膚科已營運涉及鎮靜／麻醉的療程20年，療程前會確認健康狀態、用藥、過敏與既往病史，並依醫療判斷評估個別計畫。療程中重視持續觀察患者狀態，恢復階段也重視必要說明與返家相關確認。",
    monitoringHeading: "療程中的監測",
    monitoringIntro: "配備Kohden SpO₂監測儀與血壓計，持續觀察患者狀態。觀察範圍與方法可能因療程及個人狀態而有所不同。",
    monitoringPoints: ["透過Kohden SpO₂監測儀確認血氧飽和度", "透過血壓計確認血壓變化", "依療程前確認事項進行醫護觀察", "恢復階段的狀態確認與個別說明"],
    beforeAfterHeading: "療程前後說明",
    beforeTitle: "療程前",
    before: ["確認健康狀態、用藥、過敏與既往病史 — 可能因個人狀態而有所不同", "與醫護人員諮詢並確認療程及疼痛管理計畫 — 可能因個人狀態而有所不同", "確認個別說明事項 — 可能因個人狀態而有所不同"],
    afterTitle: "療程後",
    after: ["恢復觀察並確認醫護人員說明 — 可能因個人狀態而有所不同", "確認是否適合與陪同者一同返家 — 可能因個人狀態而有所不同", "遵守有關駕駛與重要決策限制等醫護人員說明 — 可能因個人狀態而有所不同"],
    faqHeading: "常見問題",
    faqs: [
      { question: "所有療程都需要鎮靜／麻醉嗎？", answer: "不需要。醫護人員會綜合療程特性、健康狀態、用藥、焦慮與不適程度確認後，僅在需要時考量鎮靜／麻醉。" },
      { question: "表面麻醉膏和注射鎮痛如何決定？", answer: "醫護人員會綜合療程部位、方式、疼痛敏感度與健康狀態，並就是否適用及順序提供個別說明。" },
      { question: "監測是如何進行的？", answer: "會使用Kohden SpO₂監測儀與血壓計持續觀察患者狀態。監測方式與範圍可能因療程和個人狀態而有所不同。" },
      { question: "療程前需要告知什麼？", answer: "請在諮詢時告知健康狀態、用藥、過敏、既往病史及可能懷孕情況。療程計畫與說明可能因確認內容而有所不同。" },
    ],
    closing: "將對不適的擔憂納入考量，是療程計畫的重要起點。",
  },
};

const STEP_ICONS = [Stethoscope, HeartPulse, ShieldCheck];

function resolveLang(lang: Lang): PainManagementLang {
  return lang === "ko" || lang === "en" || lang === "ja" || lang === "zh" || lang === "zh-TW" ? lang : "ko";
}

export function getPainManagementCategory(lang: Lang) {
  const copy = PAIN_MANAGEMENT_CONTENT[resolveLang(lang)];
  return { id: PAIN_MANAGEMENT_CATEGORY_ID, label: copy.title };
}

export default function PainManagementGuide({ lang }: { lang: Lang }) {
  const copy = PAIN_MANAGEMENT_CONTENT[resolveLang(lang)];
  const headingId = "pain-management-guide-title";

  return (
    <section className="rounded-2xl border border-[var(--color-gold-light)] bg-white p-5 sm:p-7" aria-labelledby={headingId}>
      <div className="mb-5 text-center sm:text-left">
        <span className="section-eyebrow text-[11px]">{copy.eyebrow}</span>
        <h2 id={headingId} className="mt-3 text-2xl font-semibold leading-snug text-[var(--color-star-text)] sm:text-3xl">{copy.heroTitle}</h2>
        <p className="mt-3 text-sm font-semibold text-[var(--color-gold-primary)]">{copy.title}</p>
      </div>

      <section className="pain-management-infographic mb-5 rounded-xl border border-[var(--color-gold-light)] bg-[var(--color-gold-pale)] p-4 sm:p-5" aria-label={copy.visualHeading}>
        <div className="text-center sm:text-left">
          <h3 className="text-base font-semibold text-[var(--color-star-text)]">{copy.visualHeading}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--color-star-text-mid)]">{copy.visualCaption}</p>
        </div>
        <ol className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          {copy.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Stethoscope;
            return (
              <li key={step.title} className="relative rounded-lg bg-white px-2 py-3 text-center shadow-sm">
                <span className="mx-auto flex size-7 items-center justify-center rounded-full bg-[var(--color-gold-primary)] text-xs font-bold text-white">{index + 1}</span>
                <Icon size={18} className="mx-auto mt-2 text-[var(--color-gold-deep)]" aria-hidden="true" />
                <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--color-star-text)]">{step.title.replace(/^[①②③]|^\d\.\s*/, "")}</span>
              </li>
            );
          })}
        </ol>
        <ul className="mt-4 grid gap-2 border-t border-[var(--color-gold-light)] pt-4 sm:grid-cols-3">
          {copy.careCheckpoints.map((checkpoint) => <li key={checkpoint} className="flex items-center justify-center gap-1.5 text-xs font-medium text-[var(--color-star-text-mid)]"><ClipboardCheck size={15} className="shrink-0 text-[var(--color-gold-deep)]" aria-hidden="true" />{checkpoint}</li>)}
        </ul>
      </section>

      <div className="rounded-xl border border-[var(--color-gold-light)] px-4">
        {copy.steps.map((step, index) => {
          const Icon = STEP_ICONS[index] ?? Stethoscope;
          return (
            <details key={step.title} data-testid={`pain-stage-${index + 1}`} className="pain-management-disclosure group border-b last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2">
                <span className="flex items-center gap-3 text-left">
                  <Icon size={20} className="shrink-0 text-[var(--color-gold-primary)]" aria-hidden="true" />
                  <span><span className="block text-sm font-semibold text-[var(--color-star-text)]">{step.title}</span><span className="mt-0.5 block text-xs font-medium text-[var(--color-star-text-mid)]">{step.icon}</span></span>
                </span>
                <ChevronDown size={18} className="shrink-0 text-[var(--color-star-text-mid)] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="pb-4 pl-8 text-sm text-[var(--color-star-text-mid)]"><p className="leading-6">{step.body}</p></div>
            </details>
          );
        })}
        <details data-testid="pain-experience" className="pain-management-disclosure group border-b last:border-b-0">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2"><span className="text-left text-sm font-semibold text-[var(--color-star-text)]">{copy.experienceHeading}</span><ChevronDown size={18} className="shrink-0 text-[var(--color-star-text-mid)] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" /></summary>
          <div className="pb-4 text-sm text-[var(--color-star-text-mid)]"><p className="leading-7">{copy.experienceBody}</p></div>
        </details>

        <details data-testid="pain-monitoring" className="pain-management-disclosure group border-b last:border-b-0">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2"><span className="flex items-center gap-2 text-left text-sm font-semibold text-[var(--color-star-text)]"><Activity size={19} className="text-[var(--color-gold-primary)]" aria-hidden="true" />{copy.monitoringHeading}</span><ChevronDown size={18} className="shrink-0 text-[var(--color-star-text-mid)] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" /></summary>
          <div className="pb-4 text-sm text-[var(--color-star-text-mid)]"><p className="leading-6">{copy.monitoringIntro}</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{copy.monitoringPoints.map((point) => <li key={point} className="flex gap-2 leading-6"><ClipboardCheck size={17} className="mt-0.5 shrink-0 text-[var(--color-gold-primary)]" aria-hidden="true" />{point}</li>)}</ul></div>
        </details>

        <details data-testid="pain-guidance" className="pain-management-disclosure group border-b last:border-b-0">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2"><span className="text-left text-sm font-semibold text-[var(--color-star-text)]">{copy.beforeAfterHeading}</span><ChevronDown size={18} className="shrink-0 text-[var(--color-star-text-mid)] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" /></summary>
          <div className="grid gap-3 pb-4 text-sm text-[var(--color-star-text-mid)] sm:grid-cols-2">{[[copy.beforeTitle, copy.before], [copy.afterTitle, copy.after]].map(([title, items]) => <div key={title as string} className="rounded-xl bg-[var(--color-gold-pale)] p-4"><h3 className="font-semibold text-[var(--color-star-text)]">{title}</h3><ul className="mt-3 space-y-2 leading-6">{(items as string[]).map((item) => <li key={item}>• {item}</li>)}</ul></div>)}</div>
        </details>

        <details data-testid="pain-faq" className="pain-management-disclosure group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2"><span className="text-left text-sm font-semibold text-[var(--color-star-text)]">{copy.faqHeading}</span><ChevronDown size={18} className="shrink-0 text-[var(--color-star-text-mid)] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" /></summary>
          <dl className="space-y-4 pb-4 text-sm text-[var(--color-star-text-mid)]">{copy.faqs.map((faq) => <div key={faq.question}><dt className="font-semibold text-[var(--color-star-text)]">{faq.question}</dt><dd className="mt-1 leading-6">{faq.answer}</dd></div>)}</dl>
        </details>
      </div>
    </section>
  );
}

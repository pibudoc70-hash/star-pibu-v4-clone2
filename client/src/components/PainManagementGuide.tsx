import { useState } from "react";
import { Activity, ChevronDown, CircleHelp, ClipboardCheck, FileText, HeartPulse, Moon, ShieldCheck, Stethoscope } from "lucide-react";
import type { Lang } from "@/lib/i18n.types";
import { PAIN_MANAGEMENT_KO_FAQS } from "@/lib/painManagementFaq";

export const PAIN_MANAGEMENT_CATEGORY_ID = "pain-management";
export type PainManagementLang = "ko" | "en" | "ja" | "zh" | "zh-TW";

type Step = { icon: string; title: string; body: string };
type Faq = { question: string; answer: string };
type Checkpoint = { label: string; detail: string };
type GuideCopy = {
  eyebrow: string;
  heroTitle: string;
  title: string;
  categoryLabel: string;
  intro: string;
  visualHeading: string;
  visualCaption: string;
  expandStep: string;
  collapseStep: string;
  expandMobilePanel: string;
  collapseMobilePanel: string;
  trustHeading: string;
  expandTrust: string;
  collapseTrust: string;
  careCheckpoints: Checkpoint[];
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
    heroTitle: "통증에 대한 부담까지 고려하는 것이 시술 계획의 중요한 시작입니다",
    title: "개인별 통증관리 3단계",
    categoryLabel: "통증관리",
    intro: "리프팅 시술에서 통증에 대한 걱정은 자연스러운 일입니다. 스타피부과는 시술 특성과 개인의 통증 민감도를 먼저 확인한 뒤, 꼭 필요한 단계만 원장님이 직접 검토하고 결정합니다.",
    visualHeading: "한눈에 보는 개인별 통증관리 3단계",
    visualCaption: "시술 특성과 개인의 통증 민감도를 먼저 확인한 뒤, 꼭 필요한 단계만 원장님이 직접 검토하고 결정합니다.",
    expandStep: "자세히 보기",
    collapseStep: "접기",
    expandMobilePanel: "통증관리 3단계와 FAQ 보기",
    collapseMobilePanel: "통증관리 접기",
    trustHeading: "안전한 관리를 위한 안내",
    expandTrust: "관리 안내 보기",
    collapseTrust: "관리 안내 접기",
    careCheckpoints: [
      { label: "사전 확인", detail: "건강상태·복용약·알레르기·과거력을 확인하고, 의료진과 시술·통증관리 계획을 검토합니다. 확인 범위와 안내는 개인 상태에 따라 달라질 수 있습니다." },
      { label: "시술 중 관찰", detail: "Kohden SpO₂ 모니터와 혈압측정기를 바탕으로 환자 상태를 지속적으로 살핍니다. 관찰 방법과 범위는 시술 및 개인 상태에 따라 달라질 수 있습니다." },
      { label: "회복 안내", detail: "회복 단계에서 상태와 의료진 안내를 확인하고, 보호자와의 귀가 여부를 검토합니다. 운전·중요 의사결정 제한 등 안내는 개인 상태에 따라 달라질 수 있습니다." },
    ],
    steps: [
      { icon: "표면 통증 부담 완화", title: "연고마취", body: "시술 전 마취 크림을 충분히 도포해 표면 통증 부담을 낮춥니다. 대부분의 시술에서 기본으로 적용됩니다." },
      { icon: "필요 부위 국소 진통", title: "주사 진통", body: "통증이 예상되는 부위에 한해 국소적으로 시행합니다. 시술 부위와 범위에 따라 필요 여부를 판단합니다." },
      { icon: "사전 문진·평가 후 검토", title: "수면진정 / 수면마취", body: "사전 문진과 건강 상태 평가를 거친 후 필요한 경우에만 시행하며, 시술 전 과정을 원장님이 직접 판단하고 관리합니다." },
    ],
    experienceHeading: "수면마취 운영 경험 20년 이상",
    experienceBody: "스타피부과는 20여년 동안 수면진정/수면마취 시술을 운영하며, 시술 전에는 건강 상태와 복용약, 알레르기, 과거력을 확인하고 의료진의 판단에 따라 개별 계획을 검토해 왔습니다. 시술 중에는 환자 상태를 지속적으로 살피고, 회복 단계에서는 필요한 안내와 귀가 관련 확인을 중요하게 관리합니다.",
    monitoringHeading: "시술 중 모니터링",
    monitoringIntro: "Kohden SpO₂ 모니터와 혈압측정기를 갖추고 환자 상태를 지속적으로 살핍니다. 관찰의 범위와 방법은 시술 및 개인 상태에 따라 달라질 수 있습니다.",
    monitoringPoints: ["Kohden SpO₂ 모니터를 통한 산소포화도 확인", "혈압측정기를 통한 혈압 변화 확인", "시술 전 확인사항을 바탕으로 한 의료진 관찰", "회복 단계의 상태 확인과 개별 안내"],
    beforeAfterHeading: "시술 전·후 안내",
    beforeTitle: "시술 전",
    before: ["건강상태·복용약·알레르기·과거력 확인 — 개인 상태에 따라 달라질 수 있음", "의료진 상담과 시술 방법·통증관리 계획 확인 — 개인 상태에 따라 달라질 수 있음", "개별 안내 사항 확인 — 개인 상태에 따라 달라질 수 있음"],
    afterTitle: "시술 후",
    after: ["회복 관찰과 의료진 안내 확인 — 개인 상태에 따라 달라질 수 있음", "보호자와의 귀가 여부 확인 — 개인 상태에 따라 달라질 수 있음", "운전·중요 의사결정 제한 등 의료진 안내 준수 — 개인 상태에 따라 달라질 수 있음"],
    faqHeading: "통증 관리, 자주 묻는 질문",
    faqs: PAIN_MANAGEMENT_KO_FAQS,
    closing: "통증 정도와 마취 방식은 개인의 건강 상태 및 시술 부위에 따라 다르며, 상담을 통해 최종 결정됩니다.",
  },
  en: {
    eyebrow: "PAIN MANAGEMENT",
    heroTitle: "Considering fear of discomfort is an important beginning to a procedure plan.",
    title: "Three Steps of Individualized Pain Management",
    categoryLabel: "Pain Management",
    intro: "Considering concerns about discomfort is an important first step in planning a procedure. Star Dermatology reviews the procedure and each patient’s condition to consider pain-management options in stages.",
    visualHeading: "Individualized pain-management path at a glance",
    visualCaption: "After reviewing the procedure and individual condition, the medical team considers only the steps that may be needed.",
    expandStep: "View details",
    collapseStep: "Collapse",
    expandMobilePanel: "View pain-management steps and FAQ",
    collapseMobilePanel: "Close pain management",
    trustHeading: "Guidance for safe care",
    expandTrust: "View care guidance",
    collapseTrust: "Close care guidance",
    careCheckpoints: [
      { label: "Pre-procedure review", detail: "Health status, medications, allergies, and medical history are reviewed with the medical team alongside the procedure and pain-management plan. The review and guidance may vary by individual condition." },
      { label: "Observation during care", detail: "A Kohden SpO₂ monitor and blood-pressure monitor support continuous observation of the patient’s condition. The method and scope of observation may vary by procedure and individual condition." },
      { label: "Recovery guidance", detail: "During recovery, the patient’s condition and medical guidance are reviewed, including whether discharge with a guardian is appropriate. Limits on driving and important decision-making may vary by individual condition." },
    ],
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
    categoryLabel: "痛み管理",
    intro: "痛みに対するご不安まで考えることが、施術計画の大切な出発点です。スター皮膚科では、施術の特性と患者様の状態を確認しながら、痛み管理の方法を段階的に検討します。",
    visualHeading: "ひと目でわかる個別の痛み管理の流れ",
    visualCaption: "施術の特性と個別の状態を確認し、必要な段階だけを医療スタッフが検討します。",
    expandStep: "詳細を見る",
    collapseStep: "閉じる",
    expandMobilePanel: "痛み管理3段階とFAQを見る",
    collapseMobilePanel: "痛み管理を閉じる",
    trustHeading: "安全な管理のためのご案内",
    expandTrust: "管理の案内を見る",
    collapseTrust: "管理の案内を閉じる",
    careCheckpoints: [
      { label: "施術前確認", detail: "健康状態・服用薬・アレルギー・既往歴を確認し、医療スタッフと施術・痛み管理の計画を検討します。確認範囲とご案内は個別の状態により異なる場合があります。" },
      { label: "施術中の観察", detail: "Kohden SpO₂モニターと血圧計をもとに、患者様の状態を継続して確認します。観察方法と範囲は、施術および個別の状態により異なる場合があります。" },
      { label: "回復のご案内", detail: "回復段階で状態と医療スタッフの案内を確認し、保護者との帰宅が適切かを検討します。運転や重要な意思決定の制限などは個別の状態により異なる場合があります。" },
    ],
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
    categoryLabel: "疼痛管理",
    intro: "将对不适的担忧纳入考虑，是制定治疗计划的重要起点。STAR皮肤科会结合治疗特点与患者状态，分阶段评估疼痛管理方式。",
    visualHeading: "一目了然的个性化疼痛管理流程",
    visualCaption: "确认治疗特点和个人状态后，医护人员仅评估可能需要的阶段。",
    expandStep: "查看详情",
    collapseStep: "收起",
    expandMobilePanel: "查看疼痛管理步骤和常见问题",
    collapseMobilePanel: "收起疼痛管理",
    trustHeading: "安全管理说明",
    expandTrust: "查看管理说明",
    collapseTrust: "收起管理说明",
    careCheckpoints: [
      { label: "治疗前确认", detail: "会确认健康状态、用药、过敏与既往病史，并与医护人员评估治疗及疼痛管理计划。确认范围与说明可能因个人状态而有所不同。" },
      { label: "治疗中观察", detail: "会使用Kohden SpO₂监测仪与血压计持续观察患者状态。观察方式与范围可能因治疗及个人状态而有所不同。" },
      { label: "恢复说明", detail: "恢复阶段会确认状态与医护人员说明，并评估是否适合与陪护人员一同回家。驾驶及重要决策限制等说明可能因个人状态而有所不同。" },
    ],
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
    categoryLabel: "疼痛管理",
    intro: "將對不適的擔憂納入考量，是規劃療程的重要起點。STAR皮膚科會綜合療程特性與患者狀態，分階段評估疼痛管理方式。",
    visualHeading: "一目瞭然的個人化疼痛管理流程",
    visualCaption: "確認療程特性與個人狀態後，醫護人員僅評估可能需要的階段。",
    expandStep: "查看詳情",
    collapseStep: "收合",
    expandMobilePanel: "查看疼痛管理步驟與常見問題",
    collapseMobilePanel: "收合疼痛管理",
    trustHeading: "安全管理說明",
    expandTrust: "查看管理說明",
    collapseTrust: "收合管理說明",
    careCheckpoints: [
      { label: "療程前確認", detail: "會確認健康狀態、用藥、過敏與既往病史，並與醫護人員評估療程及疼痛管理計畫。確認範圍與說明可能因個人狀態而有所不同。" },
      { label: "療程中觀察", detail: "會使用Kohden SpO₂監測儀與血壓計持續觀察患者狀態。觀察方式與範圍可能因療程及個人狀態而有所不同。" },
      { label: "恢復說明", detail: "恢復階段會確認狀態與醫護人員說明，並評估是否適合與陪同者一同返家。駕駛及重要決策限制等說明可能因個人狀態而有所不同。" },
    ],
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
const FAQ_ICONS = [Moon, Stethoscope, Activity, ClipboardCheck];
const TRUST_BADGE_ICONS = [Moon, Activity, FileText];

function resolveLang(lang: Lang): PainManagementLang {
  return lang === "ko" || lang === "en" || lang === "ja" || lang === "zh" || lang === "zh-TW" ? lang : "ko";
}

export function getPainManagementCategory(lang: Lang) {
  const copy = PAIN_MANAGEMENT_CONTENT[resolveLang(lang)];
  return { id: PAIN_MANAGEMENT_CATEGORY_ID, label: copy.categoryLabel };
}

export default function PainManagementGuide({ lang, presentation = "full", hideHeroTitle = false }: { lang: Lang; presentation?: "full" | "event-accordion"; hideHeroTitle?: boolean }) {
  const copy = PAIN_MANAGEMENT_CONTENT[resolveLang(lang)];
  const headingId = "pain-management-guide-title";
  const [openMobileStages, setOpenMobileStages] = useState<Record<number, boolean>>({ 0: true });
  const [openMobileFaqIndex, setOpenMobileFaqIndex] = useState<number | null>(null);
  const trustBadges = lang === "ko"
    ? [
      { title: copy.experienceHeading, detail: "장기간 축적된 마취 관리 노하우", icon: TRUST_BADGE_ICONS[0] },
      { title: copy.monitoringHeading, detail: "의료진이 상태를 지속적으로 확인", icon: TRUST_BADGE_ICONS[1] },
      { title: copy.beforeAfterHeading, detail: "회복 및 관리 방법을 상세히 설명", icon: TRUST_BADGE_ICONS[2] },
    ]
    : [
      { title: copy.experienceHeading, detail: copy.experienceBody, icon: TRUST_BADGE_ICONS[0] },
      { title: copy.monitoringHeading, detail: copy.monitoringIntro, icon: TRUST_BADGE_ICONS[1] },
      { title: copy.beforeAfterHeading, detail: copy.careCheckpoints.map(({ label }) => label).join(" · "), icon: TRUST_BADGE_ICONS[2] },
    ];

  if (presentation === "event-accordion") {
    return (
      <section id={PAIN_MANAGEMENT_CATEGORY_ID} data-testid="pain-management-event-accordion" className="mt-12 !p-0 overflow-hidden rounded-[1.25rem] border border-[rgba(215,181,92,0.42)] bg-[linear-gradient(135deg,#101a30_0%,#1d1a15_52%,#111827_100%)] text-white shadow-[0_14px_30px_rgba(10,18,40,0.16)] md:hidden" aria-label={copy.title}>
        <details className="group">
          <summary className="flex min-h-[76px] cursor-pointer list-none items-center gap-3 px-4 py-3 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold-primary)]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-gold-primary)] bg-[color-mix(in_srgb,var(--color-gold-primary)_14%,transparent)] text-[var(--color-gold-primary)]"><HeartPulse size={18} aria-hidden="true" /></span>
            <span className="min-w-0 flex-1 text-left"><span className="block text-[15px] font-semibold leading-5 text-white">{copy.heroTitle}</span></span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[var(--color-gold-primary)]"><span className="sr-only group-open:hidden">{copy.expandMobilePanel}</span><span className="sr-only hidden group-open:inline">{copy.collapseMobilePanel}</span><ChevronDown size={19} className="transition-transform duration-200 motion-reduce:transition-none group-open:rotate-180" aria-hidden="true" /></span>
          </summary>
          <div className="border-t border-[rgba(215,181,92,0.26)] px-3 pb-3 pt-2.5">
            <p className="px-1 pb-3 text-sm leading-6 text-[rgba(255,255,255,0.76)]">{copy.intro}</p>
            <PainManagementGuide lang={lang} hideHeroTitle />
          </div>
        </details>
      </section>
    );
  }

  const renderTrustBadges = (variant: "mobile" | "desktop") => trustBadges.map((badge, index) => {
    const Icon = badge.icon;
    const isMobile = variant === "mobile";
    return (
      <article
        key={badge.title}
        className={isMobile
          ? `flex min-h-11 min-w-0 items-center gap-2 border-b border-[var(--color-gold-light)] px-3.5 last:border-b-0 ${index === 2 ? "border-l-2 border-l-[var(--color-gold-primary)] bg-[color-mix(in_srgb,var(--color-gold-primary)_7%,white)]" : ""}`
          : "flex min-w-0 items-center gap-3 border-b border-[var(--color-gold-light)] px-3.5 py-3 last:border-b-0 md:border-b-0 md:border-r md:p-4 md:last:border-r-0"}
      >
        <div className={isMobile ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-gold-deep)] shadow-sm" : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-gold-deep)] shadow-sm"}><Icon size={isMobile ? 15 : 19} aria-hidden="true" /></div>
        <div className="min-w-0"><h3 className={isMobile ? "!whitespace-nowrap !text-[13px] font-semibold !leading-5 text-[var(--color-star-text)]" : "text-sm font-semibold leading-5 text-[var(--color-star-text)]"}>{badge.title}</h3><p className={isMobile ? "sr-only" : "mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-star-text-mid)]"}>{badge.detail}</p></div>
      </article>
    );
  });

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--color-gold-light)] bg-[#fffdfa] p-4 shadow-[0_16px_36px_rgba(10,18,40,0.05)] md:p-8 lg:mx-auto lg:max-w-5xl lg:p-10" aria-labelledby={hideHeroTitle ? undefined : headingId} aria-label={hideHeroTitle ? copy.title : undefined}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(135deg,rgba(10,18,40,0.04),rgba(215,181,92,0.1),transparent)] md:h-40" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl">
        <header data-testid="pain-management-header" className="mb-4 border-l-2 border-[var(--color-gold-primary)] pl-3 text-left md:mb-8 md:border-l-0 md:pl-0 md:text-center">
          <span className="section-eyebrow text-[11px]">{copy.eyebrow}</span>
          {!hideHeroTitle && <h2 id={headingId} className="mt-1.5 max-w-none break-keep text-balance !text-[1.25rem] font-semibold !leading-[1.35] tracking-tight text-[var(--color-star-text)] md:mx-auto md:mt-3 md:max-w-3xl md:text-3xl md:leading-snug">{copy.heroTitle}</h2>}
          <p id="pain-management-summary-caption" className="sr-only max-w-[35rem] text-[13px] leading-5 text-[var(--color-star-text-mid)] sm:not-sr-only sm:mx-auto sm:mt-3 sm:max-w-2xl sm:text-sm sm:leading-6">{copy.visualCaption}</p>
        </header>

        <div className="md:hidden">
        <section data-testid="pain-management-summary" aria-describedby="pain-management-summary-caption" aria-label={copy.title} className="relative grid !gap-2 !py-0">
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[2.125rem] left-[2.125rem] top-[2.125rem] w-px bg-[color-mix(in_srgb,var(--color-gold-primary)_58%,transparent)]" />
          {copy.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Stethoscope;
            return (
              <details key={step.title} open={openMobileStages[index] || undefined} data-testid={`pain-mobile-stage-${index + 1}`} className={`pain-management-stage group relative overflow-hidden rounded-[1.15rem] border bg-[var(--color-star-navy)] text-white shadow-[0_8px_20px_rgba(10,18,40,0.12)] ${index === 2 ? "border-[var(--color-gold-primary)]" : "border-[var(--color-gold-light)]"}`}>
                <summary onClick={(event) => { event.preventDefault(); setOpenMobileStages(current => ({ ...current, [index]: !current[index] })); }} className="grid min-h-[68px] cursor-pointer list-none grid-cols-[2.5rem_minmax(0,1fr)_1.25rem] items-center gap-3 px-3.5 py-3 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-inset">
                  <div className="pain-management-stage-icon relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-gold-primary)] bg-[var(--color-gold-primary)] text-[var(--color-star-navy)] shadow-[0_3px_10px_rgba(215,181,92,0.2)]"><Icon size={20} aria-hidden="true" /></div>
                  <div className="min-w-0 text-left"><p className="pain-management-stage-label text-[9px] font-semibold leading-4 tracking-[0.06em] text-[var(--color-gold-primary)]">{step.icon}</p><h3 className="pain-management-stage-title mt-0.5 break-keep font-semibold tracking-tight">{step.title}</h3></div>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--color-gold-primary)]"><span className="sr-only group-open:hidden">{copy.expandStep}</span><span className="sr-only hidden group-open:inline">{copy.collapseStep}</span><ChevronDown size={18} className="transition-transform duration-200 motion-reduce:transition-none group-open:rotate-180" aria-hidden="true" /></span>
                </summary>
                <div className="border-t border-[rgba(215,181,92,0.24)] px-3.5 pb-3 pt-2.5"><p className="max-w-prose text-sm leading-6 text-[rgba(255,255,255,0.76)]">{step.body}</p></div>
              </details>
            );
          })}
        </section>

        <section data-testid="pain-trust-strip" aria-label={copy.trustHeading} className="mt-3 !py-0 overflow-hidden rounded-[1.25rem] border border-[var(--color-gold-light)] bg-[#fbf6ec]">
          {renderTrustBadges("mobile")}
        </section>

        <section data-testid="pain-faq" aria-labelledby="pain-faq-title" className="mt-3 !py-0 overflow-hidden rounded-[1.25rem] border border-[var(--color-gold-light)] bg-white">
          <div className="flex items-center gap-2 border-b border-[var(--color-gold-light)] bg-[color-mix(in_srgb,var(--color-gold-primary)_7%,white)] px-3.5 py-3"><CircleHelp size={19} className="text-[var(--color-gold-deep)]" aria-hidden="true" /><h3 id="pain-faq-title" className="!text-base !leading-5 font-semibold text-[var(--color-star-text)]">{copy.faqHeading}</h3></div>
          {copy.faqs.map((faq, index) => {
            const Icon = FAQ_ICONS[index] ?? CircleHelp;
            return <details key={faq.question} open={openMobileFaqIndex === index} data-testid={`pain-faq-item-${index + 1}`} className="pain-management-disclosure group border-b border-[var(--color-gold-light)] px-3.5 last:border-b-0"><summary onClick={(event) => { event.preventDefault(); setOpenMobileFaqIndex(current => current === index ? null : index); }} className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2"><span className="flex min-w-0 items-center gap-2 text-left text-[13px] font-semibold leading-5 text-[var(--color-star-text)]"><Icon size={15} className="shrink-0 text-[var(--color-gold-deep)]" aria-hidden="true" /><span className="!whitespace-nowrap">{faq.question}</span></span><ChevronDown size={18} className="shrink-0 text-[var(--color-star-text-mid)] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-3 pl-6 text-sm leading-6 text-[var(--color-star-text-mid)]">{faq.answer}</p></details>;
          })}
        </section>
        <p className="mt-2.5 px-1 text-center text-xs leading-5 text-[var(--color-star-text-mid)]">{copy.closing}</p>
        </div>

        <div className="hidden md:block">
        <section data-testid="pain-management-summary-desktop" aria-describedby="pain-management-summary-caption" aria-label={copy.title} className="grid gap-3 md:grid-cols-3 md:gap-4">
          {copy.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Stethoscope;
            return (
              <article key={step.title} data-testid={`pain-stage-${index + 1}`} className="relative overflow-hidden rounded-2xl border border-[var(--color-gold-light)] bg-[var(--color-star-navy)] p-5 text-white shadow-sm">
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(215,181,92,0.45)] bg-[rgba(215,181,92,0.12)] text-xs font-semibold text-[var(--color-gold-primary)]">0{index + 1}</div>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(215,181,92,0.14)] text-[var(--color-gold-primary)]"><Icon size={22} aria-hidden="true" /></div>
                <p className="text-xs font-semibold tracking-[0.08em] text-[var(--color-gold-primary)]">{step.icon}</p>
                <h3 className="mt-2 text-base font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[rgba(255,255,255,0.76)]">{step.body}</p>
              </article>
            );
          })}
        </section>

        <section data-testid="pain-trust-strip-desktop" aria-label="통증관리 안내" className="mt-4 grid auto-rows-max content-start overflow-hidden rounded-[1.25rem] border border-[var(--color-gold-light)] bg-[#fbf6ec] md:grid-cols-3">
          {renderTrustBadges("desktop")}
        </section>

        <section data-testid="pain-faq-desktop" aria-labelledby="pain-faq-title-desktop" className="mt-5 overflow-hidden rounded-[1.25rem] border border-[var(--color-gold-light)] bg-white">
          <div className="flex items-center gap-2 border-b border-[var(--color-gold-light)] bg-[color-mix(in_srgb,var(--color-gold-primary)_7%,white)] px-5 py-4"><CircleHelp size={19} className="text-[var(--color-gold-deep)]" aria-hidden="true" /><h3 id="pain-faq-title-desktop" className="text-base font-semibold text-[var(--color-star-text)]">{copy.faqHeading}</h3></div>
          {copy.faqs.map((faq, index) => {
            const Icon = FAQ_ICONS[index] ?? CircleHelp;
            return <details key={faq.question} className="pain-management-disclosure group border-b border-[var(--color-gold-light)] px-5 last:border-b-0"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2"><span className="flex items-start gap-2 text-left text-sm font-semibold leading-6 text-[var(--color-star-text)]"><Icon size={17} className="mt-0.5 shrink-0 text-[var(--color-gold-deep)]" aria-hidden="true" />{faq.question}</span><ChevronDown size={18} className="mt-1 shrink-0 text-[var(--color-star-text-mid)] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-4 pl-6 text-sm leading-6 text-[var(--color-star-text-mid)]">{faq.answer}</p></details>;
          })}
        </section>
        <p className="mt-4 px-1 text-center text-xs leading-5 text-[var(--color-star-text-mid)]">{copy.closing}</p>
        </div>
      </div>
    </section>
  );
}

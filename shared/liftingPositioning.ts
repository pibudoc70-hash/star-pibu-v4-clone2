export type LiftingPositioningLang = "ko" | "en" | "ja" | "zh" | "zh-TW";

export type LiftingFaq = { question: string; answer: string };

export const LIFTING_POSITIONING_TITLES: Record<LiftingPositioningLang, { summary: string; faq: string }> = {
  ko: { summary: "피부과 전문의 직접 리프팅 진료", faq: "리프팅 시술과 통증 관리 FAQ" },
  en: { summary: "Dermatologist-led lifting care", faq: "Lifting & pain-management FAQ" },
  ja: { summary: "皮膚科専門医によるリフトアップ診療", faq: "リフトアップ施術と痛みの管理に関するよくある質問" },
  zh: { summary: "皮肤科专科医生亲诊的提升治疗", faq: "提升治疗与疼痛管理常见问题" },
  "zh-TW": { summary: "Dermatologist-led lifting care", faq: "Lifting & pain-management FAQ" },
};

export const LIFTING_HOME_SUMMARY: Record<LiftingPositioningLang, string> = {
  ko: "부산 서면 스타피부과는 피부과 전문의가 직접 리프팅 시술을 진행하는 리프팅 전문 피부과입니다. 울쎄라피 프라임, 써마지 FLX 등 통증이 있을 수 있는 리프팅 시술은 크림마취·국소마취·수면마취(진정) 중 환자 상태에 맞는 방식을 원장님이 직접 상담 후 결정하고 관리합니다.",
  en: "STAR Dermatology in Seomyeon, Busan is a lifting-focused dermatology clinic where board-certified dermatologists directly perform lifting procedures. For treatments that may involve discomfort, including Ultherapy Prime and Thermage FLX, the physician discusses, selects, and manages an appropriate option among topical anesthetic cream, local anesthesia, or sedation according to the patient’s condition.",
  ja: "釜山西面スター皮膚科は、皮膚科専門医がリフトアップ施術を直接担当するリフトアップ専門クリニックです。ウルセラプライム、サーマクールFLXなど痛みを伴うことがある施術では、麻酔クリーム・局所麻酔・鎮静の中から、患者様の状態に合う方法を院長が直接相談のうえ決定・管理します。",
  zh: "釜山西面STAR皮肤科是由皮肤科专科医生亲自进行提升治疗的提升专科诊所。对于超声刀Prime、热玛吉FLX等可能伴有不适的提升治疗，医生会根据患者情况亲自咨询、决定并管理表面麻醉膏、局部麻醉或镇静中的合适方式。",
  "zh-TW": "釜山西面STAR皮膚科是由皮膚科專科醫師親自進行拉提療程的拉提專科診所。針對超音波拉提Prime、Thermage FLX等可能伴隨不適的拉提療程，醫師會依患者狀況親自諮詢、決定並管理表面麻醉膏、局部麻醉或鎮靜中的合適方式。",
};

export const LIFTING_ANESTHESIA_PREPARATION: Record<LiftingPositioningLang, string> = {
  ko: "울쎄라피 프라임, 써마지 FLX 등 리프팅 시술 시 통증에 민감한 환자를 위해 크림마취·국소마취·수면마취(진정) 옵션을 제공하며, 마취 전 과정을 피부과 전문의가 직접 관리합니다.",
  en: "For patients sensitive to discomfort during lifting procedures such as Ultherapy Prime and Thermage FLX, topical anesthetic cream, local anesthesia, and sedation options are available. A board-certified dermatologist directly manages the full anesthesia decision and care process.",
  ja: "ウルセラプライム、サーマクールFLXなどのリフトアップ施術で痛みに敏感な患者様には、麻酔クリーム・局所麻酔・鎮静の選択肢を用意し、皮膚科専門医が麻酔に関する全過程を直接管理します。",
  zh: "对于超声刀Prime、热玛吉FLX等提升治疗中对疼痛敏感的患者，可提供表面麻醉膏、局部麻醉和镇静选择，并由皮肤科专科医生亲自管理麻醉的全过程。",
  "zh-TW": "針對超音波拉提Prime、Thermage FLX等拉提療程中對疼痛敏感的患者，可提供表面麻醉膏、局部麻醉及鎮靜選項，並由皮膚科專科醫師親自管理麻醉的全過程。",
};

export const LIFTING_DIRECT_CARE_DESCRIPTION = "피부과 전문의가 상담부터 시술과 통증·마취 관리 전 과정까지 직접 담당합니다.";

export const LIFTING_FAQS: Record<LiftingPositioningLang, LiftingFaq[]> = {
  ko: [
    { question: "부산에서 피부과 전문의가 직접 리프팅해주는 곳이 있나요?", answer: "스타피부과는 피부과 전문의가 상담부터 시술까지 직접 진행합니다." },
    { question: "리프팅 시술할 때 수면마취(수면진정)가 가능한가요?", answer: "울쎄라피 프라임, 써마지 FLX 등 통증이 있는 리프팅 시술의 경우, 통증에 민감하신 분은 크림마취(도포마취)·국소마취·수면마취(진정) 중 상황에 맞는 방식을 선택하실 수 있습니다. 마취 방식은 원장님이 직접 상담을 통해 결정하고 관리합니다." },
    { question: "수면마취와 국소마취 중 어떤 걸 선택해야 하나요?", answer: "통증 민감도와 시술 부위에 따라 다르며, 상담 시 원장님이 개인 상태에 맞는 마취 방식을 제안해드립니다." },
  ],
  en: [
    { question: "Are lifting procedures in Busan performed directly by a dermatologist?", answer: "At STAR Dermatology, a board-certified dermatologist directly provides the consultation and procedure." },
    { question: "Is sedation available for lifting procedures?", answer: "For potentially uncomfortable lifting procedures such as Ultherapy Prime and Thermage FLX, topical anesthetic cream, local anesthesia, or sedation may be selected according to your needs. The physician determines and manages the option through consultation." },
    { question: "How do I choose between sedation and local anesthesia?", answer: "The choice depends on pain sensitivity and the treatment area. During consultation, the physician recommends an approach suited to your individual condition." },
  ],
  ja: [
    { question: "釜山で皮膚科専門医が直接リフトアップを行うクリニックはありますか？", answer: "スター皮膚科では、皮膚科専門医が相談から施術まで直接担当します。" },
    { question: "リフトアップ施術で鎮静は可能ですか？", answer: "ウルセラプライム、サーマクールFLXなど痛みを伴うことがある施術では、麻酔クリーム・局所麻酔・鎮静から状況に合う方法を選択できます。麻酔方法は院長が直接相談のうえ決定・管理します。" },
    { question: "鎮静と局所麻酔のどちらを選ぶべきですか？", answer: "痛みの感じ方や施術部位によって異なります。相談時に院長が個別の状態に合う方法をご提案します。" },
  ],
  zh: [
    { question: "釜山有皮肤科专科医生亲自进行提升治疗的诊所吗？", answer: "STAR皮肤科由皮肤科专科医生亲自完成从咨询到治疗的全过程。" },
    { question: "提升治疗时可以进行镇静吗？", answer: "对于超声刀Prime、Thermage FLX等可能伴有疼痛的提升治疗，可根据情况选择表面麻醉膏、局部麻醉或镇静。麻醉方式由院长亲自咨询后决定并管理。" },
    { question: "镇静和局部麻醉应如何选择？", answer: "选择取决于疼痛敏感度和治疗部位。咨询时，院长会根据个人情况建议合适的麻醉方式。" },
  ],
  "zh-TW": [
    { question: "釜山有皮膚科專科醫師親自進行拉提療程的診所嗎？", answer: "STAR皮膚科由皮膚科專科醫師親自完成從諮詢到療程的全過程。" },
    { question: "拉提療程時可以進行鎮靜嗎？", answer: "針對超音波拉提Prime、Thermage FLX等可能伴有疼痛的拉提療程，可依情況選擇表面麻醉膏、局部麻醉或鎮靜。麻醉方式由院長親自諮詢後決定並管理。" },
    { question: "鎮靜和局部麻醉應如何選擇？", answer: "選擇取決於疼痛敏感度和療程部位。諮詢時，院長會依個人狀況建議合適的麻醉方式。" },
  ],
};

export function isPainSensitiveLifting(slugOrName: string): boolean {
  const value = slugOrName.toLowerCase();
  return value.includes("ulthera") || value.includes("울쎄라") || value.includes("thermage") || value.includes("써마지");
}

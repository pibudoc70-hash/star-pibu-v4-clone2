import mysql from "mysql2/promise";

const DRY_RUN = process.argv.includes("--dry-run");
const TARGET_RATE = 0.30;
const localeFields = ["faqs", "faqsEn", "faqsJa", "faqsZh", "faqsZhTw"];
const regionalMatchers = {
  faqs: /부산|서면/,
  faqsEn: /\bBusan\b|\bSeomyeon\b/i,
  faqsJa: /釜山|西面/,
  faqsZh: /釜山|西面/,
  faqsZhTw: /釜山|西面|Star皮膚科/,
};
const guidance = {
  faqs: [
    "부산 서면 스타피부과에서는 피부 상태와 시술 계획을 충분히 확인한 뒤 개인별 적합성을 안내합니다.",
    "부산 서면 상담에서는 현재 피부 상태와 치료 목표를 함께 검토해 개인별 적용 여부를 안내합니다.",
    "스타피부과 부산 서면 진료에서는 시술 전 피부 반응과 회복 계획을 확인하고 필요한 경우 전문의 상담을 권합니다.",
    "부산 서면 스타피부과에서는 고민 부위와 피부 상태를 살핀 뒤 개인별 시술 계획을 상담합니다.",
    "부산 서면 내원 상담에서 기존 시술 이력과 현재 피부 상태를 확인해 적합성을 판단합니다.",
  ],
  faqsEn: [
    "At Star Dermatology in Seomyeon, Busan, suitability is discussed after a careful review of your skin condition and treatment plan.",
    "During a consultation in Seomyeon, Busan, your current skin condition and treatment goals are reviewed to discuss individual suitability.",
    "At Star Dermatology in Seomyeon, Busan, skin response and recovery planning are reviewed before treatment, and specialist consultation is recommended when needed.",
    "At Star Dermatology in Seomyeon, Busan, the concern area and current skin condition are reviewed when discussing an individual treatment plan.",
    "During a visit to Seomyeon, Busan, prior procedure history and current skin condition are reviewed to assess suitability.",
  ],
  faqsJa: [
    "釜山・西面のスター皮膚科では、肌の状態と施術計画を十分に確認したうえで、個別の適応をご案内します。",
    "釜山・西面でのカウンセリングでは、現在の肌状態と治療目標を一緒に確認し、個別の適用可否をご案内します。",
    "釜山・西面のスター皮膚科では、施術前に肌の反応と回復計画を確認し、必要に応じて専門医への相談をおすすめします。",
    "釜山・西面のスター皮膚科では、お悩みの部位と肌状態を確認しながら、個別の施術計画をご相談いただけます。",
    "釜山・西面へのご来院時には、これまでの施術歴と現在の肌状態を確認して適応を判断します。",
  ],
  faqsZh: [
    "釜山西面Star皮肤科会在充分评估皮肤状态和治疗计划后，说明个人适用性。",
    "在釜山西面的咨询中，会结合当前皮肤状态和治疗目标，说明个人适用情况。",
    "釜山西面Star皮肤科会在治疗前评估皮肤反应和恢复计划，必要时建议与皮肤科专科医生咨询。",
    "釜山西面Star皮肤科会评估困扰部位和皮肤状态后，与您讨论个人治疗计划。",
    "到釜山西面就诊咨询时，会确认既往治疗史和当前皮肤状态以判断适用性。",
  ],
  faqsZhTw: [
    "釜山西面Star皮膚科會在充分評估肌膚狀態與療程計畫後，說明個人適用性。",
    "在釜山西面的諮詢中，會結合目前肌膚狀態與療程目標，說明個人適用情況。",
    "釜山西面Star皮膚科會在療程前評估肌膚反應與恢復計畫，必要時建議與皮膚科專科醫師諮詢。",
    "釜山西面Star皮膚科會評估困擾部位與肌膚狀態後，與您討論個人療程計畫。",
    "到釜山西面就診諮詢時，會確認既往療程史與目前肌膚狀態以判斷適用性。",
  ],
};

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [rows] = await connection.execute(`
    SELECT id, slug, faqs, faqsEn, faqsJa, faqsZh, faqsZhTw
    FROM equipment3
    WHERE faqs IS NOT NULL AND JSON_LENGTH(faqs) > 0
    ORDER BY id
  `);
  const totalFaqs = rows.reduce((sum, row) => sum + JSON.parse(row.faqs).length, 0);
  const currentCount = rows.reduce((sum, row) => sum + JSON.parse(row.faqs).filter((faq) => regionalMatchers.faqs.test(`${faq.question}\n${faq.answer}`)).length, 0);
  const targetCount = Math.ceil(totalFaqs * TARGET_RATE);
  const additionsRequired = targetCount - currentCount;
  if (totalFaqs !== 279 || currentCount !== 29 || additionsRequired !== 55) {
    throw new Error(`Unexpected regional baseline: total=${totalFaqs}, current=${currentCount}, additions=${additionsRequired}`);
  }

  const candidatesByRow = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    indices: JSON.parse(row.faqs).flatMap((faq, index) => regionalMatchers.faqs.test(`${faq.question}\n${faq.answer}`) ? [] : [index]),
  }));
  const selected = [];
  const maxCandidateCount = Math.max(...candidatesByRow.map((row) => row.indices.length));
  for (let candidatePosition = 0; candidatePosition < maxCandidateCount && selected.length < additionsRequired; candidatePosition += 1) {
    for (const row of candidatesByRow) {
      const index = row.indices[candidatePosition];
      if (index !== undefined && selected.length < additionsRequired) selected.push({ id: row.id, slug: row.slug, index });
    }
  }
  if (selected.length !== additionsRequired) throw new Error(`Could not select ${additionsRequired} regional FAQ targets`);

  const selectionById = new Map();
  for (const target of selected) {
    const list = selectionById.get(target.id) ?? [];
    list.push(target.index);
    selectionById.set(target.id, list);
  }
  if (DRY_RUN) {
    console.log(JSON.stringify({ totalFaqs, currentCount, targetCount, additionsRequired, selected }, null, 2));
    process.exit(0);
  }

  await connection.beginTransaction();
  for (const row of rows) {
    const indices = selectionById.get(row.id);
    if (!indices) continue;
    const updated = Object.fromEntries(localeFields.map((field) => [field, JSON.parse(row[field] ?? "[]")]));
    for (const index of indices) {
      localeFields.forEach((field) => {
        const phrase = guidance[field][index % guidance[field].length];
        updated[field][index].answer = `${updated[field][index].answer} ${phrase}`;
      });
    }
    await connection.execute(
      "UPDATE equipment3 SET faqs = ?, faqsEn = ?, faqsJa = ?, faqsZh = ?, faqsZhTw = ? WHERE id = ?",
      [
        JSON.stringify(updated.faqs), JSON.stringify(updated.faqsEn), JSON.stringify(updated.faqsJa), JSON.stringify(updated.faqsZh), JSON.stringify(updated.faqsZhTw), row.id,
      ],
    );
  }
  await connection.commit();
  console.log(JSON.stringify({ totalFaqs, currentCount, targetCount, additionsApplied: selected.length, selected }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.destroy();
}

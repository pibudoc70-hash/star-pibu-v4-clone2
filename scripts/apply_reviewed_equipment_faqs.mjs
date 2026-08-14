import fs from "node:fs";
import mysql from "mysql2/promise";

const [reviewFile, language, mode] = process.argv.slice(2);
const columnByLanguage = { en: "faqsEn", ja: "faqsJa", zh: "faqsZh", "zh-TW": "faqsZhTw" };
const column = columnByLanguage[language];
if (!reviewFile || !column || !["--dry-run", "--apply"].includes(mode)) {
  throw new Error("Usage: node scripts/apply_reviewed_equipment_faqs.mjs <review-json> <en|ja|zh|zh-TW> <--dry-run|--apply>");
}

const reviewResults = JSON.parse(fs.readFileSync(reviewFile, "utf8")).results;
const updates = reviewResults.map((result) => {
  const source = JSON.parse(fs.readFileSync(result.input, "utf8"));
  const faqs = JSON.parse(result.output.reviewed_json ?? result.output.translation_json);
  if (!Array.isArray(faqs) || faqs.length !== source.sourceFaqs.length || faqs.some((faq) => !faq || typeof faq.question !== "string" || typeof faq.answer !== "string" || !faq.question.trim() || !faq.answer.trim())) {
    throw new Error(`Invalid translated FAQ payload for equipment ${source.id}`);
  }
  return { id: source.id, faqCount: faqs.length, value: JSON.stringify(faqs) };
});

const totalFaqs = updates.reduce((sum, update) => sum + update.faqCount, 0);
if (mode === "--dry-run") {
  console.log(JSON.stringify({ language, column, pages: updates.length, faqCount: totalFaqs, mode: "dry-run" }));
  process.exit(0);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const connection = await mysql.createConnection(databaseUrl);
try {
  await connection.beginTransaction();
  for (const update of updates) {
    const [result] = await connection.execute(`UPDATE equipment3 SET ${column} = ? WHERE id = ?`, [update.value, update.id]);
    if (result.affectedRows !== 1) throw new Error(`Expected exactly one updated record for equipment ${update.id}`);
  }
  const ids = updates.map((update) => update.id);
  const placeholders = ids.map(() => "?").join(",");
  const [rows] = await connection.execute(`SELECT id, JSON_LENGTH(${column}) AS faqCount FROM equipment3 WHERE id IN (${placeholders})`, ids);
  if (rows.length !== updates.length || rows.some((row) => Number(row.faqCount) !== updates.find((update) => update.id === Number(row.id))?.faqCount)) {
    throw new Error("Persisted FAQ count verification failed");
  }
  await connection.commit();
  console.log(JSON.stringify({ language, column, pages: updates.length, faqCount: totalFaqs, mode: "applied" }));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.destroy();
}

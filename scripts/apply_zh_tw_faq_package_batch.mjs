import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const [resultsDirectory, batchNumber, mode] = process.argv.slice(2);
if (!resultsDirectory || !/^\d{1,2}$/.test(batchNumber ?? "") || !["--dry-run", "--apply"].includes(mode)) {
  throw new Error("Usage: node scripts/apply_zh_tw_faq_package_batch.mjs <results-directory> <1-12> <--dry-run|--apply>");
}

const batchFile = `result_batch_${String(Number(batchNumber)).padStart(2, "0")}.json`;
const batchPath = path.join(resultsDirectory, batchFile);
const payload = JSON.parse(fs.readFileSync(batchPath, "utf8"));
if (!Array.isArray(payload.pages) || payload.pages.length === 0) throw new Error(`${batchFile} must contain pages`);

const updates = payload.pages.map((page) => {
  if (!Number.isInteger(page.id) || typeof page.slug !== "string" || !Array.isArray(page.faqs) || page.faqs.length === 0) {
    throw new Error(`Invalid page payload in ${batchFile}`);
  }
  if (page.faqs.some((faq, index) => !faq || faq.faqIndex !== index + 1 || typeof faq.question !== "string" || typeof faq.answer !== "string" || !faq.question.trim() || !faq.answer.trim())) {
    throw new Error(`Invalid FAQ payload for equipment ${page.id}`);
  }
  return { id: page.id, slug: page.slug, faqs: page.faqs, faqCount: page.faqs.length };
});

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const connection = await mysql.createConnection(databaseUrl);
try {
  const ids = updates.map((update) => update.id);
  const placeholders = ids.map(() => "?").join(",");
  const [sources] = await connection.execute(
    `SELECT id, slug, JSON_LENGTH(faqs) AS sourceFaqCount FROM equipment3 WHERE id IN (${placeholders})`,
    ids,
  );
  if (sources.length !== updates.length) throw new Error(`Expected ${updates.length} source records, found ${sources.length}`);
  const sourceById = new Map(sources.map((source) => [Number(source.id), source]));
  for (const update of updates) {
    const source = sourceById.get(update.id);
    if (!source || source.slug !== update.slug || Number(source.sourceFaqCount) !== update.faqCount) {
      throw new Error(`Source mismatch for equipment ${update.id}`);
    }
  }

  if (mode === "--dry-run") {
    console.log(JSON.stringify({ batchFile, mode: "dry-run", pages: updates.length, faqCount: updates.reduce((sum, update) => sum + update.faqCount, 0) }));
    process.exit(0);
  }

  await connection.beginTransaction();
  for (const update of updates) {
    const [result] = await connection.execute(
      "UPDATE equipment3 SET faqsZhTw = ? WHERE id = ? AND slug = ?",
      [JSON.stringify(update.faqs.map(({ question, answer }) => ({ question, answer }))), update.id, update.slug],
    );
    if (result.affectedRows !== 1) throw new Error(`Failed to update equipment ${update.id}`);
  }
  const [persisted] = await connection.execute(
    `SELECT id, JSON_LENGTH(faqsZhTw) AS faqCount FROM equipment3 WHERE id IN (${placeholders})`,
    ids,
  );
  const persistedById = new Map(persisted.map((row) => [Number(row.id), Number(row.faqCount)]));
  for (const update of updates) {
    if (persistedById.get(update.id) !== update.faqCount) throw new Error(`Persisted count mismatch for equipment ${update.id}`);
  }
  await connection.commit();
  console.log(JSON.stringify({ batchFile, mode: "applied", pages: updates.length, faqCount: updates.reduce((sum, update) => sum + update.faqCount, 0) }));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.destroy();
}

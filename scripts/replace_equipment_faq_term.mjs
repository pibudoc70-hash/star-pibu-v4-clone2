import mysql from "mysql2/promise";

const [idText, oldTerm, newTerm] = process.argv.slice(2);
const id = Number(idText);
if (!Number.isInteger(id) || !oldTerm || !newTerm) {
  throw new Error("Usage: node scripts/replace_equipment_faq_term.mjs <equipment-id> <old-term> <new-term>");
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const connection = await mysql.createConnection(databaseUrl);
try {
  await connection.beginTransaction();
  const [rows] = await connection.execute("SELECT nameZh, faqsZh FROM equipment3 WHERE id = ? FOR UPDATE", [id]);
  if (rows.length !== 1) throw new Error(`Equipment ${id} was not found`);
  const faqs = JSON.parse(rows[0].faqsZh);
  if (!Array.isArray(faqs) || faqs.length === 0) throw new Error(`Equipment ${id} has no Simplified Chinese FAQs`);
  let replacementCount = 0;
  const updatedFaqs = faqs.map((faq) => ({
    question: faq.question.replaceAll(oldTerm, () => { replacementCount += 1; return newTerm; }),
    answer: faq.answer.replaceAll(oldTerm, () => { replacementCount += 1; return newTerm; }),
  }));
  if (rows[0].nameZh !== oldTerm) throw new Error(`Expected existing nameZh ${oldTerm}, found ${rows[0].nameZh}`);
  if (replacementCount === 0) throw new Error(`No FAQ occurrence of ${oldTerm} found for equipment ${id}`);
  const [result] = await connection.execute("UPDATE equipment3 SET nameZh = ?, faqsZh = ? WHERE id = ?", [newTerm, JSON.stringify(updatedFaqs), id]);
  if (result.affectedRows !== 1) throw new Error(`Equipment ${id} update failed`);
  await connection.commit();
  console.log(JSON.stringify({ id, oldTerm, newTerm, faqReplacementCount: replacementCount, faqCount: updatedFaqs.length }));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.destroy();
}

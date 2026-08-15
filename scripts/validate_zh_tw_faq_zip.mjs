import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const [resultsDirectory, outputFile] = process.argv.slice(2);
if (!resultsDirectory || !outputFile) {
  throw new Error("Usage: node scripts/validate_zh_tw_faq_zip.mjs <results-directory> <output-file>");
}

const numericTokens = (text, { koreanSource = false, ignoredTerms = [] } = {}) => {
  let normalized = String(text).replace(/\s+/g, "");
  for (const term of ignoredTerms) {
    if (term) normalized = normalized.split(String(term).replace(/\s+/g, "")).join("");
  }
  const tokens = [...normalized.matchAll(/\d+(?:\.\d+)?/g)].map((match) => match[0]);
  if (koreanSource) {
    tokens.push(...[...normalized.matchAll(/하루/g)].map(() => "1"));
  }
  return tokens.sort();
};
const koreanPattern = /[\uac00-\ud7af]/;
const simplifiedOnlyPattern = /[诊疗术肤发缓适温处时长经与为说变护验证厅仅类选択记认识边议请优质响应设备范围药层红闭环脱频]/;

const files = fs.readdirSync(resultsDirectory)
  .filter((file) => /^result_batch_\d+\.json$/.test(file))
  .sort();

const pages = files.flatMap((file) => {
  const payload = JSON.parse(fs.readFileSync(path.join(resultsDirectory, file), "utf8"));
  if (!Array.isArray(payload.pages)) throw new Error(`${file} must contain a pages array`);
  return payload.pages.map((page) => ({ ...page, sourceFile: file }));
});

const report = {
  files: files.length,
  pages: pages.length,
  faqCount: pages.reduce((total, page) => total + (Array.isArray(page.faqs) ? page.faqs.length : 0), 0),
  errors: [],
  warnings: [],
};

const seenIds = new Set();
for (const page of pages) {
  if (!Number.isInteger(page.id) || typeof page.slug !== "string" || !Array.isArray(page.faqs)) {
    report.errors.push({ type: "invalid-page-shape", page });
    continue;
  }
  if (seenIds.has(page.id)) report.errors.push({ type: "duplicate-id", id: page.id });
  seenIds.add(page.id);
  const expectedIndexes = page.faqs.map((_, index) => index + 1);
  const actualIndexes = page.faqs.map((faq) => faq?.faqIndex);
  if (JSON.stringify(expectedIndexes) !== JSON.stringify(actualIndexes)) {
    report.errors.push({ type: "faq-index-sequence", id: page.id, expectedIndexes, actualIndexes });
  }
  for (const faq of page.faqs) {
    if (!faq || typeof faq.question !== "string" || typeof faq.answer !== "string" || !faq.question.trim() || !faq.answer.trim()) {
      report.errors.push({ type: "invalid-faq-shape", id: page.id, faqIndex: faq?.faqIndex });
      continue;
    }
    const joined = `${faq.question}\n${faq.answer}`;
    if (koreanPattern.test(joined)) report.errors.push({ type: "korean-residue", id: page.id, faqIndex: faq.faqIndex });
    const simplifiedMatches = [...joined].filter((character) => simplifiedOnlyPattern.test(character));
    if (simplifiedMatches.length > 0) {
      report.errors.push({ type: "simplified-residue", id: page.id, faqIndex: faq.faqIndex, characters: [...new Set(simplifiedMatches)] });
    }
  }
}

if (report.files !== 12) report.errors.push({ type: "batch-count", expected: 12, actual: report.files });
if (report.pages !== 72) report.errors.push({ type: "page-count", expected: 72, actual: report.pages });
if (report.faqCount !== 279) report.errors.push({ type: "faq-count", expected: 279, actual: report.faqCount });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for source comparison");
const connection = await mysql.createConnection(databaseUrl);
try {
  const ids = pages.map((page) => page.id);
  const placeholders = ids.map(() => "?").join(",");
  const [rows] = await connection.execute(
    `SELECT id, slug, name, faqs FROM equipment3 WHERE id IN (${placeholders})`,
    ids,
  );
  const sourcesById = new Map(rows.map((row) => [Number(row.id), row]));
  if (rows.length !== pages.length) report.errors.push({ type: "missing-db-pages", expected: pages.length, actual: rows.length });

  for (const page of pages) {
    const source = sourcesById.get(page.id);
    if (!source) continue;
    if (source.slug !== page.slug) report.errors.push({ type: "slug-mismatch", id: page.id, expected: source.slug, actual: page.slug });
    let sourceFaqs = [];
    try {
      sourceFaqs = typeof source.faqs === "string" ? JSON.parse(source.faqs) : source.faqs;
    } catch {
      report.errors.push({ type: "invalid-source-faq-json", id: page.id });
      continue;
    }
    if (!Array.isArray(sourceFaqs) || sourceFaqs.length !== page.faqs.length) {
      report.errors.push({ type: "source-faq-count-mismatch", id: page.id, expected: sourceFaqs?.length, actual: page.faqs.length });
      continue;
    }
    for (let index = 0; index < sourceFaqs.length; index += 1) {
      const sourceFaq = sourceFaqs[index];
      const translatedFaq = page.faqs[index];
      const sourceText = `${sourceFaq.question}\n${sourceFaq.answer}`;
      const translatedText = `${translatedFaq.question}\n${translatedFaq.answer}`;
      const sourceNumbers = numericTokens(sourceText, { koreanSource: true, ignoredTerms: [source.name] });
      const translatedNumbers = numericTokens(translatedText, { ignoredTerms: [page.treatmentNameZhTwSuggestion] });
      if (JSON.stringify(sourceNumbers) !== JSON.stringify(translatedNumbers)) {
        report.errors.push({ type: "numeric-token-mismatch", id: page.id, faqIndex: index + 1, sourceNumbers, translatedNumbers });
      }
      if (/개인차/.test(sourceText) && !/因人而異/.test(translatedText)) {
        report.errors.push({ type: "individual-variation-missing", id: page.id, faqIndex: index + 1 });
      }
    }
  }
} finally {
  await connection.end();
}

const bblPage = pages.find((page) => page.id === 120011);
if (!bblPage || bblPage.treatmentNameZhTwSuggestion !== "BBL緊膚" || !bblPage.faqs.some((faq) => /BBL緊膚/.test(`${faq.question}\n${faq.answer}`))) {
  report.errors.push({ type: "bbl-name-mismatch", id: 120011 });
}

report.passed = report.errors.length === 0;
fs.writeFileSync(outputFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ passed: report.passed, files: report.files, pages: report.pages, faqCount: report.faqCount, errors: report.errors.length, warnings: report.warnings.length }));
if (!report.passed) process.exitCode = 2;

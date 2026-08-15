import mysql from "mysql2/promise";

const baseUrl = process.env.PRERENDER_BASE_URL ?? "http://127.0.0.1:3101";
const concurrency = Number.parseInt(process.env.PRERENDER_CONCURRENCY ?? "8", 10);
const pageOffset = Number.parseInt(process.env.PRERENDER_PAGE_OFFSET ?? "0", 10);
const pageLimit = Number.parseInt(process.env.PRERENDER_PAGE_LIMIT ?? "0", 10);
const localeFields = [
  { field: "faqs", prefix: "" },
  { field: "faqsEn", prefix: "/en" },
  { field: "faqsJa", prefix: "/ja" },
  { field: "faqsZh", prefix: "/zh" },
  { field: "faqsZhTw", prefix: "/zh-tw" },
];

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [rows] = await connection.execute(`
    SELECT id, slug, faqs, faqsEn, faqsJa, faqsZh, faqsZhTw
    FROM equipment3
    WHERE faqs IS NOT NULL AND JSON_LENGTH(faqs) > 0
    ORDER BY id
  `);

  const rowsToVerify = pageLimit > 0 ? rows.slice(pageOffset, pageOffset + pageLimit) : rows.slice(pageOffset);
  const jobs = rowsToVerify.flatMap((row) => localeFields.map((locale) => ({ row, locale })));
  const results = [];
  let nextJobIndex = 0;

  async function verifyNextJob() {
    while (nextJobIndex < jobs.length) {
      const job = jobs[nextJobIndex];
      nextJobIndex += 1;
      const faqs = JSON.parse(job.row[job.locale.field] ?? "[]");
      const url = `${baseUrl}${job.locale.prefix}/equipment3/${encodeURIComponent(job.row.slug)}?verify=multilingual-faq-prerender`;
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
        const html = await response.text();
        const missingQuestions = faqs.filter((faq) => !html.includes(faq.question)).map((faq) => faq.question);

        results.push({
          id: job.row.id,
          slug: job.row.slug,
          locale: job.locale.field,
          status: response.status,
          hasFaqPage: html.includes("FAQPage"),
          missingQuestionCount: missingQuestions.length,
          faqCount: faqs.length,
        });
      } catch (error) {
        results.push({
          id: job.row.id,
          slug: job.row.slug,
          locale: job.locale.field,
          status: 0,
          hasFaqPage: false,
          missingQuestionCount: faqs.length,
          faqCount: faqs.length,
          error: error instanceof Error ? error.name : "RequestError",
        });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, verifyNextJob));

  const failures = results.filter((result) => result.status < 200 || result.status >= 300 || !result.hasFaqPage || result.missingQuestionCount > 0);
  const verified = results.filter((result) => !failures.includes(result));

  const summary = {
    baseUrl,
    totalDetailPages: rows.length,
    detailPages: rowsToVerify.length,
    locales: localeFields.length,
    concurrency,
    pageOffset,
    expectedResponses: rowsToVerify.length * localeFields.length,
    verifiedPages: verified.length,
    verifiedFaqs: verified.reduce((sum, result) => sum + result.faqCount, 0),
    failures,
  };

  console.log(JSON.stringify(summary, null, 2));
  process.exit(failures.length > 0 ? 1 : 0);
} finally {
  await connection.end();
}

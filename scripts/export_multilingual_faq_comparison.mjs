import fs from "node:fs";
import mysql from "mysql2/promise";

const outputPath = process.argv[2] ?? "/home/ubuntu/Downloads/star-pibu_faq_multilingual_comparison_2026-08-15.csv";
const connection = await mysql.createConnection(process.env.DATABASE_URL);

const csv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const stripNames = (value, names) => names.reduce((text, name) => name ? text.replaceAll(name, " ") : text, String(value ?? ""));
const numbers = (value, names = []) => stripNames(value, names).match(/\d+(?:[.,]\d+)?/g) ?? [];
const numberMatch = (ko, localized, sourceNames, localizedNames) => {
  const source = numbers(ko, sourceNames).sort();
  const translated = numbers(localized, localizedNames).sort();
  const remaining = [...translated];
  const sourceNumbersPreserved = source.every((value) => {
    const matchIndex = remaining.indexOf(value);
    if (matchIndex < 0) return false;
    remaining.splice(matchIndex, 1);
    return true;
  });
  return sourceNumbersPreserved ? "PASS" : "CHECK";
};

try {
  const [rows] = await connection.execute(`
    SELECT id, slug, name, nameEn, nameJa, nameZh, nameZhTw, faqs, faqsEn, faqsJa, faqsZh, faqsZhTw
    FROM equipment3
    WHERE faqs IS NOT NULL AND JSON_LENGTH(faqs) > 0
    ORDER BY id
  `);
  if (rows.length !== 72) throw new Error(`Expected 72 FAQ pages, found ${rows.length}`);

  const header = [
    "page_id", "slug", "name_ko", "name_en", "name_ja", "name_zh", "name_zh_tw", "faq_index",
    "question_ko", "answer_ko", "question_en", "answer_en", "question_ja", "answer_ja", "question_zh", "answer_zh", "question_zh_tw", "answer_zh_tw",
    "count_match", "numbers_en", "numbers_ja", "numbers_zh", "numbers_zh_tw",
  ];
  const lines = [header.map(csv).join(",")];
  let faqCount = 0;
  let checks = 0;
  const numericReviewRows = [];
  const localeSummary = {
    ko: { faqCount: 0, regionalMentions: 0, matcher: /부산|서면/ },
    en: { faqCount: 0, regionalMentions: 0, matcher: /\bBusan\b|\bSeomyeon\b/i },
    ja: { faqCount: 0, regionalMentions: 0, matcher: /釜山|西面/ },
    zh: { faqCount: 0, regionalMentions: 0, matcher: /釜山|西面/ },
    zhTw: { faqCount: 0, regionalMentions: 0, matcher: /釜山|西面|Star皮膚科/ },
  };

  for (const row of rows) {
    const ko = JSON.parse(row.faqs);
    const en = JSON.parse(row.faqsEn ?? "[]");
    const ja = JSON.parse(row.faqsJa ?? "[]");
    const zh = JSON.parse(row.faqsZh ?? "[]");
    const zhTw = JSON.parse(row.faqsZhTw ?? "[]");
    if (![en, ja, zh, zhTw].every((items) => items.length === ko.length)) {
      throw new Error(`FAQ count mismatch for id=${row.id}`);
    }

    ko.forEach((faq, index) => {
      const localized = [en[index], ja[index], zh[index], zhTw[index]];
      const sourceText = `${faq.question}\n${faq.answer}`;
      const localizedText = localized.map((item) => `${item.question}\n${item.answer}`);
      localeSummary.ko.faqCount += 1;
      if (localeSummary.ko.matcher.test(sourceText)) localeSummary.ko.regionalMentions += 1;
      ["en", "ja", "zh", "zhTw"].forEach((language, languageIndex) => {
        localeSummary[language].faqCount += 1;
        if (localeSummary[language].matcher.test(localizedText[languageIndex])) localeSummary[language].regionalMentions += 1;
      });
      const countMatch = localized.every((item) => item?.question && item?.answer) ? "PASS" : "CHECK";
      const sourceNames = [row.name, row.slug];
      const localizedNames = [[row.nameEn, row.slug], [row.nameJa, row.slug], [row.nameZh, row.slug], [row.nameZhTw, row.slug]];
      const numberResults = localized.map((item, languageIndex) => numberMatch(sourceText, `${item.question}\n${item.answer}`, sourceNames, localizedNames[languageIndex]));
      checks += numberResults.filter((value) => value === "CHECK").length;
      ["en", "ja", "zh", "zhTw"].forEach((language, languageIndex) => {
        if (numberResults[languageIndex] === "CHECK") {
          numericReviewRows.push({
            id: row.id,
            slug: row.slug,
            faqIndex: index + 1,
            language,
            sourceNumbers: numbers(sourceText, sourceNames),
            translatedNumbers: numbers(`${localized[languageIndex].question}\n${localized[languageIndex].answer}`, localizedNames[languageIndex]),
          });
        }
      });
      faqCount += 1;
      lines.push([
        row.id, row.slug, row.name, row.nameEn, row.nameJa, row.nameZh, row.nameZhTw, index + 1,
        faq.question, faq.answer, en[index].question, en[index].answer, ja[index].question, ja[index].answer,
        zh[index].question, zh[index].answer, zhTw[index].question, zhTw[index].answer,
        countMatch, ...numberResults,
      ].map(csv).join(","));
    });
  }
  fs.writeFileSync(outputPath, `${lines.join("\n")}\n`);
  const reviewPath = outputPath.replace(/\.csv$/i, "_numeric_review.json");
  fs.writeFileSync(reviewPath, `${JSON.stringify(numericReviewRows, null, 2)}\n`);
  const localeSummaryWithRates = Object.fromEntries(Object.entries(localeSummary).map(([language, value]) => [language, {
    faqCount: value.faqCount,
    regionalMentions: value.regionalMentions,
    regionalMentionRatePercent: Number((value.regionalMentions / value.faqCount * 100).toFixed(1)),
  }]));
  const summaryPath = outputPath.replace(/\.csv$/i, "_summary.json");
  fs.writeFileSync(summaryPath, `${JSON.stringify({ pages: rows.length, faqCount, numericChecksRequiringReview: checks, localeSummary: localeSummaryWithRates }, null, 2)}\n`);
  console.log(JSON.stringify({ pages: rows.length, faqCount, numericChecksRequiringReview: checks, outputPath, reviewPath, summaryPath, localeSummary: localeSummaryWithRates }));
} finally {
  connection.destroy();
}

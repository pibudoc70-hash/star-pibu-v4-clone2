import fs from "node:fs";

const inputPath = process.argv[2] ?? "/tmp/equipment3_zh_tw_body_translations_final.json";
const outputPath = process.argv[3] ?? "/home/ubuntu/Downloads/star-pibu_zh_tw_body_comparison_2026-08-15.csv";
const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const fields = ["desc", "detail", "effect", "caution", "sessions", "time", "recovery"];
const numberTokens = (value) => String(value ?? "").match(/\d+/g)?.join("|") ?? "";
const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const rows = [["id", "slug", "field", "korean_source", "zh_tw_localized", "source_numeric_tokens", "zh_tw_numeric_tokens"]];
for (const item of payload.items) {
  for (const field of fields) {
    const source = item.source[field] ?? "";
    const translation = item.translation[field] ?? "";
    rows.push([item.id, item.slug, field, source, translation, numberTokens(source), numberTokens(translation)]);
  }
}
fs.writeFileSync(outputPath, `${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}\n`);
console.log(JSON.stringify({ outputPath, itemCount: payload.items.length, rowCount: rows.length - 1, qaFailureCount: Object.keys(payload.qaErrors ?? {}).length }));

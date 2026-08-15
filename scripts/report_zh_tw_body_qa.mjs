import fs from "node:fs";

const inputPath = process.argv[2] ?? "/tmp/equipment3_zh_tw_body_translations.json";
const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const byId = new Map(payload.items.map((item) => [String(item.id), item]));

const failures = Object.entries(payload.qaErrors ?? {}).map(([id, errors]) => {
  const item = byId.get(id);
  const fields = [...new Set(errors.map((error) => error.split(":", 1)[0]))];
  return {
    id: Number(id),
    slug: item?.slug ?? "",
    errors,
    fields: Object.fromEntries(fields.map((field) => [field, {
      source: item?.source?.[field] ?? "",
      translation: item?.translation?.[field] ?? "",
    }])),
  };
});

console.log(JSON.stringify({
  itemCount: payload.itemCount,
  failureCount: failures.length,
  failures,
}, null, 2));

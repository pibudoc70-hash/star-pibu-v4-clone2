import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const outputDir = "/home/ubuntu/equipment_faq_sources";
fs.mkdirSync(outputDir, { recursive: true });

const connection = await mysql.createConnection(databaseUrl);
try {
  const [rows] = await connection.execute(`
    SELECT id, slug, category, name, nameEn, nameJa, nameZh, faqs, faqsEn, faqsJa, faqsZh, faqsZhTw
    FROM equipment3
    WHERE faqs IS NOT NULL AND JSON_LENGTH(faqs) > 0
    ORDER BY category, sortOrder, id
  `);

  const inventory = rows.map((row) => {
    const record = {
      id: Number(row.id),
      slug: row.slug,
      category: row.category,
      name: row.name,
      nameEn: row.nameEn || "",
      nameJa: row.nameJa || "",
      nameZh: row.nameZh || "",
      faqs: JSON.parse(row.faqs),
      counts: {
        ko: JSON.parse(row.faqs).length,
        en: row.faqsEn ? JSON.parse(row.faqsEn).length : 0,
        ja: row.faqsJa ? JSON.parse(row.faqsJa).length : 0,
        zh: row.faqsZh ? JSON.parse(row.faqsZh).length : 0,
        zhTw: row.faqsZhTw ? JSON.parse(row.faqsZhTw).length : 0,
      },
    };
    fs.writeFileSync(path.join(outputDir, `${record.id}.json`), `${JSON.stringify(record, null, 2)}\n`, "utf8");
    return record;
  });

  fs.writeFileSync("/home/ubuntu/equipment_faq_inventory.json", `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
  fs.writeFileSync("/home/ubuntu/equipment_faq_source_paths.json", `${JSON.stringify(inventory.map((record) => path.join(outputDir, `${record.id}.json`)), null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ pages: inventory.length, faqCount: inventory.reduce((sum, record) => sum + record.counts.ko, 0) }));
} finally {
  await connection.end();
}

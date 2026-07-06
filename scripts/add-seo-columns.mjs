/**
 * equipment3 테이블에 SEO 메타 컬럼 추가
 * seoTitle, seoDescription, seoKeywords, ogImageUrl
 */
import { createConnection } from "mysql2/promise";
import { config } from "dotenv";
config();

const conn = await createConnection(process.env.DATABASE_URL);

const columns = [
  "ALTER TABLE `equipment3` ADD COLUMN IF NOT EXISTS `seoDescription` TEXT",
  "ALTER TABLE `equipment3` ADD COLUMN IF NOT EXISTS `seoKeywords` VARCHAR(500) DEFAULT ''",
  "ALTER TABLE `equipment3` ADD COLUMN IF NOT EXISTS `ogImageUrl` TEXT",
];

for (const sql of columns) {
  try {
    await conn.execute(sql);
    console.log("✅ OK:", sql.slice(0, 70));
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME") {
      console.log("⏭ Already exists:", sql.slice(40, 80));
    } else {
      console.error("❌ Error:", err.message);
    }
  }
}

await conn.end();
console.log("Done.");

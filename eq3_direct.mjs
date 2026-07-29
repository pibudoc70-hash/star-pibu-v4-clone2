// mysql2로 직접 DB 조회 - DATABASE_URL 환경변수 사용
import { createConnection } from "mysql2/promise";
import { writeFileSync } from "fs";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }

const conn = await createConnection(url);
const [rows] = await conn.query(
  "SELECT id, name, nameZh, categoryZh, descZh, detailZh, effectZh, cautionZh, sessionsZh, timeZh, recoveryZh FROM equipment3 WHERE isActive = '1' ORDER BY sortOrder ASC"
);
writeFileSync("/home/ubuntu/eq3_data.json", JSON.stringify(rows, null, 2));
console.log(`Total: ${rows.length} rows`);
for (const r of rows) {
  console.log(`id=${r.id} | name=${r.name} | nameZh=${r.nameZh} | categoryZh=${r.categoryZh}`);
}
await conn.end();
process.exit(0);

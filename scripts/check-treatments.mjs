import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

// treatments 컬럼 목록 확인
const [cols] = await conn.execute("SHOW COLUMNS FROM treatments");
console.log("=== treatments 컬럼 ===");
console.table(cols.map(c => ({ Field: c.Field, Type: c.Type })));

// 전체 treatments 데이터 샘플
const [all] = await conn.execute("SELECT id, slug, name, section FROM treatments ORDER BY sortOrder LIMIT 30");
console.log("\n=== treatments 전체 목록 ===");
console.table(all);

// treatmentCategories 테이블 확인
try {
  const [tcs] = await conn.execute("SELECT * FROM treatmentCategories");
  console.log("\n=== treatmentCategories ===");
  console.table(tcs);
} catch (e) {
  console.log("treatmentCategories 테이블 없음:", e.message);
}

await conn.end();

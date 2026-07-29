import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute(
  "SELECT id, name, nameZh, categoryZh, descZh, detailZh, effectZh, cautionZh, sessionsZh, timeZh, recoveryZh FROM equipment3 WHERE isActive = '1' ORDER BY sortOrder ASC"
);
console.log(JSON.stringify(rows, null, 2));
await conn.end();

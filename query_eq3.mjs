import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.query(
  'SELECT id, name, nameZh, categoryZh, LEFT(descZh, 60) as descZh FROM equipment3 WHERE isActive=1 ORDER BY sortOrder LIMIT 20'
);
console.log(JSON.stringify(rows, null, 2));
await conn.end();

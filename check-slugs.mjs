import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.query('SELECT slug FROM equipment3 ORDER BY slug');
console.log('=== DB slugs ===');
rows.forEach(r => console.log(r.slug));
console.log(`Total: ${rows.length}`);
await conn.end();

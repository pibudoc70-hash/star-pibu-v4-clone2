import fs from "node:fs";
import mysql from "mysql2/promise";

const outputPath = process.argv[2] ?? "/tmp/equipment3_zh_tw_body_sources.json";
const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [rows] = await connection.execute(`
    SELECT
      id, slug, name, nameZhTw,
      \`desc\`, \`detail\`, \`effect\`, \`caution\`, \`sessions\`, \`time\`, \`recovery\`
    FROM equipment3
    WHERE isActive = '1'
    ORDER BY id
  `);

  if (rows.length !== 72) throw new Error(`Expected 72 active equipment3 rows, received ${rows.length}`);

  const fields = ["desc", "detail", "effect", "caution", "sessions", "time", "recovery"];
  const payload = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    nameKo: row.name,
    nameZhTw: row.nameZhTw ?? "",
    source: Object.fromEntries(fields.map((field) => [field, row[field] ?? ""])),
  }));
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify({ outputPath, itemCount: payload.length }, null, 2));
} finally {
  connection.destroy();
}

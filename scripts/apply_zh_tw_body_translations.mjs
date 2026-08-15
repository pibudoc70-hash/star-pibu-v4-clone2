import fs from "node:fs";
import mysql from "mysql2/promise";

const inputPath = process.argv[2] ?? "/tmp/equipment3_zh_tw_body_translations.json";
const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
if (payload.itemCount !== 72 || !Array.isArray(payload.items) || payload.items.length !== 72) {
  throw new Error("Expected an approved 72-item translation payload");
}
if (payload.qaErrors && Object.keys(payload.qaErrors).length > 0) {
  throw new Error("Refusing to apply a payload with QA errors");
}

const fields = ["descZhTw", "detailZhTw", "effectZhTw", "cautionZhTw", "sessionsZhTw", "timeZhTw", "recoveryZhTw"];
const sourceFields = ["desc", "detail", "effect", "caution", "sessions", "time", "recovery"];
const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  await connection.beginTransaction();
  for (const item of payload.items) {
    const values = sourceFields.map((field) => item.translation[field] ?? "");
    await connection.execute(
      `UPDATE equipment3 SET ${fields.map((field) => `\`${field}\` = ?`).join(", ")} WHERE id = ?`,
      [...values, item.id],
    );
  }
  await connection.commit();
  console.log(JSON.stringify({ appliedItems: payload.items.length, fields }));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.destroy();
}

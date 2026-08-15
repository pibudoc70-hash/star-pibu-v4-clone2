import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const [packageDir, mode] = process.argv.slice(2);
if (!packageDir || !["--check", "--apply"].includes(mode)) {
  throw new Error("Usage: node scripts/apply_zh_tw_names_from_package.mjs <package-dir> --check|--apply");
}

const resultDir = path.join(packageDir, "results");
const files = fs.readdirSync(resultDir).filter((name) => /^result_batch_\d+\.json$/.test(name)).sort();
if (files.length !== 12) throw new Error(`Expected 12 result batches, found ${files.length}`);

const records = files.flatMap((file) => {
  const batch = JSON.parse(fs.readFileSync(path.join(resultDir, file), "utf8"));
  return Array.isArray(batch) ? batch : batch.pages;
});
if (records.length !== 72) throw new Error(`Expected 72 records, found ${records.length}`);

const seen = new Set();
for (const record of records) {
  if (!Number.isInteger(record.id) || typeof record.slug !== "string" || typeof record.treatmentNameZhTwSuggestion !== "string") {
    throw new Error("Invalid id, slug, or treatmentNameZhTwSuggestion in package");
  }
  const name = record.treatmentNameZhTwSuggestion.trim();
  if (!name || name.length > 200 || /[가-힣]/.test(name)) {
    throw new Error(`Invalid Traditional Chinese name for id=${record.id}`);
  }
  if (seen.has(record.id)) throw new Error(`Duplicate id=${record.id}`);
  seen.add(record.id);
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const ids = records.map((record) => record.id);
  const [rows] = await connection.execute(
    `SELECT id, slug FROM equipment3 WHERE id IN (${ids.map(() => "?").join(",")})`,
    ids,
  );
  if (rows.length !== records.length) throw new Error(`Database row count mismatch: ${rows.length}`);
  const slugById = new Map(rows.map((row) => [row.id, row.slug]));
  for (const record of records) {
    if (slugById.get(record.id) !== record.slug) throw new Error(`Slug mismatch for id=${record.id}`);
  }

  if (mode === "--check") {
    console.log(JSON.stringify({ mode: "checked", pages: records.length, names: records.map(({ id, slug, treatmentNameZhTwSuggestion }) => ({ id, slug, nameZhTw: treatmentNameZhTwSuggestion.trim() })) }));
  } else {
    await connection.beginTransaction();
    for (const record of records) {
      await connection.execute("UPDATE equipment3 SET nameZhTw = ? WHERE id = ? AND slug = ?", [record.treatmentNameZhTwSuggestion.trim(), record.id, record.slug]);
    }
    await connection.commit();
    console.log(JSON.stringify({ mode: "applied", pages: records.length }));
  }
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.destroy();
}

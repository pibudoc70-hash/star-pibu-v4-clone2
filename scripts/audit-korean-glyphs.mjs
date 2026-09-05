import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_ROOTS = [
  path.join(PROJECT_ROOT, "client", "src"),
  path.join(PROJECT_ROOT, "shared"),
];
const OUTPUT_PATH = path.join(PROJECT_ROOT, "reports", "korean-glyph-audit.json");
const TARGET_TABLES = ["notices", "events", "popupEvents", "treatments", "equipment3"];
const TEXT_TYPES = new Set(["char", "varchar", "text", "mediumtext", "longtext", "json"]);
const HANGUL_SYLLABLE = /[\uAC00-\uD7A3]/gu;
const UI_SYMBOLS = ["─", "々", "✅", "❌", "⚕", "✨", "⚡", "✦", "⭐", "⏳", "☰", "✈", "⏱"];
// 2026-09 runtime QA: home event surface rendered ‘두툼했던…’; it is not present in the audited source/DB text.
const OBSERVED_RUNTIME_HANGUL = ["툼"];

function countChars(text, target) {
  const counts = new Map();
  for (const char of text.match(target) ?? []) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }
  return counts;
}

function mergeCounts(target, source) {
  for (const [char, count] of source) {
    target.set(char, (target.get(char) ?? 0) + count);
  }
}

function serialiseDatabaseText(value) {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  return JSON.stringify(value);
}

async function listSourceFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listSourceFiles(fullPath);
    return /\.(?:ts|tsx|css|html|json)$/u.test(entry.name) ? [fullPath] : [];
  }));
  return nested.flat();
}

const sourceFiles = (await Promise.all(SOURCE_ROOTS.map(listSourceFiles))).flat();
const sourceText = (await Promise.all(sourceFiles.map(file => fs.readFile(file, "utf8")))).join("\n");
const sourceHangul = countChars(sourceText, HANGUL_SYLLABLE);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the non-destructive glyph audit.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [columns] = await connection.execute(
  `SELECT table_name AS tableName, column_name AS columnName
   FROM information_schema.columns
   WHERE table_schema = DATABASE()
     AND table_name IN (${TARGET_TABLES.map(() => "?").join(", ")})
     AND data_type IN (${Array.from(TEXT_TYPES).map(() => "?").join(", ")})
   ORDER BY table_name, ordinal_position`,
  [...TARGET_TABLES, ...TEXT_TYPES],
);

const columnsByTable = new Map(TARGET_TABLES.map(table => [table, []]));
for (const column of columns) columnsByTable.get(column.tableName)?.push(column.columnName);

const databaseHangul = new Map();
const tableSummaries = [];
for (const [tableName, columnNames] of columnsByTable) {
  if (columnNames.length === 0) continue;
  const projection = columnNames.map(column => `\`${column.replaceAll("`", "``")}\``).join(", ");
  const [rows] = await connection.query(`SELECT ${projection} FROM \`${tableName}\``);
  const text = rows.flatMap(row => columnNames.map(column => serialiseDatabaseText(row[column]))).join("\n");
  const counts = countChars(text, HANGUL_SYLLABLE);
  mergeCounts(databaseHangul, counts);
  tableSummaries.push({
    tableName,
    columns: columnNames,
    rowCount: rows.length,
    uniqueHangulSyllables: counts.size,
  });
}
await connection.end();

const primaryHangul = new Set([...sourceHangul.keys(), ...databaseHangul.keys(), ...OBSERVED_RUNTIME_HANGUL]);
const presentUiSymbols = UI_SYMBOLS.filter(symbol => sourceText.includes(symbol));
const report = {
  generatedAt: new Date().toISOString(),
  source: {
    fileCount: sourceFiles.length,
    uniqueHangulSyllables: sourceHangul.size,
  },
  database: {
    tables: tableSummaries,
    uniqueHangulSyllables: databaseHangul.size,
  },
  primarySubset: {
    uniqueHangulSyllables: primaryHangul.size,
    codePoints: [...primaryHangul].map(char => char.codePointAt(0)).sort((a, b) => a - b),
  },
  runtimeVerification: {
    observedHangulOutsideSourceAndDatabase: OBSERVED_RUNTIME_HANGUL,
  },
  uiSymbols: {
    reviewed: UI_SYMBOLS,
    foundInClientSource: presentUiSymbols,
    missingFromClientSource: UI_SYMBOLS.filter(symbol => !presentUiSymbols.includes(symbol)),
  },
};

await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  sourceUniqueHangul: sourceHangul.size,
  databaseUniqueHangul: databaseHangul.size,
  primaryUniqueHangul: primaryHangul.size,
  uiSymbolsInClientSource: presentUiSymbols,
  output: OUTPUT_PATH,
}, null, 2));

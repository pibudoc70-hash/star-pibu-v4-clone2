import { createConnection } from "mysql2/promise";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) {
  console.error("TEST_DATABASE_URL is required; diagnostic migration was not started.");
  process.exit(1);
}

const sourceUrl = new URL(testDatabaseUrl);
const sourceDatabase = sourceUrl.pathname.replace(/^\//, "");
if (!sourceDatabase.endsWith("_test")) {
  console.error("TEST_DATABASE_URL must target a database ending in _test; diagnostic migration was not started.");
  process.exit(1);
}

const diagnosticDatabase = `${sourceDatabase}_migration_diagnostic`;
const adminUrl = new URL(sourceUrl);
adminUrl.pathname = "/mysql";
const diagnosticUrl = new URL(sourceUrl);
diagnosticUrl.pathname = `/${diagnosticDatabase}`;
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = path.join(rootDir, "drizzle");

const admin = await createConnection(adminUrl.toString());
await admin.query(`DROP DATABASE IF EXISTS \`${diagnosticDatabase}\``);
await admin.query(`CREATE DATABASE \`${diagnosticDatabase}\``);
await admin.end();

const connection = await createConnection(diagnosticUrl.toString());
const migrationFiles = (await readdir(migrationsDir))
  .filter((file) => /^\d{4}_.+\.sql$/.test(file))
  .sort();

let migrationFailed = false;

try {
  migrationLoop: for (const file of migrationFiles) {
    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    const statements = sql
      .split("--> statement-breakpoint")
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const [index, statement] of statements.entries()) {
      try {
        await connection.query(statement);
      } catch (error) {
        const code = error && typeof error === "object" && "code" in error ? error.code : "UNKNOWN";
        const message = error instanceof Error ? error.message : String(error);
        console.error(`MIGRATION_DIAGNOSTIC_FAILURE file=${file} statement=${index + 1} code=${code}`);
        console.error(message);
        migrationFailed = true;
        break migrationLoop;
      }
    }
  }

  if (migrationFailed) {
    process.exitCode = 1;
  } else {
    console.log("MIGRATION_DIAGNOSTIC_SUCCESS all migration SQL completed on the disposable test database.");
  }
} finally {
  await connection.end();
}

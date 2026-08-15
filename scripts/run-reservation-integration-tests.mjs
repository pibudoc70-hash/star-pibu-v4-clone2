import { spawnSync } from "node:child_process";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) {
  console.error("TEST_DATABASE_URL is required for reservation integration tests; no database command was executed.");
  process.exit(1);
}

let parsedUrl;
try {
  parsedUrl = new URL(testDatabaseUrl);
} catch {
  console.error("TEST_DATABASE_URL must be a valid database URL; no database command was executed.");
  process.exit(1);
}

if (!/^mysql(?:s)?:$/.test(parsedUrl.protocol) || !parsedUrl.hostname) {
  console.error("TEST_DATABASE_URL must use a MySQL protocol and hostname; no database command was executed.");
  process.exit(1);
}

const result = spawnSync(
  "pnpm",
  ["exec", "vitest", "run", "server/__tests__/reservation.test.ts"],
  {
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
    stdio: "inherit",
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);

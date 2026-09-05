import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const packageJson = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf8")) as {
  scripts: Record<string, string>;
};
const readme = readFileSync(resolve(projectRoot, "README.md"), "utf8");

describe("database script responsibilities", () => {
  it("keeps schema artifact generation free of database migration commands", () => {
    expect(packageJson.scripts["db:generate"]).toBe("drizzle-kit generate");
    expect(packageJson.scripts["db:generate"]).not.toContain("migrate");
    expect(packageJson.scripts).not.toHaveProperty("db:push");
  });

  it("requires explicit local, CI, or production migration intent", () => {
    expect(packageJson.scripts["db:migrate:local"]).toBe("drizzle-kit migrate");
    expect(packageJson.scripts["db:migrate:ci"]).toBe("drizzle-kit migrate");
    expect(packageJson.scripts["db:migrate:production"]).toBe("drizzle-kit migrate");
    expect(readme).toContain("pnpm db:generate");
    expect(readme).toContain("pnpm db:migrate:production");
  });

  it("keeps database and test entry points stable while making static precompression explicit in builds", () => {
    expect(packageJson.scripts.build).toBe(
      "node scripts/gen-treatment-seo.mjs && vite build && node scripts/precompress-static-assets.mjs && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
    );
    expect(packageJson.scripts.test).toBe("pnpm test:unit");
    expect(packageJson.scripts["test:unit"]).toContain("vitest run");
    expect(packageJson.scripts["test:integration"]).toBe("node scripts/run-reservation-integration-tests.mjs");
  });
});

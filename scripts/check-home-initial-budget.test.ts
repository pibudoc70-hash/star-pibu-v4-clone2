import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(projectRoot, "scripts/check-home-initial-budget.mjs"), "utf8");

describe("home initial transfer budget script", () => {
  it("accepts both the legacy asset URL and the app-controlled precompressed static asset URL", () => {
    expect(source).toContain('\\/(?:__static\\/)?assets\\/');
    expect(source).toContain('replace(/^\\/(?:__static\\/)?assets\\//, "")');
  });
});

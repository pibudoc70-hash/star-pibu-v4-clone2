import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const viteConfig = fs.readFileSync(path.join(projectRoot, "vite.config.ts"), "utf8");

describe("production precompressed asset base path", () => {
  it("keeps development at root and routes production assets through the app-controlled static prefix", () => {
    expect(viteConfig).toContain('base: command === "build" ? "/__static/" : "/"');
  });
});

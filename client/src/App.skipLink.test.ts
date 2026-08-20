import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("Home keyboard skip navigation", () => {
  it("provides a focus-visible skip link targeting the single main landmark", () => {
    expect(source).toContain('href="#main-content"');
    expect(source).toContain('id="main-content"');
    expect(source).toContain("focus:translate-y-0");
    expect(source).toContain('tabIndex={-1}');
  });
});

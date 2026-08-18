import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Doctor desktop panel height", () => {
  it("keeps the detail card at least as tall as the longest doctor profile", () => {
    expect(styles).toMatch(/\.dr-desktop-panel\s*\{\s*min-height:\s*741px;\s*\}/);
  });
});

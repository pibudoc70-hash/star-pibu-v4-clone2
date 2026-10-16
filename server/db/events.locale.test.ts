import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "server/db/events.ts"), "utf8");

describe("event language isolation", () => {
  it("keeps Traditional Chinese event queries separate from Simplified Chinese", () => {
    expect(source).toContain("eq(events.targetLang, lang)");
    expect(source).not.toContain('lang === "zh-TW" ? "zh"');
  });
});

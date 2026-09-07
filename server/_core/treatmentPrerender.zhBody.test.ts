import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "server/_core/treatmentPrerender.ts"),
  "utf8",
);

describe("Chinese treatment prerender body contract", () => {
  it("uses only the existing zh effect field and omits the target row when that field is absent", () => {
    expect(source).toContain('const effect = lang === "zh" ? t.effect?.zh?.trim() || "" : pick(t.effect, lang);');
    expect(source).toContain('const target = lang === "zh"\n    ? effect');
    expect(source).toContain('].filter(([, value]) => value);');
  });
});

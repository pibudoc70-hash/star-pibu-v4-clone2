import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Equipment3 detail section order", () => {
  it("places the FAQ block before the clinic and treatment information block", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "client/src/pages/Equipment3Detail.tsx"),
      "utf8",
    );

    expect(source.indexOf("{managedFaqs.length > 0 && (")).toBeGreaterThan(-1);
    expect(source.indexOf("<aside className=\"mb-12 rounded-2xl border border-slate-200")).toBeGreaterThan(-1);
    expect(source.indexOf("{managedFaqs.length > 0 && (")).toBeLessThan(
      source.indexOf("<aside className=\"mb-12 rounded-2xl border border-slate-200"),
    );
  });
});

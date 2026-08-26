import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/ResultsSection.tsx"), "utf8");

describe("ResultsSection statistic-card removal", () => {
  it("removes the three visible statistic cards without removing adjacent results content", () => {
    expect(source).not.toContain("r.stats.map(");
    expect(source).not.toContain("useCountUp");
    expect(source).not.toContain("useClinicStats");
    expect(source).toContain("r.whyItems.map(");
    expect(source).toContain("r.treatmentResults.map(");
  });
});

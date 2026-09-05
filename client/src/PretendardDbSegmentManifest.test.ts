import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const audit = JSON.parse(readFileSync(resolve(root, "reports/korean-glyph-audit.json"), "utf8"));
const manifest = JSON.parse(readFileSync(resolve(root, "reports/pretendard-db-segment-manifest.json"), "utf8"));

describe("Pretendard DB glyph segment manifest", () => {
  it("covers every Hangul syllable without overlap and includes every audited primary glyph", () => {
    expect(manifest.primary.hangulSyllables).toBe(audit.primarySubset.uniqueHangulSyllables);
    expect(manifest.primary.hangulSyllables + manifest.secondary.hangulSyllables).toBe(11172);
    expect(manifest.validation).toEqual({
      overlapHangulSyllables: 0,
      missingHangulSyllables: 0,
      primaryAuditCoverageMissing: 0,
      primaryOutputCoverageMissing: 0,
      secondaryOutputCoverageMissing: 0,
    });
  });

  it("keeps the secondary face in a disjoint non-empty Unicode range list", () => {
    expect(manifest.primary.unicodeRange).not.toContain("U+AC00-D7A3");
    expect(manifest.secondary.unicodeRange.length).toBeGreaterThan(0);
  });
});

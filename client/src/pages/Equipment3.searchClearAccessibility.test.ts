import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3.tsx"), "utf8");
const clearLabelIndex = source.indexOf('aria-label={getText("검색어 지우기"');
const clearButtonSource = source.slice(
  source.lastIndexOf("<button", clearLabelIndex),
  source.indexOf("</button>", clearLabelIndex) + "</button>".length,
);

describe("Equipment3 search clear accessibility", () => {
  it("uses a native 44px touch target with a semantic focus ring", () => {
    expect(clearButtonSource).toContain('type="button"');
    expect(clearButtonSource).toContain("min-w-11");
    expect(clearButtonSource).toContain("min-h-11");
    expect(clearButtonSource).toContain("focus-visible:ring-[var(--focus-ring)]");
    expect(clearButtonSource).toContain("aria-label={getText(");
  });
});

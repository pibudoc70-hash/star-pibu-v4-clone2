import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/pages/Equipment3.tsx"),
  "utf8",
);
const cardSource = source.slice(
  source.indexOf("function Equipment3Card"),
  source.indexOf("// ─────────────────────────────────────────────────────────────────────────────"),
);

describe("Equipment3 detail card navigation semantics", () => {
  it("uses a native detail link instead of div role button navigation", () => {
    expect(cardSource).toContain('<a\n      href={detailPath}');
    expect(cardSource).toContain("aria-label={`${name} ${detail}`}");
    expect(cardSource).toContain("focus-visible:ring-2");
    expect(cardSource).toContain("focus-visible:ring-offset-2");
    expect(cardSource).toContain("focus-visible:ring-[var(--focus-ring)]");
    expect(cardSource).not.toContain("focus-visible:ring-[#d1ab67]");
    expect(cardSource).not.toContain('role="button"');
    expect(cardSource).not.toContain('onClick={() => setLocation(detailPath)}');
    expect(cardSource).not.toContain('onKeyDown={(e) => e.key === "Enter" && setLocation(detailPath)}');
    expect(cardSource).not.toContain("<button");
    expect(cardSource).not.toContain("<a href=");
  });
});

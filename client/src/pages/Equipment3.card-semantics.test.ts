import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/pages/Equipment3.tsx"),
  "utf8",
);

describe("Equipment3 detail card navigation semantics", () => {
  it("uses a native detail link instead of div role button navigation", () => {
    expect(source).toContain('<a\n      href={detailPath}');
    expect(source).not.toContain('role="button"');
    expect(source).not.toContain('onClick={() => setLocation(detailPath)}');
    expect(source).not.toContain('onKeyDown={(e) => e.key === "Enter" && setLocation(detailPath)}');
  });
});

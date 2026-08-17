import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/treatments/TreatmentCard.tsx"),
  "utf8",
);

describe("TreatmentCard dialog trigger semantics", () => {
  it("uses a native button to open the detail dialog instead of a div role button", () => {
    expect(source).toContain('<button\n        type="button"');
    expect(source).toContain("onClick={() => setOpen(true)}");
    expect(source).not.toContain('role="button"');
    expect(source).not.toContain('onKeyDown={(e) => e.key === "Enter" && setOpen(true)}');
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/treatments/TreatmentsEquipmentSkeleton.tsx"),
  "utf8",
);

describe("TreatmentsEquipmentSkeleton", () => {
  it("keeps the treatment anchor, status announcement, and reduced-motion-safe skeleton cards", () => {
    expect(source).toContain('id={id}');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('role="status"');
    expect(source).toContain("motion-reduce:animate-none");
    expect(source).toContain("grid-cols-1 sm:grid-cols-2 lg:grid-cols-3");
  });
});

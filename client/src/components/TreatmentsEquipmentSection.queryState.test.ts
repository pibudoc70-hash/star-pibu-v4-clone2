import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/TreatmentsEquipmentSection.tsx"),
  "utf8",
);

const adapterSource = readFileSync(
  resolve(process.cwd(), "client/src/hooks/useEquipment3AsTreatments.ts"),
  "utf8",
);

describe("TreatmentsEquipmentSection query states", () => {
  it("exposes error and retry state instead of leaving a failed request as loading", () => {
    expect(adapterSource).toContain("isError");
    expect(adapterSource).toContain("refetch");
    expect(source).toContain('role="alert"');
    expect(source).toContain("onClick={refetch}");
    expect(source).toContain('aria-live="assertive"');
  });

  it("provides an explicit empty state when the query succeeds without treatment tabs", () => {
    expect(source).toContain("!isLoading && !isError && tabs.length === 0");
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-live="polite"');
  });
});

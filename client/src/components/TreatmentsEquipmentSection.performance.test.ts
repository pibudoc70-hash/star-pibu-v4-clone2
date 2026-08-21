import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("TreatmentsEquipmentSection initial skeleton timing contract", () => {
  it("uses the existing initial loading state as the only timing input", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/TreatmentsEquipmentSection.tsx"), "utf8");

    expect(source).toContain('import { useTreatmentsSkeletonTiming } from "@/hooks/useTreatmentsSkeletonTiming";');
    expect(source).toContain("useTreatmentsSkeletonTiming(isLoading);");
    expect(source).toContain("{isLoading && <TreatmentsEquipmentSkeleton");
  });
});

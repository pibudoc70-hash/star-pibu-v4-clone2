import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("SpecialEventSection cache-state skeleton contract", () => {
  it("limits skeleton timing to initial loading and does not use background isFetching as a trigger", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/SpecialEventSection.tsx"), "utf8");

    expect(source).toContain("const { data: specialEvents = [], isLoading, error, refetch }");
    expect(source).toContain("const isInitialSkeletonVisible = !isFetchVisible || isLoading;");
    expect(source).not.toContain("useEventSkeletonTiming(isFetching)");
    expect(source).not.toContain("const isInitialSkeletonVisible = !isFetchVisible || isFetching;");
  });
});

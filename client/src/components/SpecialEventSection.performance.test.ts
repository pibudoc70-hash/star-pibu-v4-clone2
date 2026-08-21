import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("SpecialEventSection initial skeleton timing contract", () => {
  it("uses the initial visible/loading state as the only skeleton timing input", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/SpecialEventSection.tsx"), "utf8");

    expect(source).toContain('import { useEventSkeletonTiming } from "@/hooks/useEventSkeletonTiming";');
    expect(source).toContain("const isInitialSkeletonVisible = !isFetchVisible || isLoading;");
    expect(source).toContain("useEventSkeletonTiming(isInitialSkeletonVisible);");
    expect(source).toContain("if (isInitialSkeletonVisible) {");
  });
});

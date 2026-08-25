import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(join(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("Home ResultsStatisticsSection module loading", () => {
  it("uses a static ResultsStatisticsSection import while retaining deferred rendering", () => {
    expect(homeSource).toContain('import ResultsStatisticsSection from "@/components/ResultsStatisticsSection";');
    expect(homeSource).not.toContain('lazy(() => import("@/components/ResultsStatisticsSection"))');
    expect(homeSource).toMatch(/<DeferredMount[\s\S]*?anchorSelectors=\{\[[^\]]*"#results-statistics"[^\]]*\]\}[\s\S]*?<ResultsStatisticsSection/);
  });
});

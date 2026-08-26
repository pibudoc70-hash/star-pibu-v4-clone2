import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("pain-management FAQ structured data", () => {
  it("adds the dedicated pain-management FAQ collection to the home FAQPage input", () => {
    expect(homeSource).toContain('import { PAIN_MANAGEMENT_KO_FAQS } from "@/lib/painManagementFaq"');
    expect(homeSource).toContain("...PAIN_MANAGEMENT_KO_FAQS,");
  });
});

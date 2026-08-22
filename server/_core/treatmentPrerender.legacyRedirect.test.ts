import { describe, expect, it } from "vitest";
import { getLegacyTreatmentRedirectPath } from "./treatmentPrerender";

describe("treatment legacy redirect ownership", () => {
  it("keeps classic Ulthera and Ultherapy Prime on their distinct canonical routes", () => {
    expect(getLegacyTreatmentRedirectPath("울쎄라")).toBe("/treatments/ulthera-classic");
    expect(getLegacyTreatmentRedirectPath("울쎄라피 프라임")).toBe("/treatments/ulthera");
  });

  it("returns no redirect for an unknown legacy name", () => {
    expect(getLegacyTreatmentRedirectPath("존재하지 않는 시술")).toBeNull();
  });
});

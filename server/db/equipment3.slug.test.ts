import { describe, expect, it } from "vitest";
import { getEquipment3SlugFallback } from "./equipment3";

describe("getEquipment3SlugFallback", () => {
  it("maps the published 울써라피 legacy spelling and separator to the canonical stored slug", () => {
    expect(getEquipment3SlugFallback("울써라피-프라임")).toBe("울쎄라피프라임");
    expect(getEquipment3SlugFallback("울써라피프라임")).toBe("울쎄라피프라임");
  });

  it("compacts punctuation-separated Korean canonical slugs for an exact fallback lookup", () => {
    expect(getEquipment3SlugFallback("울쎄라피-프라임")).toBe("울쎄라피프라임");
    expect(getEquipment3SlugFallback("울쎄라피 프라임")).toBe("울쎄라피프라임");
  });

  it("does not create a fallback lookup when the requested slug is already canonical", () => {
    expect(getEquipment3SlugFallback("울쎄라피프라임")).toBeUndefined();
  });
});

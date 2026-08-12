import { describe, expect, it } from "vitest";
import { STATIC_TREATMENT_SLUGS, buildStaticTreatmentSection } from "./sitemap";

describe("static treatment sitemap section", () => {
  it("모든 정적 시술 상세 URL과 다국어 hreflang을 포함한다", () => {
    const xml = buildStaticTreatmentSection();

    expect(STATIC_TREATMENT_SLUGS).toContain("ulthera");
    expect(STATIC_TREATMENT_SLUGS).toContain("thermage");
    expect(STATIC_TREATMENT_SLUGS).toContain("under-eye-fat");
    for (const slug of STATIC_TREATMENT_SLUGS) {
      expect(xml).toContain(`/treatments/${slug}`);
      expect(xml).toContain(`/en/treatments/${slug}`);
      expect(xml).toContain(`/ja/treatments/${slug}`);
      expect(xml).toContain(`/zh/treatments/${slug}`);
      expect(xml).toContain(`/zh-tw/treatments/${slug}`);
    }
  });
});

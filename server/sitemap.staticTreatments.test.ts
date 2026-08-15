import { describe, expect, it } from "vitest";
import { STATIC_TREATMENT_SLUGS, STATIC_URLS, buildStaticTreatmentSection } from "./sitemap";

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

  it("공개 다국어 경로마다 상호 hreflang을 포함하고 doctors·directions를 누락하지 않는다", () => {
    const localizedPaths = [
      "/equipment3",
      "/about",
      "/research",
      "/non-covered",
      "/privacy",
      "/doctors",
      "/directions",
    ];

    for (const path of localizedPaths) {
      for (const prefix of ["", "/en", "/ja", "/zh", "/zh-tw"]) {
        const entry = STATIC_URLS.find((item) => item.loc === `https://star-pibu.com${prefix}${path}`);
        expect(entry, `${prefix}${path}`).toBeDefined();
        expect(entry?.hreflang, `${prefix}${path}`).toContain(`hreflang="zh-TW"`);
        expect(entry?.hreflang, `${prefix}${path}`).toContain(`hreflang="x-default"`);
      }
    }
  });

  it("외국인 안내의 번체 경로를 포함하고 ko 대체 경로는 만들지 않는다", () => {
    const guideEntries = STATIC_URLS.filter((entry) => entry.loc.endsWith("/foreign-guide"));

    expect(guideEntries).toHaveLength(4);
    expect(guideEntries.some((entry) => entry.loc === "https://star-pibu.com/zh-tw/foreign-guide")).toBe(true);
    for (const entry of guideEntries) {
      expect(entry.hreflang).toContain(`hreflang="zh-TW"`);
      expect(entry.hreflang).not.toContain(`hreflang="ko"`);
    }
  });
});

import { describe, expect, it } from "vitest";
import { STATIC_TREATMENT_SLUGS, buildGlobalEntries, buildStaticTreatmentSection } from "./sitemap";

describe("static treatment sitemap section", () => {
  it("모든 실제 정적 시술 상세 URL을 포함한다", () => {
    const xml = buildStaticTreatmentSection();

    expect(STATIC_TREATMENT_SLUGS).toContain("ulthera");
    expect(STATIC_TREATMENT_SLUGS).toContain("thermage");
    expect(STATIC_TREATMENT_SLUGS).toContain("under-eye-fat");
    for (const slug of STATIC_TREATMENT_SLUGS) {
      expect(xml).toContain(`/treatments/${slug}`);
    }
  });

  it("공개 다국어 핵심 경로에서 doctors·directions를 누락하지 않는다", () => {
    const globalEntries = buildGlobalEntries();
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
        if (prefix === "") continue;
        const entry = globalEntries.find((item) => item.path === `${prefix}${path}`);
        expect(entry, `${prefix}${path}`).toBeDefined();
      }
    }
  });

  it("외국인 안내의 번체 경로를 포함하고 ko 대체 경로는 만들지 않는다", () => {
    const guideEntries = buildGlobalEntries().filter((entry) => entry.path.endsWith("/foreign-guide"));

    expect(guideEntries).toHaveLength(4);
    expect(guideEntries.some((entry) => entry.path === "/zh-tw/foreign-guide")).toBe(true);
    for (const entry of guideEntries) {
      expect(entry.path).not.toBe("/foreign-guide");
    }
  });
});

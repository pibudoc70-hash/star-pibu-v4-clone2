import { describe, expect, it } from "vitest";
import { buildHomeJsonLd, HOME_SEO_META } from "./homeSeo";

describe("homeSeo", () => {
  it("홈의 canonical·hreflang·pageType 계약을 유지한다", () => {
    expect(HOME_SEO_META.canonical).toBe("https://star-pibu.com");
    expect(HOME_SEO_META.pageType).toBe("home");
    expect(HOME_SEO_META.hreflangs).toHaveLength(6);
  });

  it("사용자 지정 홈 SEO title과 정확히 5개의 핵심 키워드를 유지한다", () => {
    expect(HOME_SEO_META.title).toBe(
      "부산 서면 스타피부과 | 부산울쎄라ㅣ부산써마지ㅣ부산 리프팅ㅣ피부과전문의 3인 진료",
    );
    expect(HOME_SEO_META.keywords).toBe(
      "부산피부과, 부산울쎄라, 부산써마지, 부산리프팅, 부산울쎄라피",
    );
    expect(HOME_SEO_META.keywords.split(",")).toHaveLength(5);
  });

  it("SeoHead의 clinic 정본과 결합될 Breadcrumb·FAQPage·Physician JSON-LD만 생성한다", () => {
    const jsonLd = buildHomeJsonLd([{ question: "질문", answer: "답변" }]);
    expect(jsonLd).toHaveLength(3);
    expect(jsonLd[0]).toMatchObject({ "@type": "BreadcrumbList" });
    expect(jsonLd[1]).toMatchObject({ "@type": "FAQPage" });
    expect(jsonLd[2]).toMatchObject({ "@type": "ItemList" });
  });
});

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

  it("한국어 홈은 검증된 YouTube 공개일을 포함한 Breadcrumb·FAQPage·Physician·VideoObject JSON-LD를 생성한다", () => {
    const jsonLd = buildHomeJsonLd([{ question: "질문", answer: "답변" }]);
    expect(jsonLd).toHaveLength(4);
    expect(jsonLd[0]).toMatchObject({ "@type": "BreadcrumbList" });
    expect(jsonLd[1]).toMatchObject({ "@type": "FAQPage" });
    expect(jsonLd[2]).toMatchObject({ "@type": "ItemList" });
    const videoList = jsonLd[3] as Record<string, unknown>;
    const items = videoList.itemListElement as Array<{ item: Record<string, unknown> }>;
    expect(items).toHaveLength(4);
    expect(items[0]?.item).toMatchObject({
      "@type": "VideoObject",
      uploadDate: "2024-09-06",
      contentUrl: "https://www.youtube.com/watch?v=XiOTXhPx7qw",
    });
  });

  it("비한국어 홈에는 한국어 원본 YouTube VideoObject를 넣지 않는다", () => {
    expect(buildHomeJsonLd([{ question: "Question", answer: "Answer" }], "en")).toHaveLength(3);
  });
});

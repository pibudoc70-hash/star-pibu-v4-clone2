import { describe, expect, it } from "vitest";
import { buildHomeJsonLd, HOME_SEO_META } from "./homeSeo";

describe("homeSeo", () => {
  it("홈의 canonical·hreflang·pageType 계약을 유지한다", () => {
    expect(HOME_SEO_META.canonical).toBe("https://star-pibu.com");
    expect(HOME_SEO_META.pageType).toBe("home");
    expect(HOME_SEO_META.hreflangs).toHaveLength(6);
  });

  it("MedicalClinic·Breadcrumb·FAQPage·Physician JSON-LD를 함께 생성한다", () => {
    const jsonLd = buildHomeJsonLd([{ question: "질문", answer: "답변" }]);
    expect(jsonLd).toHaveLength(4);
    expect(jsonLd[0]).toMatchObject({ "@type": ["LocalBusiness", "MedicalBusiness"] });
    expect(jsonLd[1]).toMatchObject({ "@type": "BreadcrumbList" });
    expect(jsonLd[2]).toMatchObject({ "@type": "FAQPage" });
    expect(jsonLd[3]).toMatchObject({ "@type": "ItemList" });
  });
});

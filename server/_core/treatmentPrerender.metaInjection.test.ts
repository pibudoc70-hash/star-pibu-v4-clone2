import { describe, expect, it } from "vitest";
import { injectTreatmentMeta } from "./treatmentPrerender";

const treatment = {
  image: "/api/storage/ulthera.png",
  seoTitle: { ko: "부산울쎄라 | 울쎄라피 프라임 | 부산 서면 스타피부과" },
  seoDescription: { ko: "울쎄라피 프라임 시술 안내" },
  seoKeywords: { ko: "부산울쎄라, 울쎄라피 프라임" },
};

const homeHead = `<head>
  <title>홈 제목</title>
  <meta data-rh="true" data-seo-fallback="home" name="description" content="홈 설명" />
  <meta data-rh="true" data-seo-fallback="home" property="og:title" content="홈 OG 제목" />
  <meta data-rh="true" data-seo-fallback="home" property="og:description" content="홈 OG 설명" />
  <meta data-rh="true" data-seo-fallback="home" property="og:url" content="https://star-pibu.com" />
  <meta data-rh="true" data-seo-fallback="home" name="twitter:title" content="홈 Twitter 제목" />
  <meta data-rh="true" data-seo-fallback="home" name="twitter:description" content="홈 Twitter 설명" />
</head>`;

describe("treatment prerender metadata injection", () => {
  it("replaces fallback description and social metadata even when data attributes precede name/property", () => {
    const output = injectTreatmentMeta(homeHead, treatment, "ko", "ulthera");

    expect(output).toContain('name="description" content="울쎄라피 프라임 시술 안내"');
    expect(output).toContain('property="og:title" content="부산울쎄라 | 울쎄라피 프라임 | 부산 서면 스타피부과"');
    expect(output).toContain('property="og:description" content="울쎄라피 프라임 시술 안내"');
    expect(output).toContain('property="og:url" content="https://star-pibu.com/treatments/ulthera"');
    expect(output).toContain('name="twitter:title" content="부산울쎄라 | 울쎄라피 프라임 | 부산 서면 스타피부과"');
    expect(output).toContain('name="twitter:description" content="울쎄라피 프라임 시술 안내"');
    expect(output).not.toContain("홈 설명");
    expect(output).not.toContain("홈 OG 제목");
  });
});

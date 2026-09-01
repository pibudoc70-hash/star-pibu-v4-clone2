import { describe, expect, it } from "vitest";
import { doctors } from "./doctors-data";
import { buildPhysicianJsonLd, getDoctorsSeoContent } from "./doctorsSeo";

describe("Doctors SEO 순수 데이터", () => {
  it.each([
    ["ko", "피부과전문의 3인 | 부산 서면 스타피부과"],
    ["en", "3 Board-Certified Dermatologists | STAR Dermatology Busan"],
    ["ja", "皮膚科専門医3名 | 釜山 서면 スター皮膚科"],
    ["zh", "3位皮肤科专科医生 | 釜山서면 STAR皮肤科"],
  ])("%s locale의 기존 page title을 보존한다", (lang, expectedTitle) => {
    expect(getDoctorsSeoContent(lang).title).toBe(expectedTitle);
  });

  it("미지원 locale은 기존과 같이 한국어 metadata로 fallback한다", () => {
    expect(getDoctorsSeoContent("zh-TW")).toEqual(getDoctorsSeoContent("ko"));
  });

  it("각 의사의 기존 Physician JSON-LD 필드와 의료기관 정보를 보존한다", () => {
    const schemas = buildPhysicianJsonLd(doctors, "스타피부과", "https://star-pibu.com");

    expect(schemas).toHaveLength(doctors.length);
    expect(schemas[0]).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Physician",
      name: doctors[0].name,
      image: `https://star-pibu.com${doctors[0].image}`,
      worksFor: {
        "@type": "MedicalBusiness",
        name: "스타피부과",
        url: "https://star-pibu.com",
      },
    });
    expect(schemas[0].availableService).toHaveLength(doctors[0].availableService?.length ?? 0);
  });
});

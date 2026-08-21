import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { thermage } from "./thermage";
import { ulthera } from "./ulthera";

const treatmentPageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/TreatmentPage.tsx"),
  "utf8",
);

const SEO_COPY = {
  ulthera: {
    h1: "부산울쎄라 | 울쎄라피 프라임 | 부산 서면 스타피부과",
    description:
      "부산울쎄라 시술을 찾는 분을 위한 울쎄라피 프라임 안내. 부산 서면 스타피부과에서 피부과 전문의가 직접 시술하며, 마취 옵션 상담이 가능합니다. 서면역 5·7번 출구 도보 1분.",
  },
  thermage: {
    h1: "부산써마지 | 써마지 FLX | 부산 서면 스타피부과",
    description:
      "부산써마지 시술을 찾는 분을 위한 써마지 FLX 안내. 부산 서면 스타피부과에서 피부과 전문의가 직접 시술하며, 마취 옵션 상담이 가능합니다. 서면역 5·7번 출구 도보 1분.",
  },
} as const;

describe("울쎄라·써마지 상세 SEO 문구", () => {
  it("부산 지역 검색어를 H1·SEO title과 meta description에 자연스럽게 반영한다", () => {
    expect(ulthera.seoTitle.ko).toBe(SEO_COPY.ulthera.h1);
    expect(ulthera.seoDescription.ko).toBe(SEO_COPY.ulthera.description);
    expect(thermage.seoTitle.ko).toBe(SEO_COPY.thermage.h1);
    expect(thermage.seoDescription.ko).toBe(SEO_COPY.thermage.description);
  });

  it("두 meta description은 160자 이내이며 효과 보장 표현을 사용하지 않는다", () => {
    for (const description of [ulthera.seoDescription.ko, thermage.seoDescription.ko]) {
      expect(Array.from(description).length).toBeLessThanOrEqual(160);
      expect(description).not.toMatch(/보장|확실|완벽|최고/);
    }
  });

  it("한국어 canonical 상세 페이지는 SEO title을 실제 H1으로 렌더한다", () => {
    expect(treatmentPageSource).toContain('const treatmentH1 = currentLang === "ko" ? seoTitle : treatmentName;');
    expect(treatmentPageSource).toContain('{treatmentH1}</h1>');
  });
});

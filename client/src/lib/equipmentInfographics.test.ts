import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EQUIPMENT_EXPLANATORY_INFOGRAPHICS } from "./equipmentInfographics";

const detailPageSource = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3Detail.tsx"), "utf8");
const ultherapySectionSource = readFileSync(resolve(process.cwd(), "client/src/components/UltherapyPrincipleSection.tsx"), "utf8");
const ultherapyDataSource = readFileSync(resolve(process.cwd(), "shared/ultherapyPrinciple.ts"), "utf8");

describe("equipment explanatory infographics", () => {
  it("maps the uploaded Korean explainer assets only to the two approved lifting devices", () => {
    expect(EQUIPMENT_EXPLANATORY_INFOGRAPHICS).toEqual({
      울쎄라피프라임: {
        src: "/manus-storage/ultherapy_infographic_ko_bc4f4f15.webp",
        alt: "울쎄라피 프라임의 실시간 초음파 영상, 1.5·3.0·4.5mm 목표 깊이, 미세 열응고점과 콜라겐 리모델링 원리를 설명하는 인포그래픽",
      },
      써마지FLX: {
        src: "/manus-storage/thermage_infographic_ko_817f9cda.webp",
        alt: "써마지 FLX의 모노폴라 고주파 에너지, 표면 냉각과 진동, 콜라겐 리모델링 원리를 설명하는 인포그래픽",
      },
    });
  });

  it("keeps the approved image explainer for non-Ultherapy Korean devices and uses semantic HTML for Ultherapy Prime", () => {
    expect(detailPageSource).toContain('lang === "ko" && !isUltherapyPrime ? EQUIPMENT_EXPLANATORY_INFOGRAPHICS');
    expect(detailPageSource).toContain('aria-labelledby="equipment-infographic-heading"');
    expect(detailPageSource).toContain("시술 원리 인포그래픽");
    expect(detailPageSource).toContain("본 이미지는 시술 원리에 대한 이해를 돕기 위한 자료");
    expect(detailPageSource).toContain("<UltherapyPrincipleSection />");
    expect(ultherapySectionSource).toContain("ULTHERAPY_PRIME_PRINCIPLE");
    expect(ultherapyDataSource).toContain("울쎄라, 피부 속에서 시작되는 탄력 리프팅");
    expect(ultherapyDataSource).toContain("4단계 시술 원리");
    expect(ultherapyDataSource).toContain("회복 과정 타임라인");
  });
});

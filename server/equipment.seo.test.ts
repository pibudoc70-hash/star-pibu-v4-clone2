/**
 * Commit 25-5: equipment.seo.test.ts
 * getEquipmentSeoText 헬퍼 단위 테스트 및 금지 문자열 0건 검증.
 *
 * 금지 문자열: 福岡, Fukuoka, 野毛第一主義, 野毛第一主义, 野毛西面, 野毛皮肤科, 福岡皮膚科
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { getEquipmentSeoText } from "../client/src/lib/equipmentSeoText";
import type { Treatment } from "../shared/types";

// 테스트용 최소 Treatment 픽스처
const mockTreatment: Treatment = {
  id: 1,
  slug: "ulthera",
  name: "울쎄라피 프라임",
  nameEn: "Ultherapy Prime",
  nameJa: "ウルセラピー プライム",
  nameZh: "超声刀 Prime",
  desc: "집속 초음파 리프팅 시술",
  descEn: "Focused ultrasound lifting treatment",
  descJa: "集束超音波リフティング施術",
  descZh: "聚焦超声波提升疗程",
  categoryId: "lifting",
  section: "v2",
  // 나머지 필드는 null/undefined 허용
  image: null,
  images: null,
  detail: null,
  detailEn: null,
  detailJa: null,
  detailZh: null,
  effect: null,
  effectEn: null,
  effectJa: null,
  effectZh: null,
  caution: null,
  cautionEn: null,
  cautionJa: null,
  cautionZh: null,
  time: "60분",
  recovery: "없음",
  sessions: "1회",
  steps: null,
  related: null,
  badge: null,
  badgeColor: null,
  youtubeUrl: null,
  isActive: true,
  sortOrder: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
} as unknown as Treatment;

const FORBIDDEN = [
  "福岡", "Fukuoka", "野毛第一主義", "野毛第一主义",
  "野毛西面", "野毛皮肤科", "福岡皮膚科",
];

describe("getEquipmentSeoText", () => {
  it("ko: title에 부산 서면 스타피부과 포함", () => {
    const { title } = getEquipmentSeoText(mockTreatment, "ko");
    expect(title).toContain("부산 서면 스타피부과");
    expect(title).toContain("울쎄라피 프라임");
  });

  it("en: title에 Star Dermatology, Seomyeon, Busan 포함", () => {
    const { title } = getEquipmentSeoText(mockTreatment, "en");
    expect(title).toContain("Star Dermatology, Seomyeon, Busan");
    expect(title).toContain("Ultherapy Prime");
  });

  it("ja: title에 釜山西面 スター皮膚科 포함", () => {
    const { title } = getEquipmentSeoText(mockTreatment, "ja");
    expect(title).toContain("釜山西面 スター皮膚科");
    expect(title).toContain("ウルセラピー プライム");
  });

  it("zh: title에 釜山西面 STAR 皮肤科 포함", () => {
    const { title } = getEquipmentSeoText(mockTreatment, "zh");
    expect(title).toContain("釜山西面 STAR 皮肤科");
    expect(title).toContain("超声刀 Prime");
  });

  it("ja: description에 금지 문자열 없음", () => {
    const { title, description, keywords } = getEquipmentSeoText(mockTreatment, "ja");
    const combined = [title, description, keywords].join(" ");
    for (const forbidden of FORBIDDEN) {
      expect(combined, `ja SEO에 금지 문자열 "${forbidden}" 포함`).not.toContain(forbidden);
    }
  });

  it("zh: description에 금지 문자열 없음", () => {
    const { title, description, keywords } = getEquipmentSeoText(mockTreatment, "zh");
    const combined = [title, description, keywords].join(" ");
    for (const forbidden of FORBIDDEN) {
      expect(combined, `zh SEO에 금지 문자열 "${forbidden}" 포함`).not.toContain(forbidden);
    }
  });

  it("ja: keywords에 올바른 지명 포함 (釜山皮膚科, 西面皮膚科)", () => {
    const { keywords } = getEquipmentSeoText(mockTreatment, "ja");
    expect(keywords).toContain("釜山皮膚科");
    expect(keywords).toContain("西面皮膚科");
  });

  it("zh: keywords에 올바른 지명 포함 (釜山皮肤科, 西面皮肤科)", () => {
    const { keywords } = getEquipmentSeoText(mockTreatment, "zh");
    expect(keywords).toContain("釜山皮肤科");
    expect(keywords).toContain("西面皮肤科");
  });

  it("nameEn fallback: nameJa 없을 때 en name 사용", () => {
    const noJa = { ...mockTreatment, nameJa: null } as unknown as Treatment;
    const { title } = getEquipmentSeoText(noJa, "ja");
    expect(title).toContain("Ultherapy Prime");
  });

  it("name fallback: nameJa, nameEn 모두 없을 때 ko name 사용", () => {
    const noJaEn = { ...mockTreatment, nameJa: null, nameEn: null } as unknown as Treatment;
    const { title } = getEquipmentSeoText(noJaEn, "ja");
    expect(title).toContain("울쎄라피 프라임");
  });
});

describe("Equipment2Detail.tsx 소스 파일 금지 문자열 검증", () => {
  const filePath = resolve(__dirname, "../client/src/pages/Equipment2Detail.tsx");
  const source = readFileSync(filePath, "utf-8");

  for (const forbidden of FORBIDDEN) {
    it(`소스에 "${forbidden}" 없음`, () => {
      expect(source).not.toContain(forbidden);
    });
  }
});

describe("equipmentSeoText.ts 실제 출력값 금지 문자열 검증", () => {
  // 주석이 아닌 실제 출력값에 금지 문자열이 없는지 확인
  const langs: Array<"ko" | "en" | "ja" | "zh"> = ["ko", "en", "ja", "zh"];

  for (const lang of langs) {
    it(`lang=${lang}: 출력값에 금지 문자열 없음`, () => {
      const { title, description, keywords } = getEquipmentSeoText(mockTreatment, lang);
      const combined = [title, description, keywords].join(" ");
      for (const forbidden of FORBIDDEN) {
        expect(combined, `lang=${lang} 출력에 금지 문자열 "${forbidden}" 포함`).not.toContain(forbidden);
      }
    });
  }
});

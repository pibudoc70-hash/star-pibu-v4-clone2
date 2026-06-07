/**
 * round6.regression.test.ts
 * Round-6 시니어 재검수 회귀 테스트
 *
 * [A] TreatmentsEquipmentSection 미사용 import 제거
 * [D] DoctorsSection aria-label ?? fallback 제거
 * [E] ContactSection naverMap ?? fallback 제거
 * [F] HeroSection lang==="zh" 삼항 → isZH 변수 활용
 * [G] SEO 정책 명시성
 * [H] 로직 기반 테스트 (i18n 키 완전성 검증)
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "..");
const read = (rel: string) => readFileSync(resolve(ROOT, rel), "utf-8");

// ─────────────────────────────────────────────────────────────────────────────
// [A] TreatmentsEquipmentSection 미사용 EquipmentPanel import 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("[A] TreatmentsEquipmentSection 미사용 import 제거", () => {
  const src = read("client/src/components/TreatmentsEquipmentSection.tsx");

  it("EquipmentPanel import가 제거되어야 한다", () => {
    expect(src).not.toMatch(/import EquipmentPanel/);
  });

  it("EquipmentTreatmentCard import가 존재해야 한다", () => {
    expect(src).toMatch(/import EquipmentTreatmentCard/);
  });

  it("CategoryTabList import가 존재해야 한다 (Round-10: CategoryTabButton → CategoryTabList 상위 컴포넌트로 추출)", () => {
    expect(src).toMatch(/import CategoryTabList/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// [D] DoctorsSection aria-label ?? fallback 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("[D] DoctorsSection aria-label fallback 제거", () => {
  const src = read("client/src/components/DoctorsSection.tsx");

  it("selectDoctorLabel에 ?? fallback이 없어야 한다", () => {
    expect(src).not.toMatch(/selectDoctorLabel\s*\?\?/);
  });

  it("expandCredentialsLabel에 ?? fallback이 없어야 한다", () => {
    expect(src).not.toMatch(/expandCredentialsLabel\s*\?\?/);
  });

  it("collapseCredentialsLabel에 ?? fallback이 없어야 한다", () => {
    expect(src).not.toMatch(/collapseCredentialsLabel\s*\?\?/);
  });

  it("dotNavLabel에 ?? fallback이 없어야 한다", () => {
    expect(src).not.toMatch(/dotNavLabel\s*\?\?/);
  });

  it("selectDoctorLabel을 non-null assertion(!)으로 사용해야 한다", () => {
    expect(src).toMatch(/selectDoctorLabel!/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// [E] ContactSection naverMap ?? fallback 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("[E] ContactSection naverMap fallback 제거", () => {
  const src = read("client/src/components/ContactSection.tsx");

  it("naverMap에 ?? \"Naver Map\" fallback이 없어야 한다", () => {
    expect(src).not.toMatch(/naverMap\s*\?\?\s*["']Naver Map["']/);
  });

  it("naverMapLabel이 non-null assertion(!)으로 선언되어야 한다", () => {
    expect(src).toMatch(/naverMapLabel\s*=\s*t\.access\.naverMap!/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// [F] HeroSection lang==="zh" 삼항 → isZH 변수 활용
// ─────────────────────────────────────────────────────────────────────────────
describe("[F] HeroSection brittle locale 제거", () => {
  const src = read("client/src/components/HeroSection.tsx");

  it("예약버튼 배경색에 lang===\"zh\" 삼항이 없어야 한다 (isZH 사용)", () => {
    // background 속성에서 lang === "zh" 삼항이 없어야 함
    expect(src).not.toMatch(/background:\s*lang\s*===\s*["']zh["']/);
  });

  it("target 속성에서 lang===\"zh\" 삼항이 없어야 한다 (isZH 사용)", () => {
    expect(src).not.toMatch(/target=\{lang\s*===\s*["']zh["']/);
  });

  it("isZH 변수가 useChatConfig에서 구조분해되어야 한다", () => {
    expect(src).toMatch(/isZH\s*\}/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// [G] SEO 정책 명시성 — 주요 페이지 includeMedicalSchema 명시 여부
// ─────────────────────────────────────────────────────────────────────────────
describe("[G] SEO 정책 명시성", () => {
  const medicalPages = [
    "client/src/pages/Home.tsx",
    "client/src/pages/About.tsx",
    "client/src/pages/Doctors.tsx",
    "client/src/pages/Directions.tsx",
    "client/src/pages/Facilities.tsx",
    "client/src/pages/ForeignGuide.tsx",
    "client/src/pages/NonCoveredGuide.tsx",
    "client/src/pages/Equipment2.tsx",
  ];

  medicalPages.forEach((page) => {
    it(`${page.split("/").pop()} - includeMedicalSchema={true} 명시되어야 한다`, () => {
      const src = read(page);
      expect(src).toMatch(/includeMedicalSchema=\{true\}/);
    });
  });

  const nonMedicalPages = [
    "client/src/pages/Privacy.tsx",
    "client/src/pages/NotFound.tsx",
    "client/src/pages/Reserve.tsx",
  ];

  nonMedicalPages.forEach((page) => {
    it(`${page.split("/").pop()} - includeMedicalSchema={false} 명시되어야 한다`, () => {
      const src = read(page);
      expect(src).toMatch(/includeMedicalSchema=\{false\}/);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// [H] i18n 키 완전성 검증 (로직 기반)
// ─────────────────────────────────────────────────────────────────────────────
describe("[H] i18n 키 완전성 — 4개 언어 동일 키 보유", () => {
  const langs = ["ko", "en", "ja", "zh"] as const;

  const criticalKeys = [
    { key: "doctors.selectDoctorLabel", pattern: /selectDoctorLabel/ },
    { key: "doctors.expandCredentialsLabel", pattern: /expandCredentialsLabel/ },
    { key: "doctors.collapseCredentialsLabel", pattern: /collapseCredentialsLabel/ },
    { key: "doctors.dotNavLabel", pattern: /dotNavLabel/ },
    { key: "doctors.teamLabel", pattern: /teamLabel/ },
    { key: "managementDevices.scrollPrevLabel", pattern: /scrollPrevLabel/ },
    { key: "managementDevices.scrollNextLabel", pattern: /scrollNextLabel/ },
    { key: "access.naverMap", pattern: /naverMap/ },
    { key: "access.copiedLabel", pattern: /copiedLabel/ },
  ];

  criticalKeys.forEach(({ key, pattern }) => {
    langs.forEach((lang) => {
      it(`i18n.${lang}.ts에 ${key} 키가 존재해야 한다`, () => {
        const src = read(`client/src/lib/i18n.${lang}.ts`);
        expect(src).toMatch(pattern);
      });
    });
  });
});

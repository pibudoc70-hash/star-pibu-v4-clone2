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
describe("[D] DoctorsSection aria-label fallback 제거 [R11-A 업데이트]", () => {
  // [R15-P0-3] selectDoctorLabel은 useDoctorViewModel 훅으로 이전됨
  // [R19] DoctorsSection 서브컴포넌트 분리 후 DoctorMobileLayout에 있음
  const src = read("client/src/components/DoctorsSection.tsx");
  const mobileSrc = read("client/src/components/doctors/DoctorMobileLayout.tsx");
  const combinedSrc = src + "\n" + mobileSrc;

  it("dotNavLabel은 optional chaining + fallback 패턴을 사용해야 한다 [R11-A]", () => {
    // [R19] DoctorMobileLayout에 dotNavLabel ?? "" 패턴 존재
    expect(combinedSrc).toMatch(/dotNavLabel\s*\?\?\s*["']/);
  });

  it("expandCredentialsLabel에 ?? fallback이 없어야 한다", () => {
    expect(combinedSrc).not.toMatch(/expandCredentialsLabel\s*\?\?/);
  });

  it("collapseCredentialsLabel에 ?? fallback이 없어야 한다", () => {
    expect(combinedSrc).not.toMatch(/collapseCredentialsLabel\s*\?\?/);
  });

  it("dotNavLabel은 optional chaining + fallback 패턴을 사용해야 한다 [R11-A] (2차)", () => {
    expect(combinedSrc).toMatch(/dotNavLabel\s*\?\?\s*["']/);
  });

  it("expandCredentialsLabel/collapseCredentialsLabel은 직접 prop 전달로 사용해야 한다", () => {
    // [R19] DoctorCredentials에 prop으로 전달하는 방식으로 변경
    const hasNonNull = /expandCredentialsLabel!/.test(combinedSrc);
    const hasPropPass = /expandLabel=\{t\.doctors\.expandCredentialsLabel\}/.test(combinedSrc);
    expect(hasNonNull || hasPropPass).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// [E] ContactSection naverMap ?? fallback 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("[E] ContactSection naverMap fallback 제거", () => {
  // [R15-P1-2] naverMapLabel은 ContactInfoPanel.tsx로 이전됨
  const src = read("client/src/components/ContactSection.tsx");
  const infoPanelSrc = read("client/src/components/contact/ContactInfoPanel.tsx");

  it("naverMap에 ?? \"Naver Map\" fallback이 없어야 한다", () => {
    const combined = src + infoPanelSrc;
    expect(combined).not.toMatch(/naverMap\s*\?\?\s*["']Naver Map["']/);
  });

  it("naverMapLabel이 안전하게 선언되어야 한다 [R13: non-null assertion → nullish coalescing]", () => {
    // [R13] non-null assertion(!) → optional chaining + nullish coalescing으로 개선됨
    // [R15] naverMapLabel은 ContactInfoPanel.tsx로 이전됨
    // naverMap은 i18n.types.ts에서 optional이므로 fallback이 필요함
    const combined = src + infoPanelSrc;
    expect(combined).toMatch(/naverMapLabel\s*=\s*t\.access\.naverMap/);
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
    it(`${page.split("/").pop()} - pageType="treatment" 또는 pageType="home" 명시되어야 한다`, () => {
      const src = read(page);
      expect(src).toMatch(/pageType="(treatment|home)"/);
    });
  });

  const nonMedicalPages = [
    "client/src/pages/Privacy.tsx",
    "client/src/pages/NotFound.tsx",
    "client/src/pages/Reserve.tsx",
  ];

  nonMedicalPages.forEach((page) => {
    it(`${page.split("/").pop()} - pageType="admin" 명시되어야 한다`, () => {
      const src = read(page);
      expect(src).toMatch(/pageType="admin"/);
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

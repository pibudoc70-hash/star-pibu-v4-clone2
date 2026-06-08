/**
 * Round-24 마감 검수 회귀 테스트
 *
 * 검증 항목:
 * A. useViewportTier 훅 분리 (P0-2)
 * B. EmptyResultView 컴포넌트 분리 (P0-2)
 * C. seoHelpers 하드코딩 제거 (P1-4)
 * D. SEO_CLINIC_META 단일 소스 정책 (P1-4)
 * E. CategoryTabList TreatmentTabId 연결 (P1-6)
 * F. constants/stats 연결 검증 (P1-5)
 * G. useStaticTreatmentFilter 단위 테스트 파일 존재 (P0-1)
 * H. seoHead 단위 테스트 파일 존재 (P0-3)
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const readClient = (p: string) =>
  fs.readFileSync(path.join(ROOT, "client/src", p), "utf-8");
const readServer = (p: string) =>
  fs.readFileSync(path.join(ROOT, "server", p), "utf-8");
const existsClient = (p: string) =>
  fs.existsSync(path.join(ROOT, "client/src", p));
const existsServer = (p: string) =>
  fs.existsSync(path.join(ROOT, "server", p));

// ── A. useViewportTier 훅 분리 ──────────────────────────────────────────────
describe("A. useViewportTier 훅 분리 (P0-2)", () => {
  it("A-1: useViewportTier.ts 파일이 존재한다", () => {
    expect(existsClient("hooks/useViewportTier.ts")).toBe(true);
  });

  it("A-2: useViewportTier.ts는 SM_BREAKPOINT, MD_BREAKPOINT를 export한다", () => {
    const src = readClient("hooks/useViewportTier.ts");
    expect(src).toMatch(/export const SM_BREAKPOINT/);
    expect(src).toMatch(/export const MD_BREAKPOINT/);
  });

  it("A-3: useViewportTier.ts는 ViewportTier 타입을 export한다", () => {
    const src = readClient("hooks/useViewportTier.ts");
    expect(src).toMatch(/export type ViewportTier/);
  });

  it("A-4: useViewportTier.ts는 useViewportTier 훅을 export한다", () => {
    const src = readClient("hooks/useViewportTier.ts");
    expect(src).toMatch(/export.*function useViewportTier|export const useViewportTier/);
  });

  it("A-5: TreatmentsEquipmentSection.tsx는 useViewportTier를 import한다", () => {
    const src = readClient("components/TreatmentsEquipmentSection.tsx");
    expect(src).toMatch(/import.*useViewportTier.*from.*useViewportTier/);
  });

  it("A-6: TreatmentsEquipmentSection.tsx에 ViewportTier 인라인 타입 정의가 없다", () => {
    const src = readClient("components/TreatmentsEquipmentSection.tsx");
    // 인라인 type ViewportTier = ... 선언이 없어야 함
    expect(src).not.toMatch(/type ViewportTier\s*=/);
  });

  it("A-7: TreatmentsEquipmentSection.tsx에 getViewportTier 인라인 함수 정의가 없다", () => {
    const src = readClient("components/TreatmentsEquipmentSection.tsx");
    // 인라인 function getViewportTier 선언이 없어야 함
    expect(src).not.toMatch(/function getViewportTier\s*\(/);
    expect(src).not.toMatch(/const getViewportTier\s*=/);
  });
});

// ── B. EmptyResultView 컴포넌트 분리 ────────────────────────────────────────
describe("B. EmptyResultView 컴포넌트 분리 (P0-2)", () => {
  it("B-1: EmptyResultView.tsx 파일이 존재한다", () => {
    expect(existsClient("components/treatments/EmptyResultView.tsx")).toBe(true);
  });

  it("B-2: EmptyResultView.tsx는 default export를 가진다", () => {
    const src = readClient("components/treatments/EmptyResultView.tsx");
    expect(src).toMatch(/export default/);
  });

  it("B-3: TreatmentsEquipmentSection.tsx는 EmptyResultView를 import한다", () => {
    const src = readClient("components/TreatmentsEquipmentSection.tsx");
    expect(src).toMatch(/import.*EmptyResultView/);
  });
});

// ── C. seoHelpers 하드코딩 제거 ─────────────────────────────────────────────
describe("C. seoHelpers 하드코딩 제거 (P1-4)", () => {
  it("C-1: seoHelpers.ts는 SEO_CLINIC_META를 import한다", () => {
    const src = readClient("lib/seoHelpers.ts");
    expect(src).toMatch(/SEO_CLINIC_META/);
  });

  it("C-2: seoHelpers.ts의 buildClinicJsonLd에 numberOfEmployees 하드코딩 숫자가 없다", () => {
    const src = readClient("lib/seoHelpers.ts");
    // value: 3 하드코딩이 없어야 함 (SEO_CLINIC_META.physicianCount 참조로 교체됨)
    expect(src).not.toMatch(/value:\s*3,\s*\n\s*unitText:\s*"physicians"/);
  });

  it("C-3: seoHelpers.ts의 buildClinicJsonLd에 aggregateRating 하드코딩이 없다", () => {
    const src = readClient("lib/seoHelpers.ts");
    // ratingValue: "4.9" 하드코딩이 없어야 함
    expect(src).not.toMatch(/ratingValue:\s*"4\.9"/);
  });

  it("C-4: seoHelpers.ts의 buildClinicJsonLd에 knowsAbout 하드코딩이 없다", () => {
    const src = readClient("lib/seoHelpers.ts");
    // "눈밑지방재배치술" 하드코딩이 없어야 함
    expect(src).not.toMatch(/"눈밑지방재배치술"/);
  });

  it("C-5: seoHelpers.ts의 openingHoursSpecification이 CLINIC_INFO.openingHours를 파싱한다", () => {
    const src = readClient("lib/seoHelpers.ts");
    // [P0-2 리팩토링] buildClinicJsonLd가 인자 주입 패턴으로 변경됨
    // clinicInfo 파라미터를 통해 openingHours를 사용하므로, 파라미터 기반 패턴 검증
    // 실제 데이터 소스는 기본값 = CLINIC_INFO임을 함수 시그니처로 확인
    expect(src).toMatch(/clinicInfo\.openingHours\.map|CLINIC_INFO\.openingHours\.map/);
  });
});

// ── D. SEO_CLINIC_META 단일 소스 정책 ───────────────────────────────────────
describe("D. SEO_CLINIC_META 단일 소스 정책 (P1-4)", () => {
  it("D-1: constants.ts에 SEO_CLINIC_META가 정의되어 있다", () => {
    const src = readClient("lib/constants.ts");
    expect(src).toMatch(/export const SEO_CLINIC_META/);
  });

  it("D-2: SEO_CLINIC_META는 physicianCount를 포함한다", () => {
    const src = readClient("lib/constants.ts");
    expect(src).toMatch(/physicianCount:/);
  });

  it("D-3: SEO_CLINIC_META는 aggregateRating을 포함한다", () => {
    const src = readClient("lib/constants.ts");
    expect(src).toMatch(/aggregateRating:/);
  });

  it("D-4: SEO_CLINIC_META는 knowsAbout을 포함한다", () => {
    const src = readClient("lib/constants.ts");
    expect(src).toMatch(/knowsAbout:/);
  });

  it("D-5: SEO_CLINIC_META는 hasCredential을 포함한다", () => {
    const src = readClient("lib/constants.ts");
    expect(src).toMatch(/hasCredential:/);
  });

  it("D-6: SEO_CLINIC_META는 as const로 선언되어 있다", () => {
    const src = readClient("lib/constants.ts");
    // SEO_CLINIC_META 블록 이후 as const가 있어야 함
    const idx = src.indexOf("export const SEO_CLINIC_META");
    const block = src.slice(idx, idx + 800);
    expect(block).toMatch(/\} as const/);
  });
});

// ── E. CategoryTabList TreatmentTabId 연결 ──────────────────────────────────
describe("E. CategoryTabList TreatmentTabId 연결 (P1-6)", () => {
  it("E-1: CategoryTabList.tsx는 TreatmentTabId를 import한다", () => {
    const src = readClient("components/treatments/CategoryTabList.tsx");
    expect(src).toMatch(/import.*TreatmentTabId.*from.*useStaticTreatmentFilter/);
  });

  it("E-2: CategoryTabList.tsx의 activeId prop 타입이 TreatmentTabId이다", () => {
    const src = readClient("components/treatments/CategoryTabList.tsx");
    expect(src).toMatch(/activeId:\s*TreatmentTabId/);
  });

  it("E-3: CategoryTabList.tsx의 onTabChange prop 타입이 TreatmentTabId를 사용한다", () => {
    const src = readClient("components/treatments/CategoryTabList.tsx");
    expect(src).toMatch(/onTabChange:\s*\(id:\s*TreatmentTabId\)/);
  });
});

// ── F. constants/stats 연결 검증 ────────────────────────────────────────────
describe("F. constants/stats 연결 검증 (P1-5)", () => {
  it("F-1: constants.ts에 CLINIC_STAT_UNIT_MAP satisfies Record<ClinicStatKey, StatKey>가 있다", () => {
    const src = readClient("lib/constants.ts");
    expect(src).toMatch(/satisfies Record<ClinicStatKey, StatKey>/);
  });

  it("F-2: constants.ts에 StatKey 타입이 export된다", () => {
    const src = readClient("lib/constants.ts");
    expect(src).toMatch(/export type StatKey/);
  });

  it("F-3: constants.ts에 ClinicStatKey 타입이 export된다", () => {
    const src = readClient("lib/constants.ts");
    expect(src).toMatch(/export type ClinicStatKey/);
  });

  it("F-4: CLINIC_STAT_UNIT_MAP의 키 수가 CLINIC_STATS의 키 수와 일치한다", () => {
    const src = readClient("lib/constants.ts");
    // CLINIC_STATS 키 추출
    const statsMatch = src.match(/export const CLINIC_STATS = \{([^}]+)\}/s);
    const mapMatch = src.match(/export const CLINIC_STAT_UNIT_MAP = \{([^}]+)\}/s);
    expect(statsMatch).toBeTruthy();
    expect(mapMatch).toBeTruthy();
    const statsKeys = (statsMatch![1].match(/^\s+\w+:/gm) ?? []).length;
    const mapKeys = (mapMatch![1].match(/^\s+\w+:/gm) ?? []).length;
    expect(statsKeys).toBe(mapKeys);
  });
});

// ── G. useStaticTreatmentFilter 단위 테스트 파일 존재 ───────────────────────
describe("G. useStaticTreatmentFilter 단위 테스트 파일 존재 (P0-1)", () => {
  it("G-1: useStaticTreatmentFilter.test.ts 파일이 존재한다", () => {
    expect(existsServer("useStaticTreatmentFilter.test.ts")).toBe(true);
  });

  it("G-2: useStaticTreatmentFilter.test.ts는 invalid fallback 테스트를 포함한다", () => {
    const src = readServer("useStaticTreatmentFilter.test.ts");
    expect(src).toMatch(/invalid|fallback|unknown/i);
  });

  it("G-3: useStaticTreatmentFilter.test.ts는 closeFilter 테스트를 포함한다", () => {
    const src = readServer("useStaticTreatmentFilter.test.ts");
    expect(src).toMatch(/closeFilter/);
  });

  it("G-4: useStaticTreatmentFilter.test.ts는 sort 테스트를 포함한다", () => {
    const src = readServer("useStaticTreatmentFilter.test.ts");
    expect(src).toMatch(/sort/i);
  });
});

// ── H. seoHead 단위 테스트 파일 존재 ────────────────────────────────────────
describe("H. seoHead 단위 테스트 파일 존재 (P0-3)", () => {
  it("H-1: seoHead.test.ts 파일이 존재한다", () => {
    expect(existsServer("seoHead.test.ts")).toBe(true);
  });

  it("H-2: seoHead.test.ts는 buildHreflangs 테스트를 포함한다", () => {
    const src = readServer("seoHead.test.ts");
    expect(src).toMatch(/buildHreflangs/);
  });

  it("H-3: seoHead.test.ts는 SEO_PRESETS 테스트를 포함한다", () => {
    const src = readServer("seoHead.test.ts");
    expect(src).toMatch(/SEO_PRESETS/);
  });

  it("H-4: seoHead.test.ts는 buildClinicJsonLd 테스트를 포함한다", () => {
    const src = readServer("seoHead.test.ts");
    expect(src).toMatch(/buildClinicJsonLd/);
  });
});

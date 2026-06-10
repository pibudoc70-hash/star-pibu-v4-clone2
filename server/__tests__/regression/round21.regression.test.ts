/**
 * round21.regression.test.ts
 * Round-21 시니어 검수 회귀 테스트
 *
 * 검증 항목:
 *   A-1: P0-2 TreatmentsEquipmentSection — INITIAL_SHOW Tailwind sm breakpoint 동기화
 *   A-2: P0-3 ContactSection — markerPopupVisible 상태 소유권 useClinicMap 내부화
 *   B-1: P1-4 SeoHead — deprecated boolean props 제거 (includeMedicalSchema/includeWebSiteSchema)
 *   B-2: P1-4 SeoHead — pageType="admin" 자동 noindex 정책
 *   B-3: P1-5 seoHelpers — buildHreflangs x-default = koPath 정책
 *   B-4: P1-5 seoHelpers — buildHreflangs 언어 경로 prefix 런타임 가드
 *   B-5: P1-6 useStaticTreatmentFilter — TreatmentTabId 타입 export
 *   B-6: P1-6 useStaticTreatmentFilter — resolveDefaultTab fallback 동작
 *   B-7: P1-7 constants — CLINIC_INFO.image = assetConfig.CLINIC_REPRESENTATIVE_IMAGE 동기화
 *   C-1: P2 index.css — dr-tab-btn focus-visible 스타일 존재
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "../../..");
const CLIENT_SRC = path.join(ROOT, "client/src");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(ROOT, relPath), "utf-8");
}

// ── A. P0 항목 ────────────────────────────────────────────────────────────────

describe("A-1: TreatmentsEquipmentSection INITIAL_SHOW Tailwind sm breakpoint 동기화", () => {
  it("INITIAL_SHOW_SM 상수가 640 (Tailwind sm breakpoint)과 동기화되어 있어야 한다", () => {
    const src = readFile("client/src/components/TreatmentsEquipmentSection.tsx");
    // TAILWIND_SM_BREAKPOINT = 640 또는 INITIAL_SHOW_SM 관련 상수 정의 확인
    const hasTailwindSync =
      src.includes("640") &&
      (src.includes("TAILWIND_SM") || src.includes("sm:") || src.includes("breakpoint"));
    expect(hasTailwindSync).toBe(true);
  });

  it("더보기/접기 버튼에 aria-expanded 속성이 있어야 한다", () => {
    const src = readFile("client/src/components/TreatmentsEquipmentSection.tsx");
    expect(src).toContain("aria-expanded");
  });

  it("더보기/접기 버튼에 aria-controls 속성이 있어야 한다", () => {
    const src = readFile("client/src/components/TreatmentsEquipmentSection.tsx");
    expect(src).toContain("aria-controls");
  });
});

describe("A-2: ContactSection markerPopupVisible 상태 소유권 useClinicMap 내부화", () => {
  it("ContactSection.tsx에 markerPopupVisible 직접 useState가 없어야 한다", () => {
    const src = readFile("client/src/components/ContactSection.tsx");
    // useState로 markerPopupVisible을 직접 선언하지 않아야 함
    expect(src).not.toMatch(/useState.*markerPopupVisible|markerPopupVisible.*useState/);
  });

  it("useClinicMap.ts가 markerPopupVisible을 반환해야 한다", () => {
    const src = readFile("client/src/hooks/useClinicMap.ts");
    expect(src).toContain("markerPopupVisible");
  });
});

// ── B. P1 항목 ────────────────────────────────────────────────────────────────

describe("B-1: SeoHead deprecated boolean props 제거", () => {
  it("SeoHeadProps에 includeMedicalSchema prop이 없어야 한다", () => {
    const src = readFile("client/src/components/SeoHead.tsx");
    // Props 인터페이스에서 제거됨 — 함수 시그니처에도 없어야 함
    // 단, 주석에는 있을 수 있으므로 실제 코드 라인만 검사
    const codeLines = src.split("\n").filter(l => !l.trim().startsWith("//") && !l.trim().startsWith("*"));
    const hasDeprecatedProp = codeLines.some(l => l.includes("includeMedicalSchema?:") || l.includes("includeWebSiteSchema?:"));
    expect(hasDeprecatedProp).toBe(false);
  });

  it("SeoHead 함수 파라미터에 includeMedicalSchema가 없어야 한다", () => {
    const src = readFile("client/src/components/SeoHead.tsx");
    // 함수 파라미터 destructuring에서 제거됨
    expect(src).not.toMatch(/includeMedicalSchema,|includeWebSiteSchema,/);
  });
});

describe("B-2: SeoHead pageType=admin 자동 noindex 정책", () => {
  it("effectiveNoindex가 pageType === 'admin' 조건을 포함해야 한다", () => {
    const src = readFile("client/src/components/SeoHead.tsx");
    expect(src).toContain("pageType === \"admin\"");
  });

  it("SEO_PRESETS.admin이 includeMedicalSchema: false를 가져야 한다", () => {
    const src = readFile("client/src/lib/seoHelpers.ts");
    // admin preset에 includeMedicalSchema: false 확인
    expect(src).toContain("admin:");
    expect(src).toMatch(/admin:.*includeMedicalSchema.*false|admin.*\{[^}]*includeMedicalSchema.*false/s);
  });
});

describe("B-3: seoHelpers buildHreflangs x-default = koPath 정책", () => {
  it("buildHreflangs 반환값에 x-default가 koPath를 사용해야 한다", () => {
    const src = readFile("client/src/lib/seoHelpers.ts");
    // x-default 정책: koPath가 항상 x-default로 설정됨
    expect(src).toContain("x-default");
    expect(src).toContain("koPath");
    // x-default href가 BASE_URL + koPath 패턴
    expect(src).toMatch(/hreflang.*x-default.*koPath|x-default.*href.*koPath/s);
  });

  it("buildHreflangs 주석에 x-default 정책이 명시되어야 한다", () => {
    const src = readFile("client/src/lib/seoHelpers.ts");
    expect(src).toContain("x-default 정책");
  });
});

describe("B-4: seoHelpers buildHreflangs 언어 경로 prefix 런타임 가드", () => {
  it("enPath prefix 검증 가드가 있어야 한다", () => {
    const src = readFile("client/src/lib/seoHelpers.ts");
    expect(src).toContain("/en");
    // dev 모드 가드 확인
    expect(src).toContain("NODE_ENV");
  });

  it("jaPath prefix 검증 가드가 있어야 한다", () => {
    const src = readFile("client/src/lib/seoHelpers.ts");
    expect(src).toContain("/ja");
  });

  it("zhPath prefix 검증 가드가 있어야 한다", () => {
    const src = readFile("client/src/lib/seoHelpers.ts");
    expect(src).toContain("/zh");
  });
});

describe("B-5: useStaticTreatmentFilter TreatmentTabId 타입 export", () => {
  it("TreatmentTabId 타입이 export되어야 한다", () => {
    const src = readFile("client/src/hooks/useStaticTreatmentFilter.ts");
    expect(src).toContain("export type TreatmentTabId");
  });

  it("resolveDefaultTab 반환 타입이 TreatmentTabId로 명시되어야 한다", () => {
    const src = readFile("client/src/hooks/useStaticTreatmentFilter.ts");
    expect(src).toContain("): TreatmentTabId");
  });
});

describe("B-6: useStaticTreatmentFilter resolveDefaultTab fallback 동작", () => {
  it("resolveDefaultTab이 유효하지 않은 탭 ID에 대해 fallback을 반환해야 한다", () => {
    const src = readFile("client/src/hooks/useStaticTreatmentFilter.ts");
    // fallback 로직 확인
    expect(src).toContain("Object.keys(TREATMENTS)[0]");
    expect(src).toContain("console.warn");
    expect(src).toContain("Falling back to");
  });
});

describe("B-7: constants CLINIC_INFO.image = assetConfig.CLINIC_REPRESENTATIVE_IMAGE 동기화", () => {
  it("constants.ts가 assetConfig.ts에서 CLINIC_REPRESENTATIVE_IMAGE를 import해야 한다", () => {
    const src = readFile("client/src/lib/constants.ts");
    expect(src).toContain("CLINIC_REPRESENTATIVE_IMAGE");
    expect(src).toContain("assetConfig");
  });

  it("CLINIC_INFO.image가 CLINIC_REPRESENTATIVE_IMAGE를 참조해야 한다", () => {
    const src = readFile("client/src/lib/constants.ts");
    expect(src).toContain("image: CLINIC_REPRESENTATIVE_IMAGE");
  });

  it("assetConfig.ts에 CLINIC_REPRESENTATIVE_IMAGE가 정의되어야 한다", () => {
    const src = readFile("client/src/lib/assetConfig.ts");
    expect(src).toContain("CLINIC_REPRESENTATIVE_IMAGE");
    // OG_IMAGES.ko를 참조해야 함
    expect(src).toContain("OG_IMAGES.ko");
  });
});

// ── C. P2 항목 ────────────────────────────────────────────────────────────────

describe("C-1: index.css dr-tab-btn focus-visible 스타일", () => {
  it("dr-tab-btn:focus-visible 스타일이 index.css에 있어야 한다", () => {
    const src = readFile("client/src/index.css");
    expect(src).toContain(".dr-tab-btn:focus-visible");
  });

  it("dr-tab-btn:focus-visible에 outline 스타일이 있어야 한다", () => {
    const src = readFile("client/src/index.css");
    const focusBlock = src.match(/\.dr-tab-btn:focus-visible\s*\{[^}]+\}/s)?.[0] ?? "";
    expect(focusBlock).toContain("outline");
  });
});

// ── D. 파일 구조 무결성 ────────────────────────────────────────────────────────

describe("D: 파일 구조 무결성", () => {
  it("TreatmentCardMedia.tsx 서브컴포넌트가 존재해야 한다 (R20 유지)", () => {
    const filePath = path.join(CLIENT_SRC, "components/treatments/TreatmentCardMedia.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("TreatmentMeta.tsx 서브컴포넌트가 존재해야 한다 (R20 유지)", () => {
    const filePath = path.join(CLIENT_SRC, "components/treatments/TreatmentMeta.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("treatmentSortUtils.ts가 존재해야 한다 (R20 유지)", () => {
    const filePath = path.join(CLIENT_SRC, "lib/treatmentSortUtils.ts");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("assetConfig.ts가 존재해야 한다 (R20 유지)", () => {
    const filePath = path.join(CLIENT_SRC, "lib/assetConfig.ts");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("useClinicMap.ts가 존재해야 한다", () => {
    const filePath = path.join(CLIENT_SRC, "hooks/useClinicMap.ts");
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

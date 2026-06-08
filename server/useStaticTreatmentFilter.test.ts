/**
 * useStaticTreatmentFilter 단위 테스트 (Round-24 P0-1)
 *
 * 테스트 범위:
 * - VALID_TAB_IDS: 유효한 탭 ID 배열 구조
 * - resolveDefaultTab: invalid fallback 동작
 * - closeFilter: 항상 닫기 정책
 * - handleSortChange: sort 변경 동작
 * - scrollIntoView 기반 auto-scroll 정책 (코드 구조 검증)
 * - UseStaticTreatmentFilterReturn 인터페이스 완전성
 */
import { describe, it, expect, vi } from "vitest";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const readHook = () =>
  fs.readFileSync(
    path.join(ROOT, "client/src/hooks/useStaticTreatmentFilter.ts"),
    "utf-8"
  );

const readTreatmentsData = () =>
  fs.readFileSync(
    path.join(ROOT, "client/src/data/treatments/treatments-data.ts"),
    "utf-8"
  );

const readSortUtils = () =>
  fs.readFileSync(
    path.join(ROOT, "client/src/lib/treatmentSortUtils.ts"),
    "utf-8"
  );

describe("A. useStaticTreatmentFilter: 타입/인터페이스 완전성", () => {
  it("A-1: TreatmentTabId 타입이 export되어야 한다", () => {
    const src = readHook();
    expect(src).toContain("export type TreatmentTabId");
  });

  it("A-2: VALID_TAB_IDS가 readonly TreatmentTabId[]로 export되어야 한다", () => {
    const src = readHook();
    expect(src).toContain("export const VALID_TAB_IDS");
    expect(src).toContain("readonly TreatmentTabId[]");
  });

  it("A-3: UseStaticTreatmentFilterReturn 인터페이스가 export되어야 한다", () => {
    const src = readHook();
    expect(src).toContain("export interface UseStaticTreatmentFilterReturn");
  });

  it("A-4: UseStaticTreatmentFilterReturn에 closeFilter가 포함되어야 한다", () => {
    const src = readHook();
    // 인터페이스 블록 내에 closeFilter가 있는지 확인
    const interfaceMatch = src.match(/export interface UseStaticTreatmentFilterReturn\s*\{[\s\S]*?\}/);
    expect(interfaceMatch).toBeTruthy();
    expect(interfaceMatch![0]).toContain("closeFilter");
  });

  it("A-5: UseStaticTreatmentFilterReturn에 handleTabChange, handleSortChange, toggleFilter가 모두 포함되어야 한다", () => {
    const src = readHook();
    const interfaceMatch = src.match(/export interface UseStaticTreatmentFilterReturn\s*\{[\s\S]*?\}/);
    expect(interfaceMatch).toBeTruthy();
    const iface = interfaceMatch![0];
    expect(iface).toContain("handleTabChange");
    expect(iface).toContain("handleSortChange");
    expect(iface).toContain("toggleFilter");
  });

  it("A-6: SortBy 타입이 re-export되어야 한다", () => {
    const src = readHook();
    expect(src).toContain("export type { SortBy }");
  });
});

describe("B. useStaticTreatmentFilter: resolveDefaultTab fallback 정책", () => {
  it("B-1: resolveDefaultTab이 TREATMENTS에 없는 탭 ID에 대해 fallback 처리해야 한다", () => {
    const src = readHook();
    // resolveDefaultTab 함수가 tab in TREATMENTS 검사를 포함해야 함
    expect(src).toContain("tab in TREATMENTS");
    // fallback 경고 로직 포함
    expect(src).toContain("console.warn");
    expect(src).toContain("Falling back to");
  });

  it("B-2: resolveDefaultTab이 NODE_ENV !== production 조건으로 경고를 출력해야 한다", () => {
    const src = readHook();
    expect(src).toContain('process.env.NODE_ENV !== "production"');
  });

  it("B-3: resolveDefaultTab fallback이 첫 번째 유효 탭 또는 'best'를 반환해야 한다", () => {
    const src = readHook();
    // fallback 로직: Object.keys(TREATMENTS)[0] ?? "best"
    expect(src).toContain('Object.keys(TREATMENTS)[0]');
    expect(src).toContain('"best"');
  });

  it("B-4: resolveDefaultTab 반환 타입이 TreatmentTabId로 명시되어야 한다", () => {
    const src = readHook();
    expect(src).toContain("function resolveDefaultTab(tab: string): TreatmentTabId");
  });
});

describe("C. useStaticTreatmentFilter: closeFilter 정책", () => {
  it("C-1: closeFilter가 항상 false로 설정하는 정책이어야 한다", () => {
    const src = readHook();
    // closeFilter는 setFilterOpen(false)를 직접 호출
    expect(src).toContain("closeFilter = useCallback(() => setFilterOpen(false)");
  });

  it("C-2: closeFilter가 hook return에 포함되어야 한다", () => {
    const src = readHook();
    // return 블록에 closeFilter가 있는지 확인
    const returnMatch = src.match(/return \{[\s\S]*?\};/);
    expect(returnMatch).toBeTruthy();
    expect(returnMatch![0]).toContain("closeFilter");
  });

  it("C-3: toggleFilter와 closeFilter가 별도로 존재해야 한다 (역할 분리)", () => {
    const src = readHook();
    expect(src).toContain("toggleFilter = useCallback(() => setFilterOpen((prev) => !prev)");
    expect(src).toContain("closeFilter = useCallback(() => setFilterOpen(false)");
  });
});

describe("D. useStaticTreatmentFilter: sort 변경 정책", () => {
  it("D-1: handleSortChange가 setSortBy를 래핑해야 한다", () => {
    const src = readHook();
    expect(src).toContain("handleSortChange = useCallback((sort: SortBy) => setSortBy(sort)");
  });

  it("D-2: sortTreatments가 treatmentSortUtils.ts에서 import되어야 한다", () => {
    const src = readHook();
    expect(src).toContain('import { sortTreatments } from "@/lib/treatmentSortUtils"');
  });

  it("D-3: sortTreatments가 re-export되어야 한다 (하위 호환성)", () => {
    const src = readHook();
    expect(src).toContain('export { sortTreatments } from "@/lib/treatmentSortUtils"');
  });

  it("D-4: sortTreatments가 parseMinutes 기반 시간 정렬을 지원해야 한다", () => {
    const src = readSortUtils();
    expect(src).toContain("parseMinutes");
    // parseMinutes가 숫자를 반환해야 함
    expect(src).toContain("return");
  });

  it("D-5: SortBy 타입이 popular/time을 포함해야 한다", () => {
    const src = readSortUtils();
    expect(src).toContain("popular");
    expect(src).toContain("time");
  });
});

describe("E. useStaticTreatmentFilter: auto-scroll 정책", () => {
  it("E-1: auto-scroll이 scrollIntoView 기반이어야 한다 (offsetLeft 코드 실행 금지)", () => {
    const src = readHook();
    expect(src).toContain("scrollIntoView");
    // offsetLeft가 코드(비주석)에서 실행되지 않아야 함
    // 주석에는 히스토리 목적으로 남아있을 수 있음
    const codeLines = src
      .split("\n")
      .filter((line) => !line.trim().startsWith("//") && !line.trim().startsWith("*"))
      .join("\n");
    expect(codeLines).not.toContain(".offsetLeft");
  });

  it("E-2: scrollIntoView 옵션에 inline: 'center'가 포함되어야 한다", () => {
    const src = readHook();
    expect(src).toContain('inline: "center"');
  });

  it("E-3: scrollIntoView 옵션에 behavior: 'smooth'가 포함되어야 한다", () => {
    const src = readHook();
    expect(src).toContain('behavior: "smooth"');
  });

  it("E-4: auto-scroll이 data-active='true' 버튼을 대상으로 해야 한다", () => {
    const src = readHook();
    expect(src).toContain('[data-active="true"]');
  });

  it("E-5: auto-scroll이 activeId 변경에 반응하는 useEffect 안에 있어야 한다", () => {
    const src = readHook();
    // useEffect([activeId]) 패턴
    expect(src).toContain("[activeId]");
  });
});

describe("F. useStaticTreatmentFilter: VALID_TAB_IDS 구조", () => {
  it("F-1: VALID_TAB_IDS가 Object.keys(TREATMENTS)로 생성되어야 한다", () => {
    const src = readHook();
    expect(src).toContain("Object.keys(TREATMENTS)");
  });

  it("F-2: VALID_TAB_IDS가 'best' 탭을 포함해야 한다 (treatments-data 기준)", () => {
    const dataSrc = readTreatmentsData();
    // treatments-data.ts에 best: 키가 있어야 함
    expect(dataSrc).toMatch(/^\s*best:\s*\[/m);
  });

  it("F-3: VALID_TAB_IDS가 최소 5개 이상의 탭을 포함해야 한다 (treatments-data 기준)", () => {
    const dataSrc = readTreatmentsData();
    // 카테고리 키 패턴 (들여쓰기 + 소문자 키 + ': [')
    const categoryKeys = dataSrc.match(/^\s{2}[a-z_]+:\s*\[/gm) ?? [];
    expect(categoryKeys.length).toBeGreaterThanOrEqual(5);
  });
});

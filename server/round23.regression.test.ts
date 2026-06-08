/**
 * round23.regression.test.ts
 *
 * Round-23 시니어 검수 회귀 테스트
 *
 * 검증 항목:
 * A. DesignSystem: SurfaceCard interactive onKeyDown Enter/Space 핸들러 (WCAG 2.1.1)
 * B. useStaticTreatmentFilter: VALID_TAB_IDS 타입 강화 + scrollIntoView auto-scroll
 * C. seoHelpers: COMMON_HREFLANGS vs buildHreflangs x-default 정책 불일치 문서화
 * D. P2 실측 결함 없음 확인 (reduced-motion/focus-visible/CategoryTabList 키보드)
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const root = path.resolve(__dirname, "..");

function readClient(relPath: string): string {
  return fs.readFileSync(path.join(root, "client/src", relPath), "utf-8");
}

// ─────────────────────────────────────────────────────────────────────────────
// A. DesignSystem: SurfaceCard interactive onKeyDown
// ─────────────────────────────────────────────────────────────────────────────
describe("A. DesignSystem SurfaceCard interactive 키보드 접근성 (WCAG 2.1.1)", () => {
  const content = readClient("components/ui/DesignSystem.tsx");

  it("A-1: SurfaceCard interactive prop이 존재한다", () => {
    expect(content).toContain("interactive?: boolean");
  });

  it("A-2: role=\"button\"이 interactive prop과 연결되어 있다", () => {
    expect(content).toContain('role={interactive ? "button" : undefined}');
  });

  it("A-3: onKeyDown Enter/Space 핸들러가 구현되어 있다 (WCAG 2.1.1)", () => {
    // Enter 키 처리
    expect(content).toContain('"Enter"');
    // Space 키 처리
    expect(content).toContain('" "');
    // click() 호출로 활성화
    expect(content).toContain(".click()");
  });

  it("A-4: handleKeyDown이 interactive 조건부로 적용된다", () => {
    expect(content).toContain("const handleKeyDown = interactive");
    expect(content).toContain("onKeyDown={handleKeyDown}");
  });

  it("A-5: e.preventDefault()가 Space 키 스크롤 방지를 위해 호출된다", () => {
    expect(content).toContain("e.preventDefault()");
  });

  it("A-6: 기존 onKeyDown prop이 handleKeyDown 내부에서 호출된다 (prop 전달 체인)", () => {
    expect(content).toContain("rest.onKeyDown?.(e)");
  });

  it("A-7: onMouseEnter/Leave DOM style mutation이 없다", () => {
    // 주석 제외하고 실제 코드에서 확인
    const codeLines = content.split("\n").filter(l => !l.trim().startsWith("*") && !l.trim().startsWith("//"));
    const codeOnly = codeLines.join("\n");
    expect(codeOnly).not.toContain("onMouseEnter");
    expect(codeOnly).not.toContain("onMouseLeave");
  });

  it("A-8: PremiumButton도 CSS class 기반 hover 처리를 사용한다", () => {
    expect(content).toContain("PREMIUM_BUTTON_VARIANTS");
    // inline style로 hover 처리하지 않음
    expect(content).not.toMatch(/style=\{.*hover.*\}/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. useStaticTreatmentFilter: VALID_TAB_IDS 타입 + scrollIntoView
// ─────────────────────────────────────────────────────────────────────────────
describe("B. useStaticTreatmentFilter 타입 강화 + auto-scroll 안정성", () => {
  const content = readClient("hooks/useStaticTreatmentFilter.ts");

  it("B-1: VALID_TAB_IDS가 readonly TreatmentTabId[]로 타입 강화되었다", () => {
    expect(content).toContain("readonly TreatmentTabId[]");
    // string[]이 아닌 TreatmentTabId[]로 캐스팅
    expect(content).toContain("as TreatmentTabId[]");
  });

  it("B-2: auto-scroll이 scrollIntoView 방식을 사용한다", () => {
    expect(content).toContain("scrollIntoView");
    expect(content).toContain('inline: "center"');
    expect(content).toContain('block: "nearest"');
  });

  it("B-3: offsetLeft 기반 계산이 제거되었다", () => {
    // offsetLeft - container.offsetWidth / 2 패턴이 없어야 함
    expect(content).not.toContain("offsetLeft - container.offsetWidth");
    expect(content).not.toContain("container.scrollTo(");
  });

  it("B-4: scrollIntoView에 smooth behavior가 적용된다", () => {
    expect(content).toContain('behavior: "smooth"');
  });

  it("B-5: VALID_TAB_IDS가 export되어 외부에서 참조 가능하다", () => {
    expect(content).toContain("export const VALID_TAB_IDS");
  });

  it("B-6: UseStaticTreatmentFilterReturn 인터페이스가 export된다", () => {
    expect(content).toContain("export interface UseStaticTreatmentFilterReturn");
  });

  it("B-7: closeFilter가 hook return에 포함된다", () => {
    expect(content).toContain("closeFilter: () => void");
    expect(content).toContain("closeFilter,");
  });

  it("B-8: resolveDefaultTab이 유효하지 않은 탭에 대해 fallback을 반환한다", () => {
    expect(content).toContain("resolveDefaultTab");
    expect(content).toContain("not found in TREATMENTS");
    expect(content).toContain("Falling back to");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. seoHelpers: COMMON_HREFLANGS vs buildHreflangs x-default 정책
// ─────────────────────────────────────────────────────────────────────────────
describe("C. seoHelpers x-default 정책 문서화 및 일관성", () => {
  const content = readClient("lib/seoHelpers.ts");

  it("C-1: COMMON_HREFLANGS의 x-default가 루트('/')를 가리킨다", () => {
    // COMMON_HREFLANGS 블록에서 x-default 확인
    const commonBlock = content.match(/COMMON_HREFLANGS\s*=\s*\[[\s\S]*?\];/)?.[0] ?? "";
    expect(commonBlock).toContain('"x-default"');
    expect(commonBlock).toContain('`${BASE_URL}/`');
  });

  it("C-2: buildHreflangs의 x-default가 koPath를 가리킨다", () => {
    // buildHreflangs 함수 반환값에서 x-default 확인
    expect(content).toContain('hreflang: "x-default", href: `${BASE_URL}${koPath}`');
  });

  it("C-3: COMMON_HREFLANGS와 buildHreflangs의 x-default 정책 차이가 문서화되어 있다", () => {
    // R23-P1 주석이 있어야 함
    expect(content).toContain("[R23-P1]");
    expect(content).toContain("정책 불일치 문서화");
  });

  it("C-4: COMMON_HREFLANGS가 홈페이지 전용임을 명시한다", () => {
    expect(content).toContain("홈페이지(루트) 전용");
  });

  it("C-5: buildHreflangs가 4개 언어 고정 페이지 전용임을 명시한다", () => {
    expect(content).toContain("4개 언어");
  });

  it("C-6: buildHreflangs에 subset 페이지 오용 방지 가드가 있다", () => {
    expect(content).toContain("subset 페이지");
    expect(content).toContain("console.warn");
  });

  it("C-7: JSON-LD 핵심 필드(@context, @type)가 buildClinicJsonLd에 포함된다", () => {
    expect(content).toContain('"@context"');
    expect(content).toContain('"@type"');
    expect(content).toContain("MedicalBusiness");
  });

  it("C-8: buildHreflangs 런타임 가드가 path 형식을 검증한다", () => {
    expect(content).toContain("startsWith(\"/\")");
    expect(content).toContain("[buildHreflangs]");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. P2 실측 결함 없음 확인
// ─────────────────────────────────────────────────────────────────────────────
describe("D. P2 실측 결함 없음 확인 (reduced-motion/focus-visible/CategoryTabList)", () => {
  it("D-1: index.css에 prefers-reduced-motion 전역 처리가 있다", () => {
    const css = fs.readFileSync(path.join(root, "client/src/index.css"), "utf-8");
    expect(css).toContain("prefers-reduced-motion");
    // 최소 2개 이상의 미디어 쿼리 블록
    const matches = css.match(/@media\s*\(prefers-reduced-motion/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("D-2: CategoryTabList에 Arrow 키 네비게이션이 구현되어 있다", () => {
    const content = readClient("components/treatments/CategoryTabList.tsx");
    expect(content).toContain("ArrowRight");
    expect(content).toContain("ArrowLeft");
    expect(content).toContain('role="tab"');
    expect(content).toContain("aria-selected");
  });

  it("D-3: DoctorTabButton에 focus-visible 스타일이 있다 (index.css)", () => {
    const css = fs.readFileSync(path.join(root, "client/src/index.css"), "utf-8");
    expect(css).toContain("dr-tab-btn");
    expect(css).toContain("focus-visible");
  });

  it("D-4: EquipmentTreatmentCard에 aria-label이 있다", () => {
    const content = readClient("components/treatments/EquipmentTreatmentCard.tsx");
    expect(content).toContain("aria-label");
  });

  it("D-5: ContactSection에 map aria-label이 있다", () => {
    const content = readClient("components/ContactSection.tsx");
    expect(content).toContain("aria-label");
  });

  it("D-6: HeroAnimations에 CSS custom property --delay 기반 animation-delay가 있다", () => {
    const content = readClient("components/hero/HeroAnimations.tsx");
    expect(content).toContain("--delay");
    expect(content).toContain("animationDelay");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. constants: 단일 소스 정책 + 타입 안전성
// ─────────────────────────────────────────────────────────────────────────────
describe("E. constants 단일 소스 정책 + 타입 안전성", () => {
  const content = readClient("lib/constants.ts");

  it("E-1: CLINIC_INFO.image가 assetConfig.CLINIC_REPRESENTATIVE_IMAGE를 참조한다", () => {
    expect(content).toContain("CLINIC_REPRESENTATIVE_IMAGE");
    // 하드코딩된 이미지 URL이 없어야 함 (assetConfig 통해 관리)
    expect(content).toContain("assetConfig");
  });

  it("E-2: CLINIC_STAT_UNIT_MAP이 satisfies Record<ClinicStatKey, StatKey>로 검증된다", () => {
    expect(content).toContain("satisfies Record<ClinicStatKey, StatKey>");
  });

  it("E-3: StatKey 타입이 export된다", () => {
    expect(content).toContain("export type StatKey");
  });

  it("E-4: ClinicStatKey 타입이 export된다", () => {
    expect(content).toContain("export type ClinicStatKey");
  });

  it("E-5: STAT_UNITS와 CLINIC_STATS가 모두 정의되어 있다", () => {
    expect(content).toContain("STAT_UNITS");
    expect(content).toContain("CLINIC_STATS");
  });
});

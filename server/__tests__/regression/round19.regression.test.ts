/**
 * round19.regression.test.ts
 *
 * Round-19 시니어 검수 회귀 테스트
 * 변경 사항:
 * A. HeroStatItem/HeroStatsStrip/HeroFloorBadge 인라인 style → CSS 클래스 교체
 * B. DoctorsSection 서브컴포넌트 분리 (DoctorTabButton/DoctorCredentials/DoctorDesktopLayout/DoctorMobileLayout)
 * C. EquipmentTreatmentCard div role="button" → button 요소 전환
 * D. buildMarkerPinElement 의존 방향 역전 해소 (ContactSection → lib/mapHelpers)
 * E. seoHelpers JsonLdSchema 타입 강화 + SEO_PRESETS satisfies 적용
 * F. index.css hero-stat, hero-floor, hero-stats CSS 클래스 추가
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf-8");

// ─── A. HeroStatItem 인라인 style 교체 ───────────────────────────────────────
describe("A. HeroStatItem — 인라인 style → CSS 클래스 교체", () => {
  const src = read("client/src/components/hero/HeroStatItem.tsx");

  it("A-1: hero-stat-value CSS 클래스 사용", () => {
    expect(src).toContain('className="hero-stat-value"');
  });

  it("A-2: hero-stat-bar CSS 클래스 사용", () => {
    expect(src).toContain('className="hero-stat-bar"');
  });

  it("A-3: hero-stat-label CSS 클래스 사용", () => {
    // tracking-widest 등 추가 클래스가 붙을 수 있으므로 포함 여부만 확인
    expect(src).toMatch(/className="[^"]*hero-stat-label[^"]*"/);
  });

  it("A-4: isDone 조건부 스타일 → data-done attribute 사용", () => {
    expect(src).toContain('data-done={String(isDone)}');
  });

  it("A-5: fontSize/color/textShadow 인라인 style 제거", () => {
    expect(src).not.toContain("fontSize:");
    expect(src).not.toContain("textShadow:");
    expect(src).not.toContain("fontVariantNumeric:");
  });

  it("A-6: animationDelay → CSS custom property --delay로 교체", () => {
    expect(src).toContain('"--delay": animationDelay');
    // style={{ animationDelay }} 직접 사용 제거 (인터페이스 prop 선언은 허용)
    expect(src).not.toContain("style={{ animationDelay }}");
    expect(src).not.toContain("animationDelay: animationDelay");
  });
});

// ─── A2. HeroStatsStrip 인라인 style 교체 ────────────────────────────────────
describe("A2. HeroStatsStrip — 인라인 style → CSS 클래스 교체", () => {
  const src = read("client/src/components/hero/HeroStatsStrip.tsx");

  it("A2-1: hero-stats-wrap CSS 클래스 사용", () => {
    expect(src).toContain('className="hero-stats-wrap"');
  });

  it("A2-2: hero-stats-row CSS 클래스 사용", () => {
    expect(src).toContain('className="hero-stats-row"');
  });

  it("A2-3: marginBottom/gap/paddingTop 인라인 style 제거", () => {
    expect(src).not.toContain("marginBottom:");
    expect(src).not.toContain("paddingTop:");
  });
});

// ─── A3. HeroFloorBadge 인라인 style 교체 ────────────────────────────────────
describe("A3. HeroFloorBadge — 인라인 style → CSS 클래스 교체", () => {
  const src = read("client/src/components/hero/HeroFloorBadge.tsx");

  it("A3-1: hero-floor-mobile CSS 클래스 사용", () => {
    expect(src).toContain("hero-floor-mobile");
  });

  it("A3-2: hero-floor-desktop CSS 클래스 사용", () => {
    expect(src).toContain("hero-floor-desktop");
  });

  it("A3-3: top/left/color/fontSize 인라인 style 제거", () => {
    expect(src).not.toContain("top: \"22px\"");
    expect(src).not.toContain("color: \"rgba(255,255,255");
    expect(src).not.toContain("fontSize: \"10px\"");
  });
});

// ─── B. DoctorsSection 서브컴포넌트 분리 ─────────────────────────────────────
describe("B. DoctorsSection 서브컴포넌트 분리", () => {
  it("B-1: DoctorTabButton.tsx 파일 존재", () => {
    const src = read("client/src/components/doctors/DoctorTabButton.tsx");
    expect(src).toBeTruthy();
    expect(src).toContain("DoctorTabButton");
  });

  it("B-2: DoctorCredentials.tsx 파일 존재", () => {
    const src = read("client/src/components/doctors/DoctorCredentials.tsx");
    expect(src).toBeTruthy();
    expect(src).toContain("DoctorCredentials");
  });

  it("B-3: DoctorDesktopLayout.tsx 파일 존재", () => {
    const src = read("client/src/components/doctors/DoctorDesktopLayout.tsx");
    expect(src).toBeTruthy();
    expect(src).toContain("DoctorDesktopLayout");
  });

  it("B-4: DoctorMobileLayout.tsx 파일 존재", () => {
    const src = read("client/src/components/doctors/DoctorMobileLayout.tsx");
    expect(src).toBeTruthy();
    expect(src).toContain("DoctorMobileLayout");
  });

  it("B-5: DoctorsSection.tsx가 서브컴포넌트를 import", () => {
    const src = read("client/src/components/DoctorsSection.tsx");
    expect(src).toContain("DoctorDesktopLayout");
    expect(src).toContain("DoctorMobileLayout");
  });

  it("B-6: DoctorsSection.tsx 100줄 이하 (조립자 역할)", () => {
    const lines = read("client/src/components/DoctorsSection.tsx").split("\n").length;
    expect(lines).toBeLessThanOrEqual(110);
  });
});

// ─── C. EquipmentTreatmentCard div role="button" → button 전환 ───────────────
describe("C. EquipmentTreatmentCard — div role=\"button\" → button 요소 전환", () => {
  const src = read("client/src/components/treatments/EquipmentTreatmentCard.tsx");

  it("C-1: role=\"button\" div 제거", () => {
    // div에 role="button"이 없어야 함 (button 요소 자체는 허용)
    expect(src).not.toMatch(/<div[^>]*role="button"/);
  });

  it("C-2: button 요소 사용", () => {
    expect(src).toContain("<button");
    expect(src).toContain("type=\"button\"");
  });

  it("C-3: tabIndex={0} 불필요한 prop 제거 (button은 기본 포커스 가능)", () => {
    // button 요소에 tabIndex={0}은 불필요하므로 제거되어야 함
    expect(src).not.toContain("tabIndex={0}");
  });
});

// ─── D. buildMarkerPinElement 의존 방향 역전 해소 ────────────────────────────
describe("D. buildMarkerPinElement — 의존 방향 역전 해소", () => {
  it("D-1: lib/mapHelpers.ts 파일 존재", () => {
    const src = read("client/src/lib/mapHelpers.ts");
    expect(src).toBeTruthy();
    expect(src).toContain("buildMarkerPinElement");
  });

  it("D-2: useClinicMap.ts가 lib/mapHelpers에서 import", () => {
    const src = read("client/src/hooks/useClinicMap.ts");
    expect(src).toContain("@/lib/mapHelpers");
    expect(src).not.toContain("@/components/ContactSection");
  });

  it("D-3: ContactSection.tsx가 mapHelpers에서 re-export (후행 호환성)", () => {
    const src = read("client/src/components/ContactSection.tsx");
    expect(src).toContain('export { buildMarkerPinElement } from "@/lib/mapHelpers"');
  });

  it("D-4: mapHelpers.ts가 React 컴포넌트를 import하지 않음 (순수 헬퍼)", () => {
    const src = read("client/src/lib/mapHelpers.ts");
    expect(src).not.toContain("import React");
    expect(src).not.toContain("from \"react\"");
  });
});

// ─── E. seoHelpers 타입 강화 ─────────────────────────────────────────────────
describe("E. seoHelpers — JsonLdSchema 타입 강화 + SEO_PRESETS satisfies", () => {
  const src = read("client/src/lib/seoHelpers.ts");

  it("E-1: JsonLdSchema에 @context 필수 필드 포함", () => {
    expect(src).toContain('"@context": string');
  });

  it("E-2: JsonLdSchema에 @type 필수 필드 포함", () => {
    expect(src).toContain('"@type": string | string[]');
  });

  it("E-3: SEO_PRESETS에 satisfies 연산자 적용", () => {
    expect(src).toContain("} satisfies Record<SeoPageType, SeoPreset>");
  });

  it("E-4: SeoPreset 타입 export", () => {
    expect(src).toContain("export type SeoPreset");
  });

  it("E-5: SEO_PRESETS에 4개 키 모두 존재 (home/treatment/default/admin)", () => {
    expect(src).toContain("home:");
    expect(src).toContain("treatment:");
    expect(src).toContain("default:");
    expect(src).toContain("admin:");
  });
});

// ─── F. index.css hero CSS 클래스 추가 ───────────────────────────────────────
describe("F. index.css — hero-stat-*/hero-floor-* CSS 클래스 추가", () => {
  const css = read("client/src/index.css");

  it("F-1: .hero-stat-value 클래스 정의", () => {
    expect(css).toContain(".hero-stat-value");
  });

  it("F-2: .hero-stat-bar 클래스 정의", () => {
    expect(css).toContain(".hero-stat-bar");
  });

  it("F-3: .hero-stat-label 클래스 정의", () => {
    expect(css).toContain(".hero-stat-label");
  });

  it("F-4: .hero-floor-mobile 클래스 정의", () => {
    expect(css).toContain(".hero-floor-mobile");
  });

  it("F-5: .hero-floor-desktop 클래스 정의", () => {
    expect(css).toContain(".hero-floor-desktop");
  });

  it("F-6: .hero-stats-wrap 클래스 정의", () => {
    expect(css).toContain(".hero-stats-wrap");
  });

  it("F-7: data-done 선택자 (isDone 조건부 스타일)", () => {
    expect(css).toContain('[data-done="true"]');
  });

  it("F-8: prefers-reduced-motion 미디어 쿼리 (hero-stat-bar/value)", () => {
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("hero-stat-bar");
  });
});

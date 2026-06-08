/**
 * Round-15 회귀 테스트
 *
 * 검증 영역:
 *   A. HeroAnimations 선언형 motion config (CSS custom property --delay)
 *   B. DoctorsSection WAI-ARIA tab/tablist/tabpanel + 키보드 네비게이션
 *   C. EquipmentTreatmentCard CSS custom property 기반 스타일
 *   D. CategoryTabList 인라인 margin style 제거
 *   E. useStaticTreatmentFilter private helper 분리
 *   F. ContactSection ContactInfoPanel 서브컴포넌트 분리
 *   G. SeoHead deprecated prop + Home.tsx 중복 prop 제거
 *   H. constants.ts CLINIC_STATS JSDoc 설계 의도 문서화
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CLIENT_SRC = path.join(ROOT, "client/src");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(ROOT, relPath), "utf-8");
}

function fileExists(relPath: string): boolean {
  return fs.existsSync(path.join(ROOT, relPath));
}

// ─────────────────────────────────────────────────────────────────────────────
// A. HeroAnimations 선언형 motion config
// ─────────────────────────────────────────────────────────────────────────────
describe("A. HeroAnimations 선언형 motion config", () => {
  const heroAnimFile = readFile("client/src/components/hero/HeroAnimations.tsx");

  it("A-1: --delay CSS custom property를 style prop으로 전달한다", () => {
    expect(heroAnimFile).toMatch(/--delay/);
  });

  it("A-2: animationDelay 인라인 style이 없다 (CSS variable로 대체)", () => {
    // 주석에는 허용, JSX style prop에는 불허
    // style={{ animationDelay: ... }} 패턴이 없어야 함
    const codeLines = heroAnimFile
      .split("\n")
      .filter((line) => !line.trimStart().startsWith("//") && !line.trimStart().startsWith("*"));
    const codeOnly = codeLines.join("\n");
    expect(codeOnly).not.toMatch(/animationDelay\s*:/);
  });

  it("A-3: aria-hidden 또는 aria-label로 스크린리더 접근성을 제공한다", () => {
    expect(heroAnimFile).toMatch(/aria-hidden|aria-label/);
  });

  it("A-4: hero/constants.ts에서 HERO_IMAGES를 import한다", () => {
    const heroSection = readFile("client/src/components/HeroSection.tsx");
    expect(heroSection).toMatch(/from.*hero\/constants/);
    expect(heroSection).toMatch(/HERO_IMAGES/);
  });

  it("A-5: index.css에 --delay CSS variable을 사용하는 hero-char 또는 hero-word 정의가 있다", () => {
    const css = readFile("client/src/index.css");
    expect(css).toMatch(/hero-char|hero-word/);
    expect(css).toMatch(/--delay/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. DoctorsSection WAI-ARIA tab 패턴
// ─────────────────────────────────────────────────────────────────────────────
describe("B. DoctorsSection WAI-ARIA tab/tablist/tabpanel", () => {
  const doctorsFile = readFile("client/src/components/DoctorsSection.tsx");
  const viewModelFile = readFile("client/src/hooks/useDoctorViewModel.ts");

  it("B-1: DoctorsSection에 role=\"tablist\"가 있다", () => {
    expect(doctorsFile).toMatch(/role="tablist"/);
  });

  it("B-2: DoctorsSection에 role=\"tab\"이 있다", () => {
    expect(doctorsFile).toMatch(/role="tab"/);
  });

  it("B-3: DoctorsSection에 role=\"tabpanel\"이 있다", () => {
    expect(doctorsFile).toMatch(/role="tabpanel"/);
  });

  it("B-4: aria-selected가 있다 (탭 선택 상태)", () => {
    expect(doctorsFile).toMatch(/aria-selected/);
  });

  it("B-5: aria-controls와 aria-labelledby로 탭-패널 연결이 있다", () => {
    expect(doctorsFile).toMatch(/aria-controls/);
    expect(doctorsFile).toMatch(/aria-labelledby/);
  });

  it("B-6: useDoctorViewModel에 handleTabKeyDown 키보드 핸들러가 있다", () => {
    expect(viewModelFile).toMatch(/handleTabKeyDown/);
  });

  it("B-7: handleTabKeyDown이 ArrowUp/ArrowDown/ArrowLeft/ArrowRight를 처리한다", () => {
    expect(viewModelFile).toMatch(/ArrowUp|ArrowDown/);
    expect(viewModelFile).toMatch(/ArrowLeft|ArrowRight/);
  });

  it("B-8: handleTabKeyDown이 Home/End 키를 처리한다", () => {
    expect(viewModelFile).toMatch(/Home/);
    expect(viewModelFile).toMatch(/End/);
  });

  it("B-9: DoctorsSection에서 handleTabKeyDown을 onKeyDown에 연결한다", () => {
    expect(doctorsFile).toMatch(/onKeyDown.*handleTabKeyDown|handleTabKeyDown.*onKeyDown/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. EquipmentTreatmentCard CSS custom property 기반 스타일
// ─────────────────────────────────────────────────────────────────────────────
describe("C. EquipmentTreatmentCard CSS custom property 기반 스타일", () => {
  const cardFile = readFile("client/src/components/treatments/EquipmentTreatmentCard.tsx");

  it("C-1: --card-img-bg CSS custom property를 사용한다", () => {
    expect(cardFile).toMatch(/--card-img-bg/);
  });

  it("C-2: --card-accent CSS custom property를 사용한다", () => {
    expect(cardFile).toMatch(/--card-accent/);
  });

  it("C-3: animation 인라인 style이 없다 (CSS class로 대체)", () => {
    // style={{ animation: ... }} 패턴이 없어야 함
    expect(cardFile).not.toMatch(/style=\{\{[^}]*animation:/);
  });

  it("C-4: animate-card-fade 클래스를 사용한다", () => {
    expect(cardFile).toMatch(/animate-card-fade/);
  });

  it("C-5: index.css에 animate-card-fade 유틸리티가 정의되어 있다", () => {
    const css = readFile("client/src/index.css");
    expect(css).toMatch(/animate-card-fade/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. CategoryTabList 인라인 margin style 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("D. CategoryTabList 인라인 margin style 제거", () => {
  const tabListFile = readFile("client/src/components/treatments/CategoryTabList.tsx");

  it("D-1: marginLeft/marginRight 인라인 style이 없다", () => {
    expect(tabListFile).not.toMatch(/marginLeft\s*:|marginRight\s*:/);
  });

  it("D-2: margin 관련 Tailwind 클래스를 사용한다", () => {
    // ml-*, mr-*, mx-* 등의 Tailwind 클래스
    expect(tabListFile).toMatch(/ml-|mr-|mx-|-ml-|-mr-/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. useStaticTreatmentFilter private helper 분리
// ─────────────────────────────────────────────────────────────────────────────
describe("E. useStaticTreatmentFilter private helper 분리", () => {
  const filterFile = readFile("client/src/hooks/useStaticTreatmentFilter.ts");

  it("E-1: sortTreatments 또는 applySort private helper 함수가 있다", () => {
    expect(filterFile).toMatch(/function sort|const sort|applySort|sortItems/i);
  });

  it("E-2: handleSortChange 또는 의미 있는 핸들러 함수가 export된다", () => {
    expect(filterFile).toMatch(/handleSortChange|onSortChange|setSortBy/);
  });

  it("E-3: filteredTreatments가 useMemo로 메모이제이션된다", () => {
    expect(filterFile).toMatch(/useMemo/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. ContactSection ContactInfoPanel 서브컴포넌트 분리
// ─────────────────────────────────────────────────────────────────────────────
describe("F. ContactSection ContactInfoPanel 서브컴포넌트 분리", () => {
  it("F-1: contact/ContactInfoPanel.tsx 파일이 존재한다", () => {
    expect(fileExists("client/src/components/contact/ContactInfoPanel.tsx")).toBe(true);
  });

  it("F-2: ContactSection이 ContactInfoPanel을 import한다", () => {
    const contactFile = readFile("client/src/components/ContactSection.tsx");
    expect(contactFile).toMatch(/ContactInfoPanel/);
    expect(contactFile).toMatch(/from.*contact\/ContactInfoPanel/);
  });

  it("F-3: ContactInfoPanel이 t, infoPanelRef, copied, copyFailed props를 받는다", () => {
    const panelFile = readFile("client/src/components/contact/ContactInfoPanel.tsx");
    expect(panelFile).toMatch(/infoPanelRef/);
    expect(panelFile).toMatch(/copied/);
    expect(panelFile).toMatch(/copyFailed/);
  });

  it("F-4: ContactInfoPanel에서 hex 색상 대신 CSS 변수를 사용한다", () => {
    const panelFile = readFile("client/src/components/contact/ContactInfoPanel.tsx");
    // 주요 hex 색상이 없어야 함
    expect(panelFile).not.toMatch(/#81C7C9(?!")/);
    expect(panelFile).not.toMatch(/#1F2937(?!")/);
    expect(panelFile).not.toMatch(/#6B7280(?!")/);
    expect(panelFile).not.toMatch(/#4A6FA5(?!")/);
    // CSS 변수를 사용해야 함
    expect(panelFile).toMatch(/var\(--color-star/);
  });

  it("F-5: ContactSection에서 Train/Car/MapPin 등 Info Panel 전용 아이콘 import가 제거되었다", () => {
    const contactFile = readFile("client/src/components/ContactSection.tsx");
    // Train, Car는 ContactInfoPanel로 이전되었으므로 ContactSection에서 import 불필요
    expect(contactFile).not.toMatch(/import.*Train.*from/);
    expect(contactFile).not.toMatch(/import.*Car.*from/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// G. SeoHead deprecated prop + Home.tsx 중복 prop 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("G. SeoHead deprecated prop 및 Home.tsx 정리", () => {
  it("G-1: Home.tsx에서 includeWebSiteSchema prop이 제거되었다", () => {
    const homeFile = readFile("client/src/pages/Home.tsx");
    expect(homeFile).not.toMatch(/includeWebSiteSchema/);
  });

  it("G-2: Home.tsx에서 pageType=\"home\"을 사용한다", () => {
    const homeFile = readFile("client/src/pages/Home.tsx");
    expect(homeFile).toMatch(/pageType="home"/);
  });

  it("G-3: SeoHead.tsx에 deprecated prop 타입이 유지된다 (하위 호환)", () => {
    const seoHeadFile = readFile("client/src/components/SeoHead.tsx");
    expect(seoHeadFile).toMatch(/includeMedicalSchema/);
    expect(seoHeadFile).toMatch(/includeWebSiteSchema/);
  });

  it("G-4: SeoHead.tsx에 @deprecated 또는 @internal JSDoc 주석이 있다", () => {
    const seoHeadFile = readFile("client/src/components/SeoHead.tsx");
    expect(seoHeadFile).toMatch(/@deprecated|@internal/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// H. constants.ts CLINIC_STATS JSDoc 설계 의도 문서화
// ─────────────────────────────────────────────────────────────────────────────
describe("H. constants.ts CLINIC_STATS 설계 의도 문서화", () => {
  const constantsFile = readFile("client/src/lib/constants.ts");

  it("H-1: CLINIC_STATS JSDoc에 역할 분리 설명이 있다", () => {
    expect(constantsFile).toMatch(/역할 분리|이중 관리/);
  });

  it("H-2: useClinicStats 훅 참조가 JSDoc에 있다", () => {
    expect(constantsFile).toMatch(/useClinicStats/);
  });

  it("H-3: CLINIC_STATS가 as const로 선언되어 있다", () => {
    expect(constantsFile).toMatch(/CLINIC_STATS\s*=\s*\{[\s\S]*?\}\s*as\s+const/);
  });

  it("H-4: STAT_UNITS가 as const로 선언되어 있다", () => {
    expect(constantsFile).toMatch(/STAT_UNITS\s*=\s*\{[\s\S]*?\}\s*as\s+const/);
  });
});

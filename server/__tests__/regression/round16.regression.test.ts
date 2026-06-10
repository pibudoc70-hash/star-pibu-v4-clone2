/**
 * round16.regression.test.ts
 * Round-16 시니어 검수 회귀 테스트
 *
 * A. HeroSection: hero 유틸리티 CSS 클래스 + 인라인 style 제거
 * B. DoctorsSection: 인라인 style → CSS 클래스 교체 + WAI-ARIA 유지
 * C. TreatmentsEquipmentSection: Escape/outside click + handleSortChange/toggleFilter
 * D. EquipmentTreatmentCard: CSS custom property 기반 스타일
 * E. ContactSection: 인라인 style 제거 + CSS 변수 토큰
 * F. CategoryTabList: 매직넘버 → Tailwind 표준 토큰
 * G. clinic-data.ts: CLINIC_DOCTORS/CLINIC_PROCEDURES 분리
 * H. constants.ts: clinic-data.ts re-export
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";

const root = resolve(__dirname, "../../..");

function readClient(rel: string) {
  return readFileSync(resolve(root, "client/src", rel), "utf-8");
}

function readLib(rel: string) {
  return readFileSync(resolve(root, "client/src/lib", rel), "utf-8");
}

function readServer(rel: string) {
  return readFileSync(resolve(root, "server", rel), "utf-8");
}

// ─── A. HeroSection ──────────────────────────────────────────────────────────
describe("A. HeroSection: hero 유틸리티 CSS 클래스 + 인라인 style 제거", () => {
  const heroSrc = readClient("components/HeroSection.tsx");
  const indexCss = readClient("index.css");

  it("A-1: hero-bg-img CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.hero-bg-img\s*\{/);
  });

  it("A-2: hero-content CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.hero-content\s*\{/);
  });

  it("A-3: hero-title CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.hero-title\s*\{/);
  });

  it("A-4: hero-subtitle CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.hero-subtitle\s*\{/);
  });

  it("A-5: HeroSection에 hero-content 클래스가 사용되어야 한다", () => {
    expect(heroSrc).toContain("hero-content");
  });

  it("A-6: HeroSection에 hero-title 클래스가 사용되어야 한다", () => {
    expect(heroSrc).toContain("hero-title");
  });

  it("A-7: HeroSection에 hero-subtitle 클래스가 사용되어야 한다", () => {
    expect(heroSrc).toContain("hero-subtitle");
  });

  it("A-8: HeroSection에 paddingTop 매직넘버 인라인 style이 없어야 한다", () => {
    // paddingTop: '141px' 또는 paddingTop: "141px" 패턴 제거 확인
    expect(heroSrc).not.toMatch(/paddingTop\s*:\s*["']?141px/);
  });

  it("A-9: HeroSection에 marginTop 매직넘버 인라인 style이 없어야 한다", () => {
    expect(heroSrc).not.toMatch(/marginTop\s*:\s*["']?-47px/);
  });
});

// ─── B. DoctorsSection ───────────────────────────────────────────────────────
describe("B. DoctorsSection: 인라인 style → CSS 클래스 교체", () => {
  // [R19] DoctorsSection 서브컴포넌트 분리 후 클래스가 서브컴포넌트에 뛰어짔
  const doctorsSrc = readClient("components/DoctorsSection.tsx");
  const desktopSrc = readClient("components/doctors/DoctorDesktopLayout.tsx");
  const mobileSrc = readClient("components/doctors/DoctorMobileLayout.tsx");
  const tabBtnSrc = readClient("components/doctors/DoctorTabButton.tsx");
  const allDoctorsSrc = doctorsSrc + "\n" + desktopSrc + "\n" + mobileSrc + "\n" + tabBtnSrc;
  const indexCss = readClient("index.css");

  it("B-1: dr-section-bg CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.dr-section-bg\s*\{/);
  });

  it("B-2: dr-panel-card CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.dr-panel-card\s*\{/);
  });

  it("B-3: dr-tab-sidebar CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.dr-tab-sidebar\s*\{/);
  });

  it("B-4: dr-name-h3-desktop CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.dr-name-h3-desktop\s*\{/);
  });

  it("B-5: DoctorsSection 영역에 dr-section-bg 클래스가 사용되어야 한다", () => {
    expect(allDoctorsSrc).toContain("dr-section-bg");
  });

  it("B-6: DoctorsSection 영역에 dr-panel-card 클래스가 사용되어야 한다", () => {
    expect(allDoctorsSrc).toContain("dr-panel-card");
  });

  it("B-7: DoctorsSection 영역에 dr-tab-sidebar 클래스가 사용되어야 한다", () => {
    expect(allDoctorsSrc).toContain("dr-tab-sidebar");
  });

  it("B-8: DoctorsSection 영역에 dr-name-h3-desktop 클래스가 사용되어야 한다", () => {
    expect(allDoctorsSrc).toContain("dr-name-h3-desktop");
  });

  it("B-9: DoctorsSection 영역에 role=\"tablist\"가 있어야 한다 (WAI-ARIA 유지)", () => {
    expect(allDoctorsSrc).toContain('role="tablist"');
  });

  it("B-10: DoctorsSection 영역에 role=\"tab\"이 있어야 한다 (WAI-ARIA 유지)", () => {
    expect(allDoctorsSrc).toContain('role="tab"');
  });

  it("B-11: DoctorsSection 영역에 role=\"tabpanel\"이 있어야 한다 (WAI-ARIA 유지)", () => {
    expect(allDoctorsSrc).toContain('role="tabpanel"');
  });
});

// ─── C. TreatmentsEquipmentSection ───────────────────────────────────────────
describe("C. TreatmentsEquipmentSection: 접근성 + 핸들러 개선", () => {
  const treatSrc = readClient("components/TreatmentsEquipmentSection.tsx");

  it("C-1: Escape 키 드롭다운 닫기 로직이 있어야 한다", () => {
    expect(treatSrc).toContain("Escape");
  });

  it("C-2: outside click 닫기 로직이 있어야 한다 (useEffect + mousedown/click)", () => {
    // outside click 처리를 위한 이벤트 리스너 패턴
    const hasOutsideClick =
      treatSrc.includes("mousedown") ||
      treatSrc.includes("pointerdown") ||
      (treatSrc.includes("useEffect") && treatSrc.includes("filterOpen"));
    expect(hasOutsideClick).toBe(true);
  });

  it("C-3: handleSortChange 핸들러를 사용해야 한다 (setSortBy 직접 호출 금지)", () => {
    expect(treatSrc).toContain("handleSortChange");
  });

  it("C-4: toggleFilter 핸들러를 사용해야 한다 (setFilterOpen 직접 호출 금지)", () => {
    expect(treatSrc).toContain("toggleFilter");
  });

  it("C-5: aria-haspopup이 있어야 한다 (dropdown 접근성)", () => {
    expect(treatSrc).toContain("aria-haspopup");
  });

  it("C-6: 더보기 버튼에 인라인 background style이 없어야 한다", () => {
    // style={{ background: ... }} 패턴이 더보기 버튼에 없어야 함
    // showAll 버튼 주변에 background 인라인 style 없음 확인
    const showAllArea = treatSrc.match(/showAll[\s\S]{0,500}/)?.[0] ?? "";
    expect(showAllArea).not.toMatch(/style=\{\{[^}]*background[^}]*\}\}/);
  });
});

// ─── D. EquipmentTreatmentCard ────────────────────────────────────────────────
describe("D. EquipmentTreatmentCard: CSS custom property 기반 스타일", () => {
  const cardSrc = readClient("components/treatments/EquipmentTreatmentCard.tsx");

  it("D-1: --card-img-bg CSS custom property가 사용되어야 한다", () => {
    expect(cardSrc).toContain("--card-img-bg");
  });

  it("D-2: --card-accent CSS custom property가 사용되어야 한다", () => {
    expect(cardSrc).toContain("--card-accent");
  });

  it("D-3: animate-card-fade 클래스가 사용되어야 한다", () => {
    expect(cardSrc).toContain("animate-card-fade");
  });

  it("D-4: 이미지 영역에 background 인라인 style이 없어야 한다 (CSS custom property 사용)", () => {
    // style={{ background: imgBg }} 패턴이 없어야 함
    expect(cardSrc).not.toMatch(/style=\{\{[^}]*background:\s*imgBg/);
  });

  it("D-5: 카드 이미지 높이에 h-48 Tailwind 클래스가 사용되어야 한다", () => {
    // [R20-P1-5] h-48 클래스는 TreatmentCardMedia.tsx로 이동됨
    const mediaSrc = readClient("components/treatments/TreatmentCardMedia.tsx");
    const hasH48InCard = cardSrc.includes("h-48");
    const hasH48InMedia = mediaSrc.includes("h-48");
    expect(hasH48InCard || hasH48InMedia).toBe(true);
  });
});

// ─── E. ContactSection ────────────────────────────────────────────────────────
describe("E. ContactSection: 인라인 style 제거 + CSS 변수 토큰", () => {
  const contactSrc = readClient("components/ContactSection.tsx");

  it("E-1: locationInfo 단락에 text-[var(--color-star-mint)] 클래스가 사용되어야 한다", () => {
    expect(contactSrc).toContain("text-[var(--color-star-mint)]");
  });

  it("E-2: h2 섹션 타이틀에 font-extrabold 클래스가 사용되어야 한다", () => {
    expect(contactSrc).toContain("font-extrabold");
  });

  it("E-3: h2 섹션 타이틀에 text-[clamp(1.4rem,5vw,2.6rem)] 클래스가 사용되어야 한다", () => {
    expect(contactSrc).toContain("text-[clamp(1.4rem,5vw,2.6rem)]");
  });

  it("E-4: 지도 컨테이너에 flex flex-col 클래스가 사용되어야 한다", () => {
    expect(contactSrc).toContain("flex flex-col");
  });

  it("E-5: JSX 지도 컨테이너에 display: flex 인라인 style이 없어야 한다 (마커 HTML 문자열 제외)", () => {
    // buildMarkerPinElement 함수 내 HTML 문자열 제외
    // JSX return 문 이후의 코드에서 style={{ display: 'flex' }} 패턴 확인
    const returnIndex = contactSrc.indexOf("return (");
    const jsxPart = returnIndex >= 0 ? contactSrc.slice(returnIndex) : contactSrc;
    expect(jsxPart).not.toMatch(/style=\{\{[^}]*display\s*:\s*["']?flex["']?/);
  });

  it("E-6: ContactInfoPanel 서브컴포넌트가 import되어야 한다", () => {
    expect(contactSrc).toContain("ContactInfoPanel");
  });
});

// ─── F. CategoryTabList ───────────────────────────────────────────────────────
describe("F. CategoryTabList: 매직넘버 → Tailwind 표준 토큰", () => {
  const catSrc = readClient("components/treatments/CategoryTabList.tsx");

  it("F-1: mt-[9px] 매직넘버가 없어야 한다", () => {
    expect(catSrc).not.toContain("mt-[9px]");
  });

  it("F-2: mr-[5px] 매직넘버가 없어야 한다", () => {
    expect(catSrc).not.toContain("mr-[5px]");
  });

  it("F-3: mt-2 표준 Tailwind 토큰이 사용되어야 한다", () => {
    expect(catSrc).toContain("mt-2");
  });

  it("F-4: mr-1 표준 Tailwind 토큰이 사용되어야 한다", () => {
    expect(catSrc).toContain("mr-1");
  });
});

// ─── G. clinic-data.ts ────────────────────────────────────────────────────────
describe("G. clinic-data.ts: CLINIC_DOCTORS/CLINIC_PROCEDURES 분리", () => {
  const clinicData = readLib("clinic-data.ts");

  it("G-1: clinic-data.ts 파일이 존재하고 CLINIC_DOCTORS를 export해야 한다", () => {
    expect(clinicData).toContain("export const CLINIC_DOCTORS");
  });

  it("G-2: clinic-data.ts 파일이 CLINIC_PROCEDURES를 export해야 한다", () => {
    expect(clinicData).toContain("export const CLINIC_PROCEDURES");
  });

  it("G-3: CLINIC_DOCTORS에 3명의 의사 데이터가 있어야 한다", () => {
    const matches = clinicData.match(/name:\s*["'][^"']+["']/g) ?? [];
    // 의사 3명 × name 필드 1개 = 최소 3개
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });

  it("G-4: CLINIC_PROCEDURES에 5개의 시술 데이터가 있어야 한다", () => {
    const matches = clinicData.match(/nameEn:\s*["'][^"']+["']/g) ?? [];
    // 의사 3명 + 시술 5개 = 8개의 nameEn 필드
    expect(matches.length).toBeGreaterThanOrEqual(5);
  });

  it("G-5: clinic-data.ts에 seoHelpers.ts 전용 주석이 있어야 한다", () => {
    expect(clinicData).toContain("seoHelpers.ts");
  });
});

// ─── H. constants.ts ──────────────────────────────────────────────────────────
describe("H. constants.ts: clinic-data.ts re-export", () => {
  const constantsSrc = readLib("constants.ts");

  it("H-1: constants.ts에서 CLINIC_DOCTORS를 clinic-data.ts로부터 re-export해야 한다", () => {
    expect(constantsSrc).toMatch(/export\s*\{[^}]*CLINIC_DOCTORS[^}]*\}\s*from\s*["']@\/lib\/clinic-data["']/);
  });

  it("H-2: constants.ts에서 CLINIC_PROCEDURES를 clinic-data.ts로부터 re-export해야 한다", () => {
    expect(constantsSrc).toMatch(/export\s*\{[^}]*CLINIC_PROCEDURES[^}]*\}\s*from\s*["']@\/lib\/clinic-data["']/);
  });

  it("H-3: constants.ts에 CLINIC_DOCTORS 인라인 데이터가 없어야 한다 (분리 완료)", () => {
    // re-export 줄 외에 CLINIC_DOCTORS = [ 패턴이 없어야 함
    const lines = constantsSrc.split("\n");
    const inlineLines = lines.filter(
      (l) => l.includes("CLINIC_DOCTORS") && l.includes("=") && l.includes("[")
    );
    expect(inlineLines).toHaveLength(0);
  });

  it("H-4: constants.ts에 CLINIC_PROCEDURES 인라인 데이터가 없어야 한다 (분리 완료)", () => {
    const lines = constantsSrc.split("\n");
    const inlineLines = lines.filter(
      (l) => l.includes("CLINIC_PROCEDURES") && l.includes("=") && l.includes("[")
    );
    expect(inlineLines).toHaveLength(0);
  });

  it("H-5: seoHelpers.ts가 clinic-data.ts에서 직접 import해야 한다", () => {
    const seoSrc = readLib("seoHelpers.ts");
    expect(seoSrc).toContain('from "@/lib/clinic-data"');
  });
});

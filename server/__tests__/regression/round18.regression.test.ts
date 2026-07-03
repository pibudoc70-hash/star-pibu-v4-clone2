/**
 * round18.regression.test.ts
 * Round-18 시니어 검수 회귀 테스트
 *
 * A. HeroScrollIndicator/HeroActions: 인라인 style → CSS 클래스 교체
 * B. HeroBackgroundLayers: 추상화 컴포넌트 신규 생성
 * C. useDoctorSwipe: swipe 로직 분리
 * D. TreatmentsEquipmentSection: setFilterOpen deprecated setter 제거 → closeFilter 로컬 함수
 * E. EquipmentTreatmentModal: 모달 서브컴포넌트 분리
 * F. useClinicMap: ContactSection onMapReady 콜백 캡슐화
 * G. useStaticTreatmentFilter: deprecated setter 완전 제거
 * H. SeoHead/seoHelpers: SEO_PRESETS + buildClinicJsonLd + buildBreadcrumbJsonLd 테스트
 * I. constants.ts: CLINIC_INFO.image cloudfront URL → manus-storage 교체
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";

const root = resolve(__dirname, "../../..");
function readClient(rel: string) {
  return readFileSync(resolve(root, "client/src", rel), "utf-8");
}
function readHook(name: string) {
  return readFileSync(resolve(root, "client/src/hooks", name), "utf-8");
}
function readLib(name: string) {
  return readFileSync(resolve(root, "client/src/lib", name), "utf-8");
}

// ─── A. HeroScrollIndicator/HeroActions ──────────────────────────────────────
describe("A. HeroScrollIndicator/HeroActions: 인라인 style → CSS 클래스 교체", () => {
  const scrollSrc = readClient("components/hero/HeroScrollIndicator.tsx");
  const actionsSrc = readClient("components/hero/HeroActions.tsx");
  const indexCss = readClient("index.css");

  it("A-1: HeroScrollIndicator에 고정 색상/레이아웃 인라인 style이 없어야 한다 (데이터 기반 animationDelay는 허용)", () => {
    // animationDelay는 데이터 기반 동적 값으로 인라인 style 유지 허용
    // 고정 색상(background, color, border) 인라인 style은 없어야 함
    expect(scrollSrc).not.toMatch(/style=\{\{[^}]*background[^}]*\}\}/);
    expect(scrollSrc).not.toMatch(/style=\{\{[^}]*fontSize[^}]*\}\}/);
    expect(scrollSrc).not.toMatch(/style=\{\{[^}]*color[^}]*\}\}/);
  });

  it("A-2: HeroActions에 고정 레이아웃 인라인 style이 없어야 한다 (데이터 기반 chatBg/chatColor/animationDelay는 허용)", () => {
    // chatBg/chatColor/chatShadow는 런타임 동적 prop으로 인라인 style 유지 허용
    // 고정 매직넷버 색상이나 고정 레이아웃 인라인 style은 없어야 함
    expect(actionsSrc).not.toMatch(/style=\{\{[^}]*fontSize[^}]*\}\}/);
    expect(actionsSrc).not.toMatch(/style=\{\{[^}]*margin[^}]*\}\}/);
    expect(actionsSrc).not.toMatch(/style=\{\{[^}]*padding[^}]*\}\}/);
  });

  it("A-3: index.css에 hero-scroll 관련 CSS 클래스가 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/hero-scroll|hero-cta/);
  });
});

// ─── B. HeroBackgroundLayers ─────────────────────────────────────────────────
describe("B. HeroBackgroundLayers: 추상화 컴포넌트 신규 생성", () => {
  const bgLayersSrc = readClient("components/hero/HeroBackgroundLayers.tsx");
  const heroSrc = readClient("components/HeroSection.tsx");

  it("B-1: HeroBackgroundLayers.tsx 파일이 존재해야 한다", () => {
    expect(bgLayersSrc.length).toBeGreaterThan(0);
  });

  it("B-2: HeroBackgroundLayers가 HeroDarkOverlay를 포함해야 한다", () => {
    expect(bgLayersSrc).toContain("HeroDarkOverlay");
  });

  it("B-3: HeroBackgroundLayers가 HeroVignette를 포함해야 한다", () => {
    expect(bgLayersSrc).toContain("HeroVignette");
  });

  it("B-4: HeroSection.tsx에서 HeroBackgroundLayers를 import해야 한다", () => {
    expect(heroSrc).toContain("HeroBackgroundLayers");
  });

  it("B-5: HeroSection.tsx에 aria-hidden 배경 요소가 있어야 한다", () => {
    expect(heroSrc).toMatch(/aria-hidden/);
  });
});

// ─── C. useDoctorSwipe ───────────────────────────────────────────────────────
describe("C. useDoctorSwipe: swipe 로직 분리", () => {
  const swipeSrc = readHook("useDoctorSwipe.ts");
  const viewModelSrc = readHook("useDoctorViewModel.ts");

  it("C-1: useDoctorSwipe.ts 파일이 존재해야 한다", () => {
    expect(swipeSrc.length).toBeGreaterThan(0);
  });

  it("C-2: useDoctorSwipe가 handleTouchStart를 export해야 한다", () => {
    expect(swipeSrc).toMatch(/handleTouchStart|onTouchStart/);
  });

  it("C-3: useDoctorSwipe가 handleTouchEnd를 export해야 한다", () => {
    expect(swipeSrc).toMatch(/handleTouchEnd|onTouchEnd/);
  });

  it("C-4: useDoctorViewModel이 useDoctorSwipe를 import해야 한다", () => {
    expect(viewModelSrc).toContain("useDoctorSwipe");
  });

  it("C-5: useDoctorViewModel에 touchStart/touchEnd 인라인 로직이 없어야 한다", () => {
    // swipe 로직이 분리되었으므로 touchStartX 직접 정의가 없어야 함
    expect(viewModelSrc).not.toMatch(/const\s+touchStartX\s*=/);
  });
});

// ─── D. TreatmentsEquipmentSection ───────────────────────────────────────────
describe("D. TreatmentsEquipmentSection: setFilterOpen deprecated setter 제거", () => {
  const treatSrc = readClient("components/TreatmentsEquipmentSection.tsx");

  it("D-1: setFilterOpen을 useStaticTreatmentFilter에서 destructure하지 않아야 한다", () => {
    // [DB통합] useStaticTreatmentFilter 훅을 더 이상 사용하지 않으므로
    // useStaticTreatmentFilter import 자체가 없어야 함
    expect(treatSrc).not.toContain("useStaticTreatmentFilter");
  });

  it("D-2: closeFilter 함수가 존재해야 한다 (로컬 정의 또는 hook에서 직접 제공)", () => {
    // [R22-P0-3] closeFilter가 hook에서 직접 제공되므로 로컬 const 정의 없이 구조분해로 사용
    const hasLocalCloseFilter = /const\s+closeFilter\s*=/.test(treatSrc);
    const hasHookCloseFilter = treatSrc.includes("closeFilter,") || treatSrc.includes("closeFilter }") || treatSrc.includes("closeFilter:");
    expect(hasLocalCloseFilter || hasHookCloseFilter).toBe(true);
  });

  it("D-3: Escape 키 핸들러가 closeFilter를 사용해야 한다", () => {
    expect(treatSrc).toMatch(/Escape.*closeFilter|closeFilter.*Escape/s);
  });

  it("D-4: ArrowDown/Up 키보드 탐색이 구현되어 있어야 한다", () => {
    expect(treatSrc).toMatch(/ArrowDown|ArrowUp/);
  });
});

// ─── E. EquipmentTreatmentModal ──────────────────────────────────────────────
describe("E. EquipmentTreatmentModal: 모달 서브컴포넌트 분리", () => {
  const modalSrc = readClient("components/treatments/EquipmentTreatmentModal.tsx");
  const cardSrc = readClient("components/treatments/EquipmentTreatmentCard.tsx");

  it("E-1: EquipmentTreatmentModal.tsx 파일이 존재해야 한다", () => {
    expect(modalSrc.length).toBeGreaterThan(0);
  });

  it("E-2: EquipmentTreatmentModal이 Dialog를 사용해야 한다", () => {
    expect(modalSrc).toMatch(/Dialog|dialog/);
  });

  it("E-3: EquipmentTreatmentCard가 EquipmentTreatmentModal을 import해야 한다", () => {
    expect(cardSrc).toContain("EquipmentTreatmentModal");
  });

  it("E-4: EquipmentTreatmentCard가 200줄 이하여야 한다 (책임 분리 확인)", () => {
    const lines = cardSrc.split("\n").length;
    expect(lines).toBeLessThanOrEqual(200);
  });
});

// ─── F. useClinicMap ─────────────────────────────────────────────────────────
describe("F. useClinicMap: ContactSection onMapReady 콜백 캡슐화", () => {
  const clinicMapSrc = readHook("useClinicMap.ts");
  const contactSrc = readClient("components/ContactSection.tsx");

  it("F-1: useClinicMap.ts 파일이 존재해야 한다", () => {
    expect(clinicMapSrc.length).toBeGreaterThan(0);
  });

  it("F-2: useClinicMap이 handleMapReady를 export해야 한다", () => {
    expect(clinicMapSrc).toMatch(/handleMapReady/);
  });

  it("F-3: ContactSection이 useClinicMap을 import해야 한다", () => {
    expect(contactSrc).toContain("useClinicMap");
  });

  it("F-4: ContactSection에서 useClinicMap을 컴포넌트 최상위에서 호출해야 한다", () => {
    // IIFE 내부가 아닌 컴포넌트 최상위에서 호출
    expect(contactSrc).toMatch(/const\s*\{[^}]*handleMapReady[^}]*\}\s*=\s*useClinicMap/);
  });
});

// ─── G. useStaticTreatmentFilter ─────────────────────────────────────────────
describe("G. useStaticTreatmentFilter: deprecated setter 완전 제거", () => {
  const filterSrc = readHook("useStaticTreatmentFilter.ts");

  it("G-1: setSortBy가 return 객체에 포함되지 않아야 한다", () => {
    // return 블록에 setSortBy가 없어야 함
    const returnBlock = filterSrc.match(/return\s*\{[\s\S]*?\};/)?.[0] ?? "";
    expect(returnBlock).not.toContain("setSortBy");
  });

  it("G-2: setFilterOpen이 return 객체에 포함되지 않아야 한다", () => {
    const returnBlock = filterSrc.match(/return\s*\{[\s\S]*?\};/)?.[0] ?? "";
    expect(returnBlock).not.toContain("setFilterOpen");
  });

  it("G-3: UseStaticTreatmentFilterReturn 인터페이스에 deprecated setter가 없어야 한다", () => {
    expect(filterSrc).not.toMatch(/@deprecated.*setSortBy|setSortBy.*@deprecated/s);
    expect(filterSrc).not.toMatch(/@deprecated.*setFilterOpen|setFilterOpen.*@deprecated/s);
  });

  it("G-4: handleSortChange가 export되어야 한다", () => {
    expect(filterSrc).toContain("handleSortChange");
  });

  it("G-5: toggleFilter가 export되어야 한다", () => {
    expect(filterSrc).toContain("toggleFilter");
  });
});

// ─── H. SeoHead/seoHelpers ───────────────────────────────────────────────────
describe("H. seoHelpers: SEO_PRESETS + buildClinicJsonLd 구조 검증", () => {
  const seoHelpersSrc = readLib("seoHelpers.ts");

  it("H-1: SEO_PRESETS가 export되어야 한다", () => {
    expect(seoHelpersSrc).toMatch(/export\s+const\s+SEO_PRESETS/);
  });

  it("H-2: SEO_PRESETS에 home/treatment/default/admin 4개 키가 있어야 한다", () => {
    expect(seoHelpersSrc).toMatch(/home\s*:/);
    expect(seoHelpersSrc).toMatch(/treatment\s*:/);
    expect(seoHelpersSrc).toMatch(/default\s*:/);
    expect(seoHelpersSrc).toMatch(/admin\s*:/);
  });

  it("H-3: buildClinicJsonLd가 export되어야 한다", () => {
    expect(seoHelpersSrc).toMatch(/export\s+function\s+buildClinicJsonLd/);
  });

  it("H-4: buildBreadcrumbJsonLd가 export되어야 한다", () => {
    expect(seoHelpersSrc).toMatch(/export\s+function\s+buildBreadcrumbJsonLd/);
  });

  it("H-5: buildHreflangs에 슬래시 시작 검증 가드가 있어야 한다", () => {
    expect(seoHelpersSrc).toMatch(/startsWith.*\/|\/.*startsWith/);
  });
});

// ─── I. constants.ts CLINIC_INFO.image ───────────────────────────────────────
describe("I. constants.ts: CLINIC_INFO.image cloudfront URL 제거", () => {
  const constantsSrc = readLib("constants.ts");

  it("I-1: CLINIC_INFO.image에 cloudfront.net URL이 없어야 한다", () => {
    // image 필드에만 cloudfront가 없어야 함
    const imageMatch = constantsSrc.match(/image\s*:\s*["'][^"']*["']/);
    expect(imageMatch?.[0] ?? "").not.toContain("cloudfront.net");
  });

  it("I-2: CLINIC_INFO.image가 manus-storage 경로를 사용해야 한다", () => {
    // [R21-P1-7] CLINIC_INFO.image가 CLINIC_REPRESENTATIVE_IMAGE 변수 참조로 교체됨
    // 직접 문자열 매칭 대신 assetConfig 참조 또는 manus-storage 포함 여부 확인
    const imageMatch = constantsSrc.match(/image\s*:\s*["'][^"']*["']/);
    const hasDirectManus = (imageMatch?.[0] ?? "").includes("manus-storage");
    // 변수 참조 패턴: CLINIC_REPRESENTATIVE_IMAGE
    const hasVariableRef = constantsSrc.includes("CLINIC_REPRESENTATIVE_IMAGE");
    // assetConfig에서 manus-storage 경로 사용 확인
    const assetConfigSrc = readLib("assetConfig.ts");
    const assetConfigHasManus = assetConfigSrc.includes("manus-storage");
    expect(hasDirectManus || (hasVariableRef && assetConfigHasManus)).toBe(true);
  });

  it("I-3: CLINIC_INFO 객체가 name/url/telephone 필드를 포함해야 한다", () => {
    expect(constantsSrc).toMatch(/name\s*:\s*["']/);
    expect(constantsSrc).toMatch(/url\s*:\s*["']/);
    expect(constantsSrc).toMatch(/telephone\s*:\s*["']/);
  });
});

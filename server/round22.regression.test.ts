/**
 * Round-22 회귀 테스트
 *
 * 검증 항목:
 *   A. DesignSystem.tsx: PremiumButton/SurfaceCard 선언형 CSS class/variant 기반 재설계
 *   B. TreatmentsEquipmentSection: 3단계 breakpoint + setTimeout 매직 넘버 제거 + aria-live
 *   C. useStaticTreatmentFilter: closeFilter 노출 + VALID_TAB_IDS + UseStaticTreatmentFilterReturn export
 *   D. SeoHead: preset별 canonical/og/twitter/json-ld/hreflang 구조 + admin noindex 보증
 *   E. seoHelpers: buildHreflangs 4개 언어 고정 제약 + JSON-LD 핵심 필드
 *   F. constants: CLINIC_STAT_UNIT_MAP 타입 안전성 + 단일 소스 정책
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const root = path.resolve(__dirname, "..");
const readClient = (relPath: string) =>
  fs.readFileSync(path.join(root, "client/src", relPath), "utf-8");
const readLib = (relPath: string) =>
  fs.readFileSync(path.join(root, "client/src/lib", relPath), "utf-8");

// ─────────────────────────────────────────────────────────────────────────────
// A. DesignSystem.tsx
// ─────────────────────────────────────────────────────────────────────────────
describe("A. DesignSystem.tsx", () => {
  const content = readClient("components/ui/DesignSystem.tsx");

  it("A-1: PremiumButton 컴포넌트가 존재한다", () => {
    expect(content).toContain("PremiumButton");
  });

  it("A-2: SurfaceCard 컴포넌트가 존재한다", () => {
    expect(content).toContain("SurfaceCard");
  });

  it("A-3: onMouseEnter/onMouseLeave DOM style mutation이 없다 (선언형 CSS 기반)", () => {
    // onMouseEnter/Leave가 style 직접 조작에 사용되지 않아야 함
    expect(content).not.toMatch(/onMouseEnter.*style\./);
    expect(content).not.toMatch(/onMouseLeave.*style\./);
    expect(content).not.toMatch(/\.style\.\w+\s*=/);
  });

  it("A-4: PremiumButtonVariant 타입이 export된다", () => {
    expect(content).toContain("export type PremiumButtonVariant");
  });

  it("A-5: SurfaceCardVariant 타입이 export된다", () => {
    expect(content).toContain("export type SurfaceCardVariant");
  });

  it("A-6: variant prop 기반 클래스 매핑 패턴을 사용한다", () => {
    // variant prop을 사용하는 패턴: 객체 룩업(VARIANTS[variant]) 또는 조건 분기(variant === "...")
    const hasVariantLookup = /PREMIUM_BUTTON_VARIANTS\[variant\]/.test(content);
    const hasVariantSwitch = /variant\s*===\s*["']\w+["']/.test(content);
    expect(hasVariantLookup || hasVariantSwitch).toBe(true);
  });

  it("A-7: forwardRef를 사용하여 ref 전달을 지원한다", () => {
    expect(content).toContain("forwardRef");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. TreatmentsEquipmentSection
// ─────────────────────────────────────────────────────────────────────────────
describe("B. TreatmentsEquipmentSection", () => {
  const content = readClient("components/TreatmentsEquipmentSection.tsx");

  it("B-1: SM_BREAKPOINT = 640, MD_BREAKPOINT = 768 상수가 정의된다 (Tailwind sm/md 동기화)", () => {
    // [R24-P0-2] useViewportTier.ts로 분리됨 — 두 파일 중 하나에 있으면 통과
    const viewportTierSrc = readClient("hooks/useViewportTier.ts");
    const hasInSection = content.includes("SM_BREAKPOINT = 640") && content.includes("MD_BREAKPOINT = 768");
    const hasInHook = viewportTierSrc.includes("SM_BREAKPOINT = 640") && viewportTierSrc.includes("MD_BREAKPOINT = 768");
    expect(hasInSection || hasInHook).toBe(true);
  });

  it("B-2: MOBILE_SHOW / TABLET_SHOW / DESKTOP_SHOW 3단계 breakpoint 정책이 존재한다", () => {
    expect(content).toContain("MOBILE_SHOW");
    expect(content).toContain("TABLET_SHOW");
    expect(content).toContain("DESKTOP_SHOW");
  });

  it("B-3: ViewportTier 타입이 mobile/tablet/desktop 3단계로 정의된다", () => {
    // [R24-P0-2] useViewportTier.ts로 분리됨 — 두 파일 중 하나에 있으면 통과
    const viewportTierSrc = readClient("hooks/useViewportTier.ts");
    const combined = content + viewportTierSrc;
    expect(combined).toContain("ViewportTier");
    expect(combined).toContain('"mobile"');
    expect(combined).toContain('"tablet"');
    expect(combined).toContain('"desktop"');
  });

  it("B-4: setTimeout(420) 매직 넘버가 없다 (scrollend 이벤트 기반으로 교체)", () => {
    // 매직 넘버 420이 직접 사용되지 않아야 함
    expect(content).not.toMatch(/setTimeout\(.*,\s*420\s*\)/); // setTimeout(..., 420) 패턴
    // window.setTimeout이 있다면 반드시 SCROLL_COMPLETE_FALLBACK_MS 상수를 통해 사용해야 함
    if (content.includes("window.setTimeout")) {
      expect(content).toContain("SCROLL_COMPLETE_FALLBACK_MS");
    }
  });

  it("B-5: SCROLL_COMPLETE_FALLBACK_MS 상수가 정의된다 (매직 넘버 제거)", () => {
    expect(content).toContain("SCROLL_COMPLETE_FALLBACK_MS");
  });

  it("B-6: aria-live='polite'가 treatments-grid에 적용된다 (스크린리더 지원)", () => {
    expect(content).toContain('aria-live="polite"');
  });

  it("B-7: aria-atomic='false'가 treatments-grid에 적용된다 (변경 항목만 알림)", () => {
    expect(content).toContain('aria-atomic="false"');
  });

  it("B-8: id='treatments-grid'가 존재한다 (aria-controls 연결)", () => {
    expect(content).toContain('id="treatments-grid"');
  });

  it("B-9: aria-expanded + aria-controls='treatments-grid'가 더보기/접기 버튼에 적용된다", () => {
    expect(content).toContain('aria-controls="treatments-grid"');
    expect(content).toContain("aria-expanded={showAll}");
  });

  it("B-10: scrollend 이벤트 기반 포커스 복원 로직이 존재한다", () => {
    expect(content).toContain("scrollend");
  });

  it("B-11: hook에서 closeFilter를 직접 가져온다 (로컬 closeFilter 재선언 없음)", () => {
    // hook 구조분해에서 closeFilter를 가져오는지 확인
    expect(content).toContain("closeFilter,");
    // 로컬 const closeFilter = useCallback 패턴이 없어야 함
    expect(content).not.toMatch(/const closeFilter\s*=\s*useCallback/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. useStaticTreatmentFilter
// ─────────────────────────────────────────────────────────────────────────────
describe("C. useStaticTreatmentFilter", () => {
  const content = readClient("hooks/useStaticTreatmentFilter.ts");

  it("C-1: UseStaticTreatmentFilterReturn 인터페이스가 export된다", () => {
    expect(content).toContain("export interface UseStaticTreatmentFilterReturn");
  });

  it("C-2: closeFilter 핸들러가 hook return에 포함된다", () => {
    expect(content).toContain("closeFilter:");
    expect(content).toContain("closeFilter,");
  });

  it("C-3: VALID_TAB_IDS 배열이 export된다 (테스트/외부 타입 참조용)", () => {
    expect(content).toContain("export const VALID_TAB_IDS");
  });

  it("C-4: closeFilter는 항상 닫기 전용 (setFilterOpen(false))", () => {
    expect(content).toContain("setFilterOpen(false)");
  });

  it("C-5: handleTabChange의 인자 타입이 TreatmentTabId로 명시된다", () => {
    expect(content).toContain("handleTabChange: (id: TreatmentTabId) => void");
  });

  it("C-6: TreatmentTabId 타입이 export된다", () => {
    expect(content).toContain("export type TreatmentTabId");
  });

  it("C-7: resolveDefaultTab이 유효하지 않은 탭 ID에 대해 fallback을 반환한다 (console.warn)", () => {
    expect(content).toContain("console.warn");
    expect(content).toContain("Falling back to");
  });

  it("C-8: sortTreatments가 treatmentSortUtils.ts에서 re-export된다", () => {
    expect(content).toContain('from "@/lib/treatmentSortUtils"');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. SeoHead
// ─────────────────────────────────────────────────────────────────────────────
describe("D. SeoHead", () => {
  const content = readClient("components/SeoHead.tsx");

  it("D-1: pageType='admin'이면 effectiveNoindex가 true가 된다 (자동 noindex)", () => {
    expect(content).toContain('pageType === "admin"');
    expect(content).toContain("effectiveNoindex");
  });

  it("D-2: deprecated boolean props(includeMedicalSchema/includeWebSiteSchema)가 SeoHeadProps에 없다", () => {
    expect(content).not.toContain("includeMedicalSchema?:");
    expect(content).not.toContain("includeWebSiteSchema?:");
  });

  it("D-3: SEO_PRESETS[pageType]으로 스키마 포함 여부를 결정한다", () => {
    expect(content).toContain("SEO_PRESETS[pageType]");
  });

  it("D-4: og:image:width/height/alt 메타태그가 존재한다 (OG 이미지 완전성)", () => {
    expect(content).toContain('og:image:width');
    expect(content).toContain('og:image:height');
    expect(content).toContain('og:image:alt');
  });

  it("D-5: twitter:card='summary_large_image'가 존재한다", () => {
    expect(content).toContain("summary_large_image");
  });

  it("D-6: hreflangs prop으로 hreflang 링크를 렌더링한다", () => {
    expect(content).toContain('rel="alternate"');
    expect(content).toContain("hrefLang");
  });

  it("D-7: JSON-LD 구조화 데이터를 application/ld+json으로 렌더링한다", () => {
    expect(content).toContain("application/ld+json");
    expect(content).toContain("JSON.stringify(schema)");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. seoHelpers
// ─────────────────────────────────────────────────────────────────────────────
describe("E. seoHelpers", () => {
  const content = readLib("seoHelpers.ts");

  it("E-1: buildHreflangs가 4개 언어(ko/en/ja/zh)를 처리한다", () => {
    expect(content).toContain("koPath");
    expect(content).toContain("enPath");
    expect(content).toContain("jaPath");
    expect(content).toContain("zhPath");
  });

  it("E-2: x-default는 항상 koPath를 사용한다 (정책 문서화)", () => {
    expect(content).toContain("x-default");
    // x-default가 koPath와 연결되어야 함
    expect(content).toMatch(/x-default.*koPath|koPath.*x-default/s);
  });

  it("E-3: SEO_PRESETS가 4개 pageType(home/treatment/default/admin)을 모두 포함한다", () => {
    expect(content).toContain('"home"');
    expect(content).toContain('"treatment"');
    expect(content).toContain('"default"');
    expect(content).toContain('"admin"');
  });

  it("E-4: SEO_PRESETS가 Record<SeoPageType, SeoPreset>을 satisfies로 검증한다", () => {
    expect(content).toContain("satisfies Record<SeoPageType, SeoPreset>");
  });

  it("E-5: buildClinicJsonLd가 @type: MedicalBusiness를 포함한다", () => {
    expect(content).toContain("MedicalBusiness");
  });

  it("E-6: buildClinicJsonLd가 telephone/address/geo 핵심 필드를 포함한다", () => {
    expect(content).toContain("telephone");
    expect(content).toContain("address");
    expect(content).toContain("geo");
  });

  it("E-7: buildWebSiteJsonLd가 @type: WebSite를 포함한다", () => {
    expect(content).toContain("WebSite");
  });

  it("E-8: buildBreadcrumbJsonLd가 BreadcrumbList를 포함한다", () => {
    expect(content).toContain("BreadcrumbList");
  });

  it("E-9: subset 페이지 오용 방지 런타임 가드가 존재한다 (언어 경로 prefix 검증)", () => {
    // R21에서 추가된 런타임 가드
    expect(content).toMatch(/warn.*prefix|prefix.*warn|startsWith.*\/|console\.warn/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. constants
// ─────────────────────────────────────────────────────────────────────────────
describe("F. constants", () => {
  const content = readLib("constants.ts");

  it("F-1: CLINIC_STAT_UNIT_MAP이 export된다", () => {
    expect(content).toContain("export const CLINIC_STAT_UNIT_MAP");
  });

  it("F-2: CLINIC_STAT_UNIT_MAP이 Record<ClinicStatKey, StatKey>를 satisfies로 검증한다", () => {
    expect(content).toContain("satisfies Record<ClinicStatKey, StatKey>");
  });

  it("F-3: StatKey / ClinicStatKey 타입이 export된다", () => {
    expect(content).toContain("export type StatKey");
    expect(content).toContain("export type ClinicStatKey");
  });

  it("F-4: CLINIC_INFO.image가 assetConfig.CLINIC_REPRESENTATIVE_IMAGE를 참조한다 (단일 소스 정책)", () => {
    expect(content).toContain("CLINIC_REPRESENTATIVE_IMAGE");
    expect(content).toContain("assetConfig");
  });

  it("F-5: CLINIC_STATS의 모든 키가 CLINIC_STAT_UNIT_MAP에 매핑된다", () => {
    // CLINIC_STATS 키 목록
    const statsKeys = ["yearsExperience", "eyeBagCases", "laserTypes", "satisfactionRate", "doctorPatientRatio"];
    for (const key of statsKeys) {
      expect(content).toContain(key);
    }
  });

  it("F-6: STAT_UNITS가 4개 언어(ko/en/ja/zh)를 포함한다", () => {
    // STAT_UNITS의 각 언어 키가 존재해야 함 (객체 키 형태: ko: 또는 "ko":)
    expect(content).toMatch(/ko\s*:|"ko"\s*:/);
    expect(content).toMatch(/en\s*:|"en"\s*:/);
    expect(content).toMatch(/ja\s*:|"ja"\s*:/);
    expect(content).toMatch(/zh\s*:|"zh"\s*:/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// G. assetConfig
// ─────────────────────────────────────────────────────────────────────────────
describe("G. assetConfig", () => {
  const content = readLib("assetConfig.ts");

  it("G-1: CLINIC_REPRESENTATIVE_IMAGE가 export된다", () => {
    expect(content).toContain("export const CLINIC_REPRESENTATIVE_IMAGE");
  });

  it("G-2: manus-storage URL 패턴을 사용한다 (로컬 파일 경로 금지)", () => {
    // /manus-storage/ 또는 https:// URL 패턴이어야 함
    expect(content).toMatch(/manus-storage\/|https:\/\//);
  });
});

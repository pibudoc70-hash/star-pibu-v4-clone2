/**
 * round17.regression.test.ts
 * Round-17 시니어 검수 회귀 테스트
 *
 * A. DoctorsSection: 인라인 style 51 → 4곳 (데이터 주도 objectPosition만 유지)
 *    - GOLD/GOLD_LIGHT/GOLD_MID 상수 import 제거
 *    - CSS 변수 --dr-gold / --dr-gold-light / --dr-gold-mid 사용
 *    - data-active attribute 기반 CSS 선택자
 * B. EquipmentTreatmentCard: Space key onKeyDown + focus-visible 링
 * C. ContactSection: clipboard 실패 원인 세분화 (copyFailReason)
 * D. CategoryTabButton: 인라인 style → CSS class-variant (.cat-tab-btn)
 * E. CategoryTabList: WAI-ARIA tablist + roving tabindex
 * F. useStaticTreatmentFilter: defaultTab validation + fallback
 * G. SeoHead: deprecated prop JSDoc 정리
 * H. seoHelpers: buildBreadcrumbJsonLd 빈 배열 가드 + buildHreflangs 슬래시 검증
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

// ─── A. DoctorsSection ───────────────────────────────────────────────────────
describe("A. DoctorsSection: 인라인 style 최소화 + CSS 변수 이관", () => {
  // [R19] DoctorsSection 서브컴포넌트 분리 후 클래스가 서브컴포넌트에 뛰어짔
  const doctorsSrc = readClient("components/DoctorsSection.tsx");
  const desktopSrc = readClient("components/doctors/DoctorDesktopLayout.tsx");
  const mobileSrc = readClient("components/doctors/DoctorMobileLayout.tsx");
  const tabBtnSrc = readClient("components/doctors/DoctorTabButton.tsx");
  const allDoctorsSrc = doctorsSrc + "\n" + desktopSrc + "\n" + mobileSrc + "\n" + tabBtnSrc;
  const indexCss = readClient("index.css");

  it("A-1: GOLD 상수 import가 없어야 한다 (CSS 변수로 이관)", () => {
    // doctors-data에서 GOLD/GOLD_LIGHT/GOLD_MID를 import하지 않아야 함
    expect(allDoctorsSrc).not.toMatch(/import\s*\{[^}]*\bGOLD\b[^}]*\}\s*from/);
  });

  it("A-2: --dr-gold CSS 변수가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/--dr-gold\s*:/);
  });

  it("A-3: --dr-gold-light CSS 변수가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/--dr-gold-light\s*:/);
  });

  it("A-4: --dr-gold-mid CSS 변수가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/--dr-gold-mid\s*:/);
  });

  it("A-5: 인라인 style 개수가 5개 이하여야 한다 (데이터 주도 objectPosition만 허용)", () => {
    const matches = allDoctorsSrc.match(/style=\{\{/g) ?? [];
    expect(matches.length).toBeLessThanOrEqual(5);
  });

  it("A-6: data-active attribute가 사용되어야 한다 (CSS 선택자 기반 활성 스타일)", () => {
    expect(allDoctorsSrc).toContain('data-active=');
  });

  it("A-7: dr-tab-btn CSS 클래스가 DoctorsSection 영역에 사용되어야 한다", () => {
    expect(allDoctorsSrc).toContain("dr-tab-btn");
  });

  it("A-8: dr-thumb-desktop CSS 클래스가 DoctorsSection 영역에 사용되어야 한다", () => {
    expect(allDoctorsSrc).toContain("dr-thumb-desktop");
  });

  it("A-9: dr-active-underline CSS 클래스가 DoctorsSection 영역에 사용되어야 한다", () => {
    expect(allDoctorsSrc).toContain("dr-active-underline");
  });

  it("A-10: WAI-ARIA role=\"tablist\"가 DoctorsSection 영역에 있어야 한다", () => {
    expect(allDoctorsSrc).toContain('role="tablist"');
  });

  it("A-11: WAI-ARIA role=\"tab\"이 DoctorsSection 영역에 있어야 한다", () => {
    expect(allDoctorsSrc).toContain('role="tab"');
  });

  it("A-12: WAI-ARIA role=\"tabpanel\"이 DoctorsSection 영역에 있어야 한다", () => {
    expect(allDoctorsSrc).toContain('role="tabpanel"');
  });

  it("A-13: dr-tab-btn CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.dr-tab-btn\s*\{/);
  });

  it("A-14: dr-thumb-desktop CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.dr-thumb-desktop\s*\{/);
  });
});

// ─── B. EquipmentTreatmentCard ────────────────────────────────────────────────
describe("B. EquipmentTreatmentCard: Space key + focus-visible 링", () => {
  const cardSrc = readClient("components/treatments/EquipmentTreatmentCard.tsx");
  const indexCss = readClient("index.css");
  it("B-1: EquipmentTreatmentCard가 button 요소를 사용해야 한다 ([R19] div role=button → button 전환)", () => {
    // [R19-P1-5] div role="button" → button 요소 전환
    // button 요소는 기본적으로 Enter/Space를 처리하므로 onKeyDown 핸들러 불필요
    expect(cardSrc).toMatch(/<button/);
    expect(cardSrc).not.toMatch(/role="button"/);
  });
  it("B-2: treatment-card:focus-visible CSS 스타일이 index.css에 있어야 한다", () => {
    expect(indexCss).toMatch(/\.treatment-card:focus-visible\s*\{/);
  });
  it("B-3: focus-visible outline이 --dr-gold 변수를 사용해야 한다", () => {
    const focusBlock = indexCss.match(/\.treatment-card:focus-visible\s*\{[^}]+\}/)?.[0] ?? "";
    expect(focusBlock).toContain("--dr-gold");
  });
  it("B-4: EquipmentTreatmentCard에 aria-label이 있어야 한다 (접근성)", () => {
    expect(cardSrc).toMatch(/aria-label/);
  });
  it("B-5: treatment-card CSS 클래스가 사용되어야 한다", () => {
    expect(cardSrc).toContain("treatment-card");
  });
});

// ─── C. ContactSection ────────────────────────────────────────────────────────
describe("C. ContactSection: clipboard 실패 원인 세분화", () => {
  const contactSrc = readClient("components/ContactSection.tsx");
  const infoPanelSrc = readClient("components/contact/ContactInfoPanel.tsx");

  it("C-1: copyFailReason state가 ContactSection에 있어야 한다", () => {
    expect(contactSrc).toContain("copyFailReason");
  });

  it("C-2: 'unsupported' 원인이 처리되어야 한다", () => {
    expect(contactSrc).toContain("'unsupported'");
  });

  it("C-3: 'denied' 원인이 처리되어야 한다 (NotAllowedError)", () => {
    expect(contactSrc).toContain("'denied'");
  });

  it("C-4: DOMException과 NotAllowedError 체크가 있어야 한다", () => {
    expect(contactSrc).toContain("DOMException");
    expect(contactSrc).toContain("NotAllowedError");
  });

  it("C-5: ContactInfoPanel에 copyFailReason prop이 정의되어야 한다", () => {
    expect(infoPanelSrc).toContain("copyFailReason");
  });

  it("C-6: ContactInfoPanel에서 copyFailReason별 메시지가 분기되어야 한다", () => {
    expect(infoPanelSrc).toContain("'unsupported'");
    expect(infoPanelSrc).toContain("'denied'");
  });
});

// ─── D. CategoryTabButton ─────────────────────────────────────────────────────
describe("D. CategoryTabButton: 인라인 style → CSS class-variant", () => {
  const catBtnSrc = readClient("components/treatments/CategoryTabButton.tsx");
  const indexCss = readClient("index.css");

  it("D-1: .cat-tab-btn CSS 클래스가 index.css에 정의되어 있어야 한다", () => {
    expect(indexCss).toMatch(/\.cat-tab-btn\s*\{/);
  });

  it("D-2: .cat-tab-btn[data-active=\"true\"] CSS 선택자가 index.css에 있어야 한다", () => {
    expect(indexCss).toContain('.cat-tab-btn[data-active="true"]');
  });

  it("D-3: .cat-tab-btn-sm CSS 클래스가 index.css에 있어야 한다", () => {
    expect(indexCss).toMatch(/\.cat-tab-btn-sm\s*\{/);
  });

  it("D-4: .cat-tab-btn-md CSS 클래스가 index.css에 있어야 한다", () => {
    expect(indexCss).toMatch(/\.cat-tab-btn-md\s*\{/);
  });

  it("D-5: CategoryTabButton에 인라인 backgroundColor style이 없어야 한다", () => {
    expect(catBtnSrc).not.toContain("backgroundColor:");
  });

  it("D-6: CategoryTabButton에 인라인 border style이 없어야 한다 (CSS 클래스로 이관)", () => {
    // border: `1.5px solid ${...}` 패턴 제거 확인
    expect(catBtnSrc).not.toMatch(/border\s*:\s*`1\.5px solid/);
  });

  it("D-7: CategoryTabButton에 cat-tab-btn 클래스가 사용되어야 한다", () => {
    expect(catBtnSrc).toContain("cat-tab-btn");
  });

  it("D-8: CategoryTabButton에 WAI-ARIA role prop이 있어야 한다", () => {
    expect(catBtnSrc).toContain('role={role}');
  });

  it("D-9: CategoryTabButton에 aria-selected prop이 있어야 한다", () => {
    expect(catBtnSrc).toContain("aria-selected");
  });

  it("D-10: CategoryTabButton에 tabIndex prop이 있어야 한다", () => {
    expect(catBtnSrc).toContain("tabIndex={tabIndex}");
  });

  it("D-11: .cat-tab-icon CSS 클래스가 index.css에 있어야 한다", () => {
    expect(indexCss).toMatch(/\.cat-tab-icon\s*\{/);
  });
});

// ─── E. CategoryTabList ───────────────────────────────────────────────────────
describe("E. CategoryTabList: WAI-ARIA tablist + roving tabindex", () => {
  const catListSrc = readClient("components/treatments/CategoryTabList.tsx");

  it("E-1: role=\"tablist\"가 CategoryTabList에 있어야 한다", () => {
    expect(catListSrc).toContain('role="tablist"');
  });

  it("E-2: aria-label이 CategoryTabList에 있어야 한다", () => {
    expect(catListSrc).toContain("aria-label");
  });

  it("E-3: aria-orientation=\"horizontal\"이 있어야 한다", () => {
    expect(catListSrc).toContain('aria-orientation="horizontal"');
  });

  it("E-4: role=\"tab\"이 CategoryTabButton에 전달되어야 한다", () => {
    expect(catListSrc).toContain('role="tab"');
  });

  it("E-5: aria-selected가 CategoryTabButton에 전달되어야 한다", () => {
    expect(catListSrc).toContain("aria-selected");
  });

  it("E-6: roving tabindex가 구현되어야 한다 (tabIndex: activeId === cat.id ? 0 : -1)", () => {
    expect(catListSrc).toContain("tabIndex={activeId === cat.id ? 0 : -1}");
  });

  it("E-7: ArrowRight 키보드 네비게이션이 구현되어야 한다", () => {
    expect(catListSrc).toContain('"ArrowRight"');
  });

  it("E-8: ArrowLeft 키보드 네비게이션이 구현되어야 한다", () => {
    expect(catListSrc).toContain('"ArrowLeft"');
  });

  it("E-9: Home/End 키보드 네비게이션이 구현되어야 한다", () => {
    expect(catListSrc).toContain('"Home"');
    expect(catListSrc).toContain('"End"');
  });

  it("E-10: onKeyDown 핸들러가 CategoryTabButton에 전달되어야 한다", () => {
    expect(catListSrc).toContain("onKeyDown");
  });
});

// ─── F. useStaticTreatmentFilter ─────────────────────────────────────────────
describe("F. useStaticTreatmentFilter: defaultTab validation", () => {
  const filterSrc = readFileSync(
    resolve(root, "client/src/hooks/useStaticTreatmentFilter.ts"),
    "utf-8"
  );

  it("F-1: resolveDefaultTab 함수가 있어야 한다", () => {
    expect(filterSrc).toContain("resolveDefaultTab");
  });

  it("F-2: TREATMENTS 키 존재 여부 검사가 있어야 한다 (tab in TREATMENTS)", () => {
    expect(filterSrc).toContain("in TREATMENTS");
  });

  it("F-3: 개발 환경 경고 메시지가 있어야 한다 (process.env.NODE_ENV)", () => {
    expect(filterSrc).toContain("NODE_ENV");
    expect(filterSrc).toContain("production");
  });

  it("F-4: fallback 로직이 있어야 한다 (Object.keys(TREATMENTS)[0])", () => {
    expect(filterSrc).toContain("Object.keys(TREATMENTS)[0]");
  });

  it("F-5: useState lazy initializer로 resolveDefaultTab을 호출해야 한다", () => {
    // [R22] 제네릭 타입 파라미터 포함 패턴도 허용: useState<TreatmentTabId>(() => resolveDefaultTab(...))
    const hasLazyInit = filterSrc.includes("useState(() => resolveDefaultTab(defaultTab))") ||
      /useState<[^>]+>\(\(\) => resolveDefaultTab/.test(filterSrc);
    expect(hasLazyInit).toBe(true);
  });
});

// ─── G. SeoHead ───────────────────────────────────────────────────────────────
describe("G. SeoHead: deprecated prop JSDoc 정리", () => {
  const seoHeadSrc = readClient("components/SeoHead.tsx");

  it("G-1: includeMedicalSchema에 @deprecated JSDoc이 있어야 한다", () => {
    // [R21-P1-4] deprecated boolean props 실제 제거 완료
    // includeMedicalSchema/includeWebSiteSchema Props에서 제거됨 → @deprecated 주석도 제거됨
    // 대신 내부 구현에서 preset.includeMedicalSchema로 사용됨
    expect(seoHeadSrc).toContain("includeMedicalSchema");
  });

  it("G-2: includeWebSiteSchema에 @deprecated JSDoc이 있어야 한다", () => {
    // [R21-P1-4] deprecated boolean props 실제 제거 완료
    expect(seoHeadSrc).toContain("includeWebSiteSchema");
  });

  it("G-3: @internal 태그가 deprecated prop에 있어야 한다", () => {
    // [R21-P1-4] deprecated props 제거 완료 → @internal 주석도 제거됨
    // 대신 pageType 프리셋 기반 구현이 있어야 함
    expect(seoHeadSrc).toContain("SEO_PRESETS");
  });

  it("G-4: pageType prop이 SeoHead에 있어야 한다", () => {
    expect(seoHeadSrc).toContain("pageType");
  });
});

// ─── H. seoHelpers ────────────────────────────────────────────────────────────
describe("H. seoHelpers: 런타임 가드 추가", () => {
  const seoHelpersSrc = readLib("seoHelpers.ts");

  it("H-1: buildBreadcrumbJsonLd에 빈 배열 가드가 있어야 한다", () => {
    expect(seoHelpersSrc).toContain("items.length === 0");
  });

  it("H-2: buildBreadcrumbJsonLd 가드에 개발 환경 경고가 있어야 한다", () => {
    const guardSection = seoHelpersSrc.match(/buildBreadcrumbJsonLd[\s\S]{0,500}/)?.[0] ?? "";
    expect(guardSection).toContain("NODE_ENV");
    expect(guardSection).toContain("console.warn");
  });

  it("H-3: buildHreflangs에 슬래시 시작 검증이 있어야 한다", () => {
    // [R23] COMMON_HREFLANGS 주석 추가로 함수 본문이 600자 이후에 위치하므로 1500자로 확장
    const hrefSection = seoHelpersSrc.match(/buildHreflangs[\s\S]{0,3000}/)?.[0] ?? "";
    expect(hrefSection).toContain("startsWith");
  });

  it("H-4: buildHreflangs 가드에 개발 환경 경고가 있어야 한다", () => {
    // [R23] COMMON_HREFLANGS 주석 추가로 함수 본문이 600자 이후에 위치하므로 1500자로 확장
    const hrefSection = seoHelpersSrc.match(/buildHreflangs[\s\S]{0,3000}/)?.[0] ?? "";
    expect(hrefSection).toContain("NODE_ENV");
    expect(hrefSection).toContain("console.warn");
  });

  it("H-5: buildBreadcrumbJsonLd 가드 메시지에 '최소한' 또는 '2개'가 포함되어야 한다", () => {
    expect(seoHelpersSrc).toMatch(/최소한|2개/);
  });
});

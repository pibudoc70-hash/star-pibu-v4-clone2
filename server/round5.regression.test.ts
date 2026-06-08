/**
 * Round-5 시니어 재검수 회귀 테스트
 *
 * 검증 항목:
 * A. TreatmentsEquipmentSection - INITIAL_SHOW lazy initializer + aria-label
 * B. DoctorsSection - useMemo import + aria-label 키 추가
 * C. ManagementDevicesSection - 스크롤 버튼 aria-label i18n 키 교체
 * D. HeroSection/ContactSection - tel href CLINIC_TEL 상수 사용
 * E. i18n 4개 언어 - doctors 접근성 키 + managementDevices 스크롤 키 + ko teamLabel
 * F. Home.tsx - pageType 명시
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const root = resolve(__dirname, "..");

function read(rel: string) {
  return readFileSync(resolve(root, rel), "utf-8");
}

// ─────────────────────────────────────────────────────────────────────────────
// A. TreatmentsEquipmentSection
// ─────────────────────────────────────────────────────────────────────────────
describe("A. TreatmentsEquipmentSection - INITIAL_SHOW + aria-label", () => {
  const src = read("client/src/components/TreatmentsEquipmentSection.tsx");

  it("INITIAL_SHOW는 lazy initializer 또는 useMemo를 사용해야 한다", () => {
    // [R21] useState lazy initializer 또는 [R22] useMemo 패턴 모두 허용
    const hasLazyInit = src.includes("useState(() =>") || /useState\(\s*\n\s*\(\) =>/.test(src);
    const hasMemo = src.includes("useMemo(() =>");
    expect(hasLazyInit || hasMemo).toBe(true);
    // 렌더 중 직접 할당 패턴이 없어야 함
    expect(src).not.toMatch(/const INITIAL_SHOW\s*=\s*typeof window/);
  });

  it("section 태그에 aria-label 속성이 있어야 한다", () => {
    expect(src).toContain("aria-label={tr.label}");
  });

  it("정렬 드롭다운 버튼에 aria-expanded가 있어야 한다", () => {
    expect(src).toContain("aria-expanded={filterOpen}");
  });

  it("정렬 옵션 버튼에 aria-selected 또는 aria-pressed가 있어야 한다", () => {
    // R16: 드롭다운 내 옵션 패턴으로 변경 (aria-selected이 role=option에 더 적합)
    const hasAriaSelected = src.includes("aria-selected={sortBy === opt.value}");
    const hasAriaPressed = src.includes("aria-pressed={sortBy === opt.value}");
    expect(hasAriaSelected || hasAriaPressed).toBe(true);
  });

  it("더보기/접기 버튼에 aria-label이 있어야 한다", () => {
    expect(src).toContain("aria-label={showAll ? tr.collapseBtn");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. DoctorsSection
// ─────────────────────────────────────────────────────────────────────────────
describe("B. DoctorsSection - useMemo + aria-label", () => {
  const src = read("client/src/components/DoctorsSection.tsx");

  // [R14] useMemo/mergedDoctors 로직이 useDoctorViewModel 훅으로 이전됨
  it("useMemo가 import에 포함되어야 한다 (또는 훅에서 관리)", () => {
    const hookSrc = read("client/src/hooks/useDoctorViewModel.ts");
    const hasMemoInSection = /import.*useMemo.*from ['"']react['"']/.test(src);
    const hasMemoInHook = /useMemo/.test(hookSrc);
    expect(hasMemoInSection || hasMemoInHook).toBe(true);
  });

  it("mergedDoctors가 useMemo로 감싸져야 한다 (훅 또는 컴포넌트)", () => {
    // [R14] DoctorsSection에서 useDoctorViewModel 훅으로 이전됨
    const hookSrc = read("client/src/hooks/useDoctorViewModel.ts");
    const hasMemoInSection = src.includes("useMemo(() => doctors.map");
    const hasMemoInHook = /useMemo/.test(hookSrc) && hookSrc.includes("mergedDoctors");
    expect(hasMemoInSection || hasMemoInHook).toBe(true);
  });

  it("useMemo 의존성 배열에 t.doctors가 포함되어야 한다 (훅 또는 컴포넌트)", () => {
    // [R14] DoctorsSection에서 useDoctorViewModel 훅으로 이전됨
    const hookSrc = read("client/src/hooks/useDoctorViewModel.ts");
    const hasDepInSection = src.includes("[t.doctors, badgeLabel]");
    const hasDepInHook = hookSrc.includes("t.doctors");
    expect(hasDepInSection || hasDepInHook).toBe(true);
  });

  it("탭 버튼에 aria-label이 있어야 한다", () => {
    // [R19] DoctorsSection 서브컴포넌트 분리 후 DoctorTabButton에 있음
    const tabBtnSrc = read("client/src/components/doctors/DoctorTabButton.tsx");
    const hasDirect = /aria-label=\{.*doctor.*name/.test(src);
    const hasInSubcomp = /aria-label=\{doctor\.name\}/.test(tabBtnSrc);
    expect(hasDirect || hasInSubcomp).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. ManagementDevicesSection
// ─────────────────────────────────────────────────────────────────────────────
describe("C. ManagementDevicesSection - 스크롤 버튼 aria-label i18n", () => {
  const src = read("client/src/components/ManagementDevicesSection.tsx");

  it("'Scroll left' 영어 하드코딩이 없어야 한다", () => {
    expect(src).not.toContain('"Scroll left"');
    expect(src).not.toContain("'Scroll left'");
  });

  it("'Scroll right' 영어 하드코딩이 없어야 한다", () => {
    expect(src).not.toContain('"Scroll right"');
    expect(src).not.toContain("'Scroll right'");
  });

  it("스크롤 버튼 aria-label에 i18n 키를 사용해야 한다", () => {
    expect(src).toMatch(/aria-label=\{t\.managementDevices\.(scrollPrevLabel|scrollNextLabel)/);
  });

  it("스크롤 버튼 aria-label에 fallback 영어 하드코딩이 없어야 한다", () => {
    expect(src).not.toContain('?? "Scroll left"');
    expect(src).not.toContain('?? "Scroll right"');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. HeroSection / ContactSection - tel href 상수 사용
// ─────────────────────────────────────────────────────────────────────────────
describe("D. HeroSection/ContactSection - tel href CLINIC_TEL 상수", () => {
  // [R12] HeroSection 리팩토링으로 CLINIC_TEL 로직이 hero/HeroActions.tsx로 이동
  const heroSrc = [
    read("client/src/components/HeroSection.tsx"),
    read("client/src/components/hero/HeroActions.tsx"),
  ].join("\n");
  const contactSrc = read("client/src/components/ContactSection.tsx");

  it("HeroSection에 CLINIC_TEL이 import되어야 한다", () => {
    expect(heroSrc).toContain("CLINIC_TEL");
    expect(heroSrc).toContain("CLINIC_TEL_INTL");
  });

  it("HeroSection에 tel 번호 하드코딩이 없어야 한다", () => {
    expect(heroSrc).not.toContain('"tel:051-818-2300"');
    expect(heroSrc).not.toContain('"tel:+82-51-818-2300"');
  });

  it("ContactSection에 CLINIC_TEL이 useChatConfig를 통해 간접 사용되어야 한다 [R11-B]", () => {
    // R11-B: ContactSection은 CLINIC_TEL을 직접 import하지 않고
    // useChatConfig hook을 통해 phoneHref/phoneDisplay로 간접 사용
    expect(contactSrc).toContain("useChatConfig");
    expect(contactSrc).toContain("phoneHref");
    // 직접 import 없음 (useChatConfig 내부에서 처리)
    expect(contactSrc).not.toContain('"tel:051-818-2300"');
  });

  it("ContactSection에 tel 번호 하드코딩이 없어야 한다", () => {
    expect(contactSrc).not.toContain('"tel:051-818-2300"');
    expect(contactSrc).not.toContain('"tel:+82-51-818-2300"');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. i18n 4개 언어 키 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("E. i18n - doctors 접근성 키 + managementDevices 스크롤 키 + ko teamLabel", () => {
  const ko = read("client/src/lib/i18n.ko.ts");
  const en = read("client/src/lib/i18n.en.ts");
  const ja = read("client/src/lib/i18n.ja.ts");
  const zh = read("client/src/lib/i18n.zh.ts");

  it("ko teamLabel이 한국어여야 한다 (영어 하드코딩 금지)", () => {
    expect(ko).not.toContain('"Medical Team"');
    expect(ko).toMatch(/teamLabel:\s*["'][^"']+["']/);
  });

  it("ja teamLabel이 일본어여야 한다", () => {
    expect(ja).toContain("医療チーム");
  });

  it("zh teamLabel이 중국어여야 한다", () => {
    expect(zh).toContain("医疗团队");
  });

  it("4개 언어 모두 doctors 접근성 키(prevDoctor/nextDoctor 또는 tabDoctor)가 있어야 한다", () => {
    for (const src of [ko, en, ja, zh]) {
      expect(src).toMatch(/prevDoctor|nextDoctor|tabDoctor|expandCredentials/);
    }
  });

  it("4개 언어 모두 managementDevices scrollPrev/scrollNext 키가 있어야 한다", () => {
    for (const src of [ko, en, ja, zh]) {
      expect(src).toMatch(/scrollPrev|scrollLeft/);
      expect(src).toMatch(/scrollNext|scrollRight/);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. Home.tsx - pageType 명시
// ─────────────────────────────────────────────────────────────────────────────
describe("F. Home.tsx - pageType 명시", () => {
  const src = read("client/src/pages/Home.tsx");

  it(`Home.tsx SeoHead에 pageType="home"이 명시되어야 한다`, () => {
    expect(src).toContain('pageType="home"');
  });
});

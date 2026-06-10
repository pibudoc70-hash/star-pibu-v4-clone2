/**
 * senior-review.regression.test.ts
 *
 * 시니어 리뷰 라운드 수정 사항 회귀 방지 테스트
 *
 * 검사 대상:
 *   1. HeroSection.tsx — t.nav.contact 역참조 버그 수정 (scrollLabel i18n 키 사용)
 *   2. DoctorsSection.tsx — lang === "ko" specialties 분기 제거 (i18n 키 사용)
 *   3. i18n.ts 분리 구조 검증 (6개 파일로 분리)
 *   4. SeoHead.tsx — includeClinicSchema deprecated prop 제거
 *   5. HeroSection 서브 컴포넌트 분리 (GoldParticles, HeroAnimations)
 *   6. i18n 4개 언어 scrollLabel / specialties 키 존재 검증
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const heroSource = readFileSync(
  path.resolve(root, "client/src/components/HeroSection.tsx"),
  "utf8",
);
// [R19] DoctorsSection 서브컴포넌트 분리 후 통합 소스로 검사
const doctorsSource = [
  "client/src/components/DoctorsSection.tsx",
  "client/src/components/doctors/DoctorDesktopLayout.tsx",
  "client/src/components/doctors/DoctorMobileLayout.tsx",
  "client/src/components/doctors/DoctorTabButton.tsx",
  "client/src/components/doctors/DoctorCredentials.tsx",
].map((f) => readFileSync(path.resolve(root, f), "utf8")).join("\n");
const seoHeadSource = readFileSync(
  path.resolve(root, "client/src/components/SeoHead.tsx"),
  "utf8",
);
const i18nTypes = readFileSync(
  path.resolve(root, "client/src/lib/i18n.types.ts"),
  "utf8",
);
const koI18n = readFileSync(path.resolve(root, "client/src/lib/i18n.ko.ts"), "utf8");
const enI18n = readFileSync(path.resolve(root, "client/src/lib/i18n.en.ts"), "utf8");
const jaI18n = readFileSync(path.resolve(root, "client/src/lib/i18n.ja.ts"), "utf8");
const zhI18n = readFileSync(path.resolve(root, "client/src/lib/i18n.zh.ts"), "utf8");

// ─────────────────────────────────────────────────────────────────────────────
// 1. HeroSection.tsx — scrollLabel i18n 키 사용 (역참조 버그 수정)
// ─────────────────────────────────────────────────────────────────────────────
describe("HeroSection.tsx — scrollLabel 역참조 버그 수정 회귀 방지", () => {
  it("HeroSection에서 t.nav.contact 역참조로 언어를 판단하는 패턴이 없어야 한다", () => {
    // t.nav.contact === "アクセス" ? "下へ" : ... 형태의 역참조 버그 방지
    expect(heroSource).not.toMatch(/t\.nav\.contact\s*===\s*["'][^"']+["']\s*\?/);
  });

  it("HeroSection에서 스크롤 레이블에 t.hero.scrollLabel i18n 키를 사용해야 한다", () => {
    // t.hero.scrollLabel 또는 t.hero?.scrollLabel 패턴
    expect(heroSource).toMatch(/t\.hero\.scrollLabel/);
  });

  it("i18n.types.ts hero 타입에 scrollLabel 키가 정의되어야 한다", () => {
    expect(i18nTypes).toMatch(/scrollLabel\??:/);
  });

  it("ko/en/ja/zh 모두 hero.scrollLabel 값이 있어야 한다", async () => {
    const { i18n } = await import("../../../client/src/lib/i18n");
    expect(i18n.ko.hero.scrollLabel).toBeTruthy();
    expect(i18n.en.hero.scrollLabel).toBeTruthy();
    expect(i18n.ja.hero.scrollLabel).toBeTruthy();
    expect(i18n.zh.hero.scrollLabel).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. DoctorsSection.tsx — lang === "ko" specialties 분기 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("DoctorsSection.tsx — lang === 'ko' specialties 분기 제거 회귀 방지", () => {
  it("DoctorsSection에서 lang === 'ko' 조건으로 specialties를 분기하는 패턴이 없어야 한다", () => {
    // lang === "ko" ? d.specialties : t.treatments.categories[...] 형태 방지
    expect(doctorsSource).not.toMatch(/lang\s*===\s*["']ko["']\s*\?\s*\S*specialties/);
    expect(doctorsSource).not.toMatch(/lang\s*===\s*["']ko["']\s*\?\s*d\.specialties/);
  });

  it("DoctorsSection에서 specialties를 i18n 키 또는 fallback 패턴으로 가져와야 한다", () => {
    // t.doctors.list[idx].specialties 또는 doctorI18n.specialties 패턴
    expect(doctorsSource).toMatch(/specialties/);
    // lang 변수가 specialties 분기에 사용되지 않아야 함
    const specialtiesBlock = doctorsSource.match(/specialties[\s\S]{0,200}/)?.[0] ?? "";
    expect(specialtiesBlock).not.toMatch(/lang\s*===\s*["']ko["']/);
  });

  it("i18n.types.ts doctors.list 타입에 specialties 키가 정의되어야 한다", () => {
    expect(i18nTypes).toMatch(/specialties\??:/);
  });

  it("en/ja/zh i18n 파일에 doctors.list specialties 배열이 있어야 한다", () => {
    expect(enI18n).toMatch(/specialties:\s*\[/);
    expect(jaI18n).toMatch(/specialties:\s*\[/);
    expect(zhI18n).toMatch(/specialties:\s*\[/);
  });

  it("en/ja/zh i18n에 doctors.list[0].specialties 값이 있어야 한다", async () => {
    // ko는 DoctorsSection.tsx 내 d.specialties 하드코딩 fallback 허용
    // en/ja/zh는 i18n 파일에 specialties 배열이 있어야 함
    const { i18n } = await import("../../../client/src/lib/i18n");
    expect(i18n.en.doctors.list[0].specialties?.length).toBeGreaterThan(0);
    expect(i18n.ja.doctors.list[0].specialties?.length).toBeGreaterThan(0);
    expect(i18n.zh.doctors.list[0].specialties?.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. i18n.ts 분리 구조 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("i18n.ts 분리 구조 검증 (STRUCT-I18N-1)", () => {
  it("i18n.types.ts 파일이 존재해야 한다", () => {
    expect(existsSync(path.resolve(root, "client/src/lib/i18n.types.ts"))).toBe(true);
  });

  it("i18n.ko.ts 파일이 존재해야 한다", () => {
    expect(existsSync(path.resolve(root, "client/src/lib/i18n.ko.ts"))).toBe(true);
  });

  it("i18n.en.ts 파일이 존재해야 한다", () => {
    expect(existsSync(path.resolve(root, "client/src/lib/i18n.en.ts"))).toBe(true);
  });

  it("i18n.ja.ts 파일이 존재해야 한다", () => {
    expect(existsSync(path.resolve(root, "client/src/lib/i18n.ja.ts"))).toBe(true);
  });

  it("i18n.zh.ts 파일이 존재해야 한다", () => {
    expect(existsSync(path.resolve(root, "client/src/lib/i18n.zh.ts"))).toBe(true);
  });

  it("i18n.ts 조립 파일은 언어별 파일을 import해야 한다", () => {
    const i18nSlim = readFileSync(path.resolve(root, "client/src/lib/i18n.ts"), "utf8");
    expect(i18nSlim).toContain("i18n.ko");
    expect(i18nSlim).toContain("i18n.en");
    expect(i18nSlim).toContain("i18n.ja");
    expect(i18nSlim).toContain("i18n.zh");
  });

  it("i18n.ts 조립 파일은 200줄 이하여야 한다 (슬림 파일 유지)", () => {
    const i18nSlim = readFileSync(path.resolve(root, "client/src/lib/i18n.ts"), "utf8");
    const lineCount = i18nSlim.split("\n").length;
    expect(lineCount).toBeLessThanOrEqual(200);
  });

  it("i18n 런타임 import가 정상 동작해야 한다 (ko/en/ja/zh 모두 로드)", async () => {
    const { i18n } = await import("../../../client/src/lib/i18n");
    expect(i18n.ko).toBeDefined();
    expect(i18n.en).toBeDefined();
    expect(i18n.ja).toBeDefined();
    expect(i18n.zh).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. SeoHead.tsx — includeClinicSchema deprecated prop 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("SeoHead.tsx — deprecated prop 제거 + seoHelpers 분리 검증", () => {
  it("SeoHead.tsx에서 includeClinicSchema deprecated prop이 없어야 한다", () => {
    // deprecated prop이 완전히 제거되었는지 확인
    expect(seoHeadSource).not.toMatch(/includeClinicSchema/);
  });

  it("seoHelpers.ts 파일이 존재해야 한다", () => {
    expect(existsSync(path.resolve(root, "client/src/lib/seoHelpers.ts"))).toBe(true);
  });

  it("SeoHead.tsx는 300줄 이하여야 한다 (슬림화 유지)", () => {
    const lineCount = seoHeadSource.split("\n").length;
    expect(lineCount).toBeLessThanOrEqual(300);
  });

  it("SeoHead.tsx는 seoHelpers.ts를 import해야 한다", () => {
    expect(seoHeadSource).toMatch(/seoHelpers/);
  });

  it("seoHelpers.ts에 buildClinicJsonLd 함수가 있어야 한다", () => {
    const seoHelpers = readFileSync(path.resolve(root, "client/src/lib/seoHelpers.ts"), "utf8");
    expect(seoHelpers).toContain("buildClinicJsonLd");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. HeroSection 서브 컴포넌트 분리 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("HeroSection 서브 컴포넌트 분리 검증 (STRUCT-HERO-1)", () => {
  it("hero/GoldParticles.tsx 파일이 존재해야 한다", () => {
    expect(existsSync(path.resolve(root, "client/src/components/hero/GoldParticles.tsx"))).toBe(true);
  });

  it("hero/HeroAnimations.tsx 파일이 존재해야 한다", () => {
    expect(existsSync(path.resolve(root, "client/src/components/hero/HeroAnimations.tsx"))).toBe(true);
  });

  it("HeroSection.tsx는 GoldParticles 또는 HeroBackgroundLayers를 hero/ 서브 디렉토리에서 import해야 한다 ([R18] HeroBackgroundLayers로 추상화)", () => {
    // [R18-P0-2] GoldParticles는 HeroBackgroundLayers 내부로 이동됨
    const hasGoldParticles = /from\s+["'].*hero\/GoldParticles["']/.test(heroSource);
    const hasBackgroundLayers = /from\s+["'].*hero\/HeroBackgroundLayers["']/.test(heroSource);
    expect(hasGoldParticles || hasBackgroundLayers).toBe(true);
  });

  it("HeroSection.tsx는 CharReveal/WordReveal을 hero/ 서브 디렉토리에서 import해야 한다", () => {
    expect(heroSource).toMatch(/from\s+["'].*hero\/HeroAnimations["']/);
  });

  it("HeroSection.tsx는 900줄 이하여야 한다 (슬림화 유지)", () => {
    const lineCount = heroSource.split("\n").length;
    expect(lineCount).toBeLessThanOrEqual(900);
  });
});

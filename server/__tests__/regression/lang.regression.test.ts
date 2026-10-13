/**
 * lang.regression.test.ts
 *
 * 언어 전환 회귀 방지 테스트 (정적 소스 검사 방식)
 *
 * 보호 대상:
 *   1. buildLocalizedPath — window.location.pathname 기반 경로 계산
 *   2. handleLangChange — setLang(persist=true) 선행 호출 + SPA 전환 사용
 *   3. 모바일 언어 버튼 — 동일한 setLang + SPA 전환 패턴
 *   4. /foreign-guide → ko 선택 시 "/" 복귀 정책
 *   5. Footer quickLinks 순서 — Header primaryNav 순서와 일치
 *
 * 재현 경로 (수정 전 버그):
 *   1. /en 또는 /ja 또는 /zh 페이지 방문
 *   2. 헤더 언어 드롭다운에서 "한국어" 선택
 *   3. buildLocalizedPath가 wouter location(stale) 기반으로 경로 계산
 *      → window.location.pathname과 불일치 → 잘못된 경로로 이동
 *   4. LangContext setLang 미호출 → localStorage 여전히 외국어 → 다음 방문 시 외국어 유지
 *
 * 수정 후 동작:
 *   - buildLocalizedPath: window.location.pathname 직접 참조 (stale 없음)
 *   - handleLangChange: setLang(lang, true) 먼저 호출 → localStorage 즉시 갱신
 *   - wouter setLocation 사용 → 장비 상세 캐시를 유지해 중간 로딩 화면 방지
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const headerSource = readFileSync(
  path.resolve(root, "client/src/components/Header.tsx"),
  "utf8",
);
// 구조 분해 후 로직(buildLocalizedPath, handleLangChange 등)은 useHeaderState.ts에 위치
const hookSource = readFileSync(
  path.resolve(root, "client/src/hooks/useHeaderState.ts"),
  "utf8",
);
// 모바일 메뉴는 MobileMenu.tsx로 분리됨
const mobileMenuSource = readFileSync(
  path.resolve(root, "client/src/components/header/MobileMenu.tsx"),
  "utf8",
);
const mobileLanguageSwitcherSource = readFileSync(
  path.resolve(root, "client/src/components/header/MobileLanguageSwitcher.tsx"),
  "utf8",
);
// 두 파일을 합쳐서 검사 (어느 파일에 있든 패턴이 존재하면 통과)
const combinedSource = headerSource + "\n" + hookSource + "\n" + mobileMenuSource + "\n" + mobileLanguageSwitcherSource;

const footerSource = readFileSync(
  path.resolve(root, "client/src/components/Footer.tsx"),
  "utf8",
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. buildLocalizedPath — window.location.pathname 기반 경로 계산
// ─────────────────────────────────────────────────────────────────────────────
describe("buildLocalizedPath — window.location.pathname 기반 경로 계산", () => {
  it("buildLocalizedPath 내부에서 window.location.pathname을 사용해야 한다", () => {
    // 구조 분해 후 useHeaderState.ts에 위치 — combinedSource로 검사
    const fnBlock = combinedSource.match(
      /const buildLocalizedPath[\s\S]*?^ {2}};/m,
    )?.[0] ?? combinedSource.match(
      /const buildLocalizedPath[\s\S]*?\n};/,
    )?.[0] ?? "";
    expect(fnBlock).toMatch(/window\.location\.pathname/);
  });

  it("buildLocalizedPath 내부에서 wouter location 변수를 직접 사용하지 않아야 한다", () => {
    // 구조 분해 후 useHeaderState.ts에 위치
    const fnBlock = hookSource.match(
      /const buildLocalizedPath = \(targetLang[\s\S]*?\n {2}};/,
    )?.[0] ?? hookSource.match(
      /const buildLocalizedPath = \(targetLang[\s\S]*?\n};/,
    )?.[0] ?? "";
    expect(fnBlock).toMatch(/window\.location\.pathname/);
    expect(fnBlock).not.toMatch(/stripped\s*=\s*location\b(?!\s*\.)/);
  });

  it("/foreign-guide에서 ko 선택 시 '/' 복귀 정책이 코드에 명시되어야 한다", () => {
    // 구조 분해 후 useHeaderState.ts에 위치
    expect(combinedSource).toMatch(
      /targetLang === ["']ko["'][\s\S]*?\/foreign-guide[\s\S]*?return ["']\/["']/,
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. handleLangChange — setLang persist=true 선행 호출 + SPA 전환
// ─────────────────────────────────────────────────────────────────────────────
describe("handleLangChange — LangContext 선행 업데이트 + SPA 네비게이션", () => {
  it("handleLangChange에서 setLang을 SPA setLocation 이전에 호출해야 한다", () => {
    // 구조 분해 후 useHeaderState.ts에 위치
    const fnBlock = hookSource.match(
      /const handleLangChange[\s\S]*?\n {2}};/,
    )?.[0] ?? "";
    const setLangPos = fnBlock.indexOf("setLang(");
    const setLocationPos = fnBlock.indexOf("setLocation(buildLocalizedPath(option.lang))");
    expect(setLangPos).toBeGreaterThan(-1);
    expect(setLocationPos).toBeGreaterThan(-1);
    expect(setLangPos).toBeLessThan(setLocationPos);
  });

  it("handleLangChange에서 전체 문서 재로딩 없이 SPA로 경로를 전환해야 한다", () => {
    const fnBlock = hookSource.match(
      /const handleLangChange[\s\S]*?\n {2}};/,
    )?.[0] ?? "";
    expect(fnBlock).toMatch(/setLocation\(buildLocalizedPath\(option\.lang\)\)/);
    expect(fnBlock).not.toMatch(/window\.location\.replace/);
    expect(fnBlock).not.toMatch(/window\.location\.href\s*=/);
  });

  it("handleLangChange에서 setLang의 persist 인자가 true여야 한다 (사용자 명시 선택)", () => {
    const fnBlock = hookSource.match(
      /const handleLangChange[\s\S]*?\n {2}};/,
    )?.[0] ?? "";
    // setLang(option.lang, true) 또는 setLang(option.lang) (default=true)
    expect(fnBlock).toMatch(/setLang\(option\.lang(?:,\s*true)?\)/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. 모바일 언어 버튼 — 중앙 handleLangChange 재사용
// ─────────────────────────────────────────────────────────────────────────────
describe("모바일 언어 버튼 — 중앙 언어 전환 계약 재사용", () => {
  it("독립 모바일 언어 버튼이 handleLangChange를 사용해 setLang + SPA 정책을 공유해야 한다", () => {
    expect(mobileLanguageSwitcherSource).toMatch(/onClick=\{\(\) => handleLangChange\(option\)\}/);
    const fnBlock = hookSource.match(/const handleLangChange[\s\S]*?\n {2}};/)?.[0] ?? "";
    expect(fnBlock).toMatch(/setLang\(option\.lang, true\)/);
    expect(fnBlock).toMatch(/setLocation\(buildLocalizedPath\(option\.lang\)\)/);
  });

  it("모바일 메뉴 내부에는 언어 그리드가 남아 있지 않아야 한다", () => {
    expect(mobileMenuSource).not.toContain("mobile-menu-lang-section");
    expect(mobileMenuSource).not.toContain("langOptions.map(");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Footer simplified structure — middle quick-link columns removed
// ─────────────────────────────────────────────────────────────────────────────
describe("Footer simplified structure", () => {
  it("removes the obsolete quick-link collection while retaining legal destinations", () => {
    expect(footerSource).not.toContain("const quickLinks");
    expect(footerSource).toContain('handleNavClick("/non-covered")');
    expect(footerSource).toContain('handleNavClick("/privacy")');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. LangContext — persist 기본값 true 정책
// ─────────────────────────────────────────────────────────────────────────────
describe("LangContext — persist 기본값 정책", () => {
  const langContextSource = readFileSync(
    path.resolve(root, "client/src/contexts/LangContext.tsx"),
    "utf8",
  );

  it("setLang의 persist 기본값이 true여야 한다", () => {
    // const setLang = (l: Lang, persist = true) 패턴
    expect(langContextSource).toMatch(/setLang\s*=\s*\([^)]*persist\s*=\s*true/);
  });

  it("localStorage key가 'star-lang'이어야 한다", () => {
    expect(langContextSource).toMatch(/["']star-lang["']/);
  });
});

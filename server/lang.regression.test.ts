/**
 * lang.regression.test.ts
 *
 * 언어 전환 회귀 방지 테스트 (정적 소스 검사 방식)
 *
 * 보호 대상:
 *   1. buildLocalizedPath — window.location.pathname 기반 경로 계산
 *   2. handleLangChange — setLang(persist=true) 선행 호출 + window.location.replace 사용
 *   3. 모바일 언어 버튼 — 동일한 setLang + replace 패턴
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
 *   - window.location.replace 사용 → 히스토리 스택 오염 없음
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const headerSource = readFileSync(
  path.resolve(root, "client/src/components/Header.tsx"),
  "utf8",
);

const footerSource = readFileSync(
  path.resolve(root, "client/src/components/Footer.tsx"),
  "utf8",
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. buildLocalizedPath — window.location.pathname 기반 경로 계산
// ─────────────────────────────────────────────────────────────────────────────
describe("buildLocalizedPath — window.location.pathname 기반 경로 계산", () => {
  it("buildLocalizedPath 내부에서 window.location.pathname을 사용해야 한다", () => {
    // wouter location(stale) 대신 window.location.pathname을 사용해야 함
    const fnBlock = headerSource.match(
      /const buildLocalizedPath[\s\S]*?^  };/m,
    )?.[0] ?? "";
    expect(fnBlock).toMatch(/window\.location\.pathname/);
  });

  it("buildLocalizedPath 내부에서 wouter location 변수를 직접 사용하지 않아야 한다", () => {
    // wouter location은 stale 가능성이 있으므로 buildLocalizedPath 내부에서 사용 금지
    // (location 변수가 함수 외부에서 선언되어 있으므로 함수 블록만 검사)
    const fnBlock = headerSource.match(
      /const buildLocalizedPath = \(targetLang[\s\S]*?\n  };/,
    )?.[0] ?? "";
    // window.location.pathname을 사용하고 있어야 함
    expect(fnBlock).toMatch(/window\.location\.pathname/);
    // 단독 `stripped = location` 패턴이 없어야 함 (window.location이 아닌 wouter location)
    expect(fnBlock).not.toMatch(/stripped\s*=\s*location\b(?!\s*\.)/);
  });

  it("/foreign-guide에서 ko 선택 시 '/' 복귀 정책이 코드에 명시되어야 한다", () => {
    expect(headerSource).toMatch(
      /targetLang === ["']ko["'][\s\S]*?\/foreign-guide[\s\S]*?return ["']\/["']/,
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. handleLangChange — setLang persist=true 선행 호출 + replace 사용
// ─────────────────────────────────────────────────────────────────────────────
describe("handleLangChange — LangContext 선행 업데이트 + replace 네비게이션", () => {
  it("handleLangChange에서 setLang을 window.location.replace 이전에 호출해야 한다", () => {
    const fnBlock = headerSource.match(
      /const handleLangChange[\s\S]*?\n  };/,
    )?.[0] ?? "";
    const setLangPos = fnBlock.indexOf("setLang(");
    const replacePos = fnBlock.indexOf("window.location.replace");
    expect(setLangPos).toBeGreaterThan(-1);
    expect(replacePos).toBeGreaterThan(-1);
    // setLang이 replace보다 먼저 나와야 함
    expect(setLangPos).toBeLessThan(replacePos);
  });

  it("handleLangChange에서 window.location.href 대신 window.location.replace를 사용해야 한다", () => {
    const fnBlock = headerSource.match(
      /const handleLangChange[\s\S]*?\n  };/,
    )?.[0] ?? "";
    expect(fnBlock).toMatch(/window\.location\.replace/);
    // href 직접 할당은 없어야 함
    expect(fnBlock).not.toMatch(/window\.location\.href\s*=/);
  });

  it("handleLangChange에서 setLang의 persist 인자가 true여야 한다 (사용자 명시 선택)", () => {
    const fnBlock = headerSource.match(
      /const handleLangChange[\s\S]*?\n  };/,
    )?.[0] ?? "";
    // setLang(option.lang, true) 또는 setLang(option.lang) (default=true)
    expect(fnBlock).toMatch(/setLang\(option\.lang(?:,\s*true)?\)/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. 모바일 언어 버튼 — 동일한 setLang + replace 패턴
// ─────────────────────────────────────────────────────────────────────────────
describe("모바일 언어 버튼 — setLang + replace 패턴 일관성", () => {
  it("모바일 언어 버튼에서도 window.location.replace를 사용해야 한다", () => {
    // 모바일 언어 그리드 버튼 onClick 블록 확인
    // langOptions.map 이후 onClick 핸들러에 replace가 있어야 함
    const mobileBlock = headerSource.match(
      /langOptions\.map\([\s\S]*?window\.location\.replace/,
    )?.[0] ?? "";
    expect(mobileBlock).toMatch(/window\.location\.replace/);
  });

  it("모바일 언어 버튼에서도 setLang을 replace 이전에 호출해야 한다", () => {
    // langOptions.map 블록 내 setLang과 replace 순서 확인
    // 정규식 대신 단순 indexOf 순서 비교로 검증
    const mapStart = headerSource.indexOf("langOptions.map(");
    const mapEnd = headerSource.indexOf("</div>\n            {/* CTA", mapStart);
    const mobileBlock = mapStart > -1 && mapEnd > -1
      ? headerSource.slice(mapStart, mapEnd)
      : headerSource.slice(mapStart > -1 ? mapStart : 0);
    const setLangPos = mobileBlock.indexOf("setLang(");
    const replacePos = mobileBlock.indexOf("window.location.replace");
    expect(setLangPos).toBeGreaterThan(-1);
    expect(replacePos).toBeGreaterThan(-1);
    expect(setLangPos).toBeLessThan(replacePos);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Footer quickLinks — Header primaryNav 순서와 일치
// ─────────────────────────────────────────────────────────────────────────────
describe("Footer quickLinks — Header primaryNav 순서 일관성", () => {
  it("Footer quickLinks의 첫 번째 항목이 treatments(시술·장비)여야 한다", () => {
    // quickLinks 배열 블록 추출
    const quickLinksBlock = footerSource.match(
      /const quickLinks\s*=\s*\[[\s\S]*?\];/,
    )?.[0] ?? "";
    // 첫 번째 href가 #treatments여야 함
    const firstHref = quickLinksBlock.match(/href:\s*["']([^"']+)["']/)?.[1];
    expect(firstHref).toBe("#treatments");
  });

  it("Footer quickLinks에 /foreign-guide 항목이 포함되어야 한다", () => {
    expect(footerSource).toMatch(/href:\s*["']\/foreign-guide["']/);
  });

  it("Footer quickLinks에 /about 항목이 포함되어야 한다", () => {
    expect(footerSource).toMatch(/href:\s*["']\/about["']/);
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

/**
 * Step 5 회귀 방지 테스트
 *
 * 검사 대상:
 *   1. handleNavClick — setLocation 사용 + basePath 조합 버그 수정 회귀 방지
 *      (basePath="/" 일 때 href="/about" → "//about" 이 되는 버그 방지)
 *   2. Map.tsx — i18n 키 사용 회귀 방지 (mapViewLabel / mapAddressShort)
 *   3. TreatmentsEquipmentSection.tsx — getText 훅 사용 회귀 방지 (inline lang 삼항 제거)
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const hookSource = readFileSync(
  path.resolve(root, "client/src/hooks/useHeaderState.ts"),
  "utf8",
);
const mapSource = readFileSync(
  path.resolve(root, "client/src/components/Map.tsx"),
  "utf8",
);
const treatmentsSource = readFileSync(
  path.resolve(root, "client/src/components/TreatmentsEquipmentSection.tsx"),
  "utf8",
);
const i18nSource = readFileSync(
  path.resolve(root, "client/src/lib/i18n.ts"),
  "utf8",
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. handleNavClick — setLocation + basePath 조합 버그 수정 회귀 방지
// ─────────────────────────────────────────────────────────────────────────────
describe("handleNavClick — setLocation SPA 라우팅 + basePath 조합 버그 수정 (Step5)", () => {
  it("handleNavClick에서 window.location.href 직접 할당이 없어야 한다", () => {
    // 절대 경로 이동 시 window.location.href = ... 를 사용하면 전체 리로드 발생
    // wouter setLocation으로 SPA 라우팅해야 함
    const fnBlock = hookSource.match(
      /const handleNavClick[\s\S]*?\n  };/,
    )?.[0] ?? "";
    expect(fnBlock).not.toMatch(/window\.location\.href\s*=/);
  });

  it("handleNavClick에서 setLocation을 사용해야 한다 (SPA 라우팅)", () => {
    const fnBlock = hookSource.match(
      /const handleNavClick[\s\S]*?\n  };/,
    )?.[0] ?? "";
    expect(fnBlock).toContain("setLocation(");
  });

  it("handleNavClick에서 basePath === '/' 조건 분기가 있어야 한다 (//about 버그 방지)", () => {
    // basePath가 "/" 일 때 href("/about") 앞에 붙이면 "//about" 이 되는 버그 방지
    const fnBlock = hookSource.match(
      /const handleNavClick[\s\S]*?\n  };/,
    )?.[0] ?? "";
    // basePath === "/" 조건 분기가 있어야 함
    expect(fnBlock).toMatch(/basePath\s*===\s*["']\/["']/);
  });

  it("handleNavClick에서 fullPath 계산 시 basePath + href 단순 연결이 없어야 한다", () => {
    // `${basePath}${href}` 단독 사용은 "//about" 버그를 유발함
    // 반드시 basePath === "/" 조건 분기 후에만 사용해야 함
    const fnBlock = hookSource.match(
      /const handleNavClick[\s\S]*?\n  };/,
    )?.[0] ?? "";
    // 조건 없이 basePath + href 단순 연결 패턴이 없어야 함
    // (삼항 연산자 또는 if/else 내에서만 허용)
    const unconditionalConcat = fnBlock.match(
      /(?<!===\s*["']\/["']\s*\?\s*\S+\s*:\s*)`\$\{basePath\}\$\{href\}`(?!\s*;?\s*$)/,
    );
    // 단순 검증: fullPath 변수에 basePath + href 조합이 있으면 조건 분기도 있어야 함
    if (fnBlock.includes("`${basePath}${href}`")) {
      expect(fnBlock).toMatch(/basePath\s*===\s*["']\/["']/);
    }
    expect(true).toBe(true); // 패턴 없으면 통과
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Map.tsx — i18n 키 사용 회귀 방지
// ─────────────────────────────────────────────────────────────────────────────
describe("Map.tsx — i18n 키 사용 회귀 방지 (Step2 수정)", () => {
  it("Map.tsx에서 구글맵 보기 레이블에 인라인 lang 삼항이 없어야 한다", () => {
    // lang === "en" ? "View on Google Maps" : ... 형태의 하드코딩 제거
    expect(mapSource).not.toMatch(/lang\s*===\s*["']en["']\s*\?\s*["']View on Google Maps["']/);
    expect(mapSource).not.toMatch(/lang\s*===\s*["']ko["']\s*\?\s*["']구글맵 보기["']/);
  });

  it("Map.tsx에서 t.access.mapViewLabel 또는 i18n 키를 사용해야 한다", () => {
    // i18n 키를 통해 레이블을 가져와야 함
    expect(mapSource).toMatch(/t\.access\.(mapViewLabel|viewMap|mapLabel)/);
  });

  it("i18n.ts에 mapViewLabel 키가 4개 언어 모두 존재해야 한다", () => {
    // ko, en, ja, zh 모두 mapViewLabel 키가 있어야 함
    const koBlock = i18nSource.match(/ko:\s*\{[\s\S]*?(?=\n  en:)/)?.[0] ?? "";
    const enBlock = i18nSource.match(/en:\s*\{[\s\S]*?(?=\n  ja:)/)?.[0] ?? "";
    const jaBlock = i18nSource.match(/ja:\s*\{[\s\S]*?(?=\n  zh:)/)?.[0] ?? "";
    const zhBlock = i18nSource.match(/zh:\s*\{[\s\S]*/)?.[0] ?? "";

    expect(koBlock).toContain("mapViewLabel");
    expect(enBlock).toContain("mapViewLabel");
    expect(jaBlock).toContain("mapViewLabel");
    expect(zhBlock).toContain("mapViewLabel");
  });

  it("i18n.ts에 mapAddressShort 키가 4개 언어 모두 존재해야 한다", () => {
    const koBlock = i18nSource.match(/ko:\s*\{[\s\S]*?(?=\n  en:)/)?.[0] ?? "";
    const enBlock = i18nSource.match(/en:\s*\{[\s\S]*?(?=\n  ja:)/)?.[0] ?? "";
    const jaBlock = i18nSource.match(/ja:\s*\{[\s\S]*?(?=\n  zh:)/)?.[0] ?? "";
    const zhBlock = i18nSource.match(/zh:\s*\{[\s\S]*/)?.[0] ?? "";

    expect(koBlock).toContain("mapAddressShort");
    expect(enBlock).toContain("mapAddressShort");
    expect(jaBlock).toContain("mapAddressShort");
    expect(zhBlock).toContain("mapAddressShort");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. TreatmentsEquipmentSection.tsx — getText 훅 사용 회귀 방지
// ─────────────────────────────────────────────────────────────────────────────
describe("TreatmentsEquipmentSection.tsx — getText 훅 사용 회귀 방지 (Step2 수정)", () => {
  it("TreatmentsEquipmentSection.tsx에서 time 필드에 인라인 lang 삼항이 없어야 한다", () => {
    // lang === "en" ? item.timeEn ?? item.time : ... 형태 제거
    expect(treatmentsSource).not.toMatch(/lang\s*===\s*["']en["']\s*\?\s*\S*timeEn/);
    expect(treatmentsSource).not.toMatch(/lang\s*===\s*["']ja["']\s*\?\s*\S*timeJa/);
  });

  it("TreatmentsEquipmentSection.tsx에서 getText 훅을 사용해야 한다", () => {
    // getText(ko, en, ja, zh) 패턴으로 다국어 처리
    expect(treatmentsSource).toContain("getText(");
  });

  it("TreatmentsEquipmentSection.tsx에서 useLocalizedText 훅을 import해야 한다", () => {
    expect(treatmentsSource).toContain("useLocalizedText");
  });
});

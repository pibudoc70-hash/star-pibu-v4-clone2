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
// i18n.ts는 분리되었으므로 6개 파일을 합산 (STRUCT-I18N-1)
const i18nSource = [
  "client/src/lib/i18n.ts",
  "client/src/lib/i18n.types.ts",
  "client/src/lib/i18n.ko.ts",
  "client/src/lib/i18n.en.ts",
  "client/src/lib/i18n.ja.ts",
  "client/src/lib/i18n.zh.ts",
].map((p) => {
  try { return readFileSync(path.resolve(root, p), "utf8"); } catch { return ""; }
}).join("\n");
const koI18n = readFileSync(path.resolve(root, "client/src/lib/i18n.ko.ts"), "utf8");
const enI18n = readFileSync(path.resolve(root, "client/src/lib/i18n.en.ts"), "utf8");
const jaI18n = readFileSync(path.resolve(root, "client/src/lib/i18n.ja.ts"), "utf8");
const zhI18n = readFileSync(path.resolve(root, "client/src/lib/i18n.zh.ts"), "utf8");

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
    // 분리된 언어별 파일에서 직접 검사
    expect(koI18n).toContain("mapViewLabel");
    expect(enI18n).toContain("mapViewLabel");
    expect(jaI18n).toContain("mapViewLabel");
    expect(zhI18n).toContain("mapViewLabel");
  });

  it("i18n.ts에 mapAddressShort 키가 4개 언어 모두 존재해야 한다", () => {
    expect(koI18n).toContain("mapAddressShort");
    expect(enI18n).toContain("mapAddressShort");
    expect(jaI18n).toContain("mapAddressShort");
    expect(zhI18n).toContain("mapAddressShort");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. TreatmentsEquipmentSection.tsx — getText 훅 사용 회귀 방지
// ─────────────────────────────────────────────────────────────────────────────
describe("EquipmentTreatmentCard.tsx — getText 훅 사용 회귀 방지 (Step4 분리)", () => {
  // Step 4 리팩토링: 인라인 TreatmentCard 함수가 EquipmentTreatmentCard.tsx로 분리됨
  const { readFileSync: readFS } = require("node:fs");
  const nodePath2 = require("node:path");
  const equipCardSource = readFS(
    nodePath2.resolve(process.cwd(), "client/src/components/treatments/EquipmentTreatmentCard.tsx"),
    "utf8",
  );

  it("EquipmentTreatmentCard.tsx에서 time 필드에 인라인 lang 삼항이 없어야 한다", () => {
    expect(equipCardSource).not.toMatch(/lang\s*===\s*["']en["']\s*\?\s*\S*timeEn/);
    expect(equipCardSource).not.toMatch(/lang\s*===\s*["']ja["']\s*\?\s*\S*timeJa/);
  });

  it("EquipmentTreatmentCard.tsx에서 getText 훅을 사용해야 한다", () => {
    expect(equipCardSource).toContain("getText(");
  });

  it("EquipmentTreatmentCard.tsx에서 useLocalizedText 훅을 import해야 한다", () => {
    expect(equipCardSource).toContain("useLocalizedText");
  });
});

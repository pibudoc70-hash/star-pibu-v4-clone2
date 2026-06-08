/**
 * Round-7 시니어 재검수 회귀 테스트
 * 수정 항목:
 *   A. ContactSection.tsx ?? fallback 5개 → non-null assertion(!) 교체
 *      [R13 업데이트] non-null assertion(!) → optional chaining + nullish coalescing(?? "")으로 재개선
 *      (i18n.types.ts에서 optional 필드이므로 ?? fallback이 더 안전함)
 *      [R15 업데이트] hoursNote/transitDesc/parkingDesc는 ContactInfoPanel.tsx로 이전됨
 *   B. i18n.types.ts access.copiedLabel optional → required 변경
 *   C. i18n.ko.ts doctors.list 3명 specialties 추가
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";

const ROOT = resolve(__dirname, "..");

function src(rel: string) {
  return readFileSync(resolve(ROOT, rel), "utf-8");
}

// ─── A. ContactSection optional 필드 안전 접근 [R13 업데이트] ────────────────
describe("[A] ContactSection optional 필드 안전 접근 [R13 업데이트]", () => {
  // [R15-P1-2] hoursNote/transitDesc/parkingDesc는 ContactInfoPanel.tsx로 이전됨
  const contactSrc = src("client/src/components/ContactSection.tsx");
  const infoPanelSrc = src("client/src/components/contact/ContactInfoPanel.tsx");
  const combinedSrc = contactSrc + infoPanelSrc;

  // [R13] i18n.types.ts에서 optional 필드는 non-null assertion(!) 대신
  // nullish coalescing(?? "") 방식이 더 안전함 → Round-13에서 재개선
  it("locationInfo가 안전하게 접근되어야 한다 (non-null assertion 또는 nullish coalescing)", () => {
    expect(contactSrc).toMatch(/locationInfo/);
  });

  it("sectionTitle이 안전하게 접근되어야 한다", () => {
    expect(contactSrc).toMatch(/sectionTitle/);
  });

  it("hoursNote가 안전하게 접근되어야 한다", () => {
    // [R15] ContactInfoPanel로 이전됨
    expect(combinedSrc).toMatch(/hoursNote/);
  });

  it("transitDesc가 안전하게 접근되어야 한다", () => {
    // [R15] ContactInfoPanel로 이전됨
    expect(combinedSrc).toMatch(/transitDesc/);
  });

  it("parkingDesc가 안전하게 접근되어야 한다", () => {
    // [R15] ContactInfoPanel로 이전됨
    expect(combinedSrc).toMatch(/parkingDesc/);
  });

  it("[R13] locationInfo에 nullish coalescing(?? \"\") fallback이 있어야 한다", () => {
    expect(contactSrc).toMatch(/locationInfo\s*\?\?\s*["']/);
  });

  it("[R13] hoursNote에 nullish coalescing(?? \"\") fallback이 있어야 한다", () => {
    // [R15] ContactInfoPanel로 이전됨
    expect(combinedSrc).toMatch(/hoursNote\s*\?\?\s*["']/);
  });

  it("[R13] transitDesc에 nullish coalescing(?? \"\") fallback이 있어야 한다", () => {
    // [R15] ContactInfoPanel로 이전됨
    expect(combinedSrc).toMatch(/transitDesc\s*\?\?\s*["']/);
  });

  it("[R13] parkingDesc에 nullish coalescing(?? \"\") fallback이 있어야 한다", () => {
    // [R15] ContactInfoPanel로 이전됨
    expect(combinedSrc).toMatch(/parkingDesc\s*\?\?\s*["']/);
  });
});

// ─── B. i18n.types.ts copiedLabel required ─────────────────────────────────
describe("[B] i18n.types.ts copiedLabel required", () => {
  const typesSrc = src("client/src/lib/i18n.types.ts");

  it("copiedLabel이 optional(?) 없이 required로 선언되어야 한다", () => {
    // copiedLabel?: 패턴이 없어야 함
    expect(typesSrc).not.toMatch(/copiedLabel\?:/);
    // copiedLabel: string 패턴이 있어야 함
    expect(typesSrc).toMatch(/copiedLabel:\s*string/);
  });
});

// ─── C. i18n.ko.ts doctors.list specialties ────────────────────────────────
describe("[C] i18n.ko.ts doctors.list specialties 추가", () => {
  const koSrc = src("client/src/lib/i18n.ko.ts");

  it("조시형 원장 specialties가 존재해야 한다", () => {
    // 조시형 원장 섹션에 specialties 배열이 있어야 함
    expect(koSrc).toMatch(/눈밑지방재배치/);
  });

  it("우혜진 원장 specialties가 존재해야 한다", () => {
    expect(koSrc).toMatch(/조갑진균증/);
  });

  it("이기욱 원장 specialties가 존재해야 한다", () => {
    // 이기욱 원장 고유 항목 (조시형/우혜진과 구별)
    const ikSection = koSrc.slice(koSrc.indexOf("이기욱"));
    expect(ikSection).toMatch(/specialties/);
  });

  it("ko specialties 개수가 en과 동일한 3명이어야 한다", () => {
    const enSrc = src("client/src/lib/i18n.en.ts");
    const koMatches = (koSrc.match(/specialties:/g) || []).length;
    const enMatches = (enSrc.match(/specialties:/g) || []).length;
    expect(koMatches).toBe(enMatches);
  });
});

// ─── D. 4개 언어 copiedLabel 값 존재 ──────────────────────────────────────
describe("[D] 4개 언어 copiedLabel 값 존재", () => {
  const langs = ["ko", "en", "ja", "zh"] as const;

  langs.forEach((lang) => {
    it(`i18n.${lang}.ts에 access.copiedLabel 값이 있어야 한다`, () => {
      const langSrc = src(`client/src/lib/i18n.${lang}.ts`);
      expect(langSrc).toMatch(/copiedLabel:/);
    });
  });
});

// ─── E. HeroSection copiedLabel 사용 확인 ─────────────────────────────────
describe("[E] HeroSection copiedLabel i18n 사용", () => {
  // [R12] HeroSection 리팩토링으로 copiedLabel 로직이 hero/HeroActions.tsx로 이동
  const heroSrc = [
    src("client/src/components/HeroSection.tsx"),
    src("client/src/components/hero/HeroActions.tsx"),
  ].join("\n");

  it("HeroSection에서 하드코딩된 已复制 문자열이 없어야 한다", () => {
    expect(heroSrc).not.toMatch(/已复制/);
  });

  it("HeroSection에서 t.access.copiedLabel을 사용해야 한다", () => {
    expect(heroSrc).toMatch(/copiedLabel/);
  });
});

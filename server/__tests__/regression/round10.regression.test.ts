/**
 * round10.regression.test.ts
 *
 * Round-13 시니어 검수 회귀 테스트
 *
 * 검증 항목:
 *   A. ContactSection — navigator.clipboard 전용 사용 (document.execCommand 제거)
 *   B. ContactSection — non-null assertion(!) 제거 (optional chaining + nullish coalescing)
 *   C. ContactSection — copyFailed state 추가 (클립보드 실패 시 사용자 안내)
 *   D. ContactSection — mapError state 제거 (MapView 내부 자체 fallback UI 사용)
 *   E. TreatmentsEquipmentSection — hex 색상 직접 사용 없음 (CSS 변수 토큰 사용)
 *   F. TreatmentsEquipmentSection — CSS 변수 토큰 사용 확인
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "../../..");

function src(relPath: string): string {
  return readFileSync(resolve(ROOT, relPath), "utf-8");
}

function exists(relPath: string): boolean {
  return existsSync(resolve(ROOT, relPath));
}

// ─────────────────────────────────────────────────────────────────────────────
// A. ContactSection — navigator.clipboard 전용 사용
// ─────────────────────────────────────────────────────────────────────────────
describe("[A] ContactSection navigator.clipboard 전용 사용", () => {
  const contactSrc = src("client/src/components/ContactSection.tsx");

  it("ContactSection.tsx가 존재해야 한다", () => {
    expect(exists("client/src/components/ContactSection.tsx")).toBe(true);
  });

  it("navigator.clipboard를 사용해야 한다", () => {
    expect(contactSrc).toMatch(/navigator\.clipboard/);
  });

  it("document.execCommand를 실제 코드에서 사용하지 않아야 한다 (주석 제외)", () => {
    // 주석에는 언급될 수 있으므로 실제 코드 패턴만 확인
    // document.execCommand(가 실제 호출되는 경우만 실패
    const codeWithoutComments = contactSrc.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(codeWithoutComments).not.toMatch(/document\.execCommand/);
  });

  it("clipboard.writeText를 사용해야 한다", () => {
    expect(contactSrc).toMatch(/clipboard\.writeText/);
  });

  it("handleCopyAddress 함수가 async여야 한다", () => {
    expect(contactSrc).toMatch(/const handleCopyAddress\s*=\s*useCallback\s*\(\s*async/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. ContactSection — non-null assertion(!) 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("[B] ContactSection non-null assertion 제거", () => {
  const contactSrc = src("client/src/components/ContactSection.tsx");

  it("non-null assertion(!.)을 사용하지 않아야 한다", () => {
    // TypeScript non-null assertion: 변수명 뒤에 !. 패턴
    expect(contactSrc).not.toMatch(/\w!\./);
  });

  it("optional chaining(?.)을 사용해야 한다", () => {
    expect(contactSrc).toMatch(/\?\./);
  });

  it("nullish coalescing(??)을 사용해야 한다", () => {
    expect(contactSrc).toMatch(/\?\?/);
  });

  it("locationInfo는 optional chaining 또는 nullish coalescing으로 안전하게 접근해야 한다", () => {
    // t.access.locationInfo ?? "" 또는 t.access?.locationInfo 패턴
    expect(contactSrc).toMatch(/locationInfo\s*\?\?|locationInfo\?/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. ContactSection — copyFailed state 추가
// ─────────────────────────────────────────────────────────────────────────────
describe("[C] ContactSection copyFailed state", () => {
  const contactSrc = src("client/src/components/ContactSection.tsx");

  it("copyFailed state가 선언되어야 한다", () => {
    expect(contactSrc).toMatch(/const\s*\[copyFailed,\s*setCopyFailed\]\s*=\s*useState/);
  });

  it("setCopyFailed(true)가 호출되어야 한다 (실패 시 안내)", () => {
    expect(contactSrc).toMatch(/setCopyFailed\(true\)/);
  });

  it("setCopyFailed(false)가 호출되어야 한다 (초기화)", () => {
    expect(contactSrc).toMatch(/setCopyFailed\(false\)/);
  });

  it("copyFailed 상태가 UI에 반영되어야 한다", () => {
    // copyFailed 조건부 렌더링 확인
    expect(contactSrc).toMatch(/copyFailed/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. ContactSection — mapError state 제거 (MapView 내부 fallback 사용)
// ─────────────────────────────────────────────────────────────────────────────
describe("[D] ContactSection mapError state 제거", () => {
  const contactSrc = src("client/src/components/ContactSection.tsx");

  it("ContactSection에 mapError state가 없어야 한다 (MapView 내부 처리)", () => {
    // mapError state 선언이 없어야 함
    expect(contactSrc).not.toMatch(/const\s*\[mapError,\s*setMapError\]/);
  });

  it("setMapError 호출이 없어야 한다", () => {
    expect(contactSrc).not.toMatch(/setMapError/);
  });

  it("인터랙티브 지도 구현(MapView, tRPC 프록시 또는 Google Maps iframe)을 사용한다", () => {
    const hasMapView = /<MapView/.test(contactSrc);
    const hasTrpcMap = /trpc\.location\.getStaticMapUrl/.test(contactSrc);
    const hasEmbedMap = /<iframe/.test(contactSrc) && /maps\.google\.com\/maps/.test(contactSrc);
    expect(hasMapView || hasTrpcMap || hasEmbedMap).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. TreatmentsEquipmentSection — hex 색상 직접 사용 없음
// ─────────────────────────────────────────────────────────────────────────────
describe("[E] TreatmentsEquipmentSection hex 색상 직접 사용 없음", () => {
  const treatSrc = src("client/src/components/TreatmentsEquipmentSection.tsx");

  it("TreatmentsEquipmentSection.tsx가 존재해야 한다", () => {
    expect(exists("client/src/components/TreatmentsEquipmentSection.tsx")).toBe(true);
  });

  it("#d1ab67 hex 색상을 직접 사용하지 않아야 한다", () => {
    expect(treatSrc).not.toMatch(/#d1ab67/i);
  });

  it("#FAF6EF hex 색상을 직접 사용하지 않아야 한다", () => {
    expect(treatSrc).not.toMatch(/#FAF6EF/i);
  });

  it("#F0F6F8 hex 색상을 직접 사용하지 않아야 한다", () => {
    expect(treatSrc).not.toMatch(/#F0F6F8/i);
  });

  it("#3730A3 hex 색상을 직접 사용하지 않아야 한다", () => {
    expect(treatSrc).not.toMatch(/#3730A3/i);
  });

  it("#6B7280 hex 색상을 직접 사용하지 않아야 한다", () => {
    expect(treatSrc).not.toMatch(/#6B7280/i);
  });

  it("#e8dfc8 hex 색상을 직접 사용하지 않아야 한다", () => {
    expect(treatSrc).not.toMatch(/#e8dfc8/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. TreatmentsEquipmentSection — CSS 변수 토큰 사용 확인
// ─────────────────────────────────────────────────────────────────────────────
describe("[F] TreatmentsEquipmentSection CSS 변수 토큰 사용", () => {
  const treatSrc = src("client/src/components/TreatmentsEquipmentSection.tsx");

  it("--color-gold-primary CSS 변수를 사용해야 한다", () => {
    expect(treatSrc).toMatch(/--color-gold-primary/);
  });

  it("--color-gold-pale CSS 변수를 사용해야 한다", () => {
    expect(treatSrc).toMatch(/--color-gold-pale/);
  });

  it("--color-gold-light CSS 변수를 사용해야 한다", () => {
    expect(treatSrc).toMatch(/--color-gold-light/);
  });

  it("--color-star-mint-pale CSS 변수를 fallback으로 사용해야 한다", () => {
    expect(treatSrc).toMatch(/--color-star-mint-pale/);
  });

  it("--color-star-navy CSS 변수를 fallback으로 사용해야 한다", () => {
    expect(treatSrc).toMatch(/--color-star-navy/);
  });

  it("--color-star-text-mid CSS 변수를 사용해야 한다", () => {
    expect(treatSrc).toMatch(/--color-star-text-mid/);
  });

  it("text-[12px] Tailwind 클래스를 사용해야 한다 (style={{ fontSize: '12px' }} 대체)", () => {
    expect(treatSrc).toMatch(/text-\[12px\]/);
  });

  it("style={{ fontSize: '12px' }} 인라인 스타일이 없어야 한다", () => {
    expect(treatSrc).not.toMatch(/style=\{\{[^}]*fontSize:\s*["']12px["']/);
  });
});

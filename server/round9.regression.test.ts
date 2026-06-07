/**
 * Round-12 시니어 검수 회귀 테스트
 * 수정 항목:
 *   A. hero/ 서브컴포넌트 신규 생성 (HeroOverlays, HeroFloorBadge, HeroStatItem, HeroStatsStrip, HeroActions, HeroScrollIndicator)
 *   B. HeroSection.tsx — 서브컴포넌트 import 사용
 *   C. lib/doctors-data.ts 신규 생성 — DoctorsSection 데이터 분리
 *   D. DoctorsSection.tsx — lib/doctors-data.ts import 사용
 *   E. ContactSection.tsx — 외부 지도 링크 aria-label 추가
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";

const ROOT = resolve(__dirname, "..");
function src(rel: string) {
  return readFileSync(resolve(ROOT, rel), "utf-8");
}
function exists(rel: string) {
  return existsSync(resolve(ROOT, rel));
}

// A. hero/ 서브컴포넌트 신규 생성
describe("[A] hero/ 서브컴포넌트 신규 생성", () => {
  it("HeroOverlays.tsx가 존재해야 한다", () => {
    expect(exists("client/src/components/hero/HeroOverlays.tsx")).toBe(true);
  });
  it("HeroFloorBadge.tsx가 존재해야 한다", () => {
    expect(exists("client/src/components/hero/HeroFloorBadge.tsx")).toBe(true);
  });
  it("HeroStatItem.tsx가 존재해야 한다", () => {
    expect(exists("client/src/components/hero/HeroStatItem.tsx")).toBe(true);
  });
  it("HeroStatsStrip.tsx가 존재해야 한다", () => {
    expect(exists("client/src/components/hero/HeroStatsStrip.tsx")).toBe(true);
  });
  it("HeroActions.tsx가 존재해야 한다", () => {
    expect(exists("client/src/components/hero/HeroActions.tsx")).toBe(true);
  });
  it("HeroScrollIndicator.tsx가 존재해야 한다", () => {
    expect(exists("client/src/components/hero/HeroScrollIndicator.tsx")).toBe(true);
  });
  it("HeroOverlays.tsx는 export function 또는 export default를 가져야 한다", () => {
    const s = src("client/src/components/hero/HeroOverlays.tsx");
    expect(s).toMatch(/export (default|function)/);
  });
  it("HeroStatsStrip.tsx는 export function 또는 export default를 가져야 한다", () => {
    const s = src("client/src/components/hero/HeroStatsStrip.tsx");
    expect(s).toMatch(/export (default|function)/);
  });
  it("HeroActions.tsx는 export function 또는 export default를 가져야 한다", () => {
    const s = src("client/src/components/hero/HeroActions.tsx");
    expect(s).toMatch(/export (default|function)/);
  });
  it("HeroScrollIndicator.tsx는 export function 또는 export default를 가져야 한다", () => {
    const s = src("client/src/components/hero/HeroScrollIndicator.tsx");
    expect(s).toMatch(/export (default|function)/);
  });
});

// B. HeroSection.tsx — 서브컴포넌트 import 사용
describe("[B] HeroSection.tsx 서브컴포넌트 import", () => {
  const heroSrc = src("client/src/components/HeroSection.tsx");
  it("HeroOverlays를 import해야 한다", () => {
    expect(heroSrc).toMatch(/from.*hero\/HeroOverlays/);
  });
  it("HeroStatsStrip을 import해야 한다", () => {
    expect(heroSrc).toMatch(/from.*hero\/HeroStatsStrip/);
  });
  it("HeroActions를 import해야 한다", () => {
    expect(heroSrc).toMatch(/from.*hero\/HeroActions/);
  });
  it("HeroScrollIndicator를 import해야 한다", () => {
    expect(heroSrc).toMatch(/from.*hero\/HeroScrollIndicator/);
  });
});

// C. lib/doctors-data.ts 신규 생성
describe("[C] lib/doctors-data.ts 신규 생성", () => {
  it("lib/doctors-data.ts가 존재해야 한다", () => {
    expect(exists("client/src/lib/doctors-data.ts")).toBe(true);
  });
  it("Doctor 인터페이스를 export해야 한다", () => {
    const s = src("client/src/lib/doctors-data.ts");
    expect(s).toMatch(/export interface Doctor/);
  });
  it("doctors 배열을 export해야 한다", () => {
    const s = src("client/src/lib/doctors-data.ts");
    expect(s).toMatch(/export const doctors/);
  });
  it("GOLD 상수를 export해야 한다", () => {
    const s = src("client/src/lib/doctors-data.ts");
    expect(s).toMatch(/export const GOLD/);
  });
  it("GOLD_LIGHT 상수를 export해야 한다", () => {
    const s = src("client/src/lib/doctors-data.ts");
    expect(s).toMatch(/export const GOLD_LIGHT/);
  });
  it("GOLD_MID 상수를 export해야 한다", () => {
    const s = src("client/src/lib/doctors-data.ts");
    expect(s).toMatch(/export const GOLD_MID/);
  });
  it("doctors 배열에 3명의 의사가 있어야 한다", () => {
    const s = src("client/src/lib/doctors-data.ts");
    // id: 0, 1, 2 각각 존재
    expect(s).toMatch(/id:\s*0/);
    expect(s).toMatch(/id:\s*1/);
    expect(s).toMatch(/id:\s*2/);
  });
  it("조시형 원장 데이터가 있어야 한다", () => {
    const s = src("client/src/lib/doctors-data.ts");
    expect(s).toMatch(/조시형/);
  });
  it("우혜진 원장 데이터가 있어야 한다", () => {
    const s = src("client/src/lib/doctors-data.ts");
    expect(s).toMatch(/우혜진/);
  });
  it("이기욱 원장 데이터가 있어야 한다", () => {
    const s = src("client/src/lib/doctors-data.ts");
    expect(s).toMatch(/이기욱/);
  });
});

// D. DoctorsSection.tsx — lib/doctors-data.ts import 사용
describe("[D] DoctorsSection.tsx lib/doctors-data.ts import", () => {
  const docSrc = src("client/src/components/DoctorsSection.tsx");
  it("lib/doctors-data에서 doctors를 import해야 한다", () => {
    expect(docSrc).toMatch(/from.*lib\/doctors-data/);
  });
  it("DoctorsSection.tsx에 인라인 doctors 배열 선언이 없어야 한다", () => {
    expect(docSrc).not.toMatch(/const doctors:\s*Doctor\[\]/);
  });
  it("DoctorsSection.tsx에 GOLD 인라인 선언이 없어야 한다", () => {
    expect(docSrc).not.toMatch(/const GOLD\s*=/);
  });
  it("mergedDoctors가 useMemo(() => doctors.map으로 감싸져야 한다 (훅 또는 컴포넌트)", () => {
    // [R14] DoctorsSection에서 useDoctorViewModel 훅으로 이전됨
    const hookSrc = src("client/src/hooks/useDoctorViewModel.ts");
    const hasMemoInSection = /useMemo\(\(\)\s*=>\s*doctors\.map/.test(docSrc);
    const hasMemoInHook = /useMemo/.test(hookSrc) && hookSrc.includes("mergedDoctors");
    expect(hasMemoInSection || hasMemoInHook).toBe(true);
  });
});

// E. ContactSection.tsx — 외부 지도 링크 aria-label 추가
describe("[E] ContactSection.tsx 외부 지도 링크 접근성", () => {
  const contactSrc = src("client/src/components/ContactSection.tsx");
  it("카카오맵 링크에 aria-label이 있어야 한다", () => {
    expect(contactSrc).toMatch(/map\.kakao\.com[\s\S]{0,200}aria-label/);
  });
  it("네이버맵 링크에 aria-label이 있어야 한다", () => {
    expect(contactSrc).toMatch(/map\.naver\.com[\s\S]{0,200}aria-label|aria-label[\s\S]{0,200}map\.naver\.com/);
  });
  it("카카오맵 aria-label에 새 탭 안내가 포함되어야 한다", () => {
    expect(contactSrc).toMatch(/\uc0c8 \ud0ed/);
  });
});

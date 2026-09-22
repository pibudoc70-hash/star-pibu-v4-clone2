/**
 * Round-8 시니어 재검수 회귀 테스트
 * 수정 항목:
 *   A. shared/navConfig.ts 신규 생성 — NavItem/LangOption 타입 분리
 *   B. useHeaderState.ts — NavItem/LangOption을 shared/navConfig.ts에서 import
 *   C. MapErrorBoundary.tsx 신규 생성 — App.tsx에서 분리
 *   D. App.tsx — MapErrorBoundary 인라인 클래스 제거, import로 교체
 *   E. useMapHeight.ts 신규 생성 — ContactSection 지도 높이 계산 로직 분리
 *   F. ContactSection.tsx — 지도 없는 공통 외부 링크 패널 사용
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";

const ROOT = resolve(__dirname, "../../..");
function src(rel: string) {
  return readFileSync(resolve(ROOT, rel), "utf-8");
}

// A. shared/navConfig.ts 신규 생성
describe("[A] shared/navConfig.ts 신규 생성", () => {
  const navConfigSrc = src("shared/navConfig.ts");

  it("NavItem 인터페이스가 정의되어야 한다", () => {
    expect(navConfigSrc).toMatch(/export interface NavItem/);
  });

  it("NavItem에 label, href, sectionId 필드가 있어야 한다", () => {
    expect(navConfigSrc).toMatch(/label:\s*string/);
    expect(navConfigSrc).toMatch(/href:\s*string/);
    expect(navConfigSrc).toMatch(/sectionId:\s*string \| null/);
  });

  it("LangOption 인터페이스가 정의되어야 한다", () => {
    expect(navConfigSrc).toMatch(/export interface LangOption/);
  });

  it("LangOption에 lang, label, flag 필드가 있어야 한다", () => {
    expect(navConfigSrc).toMatch(/lang:\s*string/);
    expect(navConfigSrc).toMatch(/flag:\s*string/);
  });
});

// B. useHeaderState.ts — shared/navConfig.ts import
describe("[B] useHeaderState.ts shared/navConfig.ts import", () => {
  const hookSrc = src("client/src/hooks/useHeaderState.ts");

  it("shared/navConfig에서 NavItem을 import해야 한다", () => {
    expect(hookSrc).toMatch(/from.*shared\/navConfig/);
  });

  it("NavItem/LangOption 인터페이스를 직접 정의하지 않아야 한다", () => {
    expect(hookSrc).not.toMatch(/^export interface NavItem/m);
    expect(hookSrc).not.toMatch(/^export interface LangOption/m);
  });

  it("NavItem/LangOption을 re-export해야 한다 (하위 호환성)", () => {
    expect(hookSrc).toMatch(/export type.*NavItem/);
    expect(hookSrc).toMatch(/export type.*LangOption/);
  });
});

// C. MapErrorBoundary.tsx 신규 생성
describe("[C] MapErrorBoundary.tsx 신규 생성", () => {
  const boundarySrc = src("client/src/components/MapErrorBoundary.tsx");

  it("MapErrorBoundary 클래스가 export되어야 한다", () => {
    expect(boundarySrc).toMatch(/export.*class MapErrorBoundary/);
  });

  it("getDerivedStateFromError 정적 메서드가 있어야 한다", () => {
    expect(boundarySrc).toMatch(/getDerivedStateFromError/);
  });

  it("componentDidCatch 메서드가 있어야 한다", () => {
    expect(boundarySrc).toMatch(/componentDidCatch/);
  });

  it("카카오맵 fallback UI가 포함되어야 한다", () => {
    expect(boundarySrc).toMatch(/카카오맵에서 보기/);
  });

  it("default export가 있어야 한다", () => {
    expect(boundarySrc).toMatch(/export default MapErrorBoundary/);
  });
});

// D. App.tsx — MapErrorBoundary 인라인 클래스 제거
describe("[D] App.tsx MapErrorBoundary 분리", () => {
  const appSrc = src("client/src/App.tsx");

  it("App.tsx에서 MapErrorBoundary 인라인 class 정의가 없어야 한다", () => {
    expect(appSrc).not.toMatch(/class MapErrorBoundary extends Component/);
  });

  it("App.tsx에서 MapErrorBoundary를 import해야 한다", () => {
    expect(appSrc).toMatch(/import.*MapErrorBoundary.*from/);
  });

  it("App.tsx에서 MapErrorBoundary를 여전히 사용해야 한다", () => {
    expect(appSrc).toMatch(/<MapErrorBoundary/);
  });
});

// E. useMapHeight.ts 신규 생성
describe("[E] useMapHeight.ts 신규 생성", () => {
  const hookSrc = src("client/src/hooks/useMapHeight.ts");

  it("useMapHeight 함수가 export되어야 한다", () => {
    expect(hookSrc).toMatch(/export function useMapHeight/);
  });

  it("mapHeight 상태를 반환해야 한다", () => {
    expect(hookSrc).toMatch(/mapHeight/);
  });

  it("isMobile 상태를 반환해야 한다", () => {
    expect(hookSrc).toMatch(/isMobile/);
  });

  it("infoPanelRef를 반환해야 한다", () => {
    expect(hookSrc).toMatch(/infoPanelRef/);
  });

  it("mapInstanceRef를 반환해야 한다", () => {
    expect(hookSrc).toMatch(/mapInstanceRef/);
  });

  it("ResizeObserver를 사용해야 한다", () => {
    expect(hookSrc).toMatch(/ResizeObserver/);
  });

  it("requestAnimationFrame을 사용해야 한다", () => {
    expect(hookSrc).toMatch(/requestAnimationFrame/);
  });
});

// F. ContactSection.tsx — 지도 없는 공통 외부 링크 패널
describe("[F] ContactSection.tsx mapless location link", () => {
  const contactSrc = src("client/src/components/ContactSection.tsx");

  it("공통 외부 지도 링크 패널을 import하고 렌더링해야 한다", () => {
    expect(contactSrc).toMatch(/import LocationLinkPanel/);
    expect(contactSrc).toMatch(/<LocationLinkPanel/);
  });

  it("ContactSection 내에서 지도 높이를 직접 관리하지 않아야 한다", () => {
    expect(contactSrc).not.toMatch(/setMapHeight/);
    expect(contactSrc).not.toMatch(/mapHeight/);
  });

  it("iframe과 카카오 K fallback을 렌더링하지 않아야 한다", () => {
    expect(contactSrc).not.toMatch(/<iframe/);
    expect(contactSrc).not.toMatch(/>K<\/span>/);
  });
});

// G. TypeScript 타입 일관성
describe("[G] TypeScript 타입 일관성", () => {
  it("shared/navConfig.ts가 client/ 경로를 import하지 않아야 한다", () => {
    const navConfigSrc = src("shared/navConfig.ts");
    expect(navConfigSrc).not.toMatch(/from.*client\//);
    expect(navConfigSrc).not.toMatch(/from.*@\//);
  });

  it("useMapHeight.ts가 google.maps 타입을 사용해야 한다", () => {
    const hookSrc = src("client/src/hooks/useMapHeight.ts");
    expect(hookSrc).toMatch(/google\.maps\.Map/);
  });
});

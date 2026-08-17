import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
  path.resolve(__dirname, "../../client/src/components/Map.tsx"),
  "utf-8",
);

describe("지도 빈 영역 대체 UI 회귀 방지", () => {
	 it("Maps Proxy의 StaticMapService tile 이미지도 성공한 지도 렌더링으로 인정한다", () => {
	   expect(source).toContain('const hasRenderedMapDom = () =>');
	   expect(source).toContain('mapContainer.current?.querySelector("img, canvas")');
	   expect(source).not.toContain('mapRoot && mapRoot.querySelector("img, canvas")');
	   expect(source).toContain('if (!hasRenderedMapDom()) return;');
	 });

	 it("8초 timeout 시점에 tile 이미지가 이미 있으면 fallback으로 교체하지 않는다", () => {
	   expect(source).toContain('!hasRenderedMapDom()');
	   expect(source).toContain('setMapError(true);');
	   expect(source).toContain('}, 8000);');
	 });

  it("fallback 전환을 상위 화면에 한 번만 알릴 수 있다", () => {
    expect(source).toContain('onFallback?: () => void;');
    expect(source).toContain('const fallbackReported = useRef(false);');
    expect(source).toContain('onFallbackRef.current?.();');
  });

  it("proxy 기반 기본 지도를 특정 demo map ID에 강제 결합하지 않는다", () => {
    expect(source).not.toContain("mapId: 'DEMO_MAP_ID'");
  });

  it("imperative map canvas를 error fallback iframe과 다른 React node로 교체한다", () => {
    expect(source).toContain('key="map-error"');
    expect(source).toContain('key="map-canvas"');
  });
});

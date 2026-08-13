import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
  path.resolve(__dirname, "../../client/src/components/Map.tsx"),
  "utf-8",
);

describe("지도 빈 영역 대체 UI 회귀 방지", () => {
  it("tilesloaded 이벤트만으로 성공 처리하지 않고 실제 지도 DOM을 확인한다", () => {
    expect(source).toContain('const hasRenderedMapDom = () =>');
    expect(source).toContain('querySelector(".gm-style")');
    expect(source).toContain('querySelector("img, canvas")');
    expect(source).toContain('if (!hasRenderedMapDom()) return;');
  });

  it("타일 DOM이 끝내 생성되지 않으면 시간 제한 후 기존 오류 대체 UI로 전환한다", () => {
    expect(source).toContain('setMapError(true);');
    expect(source).toContain('}, 8000);');
  });
});

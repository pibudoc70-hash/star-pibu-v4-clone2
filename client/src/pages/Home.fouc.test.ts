import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

describe("홈 초기 스타일 적용 게이트", () => {
  it("첫 스타일시트가 준비될 때까지 prerender 텍스트를 숨기는 FOUC 방지 게이트를 둔다", () => {
    expect(indexHtml).toContain('data-initial-style="pending"');
    expect(indexHtml).toContain("#root { visibility: hidden; }");
    expect(indexHtml).toContain("document.documentElement.removeAttribute('data-initial-style')");
    expect(indexHtml).toContain("window.addEventListener('error', function (event)");
    expect(indexHtml).toContain("window.requestAnimationFrame(function () { window.requestAnimationFrame(release); });");
    expect(indexHtml).toContain('style[data-vite-dev-id$="/client/src/index.css"]');
    expect(indexHtml).not.toContain('window.setTimeout(release, 4000)');
  });

  it("서버 응답 대기 중 브랜드 로딩 상태를 알리고 앱 준비 뒤 함께 제거한다", () => {
    expect(indexHtml).toContain('id="initial-loading"');
    expect(indexHtml).toContain('role="status"');
    expect(indexHtml).toContain('aria-live="polite"');
    expect(indexHtml).toContain("스타피부과를 준비하고 있습니다");
    expect(indexHtml).toContain("document.getElementById('initial-loading')");
    expect(indexHtml).toContain("if (loading) loading.remove();");
  });
});

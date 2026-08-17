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
});

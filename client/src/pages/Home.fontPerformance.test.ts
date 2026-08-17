import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const globalCss = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("홈 초기 Pretendard 전달 정책", () => {
  it("전체 Pretendard variable font를 HTML에서 높은 우선순위로 preload하지 않는다", () => {
    expect(indexHtml).not.toMatch(
      /<link\s+rel="preload"\s+as="font"[\s\S]*?PretendardVariable_1ede78f7\.woff2/,
    );
  });

  it("본문 폰트는 swap 정책을 유지해 글자 렌더링을 막지 않는다", () => {
    expect(globalCss).toMatch(
      /font-family:\s*["']Pretendard Variable["'];[\s\S]*?font-display:\s*swap;/,
    );
  });
});

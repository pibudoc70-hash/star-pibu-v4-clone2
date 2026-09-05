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

  it("본문 서브셋 폰트는 swap 정책을 유지해 글자 렌더링을 막지 않는다", () => {
    expect(globalCss).toMatch(
      /font-family:\s*["']Pretendard Web["'];[\s\S]*?font-display:\s*swap;/,
    );
  });

  it("OpenAI tracking script는 load 이후 idle에 가져와 critical asset과 경쟁하지 않는다", () => {
    expect(indexHtml).not.toContain('<script async src="https://bzrcdn.openai.com/sdk/oaiq.min.js"></script>');
    expect(indexHtml).toMatch(/window\.addEventListener\(['"]load['"]/);
    expect(indexHtml).toContain("requestIdleCallback");
    expect(indexHtml).toContain("https://bzrcdn.openai.com/sdk/oaiq.min.js");
  });
});

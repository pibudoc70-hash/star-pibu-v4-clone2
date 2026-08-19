import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
const homeTitle = "부산 서면 스타피부과 | 부산울쎄라ㅣ부산써마지ㅣ부산 리프팅ㅣ피부과전문의 3인 진료";
const homeKeywords = "부산피부과, 부산울쎄라, 부산써마지, 부산리프팅, 부산울쎄라피";

describe("index SEO fallback metadata", () => {
  it("클라이언트 실행 전에도 홈 title과 keywords를 사용자 지정 값으로 제공한다", () => {
    expect(indexHtml).toContain(`<title>${homeTitle}</title>`);
    expect(indexHtml).toContain(`<meta name="keywords" content="${homeKeywords}" />`);
  });

  it("소셜 미리보기 title도 홈 SEO title과 일치시킨다", () => {
    expect(indexHtml).toContain(`<meta property="og:title" content="${homeTitle}" />`);
    expect(indexHtml).toContain(`<meta name="twitter:title" content="${homeTitle}" />`);
    expect(indexHtml).toContain(`<meta property="kakao:title" content="${homeTitle}" />`);
  });
});

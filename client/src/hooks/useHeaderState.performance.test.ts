import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const headerStateSource = readFileSync(
  resolve(process.cwd(), "client/src/hooks/useHeaderState.ts"),
  "utf8",
);

describe("useHeaderState 초기 로딩 의존성", () => {
  it("공개 헤더에서 사용되지 않는 인증 조회를 시작하지 않는다", () => {
    expect(headerStateSource).not.toContain('@/_core/hooks/useAuth');
    expect(headerStateSource).not.toMatch(/useAuth\s*\(/);
  });
});

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("라우트 생명주기 주석", () => {
  it("현재 활성화된 Doctors·Directions를 dormant 페이지로 표기하지 않는다", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../../client/src/routes.ts"),
      "utf-8",
    );

    expect(source).not.toContain("Doctors, Directions, Facilities, Events");
    expect(source).toContain("Facilities, Events");
    expect(source).toContain("Only pages registered here are live and canonical.");
  });
});

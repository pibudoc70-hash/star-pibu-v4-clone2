import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const mobileLayout = readFileSync(
  resolve(process.cwd(), "client/src/components/doctors/DoctorMobileLayout.tsx"),
  "utf8",
);

describe("DoctorMobileLayout image alt text", () => {
  it("SEO 분석에서 누락된 세 전문의 사진에 이름 기반 대체 텍스트를 제공한다", () => {
    expect(mobileLayout).toContain("alt={d.name}");
    expect(mobileLayout).not.toContain('alt=""');
  });
});

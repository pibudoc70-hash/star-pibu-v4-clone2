import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const privacySource = readFileSync(join(process.cwd(), "client/src/pages/Privacy.tsx"), "utf8");

describe("Privacy analytics disclosure", () => {
  it("discloses both approved analytics processors without describing appointment or consultation data transfer", () => {
    expect(privacySource).toContain("Google LLC (Google Analytics)");
    expect(privacySource).toContain("네이버 주식회사 (네이버 WCS)");
    expect(privacySource).toContain("웹사이트 유입 및 네이버 광고 전환 통계 분석");
    expect(privacySource).not.toContain("네이버 WCS) | 예약");
    expect(privacySource).not.toContain("네이버 WCS) | 상담");
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Directions.tsx"), "utf8");

describe("Directions mapless location link", () => {
  it("uses the shared external Kakao map link instead of any embedded map fallback", () => {
    expect(source).toContain("import LocationLinkPanel");
    expect(source).toContain("<LocationLinkPanel");
    expect(source).toContain("href={HOSPITAL.kakaoMapUrl}");
    expect(source).not.toContain("<iframe");
    expect(source).not.toContain("<MapView");
    expect(source).not.toContain("googleMapsEmbedUrl");
  });
});

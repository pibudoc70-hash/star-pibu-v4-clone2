import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Directions.tsx"), "utf8");
const footerSource = readFileSync(resolve(process.cwd(), "client/src/components/Footer.tsx"), "utf8");

describe("Directions dedicated transport content", () => {
  it("keeps transport guidance while the global footer supplies the shared location section", () => {
    expect(source).toContain("transportationTitle");
    expect(source).toContain("carTitle");
    expect(source).toContain("transitTitle");
    expect(source).not.toContain("LocationLinkPanel");
    expect(source).not.toContain("map.kakao.com");
    expect(footerSource).toContain("<ContactSection />");
    expect(source).not.toContain("<iframe");
    expect(source).not.toContain("<MapView");
    expect(source).not.toContain("googleMapsEmbedUrl");
  });
});

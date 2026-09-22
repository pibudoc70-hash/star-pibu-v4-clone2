import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const contactSource = readFileSync(resolve(process.cwd(), "client/src/components/ContactSection.tsx"), "utf8");
const directionsSource = readFileSync(resolve(process.cwd(), "client/src/pages/Directions.tsx"), "utf8");
const mapSource = readFileSync(resolve(process.cwd(), "client/src/components/Map.tsx"), "utf8");
const mapBoundarySource = readFileSync(resolve(process.cwd(), "client/src/components/MapErrorBoundary.tsx"), "utf8");
const panelSource = readFileSync(resolve(process.cwd(), "client/src/components/contact/LocationLinkPanel.tsx"), "utf8");

const KAKAO_FALLBACK_ICON = ["<span", ">K</span>"].join("");

describe("map fallback removal", () => {
  it("uses one shared address-and-link panel across ContactSection and Directions", () => {
    expect(contactSource).toContain('import LocationLinkPanel from "@/components/contact/LocationLinkPanel"');
    expect(contactSource).toContain("<LocationLinkPanel");
    expect(directionsSource).toContain("import LocationLinkPanel from '@/components/contact/LocationLinkPanel'");
    expect(directionsSource).toContain("<LocationLinkPanel");
    expect(panelSource).toContain('target="_blank"');
    expect(panelSource).toContain("href={href}");
    expect(contactSource).toContain("map.kakao.com");
    expect(directionsSource).toContain("map.kakao.com");
  });

  it("removes embedded maps and the yellow K fallback card from every former surface", () => {
    for (const source of [contactSource, directionsSource]) {
      expect(source).not.toContain("<iframe");
      expect(source).not.toContain("<MapView");
    }
    for (const source of [mapSource, mapBoundarySource]) {
      expect(source).not.toContain(KAKAO_FALLBACK_ICON);
      expect(source).toContain("LocationLinkPanel");
    }
  });
});

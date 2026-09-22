import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const contactSource = readFileSync(resolve(process.cwd(), "client/src/components/ContactSection.tsx"), "utf8");
const directionsSource = readFileSync(resolve(process.cwd(), "client/src/pages/Directions.tsx"), "utf8");
const mapSource = readFileSync(resolve(process.cwd(), "client/src/components/Map.tsx"), "utf8");
const mapBoundarySource = readFileSync(resolve(process.cwd(), "client/src/components/MapErrorBoundary.tsx"), "utf8");
const mapEmbedSource = readFileSync(resolve(process.cwd(), "client/src/components/contact/ClinicMapEmbed.tsx"), "utf8");

const KAKAO_FALLBACK_ICON = ["<span", ">K</span>"].join("");

describe("shared contact map restoration", () => {
  it("uses the shared Google map embed in ContactSection instead of a Kakao handoff card", () => {
    expect(contactSource).toContain('import ClinicMapEmbed from "@/components/contact/ClinicMapEmbed"');
    expect(contactSource).toContain("<ClinicMapEmbed");
    expect(contactSource).not.toContain("LocationLinkPanel");
    expect(contactSource).not.toContain("카카오맵에서 보기");
    expect(contactSource).not.toContain("map.kakao.com");
    expect(mapEmbedSource).toContain("https://www.google.com/maps/embed?");
    expect(mapEmbedSource).toContain("origin=mfe");
    expect(mapEmbedSource).toContain("<iframe");
    expect(mapEmbedSource).toContain("allowFullScreen");
    expect(directionsSource).not.toContain("LocationLinkPanel");
    expect(directionsSource).not.toContain("map.kakao.com");
  });

  it("keeps a map surface available when the Google SDK path fails", () => {
    expect(contactSource).not.toContain("<MapView");
    expect(directionsSource).not.toContain("<MapView");
    for (const source of [mapSource, mapBoundarySource]) {
      expect(source).not.toContain(KAKAO_FALLBACK_ICON);
      expect(source).toContain("ClinicMapEmbed");
    }
  });
});

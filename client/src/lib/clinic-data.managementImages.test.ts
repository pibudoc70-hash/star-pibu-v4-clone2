import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clinicDataSource = readFileSync(resolve(process.cwd(), "client/src/lib/clinic-data.ts"), "utf8");

describe("approved management-device image assets", () => {
  it("uses managed storage paths for every management-device image", () => {
    const imageMap = clinicDataSource.slice(
      clinicDataSource.indexOf("export const MANAGEMENT_DEVICE_IMAGES"),
      clinicDataSource.indexOf("// ── 관리 장비 목록", clinicDataSource.indexOf("export const MANAGEMENT_DEVICE_IMAGES")),
    );

    expect(imageMap).toContain('sonopeel: "/manus-storage/');
    expect(imageMap).toContain('porederm: "/manus-storage/');
    expect(imageMap).toContain('airbubble: "/manus-storage/');
    expect(imageMap).toContain('transkin: "/manus-storage/');
    expect(imageMap).not.toContain("/api/storage/");
  });

  it("retains one image key for each of the sixteen supplied management-device originals", () => {
    const expectedKeys = [
      "sonopeel", "porederm", "airbubble", "oxyjet", "inbio", "flawless", "dermalight", "fray",
      "ionzyme", "healingbright", "mesoskin", "ultraduo", "triplemultigel", "ldm", "ilumi", "transkin",
    ];

    for (const key of expectedKeys) {
      expect(clinicDataSource).toMatch(new RegExp(`\\b${key}:`));
    }
  });
});

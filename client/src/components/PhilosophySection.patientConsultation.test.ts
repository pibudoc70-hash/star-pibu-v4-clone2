import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/PhilosophySection.tsx"), "utf8");

describe("approved patient consultation image", () => {
  it("uses the managed WebP for each responsive consultation image source", () => {
    expect(source).toContain('const NEW_IMAGE = "/manus-storage/patient-consultation-mobile_e2474e05_fb420943_');
    expect(source).toContain('const PATIENT_IMAGE_MOBILE_JPG = NEW_IMAGE;');
    expect(source).toContain('const PATIENT_IMAGE_DESKTOP_WEBP = NEW_IMAGE;');
    expect(source).not.toContain('/api/storage/patient-consultation-mobile_e2474e05_fb420943.jpg');
  });

  it("retains the localized consultation alt text and responsive picture structure", () => {
    expect(source).toContain('alt={t.about.consultationAlt}');
    expect(source).toContain('<picture>');
    expect(source).toContain('loading="lazy"');
  });
});

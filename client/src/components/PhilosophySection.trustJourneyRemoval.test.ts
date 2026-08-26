import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(process.cwd(), "client/src/components/PhilosophySection.tsx"),
  "utf8",
);

describe("PhilosophySection trust and journey removal", () => {
  it("does not render the removed trust statistics or Our Journey timeline", () => {
    expect(source).not.toContain("TRUSTED BY PATIENTS SINCE 2006");
    expect(source).not.toContain("OUR JOURNEY");
    expect(source).not.toContain("journeyItems");
    expect(source).not.toContain("useClinicStats");
  });

  it("retains the accessible clinic philosophy section and consultation image", () => {
    expect(source).toContain('section id="about"');
    expect(source).toContain("consultationAlt");
    expect(source).toContain("PATIENT_IMAGE_DESKTOP_WEBP");
  });
});

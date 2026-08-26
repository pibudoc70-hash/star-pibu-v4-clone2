import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const aboutSource = readFileSync(resolve(process.cwd(), "client/src/pages/About.tsx"), "utf8");

describe("About medical-team image recovery", () => {
  it("uses the user-approved managed WebP and preserves the localized image semantics", () => {
    expect(aboutSource).toContain('src="/manus-storage/patient-consultation-mobile_e2474e05_fb420943_2114c946.webp"');
    expect(aboutSource).not.toContain("/api/storage/medical_team_53232402.jpg");
    expect(aboutSource).toContain("alt={medicalTeamAlt}");
    expect(aboutSource).toContain('className="w-full h-full object-cover"');
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const mobileLayout = readFileSync(resolve(root, "client/src/components/doctors/DoctorMobileLayout.tsx"), "utf8");
const credentials = readFileSync(resolve(root, "client/src/components/doctors/DoctorCredentials.tsx"), "utf8");
const styles = readFileSync(resolve(root, "client/src/index.css"), "utf8");

describe("mobile doctor credential density", () => {
  it("keeps every specialty and credential in the shared mobile renderers", () => {
    expect(mobileLayout).toContain("d.specialties.map");
    expect(credentials).toContain("doctor.credentials.map");
    expect(credentials).toContain("{doctor.credentials.length}");
  });

  it("provides one shared styling hook for text specialties and credential rows", () => {
    expect(mobileLayout).toContain("dr-mob-specialty-list");
    expect(credentials).toContain("dr-credentials-header-mobile");
    expect(credentials).toContain("dr-credentials-list-mobile");
  });

  it("limits the nested-box cleanup to the phone media query", () => {
    const start = styles.indexOf("/* ── Homepage mobile doctor-card density");
    const end = styles.indexOf("@media (prefers-reduced-motion: reduce)", start);
    const block = styles.slice(start, end);

    expect(block).toContain("@media (max-width: 767px)");
    expect(block).toContain(".dr-specialty-chip-mobile");
    expect(block).toContain(".dr-credentials-accordion");
    expect(block).toContain("background: transparent !important;");
    expect(block).toContain("border: 0 !important;");
    expect(block).toContain(".dr-credentials-item-mobile + .dr-credentials-item-mobile");
    expect(block).toContain("font-size: 0.84375rem !important;");
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const credentials = readFileSync(resolve(process.cwd(), "client/src/components/doctors/DoctorCredentials.tsx"), "utf8");
const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Doctor credentials compact spacing", () => {
  it("keeps every credential visible through the shared responsive list", () => {
    expect(credentials).toContain('className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1"');
    expect(credentials).toContain('className="px-4 py-4 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2 dr-credentials-list-mobile"');
    expect(credentials).toContain("<DoctorResearchActivities doctor={doctor} />");
  });

  it("uses the compact border-free mobile list while preserving credential content", () => {
    expect(credentials).toContain('gap-2.5 py-3 px-3 rounded-lg dr-credentials-item-mobile');
    expect(styles).toContain("gap: 0.625rem !important;");
    expect(styles).toContain("padding: 0.6875rem 0 !important;");
    expect(styles).toContain(".dr-credentials-item-mobile + .dr-credentials-item-mobile");
  });
});

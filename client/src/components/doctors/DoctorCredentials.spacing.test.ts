import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const credentials = readFileSync(resolve(process.cwd(), "client/src/components/doctors/DoctorCredentials.tsx"), "utf8");
const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Doctor credentials compact spacing", () => {
  it("uses denser responsive credential grids without hiding credentials", () => {
    expect(credentials).toContain('className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1"');
    expect(credentials).toContain('className="px-4 py-4 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2"');
    expect(credentials).toContain("<DoctorResearchActivities doctor={doctor} />");
  });

  it("reduces card padding while preserving the existing credential content", () => {
    expect(credentials).toContain('gap-2.5 py-3 px-3 rounded-lg dr-credentials-item-mobile');
    expect(styles).toContain("gap: 0.5rem;");
    expect(styles).toContain("padding-top: 0.375rem;");
    expect(styles).toContain("padding-bottom: 0.375rem;");
  });
});

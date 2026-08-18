import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const mobileLayout = readFileSync(
  resolve(process.cwd(), "client/src/components/doctors/DoctorMobileLayout.tsx"),
  "utf8"
);

describe("Doctor desktop panel height", () => {
  it("keeps the detail card at least as tall as the longest doctor profile", () => {
    expect(styles).toMatch(/\.dr-desktop-panel\s*\{\s*min-height:\s*741px;\s*\}/);
  });

  it("keeps the mobile photo fade compact so white coats do not look like blank space", () => {
    expect(styles).toMatch(/\.dr-mob-photo-fade\s*\{[^}]*height:\s*56px;/);
  });

  it("keeps inactive mobile doctor panels from defining the slider height", () => {
    expect(mobileLayout).toContain(
      'className="w-full flex-shrink-0 dr-mob-slide-panel"'
    );
    expect(mobileLayout).toContain('data-active={String(activeDoctor === d.id)}');
    expect(styles).toMatch(
      /\.dr-mob-slide-panel\[data-active="false"\]\s*\{[^}]*height:\s*0;[^}]*overflow:\s*hidden;/
    );
  });
});

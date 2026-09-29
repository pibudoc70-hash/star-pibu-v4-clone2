import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const doctorsPage = readFileSync(resolve(root, "client/src/pages/Doctors.tsx"), "utf8");
const credentials = readFileSync(resolve(root, "client/src/components/doctors/DoctorCredentials.tsx"), "utf8");
const styles = readFileSync(resolve(root, "client/src/index.css"), "utf8");

const start = styles.indexOf("/* Standalone Doctors: retain the existing selector/photo controls");
const end = styles.indexOf("/* 통증관리 단계", start);
const mobileScope = styles.slice(styles.lastIndexOf("@media (max-width: 767px)", start), end);

describe("Doctors direct-page mobile editorial layout", () => {
  it("adds an isolated page scope without changing the desktop markup branch", () => {
    expect(doctorsPage).toContain('<div className="doctors-page">');
    expect(doctorsPage).toContain('className="hidden lg:block"');
    expect(doctorsPage).toContain('className="dr-doctors-content py-10 sm:py-16 dr-section-bg"');
  });

  it("limits panel and nested-card removal to the phone-only Doctors scope", () => {
    expect(mobileScope).toContain("@media (max-width: 767px)");
    expect(mobileScope).toContain(".doctors-page .dr-panel-card.card--doctor");
    expect(mobileScope).toContain("box-shadow: none !important;");
    expect(mobileScope).toContain(".doctors-page .dr-credentials-accordion");
    expect(mobileScope).toContain(".doctors-page .dr-credentials-item-mobile + .dr-credentials-item-mobile");
    expect(mobileScope).toContain(".doctors-page .dr-research-activities");
  });

  it("keeps credentials and research as icon-and-text rows with divider-only separation", () => {
    expect(credentials).toContain('className="px-4 py-4 flex flex-col dr-credentials-list-mobile"');
    expect(credentials).toContain('className="flex items-center gap-2.5 py-3 dr-credentials-item-mobile"');
    expect(credentials).toContain('className="dr-research-activity border-l-2');
  });
});

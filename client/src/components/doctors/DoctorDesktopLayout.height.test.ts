import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const mobileLayout = readFileSync(
  resolve(process.cwd(), "client/src/components/doctors/DoctorMobileLayout.tsx"),
  "utf8"
);
const doctorsPage = readFileSync(resolve(process.cwd(), "client/src/pages/Doctors.tsx"), "utf8");
const desktopMarkup = doctorsPage.slice(
  doctorsPage.indexOf("{/* ── 데스크톱: 탭 없이 세 원장 프로필을 모두 표시"),
  doctorsPage.indexOf("{/* ── 모바일 레이아웃")
);

describe("Doctor profile layout", () => {
  it("uses content-driven full profiles instead of a fixed-height desktop tab panel", () => {
    expect(desktopMarkup).toContain('grid-cols-[minmax(320px,.7fr)_minmax(0,1fr)]');
    expect(desktopMarkup).toContain('py-16 first:pt-0 last:pb-0');
    expect(desktopMarkup).not.toContain("dr-panel-card card card--doctor");
    expect(desktopMarkup).not.toContain("dr-desktop-panel");
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

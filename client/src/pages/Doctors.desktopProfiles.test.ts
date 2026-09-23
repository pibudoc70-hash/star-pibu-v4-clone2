import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const doctorsPage = readFileSync(resolve(process.cwd(), "client/src/pages/Doctors.tsx"), "utf8");
const desktopMarkup = doctorsPage.slice(
  doctorsPage.indexOf("{/* ── 데스크톱: 탭 없이 세 원장 프로필을 모두 표시"),
  doctorsPage.indexOf("{/* ── 모바일 레이아웃")
);
const mobileMarkup = doctorsPage.slice(doctorsPage.indexOf("{/* ── 모바일 레이아웃"));

describe("Doctors desktop full-profile layout", () => {
  it("renders all doctors as ordered desktop profile sections without a vertical tablist", () => {
    expect(desktopMarkup).toContain('className="hidden lg:block"');
    expect(desktopMarkup).toContain("mergedDoctors.map((d, index) => (");
    expect(desktopMarkup).toContain('grid-cols-[minmax(320px,.7fr)_minmax(0,1fr)]');
    expect(desktopMarkup).toContain('border-b border-[color:var(--color-gold-light)]');
    expect(desktopMarkup).toContain('id={`dr-${d.slug}`}');
    expect(desktopMarkup).not.toContain('aria-orientation="vertical"');
    expect(desktopMarkup).not.toContain("DoctorTabButton");
  });

  it("keeps the complete profile content and a separate native research disclosure for every doctor", () => {
    expect(desktopMarkup).toContain("src={d.image}");
    expect(desktopMarkup).toContain('className="block aspect-[4/5] w-full object-cover"');
    expect(desktopMarkup).not.toContain("dr-panel-card card card--doctor");
    expect(desktopMarkup).not.toContain("dr-photo-fade-right");
    expect(desktopMarkup).not.toContain("dr-photo-fade-bottom");
    expect(desktopMarkup).toContain("{d.name}");
    expect(desktopMarkup).toContain("{d.nameEn}");
    expect(desktopMarkup).toContain("d.specialties.map");
    expect(desktopMarkup).toContain('variant="desktop"');
    expect(desktopMarkup).toContain("doctor={d}");
  });

  it("preserves the untouched tab-based mobile interaction below the desktop breakpoint", () => {
    expect(mobileMarkup).toContain('className="lg:hidden rounded-3xl overflow-hidden dr-panel-card card card--doctor dr-panel-border"');
    expect(mobileMarkup).toContain('aria-orientation="horizontal"');
    expect(mobileMarkup).toContain('variant="mobile"');
    expect(mobileMarkup).toContain("isActive={activeDoctor === d.id}");
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const doctorData = readFileSync(resolve(process.cwd(), "client/src/lib/doctors-data.ts"), "utf8");
const credentials = readFileSync(resolve(process.cwd(), "client/src/components/doctors/DoctorCredentials.tsx"), "utf8");

describe("Doctor research activities disclosure contract", () => {
  it("stores identity-verified activity records without assigning partial-name records to a doctor", () => {
    expect(doctorData).toContain("researchActivities?:");
    expect(doctorData).toContain('slug: "cho"');
    expect(doctorData).toContain('slug: "woo"');
    expect(doctorData).toContain('slug: "lee"');
    expect(doctorData).toContain("16681657");
    expect(doctorData).toContain("ART000885244");
    expect(doctorData).toContain("10759963");
    expect(doctorData).not.toContain("RID=2232149");
  });

  it("uses one compact native disclosure in the shared responsive credentials component", () => {
    expect(credentials).toContain("doctor.researchActivities");
    expect(credentials).toContain("<details");
    expect(credentials).toContain("<summary");
    expect(credentials).toContain("target=\"_blank\"");
    expect(credentials).toContain('rel="noreferrer"');
    expect(credentials).not.toContain("@/components/ui/accordion");
  });

  it("derives each activity key from both the source URL and its distinct title", () => {
    expect(credentials).toContain('key={`${activity.sourceUrl}-${activity.title}`}');
    expect(credentials).not.toContain('key={activity.sourceUrl}');
  });

  it("keeps credentials visible on mobile while reserving disclosure behavior for research activities", () => {
    expect(credentials).not.toContain("aria-expanded={expanded}");
    expect(credentials).not.toContain("onClick={onToggle}");
    expect(credentials).toContain('className="px-4 py-4 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2"');
    expect(credentials).toContain("<DoctorResearchActivities doctor={doctor} />");
  });

  it("keeps visible activity titles concise without years or coauthor lists", () => {
    expect(doctorData).toContain('title: "액취증·다한증 치료 연구"');
    expect(doctorData).toContain('title: "두피 분절상 신경섬유종증 증례 보고"');
    expect(doctorData).not.toContain('title: "동상의 임상·조직병리학적 특성 연구"');
  });

  it("includes additional official research and academic activity records for verified doctor identities", () => {
    expect(doctorData).toContain("11260541");
    expect(doctorData).toContain("20711282");
    expect(doctorData).toContain("10759963");
    expect(doctorData).toContain('title: "융합성 망상 유두종증 항생제 치료 증례"');
    expect(doctorData).toContain('title: "한관종 절연침 치료 연구"');
    expect(doctorData).toContain('title: "선형 국소 탄력섬유증 증례 보고"');
  });

  it("does not attribute a namesake's external profile or activities to Lee", () => {
    expect(doctorData).not.toContain('title: "국내외 학술논문 게재 활동"');
    expect(doctorData).not.toContain('title: "EADV Congress Milan 2022 연수 및 발표"');
    expect(doctorData).not.toContain("https://www.kskin.kr/Kskin/staff");
    expect(doctorData).not.toContain("SCI/SCI-E급 논문 8편");
    expect(doctorData).not.toContain("국내학술논문 22편");
    expect(doctorData).not.toContain("RID=2232149");
  });
});

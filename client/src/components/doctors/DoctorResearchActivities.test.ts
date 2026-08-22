import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const doctorData = readFileSync(resolve(process.cwd(), "client/src/lib/doctors-data.ts"), "utf8");
const credentials = readFileSync(resolve(process.cwd(), "client/src/components/doctors/DoctorCredentials.tsx"), "utf8");

describe("Doctor research activities disclosure contract", () => {
  it("stores identity-verified activity records with an external source per doctor", () => {
    expect(doctorData).toContain("researchActivities?:");
    expect(doctorData).toContain('slug: "cho"');
    expect(doctorData).toContain('slug: "woo"');
    expect(doctorData).toContain('slug: "lee"');
    expect(doctorData).toContain("16681657");
    expect(doctorData).toContain("ART000885244");
    expect(doctorData).toContain("RID=2232149");
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

  it("keeps visible activity titles concise without years or coauthor lists", () => {
    expect(doctorData).toContain('title: "액취증·다한증 치료 연구"');
    expect(doctorData).toContain('title: "분절상 신경섬유종증 증례 보고"');
    expect(doctorData).toContain('title: "동상의 임상·조직병리학적 특성 연구"');
  });
});

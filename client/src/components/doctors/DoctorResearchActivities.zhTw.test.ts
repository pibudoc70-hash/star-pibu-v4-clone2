import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const doctorData = readFileSync(resolve(projectRoot, "client/src/lib/doctors-data.ts"), "utf8");
const viewModel = readFileSync(resolve(projectRoot, "client/src/hooks/useDoctorViewModel.ts"), "utf8");
const credentials = readFileSync(resolve(projectRoot, "client/src/components/doctors/DoctorCredentials.tsx"), "utf8");
const localeData = readFileSync(resolve(projectRoot, "client/src/lib/doctorResearchI18n.ts"), "utf8");

describe("zh-TW doctor research activities", () => {
  it("uses verified Traditional Chinese research copy from the shared locale table", () => {
    expect(doctorData).toContain('id: "cho-bromhidrosis"');
    expect(doctorData).toContain('id: "woo-neurofibromatosis"');
    expect(localeData).toContain('"zh-TW"');
    expect(localeData).toContain("腋臭與多汗症治療研究");
    expect(localeData).toContain("頭皮節段型神經纖維瘤症病例報告");
    expect(localeData).toContain("研究・發表與進修活動");
    expect(viewModel).toContain("DOCTOR_RESEARCH_I18N[lang]");
    expect(viewModel).toContain("localizedItems?.find");
  });

  it("renders the localized research heading while retaining the original disclosure structure", () => {
    expect(credentials).toContain("doctor.researchActivitiesTitle");
    expect(credentials).toContain("<details");
    expect(credentials).toContain("<summary");
  });
});

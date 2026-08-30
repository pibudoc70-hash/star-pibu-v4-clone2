import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const doctorData = readFileSync(resolve(projectRoot, "client/src/lib/doctors-data.ts"), "utf8");
const viewModel = readFileSync(resolve(projectRoot, "client/src/hooks/useDoctorViewModel.ts"), "utf8");
const credentials = readFileSync(resolve(projectRoot, "client/src/components/doctors/DoctorCredentials.tsx"), "utf8");

describe("zh-TW doctor research activities", () => {
  it("uses verified Traditional Chinese research data only for the zh-TW view model", () => {
    expect(doctorData).toContain("researchActivitiesZhTw");
    expect(doctorData).toContain("腋臭與多汗症治療研究");
    expect(doctorData).toContain("頭皮節段型神經纖維瘤症病例報告");
    expect(viewModel).toContain('lang === "zh-TW" && d.researchActivitiesZhTw');
    expect(viewModel).toContain("? d.researchActivitiesZhTw");
    expect(viewModel).toContain("研究・發表與進修活動");
  });

  it("renders the localized research heading while retaining the original disclosure structure", () => {
    expect(credentials).toContain("doctor.researchActivitiesTitle ?? \"연구·발표 및 연수 활동\"");
    expect(credentials).toContain("<details");
    expect(credentials).toContain("<summary");
  });
});

import { describe, expect, it } from "vitest";
import { doctors } from "@/lib/doctors-data";
import { DOCTOR_RESEARCH_I18N } from "@/lib/doctorResearchI18n";
import type { Lang } from "@/lib/i18n.types";

const locales: Lang[] = ["ko", "en", "ja", "zh", "zh-TW"];
const doctorsWithResearch = doctors.filter((doctor) => (doctor.researchActivities?.length ?? 0) > 0);

describe("Doctor research activity locale coverage", () => {
  it("provides a non-empty localized heading for every supported site language", () => {
    for (const locale of locales) {
      expect(DOCTOR_RESEARCH_I18N[locale].title.trim()).not.toBe("");
    }
  });

  it("covers every verified research record for every language without changing the source URL", () => {
    for (const locale of locales) {
      for (const doctor of doctorsWithResearch) {
        const localizedRecords = DOCTOR_RESEARCH_I18N[locale].activities.find((entry) => entry.id === doctor.id)?.items ?? [];
        expect(localizedRecords.map((record) => record.id)).toEqual(doctor.researchActivities?.map((record) => record.id));
        expect(localizedRecords.every((record) => record.title.trim() && record.detail.trim() && record.sourceLabel.trim())).toBe(true);
      }
    }
  });

  it("keeps locale text separate from the verified URL records", () => {
    expect(DOCTOR_RESEARCH_I18N.en.activities[0]?.items[0]?.title).toContain("Bromhidrosis");
    expect(DOCTOR_RESEARCH_I18N.ja.activities[0]?.items[0]?.title).toContain("腋臭");
    expect(DOCTOR_RESEARCH_I18N.zh.activities[0]?.items[0]?.title).toContain("腋臭");
    expect(DOCTOR_RESEARCH_I18N["zh-TW"].activities[0]?.items[0]?.title).toContain("腋臭");
    expect(DOCTOR_RESEARCH_I18N.en.activities[0]?.items[0]).not.toHaveProperty("sourceUrl");
  });
});

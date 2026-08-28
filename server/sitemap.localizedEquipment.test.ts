import { describe, expect, it } from "vitest";
import type { Equipment3Item } from "../drizzle/schema";
import { buildLocalizedEquipmentEntries } from "./sitemap";

const completeFaq = JSON.stringify([{ question: "Question", answer: "Answer" }]);

function makeEquipment(overrides: Partial<Equipment3Item> = {}): Equipment3Item {
  return {
    id: 1,
    slug: "ultherapy-prime",
    name: "울쎄라피 프라임",
    desc: "한국어 소개",
    faqs: completeFaq,
    nameEn: "Ultherapy Prime",
    descEn: "English description",
    faqsEn: completeFaq,
    nameJa: "ウルセラピープライム",
    descJa: "日本語の説明",
    faqsJa: completeFaq,
    nameZh: "超声刀Prime",
    descZh: "中文介绍",
    faqsZh: completeFaq,
    nameZhTw: "超聲刀Prime",
    descZhTw: "繁體中文介紹",
    faqsZhTw: completeFaq,
    updatedAt: new Date("2026-08-28T00:00:00.000Z"),
    ...overrides,
  } as Equipment3Item;
}

describe("localized equipment sitemap eligibility", () => {
  it("emits every locale route only when title, description, and FAQ are all localized", () => {
    const entries = buildLocalizedEquipmentEntries([makeEquipment()]);

    expect(entries.map((entry) => entry.path)).toEqual([
      "/en/equipment3/ultherapy-prime",
      "/ja/equipment3/ultherapy-prime",
      "/zh/equipment3/ultherapy-prime",
      "/zh-tw/equipment3/ultherapy-prime",
    ]);
  });

  it("excludes only an incomplete locale instead of falling back to Korean content", () => {
    const entries = buildLocalizedEquipmentEntries([makeEquipment({ faqsZhTw: null })]);

    expect(entries.map((entry) => entry.path)).not.toContain("/zh-tw/equipment3/ultherapy-prime");
    expect(entries).toHaveLength(3);
  });
});

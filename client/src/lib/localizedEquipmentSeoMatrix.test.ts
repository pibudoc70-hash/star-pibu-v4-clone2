import type { Equipment3Item } from "../../../drizzle/schema";
import { describe, expect, it } from "vitest";
import { buildLocalizedEquipmentEntries } from "../../../server/sitemap";
import { getLocalizedUrl } from "./localizedPath";
import { BASE_URL, buildHreflangs } from "./seoHelpers";

type Locale = "ko" | "en" | "ja" | "zh" | "zh-TW";

const LOCALES: Array<{ locale: Locale; prefix: string }> = [
  { locale: "ko", prefix: "" },
  { locale: "en", prefix: "/en" },
  { locale: "ja", prefix: "/ja" },
  { locale: "zh", prefix: "/zh" },
  { locale: "zh-TW", prefix: "/zh-tw" },
];

const completeFaq = JSON.stringify([{ question: "Question", answer: "Answer" }]);

function makeEquipment(overrides: Partial<Equipment3Item> = {}): Equipment3Item {
  return {
    id: 1,
    slug: "existing-device",
    name: "기존 장비",
    desc: "한국어 소개",
    faqs: completeFaq,
    nameEn: "Existing device",
    descEn: "English description",
    faqsEn: completeFaq,
    nameJa: "既存機器",
    descJa: "日本語の説明",
    faqsJa: completeFaq,
    nameZh: "现有设备",
    descZh: "简体中文介绍",
    faqsZh: completeFaq,
    nameZhTw: "現有設備",
    descZhTw: "繁體中文介紹",
    faqsZhTw: completeFaq,
    updatedAt: new Date("2026-08-28T00:00:00.000Z"),
    ...overrides,
  } as Equipment3Item;
}

function localizedEquipmentPath(locale: Locale, slug: string): string {
  const prefix = LOCALES.find((candidate) => candidate.locale === locale)?.prefix;
  if (prefix === undefined) throw new Error(`Unsupported locale: ${locale}`);
  return `${prefix}/equipment3/${slug}`;
}

const equipmentFixtures = [
  makeEquipment(),
  makeEquipment({ id: 2, slug: "newly-added-device" }),
  makeEquipment({ id: 3, slug: "missing-traditional-faq", faqsZhTw: null }),
];
const localizedEntries = buildLocalizedEquipmentEntries(equipmentFixtures);
const indexedSlugs = [...new Set(
  localizedEntries
    .filter((entry) => entry.path.startsWith("/en/equipment3/"))
    .map((entry) => decodeURIComponent(entry.path.split("/").at(-1) ?? "")),
)];

describe("active localized equipment detail SEO URL matrix", () => {
  it("derives the test targets from the shared sitemap eligibility helper instead of a manually maintained slug list", () => {
    expect(indexedSlugs).toEqual(["existing-device", "newly-added-device", "missing-traditional-faq"]);
    expect(localizedEntries).toContainEqual(expect.objectContaining({ path: "/zh-tw/equipment3/newly-added-device" }));
    expect(localizedEntries).not.toContainEqual(expect.objectContaining({ path: "/zh-tw/equipment3/missing-traditional-faq" }));
  });

  it.each(indexedSlugs)("keeps canonical and hreflang contracts for automatically included %s", (slug) => {
    const paths = Object.fromEntries(
      LOCALES.map(({ locale }) => [locale, localizedEquipmentPath(locale, slug)]),
    ) as Record<Locale, string>;
    const hreflangs = buildHreflangs(paths.ko, paths.en, paths.ja, paths.zh, paths["zh-TW"]);

    expect(hreflangs).toEqual([
      { hreflang: "ko", href: `${BASE_URL}${paths.ko}` },
      { hreflang: "en", href: `${BASE_URL}${paths.en}` },
      { hreflang: "ja", href: `${BASE_URL}${paths.ja}` },
      { hreflang: "zh", href: `${BASE_URL}${paths.zh}` },
      { hreflang: "zh-TW", href: `${BASE_URL}${paths["zh-TW"]}` },
      { hreflang: "x-default", href: `${BASE_URL}${paths.ko}` },
    ]);

    LOCALES.forEach(({ locale }) => {
      const canonical = getLocalizedUrl(locale, `/equipment3/${slug}`);
      expect(canonical).toBe(`${BASE_URL}${paths[locale]}`);
      expect(canonical).not.toContain("?");
      expect(canonical).not.toContain("#");
    });
  });
});

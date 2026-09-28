export const HOME_SECTION_FALLBACKS = {
  specialEvent: { minH: "min-h-[640px]", layout: "cards-3", bg: "var(--home-section-bg-b)" },
  doctors: { minH: "min-h-[520px]", layout: "cards-3", bg: "var(--home-section-bg-a)" },
  treatments: { minH: "min-h-[720px]", layout: "cards-3", bg: "var(--home-section-bg-b)" },
  managementDevices: { minH: "min-h-[560px]", layout: "cards-4", bg: "var(--home-section-bg-a)" },
  philosophy: { minH: "min-h-[400px]", layout: "stats", bg: "var(--home-section-bg-b)" },
  results: { minH: "min-h-[440px]", layout: "cards-3", bg: "var(--home-section-bg-a)" },
  facility: { minH: "min-h-[560px]", layout: "gallery", bg: "var(--home-section-bg-b)" },
  youtube: { minH: "min-h-[400px]", bg: "var(--home-section-bg-a)" },
  faq: { minH: "min-h-[560px]", layout: "list", bg: "var(--home-section-bg-b)" },
  notices: { minH: "min-h-[300px]", layout: "list", bg: "#FAF8F5" },
} as const;

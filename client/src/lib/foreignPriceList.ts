export type ForeignPriceItem = {
  name: string;
  details?: string;
  price: string;
  note?: string;
};

export type ForeignPriceCategory = {
  id: string;
  label: string;
  items: ForeignPriceItem[];
};

/** Public read-only source: 가격표260808 sheet, dated 2026.08.13. */
export const FOREIGN_PRICE_LIST_UPDATED = "August 13, 2026";

export const FOREIGN_PRICE_CATEGORIES: ForeignPriceCategory[] = [
  {
    id: "lifting",
    label: "Lifting",
    items: [
      { name: "Ultherapy Prime", details: "100 lines", price: "₩440,000" },
      { name: "Ultherapy Prime", details: "300 lines", price: "₩1,320,000" },
      { name: "Ultherapy Prime", details: "600 lines", price: "₩2,400,000", note: "Includes Ultra Duo + hydration therapy" },
      { name: "Thermage FLX", details: "Face · 600 shots", price: "₩2,400,000" },
      { name: "Thermage FLX", details: "Eye · 450 shots", price: "₩1,400,000" },
      { name: "XERF", details: "300 shots", price: "₩1,000,000" },
      { name: "XERF", details: "600 shots", price: "₩1,900,000", note: "Includes Ultra Duo + hydration therapy" },
      { name: "ONDA", details: "From 100 kJ", price: "₩770,000" },
      { name: "TenTherma", details: "300 shots", price: "₩500,000" },
      { name: "TenTherma", details: "600 shots", price: "₩990,000" },
      { name: "Shurink", details: "100 shots", price: "₩140,000" },
      { name: "Sedation fee", details: "Per lifting procedure", price: "₩110,000", note: "Separate fee for lifting procedures" },
    ],
  },
  {
    id: "pigmentation",
    label: "Pigmentation",
    items: [
      { name: "Lumenis M22", details: "Includes care", price: "₩330,000" },
      { name: "Pico + Excel V", details: "Includes care", price: "₩330,000" },
    ],
  },
  {
    id: "acne",
    label: "Acne",
    items: [
      { name: "Capri + scaling", details: "Includes care", price: "₩200,000" },
      { name: "PTT", details: "Includes care", price: "₩330,000" },
      { name: "AviClear", details: "Includes care", price: "₩1,500,000" },
    ],
  },
  {
    id: "pores-scars",
    label: "Pores, scars & fine lines",
    items: [
      { name: "UltraPulse + DRT + Skinjet", details: "Includes soothing care", price: "₩1,200,000" },
      { name: "Virtue RF", details: "Includes soothing care", price: "₩440,000" },
      { name: "RASMD Ultra", details: "Includes soothing care", price: "₩600,000" },
      { name: "Skinjet + Juvelook", details: "3 cc · Includes soothing care", price: "₩800,000" },
    ],
  },
  {
    id: "redness-vessels",
    label: "Redness & vessels",
    items: [{ name: "Excel V Plus + Adva", details: "Includes care", price: "₩770,000" }],
  },
  {
    id: "skin-boosters",
    label: "Skin boosters",
    items: [
      { name: "Rejuran (face) + water glow + skin Botox", price: "₩600,000" },
      { name: "Rejuran (eye)", price: "₩240,000" },
      { name: "Sculptra", price: "₩1,200,000" },
      { name: "Juvelook Volume", price: "₩840,000" },
      { name: "Lituo", price: "₩960,000" },
    ],
  },
  {
    id: "botox",
    label: "Botox",
    items: [
      { name: "Forehead / masseter", details: "Domestic / imported", price: "₩88,000 / ₩300,000" },
      { name: "Eye area / glabella / nasal bridge / masseter / mouth corner", details: "Domestic / imported", price: "₩55,000 / ₩165,000" },
    ],
  },
  {
    id: "fillers",
    label: "Fillers",
    items: [
      { name: "Bellast", details: "Domestic · per 1 cc", price: "₩200,000" },
      { name: "Restylane", details: "Imported · per 1 cc", price: "₩330,000" },
    ],
  },
  {
    id: "other",
    label: "Other",
    items: [
      { name: "Spot / dark spot / age spot", details: "Partial removal · per area", price: "₩11,000–₩110,000" },
      { name: "White injection", price: "₩80,000" },
      { name: "Vitamin injection", price: "₩80,000" },
    ],
  },
];

export type ForeignPriceLocale = "en" | "ja" | "zh" | "zh-TW";

type LocalizedPriceText = {
  categoryLabels: string[];
  names: Record<string, string>;
  details: Record<string, string>;
  notes: Record<string, string>;
};

const LOCALIZED_PRICE_TEXT: Record<Exclude<ForeignPriceLocale, "en">, LocalizedPriceText> = {
  ja: {
    categoryLabels: ["リフティング", "シミ・そばかす", "ニキビ", "毛穴・傷跡・小じわ", "赤み・血管", "スキンブースター", "ボトックス", "フィラー", "その他"],
    names: {
      "Sedation fee": "睡眠麻酔費", "Capri + scaling": "カプリ＋スケーリング", "Skinjet + Juvelook": "スキンジェット＋ジュベルック",
      "Redness & vessels": "赤み・血管", "White injection": "白玉注射", "Vitamin injection": "ビタミン注射",
      "Spot / dark spot / age spot": "ほくろ・シミ・老人性色素斑",
    },
    details: {
      "100 lines": "100ライン", "300 lines": "300ライン", "600 lines": "600ライン", "Face · 600 shots": "顔 · 600ショット", "Eye · 450 shots": "目元 · 450ショット",
      "300 shots": "300ショット", "600 shots": "600ショット", "From 100 kJ": "100 kJ〜", "Per lifting procedure": "リフティング施術ごと",
      "Includes care": "ケア込み", "Includes soothing care": "鎮静ケア込み", "3 cc · Includes soothing care": "3 cc · 鎮静ケア込み",
      "Domestic / imported": "国内製 / 輸入製", "Domestic · per 1 cc": "国内製 · 1 ccあたり", "Imported · per 1 cc": "輸入製 · 1 ccあたり", "Partial removal · per area": "部分除去 · 部位ごと",
    },
    notes: { "Includes Ultra Duo + hydration therapy": "ウルトラデュオ＋保湿・鎮静ケア込み", "Separate fee for lifting procedures": "リフティング施術時は別途必要" },
  },
  zh: {
    categoryLabels: ["提升紧致", "色斑·暗沉", "痘痘", "毛孔·痘疤·细纹", "泛红·血管", "水光针", "肉毒杆菌", "玻尿酸填充", "其他"],
    names: {
      "Sedation fee": "睡眠麻醉费", "Capri + scaling": "Capri＋清洁管理", "Skinjet + Juvelook": "Skinjet＋Juvelook",
      "White injection": "白玉注射", "Vitamin injection": "维生素注射", "Spot / dark spot / age spot": "痣·色斑·老年斑",
    },
    details: {
      "100 lines": "100发", "300 lines": "300发", "600 lines": "600发", "Face · 600 shots": "面部 · 600发", "Eye · 450 shots": "眼周 · 450发",
      "300 shots": "300发", "600 shots": "600发", "From 100 kJ": "100 kJ起", "Per lifting procedure": "每项提升治疗",
      "Includes care": "含管理", "Includes soothing care": "含镇静管理", "3 cc · Includes soothing care": "3 cc · 含镇静管理",
      "Domestic / imported": "国产 / 进口", "Domestic · per 1 cc": "国产 · 每1 cc", "Imported · per 1 cc": "进口 · 每1 cc", "Partial removal · per area": "局部去除 · 每部位",
    },
    notes: { "Includes Ultra Duo + hydration therapy": "含Ultra Duo＋补水舒缓管理", "Separate fee for lifting procedures": "提升治疗需另付" },
  },
  "zh-TW": {
    categoryLabels: ["拉提緊緻", "斑點·暗沉", "痘痘", "毛孔·痘疤·細紋", "泛紅·血管", "肌膚增生療程", "肉毒桿菌", "玻尿酸填充", "其他"],
    names: {
      "Sedation fee": "睡眠麻醉費", "Capri + scaling": "Capri＋深層清潔管理", "Skinjet + Juvelook": "Skinjet＋Juvelook",
      "White injection": "白玉注射", "Vitamin injection": "維他命注射", "Spot / dark spot / age spot": "痣·斑點·老人斑",
    },
    details: {
      "100 lines": "100發", "300 lines": "300發", "600 lines": "600發", "Face · 600 shots": "臉部 · 600發", "Eye · 450 shots": "眼周 · 450發",
      "300 shots": "300發", "600 shots": "600發", "From 100 kJ": "100 kJ起", "Per lifting procedure": "每項拉提療程",
      "Includes care": "含管理", "Includes soothing care": "含舒緩管理", "3 cc · Includes soothing care": "3 cc · 含舒緩管理",
      "Domestic / imported": "國產 / 進口", "Domestic · per 1 cc": "國產 · 每1 cc", "Imported · per 1 cc": "進口 · 每1 cc", "Partial removal · per area": "局部去除 · 每部位",
    },
    notes: { "Includes Ultra Duo + hydration therapy": "含Ultra Duo＋保濕舒緩管理", "Separate fee for lifting procedures": "拉提療程需另付" },
  },
};

export function getLocalizedForeignPriceCategories(locale: ForeignPriceLocale): ForeignPriceCategory[] {
  if (locale === "en") return FOREIGN_PRICE_CATEGORIES;
  const localized = LOCALIZED_PRICE_TEXT[locale];

  return FOREIGN_PRICE_CATEGORIES.map((category, categoryIndex) => ({
    ...category,
    label: localized.categoryLabels[categoryIndex] ?? category.label,
    items: category.items.map((item) => ({
      ...item,
      name: localized.names[item.name] ?? item.name,
      details: item.details ? localized.details[item.details] ?? item.details : undefined,
      note: item.note ? localized.notes[item.note] ?? item.note : undefined,
    })),
  }));
}

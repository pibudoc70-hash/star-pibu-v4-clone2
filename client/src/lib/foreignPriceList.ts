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

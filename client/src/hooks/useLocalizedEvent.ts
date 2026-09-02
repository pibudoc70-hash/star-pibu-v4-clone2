/**
 * useLocalizedEvent
 * SpecialEventSection에서 추출한 다국어 텍스트 조회 로직.
 * 언어 코드(en/ja/zh/ko)에 따라 이벤트 필드의 현지화 텍스트를 반환한다.
 */
import { useLang } from "@/contexts/LangContext";

export interface SpecialEvent {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  content: string;
  productName: string;
  normalPrice: number;
  discountPrice: number;
  priceRows?: string; // JSON 문자열
  imageUrl?: string;
  cta: string;
  isActive: "0" | "1";
  isFeatured?: "0" | "1";
  sortOrder: number;
  anesthesiaFee?: string;
  targetLang?: string;
  updatedAt?: Date | number | null;
  titleEn?: string; titleJa?: string; titleZh?: string;
  subtitleEn?: string; subtitleJa?: string; subtitleZh?: string;
  descEn?: string; descJa?: string; descZh?: string;
  productNameEn?: string; productNameJa?: string; productNameZh?: string;
}

export interface PriceRow {
  label: string;
  normalPrice: number;
  discountPrice: number;
}

type LocalizableField = "title" | "subtitle" | "desc" | "productName";

const FIELD_SUFFIX_MAP: Record<string, keyof SpecialEvent> = {
  titleEn: "titleEn", titleJa: "titleJa", titleZh: "titleZh",
  subtitleEn: "subtitleEn", subtitleJa: "subtitleJa", subtitleZh: "subtitleZh",
  descEn: "descEn", descJa: "descJa", descZh: "descZh",
  productNameEn: "productNameEn", productNameJa: "productNameJa", productNameZh: "productNameZh",
};

/**
 * 이벤트 객체에서 현재 언어에 맞는 텍스트를 반환한다.
 * 현지화 텍스트가 없으면 한국어(기본값)로 폴백한다.
 */
export function useLocalizedEvent() {
  const { lang } = useLang();

  const getLocalizedText = (event: SpecialEvent, field: LocalizableField): string => {
    // zh-TW: titleZh/subtitleZh/descZh 필드를 우선 사용 (번체 전용 필드 없음)
    if (lang === "zh-TW") {
      const zhKey = FIELD_SUFFIX_MAP[field + "Zh"];
      const zhText = zhKey ? (event[zhKey] as string | undefined) : undefined;
      return zhText || event[field] || "";
    }
    const suffix = lang === "en" ? "En" : lang === "ja" ? "Ja" : lang === "zh" ? "Zh" : null;
    if (suffix) {
      const key = FIELD_SUFFIX_MAP[field + suffix];
      const localized = key ? (event[key] as string | undefined) : undefined;
      return localized || event[field] || "";
    }
    return event[field] || "";
  };

  return { getLocalizedText, lang };
}

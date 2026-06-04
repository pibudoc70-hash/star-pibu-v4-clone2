/**
 * equipmentSeoText.ts
 * Equipment2Detail 페이지의 다국어 SEO 메타 텍스트 생성 헬퍼.
 *
 * 표기 통일 기준 (PR-25):
 *   ko: 부산 서면 스타피부과
 *   en: Star Dermatology, Seomyeon, Busan
 *   ja: 釜山西面 スター皮膚科
 *   zh: 釜山西面 STAR 皮肤科
 *
 * Forbidden strings: Fukuoka (JP city), Noge-area references, incorrect clinic names
 */

import type { Lang } from "@/lib/i18n";
import type { Treatment } from "@shared/types";

/** alias for readability */
type SupportedLang = Lang;

/** lang 기반 name fallback: ja → nameJa > nameEn > name 등 */
function pickName(t: Treatment, lang: SupportedLang): string {
  if (lang === "en") return t.nameEn || t.name;
  if (lang === "ja") return t.nameJa || t.nameEn || t.name;
  if (lang === "zh") return t.nameZh || t.nameEn || t.name;
  return t.name;
}

/** lang 기반 desc fallback */
function pickDesc(t: Treatment, lang: SupportedLang): string {
  if (lang === "en") return t.descEn || t.desc || "";
  if (lang === "ja") return t.descJa || t.descEn || t.desc || "";
  if (lang === "zh") return t.descZh || t.descEn || t.desc || "";
  return t.desc || "";
}

export interface EquipmentSeoMeta {
  title: string;
  description: string;
  keywords: string;
}

/**
 * getEquipmentSeoText
 * 시술 데이터와 현재 언어를 받아 SEO 메타 텍스트를 반환한다.
 */
export function getEquipmentSeoText(
  treatment: Treatment,
  lang: Lang
): EquipmentSeoMeta {
  const name = pickName(treatment, lang);
  const desc = pickDesc(treatment, lang);

  switch (lang) {
    case "en":
      return {
        title: `${name} | Star Dermatology, Seomyeon, Busan`,
        description: `Star Dermatology Clinic in Seomyeon, Busan offers ${name}. ${desc} Performed by board-certified dermatologist. Online booking available.`,
        keywords: `${name}, Busan dermatology, Star Dermatology, Seomyeon dermatologist, skin treatment Busan`,
      };

    case "ja":
      return {
        title: `${name} | 釜山西面 スター皮膚科`,
        description: `釜山西面スター皮膚科の${name}施術案内。${desc} 皮膚科専門医が直接施術。オンライン予約可能。`,
        keywords: `${name}, 釜山皮膚科, 西面皮膚科, スター皮膚科, 韓国皮膚科`,
      };

    case "zh":
      return {
        title: `${name} | 釜山西面 STAR 皮肤科`,
        description: `釜山西面STAR皮肤科${name}项目介绍。${desc} 由皮肤科专科医生亲自操作。可在线预约。`,
        keywords: `${name}, 釜山皮肤科, 西面皮肤科, STAR皮肤科, 韩国皮肤科`,
      };

    case "ko":
    default:
      return {
        title: `${treatment.name} | 부산 서면 스타피부과 - 피부과 전문의 시술`,
        description: `부산 서면 스타피부과의 ${treatment.name} 시술 안내. ${treatment.desc || ""} 피부과 전문의가 직접 시술합니다. 온라인 예약 가능.`,
        keywords: `${treatment.name}, ${treatment.nameEn || ""}, 부산피부과, 스타피부과, 서면피부과, 피부과전문의, ${treatment.categoryId || "피부시술"}, 부산리프팅`,
      };
  }
}

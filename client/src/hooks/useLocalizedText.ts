/**
 * useLocalizedText
 * 현재 언어에 맞는 텍스트를 반환하는 공통 hook
 *
 * 사용 컴포넌트:
 *   - TreatmentCard.tsx
 *   - TreatmentsEquipmentSection.tsx
 *   - ManagementDevicesSection.tsx
 *
 * 이 Hook이 해결하는 문제:
 *   - getText(ko, en, ja, zh) 함수가 3개 컴포넌트에 독립적으로 정의됨
 *   - 언어 분기 로직이 분산되어 수정 시 3곳을 모두 변경해야 함
 */
import { useLang } from "@/contexts/LangContext";

export function useLocalizedText() {
  const { lang } = useLang();

  /**
   * 현재 언어에 맞는 텍스트 반환
   * @param ko 한국어 기본값 (fallback)
   * @param en 영어 번역 (없으면 ko 사용)
   * @param ja 일본어 번역 (없으면 ko 사용)
   * @param zh 중국어 번역 (없으면 ko 사용)
   */
  const getText = (
    ko: string | null | undefined,
    en?: string | null,
    ja?: string | null,
    zh?: string | null
  ): string => {
    const base = ko ?? "";
    if (lang === "en") return en || base;
    if (lang === "ja") return ja || base;
    if (lang === "zh") return zh || base;
    return base;
  };

  return { lang, getText };
}

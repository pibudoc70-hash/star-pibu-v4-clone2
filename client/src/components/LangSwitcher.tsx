/**
 * LangSwitcher - 심플 국기 전환 버튼
 * 디자인: 일본/중국 국기만 표시, 클릭 시 해당 언어로 전환
 * 기본값 한국어 - 한국어일 때는 일/중 국기만 노출
 * 위치: 화면 우측 하단 고정
 */
import { useLang } from "@/contexts/LangContext";
import { Lang } from "@/lib/i18n";

// LangSwitcher는 FloatingCTA에 통합되었습니다.
// 이 컴포넌트는 하위 호환성을 위해 유지하되 아무것도 렌더링하지 않습니다.
export default function LangSwitcher() {
  return null;
}

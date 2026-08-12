/**
 * useScrollEnd — scrollend 이벤트 기반 콜백 실행 훅
 *
 * [P0-3] TreatmentsEquipmentSection.tsx에서 추출:
 *   - scrollend 이벤트 지원 브라우저: 스크롤 완료 시 즉시 콜백 실행
 *   - scrollend 미지원 브라우저: fallbackMs 후 폴백 실행
 *   - 누수 방지: 두 경로 모두 정확히 한 번만 실행 + 타이머/리스너 cleanup 보장
 *
 * 사용 예:
 *   const scrollAndFocus = useScrollEnd(targetRef, () => btnRef.current?.focus());
 *   scrollAndFocus(); // 호출 시 scrollIntoView + 완료 후 콜백
 */
import { useCallback, useEffect, useRef } from "react";

/** scrollend 이벤트 지원 여부 (SSR-safe) */
const supportsScrollEnd =
  typeof window !== "undefined" && "onscrollend" in window;

/**
 * @param targetRef  스크롤 대상 요소 ref
 * @param onSettled  스크롤 완료 후 실행할 콜백
 * @param fallbackMs scrollend 미지원 브라우저에서 폴백 대기 시간 (기본 500ms)
 * @returns          스크롤을 시작하는 함수
 */
export function useScrollEnd(
  targetRef: React.RefObject<HTMLElement | null>,
  onSettled: () => void,
  fallbackMs = 500,
): () => void {
  // 최신 콜백을 ref로 유지 (stale closure 방지)
  const onSettledRef = useRef(onSettled);
  useEffect(() => {
    onSettledRef.current = onSettled;
  }, [onSettled]);

  return useCallback(() => {
    const target = targetRef.current;
    if (!target) {
      // 타겟 없으면 즉시 콜백 실행
      onSettledRef.current();
      return;
    }

    let settled = false;
    let fallbackTimer: number | null = null;

    const settle = () => {
      if (settled) return;
      settled = true;
      // 폴백 타이머 정리 (scrollend가 먼저 발생한 경우)
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      onSettledRef.current();
    };

    if (supportsScrollEnd) {
      target.addEventListener("scrollend", settle, { once: true });
    }

    // 폴백 타이머: scrollend 미지원 브라우저 또는 스크롤이 없는 경우 대비
    fallbackTimer = window.setTimeout(() => {
      // scrollend 리스너 명시적 제거 (once: true이지만 안전을 위해)
      target.removeEventListener("scrollend", settle);
      settle();
    }, fallbackMs);

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [targetRef, fallbackMs]);
}

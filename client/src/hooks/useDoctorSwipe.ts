/**
 * useDoctorSwipe — 의사 섹션 터치 스와이프 인터랙션 훅
 *
 * [R18-P0-3] useDoctorViewModel에서 swipe 로직을 별도 훅으로 분리
 *
 * 책임:
 * - 터치 시작/종료 이벤트 처리
 * - 수평 스와이프 감지 (dx > dy && dx > 40px)
 * - 스와이프 방향에 따라 onSwipeLeft / onSwipeRight 콜백 호출
 *
 * 사용 예:
 * ```tsx
 * const { handleTouchStart, handleTouchEnd } = useDoctorSwipe({
 *   onSwipeLeft: () => setActiveDoctor((prev) => (prev + 1) % total),
 *   onSwipeRight: () => setActiveDoctor((prev) => (prev - 1 + total) % total),
 * });
 * ```
 */
import { useRef, useCallback } from "react";
import type React from "react";

interface UseDoctorSwipeOptions {
  /** 왼쪽 스와이프 (다음 항목) 콜백 */
  onSwipeLeft: () => void;
  /** 오른쪽 스와이프 (이전 항목) 콜백 */
  onSwipeRight: () => void;
  /** 스와이프 감지 최소 수평 거리 (px). 기본값: 40 */
  threshold?: number;
}

export interface UseDoctorSwipeReturn {
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

export function useDoctorSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 40,
}: UseDoctorSwipeOptions): UseDoctorSwipeReturn {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      // 수평 스와이프만 처리 (수직 스크롤과 구분)
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        if (dx < 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [onSwipeLeft, onSwipeRight, threshold],
  );

  return { handleTouchStart, handleTouchEnd };
}

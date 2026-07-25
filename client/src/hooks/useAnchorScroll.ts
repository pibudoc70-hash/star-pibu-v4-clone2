/**
 * useAnchorScroll
 *
 * lazy 마운트 · 이미지 로드로 인한 레이아웃 시프트에 대응하는 앵커 스크롤 훅.
 *
 * 동작:
 * 1) 페이지 하단으로 즉시 이동 → 모든 lazy 섹션 강제 마운트 (deferMount 우회)
 * 2) 대상 요소가 나타날 때까지 150ms 간격으로 폴링 (최대 maxWaitMs)
 * 3) 등장하면 1차 smooth 스크롤
 * 4) 이후 좌표를 계속 재계산하여, 이동했으면 재스크롤
 * 5) 좌표가 2회 연속 안정(drift < threshold)되면 종료
 *
 * 기존 문제: 좌표를 1회만 계산하여 아래쪽 lazy 섹션이 마운트되면 목적지가 어긋났다.
 */
import { useCallback, useEffect, useRef } from "react";

/** 헤더 높이 + 여유 간격을 계산한다 (fixed 헤더가 대상을 가리는 것 방지) */
function getHeaderOffset(): number {
  const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
  return header ? header.offsetHeight + 8 : 80;
}

export type AnchorScrollBlock = "start" | "center";

interface ScrollOptions {
  /** 뷰포트 정렬 방식. 기본 "start" (헤더 아래 정렬) */
  block?: AnchorScrollBlock;
  /** 요소 등장 대기 최대 시간(ms). 기본 6000 */
  maxWaitMs?: number;
  /** 좌표 재보정 판정 임계값(px). 기본 6 */
  driftThreshold?: number;
  /**
   * true이면 폴링 시작 전 페이지 하단으로 즉시 이동하여
   * deferMount/Suspense 기반 lazy 섹션을 강제 마운트한다.
   * 기본 true.
   */
  triggerLazyMount?: boolean;
}

export function useAnchorScroll() {
  const activeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cancel = useCallback(() => {
    if (activeRef.current) {
      clearInterval(activeRef.current);
      activeRef.current = null;
    }
  }, []);

  const scrollToSelector = useCallback(
    (selector: string, opts: ScrollOptions = {}) => {
      const {
        block = "start",
        maxWaitMs = 6000,
        driftThreshold = 6,
        triggerLazyMount = true,
      } = opts;

      cancel();

      const getTargetTop = (): number | null => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        if (block === "center") {
          return rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
        }
        return rect.top + window.scrollY - getHeaderOffset();
      };

      // deferMount/Suspense 기반 lazy 섹션 강제 마운트:
      // 페이지 하단으로 즉시 이동하면 IntersectionObserver가 트리거되어
      // 아직 마운트되지 않은 섹션들이 모두 렌더링된다.
      if (triggerLazyMount) {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
      }

      let firstDone = false;
      let lastTop: number | null = null;
      let stableCount = 0;
      let ticks = 0;
      const maxTicks = Math.ceil(maxWaitMs / 150);

      const iv = setInterval(() => {
        ticks += 1;
        const top = getTargetTop();

        if (top === null) {
          if (ticks >= maxTicks) cancel();
          return;
        }

        if (!firstDone) {
          firstDone = true;
          lastTop = top;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
          return;
        }

        const drift = lastTop === null ? 0 : Math.abs(top - lastTop);
        lastTop = top;

        if (drift < driftThreshold) {
          stableCount += 1;
          if (stableCount >= 2) {
            if (Math.abs(window.scrollY - top) > 10) {
              window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
            }
            cancel();
            return;
          }
        } else {
          stableCount = 0;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }

        if (ticks >= maxTicks) cancel();
      }, 150);

      activeRef.current = iv;
    },
    [cancel],
  );

  useEffect(() => cancel, [cancel]);

  return { scrollToSelector, cancel };
}

/**
 * useAnchorScroll
 *
 * Lazy section anchor 이동을 지원하는 스크롤 훅.
 * 아직 mount되지 않은 대상에는 명시적 mount event를 전달하고,
 * 렌더 직후 한 번의 보정만 수행해 하단 jump·interval polling을 피한다.
 */
import { useCallback, useEffect, useRef } from "react";

function getHeaderOffset(): number {
  const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
  return header ? header.offsetHeight + 8 : 80;
}

export type AnchorScrollBlock = "start" | "center";

interface ScrollOptions {
  block?: AnchorScrollBlock;
  maxWaitMs?: number;
  triggerLazyMount?: boolean;
}

export function useAnchorScroll() {
  const activeFrameRef = useRef<number | null>(null);
  const activeSettleTimersRef = useRef<number[]>([]);

  const cancel = useCallback(() => {
    if (activeFrameRef.current !== null) {
      cancelAnimationFrame(activeFrameRef.current);
      activeFrameRef.current = null;
    }
    activeSettleTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    activeSettleTimersRef.current = [];
  }, []);

  const scrollToSelector = useCallback(
    (selector: string, opts: ScrollOptions = {}) => {
      const {
        block = "start",
        maxWaitMs = 6000,
        triggerLazyMount = true,
      } = opts;

      cancel();

      const getTargetTop = (): number | null => {
        const element = document.querySelector(selector);
        if (!element) return null;

        const rect = element.getBoundingClientRect();
        if (block === "center") {
          return rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
        }

        return rect.top + window.scrollY - getHeaderOffset();
      };

      const scrollAndSettle = () => {
        const targetTop = getTargetTop();
        if (targetTop === null) return false;

        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        activeFrameRef.current = requestAnimationFrame(() => {
          activeFrameRef.current = requestAnimationFrame(() => {
            const settledTop = getTargetTop();
            if (settledTop !== null && Math.abs(window.scrollY - settledTop) > 10) {
              window.scrollTo({ top: Math.max(0, settledTop), behavior: "auto" });
            }
            activeFrameRef.current = null;
          });
        });

        // Deferred sections can expand while images and adjacent lazy sections settle.
        // Re-align a few fixed times instead of keeping an open-ended polling loop.
        [180, 480, 1000, 2000].forEach((delay) => {
          const timerId = window.setTimeout(() => {
            activeSettleTimersRef.current = activeSettleTimersRef.current.filter((id) => id !== timerId);
            const settledTop = getTargetTop();
            if (settledTop !== null && Math.abs(window.scrollY - settledTop) > 10) {
              window.scrollTo({ top: Math.max(0, settledTop), behavior: "auto" });
            }
          }, delay);
          activeSettleTimersRef.current.push(timerId);
        });

        return true;
      };

      if (scrollAndSettle()) return;
      if (!triggerLazyMount) return;

      window.dispatchEvent(
        new CustomEvent("star-pibu:mount-anchor", { detail: { selector } }),
      );

      const startedAt = performance.now();
      const waitForMount = () => {
        if (scrollAndSettle()) return;
        if (performance.now() - startedAt >= maxWaitMs) {
          activeFrameRef.current = null;
          return;
        }
        activeFrameRef.current = requestAnimationFrame(waitForMount);
      };

      activeFrameRef.current = requestAnimationFrame(waitForMount);
    },
    [cancel],
  );

  useEffect(() => cancel, [cancel]);

  return { scrollToSelector, cancel };
}

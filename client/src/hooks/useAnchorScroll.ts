/**
 * useAnchorScroll
 *
 * Lazy section anchor 이동을 지원하는 스크롤 훅.
 * 아직 mount되지 않은 대상에는 명시적 mount event를 전달하고,
 * 대상 mount 직후 한 번만 native smooth scroll을 수행해 재이동을 피한다.
 */
import { useCallback, useEffect, useRef } from "react";

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

      const scrollToTarget = () => {
        const element = document.querySelector(selector);
        if (!element) return false;

        if (block === "center") {
          const rect = element.getBoundingClientRect();
          const targetTop = rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
          return true;
        }

        // Section scroll-margin-top keeps the target clear of the fixed header.
        // Native anchor motion prevents a second delayed scroll after the first arrival.
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      };

      if (scrollToTarget()) return;
      if (!triggerLazyMount) return;

      window.dispatchEvent(
        new CustomEvent("star-pibu:mount-anchor", { detail: { selector } }),
      );

      const startedAt = performance.now();
      const waitForMount = () => {
        if (scrollToTarget()) return;
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

/**
 * useAnchorScroll
 *
 * Lazy section anchor 이동을 지원하는 스크롤 훅.
 * 아직 mount되지 않은 대상에는 명시적 mount event를 전달하고,
 * 이동 중 layout shift가 발생해도 단일 연속 animation으로 target을 따라간다.
 */
import { useCallback, useEffect, useRef } from "react";

const MIN_ANCHOR_SCROLL_DURATION_MS = 650;
const MAX_ANCHOR_SCROLL_DURATION_MS = 2400;
const FINAL_PIN_DELAY_MS = 800;

function getStartOffset(element: Element): number {
  const scrollMarginTop = Number.parseFloat(window.getComputedStyle(element).scrollMarginTop);
  if (Number.isFinite(scrollMarginTop) && scrollMarginTop > 0) return scrollMarginTop;

  const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
  return header ? header.offsetHeight + 8 : 80;
}

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

export type AnchorScrollBlock = "start" | "center";
export type AnchorScrollBehavior = "smooth" | "instant";

interface ScrollOptions {
  block?: AnchorScrollBlock;
  behavior?: AnchorScrollBehavior;
  maxWaitMs?: number;
  triggerLazyMount?: boolean;
}

export function useAnchorScroll() {
  const activeFrameRef = useRef<number | null>(null);
  const activePinTimerRef = useRef<number | null>(null);
  const activeInteractionCleanupRef = useRef<(() => void) | null>(null);

  const cancel = useCallback(() => {
    if (activeFrameRef.current !== null) {
      cancelAnimationFrame(activeFrameRef.current);
      activeFrameRef.current = null;
    }
    if (activePinTimerRef.current !== null) {
      window.clearTimeout(activePinTimerRef.current);
      activePinTimerRef.current = null;
    }
    activeInteractionCleanupRef.current?.();
    activeInteractionCleanupRef.current = null;
  }, []);

  const scrollToSelector = useCallback(
    (selector: string, opts: ScrollOptions = {}) => {
      const {
        block = "start",
        behavior = "smooth",
        maxWaitMs = 6000,
        triggerLazyMount = true,
      } = opts;

      cancel();

      const getTargetTop = (element: Element): number => {
        const rect = element.getBoundingClientRect();
        if (block === "center") {
          return rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
        }

        return rect.top + window.scrollY - getStartOffset(element);
      };

      const scrollToTarget = () => {
        const element = document.querySelector(selector);
        if (!element) return false;

        if (behavior === "instant" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          window.scrollTo({ top: Math.max(0, getTargetTop(element)), behavior: "auto" });
          return true;
        }

        const initialTop = window.scrollY;
        const initialTargetTop = getTargetTop(element);
        const duration = Math.min(
          MAX_ANCHOR_SCROLL_DURATION_MS,
          Math.max(MIN_ANCHOR_SCROLL_DURATION_MS, Math.abs(initialTargetTop - initialTop) / 4),
        );
        const pinTimerId = window.setTimeout(() => {
          activePinTimerRef.current = null;
          activeInteractionCleanupRef.current?.();
          activeInteractionCleanupRef.current = null;
          const finalTop = Math.max(0, getTargetTop(element));
          if (Math.abs(window.scrollY - finalTop) > 4) {
            window.scrollTo({ top: finalTop, behavior: "auto" });
          }
        }, duration + FINAL_PIN_DELAY_MS);
        activePinTimerRef.current = pinTimerId;

        const cancelForUserScroll = () => cancel();
        const cancelForScrollKey = (event: KeyboardEvent) => {
          if ([" ", "Spacebar", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) {
            cancel();
          }
        };
        const removeInteractionListeners = () => {
          window.removeEventListener("wheel", cancelForUserScroll);
          window.removeEventListener("touchstart", cancelForUserScroll);
          window.removeEventListener("pointerdown", cancelForUserScroll);
          window.removeEventListener("keydown", cancelForScrollKey);
        };
        activeInteractionCleanupRef.current = removeInteractionListeners;
        window.addEventListener("wheel", cancelForUserScroll, { passive: true });
        window.addEventListener("touchstart", cancelForUserScroll, { passive: true });
        window.addEventListener("pointerdown", cancelForUserScroll, { passive: true });
        window.addEventListener("keydown", cancelForScrollKey);

        let startedAt: number | null = null;
        const animate = (now: number) => {
          startedAt ??= now;
          const progress = Math.min(1, (now - startedAt) / duration);
          const targetTop = Math.max(0, getTargetTop(element));
          const nextTop = initialTop + (targetTop - initialTop) * easeOutCubic(progress);
          window.scrollTo({ top: nextTop, behavior: "auto" });

          if (progress < 1) {
            activeFrameRef.current = requestAnimationFrame(animate);
          } else {
            activeFrameRef.current = null;
          }
        };

        activeFrameRef.current = requestAnimationFrame(animate);
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

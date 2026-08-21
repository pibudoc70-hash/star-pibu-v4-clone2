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

interface ScrollOptions {
  block?: AnchorScrollBlock;
  maxWaitMs?: number;
  triggerLazyMount?: boolean;
}

export function useAnchorScroll() {
  const activeFrameRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (activeFrameRef.current !== null) {
      cancelAnimationFrame(activeFrameRef.current);
      activeFrameRef.current = null;
    }
  }, []);

  const scrollToSelector = useCallback(
    (selector: string, opts: ScrollOptions = {}) => {
      const {
        block = "start",
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

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          window.scrollTo({ top: Math.max(0, getTargetTop(element)), behavior: "auto" });
          return true;
        }

        const initialTop = window.scrollY;
        const initialTargetTop = getTargetTop(element);
        const duration = Math.min(
          MAX_ANCHOR_SCROLL_DURATION_MS,
          Math.max(MIN_ANCHOR_SCROLL_DURATION_MS, Math.abs(initialTargetTop - initialTop) / 4),
        );
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

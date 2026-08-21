import { type ReactNode, useEffect, useRef, useState } from "react";
import { trackLazyMount, type LazyMountSurface } from "@/lib/webVitals";

interface DeferredMountProps {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
  /** Anchor scroll이 target mount를 요청할 때 즉시 렌더할 selector 목록. */
  anchorSelectors?: readonly string[];
  /** 익명 anchor mount 지연 metric을 구분할 고정 surface. */
  telemetrySurface?: LazyMountSurface;
}

/**
 * Delays rendering a below-the-fold subtree until it nears the viewport.
 * The fallback reserves the section's existing layout budget to avoid CLS.
 */
export function DeferredMount({
  children,
  fallback,
  rootMargin = "400px 0px",
  anchorSelectors = [],
  telemetrySurface,
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const anchorMountRequestRef = useRef<{ selector: string; startedAt: number } | null>(null);

  useEffect(() => {
    if (shouldMount) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldMount(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldMount]);

  useEffect(() => {
    if (shouldMount || anchorSelectors.length === 0) return;

    const mountForAnchor = (event: Event) => {
      const selector = (event as CustomEvent<{ selector?: string }>).detail?.selector;
      if (selector && anchorSelectors.includes(selector)) {
        anchorMountRequestRef.current ??= { selector, startedAt: performance.now() };
        setShouldMount(true);
      }
    };

    window.addEventListener("star-pibu:mount-anchor", mountForAnchor);
    return () => window.removeEventListener("star-pibu:mount-anchor", mountForAnchor);
  }, [anchorSelectors, shouldMount]);

  useEffect(() => {
    const request = anchorMountRequestRef.current;
    if (!shouldMount || !request || !telemetrySurface) return;

    let cancelled = false;
    let timeoutId: number | undefined;
    const frameId = window.requestAnimationFrame(() => {
      const reportWhenTargetExists = () => {
        if (cancelled) return;
        if (document.querySelector(request.selector)) {
          trackLazyMount(telemetrySurface, performance.now() - request.startedAt);
          anchorMountRequestRef.current = null;
          return;
        }
        if (performance.now() - request.startedAt >= 4_000) {
          anchorMountRequestRef.current = null;
          return;
        }
        timeoutId = window.setTimeout(reportWhenTargetExists, 50);
      };
      reportWhenTargetExists();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [shouldMount, telemetrySurface]);

  return <div ref={ref}>{shouldMount ? children : fallback}</div>;
}

import { type ReactNode, useEffect, useRef, useState } from "react";

interface DeferredMountProps {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
  /** Anchor scroll이 target mount를 요청할 때 즉시 렌더할 selector 목록. */
  anchorSelectors?: readonly string[];
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
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

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
        setShouldMount(true);
      }
    };

    window.addEventListener("star-pibu:mount-anchor", mountForAnchor);
    return () => window.removeEventListener("star-pibu:mount-anchor", mountForAnchor);
  }, [anchorSelectors, shouldMount]);

  return <div ref={ref}>{shouldMount ? children : fallback}</div>;
}

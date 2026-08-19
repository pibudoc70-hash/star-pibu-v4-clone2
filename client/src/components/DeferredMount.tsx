import { type ReactNode, useEffect, useRef, useState } from "react";

interface DeferredMountProps {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
}

/**
 * Delays rendering a below-the-fold subtree until it nears the viewport.
 * The fallback reserves the section's existing layout budget to avoid CLS.
 */
export function DeferredMount({
  children,
  fallback,
  rootMargin = "400px 0px",
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
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
  }, [rootMargin]);

  return <div ref={ref}>{shouldMount ? children : fallback}</div>;
}

import {
  Children,
  cloneElement,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileCardSliderProps = {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  itemCount: number;
  label: string;
  variant?: "standard" | "shorts";
};

type TouchGesture = {
  startX: number;
  startY: number;
  startScrollLeft: number;
  axis: "pending" | "horizontal" | "vertical";
};

/**
 * Shared, native-scroll mobile carousel. The existing desktop grid remains the
 * viewport, while mobile-only CSS turns it into a centered snap row.
 */
export default function MobileCardSlider({
  children,
  className,
  wrapperClassName,
  itemCount,
  label,
  variant = "standard",
}: MobileCardSliderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const touchGestureRef = useRef<TouchGesture | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const safeCount = Math.max(0, itemCount);

  const getItems = useCallback(() => {
    return Array.from(
      viewportRef.current?.querySelectorAll<HTMLElement>("[data-mobile-card-slider-item]") ?? [],
    );
  }, []);

  const syncActiveIndex = useCallback(() => {
    const viewport = viewportRef.current;
    const items = getItems();
    if (!viewport || !items.length) return;

    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    const nearestIndex = items.reduce((closest, item, index) => {
      const closestDistance = Math.abs(
        items[closest]!.offsetLeft + items[closest]!.offsetWidth / 2 - viewportCenter,
      );
      const itemDistance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - viewportCenter);
      return itemDistance < closestDistance ? index : closest;
    }, 0);

    setActiveIndex(nearestIndex);
  }, [getItems]);

  const scrollToIndex = useCallback((requestedIndex: number) => {
    const viewport = viewportRef.current;
    const items = getItems();
    if (!viewport || !items.length) return;

    const nextIndex = Math.max(0, Math.min(requestedIndex, items.length - 1));
    const item = items[nextIndex]!;
    const targetLeft = item.offsetLeft - (viewport.clientWidth - item.offsetWidth) / 2;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    viewport.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reducedMotion ? "auto" : "smooth",
    });
    setActiveIndex(nextIndex);
  }, [getItems]);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(0, safeCount - 1)));
  }, [safeCount]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => syncActiveIndex());
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [syncActiveIndex]);

  useEffect(() => () => {
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
  }, []);

  const handleScroll = () => {
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      syncActiveIndex();
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
  };

  const isMobileTouchViewport = () => (
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const touch = event.touches[0];
    if (!viewport || !touch || !isMobileTouchViewport()) {
      touchGestureRef.current = null;
      return;
    }

    touchGestureRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startScrollLeft: viewport.scrollLeft,
      axis: "pending",
    };
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const gesture = touchGestureRef.current;
    const touch = event.touches[0];
    if (!viewport || !gesture || !touch || !isMobileTouchViewport()) return;

    const deltaX = touch.clientX - gesture.startX;
    const deltaY = touch.clientY - gesture.startY;

    if (gesture.axis === "pending") {
      // Leave taps and tiny pointer noise alone until the gesture has a direction.
      if (Math.abs(deltaX) + Math.abs(deltaY) < 8) return;
      gesture.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
    }

    // Vertical movement always belongs to the page; never cancel its native scroll.
    if (gesture.axis === "vertical") return;

    // Horizontal movement keeps the existing native card-scroll behavior.
    if (event.cancelable) event.preventDefault();
    viewport.scrollLeft = gesture.startScrollLeft - deltaX;
  };

  const clearTouchGesture = () => {
    touchGestureRef.current = null;
  };

  const sliderItems = Children.toArray(children).map((child, index) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      "data-mobile-card-slider-item": index,
    });
  });

  return (
    <div
      className={cn("mobile-card-slider", `mobile-card-slider--${variant}`, wrapperClassName)}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        ref={viewportRef}
        className={cn("mobile-card-slider__viewport", `mobile-card-slider__viewport--${variant}`, className)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={clearTouchGesture}
        onTouchCancel={clearTouchGesture}
        tabIndex={0}
      >
        {sliderItems}
      </div>

      {safeCount > 1 && (
        <div className="mobile-card-slider__controls md:hidden" aria-label={`${label} 탐색`}> 
          <button
            type="button"
            className="mobile-card-slider__arrow"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label={`${label} 이전 카드`}
          >
            <ChevronLeft size={17} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <div className="mobile-card-slider__indicators" role="tablist" aria-label={`${label} 카드 선택`}>
            {Array.from({ length: safeCount }, (_, index) => (
              <button
                type="button"
                key={index}
                className="mobile-card-slider__indicator"
                onClick={() => scrollToIndex(index)}
                aria-label={`${label} ${index + 1}번 카드로 이동`}
                aria-current={activeIndex === index ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className="mobile-card-slider__arrow"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === safeCount - 1}
            aria-label={`${label} 다음 카드`}
          >
            <ChevronRight size={17} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef } from "react";
import { trackEventSkeleton } from "@/lib/webVitals";

export const EVENT_SKELETON_VISIBLE_MARK = "star-pibu:event-skeleton-visible";
export const EVENT_SKELETON_DURATION_MEASURE = "star-pibu:event-skeleton-duration";

/** Measures only the first visible EVENT loading skeleton until its query settles. */
export function useEventSkeletonTiming(isSkeletonVisible: boolean) {
  const startedAtRef = useRef<number | null>(null);
  const reportedRef = useRef(false);

  useEffect(() => {
    if (!isSkeletonVisible || startedAtRef.current !== null || reportedRef.current) return;

    startedAtRef.current = performance.now();
    try {
      performance.mark(EVENT_SKELETON_VISIBLE_MARK);
    } catch {
      // Older browsers can still emit the anonymous duration via performance.now().
    }
  }, [isSkeletonVisible]);

  useEffect(() => {
    const startedAt = startedAtRef.current;
    if (isSkeletonVisible || startedAt === null || reportedRef.current) return;

    const duration = Math.max(0, performance.now() - startedAt);
    reportedRef.current = true;
    try {
      performance.measure(EVENT_SKELETON_DURATION_MEASURE, {
        start: EVENT_SKELETON_VISIBLE_MARK,
        duration,
      });
    } catch {
      // Mark/measure support is optional and does not affect loading UI.
    }
    trackEventSkeleton(duration);
  }, [isSkeletonVisible]);

  useEffect(() => () => {
    try {
      performance.clearMarks(EVENT_SKELETON_VISIBLE_MARK);
      performance.clearMeasures(EVENT_SKELETON_DURATION_MEASURE);
    } catch {
      // Cleanup is best-effort for browser compatibility.
    }
  }, []);
}

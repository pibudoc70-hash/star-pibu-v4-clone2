import { useEffect, useRef } from "react";
import { trackTreatmentsSkeleton } from "@/lib/webVitals";

export const TREATMENTS_SKELETON_VISIBLE_MARK = "star-pibu:treatments-skeleton-visible";
export const TREATMENTS_SKELETON_DURATION_MEASURE = "star-pibu:treatments-skeleton-duration";

/** Measures only the initial treatments/equipment loading skeleton until its query settles. */
export function useTreatmentsSkeletonTiming(isSkeletonVisible: boolean) {
  const startedAtRef = useRef<number | null>(null);
  const reportedRef = useRef(false);

  useEffect(() => {
    if (!isSkeletonVisible || startedAtRef.current !== null || reportedRef.current) return;

    startedAtRef.current = performance.now();
    try {
      performance.mark(TREATMENTS_SKELETON_VISIBLE_MARK);
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
      performance.measure(TREATMENTS_SKELETON_DURATION_MEASURE, {
        start: TREATMENTS_SKELETON_VISIBLE_MARK,
        duration,
      });
    } catch {
      // Mark/measure support is optional and does not affect loading UI.
    }
    trackTreatmentsSkeleton(duration);
  }, [isSkeletonVisible]);

  useEffect(() => () => {
    try {
      performance.clearMarks(TREATMENTS_SKELETON_VISIBLE_MARK);
      performance.clearMeasures(TREATMENTS_SKELETON_DURATION_MEASURE);
    } catch {
      // Cleanup is best-effort for browser compatibility.
    }
  }, []);
}

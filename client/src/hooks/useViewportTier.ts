/**
 * useViewportTier
 * Tailwind sm/md breakpoint 기반 3단계 뷰포트 티어를 반환하는 훅.
 *
 * [R24-P0-2] TreatmentsEquipmentSection 인라인 정책 → 재사용 가능한 훅으로 분리.
 *
 * 정책:
 *   - mobile:  window.innerWidth < SM_BREAKPOINT (640px)
 *   - tablet:  SM_BREAKPOINT <= window.innerWidth < MD_BREAKPOINT (768px)
 *   - desktop: window.innerWidth >= MD_BREAKPOINT (768px)
 *
 * SSR 안전: window가 없으면 "desktop"을 기본값으로 반환.
 */
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Tailwind breakpoint 상수 (sm: 640px, md: 768px)
// ─────────────────────────────────────────────────────────────────────────────
/** Tailwind sm: breakpoint (640px) */
export const SM_BREAKPOINT = 640;
/** Tailwind md: breakpoint (768px) */
export const MD_BREAKPOINT = 768;

/** 3단계 뷰포트 티어 */
export type ViewportTier = "mobile" | "tablet" | "desktop";

/** 현재 window.innerWidth 기반으로 ViewportTier를 계산한다. SSR 안전. */
export function getViewportTier(): ViewportTier {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < SM_BREAKPOINT) return "mobile";
  if (window.innerWidth < MD_BREAKPOINT) return "tablet";
  return "desktop";
}

/**
 * useViewportTier
 * MediaQueryList change 이벤트 기반으로 뷰포트 티어를 반응형으로 추적한다.
 *
 * @returns 현재 ViewportTier ("mobile" | "tablet" | "desktop")
 */
export function useViewportTier(): ViewportTier {
  const [tier, setTier] = useState<ViewportTier>(() => getViewportTier());

  useEffect(() => {
    const mqlSm = window.matchMedia(`(max-width: ${SM_BREAKPOINT - 1}px)`);
    const mqlMd = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`);
    const handler = () => setTier(getViewportTier());

    mqlSm.addEventListener("change", handler);
    mqlMd.addEventListener("change", handler);

    return () => {
      mqlSm.removeEventListener("change", handler);
      mqlMd.removeEventListener("change", handler);
    };
  }, []);

  return tier;
}

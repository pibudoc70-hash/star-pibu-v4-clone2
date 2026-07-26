/**
 * useAnchorScroll
 *
 * lazy 마운트 · 이미지 로드로 인한 레이아웃 시프트에 대응하는 앵커 스크롤 훅.
 *
 * 동작:
 * 1) 대상이 아직 마운트되지 않았을 때만 페이지 하단으로 즉시 이동 → lazy 섹션 강제 마운트
 * 2) 대상 요소가 나타날 때까지 150ms 간격으로 폴링 (최대 maxWaitMs)
 * 3) 등장하면 1차 스크롤: 목표가 멀면 approachRatio 만큼 접근 후 smooth, 가까우면 바로 smooth
 * 4) 이후 좌표를 계속 재계산하여, 이동했으면 재스크롤
 * 5) 좌표가 2회 연속 안정(drift < threshold)되면 종료
 *
 * 기존 문제: 좌표를 1회만 계산하여 아래쪽 lazy 섹션이 마운트되면 목적지가 어긋났다.
 * [Step63] 수정: #contact 등 최하단 섹션에서 "순간이동"처럼 보이던 문제 해결.
 *   - alreadyMounted 체크로 불필요한 하단 점프 제거
 *   - approachRatio 기반 접근 후 smooth 방식으로 모든 섹션 동일한 애니메이션 확보
 */
import { useCallback, useEffect, useRef } from "react";

/** 헤더 높이 + 여유 간격을 계산한다 (fixed 헤더가 대상을 가리는 것 방지) */
function getHeaderOffset(): number {
  const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
  return header ? header.offsetHeight + 8 : 80;
}

export type AnchorScrollBlock = "start" | "center";

interface ScrollOptions {
  /** 뷰포트 정렬 방식. 기본 "start" (헤더 아래 정렬) */
  block?: AnchorScrollBlock;
  /** 요소 등장 대기 최대 시간(ms). 기본 6000 */
  maxWaitMs?: number;
  /** 좌표 재보정 판정 임계값(px). 기본 6 */
  driftThreshold?: number;
  /**
   * true이면 폴링 시작 전 페이지 하단으로 즉시 이동하여
   * deferMount/Suspense 기반 lazy 섹션을 강제 마운트한다.
   * 기본 true.
   */
  triggerLazyMount?: boolean;
  /**
   * [Step63] 도착 직전 접근 거리(뷰포트 배수).
   * 목표 좌표 기준 이 거리만큼 떨어진 지점에서 smooth 이동을 시작해,
   * 섹션 위치와 무관하게 동일한 애니메이션이 보이게 한다. 기본 0.8
   */
  approachRatio?: number;
}

export function useAnchorScroll() {
  const activeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cancel = useCallback(() => {
    if (activeRef.current) {
      clearInterval(activeRef.current);
      activeRef.current = null;
    }
  }, []);

  const scrollToSelector = useCallback(
    (selector: string, opts: ScrollOptions = {}) => {
      const {
        block = "start",
        maxWaitMs = 6000,
        driftThreshold = 6,
        triggerLazyMount = true,
        approachRatio = 0.8,        // [Step63] 추가
      } = opts;

      cancel();

      const getTargetTop = (): number | null => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        if (block === "center") {
          return rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
        }
        return rect.top + window.scrollY - getHeaderOffset();
      };

      // [Step63] 대상이 이미 마운트되어 있으면 하단 점프가 불필요하다.
      // 불필요한 점프는 최하단 섹션(#contact)에서 "순간이동"처럼 보이는 원인이었다.
      const alreadyMounted = document.querySelector(selector) !== null;
      if (triggerLazyMount && !alreadyMounted) {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
      }

      let firstDone = false;
      let lastTop: number | null = null;
      let stableCount = 0;
      let ticks = 0;
      const maxTicks = Math.ceil(maxWaitMs / 150);

      const iv = setInterval(() => {
        ticks += 1;
        const top = getTargetTop();

        if (top === null) {
          if (ticks >= maxTicks) cancel();
          return;
        }

        if (!firstDone) {
          firstDone = true;
          lastTop = top;

          // [Step63] 섹션 위치와 무관하게 동일한 애니메이션 거리를 확보한다.
          // 목표가 멀면 0.8화면 앞까지 instant 로 접근한 뒤 smooth 로 도착한다.
          // 목표가 가까우면(1.2화면 이내) 현재 위치에서 바로 smooth 이동한다.
          const vh = window.innerHeight;
          const distance = Math.abs(top - window.scrollY);
          if (distance > vh * 1.2) {
            const start =
              top > window.scrollY
                ? top - vh * approachRatio   // 아래로 갈 때: 위쪽에서 출발
                : top + vh * approachRatio;  // 위로 갈 때: 아래쪽에서 출발
            window.scrollTo({ top: Math.max(0, start), behavior: "instant" });
          }
          requestAnimationFrame(() => {
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
          });
          return;
        }

        // ── drift 재보정 블록 ────────────────────────────────────────────────
        // lazy 이미지 로드로 위치가 밀렸을 때 최종 좌표를 다시 맞춰주는 안전장치.
        // 이 블록은 절대 수정하지 말 것.
        const drift = lastTop === null ? 0 : Math.abs(top - lastTop);
        lastTop = top;

        if (drift < driftThreshold) {
          stableCount += 1;
          if (stableCount >= 2) {
            if (Math.abs(window.scrollY - top) > 10) {
              window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
            }
            cancel();
            return;
          }
        } else {
          stableCount = 0;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }

        if (ticks >= maxTicks) cancel();
      }, 150);

      activeRef.current = iv;
    },
    [cancel],
  );

  useEffect(() => cancel, [cancel]);

  return { scrollToSelector, cancel };
}

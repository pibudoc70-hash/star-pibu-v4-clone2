/**
 * useScrollReveal - 스크롤 진입 애니메이션 훅
 *
 * 팝업의 spring easing(cubic-bezier(0.16, 1, 0.3, 1))과 동일한
 * 애니메이션 시스템을 IntersectionObserver로 구현.
 *
 * 사용법:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="reveal"> ... </div>
 *
 *   // 여러 요소 stagger
 *   const ref = useScrollReveal({ stagger: 50 });
 *   <div ref={ref}>
 *     <div className="reveal-card"> ... </div>
 *     <div className="reveal-card"> ... </div>
 *   </div>
 *
 * Phase 2 최적화:
 * - useCallback으로 observer 콜백 안정화 → 불필요한 observer 재생성 방지
 * - once:true 보장: 이미 visible인 요소는 재처리 스킵
 * - staggerMs 기본값 80→50 (Phase 1)
 * - rootMargin -60px→-50px (Phase 1)
 */
import { useCallback, useEffect, useRef } from "react";

interface ScrollRevealOptions {
  /** 뷰포트 교차 임계값 (0~1). 기본 0.12 */
  threshold?: number;
  /** 루트 마진 (px). 기본 "0px 0px -50px 0px" — 약간 일찍 트리거 */
  rootMargin?: string;
  /** 자식 카드 stagger 간격 (ms). 0이면 stagger 없음 */
  stagger?: number;
  /** stagger 대상 자식 셀렉터. 기본 ".reveal-card" */
  staggerSelector?: string;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.12,
    // [FM-P1-8] rootMargin -60px → -50px: viewport once 트리거 일관성 확보
    rootMargin = "0px 0px -50px 0px",
    stagger = 0,
    staggerSelector = ".reveal-card",
  } = options;

  const ref = useRef<T>(null);
  const staggerTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const isActiveRef = useRef(false);

  // [FM-P2-1] useCallback으로 observer 콜백 안정화 → 의존성 변경 시에만 재생성
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target as HTMLElement;

        // [FM-P2-1] once:true 보장: 이미 visible이면 스킵
        if (target.classList.contains("visible")) {
          observer.unobserve(target);
          return;
        }

        // 자기 자신이 reveal 클래스를 가지면 직접 활성화
        const revealClasses = ["reveal", "reveal-left", "reveal-right", "reveal-heading"];
        if (revealClasses.some((c) => target.classList.contains(c))) {
          target.classList.add("visible");
        }

        // stagger 자식 처리
        if (stagger > 0) {
          const cards = target.querySelectorAll<HTMLElement>(staggerSelector);
          cards.forEach((card, i) => {
            // 이미 visible인 카드는 스킵
            if (card.classList.contains("visible")) return;
            const timeoutId = setTimeout(() => {
              staggerTimeoutsRef.current.delete(timeoutId);
              if (!isActiveRef.current) return;
              card.classList.add("visible");
            }, i * stagger);
            staggerTimeoutsRef.current.add(timeoutId);
          });
        }

        observer.unobserve(target);
      });
    },
    [stagger, staggerSelector]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    isActiveRef.current = true;

    // prefers-reduced-motion: 모션 감소 설정 시 즉시 visible 처리
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const revealClasses = ["reveal", "reveal-left", "reveal-right", "reveal-heading"];
      if (revealClasses.some((c) => el.classList.contains(c))) {
        el.classList.add("visible");
      }
      const cards = el.querySelectorAll<HTMLElement>(
        ".reveal-card, .reveal, .reveal-left, .reveal-right, .reveal-heading"
      );
      cards.forEach((card) => card.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(handleIntersect, { threshold, rootMargin });

    // 자기 자신 관찰
    observer.observe(el);

    return () => {
      isActiveRef.current = false;
      observer.disconnect();
      staggerTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      staggerTimeoutsRef.current.clear();
    };
  }, [threshold, rootMargin, handleIntersect]);

  return ref;
}

/**
 * useSectionReveal - 섹션 전체를 한 번에 처리하는 편의 훅
 * 섹션 루트 ref를 반환하며, 내부의 모든 reveal* 요소를 stagger로 활성화
 *
 * Phase 2 최적화:
 * - useCallback으로 observer 콜백 안정화
 * - once:true 보장: 이미 visible인 요소 스킵
 */
// [FM-P1-7] staggerMs 기본값 80 → 50: 카드 등장 간격 단축으로 전체 섹션 완료 시간 감소
export function useSectionReveal(staggerMs = 50) {
  const ref = useRef<HTMLElement>(null);
  const animationFramesRef = useRef<Set<number>>(new Set());
  const isActiveRef = useRef(false);

  // [FM-P2-2] useCallback으로 observer 콜백 안정화 → staggerMs 변경 시에만 재생성
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target as HTMLElement;
        const revealEls = target.querySelectorAll<HTMLElement>(
          ".reveal, .reveal-left, .reveal-right, .reveal-heading, .reveal-card"
        );

        revealEls.forEach((el, i) => {
          // [FM-P2-2] once:true 보장: 이미 visible인 요소는 스킵
          if (el.classList.contains("visible")) return;

          // 이미 delay가 인라인으로 설정된 경우 그것을 우선
          const existingDelay = parseFloat(el.style.transitionDelay || "0");
          if (existingDelay === 0) {
            el.style.transitionDelay = `${i * staggerMs}ms`;
          }
          // 다음 frame에서 visible을 추가해 transition이 동작하도록 한다.
          let frameId = 0;
          frameId = requestAnimationFrame(() => {
            animationFramesRef.current.delete(frameId);
            if (!isActiveRef.current) return;
            el.classList.add("visible");
          });
          animationFramesRef.current.add(frameId);
        });

        observer.unobserve(target);
      });
    },
    [staggerMs]
  );

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    isActiveRef.current = true;

    // prefers-reduced-motion: 즉시 visible 처리
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const revealEls = section.querySelectorAll<HTMLElement>(
        ".reveal, .reveal-left, .reveal-right, .reveal-heading, .reveal-card"
      );
      revealEls.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      handleIntersect,
      // [UI개선-2026-07-22-v3] rootMargin을 양수로 변경:
      // 음수 rootMargin은 앵커 링크로 직접 이동 시 이미 뷰포트에 있는 섹션이
      // 트리거되지 않는 문제를 유발함. 양수 rootMargin으로 더 일찍 트리거.
      { threshold: 0.01, rootMargin: "200px 0px 200px 0px" }
    );

    observer.observe(section);
    return () => {
      isActiveRef.current = false;
      observer.disconnect();
      animationFramesRef.current.forEach((frameId) => cancelAnimationFrame(frameId));
      animationFramesRef.current.clear();
    };
  }, [handleIntersect]);

  return ref;
}

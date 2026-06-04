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
 *   const ref = useScrollReveal({ stagger: 80 });
 *   <div ref={ref}>
 *     <div className="reveal-card"> ... </div>
 *     <div className="reveal-card"> ... </div>
 *   </div>
 */
import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  /** 뷰포트 교차 임계값 (0~1). 기본 0.12 */
  threshold?: number;
  /** 루트 마진 (px). 기본 "0px 0px -60px 0px" — 약간 일찍 트리거 */
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
    rootMargin = "0px 0px -60px 0px",
    stagger = 0,
    staggerSelector = ".reveal-card",
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;

          // 자기 자신이 reveal 클래스를 가지면 직접 활성화
          const revealClasses = ["reveal", "reveal-left", "reveal-right", "reveal-heading"];
          if (revealClasses.some((c) => target.classList.contains(c))) {
            target.classList.add("visible");
          }

          // stagger 자식 처리
          if (stagger > 0) {
            const cards = target.querySelectorAll<HTMLElement>(staggerSelector);
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.add("visible");
              }, i * stagger);
            });
          }

          observer.unobserve(target);
        });
      },
      { threshold, rootMargin }
    );

    // 자기 자신 관찰
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin, stagger, staggerSelector]);

  return ref;
}

/**
 * useSectionReveal - 섹션 전체를 한 번에 처리하는 편의 훅
 * 섹션 루트 ref를 반환하며, 내부의 모든 reveal* 요소를 stagger로 활성화
 */
export function useSectionReveal(staggerMs = 80) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    // prefers-reduced-motion: 즉시 visible 처리
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const revealEls = section.querySelectorAll<HTMLElement>(
        ".reveal, .reveal-left, .reveal-right, .reveal-heading, .reveal-card"
      );
      revealEls.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          const revealEls = target.querySelectorAll<HTMLElement>(
            ".reveal, .reveal-left, .reveal-right, .reveal-heading, .reveal-card"
          );

          revealEls.forEach((el, i) => {
            // 이미 delay가 인라인으로 설정된 경우 그것을 우선
            const existingDelay = parseFloat(el.style.transitionDelay || "0");
            if (existingDelay === 0) {
              el.style.transitionDelay = `${i * staggerMs}ms`;
            }
            // 다음 프레임에서 visible 추가 (transition이 작동하도록)
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                el.classList.add("visible");
              });
            });
          });

          observer.unobserve(target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [staggerMs]);

  return ref;
}

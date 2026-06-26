/**
 * useIntersectionObserver - 스크롤 기반 애니메이션 훅
 * Intersection Observer API를 활용하여 요소가 뷰포트에 진입할 때 감지
 * 
 * 사용 예:
 * const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
 * <div ref={ref} className={isVisible ? 'fade-in' : 'opacity-0'}>...</div>
 */

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean; // true면 처음 한 번만 감지 후 옵저버 제거
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // triggerOnce가 true면 처음 한 번만 감지 후 옵저버 제거
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          // triggerOnce가 false면 계속 감지
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

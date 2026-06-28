/**
 * ScrollAnimationWrapper - 스크롤 기반 애니메이션 + 점진적 마운트 래퍼
 *
 * [P0-PERF] deferMount 옵션:
 *   - true(기본): 뷰포트 근처(rootMargin: 300px)에 진입할 때 자식을 마운트
 *     → 초기 렌더에서 폴드 아래 섹션의 JS 실행/API 호출 비용 제거
 *   - false: 즉시 마운트 (Hero 바로 아래 섹션 등 선로딩 필요한 경우)
 *
 * 사용 예:
 * <ScrollAnimationWrapper animationType="fade-in" deferMount>
 *   <HeavySection />
 * </ScrollAnimationWrapper>
 */

import { ReactNode, useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animationType?: 'fade-in' | 'fade' | 'slide-left' | 'slide-right' | 'stagger' | 'fade-in-fast' | 'fade-in-slow';
  threshold?: number;
  rootMargin?: string;
  className?: string;
  /** true(기본): 뷰포트 근처에서만 마운트 (폴드 아래 섹션 성능 최적화) */
  deferMount?: boolean;
  /** deferMount 시 마운트를 시작할 뷰포트 여유 거리 (px) */
  mountMargin?: string;
  /** 마운트 후 최소 높이 — CLS 방지용 (SectionFallback 없이 사용 시) */
  minHeight?: string;
}

const animationClassMap: Record<string, string> = {
  'fade-in': 'scroll-fade-in',
  'fade': 'scroll-fade',
  'slide-left': 'scroll-slide-left',
  'slide-right': 'scroll-slide-right',
  'stagger': 'scroll-stagger',
  'fade-in-fast': 'scroll-fade-in-fast',
  'fade-in-slow': 'scroll-fade-in-slow',
};

export function ScrollAnimationWrapper({
  children,
  animationType = 'fade-in',
  threshold = 0.05,
  rootMargin = '0px',
  className = '',
  deferMount = false,
  mountMargin = '300px 0px',
  minHeight,
}: ScrollAnimationWrapperProps) {
  // 애니메이션용 observer (뷰포트 진입 시 is-visible 토글)
  const { ref: animRef, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  // deferMount용 별도 ref + state
  const mountRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(!deferMount);

  useEffect(() => {
    if (!deferMount || shouldMount) return;

    const el = mountRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: mountMargin,
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [deferMount, shouldMount, mountMargin]);

  const animationClass = animationClassMap[animationType] || 'scroll-fade-in';
  const visibilityClass = isVisible ? 'is-visible' : '';

  // deferMount 모드: 마운트 전에는 최소 높이 플레이스홀더만 렌더
  if (deferMount && !shouldMount) {
    return (
      <div
        ref={mountRef}
        style={minHeight ? { minHeight } : undefined}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={(node) => {
        // animRef와 mountRef를 동일 DOM에 연결
        (animRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (deferMount) (mountRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`${animationClass} ${visibilityClass} ${className}`}
    >
      {children}
    </div>
  );
}

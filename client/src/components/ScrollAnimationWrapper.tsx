/**
 * ScrollAnimationWrapper - 스크롤 기반 애니메이션 래퍼
 *
 * 뷰포트에 진입할 때 is-visible 클래스를 추가하여 CSS 애니메이션을 트리거합니다.
 * triggerOnce: true로 한 번 보이면 영구적으로 visible 상태를 유지합니다.
 */

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animationType?: 'fade-in' | 'fade' | 'slide-left' | 'slide-right' | 'stagger' | 'fade-in-fast' | 'fade-in-slow';
  threshold?: number;
  rootMargin?: string;
  className?: string;
  /** @deprecated deferMount는 제거됨 — Suspense + lazy로 대체 */
  deferMount?: boolean;
  /** @deprecated mountMargin은 제거됨 */
  mountMargin?: string;
  /** @deprecated minHeight는 제거됨 */
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
}: ScrollAnimationWrapperProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const animationClass = animationClassMap[animationType] || 'scroll-fade-in';
  const visibilityClass = isVisible ? 'is-visible' : '';

  return (
    <div
      ref={ref}
      className={`${animationClass} ${visibilityClass} ${className}`}
    >
      {children}
    </div>
  );
}

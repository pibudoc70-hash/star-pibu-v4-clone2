/**
 * ScrollAnimationWrapper - 스크롤 기반 애니메이션 래퍼
 * 
 * 사용 예:
 * <ScrollAnimationWrapper animationType="fade-in">
 *   <SomeSection />
 * </ScrollAnimationWrapper>
 */

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animationType?: 'fade-in' | 'fade' | 'slide-left' | 'slide-right' | 'stagger' | 'fade-in-fast' | 'fade-in-slow';
  threshold?: number;
  rootMargin?: string;
  className?: string;
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
  threshold = 0.1,
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

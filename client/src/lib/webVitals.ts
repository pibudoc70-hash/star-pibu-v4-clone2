/**
 * Core Web Vitals 모니터링 (Performance API 기반, 외부 패키지 불필요)
 * 개발 환경에서만 콘솔 출력 — 프로덕션 빌드에서는 silent
 */
const isDev = import.meta.env.DEV;

export function initWebVitals() {
  if (typeof window === 'undefined' || !window.performance) return;

  // TTFB (Time to First Byte)
  const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (navEntries.length > 0) {
    const nav = navEntries[0];
    const ttfb = nav.responseStart - nav.fetchStart;
    if (isDev) console.log(`📊 TTFB: ${ttfb.toFixed(0)}ms`);
  }

  // FCP (First Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        if (isDev) console.log(`📊 FCP: ${entry.startTime.toFixed(0)}ms`);
      }
    }
  });
  try {
    observer.observe({ type: 'paint', buffered: true });
  } catch {
    // 지원하지 않는 브라우저 무시
  }
}

export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) return null;
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return null;
  return {
    pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
    resourceLoadTime: navigation.responseEnd - navigation.fetchStart,
    domContentLoadedTime: navigation.domContentLoadedEventEnd - navigation.fetchStart,
  };
}

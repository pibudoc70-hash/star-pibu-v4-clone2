/**
 * Core Web Vitals 모니터링 (Performance API 기반, 외부 패키지 불필요)
 * 개발 환경에서는 콘솔 출력하고, Umami가 준비된 경우 익명 metric만 전송한다.
 */
const isDev = import.meta.env.DEV;

export type WebVitalMetric = "lcp" | "inp";

type UmamiTracker = {
  track?: (eventName: string, data: { metric: WebVitalMetric; value: number; locale: string }) => void;
};

function getUmamiTracker() {
  return (window as Window & { umami?: UmamiTracker }).umami;
}

/** Emits only the rounded metric value and document language; no identifiers or URLs. */
export function trackWebVital(metric: WebVitalMetric, value: number) {
  if (typeof window === "undefined" || !Number.isFinite(value) || value < 0) return;

  getUmamiTracker()?.track?.("web_vital", {
    metric,
    value: Math.round(value),
    locale: document.documentElement.lang || "ko",
  });
}

export function initWebVitals() {
  if (typeof window === "undefined" || !window.performance) return;

  // TTFB (Time to First Byte)
  const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  if (navEntries.length > 0) {
    const nav = navEntries[0];
    const ttfb = nav.responseStart - nav.fetchStart;
    if (isDev) console.log(`📊 TTFB: ${ttfb.toFixed(0)}ms`);
  }

  let lcp = 0;
  let inp = 0;
  let reported = false;

  const reportFinalVitals = () => {
    if (reported) return;
    reported = true;
    if (lcp > 0) trackWebVital("lcp", lcp);
    if (inp > 0) trackWebVital("inp", inp);
  };

  // FCP (First Contentful Paint)
  const paintObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint" && isDev) {
        console.log(`📊 FCP: ${entry.startTime.toFixed(0)}ms`);
      }
    }
  });

  try {
    paintObserver.observe({ type: "paint", buffered: true });
  } catch {
    // 지원하지 않는 브라우저 무시
  }

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const latestEntry = entries[entries.length - 1];
      if (latestEntry) lcp = latestEntry.startTime;
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // 지원하지 않는 브라우저 무시
  }

  try {
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        inp = Math.max(inp, entry.duration);
      }
    });
    inpObserver.observe({ type: "event", buffered: true });
  } catch {
    // 지원하지 않는 브라우저 무시
  }

  window.addEventListener("pagehide", reportFinalVitals, { once: true });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "hidden") reportFinalVitals();
    },
    { once: true }
  );
}

export function getPerformanceMetrics() {
  if (typeof window === "undefined" || !window.performance) return null;
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  if (!navigation) return null;
  return {
    pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
    resourceLoadTime: navigation.responseEnd - navigation.fetchStart,
    domContentLoadedTime: navigation.domContentLoadedEventEnd - navigation.fetchStart,
  };
}

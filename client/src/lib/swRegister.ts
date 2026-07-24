/**
 * Service Worker 등록 헬퍼.
 *
 * - 프로덕션 환경에서만 등록 (dev 에서는 캐시 문제 방지)
 * - 새 SW 감지 시 즉시 활성화 (skipWaiting 메시지)
 * - 등록 실패는 조용히 무시 (SW 없이도 사이트는 정상 동작)
 */
export function registerServiceWorker(): void {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        // 새 SW 발견 시 즉시 활성화 유도
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // 기존 SW 가 제어 중이었다면, 새 SW 에게 즉시 활성화 지시
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });

        // controller 가 바뀌면 페이지 자동 리로드 (새 자산 반영)
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      })
      .catch((err) => {
        console.warn("[SW] registration failed:", err);
      });
  });
}

/** 개발 편의: 콘솔에서 __clearSwCache__() 로 캐시 전체 삭제 */
if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as unknown as { __clearSwCache__?: () => Promise<void> }).__clearSwCache__ =
    async () => {
      if (!("serviceWorker" in navigator)) return;
      const reg = await navigator.serviceWorker.getRegistration();
      reg?.active?.postMessage({ type: "CLEAR_CACHE" });
      console.log("[SW] cache cleared");
    };
}

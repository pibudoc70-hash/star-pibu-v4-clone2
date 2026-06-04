/**
 * Service Worker - Star Dermatology Clinic
 * Strategy: Network-first for all requests.
 * API routes (/api/*) are NEVER cached to prevent stale JSON issues.
 */

const CACHE_NAME = "star-pibu-v1";

// API 경로는 절대 캐시하지 않음
const NO_CACHE_PATTERNS = [
  /^\/api\//,
  /^\/manus-storage\//,
];

self.addEventListener("install", (event) => {
  // 즉시 활성화
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API 요청 및 캐시 제외 패턴은 항상 네트워크로 직접 전달
  if (NO_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 그 외 요청: 네트워크 우선, 실패 시 캐시 사용
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 유효한 응답만 캐시
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

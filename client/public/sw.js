/**
 * Service Worker - Star Dermatology Clinic
 *
 * Strategy: Network-first for all requests.
 *
 * CRITICAL RULES:
 *   1. /api/* requests are NEVER cached — always pass through to network.
 *      Caching tRPC responses causes "Unexpected token '<'" JSON parse errors
 *      when the SW serves stale HTML instead of JSON.
 *   2. /api/storage/* requests are NEVER cached — signed URLs expire.
 *   3. Only GET requests are handled; non-GET passes through unmodified.
 *   4. Only same-origin "basic" responses are stored in cache.
 *
 * Navigation / document requests (mode === "navigate"):
 *   Included in the network-first cache. All pages are public SPA shells;
 *   auth checks happen inside React via tRPC, not at the HTML level.
 *   Caching the shell is safe — admin routes are protected by tRPC procedures.
 *
 * Cache versioning: bump CACHE_NAME when deploying breaking asset changes
 * to force old caches to be deleted on activate.
 *
 * S3-T3: 수동 버전 관리 대신 CI/CD 빌드 시 __BUILD_HASH__ 자동 치환을 권장합니다.
 * 예: CACHE_NAME = "star-pibu-__BUILD_HASH__"
 * vite.config.ts define: { __BUILD_HASH__: JSON.stringify(Date.now().toString(36)) }
 */
const CACHE_NAME = "star-pibu-v5"; // v5: scroll-to-top fix (2026-06-09)

/**
 * Patterns that must NEVER be cached.
 * Tested against request.url.pathname.
 */
const NO_CACHE_PATTERNS = [
  /^\/api\//,           // tRPC + OAuth endpoints
  /^\/manus-storage\//, // Signed S3 URLs
];

// ── Install: skip waiting so new SW activates immediately ──────────────────
self.addEventListener("install", () => {
  self.skipWaiting();
});

// ── Activate: delete stale caches, claim all clients ──────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: network-first, never cache API/storage ─────────────────────────
self.addEventListener("fetch", (event) => {
  // Only handle GET requests; let non-GET pass through unmodified.
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // API and storage paths: bypass SW entirely, go straight to network.
  if (NO_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // All other GET requests (including navigation/document): network-first.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache only successful same-origin responses.
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

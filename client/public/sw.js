/**
 * Service Worker — star-pibu-v4
 *
 * 캐시 전략:
 * - JS/CSS/폰트 (해시 파일명): cache-first, 30일
 * - 이미지 (public/*, /api/storage/*?v=): stale-while-revalidate
 * - HTML: network-first, 캐시 폴백
 * - tRPC (/api/trpc/*): 캐시 안 함 (실시간 데이터)
 * - 관리자 페이지 관련: 캐시 안 함
 *
 * 버전 관리:
 * - CACHE_VERSION 을 배포마다 갱신 (또는 파일명 해시 기반)
 * - activate 이벤트에서 옛 버전 캐시 자동 삭제
 * - skipWaiting + clients.claim 으로 배포 즉시 반영
 */

// ⚠️ 배포 시 이 문자열을 바꾸면 기존 캐시 전체가 무효화된다.
// 배포 파이프라인에서 자동으로 치환하도록 확장 가능.
const CACHE_VERSION = "v2-2026-07-24";

const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,   // JS/CSS/폰트
  image: `image-${CACHE_VERSION}`,     // 이미지
  html: `html-${CACHE_VERSION}`,       // HTML 폴백
};
const MAX_IMAGE_CACHE_ENTRIES = 60;

// ── install: 새 SW 설치 즉시 활성화 대기 ─────────────────────────────────
self.addEventListener("install", (event) => {
  // 새 SW가 설치되면 기존 SW의 종료를 기다리지 않고 즉시 활성화
  self.skipWaiting();
});

// ── activate: 옛 버전 캐시 정리 + 즉시 페이지 제어 시작 ──────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const validCaches = new Set(Object.values(CACHE_NAMES));
      await Promise.all(
        cacheNames
          .filter((name) => !validCaches.has(name))
          .map((name) => caches.delete(name)),
      );
      // 현재 열려 있는 모든 탭에서 새 SW가 즉시 fetch 를 가로챔
      await self.clients.claim();
    })(),
  );
});

// ── fetch: 요청 유형별 캐시 전략 ─────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. GET 요청만 캐시. POST/PUT/DELETE 등은 건드리지 않음.
  if (request.method !== "GET") return;

  // 2. 외부 도메인은 건드리지 않음 (CORS/opaque 응답 캐시 문제 방지)
  if (url.origin !== self.location.origin) return;

  // 3. API 는 캐시 안 함. /api/storage 이미지만 아래 image 전략의 예외로 허용.
  // 예약·tRPC·인증·사용자별 API 응답은 Service Worker가 절대 저장하지 않는다.
  if (url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/storage/")) return;

  // 4. 관리자 페이지 및 관리자 리소스는 캐시 안 함
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) {
    return;
  }

  // 5. OAuth 콜백 등 인증 흐름은 건드리지 않음
  if (url.pathname.startsWith("/api/auth") || url.pathname.startsWith("/oauth")) {
    return;
  }

  // 6. HTML 문서 (SPA fallback): network-first, 캐시 폴백
  if (
    request.mode === "navigate" ||
    request.headers.get("accept")?.includes("text/html")
  ) {
    event.respondWith(handleHtml(request));
    return;
  }

  // 7. 정적 자산 (JS/CSS/폰트): cache-first
  if (
    url.pathname.startsWith("/assets/") ||
    /\.(js|css|woff2?|ttf|otf|eot)$/i.test(url.pathname)
  ) {
    event.respondWith(handleStatic(request));
    return;
  }

  // 8. 이미지: stale-while-revalidate
  //    (?v= 파라미터 있는 immutable 이미지는 cache-first 로도 안전하지만
  //     SWR 로 통일하여 관리자가 이미지를 갈아치웠을 때 다음 요청부터 갱신)
  if (
    url.pathname.startsWith("/api/storage/") ||
    /\.(png|jpe?g|webp|avif|svg|ico|gif)$/i.test(url.pathname)
  ) {
    const imageResult = handleImage(request);
    event.respondWith(imageResult.then(({ response }) => response));
    event.waitUntil(imageResult.then(({ revalidation }) => revalidation));
    return;
  }

  // 9. 그 외는 SW 개입 안 함 (브라우저 기본 동작)
});

// ── 전략 구현 ───────────────────────────────────────────────────────────

/** HTML: network-first — 배포 즉시 반영 우선, 오프라인 시 캐시 폴백 */
async function handleHtml(request) {
  try {
    const networkResp = await fetch(request);
    if (networkResp && networkResp.ok) {
      const cache = await caches.open(CACHE_NAMES.html);
      await putSafely(cache, request, networkResp.clone());
    }
    return networkResp;
  } catch (err) {
    const cache = await caches.open(CACHE_NAMES.html);
    const cached = await cache.match(request);
    if (cached) return cached;
    // 최후의 폴백: 캐시된 index.html
    const indexFallback = await cache.match("/");
    if (indexFallback) return indexFallback;
    throw err;
  }
}

/** 정적 자산: cache-first — 파일명 해시가 있으므로 사실상 immutable */
async function handleStatic(request) {
  const cache = await caches.open(CACHE_NAMES.static);
  const cached = await cache.match(request);
  if (cached) return cached;

  const networkResp = await fetch(request);
  if (networkResp && networkResp.ok) {
    await putSafely(cache, request, networkResp.clone());
  }
  return networkResp;
}

/** 이미지: stale-while-revalidate — 캐시 즉시 응답 + 백그라운드 갱신 */
async function handleImage(request) {
  const cache = await caches.open(CACHE_NAMES.image);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then(async (resp) => {
      if (resp && resp.ok) {
        await putSafely(cache, request, resp.clone());
        await trimImageCache(cache);
      }
      return resp;
    })
    .catch(() => null);

  if (cached) {
    return { response: cached, revalidation: networkFetch };
  }

  const networkResponse = await networkFetch;
  if (!networkResponse) throw new Error("Image fetch failed");
  return { response: networkResponse, revalidation: Promise.resolve() };
}

/** Cache Storage quota/errors must never fail a navigation or asset response. */
async function putSafely(cache, request, response) {
  try {
    await cache.put(request, response);
  } catch {
    // Cache write failures are non-fatal: the successful network response is returned.
  }
}

/** Keep stale-while-revalidate image storage bounded by oldest cache entry. */
async function trimImageCache(cache) {
  try {
    const keys = await cache.keys();
    const surplus = keys.length - MAX_IMAGE_CACHE_ENTRIES;
    if (surplus > 0) {
      await Promise.all(keys.slice(0, surplus).map((key) => cache.delete(key)));
    }
  } catch {
    // Cache maintenance must not affect image delivery.
  }
}

// ── 메시지: 강제 갱신 트리거 ─────────────────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data?.type === "CLEAR_CACHE") {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      })(),
    );
  }
});

import type { Express } from "express";
import crypto from "crypto";
import { ENV } from "./env";
import { logger } from "./logger";
import { imageCache, imageNotFoundCache } from "./imageCache"; // [Step51-hotfix-D] imageNotFoundCache 추가
import { getSafeStorageContentType, isAllowedStorageUrl } from "./imageProxyPolicy";

// [Step51-A] 스토리지 키 검증
// 전제: 이 함수에는 반드시 "디코딩이 끝난" 키를 넘긴다.
const SAFE_STORAGE_KEY = /^[A-Za-z0-9][A-Za-z0-9._-]{0,199}$/;

function isSafeStorageKey(key: string): boolean {
  if (!key) return false;
  if (key.includes("/") || key.includes("\\")) return false;
  if (key.includes("..")) return false;
  if (key.includes("\0")) return false;
  return SAFE_STORAGE_KEY.test(key);
}

// [Step51-A] raw 경로 → 안전 키 추출. 실패 시 null.
// 1회 디코딩 후에도 '%' 가 남아 있으면 이중 인코딩 우회 시도로 간주한다.
function extractStorageKey(raw: string | undefined): string | null {
  if (!raw) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null; // malformed URI sequence
  }
  if (decoded.includes("%")) return null; // 이중 인코딩 차단
  return isSafeStorageKey(decoded) ? decoded : null;
}

// [Step49-B] 프록시 응답 최대 크기
const MAX_PROXY_BYTES = 5 * 1024 * 1024;

// [Step49-D] 8자 이상 해시가 붙은 파일명은 내용 불변 → immutable
const HASHED_NAME = /[-_][a-f0-9]{8,}\.[a-z0-9]{2,5}$/i;

// [Step51-hotfix-E] getCacheControl 모듈 레벨로 이동 (인자를 받도록 변경)
function getCacheControl(key: string): string {
  return HASHED_NAME.test(key)
    ? "public, max-age=31536000, immutable"
    : "public, max-age=86400, stale-while-revalidate=604800";
}

// [Step49-E] 이미지 프록시 허용 오리진
const ALLOWED_ORIGINS = new Set([
  "https://star-pibu.com",
  "https://www.star-pibu.com",
]);

function setCorsHeader(req: { headers: { origin?: string } }, res: { setHeader: (k: string, v: string) => void }): void {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (process.env.NODE_ENV !== "production") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  // 프로덕션에서 허용 목록 외 오리진에는 CORS 헤더를 붙이지 않는다(이미지 표시는 정상 동작).
}

export function registerStorageProxy(app: Express) {
  // [Step51-B] 레거시 경로 호환. 검증 통과한 키만 리다이렉트한다.
  app.get("/manus-storage/*", (req, res) => {
    const key = extractStorageKey((req.params as Record<string, string>)[0]);
    if (!key) {
      res.status(400).type("text/plain").send("Invalid key");
      return;
    }
    // 301(영구)로 변경: 검색엔진/브라우저가 캐싱하여 왕복이 1회로 줄어든다.
    res.redirect(301, `/api/storage/${encodeURIComponent(key)}`);
  });

  // /api/storage/* 경로: Cloudflare 규칙 우회 (origin 서버 직접 도달)
  app.get("/api/storage/*", async (req, res) => {
    // [Step51-A] extractStorageKey: 1회 디코딩 + 이중 인코딩 차단 + 키 검증
    const key = extractStorageKey((req.params as Record<string, string>)[0]);
    if (!key) {
      res.status(400).type("text/plain").send("Invalid key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    // [Step51-hotfix-C] 타입 단언(as string) 제거 — extractStorageKey 가 string 을 보장
    const cacheKey = `storage:${key}`;
    const notFoundKey = `storage404:${key}`; // [Step51-hotfix-D] 음수 캐시 키

    try {
      // [Step51-hotfix-D] 음수 캐시 확인 (LRU 조회 직전)
      if (imageNotFoundCache.has(notFoundKey)) {
        res.status(404).type("text/plain").send("Not found");
        return;
      }

      // 1. LRU 캐시 조회
      const cached = imageCache.get(cacheKey);
      if (cached) {
        // [Step49-C] 캐시 히트 로그 프로덕션 억제
        if (process.env.NODE_ENV !== "production") {
          console.log(`[StorageProxy] [cache hit] key=${key}`);
        }

        // If-None-Match 헤더 확인 (캐시 유효성 검사)
        const ifNoneMatch = req.get("If-None-Match");
        if (ifNoneMatch === `"${cached.etag}"`) {
          // 304에도 동일한 Cache-Control 적용
          res.set("Cache-Control", getCacheControl(key));
          res.status(304).end();
          return;
        }

        const cacheControl = getCacheControl(key);

        res.set("Content-Type", cached.contentType);
        res.set("Cache-Control", cacheControl);
        res.set("ETag", `"${cached.etag}"`);
        res.set("Vary", "Accept, Accept-Encoding");
        setCorsHeader(req, res);
        res.send(cached.buffer);
        return;
      }

      // 2. presigned URL 발급
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      // [Step51-hotfix-B1] presign 호출: redirect 차단 + 5초 타임아웃
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
        redirect: "error",
        signal: AbortSignal.timeout(5000),
      });

      if (!forgeResp.ok) {
        // [Step51-hotfix-D3] presign 404/403 → 음수 캐시 등록
        if (forgeResp.status === 404 || forgeResp.status === 403) {
          imageNotFoundCache.set(notFoundKey, true);
          res.status(404).type("text/plain").send("Not found");
          return;
        }
        logger.warn("StorageProxy", `Presign request failed (${forgeResp.status})`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url?: unknown };
      if (typeof url !== "string" || !isAllowedStorageUrl(url)) {
        logger.warn("StorageProxy", "Storage backend returned an unapproved signed URL");
        res.status(502).send("Invalid storage backend response");
        return;
      }

      // 3. 이미지 바이트를 직접 가져와서 스트리밍 (리다이렉트 대신)
      // [Step51-hotfix-B2] 이미지 fetch: redirect 차단 + 8초 타임아웃
      const imgResp = await fetch(url, {
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      });
      if (!imgResp.ok) {
        // [Step51-hotfix-D4] 이미지 fetch 404/403 → 음수 캐시 등록
        if (imgResp.status === 404 || imgResp.status === 403) {
          imageNotFoundCache.set(notFoundKey, true);
          res.status(404).type("text/plain").send("Not found");
          return;
        }
        logger.warn("StorageProxy", `Image fetch failed (${imgResp.status}) for key=${key}`);
        res.status(502).send("Failed to fetch image from storage");
        return;
      }

      const contentType = getSafeStorageContentType(key, imgResp.headers.get("content-type"));
      if (!contentType) {
        logger.warn("StorageProxy", `Unexpected upstream content type for key=${key}`);
        res.status(415).type("text/plain").send("Unsupported storage content type");
        return;
      }

      // [Step49-B] Content-Length 기반 사전 차단
      const declaredLen = Number(imgResp.headers.get("content-length") || 0);
      if (declaredLen > MAX_PROXY_BYTES) {
        res.status(413).type("text/plain").send("Payload too large");
        return;
      }

      // 4. 이미지 바이트 가져오기
      const buffer = await imgResp.arrayBuffer();
      const bufferData = Buffer.from(buffer);

      // [Step49-B] 실제 버퍼 크기 검사 (캐시에 넣기 전)
      if (bufferData.byteLength > MAX_PROXY_BYTES) {
        res.status(413).type("text/plain").send("Payload too large");
        return; // 캐시에 저장하지 않는다
      }

      // 5. ETag 생성 (SHA1 해시의 첫 16자)
      const etag = crypto.createHash("sha1").update(bufferData).digest("hex").slice(0, 16);

      // 6. LRU 캐시에 저장
      imageCache.set(cacheKey, { buffer: bufferData, contentType, etag });

      // 7. If-None-Match 헤더 확인 (캐시 유효성 검사)
      const ifNoneMatch = req.get("If-None-Match");
      if (ifNoneMatch === `"${etag}"`) {
        // 304에도 동일한 Cache-Control 적용
        res.set("Cache-Control", getCacheControl(key));
        res.status(304).end();
        return;
      }

      // 8. Cache-Control 헤더 ([Step49-D] 해시 파일명 기반 immutable)
      const cacheControl = getCacheControl(key);

      // 9. 응답 헤더 설정
      res.set("Content-Type", contentType);
      res.set("Cache-Control", cacheControl);
      res.set("ETag", `"${etag}"`);
      res.set("Vary", "Accept, Accept-Encoding");
      setCorsHeader(req, res);

      // 10. 바이트 직접 전송
      res.send(bufferData);
    } catch (err) {
      // [Step51-hotfix-B3] 타임아웃을 504 로 구분
      const isTimeout =
        err instanceof Error &&
        (err.name === "TimeoutError" || err.name === "AbortError");
      if (isTimeout) {
        logger.warn("StorageProxy", `Upstream timeout for key=${key}`, err);
        res.status(504).type("text/plain").send("Upstream timeout");
        return;
      }
      logger.warn("StorageProxy", "Storage proxy request failed", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

/**
 * server/_core/mapCache.ts
 *
 * [Step67-A] Google Static Maps 원본 바이너리 캐시 + 공용 fetch 함수.
 *
 * Step66 에서 base64 string 캐시 → Buffer 캐시로 변경.
 *  - GET 라우트(staticMapRoute.ts)는 Buffer를 그대로 전송 (인코딩 오버헤드 0)
 *  - tRPC(location.ts, 하위호환)는 필요 시에만 base64로 변환
 *
 * 설정:
 *   max: 24         — 최대 항목 수 (width×height×scale 조합 수보다 충분히 큼)
 *   maxSize: 12MB   — 기본값 (MAP_CACHE_MAX_MB 환경변수로 조정 가능)
 *   sizeCalculation: buffer.byteLength (base64 오버헤드 없이 실제 크기 기준)
 *   ttl: 24시간     — 지도 좌표가 고정이므로 장기 캐시 안전
 *   updateAgeOnGet: false — 캐시 히트가 TTL을 갱신하지 않음
 *   allowStale: false     — 만료된 항목은 반환하지 않음
 */

import { LRUCache } from "lru-cache";
import crypto from "node:crypto";
import { ENV } from "./env";

// ── 상수 ─────────────────────────────────────────────────────────────────────

const STAR_LAT = 35.1572312;
const STAR_LNG = 129.0581932;

/** 허용 조합 화이트리스트 — GET·tRPC 양쪽에서 공유 */
export const ALLOWED_MAP_W = [640, 700, 900] as const;
export const ALLOWED_MAP_H = [400, 480, 560] as const;
export const ALLOWED_MAP_S = [1, 2] as const;

// ── 타입 ─────────────────────────────────────────────────────────────────────

export interface CachedMap {
  buffer: Buffer;
  contentType: string;
  /** SHA-1(16자) 기반 ETag — 304 응답에 사용 */
  etag: string;
}

// ── LRU 캐시 ─────────────────────────────────────────────────────────────────

/**
 * [Step67-A] Google Static Maps 원본 바이너리 캐시.
 * base64가 아닌 Buffer를 저장한다.
 */
export const staticMapCache = new LRUCache<string, CachedMap>({
  max: 24,
  maxSize: Number(process.env.MAP_CACHE_MAX_MB ?? 12) * 1024 * 1024,
  sizeCalculation: (v) => v.buffer.byteLength,
  ttl: 24 * 60 * 60 * 1000,
  updateAgeOnGet: false,
  allowStale: false,
});

// ── 공용 fetch 함수 ───────────────────────────────────────────────────────────

/**
 * 캐시 우선 조회 후 미스 시 업스트림 fetch.
 * 성공 시에만 캐시에 저장하고, 실패는 null을 반환한다.
 *
 * [Step65-A] 보안 설정 유지:
 *   - redirect: "error"          — SSRF 방어
 *   - AbortSignal.timeout(8000)  — 무한 대기 방어
 *   - MAX_MAP_BYTES 2중 체크     — 응답 크기 상한 3MB
 */
export async function fetchStaticMap(
  width: number,
  height: number,
  scale: number,
): Promise<CachedMap | null> {
  const cacheKey = `staticmap:${width}x${height}@${scale}`;

  // 1) 캐시 히트
  const hit = staticMapCache.get(cacheKey);
  if (hit) return hit;

  // 2) 캐시 미스 → Google Static Maps API 호출
  const forgeApiUrl = ENV.forgeApiUrl || "https://forge.manus.ai";
  const forgeApiKey = ENV.forgeApiKey;

  const params = new URLSearchParams({
    center: `${STAR_LAT},${STAR_LNG}`,
    zoom: "17",
    size: `${width}x${height}`,
    scale: String(scale),
    maptype: "roadmap",
    markers: `color:red|label:S|${STAR_LAT},${STAR_LNG}`,
    language: "ko",
    key: forgeApiKey,
  });

  const staticMapUrl = `${forgeApiUrl}/v1/maps/proxy/maps/api/staticmap?${params.toString()}`;

  try {
    const response = await fetch(staticMapUrl, {
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(`[staticMap] Static Maps API returned ${response.status}`);
      return null;
    }

    // [Step65-A] 응답 크기 상한 3MB (declared + actual 2중 체크)
    const MAX_MAP_BYTES = 3 * 1024 * 1024;
    const declaredLen = Number(response.headers.get("content-length") || 0);
    if (declaredLen > MAX_MAP_BYTES) {
      console.error("[staticMap] Static map too large (declared)");
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const arrayBuf = await response.arrayBuffer();

    if (arrayBuf.byteLength > MAX_MAP_BYTES) {
      console.error("[staticMap] Static map too large (actual)");
      return null;
    }

    const buffer = Buffer.from(arrayBuf);

    // [Step67-A] SHA-1(16자) ETag 생성
    const etag = `"${crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 16)}"`;

    const entry: CachedMap = { buffer, contentType, etag };

    // 3) 성공 시에만 LRU 캐시에 저장
    staticMapCache.set(cacheKey, entry);
    return entry;
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    console.error(
      `[staticMap] Static Maps API ${isTimeout ? "timeout" : "error"}:`,
      error instanceof Error ? error.message : error,
    );
    // 4) 실패 시 캐시에 아무것도 쓰지 않고 null 반환
    return null;
  }
}

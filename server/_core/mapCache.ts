/**
 * server/_core/mapCache.ts
 *
 * [Step66-B] Google Static Maps base64 응답 전용 LRU 캐시.
 *
 * 범용 cache.ts(Map 기반, 상한 없음)에 수백KB~수MB base64 문자열을 넣으면
 * 만료 후에도 메모리에서 해제되지 않아 메모리 누수가 발생한다.
 * 좌표가 고정이라 결과는 불변 → TTL 24시간.
 *
 * 설정:
 *   max: 24         — 최대 항목 수 (width×height×scale 조합 수보다 충분히 큼)
 *   maxSize: 12MB   — 기본값 (MAP_CACHE_MAX_MB 환경변수로 조정 가능)
 *   ttl: 24시간     — 지도 좌표가 고정이므로 장기 캐시 안전
 *   updateAgeOnGet: false — 캐시 히트가 TTL을 갱신하지 않음
 *   allowStale: false     — 만료된 항목은 반환하지 않음
 */

import { LRUCache } from "lru-cache";

export const staticMapCache = new LRUCache<string, string>({
  max: 24,
  maxSize: Number(process.env.MAP_CACHE_MAX_MB ?? 12) * 1024 * 1024,
  sizeCalculation: (v) => Buffer.byteLength(v, "utf8"),
  ttl: 24 * 60 * 60 * 1000,
  updateAgeOnGet: false,
  allowStale: false,
});

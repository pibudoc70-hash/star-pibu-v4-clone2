/**
 * server/_core/cache.ts — 경량 인메모리 TTL 캐시
 *
 * 사용 목적: DB 쿼리 결과를 일정 시간 캐시해 반복 요청 시 DB 부하 감소
 * - 병원 사이트 특성상 이벤트/팝업/유튜브 데이터는 수 분 단위로 변경됨
 * - 관리자가 데이터를 변경하면 해당 캐시 키를 invalidate
 *
 * 주의: 단일 프로세스 내 메모리 캐시이므로 멀티 인스턴스 환경에서는
 * Redis 등 외부 캐시로 교체 필요. 현재 Cloud Run min-instances=1 환경에서는 충분.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/**
 * 캐시에서 값을 가져오거나, 없으면 fetcher를 실행해 캐시에 저장
 * @param key 캐시 키
 * @param fetcher 데이터를 가져오는 비동기 함수
 * @param ttlMs TTL (밀리초), 기본 2분
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = 2 * 60 * 1000,
): Promise<T> {
  const now = Date.now();
  const entry = store.get(key) as CacheEntry<T> | undefined;

  if (entry && entry.expiresAt > now) {
    return entry.data;
  }

  const data = await fetcher();
  store.set(key, { data, expiresAt: now + ttlMs });
  return data;
}

/**
 * 특정 키 또는 prefix로 시작하는 모든 키의 캐시를 무효화
 * 관리자가 데이터를 변경할 때 호출
 */
export function invalidateCache(keyOrPrefix: string): void {
  for (const key of Array.from(store.keys())) {
    if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
      store.delete(key);
    }
  }
}

/** 전체 캐시 초기화 (테스트용) */
export function clearAllCache(): void {
  store.clear();
}

import { LRUCache } from "lru-cache";

export interface CachedImage {
  buffer: Buffer;
  contentType: string;
  etag: string;
}

/**
 * 이미지 프록시 응답 캐시.
 * CloudFront 가 이미 CDN 캐시 역할을 하므로 애플리케이션 캐시는 소용량으로 운영한다.
 * 컨테이너 메모리 한도(통상 512MB~1GB)를 고려해 기본 40MB 로 제한.
 * 환경변수로 조절 가능: IMAGE_CACHE_MAX, IMAGE_CACHE_MAX_MB
 */
export const imageCache = new LRUCache<string, CachedImage>({
  max: Number(process.env.IMAGE_CACHE_MAX ?? 60),
  maxSize: Number(process.env.IMAGE_CACHE_MAX_MB ?? 40) * 1024 * 1024,
  sizeCalculation: (v) => v.buffer.byteLength,
  ttl: 6 * 60 * 60 * 1000,
  updateAgeOnGet: true,
  allowStale: false,
});

/**
 * 존재하지 않는 리소스(404) 음수 캐시.
 * 없는 이미지를 반복 요청할 때 매번 외부 스토리지를 호출하는 것을 막는다.
 */
export const imageNotFoundCache = new LRUCache<string, true>({
  max: 500,
  ttl: 5 * 60 * 1000,
});

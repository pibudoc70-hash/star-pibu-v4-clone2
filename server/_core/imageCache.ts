import { LRUCache } from "lru-cache";

export interface CachedImage {
  buffer: Buffer;
  contentType: string;
  etag: string;
}

// 최대 200개, 개당 최대 5MB, 총합 최대 200MB, 24시간 TTL
export const imageCache = new LRUCache<string, CachedImage>({
  max: 200,
  maxSize: 200 * 1024 * 1024,
  sizeCalculation: (v) => v.buffer.byteLength,
  ttl: 24 * 60 * 60 * 1000,
  allowStale: false,
});

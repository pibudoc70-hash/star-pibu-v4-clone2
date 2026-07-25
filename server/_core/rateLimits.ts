import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";

/**
 * 공개 엔드포인트 레이트 리미팅.
 *
 * 목적:
 * - 이미지 프록시 캐시 오염 방지 (임의 videoId/url 대량 요청 차단)
 * - tRPC 공개 쿼리 남용 방지
 * - 외부 스토리지·YouTube 호출 쿼터 보호
 *
 * 상한 산정 근거:
 * - 홈 1회 방문 시 이미지 프록시 요청 20~40건 → 분당 300 으로 설정 (Step51-hotfix)
 * - /manus-storage 가 리미터에서 제외되어 실질 부하 감소, 여유 한도 확보
 * - 페이지당 tRPC 쿼리 5~15건 → 분당 300 은 정상 사용자를 막지 않음
 * - 환경변수로 조절 가능하게 하여 운영 중 재배포 없이 튜닝 가능
 */

const common = {
  standardHeaders: true as const,
  legacyHeaders: false as const,
};

/** 이미지 프록시 계열 (storage / youtube-thumbnail / popup-image) */
export const imageProxyLimiter: RateLimitRequestHandler = rateLimit({
  ...common,
  windowMs: 60_000,
  limit: Number(process.env.RL_IMAGE_PER_MIN ?? 300), // [Step51-hotfix] 120→300. 정상 사용자(20~40건/방문) 대비 8~15배 여유,
  //  단일 IP 남용은 차단되는 균형점. 운영 중 429 오탐 발생 시 ENV 로 상향.
  message: { error: "Too many image requests. Please try again shortly." },
});

/** tRPC API */
export const trpcLimiter: RateLimitRequestHandler = rateLimit({
  ...common,
  windowMs: 60_000,
  limit: Number(process.env.RL_TRPC_PER_MIN ?? 300),
  message: { error: "Too many requests. Please try again shortly." },
});

/** 헬스체크 — 모니터링이 자주 호출하므로 느슨하게 */
export const healthLimiter: RateLimitRequestHandler = rateLimit({
  ...common,
  windowMs: 60_000,
  limit: 240,
});

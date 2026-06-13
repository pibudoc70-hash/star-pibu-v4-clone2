/**
 * server/shared/errors.ts — 공통 도메인 에러 타입 및 TRPCError 변환 헬퍼
 *
 * 목적:
 *  - router마다 문자열 에러 코드를 직접 파싱하는 패턴을 제거한다.
 *  - service 계층은 DomainError를 던지고, router는 mapDomainErrorToTRPC 하나로 변환한다.
 *
 * 사용 방법:
 *  // service
 *  throw new DomainError("OTP_COOLDOWN", "인증번호는 60초 후에 다시 요청할 수 있습니다.");
 *
 *  // router
 *  try {
 *    return await sendGuestReservationOtp(input.phone);
 *  } catch (err) {
 *    throw mapDomainErrorToTRPC(err);
 *  }
 */
import { TRPCError } from "@trpc/server";

// ─── 도메인 에러 코드 열거형 ──────────────────────────────────────────────────
export const DOMAIN_ERROR_CODES = {
  // OTP
  OTP_COOLDOWN:   "OTP_COOLDOWN",
  OTP_INVALID:    "OTP_INVALID",
  OTP_LOCKED:     "OTP_LOCKED",
  OTP_EXPIRED:    "OTP_EXPIRED",
  // 예약
  RESERVATION_DATE_INVALID: "RESERVATION_DATE_INVALID",
  RESERVATION_DATE_UNAVAILABLE: "RESERVATION_DATE_UNAVAILABLE",
  RESERVATION_NOT_FOUND: "RESERVATION_NOT_FOUND",
  // 공통
  NOT_FOUND:      "NOT_FOUND",
  FORBIDDEN:      "FORBIDDEN",
  VALIDATION:     "VALIDATION",
} as const;

export type DomainErrorCode = (typeof DOMAIN_ERROR_CODES)[keyof typeof DOMAIN_ERROR_CODES];

// ─── DomainError 클래스 ───────────────────────────────────────────────────────
/**
 * 도메인 계층(service/repository)에서 던지는 구조화된 에러.
 *
 * @param code   DOMAIN_ERROR_CODES 중 하나
 * @param message 사용자에게 노출될 메시지 (한국어)
 * @param meta   추가 컨텍스트 (예: 잠금 해제까지 남은 분)
 */
export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly meta?: Record<string, unknown>;

  constructor(code: DomainErrorCode, message: string, meta?: Record<string, unknown>) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.meta = meta;
  }
}

// ─── TRPCError 변환 매핑 ─────────────────────────────────────────────────────
/**
 * DomainError → TRPCError 변환 매핑 테이블.
 * router의 catch 블록에서 단일 호출로 처리한다.
 *
 * DomainError가 아닌 에러는 그대로 re-throw한다.
 */
export function mapDomainErrorToTRPC(err: unknown): TRPCError | never {
  if (!(err instanceof DomainError)) {
    // 알 수 없는 에러는 그대로 전파 (TRPC가 INTERNAL_SERVER_ERROR로 처리)
    throw err;
  }

  switch (err.code) {
    case DOMAIN_ERROR_CODES.OTP_COOLDOWN:
      return new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: err.message,
      });

    case DOMAIN_ERROR_CODES.OTP_INVALID:
    case DOMAIN_ERROR_CODES.OTP_EXPIRED:
      return new TRPCError({
        code: "BAD_REQUEST",
        message: err.message,
      });

    case DOMAIN_ERROR_CODES.OTP_LOCKED:
      return new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: err.message,
      });

    case DOMAIN_ERROR_CODES.RESERVATION_DATE_INVALID:
    case DOMAIN_ERROR_CODES.RESERVATION_DATE_UNAVAILABLE:
    case DOMAIN_ERROR_CODES.VALIDATION:
      return new TRPCError({
        code: "BAD_REQUEST",
        message: err.message,
      });

    case DOMAIN_ERROR_CODES.RESERVATION_NOT_FOUND:
    case DOMAIN_ERROR_CODES.NOT_FOUND:
      return new TRPCError({
        code: "NOT_FOUND",
        message: err.message,
      });

    case DOMAIN_ERROR_CODES.FORBIDDEN:
      return new TRPCError({
        code: "FORBIDDEN",
        message: err.message,
      });

    default:
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
  }
}

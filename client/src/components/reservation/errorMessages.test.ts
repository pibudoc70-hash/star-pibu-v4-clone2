/**
 * errorMessages.test.ts
 * parseTRPCError / parseOtpSendError / parseOtpVerifyError / parseReservationError 단위 테스트
 */
import { describe, it, expect } from "vitest";
import {
  parseTRPCError,
  parseOtpSendError,
  parseOtpVerifyError,
  parseReservationError,
} from "./errorMessages";

// ─── 헬퍼: TRPCClientErrorLike 모킹 ─────────────────────────────────────────
function mockErr(message: string, trpcCode?: string) {
  return {
    message,
    data: trpcCode ? { code: trpcCode } : undefined,
    // TRPCClientErrorLike 최소 필드
    shape: undefined,
    meta: undefined,
  } as Parameters<typeof parseTRPCError>[0];
}

// ─── parseTRPCError ───────────────────────────────────────────────────────────
describe("parseTRPCError", () => {
  it("OTP_COOLDOWN 코드가 메시지에 포함되면 ko 친절 메시지 반환", () => {
    const err = mockErr("OTP_COOLDOWN 인증번호는 60초 후에 다시 요청할 수 있습니다.");
    const result = parseTRPCError(err, "ko");
    expect(result).toContain("너무 자주 요청");
    expect(result).not.toContain("OTP_COOLDOWN");
  });

  it("OTP_COOLDOWN — en 메시지 반환", () => {
    const err = mockErr("OTP_COOLDOWN");
    const result = parseTRPCError(err, "en");
    expect(result).toContain("too many codes");
  });

  it("OTP_COOLDOWN — ja 메시지 반환", () => {
    const err = mockErr("OTP_COOLDOWN");
    const result = parseTRPCError(err, "ja");
    expect(result).toContain("認証番号");
  });

  it("OTP_COOLDOWN — zh 메시지 반환", () => {
    const err = mockErr("OTP_COOLDOWN");
    const result = parseTRPCError(err, "zh");
    expect(result).toBeTruthy();
  });

  it("OTP_INVALID 코드 — ko 친절 메시지 반환", () => {
    const err = mockErr("OTP_INVALID");
    const result = parseTRPCError(err, "ko");
    expect(result).toContain("올바르지 않습니다");
  });

  it("OTP_LOCKED 코드 — ko 친절 메시지 반환 (잠금 안내 포함)", () => {
    const err = mockErr("OTP_LOCKED");
    const result = parseTRPCError(err, "ko");
    expect(result).toContain("횟수를 초과");
  });

  it("OTP_EXPIRED 코드 — ko 친절 메시지 반환", () => {
    const err = mockErr("OTP_EXPIRED");
    const result = parseTRPCError(err, "ko");
    expect(result).toContain("만료");
  });

  it("RESERVATION_DATE_INVALID 코드 — ko 친절 메시지 반환", () => {
    const err = mockErr("RESERVATION_DATE_INVALID");
    const result = parseTRPCError(err, "ko");
    expect(result).toContain("예약이 불가능한 날짜");
  });

  it("RESERVATION_DATE_UNAVAILABLE 코드 — ko 친절 메시지 반환", () => {
    const err = mockErr("RESERVATION_DATE_UNAVAILABLE");
    const result = parseTRPCError(err, "ko");
    expect(result).toContain("마감");
  });

  it("TRPC TOO_MANY_REQUESTS 코드 폴백 — ko", () => {
    const err = mockErr("unknown error", "TOO_MANY_REQUESTS");
    const result = parseTRPCError(err, "ko");
    expect(result).toContain("요청이 너무 많습니다");
  });

  it("TRPC INTERNAL_SERVER_ERROR 코드 폴백 — ko", () => {
    const err = mockErr("internal error", "INTERNAL_SERVER_ERROR");
    const result = parseTRPCError(err, "ko");
    expect(result).toContain("일시적인 오류");
  });

  it("ko 언어에서 알 수 없는 에러는 백엔드 메시지 그대로 반환", () => {
    const err = mockErr("서버에서 알 수 없는 오류가 발생했습니다.");
    const result = parseTRPCError(err, "ko");
    expect(result).toBe("서버에서 알 수 없는 오류가 발생했습니다.");
  });

  it("en 언어에서 알 수 없는 에러는 기본 폴백 반환", () => {
    const err = mockErr("서버에서 알 수 없는 오류가 발생했습니다.");
    const result = parseTRPCError(err, "en");
    expect(result).toContain("error occurred");
  });
});

// ─── parseOtpSendError ────────────────────────────────────────────────────────
describe("parseOtpSendError", () => {
  it("쿨다운 메시지에서 초 단위 추출하여 ko 메시지에 포함", () => {
    const err = mockErr("OTP_COOLDOWN 인증번호는 45초 후에 다시 요청할 수 있습니다.");
    const result = parseOtpSendError(err, "ko");
    expect(result).toContain("45초");
  });

  it("초 단위 없으면 parseTRPCError 폴백 사용", () => {
    const err = mockErr("OTP_COOLDOWN");
    const result = parseOtpSendError(err, "ko");
    expect(result).toContain("너무 자주 요청");
  });

  it("en 언어에서는 parseTRPCError 결과 반환", () => {
    const err = mockErr("OTP_COOLDOWN");
    const result = parseOtpSendError(err, "en");
    expect(result).toContain("too many codes");
  });
});

// ─── parseOtpVerifyError ──────────────────────────────────────────────────────
describe("parseOtpVerifyError", () => {
  it("남은 시도 횟수가 메시지에 있으면 ko 메시지에 포함", () => {
    const err = mockErr("OTP_INVALID 남은 시도: 2회");
    const result = parseOtpVerifyError(err, "ko");
    expect(result).toContain("2회");
  });

  it("남은 시도 횟수 없으면 parseTRPCError 폴백 사용", () => {
    const err = mockErr("OTP_INVALID");
    const result = parseOtpVerifyError(err, "ko");
    expect(result).toContain("올바르지 않습니다");
  });

  it("OTP_LOCKED — ko 잠금 안내 메시지 반환", () => {
    const err = mockErr("OTP_LOCKED");
    const result = parseOtpVerifyError(err, "ko");
    expect(result).toContain("횟수를 초과");
  });
});

// ─── parseReservationError ────────────────────────────────────────────────────
describe("parseReservationError", () => {
  it("RESERVATION_DATE_INVALID — ko 친절 메시지 반환", () => {
    const err = mockErr("RESERVATION_DATE_INVALID");
    const result = parseReservationError(err, "ko");
    expect(result).toContain("예약이 불가능한 날짜");
  });

  it("VALIDATION — ko 친절 메시지 반환", () => {
    const err = mockErr("VALIDATION");
    const result = parseReservationError(err, "ko");
    expect(result).toContain("입력 정보를 다시 확인");
  });

  it("en 언어 — RESERVATION_DATE_UNAVAILABLE 친절 메시지 반환", () => {
    const err = mockErr("RESERVATION_DATE_UNAVAILABLE");
    const result = parseReservationError(err, "en");
    expect(result).toContain("fully booked");
  });
});

/**
 * errors.test.ts — DomainError 클래스 및 mapDomainErrorToTRPC 헬퍼 단위 테스트
 */
import { describe, it, expect } from "vitest";
import { TRPCError } from "@trpc/server";
import { DomainError, DOMAIN_ERROR_CODES, mapDomainErrorToTRPC } from "./errors";

// ─── DomainError ──────────────────────────────────────────────────────────────
describe("DomainError", () => {
  it("code와 message를 올바르게 저장한다", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.OTP_COOLDOWN, "60초 후 재시도");
    expect(err.code).toBe("OTP_COOLDOWN");
    expect(err.message).toBe("60초 후 재시도");
    expect(err.name).toBe("DomainError");
  });

  it("meta 정보를 선택적으로 저장한다", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.OTP_LOCKED, "잠금", { remainMin: 5 });
    expect(err.meta).toEqual({ remainMin: 5 });
  });

  it("meta 없이 생성 시 undefined", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.OTP_INVALID, "잘못된 코드");
    expect(err.meta).toBeUndefined();
  });

  it("instanceof Error를 만족한다", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.NOT_FOUND, "없음");
    expect(err instanceof Error).toBe(true);
    expect(err instanceof DomainError).toBe(true);
  });
});

// ─── mapDomainErrorToTRPC ─────────────────────────────────────────────────────
describe("mapDomainErrorToTRPC", () => {
  it("OTP_COOLDOWN → TOO_MANY_REQUESTS", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.OTP_COOLDOWN, "쿨다운");
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr).toBeInstanceOf(TRPCError);
    expect(trpcErr.code).toBe("TOO_MANY_REQUESTS");
    expect(trpcErr.message).toBe("쿨다운");
  });

  it("OTP_INVALID → BAD_REQUEST", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.OTP_INVALID, "잘못된 OTP");
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr.code).toBe("BAD_REQUEST");
  });

  it("OTP_EXPIRED → BAD_REQUEST", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.OTP_EXPIRED, "만료된 OTP");
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr.code).toBe("BAD_REQUEST");
  });

  it("OTP_LOCKED → TOO_MANY_REQUESTS", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.OTP_LOCKED, "5분 후 재시도", { remainMin: 5 });
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr.code).toBe("TOO_MANY_REQUESTS");
    expect(trpcErr.message).toBe("5분 후 재시도");
  });

  it("RESERVATION_DATE_INVALID → BAD_REQUEST", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.RESERVATION_DATE_INVALID, "당일 예약 불가");
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr.code).toBe("BAD_REQUEST");
  });

  it("RESERVATION_DATE_UNAVAILABLE → BAD_REQUEST", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.RESERVATION_DATE_UNAVAILABLE, "예약 불가 날짜");
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr.code).toBe("BAD_REQUEST");
  });

  it("RESERVATION_NOT_FOUND → NOT_FOUND", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.RESERVATION_NOT_FOUND, "예약 없음");
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr.code).toBe("NOT_FOUND");
  });

  it("NOT_FOUND → NOT_FOUND", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.NOT_FOUND, "없음");
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr.code).toBe("NOT_FOUND");
  });

  it("FORBIDDEN → FORBIDDEN", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.FORBIDDEN, "권한 없음");
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr.code).toBe("FORBIDDEN");
  });

  it("VALIDATION → BAD_REQUEST", () => {
    const err = new DomainError(DOMAIN_ERROR_CODES.VALIDATION, "형식 오류");
    const trpcErr = mapDomainErrorToTRPC(err);
    expect(trpcErr.code).toBe("BAD_REQUEST");
  });

  it("DomainError가 아닌 에러는 그대로 re-throw한다", () => {
    const original = new Error("알 수 없는 오류");
    expect(() => mapDomainErrorToTRPC(original)).toThrow("알 수 없는 오류");
  });

  it("DomainError가 아닌 에러는 TRPCError를 반환하지 않는다", () => {
    const original = new Error("원본 오류");
    let caught: unknown;
    try {
      mapDomainErrorToTRPC(original);
    } catch (e) {
      caught = e;
    }
    expect(caught).toBe(original);
    expect(caught).not.toBeInstanceOf(TRPCError);
  });
});

// ─── admin.service normalizeYouTubeCreatePayload ──────────────────────────────
import { normalizeYouTubeCreatePayload } from "../services/admin.service";

describe("normalizeYouTubeCreatePayload", () => {
  it("sortOrder 미지정 시 0으로 기본값 설정", () => {
    const result = normalizeYouTubeCreatePayload({
      title: "테스트 영상",
      videoId: "abc123",
      type: "video",
    });
    expect(result.sortOrder).toBe(0);
    expect(result.isActive).toBe("1");
  });

  it("sortOrder 지정 시 해당 값 사용", () => {
    const result = normalizeYouTubeCreatePayload({
      title: "쇼츠",
      videoId: "xyz789",
      type: "shorts",
      sortOrder: 5,
    });
    expect(result.sortOrder).toBe(5);
    expect(result.type).toBe("shorts");
  });

  it("isActive는 항상 '1'", () => {
    const result = normalizeYouTubeCreatePayload({
      title: "영상",
      videoId: "vid001",
      type: "video",
    });
    expect(result.isActive).toBe("1");
  });
});

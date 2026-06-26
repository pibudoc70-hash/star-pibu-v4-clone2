/**
 * reservation.service.test.ts — 예약 Service 계층 단위 테스트
 *
 * 커버리지:
 *  - validatePhone: 유효/무효 형식
 *  - validateReservationDate: 당일·일요일·내일 이후
 *  - cancelGuestReservationWithOtp: OTP 불일치 시 throw
 *
 * DB·외부 서비스 의존 함수(createMemberReservation, createGuestReservation)는
 * 통합 테스트 영역이므로 여기서는 순수 검증 로직만 단위 테스트한다.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { DomainError, DOMAIN_ERROR_CODES } from "../shared/errors";
import {
  validatePhone,
  validateReservationDate,
} from "./reservation.service";

// ─── validatePhone ─────────────────────────────────────────────────────────────
describe("validatePhone", () => {
  it("하이픈 포함 형식(010-1234-5678)을 허용한다", () => {
    expect(() => validatePhone("010-1234-5678")).not.toThrow();
  });

  it("하이픈 없는 형식(01012345678)을 허용한다", () => {
    expect(() => validatePhone("01012345678")).not.toThrow();
  });

  it("011 번호를 허용한다", () => {
    expect(() => validatePhone("011-123-4567")).not.toThrow();
  });

  it("빈 문자열은 거부한다", () => {
    expect(() => validatePhone("")).toThrow("올바른 휴대폰 번호 형식");
  });

  it("국제번호 형식(+82...)은 거부한다", () => {
    expect(() => validatePhone("+82-10-1234-5678")).toThrow("올바른 휴대폰 번호 형식");
  });

  it("자릿수 부족(010-123-456)은 거부한다", () => {
    expect(() => validatePhone("010-123-456")).toThrow("올바른 휴대폰 번호 형식");
  });

  it("유효하지 않은 번호는 DomainError(VALIDATION)를 던진다", () => {
    let caught: unknown;
    try { validatePhone("abc"); } catch (e) { caught = e; }
    expect(caught).toBeInstanceOf(DomainError);
    expect((caught as DomainError).code).toBe(DOMAIN_ERROR_CODES.VALIDATION);
  });
});

// ─── validateReservationDate ───────────────────────────────────────────────────
describe("validateReservationDate", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("내일 날짜(평일)는 허용한다", () => {
    // 2026-06-15 KST 10:00 기준 → 내일 2026-06-16 KST 12:00
    // KST 정오를 사용해야 UTC 환경에서도 getDate()가 16으로 읽힌
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T10:00:00+09:00"));
    const tomorrow = new Date("2026-06-16T12:00:00+09:00").getTime();
    expect(() => validateReservationDate(tomorrow)).not.toThrow();
    vi.useRealTimers();
  });

  it("당일 날짜는 거부한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T10:00:00+09:00"));
    const today = new Date("2026-06-15T00:00:00+09:00").getTime();
    expect(() => validateReservationDate(today)).toThrow("당일 예약은 불가");
    vi.useRealTimers();
  });

  it("과거 날짜는 거부한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T10:00:00+09:00"));
    const past = new Date("2026-06-10T00:00:00+09:00").getTime();
    expect(() => validateReservationDate(past)).toThrow("당일 예약은 불가");
    vi.useRealTimers();
  });

  it("일요일 날짜는 거부한다", () => {
    // 2026-07-05 KST 12:00 사용: UTC에서 getDay()=0 (일요일) — 미래 날짜
    // KST 자정(00:00)은 UTC 토요일 15:00이라 getDay()=6이 되므로 정오 사용
    const sunday = new Date("2026-07-05T12:00:00+09:00").getTime();
    expect(() => validateReservationDate(sunday)).toThrow("일요일은 예약이 불가");
  });

  it("토요일 날짜는 허용한다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T10:00:00+09:00"));
    // 2026-06-20 KST 12:00 사용: UTC에서 getDay()=6 (토요일)
    const saturday = new Date("2026-06-20T12:00:00+09:00").getTime();
    expect(() => validateReservationDate(saturday)).not.toThrow();
    vi.useRealTimers();
  });

  it("일요일 날짜는 DomainError(RESERVATION_DATE_INVALID)를 던진다", () => {
    const sunday = new Date("2026-07-05T12:00:00+09:00").getTime();
    let caught: unknown;
    try { validateReservationDate(sunday); } catch (e) { caught = e; }
    expect(caught).toBeInstanceOf(DomainError);
    expect((caught as DomainError).code).toBe(DOMAIN_ERROR_CODES.RESERVATION_DATE_INVALID);
  });

  it("당일 날짜는 DomainError(RESERVATION_DATE_INVALID)를 던진다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T10:00:00+09:00"));
    const today = new Date("2026-06-15T00:00:00+09:00").getTime();
    let caught: unknown;
    try { validateReservationDate(today); } catch (e) { caught = e; }
    expect(caught).toBeInstanceOf(DomainError);
    expect((caught as DomainError).code).toBe(DOMAIN_ERROR_CODES.RESERVATION_DATE_INVALID);
    vi.useRealTimers();
  });
});

// ─── cancelGuestReservationWithOtp (OTP 실패 경로) ────────────────────────────
describe("cancelGuestReservationWithOtp — OTP 실패 경로", () => {
  it("verifyGuestOtp가 false를 반환하면 에러를 던진다", async () => {
    // DB 없이 순수 로직만 검증: verifyGuestOtp를 mock
    vi.mock("../db", async (importOriginal) => {
      const actual = await importOriginal<typeof import("../db")>();
      return {
        ...actual,
        verifyGuestOtp: vi.fn().mockResolvedValue(false),
        cancelGuestReservation: vi.fn().mockResolvedValue(undefined),
      };
    });
    const { cancelGuestReservationWithOtp } = await import("./reservation.service");
    let caught: unknown;
    try {
      await cancelGuestReservationWithOtp(1, "010-1234-5678", "000000");
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(DomainError);
    expect((caught as DomainError).code).toBe(DOMAIN_ERROR_CODES.OTP_INVALID);
  });
});

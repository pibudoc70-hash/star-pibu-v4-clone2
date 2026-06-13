/**
 * reservation.test.ts — 예약 라우터 회귀 테스트
 * 검증 항목:
 *  1. scheduleRouter.unavailableDates — DB 없을 때 빈 배열 반환
 *  2. reservationRouter.unavailableDates — scheduleRouter와 동일 동작 (중복 경로 일관성)
 *  3. reservationRouter.verifyOtp — 잘못된 OTP → BAD_REQUEST
 *  4. reservationRouter.createGuest — 잘못된 전화번호 형식 → 에러
 *  5. reservationRouter.createGuest — 일요일 예약 → 에러
 *  6. reservationRouter.myReservations — 인증된 사용자의 예약 목록 반환
 *  7. reservationRouter.cancel — 본인 예약 취소 성공
 *  8. reservationRouter.cancel — 인증 없이 취소 시도 → UNAUTHORIZED
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "../_core/context";

// DB 모킹: 모든 테스트에서 DB를 null로 반환
vi.mock("../db", async () => {
  const actual = await vi.importActual<typeof import("../db")>("../db");
  return {
    ...actual,
    getDb: vi.fn().mockResolvedValue(null),
    getUnavailableSlots: vi.fn().mockResolvedValue([]),
    verifyGuestOtp: vi.fn().mockResolvedValue(false),
    createGuestOtp: vi.fn().mockResolvedValue(undefined),
    generateOtpCode: vi.fn().mockReturnValue("123456"),
    getReservationsByUserId: vi.fn().mockResolvedValue([
      { id: 1, patientName: "홍길동", status: "pending" },
    ]),
    cancelReservation: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock("../sms", () => ({
  sendSMS: vi.fn().mockResolvedValue(false),
  getOTPMessage: vi.fn().mockReturnValue("인증번호: 123456"),
}));

vi.mock("../_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAuthCtx(userId = 42): TrpcContext {
  return {
    user: {
      id: userId,
      openId: "test-open-id",
      name: "홍길동",
      email: "test@example.com",
      role: "user" as const,
      createdAt: Date.now(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("scheduleRouter", () => {
  it("unavailableDates — DB 없을 때 빈 배열 반환", async () => {
    const { scheduleRouter } = await import("./reservation");
    const caller = scheduleRouter.createCaller(createPublicCtx());
    const result = await caller.unavailableDates();
    expect(result).toEqual([]);
  });
});

describe("reservationRouter.unavailableDates", () => {
  it("scheduleRouter와 동일하게 빈 배열 반환 (중복 경로 일관성)", async () => {
    const { reservationRouter } = await import("./reservation");
    const caller = reservationRouter.createCaller(createPublicCtx());
    const result = await caller.unavailableDates();
    expect(result).toEqual([]);
  });
});

describe("reservationRouter.verifyOtp", () => {
  it("잘못된 OTP → BAD_REQUEST 에러", async () => {
    const { reservationRouter } = await import("./reservation");
    const caller = reservationRouter.createCaller(createPublicCtx());
    await expect(
      caller.verifyOtp({ phone: "01012345678", code: "000000" })
    ).rejects.toThrow(TRPCError);
  });
});

describe("reservationRouter.createGuest", () => {
  it("잘못된 전화번호 형식 → 에러", async () => {
    const { reservationRouter } = await import("./reservation");
    const caller = reservationRouter.createCaller(createPublicCtx());
    await expect(
      caller.createGuest({
        patientName: "홍길동",
        phone: "123456789",       // 9자 이상이지만 한국 휴대폰 형식 불일치
        otpCode: "123456",
        treatmentCategory: "레이저",
        treatmentName: "토닝",
        preferredDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
        preferredTime: "10:00",
      })
    ).rejects.toThrow("올바른 휴대폰 번호 형식");
  });

  it("일요일 예약 → 에러", async () => {
    const { reservationRouter } = await import("./reservation");
    const caller = reservationRouter.createCaller(createPublicCtx());

    // 다음 일요일 날짜 계산 (최소 2일 후 일요일 보장)
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    const nextSunday = new Date(now);
    // 내일 이후 날짜 조건 충족: 최소 2일 후 일요일
    nextSunday.setDate(now.getDate() + Math.max(daysUntilSunday, 2));
    // 일요일(0)이 아니면 다음 일요일로 조정
    while (nextSunday.getDay() !== 0) {
      nextSunday.setDate(nextSunday.getDate() + 1);
    }
    nextSunday.setHours(12, 0, 0, 0);

    await expect(
      caller.createGuest({
        patientName: "홍길동",
        phone: "010-1234-5678",
        otpCode: "123456",
        treatmentCategory: "레이저",
        treatmentName: "토닝",
        preferredDate: nextSunday.getTime(),
        preferredTime: "10:00",
      })
    ).rejects.toThrow("일요일");
  });
});

describe("reservationRouter.myReservations", () => {
  it("인증된 사용자 — 예약 목록 반환", async () => {
    const { reservationRouter } = await import("./reservation");
    const caller = reservationRouter.createCaller(createAuthCtx(42));
    const result = await caller.myReservations();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
  });

  it("비인증 사용자 — UNAUTHORIZED 에러", async () => {
    const { reservationRouter } = await import("./reservation");
    const caller = reservationRouter.createCaller(createPublicCtx());
    await expect(caller.myReservations()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

describe("reservationRouter.cancel", () => {
  it("인증된 사용자 — 예약 취소 성공", async () => {
    const { reservationRouter } = await import("./reservation");
    const caller = reservationRouter.createCaller(createAuthCtx(42));
    const result = await caller.cancel({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("비인증 사용자 — UNAUTHORIZED 에러", async () => {
    const { reservationRouter } = await import("./reservation");
    const caller = reservationRouter.createCaller(createPublicCtx());
    await expect(caller.cancel({ id: 1 })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

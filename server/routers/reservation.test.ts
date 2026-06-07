/**
 * reservation.test.ts — 예약 라우터 회귀 테스트
 * 검증 항목:
 *  1. scheduleRouter.unavailableDates — DB 없을 때 빈 배열 반환
 *  2. reservationRouter.verifyOtp — 잘못된 OTP → BAD_REQUEST
 *  3. reservationRouter.createGuest — 잘못된 전화번호 형식 → 에러
 *  4. reservationRouter.createGuest — 일요일 예약 → 에러
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

describe("scheduleRouter", () => {
  it("unavailableDates — DB 없을 때 빈 배열 반환", async () => {
    const { scheduleRouter } = await import("./reservation");
    const caller = scheduleRouter.createCaller(createPublicCtx());
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

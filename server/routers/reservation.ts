/**
 * reservation.ts — 예약 라우터 (회원 + 비회원 OTP)
 *
 * 책임: 입력 파싱, 권한 검사, HTTP 에러 변환
 * 비즈니스 로직은 server/services/reservation.service.ts 에 위임한다.
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getReservationsByUserId, cancelReservation,
  getUnavailableSlots,
} from "../db";
import {
  createMemberReservation,
  createGuestReservation,
  cancelGuestReservationWithOtp,
  sendGuestReservationOtp,
  verifyGuestReservationOtp,
} from "../services/reservation.service";

export const reservationRouter = router({
  // 공개: 예약 불가 날짜 목록
  unavailableDates: publicProcedure.query(async () => {
    return getUnavailableSlots(undefined);
  }),

  // 회원 예약 신청
  create: protectedProcedure
    .input(z.object({
      patientName: z.string().min(1).max(100),
      phone: z.string().min(8).max(20),
      treatmentCategory: z.string().min(1).max(100),
      treatmentName: z.string().min(1).max(200),
      preferredDate: z.number(),
      preferredTime: z.string().min(4).max(10),
      notes: z.string().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return createMemberReservation({
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        patientName: input.patientName,
        phone: input.phone,
        treatmentCategory: input.treatmentCategory,
        treatmentName: input.treatmentName,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        notes: input.notes,
      });
    }),

  // 내 예약 목록 조회
  myReservations: protectedProcedure.query(async ({ ctx }) => {
    return getReservationsByUserId(ctx.user.id);
  }),

  // 예약 취소 (본인만)
  cancel: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await cancelReservation(input.id, ctx.user.id);
      return { success: true };
    }),

  // OTP 발송 (비회원 전화번호 인증)
  sendOtp: publicProcedure
    .input(z.object({ phone: z.string().min(9).max(20) }))
    .mutation(async ({ input }) => {
      try {
        return await sendGuestReservationOtp(input.phone);
      } catch (err) {
        if (err instanceof Error && err.message === "OTP_COOLDOWN") {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "인증번호는 60초 후에 다시 요청할 수 있습니다.",
          });
        }
        throw err;
      }
    }),

  // OTP 검증
  verifyOtp: publicProcedure
    .input(z.object({
      phone: z.string().min(9).max(20),
      code: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      try {
        return await verifyGuestReservationOtp(input.phone, input.code);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "OTP_INVALID") {
            throw new TRPCError({ code: "BAD_REQUEST", message: "인증번호가 올바르지 않거나 만료되었습니다." });
          }
          if (err.message.startsWith("OTP_LOCKED:")) {
            const remainMin = err.message.split(":")[1];
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: `인증 시도 횟수를 초과했습니다. ${remainMin}분 후 다시 시도해주세요.`,
            });
          }
        }
        throw err;
      }
    }),

  // 비회원 예약 생성 (OTP 인증 완료 후)
  createGuest: publicProcedure
    .input(z.object({
      patientName: z.string().min(1).max(100),
      phone: z.string().min(9).max(20),
      otpCode: z.string().length(6),
      treatmentCategory: z.string().min(1).max(100),
      treatmentName: z.string().min(1).max(200),
      preferredDate: z.number(),
      preferredTime: z.string().min(4).max(10),
      notes: z.string().max(1000).optional(),
    }))
    .mutation(async ({ input }) => {
      return createGuestReservation({
        patientName: input.patientName,
        phone: input.phone,
        otpCode: input.otpCode,
        treatmentCategory: input.treatmentCategory,
        treatmentName: input.treatmentName,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        notes: input.notes,
      });
    }),

  // 비회원 예약 취소
  cancelGuest: publicProcedure
    .input(z.object({
      id: z.number(),
      phone: z.string().min(9).max(20),
      otpCode: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      await cancelGuestReservationWithOtp(input.id, input.phone, input.otpCode);
      return { success: true };
    }),
});

// schedule 서브라우터 (예약 불가 날짜 공개 조회 — 기존 appRouter.schedule 유지)
export const scheduleRouter = router({
  unavailableDates: publicProcedure.query(async () => {
    return getUnavailableSlots(undefined);
  }),
});

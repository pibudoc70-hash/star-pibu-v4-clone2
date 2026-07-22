import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { cancelReservation, getReservationsByUserId, getUnavailableSlots } from "../db";
import {
  cancelGuestReservationWithOtp,
  createGuestReservation,
  createMemberReservation,
  sendGuestReservationOtp,
  verifyGuestReservationOtp,
} from "../services/reservation.service";
import { mapDomainErrorToTRPC } from "../shared/errors";

const phoneSchema = z.string().regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, "올바른 휴대폰 번호 형식이 아닙니다.");
const reservationInput = {
  patientName: z.string().trim().min(1).max(100),
  phone: phoneSchema,
  privacyAgreed: z.literal(true, { error: "개인정보 수집 및 이용 동의가 필요합니다." }),
  treatmentCategory: z.string().trim().min(1).max(100),
  treatmentName: z.string().trim().min(1).max(200),
  preferredDate: z.number().int().positive(),
  preferredTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:mm 형식이어야 합니다."),
  notes: z.string().trim().max(1000).optional(),
};

function requireSocialReservationLogin(loginMethod: string | null) {
  if (loginMethod !== "naver" && loginMethod !== "kakao") {
    throw new TRPCError({ code: "FORBIDDEN", message: "네이버 또는 카카오 로그인 후 예약할 수 있습니다." });
  }
}

export const reservationRouter = router({
  unavailableDates: publicProcedure.query(() => getUnavailableSlots(undefined)),

  /** Only a Naver/Kakao session may create a member reservation. */
  create: protectedProcedure
    .input(z.object(reservationInput))
    .mutation(async ({ ctx, input }) => {
      requireSocialReservationLogin(ctx.user.loginMethod);
      return createMemberReservation({ ...input, userId: ctx.user.id, userEmail: ctx.user.email });
    }),

  myReservations: protectedProcedure.query(({ ctx }) => getReservationsByUserId(ctx.user.id)),

  cancel: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await cancelReservation(input.id, ctx.user.id);
      return { success: true };
    }),

  // Backwards-compatible guest OTP flow. It may be removed later without
  // affecting social reservations; it now uses hashed, single-use OTPs.
  sendOtp: publicProcedure
    .input(z.object({ phone: phoneSchema }))
    .mutation(async ({ input }) => {
      try { return await sendGuestReservationOtp(input.phone); }
      catch (err) { throw mapDomainErrorToTRPC(err); }
    }),

  verifyOtp: publicProcedure
    .input(z.object({ phone: phoneSchema, code: z.string().regex(/^\d{6}$/) }))
    .mutation(async ({ input }) => {
      try { return await verifyGuestReservationOtp(input.phone, input.code); }
      catch (err) { throw mapDomainErrorToTRPC(err); }
    }),

  createGuest: publicProcedure
    .input(z.object({ ...reservationInput, otpCode: z.string().regex(/^\d{6}$/) }))
    .mutation(({ input }) => createGuestReservation(input)),

  cancelGuest: publicProcedure
    .input(z.object({ id: z.number().int().positive(), phone: phoneSchema, otpCode: z.string().regex(/^\d{6}$/) }))
    .mutation(async ({ input }) => {
      await cancelGuestReservationWithOtp(input.id, input.phone, input.otpCode);
      return { success: true };
    }),
});

export const scheduleRouter = router({
  unavailableDates: publicProcedure.query(() => getUnavailableSlots(undefined)),
});

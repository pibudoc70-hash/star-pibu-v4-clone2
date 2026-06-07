/**
 * reservation.ts — 예약 라우터 (회원 + 비회원 OTP)
 * 분리 근거: server/routers.ts 914줄 → 기능 단위 모듈화 (Round-8 리팩터)
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createReservation, getReservationsByUserId, cancelReservation,
  generateOtpCode, createGuestOtp, verifyGuestOtp, cancelGuestReservation,
  getUnavailableSlots,
} from "../db";
import { notifyOwner } from "../_core/notification";
import { sendEmail, getReservationConfirmationEmail, getAdminNotificationEmail } from "../email";
import { sendSMS, getOTPMessage } from "../sms";
import { logger } from "../_core/logger";

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
      const reservation = await createReservation({
        userId: ctx.user.id,
        patientName: input.patientName,
        phone: input.phone,
        treatmentCategory: input.treatmentCategory,
        treatmentName: input.treatmentName,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        notes: input.notes ?? null,
        status: "pending",
      });

      if (!reservation) throw new Error("Failed to create reservation");
      const reservationId = reservation.id;

      const preferredDateStr = new Date(input.preferredDate).toLocaleDateString("ko-KR", {
        year: "numeric", month: "long", day: "numeric", weekday: "short",
      });

      try {
        if (!ctx.user.email) {
          logger.warn("Email", "User email not available, skipping customer email");
        } else {
          await sendEmail({
            to: ctx.user.email,
            subject: `[STAR 피부과] 예약 접수 알림 - #${reservationId}`,
            html: getReservationConfirmationEmail({
              patientName: input.patientName,
              treatmentName: input.treatmentName,
              preferredDate: preferredDateStr,
              preferredTime: input.preferredTime,
              phone: input.phone,
              notes: input.notes,
              reservationId,
            }),
          });
        }
      } catch (emailErr) {
        logger.error("Email", "예약 확인 이메일 발송 중 오류", emailErr);
      }

      await notifyOwner({
        title: "새 예약 신청",
        content: `${input.patientName}님이 [${input.treatmentName}] 예약을 신청했습니다.\n희망일시: ${preferredDateStr} ${input.preferredTime}\n연락처: ${input.phone}`,
      });

      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL || "admin@star-pibu.com",
          subject: `[관리자] 새로운 예약 신청 - #${reservationId}`,
          html: getAdminNotificationEmail({
            patientName: input.patientName,
            phone: input.phone,
            treatmentName: input.treatmentName,
            preferredDate: preferredDateStr,
            preferredTime: input.preferredTime,
            notes: input.notes,
            reservationId,
          }),
        });
      } catch (emailErr) {
        logger.error("Email", "관리자 알림 이메일 발송 중 오류", emailErr);
      }

      return { success: true };
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
      const { getDb } = await import("../db");
      const { guestOtps: guestOtpsTable } = await import("../../drizzle/schema");
      const { eq, and, gt } = await import("drizzle-orm");
      const db = await getDb();
      if (db) {
        const cooldownMs = 60 * 1000;
        const recentRows = await db.select({ id: guestOtpsTable.id })
          .from(guestOtpsTable)
          .where(and(
            eq(guestOtpsTable.phone, input.phone),
            gt(guestOtpsTable.expiresAt, Date.now() + (5 * 60 * 1000) - cooldownMs)
          ))
          .limit(1);
        if (recentRows.length > 0) {
          throw new Error("인증번호는 60초 후에 다시 요청할 수 있습니다.");
        }
      }

      const code = generateOtpCode();
      await createGuestOtp(input.phone, code);

      const message = getOTPMessage(code, 10);
      const smsSent = await sendSMS({ phone: input.phone, message });
      if (!smsSent) logger.warn("OTP", "SMS 발송 실패");

      return { success: true, smsSent };
    }),

  // OTP 검증
  verifyOtp: publicProcedure
    .input(z.object({
      phone: z.string().min(9).max(20),
      code: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      try {
        const ok = await verifyGuestOtp(input.phone, input.code);
        if (!ok) throw new TRPCError({ code: "BAD_REQUEST", message: "인증번호가 올바르지 않거나 만료되었습니다." });
        return { verified: true };
      } catch (err) {
        if (err instanceof Error && err.message.startsWith("OTP_LOCKED:")) {
          const lockedUntil = parseInt(err.message.split(":")[1], 10);
          const remainMin = Math.ceil((lockedUntil - Date.now()) / 60000);
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `인증 시도 횟수를 초과했습니다. ${remainMin}분 후 다시 시도해주세요.`,
          });
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
      const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$|^01[0-9]\d{7,8}$/;
      if (!phoneRegex.test(input.phone)) {
        throw new Error("올바른 휴대폰 번호 형식이 아닙니다. (010-1234-5678 또는 01012345678 형식)");
      }

      const preferredDateObj = new Date(input.preferredDate);
      const koNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
      const koToday = new Date(koNow.getFullYear(), koNow.getMonth(), koNow.getDate());
      const koTomorrow = new Date(koToday); koTomorrow.setDate(koTomorrow.getDate() + 1);
      const dateOnly = new Date(preferredDateObj.getFullYear(), preferredDateObj.getMonth(), preferredDateObj.getDate());
      if (dateOnly < koTomorrow) throw new Error("당일 예약은 불가합니다. 내일 이후 날짜를 선택해주세요.");
      if (preferredDateObj.getDay() === 0) throw new Error("일요일은 예약이 불가합니다.");

      const dateStr = `${preferredDateObj.getFullYear()}-${String(preferredDateObj.getMonth()+1).padStart(2,'0')}-${String(preferredDateObj.getDate()).padStart(2,'0')}`;
      const unavailableSlots = await getUnavailableSlots(undefined);
      if (unavailableSlots.some((s: { date: string }) => s.date === dateStr)) {
        throw new Error("해당 날짜는 예약이 불가합니다. 다른 날짜를 선택해주세요.");
      }

      const ok = await verifyGuestOtp(input.phone, input.otpCode);
      if (!ok) {
        const { getDb } = await import("../db");
        const { guestOtps } = await import("../../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        const db = await getDb();
        if (!db) throw new Error("DB not available");
        const rows = await db.select().from(guestOtps)
          .where(and(eq(guestOtps.phone, input.phone), eq(guestOtps.code, input.otpCode), eq(guestOtps.verified, "1")))
          .limit(1);
        if (rows.length === 0 || rows[0].expiresAt < Date.now() - 10 * 60 * 1000) {
          throw new Error("인증이 만료되었습니다. 다시 인증해주세요.");
        }
      }

      await createReservation({
        userId: null,
        isGuest: "1",
        patientName: input.patientName,
        phone: input.phone,
        treatmentCategory: input.treatmentCategory,
        treatmentName: input.treatmentName,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        notes: input.notes ?? null,
        status: "pending",
      });

      await notifyOwner({
        title: "새 예약 신청 (비회원)",
        content: `${input.patientName}님(비회원)이 [${input.treatmentName}] 예약을 신청했습니다.\n희망일시: ${new Date(input.preferredDate).toLocaleDateString("ko-KR")} ${input.preferredTime}\n연락처: ${input.phone}`,
      });

      try {
        // SMS 기능 비활성화 (별도 설정 필요)
      } catch (smsErr) {
        logger.error("SMS", "비회원 예약 접수 SMS 오류", smsErr);
      }

      return { success: true };
    }),

  // 비회원 예약 취소
  cancelGuest: publicProcedure
    .input(z.object({
      id: z.number(),
      phone: z.string().min(9).max(20),
      otpCode: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      const ok = await verifyGuestOtp(input.phone, input.otpCode);
      if (!ok) throw new Error("인증번호가 올바르지 않거나 만료되었습니다.");
      await cancelGuestReservation(input.id, input.phone);
      return { success: true };
    }),
});

// schedule 서브라우터 (예약 불가 날짜 공개 조회 — 기존 appRouter.schedule 유지)
export const scheduleRouter = router({
  unavailableDates: publicProcedure.query(async () => {
    return getUnavailableSlots(undefined);
  }),
});

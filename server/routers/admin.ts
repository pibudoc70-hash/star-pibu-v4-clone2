/**
 * admin.ts — 관리자 라우터 (회원/예약 관리 + 예약불가날짜 + YouTube)
 * 분리 근거: server/routers.ts 914줄 → 기능 단위 모듈화 (Round-8 리팩터)
 */
import { z } from "zod/v4";
import { adminProcedure, router } from "../_core/trpc";
import {
  getAllReservations, updateReservationStatus, getReservationStats, getReservationById,
  createUnavailableSlot, getUnavailableSlots, deleteUnavailableSlot, updateUnavailableSlot,
  getAllYouTubeVideos, getYouTubeVideosByType, createYouTubeVideo, updateYouTubeVideo, deleteYouTubeVideo,
  listUsers as dbListUsers, updateUserRole as dbUpdateUserRole, getUserStats,
} from "../db";
import { logger } from "../_core/logger";

export const adminRouter = router({
  // 회원 목록 조회
  listUsers: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const result = await dbListUsers(input.page, input.pageSize);
      return { ...result, page: input.page, pageSize: input.pageSize };
    }),

  // 회원 역할 변경
  updateUserRole: adminProcedure
    .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ input }) => {
      await dbUpdateUserRole(input.userId, input.role);
      return { success: true };
    }),

  // 전체 통계
  stats: adminProcedure.query(async () => {
    const [userStats, reservationStats] = await Promise.all([
      getUserStats(),
      getReservationStats(),
    ]);
    return { ...userStats, reservations: reservationStats };
  }),

  // 예약 목록 조회 (관리자)
  listReservations: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const result = await getAllReservations(input.page, input.pageSize);
      return { ...result, page: input.page, pageSize: input.pageSize };
    }),

  // 예약 상태 변경 (관리자)
  updateReservationStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      adminNote: z.string().max(500).optional(),
      sendAlimtalk: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      // Repository 헬퍼로 예약 조회 (라우터에서 직접 DB 호출 금지)
      const reservation = await getReservationById(input.id);

      await updateReservationStatus(input.id, input.status, input.adminNote);

      if (reservation) {
        try {
          if (reservation.isGuest === "1") {
            logger.info("Email", "비회원 예약 상태 변경 처리");
          } else {
            logger.info("Email", "회원 예약 상태 변경 처리");
            // NOTE (PR-39): 예약 상태 변경 시 회원에게 이메일 발송 지점
            // 활성화 방법: server/email.ts의 TO ENABLE 절차 후 아래 코드 주석 해제
            // const user = await getUserById(reservation.userId);
            // if (user?.email) {
            //   await sendEmail(getReservationStatusEmail({ ... }));
            // }
          }
        } catch (emailErr) {
          logger.error("Email", "상태 변경 이메일 발송 중 오류", emailErr);
        }
      }
    }),

  // 예약 불가능 날짜 관리
  unavailableSlots: router({
    list: adminProcedure
      .input(z.object({ date: z.string().optional() }))
      .query(async ({ input }) => getUnavailableSlots(input.date)),

    create: adminProcedure
      .input(z.object({
        date: z.string().min(10).max(10),
        reason: z.string().optional(),
      }))
      .mutation(async ({ input }) => createUnavailableSlot({ date: input.date, reason: input.reason || null })),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteUnavailableSlot(input.id);
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        date: z.string().min(10).max(10).optional(),
        reason: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateUnavailableSlot(id, data);
      }),
  }),

  // YouTube 영상 관리
  youtube: router({
    getAll: adminProcedure.query(async () => getAllYouTubeVideos()),

    getByType: adminProcedure
      .input(z.object({ type: z.enum(["video", "shorts"]) }))
      .query(async ({ input }) => getYouTubeVideosByType(input.type)),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        videoId: z.string().min(1).max(50),
        type: z.enum(["video", "shorts"]),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => createYouTubeVideo({
        title: input.title,
        videoId: input.videoId,
        type: input.type,
        sortOrder: input.sortOrder || 0,
        isActive: "1",
      })),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        videoId: z.string().min(1).max(50).optional(),
        type: z.enum(["video", "shorts"]).optional(),
        sortOrder: z.number().optional(),
        isActive: z.enum(["0", "1"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateYouTubeVideo(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteYouTubeVideo(input.id);
        return { success: true };
      }),
  }),
});

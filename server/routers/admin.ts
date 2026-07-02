/**
 * admin.ts — 관리자 라우터 (회원/예약 관리 + 예약불가날짜 + YouTube)
 * 분리 근거: server/routers.ts 914줄 → 기능 단위 모듈화 (Round-8 리팩터)
 */
import { z } from "zod/v4";
import { adminProcedure, router } from "../_core/trpc";
import {
  getAllReservations,
  createUnavailableSlot, getUnavailableSlots, deleteUnavailableSlot, updateUnavailableSlot,
  getAllYouTubeVideos, getYouTubeVideosByType, createYouTubeVideo, updateYouTubeVideo, deleteYouTubeVideo,
  listUsers as dbListUsers, updateUserRole as dbUpdateUserRole,
} from "../db";
import { updateAdminReservationStatus, normalizeYouTubeCreatePayload, getAdminStats } from "../services/admin.service";
import { invalidateCache } from "../_core/cache";

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
    return getAdminStats();
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
      await updateAdminReservationStatus(input);
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
      .mutation(async ({ input }) => {
        const result = await createYouTubeVideo(normalizeYouTubeCreatePayload(input));
        invalidateCache("youtube:");
        return result;
      }),

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
        const result = await updateYouTubeVideo(id, data);
        invalidateCache("youtube:");
        return result;
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteYouTubeVideo(input.id);
        invalidateCache("youtube:");
        return { success: true };
      }),
    /** 드래그 앤 드롭 순서 일괄 저장: ids 배열의 인덱스 순서대로 sortOrder 업데이트 */
    reorder: adminProcedure
      .input(z.object({ ids: z.array(z.number()).min(1) }))
      .mutation(async ({ input }) => {
        await Promise.all(
          input.ids.map((id, index) => updateYouTubeVideo(id, { sortOrder: index }))
        );
        invalidateCache("youtube:");
        return { success: true };
      }),
  }),
});

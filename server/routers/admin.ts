/**
 * admin.ts — 관리자 라우터 (회원/예약 관리 + 예약불가날짜 + YouTube)
 * 분리 근거: server/routers.ts 914줄 → 기능 단위 모듈화 (Round-8 리팩터)
 */
import { z } from "zod/v4";
import { adminProcedure, router } from "../_core/trpc";
import {
  getDb,
  getAllReservations, updateReservationStatus, getReservationStats,
  createUnavailableSlot, getUnavailableSlots, deleteUnavailableSlot, updateUnavailableSlot,
  getAllYouTubeVideos, getYouTubeVideosByType, createYouTubeVideo, updateYouTubeVideo, deleteYouTubeVideo,
} from "../db";
import { logger } from "../_core/logger";
import { users, reservations as reservationsTable } from "../../drizzle/schema";
import { desc, eq, count } from "drizzle-orm";

export const adminRouter = router({
  // 회원 목록 조회
  listUsers: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      const offset = (input.page - 1) * input.pageSize;
      const [rows, totalRows] = await Promise.all([
        db.select().from(users).orderBy(desc(users.createdAt)).limit(input.pageSize).offset(offset),
        db.select({ count: count() }).from(users),
      ]);
      return { users: rows, total: totalRows[0]?.count ?? 0, page: input.page, pageSize: input.pageSize };
    }),

  // 회원 역할 변경
  updateUserRole: adminProcedure
    .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // 전체 통계
  stats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("DB not available");
    const [totalUsers, adminUsers] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(users).where(eq(users.role, "admin")),
    ]);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const allUsers = await db.select({ createdAt: users.createdAt }).from(users);
    const recentSignups = allUsers.filter(u => u.createdAt && u.createdAt >= sevenDaysAgo).length;
    const reservationStats = await getReservationStats();
    return {
      totalUsers: totalUsers[0]?.count ?? 0,
      adminUsers: adminUsers[0]?.count ?? 0,
      recentSignups,
      reservations: reservationStats,
    };
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
      const db = await getDb();
      if (!db) throw new Error("DB not available");

      const reservationRows = await db
        .select()
        .from(reservationsTable)
        .where(eq(reservationsTable.id, input.id))
        .limit(1);
      const reservation = reservationRows[0];

      await updateReservationStatus(input.id, input.status, input.adminNote);

      if (reservation) {
        try {
          if (reservation.isGuest === "1") {
            logger.info("Email", "비회원 예약 상태 변경 처리");
          } else {
            logger.info("Email", "회원 예약 상태 변경 처리");
            // NOTE (PR-39): 예약 상태 변경 시 회원에게 이메일 발송 지점
            // 활성화 방법: server/email.ts의 TO ENABLE 절차 후 아래 코드 주석 해제
            // const user = await db.select().from(users).where(eq(users.id, reservation.userId)).limit(1);
            // if (user[0]?.email) {
            //   await sendEmail(getReservationStatusEmail({ patientName: user[0].name, newStatus: input.status, email: user[0].email }));
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

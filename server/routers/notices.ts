/**
 * notices.ts — 공지사항 라우터
 * 공개: 목록 조회, 단건 조회 (+ 조회수 증가)
 * 관리자: 작성, 수정, 삭제, 고정/해제
 */
import { z } from "zod/v4";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  incrementNoticeViews,
} from "../db";
import { TRPCError } from "@trpc/server";

export const noticesRouter = router({
  /** 공개: 공지사항 목록 (고정글 먼저, 최신순) */
  list: publicProcedure.query(async () => getAllNotices()),

  /** 공개: 공지사항 단건 조회 + 조회수 증가 */
  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const notice = await getNoticeById(input.id);
      if (!notice) throw new TRPCError({ code: "NOT_FOUND", message: "공지사항을 찾을 수 없습니다." });
      // 조회수 비동기 증가 (응답 지연 없음)
      incrementNoticeViews(input.id).catch(() => {});
      return notice;
    }),

  /** 관리자: 공지사항 작성 */
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(300),
      content: z.string().min(1),
      isPinned: z.enum(["0", "1"]).default("0"),
    }))
    .mutation(async ({ input }) => {
      await createNotice({
        title: input.title,
        content: input.content,
        isPinned: input.isPinned,
      });
      return { success: true };
    }),

  /** 관리자: 공지사항 수정 */
  update: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).max(300).optional(),
      content: z.string().min(1).optional(),
      isPinned: z.enum(["0", "1"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const existing = await getNoticeById(id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "공지사항을 찾을 수 없습니다." });
      await updateNotice(id, data);
      return { success: true };
    }),

  /** 관리자: 공지사항 삭제 */
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const existing = await getNoticeById(input.id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "공지사항을 찾을 수 없습니다." });
      await deleteNotice(input.id);
      return { success: true };
    }),
});

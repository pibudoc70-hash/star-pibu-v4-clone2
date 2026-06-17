/**
 * notices.ts — 공지사항 라우터
 * 공개: 목록 조회, 단건 조회 (+ 조회수 증가), 이미지 조회
 * 관리자: 작성, 수정, 삭제, 이미지 업로드, 이미지 삭제
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
  getNoticeImages,
  addNoticeImage,
  deleteNoticeImage,
  getNoticeImagesByNoticeIds,
} from "../db";
import { storagePut } from "../storage";
import { TRPCError } from "@trpc/server";

export const noticesRouter = router({
  /** 공개: 공지사항 목록 (고정글 먼저, 최신순) */
  list: publicProcedure.query(async () => {
    const noticeList = await getAllNotices();
    if (noticeList.length === 0) return [];
    // 각 공지사항의 첫 번째 이미지(썸네일)도 함께 반환
    const ids = noticeList.map((n) => n.id);
    const allImages = await getNoticeImagesByNoticeIds(ids);
    return noticeList.map((n) => ({
      ...n,
      thumbnail: allImages.find((img) => img.noticeId === n.id)?.url ?? null,
    }));
  }),

  /** 공개: 공지사항 단건 조회 + 조회수 증가 */
  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const notice = await getNoticeById(input.id);
      if (!notice) throw new TRPCError({ code: "NOT_FOUND", message: "공지사항을 찾을 수 없습니다." });
      // 조회수 비동기 증가 (응답 지연 없음)
      incrementNoticeViews(input.id).catch(() => {});
      const images = await getNoticeImages(input.id);
      return { ...notice, images };
    }),

  /** 공개: 공지사항 이미지 목록 조회 */
  getImages: publicProcedure
    .input(z.object({ noticeId: z.number().int().positive() }))
    .query(async ({ input }) => getNoticeImages(input.noticeId)),

  /** 관리자: 공지사항 작성 */
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(300),
      content: z.string().min(1),
      isPinned: z.enum(["0", "1"]).default("0"),
    }))
    .mutation(async ({ input }) => {
      const result = await createNotice({
        title: input.title,
        content: input.content,
        isPinned: input.isPinned,
      });
      // insertId 반환 (이미지 연결용)
      const insertId = (result as any).insertId as number;
      return { success: true, id: insertId };
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

  /** 관리자: 이미지 업로드 (base64 → S3) */
  uploadImage: adminProcedure
    .input(z.object({
      noticeId: z.number().int().positive(),
      base64: z.string(), // data:image/jpeg;base64,... 또는 순수 base64
      mimeType: z.string().default("image/jpeg"),
      sortOrder: z.number().int().default(0),
    }))
    .mutation(async ({ input }) => {
      // base64 디코딩
      const base64Data = input.base64.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // 파일 크기 제한: 10MB
      if (buffer.length > 10 * 1024 * 1024) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "이미지 크기는 10MB 이하여야 합니다." });
      }

      const ext = input.mimeType.split("/")[1] ?? "jpg";
      const fileKey = `notices/${input.noticeId}/${Date.now()}.${ext}`;
      const { key, url } = await storagePut(fileKey, buffer, input.mimeType);

      await addNoticeImage({
        noticeId: input.noticeId,
        fileKey: key,
        url,
        sortOrder: input.sortOrder,
      });

      return { success: true, url, key };
    }),

  /** 관리자: 이미지 삭제 */
  deleteImage: adminProcedure
    .input(z.object({ imageId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteNoticeImage(input.imageId);
      return { success: true };
    }),
});

/**
 * popup.ts — 팝업 이벤트 라우터 (공개 조회 + 관리자 CRUD + 이미지 업로드)
 * 분리 근거: server/routers.ts 914줄 → 기능 단위 모듈화 (Round-8 리팩터)
 *
 * [마감 라운드] DB 직접 접근 → db/popup.ts Repository 헬퍼로 이동.
 * Router 책임: 입력 검증(zod) + 권한(adminProcedure) + 어댑터 역할만.
 */
import { z } from "zod/v4";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getActivePopups,
  getAllPopups,
  createPopup,
  updatePopup,
  deletePopup,
} from "../db";
import { storagePut } from "../storage";
import { logger } from "../_core/logger";
import { withCache, invalidateCache } from "../_core/cache";
import { TRPCError } from "@trpc/server";

export const popupRouter = router({
  // 공개: 활성화된 이벤트 목록 조회 (유효기간 자동 필터링) — 2분 캐시
  list: publicProcedure.query(async () =>
    withCache("popup:list", () => getActivePopups())
  ),

  // 관리자: 전체 목록 (비활성 포함)
  adminList: adminProcedure.query(async () => getAllPopups()),

  // 관리자: 이벤트 생성
  create: adminProcedure
    .input(z.object({
      tab: z.string().min(1).max(50),
      badge: z.string().max(100).default(""),
      imageUrl: z.string().default(""),
      clickUrl: z.string().default(""),
      sortOrder: z.number().default(0),
      isActive: z.enum(["0", "1"]).default("1"),
      startAt: z.number().nullable().optional(),
      endAt: z.number().nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await createPopup({ ...input, title: input.badge || "Event", subtitle: "", desc: "", note: "", priceItems: "[]" });
        invalidateCache("popup:");
        return result;
      } catch (error) {
        logger.error("Popup", "팩업 생성 오류", error);
        throw error;
      }
    }),

  // 관리자: 이벤트 수정
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      tab: z.string().min(1).max(50).optional(),
      badge: z.string().max(100).optional(),
      imageUrl: z.string().optional(),
      clickUrl: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.enum(["0", "1"]).optional(),
      startAt: z.number().nullable().optional(),
      endAt: z.number().nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      const updateData: any = { ...rest };
      // title이 없으면 badge를 title로 사용
      if (!updateData.title && updateData.badge) {
        updateData.title = updateData.badge;
      }
      const result = await updatePopup(id, updateData as Parameters<typeof updatePopup>[1]);
      invalidateCache("popup:");
      return result;
    }),

  // 관리자: 이벤트 삭제
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const result = await deletePopup(input.id);
      invalidateCache("popup:");
      return result;
    }),

  // 관리자: 이미지 업로드 (base64 → S3)
  uploadImage: adminProcedure
    .input(z.object({
      base64: z.string().min(1),
      fileName: z.string().min(1).max(200),
      mimeType: z.string().default("image/jpeg"),
    }))
    .mutation(async ({ input }) => {
      const base64Data = input.base64.includes(",") ? input.base64.split(",")[1] : input.base64;
      const buffer = Buffer.from(base64Data, "base64");
      if (buffer.length > 5 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "이미지 파일 크기는 5MB 이하여야 합니다." });
      const ext = input.mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
      const uniqueName = `popup-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { url } = await storagePut(uniqueName, buffer, input.mimeType);
      return { url };
    }),
});

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

/** 팝업 다국어 필드 공통 zod 스키마 */
const popupI18nFields = {
  titleEn: z.string().max(100).default(""),
  titleJa: z.string().max(100).default(""),
  titleZh: z.string().max(100).default(""),
  subtitleEn: z.string().max(100).default(""),
  subtitleJa: z.string().max(100).default(""),
  subtitleZh: z.string().max(100).default(""),
  descEn: z.string().optional(),
  descJa: z.string().optional(),
  descZh: z.string().optional(),
  badgeEn: z.string().max(100).default(""),
  badgeJa: z.string().max(100).default(""),
  badgeZh: z.string().max(100).default(""),
  noteEn: z.string().max(200).default(""),
  noteJa: z.string().max(200).default(""),
  noteZh: z.string().max(200).default(""),
};

export const popupRouter = router({
  // 공개: 활성화된 이벤트 목록 조회 (유효기간 + 언어 필터링) — 2분 캐시
  list: publicProcedure
    .input(z.object({ lang: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const lang = input?.lang;
      const cacheKey = lang ? `popup:list:${lang}` : "popup:list";
      return withCache(cacheKey, () => getActivePopups(lang));
    }),


  // 관리자: 전체 목록 (비활성 포함)
  adminList: adminProcedure.query(async () => getAllPopups()),

  // 관리자: 이벤트 생성
  create: adminProcedure
    .input(z.object({
      tab: z.string().min(1).max(50),
      badge: z.string().max(100).default(""),
      title: z.string().max(100).default(""),
      subtitle: z.string().max(100).default(""),
      desc: z.string().default(""),
      note: z.string().max(200).default(""),
      priceItems: z.string().default("[]"),
      imageUrl: z.string().default(""),
      clickUrl: z.string().default(""),
      accent: z.string().max(20).default("#4A6FA5"),
      accentLight: z.string().max(20).default("#EEF4FF"),
      sortOrder: z.number().default(0),
      isActive: z.enum(["0", "1"]).default("1"),
      startAt: z.number().nullable().optional(),
      endAt: z.number().nullable().optional(),
      targetLang: z.enum(["all", "ko", "en", "ja", "zh"]).default("all"),
      ...popupI18nFields,
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await createPopup({
          ...input,
          title: input.title || input.badge || "Event",
        });
        invalidateCache("popup:");
        return result;
      } catch (error) {
        logger.error("Popup", "팝업 생성 오류", error);
        throw error;
      }
    }),

  // 관리자: 이벤트 수정
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      tab: z.string().min(1).max(50).optional(),
      badge: z.string().max(100).optional(),
      title: z.string().max(100).optional(),
      subtitle: z.string().max(100).optional(),
      desc: z.string().optional(),
      note: z.string().max(200).optional(),
      priceItems: z.string().optional(),
      imageUrl: z.string().optional(),
      clickUrl: z.string().optional(),
      accent: z.string().max(20).optional(),
      accentLight: z.string().max(20).optional(),
      sortOrder: z.number().optional(),
      isActive: z.enum(["0", "1"]).optional(),
      startAt: z.number().nullable().optional(),
      endAt: z.number().nullable().optional(),
      targetLang: z.enum(["all", "ko", "en", "ja", "zh"]).optional(),
      titleEn: z.string().max(100).optional(),
      titleJa: z.string().max(100).optional(),
      titleZh: z.string().max(100).optional(),
      subtitleEn: z.string().max(100).optional(),
      subtitleJa: z.string().max(100).optional(),
      subtitleZh: z.string().max(100).optional(),
      descEn: z.string().optional(),
      descJa: z.string().optional(),
      descZh: z.string().optional(),
      badgeEn: z.string().max(100).optional(),
      badgeJa: z.string().max(100).optional(),
      badgeZh: z.string().max(100).optional(),
      noteEn: z.string().max(200).optional(),
      noteJa: z.string().max(200).optional(),
      noteZh: z.string().max(200).optional(),
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

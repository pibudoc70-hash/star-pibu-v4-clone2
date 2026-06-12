/**
 * events.ts — 이벤트 라우터 (공개 조회 + 관리자 CRUD + 이미지 업로드)
 * 분리 근거: server/routers.ts 914줄 → 기능 단위 모듈화 (Round-8 리팩터)
 */
import { z } from "zod/v4";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllEvents, getFeaturedEvents, getListEvents, getEventById,
  getSpecialEventsByLang, getAllEventsByLang,
  createEvent, updateEvent, deleteEvent, incrementEventViews,
  getEventsByCategory, searchEvents,
} from "../db";
import { storagePut } from "../storage";
import { logger } from "../_core/logger";
import type { InsertEvent } from "../../drizzle/schema";

export const eventsRouter = router({
  // 공개: 모든 활성 이벤트 조회
  list: publicProcedure.query(async () => getAllEvents()),

  // 공개: Featured 이벤트만 조회
  featured: publicProcedure.query(async () => getFeaturedEvents()),

  // 공개: 일반 이벤트/공지 조회
  listEvents: publicProcedure.query(async () => getListEvents()),

  // 공개: SPECIAL EVENT 조회 (언어 파라미터 지원)
  special: publicProcedure
    .input(z.object({ lang: z.string().default("ko") }).optional())
    .query(async ({ input }) => {
      const lang = input?.lang ?? "ko";
      return getSpecialEventsByLang(lang);
    }),

  // 공개: 언어별 일반 이벤트 조회
  listByLang: publicProcedure
    .input(z.object({ lang: z.string().default("ko") }))
    .query(async ({ input }) => getAllEventsByLang(input.lang)),

  // 관리자: AI 자동 번역
  translate: adminProcedure
    .input(z.object({
      text: z.string(),
      targetLang: z.enum(["en", "ja", "zh"]),
      field: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { invokeLLM } = await import("../_core/llm");
      const langNames: Record<string, string> = { en: "English", ja: "日本語", zh: "중국어(간체)" };
      const response = await invokeLLM({
        messages: [
          { role: "system", content: `You are a professional medical/beauty clinic translator. Translate the following Korean text to ${langNames[input.targetLang]}. Return ONLY the translated text, no explanations, no quotes.` },
          { role: "user", content: input.text },
        ],
      });
      const rawContent = response.choices?.[0]?.message?.content ?? "";
      const translated = typeof rawContent === "string" ? rawContent : "";
      return { translated: translated.trim() };
    }),

  // 공개: 단일 이벤트 조회 (조회수 증가)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const event = await getEventById(input.id);
      if (event) await incrementEventViews(input.id);
      return event;
    }),

  // 공개: 카테고리별 이벤트 조회
  listByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => getEventsByCategory(input.category)),

  // 공개: 이벤트 검색
  search: publicProcedure
    .input(z.object({ query: z.string().min(1).max(100) }))
    .query(async ({ input }) => searchEvents(input.query)),

  // 관리자: 이벤트 생성
  create: adminProcedure
    .input(z.object({
      type: z.enum(["이벤트", "공지"]).default("이벤트"),
      title: z.string().min(1).max(200),
      subtitle: z.string().max(150).default(""),
      desc: z.string().default(""),
      content: z.string().default(""),
      isFeatured: z.enum(["0", "1"]).default("0"),
      badge: z.string().max(50).default(""),
      tag: z.string().max(50).default(""),
      hot: z.enum(["0", "1"]).default("0"),
      cta: z.string().max(50).default("자세히 보기"),
      accent: z.string().max(20).default("#4A6FA5"),
      accentDark: z.string().max(20).default("#2D4A7B"),
      accentBg: z.string().max(20).default("#EEF3FA"),
      iconBg: z.string().max(20).default("#E0EBF7"),
      iconType: z.string().max(20).default("tag"),
      badgeColor: z.string().max(20).default("#4A6FA5"),
      date: z.string().min(1).max(50),
      imageUrl: z.string().optional(),
      sortOrder: z.number().default(0),
      isActive: z.enum(["0", "1"]).default("1"),
      category: z.enum(["신규시술", "이벤트", "공지사항", "기타"]).default("이벤트"),
      isSpecialEvent: z.enum(["0", "1"]).default("0"),
      productName: z.string().max(200).default(""),
      normalPrice: z.number().default(0),
      discountPrice: z.number().default(0),
      priceRows: z.array(z.object({ label: z.string(), normalPrice: z.number(), discountPrice: z.number() })).default([]),
      anesthesiaFee: z.string().max(200).default(""),
      targetLang: z.string().default("ko"),
      titleEn: z.string().max(200).default(""),
      titleJa: z.string().max(200).default(""),
      titleZh: z.string().max(200).default(""),
      subtitleEn: z.string().max(150).default(""),
      subtitleJa: z.string().max(150).default(""),
      subtitleZh: z.string().max(150).default(""),
      descEn: z.string().default(""),
      descJa: z.string().default(""),
      descZh: z.string().default(""),
      productNameEn: z.string().max(200).default(""),
      productNameJa: z.string().max(200).default(""),
      productNameZh: z.string().max(200).default(""),
    }))
    .mutation(async ({ input }) => {
      const { priceRows, ...rest } = input;
      await createEvent({ ...rest, priceRows: JSON.stringify(priceRows || []) } as InsertEvent);
      return { success: true };
    }),

  // 관리자: 이벤트 수정
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      type: z.enum(["이벤트", "공지"]).optional(),
      title: z.string().min(1).max(200).optional(),
      subtitle: z.string().max(150).optional(),
      desc: z.string().optional(),
      content: z.string().optional(),
      isFeatured: z.enum(["0", "1"]).optional(),
      badge: z.string().max(50).optional(),
      tag: z.string().max(50).optional(),
      hot: z.enum(["0", "1"]).optional(),
      cta: z.string().max(50).optional(),
      accent: z.string().max(20).optional(),
      accentDark: z.string().max(20).optional(),
      accentBg: z.string().max(20).optional(),
      iconBg: z.string().max(20).optional(),
      iconType: z.string().max(20).optional(),
      badgeColor: z.string().max(20).optional(),
      date: z.string().max(50).optional(),
      imageUrl: z.string().optional(),
      views: z.number().optional(),
      sortOrder: z.number().optional(),
      isActive: z.enum(["0", "1"]).optional(),
      category: z.enum(["신규시술", "이벤트", "공지사항", "기타"]).optional(),
      isSpecialEvent: z.enum(["0", "1"]).optional(),
      productName: z.string().max(200).optional(),
      normalPrice: z.number().optional(),
      discountPrice: z.number().optional(),
      priceRows: z.array(z.object({ label: z.string(), normalPrice: z.number(), discountPrice: z.number() })).optional(),
      anesthesiaFee: z.string().max(200).optional(),
      targetLang: z.string().optional(),
      titleEn: z.string().max(200).optional(),
      titleJa: z.string().max(200).optional(),
      titleZh: z.string().max(200).optional(),
      subtitleEn: z.string().max(150).optional(),
      subtitleJa: z.string().max(150).optional(),
      subtitleZh: z.string().max(150).optional(),
      descEn: z.string().optional(),
      descJa: z.string().optional(),
      descZh: z.string().optional(),
      productNameEn: z.string().max(200).optional(),
      productNameJa: z.string().max(200).optional(),
      productNameZh: z.string().max(200).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, priceRows, ...data } = input;
      const updateData: Partial<InsertEvent> = { ...data };
      if (priceRows !== undefined) updateData.priceRows = JSON.stringify(priceRows);
      await updateEvent(id, updateData);
      return { success: true };
    }),

  // 관리자: 이벤트 삭제
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteEvent(input.id);
      return { success: true };
    }),

  // 관리자: 이미지 업로드 (base64 → S3)
  uploadImage: adminProcedure
    .input(z.object({
      fileData: z.string(),
      fileName: z.string(),
      mimeType: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const base64Data = input.fileData.split(',')[1] || input.fileData;
        const buffer = Buffer.from(base64Data, 'base64');
        if (buffer.length > 5 * 1024 * 1024) throw new Error('File size exceeds 5MB');
        const fileKey = `events/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        return { success: true, url };
      } catch (error) {
        logger.error("ImageUpload", "이미지 업로드 오류", error);
        throw new Error('Image upload failed');
      }
    }),
});

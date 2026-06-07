/**
 * popup.ts — 팝업 이벤트 라우터 (공개 조회 + 관리자 CRUD + 이미지 업로드)
 * 분리 근거: server/routers.ts 914줄 → 기능 단위 모듈화 (Round-8 리팩터)
 */
import { z } from "zod/v4";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { storagePut } from "../storage";
import { logger } from "../_core/logger";
import { popupEvents } from "../../drizzle/schema";
import { eq, asc } from "drizzle-orm";

export const popupRouter = router({
  // 공개: 활성화된 이벤트 목록 조회 (유효기간 자동 필터링)
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const now = Date.now();
    const rows = await db
      .select()
      .from(popupEvents)
      .where(eq(popupEvents.isActive, "1"))
      .orderBy(asc(popupEvents.sortOrder));
    const filtered = rows.filter(r => {
      if (r.startAt !== null && r.startAt !== undefined && now < r.startAt) return false;
      if (r.endAt !== null && r.endAt !== undefined && now > r.endAt) return false;
      return true;
    });
    return filtered.map(r => ({
      ...r,
      priceItems: (() => { try { return JSON.parse(r.priceItems ?? "[]"); } catch { return []; } })(),
    }));
  }),

  // 관리자: 전체 목록 (비활성 포함)
  adminList: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(popupEvents).orderBy(asc(popupEvents.sortOrder));
    return rows.map(r => ({
      ...r,
      priceItems: (() => { try { return JSON.parse(r.priceItems ?? "[]"); } catch { return []; } })(),
    }));
  }),

  // 관리자: 이벤트 생성
  create: adminProcedure
    .input(z.object({
      tab: z.string().min(1).max(50),
      badge: z.string().max(100).default(""),
      title: z.string().min(1).max(100),
      subtitle: z.string().max(100).default(""),
      desc: z.string().default(""),
      priceItems: z.array(z.object({ label: z.string(), original: z.string().default(""), price: z.string() })).default([]),
      note: z.string().max(200).default(""),
      imageUrl: z.string().default(""),
      accent: z.string().max(20).default("#4A6FA5"),
      accentLight: z.string().max(20).default("#EEF4FF"),
      sortOrder: z.number().default(0),
      isActive: z.enum(["0", "1"]).default("1"),
      startAt: z.number().nullable().optional(),
      endAt: z.number().nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      try {
        await db.insert(popupEvents).values({
          tab: input.tab,
          badge: input.badge,
          title: input.title,
          subtitle: input.subtitle,
          desc: input.desc,
          priceItems: JSON.stringify(input.priceItems),
          note: input.note,
          imageUrl: input.imageUrl,
          accent: input.accent,
          accentLight: input.accentLight,
          sortOrder: input.sortOrder,
          isActive: input.isActive,
          startAt: input.startAt,
          endAt: input.endAt,
        });
        return { success: true };
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
      title: z.string().min(1).max(100).optional(),
      subtitle: z.string().max(100).optional(),
      desc: z.string().optional(),
      priceItems: z.array(z.object({ label: z.string(), original: z.string().default(""), price: z.string() })).optional(),
      note: z.string().max(200).optional(),
      imageUrl: z.string().optional(),
      accent: z.string().max(20).optional(),
      accentLight: z.string().max(20).optional(),
      sortOrder: z.number().optional(),
      isActive: z.enum(["0", "1"]).optional(),
      startAt: z.number().nullable().optional(),
      endAt: z.number().nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      const { id, priceItems, ...rest } = input;
      const updateData: Record<string, unknown> = { ...rest };
      if (priceItems !== undefined) updateData.priceItems = JSON.stringify(priceItems);
      await db.update(popupEvents).set(updateData).where(eq(popupEvents.id, id));
      return { success: true };
    }),

  // 관리자: 이벤트 삭제
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB not available");
      await db.delete(popupEvents).where(eq(popupEvents.id, input.id));
      return { success: true };
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
      if (buffer.length > 5 * 1024 * 1024) throw new Error("이미지 파일 크기는 5MB 이하여야 합니다.");
      const ext = input.mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
      const uniqueName = `popup-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { url } = await storagePut(uniqueName, buffer, input.mimeType);
      return { url };
    }),
});

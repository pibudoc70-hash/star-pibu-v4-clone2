import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import {
  getAllEvents, getActiveEvents, getEventById, createEvent, updateEvent, deleteEvent, incrementEventViews,
  getAllPopups, getActivePopups, createPopup, updatePopup, deletePopup,
  getAllUsers, updateUserRole,
} from "./db";
import { storagePut } from "./storage";

// 관리자 전용 미들웨어
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "관리자 권한이 필요합니다." });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── 이벤트 ──────────────────────────────────────────────────────────────
  events: router({
    list: publicProcedure.query(async () => {
      return getActiveEvents();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const ev = await getEventById(input.id);
        if (!ev) throw new TRPCError({ code: "NOT_FOUND" });
        return ev;
      }),
    incrementViews: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await incrementEventViews(input.id);
        return { success: true };
      }),
    // 관리자 전용
    adminList: adminProcedure.query(async () => getAllEvents()),
    create: adminProcedure
      .input(z.object({
        type: z.enum(["이벤트", "공지"]).default("이벤트"),
        title: z.string().min(1).max(200),
        subtitle: z.string().max(150).default(""),
        desc: z.string().min(1),
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
        imageUrl: z.string().optional(),
        date: z.string().max(50),
        sortOrder: z.number().default(0),
        isActive: z.enum(["0", "1"]).default("1"),
        category: z.enum(["신규시술", "이벤트", "공지사항", "기타"]).default("이벤트"),
      }))
      .mutation(async ({ input }) => {
        await createEvent(input);
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
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
        imageUrl: z.string().optional(),
        date: z.string().max(50).optional(),
        sortOrder: z.number().optional(),
        isActive: z.enum(["0", "1"]).optional(),
        category: z.enum(["신규시술", "이벤트", "공지사항", "기타"]).optional(),
        type: z.enum(["이벤트", "공지"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateEvent(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteEvent(input.id);
        return { success: true };
      }),
  }),

  // ─── 팝업 ────────────────────────────────────────────────────────────────
  popup: router({
    list: publicProcedure.query(async () => getActivePopups()),
    adminList: adminProcedure.query(async () => getAllPopups()),
    create: adminProcedure
      .input(z.object({
        tab: z.string().min(1).max(50),
        badge: z.string().max(100),
        title: z.string().min(1).max(100),
        subtitle: z.string().max(100).default(""),
        desc: z.string().default(""),
        priceItems: z.string().default("[]"),
        note: z.string().max(200).default(""),
        imageUrl: z.string().optional(),
        accent: z.string().max(20).default("#4A6FA5"),
        accentLight: z.string().max(20).default("#EEF4FF"),
        startAt: z.number().optional(),
        endAt: z.number().optional(),
        sortOrder: z.number().default(0),
        isActive: z.enum(["0", "1"]).default("1"),
      }))
      .mutation(async ({ input }) => {
        await createPopup(input);
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        tab: z.string().max(50).optional(),
        badge: z.string().max(100).optional(),
        title: z.string().max(100).optional(),
        subtitle: z.string().max(100).optional(),
        desc: z.string().optional(),
        priceItems: z.string().optional(),
        note: z.string().max(200).optional(),
        imageUrl: z.string().optional(),
        accent: z.string().max(20).optional(),
        accentLight: z.string().max(20).optional(),
        startAt: z.number().optional(),
        endAt: z.number().optional(),
        sortOrder: z.number().optional(),
        isActive: z.enum(["0", "1"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updatePopup(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePopup(input.id);
        return { success: true };
      }),
  }),

  // ─── 관리자 ──────────────────────────────────────────────────────────────
  admin: router({
    users: adminProcedure.query(async () => getAllUsers()),
    updateRole: adminProcedure
      .input(z.object({ id: z.number(), role: z.enum(["user", "admin"]) }))
      .mutation(async ({ input }) => {
        await updateUserRole(input.id, input.role);
        return { success: true };
      }),
    uploadImage: adminProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        dataBase64: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        const key = `events/${Date.now()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url };
      }),
  }),
});

export type AppRouter = typeof appRouter;

import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { treatmentsRouter } from "./treatments-router";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb, createReservation, getReservationsByUserId, getAllReservations, updateReservationStatus, cancelReservation, getReservationStats, generateOtpCode, createGuestOtp, verifyGuestOtp, cancelGuestReservation, getAllEvents, getFeaturedEvents, getListEvents, getEventById, createEvent, updateEvent, deleteEvent, incrementEventViews, getSpecialEvents, getAllTreatmentCategories, getTreatmentCategoryById, createTreatmentCategory, updateTreatmentCategory, deleteTreatmentCategory, getTreatmentsByCategory, getAllTreatments, getTreatmentById, createTreatment, updateTreatment, deleteTreatment, getTreatmentsByBest } from "./db";
import { users, popupEvents, events, treatments, treatmentCategories } from "../drizzle/schema";
import { desc, eq, count, asc } from "drizzle-orm";
import { z } from "zod/v4";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import { sendEmail, getReservationConfirmationEmail, getAdminNotificationEmail, getReservationStatusEmail } from "./email";
import { sendSMS, getOTPMessage, getReservationConfirmationSMS, getReservationConfirmedSMS, getReservationCancelledSMS } from "./sms";

export const appRouter = router({
  system: systemRouter,
  treatments: treatmentsRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── 예약 라우터 ────────────────────────────────────────────────────────────
  reservation: router({
    // 예약 신청 (로그인 필요)
    create: protectedProcedure
      .input(z.object({
        patientName: z.string().min(1).max(100),
        phone: z.string().min(8).max(20),
        treatmentCategory: z.string().min(1).max(100),
        treatmentName: z.string().min(1).max(200),
        preferredDate: z.number(), // UTC ms
        preferredTime: z.string().min(4).max(10),
        notes: z.string().max(1000).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const reservation = await createReservation({
          userId: ctx.user.id,
          patientName: input.patientName,
          phone: input.phone,
          treatmentCategory: input.treatmentCategory,
          treatmentName: input.treatmentName,
          preferredDate: input.preferredDate,
          preferredTime: input.preferredTime,
          notes: input.notes ?? null,
          status: "pending",
        });

        if (!reservation) throw new Error("Failed to create reservation");
        const reservationId = reservation.id;

        // 고객에게 예약 확인 이메일 발송
        const preferredDateStr = new Date(input.preferredDate).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short",
        });

        try {
          // 고객 이메일로 발송 (사용자 이메일 없으면 발송 스기)
          if (!ctx.user.email) {
            console.warn("[Email] User email not available, skipping customer email");
          } else {
            await sendEmail({
              to: ctx.user.email,
              subject: `[STAR 피부과] 예약 접수 알림 - #${reservationId}`,
              html: getReservationConfirmationEmail({
                patientName: input.patientName,
                treatmentName: input.treatmentName,
                preferredDate: preferredDateStr,
                preferredTime: input.preferredTime,
                phone: input.phone,
                notes: input.notes,
                reservationId,
              }),
            });
          }
        } catch (emailErr) {
          console.error("[Email] 예약 확인 이메일 발송 중 오류:", emailErr);
        }

        // 관리자에게 알림 발송
        await notifyOwner({
          title: "새 예약 신청",
          content: `${input.patientName}님이 [${input.treatmentName}] 예약을 신청했습니다.\n희망일시: ${preferredDateStr} ${input.preferredTime}\n연락처: ${input.phone}`,
        });

        // 관리자에게 예약 알림 이메일 발송
        try {
          await sendEmail({
            to: process.env.ADMIN_EMAIL || "admin@star-pibu.com",
            subject: `[관리자] 새로운 예약 신청 - #${reservationId}`,
            html: getAdminNotificationEmail({
              patientName: input.patientName,
              phone: input.phone,
              treatmentName: input.treatmentName,
              preferredDate: preferredDateStr,
              preferredTime: input.preferredTime,
              notes: input.notes,
              reservationId,
            }),
          });
        } catch (emailErr) {
          console.error("[Email] 관리자 알림 이메일 발송 중 오류:", emailErr);
        }

        return { success: true };
      }),

    // 내 예약 목록 조회
    myReservations: protectedProcedure.query(async ({ ctx }) => {
      return getReservationsByUserId(ctx.user.id);
    }),

    // 예약 취소 (본인만)
    cancel: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await cancelReservation(input.id, ctx.user.id);
        return { success: true };
      }),

    // ─── 비회원 간편 예약 ─────────────────────────────────────────────────────

    // OTP 발송 (비회원 전화번호 인증)
    sendOtp: publicProcedure
      .input(z.object({
        phone: z.string().min(9).max(20),
      }))
      .mutation(async ({ input }) => {
        // 개발 모드: 항상 123456으로 설정
        const code = "123456";
        await createGuestOtp(input.phone, code);

        // SMS로 OTP 발송
        const message = getOTPMessage(code, 10);
        const smsSent = await sendSMS({
          phone: input.phone,
          message,
        });

        if (!smsSent) {
          console.warn(`[OTP] SMS 발송 실패: ${input.phone}`);
          // SMS 발송 실패해도 OTP는 생성됨 (개발 중 콘솔에서 확인 가능)
          console.log(`[OTP Dev] ${input.phone} → ${code}`);
        }

        return { success: true, smsSent };
      }),

    // OTP 검증
    verifyOtp: publicProcedure
      .input(z.object({
        phone: z.string().min(9).max(20),
        code: z.string().length(6),
      }))
      .mutation(async ({ input }) => {
        const ok = await verifyGuestOtp(input.phone, input.code);
        if (!ok) throw new Error("인증번호가 올바르지 않거나 만료되었습니다.");
        return { verified: true };
      }),

    // 비회원 예약 생성 (OTP 인증 완료 후)
    createGuest: publicProcedure
      .input(z.object({
        patientName: z.string().min(1).max(100),
        phone: z.string().min(9).max(20),
        otpCode: z.string().length(6),
        treatmentCategory: z.string().min(1).max(100),
        treatmentName: z.string().min(1).max(200),
        preferredDate: z.number(),
        preferredTime: z.string().min(4).max(10),
        notes: z.string().max(1000).optional(),
      }))
      .mutation(async ({ input }) => {
        // OTP 재검증 (이미 verified=1인 코드도 허용 - 같은 세션)
        const ok = await verifyGuestOtp(input.phone, input.otpCode);
        if (!ok) {
          // verified=1인 경우 DB에서 직접 확인
          const { getDb } = await import("./db");
          const { guestOtps } = await import("../drizzle/schema");
          const { eq, and } = await import("drizzle-orm");
          const db = await getDb();
          if (!db) throw new Error("DB not available");
          const rows = await db.select().from(guestOtps)
            .where(and(eq(guestOtps.phone, input.phone), eq(guestOtps.code, input.otpCode), eq(guestOtps.verified, "1")))
            .limit(1);
          if (rows.length === 0 || rows[0].expiresAt < Date.now() - 10 * 60 * 1000) {
            throw new Error("인증이 만료되었습니다. 다시 인증해주세요.");
          }
        }

        await createReservation({
          userId: null,
          isGuest: "1",
          patientName: input.patientName,
          phone: input.phone,
          treatmentCategory: input.treatmentCategory,
          treatmentName: input.treatmentName,
          preferredDate: input.preferredDate,
          preferredTime: input.preferredTime,
          notes: input.notes ?? null,
          status: "pending",
        });

        // 관리자 알림
        await notifyOwner({
          title: "새 예약 신청 (비회원)",
          content: `${input.patientName}님(비회원)이 [${input.treatmentName}] 예약을 신청했습니다.\n희망일시: ${new Date(input.preferredDate).toLocaleDateString("ko-KR")} ${input.preferredTime}\n연락처: ${input.phone}`,
        });

        // SMS 발송
        try {
        // SMS 기능 비활성화 (별도 설정 필요)
          // SMS 기능은 별도 설정 필요
        } catch (smsErr) {
          console.error("[SMS] 비회원 예약 접수 SMS 오류:", smsErr);
        }

        return { success: true };
      }),

    // 비회원 예약 취소
    cancelGuest: publicProcedure
      .input(z.object({
        id: z.number(),
        phone: z.string().min(9).max(20),
        otpCode: z.string().length(6),
      }))
      .mutation(async ({ input }) => {
        const ok = await verifyGuestOtp(input.phone, input.otpCode);
        if (!ok) throw new Error("인증번호가 올바르지 않거나 만료되었습니다.");
        await cancelGuestReservation(input.id, input.phone);
        return { success: true };
      }),
  }),

  // ─── 이벤트 라우터 ──────────────────────────────────────────────────────────
  events: router({
    // 공개: 모든 활성 이벤트 조회
    list: publicProcedure.query(async () => {
      return getAllEvents();
    }),

    // 공개: Featured 이벤트만 조회
    featured: publicProcedure.query(async () => {
      return getFeaturedEvents();
    }),

    // 공개: 일반 이벤트/공지 조회
    listEvents: publicProcedure.query(async () => {
      return getListEvents();
    }),

    // 공개: SPECIAL EVENT 조회
    special: publicProcedure.query(async () => {
      return getSpecialEvents();
    }),

    // 공개: 단일 이벤트 조회 (조회수 증가)
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const event = await getEventById(input.id);
        if (event) {
          await incrementEventViews(input.id);
        }
        return event;
      }),

    // 공개: 카테고리별 이벤트 조회
    listByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const rows = await db.select().from(events).where(eq(events.isActive, "1")).orderBy(asc(events.sortOrder), desc(events.createdAt));
        return rows.filter(e => e.category === input.category);
      }),

    // 공개: 이벤트 검색
    search: publicProcedure
      .input(z.object({ query: z.string().min(1).max(100) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const rows = await db.select().from(events).where(eq(events.isActive, "1")).orderBy(asc(events.sortOrder), desc(events.createdAt));
        const query = input.query.toLowerCase();
        return rows.filter(e => e.title.toLowerCase().includes(query) || e.desc.toLowerCase().includes(query));
      }),

    // 관리자: 이벤트 생성
    create: adminProcedure
      .input(z.object({
        type: z.enum(["이벤트", "공지"]).default("이벤트"),
        title: z.string().min(1).max(200),
        subtitle: z.string().max(150).default(""),
        desc: z.string().min(1),
        content: z.string().min(1),
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
        // SPECIAL EVENT 필드
        isSpecialEvent: z.enum(["0", "1"]).default("0"),
        productName: z.string().max(200).default(""),
        normalPrice: z.number().default(0),
        discountPrice: z.number().default(0),
        priceRows: z.array(z.object({ label: z.string(), normalPrice: z.number(), discountPrice: z.number() })).default([]),
        anesthesiaFee: z.string().max(200).default(""),
      }))
      .mutation(async ({ input }) => {
        const { priceRows, ...rest } = input;
        const eventData = {
          ...rest,
          priceRows: JSON.stringify(priceRows || []),
        };
        await createEvent(eventData as any);
        return { success: true };
      }),

    // 관리자: 이벤트 수정
    update: adminProcedure.input(z.object({
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
        // SPECIAL EVENT 필드
        isSpecialEvent: z.enum(["0", "1"]).optional(),
        productName: z.string().max(200).optional(),
        normalPrice: z.number().optional(),
        discountPrice: z.number().optional(),
        priceRows: z.array(z.object({ label: z.string(), normalPrice: z.number(), discountPrice: z.number() })).optional(),
        anesthesiaFee: z.string().max(200).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, priceRows, ...data } = input;
        const updateData: any = { ...data };
        if (priceRows !== undefined) {
          updateData.priceRows = JSON.stringify(priceRows);
        }
        await updateEvent(id, updateData);
        return { success: true };
      }),

    // Admin: Delete event
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteEvent(input.id);
        return { success: true };
      }),

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
          if (buffer.length > 5 * 1024 * 1024) {
            throw new Error('File size exceeds 5MB');
          }
          const timestamp = Date.now();
          const fileKey = `events/${timestamp}-${input.fileName}`;
          const { url } = await storagePut(fileKey, buffer, input.mimeType);
          return { success: true, url };
        } catch (error) {
          console.error('Image upload error:', error);
          throw new Error('Image upload failed');
        }
      }),
  }),

  // ─── 팝업 이벤트 라우터 ────────────────────────────────────────────────────
  popup: router({
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
      // 유효기간 필터: startAt <= now <= endAt (null이면 제한 없음)
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
          console.error('[Popup Create Error]', error);
          throw error;
        }
      }),

    // 관리자: 이벤트 수정
    update: adminProcedure.input(z.object({
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

    // Admin: Delete event
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
        base64: z.string().min(1),   // data:image/...;base64,... 형식
        fileName: z.string().min(1).max(200),
        mimeType: z.string().default("image/jpeg"),
      }))
      .mutation(async ({ input }) => {
        // base64 데이터 부분만 추출
        const base64Data = input.base64.includes(",")
          ? input.base64.split(",")[1]
          : input.base64;
        const buffer = Buffer.from(base64Data, "base64");

        // 파일 크기 제한: 5MB
        if (buffer.length > 5 * 1024 * 1024) {
          throw new Error("이미지 파일 크기는 5MB 이하여야 합니다.");
        }

        // 고유 파일명 생성
        const ext = input.mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
        const uniqueName = `popup-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { url } = await storagePut(uniqueName, buffer, input.mimeType);
        return { url };
      }),
  }),

  // ─── 관리자 라우터 ──────────────────────────────────────────────────────────
  admin: router({
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
        sendAlimtalk: z.boolean().default(true), // confirmed 시 알림톡 발송 여부
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB not available");

        // 예약 정보 조회 (알림톡 발송용)
        const { reservations: reservationsTable } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const reservationRows = await db
          .select()
          .from(reservationsTable)
          .where(eq(reservationsTable.id, input.id))
          .limit(1);
        const reservation = reservationRows[0];

        await updateReservationStatus(input.id, input.status, input.adminNote);

        // 고객에게 상태 변경 이메일 발송
        if (reservation) {
          const statusLabels: Record<string, string> = {
            pending: "대기 중",
            confirmed: "확정",
            completed: "완료",
            cancelled: "취소됨",
          };

          const preferredDateStr = new Date(reservation.preferredDate).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          });

          try {
            await sendEmail({
              to: reservation.phone || "customer@example.com",
              subject: `[STAR 피부과] 예약 상태 변경 알림 - ${statusLabels[input.status]}`,
              html: getReservationStatusEmail({
                patientName: reservation.patientName,
                treatmentName: reservation.treatmentName,
                status: input.status,
                statusLabel: statusLabels[input.status],
                preferredDate: preferredDateStr,
                preferredTime: reservation.preferredTime,
                adminNote: input.adminNote,
                reservationId: reservation.id,
              }),
            });
          } catch (emailErr) {
            console.error("[Email] 상태 변경 이메일 발송 중 오류:", emailErr);
          }
        }

         // SMS/알림톡 기능은 별도 설정 필요
        return { success: true, alimtalkSent: false };
      }),
  }),
});

export type AppRouter = typeof appRouter;

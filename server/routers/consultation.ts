/**
 * server/routers/consultation.ts — 프리미엄 상담 폼 라우터
 *
 * 스팸 방지 3중 레이어:
 *   1. honeypot  — 봇이 채우는 숨겨진 필드
 *   2. Turnstile — Cloudflare 서버단 토큰 검증 (사용자 경험 0 마찰)
 *   3. rate limit — IP 10분 3회 / 연락처 10분 2회
 */
import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  createConsultationRequest,
  countConsultationByIp,
  countConsultationByPhone,
  getConsultationRequests,
  updateConsultationStatus,
} from "../db";
import { notifyOwner } from "../_core/notification";

// ── 상수 ──────────────────────────────────────────────────────────────────────
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10분
const MAX_BY_IP = 3;
const MAX_BY_PHONE = 2;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// ── Turnstile 서버단 검증 ─────────────────────────────────────────────────────
async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // 시크릿 미설정 시 개발 환경으로 간주 → 통과 (프로덕션에서는 반드시 설정)
  if (!secret) {
    console.warn("[Turnstile] TURNSTILE_SECRET_KEY not set — skipping verification (dev mode)");
    return true;
  }
  // Cloudflare 테스트 토큰: 항상 성공
  if (token === "XXXX.DUMMY.TOKEN.XXXX") return true;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch (err) {
    console.warn("[Turnstile] Verification request failed:", err);
    return false;
  }
}

// ── 입력 스키마 ───────────────────────────────────────────────────────────────
const submitSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요").max(50),
  phone: z
    .string()
    .min(9, "연락처를 입력해주세요")
    .max(20)
    .regex(/^[0-9\-\s\+\(\)]+$/, "올바른 연락처 형식이 아닙니다"),
  concern: z.string().min(1, "희망 시술 또는 고민 부위를 선택해주세요").max(200),
  message: z.string().min(5, "상담 내용을 5자 이상 입력해주세요").max(2000),
  privacyAgreed: z.boolean().refine((v) => v === true, "개인정보 수집에 동의해주세요"),
  turnstileToken: z.string().min(1, "보안 토큰이 필요합니다"),
  // honeypot — 봇이 채우면 스팸으로 처리 (사용자에게는 숨겨진 필드)
  website: z.string().max(0, "").optional(),
  lang: z.string().max(5).optional(),
});

// ── 라우터 ────────────────────────────────────────────────────────────────────
export const consultationRouter = router({
  /** 상담 신청 제출 (공개) */
  submit: publicProcedure
    .input(submitSchema)
    .mutation(async ({ ctx, input }) => {
      // 1. Honeypot 검사 — 봇이 website 필드를 채우면 즉시 거부
      if (input.website && input.website.length > 0) {
        // 조용히 성공처럼 응답 (봇에게 단서 주지 않음)
        return { success: true, id: -1 };
      }

      // IP 추출
      const ip =
        (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        ctx.req.socket?.remoteAddress ||
        "unknown";

      // 2. Rate limit — IP
      const ipCount = await countConsultationByIp(ip, RATE_WINDOW_MS);
      if (ipCount >= MAX_BY_IP) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "잠시 후 다시 시도해주세요. (10분 내 최대 3회)",
        });
      }

      // 3. Rate limit — 연락처
      const phoneNorm = input.phone.replace(/[\s\-\(\)]/g, "");
      const phoneCount = await countConsultationByPhone(phoneNorm, RATE_WINDOW_MS);
      if (phoneCount >= MAX_BY_PHONE) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "동일 연락처로 잠시 후 다시 시도해주세요. (10분 내 최대 2회)",
        });
      }

      // 4. Turnstile 검증
      const turnstileOk = await verifyTurnstile(input.turnstileToken, ip);
      if (!turnstileOk) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "보안 인증에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.",
        });
      }

      // 5. DB 저장
      const result = await createConsultationRequest({
        name: input.name.trim(),
        phone: phoneNorm,
        concern: input.concern.trim(),
        message: input.message.trim(),
        privacyAgreed: "1",
        ipAddress: ip,
        turnstileVerified: "1",
        lang: input.lang ?? "ko",
        status: "pending",
      });

      // 6. 오너 알림 (비동기, 실패해도 사용자 응답에 영향 없음)
      notifyOwner({
        title: `[스타피부과] 새 상담 신청 — ${input.name}`,
        content: [
          `이름: ${input.name}`,
          `연락처: ${input.phone}`,
          `고민/시술: ${input.concern}`,
          `상담 내용: ${input.message.slice(0, 300)}${input.message.length > 300 ? "…" : ""}`,
          `언어: ${input.lang ?? "ko"}`,
          `제출 시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
        ].join("\n"),
      }).catch((err) => console.warn("[Consultation] Owner notify failed:", err));

      return { success: true, id: result?.id ?? 0 };
    }),

  /** 관리자: 상담 목록 조회 */
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return getConsultationRequests(200);
  }),

  /** 관리자: 상태 변경 */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["pending", "contacted", "done", "spam"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await updateConsultationStatus(input.id, input.status);
      return { success: true };
    }),
});

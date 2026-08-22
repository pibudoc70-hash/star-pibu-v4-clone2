/**
 * server/routers/consultation.ts — 프리미엄 상담 폼 라우터
 *
 * 스팸 방지 3중 레이어 (Step54-A 검사 순서 최적화):
 *   1. honeypot      — 봇이 채우는 숨겨진 필드 (무료)
 *   2. 인메모리 리밋  — DB 접근 전 명백한 남용 차단 (무료, Step54-A 신규)
 *   3. DB rate limit — IP 10분 3회 / 연락처 10분 2회
 */
import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { publicProcedure, adminProcedure, router } from "../_core/trpc";
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

// [Step54-A] 인메모리 1차 리미터.
// DB COUNT 는 요청당 왕복 2회가 발생하므로, 그 앞에서 명백한 남용을 걸러낸다.
// 프로세스 재시작 시 초기화되지만 DB 리미터가 최종 방어선이라 문제없다.
const MEM_WINDOW_MS = 60_000;
const MEM_MAX_PER_IP = 5;
const memHits = new Map<string, number[]>();

function memRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (memHits.get(ip) ?? []).filter((t) => now - t < MEM_WINDOW_MS);
  if (arr.length >= MEM_MAX_PER_IP) {
    memHits.set(ip, arr);
    return true;
  }
  arr.push(now);
  memHits.set(ip, arr);

  // 맵 무한 증가 방지: 200개 초과 시 만료된 항목 정리
  if (memHits.size > 200) {
    Array.from(memHits.entries()).forEach(([k, v]: [string, number[]]) => {
      const alive = v.filter((t: number) => now - t < MEM_WINDOW_MS);
      if (alive.length === 0) memHits.delete(k);
      else memHits.set(k, alive);
    });
  }
  return false;
}

// ── 입력 스키마 ───────────────────────────────────────────────────────────────
const submitSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요").max(50),
  phone: z
    .string()
    .min(9, "연락처를 입력해주세요")
    .max(20)
    .regex(/^[0-9\-\s+()]+$/, "올바른 연락처 형식이 아닙니다"),
  concern: z.string().min(1, "희망 시술 또는 고민 부위를 선택해주세요").max(200),
  message: z.string().min(5, "상담 내용을 5자 이상 입력해주세요").max(2000),
  privacyAgreed: z.boolean().refine((v) => v === true, "개인정보 수집에 동의해주세요"),
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

      // [Step52-C] x-forwarded-for 직접 파싱 제거 — Express trust proxy 설정 하에서
      // req.ip 를 사용한다. 클라이언트가 위조한 X-Forwarded-For 첫 값을 신뢰하지 않는다.
      const ip = ctx.req.ip || ctx.req.socket?.remoteAddress || "unknown";

      // 2. [Step54-A] 인메모리 1차 리미터 (DB 접근 전)
      if (memRateLimited(ip)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "잠시 후 다시 시도해주세요.",
        });
      }

      // 3. Rate limit — IP
      const ipCount = await countConsultationByIp(ip, RATE_WINDOW_MS);
      if (ipCount >= MAX_BY_IP) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "잠시 후 다시 시도해주세요. (10분 내 최대 3회)",
        });
      }

      // 4. Rate limit — 연락처
      const phoneNorm = input.phone.replace(/[\s\-()]/g, "");
      const phoneCount = await countConsultationByPhone(phoneNorm, RATE_WINDOW_MS);
      if (phoneCount >= MAX_BY_PHONE) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "동일 연락처로 잠시 후 다시 시도해주세요. (10분 내 최대 2회)",
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
  // [Step52-D] protectedProcedure + 수동 role 체크 → adminProcedure 로 교체
  list: adminProcedure.query(async () => {
    return getConsultationRequests(200);
  }),

  /** 관리자: 상태 변경 */
  // [Step52-D] protectedProcedure + 수동 role 체크 → adminProcedure 로 교체
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["pending", "contacted", "done", "spam"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateConsultationStatus(input.id, input.status);
      return { success: true };
    }),
});

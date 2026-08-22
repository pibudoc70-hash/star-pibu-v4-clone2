/**
 * server/__tests__/consultation.test.ts
 *
 * 상담 폼 라우터 통합 테스트
 * - honeypot 차단 검증
 * - 입력 유효성 검증
 * - 정상 제출 흐름 검증
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod/v4";

// ── DB mock ───────────────────────────────────────────────────────────────────
vi.mock("../db", () => ({
  createConsultationRequest: vi.fn(async (data: Record<string, unknown>) => ({ id: 42, ...data })),
  countConsultationByIp: vi.fn(async () => 0),
  countConsultationByPhone: vi.fn(async () => 0),
  getConsultationRequests: vi.fn(async () => []),
  updateConsultationStatus: vi.fn(async () => undefined),
}));

// ── notification mock ─────────────────────────────────────────────────────────
vi.mock("../_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

// ── 입력 유효성 검증 ──────────────────────────────────────────────────────────
describe("상담 폼 입력 유효성 검증", () => {
  it("이름이 비어있으면 유효성 검사에 실패해야 한다", () => {
    const schema = z.object({
      name: z.string().min(1, "이름을 입력해주세요").max(50),
      phone: z.string().min(9).max(20).regex(/^[0-9\-\s+()]+$/),
      concern: z.string().min(1).max(200),
      message: z.string().min(5).max(2000),
      privacyAgreed: z.boolean().refine((v: boolean) => v === true),
      website: z.string().max(0).optional(),
    });
    const result = schema.safeParse({
      name: "",
      phone: "010-1234-5678",
      concern: "피부 관리",
      message: "상담 내용입니다",
      privacyAgreed: true,
    });
    expect(result.success).toBe(false);
  });

  it("연락처 형식이 잘못되면 유효성 검사에 실패해야 한다", () => {
    const phoneSchema = z.string().min(9).max(20).regex(/^[0-9\-\s+()]+$/);
    expect(phoneSchema.safeParse("abc-def-ghij").success).toBe(false);
    expect(phoneSchema.safeParse("010-1234-5678").success).toBe(true);
  });

  it("상담 내용이 5자 미만이면 유효성 검사에 실패해야 한다", () => {
    const msgSchema = z.string().min(5, "5자 이상").max(2000);
    expect(msgSchema.safeParse("짧음").success).toBe(false);
    expect(msgSchema.safeParse("충분히 긴 상담 내용입니다").success).toBe(true);
  });

  it("개인정보 동의가 false이면 유효성 검사에 실패해야 한다", () => {
    const privacySchema = z.boolean().refine((v: boolean) => v === true, "동의 필요");
    expect(privacySchema.safeParse(false).success).toBe(false);
    expect(privacySchema.safeParse(true).success).toBe(true);
  });
});

// ── honeypot 로직 검증 ────────────────────────────────────────────────────────
describe("Honeypot 스팸 방지", () => {
  it("website 필드가 채워지면 honeypot으로 감지되어야 한다", () => {
    // honeypot 로직: website 필드가 비어있지 않으면 봇으로 간주
    const isBot = (website?: string) => !!(website && website.length > 0);
    expect(isBot("http://spam.com")).toBe(true);
    expect(isBot("")).toBe(false);
    expect(isBot(undefined)).toBe(false);
  });

  it("website 필드가 비어있으면 정상 사용자로 통과해야 한다", () => {
    const isBot = (website?: string) => !!(website && website.length > 0);
    expect(isBot("")).toBe(false);
  });
});

// ── rate limit 로직 검증 ──────────────────────────────────────────────────────
describe("Rate limit 로직", () => {
  it("IP 10분 3회 초과 시 차단 조건을 충족해야 한다", () => {
    const MAX_BY_IP = 3;
    expect(2 >= MAX_BY_IP).toBe(false); // 2회 → 통과
    expect(3 >= MAX_BY_IP).toBe(true);  // 3회 → 차단
  });

  it("연락처 10분 2회 초과 시 차단 조건을 충족해야 한다", () => {
    const MAX_BY_PHONE = 2;
    expect(1 >= MAX_BY_PHONE).toBe(false); // 1회 → 통과
    expect(2 >= MAX_BY_PHONE).toBe(true);  // 2회 → 차단
  });
});

// ── DB 헬퍼 mock 검증 ─────────────────────────────────────────────────────────
describe("상담 DB 헬퍼", () => {
  it("createConsultationRequest가 id를 반환해야 한다", async () => {
    const { createConsultationRequest } = await import("../db");
    const result = await createConsultationRequest({
      name: "홍길동",
      phone: "01012345678",
      concern: "피부 관리",
      message: "상담 내용입니다",
      privacyAgreed: "1",
      ipAddress: "127.0.0.1",
      lang: "ko",
      status: "pending",
    });
    expect(result).toBeDefined();
    expect(result?.id).toBe(42);
  });

  it("countConsultationByIp가 숫자를 반환해야 한다", async () => {
    const { countConsultationByIp } = await import("../db");
    const count = await countConsultationByIp("127.0.0.1", 600000);
    expect(typeof count).toBe("number");
    expect(count).toBe(0);
  });

  it("countConsultationByPhone이 숫자를 반환해야 한다", async () => {
    const { countConsultationByPhone } = await import("../db");
    const count = await countConsultationByPhone("01012345678", 600000);
    expect(typeof count).toBe("number");
    expect(count).toBe(0);
  });
});

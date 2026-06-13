/**
 * client/src/lib/errorMessages.test.ts
 *
 * 공통 에러 메시지 유틸리티 단위 테스트
 * - parseEventError: NOT_FOUND vs 일반 에러 분기
 * - parseEventListError: INTERNAL_SERVER_ERROR vs 일반 에러 분기
 * - parsePopupError: parseTRPCError 위임 확인
 */
import { describe, it, expect } from "vitest";
import { parseEventError, parseEventListError, parsePopupError } from "./errorMessages";

// ── 테스트 헬퍼 ───────────────────────────────────────────────────────────────

function makeTRPCError(message: string, code?: string) {
  return {
    message,
    data: code ? { code } : undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

// ── parseEventError ───────────────────────────────────────────────────────────

describe("parseEventError", () => {
  it("NOT_FOUND 코드 → 이벤트 없음 메시지(ko)", () => {
    const err = makeTRPCError("not found", "NOT_FOUND");
    expect(parseEventError(err, "ko")).toBe("이벤트 정보를 찾을 수 없습니다.");
  });

  it("NOT_FOUND 코드 → 이벤트 없음 메시지(en)", () => {
    const err = makeTRPCError("not found", "NOT_FOUND");
    expect(parseEventError(err, "en")).toBe("Event not found.");
  });

  it("NOT_FOUND 코드 → 이벤트 없음 메시지(ja)", () => {
    const err = makeTRPCError("not found", "NOT_FOUND");
    expect(parseEventError(err, "ja")).toBe("イベント情報が見つかりません。");
  });

  it("NOT_FOUND 코드 → 이벤트 없음 메시지(zh)", () => {
    const err = makeTRPCError("not found", "NOT_FOUND");
    expect(parseEventError(err, "zh")).toBe("找不到活动信息。");
  });

  it("메시지에 NOT_FOUND 포함 → 이벤트 없음 메시지", () => {
    const err = makeTRPCError("NOT_FOUND");
    expect(parseEventError(err, "ko")).toBe("이벤트 정보를 찾을 수 없습니다.");
  });

  it("INTERNAL_SERVER_ERROR → 일반 서버 오류 메시지(ko)", () => {
    const err = makeTRPCError("Internal Server Error", "INTERNAL_SERVER_ERROR");
    const result = parseEventError(err, "ko");
    expect(result).toContain("일시적인 오류");
  });

  it("알 수 없는 에러 → 기본 폴백 메시지", () => {
    const err = makeTRPCError("unknown error");
    const result = parseEventError(err, "ko");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

// ── parseEventListError ───────────────────────────────────────────────────────

describe("parseEventListError", () => {
  it("INTERNAL_SERVER_ERROR → 목록 로드 실패 메시지(ko)", () => {
    const err = makeTRPCError("server error", "INTERNAL_SERVER_ERROR");
    expect(parseEventListError(err, "ko")).toBe(
      "이벤트 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
    );
  });

  it("INTERNAL_SERVER_ERROR → 목록 로드 실패 메시지(en)", () => {
    const err = makeTRPCError("server error", "INTERNAL_SERVER_ERROR");
    expect(parseEventListError(err, "en")).toBe(
      "Failed to load events. Please try again shortly."
    );
  });

  it("INTERNAL_SERVER_ERROR → 목록 로드 실패 메시지(ja)", () => {
    const err = makeTRPCError("server error", "INTERNAL_SERVER_ERROR");
    expect(parseEventListError(err, "ja")).toBe(
      "イベント一覧の読み込みに失敗しました。しばらくしてから再試行してください。"
    );
  });

  it("INTERNAL_SERVER_ERROR → 목록 로드 실패 메시지(zh)", () => {
    const err = makeTRPCError("server error", "INTERNAL_SERVER_ERROR");
    expect(parseEventListError(err, "zh")).toBe("加载活动列表失败，请稍后重试。");
  });

  it("TOO_MANY_REQUESTS → 일반 폴백 메시지", () => {
    const err = makeTRPCError("too many requests", "TOO_MANY_REQUESTS");
    const result = parseEventListError(err, "ko");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

// ── parsePopupError ───────────────────────────────────────────────────────────

describe("parsePopupError", () => {
  it("INTERNAL_SERVER_ERROR → 폴백 메시지 반환", () => {
    const err = makeTRPCError("server error", "INTERNAL_SERVER_ERROR");
    const result = parsePopupError(err, "ko");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("lang 미지정 시 ko 기본값 사용", () => {
    const err = makeTRPCError("server error", "INTERNAL_SERVER_ERROR");
    const withLang = parsePopupError(err, "ko");
    const withoutLang = parsePopupError(err);
    expect(withLang).toBe(withoutLang);
  });
});

/**
 * client/src/lib/errorMessages.ts
 *
 * 공통 에러 메시지 유틸리티.
 * - 예약 전용 파서(parseTRPCError 등)를 re-export하여 전체 앱에서 사용 가능하게 한다.
 * - 이벤트·팝업 전용 에러 파서를 추가한다.
 */

export {
  parseTRPCError,
  parseOtpSendError,
  parseOtpVerifyError,
  parseReservationError,
  type Lang,
} from "@/components/reservation/errorMessages";

import type { TRPCClientErrorLike } from "@trpc/client";
import { parseTRPCError, type Lang } from "@/components/reservation/errorMessages";

export type AdminErrorOperation =
  | "equipment3.load"
  | "equipment3.create"
  | "equipment3.update"
  | "equipment3.delete"
  | "equipment3.reorder"
  | "equipment3.translate"
  | "equipment3.seo-generate"
  | "notices.translate";

export type AdminErrorDetails = {
  code: string;
  message: string;
};

function getTrpcErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object" || !("data" in error)) return null;
  const { data } = error as { data?: unknown };
  if (!data || typeof data !== "object" || !("code" in data)) return null;
  const { code } = data as { code?: unknown };
  return typeof code === "string" ? code : null;
}

/** 관리자 UI용 안전 오류 정보. 원본 backend message나 stack은 사용자 화면에 전달하지 않는다. */
export function getAdminErrorDetails(error: unknown, operation: AdminErrorOperation): AdminErrorDetails {
  const suffix = operation.replace(".", "-").toUpperCase();
  const trpcCode = getTrpcErrorCode(error);

  if (trpcCode === "UNAUTHORIZED") return { code: `ADM-${suffix}-UNAUTHORIZED`, message: "로그인이 필요합니다. 다시 로그인한 후 시도해 주세요." };
  if (trpcCode === "FORBIDDEN") return { code: `ADM-${suffix}-FORBIDDEN`, message: "이 작업을 수행할 권한이 없습니다." };
  if (trpcCode === "BAD_REQUEST") return { code: `ADM-${suffix}-INVALID`, message: "입력 내용을 확인한 후 다시 시도해 주세요." };
  if (trpcCode === "NOT_FOUND") return { code: `ADM-${suffix}-NOT-FOUND`, message: "요청한 데이터를 찾을 수 없습니다." };
  if (trpcCode === "CONFLICT") return { code: `ADM-${suffix}-CONFLICT`, message: "다른 변경과 충돌했습니다. 새로고침 후 다시 시도해 주세요." };
  if (trpcCode === "TOO_MANY_REQUESTS") return { code: `ADM-${suffix}-RATE-LIMIT`, message: "요청이 많습니다. 잠시 후 다시 시도해 주세요." };

  return { code: `ADM-${suffix}-UNEXPECTED`, message: "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." };
}

// ─── 이벤트 페이지 에러 파서 ──────────────────────────────────────────────────

/** 이벤트 목록/상세 조회 에러에 특화된 메시지 반환 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseEventError(err: TRPCClientErrorLike<any>, lang: Lang = "ko"): string {
  const message = err.message ?? "";
  const trpcCode = (err.data as { code?: string } | undefined)?.code ?? "";

  // 404 — 이벤트가 실제로 없는 경우
  if (trpcCode === "NOT_FOUND" || message.includes("NOT_FOUND")) {
    const notFound: Record<Lang, string> = {
      ko: "이벤트 정보를 찾을 수 없습니다.",
      en: "Event not found.",
      ja: "イベント情報が見つかりません。",
      zh: "找不到活动信息。",
      "zh-TW": "找不到活動資訊。",
    };
    return notFound[lang] ?? notFound.ko;
  }

  return parseTRPCError(err, lang);
}

/** 이벤트 목록 조회 실패 메시지 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseEventListError(err: TRPCClientErrorLike<any>, lang: Lang = "ko"): string {
  const trpcCode = (err.data as { code?: string } | undefined)?.code ?? "";

  // 서버 일시 오류
  if (trpcCode === "INTERNAL_SERVER_ERROR") {
    const serverError: Record<Lang, string> = {
      ko: "이벤트 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      en: "Failed to load events. Please try again shortly.",
      ja: "イベント一覧の読み込みに失敗しました。しばらくしてから再試行してください。",
      zh: "加载活动列表失败，请稍后重试。",
      "zh-TW": "載入活動列表失敗，請稍後再試。",
    };
    return serverError[lang] ?? serverError.ko;
  }

  return parseTRPCError(err, lang);
}

// ─── 팝업 에러 파서 ───────────────────────────────────────────────────────────

/**
 * 팝업 조회 에러 파서.
 * 팝업은 사용자 경험을 방해하지 않아야 하므로 조용히 처리하는 것이 기본이지만,
 * 에러 메시지가 필요한 경우를 위해 제공한다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsePopupError(err: TRPCClientErrorLike<any>, lang: Lang = "ko"): string {
  return parseTRPCError(err, lang);
}

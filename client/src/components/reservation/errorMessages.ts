/**
 * client/src/components/reservation/errorMessages.ts
 *
 * 백엔드 DomainError 코드(TRPCError.message에 포함)를 파싱하여
 * 사용자에게 친절한 다국어 메시지를 반환하는 유틸리티.
 *
 * 매핑 전략:
 *  1. err.message에 DOMAIN_ERROR_CODES 키워드가 포함되어 있으면 → 코드별 메시지
 *  2. err.data?.code (TRPC HTTP 코드)로 폴백
 *  3. 그 외 → 백엔드 메시지 그대로 (이미 한국어)
 */

import type { TRPCClientErrorLike } from "@trpc/client";

// ─── 지원 언어 ────────────────────────────────────────────────────────────────
export type Lang = "ko" | "en" | "ja" | "zh";

// ─── 에러 코드 → 다국어 메시지 매핑 ──────────────────────────────────────────
const DOMAIN_ERROR_MESSAGES: Record<string, Record<Lang, string>> = {
  // OTP 관련
  // eslint-disable-next-line @typescript-eslint/naming-convention
  OTP_COOLDOWN: {
    ko: "인증번호를 너무 자주 요청했습니다. 잠시 후(약 60초) 다시 시도해 주세요.",
    en: "You've requested too many codes. Please wait about 60 seconds and try again.",
    ja: "認証番号のリクエストが多すぎます。約60秒後に再試行してください。",
    zh: "验证码请求过于频繁，请约60秒后重试。",
  },
  OTP_INVALID: {
    ko: "인증번호가 올바르지 않습니다. 문자로 받은 6자리 번호를 다시 확인해 주세요.",
    en: "The verification code is incorrect. Please check the 6-digit code sent to your phone.",
    ja: "認証番号が正しくありません。SMSで受け取った6桁の番号をご確認ください。",
    zh: "验证码不正确，请重新确认短信中的6位数字。",
  },
  OTP_LOCKED: {
    ko: "인증 시도 횟수를 초과했습니다. 잠시 후 다시 시도하거나, 카카오톡 상담을 이용해 주세요.",
    en: "Too many failed attempts. Please try again later or contact us via KakaoTalk.",
    ja: "認証の試行回数を超えました。しばらくしてから再試行するか、カカオトークでお問い合わせください。",
    zh: "验证尝试次数过多，请稍后再试或通过KakaoTalk联系我们。",
  },
  OTP_EXPIRED: {
    ko: "인증번호가 만료되었습니다. 재발송 버튼을 눌러 새 인증번호를 받아주세요.",
    en: "The verification code has expired. Please click 'Resend' to get a new code.",
    ja: "認証番号の有効期限が切れました。「再送信」ボタンを押して新しい番号をお受け取りください。",
        zh: "\u9a8c\u8bc1\u7801\u5df2\u8fc7\u671f\uff0c\u8bf7\u70b9\u51fb\u300e\u91cd\u65b0\u53d1\u9001\u300f\u83b7\u53d6\u65b0\u9a8c\u8bc1\u7801\u3002",
  },
  // 예약 날짜 관련
  RESERVATION_DATE_INVALID: {
    ko: "예약이 불가능한 날짜입니다. 당일·일요일·공휴일은 예약할 수 없습니다.",
    en: "This date is not available for booking. Same-day, Sundays, and holidays are excluded.",
    ja: "この日付は予約できません。当日・日曜日・祝日は予約不可です。",
    zh: "此日期无法预约，当天、周日及节假日不可预约。",
  },
  RESERVATION_DATE_UNAVAILABLE: {
    ko: "선택하신 날짜는 이미 예약이 마감되었습니다. 다른 날짜를 선택해 주세요.",
    en: "The selected date is fully booked. Please choose a different date.",
    ja: "選択した日付はすでに予約が埋まっています。別の日付をお選びください。",
    zh: "所选日期已满，请选择其他日期。",
  },
  RESERVATION_NOT_FOUND: {
    ko: "예약 정보를 찾을 수 없습니다. 예약 내역을 다시 확인해 주세요.",
    en: "Reservation not found. Please check your booking details.",
    ja: "予約情報が見つかりません。予約内容をご確認ください。",
    zh: "未找到预约信息，请重新确认预约详情。",
  },
  // 공통
  VALIDATION: {
    ko: "입력 정보를 다시 확인해 주세요.",
    en: "Please check your input and try again.",
    ja: "入力内容をご確認ください。",
    zh: "请重新检查您的输入信息。",
  },
  NOT_FOUND: {
    ko: "요청하신 정보를 찾을 수 없습니다.",
    en: "The requested information could not be found.",
    ja: "ご要望の情報が見つかりません。",
    zh: "找不到请求的信息。",
  },
  FORBIDDEN: {
    ko: "이 작업을 수행할 권한이 없습니다.",
    en: "You do not have permission to perform this action.",
    ja: "この操作を行う権限がありません。",
    zh: "您没有权限执行此操作。",
  },
};

// ─── TRPC HTTP 코드 → 다국어 폴백 메시지 ─────────────────────────────────────
const TRPC_CODE_FALLBACK: Record<string, Record<Lang, string>> = {
  TOO_MANY_REQUESTS: {
    ko: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    en: "Too many requests. Please try again in a moment.",
    ja: "リクエストが多すぎます。しばらくしてから再試行してください。",
    zh: "请求过于频繁，请稍后再试。",
  },
  BAD_REQUEST: {
    ko: "입력 정보를 확인해 주세요.",
    en: "Please check your input.",
    ja: "入力内容をご確認ください。",
    zh: "请检查您的输入。",
  },
  UNAUTHORIZED: {
    ko: "로그인이 필요합니다.",
    en: "Please log in to continue.",
    ja: "ログインが必要です。",
    zh: "请先登录。",
  },
  FORBIDDEN: {
    ko: "이 작업을 수행할 권한이 없습니다.",
    en: "You do not have permission to perform this action.",
    ja: "この操作を行う権限がありません。",
    zh: "您没有权限执行此操作。",
  },
  NOT_FOUND: {
    ko: "요청하신 정보를 찾을 수 없습니다.",
    en: "The requested information could not be found.",
    ja: "ご要望の情報が見つかりません。",
    zh: "找不到请求的信息。",
  },
  INTERNAL_SERVER_ERROR: {
    ko: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    en: "A temporary error occurred. Please try again shortly.",
    ja: "一時的なエラーが発生しました。しばらくしてから再試行してください。",
    zh: "发生了临时错误，请稍后重试。",
  },
};

// ─── 기본 폴백 메시지 ─────────────────────────────────────────────────────────
const DEFAULT_FALLBACK: Record<Lang, string> = {
  ko: "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  en: "An error occurred. Please try again.",
  ja: "エラーが発生しました。しばらくしてから再試行してください。",
  zh: "发生错误，请稍后重试。",
};

// ─── 메인 유틸리티 함수 ───────────────────────────────────────────────────────

/**
 * TRPCClientError를 파싱하여 사용자 친화적 메시지를 반환한다.
 *
 * @param err    tRPC onError 콜백의 err 객체
 * @param lang   현재 언어 (기본값: "ko")
 * @returns      사용자에게 보여줄 메시지 문자열
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseTRPCError(err: TRPCClientErrorLike<any>, lang: Lang = "ko"): string {
  const message = err.message ?? "";
  const trpcCode = (err.data as { code?: string } | undefined)?.code ?? "";

  // 1순위: 메시지에서 DOMAIN_ERROR_CODE 키워드 탐지
  for (const [code, messages] of Object.entries(DOMAIN_ERROR_MESSAGES)) {
    if (message.includes(code)) {
      return messages[lang] ?? messages.ko;
    }
  }

  // 2순위: TRPC HTTP 코드 폴백
  if (trpcCode && TRPC_CODE_FALLBACK[trpcCode]) {
    return TRPC_CODE_FALLBACK[trpcCode][lang] ?? TRPC_CODE_FALLBACK[trpcCode].ko;
  }

  // 3순위: 백엔드 메시지가 이미 한국어이면 그대로 사용 (영어/일어/중어는 기본 폴백)
  if (message && lang === "ko") {
    return message;
  }

  // 4순위: 기본 폴백
  return DEFAULT_FALLBACK[lang];
}

/**
 * OTP 발송 에러에 특화된 메시지 반환.
 * 쿨다운 상황에서 남은 시간을 추출하여 메시지에 포함한다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseOtpSendError(err: TRPCClientErrorLike<any>, lang: Lang = "ko"): string {
  const message = err.message ?? "";

  // 쿨다운 메시지에서 초 단위 숫자 추출 시도
  const secondsMatch = message.match(/(\d+)\s*초/);
  if (secondsMatch && lang === "ko") {
    const seconds = secondsMatch[1];
    return `인증번호를 너무 자주 요청했습니다. ${seconds}초 후에 다시 시도해 주세요.`;
  }

  return parseTRPCError(err, lang);
}

/**
 * OTP 인증 에러에 특화된 메시지 반환.
 * 남은 시도 횟수 정보가 있으면 포함한다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseOtpVerifyError(err: TRPCClientErrorLike<any>, lang: Lang = "ko"): string {
  const message = err.message ?? "";

  // 남은 시도 횟수 추출 시도 (예: "남은 시도: 2회")
  const attemptsMatch = message.match(/남은\s*시도[:\s]*(\d+)/);
  if (attemptsMatch && lang === "ko") {
    const remaining = attemptsMatch[1];
    return `인증번호가 올바르지 않습니다. 남은 시도 횟수: ${remaining}회`;
  }

  return parseTRPCError(err, lang);
}

/**
 * 예약 생성 에러에 특화된 메시지 반환.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseReservationError(err: TRPCClientErrorLike<any>, lang: Lang = "ko"): string {
  return parseTRPCError(err, lang);
}

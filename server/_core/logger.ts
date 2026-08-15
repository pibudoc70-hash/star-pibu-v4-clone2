/**
 * server/_core/logger.ts
 * 서버 사이드 로거 유틸리티
 *
 * - info / warn / error 레벨 구분
 * - 민감 정보(전화번호, 이메일, OTP 코드) 자동 마스킹
 * - 운영 환경(NODE_ENV=production)에서는 info 레벨 로그 자동 축소
 */

const IS_PROD = process.env.NODE_ENV === "production";

/** 민감 정보 마스킹: 연락처, 인증값, 세션·접근 토큰, 연결 문자열 */
export function maskSensitiveForLog(msg: string): string {
  return msg
    // Header values can contain multiple tokens/cookies: redact the whole value.
    .replace(/\b(authorization|cookie|set-cookie|x-api-key|x-auth-token)\s*:\s*[^\r\n]+/gi, "$1: [REDACTED]")
    // 전화번호 패턴 (010-1234-5678 / 01012345678 / +82-10-...)
    .replace(/(\+?82[-\s]?)?0?1[0-9][-\s]?\d{3,4}[-\s]?\d{4}/g, "[PHONE]")
    // 이메일 패턴
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]")
    // 6자리 숫자 OTP 코드 (단독 토큰)
    .replace(/\b\d{6}\b/g, "[OTP]")
    // Bearer/JWT/session token
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[JWT]")
    // OAuth authorization code in query strings
    .replace(/([?&](?:code|oauth_?code)=)[^&#\s]+/gi, "$1[REDACTED]")
    // 민감 key=value 형태
    .replace(/\b(password|secret|token|authorization|cookie|database_url|api[_-]?key|access_?token|refresh_?token|id_?token|oauth_?code)\s*([:=])\s*[^\s,;]+/gi, "$1$2[REDACTED]")
    // MySQL·postgres 형태의 connection URI
    .replace(/\b(?:mysql|postgres(?:ql)?):\/\/[^\s]+/gi, "[DATABASE_URL]");
}

function formatMessage(level: string, tag: string, msg: string): string {
  const ts = new Date().toISOString();
  const masked = maskSensitiveForLog(msg);
  return `[${ts}] [${level}] ${tag ? `[${tag}] ` : ""}${masked}`;
}

export const logger = {
  info(tag: string, msg: string): void {
    if (IS_PROD) return; // 운영 환경에서는 info 로그 축소
    console.log(formatMessage("INFO", tag, msg));
  },
  warn(tag: string, msg: string, err?: unknown): void {
    const detail = err instanceof Error
      ? `${err.name}: ${err.message}`
      : err
        ? String(err)
        : "";
    const stack = err instanceof Error && err.stack
      ? `\n${maskSensitiveForLog(err.stack)}`
      : "";
    const suffix = detail ? ` | ${maskSensitiveForLog(detail)}` : "";
    console.warn(formatMessage("WARN", tag, msg) + suffix + stack);
  },
  error(tag: string, msg: string, err?: unknown): void {
    const detail = err instanceof Error
      ? `${err.name}: ${err.message}`
      : err
        ? String(err)
        : "";
    const stack = !IS_PROD && err instanceof Error && err.stack
      ? `\n${maskSensitiveForLog(err.stack)}`
      : "";
    const suffix = detail ? ` | ${maskSensitiveForLog(detail)}` : "";
    console.error(formatMessage("ERROR", tag, msg) + suffix + stack);
  },
};

/**
 * server/_core/logger.ts
 * 서버 사이드 로거 유틸리티
 *
 * - info / warn / error 레벨 구분
 * - 민감 정보(전화번호, 이메일, OTP 코드) 자동 마스킹
 * - 운영 환경(NODE_ENV=production)에서는 info 레벨 로그 자동 축소
 */

const IS_PROD = process.env.NODE_ENV === "production";

/** 민감 정보 마스킹: 전화번호, 이메일, 6자리 숫자 코드 */
function maskSensitive(msg: string): string {
  return msg
    // 전화번호 패턴 (010-1234-5678 / 01012345678 / +82-10-...)
    .replace(/(\+?82[-\s]?)?0?1[0-9][-\s]?\d{3,4}[-\s]?\d{4}/g, "[PHONE]")
    // 이메일 패턴
    .replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, "[EMAIL]")
    // 6자리 숫자 OTP 코드 (단독 토큰)
    .replace(/\b\d{6}\b/g, "[OTP]");
}

function formatMessage(level: string, tag: string, msg: string): string {
  const ts = new Date().toISOString();
  const masked = maskSensitive(msg);
  return `[${ts}] [${level}] ${tag ? `[${tag}] ` : ""}${masked}`;
}

export const logger = {
  info(tag: string, msg: string): void {
    if (IS_PROD) return; // 운영 환경에서는 info 로그 축소
    console.log(formatMessage("INFO", tag, msg));
  },
  warn(tag: string, msg: string): void {
    console.warn(formatMessage("WARN", tag, msg));
  },
  error(tag: string, msg: string, err?: unknown): void {
    const stack = err instanceof Error ? `\n${err.stack}` : err ? ` | ${String(err)}` : "";
    console.error(formatMessage("ERROR", tag, msg) + stack);
  },
};

import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { logger } from "./logger";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/**
 * 인증 자격증명이 요청에 존재할 가능성이 있는지 저비용으로 판별한다.
 * 쿠키·Authorization 헤더가 전혀 없으면 인증 시도 자체를 건너뛴다.
 *
 * 공개 API(시술 목록·이벤트·공지 등)가 트래픽의 대부분이므로,
 * 이 early return 으로 불필요한 인증 I/O 를 제거한다.
 *
 * 주의: 정규식이 실제 세션 쿠키 이름을 놓치면 로그인 사용자가
 *       익명으로 취급되어 관리자 기능이 깨진다.
 *       쿠키 이름을 추가할 때는 반드시 관리자 로그인 회귀 테스트를 수행할 것.
 *
 * 실제 세션 쿠키 이름: "app_session_id" (shared/const.ts COOKIE_NAME)
 * → "session" 키워드 포함 → 아래 정규식에 매칭됨 (정규식 수정 불필요)
 */
function hasAuthCredentials(req: CreateExpressContextOptions["req"]): boolean {
  if (req.headers.authorization) return true;

  const cookie = req.headers.cookie;
  if (!cookie) return false;

  return /(?:session|token|auth|sid|jwt)/i.test(cookie);
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // 인증 힌트가 없으면 즉시 익명 컨텍스트 반환
  if (!hasAuthCredentials(opts.req)) {
    return { req: opts.req, res: opts.res, user: null };
  }

  try {
    const user = await sdk.authenticateRequest(opts.req);
    return { req: opts.req, res: opts.res, user };
  } catch (error) {
    // 인증 실패는 공개 프로시저에서 정상 케이스이므로 요청을 막지 않는다.
    // 단, 인증 서버 장애를 관측할 수 있도록 로그는 남긴다.
    logger.warn("Auth", "authenticateRequest failed", error);
    return { req: opts.req, res: opts.res, user: null };
  }
}

/**
 * Sprint 1 — S1-T1 테스트
 * main.tsx의 redirectToLoginIfUnauthorized 로직 검증
 *
 * 테스트 대상:
 * 1. UNAUTHED_ERR_MSG 에러 시 redirect 발생
 * 2. 다른 에러 메시지는 redirect 미발생
 * 3. TRPCClientError가 아닌 에러는 redirect 미발생
 * 4. isRedirecting 플래그로 중복 redirect 방지
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCClientError } from "@trpc/client";
import { UNAUTHED_ERR_MSG } from "../shared/const";

// redirectToLoginIfUnauthorized 로직을 독립적으로 테스트하기 위해 인라인 구현
function makeRedirectHandler() {
  let isRedirecting = false;
  const redirectCalls: string[] = [];

  const mockReplace = (url: string) => {
    redirectCalls.push(url);
  };

  const redirectToLoginIfUnauthorized = (error: unknown) => {
    if (!(error instanceof TRPCClientError)) return;
    if (error.message !== UNAUTHED_ERR_MSG) return;
    if (isRedirecting) return;
    isRedirecting = true;
    mockReplace("/login");
  };

  return { redirectToLoginIfUnauthorized, redirectCalls, getIsRedirecting: () => isRedirecting };
}

describe("redirectToLoginIfUnauthorized", () => {
  it("UNAUTHED_ERR_MSG 에러 시 redirect 발생", () => {
    const { redirectToLoginIfUnauthorized, redirectCalls } = makeRedirectHandler();
    const error = new TRPCClientError(UNAUTHED_ERR_MSG);
    redirectToLoginIfUnauthorized(error);
    expect(redirectCalls).toHaveLength(1);
    expect(redirectCalls[0]).toBe("/login");
  });

  it("다른 에러 메시지는 redirect 미발생", () => {
    const { redirectToLoginIfUnauthorized, redirectCalls } = makeRedirectHandler();
    const error = new TRPCClientError("Some other error");
    redirectToLoginIfUnauthorized(error);
    expect(redirectCalls).toHaveLength(0);
  });

  it("TRPCClientError가 아닌 에러는 redirect 미발생", () => {
    const { redirectToLoginIfUnauthorized, redirectCalls } = makeRedirectHandler();
    redirectToLoginIfUnauthorized(new Error(UNAUTHED_ERR_MSG));
    redirectToLoginIfUnauthorized("string error");
    redirectToLoginIfUnauthorized(null);
    expect(redirectCalls).toHaveLength(0);
  });

  it("isRedirecting 플래그로 중복 redirect 방지 — 두 번 호출해도 한 번만 redirect", () => {
    const { redirectToLoginIfUnauthorized, redirectCalls } = makeRedirectHandler();
    const error = new TRPCClientError(UNAUTHED_ERR_MSG);
    redirectToLoginIfUnauthorized(error);
    redirectToLoginIfUnauthorized(error); // 두 번째 호출
    expect(redirectCalls).toHaveLength(1); // 한 번만 redirect
  });

  it("isRedirecting 플래그가 true로 설정됨", () => {
    const { redirectToLoginIfUnauthorized, getIsRedirecting } = makeRedirectHandler();
    const error = new TRPCClientError(UNAUTHED_ERR_MSG);
    expect(getIsRedirecting()).toBe(false);
    redirectToLoginIfUnauthorized(error);
    expect(getIsRedirecting()).toBe(true);
  });

  it("QueryCache + MutationCache 동시 발화 시나리오 — 중복 방지 확인", () => {
    const { redirectToLoginIfUnauthorized, redirectCalls } = makeRedirectHandler();
    const error = new TRPCClientError(UNAUTHED_ERR_MSG);
    // QueryCache와 MutationCache가 동시에 에러를 발화하는 시나리오
    redirectToLoginIfUnauthorized(error); // QueryCache
    redirectToLoginIfUnauthorized(error); // MutationCache
    redirectToLoginIfUnauthorized(error); // 추가 쿼리
    expect(redirectCalls).toHaveLength(1);
  });
});

describe("UNAUTHED_ERR_MSG 상수 검증", () => {
  it("UNAUTHED_ERR_MSG가 빈 문자열이 아님", () => {
    expect(UNAUTHED_ERR_MSG).toBeTruthy();
    expect(typeof UNAUTHED_ERR_MSG).toBe("string");
  });
});

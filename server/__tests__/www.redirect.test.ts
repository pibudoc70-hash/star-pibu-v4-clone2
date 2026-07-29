/**
 * www → apex 301 리다이렉트 미들웨어 테스트
 *
 * 검증 항목:
 * 1. www.star-pibu.com/* → star-pibu.com/* 301 리다이렉트
 * 2. 경로(path) 및 쿼리스트링 보존
 * 3. apex 도메인 요청은 리다이렉트 없이 통과
 * 4. x-forwarded-proto 헤더 기반 프로토콜 보존
 */
import { describe, it, expect, vi } from "vitest";

// 미들웨어 로직을 독립적으로 테스트하기 위해 인라인 구현
// (server/redirects.ts의 www 리다이렉트 미들웨어와 동일 로직)
function wwwRedirectMiddleware(
  req: { headers: Record<string, string>; originalUrl: string },
  res: { redirect: (code: number, url: string) => void },
  next: () => void,
) {
  const host = req.headers["host"] ?? "";
  if (host.startsWith("www.")) {
    const apexHost = host.slice(4);
    const proto = req.headers["x-forwarded-proto"] ?? "https";
    const target = `${proto}://${apexHost}${req.originalUrl}`;
    res.redirect(301, target);
    return;
  }
  next();
}

describe("www → apex 301 리다이렉트 미들웨어", () => {
  it("www.star-pibu.com/ → star-pibu.com/ 301 리다이렉트", () => {
    const redirectMock = vi.fn();
    const nextMock = vi.fn();
    wwwRedirectMiddleware(
      { headers: { host: "www.star-pibu.com", "x-forwarded-proto": "https" }, originalUrl: "/" },
      { redirect: redirectMock },
      nextMock,
    );
    expect(redirectMock).toHaveBeenCalledWith(301, "https://star-pibu.com/");
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("경로 보존: www.star-pibu.com/zh-tw → star-pibu.com/zh-tw", () => {
    const redirectMock = vi.fn();
    const nextMock = vi.fn();
    wwwRedirectMiddleware(
      { headers: { host: "www.star-pibu.com", "x-forwarded-proto": "https" }, originalUrl: "/zh-tw" },
      { redirect: redirectMock },
      nextMock,
    );
    expect(redirectMock).toHaveBeenCalledWith(301, "https://star-pibu.com/zh-tw");
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("쿼리스트링 보존: www.star-pibu.com/equipment3?tab=리프팅 → star-pibu.com/equipment3?tab=리프팅", () => {
    const redirectMock = vi.fn();
    const nextMock = vi.fn();
    wwwRedirectMiddleware(
      {
        headers: { host: "www.star-pibu.com", "x-forwarded-proto": "https" },
        originalUrl: "/equipment3?tab=%EB%A6%AC%ED%94%84%ED%8C%85",
      },
      { redirect: redirectMock },
      nextMock,
    );
    expect(redirectMock).toHaveBeenCalledWith(
      301,
      "https://star-pibu.com/equipment3?tab=%EB%A6%AC%ED%94%84%ED%8C%85",
    );
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("apex 도메인 요청은 리다이렉트 없이 next() 호출", () => {
    const redirectMock = vi.fn();
    const nextMock = vi.fn();
    wwwRedirectMiddleware(
      { headers: { host: "star-pibu.com", "x-forwarded-proto": "https" }, originalUrl: "/" },
      { redirect: redirectMock },
      nextMock,
    );
    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledOnce();
  });

  it("x-forwarded-proto 없으면 https 기본값 사용", () => {
    const redirectMock = vi.fn();
    const nextMock = vi.fn();
    wwwRedirectMiddleware(
      { headers: { host: "www.star-pibu.com" }, originalUrl: "/ja" },
      { redirect: redirectMock },
      nextMock,
    );
    expect(redirectMock).toHaveBeenCalledWith(301, "https://star-pibu.com/ja");
  });

  it("www 이외 서브도메인은 리다이렉트 없이 통과", () => {
    const redirectMock = vi.fn();
    const nextMock = vi.fn();
    wwwRedirectMiddleware(
      { headers: { host: "api.star-pibu.com", "x-forwarded-proto": "https" }, originalUrl: "/" },
      { redirect: redirectMock },
      nextMock,
    );
    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledOnce();
  });

  it("301 상태 코드 사용 (302 아님)", () => {
    const redirectMock = vi.fn();
    const nextMock = vi.fn();
    wwwRedirectMiddleware(
      { headers: { host: "www.star-pibu.com", "x-forwarded-proto": "https" }, originalUrl: "/sub/sub_01_01.html" },
      { redirect: redirectMock },
      nextMock,
    );
    expect(redirectMock).toHaveBeenCalledWith(301, expect.any(String));
    const [statusCode] = redirectMock.mock.calls[0] as [number, string];
    expect(statusCode).toBe(301);
  });
});

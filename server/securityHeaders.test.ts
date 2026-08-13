/**
 * 보안 헤더 미들웨어 테스트
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { securityHeadersMiddleware } from "./_core/securityHeaders";

function createMockRes() {
  const headers: Record<string, string> = {};
  const removedHeaders: string[] = [];
  return {
    setHeader: vi.fn((name: string, value: string) => {
      headers[name] = value;
    }),
    removeHeader: vi.fn((name: string) => {
      removedHeaders.push(name);
    }),
    _headers: headers,
    _removedHeaders: removedHeaders,
  };
}

describe("securityHeadersMiddleware", () => {
  let req: Partial<Request>;
  let res: ReturnType<typeof createMockRes>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = createMockRes();
    next = vi.fn();
    process.env.NODE_ENV = "test";
  });

  it("X-Powered-By 헤더를 제거해야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    expect(res.removeHeader).toHaveBeenCalledWith("X-Powered-By");
    expect(res._removedHeaders).toContain("X-Powered-By");
  });

  it("Content-Security-Policy 헤더를 설정해야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const csp = res._headers["Content-Security-Policy"];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("CSP에 YouTube frame-src가 포함되어야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const csp = res._headers["Content-Security-Policy"];
    expect(csp).toContain("https://www.youtube.com");
    expect(csp).toContain("https://www.youtube-nocookie.com");
  });

  it("CSP에 Cloudflare Turnstile script-src가 포함되어야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const csp = res._headers["Content-Security-Policy"];
    expect(csp).toContain("https://challenges.cloudflare.com");
  });

  it("CSP에 Google Fonts style-src/font-src가 포함되어야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const csp = res._headers["Content-Security-Policy"];
    expect(csp).toContain("https://fonts.googleapis.com");
    expect(csp).toContain("https://fonts.gstatic.com");
  });

  it("CSP에 지도 SDK의 최소 Google Maps 출처가 포함되어야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const csp = res._headers["Content-Security-Policy"];
    expect(csp).toContain("img-src 'self' data: blob: https://*.cloudfront.net https://images.unsplash.com https://img.youtube.com https://i.ytimg.com https://lh3.googleusercontent.com https://maps.googleapis.com https://maps.gstatic.com");
    expect(csp).toContain("connect-src 'self' https://forge.manus.ai https://api.manus.im https://manus.im https://manus-analytics.com https://challenges.cloudflare.com https://*.cloudfront.net https://files.manuscdn.com https://maps.googleapis.com https://maps.gstatic.com");
  });

  it("CSP에 Manus 스토리지 CDN img-src가 포함되어야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const csp = res._headers["Content-Security-Policy"];
    // CloudFront 와일드카드로 모든 서브도메인 허용 (d2xsxph8..., d36hbw14... 등)
    expect(csp).toContain("https://*.cloudfront.net");
  });

  it("CSP에 analytics connect-src가 포함되어야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const csp = res._headers["Content-Security-Policy"];
    expect(csp).toContain("https://manus-analytics.com");
  });

  it("X-Frame-Options: SAMEORIGIN을 설정해야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    expect(res._headers["X-Frame-Options"]).toBe("SAMEORIGIN");
  });

  it("X-Content-Type-Options: nosniff를 설정해야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    expect(res._headers["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("Referrer-Policy를 설정해야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    expect(res._headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("Permissions-Policy에 주요 기능 비활성화가 포함되어야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const pp = res._headers["Permissions-Policy"];
    expect(pp).toContain("camera=()");
    expect(pp).toContain("microphone=()");
    expect(pp).toContain("geolocation=()");
    expect(pp).toContain("payment=()");
  });

  it("X-XSS-Protection을 설정해야 한다 (Step49-G: 구형 XSS 필터 비활성화)", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    expect(res._headers["X-XSS-Protection"]).toBe("0");
  });

  it("Cross-Origin-Opener-Policy를 설정해야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    expect(res._headers["Cross-Origin-Opener-Policy"]).toBe("same-origin-allow-popups");
  });

  it("Cross-Origin-Resource-Policy를 설정해야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    expect(res._headers["Cross-Origin-Resource-Policy"]).toBe("cross-origin");
  });

  it("next()를 호출해야 한다", () => {
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("개발 환경에서 CSP에 unsafe-eval이 포함되어야 한다", () => {
    process.env.NODE_ENV = "development";
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const csp = res._headers["Content-Security-Policy"];
    expect(csp).toContain("'unsafe-eval'");
  });

  it("프로덕션 환경에서 CSP에 unsafe-eval이 없어야 한다", () => {
    process.env.NODE_ENV = "production";
    securityHeadersMiddleware(req as Request, res as unknown as Response, next);
    const csp = res._headers["Content-Security-Policy"];
    expect(csp).not.toContain("'unsafe-eval'");
  });
});

/**
 * securityHeaders.ts
 * Express 보안 헤더 미들웨어
 *
 * 적용 헤더:
 * - Content-Security-Policy (CSP)
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 * - Permissions-Policy
 * - X-XSS-Protection (legacy)
 * - X-Powered-By 제거
 *
 * HSTS(Strict-Transport-Security)는 Cloudflare에서 이미 설정됨 (max-age=31536000; includeSubDomains; preload)
 */
import type { Request, Response, NextFunction } from "express";

/**
 * CSP 정책 구성
 *
 * 이 사이트에서 사용하는 외부 리소스:
 * - 이미지: d2xsxph8kpxj0f.cloudfront.net (Manus 스토리지 CDN), images.unsplash.com
 * - 폰트: fonts.googleapis.com, fonts.gstatic.com
 * - 스크립트: challenges.cloudflare.com (Turnstile), forge.manus.ai (Maps 프록시)
 * - 미디어(iframe): www.youtube.com (YouTube embed)
 * - 연결(fetch/XHR): manus-analytics.com (Umami), forge.manus.ai, api.manus.im, manus.im
 * - 인라인 스타일: React 컴포넌트에서 style={{ }} 광범위 사용 → 'unsafe-inline' 필요
 * - 인라인 스크립트: index.html scrollRestoration 스크립트, Turnstile 콜백 → 'unsafe-inline' 필요
 *
 * 개발 환경에서는 Vite HMR을 위해 'unsafe-eval' 추가 허용
 */
function buildCSP(isDev: boolean): string {
  const self = "'self'";
  const unsafeInline = "'unsafe-inline'";
  const unsafeEval = isDev ? "'unsafe-eval'" : "";
  const scriptSrc = [
    self,
    unsafeInline,
    isDev ? unsafeEval : "",
    "https://challenges.cloudflare.com",
    "https://forge.manus.ai",
    "https://manus-analytics.com",
  ]
    .filter(Boolean)
    .join(" ");

  const styleSrc = [
    self,
    unsafeInline,
    "https://fonts.googleapis.com",
    // KaTeX CSS CDN (AI 채팅 컴포넌트 수식 렌더링)
    "https://cdn.jsdelivr.net",
  ].join(" ");

  const fontSrc = [
    self,
    "https://fonts.gstatic.com",
    // KaTeX 폰트 파일 (CDN에서 로드되는 woff2/woff/ttf)
    "https://cdn.jsdelivr.net",
    // Manus 스토리지 CDN: /manus-storage/ 307 리다이렉트 대상 (Pretendard 등)
    "https://*.cloudfront.net",
    "data:",
  ].join(" ");

  const imgSrc = [
    self,
    "data:",
    "blob:",
    // Manus 스토리지 CDN: 여러 CloudFront 서브도메인 허용
    "https://*.cloudfront.net",
    "https://images.unsplash.com",
    "https://img.youtube.com",
    "https://i.ytimg.com",
    "https://lh3.googleusercontent.com",
    // Manus 스토리지 (상대 경로 /api/storage/ 는 self로 커버)
  ].join(" ");

  const connectSrc = [
    self,
    "https://forge.manus.ai",
    "https://api.manus.im",
    "https://manus.im",
    "https://manus-analytics.com",
    "https://challenges.cloudflare.com",
    // Manus 스토리지 CDN: SW fetch → /api/storage/ → 307 → CloudFront 리다이렉트 대상
    "https://*.cloudfront.net",
    // Manus CDN (콘솔 에러에서 발견)
    "https://files.manuscdn.com",
    isDev ? "ws://localhost:*" : "",
    isDev ? "wss://localhost:*" : "",
    isDev ? "ws://*.manus.computer" : "",
    isDev ? "wss://*.manus.computer" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const frameSrc = [
    self,
    "https://www.youtube.com",
    "https://youtube.com",
    // 시술 상세의 개인정보 보호 YouTube 임베드
    "https://www.youtube-nocookie.com",
    "https://challenges.cloudflare.com",
    // Google Maps iframe embed
    "https://maps.google.com",
    "https://www.google.com",
    "https://google.com",
  ].join(" ");

  const mediaSrc = [
    self,
    // 와일드카드로 모든 CloudFront 서브도메인 허용 (d2xsxph8kpxj0f, d36hbw14aib5lz 등)
    "https://*.cloudfront.net",
    "blob:",
  ].join(" ");

  const workerSrc = [
    self,
    "blob:",
  ].join(" ");

  const objectSrc = "'none'";
  const baseUri = self;
  const formAction = self;
  // [Step49-F] frame-ancestors: 프로덕션은 'self'만 허용, 개발은 Manus 미리보기 패널 허용
  const frameAncestors = isDev
    ? "'self' https://*.manus.computer https://*.manus.space https://*.manus.im https://manus.im"
    : "'self'";  // 프로덕션: 외부 iframe 삽입 완전 차단
  // upgrade-insecure-requests: HTTP 리소스를 HTTPS로 자동 업그레이드
  const upgradeInsecureRequests = "upgrade-insecure-requests";

  const directives = [
    `default-src ${self}`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `font-src ${fontSrc}`,
    `img-src ${imgSrc}`,
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
    `media-src ${mediaSrc}`,
    `worker-src ${workerSrc}`,
    `object-src ${objectSrc}`,
    `base-uri ${baseUri}`,
    `form-action ${formAction}`,
    `frame-ancestors ${frameAncestors}`,
    upgradeInsecureRequests,
  ];

  return directives.join("; ");
}

// 모듈 로드 시 CSP 문자열을 1회 계산해서 상수화 (요청마다 재빌드 방지)
const CSP_HEADER_DEV = buildCSP(true);
const CSP_HEADER_PROD = buildCSP(false);

export function securityHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isDev = process.env.NODE_ENV === "development";

  // Content-Security-Policy
  res.setHeader("Content-Security-Policy", isDev ? CSP_HEADER_DEV : CSP_HEADER_PROD);

  // X-Frame-Options: CSP frame-ancestors와 중복 설정 (구형 브라우저 호환)
  // SAMEORIGIN: 같은 출처에서의 iframe 허용 (Manus 미리보기 패널 대응)
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // X-Content-Type-Options: MIME 스니핑 방지
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Referrer-Policy: 외부 링크 클릭 시 referrer 정보 제한
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions-Policy: 불필요한 브라우저 기능 비활성화
  res.setHeader(
    "Permissions-Policy",
    [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "magnetometer=()",
      "accelerometer=()",
      "gyroscope=()",
    ].join(", ")
  );

  // [Step49-G] X-XSS-Protection: 구형 XSS 필터는 오히려 취약점을 만들므로 비활성화 (권장값 0)
  res.setHeader("X-XSS-Protection", "0");

  // Cross-Origin-Opener-Policy: 팝업 창 격리
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

  // Cross-Origin-Resource-Policy: 리소스 교차 출처 접근 제한
  // 'cross-origin'으로 설정: CDN 이미지 등 외부 접근 허용
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  // X-Powered-By 제거: Express 서버 정보 노출 방지
  res.removeHeader("X-Powered-By");

  next();
}

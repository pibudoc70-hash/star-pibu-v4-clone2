/**
 * redirects.ts
 *
 * 구 사이트(.htaccess)의 301 리다이렉트 규칙을 Express 서버 라우트로 구현.
 * Apache .htaccess 대신 Node.js(Express) 서버에서 처리한다.
 *
 * 원본: .htaccess (83개 Redirect 301 규칙)
 * 변환일: 2026-07-28
 *
 * 주의:
 *  - sub_03_24.html, sub_03_52.html은 원본에 중복 등장하나 동일 대상이므로 1개로 통합
 *  - sub_03_18.html → 인라이튼-3세대-루비피코 slug는 DB에 없어 홈(/)으로 임시 처리
 */

import type { Express } from "express";

/** 301 리다이렉트 맵: { [소스경로]: 대상URL } */
const REDIRECT_MAP: Record<string, string> = {
  // ── 언어 ──────────────────────────────────────────────────────────────────
  "/lang": "https://star-pibu.com",

  // ── 병원 소개 계열 (sub_01) ───────────────────────────────────────────────
  "/sub/sub_01_01.html": "https://star-pibu.com/about",
  "/sub/sub_01_02.html": "https://star-pibu.com/doctors",
  "/sub/sub_01_03.html": "https://star-pibu.com/about",
  "/sub/sub_01_04.html": "https://star-pibu.com/",
  "/sub/sub_01_05.html": "https://star-pibu.com/",
  "/sub/sub_01_06.html": "https://star-pibu.com/",

  // ── 시술 계열 (sub_02) ────────────────────────────────────────────────────
  "/sub/sub_02_01.html": "https://star-pibu.com/equipment3?tab=%EC%97%AC%EB%93%9C%EB%A6%84",
  "/sub/sub_02_02.html": "https://star-pibu.com/equipment3?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_02_03.html": "https://star-pibu.com/equipment3?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_02_04.html": "https://star-pibu.com/equipment3?tab=%ED%9D%89%ED%84%B0%C2%B7%EB%AA%A8%EA%B3%B5",
  "/sub/sub_02_05.html": "https://star-pibu.com/equipment3?tab=%ED%99%8D%EC%A1%B0%C2%B7%ED%98%88%EA%B4%80",
  "/sub/sub_02_06.html": "https://star-pibu.com/equipment3?tab=%EC%86%90%C2%B7%EB%B0%9C%ED%86%B1%EB%AC%B4%EC%A2%80",
  "/sub/sub_02_07.html": "https://star-pibu.com/equipment3?tab=%EB%B0%B1%EB%B0%98%EC%A6%9D",
  "/sub/sub_02_08.html": "https://star-pibu.com/equipment3/%EA%B3%A0%EB%B0%94%EC%95%BC%EC%8B%9C-%EC%A0%88%EC%97%B0%EC%B9%A8?tab=%EC%97%AC%EB%93%9C%EB%A6%84",
  "/sub/sub_02_09.html": "https://star-pibu.com/equipment3/%EA%B3%A0%EB%B0%94%EC%95%BC%EC%8B%9C-%EC%A0%88%EC%97%B0%EC%B9%A8?tab=%EC%97%AC%EB%93%9C%EB%A6%84",
  "/sub/sub_02_10.html": "https://star-pibu.com/equipment3?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_02_11.html": "https://star-pibu.com/equipment3?tab=%EB%88%88%EB%B0%91%EC%A7%80%EB%B0%A9%EC%9E%AC%EB%B0%B0%EC%B9%98",
  "/sub/sub_02_12.html": "https://star-pibu.com/equipment3/aptos?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_02_13.html": "https://star-pibu.com/equipment3?tab=%EC%86%90%C2%B7%EB%B0%9C%ED%86%B1%EB%AC%B4%EC%A2%80",
  "/sub/sub_02_14.html": "https://star-pibu.com/equipment3?tab=%EC%95%A1%EC%B7%A8%EC%A6%9D%C2%B7%EB%8B%A4%ED%95%9C%EC%A6%9D",
  "/sub/sub_02_15.html": "https://star-pibu.com/equipment3?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_02_17.html": "https://star-pibu.com/equipment3?tab=%EB%B0%B1%EB%B0%98%EC%A6%9D",
  "/sub/sub_02_18.html": "https://star-pibu.com/",

  // ── 장비 계열 (sub_03) ────────────────────────────────────────────────────
  "/sub/sub_03_01.html": "https://star-pibu.com/equipment3/3?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_03_02.html": "https://star-pibu.com/equipment3/3?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_03_03.html": "https://star-pibu.com/equipment3/v?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_03_04.html": "https://star-pibu.com/equipment3/pigment-?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_03_05.html": "https://star-pibu.com/",
  "/sub/sub_03_06.html": "https://star-pibu.com/equipment3/%EC%9A%B8%EC%8D%A8%EB%9D%BC%ED%94%BC-%ED%94%84%EB%9D%BC%EC%9E%84?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_07.html": "https://star-pibu.com/equipment3/%EC%8D%A8%EB%A7%88%EC%A7%80-flx?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_08.html": "https://star-pibu.com/equipment3/%EB%89%B4-%EC%9A%B8%ED%8A%B8%EB%9D%BC-%ED%8E%84%EC%8A%A4-%EC%95%99%EC%BD%94%EB%A5%B4-%EC%8A%A4%EC%B9%B4-fx?tab=%ED%9D%89%ED%84%B0%C2%B7%EB%AA%A8%EA%B3%B5",
  "/sub/sub_03_09.html": "https://star-pibu.com/",
  "/sub/sub_03_10.html": "https://star-pibu.com/",
  "/sub/sub_03_11.html": "https://star-pibu.com/equipment3?tab=%EC%86%90%C2%B7%EB%B0%9C%ED%86%B1%EB%AC%B4%EC%A2%80",
  "/sub/sub_03_12.html": "https://star-pibu.com/",
  "/sub/sub_03_13.html": "https://star-pibu.com/equipment3/%EC%B9%B4%ED%94%84%EB%A6%AC?tab=%EC%97%AC%EB%93%9C%EB%A6%84",
  "/sub/sub_03_14.html": "https://star-pibu.com/equipment3/%EB%B2%A8%EB%A1%9C%EC%8B%9C%ED%8B%B0-%EC%97%91%EC%8B%9C%EB%A8%B8-v7-2?tab=%EA%B1%B4%EC%84%A0%C2%B7%EC%95%84%ED%86%A0%ED%94%BC",
  "/sub/sub_03_15.html": "https://star-pibu.com/equipment3/%EC%8B%9C%EB%84%88%EC%A7%80?tab=%ED%99%8D%EC%A1%B0%C2%B7%ED%98%88%EA%B4%80",
  "/sub/sub_03_16.html": "https://star-pibu.com/equipment3/%EB%84%A4%EC%98%A4%EC%A0%A0-%ED%94%8C%EB%9D%BC%EC%A6%88%EB%A7%88?tab=%EC%97%AC%EB%93%9C%EB%A6%84",
  "/sub/sub_03_17.html": "https://star-pibu.com/equipment3/%ED%94%84%EB%A1%9C%ED%8C%8C%EC%9A%B4%EB%93%9C?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  // sub_03_18: 인라이튼-3세대-루비피코 slug가 DB에 없어 홈으로 임시 처리
  "/sub/sub_03_18.html": "https://star-pibu.com/equipment3/%EC%9D%B8%EB%9D%BC%EC%9D%B4%ED%8A%BC-3%EC%84%B8%EB%8C%80-%EB%A3%A8%EB%B9%84%ED%94%BC%EC%BD%94",
  "/sub/sub_03_19.html": "https://star-pibu.com/equipment3/%EC%8A%88%EB%A7%81%ED%81%AC-%EC%9C%A0%EB%8B%88%EB%B2%84%EC%8A%A4?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_20.html": "https://star-pibu.com/",
  "/sub/sub_03_21.html": "https://star-pibu.com/equipment3/%EC%98%A4%EB%8B%88%EC%BD%94?tab=%EC%86%90%C2%B7%EB%B0%9C%ED%86%B1%EB%AC%B4%EC%A2%80",
  "/sub/sub_03_22.html": "https://star-pibu.com/",
  "/sub/sub_03_23.html": "https://star-pibu.com/equipment3/%ED%94%8C%EB%9D%BC%EB%93%80%EC%98%A4?tab=%EC%97%AC%EB%93%9C%EB%A6%84",
  "/sub/sub_03_24.html": "https://star-pibu.com/equipment3/%EC%8D%A8%EB%A7%88%EC%A7%80-flx?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_25.html": "https://star-pibu.com/equipment3/%ED%8E%9C%ED%86%A0-9900-2?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_03_26.html": "https://star-pibu.com/equipment3/v?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_03_27.html": "https://star-pibu.com/equipment3/%ED%9E%90%EB%9F%AC-1064?tab=%EC%86%90%C2%B7%EB%B0%9C%ED%86%B1%EB%AC%B4%EC%A2%80",
  "/sub/sub_03_28.html": "https://star-pibu.com/",
  "/sub/sub_03_29.html": "https://star-pibu.com/equipment3/acne-?tab=%EC%95%A1%EC%B7%A8%EC%A6%9D%C2%B7%EB%8B%A4%ED%95%9C%EC%A6%9D",
  "/sub/sub_03_30.html": "https://star-pibu.com/equipment3/maqx?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_03_31.html": "https://star-pibu.com/",
  "/sub/sub_03_32.html": "https://star-pibu.com/equipment3/%EC%A5%B4-%ED%94%84%EB%A1%9C%ED%94%84%EB%9D%BD%EC%85%94%EB%84%90?tab=%ED%9D%89%ED%84%B0%C2%B7%EB%AA%A8%EA%B3%B5",
  "/sub/sub_03_33.html": "https://star-pibu.com/equipment3/%ED%94%8C%EB%9E%98%ED%8B%B0%EB%84%98-ptt?tab=%EC%97%AC%EB%93%9C%EB%A6%84",
  "/sub/sub_03_34.html": "https://star-pibu.com/equipment3/%EC%97%91%EC%85%80-%ED%86%A0%EC%9A%B0?tab=%EC%86%90%C2%B7%EB%B0%9C%ED%86%B1%EB%AC%B4%EC%A2%80",
  "/sub/sub_03_35.html": "https://star-pibu.com/",
  "/sub/sub_03_36.html": "https://star-pibu.com/equipment3/%ED%85%90%EC%8E%84%EB%9D%BC?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_37.html": "https://star-pibu.com/equipment3/%EC%8A%88%EB%A7%81%ED%81%AC-%EC%9C%A0%EB%8B%88%EB%B2%84%EC%8A%A4?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_38.html": "https://star-pibu.com/equipment3/scar-?tab=%ED%9D%89%ED%84%B0%C2%B7%EB%AA%A8%EA%B3%B5",
  "/sub/sub_03_39.html": "https://star-pibu.com/",
  "/sub/sub_03_40.html": "https://star-pibu.com/equipment3/%ED%85%90%EC%8D%A8%EB%A7%88?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_41.html": "https://star-pibu.com/equipment3/%EB%AA%A8%EB%9E%98%EC%95%8C-%ED%94%BC%EB%B6%80%EC%9D%B4%EC%8B%9D?tab=%ED%9D%89%ED%84%B0%C2%B7%EB%AA%A8%EA%B3%B5",
  "/sub/sub_03_42.html": "https://star-pibu.com/equipment3/%EC%98%A8%EB%8B%A4?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_43.html": "https://star-pibu.com/equipment3/%EB%B2%84%EC%B8%84rf?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_44.html": "https://star-pibu.com/equipment3/%ED%8A%B8%EB%A6%AC%EB%8B%88%ED%8B%B0-%EB%A6%AC%ED%94%84%ED%86%A0%EB%8B%9D?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_45.html": "https://star-pibu.com/",
  "/sub/sub_03_46.html": "https://star-pibu.com/",
  "/sub/sub_03_47.html": "https://star-pibu.com/equipment3/%ED%8A%B8%EB%A6%AC%ED%95%84-%ED%94%84%EB%A1%9C?tab=%ED%9D%89%ED%84%B0%C2%B7%EB%AA%A8%EA%B3%B5",
  "/sub/sub_03_48.html": "https://star-pibu.com/equipment3/%EC%95%84%EB%93%9C%EB%B0%94-tx?tab=%ED%99%8D%EC%A1%B0%C2%B7%ED%98%88%EA%B4%80",
  "/sub/sub_03_49.html": "https://star-pibu.com/",
  "/sub/sub_03_50.html": "https://star-pibu.com/equipment3/%EB%9D%BC%EC%85%88%EB%93%9C-%EC%9A%B8%ED%8A%B8%EB%9D%BC?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_03_51.html": "https://star-pibu.com/equipment3/%EC%95%84%EB%B9%84%ED%81%B4%EB%A6%AC%EC%96%B4?tab=%EC%97%AC%EB%93%9C%EB%A6%84",
  "/sub/sub_03_52.html": "https://star-pibu.com/equipment3/%EC%9A%B8%EC%8D%A8%EB%9D%BC%ED%94%BC-%ED%94%84%EB%9D%BC%EC%9E%84?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_53.html": "https://star-pibu.com/equipment3/%ED%81%90%EC%96%B4%EB%A7%A5%EC%8A%A4?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
  "/sub/sub_03_54.html": "https://star-pibu.com/",
  "/sub/sub_03_55.html": "https://star-pibu.com/equipment3/%EC%84%B8%EB%A5%B4%ED%94%84?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5",
  "/sub/sub_03_56.html": "https://star-pibu.com/equipment3/%EB%9F%B0%EC%B9%98%ED%83%80%EC%9E%84-%EB%88%88%EB%B0%91%EB%A0%88%EC%9D%B4%EC%A0%80?tab=%EB%88%88%EB%B0%91%EC%A7%80%EB%B0%A9%EC%9E%AC%EB%B0%B0%EC%B9%98",
  "/sub/sub_03_57.html": "https://star-pibu.com/",
};

/**
 * Express 앱에 301 리다이렉트 라우트를 등록한다.
 * 반드시 다른 라우트보다 먼저 등록해야 한다.
 */
export function registerRedirects(app: Express): void {
  for (const [src, dst] of Object.entries(REDIRECT_MAP)) {
    app.get(src, (_req, res) => {
      res.redirect(301, dst);
    });
  }
}

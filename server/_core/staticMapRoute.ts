/**
 * server/_core/staticMapRoute.ts
 *
 * [Step67-B] GET /api/staticmap.png — 지도 바이너리 직접 전송.
 *
 * base64 tRPC 방식 대비 이점:
 *   - 전송량 -25% (base64 인코딩 오버헤드 제거)
 *   - 브라우저 캐시 + Cloudflare CDN 캐시 가능 (immutable)
 *   - ETag 기반 304 지원 → 재방문자 0바이트 전송
 *   - tRPC JSON 파싱 없이 이미지 즉시 렌더링
 *
 * 보안:
 *   - 좌표는 서버 상수만 사용 (SSRF·쿼터 남용 방지)
 *   - 화이트리스트 외 조합은 400 반환 (기본값 대체 금지 — 캐시 오염 방지)
 *   - API 키는 응답·에러 메시지에 절대 포함되지 않음
 */

import type { Express, Request, Response } from "express";
import { fetchStaticMap, ALLOWED_MAP_W, ALLOWED_MAP_H, ALLOWED_MAP_S } from "./mapCache";

export function registerStaticMapRoute(app: Express): void {
  app.get("/api/staticmap.png", async (req: Request, res: Response) => {
    // 1) 쿼리 파싱
    const w = Number(req.query.w);
    const h = Number(req.query.h);
    const s = Number(req.query.s);

    // 2) 화이트리스트 검증 — Number 변환 실패(NaN), 미지정, 허용 외 값 모두 400
    const wOk = (ALLOWED_MAP_W as readonly number[]).includes(w);
    const hOk = (ALLOWED_MAP_H as readonly number[]).includes(h);
    const sOk = (ALLOWED_MAP_S as readonly number[]).includes(s);

    if (!wOk || !hOk || !sOk) {
      res.status(400).json({ error: "Invalid map dimensions" });
      return;
    }

    // 3) fetchStaticMap 호출 (캐시 우선)
    const cached = await fetchStaticMap(w, h, s);

    // 4) 실패 시 502
    if (!cached) {
      res.setHeader("Cache-Control", "no-store");
      res.status(502).json({ error: "Map unavailable" });
      return;
    }

    // 6) ETag 기반 304 (본문 없이)
    const clientEtag = req.headers["if-none-match"];
    if (clientEtag === cached.etag) {
      res.status(304).end();
      return;
    }

    // 5) 성공 시 헤더 + 바이너리 전송
    res.setHeader("Content-Type", cached.contentType);
    res.setHeader("Content-Length", cached.buffer.byteLength);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("ETag", cached.etag);
    res.setHeader("X-Content-Type-Options", "nosniff");

    // 7) 바이너리 전송 (base64 변환 금지)
    res.end(cached.buffer);
  });
}

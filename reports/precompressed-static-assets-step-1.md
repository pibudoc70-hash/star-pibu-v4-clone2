# STEP 1 — JS·CSS 사전 Brotli 압축

## 선택 근거

사전 생성된 압축 파일을 런타임 재압축 없이 협상해 제공하는 검증된 Express 미들웨어 `express-static-gzip`을 사용한다. 이 라이브러리는 `.br` 파일을 `enableBrotli` 옵션으로 인식하고, `orderPreference: ["br"]`로 Brotli 지원 클라이언트를 우선 처리하며, 압축 파일이 없거나 브라우저가 해당 인코딩을 지원하지 않을 때 원본 파일 경로로 fallback한다. 라이브러리는 시작 시 압축 파일을 탐색하므로 Vite build 직후 사전 압축을 완료하는 순서가 필요하다.

> Source: [tkoenig89/express-static-gzip README](https://github.com/tkoenig89/express-static-gzip) (accessed 2026-09-05). The project describes pre-gzipped and Brotli static-file delivery, `enableBrotli`, `orderPreference`, and fallback behavior.

## 적용 범위

빌드 단계는 `dist/public/assets`의 해시된 `.js`와 `.css`에만 `.br` 변형을 생성한다. 정적 서버는 원본 확장자를 기준으로 MIME 및 90일 immutable cache policy를 유지하며, precompressed response에는 `Vary: Accept-Encoding`을 설정한다. Brotli 미지원 클라이언트는 기존 global compression middleware의 gzip 또는 identity 경로를 계속 사용한다.

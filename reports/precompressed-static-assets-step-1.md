# STEP 1 — JS·CSS 사전 Brotli 압축

## 선택 근거

사전 생성된 압축 파일을 런타임 재압축 없이 협상해 제공하는 검증된 Express 미들웨어 `express-static-gzip`을 사용한다. 이 라이브러리는 `.br` 파일을 `enableBrotli` 옵션으로 인식하고, `orderPreference: ["br"]`로 Brotli 지원 클라이언트를 우선 처리하며, 압축 파일이 없거나 브라우저가 해당 인코딩을 지원하지 않을 때 원본 파일 경로로 fallback한다. 라이브러리는 시작 시 압축 파일을 탐색하므로 Vite build 직후 사전 압축을 완료하는 순서가 필요하다.

> Source: [tkoenig89/express-static-gzip README](https://github.com/tkoenig89/express-static-gzip) (accessed 2026-09-05). The project describes pre-gzipped and Brotli static-file delivery, `enableBrotli`, `orderPreference`, and fallback behavior.

## 적용 범위

빌드 단계는 `dist/public/assets`의 해시된 `.js`와 `.css`에만 `.br` 변형을 생성한다. 정적 서버는 원본 확장자를 기준으로 MIME 및 90일 immutable cache policy를 유지하며, precompressed response에는 `Vary: Accept-Encoding`을 설정한다. Brotli 미지원 클라이언트는 기존 global compression middleware의 gzip 또는 identity 경로를 계속 사용한다.

## 로컬 협상 검증

`pnpm build`에서 JS·CSS 427개, 총 16,652,744B를 3,309,299B의 `.br` 변형으로 생성했다. 로컬 production server에서 `vendor-react-CLvukNXW.js`는 Brotli 요청에 `200`, `Content-Encoding: br`, `Content-Type: text/javascript; charset=utf-8`, `Vary: Accept-Encoding`, `Cache-Control: public, max-age=7776000, immutable`, 104,429B로 응답했다. 같은 파일은 gzip 116,849B, identity 395,685B로 각각 정상 fallback했다. CSS도 같은 협상·MIME·90일 cache contract를 충족했고, Brotli 44,716B, gzip 52,832B, identity 320,792B였다.

## 운영 검증 및 보류

2026-09-05 배포 후 `star-pibu.com`의 최신 JS·CSS에 `Accept-Encoding: br`를 3회씩 전송했다. 모두 200이지만 `Content-Encoding`과 `Vary`가 사라지고 identity 본문 크기로 응답했다. gzip 요청은 기존 gzip 본문으로 정상 응답했다. 운영 응답에는 `x-manus-proxy-mode: transparent-assets/1`, `server: cloudflare`가 함께 있어, 앱 서버가 설정한 Brotli 협상 헤더가 배포 프록시에서 제거되는 상태임을 확인했다.

| 자산 | 요청 인코딩 | 로컬 전송량 | 운영 전송량 | 운영 결과 |
|---|---:|---:|---:|---|
| `vendor-react-CLvukNXW.js` | br | 104,429B | 386,207B | identity로 대체, `Vary` 누락 |
| `vendor-react-CLvukNXW.js` | gzip | 116,849B | 126,346B | 정상 gzip |
| `index-BjwQvHWy.css` | br | 44,716B | 320,792B | identity로 대체, `Vary` 누락 |
| `index-BjwQvHWy.css` | gzip | 52,832B | 52,291B | 정상 gzip |

핵심 경로 `/`, `/en`, `/ja`, `/zh`, `/zh-tw`, `/doctors`, `/equipment3`, `/treatments/ulthera-prime`, `/notice`는 모두 200을 반환했다. 프로젝트가 제어하는 빌드·원본 정적 서버 단계는 완료됐지만, 운영 Brotli 전달은 `transparent-assets/1` 계층이 `Content-Encoding: br` 및 `Vary`를 보존하도록 플랫폼 측 조정이 필요하다. 이 보류 상태에서는 추가 소스 변경이 효과가 없으므로 적용하지 않는다.

# STEP 1 — 앱 제어 정적 경로 Brotli 운영 재검증

## 결론

플랫폼의 `/assets/*` 투명 프록시는 `br` 및 `Vary`를 제거했지만, production Vite base를 `/__static/`로 옮기고 앱의 사전압축 정적 미들웨어를 이 경로에 우선 마운트한 뒤에는 **공개 `star-pibu.com`에서 Brotli 협상이 확인**되었다. 압축은 빌드 후 JS/CSS에만 수행되며 런타임 압축은 추가하지 않았다.

| 검증 항목 | 운영 관측값 |
|---|---|
| 검증 URL | `/__static/assets/index-CroNMASE.js` |
| `Accept-Encoding: br` | 200, `Content-Encoding: br`, `Content-Type: text/javascript; charset=utf-8`, `Vary: Accept-Encoding`, 105,969B |
| `Accept-Encoding: gzip` | 200, `Content-Encoding: gzip`, 원본 JS MIME, `Vary: Accept-Encoding` |
| `Accept-Encoding: identity` | 200, 원본 JS MIME, `Vary: Accept-Encoding`, encoding 없음 |
| 캐시 | `Cache-Control: public, max-age=7776000`가 운영 프록시에서 유지됨. origin은 immutable도 설정함. |
| 프록시 표식 | `x-manus-proxy-mode: transparent/1`; `/__static`에서는 브라우저 협상 헤더가 보존됨 |

최종 배포 후 같은 br 요청도 200·105,969B와 동일한 headers로 재확인했다. 이 작업은 전송 encoding만 바로잡았으며 HTML CDN 캐시 정책은 변경하지 않았다.

## 로컬 최종 빌드 확인

최종 build는 JS/CSS 427개에 `.br` 파일을 만들었고, 총 원본 16,652,758B를 3,309,494B로 사전압축했다. 로컬 production 서버는 `/__static/assets/*`에 대해 br·gzip·identity 모두 200을 반환하고, 원본 확장자 MIME, `Vary: Accept-Encoding`, `public, max-age=7776000, immutable`을 유지했다. 홈 초기 HTML은 `/__static/assets/*` URL을 사용하며 5개 초기 JS asset의 gzip 합계는 318,773B로 332,800B 예산 아래다.

## 회귀 방지

`PrecompressedAssetsPath.test.ts`, `vite.precompressedStatic.test.ts`, `check-home-initial-budget.test.ts`가 production `/__static/` base, development `/` base, br 협상과 legacy/new asset URL budget 파싱을 보호한다. 본 단계는 예약, OTP, 외부 예약, locale route, 의료 문구 및 데스크톱 레이아웃을 변경하지 않았다.

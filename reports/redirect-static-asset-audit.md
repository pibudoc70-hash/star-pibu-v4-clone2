# 구 경로 리다이렉트·정적 자산 보호 검증 보고서

## 범위와 진단

`server/redirects.ts`의 구 도메인·구 경로 처리 순서와 정적 자산 제공 경로를 점검했습니다. `/manus-storage`, `/assets`, `/__static`은 기존 broad legacy 경로군에 직접 포함되지는 않았지만, `/sub/images/banner.webp`, `/cha/media/hero.jpg`처럼 **구 디렉터리 아래에 있는 확장자 파일**은 broad `/sub`·`/cha`·게시판·구 locale fallback에 먼저 매칭되어 홈페이지로 `301` 이동할 수 있었습니다. DNS 연결 시 `m.star-pibu.co.kr`의 전 경로 301도 동일한 위험이 있었습니다.

## 적용한 최소 보호

`isStaticAssetPath()`로 다음 경로를 정적 자산으로 우선 식별했습니다.

| 분류 | 제외 대상 |
|---|---|
| 정적 경로 | `/manus-storage`, `/assets`, `/__static` 및 하위 경로 |
| 이미지·문서 | `avif`, `bmp`, `gif`, `ico`, `jpg/jpeg`, `png`, `svg`, `webp`, `pdf` |
| 프론트엔드·폰트 | `css`, `js/mjs`, `map`, `eot`, `otf`, `ttf`, `woff/woff2` |
| 미디어 | `mp3`, `mp4`, `m4v`, `mov`, `ogg/ogv`, `wav`, `webm` |

이 보호 조건은 실제 리다이렉트를 수행하는 `m.star-pibu.co.kr` 미들웨어와 broad legacy fallback의 첫 조건으로 적용했습니다. 명시적 HTML 목적지는 변경하지 않았습니다. 따라서 Cafe24의 `/event/ulthera/index.html`·`/event/thermage/index.html`, 구 게시판 `/sub/sub_04_01.html`~`03.html`의 `zzboard` 301, 기존 상세 `REDIRECT_MAP`은 계속 기존 순서와 목적지를 사용합니다. 현재 운영 경로인 `/about`, `/equipment3`, `/en`, `/zh`, `/zh-tw`도 변경하지 않았습니다.

## 리다이렉트 검증

정적 자산 회귀 테스트와 실제 로컬 HTTP 검증을 수행했습니다.

| 확인 항목 | 결과 |
|---|---|
| 정적 자산 판별 및 legacy/m-host 무리다이렉트 | focused HTTP 테스트 **60/60 통과** |
| `/sub/images/banner.webp`, `/cha/media/hero.jpg`, `/board/attachment.png`, `/en/sub/old-script.js` | 모두 `301` 및 `Location` 헤더 없음 |
| `m.star-pibu.co.kr` + legacy WebP 경로 | `301` 및 `Location` 헤더 없음 |
| `/cha/sub/sub_04_01`, `/jpn/sub/sub_04_01` | `301 https://star-pibu.com/` 유지 |
| `/event/ulthera/index.html` | `301 https://starpibuclinic.cafe24.com/event/ulthera/index.html` 유지 |
| `/sub/sub_04_01.html` | `301 http://www.star-pibu.co.kr/zzboard` 유지 |
| `/about`, `/equipment3`, `/en`, `/zh`, `/zh-tw` | 로컬에서 비리다이렉트 `200` 유지 |

개발 서버에서 의도적으로 존재하지 않는 legacy 예시 자산 경로는 SPA fallback 때문에 `200 text/html`로 응답했습니다. 이는 홈페이지 `301` 전환이 제거되었음을 확인하는 결과이며, 실제 존재하는 정적 파일은 이후 정적 미들웨어가 처리합니다.

## 대표 이미지 HTTP 검증

화면 캡처 서비스가 동작하지 않아, 사용자 승인 범위에 따라 실제 이미지 URL의 HTTP 상태와 MIME 타입으로 확인했습니다.

| 화면 영역 | 확인 대상 | 응답 |
|---|---|---|
| 홈 | Hero 배경 WebP | `200 image/webp` |
| Doctors | 의료진 사진 WebP | `200 image/webp` |
| 울쎄라피 프라임 | 피부 깊이 일러스트 PNG | `200 image/png` |
| 울쎄라피 프라임 | 원본 인포그래픽 WebP | `200 image/webp` |
| SPECIAL EVENT | 메타셀 썸네일 WebP | `200 image/webp` |
| SPECIAL EVENT | 울쎄라피 프라임 외부 CloudFront WebP | `200 application/octet-stream` |
| SPECIAL EVENT | 써마지 FLX 외부 CloudFront WebP | `200 application/octet-stream` |

울쎄라피 프라임과 써마지 FLX의 두 외부 썸네일은 HTTP `200`이지만 CloudFront 객체의 MIME 메타데이터가 `application/octet-stream`입니다. 이는 이번 앱 리다이렉트와 별개의 기존 외부 저장소 설정 문제이며, 데이터·URL 변경은 승인 범위 밖이므로 수정하지 않았습니다. 자동 화면 캡처와 추가 로컬 Chromium DOM 캡처도 완료되지 않아, 시각적 정상 표시 자체는 주장하지 않습니다.

## 품질 게이트 및 운영 유의사항

`pnpm check`, focused 테스트 60건, 전체 Vitest **257개 파일·2,128개 테스트**, ESLint **오류 0건**(기존 경고 109건), production build가 모두 통과했습니다. 이전 배포에서 새 리다이렉트의 공개 도메인 반영이 지연된 이력이 있으므로, 새 배포 후에는 캐시 우회 요청으로 공개 도메인의 301과 `/manus-storage` 이미지 응답을 한 번 더 확인해야 합니다.

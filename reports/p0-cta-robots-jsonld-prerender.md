# P0 CTA·robots·JSON-LD·prerender 기록

이 문서는 첨부된 P0 요청을 1→4 순서로 최소 범위 적용 또는 보류한 결과를 기록한다. Header·Hero·Footer, 예약·OTP, 운영 DB, 외부 CTA의 기존 목적지와 색상, URL 계약, 시술·FAQ 본문, 폰트·Brotli·CSS Coverage는 변경 대상에서 제외했다.

## 1. TreatmentPage WeChat CTA

| 항목 | 결과 |
|---|---|
| 상태 | 적용 |
| 변경 파일 | `client/src/pages/TreatmentPage.tsx`, `client/src/pages/TreatmentPage.wechatCta.test.ts` |
| zh | `微信和误` → `微信咨询`, `#wechat` 유지 |
| zh-TW | `微信談詢` → `微信諮詢`, 카카오 fallback → `#wechat` |
| target/rel | zh의 기존 in-page 동작과 동일하게 zh-TW에도 미설정 |
| 동결 준수 | ja LINE·ko/en Kakao·전화·NAVER CTA의 목적지·색상·아이콘 미변경 |

`TreatmentPage.wechatCta.test.ts`, TypeScript를 통과했고 lint는 신규 오류 없이 기존 경고 106건만 보고했다. 독립 체크포인트에 저장한다.

## 2. Googlebot robots 규칙

| 항목 | 결과 |
|---|---|
| 상태 | 적용 |
| 변경 파일 | `client/public/robots.txt`, `client/public/robots.googlebot.test.ts` |
| Googlebot 규칙 | `Allow: /` 유지, `/api/`·`/admin/`·`/api/trpc/`만 명시적 Disallow |
| 동결 준수 | `*`, Yeti, Bingbot, AI crawler 그룹·Sitemap·Crawl-delay·공개 경로 변경 없음 |

`robots.googlebot.test.ts`, TypeScript, production build를 통과했다. 빌드 출력 `dist/public/robots.txt`에서도 동일한 3개 Disallow를 확인했으며 lint는 신규 오류 없이 기존 경고 106건만 보고했다.

## 3. TreatmentPage JSON-LD 사실성

| 항목 | 결과 |
|---|---|
| 상태 | 적용 |
| 변경 파일 | `client/src/pages/TreatmentPage.tsx`, `server/_core/treatmentPrerender.ts`, `server/_core/treatmentJsonLd.parity.test.ts` |
| provider | client·prerender 모두 `https://star-pibu.com/#organization` 단일 `@id` 참조 |
| followup | locale별 recovery와 caution만 빈 값 없이 조합, 한국어 접두어 삭제 |
| image | client root-relative image를 절대 URL로 변환, prerender와 정합 |
| 제외 | `status` 제거, SeoHead clinic schema·breadcrumb item 2·FAQ/Event schema·media 변경 없음 |

focused parity test, TypeScript를 통과했다. production build를 별도 포트에서 실행해 `/zh/treatments/ulthera` raw HTML을 확인한 결과, MedicalProcedure의 provider는 organization `@id`만 보유했고 invalid status·`회복 기간:` 접두어·root-relative image는 없었다. lint는 신규 오류 없이 기존 경고 106건만 보고했다.

## 4. prerender 본문 로딩 문구

| 항목 | 결과 |
|---|---|
| 상태 | 적용 |
| 변경 파일 | `server/_core/seoMeta.ts`, `server/_core/seoMeta.test.ts` |
| 읽기 전용 public 조사 | `/`, `/en`, `/ja`, `/zh`, `/zh-tw`, `/zh/treatments/ulthera` 모두 한국어 초기 로딩 label 포함 |
| 원인 | `client/index.html`의 초기 loading shell이 모든 public prerender가 공유하는 `injectPageSeoMeta`를 통과 |
| 보정 | 기존 i18n의 `Loading...`·`読み込み中...`·`加载中...`·`載入中...` 값을 raw HTML에 치환 |
| 링크·전화 | locale별 `/equipment3` discovery link와 국제 전화 `tel:`은 이미 raw home HTML에 있어 추가하지 않음 |
| 동결 준수 | 시술·장비 실데이터, DB, route, discovery UI, CTA 목적지, prerender 구조 변경 없음 |

`seoMeta.test.ts`, TypeScript, production build를 통과했다. 별도 production 서버에서 지정한 6개 raw route를 재검증한 결과, 한국어 label은 `/`에만 남고 `/en`·`/ja`·`/zh`·`/zh-tw`·`/zh/treatments/ulthera`는 각각 기존 locale loading label을 사용한다. lint는 신규 오류 없이 기존 경고 106건만 보고했다.

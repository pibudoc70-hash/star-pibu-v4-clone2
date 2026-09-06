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

진행 전.

## 3. TreatmentPage JSON-LD 사실성

진행 전.

## 4. prerender 본문 로딩 문구

진행 전.

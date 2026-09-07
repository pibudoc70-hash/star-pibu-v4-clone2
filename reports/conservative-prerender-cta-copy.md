# 보수적 CTA·prerender·중국어 잔문 재감사

## 공통 동결 준수

이번 감사는 최신 작업 공간과 공개 raw HTML만 대상으로 합니다. Header, Hero, Footer, 예약·OTP·운영 DB, 외부 CTA 목적지·색상, URL 구조, 의료 본문, 이벤트 행, 팝업, 폰트, Brotli, CSS Coverage, 분석 태그와 새 의존성은 변경하지 않습니다.

## 1. 시술 상세 WeChat CTA — 중단

최신 `TreatmentPage.tsx`를 재감사한 결과, 중국어 간체의 라벨은 **`微信咨询`**, 중국어 번체의 라벨은 **`微信諮詢`**으로 이미 정확합니다. 두 locale 모두 상담 링크는 **`#wechat`**이며, 일본어 LINE·한국어/영어 KakaoTalk·전화·네이버 예약 분기는 변경되지 않았습니다.

따라서 이 항목은 코드 변경 없이 중단했습니다. 기존 `TreatmentPage.wechatCta.test.ts`는 2개 테스트를 통과했고 TypeScript는 통과했으며 lint는 신규 오류 없이 기존 경고 106건만 보고했습니다.

## 2. prerender 로딩 셸 — 조사 예정

다음 단계에서 `/`, `/en`, `/ja`, `/zh`, `/zh-tw`, `/zh/treatments/ulthera`의 공개 raw HTML을 읽기 전용으로 대조합니다.

## 3. 중국어 시술 prerender 한국어 잔문 — 조사 예정

2번 raw HTML 조사 결과를 바탕으로, 중국어 시술 본문에 실제 한국어 잔문이 남아 있을 경우에만 기존 zh 필드 사용 또는 생략 원칙을 적용합니다.

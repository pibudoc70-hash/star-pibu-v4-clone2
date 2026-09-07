# 보수적 CTA·prerender·중국어 잔문 재감사

## 공통 동결 준수

이번 감사는 최신 작업 공간과 공개 raw HTML만 대상으로 합니다. Header, Hero, Footer, 예약·OTP·운영 DB, 외부 CTA 목적지·색상, URL 구조, 의료 본문, 이벤트 행, 팝업, 폰트, Brotli, CSS Coverage, 분석 태그와 새 의존성은 변경하지 않습니다.

## 1. 시술 상세 WeChat CTA — 중단

최신 `TreatmentPage.tsx`를 재감사한 결과, 중국어 간체의 라벨은 **`微信咨询`**, 중국어 번체의 라벨은 **`微信諮詢`**으로 이미 정확합니다. 두 locale 모두 상담 링크는 **`#wechat`**이며, 일본어 LINE·한국어/영어 KakaoTalk·전화·네이버 예약 분기는 변경되지 않았습니다.

따라서 이 항목은 코드 변경 없이 중단했습니다. 기존 `TreatmentPage.wechatCta.test.ts`는 2개 테스트를 통과했고 TypeScript는 통과했으며 lint는 신규 오류 없이 기존 경고 106건만 보고했습니다.

## 2. prerender 로딩 셸 — 최소 보정 적용

공개 raw HTML을 읽기 전용으로 대조했습니다. `/`, `/en`, `/ja`, `/zh`, `/zh-tw`에는 기존 locale별 초기 로딩 문구와 함께 동일 문서 내 crawler discovery 본문이 이미 주입되어 있었고, 각 홈 본문에는 locale별 `/equipment3` 링크, 전화 링크, 기존 KakaoTalk 링크가 있었습니다. 따라서 홈 raw에서는 초기 로딩 셸이 crawler 본문에 중복되는 상태였습니다.

`homePrerender`에서 **crawler discovery 본문을 주입하는 홈 locale 경로에 한정**해 초기 로딩 셸을 제거했습니다. 클라이언트 템플릿·새 UI·새 API·새 카피·discovery 카드·CTA 디자인은 추가하지 않았습니다. `/zh/treatments/ulthera`에는 홈 discovery 본문이 없고 기존 locale 로딩 문구만 있으므로 이 규칙을 적용하지 않았습니다.

홈 raw에는 기존 KakaoTalk URL이 이미 존재했으므로 전화 옆에 새 링크를 추가하지 않았습니다. focused home prerender/SEO tests 31개, TypeScript와 lint 신규 오류 0건을 확인했습니다.

## 3. 중국어 시술 prerender 한국어 잔문 — 최소 보정 적용

공개 `/zh/treatments/ulthera` raw HTML의 crawler 본문에서 `适合人群` 행 뒤에 한국어 문장이 붙어 있는 것을 확인했습니다. 원인은 기존 zh 효과 필드를 가져온 뒤 모든 locale에 한국어 적합성 문장을 덧붙이던 prerender formatter였습니다.

중국어 경로에서는 **기존 `effect.zh` 값만** 사용하도록 제한했습니다. `effect.zh`가 비어 있으면 그 행은 빈 값으로 필터링되어 생략되며, 새 중국어 문구나 의료 수치·FAQ·영문 슬로건은 만들지 않습니다. 로컬 production raw 검증에서 해당 한국어 잔문은 0건이고 기존 zh 효과 값과 `crawler-content`는 각각 1건으로 유지됐습니다.

focused tests 4개, TypeScript와 lint 신규 오류 0건을 확인했습니다. 헤드 주석·기관 주소 같은 동결 대상이나 다른 locale의 본문은 이번 규칙에서 변경하지 않았습니다.

## 종합 검증 및 공개 전파 상태

세 항목을 합친 최종 품질 게이트에서 Vitest **241 files / 2,034 tests**, TypeScript, production build와 build-time Brotli 생성이 통과했습니다. lint는 신규 오류 없이 기존 경고 106건만 보고했습니다.

각 변경은 독립 체크포인트로 저장했습니다. 다만 마지막 공개 raw 확인 시점에는 `star-pibu.com`, `starpibu-qdq7tysk.manus.space`, `www.star-pibu.co.kr` 세 도메인이 모두 이전 홈 로딩 셸과 이전 중국어 잔문을 반환했습니다. 로컬 production raw에서는 두 변경이 확인됐지만, 공개 전파를 성공으로 주장하지 않습니다. 운영 배포 전파가 완료된 뒤에는 `/zh`의 `initial-loading` 0건과 `/zh/treatments/ulthera`의 대상 한국어 잔문 0건을 다시 확인해야 합니다.

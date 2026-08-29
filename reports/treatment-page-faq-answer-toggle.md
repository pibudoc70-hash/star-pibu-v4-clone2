# 모바일 다국어 FAQ 답변 더보기 제어

## 적용 결과

canonical 시술 상세 `/treatments/:slug`의 FAQ 답변에 모바일 전용 더보기·접기 control을 적용했습니다. answer 문자열 길이나 locale을 기준으로 추측하지 않고, 실제 390px 계열 viewport에서 4줄 높이를 초과한 답변에만 native button을 표시합니다. 이를 통해 짧은 답변은 기존처럼 즉시 전문이 보이고, 긴 다국어 답변만 compact 상태로 시작합니다.

| 상태 | 표시 방식 | 접근성 계약 |
|---|---|---|
| desktop 또는 4줄 이하 | 답변 전문 표시, control 숨김 | 기존 FAQ 문장·순서·semantic text 유지 |
| mobile 4줄 초과, 닫힘 | 4줄 답변 + 더보기 | `aria-controls`는 고유 answer ID, `aria-expanded=false` |
| mobile 4줄 초과, 펼침 | 답변 전문 + 접기 | 동일 native button이 `aria-expanded=true`로 변경 |
| viewport 확대 또는 overflow 해소 | 답변 전문, control/state 해제 | desktop에 mobile control이 남지 않음 |

각 FAQ answer는 `treatment-faq-answer-${slug}-${index}`의 고유 ID를 사용하므로, 같은 상세 페이지에서 여러 답변이 길어도 control의 연결 대상이 충돌하지 않습니다. FAQ 원문은 항상 DOM에 유지됩니다. 따라서 화면의 FAQ와 `buildJsonLd`가 사용하는 `faqItems`는 같은 데이터이며, FAQPage JSON-LD·질문 순서·시술 데이터·CTA·route는 변경하지 않았습니다.

## 다국어·상호작용

label은 한국어 `더보기/접기`, 영어 `Show more/Show less`, 일본어 `もっと見る/閉じる`, 중국어 간체 `展开更多/收起`, 중국어 번체 `展開更多/收起`로 제공됩니다. Button은 최소 44px touch height, 웜 그레이지 accent 색상, visible keyboard focus, hover-capable 장치 전용 hover feedback, active scale을 지원합니다. `prefers-reduced-motion: reduce`에서는 control과 chevron의 transition·transform이 제거됩니다.

| 검증 | 결과 |
|---|---|
| FAQ answer toggle 전용 | 4줄 overflow 측정, 전문 유지, unique ARIA, clamp·focus·hover·reduced-motion 3개 테스트 통과 |
| hero toggle·모바일 title·테마·FAQ JSON-LD·다국어 SEO 집중 회귀 | 10개 파일, 88개 테스트 통과 |
| 전체 회귀 | 215개 파일, 1,937개 테스트 통과 |
| TypeScript | `pnpm check` 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| 390px visual capture | capture 서비스가 1회 실패. 639px 범위·4줄 clamp·state/ARIA·FAQ JSON-LD 자동 계약을 검증했으며 실제 단말 QA는 운영 점검에 권장 |

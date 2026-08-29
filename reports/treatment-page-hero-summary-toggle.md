# 모바일 다국어 Hero 요약문 더보기 제어

## 적용 결과

canonical `/treatments/:slug`의 hero 요약문에 **모바일 전용** 더보기·접기 control을 추가했습니다. 글자 수나 언어를 기준으로 잘라내지 않고, 실제 390px 계열 화면에서 3줄 높이를 넘는지 계산해 overflow가 확인될 때만 control을 표시합니다. 한국어·영어·일본어·중국어 간체·번체 모두 같은 측정 기준을 사용하므로, 단어·CJK 문자 밀도 차이에도 임의의 길이 임계값을 두지 않습니다.

| 상태 | 표시 방식 | 접근성 동작 |
|---|---|---|
| desktop 또는 3줄 이하 | 요약 전문 표시, control 숨김 | 문구를 줄이거나 숨기지 않음 |
| 390px 모바일 3줄 초과, 닫힘 | 3줄 요약 + 더보기 | native `button`, `aria-controls`, `aria-expanded=false` |
| 390px 모바일 3줄 초과, 펼침 | 요약 전문 + 접기 | 같은 button이 `aria-expanded=true`로 변경 |
| viewport 확대 또는 overflow 해소 | 요약 전문 표시, state 초기화 | desktop에 mobile control이 남지 않음 |

전체 원문은 항상 DOM에 그대로 보존합니다. 따라서 H1, SEO description, JSON-LD, canonical/hreflang, 다국어 데이터는 변경하지 않았고, 제목이나 button의 접근 가능한 이름에 말줄임표를 적용하지 않았습니다. 요약 control label은 `더보기/접기`, `Show more/Show less`, `もっと見る/閉じる`, `展开更多/收起`, `展開更多/收起`로 해당 locale에 맞춰 제공됩니다.

## 상호작용 및 범위

control은 44px 이상의 터치 높이, 명확한 gold keyboard focus outline, hover-capable 장치의 가벼운 표면 피드백, active scale을 제공합니다. control과 chevron의 transition은 `prefers-reduced-motion: reduce`에서 제거됩니다. Hero 외의 FAQ·이미지·동영상·CTA·예약·장비 페이지·데스크톱 hero layout은 변경하지 않았습니다.

| 검증 | 결과 |
|---|---|
| 전용 hero summary toggle | overflow 실측 조건, full text 유지, native ARIA 연결, mobile CSS·reduced-motion contract 3개 테스트 통과 |
| 시술 모바일 제목·테마·SEO·FAQ 집중 회귀 | 9개 파일, 85개 테스트 통과 |
| 전체 회귀 | 214개 파일, 1,934개 테스트 통과 |
| TypeScript | `pnpm check` 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| 390px 시각 캡처 | capture 서비스가 1회 실패. 639px 범위, 3줄 clamp selector, state/ARIA 계약, 모바일 title 및 전체 회귀를 자동 검증했고 실제 단말 QA는 다음 운영 점검에 권장 |

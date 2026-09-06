# 다국어 모바일 레이아웃 검토

## 1차 캡처: 영어·일본어 홈페이지

390×844px Chromium 캡처에서 `/en`과 `/ja`의 Special Event 가격 행, 통증관리 이정표, 의료진 섹션 제목·설명·선택 control을 확인했다. 긴 영어 문구는 필요한 곳에서 2~3줄로 자연스럽게 줄바꿈됐고 카드 영역을 넘지 않았다. 일본어 문구와 원화 가격도 control과 충돌하지 않았으며, 두 언어 모두 viewport 가로 폭을 넘는 UI는 관찰되지 않았다.

DOM 감사에서 landing page의 일부 doctor carousel 자식이 화면 밖 transform 상태로 탐지됐지만, 이는 slider의 비활성 slide이며 문서 폭은 390px으로 유지됐다. 따라서 실제 overflow가 아닌 carousel 구현의 false positive로 분리했다.

## 2차 캡처: 중국어 간체·번체 홈페이지

`/zh`와 `/zh-tw`의 의료진 carousel, 의사 소개 문단, 전문 시술 chip은 390px 내에서 정상 흐름으로 표시됐다. 중국어 문장과 번체 장문은 적절히 줄바꿈되며 card 경계를 넘지 않았고, doctor photo·이동 control·전문 마크도 서로 겹치지 않았다. 두 locale에서도 가로 document overflow는 관찰되지 않았다.

## 3차 캡처: 영어·일본어 장비 목록

`/en/equipment3`와 `/ja/equipment3`의 초기 mobile 상태는 화면에 맞춘 제목·소개 문장·다크모드 control 및 로딩 안내를 표시했다. 장문 영어와 일본어 소개는 정상 줄바꿈되며, 로딩 state를 포함해 가로 overflow·글자 잘림·control 겹침은 없었다. DOM 전수 검사에서도 두 목록 경로의 inline overflow는 0건이다.

## 4차 캡처: 중국어 간체·번체 장비 목록

`/zh/equipment3`의 2열 category control은 390px에서 양쪽 폭·행 간격을 유지하고, 중국어 label이 overflow 없이 중앙 정렬됐다. `/zh-tw/equipment3`의 장문 소개·로딩 안내도 자연스럽게 두 줄로 줄바꿈된다. 번체 목록 데이터의 비동기 로딩은 별도 데이터 상태이지만, loading state 자체의 layout 깨짐이나 viewport overflow는 확인되지 않았다.

## 5차 캡처: 영어·일본어 시술 상세

`/en/treatments/ulthera`와 `/ja/treatments/ulthera`는 390px에서 긴 H1, 요약, `Show more`/`もっと見る` control, 시술 시간·회복·횟수 정보를 안전하게 표시했다. 일본어 H1은 의도한 두 줄로 분리됐고, 두 언어의 chip은 내용만큼 확장되면서 viewport 밖으로 나가지 않았다. 시술 소개 본문도 카드/섹션 경계를 넘지 않았다.

## 6차 캡처: 중국어 간체·번체 시술 상세

`/zh/treatments/ulthera`와 `/zh-tw/treatments/ulthera`는 제목, 치료 소개의 긴 문단, 회복·횟수 chip을 390px 안에 안정적으로 표시했다. 간체와 번체 모두 line wrap은 문장 흐름을 해치지 않았고, chip이 허용 범위 안에서 다음 행으로 내려가며 넘침을 방지했다. 두 route의 375px·390px DOM 검사에도 inline overflow와 clipped text가 없었다.

## DOM 전수 점검 및 결론

| 항목 | 결과 |
|---|---|
| 검토 대상 | 영어·일본어·중국어 간체·중국어 번체 × 홈·장비 목록·울쎄라 상세·소개·의료진·외국인 안내 |
| 화면 폭 | 375×844px 및 390×844px, 총 48개 route/viewport 조합 |
| React mount | 48/48 정상 |
| 문서 가로 overflow | 0/48 |
| 실제 시각 캡처 | 4개 locale 홈·장비 목록, 4개 locale 시술 상세 및 375/390px DOM 전수 검사 |
| CSS 수정 필요성 | **확인된 결함 없음 — 추가 CSS 변경 없음** |

자동 DOM 검사에서 landing page 8건의 inline overflow 후보가 탐지됐지만, 모두 화면 밖 transform 상태의 doctor carousel 비활성 slide였다. 이들은 viewport/document 폭을 넓히지 않으며 실제 캡처에서도 노출/침범하지 않았다. 32건의 scroll-width 후보는 `sr-only` 접근성 텍스트, 의도적인 말줄임, 아이콘을 포함한 고정 CTA 내부 text-width 판정이었고, 시각 캡처와 document-width 검사에서 실제 clipping·가로 스크롤로 이어지지 않았다.

DB 내용, locale routing, 예약·OTP·외부 예약 흐름은 변경하지 않았다. 현행 표본에서 다국어 전환에 따른 모바일 줄바꿈·overflow 회귀는 확인되지 않았으므로, 불필요한 예방성 CSS 수정을 추가하지 않는다.

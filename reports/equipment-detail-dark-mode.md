# 장비 상세 다크 모드 적용 및 검증

## 실제 라이트 모드 기준선

개발 미리보기의 한국어 울쎄라피 프라임 상세 페이지에서 데이터 로딩 뒤 hero, 장비 이미지, 소개, 시술 시간·회복 기간·권장 횟수, 외부 카카오·네이버 CTA, 시술 소개, 인포그래픽, 주의사항, 7개 FAQ, 진료·시술 안내, YouTube, 목록 복귀 버튼이 모두 렌더링되는 것을 확인했습니다. 신규 `다크 모드` control은 hero 내부에 독립 button으로 표시되며, 기존 제목 구조·SEO/JSON-LD·native 목록 복귀 동작은 변경하지 않았습니다.

| 확인 항목 | 결과 |
|---|---|
| 초기 로딩 | 기존 `로딩 중...` 상태와 skeleton이 유지됨 |
| 다크 모드 제어 | `다크 모드로 전환`이라는 접근성 이름을 가진 button이 표시됨 |
| 상세 콘텐츠 | 기본 정보, 외부 CTA, 소개, 인포그래픽, 주의사항, FAQ, 안내, 영상, 목록 복귀 제어가 표시됨 |
| 콘텐츠·SEO 계약 | 데이터, slug/query 기반 상세 경로, canonical/hreflang/JSON-LD 생성 로직은 수정하지 않음 |

## 실제 다크 모드 전환

울쎄라피 프라임 상세의 control을 선택하면 레이블과 접근성 이름이 `라이트 모드` 및 `라이트 모드로 전환`으로 바뀌었습니다. header, hero, 기본 정보, 소개, 인포그래픽 주변 표면, FAQ, 진료·시술 안내, 목록 복귀 제어가 같은 네이비 계열의 명도 단계로 연결됐고, 장비 이미지·카카오 상담·네이버 예약 CTA의 기존 색상과 목적지는 유지됐습니다.

계산된 스타일도 다크 토큰과 일치했습니다. main 배경은 `rgb(18, 26, 45)` (`#121A2D`), FAQ와 안내 카드의 배경은 `rgb(28, 41, 67)` (`#1C2943`), FAQ summary는 `rgb(246, 241, 232)` (`#F6F1E8`), 목록 복귀 버튼은 `rgb(42, 59, 94)` (`#2A3B5E`)으로 확인됐습니다. root에는 `equipment-detail-page--dark`가 존재하고 `aria-pressed="true"`, 저장값 `equipment3_color_scheme=dark`가 함께 확인됐습니다.

| 확인 항목 | 실제 결과 |
|---|---|
| 표면 전환 | hero·본문·FAQ·안내·인포그래픽 caption·주의사항·로딩 skeleton을 상세 전용 토큰으로 전환 |
| CTA 보존 | 외부 카카오·네이버 CTA의 href·레이블·브랜드 색상은 유지하고 focus/hover 규칙만 기존 상호작용 계약에 따름 |
| 접근성 | 토글은 button + `aria-pressed`, FAQ/CTA/목록 버튼에는 다크 모드 gold focus outline, reduced-motion에는 transition·transform 비활성화 |
| 시각 일관성 | 헤더·hero·본문·카드의 navy 단계와 gold accent가 목록 다크 모드 팔레트와 동일하게 표시됨 |

## 다국어 확인

같은 slug의 영문 상세에서도 저장된 다크 모드가 유지됐습니다. 버튼은 `Light mode`, 접근성 이름은 `Switch to light mode`로 표시됐고, `Ultherapy Prime` 제목, 영문 기본 정보·FAQ·CTA·목록 복귀 문구가 기존 데이터대로 렌더링됐습니다. 이는 테마 전환이 locale 경로나 데이터 선택·SEO 경로를 바꾸지 않음을 확인하는 화면 검증입니다.

영문 control을 다시 선택했을 때 root에서 `equipment-detail-page--dark` class가 제거되고, `aria-pressed="false"`, `Dark mode`, 저장값 `equipment3_color_scheme=light`가 함께 복원됐습니다.

## 팔레트 및 접근성 대비

장비 목록 다크 모드와 같은 palette token을 상세에 페이지 범위로 적용했습니다. WCAG 2.1의 일반 텍스트 AA 최소 대비는 4.5:1입니다.[1]

| 용도 | 색상 |
|---|---|
| 페이지 바탕 | `#121A2D` |
| 본문·FAQ·안내 표면 | `#1C2943` |
| 패널 단계 | `#172238` |
| 경계선 | `#3A4B68` |
| 주요·보조 텍스트 | `#F6F1E8` / `#D4DCE7` |
| 링크·선택 accent | `#D7B56D` |
| 키보드 focus | `#FFD54A` |

| 전경 / 배경 | 대비율 | 일반 텍스트 AA |
|---|---:|---|
| `#F6F1E8` / `#1C2943` — 주요 텍스트 | 12.89:1 | 통과 |
| `#D4DCE7` / `#1C2943` — 보조 텍스트 | 10.49:1 | 통과 |
| `#D7B56D` / `#1C2943` — gold 링크 | 7.41:1 | 통과 |
| `#F6F1E8` / `#2A3B5E` — back button | 9.90:1 | 통과 |
| `#121A2D` / `#D7B56D` — gold hover button | 8.85:1 | 통과 |
| `#FFD54A` / `#121A2D` — focus outline | 12.27:1 | 통과 |
| `#F6E8C5` / `#2A2418` — caution card | 12.66:1 | 통과 |

## 최종 게이트

| 검증 | 결과 |
|---|---|
| 상세·목록 집중 회귀 | 7개 Vitest 파일, 15개 테스트 통과 — 상세 dark palette/다국어 label/fallback FAQ, 기존 SEO URL·FAQ JSON-LD, 오류 복귀 링크, 목록 테마·색상 전환·모바일 밀도·native card link |
| TypeScript | `pnpm check` 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| 시각 검증 | 한국어 라이트·다크와 영문 다크·라이트 상세에서 control, header·hero·본문·FAQ·CTA·목록 복귀의 실제 렌더링과 양방향 저장 상태 확인 |

## Reference

[1]: https://www.w3.org/TR/WCAG21/#contrast-minimum "W3C WCAG 2.1 — Contrast (Minimum)"

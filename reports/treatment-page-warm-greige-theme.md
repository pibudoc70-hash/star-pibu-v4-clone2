# Canonical 시술 상세 웜 그레이지 테마 적용 기록

## 제안 검토

외부 제안의 핵심인 canonical `/treatments/:slug` 페이지 한정 웜 그레이지 적용은 타당합니다. 실제 `/treatments/ulthera`는 기존 네이비 hero 아래의 넓은 순백색 본문, 회색 FAQ·관련 카드 표면을 사용해 장비 상세/목록의 낮은 조도 디자인과 시각적으로 분리되어 있었습니다. 반면 다크 모드, 장비 테마의 shared state 재사용, 레거시 `/treatment/:name` 수정, CTA 목적지·브랜드색 변경, 시술·SEO 카피 변경은 요청 목적과 관계없거나 운영·검색·의료 콘텐츠 위험이 있어 적용하지 않았습니다.

| 외부 제안 항목 | 판단 | 처리 |
|---|---|---|
| canonical TreatmentPage의 페이지 한정 라이트 웜 그레이지 | 채택 | `.treatment-page` 전용 토큰과 class hook으로 적용 |
| navy hero·흰 텍스트·정보 pill | 채택 | 콘텐츠 계층을 유지하기 위해 기존 gradient·텍스트를 보존 |
| FAQ·관련 시술·이미지·의료광고 박스 표면 조정 | 채택 | `#EEEBE4`·`#F7F5F0`·골드 계열 경계로 적용 |
| 관련 카드·CTA의 hover/focus/reduced motion | 채택 | hover-capable 장치만 2px 이동, focus outline·감소 모션 추가 |
| CTA 배경색·목적지·문구 변경 | 보류 | 외부 채널별 브랜드 인식과 예약 계약을 보존 |
| 다크 모드·equipment3 저장 키 재사용 | 보류 | 시술 페이지와 장비 페이지의 상태·범위를 분리 |
| 레거시 TreatmentDetail 변경 | 보류 | noindex bridge이자 이번 canonical 범위 밖 |
| 치료 데이터·FAQ·SEO/JSON-LD 수정 | 보류 | 의료 콘텐츠·검색 계약 변경이 아니며 근거 불충분 |

## 실제 렌더링 확인

개발 미리보기 `/treatments/ulthera`에서 로딩 placeholder가 아닌 실제 H1, hero, 대표 이미지, YouTube iframe, FAQ, 카카오톡·전화·네이버 CTA, 관련 시술 button을 확인했습니다. 적용 후 desktop 화면에서는 navy hero가 유지되고 본문 바탕이 `#F4F1EA` 계열의 웜 그레이지로 전환됐으며, 본문 텍스트·기대 효과·영상·FAQ가 충분한 대비를 유지했습니다. 브라우저 DOM에서 CTA의 기존 href와 6개의 관련 시술 `<button>`도 그대로 확인했습니다.

390px, 영어 `/en/treatments/ulthera`, 써마지 `/treatments/thermage`, 장비 목록·상세 및 legacy bridge 확인은 자동·소스 게이트와 함께 최종 검증 단계에서 기록합니다.

## WCAG 대비 및 상호작용

페이지 범위 색상은 WCAG 2.1 일반 텍스트 AA 최소 기준인 4.5:1을 넘도록 검증했습니다.[1] CTA의 카카오·LINE·WeChat·네이버·전화 배경색과 목적지는 그대로 유지했고, 공통 hover는 그림자·2px 이동만 적용했습니다. 관련 시술 button의 hover 이동은 `(hover: hover)`에만 제한했으며, touch active scale과 keyboard focus outline을 추가했습니다. `prefers-reduced-motion: reduce`에서는 새 transition과 transform을 제거합니다.

| 전경 / 배경 | 대비율 | 일반 텍스트 AA |
|---|---:|---|
| `#2C2C2C` / `#F4F1EA` — 본문 | 12.38:1 | 통과 |
| `#5A5A5A` / `#EEEBE4` — 보조 텍스트 | 5.79:1 | 통과 |
| `#7A5C35` / `#EEEBE4` — accent·본문 링크 | 5.17:1 | 통과 |
| `#7A5C35` / `#F4F1EA` — focus outline | 5.46:1 | 통과 |
| `#92400E` / `#FEF3C7` — 주의사항 제목 | 6.37:1 | 통과 |
| `#78350F` / `#FEF3C7` — 주의사항 본문 | 8.15:1 | 통과 |

## 최종 검증

| 검증 | 결과 |
|---|---|
| 시술 테마·SEO·FAQ·legacy 집중 회귀 | 7개 파일, 79개 테스트 통과 |
| 전체 회귀 | 212개 파일, 1,928개 테스트 통과 |
| TypeScript | `pnpm check` 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| 데스크톱 실제 렌더링 | `/treatments/ulthera`에서 navy hero·웜 그레이지 본문·대표 이미지·YouTube·FAQ·3개 외부 CTA·6개 관련 시술 button 확인 |
| 390px 캡처 | capture 서비스가 1회 실패. 새 theme은 레이아웃 변경 없이 기존 `grid-cols-1 sm:grid-cols-3` 및 모바일 flex CTA 구조를 유지하고, focused/전체 회귀로 소스 계약을 검증함 |
| 다국어·SEO | `SeoHead.hydration`, `SeoHead.multilang`, route ownership 회귀 통과. canonical/hreflang/JSON-LD와 locale 데이터는 변경하지 않음 |
| 장비·legacy 스모크 | diff에 Equipment3·Equipment3Detail·TreatmentDetail·장비 테마·dark mode 저장 키 변경 없음 |

## Reference

[1]: https://www.w3.org/TR/WCAG21/#contrast-minimum "W3C WCAG 2.1 — Contrast (Minimum)"

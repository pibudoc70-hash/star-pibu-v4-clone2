# 장비 상세 오프화이트 시범 테마 및 버튼 상호작용 검증

## 적용 범위

장비 상세 페이지에서만 FAQ 카드와 `진료·시술 안내` 정보 카드를 따뜻한 오프화이트 `#F7F5F0`로 변경했습니다. 기존 페이지의 순백색은 전면 제거하지 않았으며, 이미지·히어로·본문·다른 페이지·전역 버튼 시스템은 그대로 보존했습니다. FAQ 카드는 `.equipment-detail__faq-item`, 정보 카드는 `.equipment-detail__info-card`로 범위를 한정해 적용했습니다.

목록으로 돌아가기 버튼은 네이비 `#1A2744`를 기본색으로, hover 시 명도와 채도가 안정적인 골드 브라운 `#7A5C35`로 전환합니다. 상담·예약 버튼은 기존 카카오·네이버 브랜드 배경색을 유지하고, hover 시 공통 네이비 그림자·부드러운 금색 외곽 피드백·2px 상향 이동으로 상호작용을 명확하게 했습니다.

| 요소 | 기본 상태 | hover/active 상태 | 접근성 처리 |
|---|---|---|---|
| FAQ 카드 | `#F7F5F0` 표면, `#E3DCCE` 경계 | summary에 미세한 아이보리 강조 | `summary:focus-visible` 금색 3px outline |
| 정보 카드 | `#F7F5F0` 표면, 약한 네이비 shadow | 정적 정보 표면 유지 | 본문·보조 텍스트 대비 충족 |
| 목록 버튼 | 네이비 바탕·아이보리 텍스트 | 골드 브라운 바탕·2px 상향·shadow | 3px 금색 focus outline, active scale 0.97 |
| 상담·예약 CTA | 기존 서비스 브랜드색·기존 텍스트색 | 2px 상향, 네이비 shadow, 금색 외곽 | 공통 focus outline, 터치 환경에서는 hover 효과 미적용 |

호버는 `(hover: hover)` 환경에서만 작동하므로 터치 장치에 고정 hover 상태가 남지 않습니다. `prefers-reduced-motion: reduce`에서는 transform·transition을 제거하고 색상 및 focus 상태만 제공합니다.

## WCAG 대비율 계산

WCAG 2.2의 일반 텍스트 AA 기준은 최소 4.5:1이며, 사용자 인터페이스 컴포넌트와 focus indicator는 주변 색상과 식별 가능한 대비가 필요합니다.[1] 실제 적용 색상값을 상대 휘도로 계산한 결과, 모든 텍스트·상호작용 상태가 일반 텍스트 AA 기준을 충족합니다.

| 전경색 / 배경색 | 대비율 | 일반 텍스트 AA |
|---|---:|---|
| `#2C2C2C` / `#F7F5F0` — 카드 본문 | 12.82:1 | 통과 |
| `#5A5A5A` / `#F7F5F0` — 카드 보조 텍스트 | 6.33:1 | 통과 |
| `#2563EB` / `#F7F5F0` — FAQ 질문 표식 | 4.74:1 | 통과 |
| `#FCFBF8` / `#1A2744` — 네이비 버튼 텍스트 | 14.32:1 | 통과 |
| `#FCFBF8` / `#7A5C35` — 골드 hover 버튼 텍스트 | 5.95:1 | 통과 |
| `#7A5C35` / `#F7F5F0` — 금색 focus outline | 5.65:1 | 통과 |

## 검증 결과

| 검증 | 결과 |
|---|---|
| 시범 테마 회귀 | PASS — `Equipment3Detail.offWhiteTheme.test.ts` 2개 테스트 통과 |
| 장비 상세·SEO 회귀 | PASS — 관련 3개 파일, 6개 테스트 통과 |
| TypeScript | PASS — `pnpm check` 통과 |
| Lint | PASS — 오류 0건, 기존 경고 106건 외 신규 경고 없음 |
| 실제 CTA hover | PASS — 카카오 CTA의 `:hover=true`, `translateY(-2px)`, 네이비 shadow, 금색 외곽 피드백을 계산된 스타일로 확인 |
| 실제 상세 렌더링 | PASS — 울쎄라피 프라임 상세의 CTA·7개 FAQ·시술 안내·인포그래픽이 정상 렌더링됨을 확인 |

## References

[1]: https://www.w3.org/TR/WCAG22/#contrast-minimum "W3C WCAG 2.2 — Contrast (Minimum)"

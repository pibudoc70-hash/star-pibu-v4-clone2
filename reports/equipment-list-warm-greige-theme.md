# 장비 목록 웜 그레이지 테마 및 브랜드 상호작용 적용

## 적용 범위

장비 상세에서 검증한 따뜻한 저조도 배경 조합을 전체 장비 목록 페이지에만 확장했습니다. 페이지의 넓은 바탕은 `#F4F1EA`, 카테고리 탭 패널·검색 입력·장비 카드 표면은 `#EEEBE4`, 카드 묶음의 외곽 포인트는 `#E6E1D8`, 경계선은 `#D8D0C2`로 구성했습니다. 순백색 대비를 낮추면서 이미지·제목·설명·카테고리 구분이 유지되도록 범위를 `.equipment-list-*` 클래스에 한정했습니다.

| 영역 | 적용 색상·상태 | 유지한 계약 |
|---|---|---|
| 페이지 및 콘텐츠 바탕 | `#F4F1EA` | 기존 헤더·푸터·다른 페이지의 전역 배경은 변경하지 않음 |
| 탭·검색·카드 | `#EEEBE4` + `#D8D0C2` 경계 | category tab, search input, native detail link, 카드 aria label 유지 |
| 상세 링크 | 기본 골드 브라운 `#7A5C35`, 카드 hover 시 네이비 | link href, locale path, card semantics 유지 |
| 더보기 버튼 | 기본 네이비 `#1A2744`, hover 골드 브라운 `#7A5C35` | showMore 상태·텍스트·비즈니스 로직 유지 |
| 카드 hover | 2px 상향, 네이비 shadow, 약한 gold ring | `(hover: hover)`에서만 적용하여 터치 장치의 고정 hover 방지 |
| 키보드·감소 모션 | 3px gold focus outline, `prefers-reduced-motion`에서 transition/transform 제거 | 접근 가능한 focus와 touch active scale 유지 |

## WCAG 대비율

실제 CSS 색상값으로 상대 휘도를 계산했습니다. WCAG 2.1 일반 텍스트 AA 최소 기준은 4.5:1입니다.[1]

| 전경 / 배경 | 대비율 | 일반 텍스트 AA |
|---|---:|---|
| `#2C2C2C` / `#EEEBE4` — 카드 본문 | 11.73:1 | 통과 |
| `#5A5A5A` / `#EEEBE4` — 카드 보조 텍스트 | 5.79:1 | 통과 |
| `#7A5C35` / `#EEEBE4` — 상세 링크 | 5.17:1 | 통과 |
| `#FCFBF8` / `#1A2744` — 네이비 버튼 | 14.32:1 | 통과 |
| `#FCFBF8` / `#7A5C35` — 골드 hover 버튼 | 5.95:1 | 통과 |
| `#7A5C35` / `#F4F1EA` — gold focus outline | 5.46:1 | 통과 |

## 검증 결과

| 검증 | 결과 |
|---|---|
| 구현 후 목록 회귀 | PASS — warm-greige source contract, card semantics, search clear accessibility, tab selection 4개 파일·6개 테스트 통과 |
| TypeScript | PASS — `pnpm check` 통과 |
| Lint | PASS — 오류 0건. 기존 경고 106건 외 신규 경고 없음 |
| 실제 데스크톱 목록 | PASS — `/equipment3`에서 로딩 완료 뒤 탭·검색·6개 Best card·이미지·제목·메타·native detail link가 표시되고, 카드 기본 `#EEEBE4`, border `#D8D0C2`, gold detail link가 계산된 스타일로 확인됨 |
| 전체 캡처 | 제한 — capture 서비스가 1회 실패해 브라우저 실제 렌더링으로 대체 확인. 상세 내용은 `reports/equipment-list-warm-greige-verification.md`에 기록 |

## References

[1]: https://www.w3.org/TR/WCAG21/#contrast-minimum "W3C WCAG 2.1 — Contrast (Minimum)"

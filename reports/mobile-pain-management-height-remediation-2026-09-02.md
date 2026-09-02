# 모바일 통증관리 높이 재구성 검증

## 측정 조건

개발 미리보기에서 Chrome DevTools Protocol을 사용해 **390 × 844px** viewport로 렌더했다. `section[aria-labelledby="pain-management-guide-title"]`와 하위 블록의 `getBoundingClientRect().height`를 직접 읽었으며, 모든 native `details`는 닫힌 상태였다. 가로 `scrollWidth`는 전후 모두 390px이었다.

## 전후 실측

| 항목 | 변경 전 | 변경 후 | 변화 |
|---|---:|---:|---:|
| 통증관리 루트 전체 | 1,175.6px | **275.9px** | **−899.7px (−76.5%)** |
| header | 163.3px | 163.3px | 0px |
| 3단계 아코디언 | 410.0px | 기본 접힘 패널 안으로 이동 | 초기 높이에서 제외 |
| 신뢰 안내 | 62.0px | 기본 접힘 패널 안으로 이동 | 초기 높이에서 제외 |
| FAQ 4항목 | 416.3px | 기본 접힘 패널 안으로 이동 | 초기 높이에서 제외 |
| 마무리 문구 | 40.0px | 기본 접힘 패널 안으로 이동 | 초기 높이에서 제외 |

변경 후 기본 접힘 상태는 844px viewport의 약 32.7%를 차지한다. 이전의 padding/margin 미세 축소와 달리, 전체 정보 구조를 하나의 native `details` 패널로 바꾸어 세로로 누적되던 3단계·신뢰 안내·FAQ·마무리 문구를 사용자의 명시적 요청 뒤에만 노출한다.

## 보존·통일 사항

승인된 의료 문구, 3단계 설명, 신뢰 안내, FAQ 4개, 마무리 문구를 삭제하거나 축약하지 않았다. 모바일 summary는 locale별 `통증관리 3단계와 FAQ 보기` 라벨을 제공하고, 펼치면 전체 원문을 표시한다. 44px 이상 native summary, focus-visible ring, reduced-motion 보호를 유지했다. 데스크톱은 기존 3열 구조를 유지한다.

이 컴포넌트의 mobile-to-desktop boundary는 `md`(768px)로 통일했다. 기존 `sm`(640px) 여백 복원으로 생기던 640–767px 구간의 구조·여백 불일치를 제거했다.

## 회귀 방지

`scripts/check-pain-management-mobile-height.mjs`는 production build를 실제 Chrome 390 × 844px viewport로 렌더하고 기본 접힘 패널이 닫혀 있으며 root height가 **700px 이하**인지 검사한다. `pnpm test:pain-height`로 실행되며 GitHub Actions Production Build job에서 `pnpm build`와 `pnpm test:size` 뒤에 실행된다. 기존 여백 class 문자열 중심 단언은 모바일 전체 native disclosure·locale label·문구 보존·68px stage target·`md` boundary 검증으로 교체했다.

## 품질 확인

`pnpm check`, `pnpm lint`, `pnpm test:unit`, `pnpm build`, `pnpm test:size`, `pnpm test:pain-height`를 통과했다. `test:pain-height`의 실제 측정값은 **275.9px / 700px limit**이다. 관리형 screenshot capture는 이번에도 실패했으나, 실제 Chrome의 DOM height 측정으로 완료 기준을 검증했다.

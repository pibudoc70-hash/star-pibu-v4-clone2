# CSS Coverage 기반 스타일 정리 보고서

## 범위와 원칙

이번 감사는 **CSS Coverage만으로 삭제 대상을 결정하지 않았습니다.** Coverage는 현재 라우트·뷰포트·상호작용에서만 규칙 사용을 관찰하므로, 아래 두 증거를 모두 만족한 selector family만 제거했습니다.

1. Chromium CDP가 홈, 장비 목록/상세, 시술 상세, 소개, 의료진, 찾아오시는 길, 공지, 연구, 비급여, 개인정보, 4개 다국어 랜딩 및 영어 시술 상세의 **18개 대표 상태**에서 CSS rule usage를 수집했습니다. 각 화면은 desktop 또는 390px mobile에서 전체 스크롤, 첫 disclosure/menu control, hover/focus 이벤트를 포함했습니다.
2. `client/src`, `client/index.html`, `server`, `shared`의 source reference를 별도로 대조했습니다. 문자열·동적 class 가능성이 남은 selector는 Coverage 미사용이어도 유지했습니다.

원시 수집 결과는 `reports/css-coverage-audit.json`, source reference 결과는 `reports/css-selector-reference-audit.json`에 보관합니다. 실제 운영 콘텐츠와 DB는 읽기·수정하지 않았습니다.

## 제거한 고신뢰 legacy 범위

| 범주 | 제거한 selector family | 제거 근거 |
|---|---|---|
| 후기 UI | `review-card`, `review-dot`, `review-slide-item`, `review-quote-icon`, `card--review` 및 mobile/reduced-motion override | 현행 public source의 렌더·동적 class·컴포넌트 참조가 없고 Coverage 표본에서도 사용되지 않음 |
| 구형 필터·스켈레톤 | `treatment-filter-*`, `event-skeleton-*` | 실제 컴포넌트는 Tailwind/inline skeleton을 사용하며 legacy class 참조 없음 |
| 중단된 효과 | `section-fade-in`, `animate-fade-in-up`, `content-appear`, `img-zoom`, `ds-img-zoom`, `card-glow`, `before-after-container` | class와 keyframe 모두 source runtime 참조 없음 |
| 구형 UI 보조 | `header-scrolled`, `floating-cta`, `popup-tab-content`, `lightbox-overlay`, `brand-card*`, `facility-img-label`, 사용하지 않는 philosophy statistic/interlude 규칙 | 현재 Header/FloatingCTA/Popup은 별도 live class 또는 inline style을 사용하며 legacy class 참조 없음 |

현재 live인 `ScrollAnimationWrapper`와 `.scroll-*` stylesheet, `.reveal*` / `useScrollReveal` 경로는 **유지**했습니다. CSS Coverage가 일부 animation variant를 놓칠 수 있으므로 이들은 삭제 후보로 취급하지 않았습니다.

## 전송량 및 검증 결과

| 항목 | 이전 | 이후 | 변화 |
|---|---:|---:|---:|
| `client/src/index.css` 원본 | 217,041 B | 205,873 B | **-11,168 B (-5.15%)** |
| production global CSS raw | 320,695 B | 312,212 B | **-8,483 B (-2.65%)** |
| production global CSS Brotli | 44,744 B | 43,523 B | **-1,221 B (-2.73%)** |
| source-unreferenced CSS selector | 100 | 61 | **-39** |

production-like 로컬 서버에서 18개 대표 화면을 재검증한 결과, 모든 화면이 React root를 렌더했고, 가로 overflow가 없었으며, viewport별 첫 상호작용을 완료했습니다. 화면 캡처 서비스는 당시 렌더링 슬롯 부족으로 캡처를 반환하지 못했으므로, 시각 결과를 과장하지 않고 CDP DOM 검증으로 제한했습니다.

`server/_core/vite.ts`는 감사 중 발견된 함수형 Vite 설정 해석 문제도 보정했습니다. 개발 모드에서 config callback을 `serve/development`로 resolve하여 `client/src/main.tsx`가 프로젝트 root가 아닌 client root에서 정상 제공됩니다. production `/__static/` base 분기는 변경하지 않았습니다.

## 품질 게이트

| 검증 | 결과 |
|---|---|
| 전체 Vitest | 235 files, 2,015 tests 통과 |
| 홈 초기 gzip 예산 | 318,774 B / 332,800 B 예산 통과 |
| TypeScript | 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| production build + build-time Brotli | 통과, 427 JS/CSS asset 사전압축 |

## 의도적으로 유지한 항목

아직 source reference가 없더라도 mobile menu stagger, 의사 상세 UI, hero variant, typography utility처럼 동적 문자열·세부 breakpoint·상호작용 경로일 수 있는 규칙은 삭제하지 않았습니다. 남은 61개 source-unreferenced selector는 후속 페이지별 사용자 흐름/관리자 화면 검증이 갖춰질 때만 별도 검토합니다.

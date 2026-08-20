# 현재 품질 상태

**기준일:** 2026-08-21  
**기준 checkpoint:** `c4012fba`  
**용도:** 장기 이력이 보존된 `todo.md`를 대체하지 않고, 비예약 영역의 현재 품질 상태와 안전한 후속 작업을 빠르게 파악한다.

## 현재 상태 요약

현재 main은 비예약 영역의 점진적 품질 개선이 적용된 상태다. 최근 작업은 코드 변경이 필요한 개선과 위험한 전면 정리를 분리했고, 문서화 단계에서는 운영 DB·예약·CTA를 건드리지 않았다. 각 문서 작업은 `git diff --check`, 독립 로컬 commit, checkpoint로 보존했다.

| 영역 | 현 상태 | 근거·참조 |
|---|---|---|
| 초기 로딩·FOUC | React readiness signal 기반 fail-closed style gate와 초기 브랜드 loading UI 유지 | `client/index.html`, `client/src/main.tsx` |
| 홈 deferred content | anchor scroll이 deferred section mount를 명시 요청하고, below-fold sections에 skeleton/error/empty/retry 상태가 있음 | `useAnchorScroll`, `DeferredMount`, `Home` |
| 접근성 | skip link, lazy section skeleton의 상태 안내, 지도 iframe title/fallback, modal·native link semantics 개선이 반영됨 | Home·map·equipment/facility focused tests |
| 성능 관측 | LCP·INP는 익명 metric으로 전송하며 tracking SDK는 load/idle 경계를 가짐 | `docs/analytics-event-policy.md` |
| 홈 SEO | 단일 H1, 수정된 homepage title/keywords, 상세 울쎄라·써마지 H1/description 적용 | `homeSeo.ts`, treatment detail source |
| 다국어 Price List | `/en`, `/ja`, `/zh`, `/zh-tw`가 독립 가격표 페이지와 mobile horizontal scroll/sticky column 계약을 가짐 | `ForeignPriceList`, locale/data tests |
| 시술 data boundary | canonical detail SEO, Equipment3 home cards, legacy static catalogue의 source owner를 분리 | `docs/treatment-data-boundary.md` |
| 지도 경계 | 홈 iframe, live Directions MapView fallback, static-map compatibility surface를 문서화 | `docs/map-implementation-boundary.md` |
| 카피 정합성 | numeric canonical source는 test로 보호되고, evidence 없는 운영·의료 카피는 변경 보류 | `docs/clinic-copy-consistency-audit.md` |

## 동결 범위

| 동결 영역 | 변경 금지 대상 |
|---|---|
| 예약·OTP·운영 DB | 예약 router/service/repository, reservations·unavailableSlots, schema·migration·fixture·seed·test, OTP·이메일·SMS, 관리자 예약, `/my-reservations`, 운영 DB |
| 외부 전환 CTA | 네이버·카카오·위챗·전화 CTA, `reserveUrl`, `chatUrl`, `phoneHref`, MobileBottomCTA |
| 글로벌 레이아웃 | Header, HeroSection, Footer의 디자인·콘텐츠·배치 |
| URL·다국어 | 기존 route, canonical, hreflang, locale path 구조 |
| 변경 방식 | 새 dependency, lint rule 비활성화, 광범위 `eslint-disable`, force push, destructive DB 작업 |

## 보류 항목과 이유

| 보류 항목 | 보류 이유 | 재개 조건 |
|---|---|---|
| `treatments-data.ts` 삭제 | static filter, legacy migration input, regression fixture가 실제 참조 | runtime·script·test replacement와 route render 검증 |
| 전면 카드/CSS token 통일 | Header/Hero/Footer 동결 및 다수 card의 시각 회귀 위험 | 제한된 component pilot의 결과와 각 component별 QA |
| 지도 route·cache 제거 | Directions, static map HTTP route, deprecated tRPC contract가 공존 | deployed/external caller graph, fallback QA, cache endpoint 검증 |
| 예약·상담 전환 tracking | 민감 정보·외부 플랫폼·CTA 동결 범위 | 병원 승인 event schema, privacy/consent 검토, 명시적 동결 해제 |
| 의료·통계 카피 수정 | 1:1, 10,000명, 직접 시술, 통증/진정, 효과 문구의 근거 확인 필요 | 병원/원장이 승인한 주장별 근거와 locale wording |
| event/about/doctor prerender 확장 | locale·canonical·데이터 신선도·build 비용의 별도 확인 필요 | read-only 기술 감사와 route별 validation plan |

## 다음 3개 안전 작업

1. **Event Card design pilot:** `EventCard`의 static inline style만 component-scoped class로 이동하고, dynamic data·가격·상세 진입·CTA를 보존한다. desktop, 390px, keyboard focus, reduced motion을 검증한다.
2. **Directions stale comment 최소 정정 감사:** active route와 상충하는 dormant comment를 production behavior 변경 없이 정정할 필요가 있는지 source/test 기준으로 검토한다.
3. **Prerender 후보 read-only audit:** event, doctor, about route의 current render·locale·canonical·data freshness·build cost를 분석해 확대 여부만 판단한다.

## 검증·복원 규칙

문서 변경은 Markdown 검토와 `git diff --check`를 수행한다. production code 변경은 focused test, `pnpm check`, `pnpm lint`, DB 연결 문자열을 제거한 `pnpm test:unit`, production build 순으로 검증한다. sandbox build가 JavaScript/TypeScript 오류 없이 외부 SIGTERM 143으로 끝나는 기존 환경 한계를 보일 경우, 동일 SHA의 CI Production Build가 성공할 때만 제한적으로 판단을 보완한다.

모든 안전 작업은 하나씩 처리하고, 완료 시 `todo.md` 이력을 보존한 채 체크 표시를 갱신한다. 각 단계는 독립 local commit과 checkpoint로 롤백 가능해야 한다.

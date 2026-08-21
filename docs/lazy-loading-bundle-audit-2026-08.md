# Lazy Loading·Bundle Audit

**검토일:** 2026-08-21  
**범위:** route-level dynamic import, initial fallback, KaTeX/Streamdown CSS, modulepreload, `index.html` injection  
**결론:** 첨부 제안의 핵심 lazy-loading 조치는 현재 구현에 이미 반영되어 있다. 이번 감사에서 initial bundle을 더 줄이기 위한 안전한 단일 production 수정은 찾지 못했으므로 추가 코드 변경은 보류한다.

## 현재 구현 상태

| 점검 항목 | 현재 구현 | 판정 |
|---|---|---|
| route page dynamic import | `client/src/routes.ts`의 `pages` import factory와 `React.lazy`가 Notice, EventDetail, Treatments, Equipment, About, Doctors, Directions, 관리자 pages 및 locale landing pages를 route 단위로 지연 로드 | 충족 |
| initial homepage | `Home`만 App entry에 static import되어 root route first paint를 보장하고, page navigation은 Suspense `PageLoader`/map-local `MapLoadingFallback`으로 분리 | 의도된 예외 |
| static/dynamic 중복 | `App.tsx`는 route components를 직접 static import하지 않고 `routes.ts` lazy export만 소비 | 충돌 없음 |
| heavy Markdown/math | Vite `externalizeKatexCssPlugin`이 dynamic KaTeX CSS import를 noop으로 치환하고, stylesheet는 CDN 경로로만 유지해 KaTeX font bundle 유입을 차단 | 충족 |
| unnecessary preload | Vite `stripUnusedModulePreloadPlugin`이 관리자·locale·대용량 vendor dynamic chunk의 homepage modulepreload를 제거 | 충족 |
| static HTML | `client/index.html`은 약 24KB이며 SEO/FOUC/brand loading/analytics bootstrap과 prerender replacement marker를 포함 | 추가 축소는 SEO·FOUC 회귀 위험 |

## 추가 수정 보류 이유

`Home`을 dynamic import로 바꾸면 최초 route의 React shell과 existing FOUC/brand loading gate의 경계가 복잡해지며 LCP에 이점이 보장되지 않는다. `index.html`의 metadata/FOUC/prerender marker를 제거하면 current production-only prerender와 hydration SEO ownership 계약을 해칠 수 있다. KaTeX/Streamdown 또는 modulepreload 관련 코드는 이미 bundle exclusion 목적의 custom plugin으로 보호되므로, measured bundle report 없이 중복 수정을 하면 deployment risk가 이점보다 크다.

향후 optimization은 동일 commit에서 정상 완료된 production build artifact의 manifest/chunk size를 기준선으로 확보한 뒤, **실제로 homepage initial graph에 포함된 module만** 대상으로 검토한다. sandbox build SIGTERM 143은 chunk output을 안정적으로 제공하지 못하므로 size 판정 근거로 사용하지 않는다.

이 감사는 production source, route, SEO, FOUC, dependency를 변경하지 않았다.

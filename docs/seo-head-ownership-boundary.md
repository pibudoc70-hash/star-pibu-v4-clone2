# SEO Head Ownership Boundary

**작성일:** 2026-08-21  
**목적:** static homepage fallback, server prerender response, client `SeoHead` hydration의 책임을 분리해 canonical·hreflang·Open Graph 중복을 예방한다.

## 책임 분리

| 실행 단계 | owner | 책임 | 중복 방지 규칙 |
|---|---|---|---|
| JavaScript 미실행 SPA fallback | `client/index.html` | homepage의 기본 title·meta·canonical·hreflang·OG fallback | managed SEO tags에 `data-seo-fallback="home"`을 표시한다. Kakao verification/robots/geo tags는 global static owner로 유지한다. |
| production prerender response | server prerender helper + `injectPageSeoMeta` | crawler에 제공되는 route-specific canonical·hreflang·OG locale·structured markup | server injector는 raw static fallback canonical/alternate/OG locale을 교체하고 `data-server-seo` route tags만 남긴다. Doctors route는 dedicated production response test로 보호한다. |
| hydration 후 browser DOM | route page의 `SeoHead` | page-local title·description·keywords·canonical·hreflang·OG/Twitter·JSON-LD | `SeoHead`가 marked homepage fallback을 제거하고, canonical·singleton metadata·hreflang·OG locale alternate를 key별 마지막 page value 하나로 정리한다. |

## 검증 경계

`SeoHead.hydration.test.tsx`는 5개 locale의 Home, About, Doctors metadata input을 실제 `SeoHead` mount로 hydrate해 fallback 0·canonical 1·hreflang 6·OG locale 1 contract를 검증한다. `SeoHead` route page contract test는 실제 Home/About/Doctors component source가 해당 locale props를 전달하는지 별도로 고정한다. `doctorsPrerender.test.ts`는 JavaScript 없이 제공되는 5개 Doctors raw response의 canonical/hreflang/JSON-LD contract를 검증한다.

외부 browser sandbox에서는 hidden iframe이 route load 대신 `about:blank`를 반환하여 15-route iframe batch DOM QA를 신뢰할 수 없었다. 따라서 iframe 결과는 검증 근거로 사용하지 않고, 실제 `/zh-tw/about` top-level browser DOM 확인과 위 focused tests를 기준으로 한다.

## 변경 제한

이 경계는 URL, locale route, content claim, CTA, 예약/OTP, database를 변경하지 않는다. About raw prerender는 아직 구현하지 않았으므로, JavaScript 미실행 `/about` route의 page-specific title/description 확대는 About prerender 별도 작업에서만 검토한다.

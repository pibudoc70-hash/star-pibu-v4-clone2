# Production SEO Deployment Verification

**검토일:** 2026-08-21  
**대상:** `/zh-tw/about` raw HTML  
**코드 기준:** `e3433f0` — About prerender fallback dedupe 수정 포함

## Local contract

production-mode Express regression은 5개 About locale에서 localized description 1개, canonical 1개, hreflang 6개, `og:locale` 1개, About Breadcrumb JSON-LD 1개, homepage fallback description 0개를 확인한다. 전체 TypeScript, ESLint, DB 없는 unit도 통과했다.

## Public read-only 결과

`star-pibu.com`과 `www.star-pibu.com`의 cache-control no-cache raw response는 About crawler body와 Breadcrumb JSON-LD를 반환하지만, homepage fallback description 1개와 hreflang 12개를 반환했다. 이는 local code contract가 아니라 아직 이전 deployment revision을 제공하는 public runtime 상태와 일치한다. `starpibu-qdq7tysk.manus.space`는 raw request에서 500을 반환했다.

## 결론

코드 수정은 checkpoint에 저장됐지만, public raw response가 해당 revision을 제공하는지는 현 시점에서 확인되지 않았다. custom domain deployment revision, Manus-space host 500, CDN/runtime sync는 code change로 고치지 않는다. platform deployment 상태가 정상화된 뒤 동일 raw response audit을 재실행해야 한다.

이 문서는 routing, SEO source, locale copy, domain, deployment 설정을 변경하지 않는다.

## 재검증 결과

deployment success 알림 후 cache-control no-cache 및 query cache-busting request로 재검증했다. `https://star-pibu.com/zh-tw/about`은 localized description 1개, canonical 1개, hreflang 6개, `og:locale` 1개, About Breadcrumb JSON-LD 1개, homepage fallback description 0개를 반환해 local contract와 일치한다. `www.star-pibu.com`은 301로 primary domain으로 redirect한 뒤 동일 contract를 반환한다.

`starpibu-qdq7tysk.manus.space/zh-tw/about`은 여전히 500을 반환한다. primary custom domain의 public SEO response는 정상화됐지만, Manus-space host의 platform routing/runtime 상태는 code change 없이 별도로 확인해야 한다.

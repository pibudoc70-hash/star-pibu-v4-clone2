# Google Search Console Verification 및 Core Web Vitals Baseline

## Google Search Console Verification

요청한 Google verification token은 이미 canonical `client/index.html` head에 존재한다.

```html
<meta name="google-site-verification" content="a7QxxU_tlMvQCrJLQ9oCwuoQwmoaWr64mF2t5b40EdU" />
```

2026-08-22에 `https://star-pibu.com/`의 raw HTML을 확인했고 동일 meta tag가 실제 운영 응답에 노출됐다. 따라서 중복 태그를 추가하지 않았다. Search Console에서 해당 URL-prefix property 또는 domain property를 열고 **소유권 확인**을 누르면 된다.

## 공개 CWV field data

PageSpeed Insights 모바일 origin report의 최근 28일 Chrome UX Report data는 다음과 같다.

| 지표 | p75 | 판정 |
|---|---:|---|
| LCP | 3.4초 | 개선 필요 |
| INP | N/A | field sample 부족으로 판정 불가 |
| CLS | 0 | 양호 |
| FCP | 3.1초 | 개선 필요 |
| TTFB | 2.0초 | 개선 필요 |

같은 run의 laboratory score는 55였고, FCP 19.6초·LCP 34.3초·TBT 20ms·CLS 0.001을 보고했다. synthetic 값은 변동 가능하지만, CPU blocking보다 response/render discovery와 critical request chain이 우선이라는 field data와 방향이 일치한다.

## 진단과 이번 판단

PageSpeed diagnostics는 render-blocking CSS 및 두 Google font stylesheet에서 약 150ms 절감 가능성, 4개 초과 preconnect warning, `star_logo` 이미지 약 40KiB 절감 가능성을 제시했다. 하지만 source audit 결과 preconnect는 실제 CDN과 사용 중인 font provider 세 개뿐이었고, logo와 Hero/LCP asset ownership은 동결된 Header·HeroSection 영역에 속한다. font stylesheet를 무근거로 제거하면 FOUC·브랜드 typography regression이 발생할 수 있다.

따라서 이번 측정만으로 안전하게 변경할 단일 runtime candidate는 없다. 특히 p75 TTFB 2.0초는 CDN·hosting·origin response path를 함께 분석해야 하며, source-level image deletion으로 해결된다고 단정할 수 없다.

## 재측정 및 다음 안전 순서

Search Console 소유권 확인 뒤 28일 field data를 기준선으로 저장한다. 그 다음 `PageSpeed Insights`의 waterfall과 server response header를 비교해 TTFB ownership을 먼저 분리하고, Hero/Logo 변경을 원할 경우 동결 해제 승인을 받은 뒤 asset byte·dimension·cache policy를 하나씩 검증한다.

## References

[1] [PageSpeed Insights mobile report for star-pibu.com](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fstar-pibu.com&form_factor=mobile)

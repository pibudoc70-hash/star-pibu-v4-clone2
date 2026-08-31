# 모바일 Hero LCP Preload 검증

## 조사 근거

모바일 Hero의 실제 logo renderer는 `HERO_MOBILE_LOGO_IMAGE`를 `OptimizedImage`에 그대로 전달하며, 해당 WebP 확장자는 `OptimizedImage`의 format query 변환 대상이 아니다. 따라서 렌더된 `img`의 요청 URL은 `/manus-storage/star-logo-mobile_77b7502d_83869d29.webp`와 동일하다.

기존 `client/index.html`은 desktop/mobile 공통 Hero background 한 개만 high-priority preload하고 media 조건이 없었다. 수정 후에는 desktop background preload에 `(min-width: 768px)`를, mobile logo preload에 `(max-width: 767px)`를 적용했다. `HeroImageFormats.test.ts`는 constants의 desktop/background 및 mobile-logo URL이 각 preload href와 byte-for-byte 일치하는지 검증한다.

## HTTPS 검증 결과

프로덕션 build를 HTTPS proxy에서 모바일 Lighthouse로 재측정했다. LCP element는 `.hero-mobile-logo-img`였고, `<img>`의 `src`는 preload href와 byte-for-byte 동일한 `/manus-storage/star-logo-mobile_77b7502d_83869d29.webp`였다. Lighthouse checklist는 `requestDiscoverable: true`, `eagerlyLoaded: true`를 반환했다. 이전 기준선 9.8초와 비교해 lab LCP는 **8.4초**로 1.4초 낮아졌다.

| 항목 | 이전 기준선 | 이번 HTTPS lab 측정 | 해석 |
|---|---:|---:|---|
| Performance | 30 | 36 | lab result이며 field/CrUX 지표와 동일시하지 않음 |
| LCP | 9.8초 | 8.4초 | mobile logo가 LCP element로 선택됨 |
| FCP | 6.3초 | 4.6초 | 별도 proxy 환경의 단일 실행 값 |
| TBT | 미기록 | 1,631ms | preload 범위를 넘어선 다음 성능 작업 대상 |
| Request discoverable | false | true | 초기 HTML의 mobile logo preload가 발견됨 |
| Eagerly loaded | 해당 없음 | true | LCP logo가 lazy load되지 않음 |

네트워크 감사에서는 logical mobile logo가 `/manus-storage/`의 high-priority 307 한 번과 최종 `/api/storage/`의 200 한 번으로 나타났다. 이는 동일 이미지가 두 번 내려받힌 것이 아니라 managed-storage의 redirect chain이며, 최종 이미지 body는 한 번만 수신된다. background도 mobile viewport에서 preload되지 않고, 실제 background renderer의 `fetchPriority="low"` 요청만 발생했다. 따라서 모바일의 두 Hero resource는 더 이상 high-priority 경쟁 상태가 아니다.

다만 Lighthouse의 `priorityHinted` checklist는 false로 남았다. Lighthouse source는 LCP의 **최종 network request**의 `fetchPriorityHint` 값이 `high`일 때만 true로 판정한다.[1] 현재 `/manus-storage/` route는 `fetchpriority="high"`가 적용된 high-priority request를 먼저 만들지만, managed storage가 CloudFront signed URL 또는 `/api/storage/`로 redirect하면서 최종 request trace의 hint metadata를 전달하지 않는다. 공개 `star-pibu.com`에서도 동일 `/manus-storage/` URL은 307 redirect이고 `/api/storage/`만 200 image response를 반환한다.

현재 source contract에서 preload href와 rendered img `src`를 동일하게 유지하는 한, 이 redirect trace의 `priorityHinted` false는 client HTML/React 코드만으로 pass로 바꿀 수 없다. redirect를 우회해 `/api/storage/` URL을 새 정본으로 채택하면 audit 표시는 달라질 수 있지만, user-requested managed-storage URL identity와 기존 asset serving contract를 바꾸며 별도 검토가 필요하다. 이번 patch에서는 이를 강행하지 않았다.

## 검증 상태

`pnpm check`, `pnpm lint`(오류 0, 기존 경고 106), `pnpm test:unit`(219 files, 1,956 tests), `pnpm build`가 통과했다. `HeroImageFormats.test.ts`는 constants의 mobile logo/desktop background URL과 `client/index.html`의 viewport-specific preload href가 정확히 일치하고, 숨겨진 두 Hero background renderer가 high priority를 설정하지 않는지를 보호한다. build artifact와 Lighthouse JSON은 검증용이며 커밋하지 않는다.

## 승인 후 direct endpoint 검증

승인된 후속 검토에서 `/api/storage/star-logo-mobile_77b7502d_83869d29.webp`는 공개·개발 HTTPS 환경 모두에서 redirect 없이 HTTP 200, `image/webp`, 동일 ETag를 반환했다. 개발 endpoint에는 1년 immutable cache-control이 확인됐고, 공개 endpoint도 1년 cache-control을 반환했다. 이 route는 source상 검증된 storage key만 처리하고, image bytes·content type·ETag·cache control을 직접 반환하므로 mobile Hero asset의 기존 same-origin delivery 계약과 호환된다.

따라서 mobile Hero logo constant와 mobile preload href를 같은 direct `/api/storage/` URL로 함께 전환했다. 최종 HTTPS mobile Lighthouse에서 LCP element는 같은 `img.hero-mobile-logo-img`였고, 세 checklist가 모두 true로 통과했다.

| Lighthouse LCP request discovery checklist | 최종 결과 |
|---|---|
| `requestDiscoverable` | true |
| `priorityHinted` | true (`fetchpriority=high applied`) |
| `eagerlyLoaded` | true |

network audit에서도 mobile logo는 `/api/storage/` HTTP 200 한 번만, High priority로 요청됐다. background는 legacy `manus-storage` 301→API 200 redirect chain을 유지하지만 Low priority이므로 mobile LCP logo와 경쟁하지 않는다. 최종 single-run lab LCP는 8.4초로 이전 9.8초 기준선보다 1.4초 낮았다. 단일 lab 값은 field/CrUX를 대체하지 않으며, 다음 운영 검토는 실제 production release 뒤 PageSpeed Insights 및 field data로 진행해야 한다.[2]

`pnpm check`, `pnpm lint`(오류 0, 기존 경고 106), `pnpm test:unit`(219 files, 1,956 tests), `pnpm build`도 direct endpoint 전환 뒤 다시 통과했다.

## References

[1]: https://raw.githubusercontent.com/ChromeDevTools/devtools-frontend/main/front_end/models/trace/insights/LCPDiscovery.ts "Chromium DevTools — LCPDiscovery priority hint evaluation"
[2]: https://developer.chrome.com/docs/performance/insights/lcp-discovery "Chrome for Developers — LCP request discovery"

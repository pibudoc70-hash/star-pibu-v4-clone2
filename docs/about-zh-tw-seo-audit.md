# About zh-TW SEO 정합성 감사

**작성일:** 2026-08-21  
**범위:** `/zh-tw/about`의 runtime metadata, canonical/hreflang, OG locale, visible copy, source fallback  
**결론:** About prerender는 **현재 보류**한다. shared route/canonical infrastructure는 zh-TW를 지원하지만, About page-local metadata와 일부 visible label이 Korean fallback을 사용하고 client DOM에는 duplicate hreflang가 남아 있다.

## 실제 route 확인

개발 route `/zh-tw/about`의 hydration 후 DOM을 확인했다. `html[lang]`은 `zh-Hant`, canonical은 `https://star-pibu.com/zh-tw/about`, `og:locale`은 `zh_TW`로 정상이다. About 본문·진료시간·교통 정보는 `i18n.zh-TW.ts`의 Traditional Chinese override를 사용한다.

| 항목 | 실제 결과 | source | 판정 |
|---|---|---|---|
| URL/canonical | `/zh-tw/about` → `https://star-pibu.com/zh-tw/about` | `getLocalizedUrl(lang, "/about")` | 정상 |
| document language | `zh-Hant` | locale context/runtime document language | 정상 |
| OG locale | `zh_TW` | `LANG_TO_OG_LOCALE[lang]` | 정상 |
| body title/description | `關於STAR皮膚科` 및 Traditional Chinese about copy | `i18n.zh-TW.ts#about` | 정상 |
| access/hours | Traditional Chinese labels·주소·시간 | `i18n.zh-TW.ts#access/#hours` | 정상 |
| page title/description/keywords | Korean fallback | `About.tsx`의 `en/ja/zh` branch 후 default | **불일치** |
| OG title/description | Korean default content | About page SEO branch + static shell metadata | **불일치** |
| local labels | `피부과 소개`, `의료진 소개 보기 →`, `주소`, `지하철`, `버스`, `주차` | `About.tsx` page-local ternaries | **불일치** |
| hreflang target set | ko/en/ja/zh/zh-TW/x-default target 자체는 올바름 | `buildHreflangs` + shared helper | target은 정상 |
| hreflang count | hydration 후 locale set이 2회 존재 | static `client/index.html` home alternate links + `SeoHead` page alternate links | **중복** |

## 원인 경계

`About.tsx`는 SEO title, description, keywords와 access labels, about label, image alt, since label, breadcrumb, doctors link label을 `en`, `ja`, `zh`만 조건 분기한다. `lang === "zh-TW"`일 때는 모두 final Korean default branch로 들어간다. 반면 body의 `t.about`, `t.hours`, `t.access`는 `zhTW` locale pack을 사용하므로 한 화면에서 Traditional Chinese body와 Korean page-local label/metadata가 혼합된다.

`client/index.html`에는 homepage route용 canonical, OG locale alternates, 6개 hreflang link가 static으로 존재한다. `SeoHead`는 About route의 alternate set을 별도로 추가하므로 client DOM에는 같은 hreflang relationship이 두 세트로 관찰된다. `server/_core/seoMeta.ts`는 server prerender helpers가 사용할 때 canonical/alternate duplicate를 제거하지만, About은 현재 해당 prerender helper를 사용하지 않는다.

## Prerender 도입 전 필수 조건

| 우선순위 | 선행 작업 | 이유 |
|---|---|---|
| P0 | About의 zh-TW page-local title, description, keywords, OG title/description, breadcrumb, small labels에 승인된 Traditional Chinese source를 제공 | crawler summary가 Korean metadata를 고정하지 않도록 함 |
| P0 | static shell alternate links와 page `SeoHead` alternates의 single-owner policy를 확정 | hydrated DOM과 raw response에 중복 hreflang/canonical을 남기지 않음 |
| P1 | `/zh-tw/about` raw production response와 hydrated DOM을 분리해 title, description, canonical, 6 hreflang, OG locale/title, visible labels의 count/value를 response test로 고정 | manual prerender/helper 추가 전 회귀 기준 확보 |
| P1 | Korean master claim과 zh-TW translation을 clinic copy confirmation ledger의 승인 workflow로 연결 | 1:1, 10,000명, 결과·안전성 claim을 fallback으로 확대하지 않음 |

## 안전한 다음 결정

이번 감사는 code·SEO tags·locale copy·route·prerender middleware를 변경하지 않았다. About prerender는 P0 source/ownership 조건이 충족된 뒤 **metadata/localization-only change set**을 먼저 적용하고, 그 다음에 Doctors와 같은 production-only crawler summary pilot을 별도 작업으로 검토해야 한다. 현재는 static body가 localized되어 있다는 이유만으로 prerender를 확대하지 않는다.

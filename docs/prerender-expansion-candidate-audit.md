# 주요 랜딩 페이지 prerender 확대 후보 감사

**작성일:** 2026-08-21  
**범위:** event, doctors, about의 live route·locale·metadata·data freshness·build/운영 경계  
**결론:** 이번 단계에서는 prerender 구현·route·SEO를 변경하지 않는다. **Doctors는 조건부 우선 후보**, **About은 locale 정합성 확인 후 후보**, **Event는 DB-aware 별도 설계 전 보류**다.

## 현재 prerender surface

서버 bootstrap은 static serving 이전에 home, equipment, content, treatment prerender를 등록한다. Home prerender는 5개 언어 루트에 FAQ JSON-LD와 crawler markup을 template에 직접 주입하고, `s-maxage=300`과 stale-while-revalidate cache policy를 사용한다. Content prerender는 research static article과 notice DB article을 분리하며, notice는 request 시 DB를 읽고 no-cache로 응답한다.

| 현재 surface | route 성격 | source/freshness | 운영 특성 |
|---|---|---|---|
| Home | `/`, `/en`, `/ja`, `/zh`, `/zh-tw` | i18n + shared static FAQ | manual HTML assembly, 5분 CDN cache |
| Equipment/Treatment detail | 상세 static content | module/static data | dedicated helper와 focused tests 보유 |
| Research | 5개 locale live route | fixed article constants | no-cache HTML injection |
| Notice detail | `/notice/:id`, `/:lang/notice/:id` | DB notice·images | request-time DB, no-cache, article JSON-LD |

## 후보별 판단

| 후보 | live route·locale | metadata/JSON-LD | data freshness | prerender 적합성 | 판정 |
|---|---|---|---|---|---|
| Doctors | `/doctors` 및 `/en`·`/ja`·`/zh`·`/zh-tw` prefixes | `getDoctorsSeoContent`, OG locale/image/site name, Physician+Breadcrumb JSON-LD | `useDoctorViewModel(t)`이 static doctor data와 i18n을 조합; network query 없음 | 높음. content가 정적이고 SEO density가 높음 | **조건부 우선 후보** |
| About | `/about` 및 4개 locale prefix | inline localized title/description/keywords, OG, breadcrumb | i18n `t.about`/`t.hours`/`t.access` 및 fixed image; network query 없음 | 중간~높음. static content이나 inline locale branching이 큼 | **locale audit 후 후보** |
| Event detail | `/events/:id` | fetched event에서 title/description/canonical/Event JSON-LD 조합 | `trpc.events.getById` runtime query; server procedure view side effect와 DB event freshness | 낮음. manual snapshot은 stale/side-effect/locale risk | **보류** |
| Home Event section | home `#events` below-fold | page SEO가 아닌 section rendering | visibility-triggered `trpc.events.special`, 10분 stale time | 낮음. lazy DB content를 root prerender에 포함하면 initial HTML·freshness 경계가 바뀜 | **보류** |

## Doctors: 도입 전 충족 조건

Doctors는 runtime DB fetch가 없고 page-level SEO와 Physician JSON-LD가 이미 순수 helper로 분리돼 있다. 다만 현재 home 방식은 React SSR이 아니라 template의 `#root`에 crawler markup을 manual injection하는 설계다. 따라서 구현 전 다음을 별도 change set으로 확정해야 한다.

1. 5개 locale의 heading, active-first physician, credentials summary, canonical, hreflang, OG locale/image, Physician/Breadcrumb JSON-LD를 하나의 input contract로 정의한다.
2. browser-only 탭·swipe·hash/sessionStorage scroll restoration을 crawler markup에서 재현하려 하지 않는다. prerender는 의미 있는 initial static content만 제공하고 React client가 기존 interaction을 그대로 hydrate/replace해야 한다.
3. generated markup의 doctor name·alt·specialty·credential summary를 `doctors-data`와 `doctorsSeo` changes에 맞춰 regression test로 보호한다.
4. manual HTML assembly가 duplicate SEO tag, root hydration mismatch, outdated source duplication을 만들지 않는지 production response test로 확인한다.

## About: locale 정합성 선행 조건

About은 DB query 없이 i18n content와 fixed asset으로 렌더되므로 기술적으로 static candidate다. 그러나 current metadata branch와 page lifecycle comment는 `ko/en/ja/zh`를 명시하고, routing은 `/zh-tw/about`도 생성한다. 그 상태에서 crawler markup을 추가하면 Traditional Chinese의 canonical, visible copy, breadcrumb, OG locale을 별도 검증하지 않은 채 두 번째 SEO surface를 만드는 결과가 된다.

About prerender를 논의하려면 먼저 `zh-TW` path의 actual rendered metadata와 `buildHreflangs` coverage, locale fallback source, fixed SEO strings의 Traditional Chinese wording을 read-only로 감사해야 한다. 해당 감사가 통과하기 전에는 About에 prerender helper를 추가하지 않는다.

## Event: 현재 보류 이유

Event detail은 client query가 event ID로 DB row를 가져온 뒤 metadata와 Event JSON-LD를 생성한다. 해당 route의 server-side get flow에는 view counter side effect도 있으므로, client endpoint를 prerender request에서 재사용하면 crawler hit가 analytics/view count를 변경할 수 있다. 반대로 별도 DB read path를 만들면 cache invalidation, event activation/translation changes, no-cache policy, not-found response, locale coverage를 새로 설계해야 한다.

따라서 Event prerender는 단순 homepage 방식 확장이 아니다. 병원 운영 데이터와 DB response contract를 포함하는 별도 feature로 분리하며, 현재 동결 범위에서는 구현하지 않는다.

## 권장 순서

1. **Doctors only technical design:** pure locale input, generated semantic summary, 5-locale response tests, hydration/SEO duplicate checks를 설계한다.
2. **About zh-TW SEO audit:** metadata·canonical·hreflang·visible text의 current behavior를 먼저 검증한다.
3. **Event를 제외한 채 재판정:** Doctors pilot의 build time, HTML size, crawler response와 client navigation QA 결과가 만족될 때만 About을 검토한다.

이 문서는 route, SEO helper, prerender middleware, database, CTA를 변경하지 않았다.

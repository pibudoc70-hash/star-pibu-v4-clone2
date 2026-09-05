# i18n 비한국어 동적 청크 설계안

## 목적과 범위

이 문서는 **구현 승인을 위한 설계안**이다. 현재 작업에서는 `i18n`, `LangContext`, `I18nContent`, `useLang().t` 또는 라우팅 코드를 변경하지 않는다. 목표는 한국어 방문자의 초기 JavaScript에서 en·ja·zh·zh-TW 번역 본문을 제외하되, 모든 기존 컴포넌트가 사용하는 공개 타입과 호출 형태를 유지하는 것이다. 기존 측정의 비한국어 문자열 원시 UTF-8 크기 기회는 약 **74KB**이며, 실제 전송 절감량은 minify·압축 후 다음 구현 PR에서 재측정한다.

| 영역 | 현재 계약 | 설계 후에도 유지할 계약 |
|---|---|---|
| 언어 타입 | `Lang` | `ko \| en \| ja \| zh \| zh-TW` |
| 번역 타입 | `I18nContent` | 객체 형상과 key 경로 무변경 |
| 컨텍스트 | `LangContext` | `{ lang, setLang(lang, persist?), t }` 무변경 |
| 훅 | `useLang()` | `useLang().t.section.key` 호출 무변경 |
| 공개 모듈 | `@/lib/i18n` | `i18n`, `Lang`, `I18nContent`, label/code/flag export 경로 무변경 |

## 권장 모듈 경계

클라이언트 엔트리에는 `i18n.ko.ts`와 type·언어 메타데이터만 정적으로 남긴다. `i18n.en.ts`, `i18n.ja.ts`, `i18n.zh.ts`, `i18n.zh-TW.ts`는 각각 독립적인 동적 import 대상이 된다. Vite는 이를 해시된 locale chunk로 출력하며, 한국어 경로는 이 네 chunk에 대한 정적 import나 modulepreload를 가져서는 안 된다.

```ts
// 번역 레지스트리의 개념적 형태 — 구현 예시가 아니라 계약이다.
const loaded: Partial<Record<Lang, I18nContent>> = { ko };
const localeLoaders: Record<Exclude<Lang, "ko">, () => Promise<I18nContent>> = {
  en: () => import("./i18n.en").then(m => m.en),
  ja: () => import("./i18n.ja").then(m => m.ja),
  zh: () => import("./i18n.zh").then(m => m.zh),
  "zh-TW": () => import("./i18n.zh-TW").then(m => m.zhTW),
};
```

`i18n` export는 호환 façade로 남긴다. 서버 전용 prerender entry에는 동기 전체 레지스트리를 제공하고, 브라우저 entry에는 `ko`만 즉시 채운 registry를 제공한다. 비한국어 값이 아직 로드되지 않은 상태에서 일반 렌더가 `i18n[lang]`를 읽는 구조는 허용하지 않는다. 구현 전 direct `i18n[lang]` call site를 모두 감사하고, 컨텍스트의 `t`를 사용하도록 전환하거나 동일한 locale-ready gate 아래에 두어야 한다. 이것이 API 이름·타입을 보존하면서도 한국어 fallback을 화면에 노출하지 않는 조건이다.

## 한국어 플래시 방지

> 비한국어 URL에서는 한국어 `t`를 임시로 제공하지 않는다. locale module이 준비되기 전에는 해당 locale의 최소 로딩 shell만 보인다.

초기 언어는 `localStorage`보다 URL locale을 우선한다. `/en`, `/ja`, `/zh`, `/zh-tw` 및 그 하위 route는 서버가 prerender 또는 기본 HTML에 주입한 `initialLocale`에서 동기적으로 결정한다. 클라이언트 bootstrap은 이 locale이 ko가 아니면 앱 트리를 mount하기 전에 해당 번역 promise를 시작하고, `LocaleReadyGate`가 완료될 때까지 이전 페이지를 유지하거나 route-언어에 맞춘 짧은 로딩 shell을 표시한다. loading shell의 문자열도 locale metadata의 작은 정적 map으로 관리한다.

| 진입 상태 | 표시 정책 | 금지 사항 |
|---|---|---|
| `/` 또는 ko route | ko를 동기 mount | locale import 지연으로 ko를 막지 않음 |
| 비한국어 직접 진입 | target locale load 완료 뒤 app hydrate/mount | ko `t`로 1프레임이라도 렌더 금지 |
| 언어 전환 | target module 준비 후 `setLang`·route 이동 | 먼저 route를 이동해 ko fallback 노출 금지 |
| locale load 실패 | 현재 언어를 유지하고 재시도 affordance 제공 | target route에 ko 본문을 대체 표시 금지 |

브라우저 history 복원과 hydration에서 route locale과 stored language가 충돌할 때도 URL locale을 우선해야 한다. 저장소 값은 locale 접두사가 없는 경로의 기본 언어 선택에만 사용한다. `setLang`의 인자·persist 기본값은 유지하며, 내부적으로는 promise 완료 후 state를 바꾸는 방식으로 확장한다.

## prerender 및 SEO 소유권

서버 home prerender는 브라우저 Vite chunk와 별개의 server bundle이다. 서버는 현재와 같이 동기 전체 translation registry를 사용하고 raw HTML의 본문·`lang`·title·description·canonical·hreflang·JSON-LD를 생성한다. 따라서 클라이언트 dynamic import가 crawler HTML의 텍스트 또는 metadata 소유권을 바꾸지 않는다. 구현 PR에서는 다음 네 계층을 독립적으로 확인한다.

| 검증 | 기대값 |
|---|---|
| raw `GET /`, `/en`, `/ja`, `/zh`, `/zh-tw` | 현재와 같은 locale별 body 텍스트·`html[lang]`·canonical·hreflang·JSON-LD |
| JavaScript 비활성/크롤러 응답 | browser chunk 요청 없이 server prerender HTML 유지 |
| hydrate 후 document head | canonical 1개, hreflang 6개, locale별 OG locale 1개 |
| browser non-ko cold start | 번역 loader 완료 전 한국어 본문 0개, 완료 뒤 missing key 0개 |

## 실패·캐시·성능 운영 원칙

locale promise는 세션 메모리에서 언어별로 한 번만 dedupe한다. 이미 방문한 언어는 같은 세션에서 즉시 재사용하며, header language menu의 hover/focus 또는 `IntersectionObserver`에 의한 **명시적 저우선 prefetch**만 허용한다. ko 첫 방문에는 non-ko prefetch를 자동 실행하지 않는다. 네 번역 모듈은 코드 변경 시 기존 Vite 해시 정책으로 무효화된다.

이 설계의 확정 전 위험은 다섯 가지다. 첫째, 직접 `i18n[lang]` 접근 누락은 flash 또는 missing key를 만들 수 있다. 둘째, locale gate와 prerender hydration marker가 어긋나면 hydration mismatch가 생길 수 있다. 셋째, 언어 전환 중 실패 처리의 UI 문자열도 target locale에 의존할 수 있다. 넷째, locale chunk가 너무 작게 분할되면 요청 수가 전송량 절감 효과를 상쇄할 수 있다. 다섯째, raw 74KB는 압축 전 텍스트 기준이므로 전송 바이트의 확정 수치가 아니다.

## 구현 승인 전 필수 게이트

1. `i18n` direct access, server prerender import, route initial-language 결정 지점을 목록화하고 bundle graph에서 ko entry→non-ko chunk static edge가 0인지 확인한다.
2. 5개 locale의 raw production-like prerender HTML와 hydrate DOM을 snapshot 비교하고, non-ko cold start의 화면 녹화 또는 DOM observer로 한국어 flash 0회를 확인한다.
3. ko initial JS gzip/brotli bytes, non-ko 추가 locale chunk bytes, request 수, LCP/TBT를 구현 전후 동일 조건에서 비교한다.
4. `pnpm test`, `pnpm check`, `pnpm lint`, production build 및 기존 SEO/head ownership 회귀 테스트를 통과시킨다.

CSS Coverage 삭제 감사는 이 설계와 무관하며, 기존 **STEP 6 보류**를 유지한다.

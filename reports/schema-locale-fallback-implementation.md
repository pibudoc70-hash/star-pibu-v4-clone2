# 다국어 구조화 데이터 언어 코드·기본값 폴백 구현 결과

## 구현 범위

공유 structured-data builder가 한국어, 영어, 일본어, 중국어 간체, 중국어 번체 페이지에 대해 정확한 BCP 47 `inLanguage`와 검증된 병원 이름·설명을 제공하도록 보완했습니다. 이 변경은 schema JSON-LD와 서버 프리렌더의 텍스트 선택 규칙에만 적용되며, 페이지에 표시되는 번역 문구, canonical, hreflang, sitemap 적격성 규칙은 변경하지 않습니다.

| 대상 locale | HTML `lang` | JSON-LD `inLanguage` | clinic/website name |
|---|---|---|---|
| 한국어 | `ko` | `ko` | 부산 서면 스타피부과 |
| 영어 | `en` | `en` | Star Dermatology Busan |
| 일본어 | `ja` | `ja` | 釜山スター皮膚科 |
| 중국어 간체 | `zh-Hans` | `zh` | 釜山STAR皮肤科 |
| 중국어 번체 | `zh-Hant` | `zh-TW` | 釜山STAR皮膚科 |

HTML의 중국어 script 표기(`zh-Hans`, `zh-Hant`)와 JSON-LD의 BCP 47 locale 표기(`zh`, `zh-TW`)는 목적이 다르므로 기존 계약을 유지했습니다. JSON-LD에는 요청에 따라 locale별 단일 언어 코드를 명시합니다.

## 단일 정본과 폴백 정책

`client/src/lib/seoHelpers.ts`에 `SchemaLocale`, `normalizeSchemaLocale`, `schemaLocaleFromOgLocale`, `withSchemaLanguage`, `buildLocalizedClinicJsonLd`, `buildLocalizedWebSiteJsonLd`를 추가했습니다. `SeoHead`와 home/equipment/treatment prerender는 이 builder를 사용해 조직·웹사이트·페이지 schema에 동일한 `inLanguage`을 부여합니다.

| 상황 | 동작 | 사용자 화면 영향 |
|---|---|---|
| 지원 locale의 clinic/website schema | 해당 언어의 병원명·소개·`inLanguage` 사용 | 없음 |
| locale이 없거나 지원하지 않음 | 한국어 clinic/website schema와 `inLanguage: ko` 사용 | 없음 |
| 장비/시술의 locale 텍스트가 존재 | 기존 번역을 보존하고 요청 locale의 `inLanguage` 사용 | 없음 |
| 장비/시술의 locale 텍스트가 비어 있거나 FAQ 배열이 비어 있음 | 한국어 원문으로 폴백하고 요청 locale의 페이지 schema 언어는 유지 | 없음 |
| 번체 중국어용 별도 필드가 없는 시술 프리렌더 | 한국어 원문으로 폴백하고 `inLanguage: zh-TW` 사용 | 없음 |

빈 문자열도 번역으로 취급하지 않도록 `trim()` 및 FAQ 배열 길이 검사를 사용했습니다. 따라서 번역 데이터가 누락된 경우 공백 제목·설명·FAQ를 schema에 내보내지 않고, 검증된 한국어 기본값을 사용합니다. 이 정책은 불완전한 locale 내용을 억지로 다른 언어로 번역하지 않으며, 기존에 유효한 영어·일본어·중국어 텍스트를 덮어쓰지 않습니다.

## 검증 결과

| 검증 | 결과 |
|---|---|
| 공유 builder 단위 테스트 | PASS — 5개 지원 locale의 clinic·website `inLanguage`/이름과 undefined·unsupported의 한국어 기본값을 검증 |
| 홈 프리렌더 | PASS — `/`, `/en`, `/ja`, `/zh`, `/zh-tw`의 HTML 언어와 JSON-LD 언어·병원명을 검증 |
| 장비 프리렌더 | PASS — 영어·일본어·간체·번체 `inLanguage`, 번체 전용 이름 누락 시 한국어 기본값, 빈 영어 필드 폴백을 검증 |
| client schema ownership | PASS — `SeoHead` hydration 관련 기존 16개 테스트 통과 |
| 전체 회귀 | PASS — 205개 테스트 파일, 1,891개 테스트 통과 |
| TypeScript | PASS — `pnpm check` 통과 |
| Lint | PASS — 오류 0건. 기존 경고 106건 외 신규 경고 없음 |
| 브라우저 표본 | PASS — `/en`, `/ja`, `/zh-tw`가 초기 로더 해제 후 현지화된 제목·navigation·FAQ·장비 목록을 렌더링. 상세 관찰은 `reports/schema-locale-browser-verification.md`에 기록 |

## 남은 운영 과제

이번 구현은 **누락 데이터의 표시 안정성**을 개선한 것이며, 누락된 의료 콘텐츠를 새로 번역하지는 않습니다. 다국어 sitemap은 계속해서 locale별 제목·소개·FAQ가 모두 있는 상세 페이지만 포함합니다. 시술의 번체 중국어 전용 필드를 완성하려면 의료진 또는 번역 검수자가 한국어 원문과 번체 번역을 승인한 뒤, 데이터에 직접 입력해야 합니다. 해당 데이터 보완 이후에는 sitemap 적격성 결과와 실제 원시 HTML을 다시 점검해야 합니다.

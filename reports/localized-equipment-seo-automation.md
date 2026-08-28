# 자동 장비 대상 SEO URL 및 다국어 JSON-LD 회귀 검증

## 구현 요약

수동으로 유지하던 72개 장비 slug 문자열 fixture를 제거했습니다. 이제 `client/src/lib/localizedEquipmentSeoMatrix.test.ts`는 production sitemap과 같은 `buildLocalizedEquipmentEntries()` 적격성 helper의 반환값에서 테스트 slug를 계산합니다. 따라서 새 장비가 활성 상태이고 해당 locale의 제목·소개·FAQ 조건을 충족하면, 테스트 입력에 그 레코드가 전달되는 즉시 별도 slug 목록 수정 없이 canonical·hreflang matrix에 포함됩니다.

이것은 별도 스케줄러나 background job이 아니라, 테스트 실행마다 현재 입력 데이터에서 대상 집합을 산출하는 방식입니다. sitemap과 테스트가 같은 적격성 규칙을 사용하므로, 새 장비가 sitemap에 포함되는 경로와 SEO URL 검증 경로가 분리되지 않습니다.

| 입력 fixture | sitemap 적격성 결과 | 자동 SEO URL 대상 |
|---|---|---|
| 기존 완결 장비 | 5개 locale 모두 포함 | 포함 |
| `newly-added-device` 완결 장비 | 새 slug라도 5개 locale 모두 포함 | 별도 목록 수정 없이 포함 |
| 번체 FAQ 누락 장비 | 번체만 제외, 나머지 4개 locale 포함 | 영어 matrix에는 포함, 번체 sitemap에는 제외 |

## Breadcrumb·FAQ JSON-LD 추가

한국어·영어·일본어·중국어 간체·중국어 번체의 장비 상세 JSON-LD에 `BreadcrumbList`를 추가했습니다. 기존 `FAQPage`는 공통 `buildFAQPageJsonLd()` builder를 사용하도록 정리하고 두 schema 모두 locale-aware `inLanguage`와 self-canonical 기반 `@id`를 가집니다.

| schema | ID 규칙 | 검증 내용 |
|---|---|---|
| `BreadcrumbList` | `${pageUrl}#breadcrumb` | 홈과 현재 장비 2단계, 마지막 item이 요청 locale의 self-canonical URL, locale별 홈 이름과 `inLanguage` |
| `FAQPage` | `${pageUrl}#faq` | locale FAQ가 존재하면 해당 번역 질문·답변, 누락·빈 배열이면 기존 한국어 기본값, page locale `inLanguage` |
| `MedicalProcedure` | `${pageUrl}#medical-procedure` | 기존 entity 유지, Breadcrumb·FAQ와 동일한 self-canonical namespace |

서버 `equipmentPrerender`는 5개 지원 locale 전체에 대해 Breadcrumb·FAQ `@id`, 마지막 breadcrumb item, locale 홈 이름, `inLanguage`, 한국어 fallback FAQ를 검증합니다. 영어 FAQ가 존재할 때 번역 질문·답변을 schema에 쓰는 경우도 별도 검증합니다. 클라이언트 상세 component test는 shared builder·self URL·`SeoHead` 전달 계약을 보호합니다.

## 검증 결과

| 검증 | 결과 |
|---|---|
| 집중 SEO matrix·sitemap·장비 prerender 테스트 | PASS — 4개 파일, 31개 테스트 통과 |
| 전체 회귀 | PASS — 207개 테스트 파일, 1,909개 테스트 통과 |
| TypeScript | PASS — `pnpm check` 통과 |
| Lint | PASS — 오류 0건, 기존 경고 106건 외 신규 경고 없음 |
| 실제 영문 장비 상세 DOM | PASS — BreadcrumbList·FAQPage가 각각 1개, self URL과 `inLanguage: en`, FAQ 7개를 확인 |
| 변경 범위 | production에서는 `Equipment3Detail.tsx`, `equipmentPrerender.ts`에 Breadcrumb/공통 FAQ schema 조립만 추가. DB·번역 데이터·route·sitemap 생성 규칙·예약/OTP·보이는 콘텐츠는 변경하지 않음 |

## 유지보수 규칙

신규 장비가 추가될 때 테스트 slug 문자열을 수정하지 않습니다. 장비 레코드의 `isActive`, locale별 `name*`, `desc*`, `faqs*`가 sitemap 적격성 helper를 통과하면 URL matrix가 자동으로 해당 slug를 검사합니다. 반대로 번역이 빠진 locale은 sitemap과 해당 locale의 URL matrix에서 제외되므로, 누락 번역을 한국어 URL로 위장하지 않습니다. 다국어 페이지의 JSON-LD는 콘텐츠가 없을 때만 기존 한국어 fallback을 사용합니다.

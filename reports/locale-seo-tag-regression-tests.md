# 다국어 canonical·hreflang 회귀 테스트 추가

## 목적

번역 콘텐츠가 갱신되더라도 URL 표준화 규칙이 변하지 않도록, `SeoHead`의 실제 head 출력과 장비 상세의 locale 기반 URL 조립을 테스트로 고정했습니다. 이번 변경은 테스트와 검증 기록만 포함하며 production SEO 구현, 번역 데이터, canonical, hreflang, sitemap, 라우트는 변경하지 않습니다.

## 추가된 테스트

| 테스트 파일 | 보호하는 계약 |
|---|---|
| `client/src/components/SeoHead.hydration.test.tsx` | 홈·About·Doctors에 더해 대표 장비 상세까지 4개 surface × 5개 locale, 총 20개 head 렌더링을 검사합니다. 각 경우 canonical은 정확히 1개이고 요청 locale의 self URL이며, alternate는 `ko`, `en`, `ja`, `zh`, `zh-TW`, `x-default` 6개입니다. 각 alternate href가 정확한 locale URL이고 query/fragment가 없음을 확인합니다. |
| `client/src/pages/Equipment3Detail.seoLocale.test.ts` | 장비 상세 canonical과 OG URL이 `getLocalizedUrl(lang, /equipment3/:slug)`에서 생성되어 화면 탭 query를 포함하지 않는지 검사합니다. 한국어·영어·일본어·중국어 간체의 명시 경로와 helper가 보완하는 번체 중국어 alternate 계약도 함께 잠급니다. |

## locale URL 매트릭스

| hreflang | 홈 | 장비 상세 예시 |
|---|---|---|
| `ko` | `https://star-pibu.com/` | `https://star-pibu.com/equipment3/ultherapy-prime` |
| `en` | `https://star-pibu.com/en` | `https://star-pibu.com/en/equipment3/ultherapy-prime` |
| `ja` | `https://star-pibu.com/ja` | `https://star-pibu.com/ja/equipment3/ultherapy-prime` |
| `zh` | `https://star-pibu.com/zh` | `https://star-pibu.com/zh/equipment3/ultherapy-prime` |
| `zh-TW` | `https://star-pibu.com/zh-tw` | `https://star-pibu.com/zh-tw/equipment3/ultherapy-prime` |
| `x-default` | `https://star-pibu.com/` | `https://star-pibu.com/equipment3/ultherapy-prime` |

테스트 fixture의 slug는 URL 경로 계약만 분리해 검증하기 위한 값입니다. 실제 장비 slug나 번역 콘텐츠가 달라져도, page component가 locale과 slug를 입력으로 삼아 canonical·alternate URL을 계산하는 규칙이 바뀌면 테스트가 실패합니다.

## 검증 결과

| 검증 | 결과 |
|---|---|
| locale SEO 집중 테스트 | PASS — 3개 파일, 70개 테스트 통과 |
| TypeScript | PASS — `pnpm check` 통과 |
| Lint | PASS — 오류 0건, 기존 경고 106건 외 신규 경고 없음 |
| 변경 범위 | PASS — 회귀 테스트 2개, TODO, 본 기록만 변경. SEO 구현·번역 데이터·DB·sitemap·라우트는 변경 0건 |

## 유지보수 규칙

번역 문구·FAQ·소개 문장을 수정할 때에는 이 테스트를 그대로 실행합니다. 새로운 다국어 page surface를 추가하면 locale 매트릭스에 해당 surface를 추가하고, canonical은 현재 locale의 self URL, hreflang은 여섯 alternate의 고정 집합, `x-default`는 한국어 URL이라는 규칙을 함께 검증해야 합니다. 특정 locale의 콘텐츠가 비어 sitemap 대상에서 제외되더라도 canonical과 hreflang의 URL 계약은 별도 문제이므로, 두 검증을 대체하지 않습니다.

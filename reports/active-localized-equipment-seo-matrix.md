# 전체 다국어 장비 상세 canonical·hreflang 회귀 테스트 확장

## 구현 결과

기존의 대표 장비 1개만 검사하던 canonical·hreflang 회귀 범위를, 현재 `sitemap-global.xml`에 포함된 활성·번역 완결 장비 상세 **72개 전체**로 확장했습니다. 전수 대상은 공개 sitemap의 영어 장비 상세 URL 72개를 기준으로 고정했고, 각 slug에 한국어·영어·일본어·중국어 간체·중국어 번체의 canonical과 여섯 hreflang alternate를 검증합니다.

| 검사 범위 | 수량 |
|---|---:|
| 활성·번역 완결 장비 slug | 72개 |
| locale별 self-canonical | 360개 (72 × 5 locale) |
| 페이지별 hreflang alternate | 6개 (`ko`, `en`, `ja`, `zh`, `zh-TW`, `x-default`) |
| 전체 hreflang URL 단언 | 432개 (72 × 6) |
| 신규 전수 matrix 테스트 | 73개 (목록 정합성 1 + slug별 72) |

## 보호하는 URL 계약

각 장비 slug에 대해 다음 규칙을 테스트로 고정했습니다.

| locale | canonical 패턴 | hreflang |
|---|---|---|
| 한국어 | `https://star-pibu.com/equipment3/:slug` | `ko` 및 `x-default` |
| 영어 | `https://star-pibu.com/en/equipment3/:slug` | `en` |
| 일본어 | `https://star-pibu.com/ja/equipment3/:slug` | `ja` |
| 중국어 간체 | `https://star-pibu.com/zh/equipment3/:slug` | `zh` |
| 중국어 번체 | `https://star-pibu.com/zh-tw/equipment3/:slug` | `zh-TW` |

모든 canonical과 alternate URL은 query string 및 fragment를 포함하지 않으며, `x-default`는 해당 장비의 한국어 self URL을 가리킵니다. 기존 `SeoHead` hydration matrix와 장비 상세 source contract는 그대로 유지되어, 실제 head 렌더링의 canonical 1개·alternate 6개 계약과 component의 locale+slug 조립 방식도 계속 별도로 보호합니다.

## 검증 결과

| 검증 | 결과 |
|---|---|
| 전수 장비 SEO URL matrix + 기존 locale SEO 테스트 | PASS — 3개 파일, 96개 테스트 통과 |
| 전체 회귀 | PASS — 207개 파일, 1,971개 테스트 통과 |
| TypeScript | PASS — `pnpm check` 통과 |
| Lint | PASS — 오류 0건, 기존 경고 106건 외 신규 경고 없음 |
| 전수 대상 확인 | PASS — 공개 `sitemap-global.xml`에서 영어 장비 상세 URL 72개, unique 72개 추출 |
| 변경 범위 | PASS — 테스트·TODO·이 기록만 변경. SEO 구현, 번역 데이터, DB, route, sitemap 생성 코드, 페이지 표시 문구는 변경 0건 |

## 유지보수 안내

새 장비가 네 locale의 제목·소개·FAQ 조건을 충족해 sitemap에 들어가면 이 72개 slug fixture도 함께 갱신해야 합니다. fixture 수와 중복 검사가 있으므로, 새 URL을 sitemap에 넣고 테스트 대상을 갱신하지 않으면 review에서 대상 수 차이를 즉시 확인할 수 있습니다. 반대로 번역이 불완전해 sitemap에서 제외되는 장비는 이 전수 indexed-detail matrix에 포함하지 않습니다.

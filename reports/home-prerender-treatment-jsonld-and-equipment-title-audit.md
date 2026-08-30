# 홈 Prerender·대표 시술 JSON-LD·장비 카드 다국어 제목 점검

## 1. Homepage prerender `/treatments` discovery link — 읽기 전용 결과

`server/_core/homePrerender.ts`의 crawler body는 시술·장비 섹션의 discovery link로 `${BASE_URL}/treatments`를 출력합니다. 그러나 `LANG_ROUTES`에는 `treatments/:slug` 상세 route만 있고 `/treatments` 목록 route는 없습니다. 실제 header의 “시술·장비소개” 메뉴와 장비 목록 page의 canonical destination은 `/equipment3`입니다.

| 확인 대상 | 결과 | 이번 작업의 처리 |
|---|---|---|
| homepage prerender crawler link | `https://star-pibu.com/treatments` | 존재하지 않는 목록 경로를 가리킴 |
| SPA routes | `/equipment3`·`/:lang/equipment3` 목록 route 존재, `/treatments` 목록 route 없음 | 문제 근거 확인 |
| header primary navigation | 시술·장비소개 → `/equipment3` | UI와 prerender의 목적지 불일치 확인 |
| 변경 여부 | 0건 | 요청대로 read-only audit만 수행 |

이 링크는 시술 상세 BreadcrumbList와 별도의 crawler body surface입니다. 기존 checkpoint에서 수정한 상세 Breadcrumb item 2와 섞어 수정하지 않았습니다. homepage crawler link의 변경은 raw homepage response·다국어 link destination·hydration ownership을 별도 점검한 뒤, **별도 승인으로만** 진행해야 합니다.

## 2. 대표 시술 5개 locale raw production JSON-LD 대조

대표 시술로 울쎄라피 프라임(`/treatments/ulthera`)을 선택해 `star-pibu.com`의 raw production HTML을 대조했습니다. 배포 반영 후 재측정 결과, 다섯 URL은 모두 HTTP 200·self-canonical·MedicalProcedure·BreadcrumbList·FAQPage를 포함했고, Breadcrumb position 2는 각각의 실제 localized `/equipment3` 목록을 가리킵니다.

| locale | self-canonical | Breadcrumb position 2 | MedicalProcedure `inLanguage` | FAQPage count / `inLanguage` | 판정 |
|---|---|---|---|---|---|
| ko | `/treatments/ulthera` | `/equipment3` | `ko` | 15 / `ko` | 일치 |
| en | `/en/treatments/ulthera` | `/en/equipment3` | `en` | 10 / `en` | 일치 |
| ja | `/ja/treatments/ulthera` | `/ja/equipment3` | `ja` | 10 / `ja` | 일치 |
| zh | `/zh/treatments/ulthera` | `/zh/equipment3` | `zh` | 10 / `zh` | 일치 |
| zh-TW | `/zh-tw/treatments/ulthera` | `/zh-tw/equipment3` | `zh-TW` | 15 / `zh-TW` | schema language/canonical은 일치; FAQ·제목은 기존 한국어 fallback |

모든 locale에서 `MedicalProcedure.url`은 self-canonical과 일치하고, `alternateName`은 `Ultherapy Prime`, image URL은 동일한 실제 장비 이미지였습니다. en/ja/zh는 각 10개 FAQ를 사용하고, ko/zh-TW는 기존 locale-aware Korean fallback에 따라 15개 FAQ를 사용합니다. 이는 이번 감사에서 새로 발생한 schema 오류가 아니라 기존 fallback 계약입니다.

Raw HTML의 `<html lang>`은 5개 locale 모두 `ko`로 남아 있었습니다. JSON-LD의 `inLanguage`, canonical, hreflang graph와는 별개인 **P1 HTML language declaration 이슈 후보**입니다. 이번 요청의 read-only SEO 대조 범위를 넘고 화면/카드 최적화와 독립적이므로 코드는 변경하지 않았습니다. 별도 task에서는 raw HTML `lang`, prerender HTML injection, client hydration의 owner를 함께 조사해야 합니다.

## 3. `/equipment3` 다국어 카드 제목과 390px 최적화

DB의 최장 문자열 상위 20개를 읽기 전용으로 조사했습니다. 실제 활성 카드에서 영문 최장 38자(`Ultherapy + Thermage Lifting + Rejuran`), 일본어 최장 26자, 중국어 최장 33자, 한국어 최장 18자가 확인됐습니다. 기존 mobile body title은 `line-clamp-2`라 긴 의미가 숨겨질 수 있고, 비한국어 image overlay title은 장문 영문/CJK에서 문단 균형이 부족할 수 있었습니다.

| 카드 영역 | 390px 개선 | 보존한 계약 |
|---|---|---|
| 본문 제목 | mobile에서 두 줄 clamp를 제거하고 `text-wrap: balance`, `word-break: keep-all`, `overflow-wrap: anywhere`, `min-inline-size: 0` 적용 | localized full title DOM text와 native anchor `aria-label` 유지 |
| 비한국어 image overlay 제목 | 전용 class에 responsive font clamp·balanced wrapping·safe overflow 적용 | 이미지·overlay·카테고리/뱃지·detail path 유지 |
| desktop | 변경 없음 | 기존 card grid, title clamp, card height 유지 |
| 설명/메타 | 기존 2줄 clamp·밀도 유지 | 반복 정보를 통한 카드 높이 급증 방지 |

제목은 card의 접근 가능한 이름이므로 말줄임표로 숨기지 않았습니다. 예상보다 긴 영문 단어에는 `overflow-wrap: anywhere`를 fallback으로 사용하지만, 한국어/일본어/중국어의 일반적인 줄바꿈에는 `keep-all`과 balanced wrapping을 우선합니다. 다국어 title text, DB, 검색·탭·링크·image handling·다크 모드·CTA/예약·SEO는 변경하지 않았습니다.

## 4. 검증 및 제한

| 검증 | 결과 |
|---|---|
| production raw JSON-LD | 5 locale × 1 representative treatment 재측정 완료. 배포 반영 후 canonical·Breadcrumb item 2·MedicalProcedure·FAQPage가 표의 값과 일치 |
| card-title 집중 회귀 | Equipment3 mobile title·density·warm greige·color scheme·native link, treatment breadcrumb·route SEO 7개 파일 35개 테스트 통과 |
| 전체 회귀 | 216개 파일, 1,939개 테스트 통과 |
| TypeScript | `pnpm check` 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| 390px screenshot | ko/en/ja 세 경로를 단일 capture로 시도했으나 서비스에서 0/3 capture 실패. 재시도하지 않고 CSS 639px mobile scope·full-title DOM/native-link contract·회귀 테스트로 확인 |

## 5. 후속 후보 (이번 변경 밖)

| 후보 | 진행 전 조건 |
|---|---|
| homepage prerender `/treatments` discovery link 수정 | `/equipment3`가 모든 locale에서 실제 목록 destination임을 raw response·route test로 재확인하고 homepage prerender/hydration SEO ownership만 별도 수정 |
| non-ko raw HTML `lang` 수정 | `treatmentPrerender` meta injection과 client root language 관리의 충돌 여부를 별도 조사. JSON-LD inLanguage·canonical/hreflang을 변경하지 않음 |
| zh-TW 카드 title/FAQ 번역 보강 | `equipment3.nameZh`와 treatment FAQ의 데이터 source/번역 승인 절차에서 진행. Korean fallback을 code로 억지 변환하지 않음 |

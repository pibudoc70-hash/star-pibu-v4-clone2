# 주요 서브페이지 다국어 `lang`·Hreflang 확대 표본 점검

## 점검 범위와 방법

공개 `https://star-pibu.com`의 raw HTML을 `Cache-Control: no-cache`로 요청해, 9개 주요 서브페이지군 × 5개 locale, 총 45개 응답을 대조했습니다. 표본은 About, Doctors, Directions, Foreign Guide, Research, Privacy, Non-covered, 대표 시술 울쎄라피 프라임, 대표 장비 울쎄라피 프라임입니다. 각 응답에서 HTTP status, root `<html lang>` 개수·값, self-canonical, ko/en/ja/zh/zh-TW/x-default 6개 hreflang href를 expected localized URL과 비교했습니다.

## 전체 결과

| 검사 조건 | 기대 | 통과 / 전체 |
|---|---|---:|
| HTTP response | 200 | 45 / 45 |
| root lang attribute | 정확한 값 1개 | 45 / 45 |
| self-canonical | 요청한 localized URL | 45 / 45 |
| hreflang graph | 6개 alternate | 45 / 45 |
| hreflang href | 5개 locale + Korean x-default exact target | 45 / 45 |

| locale | expected raw HTML lang | 결과 |
|---|---|---|
| ko | `ko` | 9 / 9 통과 |
| en | `en` | 9 / 9 통과 |
| ja | `ja` | 9 / 9 통과 |
| zh | `zh-Hans` | 9 / 9 통과 |
| zh-TW | `zh-Hant` | 9 / 9 통과 |

`hreflang="zh"`은 `/zh/...`, `hreflang="zh-TW"`는 `/zh-tw/...`를 가리키며, `x-default`는 각 family의 Korean canonical URL을 가리킵니다. 각 localized route의 canonical도 해당 route 자신의 URL과 일치했습니다. 이전 raw response에서 보였던 non-ko `lang="ko"` 또는 duplicate lang attribute는 이 확대 표본에서 재발하지 않았습니다.

## Family별 통과 현황

| page family | ko | en | ja | zh | zh-TW | 판정 |
|---|---:|---:|---:|---:|---:|---|
| About | 통과 | 통과 | 통과 | 통과 | 통과 | 통과 |
| Doctors | 통과 | 통과 | 통과 | 통과 | 통과 | 통과 |
| Directions | 통과 | 통과 | 통과 | 통과 | 통과 | 통과 |
| Foreign Guide | 통과 | 통과 | 통과 | 통과 | 통과 | 통과 |
| Research | 통과 | 통과 | 통과 | 통과 | 통과 | 통과 |
| Privacy | 통과 | 통과 | 통과 | 통과 | 통과 | 통과 |
| Non-covered | 통과 | 통과 | 통과 | 통과 | 통과 | 통과 |
| Treatment: Ultherapy Prime | 통과 | 통과 | 통과 | 통과 | 통과 | 통과 |
| Equipment: Ultherapy Prime | 통과 | 통과 | 통과 | 통과 | 통과 | 통과 |

## 수정 판단과 보존 범위

이 45개 raw response에서 source-owned `lang`, canonical, hreflang 결함은 확인되지 않았습니다. 따라서 이번 확대 점검을 이유로 production code·route·translation data·sitemap·JSON-LD·CTA·예약/OTP·theme를 추가 수정하지 않았습니다. 이 결과는 **HTML head의 locale URL 정합성**에 대한 표본 검증이며, visible translated copy가 모두 완전한지 또는 번역 fallback이 없는지에 대한 콘텐츠 품질 판정은 아닙니다.

## 재현 기록

읽기 전용 감사 스크립트는 public raw HTML의 `status: 200`, `rootLangTagCount: 1`, `canonicalMatches: true`, `alternateCount: 6`, `alternateMatches: true`, `langMatches: true`를 각각 45회 확인했습니다. 세부 request URL과 expected graph는 외부 임시 출력으로만 사용했으며, 프로젝트에 운영 데이터나 snapshot을 추가하지 않았습니다.

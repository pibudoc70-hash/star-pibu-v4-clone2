# Equipment3 390px 카드·공개 언어 태그·Hreflang 재점검

## 결론

현재 공개 도메인은 이전 checkpoint 직후 관찰된 stale raw response 상태에서 벗어났습니다. 5개 locale의 raw root HTML은 단일 `lang` attribute를 출력하고, homepage crawler discovery link는 실제 `/equipment3`으로 반영됐습니다. Homepage와 Equipment3 목록의 raw hreflang graph도 ko/en/ja/zh/zh-TW/x-default 6개 target을 완전하게 출력하며 self-canonical과 충돌하지 않았습니다. 따라서 이번 재점검에서는 lang 또는 hreflang source를 추가로 수정하지 않았습니다.

## 1. 390px Equipment3 title simulation

관리형 390px screenshot service로 `/equipment3`, `/en/equipment3`, `/ja/equipment3`을 동시에 시뮬레이션했지만 3개 모두 capture를 반환하지 않았습니다. 이후 CDP headless simulation은 페이지 안정화 대기에서 timeout이 발생했고, direct Chromium capture도 반복 SSL handshake 오류로 제한 시간 안에 완료되지 않았습니다. 세 번의 서로 다른 capture 경로가 실패했으므로 추가 재시도는 중단하고, 이를 layout failure로 해석하지 않았습니다.

다만 실제 mobile typography contract는 source와 regression으로 확인했습니다. 본문 card title은 639px 이하에서 15–17px `clamp(0.9375rem, 4.1vw, 1.0625rem)`, balanced wrapping, `word-break: keep-all`, `overflow-wrap: anywhere`, `min-inline-size: 0`을 사용하며, 기존 두 줄 clamp를 해제해 title text와 native link accessible name을 생략하지 않습니다. Image overlay title은 별도의 16.8–20px clamp를 유지합니다.

| 확인 항목 | 결과 |
|---|---|
| title full text | 유지. 말줄임표·line clamp로 title을 숨기지 않음 |
| card anchor semantics | 기존 native `<a>`·localized accessible name 유지 |
| mobile font range | 390px에서 약 16px, 15px 하한·17px 상한 |
| capture visual proof | 3개 관리형 경로 + 2개 대체 경로 실패. 실제 단말 QA 보류 |
| automated card regression | `Equipment3.mobileMultilingualTitle.test.ts` 2개 통과 |

## 2. 공개 raw HTML lang과 캐시 반영

`Cache-Control: no-cache`로 공개 도메인의 5개 language root를 재조회했습니다. 각 응답은 하나의 root lang을 가지며, 이전의 `lang="ko"` + 두 번째 language attribute 중복은 더 이상 보이지 않았습니다. Homepage raw body의 crawler discovery link도 `https://star-pibu.com/equipment3`으로 확인됐습니다.

| path | raw root `lang` | homepage hreflang set | 판정 |
|---|---|---|---|
| `/` | `ko` | 6개 | 통과 |
| `/en` | `en` | 6개 | 통과 |
| `/ja` | `ja` | 6개 | 통과 |
| `/zh` | `zh-Hans` | 6개 | 통과 |
| `/zh-tw` | `zh-Hant` | 6개 | 통과 |

## 3. Equipment3 hreflang graph

`/equipment3` 및 4개 localized equipment-list URL의 raw HTML을 대조했습니다. 각 route는 자기 자신을 canonical로 사용하고, 다음 동일 graph를 6개 모두 포함합니다. `x-default`는 Korean canonical equipment list를 가리키며 기존 locale URL 정책과 일치합니다.

| hreflang | href |
|---|---|
| `ko` | `https://star-pibu.com/equipment3` |
| `en` | `https://star-pibu.com/en/equipment3` |
| `ja` | `https://star-pibu.com/ja/equipment3` |
| `zh` | `https://star-pibu.com/zh/equipment3` |
| `zh-TW` | `https://star-pibu.com/zh-tw/equipment3` |
| `x-default` | `https://star-pibu.com/equipment3` |

| locale path | canonical | hreflang count | 판정 |
|---|---|---:|---|
| `/equipment3` | `/equipment3` | 6 | 통과 |
| `/en/equipment3` | `/en/equipment3` | 6 | 통과 |
| `/ja/equipment3` | `/ja/equipment3` | 6 | 통과 |
| `/zh/equipment3` | `/zh/equipment3` | 6 | 통과 |
| `/zh-tw/equipment3` | `/zh-tw/equipment3` | 6 | 통과 |

## 4. Regression and scope

| gate | 결과 |
|---|---|
| hreflang/canonical/mobile title focused regression | 4개 파일, 49개 테스트 통과 |
| 이번 재점검의 source 변경 | 없음. TODO 및 검증 문서만 추가 |
| 예약·CTA·data·image·theme code | 변경 없음 |

실제 device capture가 필요한 mobile visual evidence와, source/production raw contract verification은 구분해 기록했습니다. capture 서비스가 복구되거나 물리 단말 접근이 가능해질 때 가장 긴 영문 title과 CJK title을 같은 390px viewport에서 다시 확인해야 합니다.

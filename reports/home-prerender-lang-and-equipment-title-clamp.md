# Homepage Prerender Link·Raw HTML Language·Equipment Card Clamp 개선

## 구현

homepage prerender의 crawler body에서 시술·장비소개 discovery link가 존재하지 않는 `/treatments`를 가리키고 있었습니다. 실제 header·라우트의 장비 목록 목적지와 맞춰, locale root에 따라 `/equipment3`, `/en/equipment3`, `/ja/equipment3`, `/zh/equipment3`, `/zh-tw/equipment3`으로 생성하도록 바꿨습니다. label, section copy, canonical/hreflang, JSON-LD와 client UI는 변경하지 않았습니다.

Raw HTML root language는 prerender마다 중복·누락 상태였습니다. Home은 template의 `lang="ko"`에 두 번째 lang attribute를 덧붙일 수 있었고, Treatment는 ko template language를 그대로 둘 수 있었습니다. About·Doctors는 각자 local replacement를 사용하고 있었습니다. 공용 `injectPageSeoMeta`가 public raw HTML root `lang`의 단일 server-side owner가 되도록 정리해 기존 attribute를 먼저 제거하고 하나만 다시 넣습니다. crawler body의 section-level language와 client hydration owner는 변경하지 않았습니다.

| locale | raw `<html lang>` |
|---|---|
| ko | `ko` |
| en | `en` |
| ja | `ja` |
| zh | `zh-Hans` |
| zh-TW | `zh-Hant` |

390px를 포함하는 Equipment3 mobile scope에서 body card title은 `clamp(0.9375rem, 4.1vw, 1.0625rem)`을 사용합니다. 따라서 작은 화면에는 15px 하한, 390px에서 약 16px, 넓은 mobile에는 17px 상한을 두면서 이전 full-text wrapping·native link accessible name을 보존합니다. Image overlay title의 기존 mobile clamp는 그대로 유지했습니다.

## 검증

| gate | 결과 |
|---|---|
| focused SEO/prerender/card regression | 7개 파일, 60개 테스트 통과 |
| TypeScript | `pnpm check` 통과 |
| lint | 오류 0건, 기존 경고 106건 |
| raw production 사전 대조 | 현재 공개 도메인은 이전 배포본으로, `/en` 등에서 ko+locale duplicate lang 또는 treatment page의 `lang="ko"`가 확인됨. 새 checkpoint 게시 후 재측정 예정 |
| 390px capture | 이전 동일 capture service가 실패한 상태이므로 반복하지 않음. mobile CSS scope·full-text/native-link contract·전용 regression으로 검증 |

## 보존 범위

시술/장비 제목 데이터, metadata copy, MedicalProcedure·FAQPage·clinic/website JSON-LD, canonical/hreflang, Hero/Header/Footer UI, Equipment3 light/dark palette·저장값, images, treatment UI, external CTA, 예약/OTP 코드는 변경하지 않았습니다.

## 공개 배포 재검증 상태

`ae42d8dd` checkpoint의 자동 게시 완료 뒤 `star-pibu.com`, `www.star-pibu.com`, `starpibu-qdq7tysk.manus.space`를 `Cache-Control: no-cache`로 재조회했습니다. 세 도메인 모두 `/en`에서 기존 중복 `<html lang="ko" ... lang="en">`을, representative non-ko treatment 페이지에서 기존 `lang="ko"`을 반환했고, homepage crawler link도 새 absolute `/equipment3` markup을 아직 반환하지 않았습니다. 응답은 `cache-control: no-cache, no-store, must-revalidate`와 새 `Date` header를 보내 일반 HTML cache hit로 단정할 근거는 없었습니다.

| 항목 | 코드·자동 테스트 | 공개 raw 재조회 | 결론 |
|---|---|---|---|
| localized homepage crawler link | locale 5개 focused test 통과 | 이전 `/treatments` markup 유지 | 배포 runtime 반영 대기/확인 필요 |
| root HTML lang 단일 owner | 5개 locale focused test 통과 | 기존 duplicate 또는 `ko` 유지 | 배포 runtime 반영 대기/확인 필요 |
| Equipment3 title clamp | focused card test 통과 | raw HTML 검사 대상 아님 | client CSS artifact, preview/실기기 QA 필요 |

Production log 조회는 해당 시점에 Cloud Run service `not_found`로 실패해 runtime revision을 직접 대조하지 못했습니다. 이 문서는 코드를 되돌리거나 platform 설정을 변경하지 않으며, 이후 자동 게시본에서도 같은 raw 응답이 유지되면 관리형 배포 라우팅/실행 환경 상태를 별도로 점검해야 합니다.

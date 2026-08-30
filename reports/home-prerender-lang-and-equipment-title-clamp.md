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

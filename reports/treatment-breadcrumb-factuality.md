# 시술 상세 BreadcrumbList 부모 URL 사실성 수정

## 문제와 판단

canonical `/treatments/:slug`의 client-side 및 crawler prerender BreadcrumbList에서 position 2가 `.../treatments`를 가리키고 있었습니다. 그러나 `LANG_ROUTES`에는 `treatments/:slug` 상세 route만 있고 `/treatments` 목록 route는 없습니다. 반면 실제 header의 “시술·장비소개” 1차 메뉴는 `/equipment3`으로 연결됩니다. 따라서 목록을 뜻하는 기존 label은 유지하고 URL만 실제 200 장비 목록 경로 `/equipment3`으로 바꾸는 것이 사실에 맞습니다.

| 확인 조건 | 결과 | 판단 |
|---|---|---|
| client Breadcrumb position 2 | `${BASE_URL}${langPrefix}/treatments` | 수정 필요 |
| prerender Breadcrumb position 2 | `${BASE_URL}${langPrefix}/treatments` | client와 함께 수정 필요 |
| `LANG_ROUTES` | `treatments/:slug`, `equipment3/:slug`, `equipment3`만 존재 | `/treatments` 목록 route 없음 |
| Header primary nav | 시술·장비소개 `href: "/equipment3"` | breadcrumb parent를 `/equipment3`으로 맞춤 |
| inline 3단계 graph | client·prerender 모두 존재 | 리팩터 없이 `item` URL 한 줄씩 수정 가능 |

## 변경 범위

`TreatmentPage.tsx`와 `treatmentPrerender.ts`의 BreadcrumbList position 2 `item`만 `${BASE_URL}${langPrefix}/equipment3`으로 수정했습니다. position 1 Home, position 2 label, position 3 current `pageUrl`은 그대로 유지했습니다. 이로써 실제 시술 상세 canonical `/treatments/:slug`와 그 URL을 참조하는 position 3은 변경되지 않습니다.

| locale | position 2 label | 최종 item URL |
|---|---|---|
| ko | 시술·장비소개 | `https://star-pibu.com/equipment3` |
| en | Treatments | `https://star-pibu.com/en/equipment3` |
| ja | 施術・機器紹介 | `https://star-pibu.com/ja/equipment3` |
| zh | 治疗与设备 | `https://star-pibu.com/zh/equipment3` |
| zh-TW | 療程與設備 | `https://star-pibu.com/zh-tw/equipment3` |

## 회귀 보강 및 검증

기존 테스트는 `/treatments` 문자열 전체만 확인해 current treatment item(position 3) 때문에 잘못된 position 2도 통과할 수 있었습니다. client와 prerender source 각각에서 BreadcrumbList·itemListElement·Home position·새 position-2 template·current pageUrl position 3을 확인하고, **position 2만** 이전 `/treatments` template가 아님을 검증하도록 강화했습니다. current treatment URL까지 부정하는 넓은 문자열 단언은 사용하지 않았습니다.

| 검증 | 결과 |
|---|---|
| focused breadcrumb + treatment route/SEO | 2개 파일, 26개 테스트 통과 |
| TypeScript | `pnpm check` 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| `git diff --check` | 통과 |
| UI screenshot | 완료 조건 아님. UI breadcrumb을 추가하지 않았고 JSON-LD URL만 변경 |

## 동결 준수 및 보류

Header/Footer/Hero, 예약·OTP·DB·schema·migration·seed, external CTA 목적지·브랜드색, treatment warm-greige/390px wrapping/hero summary/FAQ toggle, MedicalProcedure·FAQPage, treatment data, Equipment3Detail breadcrumb, `seoHelpers.ts`, dependency·lint 설정은 변경하지 않았습니다.

`server/_core/homePrerender.ts`의 crawler body에도 별도의 `/treatments` discovery link가 있다는 기존 관찰은 이번 allowed file scope 밖이므로 수정하지 않았습니다. 이 항목은 homepage crawler link 사실성으로 별도 조사·승인 후 다뤄야 하며, 이번 시술 상세 BreadcrumbList 변경에 포함하지 않았습니다.

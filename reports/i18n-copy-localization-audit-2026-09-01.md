# 다국어 카피 치환안 검토 기록

## 초기 외부 표기 확인

사용자가 제공한 일본어 장비명 제안을 외부 현지 사용례와 먼저 대조했다. 일본어 의료 클리닉 공개 페이지에서는 `ウルセラ（ウルセラプライム）`, `サーマクールFLX/CPT`, `XERF（ザーフ）`가 함께 사용된다.[1] [2] 따라서 `サーマジ`를 `サーマクールFLX`로, `セルフ（XERF）`를 `XERF（ザーフ）`로 다듬는 방향은 현지 독해성 측면에서 근거가 있다. 반면 제공안의 `XERF（ゼルフ）`는 확인된 현지 표기와 맞지 않아 적용하지 않는다.

| 제안 | 초기 판정 | 근거 및 범위 원칙 |
|---|---|---|
| `サーマジ` → `サーマクールFLX` | 후보 | 현재 문자열 위치·FLX 문맥을 확인한 뒤에만 적용 |
| `セルフ（XERF）` → `XERF（ゼルフ）` | 보류/불채택 | 외부 현지 표기는 `XERF（ザーフ）`이므로 제공안과 불일치 |
| `ウルセラピー プライム` → `ウルセラプライム` | 후보 | 문구 단위·장비 정식 표기 문맥을 점검 후 제한 적용 |
| 의학적 효과·횟수·깊이·회복 기간 관련 문장 | 보류 | locale 개선을 이유로 의료 사실·광고 주장 표현을 전역 치환하지 않음 |
| DB-driven event/notice/equipment content | 별도 데이터 작업 | source ownership·번역 completeness를 확인하기 전 code fallback 또는 대량 치환 금지 |

중국어 간체 Rejuran 사용례도 외부 공개 중국어 페이지에서 `丽珠兰（Rejuran）` 병기 형태로 확인했다.[3] 이에 따라 정적 FAQ 안에서 `利朱兰(Rejuran)`으로만 나타나는 장비명·질문 표기는 의료 효능 문장을 손대지 않고 `丽珠兰（Rejuran）`로 제한 정정할 수 있다. 다만 동적 equipment detail, event, notice는 `equipment3.nameEn/nameJa/nameZh/nameZhTw`, localized description/detail/FAQ fields, `events.targetLang/titleEn/titleJa/titleZh/subtitleEn/subtitleJa/subtitleZh`, `notices.targetLang/title/content`에서 별도로 관리되므로 이번 정적 리소스 수정으로 대체하지 않는다.

개발 미리보기의 `/ja` home은 `施術案内・設備紹介`, `皮膚科専門医によるリフトアップ診療`, `リフトアップ`, `サーマクール`, `XERF（ザーフ）` 등 수정된 static source를 실제로 렌더했다. 반면 equipment card의 `ウルセラピー プライム`, `サーマージ FLX` 등은 `equipment3`의 localized DB 값에서 온 별도 동적 콘텐츠임을 확인했다. 이 데이터는 static i18n fallback으로 덮지 않고, 정식 장비별 `nameJa`·`descJa`·`detailJa`·FAQ data 검토 작업으로 보류한다.

개발 미리보기의 `/zh` home도 `皮肤科专科医生亲诊的提升治疗`, `热玛吉FLX`, `丽珠兰（Rejuran）`, `纹身去除`, `像橡皮筋轻弹一下的感觉`을 실제 static 영역에 렌더했다. 그러나 같은 `/zh`의 dynamic equipment card에는 `熱瑪吉 FLX`, `提拉`, `當天` 등 번체 표현이 관찰됐다. 이는 `equipment3` localized DB row의 zh field 값 또는 renderer fallback 문제로 보이며, `i18n.zh.ts`를 다시 수정해 덮을 수 있는 영역이 아니다. 문구별 locale과 의료 사실을 확인한 뒤 데이터 정비 작업으로 별도 승인받아야 한다.

개발 미리보기의 `/en` home은 `Under-eye Fat Repositioning`, `XERF`, `topical anesthetic cream`, `keep the skin well moisturized`을 실제 FAQ·공통 안내 영역에 렌더했다. 그러나 raw title의 `Star Dermatology Busan`과 dynamic equipment card의 legacy `lifting`·`Star Dermatology` 표기는 각각 route-specific SEO source와 equipment data에서 온다. 35개 이상의 source file에 산재한 legacy brand casing을 무차별 치환하면 URL별 title·schema·test 계약을 바꿀 위험이 있으므로, 이번 정적 locale patch에서는 개별 SEO source 검증 없이 전역 치환하지 않는다.

## 실제 적용 대조표

| Locale·경로 | 변경 전 | 변경 후 | 소스 정본 |
|---|---|---|---|
| ja `/ja` | `Dermatologist-led lifting care` | `皮膚科専門医によるリフトアップ診療` | `shared/liftingPositioning.ts` → React 및 home prerender |
| ja `/ja` | `Lifting & pain-management FAQ` | `リフトアップ施術と痛みの管理に関するよくある質問` | 동일 shared source → React 및 home prerender |
| zh `/zh` | `Dermatologist-led lifting care` | `皮肤科专科医生亲诊的提升治疗` | 동일 shared source → React 및 home prerender |
| zh `/zh` | `Lifting & pain-management FAQ` | `提升治疗与疼痛管理常见问题` | 동일 shared source → React 및 home prerender |
| ja `/ja` 정적 의사·카테고리·FAQ·문의 | `リフティング`, `サーマジ`, `セルフ（XERF）` | `リフトアップ`, `サーマクール`, `XERF（ザーフ）` | `client/src/lib/i18n.ja.ts` |
| ja `/ja` 정적 FAQ·카테고리 | `ウルセラピー プライム`, Latin `·` | `ウルセラプライム`, Japanese `・` | `client/src/lib/i18n.ja.ts` 및 `shared/liftingPositioning.ts` |
| en `/en` 정적 FAQ | `XERF (Serf)` | `XERF` | `client/src/lib/i18n.en.ts` |
| en `/en` 정적 FAQ | `Lower Eyelid Fat Repositioning`, `improve hollowness` | `Under-eye Fat Repositioning`, `reduce under-eye hollows` | `client/src/lib/i18n.en.ts` |
| en `/en` 정적 FAQ·YouTube title | `maintain proper moisturizing care`, `Skin Stories from Our Dermatology Specialists` | `keep the skin well moisturized`, `Skin Care Tips from Our Dermatologists` | `client/src/lib/i18n.en.ts` |
| zh `/zh` 정적 FAQ·카테고리 | `热磁治疗FLX`, `利朱兰(Rejuran)`, `弹射感`, `文身` | `热玛吉FLX`, `丽珠兰（Rejuran）`, `像橡皮筋轻弹一下的感觉`, `纹身` | `client/src/lib/i18n.zh.ts` |

영문 `STAR Dermatology` 대소문자 통일은 이번에 `shared/liftingPositioning.ts`의 공통 안내에서 적용했습니다. 그러나 route-specific title, OG, JSON-LD와 treatment/equipment data는 서로 다른 정본을 사용하므로, 실제 DOM·raw SEO output까지 확인하지 않은 대량 전역 치환은 하지 않았습니다. 이 선택은 문구만 바꾸려다 canonical URL별 metadata 계약을 깨지 않기 위한 범위 통제입니다.

## 의도적으로 보류한 항목

| 영역 | 관찰된 상태 | 보류 이유·다음 정본 |
|---|---|---|
| ja equipment detail/card | `ウルセラピー プライム`, `サーマージ FLX` 등의 이전 표기 | `equipment3` DB의 `nameJa`, `descJa`, `detailJa`, FAQ field가 정본. 화면별 통일 전 data review 필요 |
| zh equipment detail/card | `/zh`에서 `熱瑪吉`, `提拉`, `當天` 같은 번체 혼입 | `equipment3`의 simplified-Chinese data 품질 또는 renderer fallback 문제. static source로 대체 금지 |
| event/notice | target language별 DB 콘텐츠 | `events` 및 `notices`의 locale fields/targetLang이 정본. 의료 광고 문구와 일자를 확인한 별도 data task 필요 |
| 영어 title·OG·JSON-LD와 다수 treatment guide | legacy `Star Dermatology` casing 및 `lifting` 문구가 일부 남음 | 35개 이상 source·route별 SEO contract를 먼저 inventory해야 함. 승인 없는 global replace 금지 |
| prompt의 `skin boosters` 설명 추가 | 문장 추가 요청 | 새 의료·시술 설명 창작에 해당하므로, verified product source와 의료광고 검토가 선행돼야 함 |

## 검증

정적 용어 및 공통 title 정본을 보호하는 `i18n.copyLocalization.test.ts`와 home crawler locale test를 추가했습니다. 수정 후 전체 Vitest는 220개 test file, 1,962개 test가 통과했고, TypeScript check·ESLint(오류 0, 기존 경고 106)·production build를 통과했습니다. 개발 미리보기에서 `/en`, `/ja`, `/zh` 홈의 적용된 static 텍스트와 레이아웃을 확인했습니다. full-page screenshot capture는 환경에서 실패했으나, browser-rendered DOM/텍스트 확인과 automated tests로 대체했으며 화면 구조·URL·slug·예약/OTP·외부예약 흐름은 변경하지 않았습니다.

## 참고 문헌

[1]: https://www.s-b-c.net/laser/liftup/ulthera/ "湘南美容クリニック — ウルセラ（ウルセラプライム）"
[2]: https://www.s-b-c.net/laser/liftup/xerf/ "湘南美容クリニック — XERF（ザーフ）"
[3]: https://juclinic.com/zh-CN/article/detail/treatment-rejuran "佳思优整形医美诊所 — 丽珠兰 Rejuran"

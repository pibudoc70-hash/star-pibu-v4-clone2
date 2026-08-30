# zh-TW Fallback Inventory and Remediation

## 실제 화면 관찰

개발 미리보기 `/zh-tw`가 로딩된 뒤, 정적 navigation·footer·통증관리·시설·장비 관리기기 명칭은 번체로 표시됐습니다. 그러나 사용자 노출 영역에서 다음 세 종류의 locale fallback/필드 누락이 확인됐습니다.

| 영역 | 실제 관찰 | 예상 source | 처리 원칙 |
|---|---|---|---|
| 의료진 연구·발표·연수 아코디언 | section label, 연구 제목·설명에 한국어가 남음 | `doctors-data`의 공통 research activity data 또는 zh-TW override 누락 | 사실을 바꾸지 않는 번체 정적 번역을 별도 source에 추가 |
| 장비 목록 카드 | 일부 `desc`가 간체(예: `超声刀Prime…`)로 표시되고, Thermage badge가 한국어 `자문의`로 표시 | Equipment3 list가 `nameZhTw`/`descZhTw`를 전달하지 않음; badge의 zh-TW field 부재 | 기존 `*ZhTw` field 전달 우선, badge는 실제 source/field를 조사 후 최소 수정 |
| 장비 상세·카드 원문 fallback | DB 집계상 72개 활성 equipment3의 name/desc/detail/faqs ZhTw field는 모두 비어 있지 않음 | rendering caller의 4-argument `getText` | DB 재번역 전 source caller를 우선 수정 |

Search Console은 사용자 요청에 따라 로그인 의존 검증을 건너뛰었습니다. public raw HTML lang/canonical/hreflang의 최신 이전 표본은 정상이지만, Search Console의 country targeting/index coverage 화면은 이번 작업에서 확인하지 않았습니다.

## 구현 후 개발 미리보기 재확인

`/zh-tw`의 로딩 완료 상태를 다시 확인했습니다. 새로 연결한 장비·시술 카드의 번체 title/description/time/recovery와 `查看詳情` label, 그리고 조시형 원장의 연구·발표·연수 아코디언 제목·설명·source label이 번체로 표시됐습니다. 카드의 native detail button, NAVER/WeChat/전화 CTA, 검색·카테고리·장비 FAQ button도 기존 동작과 함께 유지됐습니다.

| 구분 | 구현 후 상태 | 처리 |
|---|---|---|
| Equipment3 name/description/time/recovery | 번체 `*ZhTw` 데이터를 우선 표시 | 완료 |
| Equipment3 detail CTA | `查看詳情` 표시 | 완료 |
| 조시형 원장 연구·발표·연수 | title·detail·source label이 번체로 표시 | 완료 |
| 써마지 FLX badge | 한국어 `자문의`가 계속 표시 | `equipment3.badge`에 zh-TW 전용 필드가 없어 DB data backlog로 보류 |
| XERF badge `EVENT` | 브랜드/운영 라벨 표기 | 번역 field 정책 확정 전 보류 |
| 데이터가 없는 이벤트·공지 | zh-TW DB field 부재 | code fallback으로 대체하지 않고 DB translation backlog로 보류 |

## 장비 뱃지·의료진 연구 활동 후속 확인

개발 미리보기 `https://3000-i3op5g3fnvp1fq6mj2y9j-dc991820.sg1.manus.computer/zh-tw`에서 데이터 로딩 후 다시 확인했습니다. Thermage FLX는 이전 한국어 `자문의` 대신 `醫療顧問`, XERF는 `活動`, 혈액줄기세포는 `自體細胞`, 지방줄기세포는 `頂級`을 표시합니다. 카드 title·description·time·recovery·detail control도 번체로 렌더됐고, 우혜진 원장을 포함한 의료진의 연구·발표·연수 활동은 새 zh-TW data를 사용해 표시됐습니다.

| 확인 항목 | 실제 렌더링 결과 |
|---|---|
| Thermage FLX badge | `醫療顧問` |
| XERF badge | `活動` |
| 혈액줄기세포/지방줄기세포 badge | `自體細胞` / `頂級` |
| 장비 카드 CTA | `查看詳情` |
| Doctor research disclosure | `研究・發表與進修活動` 및 번체 활동 본문 |
| 남은 DB 번역 backlog | events·notices, `treatments` 레거시 payload, 장비 category 번체 전용 field |

## 번체 데이터 보강 및 최종 검증

장비 카드의 static `nameZhTw`·`shortDescZhTw`는 이미 완결돼 있었지만, Equipment3 목록·홈 장비 카드·모달로 전달되는 호출 경로에 누락이 있어 이를 연결했습니다. 의료진 연구·발표·연수 활동은 원문 Korean data를 보존하고, 조시형·우혜진·이기욱 원장의 활동명·설명·source label을 위한 zh-TW locale override를 별도 데이터로 추가했습니다. 기존 사실 관계·연도·기관/학회 이름을 바꾸거나 확대하지 않았습니다.

Thermage FLX의 `자문의`처럼 실제 사용자 화면에 남던 장비 badge Korean fallback은 code 문자열 치환으로 감추지 않았습니다. `equipment3.badgeZhTw` nullable column을 `drizzle/0038_nebulous_landau.sql`의 비파괴 `ADD COLUMN` migration으로 추가했고, schema·router·adapter·Equipment3 card rendering을 타입 안전하게 연결했습니다. 활성 non-empty badge 4건만 다음과 같이 번체 데이터로 입력했습니다.

| 기존 badge | zh-TW badge |
|---|---|
| 자문의 | 醫療顧問 |
| EVENT | 活動 |
| 자가세포 | 自體細胞 |
| 프리미엄 | 頂級 |

| 검증 | 결과 |
|---|---|
| 개발 미리보기 `/zh-tw` | 장비 title/description/time/recovery, 4개 badge, 카드 CTA, 3인 의료진 연구 활동이 번체로 확인됨 |
| 집중 zh-TW·SEO regression | 장비 badge field/schema/router/card, equipment localization, doctor activities, 기존 canonical/hreflang 12개 파일 54개 테스트 통과 |
| 전체 regression | 219개 파일, 1,955개 테스트 통과 |
| TypeScript | `pnpm check` 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| Search Console | 사용자의 지시로 로그인 의존 international targeting/index coverage 점검을 건너뜀. 설정 변경·제출은 수행하지 않음 |

## 남은 DB-only 번역 backlog

다음은 zh-TW 전용 field 자체가 없거나 활성 데이터에 값이 없는 항목입니다. 사용자 화면에 Korean 또는 Simplified Chinese가 남는다고 해도, 이번 작업에서는 code fallback hack으로 대체하지 않았습니다.

| source | 현재 상태 | 후속 작업 |
|---|---|---|
| `treatments` 레거시 table | 활성 2건에 전용 zh-TW content field 없음 | 스키마·관리 editor·의료진 검수 계획을 승인한 별도 migration에서 번체 field와 내용 추가 |
| events | zh-TW 전용 제목/본문/기간 field 없음 | Event 운영 데이터 번역 정책·기간 사실성 검수와 함께 추가 |
| notices | `target_lang=all` 콘텐츠에 zh-TW 전용 본문 없음 | 공지 작성 화면의 locale-specific data 설계 후 보강 |
| equipment3 category | 개별 장비 본문은 번체화됐으나 category 전용 zh-TW field 없음 | 카테고리 taxonomy와 admin input을 함께 설계한 뒤 migration |

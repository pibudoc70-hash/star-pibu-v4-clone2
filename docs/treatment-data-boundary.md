# 시술 데이터 책임 경계

**작성일:** 2026-08-21  
**범위:** 비예약 시술·장비 콘텐츠 데이터  
**목적:** 정적 `treatments-data.ts`의 삭제·DB 이관·상세 시술 SEO 변경 전에 데이터 소유자와 변경 경로를 명확히 한다.

## 핵심 결론

`client/src/data/treatments/treatments-data.ts`는 약 **303,953 bytes**의 대용량 정적 데이터이지만 dead code로 판단할 수 없다. 현재 `useStaticTreatmentFilter`가 직접 `TREATMENTS`를 import하며, legacy Equipment2→Equipment3 migration script도 이 파일을 입력값으로 파싱한다. 따라서 이 문서는 파일 삭제가 아니라 **책임 분리와 향후 제거의 사전 조건**을 기록한다.

| 데이터 영역 | 정식 책임 | Source owner | 현재 주요 사용처 | 변경 경로 | 이번 작업의 조치 |
|---|---|---|---|---|---|
| `data/treatments/index.ts`의 `TREATMENT_DATA` | canonical 시술 상세 페이지의 다국어 본문, FAQ, SEO metadata | **시술 상세 콘텐츠·SEO source** | `/treatments/:slug`, prerender SEO | 각 slug 모듈을 추가하고 index에 등록 | 유지 |
| `data/treatments/treatments-data.ts`의 `TREATMENTS` | legacy 정적 카드·모달형 시술 catalogue | **legacy static catalogue source** | `useStaticTreatmentFilter`, migration input, legacy tests | 정적 source를 직접 수정하지 말고 사용처부터 audit | 유지, 삭제 금지 |
| Equipment3 DB | 관리자 편집형 홈/장비 카드·카테고리 데이터 | **Equipment3 관리자 데이터 source** | `useEquipment3AsTreatments`, `/equipment3`, 홈 시술·장비 섹션 | 관리자 편집 흐름 및 DB schema | 운영 DB 접근·migration 금지 |
| `types/treatment.ts` | static 및 DB adapter가 공유하는 card/modal 화면 타입 | **프론트엔드 domain model** | static filter, Equipment3 adapter, card components | 타입 확장은 consumer 영향 확인 후 수행 | 유지 |
| `data/treatments/categories.ts` | category UI metadata, icon, localized label, detail slug link | **탭 UI metadata source** | treatment/equipment tab UI | UI metadata 변경 | 유지 |
| `pages/Equipment.tsx`의 `EQUIPMENT_LIST` | 오래된 독립 `/equipment` route용 static list | **legacy `/equipment` route source** | legacy `/equipment` route | 별도 page audit 필요 | 이번 단계에서 변경하지 않음 |
| regression tests / source-reading fixtures | data source와 tab 계약의 변경 감지 | **테스트·회귀 계약 source** | `useStaticTreatmentFilter.test.ts`, `TreatmentsEquipmentSection.content.test.tsx`, treatment route/SEO tests | source 이동 시 assertion 경로와 expected fixture를 같은 변경에서 갱신 | 유지, 데이터 삭제 전에 반드시 갱신 |

## 현재 production 경계

홈의 **주요 시술 및 장비** 영역은 정적 `TREATMENTS`를 사용하지 않는다. `TreatmentsEquipmentSection`은 `useEquipment3AsTreatments`를 통해 `trpc.equipment3.list` 데이터를 card UI 타입으로 변환한다. 따라서 홈 카드의 제목·설명·이미지·카테고리·Best 여부는 Equipment3 관리 데이터가 우선한다.

반면 시술 상세의 SEO·본문·FAQ는 `TREATMENT_DATA`에 등록된 slug 모듈이 정식 source다. 예를 들어 울쎄라·써마지의 H1, description, schema/FAQ 관련 내용은 해당 slug 모듈과 `treatments/index.ts`에서 관리한다. 홈 Equipment3 카드 데이터의 편집은 detail-page SEO source를 자동 변경하지 않는다.

정적 `treatments-data.ts`는 현재 legacy static filter hook과 이전 Equipment2에서 Equipment3로의 데이터 이관 script에 남아 있다. migration script는 이 파일을 파싱해 DB에 누락된 항목을 넣는 용도로 작성되어 있으나, 운영 DB·migration 실행은 이번 프로젝트 정책상 금지한다.

> **운영 원칙:** 홈 카드와 관리자 장비 데이터는 Equipment3, canonical 시술 상세 SEO는 slug 모듈과 `TREATMENT_DATA`, legacy 정적 catalogue는 명시적으로 대체되기 전까지 read-only source로 취급한다.

## Regression test fixture 경계

정적 catalogue를 변경·이관·삭제하려는 작업은 production import만 검사해서는 안 된다. 일부 regression test는 source file 자체의 카테고리 키, item 수, 콘텐츠 존재 여부를 contract로 읽는다. 아래 경계를 같은 변경에서 함께 검토한다.

| 검증 대상 | 현재 fixture/contract | source 변경 시 필수 조치 |
|---|---|---|
| static category filter | `useStaticTreatmentFilter.test.ts`가 `TREATMENTS`와 valid tab contract를 검증 | replacement source를 사용하도록 test와 hook을 같은 commit에서 변경 |
| legacy catalogue content | `TreatmentsEquipmentSection.content.test.tsx`가 `treatments-data.ts` source를 읽어 콘텐츠 계약을 확인 | 테스트가 검증할 정식 source를 명시하고 source-reading path를 이전 |
| canonical detail SEO | treatment route/SEO tests가 `TREATMENT_DATA` slug와 SEO metadata를 검증 | static catalogue와 혼동하지 말고 slug module의 expected SEO만 변경 |
| Equipment3 card adapter | query state·category card tests가 DB adapter 반환 구조를 검증 | schema나 adapter contract가 바뀌는 별도 작업에서만 갱신, 운영 DB 실행 금지 |

따라서 `treatments-data.ts` 삭제는 **runtime consumer, migration input, test fixture**가 모두 대체된 뒤에만 논의한다.

## 안전한 변경 규칙

| 변경 목적 | 허용 절차 | 금지 사항 |
|---|---|---|
| 상세 시술 SEO 수정 | canonical slug 모듈 수정 → Treatment page·SEO focused test → 실제 detail render 확인 | Equipment3 DB 데이터로 SEO를 임의 덮어쓰기 |
| 홈 장비 카드 수정 | 관리자 데이터 흐름 또는 adapter contract를 먼저 확인 | 정적 catalogue를 이유 없이 홈에 재연결 |
| 정적 catalogue 정리 | runtime import, test, migration/ops script, legacy route를 전수 감사하고 replacement source를 확정 | 파일 크기만 보고 삭제 |
| DB 이관 | 별도 승인된 migration 계획·staging 검증·rollback 계획 | 운영 DB 직접 접속, seed/migration 실행 |
| legacy UI 제거 | 실제 import graph 0건과 route reachability 0건을 확인 | grep 결과 일부만 보고 component·data 삭제 |

## `treatments-data.ts` 삭제 사전 조건

다음 조건을 **모두** 충족할 때에만 별도 변경 작업으로 삭제를 제안할 수 있다.

1. production client와 server의 runtime import가 0건이어야 한다.
2. `useStaticTreatmentFilter` 또는 그 consumer가 제거·대체되고 focused test가 새 경계로 이전되어야 한다.
3. migration/ops script가 새 입력 source를 사용하거나 명시적으로 폐기되어야 한다. 실행은 별도 승인이 필요하다.
4. `/treatments/:slug`, `/equipment3`, 홈 시술·장비, legacy `/equipment` route의 실제 렌더 및 SEO가 유지되어야 한다.
5. 예약·OTP·운영 DB·fixture·seed는 변경하지 않아야 한다.

조건 하나라도 미충족이면 **삭제하지 않는다**. 다음 후보 작업은 파일 제거가 아니라 `useStaticTreatmentFilter`의 실제 runtime consumer와 legacy route reachability를 읽기 전용으로 감사하는 것이다.

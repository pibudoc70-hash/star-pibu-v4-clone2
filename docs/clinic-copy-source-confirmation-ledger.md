# 통계·의료 카피 정본화 확인 대장

**작성일:** 2026-08-21  
**목적:** 병원·원장 확인이 필요한 홍보 수치와 의료·운영 카피를 주장 단위로 승인하고, 확인된 원문을 모든 public surface에 안전하게 반영하기 위한 사전 대장이다.  
**이번 단계의 변경:** 문서화만 수행했다. 수치, 의료 문구, DB, CTA, JSON-LD, crawler text는 변경하지 않았다.

## 승인 원칙

한국어 승인 원문과 근거를 먼저 확정한 뒤, 영어·일본어·중국어 간체·번체를 한 change set에서 동기화한다. 번역은 한국어 원문의 주장 범위를 넓히거나 축소하지 않으며, 어떤 claim도 근거·승인일·검토 담당자 없이 code source로 승격하지 않는다.

| 상태 | 의미 | code 조치 |
|---|---|---|
| 확인됨 | 병원이 근거와 사용 범위를 승인함 | designated canonical source와 모든 duplicate surface를 같은 change set에서 갱신 |
| 보류 | 근거 또는 허용 wording이 불명확함 | 현재 문구 유지; 자동 변환·추정 수정 금지 |
| 철회 | 병원이 claim 사용을 승인하지 않음 | 승인된 별도 change set에서 해당 claim의 모든 locale/public surface를 제거 또는 중립화 |

## 병원 확인 질문

| claim family | 병원·원장에게 확인할 질문 | 필요한 근거/메타데이터 | 확인 전 처리 |
|---|---|---|---|
| 개원 연도·경력 | 개원일과 “20년/20년 이상” 산정 기준은 무엇이며, 표현을 매년 갱신해야 하는가? | 공식 개원일, 경력 산정 기준, 최종 확인일 | existing canonical 수치 유지 |
| 전문의 3인 | 현재 roster에 포함되는 전문의의 기준일과 변경 통지 owner는 누구인가? | 현재 재직 roster, 확인일, 담당자 | existing numeric stat 유지 |
| 눈밑지방재배치 4,000례 | case의 정의(시술/환자/누적), 집계 종료일, 허용 표기는 무엇인가? | 집계 source, 기간, 포함/제외 기준, 승인 문구 | existing canonical stat 유지 |
| 레이저·장비 50종 | 장비/레이저의 구분, 중복 산정 규칙, 기준일은 무엇인가? | 장비 목록 또는 산정 규칙, 확인일 | existing canonical stat 유지 |
| 1:1 진료·상담 | “1:1”이 적용되는 상담·진료 단계와 예외는 무엇인가? | 운영 기준, 적용 범위, 허용 locale wording | 보류 |
| 원장 직접 진료/시술 | 진료와 시술 각각에서 직접 담당의 범위 및 위임 가능 업무는 무엇인가? | 의료 책임자 승인, 적용 시술/예외, 허용 문구 | 보류 |
| 누적 환자 10,000명+ | 인원/방문/상담 중 무엇을 세며, 기간·중복 제거·표기 방식은 무엇인가? | 집계 source, 기준일, 단위 정의 | 보류 |
| 안전·자연스러움·최상의 결과 | 각 표현이 결과 보장으로 읽히지 않도록 허용 가능한 객관적 wording은 무엇인가? | 의료 책임자·광고 검토 승인 문구 | 보류 |
| 통증·진정·회복 | 시술별 통증 관리/진정 가능 여부와 개인차 고지의 정확한 원문은 무엇인가? | 시술별 의료 검토, contraindication/개인차 고지, 검토일 | 보류 |

## Source owner와 동기화 대상

| source/surface | 현재 책임 | 포함 claim | 승인 후 변경 owner | 동기화 규칙 |
|---|---|---|---|---|
| `client/src/lib/clinic-stats.ts` | numeric canonical + 2026-07 확인 주석 | 개원/경력/전문의/4,000/50 | 병원 승인 값을 받는 code owner | value·basis·verified date를 함께 검토; 추정 자동 계산 금지 |
| `client/src/lib/constants.ts` | UI-ready stat and ratio bridge | 20/4,000/50/1:1 | code owner | `clinic-stats`와 field parity를 test로 유지; 1:1은 승인 전 canonical로 승격하지 않음 |
| `client/src/lib/i18n.*.ts` | visible locale prose/labels | 20/50/4,000/1:1/10,000/직접 진료·의료 서술 | locale content owner + native reviewer | Korean master 승인 후 ko/en/ja/zh/zh-TW를 동시 검토 |
| `client/src/lib/doctorsSeo.ts` | Doctors metadata/Physician JSON-LD | 3/20/4,000 및 전문의 claim | SEO code owner | roster·numeric claim 변경 시 page copy와 JSON-LD를 함께 검토 |
| `client/index.html` | static public metadata/JSON-LD | clinic stats and descriptive claims | SEO code owner | dynamic source와 literal duplicate를 함께 변경; raw literal만 단독 변경 금지 |
| `client/public/llms.txt`, `client/public/llms-full.txt` | crawler-readable public copy | clinic stats·medical/operational wording | content/SEO owner | visible site wording 확정 뒤 마지막에 sync; claim provenance를 기록 |
| treatment canonical modules/FAQ | treatment-specific clinical content | efficacy, pain, recovery, preparation | medical content owner | procedure-specific approval 없이는 global claim을 복사하지 않음 |

## 승인 후 change-set checklist

1. 승인 대장에 **claim ID, Korean approved wording, evidence location, verified date, approver, review expiry**를 기록한다.
2. `clinic-stats.ts`와 `constants.ts`의 canonical numeric fields를 먼저 갱신하고 `clinic-stats.test.ts`를 실행한다.
3. UI components, `i18n.*`, Doctors SEO, static JSON-LD, `llms*.txt`, treatment/FAQ surface를 claim ID 기준으로 검색해 빠짐없이 sync한다.
4. zh-TW는 `zh` spread 이후 override 구조이므로 Simplified Chinese fallback 여부를 별도로 검토한다.
5. SEO response/JSON-LD, 5개 locale render, visible text, focused source tests를 검증한다. 의료 claim은 결과 보장·절대 표현·근거 없는 비교급이 새로 생기지 않는지 의료 검토자가 확인한다.
6. 개별 claim family마다 독립 commit·checkpoint를 남기고, 근거가 불완전하면 해당 family 전체를 보류한다.

## 현재 보류 결론

`clinic-stats.ts`로 이미 보호되는 2006, 20년, 3인, 4,000례, 50종은 병원이 새 기준을 제공하기 전까지 변경하지 않는다. 1:1, 누적 10,000명+, 원장 직접 담당의 세부 범위, 결과·안전성·통증/진정 서술은 근거·허용 wording·locale source가 확정되기 전까지 정본화하거나 자동 번역하지 않는다.

이 대장은 변경 승인 요청서의 입력 양식이며, 그 자체는 병원 확인이나 의료광고 적합성 승인을 대체하지 않는다.

## 2026-08 실행 상태

이번 작업 범위에서 병원·원장이 승인한 evidence, Korean approved wording, approver, verified date는 제공되지 않았다. 따라서 1:1 진료·상담, 누적 10,000명+, 원장 직접 진료/시술의 세부 범위, 결과·안전성·통증/진정 문구는 현재 wording을 변경하거나 다른 source로 복사하지 않는다.

> **보류 결정:** 이 claim family들은 code, database, JSON-LD, `llms*.txt`, locale copy, CTA에서 변경 0건으로 유지한다. 병원이 대장의 필수 승인 정보를 제공한 뒤에만 claim family별로 독립된 change set과 regression 검증을 시작한다.

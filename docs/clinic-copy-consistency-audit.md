# 통계·의료 카피 정합성 감사

**작성일:** 2026-08-21  
**범위:** Hero, Philosophy, Results, locale packs, doctor SEO, crawler text, JSON-LD  
**감사 원칙:** 수치·의료 문구를 추정 수정하지 않는다. 병원/원장 확인 또는 근거 자료가 있는 source만 정본으로 취급한다.

## Canonical source와 현재 검증 상태

`client/src/lib/clinic-stats.ts`의 `CLINIC_STATS_CANONICAL`이 병원 홍보 수치의 근거·검증 source다. 파일 주석은 2026-07 원장 확인 및 수치 변경 전 원장 확인을 명시한다. `clinic-stats.test.ts`는 이 정본과 UI numeric source인 `constants.ts`의 공통 필드 일치, 개원 연도+경력의 현재 연도 정합성, 3인 전문의, `4,000` 포맷을 검증한다.

| 주장·수치 | canonical source | UI/SEO consumption | 감사 결과 | 처리 |
|---|---|---|---|---|
| 개원 2006년 | `CLINIC_STATS_CANONICAL.openedYear` | locale/Philosophy milestone, static JSON-LD, crawler text | 정본 존재. 일부 표시 문자열은 수동 유지 | 값 변경 없음 |
| 전문의 3인 | `specialistCount: 3` | doctor SEO, `SEO_CLINIC_META.physicianCount`, static JSON-LD, locale copy | 정본과 별도 SEO/JSON-LD source가 공존 | 숫자 변경 없음; roster 변경 시 동시 검토 |
| 경력 20년 | `yearsExperience: 20` | `CLINIC_STATS.yearsExperience` → `useClinicStats` → Hero/Philosophy/Results | UI numeric path는 정본 회귀 test로 동기화 | 수동 narrative의 “20년 이상/20여 년”은 확인 전 유지 |
| 눈밑지방재배치 4,000례 | `eyeBagCases: 4000` | `CLINIC_STATS` → hook, under-eye canonical detail, i18n count, doctor SEO, crawler text | primary UI count는 동기화. doctor SEO/crawler에 독립 hardcode가 남음 | 수치 변경 없음 |
| 레이저·장비 50종 | `deviceTypes`/`laserTypes: 50` | `CLINIC_STATS.laserTypes` → hook, i18n, static JSON-LD/crawler text | primary UI count는 동기화. public static text는 별도 surface | 수치 변경 없음 |
| 1:1 진료·상담 | `constants.ts`의 `doctorPatientRatio: 1` 및 locale prose | Results presentation, locale values/notice | `clinic-stats.ts`에 근거 field·source note가 없음 | **병원 확인 필요** |
| 누적 환자 10,000명+ | locale `journeyItems`, Philosophy fallback, crawler text | About timeline 및 public text | canonical stat·test 없음 | **병원 확인 필요** |

## UI 렌더링 경로

| 표면 | 수치 값의 실제 경로 | 문구 source | 정합성 판단 |
|---|---|---|---|
| Hero | `CLINIC_STATS` + `useClinicStats` + `useCountUp` | `i18n.*.about.stats` label | 20/4,000/50의 numeric rendering은 정본 회귀 test로 보호 |
| Philosophy | `useClinicStats` | `i18n.*.about.stats`, `journeyItems`; component fallback milestones | stats strip은 정합. 10,000명+ milestone은 별도 확인 필요 |
| Results | `useClinicStats`와 `1:${ratio.value}` assembly | `i18n.*.results` | 20/4,000 count는 정합. ratio·직접 시술·효과 서술은 정본 밖 |
| ResultsStatistics | `useClinicStats` | `i18n.*.results` | Results와 동일한 문자열·수치 경계 |
| 시술 상세 `under-eye-fat` | `CLINIC_STATS.eyeBagCases` import | canonical treatment module prose·FAQ | 4,000 numeric source 사용. 의료·진정 서술은 별도 content approval 대상 |
| Doctors SEO | independent `DOCTORS_SEO_CONTENT` | 4개 locale title/description | 3/20/4,000이 hardcoded로 중복되어 future drift 위험 |
| static `index.html` JSON-LD | static literals | 20년 이상·3인·4,000례·50종 등 | React constants와 별도 public SEO surface |
| `llms.txt`, `llms-full.txt` | static public text | 개원·경력·3인·4,000·50·진료/통증 서술 | public duplicate surface; automated sync 없음 |

## 다국어 및 하드코딩 감사 결과

한국어·영어·일본어·중국어 간체 locale은 `CLINIC_STATS.eyeBagCases`를 locale display용으로 import하고, `about.stats`의 4,000 표기에 이를 사용한다. 반면 20년·50종·10,000명·1:1·직접 진료·효과/안전성은 완성 문장 안에 직접 보관된다. `zh-TW`는 `zh`를 spread한 뒤 일부 Traditional Chinese 문자열을 override하는 구조이므로 두 파일을 함께 확인해야 한다.

| 분류 | 확인된 예시 surface | 현 상태 | 다음 조치 |
|---|---|---|---|
| 정본과 자동 연결 | Hero/Philosophy/Results의 20·4,000·50 numeric cards | 회귀 test로 constants↔canonical 일치 확인 | 유지 |
| 정본 수치의 수동 반복 | `doctorsSeo.ts`, `index.html` JSON-LD, `llms*.txt`, i18n narrative | 현재 값과 충돌은 확인하지 못했으나 자동 동기화 없음 | 수치 변경 시 update checklist로 함께 검토 |
| 운영·서비스 주장 | “모든 시술 원장 직접 담당”, “1:1 맞춤 상담”, “누적 환자 10,000명+” | canonical evidence link 없음 | **병원 확인 전 유지** |
| 의료·결과 주장 | 안전·자연스러운 결과, 최상의 결과 보장, 기대 효과·회복 기간, 통증 경감·진정 | medical advertising/clinical content이며 source가 분산 | **의료·운영 검토 전 수정 금지** |
| 다국어 번역 claim | en/ja/zh/zh-TW locale의 20년·직접 진료·1:1·10,000 문구 | Korean meaning과 동기화되지만 정본 DB/fixture 없음 | 한국어 원문 승인 후 한 번에 번역 검토 |

## 결론과 안전한 후속 작업

정본 수치 20년, 4,000례, 50종 및 3인 전문의는 `clinic-stats.ts`와 `constants.ts` 사이에서 test로 보호되는 부분이 있다. 그러나 전환·의료 홍보 문구와 public crawler text는 여러 source에 중복되어 있어, 현 시점에서 코드만으로 진위를 판정하거나 수정할 수 없다.

후속 작업은 병원이 확인한 **주장별 근거 목록**을 먼저 확정하는 것이다. 승인된 각 주장에 대해 canonical source, 허용 locale wording, JSON-LD/crawler text 동기화 목록을 별도 change set으로 만들고 focused tests를 보강한다. 이 감사는 수치, 의학적 효과, 예약·CTA, 운영 DB를 변경하지 않았다.

# Umami 성능 추세 Dashboard 운영 가이드

**작성일:** 2026-08-21  
**적용 범위:** `web_vital`, `lazy_mount`, `event_skeleton` custom event  
**현재 설정:** analytics endpoint와 website ID 환경변수는 설정되어 있으며, client entry는 두 값이 모두 있을 때만 Umami script를 동적으로 삽입한다.

## 확인 경로

Umami 운영 화면에서 이 사이트에 연결된 website를 선택하고 **Events**를 연다. Event name과 custom property로 다음 세 개의 성능 신호를 분리해서 본다. 이 문서는 vendor dashboard의 설정·권한·보존 기간을 바꾸지 않는다.

| Event name | 필터할 property | 해석 | 제외할 정보 |
|---|---|---|---|
| `web_vital` | `metric=lcp` 또는 `metric=inp`, `locale` | 최초 콘텐츠와 입력 반응성의 전반적 추세 | pathname, user ID, 예약·의료·입력 데이터 |
| `lazy_mount` | `metric=lazy_mount`, `surface=home_events` 또는 `home_facility`, `locale` | Header anchor 요청 뒤 실제 lazy target이 DOM에 나타나기까지의 시간 | selector, URL, event/시술 ID·제목·가격 |
| `event_skeleton` | `metric=event_skeleton`, `surface=home_special_event`, `locale` | 최초 이벤트 skeleton 표시부터 query terminal state까지의 시간 | query payload, error text, retry count, CTA/예약 정보 |

모든 event에서 `value`는 반올림한 밀리초다. `locale`은 document language이고 `surface`는 코드에 고정된 작은 분류값이다. 유입 경로나 방문자 식별자가 필요한 분석은 이 관측 범위 밖이며 추가 승인이 필요하다.

## 운영 절차

| 주기 | 확인 작업 | 기록할 내용 | 판단 방식 |
|---|---|---|---|
| 배포 다음 날 | Events에서 위 3개 event가 수신되는지 확인 | event name, metric/surface, sample count | payload에 금지 데이터가 없는지만 확인 |
| 매주 | 최근 7일을 직전 7일과 비교 | median/상위 구간 value, locale, event count | 절대 목표를 추정하지 않고 동일 surface의 방향성만 비교 |
| 기능 변경 전후 | 변경일 전후 동일 요일 구간 비교 | release/checkpoint ID, 측정 기간, sample count | event count가 지나치게 작으면 결론 보류 |
| 이상 징후 | 한 surface에서 값이 지속 상승하거나 수신이 사라진 경우 | browser/runtime 변화, query 실패/empty 상태, release ID | payload 확대 없이 local reproduction·focused test부터 수행 |

## 초기 기준선

첫 7일은 **기준선 수집 기간**이다. `home_events`, `home_facility`, `home_special_event`을 섞지 않고 각각의 sample 수와 duration 분포를 기록한다. cache warm/cold, locale, 배포 직후 traffic mix가 다를 수 있으므로 단일 값만으로 성능 회귀를 선언하지 않는다.

EVENT의 cache 비교는 아래 3개 상태를 별도 local/actual browser QA로 재현한다.

1. **Cold:** 새 browser context에서 Event query cache가 없는 최초 mount.
2. **Stale:** staleTime 경과 또는 stale cache 상태에서 background/renewed query가 필요한 mount.
3. **Fresh:** 같은 client session에서 10분 staleTime 안의 cached event data로 재진입.

각 QA는 `event_skeleton`의 mark/measure 및 payload 여부만 비교한다. event row, query response, visitor, 예약/상담/의료 데이터는 기록하거나 dashboard로 보내지 않는다.

## 금지 및 대응 경계

이 runbook은 Umami endpoint·website ID·script loading·tracking idle 정책을 바꾸지 않는다. dashboard에서 값이 없더라도 URL, selector, user property, raw query/error, event/시술 상세, 예약 CTA를 telemetry에 추가하지 않는다. 수신 문제는 환경변수 설정 여부와 browser console/network를 먼저 확인하고, privacy policy 변경은 별도 승인으로 다룬다.

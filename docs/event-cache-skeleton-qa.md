# EVENT Cache State Skeleton QA

**작성일:** 2026-08-21  
**범위:** Special Event의 `event_skeleton` metric 발생 조건과 client cache 상태별 UI 계약  
**개인정보 경계:** 기록 대상은 metric 발생 여부, 정수 duration, request count뿐이다. event row·ID·제목·가격·응답·사용자·예약·의료 정보는 수집하지 않는다.

## 결과

| 상태 | 재현 방식 | skeleton/metric 기대값 | 검증 결과 |
|---|---|---|---|
| Cold | 새 Chromium homepage context에서 `#events`를 처음 mount | initial skeleton 1회, `event_skeleton` 1회 | 실제 browser에서 metric 1회, duration 706ms, event request 1회 |
| Fresh | 같은 client session에서 10분 staleTime 안에 About→Home 재진입 후 Events mount | cached data가 즉시 사용되므로 initial skeleton metric 0회 | 실제 browser에서 추가 `event_skeleton` 0회, additional event request 0회 |
| Stale | cache data가 남아 있고 stale revalidation이 필요한 query mount | existing data를 유지한 background revalidation은 `isFetching`만 변할 수 있으므로 skeleton metric 0회 | `SpecialEventSection`은 `!isFetchVisible || isLoading`만 timing trigger로 사용하며 `isFetching`은 trigger가 아님; focused source regression으로 고정 |

## 해석

`event_skeleton`은 cache hit 여부 자체나 event response를 기록하지 않는다. Cold state에서만 최초 placeholder→terminal query 시간을 측정하고, Fresh/Stale cached data는 card/table을 유지하는 UX라서 별도의 skeleton delay event를 만들지 않는다. 따라서 dashboard에서 event 수가 적은 것은 cache hit 또는 initial skeleton 미표시를 의미할 수 있으며, request body나 user-level 속성을 추가해 원인을 추적하지 않는다.

실제 stale background refetch의 network behavior는 browser cache, React Query lifecycle, route transition에 영향을 받으므로 release 전후에는 Umami의 event count와 local focused contract를 함께 본다. 이 QA는 cache 설정, staleTime, event data, DB, CTA를 변경하지 않았다.

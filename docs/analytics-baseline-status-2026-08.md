# Analytics 7일 기준선 상태

**시작일:** 2026-08-21  
**대상 event:** `web_vital`, `lazy_mount`, `event_skeleton`, `treatments_skeleton`

analytics endpoint와 website ID 환경변수는 설정되어 있어 client custom event 전송 조건은 충족한다. 그러나 현재 task에는 Umami connector가 없고, configured analytics dashboard URL·account 권한 또는 export access도 제공되지 않았다. 따라서 event source code와 privacy policy는 확인했으나 dashboard의 실제 event count·duration 분포·7일 historical data는 read-only로 조회할 수 없다.

7일 기준선의 실제 분석은 dashboard access가 제공된 후 2026-08-21부터 2026-08-28까지의 event별 sample count, locale, surface, rounded duration을 확인하는 방식으로 수행한다. event row, user identifier, URL/query string, 예약·의료·CTA data는 수집하거나 요청하지 않는다.

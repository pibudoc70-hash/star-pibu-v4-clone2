# Step 2 — 운영 홈 CDN 캐시 헤더 조사

## 결론

홈 프리렌더 소스는 이미 브라우저 재검증과 edge 재사용을 구분하는 올바른 헤더를 설정한다. 로컬 프로덕션 원본에서 `/`, `/en`, `/ja`, `/zh`, `/zh-tw`는 모두 아래 값을 반환하며, `crawler-content`와 `home-schema` 표식도 함께 확인됐다.

```http
Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=600
```

반면 운영의 기본 게시 도메인과 두 사용자 도메인은 모두 같은 응답으로 이 값을 덮는다.

```http
Cache-Control: no-cache, no-store, must-revalidate
x-manus-proxy-mode: transparent/1
```

따라서 원인은 보안 헤더 미들웨어나 SPA fallback, 프리렌더 등록 순서가 아니라 **앱 바깥의 투명 게시 프록시 계층**이다. `securityHeadersMiddleware`는 Cache-Control을 쓰지 않고, 홈 프리렌더는 static fallback보다 먼저 등록된다. 프로젝트 설정에서도 캐시 정책 항목은 제공되지 않는다.

## 운영 3회 연속 측정

각 요청에는 서로 다른 `cache-audit` query를 사용했다. 모든 결과에서 `Age`와 `cf-cache-status`는 없었고, edge hit는 관측되지 않았다.

| 도메인 | TTFB 1 (초) | TTFB 2 (초) | TTFB 3 (초) | Cache-Control | Age / CDN 상태 |
|---|---:|---:|---:|---|---|
| `starpibu-qdq7tysk.manus.space` | 2.842 | 2.334 | 2.489 | `no-cache, no-store, must-revalidate` | 없음 / 없음 |
| `star-pibu.com` | 3.735 | 2.955 | 2.319 | `no-cache, no-store, must-revalidate` | 없음 / 없음 |
| `star-pibu.co.kr` | 3.790 | 3.180 | 3.131 | `no-cache, no-store, must-revalidate` | 없음 / 없음 |

`star-pibu.com`의 5개 프리렌더 홈 locale도 세 번씩 확인했다. `/`, `/en`, `/ja`, `/zh`, `/zh-tw`는 모두 `200`이지만 동일한 `no-store` 헤더와 `transparent/1`을 반환했다. 그러므로 특정 locale route 문제가 아니다.

## 적용 여부와 다음 조치

사용자 지시에 따라 source-controlled 문제가 아닌 것으로 확인된 뒤에는 애플리케이션 코드를 변경하지 않았다. 이미 원본에서 `max-age=0`을 유지하므로, 필요한 인프라 규칙은 프리렌더 홈 5개 locale에 한정해 원본 Cache-Control을 보존하거나 CDN이 `s-maxage=300, stale-while-revalidate=600`을 존중하도록 설정하는 것이다. 이 설정은 non-prerender path에 적용하면 안 된다.

콘텐츠 갱신 전파 시간은 실제 운영 콘텐츠를 바꾸지 않고는 측정할 수 없다. 특히 현재 운영 프록시는 `no-store`이므로 edge cache propagation을 판정할 조건 자체가 성립하지 않는다. 설정이 반영된 뒤, 병원이 승인한 비의료성 테스트 필드와 원복 값을 지정받아 관리자 변경→운영 확인→즉시 원복의 순서로 측정해야 한다. 5분을 초과할 경우에만 `s-maxage`를 낮춘다.

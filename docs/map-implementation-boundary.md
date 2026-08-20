# 지도 구현 호출 경계

**작성일:** 2026-08-21  
**범위:** 홈 Contact 지도, Directions page, Google Maps proxy, static-map fallback, location router  
**목적:** 여러 세대의 지도 구현이 공존하는 이유와 현재 live 호출 경로를 기록하고, 참조 조사 없이 route·fallback을 삭제하지 않도록 한다.

## 현재 live 사용자 경로

| 화면·경로 | 현재 primary 지도 구현 | 사용자 fallback | 상태 |
|---|---|---|---|
| 홈 `/#contact` | `ContactSection`의 Google Maps Embed iframe | 키보드 focus 시 노출되는 Kakao Map external link | **live** |
| `/directions` | `MapView`를 통한 Google Maps JavaScript proxy SDK | `MapView` 오류 시 Google Maps Embed iframe | **live** |
| `/en/directions`, `/ja/directions`, `/zh/directions`, `/zh-tw/directions` | locale을 반영한 `MapView` SDK | locale을 반영한 Google Maps Embed iframe 및 외부 길찾기 link | **live** |
| `/api/staticmap.png` | 서버의 cached Static Maps image endpoint | upstream 불가 시 `502 { error: "Map unavailable" }` | **live server route**, 현행 client direct caller 없음 |
| `trpc.location.getStaticMapUrl` | base64 static map compatibility contract | `success: false`, `dataUrl: null` | **deprecated but exposed**, 현행 client caller 없음 |

`Directions.tsx`의 최상단 “NOT ROUTED/dormant” 주석은 현재 route wiring과 일치하지 않는다. `App.tsx`는 기본 `/directions` 및 4개 locale directions route를 모두 등록한다. 이 문서는 주석만으로 route를 dormant로 간주하거나 삭제하지 않도록 명시한다. 주석 정정은 별도, 최소 범위 작업으로 다룬다.

## 호출 그래프와 소유 경계

| 구성 요소 | 책임 | 직접 caller/등록 위치 | fallback·안전 장치 | 변경·삭제 기준 |
|---|---|---|---|---|
| `ContactSection.tsx` | 홈 접근성 지도와 위치 정보 | Home landing section | iframe `loading="lazy"`, iframe title, keyboard-only Kakao link | 현재 홈 live source. 지도 URL·CSP·contact CTA와 함께 바꾸지 않음 |
| `Directions.tsx` | 전용·다국어 길찾기 page | `App.tsx` directions route | MapView 실패 때 locale-aware embed iframe, 외부 지도 link | active route. standalone page 제거 전 route/SEO/locale 확인 필수 |
| `components/Map.tsx` `MapView` | Forge Google Maps JS proxy script 1회 로드·interactive map render | Directions | 5초 container 대기, Maps readiness 10초, tiles render 8초 감지 후 `errorFallback`, cleanup | SDK proxy contract. fallback과 함께 테스트하지 않는 리팩터링 금지 |
| `hooks/useClinicMap.ts` | MapView용 marker/center/zoom helper | 현재 production import 없음; regression tests와 hook API가 참조 | marker API 미가용 시 warn하고 map 자체는 유지 | dormant candidate이나 test contract 존재. 별도 import graph·test migration 없이 삭제 금지 |
| `server/_core/staticMapRoute.ts` | `/api/staticmap.png` 바이너리 image delivery | Express boot에서 static serving 이전 등록 | dimensions whitelist, ETag/304, immutable cache, upstream 실패 502 | live HTTP surface. client caller 0만으로 삭제 금지 |
| `server/_core/mapCache.ts` | fixed clinic-coordinate static-map fetch·cache | staticMapRoute, locationRouter | request timeout, redirect error, 3MB cap, 24-hour LRU | static map shared backend source. route와 분리해 삭제하지 않음 |
| `server/routers/location.ts` | legacy base64 static map tRPC response | root `appRouter.location` | width/height/scale whitelist, null response | deprecated compatibility surface. external/older caller audit 전 삭제 금지 |
| `server/_core/map.ts` | generic authenticated Maps proxy helper | 현행 repository caller 없음 | Forge credential encapsulation | framework-level reusable helper. 현재 page rendering과 무관하지만 삭제 대상 아님 |

## 구현 방식이 다른 이유

홈은 가장 단순한 **Google Maps Embed iframe**을 사용한다. Google Maps JavaScript SDK의 script load·tile render에 의존하지 않고, `loading="lazy"`로 below-fold 비용을 낮춘다.

Directions는 interaction 중심의 **MapView SDK**를 우선 사용한다. `MapView`는 Forge proxy를 통해 marker/places library를 가져오며, script·container·tile render 실패 시 parent가 제공한 iframe fallback으로 전환한다. fallback 표시 시 `map_fallback_shown` 이벤트가 locale과 `surface: "directions"`만 포함해 Umami로 전송된다.

static map backend는 현재 화면의 primary path는 아니지만, binary image delivery와 이전 tRPC base64 contract를 모두 지원한다. `/api/staticmap.png`는 live Express route이고 `location.getStaticMapUrl`은 하위호환 용도다. client import가 없더라도 외부 consumer, cached asset, older frontend를 배제할 수 없으므로 유지한다.

## 삭제·통합 금지 및 향후 판단 기준

다음 변경은 이번 안전 실행 범위에서 하지 않는다.

1. `ContactSection`의 live iframe을 `MapView`로 강제 통합하거나 그 반대로 전환하지 않는다.
2. `/directions` 또는 locale directions route, `MapErrorBoundary`, CSP 관련 설정을 삭제하지 않는다.
3. `/api/staticmap.png`, `mapCache.ts`, `locationRouter`를 “현재 client import 없음”만으로 제거하지 않는다.
4. `useClinicMap.ts`를 regression test와 public API 확인 없이 삭제하지 않는다.
5. 지도 좌표, 주소, external map link, 예약·CTA 동작을 추정 변경하지 않는다.

통합 또는 제거를 검토하려면 다음 증거가 필요하다: repository·deployed client·external integration의 caller graph, HTTP access/observability 확인, locale directions render와 keyboard fallback QA, route/endpoint focused tests, cache/ETag behavior 검증, rollback 가능한 별도 checkpoint. 이 문서는 지도 구현·CSP·route를 변경하지 않는다.

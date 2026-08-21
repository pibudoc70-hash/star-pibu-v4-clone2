# Analytics Event Policy

**작성일:** 2026-08-21  
**범위:** OpenAI pixel, Umami analytics, Core Web Vitals telemetry  
**목적:** 현행 추적 구현이 수집할 수 있는 이벤트와 금지 데이터, 로딩 시점, 향후 전환 측정의 승인 경계를 고정한다.

## 현재 구현 요약

| 채널 | 초기화 위치 | 현재 전송·허용 이벤트 | 코드가 전달하는 payload | 로드/전송 시점 |
|---|---|---|---|---|
| OpenAI pixel | `client/index.html` | `page_viewed`만 | `{ type: "contents" }` | `window.load` 후 `requestIdleCallback` 우선, 최대 3초; 미지원 브라우저는 1.2초 timeout |
| Umami | `client/src/main.tsx` | Umami 기본 page view 및 custom `web_vital` | website ID, custom event의 metric·반올림한 value·locale | 환경변수 2개가 있을 때만 main bundle 평가 시 dynamic script 삽입 |
| Core Web Vitals | `client/src/lib/webVitals.ts` | `web_vital`의 `lcp`, `inp` | `metric`, `Math.round(value)`, `document.documentElement.lang` | `load` 이후 zero-delay로 observer 설정, 최초 `pagehide` 또는 hidden에서 1회 전송 |

> **현재 정책의 핵심:** 전환·예약·상담·치료 콘텐츠별 클릭 이벤트는 전송하지 않는다. 성능 개선 추세와 최초 콘텐츠 page view만 최소 범위로 측정한다.

## 허용 이벤트

| 이벤트 | 시스템 | 목적 | 유지 조건 |
|---|---|---|---|
| `page_viewed` | OpenAI pixel | 광고 유입 이후 콘텐츠 page view 측정 | payload는 현재의 고정 `type: "contents"`만 유지 |
| Umami 기본 page view | Umami | 익명 방문·페이지 성능 추세 확인 | analytics endpoint와 website ID가 설정된 경우에만 로드 |
| `web_vital` / `lcp` | Umami | Largest Contentful Paint 개선 효과 관찰 | 정수 밀리초와 document language만 전송 |
| `web_vital` / `inp` | Umami | Interaction to Next Paint 개선 효과 관찰 | 정수 밀리초와 document language만 전송 |
| `lazy_mount` | Umami | anchor 요청 뒤 lazy target이 실제 DOM에 나타날 때까지의 지연 관찰 | `metric: "lazy_mount"`, 정수 밀리초, document language, 고정 surface (`home_events` 또는 `home_facility`) |

개발 환경의 TTFB·FCP console 출력과 `getPerformanceMetrics()` 반환은 진단용이며 현재 analytics event로 전송하지 않는다.

`lazy_mount`는 IntersectionObserver의 일반 viewport mount가 아니라 `star-pibu:mount-anchor`의 명시적 anchor 요청에서만 기록한다. selector 문자열, pathname, URL parameter, event/시술 data, card price, 사용자 입력, 예약·상담 정보는 payload에 포함하지 않는다. target이 4초 안에 DOM에 나타나지 않으면 event를 전송하지 않는다.

## 금지 데이터와 구현 제약

다음 데이터는 analytics event, pixel payload, event name, query string, user property에 넣지 않는다.

| 금지 범주 | 예시 | 사유 |
|---|---|---|
| 직접 식별자 | 이름, 전화번호, 이메일, IP를 애플리케이션 payload로 재전송 | 개인정보 최소화 |
| 예약·상담 데이터 | 예약 일시, 예약 상태, OTP, 외부 예약 결과, 상담 내용 | 동결된 예약/OTP 영역 보호 및 민감 정보 노출 방지 |
| 건강·의료 정보 | 증상, 사진, 진단, 치료 이력, 시술 희망 내용 | 민감정보 및 의료 문맥 보호 |
| 사용자 입력 원문 | search query, form value, message, free-text feedback | 재식별·의도 추론 위험 방지 |
| 정밀 위치·기기 식별자 | GPS, 광고 ID, fingerprint, persistent user ID | 현재 성능 추세 측정 목적에 불필요 |
| URL의 세부 식별자 | token, referral parameter, 예약/관리자 query string | 로그·제3자 전송으로의 확산 방지 |

`webVitals.ts`는 코드 수준에서 URL·식별자 없이 metric, rounded value, locale만 custom payload로 보낸다. OpenAI pixel 및 Umami vendor SDK의 네트워크·쿠키 동작은 각 공급자의 설정과 정책에 좌우될 수 있으므로, SDK 기본 동작을 전제로 추가 식별자나 sensitive attribute를 전달하지 않는다.

## Idle load와 성능 보호 원칙

OpenAI pixel은 LCP 경쟁을 피하기 위해 `window.load` 이후 idle callback에서 추가 SDK를 불러온다. `requestIdleCallback`이 없을 때도 1.2초 timeout fallback을 사용한다. 이 지연 정책을 제거하거나 preload/defer script로 되돌리려면 LCP·INP 회귀 측정과 별도 승인이 필요하다.

Umami는 초기 analytics 설정이 유효한 경우에만 동적으로 삽입된다. Web Vitals observer는 `load` 후 시작하며 UI 렌더·예약 CTA·네트워크 query를 차단하지 않는다. 성능 계측 실패나 browser API 미지원은 catch로 무시하며, 사이트 기능을 저해하지 않아야 한다.

## 향후 전환 측정의 승인 경계

현재는 **전환 event를 구현하지 않는다**. 예약·외부 플랫폼 CTA·전화·카카오·네이버·위챗을 pixel에 연결하는 변경은 다음 조건을 모두 만족하는 별도 작업에서만 검토할 수 있다.

1. 병원이 정의한 전환의 의미와 허용 vendor를 서면으로 확정한다.
2. 개인정보·의료정보·예약 식별자를 payload에서 배제하는 event schema를 문서화한다.
3. 외부 예약 플랫폼 완료 여부를 browser query parameter, iframe message, scraping으로 추정하거나 수집하지 않는다.
4. consent/고지 필요성, 보존 기간, 접근 권한, vendor data processing 조건을 운영자가 검토한다.
5. 예약·OTP·CTA 동결 범위를 해제하는 명시 승인을 받고 focused test, LCP/INP 비교, rollback 계획을 준비한다.

가능한 미래 방향은 집계된 서버 측 전환 수나 명시적으로 허용된 비식별 completion signal이지만, 이는 **현재 구현 범위 밖**이다. 이 문서는 tracking code, CTA, 예약 코드, database schema를 변경하지 않는다.

# P0 Phase A — Managed Workspace 기준 감사

**감사 일시:** 2026-08-21 (KST)  
**Managed source checkpoint:** `489308d9`  
**Workspace tree revision:** `489308d95ec18f91a791e9118826b451a7dd5d26`  
**GitHub·운영 DB 접근:** 수행하지 않음

이 감사는 현재 Manus managed workspace를 유일한 source of truth로 삼아 읽기 전용으로 수행했다. local workspace 도구가 직접 제공하는 preview source는 위 checkpoint와 동일한 tree revision을 사용한다. managed hosting의 auto-publish 정책상 이 checkpoint가 현재 배포 후보이며, 별도 stable-production tree 식별자는 local source 도구에 노출되지 않아 추정하지 않았다. 따라서 source/production의 직접 tree 대조는 **식별 불가**로 기록하며, GitHub나 외부 revision을 가져오지 않았다.

| 확인 항목 | 실제 파일·경계 | 감사 결과 |
|---|---|---|
| 상담 오류 redaction | `client/src/components/ConsultationFormSection.tsx:163-182` | raw error는 분류용으로만 사용되고 UI에는 `errorRateLimit` 또는 `errorGeneric`만 표시된다. `err.message`, `msg`, `String(error)` 직접 렌더링은 확인되지 않았다. |
| 상담 focused regression | `client/src/components/ConsultationFormSection.errorRedaction.test.tsx` | DB URI, token, internal host, generic backend exception, Turnstile detail의 DOM 비노출 및 rate-limit 현지화 메시지를 이미 검증한다. |
| YouTube strict validator | `server/_core/imageProxyPolicy.ts:20,61-63` | `/^[A-Za-z0-9_-]{11}$/` 패턴이 export되어 있다. |
| 관리자 YouTube 경계 | `server/routers/admin.ts:130-156` | create와 update input 모두 strict pattern을 적용한다. |
| thumbnail proxy 경계 | `server/_core/index.ts:139-176` | strict validator가 cache key 생성과 upstream URL 생성 전에 실행된다. |
| Facility focus lifecycle | `client/src/components/FacilitySection.tsx:94-142` | initial close-button focus, Tab/Shift+Tab trap, Escape close, trigger focus restoration, body scroll lock을 모두 확인했다. |
| Equipment3 effect-state | `client/src/pages/Equipment3.tsx:284-337` | URL tab은 derived `activeId`로 동기화되며 effect 내부의 active-tab `setState`나 dependency suppression은 확인되지 않았다. |

## Revision 정합성 기록

| 항목 | 값 |
|---|---|
| Latest managed checkpoint | `489308d9` |
| Latest checkpoint revision/tree | `489308d95ec18f91a791e9118826b451a7dd5d26` |
| Preview revision | source tree와 동일한 managed workspace preview |
| Stable production revision | local source audit에서 직접 식별 불가 |
| Revision mismatch | direct comparison 불가; 외부 source를 병합하거나 가져오지 않음 |

## 동결 범위 확인

이번 Phase A에서는 실행 코드, 예약·OTP·외부 예약 CTA, Header, HeroSection, Footer, MobileBottomCTA, `useChatConfig`, schema, migration, fixture, seed 및 운영 DB를 수정하거나 접근하지 않았다. 이후 Phase B는 상담 오류 focused regression이 실제 보안 경계를 충분히 검증하는지 확인한 뒤, 필요한 경우에만 `ConsultationFormSection` 및 해당 test 범위에서 최소 변경한다.

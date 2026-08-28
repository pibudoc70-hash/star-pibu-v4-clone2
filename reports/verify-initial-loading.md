# 초기 로딩 fail-safe 검증

## 범위

요청대로 애플리케이션 코드를 변경하지 않고, 개발 서버의 실제 Chromium 세션에서 `#initial-loading`을 계측했습니다. CDP 네트워크 조건으로 정상·Slow 3G를 재현하고, `star-pibu:app-ready` 전달을 의도적으로 차단한 별도 시나리오로 fail-safe를 확인했습니다.

## 구현 기준

현재 초기 로딩 게이트는 `client/index.html`에서 `star-pibu:app-ready` 수신 후 두 번의 `requestAnimationFrame`으로 해제합니다. 이벤트가 수신되지 않을 경우 `window.setTimeout(release, 10000)`이 fallback 역할을 합니다.

## 결과

| 시나리오 | app-ready 관측 | 로딩 게이트 제거 시각 | 결과 |
|---|---:|---:|---|
| 정상 네트워크 | 0.80초 | 0.93초 | app-ready를 통해 즉시 해제 |
| Slow 3G (400ms RTT, 50KiB/s) | 미관측 | 10.48초 | fail-safe 해제 확인. 내비게이션 시작 기준 strict 10.00초보다 0.48초 늦음 |
| app-ready 의도적 차단 | 0.81초에 차단됨 | 10.11초 | fail-safe 해제 확인 |

## 판정

정상 환경의 앱 준비 완료 경로는 즉시 동작합니다. 네트워크가 느리거나 app-ready가 도달하지 않는 경우에도 게이트가 영구 유지되지는 않습니다. 다만 JavaScript 타이머는 이벤트 루프·네트워크 작업에 따라 정확히 10.000초에 실행되지 않을 수 있어, Slow 3G 조건에서 내비게이션 시점부터의 실제 제거 시각은 10.48초였습니다.

이번 작업은 **코드 변경 0건** 조건이므로 10초 타이머 값은 조정하지 않았습니다. strict wall-clock 10초를 요구할 경우 별도 승인으로 9초 내외의 안전 여유를 두는 변경을 검토할 수 있습니다.

## 검색엔진 재수집

Google Search Console과 네이버 서치어드바이저 재수집 요청은 사용자 지시에 따라 보류 상태입니다.

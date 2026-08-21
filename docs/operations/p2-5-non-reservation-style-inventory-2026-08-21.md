# P2-5 비예약 스타일 인벤토리

## 범위와 경계

이 인벤토리는 다음 비예약 컴포넌트만 대상으로 한 정적 검사 기록이다. `Header`, `HeroSection`, `Footer`, `MobileBottomCTA`, 예약·OTP·외부 예약 CTA와 예약 공통 selector는 포함하지 않는다. 기존 전역 token 값과 공통 CSS selector는 변경하지 않는다.

| 컴포넌트 | Hardcoded hex | Radius utility | Shadow utility | Focus 표현 | 관찰된 역할 |
| --- | ---: | ---: | ---: | --- | --- |
| `EventsSection` | 8 | 13 | 3 | 3 | event surface, native-link focus, share control |
| `Equipment3` | 14 | 23 | 4 | 1 | equipment card surface, tab/link focus |
| `FacilitySection` | 4 | 9 | 3 | 1 | carousel surface, indicator/lightbox focus |
| `YouTubeSection` | 3 | 13 | 5 | 11 | video card/modal/retry focus |

## 선택한 단일 token family

P2-5a는 **focus ring**만 다룬다. 새 `--focus-ring`은 기존 `--color-gold-primary`를 참조하므로, EventsSection의 기존 gold outline과 computed color를 바꾸지 않는다. EventsSection의 native event links와 retry button에만 이 token을 적용한다.

다음 항목은 이번 checkpoint에서 의도적으로 보류한다.

- surface, border, text-muted, radius, shadow token family
- 전역 CSS 정리 및 기존 token 값 변경
- 예약 UI에 영향을 줄 수 있는 selector 또는 utility 변경
- hardcoded color·inline style 일괄 치환
- 시각적 재설계 및 typography 변경

## 검증 기준

1. EventsSection의 focus-visible outline은 semantic `--focus-ring`만 참조한다.
2. `--focus-ring`은 기존 `--color-gold-primary`를 참조한다.
3. 신규 `!important`와 신규 hardcoded hex는 없다.
4. native link와 share control 분리, loading/error/empty/filter 동작은 P2-1 regression으로 유지한다.

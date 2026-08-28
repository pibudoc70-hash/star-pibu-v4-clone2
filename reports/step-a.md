# Step A 보고

## 1. `git diff --stat` 원문

아래 출력은 보고서 생성 직전의 작업 트리에서 실행한 `git diff --stat` 원문입니다. `reports/step-a.md`와 `reports/step-a.diff`는 이 보고서를 위해 새로 생성한 산출물이므로 Git의 추적 전(untracked) 상태에서는 해당 명령 출력에 포함되지 않습니다.

```text
 client/src/components/events/EventCard.tsx         |  5 ++++-
 .../components/events/EventCard.variant.test.ts    | 25 ++++++++++++++++++++++
 todo.md                                            |  2 ++
 3 files changed, 31 insertions(+), 1 deletion(-)
```

## 2. 게이트 결과

| 게이트 | 결과 | 확인 내용 |
|---|---:|---|
| Step A 전제 A-P1~P3 | PASS | `LeadEventCard`가 `id={previewPanelId}`인 `<article>`을 렌더하고, 변경 전 article에는 `aria-live`가 없었으며, `SpecialEventSection` 데스크톱 영역에 `event-card__desktop-preview-frame`이 존재함을 확인했습니다. |
| 회귀 우선 RED | PASS | 새 lead 전용 라이브 영역 단언을 추가한 직후, 구현 전 상태에서 해당 단언이 의도대로 실패했습니다. |
| 지정 회귀 테스트 | PASS | `pnpm test -- --run client/src/components/events client/src/components/SpecialEventSection.test.tsx client/src/components/SpecialEventSection.desktopLayout.test.tsx` 결과: 202개 파일, 1,869개 테스트 통과. |
| TypeScript 검사 | PASS | `pnpm check` 통과. |
| 린트 | PASS | `pnpm lint` 통과. 기존 경고 105건은 남아 있으나 새 오류·새 경고는 추가하지 않았습니다. |
| 데스크톱 실제 화면 | PASS | 1280px에서 EVENT 메뉴로 섹션을 연 뒤, 울쎄라피 프라임 selector 행에서 Tab을 누르면 써마지 FLX 행이 포커스·선택되고 좌측 미리보기도 써마지 FLX로 전환됨을 확인했습니다. |
| 라이브 영역 DOM | PASS | 전환 후 `#special-event-desktop-preview h3[aria-live="polite"]`의 제목이 써마지 FLX이고 속성값이 `polite`임을 확인했습니다. |
| 공백·변경 범위 검사 | PASS | `git diff --check` 통과. 구현 변경은 허용된 `EventCard.tsx`와 `EventCard.variant.test.ts`에 한정했습니다. |

## 3. 접근성 범위 선택

전체 미리보기 `<article>`에 라이브 영역을 두지 않았습니다. 대신 `EventCardHeader`의 기존 제목 `<h3>`에만 조건부 `aria-live="polite"`를 부여하고, lead variant에서만 `announceTitle`을 전달했습니다. 따라서 selector 변경 시 제목만 정중하게 알리며, 이미지 대체 텍스트·가격·상담 CTA 레이블은 라이브 알림 범위에 포함되지 않습니다. 제목 태그 자체에 속성을 적용했으므로 추가 래퍼나 스타일 클래스가 생기지 않아 시각적 구조와 레이아웃도 변경하지 않았습니다.

## 4. 동결 범위 및 산출물

예약·상담·OTP·외부예약·공통 CTA·헤더/히어로/푸터·`EventTableMobile` 및 테스트·`Home.tsx` FAQ JSON-LD·시술 정적 데이터·이벤트 라우터 응답값·통증관리·패키지/락파일·`dist/`·`server/_generated/`을 포함한 **모든 동결 범위의 diff는 0건**입니다. selector 행의 `aria-pressed`와 `aria-controls`도 변경하지 않았고, compact/legacy variant에는 라이브 영역 prop을 전달하지 않았습니다.

| 산출물 | 경로 |
|---|---|
| Step A 보고서 | `reports/step-a.md` |
| Step A 변경 패치 | `reports/step-a.diff` |
| 구현 | `client/src/components/events/EventCard.tsx` |
| 회귀 테스트 | `client/src/components/events/EventCard.variant.test.ts` |

Step A 완료. 승인 대기.

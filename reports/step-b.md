# Step B 보고

## 1. `git diff --stat` 원문

아래는 보고서 생성 직전에 실행한 `git diff --stat`의 원문입니다. 이 보고서와 패치 파일은 새 산출물이므로 추적 전 상태에서는 해당 출력에 포함되지 않습니다.

```text
 client/src/components/SpecialEventSection.test.tsx |  9 +++++
 client/src/components/SpecialEventSection.tsx      | 38 ++++++++++++++++++++--
 todo.md                                            |  1 +
 3 files changed, 46 insertions(+), 2 deletions(-)
```

## 2. 게이트 결과

| 게이트 | 결과 | 확인 내용 |
|---|---:|---|
| Step B 전제 B-P1~P3 | PASS | 기존 스켈레톤은 모바일에도 기본 이미지 카드가 표시됐고, 실제 모바일 UI는 `md:hidden`의 `EventTableMobile`이며, 그 내부에는 헤더 스트라이프와 `divide-y` 행 목록·`px-5 py-4` 행·원형 상세 버튼이 있음을 확인했습니다. |
| 회귀 우선 RED | PASS | 모바일 목록 스켈레톤 단언을 추가한 직후 구현 전 상태에서 `mobile-event-list-skeleton` 부재로 의도대로 실패했습니다. |
| 지정 회귀 테스트 | PASS | `pnpm test -- --run client/src/components/SpecialEventSection.test.tsx client/src/components/SpecialEventSection.desktopLayout.test.tsx client/src/components/events` 결과: 202개 파일, 1,870개 테스트 통과. |
| TypeScript 검사 | PASS | `pnpm check` 통과. |
| 린트 | PASS | `pnpm lint` 통과. 기존 경고 105건 외 신규 오류·경고는 추가하지 않았습니다. |
| 390px 모바일 시각 캡처 | 제한 | 전체 페이지와 `#events` 앵커의 390×844 캡처를 각각 시도했으나 캡처 서비스가 두 번 모두 실패했습니다. 대신 렌더 테스트가 모바일 전용 rounded/border 목록 카드와 정확히 3개의 행을 검증하며, 구현은 실제 목록의 `px-5 py-4`·11단위 원형 버튼 형상을 따릅니다. |
| 1280px 데스크톱 스켈레톤 보존 | PASS | 데스크톱 분기를 별도 `hidden … md:grid md:grid-cols-12` 컨테이너로 유지해 기존 lead + compact 3행 구조를 보존했고, 기존 데스크톱 레이아웃 회귀 테스트가 통과했습니다. |
| 공백·변경 범위 검사 | PASS | `git diff --check` 통과. 구현 변경은 허용된 `SpecialEventSection.tsx`와 그 테스트에 한정했습니다. |

## 3. 구현 범위

`SpecialEventSection.tsx`의 초기 스켈레톤 분기에 `MobileEventListSkeleton`만 추가했습니다. 이 컴포넌트는 모바일에서만 보이는 `rounded-2xl overflow-hidden border` 외곽, 아이콘 자리와 짧은 바가 있는 헤더 스트라이프, 제목 바와 원형 버튼 자리를 각각 가진 3개 행으로 구성됩니다. 실제 `EventTableMobile`의 배경·테두리 변수와 `px-5 py-4` 행 간격을 재사용해 로딩 완료 후 목록 카드로 전환될 때 이미지 카드가 사라지는 형태 전환을 제거했습니다.

데스크톱은 기존 lead 카드와 compact 스켈레톤 3행을 그대로 같은 12열 grid 안에서 유지했습니다. `#events`, `aria-busy`, `md:scroll-mt-40`, `useEventSkeletonTiming`, 그리고 `PainManagementGuide`의 `mt-10` 래퍼도 변경하지 않았습니다. `EventTableMobile.tsx`와 해당 테스트는 읽기 전용으로 유지했습니다.

## 4. 동결 범위 및 산출물

예약·상담·OTP·외부예약·공통 CTA·헤더/히어로/푸터·`EventTableMobile` 및 테스트·`Home.tsx` FAQ JSON-LD·시술 정적 데이터·이벤트 라우터 응답값·통증관리·패키지/락파일·`dist/`·`server/_generated/`을 포함한 **모든 동결 범위의 diff는 0건**입니다. 신규 의존성·`any`·린트 비활성화도 추가하지 않았습니다.

| 산출물 | 경로 |
|---|---|
| Step B 보고서 | `reports/step-b.md` |
| Step B 변경 패치 | `reports/step-b.diff` |
| 구현 | `client/src/components/SpecialEventSection.tsx` |
| 회귀 테스트 | `client/src/components/SpecialEventSection.test.tsx` |

Step B 완료. 승인 대기.

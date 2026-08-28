# Step 0-FIX 보고

## 1. 수정 범위

`client/src/pages/Home.fouc.test.ts`의 초기 로딩 문구 단언 1건만 현재 의도된 구현에 맞게 변경했습니다.

| 항목 | 이전 | 이후 |
|---|---|---|
| 테스트 기대 문구 | `스타피부과를 준비하고 있습니다` | `콘텐츠를 불러오는 중입니다` |

FOUC 게이트, `role="status"`, `aria-live="polite"`, 초기 로딩 레이어 탐색 및 제거 단언은 변경하지 않았습니다. `index.html`, `main.tsx`를 포함한 프로덕션 소스는 수정하지 않았습니다.

## 2. 게이트 결과

| 게이트 | 결과 |
|---|---|
| `Home.fouc.test.ts`와 `main.initialLoading.test.ts` | 통과 |
| 이벤트·SpecialEventSection 지정 테스트 | 통과 |
| `pnpm check` | 통과 |
| `pnpm lint` | 오류 0건, 기존 경고 105건 |
| `git diff --check` | 통과 |
| 동결 파일 변경 | 0건 |
| 소스 diff 범위 | `Home.fouc.test.ts` 1개 파일, 1 insertion / 1 deletion |

## 3. Step 1 변경 측정 방식

로컬 `/api/storage`는 스토리지 백엔드 의존으로 415를 반환하므로 TTL 측정 근거로 사용하지 않습니다. Step 1에서는 실제 프로덕션 도메인에서 `star_logo_d0ae8bbf_8a004167.webp` 및 `HERO_BACKGROUND_IMAGE`가 가리키는 실제 키의 헤더를 측정합니다. 결과가 immutable이면 코드 변경 없이 종료하고, 짧은 TTL이면 인프라 계층 이슈로 기록합니다.

**Step 0-FIX 완료. Step 1 승인 대기.**

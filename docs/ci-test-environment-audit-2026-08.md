# CI·테스트 환경 Audit

**검토일:** 2026-08-21  
**범위:** `.github/workflows/ci.yml`, package scripts, Vitest include/exclude, DB integration 경계  
**결론:** 현재 CI는 frozen lockfile, type/lint/unit/DB integration/build/dependency audit을 분리해 실행한다. 중복 또는 backup workflow는 없으며, 이번 단계에서 workflow와 예약 테스트는 변경하지 않는다.

## Workflow inventory

저장소에는 `.github/workflows/ci.yml` 하나만 존재한다. workflow는 `main`, `develop`, `improvement/**` push와 `main` 대상 pull request에서 실행된다. 별도의 backup, duplicate, disabled CI workflow는 확인되지 않았다.

| Job | 설치 방식 | 실행 명령/환경 | 판단 |
|---|---|---|---|
| Type Check | `pnpm install --frozen-lockfile` | `pnpm exec tsc --noEmit` | 충족 |
| Lint | frozen lockfile | `pnpm lint` | 충족 |
| Unit Test | frozen lockfile | `pnpm test:unit` | DB 없는 unit boundary |
| DB Integration Test | frozen lockfile + MySQL 8.4 service | test DB migrate 후 `pnpm test:integration` | 별도 DB job |
| Production Build | frozen lockfile | `pnpm build`, check/lint/unit 이후 | 충족 |
| Dependency Audit | frozen lockfile | `pnpm audit --audit-level moderate` | 충족 |

## Unit·integration 경계

`test:unit`은 reservation, events, starpibu DB integration test를 명시적으로 제외한다. Vitest는 client와 server test를 포함하되 server test는 node environment, client test는 jsdom environment로 분리한다. `test:integration`은 `scripts/run-reservation-integration-tests.mjs`에서 실행하며 CI job만 MySQL service와 `TEST_DATABASE_URL`을 제공하고 migrate를 수행한다.

따라서 현재 로컬 비예약 변경 검증에서 DATABASE_URL을 제거한 `pnpm test:unit`을 실행하고, CI에서만 DB integration을 수행하는 기존 정책이 일관된다. 예약/OTP test·migration·workflow를 이번 audit 명분으로 바꾸면 동결 범위를 위반하므로 보류한다.

## 결론

첨부 제안의 frozen lockfile, unit/integration 분리, audit gate, backup workflow 정리 요구는 현재 CI에서 이미 충족하거나 적용 대상이 아니다. CI 유지보수는 추후 실제 GitHub Actions failure, dependency upgrade, 또는 새로운 integration test 요구가 발생할 때 별도 작업으로 다룬다.

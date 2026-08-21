# Dependency Audit

**검토일:** 2026-08-21  
**명령:** `pnpm audit --json`  
**결론:** 현재 lockfile 기준으로 moderate 이상을 포함한 advisory가 없다. 안전 패치 대상이 확인되지 않아 dependency 또는 lockfile을 변경하지 않는다.

## Audit 결과

| 구분 | 결과 |
|---|---:|
| Info | 0 |
| Low | 0 |
| Moderate | 0 |
| High | 0 |
| Critical | 0 |
| Audit actions | 0 |
| Total resolved dependency entries | 1,011 |

Audit JSON에는 advisory와 action이 모두 비어 있다. 따라서 direct dependency, transitive dependency, runtime/dev dependency로 재분류하거나 security-driven patch update를 수행할 대상이 없다.

## 변경 보류 이유

현재 direct production dependency에는 React, Express, tRPC, TanStack Query, Drizzle, MySQL client, rate limiting, image processing 등 runtime critical package가 포함된다. advisory가 없는 상태에서 단순 최신화는 peer dependency·build·예약/OTP integration 호환성 위험을 만들 수 있으므로 첨부 제안의 “명확한 safe patch만 적용” 조건을 만족하지 않는다.

향후 audit가 advisory를 보고하면 package별 advisory ID, direct/transitive path, runtime/dev exposure, semver patch availability, reservation/OTP impact를 먼저 기록한 뒤 단일 package group으로 업데이트를 제안한다. 이 audit은 package.json, lockfile, dependency, database, reservation/OTP code를 변경하지 않았다.

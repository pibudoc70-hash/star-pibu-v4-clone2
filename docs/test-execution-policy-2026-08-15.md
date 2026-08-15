# 테스트 실행 정책

예약·OTP 통합 테스트는 실제 DB를 생성·수정할 수 있으므로 일반 단위 테스트와 분리한다.

| 명령 | 범위 | DB 조건 |
|---|---|---|
| `pnpm test` 또는 `pnpm test:unit` | 예약 DB 통합 파일을 제외한 단위·회귀 테스트 | DB 없이 실행 가능 |
| `pnpm test:integration` | 기존 `server/__tests__/reservation.test.ts`만 실행 | `TEST_DATABASE_URL` 필수; 값은 테스트용 MySQL만 허용 |
| `pnpm test:all` | 단위 후 예약 통합 테스트 | `TEST_DATABASE_URL` 필수 |

`test:integration`은 `TEST_DATABASE_URL`이 없거나 MySQL URL 형식이 아니면 DB 명령을 실행하지 않고 실패한다. CI는 별도 MySQL service를 `TEST_DATABASE_URL`로 전달하고, migration도 같은 URL을 명시적으로 사용한다. 예약 테스트·예약 구현·운영 DB 설정은 변경하지 않는다.

# STAR Pibu v4 — 부산 스타피부과 클리닉 시스템

부산 서면 스타피부과의 공식 웹사이트 및 관리 시스템입니다. 시술·장비 소개, 이벤트 관리, 다국어(한국어·영어·일본어·중국어) 지원과 **네이버·카카오 소셜 로그인 기반 예약**을 제공합니다.

> 이 프로젝트는 Node.js/Express, MySQL/TiDB, WebSocket을 사용합니다. 표준 Cloudflare Pages/Workers 런타임에는 그대로 배포할 수 없으며, Cloudflare 이전에는 별도 리팩터링이 필요합니다.

## 현재 완료된 기능

- 공개 웹사이트 및 다국어 페이지
- 관리자 역할 기반 관리 화면
- 네이버·카카오 OAuth 2.0 로그인
  - 별도 아이디·비밀번호 회원가입 없음
  - 첫 로그인 시 내부 사용자와 소셜 identity를 자동 생성
  - HttpOnly OAuth state cookie, 서명 검증, PKCE 적용
- 로그인 예약 정책
  - 네이버 또는 카카오 로그인 사용자만 회원 예약 생성 가능
  - 로그인한 사용자는 본인 예약 조회·취소 가능
  - 예약 생성 시 휴대폰 번호, 날짜, 시간, 예약 불가일 및 개인정보 동의 검증
- 기존 전화번호 OTP 비회원 예약 호환 경로
  - OTP는 암호학적 난수로 생성
  - HMAC-SHA256 해시 저장, timing-safe 비교, 단일 사용 처리
- 보안 강화
  - 세션 쿠키 `HttpOnly`, `SameSite=Lax`
  - tRPC 변경 요청의 Origin 검증
  - WebSocket 관리자 인증의 서버 측 JWT·DB role 검증
  - 운영 환경 Turnstile fail-closed
  - 관리자 전용 YouTube 캐시 초기화

## 기술 스택

| 계층 | 기술 |
|---|---|
| 프론트엔드 | React 19, Tailwind CSS 4, Vite, Wouter, TanStack React Query |
| 백엔드 | Node.js, Express 4, tRPC 11 |
| 데이터베이스 | MySQL / TiDB, Drizzle ORM |
| 인증 | Naver OAuth 2.0, Kakao OAuth 2.0, JWT HttpOnly 세션 쿠키 |
| 실시간 기능 | `ws` WebSocket |
| 테스트 | Vitest, jsdom |
| 언어 | TypeScript |

## 주요 URI

| 구분 | URI | 설명 |
|---|---|---|
| 소셜 로그인 선택 | `/login?returnTo=/my-reservations` | 네이버·카카오 로그인 선택 |
| 네이버 로그인 시작 | `/api/auth/naver/start` | OAuth authorize redirect |
| 네이버 콜백 | `/api/auth/naver/callback` | Naver Developers에 등록 필요 |
| 카카오 로그인 시작 | `/api/auth/kakao/start` | OAuth authorize redirect |
| 카카오 콜백 | `/api/auth/kakao/callback` | Kakao Developers에 등록 필요 |
| 예약 | `/reservation` | 로그인 사용자의 예약 생성 화면 |
| 내 예약 | `/my-reservations` | 로그인 사용자 본인 예약 조회·취소 |
| 관리자 | `/admin` | 관리자 역할 필요 |

`returnTo`는 같은 사이트 내부의 `/...` 경로만 허용됩니다.

## 소셜 로그인 및 예약 흐름

1. 사용자가 `/login`에서 네이버 또는 카카오를 선택합니다.
2. 서버가 state·PKCE verifier를 HttpOnly cookie에 보관하고 OAuth 공급자로 이동시킵니다.
3. callback에서 state 서명, 공급자, 만료 시간 및 값을 검증합니다.
4. 공급자 사용자 ID를 `authIdentities(provider, providerUserId)`로 조회합니다.
5. 최초 로그인이라면 `users`와 `authIdentities` 레코드를 생성합니다.
6. 자체 JWT 세션 쿠키를 발급하고, 요청한 내부 경로로 이동합니다.
7. `loginMethod`가 `naver` 또는 `kakao`인 사용자만 회원 예약을 생성할 수 있습니다.

## 데이터 구조 및 저장소

| 모델 | 용도 |
|---|---|
| `users` | 내부 사용자, 역할, 로그인 방식 |
| `authIdentities` | 소셜 공급자 계정과 내부 사용자의 1:1 연결 |
| `reservations` | 예약 정보, 사용자 소유자, 개인정보 동의 기록 |
| `guestOtps` | 비회원 호환 OTP의 해시·만료·단일 소비 상태 |

저장소는 MySQL 또는 TiDB와 Drizzle ORM을 사용합니다. 서버 런타임 메모리나 로컬 파일에 예약·인증 데이터를 저장하지 않습니다.

## 환경 변수

개발용 `.env` 파일에 필요한 값을 설정합니다. `.env*` 파일은 Git에 커밋하지 않습니다.

```dotenv
# 필수 공통 설정
DATABASE_URL=mysql://user:pass@host:3306/dbname
JWT_SECRET=replace-with-a-long-random-secret
APP_ORIGIN=http://localhost:3000

# Naver OAuth
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
NAVER_REDIRECT_URI=http://localhost:3000/api/auth/naver/callback

# Kakao OAuth
KAKAO_REST_API_KEY=...
# Kakao 앱에서 Client Secret을 사용하는 경우에만 설정
KAKAO_CLIENT_SECRET=...
KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/kakao/callback

# 운영 환경에서 상담 폼을 사용할 경우 필수
TURNSTILE_SECRET_KEY=...
```

운영에서는 `JWT_SECRET`, `DATABASE_URL`, `APP_ORIGIN` 및 적어도 하나의 소셜 로그인 공급자 설정이 없으면 서버가 시작되지 않습니다.

### OAuth 공급자 콘솔 설정

Naver Developers와 Kakao Developers에 실제 서비스 도메인을 등록해야 합니다.

| 공급자 | 개발 callback | 운영 callback |
|---|---|---|
| Naver | `http://localhost:3000/api/auth/naver/callback` | `https://서비스도메인/api/auth/naver/callback` |
| Kakao | `http://localhost:3000/api/auth/kakao/callback` | `https://서비스도메인/api/auth/kakao/callback` |

카카오는 닉네임·이메일 동의 항목을 설정해야 하며, 이메일 미제공 계정도 식별자 기반으로 로그인할 수 있도록 처리합니다.

## 데이터베이스 마이그레이션

소셜 로그인과 OTP 보안 변경에는 `drizzle/0031_social_auth_and_otp_hardening.sql`이 필요합니다.

1. **운영 DB를 먼저 백업**합니다.
2. 기존 migration 적용 이력, 특히 기존 `0008` 번호 충돌 여부를 확인합니다.
3. 테스트 DB에서 0031 migration을 먼저 검증합니다.
4. 운영 DB에 migration을 적용하고 `authIdentities`, `reservations.privacyAgreed`, `guestOtps.codeHash`, `guestOtps.consumedAt`를 확인합니다.

기존 OTP 평문은 migration에서 해시로 변환 후 삭제됩니다. migration 시점에 발급되어 있던 OTP는 만료 처리하는 운영 정책을 권장합니다.

## 로컬 실행

### 사전 요구 사항

- Node.js 22 이상
- pnpm 10 이상
- MySQL 또는 TiDB 인스턴스

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 검증 명령

```bash
pnpm check       # TypeScript 타입 검사
pnpm lint        # ESLint 검사
pnpm test        # Vitest 전체 테스트
pnpm build       # 프론트엔드 및 Node 서버 production build
```

## 사용자 안내

1. 예약 화면 또는 내 예약 화면에서 로그인을 선택합니다.
2. 네이버 또는 카카오 계정으로 인증합니다.
3. 예약 정보와 필수 개인정보 수집·이용 동의를 입력해 예약합니다.
4. **내 예약**에서 로그인 계정으로 생성한 예약을 확인하거나 취소합니다.

별도의 비밀번호를 만들거나 관리할 필요가 없습니다. 기존 비회원 OTP 흐름은 호환 목적으로 유지 중이며, 장기 유지 여부는 운영 정책에 따라 결정해야 합니다.

## 코드 품질 검토 반영 사항 (2026-07-22)

- 상담 폼이 현재 선택된 언어를 서버에 전송하도록 수정해 다국어 상담 데이터가 한국어로 고정되는 문제를 방지했습니다.
- 키워드 대시보드의 실시간 갱신을 안정화했습니다. WebSocket 이벤트·수동 새로고침·자동 새로고침 시 목록과 상위 차트를 함께 갱신하며, 관리자가 아닌 사용자는 WebSocket에 연결하지 않습니다.
- 대시보드의 평균값 0건 나누기, 목록의 배열 인덱스 key, 진행 막대의 범위 초과를 방어했습니다.
- 예약 이메일 템플릿은 사용자 입력 HTML 이스케이프와 상태 class allowlist를 적용해 HTML/속성 주입을 방지합니다.

## 남은 작업 및 권장 다음 단계

- Naver/Kakao 실제 앱 키와 callback URL을 등록해 OAuth end-to-end 테스트 수행
- 운영 DB backup 후 `0031_social_auth_and_otp_hardening.sql` 적용
- OAuth state, OTP 재사용, 예약 권한, WebSocket 관리자 위조에 대한 회귀 테스트 추가
- DB fixture 또는 test database를 구성해 현재 DB 의존 테스트를 안정화
- `server/email.ts` 사용자 입력 HTML escape 및 메일 발송 실패 정책 정비
- dependency audit의 `xlsx`, `drizzle-orm`, `axios`, `form-data` 항목 검토·업데이트
- 기존 Manus OAuth를 관리자 레거시 경로로 유지할지 제거할지 정책 결정

## 배포 상태

- **현재 런타임**: Node.js/Express 서버가 필요한 환경
- **Cloudflare Pages/Workers**: 직접 배포 불가 (Express, MySQL 연결, `ws`, Node API 의존)
- **배포 전 필수 확인**: 운영 환경 변수, OAuth callback 등록, DB migration, 통합 테스트

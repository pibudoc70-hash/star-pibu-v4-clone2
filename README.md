# STAR Pibu v4 — 부산 스타피부과 클리닉 시스템

부산 서면 스타피부과의 공식 웹사이트 및 관리 시스템. 피부과 전문의 3인 체제 클리닉의 시술·장비 소개, 이벤트 관리, 예약 접수, 다국어(한·영·일·중) 지원을 포함한다.

---

## 기술 스택

| 계층 | 기술 |
|------|------|
| 프론트엔드 | React 19, Tailwind CSS 4, Vite, wouter (SPA 라우팅) |
| 백엔드 | Node.js, Express 4, tRPC 11 (end-to-end type safety) |
| 데이터베이스 | MySQL / TiDB, Drizzle ORM |
| 인증 | Manus OAuth 2.0 (세션 쿠키 기반) |
| 파일 스토리지 | AWS S3 (Manus built-in storage) |
| 테스트 | Vitest, jsdom |
| 언어 | TypeScript (전 계층) |

---

## 로컬 실행 방법

### 사전 요구사항

- Node.js 22+, pnpm 10+
- MySQL 또는 TiDB 인스턴스
- `.env` 파일에 아래 환경 변수 설정 (Manus 플랫폼에서는 자동 주입됨)

```
DATABASE_URL=mysql://user:pass@host:3306/dbname
JWT_SECRET=...
VITE_APP_ID=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...
OWNER_OPEN_ID=...
OWNER_NAME=...
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
```

### 개발 서버 실행

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

### 프로덕션 빌드

```bash
pnpm build        # dist/ 디렉토리 생성
pnpm start        # 프로덕션 서버 실행
```

### 데이터베이스 마이그레이션

```bash
pnpm db:push      # drizzle-kit generate + migrate
```

### 타입 검사 / 테스트

```bash
pnpm check        # TypeScript 타입 검사
pnpm test         # Vitest 전체 테스트 실행
pnpm format       # Prettier 포맷팅
```

---

## 폴더 구조

```
star-pibu-v4-clone/
├── client/                   # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── pages/            # 페이지 컴포넌트 (라우트 단위)
│   │   ├── components/       # 재사용 UI 컴포넌트 (shadcn/ui 포함)
│   │   ├── contexts/         # React Context (LangContext, ThemeContext 등)
│   │   ├── hooks/            # 커스텀 훅
│   │   ├── data/             # 정적 데이터 (시술 카테고리, SEO 헬퍼 등)
│   │   ├── lib/              # tRPC 클라이언트, 유틸리티
│   │   ├── routes.ts         # 라우트 설정 (lazy import + 다국어 헬퍼)
│   │   ├── App.tsx           # 라우터 진입점
│   │   └── index.css         # 글로벌 테마 (CSS 변수 기반)
│   └── public/               # favicon, robots.txt 등 정적 설정 파일만
│
├── server/                   # 백엔드 (Express + tRPC)
│   ├── _core/                # 프레임워크 플러밍 (OAuth, context, tRPC 설정)
│   ├── db/                   # 도메인별 DB repository
│   │   ├── connection.ts     # DB 연결 초기화 (getDb)
│   │   ├── users.ts          # 사용자 repository
│   │   ├── reservations.ts   # 예약 repository
│   │   ├── otp.ts            # OTP 인증 repository
│   │   ├── events.ts         # 이벤트 repository
│   │   ├── treatments.ts     # 시술·카테고리 repository
│   │   ├── unavailableSlots.ts # 예약불가 슬롯 repository
│   │   ├── youtube.ts        # YouTube repository
│   │   ├── equipment3.ts     # Equipment3 repository
│   │   └── index.ts          # barrel re-export
│   ├── db.ts                 # 하위 호환 barrel (→ server/db/index.ts)
│   ├── routers/              # 도메인별 tRPC 라우터 (입력 파싱·권한 검사만)
│   │   ├── admin.ts          # 관리자 전용 프로시저
│   │   ├── equipment3.ts     # 시술·장비(DB 연동) 프로시저
│   │   ├── events.ts         # 이벤트 프로시저
│   │   ├── popup.ts          # 팝업 프로시저
│   │   ├── reservation.ts    # 예약 프로시저
│   │   ├── treatments.ts     # 시술(treatments) 프로시저
│   │   └── youtube.ts        # YouTube 프로시저
│   ├── routers.ts            # appRouter 조합 진입점
│   ├── services/             # 비즈니스 로직 계층
│   │   └── reservation.service.ts  # 예약 생성·검증·알림 오케스트레이션
│   ├── __tests__/            # 회귀·도메인 테스트 모음
│   └── email.ts / sms.ts / storage.ts / otpCleanup.ts
│
├── drizzle/                  # Drizzle ORM 스키마 및 마이그레이션
│   ├── schema.ts             # 전체 테이블 정의
│   └── migrations/           # 자동 생성 마이그레이션 SQL
│
├── shared/                   # 클라이언트·서버 공유 타입 및 상수
│   └── const.ts, navConfig.ts 등
│
├── scripts/                  # 일회성 데이터 마이그레이션·시딩 스크립트
│   └── migrate-*.mjs, seed-*.mjs 등
│
├── patches/                  # pnpm patch (wouter SPA 라우팅 수정)
│   └── wouter@3.7.1.patch
│
├── drizzle.config.ts         # Drizzle Kit 설정
├── vite.config.ts            # Vite 빌드 설정
├── vitest.config.ts          # Vitest 테스트 설정
└── package.json
```

---

## 주요 기능

### 공개 페이지

| 기능 | URL | 설명 |
|------|-----|------|
| 홈 (한국어) | `/` | 히어로, 의료진 소개, 시술 소개, 이벤트, 연락처 |
| 시술·장비 소개 | `/equipment3` | DB 연동 시술·장비 목록 (카테고리 탭 + 카드) |
| 시술 상세 | `/treatments/:slug` | 시술별 상세 페이지 (다국어 지원) |
| 이벤트 | `/events/:id` | 이벤트 상세 |
| 피부과 소개 | `/about` | 클리닉 소개 |
| 외국인 안내 | `/foreign-guide` | 영어 전용 외국인 안내 |
| 연구 자료 | `/research` | 학술·연구 자료 |
| 개인정보처리방침 | `/privacy` | 개인정보 처리방침 |

### 다국어 지원

한국어(`/`), 영어(`/en/`), 일본어(`/ja/`), 중국어(`/zh/`) 4개 언어를 지원한다. `client/src/routes.ts`의 `LANG_ROUTES` 배열과 `withLangPrefixes()` 헬퍼로 관리된다.

### 관리자 기능 (로그인 필요)

| 기능 | URL |
|------|-----|
| 관리자 대시보드 | `/admin` |
| 시술·장비 관리 | `/admin/equipment3`, `/admin/equipment3/new`, `/admin/equipment3/:id/edit` |
| YouTube 관리 | `/admin/youtube` |

### 예약 시스템

비회원 전화번호 OTP 인증 기반 예약 접수. 네이버 예약 외부 링크와 병행 운영한다.

### SEO

- 페이지별 `<meta>` 태그 및 Open Graph 설정 (`SeoHead` 컴포넌트)
- JSON-LD 구조화 데이터: `LocalBusiness`, `MedicalClinic`, `Physician`, `FAQPage`, `TreatmentPage`
- 다국어 `hreflang` 태그 자동 생성

---

## 아키텍처 메모

- **tRPC-first**: 모든 클라이언트-서버 통신은 `server/routers.ts`에 정의된 tRPC 프로시저를 통한다. REST 엔드포인트를 직접 추가하지 않는다.
- **3계층 구조**: Router(입력 파싱·권한) → Service(비즈니스 로직) → Repository(DB 쿼리). 단순 CRUD 도메인은 Router → Repository 직통이 허용된다.
- **DB repository 패턴**: `server/db/` 디렉토리의 도메인별 파일에 쿼리 헬퍼를 작성하고, `server/db.ts` barrel을 통해 import한다.
- **Service 계층**: 비즈니스 규칙이 있는 도메인(예약 날짜 검증, OTP 재확인, 이메일·알림 오케스트레이션)은 `server/services/` 에 분리한다. 단순 CRUD는 Service 없이 Router → Repository 직통으로 처리한다.
- **인증**: `protectedProcedure`는 `ctx.user`를 주입하며, `adminProcedure`는 `role === "admin"` 검사를 추가한다.
- **파일 스토리지**: 이미지·미디어는 S3에 업로드하고 DB에는 키/URL만 저장한다. `client/public/`에 미디어 파일을 넣지 않는다.
- **wouter 패치**: `patches/wouter@3.7.1.patch`는 SPA 라우팅의 `Switch` 컴포넌트 동작을 수정한 pnpm patch다. `pnpm install` 시 자동 적용된다.

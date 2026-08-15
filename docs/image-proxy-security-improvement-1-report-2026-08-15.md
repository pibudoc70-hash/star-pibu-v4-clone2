# 개선 항목 1: 이미지 프록시 보안 강화

## 1. 발견한 문제

`/api/storage/*`는 presigned URL의 host·프로토콜을 명시적으로 검증하지 않았고, 응답 MIME을 요청 파일명 확장자에서만 추정했다. `/api/popup-image`는 모든 `*.cloudfront.net`을 허용하고 upstream `Content-Type`을 그대로 전달했다. 신뢰 경계가 넓어져 SSRF 방어와 콘텐츠 유형 보장이 약해질 수 있었다.

관련 파일은 `server/_core/storageProxy.ts`, `server/_core/index.ts`이며, 예약·OTP 파일은 관련 없다.

## 2. 변경 전 기준선

| 항목 | 기준선 |
|---|---|
| TypeScript | 통과 |
| ESLint | 오류 0, 경고 136건 |
| 전체 테스트 | 86개 파일, 1,543개 통과 |
| audit | moderate 이상 취약점 0건 |
| 로컬 build | Vite 청크 렌더링 중 sandbox `SIGTERM(143)` |
| 정상 스토리지 확인 | `d36hbw14aib5lz.cloudfront.net`, HTTPS, `image/webp` |

## 3. 수정 내용

`server/_core/imageProxyPolicy.ts`에 실제 정상 host와 MIME 정책을 중앙화했다. storage는 실제 presigned CloudFront host·HTTPS·기본 포트·무자격증명 URL만 허용하고, 파일 확장자와 upstream MIME이 일치할 때만 전달한다. popup은 실제 CloudFront host와 YouTube host만 허용하며, popup·YouTube thumbnail은 안전한 래스터 이미지 MIME만 허용한다. 리다이렉트 차단, timeout, 5MB 제한, 캐시 전략은 유지했다.

`server/_core/imageProxyPolicy.test.ts`에서 host spoofing·HTTP·자격증명 URL·MIME 불일치·HTML/SVG 차단과 정상 WebP/JPEG/PDF 처리를 검증했다.

## 4. 테스트 결과

| 검증 | 결과 |
|---|---|
| TypeScript | 통과 |
| 정책 단위 테스트 | 4개 통과 |
| 전체 Vitest | 87개 파일, 1,547개 통과 |
| ESLint | 오류 0, 경고 136건 |
| audit | moderate 이상 취약점 0건 |
| diff check | 통과 |
| 개발 서버 정상 이미지 | `/api/storage/star_logo_d0ae8bbf.webp` → 200, `image/webp` |
| 개발 서버 차단 | 비허용 host·HTTP popup URL → 400 |
| 프로젝트 배포 도메인 | 정상 이미지 200, 차단 요청 400 |
| 운영 도메인 | 정상 이미지 200, 차단 요청 400 |
| 로컬 Vite build | 6,779개 모듈 변환 뒤 sandbox 메모리 `SIGTERM(143)`; 자동 배포 산출물과 실제 운영 응답은 정상 반영 |

## 5. 예약 영역 보존 검증

예약 router·service·repository·OTP·이메일·SMS·관리 예약·예약 DB schema·migration·예약 테스트의 diff는 0건이다. 네이버 예약, 카카오 상담, 위챗 상담, 전화 CTA의 공통 상수와 호출 컴포넌트는 변경하지 않았다. 실제 외부 예약 생성과 운영 DB 변경은 수행하지 않았다.

## 6. 변경 전후 비교

| 구분 | 변경 전 | 변경 후 |
|---|---|---|
| storage host | presigned URL 문자열 존재 여부만 확인 | 실제 확인된 CloudFront host만 허용 |
| storage MIME | key 확장자 추정 | 확장자와 upstream MIME 일치 필수 |
| popup host | 모든 CloudFront subdomain 허용 | 실제 popup CloudFront·YouTube host만 허용 |
| popup MIME | upstream 값을 그대로 전달 | 안전한 래스터 이미지 MIME만 전달 |
| 정상 이미지 | 동작 | 200·`image/webp`로 유지 |

남은 위험은 로컬 Vite build의 sandbox 메모리 제한이다. 같은 코드가 자동 배포되고 두 운영 도메인에서 실제 응답을 반환했으므로 애플리케이션 빌드 오류로 판정하지 않았으며, 다음 개선 전에 다시 같은 제약이 발생하면 build 안정화만 별도 진단한다.

## 7. Git 체크포인트

| 항목 | 값 |
|---|---|
| 기준선 | `2ea37065` |
| 개선 1 코드 체크포인트 | `9c0fd7b5` |
| 주요 변경 파일 | `server/_core/imageProxyPolicy.ts`, `server/_core/storageProxy.ts`, `server/_core/index.ts`, `server/_core/imageProxyPolicy.test.ts` |

## 8. 판정

**성공:** 정책 단위·전체 회귀·공개 이미지 smoke test·배포 도메인·운영 도메인 검증을 통과했다. 예약·OTP·외부 예약·운영 DB는 변경하지 않았다. 로컬 build의 `SIGTERM(143)`은 sandbox 자원 제약으로 기록하고, 다음 개선 전에 별도 기준선으로 재확인한다.

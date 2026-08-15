# 이미지 프록시 보안 강화: 변경 전 기준선

## 작업 원칙

이번 작업은 **개선 1: 이미지 프록시 보안 강화만** 수행한다. 예약·OTP·외부 예약·상담·전화 CTA·관련 테스트·DB·마이그레이션은 동결 대상이며, 운영 DB와 외부 예약 채널에는 요청을 보내지 않는다.

## Git·검증 기준선

| 항목 | 결과 |
|---|---|
| 브랜치 | `main` |
| 기준 HEAD | `ad3f680` |
| 시작 시 작업 트리 | `todo.md`만 이번 순차 개선 계획 기록으로 수정됨 |
| TypeScript | 통과 |
| ESLint | 오류 0, 경고 136건 |
| 전체 Vitest | 86개 파일, 1,543개 테스트 통과 |
| 의존성 감사 | moderate 이상 취약점 0건 |
| 로컬 production build | Vite 6,779개 모듈 변환 뒤 청크 렌더링 중 샌드박스 메모리 `SIGTERM(143)`; 코드 진단 오류는 출력되지 않음 |

## 예약·OTP 동결 목록

동결 대상은 `server/routers/reservation.ts`, `server/services/reservation.service.ts`, `server/db/otp.ts`, `server/db/reservations.ts`, `server/otpCleanup.ts`, `client/src/components/ReservationForm.tsx`, `client/src/components/ReservationSection.tsx`, `client/src/components/reservation/**`, `client/src/components/admin/AdminReservationsTab.tsx`, `client/src/pages/MyReservations.tsx` 및 예약·OTP 관련 테스트와 마이그레이션이다.

공개 CTA 공통 값도 동결한다. 네이버 예약은 `https://booking.naver.com/booking/13/bizes/209080`, 카카오 채널은 `https://pf.kakao.com/_HNyGC`, 중국어 상담은 `https://u.wechat.com/star2006beauty`, 일본어 상담은 `https://otomo-busan.com/star`, 전화는 한국어 `tel:051-818-2300`·외국어 `tel:+82-51-818-2300`이다. Header, Hero, Footer, MobileBottomCTA 및 상세·이벤트·외국인 안내 CTA의 URL과 동작은 변경하지 않는다.

## 이미지 프록시 보안 기준선

| 경로 | 기존 보호 | 개선 후보 |
|---|---|---|
| `/api/storage/*` | 단일 디코딩 key 검증, 리다이렉트 차단, 5·8초 timeout, 5MB 제한, LRU·음수 캐시 | presigned URL의 프로토콜·hostname 명시 검증, upstream 실제 이미지 MIME 검증 |
| `/api/popup-image` | HTTPS, CloudFront/YouTube host 패턴, 리다이렉트 차단, timeout, 5MB 제한 | 광범위한 `*.cloudfront.net` 패턴을 실제 사용 hostname으로 좁히고 upstream 이미지 MIME 검증 |
| `/api/youtube-thumbnail/:videoId` | 고정 YouTube URL, 리다이렉트 차단, timeout, 5MB 제한 | 이번 단위에서는 이미 고정 host라 변경하지 않고 회귀 확인만 수행 |

## 성공 판정

허용 이미지 요청은 계속 성공해야 하며, 허용하지 않은 host·프로토콜·리다이렉트·비이미지 `Content-Type`·과도한 크기 요청은 차단해야 한다. 대상 및 전체 테스트, TypeScript, lint, 가능한 build, 공개 이미지 smoke test, 브라우저·서버 로그와 예약 동결 diff 검증을 통과해야 다음 개선으로 이동한다.

/**
 * server/db.ts — 하위 호환 re-export
 *
 * 이 파일은 기존 `import { ... } from "./db"` 경로를 유지하기 위한 barrel이다.
 * 실제 구현은 server/db/ 디렉토리의 도메인별 파일에 있다.
 *
 * 도메인별 파일:
 *   server/db/connection.ts   — DB 연결 초기화 (getDb)
 *   server/db/users.ts        — 사용자 repository
 *   server/db/reservations.ts — 예약 repository
 *   server/db/otp.ts          — OTP repository
 *   server/db/events.ts       — 이벤트 repository
 *   server/db/treatments.ts   — 시술·카테고리 repository
 *   server/db/unavailableSlots.ts — 예약불가 슬롯 repository
 *   server/db/youtube.ts      — YouTube repository
 *   server/db/equipment3.ts   — Equipment3 repository
 */
export * from "./db/index";

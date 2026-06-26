/**
 * server/db/index.ts — DB repository barrel
 *
 * 모든 도메인 repository를 단일 진입점으로 re-export한다.
 * 기존 `import { ... } from "../db"` 또는 `import { ... } from "./db"` 경로는
 * server/db.ts 의 re-export 를 통해 그대로 동작한다.
 */

export { getDb } from "./connection";
export * from "./users";
export * from "./reservations";
export * from "./otp";
export * from "./events";
export * from "./treatments";
export * from "./unavailableSlots";
export * from "./youtube";
export * from "./equipment3";
export * from "./popup";
export * from "./consultation";
export * from "./notices";
export * from "./keywords";

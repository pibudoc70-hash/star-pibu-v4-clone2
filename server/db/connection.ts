import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2";
import { logger } from "../_core/logger";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // 커넥션 풀링 적용 — 매 요청마다 새 연결 생성 방지
      // connectionLimit: 10 → 동시 최대 10개 연결 유지
      const pool = createPool({
        uri: process.env.DATABASE_URL,
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });
      _registerPool(pool);
      _db = drizzle(pool);
    } catch (error) {
      logger.warn("Database", `Failed to connect: ${error}`);
      _db = null;
    }
  }
  return _db;
}

// ── 커넥션 풀 참조 보관 (graceful shutdown 용) ──────────────────────────────
let _pool: ReturnType<typeof createPool> | null = null;

/** graceful shutdown 시 호출: 열린 커넥션 풀을 정상 종료한다 */
export async function closeDb(): Promise<void> {
  if (!_pool) return;
  try {
    await _pool.promise().end();
    logger.info?.("Database", "Connection pool closed");
  } catch (err) {
    logger.warn("Database", `Error closing pool: ${err}`);
  } finally {
    _pool = null;
    _db = null;
  }
}

/** 내부용: getDb 에서 생성한 pool 을 등록 */
export function _registerPool(pool: ReturnType<typeof createPool>): void {
  _pool = pool;
}

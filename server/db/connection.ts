import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2";
import { logger } from "../_core/logger";

type Db = ReturnType<typeof drizzle>;

let _db: Db | null = null;
let _pool: Pool | null = null;
let _initPromise: Promise<Db> | null = null;

/**
 * DB 커넥션 풀을 초기화하고 실제 연결을 검증한 뒤 drizzle 인스턴스를 반환한다.
 *
 * 설계 원칙:
 * - createPool() 은 lazy 이므로 SELECT 1 로 실연결을 확인한다.
 * - 동시 요청이 들어와도 풀이 중복 생성되지 않도록 _initPromise 싱글턴을 사용한다.
 * - DATABASE_URL 이 없으면 예외를 던진다 (조용히 null 을 반환하지 않는다).
 * - 초기화 실패 시 _initPromise 를 비워 다음 호출에서 재시도 가능하게 한다.
 */
export async function getDb(): Promise<Db> {
  if (_db) return _db;
  if (_initPromise) return _initPromise;

  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("[FATAL] DATABASE_URL environment variable is not set");
  }

  _initPromise = (async () => {
    const pool = createPool({
      uri,
      connectionLimit: Number(process.env.DB_POOL_SIZE ?? 10),
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10_000,
      connectTimeout: 10_000,
      timezone: "Z",
    });

    // 실제 연결 검증 — 여기서 실패하면 DB 가 죽어 있다는 뜻
    await pool.promise().query("SELECT 1");

    _pool = pool;
    _db = drizzle(pool);
    return _db;
  })();

  try {
    return await _initPromise;
  } catch (err) {
    _initPromise = null;
    _db = null;
    if (_pool) {
      try {
        await _pool.promise().end();
      } catch {
        /* noop */
      }
      _pool = null;
    }
    logger.warn(
      "Database",
      `Connection failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    throw err;
  }
}

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
    _initPromise = null;
  }
}

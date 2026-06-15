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
      _db = drizzle(pool);
    } catch (error) {
      logger.warn("Database", `Failed to connect: ${error}`);
      _db = null;
    }
  }
  return _db;
}

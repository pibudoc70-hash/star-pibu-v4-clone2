/**
 * equipment3 테이블 생성 마이그레이션
 * 기존 테이블에 영향 없이 equipment3 테이블만 생성
 */
import { createConnection } from "mysql2/promise";
import { config } from "dotenv";

config();

const sql = `
CREATE TABLE IF NOT EXISTS \`equipment3\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`slug\` varchar(200) NOT NULL,
  \`name\` varchar(200) NOT NULL,
  \`nameEn\` varchar(200) NOT NULL DEFAULT '',
  \`nameJa\` varchar(200) DEFAULT '',
  \`nameZh\` varchar(200) DEFAULT '',
  \`category\` varchar(100) NOT NULL DEFAULT '',
  \`categoryEn\` varchar(100) DEFAULT '',
  \`categoryJa\` varchar(100) DEFAULT '',
  \`categoryZh\` varchar(100) DEFAULT '',
  \`desc\` text,
  \`descEn\` text,
  \`descJa\` text,
  \`descZh\` text,
  \`detail\` text,
  \`detailEn\` text,
  \`detailJa\` text,
  \`detailZh\` text,
  \`effect\` text,
  \`effectEn\` text,
  \`effectJa\` text,
  \`effectZh\` text,
  \`caution\` text,
  \`cautionEn\` text,
  \`cautionJa\` text,
  \`cautionZh\` text,
  \`sessions\` varchar(200) DEFAULT '',
  \`sessionsEn\` varchar(200) DEFAULT '',
  \`sessionsJa\` varchar(200) DEFAULT '',
  \`sessionsZh\` varchar(200) DEFAULT '',
  \`time\` varchar(50) DEFAULT '',
  \`timeEn\` varchar(50) DEFAULT '',
  \`timeJa\` varchar(50) DEFAULT '',
  \`timeZh\` varchar(50) DEFAULT '',
  \`recovery\` varchar(50) DEFAULT '',
  \`recoveryEn\` varchar(50) DEFAULT '',
  \`recoveryJa\` varchar(50) DEFAULT '',
  \`recoveryZh\` varchar(50) DEFAULT '',
  \`imageUrl\` text,
  \`images\` text,
  \`youtubeUrl\` text,
  \`modalImage\` text,
  \`badge\` varchar(100) DEFAULT '',
  \`badgeColor\` varchar(20) DEFAULT '#4A6FA5',
  \`sortOrder\` int NOT NULL DEFAULT 0,
  \`isActive\` enum('0','1') NOT NULL DEFAULT '1',
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(\`id\`),
  UNIQUE KEY \`equipment3_slug_unique\` (\`slug\`)
);
`;

async function migrate() {
  const conn = await createConnection(process.env.DATABASE_URL);
  try {
    await conn.execute(sql);
    console.log("✅ equipment3 테이블 생성 완료");
  } catch (err) {
    if (err.code === "ER_TABLE_EXISTS_ERROR") {
      console.log("ℹ️  equipment3 테이블이 이미 존재합니다.");
    } else {
      console.error("❌ 마이그레이션 실패:", err.message);
      process.exit(1);
    }
  } finally {
    await conn.end();
  }
}

migrate();

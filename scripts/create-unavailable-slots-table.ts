import { createConnection } from "mysql2/promise";

async function createTable() {
  try {
    const connection = await createConnection(process.env.DATABASE_URL!);
    
    const sql = `CREATE TABLE IF NOT EXISTS \`unavailableSlots\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`date\` varchar(10) NOT NULL,
      \`startTime\` varchar(5) NOT NULL,
      \`endTime\` varchar(5) NOT NULL,
      \`reason\` text,
      \`createdAt\` timestamp NOT NULL DEFAULT (now()),
      \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT \`unavailableSlots_id\` PRIMARY KEY(\`id\`)
    )`;
    
    await connection.execute(sql);
    console.log("✅ unavailableSlots 테이블이 생성되었습니다!");
    
    await connection.end();
  } catch (error) {
    console.error("❌ 테이블 생성 실패:", error);
    process.exit(1);
  }
}

createTable();

import { getDb } from "./server/db";
import { sql } from "drizzle-orm";

async function migrate() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("❌ Database connection failed");
      process.exit(1);
    }

    console.log("Creating treatmentCategories table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`treatmentCategories\` (
        \`id\` varchar(50) NOT NULL,
        \`label\` varchar(100) NOT NULL,
        \`labelEn\` varchar(100) NOT NULL,
        \`desc\` text NOT NULL,
        \`icon\` varchar(50) NOT NULL,
        \`sortOrder\` int NOT NULL DEFAULT 0,
        \`isActive\` enum('0','1') NOT NULL DEFAULT '1',
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY(\`id\`)
      )
    `);
    console.log("✓ treatmentCategories table created");

    console.log("Creating treatments table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`treatments\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`categoryId\` varchar(50) NOT NULL,
        \`name\` varchar(200) NOT NULL,
        \`nameEn\` varchar(200) NOT NULL,
        \`desc\` text NOT NULL,
        \`time\` varchar(50) NOT NULL,
        \`recovery\` varchar(50) NOT NULL,
        \`badge\` varchar(100) DEFAULT '',
        \`badgeColor\` varchar(20) DEFAULT '#4A6FA5',
        \`image\` longtext,
        \`images\` longtext,
        \`imgBg\` varchar(20) DEFAULT '',
        \`cardBannerImage\` longtext,
        \`detail\` longtext,
        \`caution\` longtext,
        \`sessions\` varchar(200) DEFAULT '',
        \`effect\` longtext,
        \`related\` longtext,
        \`steps\` longtext,
        \`youtubeUrl\` longtext,
        \`modalImage\` longtext,
        \`best\` enum('0','1') DEFAULT '0',
        \`sortOrder\` int NOT NULL DEFAULT 0,
        \`isActive\` enum('0','1') NOT NULL DEFAULT '1',
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY(\`id\`)
      )
    `);
    console.log("✓ treatments table created");

    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();

import { db } from "./server/db/index.js";
import { equipment3 } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";
import { writeFileSync } from "fs";

const rows = await db.select({
  id: equipment3.id,
  name: equipment3.name,
  nameZh: equipment3.nameZh,
  categoryZh: equipment3.categoryZh,
  descZh: equipment3.descZh,
  detailZh: equipment3.detailZh,
  effectZh: equipment3.effectZh,
  cautionZh: equipment3.cautionZh,
  sessionsZh: equipment3.sessionsZh,
  timeZh: equipment3.timeZh,
  recoveryZh: equipment3.recoveryZh,
}).from(equipment3).where(eq(equipment3.isActive, "1")).orderBy(equipment3.sortOrder);

writeFileSync("/home/ubuntu/eq3_data.json", JSON.stringify(rows, null, 2));
console.log(`Total: ${rows.length} rows`);
rows.forEach(r => console.log(`id=${r.id} name=${r.name} nameZh=${r.nameZh}`));
process.exit(0);

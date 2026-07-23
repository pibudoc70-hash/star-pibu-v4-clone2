import { getDb } from './server/db/connection.ts';
import { youtubeVideos } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = await getDb();
if (!db) {
  console.log('DB 연결 실패');
  process.exit(1);
}

const result = await db.select().from(youtubeVideos).where(eq(youtubeVideos.isActive, '1'));
console.log('결과 개수:', result.length);
console.log('첫 3개:', result.slice(0, 3).map(r => ({ id: r.id, title: r.title, isActive: r.isActive })));

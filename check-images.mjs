import { getDb } from './server/db.ts';

const db = getDb();
const treatments = await db.query.treatments.findMany({
  limit: 5,
});

console.log('=== DB에 저장된 이미지 URL ===');
treatments.forEach(t => {
  console.log(`\n${t.name}:`);
  console.log(`  images: ${t.images}`);
  console.log(`  imageUrl: ${t.imageUrl}`);
});

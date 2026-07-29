import { createConnection } from 'mysql2/promise';
import { writeFileSync } from 'fs';

const url = process.env.DATABASE_URL;
const conn = await createConnection(url);

// equipment3 전체 레코드
const [eq3] = await conn.execute(
  'SELECT id, name, nameEn, nameZh, category, categoryZh, SUBSTRING(descZh, 1, 60) as descZh FROM equipment3 ORDER BY sortOrder'
);
writeFileSync('/home/ubuntu/equipment3_all.json', JSON.stringify(eq3, null, 2));
console.log('equipment3:', eq3.length, 'rows');

// events 전체 레코드
const [evts] = await conn.execute(
  'SELECT id, title, titleZh, SUBSTRING(descZh, 1, 60) as descZh, targetLang FROM events ORDER BY sortOrder LIMIT 20'
);
writeFileSync('/home/ubuntu/events_all.json', JSON.stringify(evts, null, 2));
console.log('events:', evts.length, 'rows');

// notices 문제 레코드
const [notices] = await conn.execute(
  'SELECT id, title, targetLang, SUBSTRING(content, 1, 80) as content FROM notices WHERE id IN (1, 30001, 60001)'
);
writeFileSync('/home/ubuntu/notices_audit.json', JSON.stringify(notices, null, 2));
console.log('notices:', notices.length, 'rows');

await conn.end();

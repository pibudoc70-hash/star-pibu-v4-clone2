import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// 데이터베이스 연결 설정
const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/')[3]?.split('?')[0] || 'starpibu',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false },
});

// 카테고리 ID 매핑
const CATEGORY_ID_MAP = {
  '색소·문신': 'pigment',
  '흉터·모공': 'scar',
  '여드름': 'acne_laser',
  '홍조·혈관': 'rosacea',
  '액취증·다한증': 'acne',
  '손·발톱무좀': 'fungus',
  '건선·아토피': 'psoriasis',
  '눈밑지방재배치': 'eye',
  '백반증': 'vitiligo',
  '볼륨·부스터': 'volume',
  '보톡스·필러': 'botox',
  'Best 시술': 'best',
};

async function migrateEquipment2Data() {
  const connection = await pool.getConnection();

  try {
    // JSON 데이터 읽기
    const dataPath = '/home/ubuntu/star-pibu-v4-clone/scripts/equipment2-all-tabs-data.json';
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const allTabsData = JSON.parse(rawData);

    console.log('🚀 equipment3 테이블에 데이터 마이그레이션 시작...\n');

    let totalInserted = 0;

    for (const [categoryName, items] of Object.entries(allTabsData)) {
      const categoryId = CATEGORY_ID_MAP[categoryName];
      
      if (!categoryId) {
        console.warn(`⚠️  카테고리 ID 매핑 없음: ${categoryName}`);
        continue;
      }

      console.log(`📝 ${categoryName} (${categoryId}): ${items.length}개 항목 등록 중...`);

      for (const item of items) {
        try {
          // 중복 확인
          const [existing] = await connection.query(
            'SELECT id FROM equipment3 WHERE name = ? AND category = ?',
            [item.name, categoryId]
          );

          if (existing.length > 0) {
            console.log(`  ⏭️  ${item.name} (이미 존재)`);
            continue;
          }

          // slug 생성 (카테고리-이름 조합으로 기반)
          const baseSlug = item.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          const slug = `${categoryId}-${baseSlug}`;

          // 데이터 삽입
          await connection.query(
            'INSERT INTO equipment3 (name, slug, category, `desc`) VALUES (?, ?, ?, ?)',
            [
              item.name,
              slug,
              categoryId,
              item.desc || '',
            ]
          );

          console.log(`  ✅ ${item.name}`);
          totalInserted++;
        } catch (error) {
          console.error(`  ❌ ${item.name} 등록 실패:`, error.message);
        }
      }

      console.log(`✅ ${categoryName} 완료!\n`);
    }

    console.log(`\n🎉 마이그레이션 완료!`);
    console.log(`📊 총 ${totalInserted}개 항목 등록됨`);

  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

migrateEquipment2Data();

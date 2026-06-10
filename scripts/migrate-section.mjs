import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const { host, user, password, database } = new URL('mysql://' + url.split('mysql://')[1]);

(async () => {
  let conn;
  try {
    conn = await mysql.createConnection({
      host, user, password, database,
      ssl: 'Amazon RDS',
      waitForConnections: true,
    });

    console.log('Connected to database');

    // 1. 현재 section 값 분포 확인
    const [rows] = await conn.execute('SELECT section, COUNT(*) as count FROM treatments GROUP BY section');
    console.log('Current section distribution:');
    console.log(rows);

    // 2. section이 NULL인 시술들을 'v1'로 업데이트
    const [result] = await conn.execute('UPDATE treatments SET section = "v1" WHERE section IS NULL');
    console.log(`Updated ${result.affectedRows} treatments with section=NULL to section='v1'`);

    // 3. 업데이트 후 section 값 분포 확인
    const [rows2] = await conn.execute('SELECT section, COUNT(*) as count FROM treatments GROUP BY section');
    console.log('After migration:');
    console.log(rows2);

    // 4. V2 시술 목록 확인
    const [v2Treatments] = await conn.execute('SELECT id, name, section FROM treatments WHERE section = "v2"');
    console.log('\nV2 Treatments:');
    console.log(v2Treatments);

    conn.end();
    console.log('\nMigration complete!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();

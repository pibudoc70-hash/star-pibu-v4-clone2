import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

(async () => {
  try {
    const conn = await pool.getConnection();
    
    // 모든 활성 이벤트를 SPECIAL EVENT로 표시
    const [result] = await conn.execute(
      'UPDATE events SET isSpecialEvent = ? WHERE isActive = ?',
      ['1', '1']
    );
    
    console.log(`✅ ${result.affectedRows}개 이벤트를 SPECIAL EVENT로 표시했습니다.`);
    
    // 업데이트 확인
    const [rows] = await conn.execute(
      'SELECT id, title, isSpecialEvent, isActive FROM events WHERE isActive = ? ORDER BY sortOrder, createdAt DESC',
      ['1']
    );
    
    console.log('\n현재 SPECIAL EVENT 목록:');
    rows.forEach((r, i) => {
      console.log(`${i + 1}. ${r.title} (ID: ${r.id}, isSpecialEvent: ${r.isSpecialEvent})`);
    });
    
    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
})();

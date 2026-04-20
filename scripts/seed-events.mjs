/**
 * 샘플 이벤트 데이터 DB 삽입 스크립트
 * 실행: node scripts/seed-events.mjs
 */
import mysql from 'mysql2/promise';
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL 환경변수가 없습니다.');
  process.exit(1);
}

const sampleEvents = [
  {
    type: '이벤트',
    category: '이벤트',
    title: '세르프 리프팅',
    subtitle: '스타피부과 확장기념 이벤트',
    desc: '세르프 300샷',
    content: '써마지 효과는 그대로, 통증은 감소된 가성비 좋은 세르프 리프팅. 스타피부과 확장기념 특별 이벤트로 진행합니다.',
    badge: '확장기념',
    tag: '리프팅',
    hot: '1',
    isFeatured: '1',
    cta: '자세히 보기',
    accent: '#4A6FA5',
    accentDark: '#2D4A7B',
    accentBg: '#EEF3FA',
    iconBg: '#E0EBF7',
    iconType: 'zap',
    badgeColor: '#4A6FA5',
    date: '2026-12-31',
    imageUrl: null,
    sortOrder: 1,
    isActive: '1',
  },
  {
    type: '이벤트',
    category: '신규시술',
    title: '울쎄라피 프라임',
    subtitle: '도입기념 이벤트',
    desc: '울쎄라피 프라임 600샷',
    content: '기존 울쎄라보다 한 단계 업그레이드된 울쎄라피 프라임 도입기념 특별 이벤트. 더 정밀한 초음파 기술과 선명한 이미징으로 개인별 맞춤 리프팅이 가능합니다.',
    badge: '신규도입',
    tag: '울쎄라',
    hot: '1',
    isFeatured: '1',
    cta: '자세히 보기',
    accent: '#7B5EA7',
    accentDark: '#5A3D8A',
    accentBg: '#F3EEF9',
    iconBg: '#E8E0F5',
    iconType: 'sparkles',
    badgeColor: '#7B5EA7',
    date: '2026-12-31',
    imageUrl: null,
    sortOrder: 2,
    isActive: '1',
  },
  {
    type: '이벤트',
    category: '이벤트',
    title: '써마지 FLX',
    subtitle: '4세대 프리미엄 고주파 리프팅 + 피부관리 1회 서비스',
    desc: '써마지 FLX 600샷',
    content: '4세대 고주파 리프팅의 정점. 피부 깊은 층 콜라겐을 자극해 탄력 개선과 주름 완화에 탁월. 조시형 원장 공식 자문의로 최적의 파라미터 노하우를 보유합니다.',
    badge: '인기',
    tag: '써마지',
    hot: '1',
    isFeatured: '1',
    cta: '자세히 보기',
    accent: '#C9A84C',
    accentDark: '#A07830',
    accentBg: '#FDF8EE',
    iconBg: '#F5EDD8',
    iconType: 'zap',
    badgeColor: '#C9A84C',
    date: '2026-12-31',
    imageUrl: null,
    sortOrder: 3,
    isActive: '1',
  },
  {
    type: '이벤트',
    category: '이벤트',
    title: '스타 눈밑지방재배치',
    subtitle: '밝고 생기있는 인상으로 변신',
    desc: '눈밑 지방제거 + 눈밑 지방재배치',
    content: '눈밑 지방을 제거하고 재배치하여 다크서클을 개선하고 밝고 생기있는 인상을 만들어 드립니다. 스타피부과의 대표 시술로 4,000례 이상의 풍부한 경험을 보유하고 있습니다.',
    badge: '대표시술',
    tag: '눈밑지방',
    hot: '0',
    isFeatured: '1',
    cta: '자세히 보기',
    accent: '#2E7D6B',
    accentDark: '#1A5C4E',
    accentBg: '#EEF7F5',
    iconBg: '#D8EFE9',
    iconType: 'sparkles',
    badgeColor: '#2E7D6B',
    date: '2026-12-31',
    imageUrl: null,
    sortOrder: 4,
    isActive: '1',
  },
  {
    type: '이벤트',
    category: '이벤트',
    title: '온다 리프팅',
    subtitle: '통증 걱정없이 세련된 얼굴라인 완성',
    desc: '온다 리프팅 2+1 총 3회',
    content: '마이크로웨이브를 이용한 온다 리프팅으로 통증 없이 세련된 얼굴라인을 완성하세요. 2+1 패키지로 더욱 경제적으로 이용하실 수 있습니다.',
    badge: '2+1',
    tag: '리프팅',
    hot: '0',
    isFeatured: '0',
    cta: '자세히 보기',
    accent: '#4A6FA5',
    accentDark: '#2D4A7B',
    accentBg: '#EEF3FA',
    iconBg: '#E0EBF7',
    iconType: 'tag',
    badgeColor: '#4A6FA5',
    date: '2026-12-31',
    imageUrl: null,
    sortOrder: 5,
    isActive: '1',
  },
  {
    type: '이벤트',
    category: '이벤트',
    title: '텐써마 리프팅',
    subtitle: '통증 DOWN, 리프팅 효과 UP',
    desc: '텐써마 300샷',
    content: '텐써마는 통증을 최소화하면서도 강력한 리프팅 효과를 제공합니다. 바쁜 일상 속에서도 부담 없이 받을 수 있는 리프팅 시술입니다.',
    badge: '추천',
    tag: '리프팅',
    hot: '0',
    isFeatured: '0',
    cta: '자세히 보기',
    accent: '#E07B54',
    accentDark: '#B85A35',
    accentBg: '#FEF3EE',
    iconBg: '#FCE4D8',
    iconType: 'tag',
    badgeColor: '#E07B54',
    date: '2026-12-31',
    imageUrl: null,
    sortOrder: 6,
    isActive: '1',
  },
];

async function seedEvents() {
  let conn;
  try {
    conn = await mysql.createConnection(DATABASE_URL);
    console.log('DB 연결 성공');

    // 기존 이벤트 확인
    const [existing] = await conn.execute('SELECT COUNT(*) as cnt FROM events');
    const count = existing[0].cnt;
    console.log(`기존 이벤트 수: ${count}`);

    if (count > 0) {
      console.log('이미 이벤트 데이터가 있습니다. 삽입을 건너뜁니다.');
      return;
    }

    // 이벤트 삽입
    for (const ev of sampleEvents) {
      const now = new Date();
      await conn.execute(
        `INSERT INTO events (type, category, title, subtitle, \`desc\`, content, badge, tag, hot, isFeatured, cta, accent, accentDark, accentBg, iconBg, iconType, badgeColor, \`date\`, imageUrl, sortOrder, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ev.type, ev.category, ev.title, ev.subtitle, ev.desc, ev.content,
          ev.badge, ev.tag, ev.hot, ev.isFeatured, ev.cta,
          ev.accent, ev.accentDark, ev.accentBg, ev.iconBg, ev.iconType, ev.badgeColor,
          ev.date, ev.imageUrl, ev.sortOrder, ev.isActive, now, now
        ]
      );
      console.log(`이벤트 삽입: ${ev.title}`);
    }

    console.log(`총 ${sampleEvents.length}개 이벤트 삽입 완료`);
  } catch (err) {
    console.error('오류:', err);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

seedEvents();

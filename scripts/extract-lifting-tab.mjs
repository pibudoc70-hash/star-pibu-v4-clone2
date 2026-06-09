import { chromium } from 'playwright';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/')[3]?.split('?')[0] || 'starpibu',
};

async function extractLiftingTabData() {
  const browser = await chromium.launch({ headless: false }); // 디버깅용 headless: false
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  try {
    console.log('🌐 equipment2 페이지 접속...');
    await page.goto('https://star-pibu.com/equipment2', { waitUntil: 'networkidle' });

    console.log('📑 리프팅·탄력 탭 클릭...');
    // 리프팅·탄력 탭 클릭
    await page.click('button[id="cat-tab-lifting"]');
    await page.waitForTimeout(1000); // 탭 로드 대기

    console.log('⏳ "더 보기" 버튼 클릭하여 모든 항목 로드...');
    // "더 보기" 버튼 클릭하여 모든 항목 로드
    let moreButtonExists = true;
    let clickCount = 0;
    while (moreButtonExists && clickCount < 10) {
      const moreButton = await page.$('button:has-text("더 보기")');
      if (moreButton) {
        console.log(`  → "더 보기" 버튼 클릭 (${clickCount + 1}회)`);
        await moreButton.click();
        await page.waitForTimeout(800);
        clickCount++;
      } else {
        moreButtonExists = false;
      }
    }

    console.log('📸 페이지 스크린샷 저장...');
    await page.screenshot({ path: '/home/ubuntu/lifting-tab-screenshot.png' });

    console.log('🔍 카드 데이터 추출 중...');
    // 현재 탭의 모든 카드 추출
    const cards = await page.evaluate(() => {
      const items = [];
      const buttons = document.querySelectorAll('button[hint*="상세 페이지 보기"]');

      buttons.forEach((btn) => {
        const text = btn.textContent || '';
        const lines = text.split('\n').filter((l) => l.trim());

        // 뱃지 추출
        let badge = '';
        let titleIndex = 0;
        const badgeKeywords = ['인기', '자문의', '이벤트', '진정하', '자가세포', '고효과', '프리미엄', 'NEW'];
        if (badgeKeywords.some((k) => lines[0]?.includes(k))) {
          badge = lines[0].trim();
          titleIndex = 1;
        }

        // 시술명
        const title = lines[titleIndex]?.trim() || '';

        // 설명
        const description = lines
          .slice(titleIndex + 1)
          .filter((l) => !l.includes('분') && !l.includes('회복'))
          .join(' ')
          .trim();

        // 시술 시간
        let duration = '';
        const durationMatch = text.match(/(\d+~?\d*분)/);
        if (durationMatch) {
          duration = durationMatch[1];
        }

        // 회복 기간
        let recovery = '';
        const recoveryMatch = text.match(/(당일 일상|[\d~]+일)/);
        if (recoveryMatch) {
          recovery = recoveryMatch[1];
        }

        // 이미지 URL
        const img = btn.querySelector('img');
        const imageUrl = img?.src || '';

        if (title) {
          items.push({
            title,
            badge,
            description,
            duration,
            recovery,
            imageUrl,
          });
        }
      });

      return items;
    });

    console.log(`\n✅ 리프팅·탄력 탭: ${cards.length}개 항목 추출 완료\n`);

    // 추출된 데이터 출력
    cards.forEach((card, idx) => {
      console.log(`${idx + 1}. ${card.title}`);
      console.log(`   뱃지: ${card.badge || '없음'}`);
      console.log(`   설명: ${card.description.substring(0, 50)}...`);
      console.log(`   시술시간: ${card.duration}`);
      console.log(`   회복: ${card.recovery}`);
      console.log(`   이미지: ${card.imageUrl.substring(0, 60)}...`);
      console.log();
    });

    // DB에 삽입
    await insertToDatabase(cards);
  } catch (error) {
    console.error('❌ 오류:', error);
  } finally {
    await browser.close();
  }
}

async function insertToDatabase(cards) {
  const connection = await mysql.createConnection(DB_CONFIG);

  try {
    console.log('💾 DB에 삽입 중...');

    let insertedCount = 0;
    for (const card of cards) {
      if (!card.title) continue;

      // slug 생성 (한글 → 영문 변환)
      const slug = card.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50);

      try {
        await connection.execute(
          `INSERT INTO equipment3 
          (slug, nameKo, nameEn, nameJa, nameZh, category, descriptionKo, descriptionEn, descriptionJa, descriptionZh, 
           treatmentTimeKo, recoveryPeriodKo, badge, imageUrl, isActive, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
          [
            slug,
            card.title,
            card.title,
            card.title,
            card.title,
            '리프팅·탄력',
            card.description,
            card.description,
            card.description,
            card.description,
            card.duration,
            card.recovery,
            card.badge,
            card.imageUrl,
          ]
        );
        console.log(`✅ 삽입: ${card.title}`);
        insertedCount++;
      } catch (e) {
        console.warn(`⚠️  삽입 실패: ${card.title} - ${e.message}`);
      }
    }

    console.log(`\n✅ 총 ${insertedCount}개 항목 DB 삽입 완료`);
  } catch (error) {
    console.error('❌ DB 오류:', error);
  } finally {
    await connection.end();
  }
}

// 실행
extractLiftingTabData();

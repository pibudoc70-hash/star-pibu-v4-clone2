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

// 카테고리 매핑
const CATEGORY_MAP = {
  'Best 시술': 'Best 시술',
  '리프팅·탄력': '리프팅·탄력',
  '눈밑지방재배치': '눈밑지방재배치',
  '백반증': '백반증',
  '색소·문신': '색소·문신',
  '흉터·모공': '흉터·모공',
  '여드름': '여드름',
  '홍조·혈관': '홍조·혈관',
  '액취증·다한증': '액취증·다한증',
  '손·발톱무좀': '손·발톱무좀',
  '건선·아토피': '건선·아토피',
  '볼륨·부스터': '볼륨·부스터',
  '보톡스·필러': '보톡스·필러',
  '줄기세포 치료': '줄기세포 치료',
};

async function extractEquipment2Data() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  const allItems = [];

  try {
    console.log('🌐 equipment2 페이지 접속...');
    await page.goto('https://star-pibu.com/equipment2', { waitUntil: 'networkidle' });

    // 각 카테고리 탭 순회
    for (const [tabId, categoryName] of Object.entries(CATEGORY_MAP)) {
      console.log(`\n📑 카테고리: ${categoryName}`);

      // 탭 클릭
      const tabSelector = `button[id="cat-tab-${tabId.toLowerCase().replace(/[·\s]/g, '_')}"]`;
      try {
        await page.click(tabSelector);
        await page.waitForTimeout(500); // 탭 로드 대기
      } catch (e) {
        console.warn(`⚠️  탭 클릭 실패: ${categoryName}`);
        continue;
      }

      // "더 보기" 버튼 클릭하여 모든 항목 로드
      let moreButtonExists = true;
      while (moreButtonExists) {
        const moreButton = await page.$('button:has-text("더 보기")');
        if (moreButton) {
          await moreButton.click();
          await page.waitForTimeout(500);
        } else {
          moreButtonExists = false;
        }
      }

      // 현재 탭의 모든 카드 추출
      const cards = await page.$$eval('button[hint*="상세 페이지 보기"]', (elements) => {
        return elements.map((el) => {
          const text = el.textContent || '';
          const lines = text.split('\n').filter((l) => l.trim());

          // 뱃지 추출 (첫 번째 줄이 뱃지인 경우)
          let badge = '';
          let titleIndex = 0;
          const badgeKeywords = ['인기', '자문의', '이벤트', '진정하', '자가세포', '고효과', '프리미엄', 'NEW'];
          if (badgeKeywords.some((k) => lines[0]?.includes(k))) {
            badge = lines[0].trim();
            titleIndex = 1;
          }

          // 시술명
          const title = lines[titleIndex]?.trim() || '';

          // 설명 (시술명 다음 줄부터)
          const description = lines
            .slice(titleIndex + 1)
            .filter((l) => !l.includes('분') && !l.includes('회복'))
            .join(' ')
            .trim();

          // 시술 시간 추출
          let duration = '';
          const durationMatch = text.match(/(\d+~?\d*분)/);
          if (durationMatch) {
            duration = durationMatch[1];
          }

          // 회복 기간 추출
          let recovery = '';
          const recoveryMatch = text.match(/(당일 일상|당일 일상|[\d~]+일)/);
          if (recoveryMatch) {
            recovery = recoveryMatch[1];
          }

          // 이미지 URL 추출
          const img = el.querySelector('img');
          const imageUrl = img?.src || '';

          return {
            title,
            badge,
            description,
            duration,
            recovery,
            imageUrl,
          };
        });
      });

      console.log(`✅ ${categoryName}: ${cards.length}개 항목 추출`);
      allItems.push({
        category: categoryName,
        items: cards,
      });
    }

    console.log(`\n📊 총 ${allItems.reduce((sum, cat) => sum + cat.items.length, 0)}개 항목 추출 완료`);

    // DB에 삽입
    await insertToDatabase(allItems);
  } catch (error) {
    console.error('❌ 오류:', error);
  } finally {
    await browser.close();
  }
}

async function insertToDatabase(allItems) {
  const connection = await mysql.createConnection(DB_CONFIG);

  try {
    console.log('\n💾 DB에 삽입 중...');

    let insertedCount = 0;
    for (const categoryData of allItems) {
      for (const item of categoryData.items) {
        if (!item.title) continue; // 제목이 없으면 스킵

        // slug 생성
        const slug = item.title
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
              item.title,
              item.title, // 영문은 한글과 동일하게 (나중에 수정 가능)
              item.title,
              item.title,
              categoryData.category,
              item.description,
              item.description,
              item.description,
              item.description,
              item.duration,
              item.recovery,
              item.badge,
              item.imageUrl,
            ]
          );
          insertedCount++;
        } catch (e) {
          console.warn(`⚠️  삽입 실패: ${item.title} - ${e.message}`);
        }
      }
    }

    console.log(`✅ ${insertedCount}개 항목 DB 삽입 완료`);
  } catch (error) {
    console.error('❌ DB 오류:', error);
  } finally {
    await connection.end();
  }
}

// 실행
extractEquipment2Data();

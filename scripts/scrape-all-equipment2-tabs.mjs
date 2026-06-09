import playwright from 'playwright';
import fs from 'fs';

const CATEGORIES = [
  { id: 'best', name: 'Best 시술' },
  { id: 'lifting', name: '리프팅·탄력' },
  { id: 'eye', name: '눈밑지방재배치' },
  { id: 'vitiligo', name: '백반증' },
  { id: 'pigment', name: '색소·문신' },
  { id: 'scar', name: '흉터·모공' },
  { id: 'acne_laser', name: '여드름' },
  { id: 'rosacea', name: '홍조·혈관' },
  { id: 'acne', name: '액취증·다한증' },
  { id: 'fungus', name: '손·발톱무좀' },
  { id: 'psoriasis', name: '건선·아토피' },
  { id: 'volume', name: '볼륨·부스터' },
  { id: 'botox', name: '보톡스·필러' },
  { id: 'stem_cell', name: '줄기세포 치료' },
];

async function scrapeEquipment2() {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  const allData = {};

  try {
    await page.goto('https://star-pibu.com/equipment2', { waitUntil: 'networkidle' });

    for (const category of CATEGORIES) {
      console.log(`\n📍 스크래핑 중: ${category.name}...`);
      
      // 탭 클릭
      await page.click(`#cat-tab-${category.id}`);
      await page.waitForTimeout(500);

      // 모든 카드 데이터 추출
      const items = await page.evaluate(() => {
        const cards = document.querySelectorAll('[role="button"][hint*="상세 페이지 보기"]');
        const result = [];
        
        cards.forEach((card) => {
          const hint = card.getAttribute('hint') || '';
          const text = card.textContent || '';
          const lines = text.split('\n').map(l => l.trim()).filter(l => l);
          
          let badge = '';
          let title = '';
          let description = '';
          let time = '';
          let recovery = '';
          
          if (lines.length >= 2) {
            badge = lines[0];
            title = lines[1];
            
            const timeIndex = lines.findIndex(l => l.includes('분'));
            if (timeIndex > 0) {
              description = lines.slice(2, timeIndex).join(' ');
              time = lines[timeIndex].replace('회복', '').trim();
              recovery = lines[timeIndex + 1] || '';
            } else {
              description = lines.slice(2).join(' ');
            }
          }
          
          result.push({
            badge,
            title,
            description,
            time,
            recovery,
            hint
          });
        });
        
        return result;
      });

      allData[category.name] = items;
      console.log(`✅ ${category.name}: ${items.length}개 항목 추출됨`);
      
      items.forEach((item, idx) => {
        console.log(`  ${idx + 1}. ${item.title}`);
      });
    }

    fs.writeFileSync(
      '/home/ubuntu/star-pibu-v4-clone/scripts/equipment2-scraped-data.json',
      JSON.stringify(allData, null, 2),
      'utf-8'
    );

    console.log('\n✅ 모든 데이터 추출 완료!');
    console.log('📁 저장 위치: scripts/equipment2-scraped-data.json');

  } catch (error) {
    console.error('❌ 스크래핑 오류:', error);
  } finally {
    await browser.close();
  }
}

scrapeEquipment2();

/**
 * Playwright 스크린샷 캡처 스크립트
 * Usage: node scripts/screenshot.mjs [before|after]
 */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const label = process.argv[2] || 'before';
const BASE_URL = 'https://3000-iv1n7071mienwb9dmbzh2-335bb4c0.sg1.manus.computer';
const OUT_DIR = path.join(__dirname, '..', 'screenshots', label);

fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { name: 'home',       url: '/',              waitFor: '.hero-section, #hero, section' },
  { name: 'treatments', url: '/treatments',    waitFor: '.treatment-card, section' },
  { name: 'reviews',    url: '/#reviews',      waitFor: '.review-card, section' },
  { name: 'events',     url: '/#events',       waitFor: '.special-event-card, section' },
  { name: 'doctors',    url: '/#doctors',      waitFor: '.dr-card, section' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  for (const page of PAGES) {
    const p = await context.newPage();
    try {
      await p.goto(`${BASE_URL}${page.url}`, { waitUntil: 'networkidle', timeout: 30000 });
      // 애니메이션 완료 대기
      await p.waitForTimeout(2000);
      // 스크롤 다운해서 lazy-load 트리거
      await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
      await p.waitForTimeout(1000);
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(500);

      const outPath = path.join(OUT_DIR, `${page.name}.png`);
      await p.screenshot({ path: outPath, fullPage: true });
      console.log(`✅ ${label}/${page.name}.png`);
    } catch (e) {
      console.error(`❌ ${page.name}: ${e.message}`);
    } finally {
      await p.close();
    }
  }

  await browser.close();
  console.log(`\nScreenshots saved to: ${OUT_DIR}`);
})();

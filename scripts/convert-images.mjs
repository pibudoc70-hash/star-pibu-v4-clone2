/**
 * scripts/convert-images.mjs
 * PNG/JPG → WebP 변환 스크립트
 *
 * 사용법:
 *   node scripts/convert-images.mjs
 *
 * 출력: /home/ubuntu/webdev-static-assets/images-webp/ 에 .webp 파일 생성
 * 이후 manus-upload-file --webdev 로 업로드
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const INPUT_DIR = "/home/ubuntu/webdev-static-assets/images-original";
const OUTPUT_DIR = "/home/ubuntu/webdev-static-assets/images-webp";

const TARGETS = [
  // LCP 후보 — 재생의료 배너 (첫 화면 노출, fetchpriority="high")
  { input: "regen-medicine-banner-pc2_e6271aa5.png",    quality: 82, maxWidth: 1600 },
  { input: "regen-medicine-banner-mobile_1fe7ea14.png", quality: 82, maxWidth: 800  },
  // 시술 이미지 (폴드 아래, OptimizedImage lazy)
  { input: "01_5e3176cb_69bdbf43.png",   quality: 78, maxWidth: 1600 },
  { input: "0211_8cfcf452_31628e98.png", quality: 78, maxWidth: 1600 },
  { input: "03_46691618_e287e8e1.png",   quality: 78, maxWidth: 1600 },
];

await fs.mkdir(OUTPUT_DIR, { recursive: true });

console.log("=== PNG → WebP 변환 시작 ===\n");

const results = [];

for (const { input, quality, maxWidth } of TARGETS) {
  const inputPath  = path.join(INPUT_DIR, input);
  const outputName = input.replace(/\.(png|jpg|jpeg)$/, ".webp");
  const outputPath = path.join(OUTPUT_DIR, outputName);

  try {
    const meta     = await sharp(inputPath).metadata();
    const pipeline = meta.width > maxWidth
      ? sharp(inputPath).resize({ width: maxWidth, withoutEnlargement: true })
      : sharp(inputPath);

    await pipeline.webp({ quality, effort: 6 }).toFile(outputPath);

    const origStat = await fs.stat(inputPath);
    const webpStat = await fs.stat(outputPath);
    const ratio    = ((1 - webpStat.size / origStat.size) * 100).toFixed(1);

    const row = {
      original: input,
      webp:     outputName,
      origKB:   (origStat.size / 1024).toFixed(0),
      webpKB:   (webpStat.size / 1024).toFixed(0),
      saving:   `${ratio}%`,
    };
    results.push(row);

    console.log(`✅ ${input}`);
    console.log(`   ${row.origKB} KB → ${row.webpKB} KB (${ratio}% 절감)`);
    console.log(`   출력: ${outputPath}\n`);
  } catch (err) {
    console.error(`❌ ${input}: ${err.message}`);
  }
}

console.log("=== 변환 완료 ===");
console.log(`총 ${results.length}개 파일 변환`);
console.log("\n다음 단계: manus-upload-file --webdev 로 업로드");
console.log(`  manus-upload-file --webdev ${OUTPUT_DIR}/*.webp`);

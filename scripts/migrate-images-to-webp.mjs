#!/usr/bin/env node
/**
 * migrate-images-to-webp.mjs
 * 기존 S3 이미지(PNG/JPEG)를 WebP + 1600px 리사이즈로 일괄 변환
 *
 * 사용법:
 *   node scripts/migrate-images-to-webp.mjs --dry-run   # 변환 대상 목록만 출력
 *   node scripts/migrate-images-to-webp.mjs             # 실제 변환 + DB URL 업데이트
 *
 * 환경변수 (필수):
 *   DATABASE_URL              TiDB/MySQL 연결 문자열
 *   BUILT_IN_FORGE_API_URL    Manus Storage API 베이스 URL
 *   BUILT_IN_FORGE_API_KEY    Manus Storage API 키
 *
 * 변환 대상 테이블/컬럼:
 *   events.image_url
 *   popup_events.image_url
 *   equipment3_items.image_url, bg_image_url
 *   notice_images.url
 */

import { createRequire } from "module";
import { parseArgs } from "util";

const require = createRequire(import.meta.url);

// ── CLI 인수 파싱 ──────────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    "dry-run": { type: "boolean", default: false },
    "table": { type: "string", default: "all" }, // all | events | popup | equipment3 | notices
    "limit": { type: "string", default: "100" },
  },
});

const DRY_RUN = args["dry-run"];
const TARGET_TABLE = args["table"];
const LIMIT = parseInt(args["limit"], 10) || 100;
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

console.log(`\n🔧 WebP 마이그레이션 스크립트`);
console.log(`   모드: ${DRY_RUN ? "DRY-RUN (실제 변경 없음)" : "LIVE (실제 변환 + DB 업데이트)"}`);
console.log(`   대상: ${TARGET_TABLE}`);
console.log(`   최대 처리 건수: ${LIMIT}\n`);

// ── 환경변수 확인 ──────────────────────────────────────────────────────────────
const DB_URL = process.env.DATABASE_URL;
const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!DB_URL) { console.error("❌ DATABASE_URL 환경변수가 필요합니다."); process.exit(1); }
if (!FORGE_URL) { console.error("❌ BUILT_IN_FORGE_API_URL 환경변수가 필요합니다."); process.exit(1); }
if (!FORGE_KEY) { console.error("❌ BUILT_IN_FORGE_API_KEY 환경변수가 필요합니다."); process.exit(1); }

// ── 유틸리티 ──────────────────────────────────────────────────────────────────

/**
 * URL이 변환 대상인지 확인 (PNG/JPEG이고 이미 WebP가 아닌 경우)
 */
function isConvertTarget(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower.endsWith(".webp")) return false;
  if (lower.endsWith(".svg") || lower.endsWith(".gif")) return false;
  return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png");
}

/**
 * URL에서 파일명 추출
 */
function getFileName(url) {
  return url.split("/").pop()?.split("?")[0] ?? "image.jpg";
}

/**
 * 파일명에서 확장자를 .webp 로 교체
 */
function replaceExtWithWebp(fileName) {
  return fileName.replace(/\.[^.]+$/, "") + ".webp";
}

/**
 * URL에서 이미지 다운로드 → Buffer 반환
 */
async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`다운로드 실패: ${res.status} ${url}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

/**
 * sharp로 WebP 변환 + 1600px 리사이즈
 */
async function convertToWebp(buffer) {
  const sharp = require("sharp");
  const meta = await sharp(buffer).metadata();
  let pipeline = sharp(buffer);
  if ((meta.width ?? 0) > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  return pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();
}

/**
 * Manus Storage에 업로드
 */
async function uploadToStorage(buffer, fileKey, mimeType = "image/webp") {
  const uploadUrl = `${FORGE_URL.replace(/\/$/, "")}/storage/upload`;
  const formData = new FormData();
  const blob = new Blob([buffer], { type: mimeType });
  formData.append("file", blob, fileKey.split("/").pop());
  formData.append("key", fileKey);

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${FORGE_KEY}` },
    body: formData,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`업로드 실패 (${res.status}): ${msg}`);
  }
  const data = await res.json();
  return data.url;
}

// ── DB 연결 ───────────────────────────────────────────────────────────────────
let db;
async function getDb() {
  if (db) return db;
  const mysql2 = require("mysql2/promise");
  db = await mysql2.createConnection(DB_URL);
  return db;
}

// ── 변환 작업 ─────────────────────────────────────────────────────────────────

let totalProcessed = 0;
let totalConverted = 0;
let totalSkipped = 0;
let totalErrors = 0;

async function processUrl(url, updateFn) {
  if (!isConvertTarget(url)) {
    console.log(`  ⏭️  스킵 (이미 WebP 또는 변환 불필요): ${url}`);
    totalSkipped++;
    return url;
  }

  const fileName = getFileName(url);
  const webpFileName = replaceExtWithWebp(fileName);
  console.log(`  🔄 변환 중: ${fileName} → ${webpFileName}`);

  if (DRY_RUN) {
    console.log(`     [DRY-RUN] 실제 변환 건너뜀`);
    totalConverted++;
    return url;
  }

  try {
    const rawBuffer = await downloadImage(url);
    const webpBuffer = await convertToWebp(rawBuffer);
    const saving = (((rawBuffer.length - webpBuffer.length) / rawBuffer.length) * 100).toFixed(1);
    console.log(`     ${(rawBuffer.length / 1024).toFixed(1)}KB → ${(webpBuffer.length / 1024).toFixed(1)}KB (${saving}% 절감)`);

    // 기존 URL의 경로 부분에서 폴더 추출
    const pathParts = url.split("/manus-storage/")[1]?.split("/") ?? url.split("/api/storage/")[1]?.split("/") ?? [];
    const folder = pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : "migrated";
    const newKey = `${folder}/${Date.now()}-${webpFileName}`;

    const newUrl = await uploadToStorage(webpBuffer, newKey);
    await updateFn(newUrl);
    console.log(`     ✅ 완료: ${newUrl}`);
    totalConverted++;
    return newUrl;
  } catch (err) {
    console.error(`     ❌ 오류: ${err.message}`);
    totalErrors++;
    return url; // 원본 URL 유지
  }
}

// ── 테이블별 처리 ─────────────────────────────────────────────────────────────

async function migrateEvents() {
  console.log("\n📋 events 테이블 처리 중...");
  const conn = await getDb();
  const [rows] = await conn.execute(`SELECT id, imageUrl FROM events WHERE imageUrl IS NOT NULL AND imageUrl != '' LIMIT ${LIMIT}`);  
  console.log(`   ${rows.length}건 조회됨`);
  for (const row of rows) {
    totalProcessed++;
    await processUrl(row.imageUrl, async (newUrl) => {
      if (!DRY_RUN) await conn.execute(`UPDATE events SET imageUrl = ? WHERE id = ?`, [newUrl, row.id]);
    });
  }
}

async function migratePopup() {
  console.log("\n📋 popup_events 테이블 처리 중...");
  const conn = await getDb();
  const [rows] = await conn.execute(`SELECT id, imageUrl FROM popupEvents WHERE imageUrl IS NOT NULL AND imageUrl != '' LIMIT ${LIMIT}`);  
  console.log(`   ${rows.length}건 조회됨`);
  for (const row of rows) {
    totalProcessed++;
    await processUrl(row.imageUrl, async (newUrl) => {
      if (!DRY_RUN) await conn.execute(`UPDATE popupEvents SET imageUrl = ? WHERE id = ?`, [newUrl, row.id]);
    });
  }
}

async function migrateEquipment3() {
  console.log("\n📋 equipment3_items 테이블 처리 중...");
  const conn = await getDb();
  const [rows] = await conn.execute(`SELECT id, imageUrl, bgImageUrl FROM equipment3 LIMIT ${LIMIT}`);  
  console.log(`   ${rows.length}건 조회됨`);
  for (const row of rows) {
    if (row.imageUrl) {
      totalProcessed++;
      await processUrl(row.imageUrl, async (newUrl) => {
        if (!DRY_RUN) await conn.execute(`UPDATE equipment3 SET imageUrl = ? WHERE id = ?`, [newUrl, row.id]);
      });
    }
    if (row.bgImageUrl) {
      totalProcessed++;
      await processUrl(row.bgImageUrl, async (newUrl) => {
        if (!DRY_RUN) await conn.execute(`UPDATE equipment3 SET bgImageUrl = ? WHERE id = ?`, [newUrl, row.id]);
      });
    }
  }
}

async function migrateNotices() {
  console.log("\n📋 notice_images 테이블 처리 중...");
  const conn = await getDb();
  const [rows] = await conn.execute(`SELECT id, url FROM notice_images WHERE url IS NOT NULL AND url != '' LIMIT ${LIMIT}`);  
  console.log(`   ${rows.length}건 조회됨`);
  for (const row of rows) {
    totalProcessed++;
    await processUrl(row.url, async (newUrl) => {
      if (!DRY_RUN) await conn.execute(`UPDATE notice_images SET url = ? WHERE id = ?`, [newUrl, row.id]);
    });
  }
}

// ── 메인 ──────────────────────────────────────────────────────────────────────
async function main() {
  try {
    if (TARGET_TABLE === "all" || TARGET_TABLE === "events") await migrateEvents();
    if (TARGET_TABLE === "all" || TARGET_TABLE === "popup") await migratePopup();
    if (TARGET_TABLE === "all" || TARGET_TABLE === "equipment3") await migrateEquipment3();
    if (TARGET_TABLE === "all" || TARGET_TABLE === "notices") await migrateNotices();
  } finally {
    if (db) await db.end();
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`📊 마이그레이션 결과:`);
  console.log(`   처리 대상: ${totalProcessed}건`);
  console.log(`   변환 완료: ${totalConverted}건`);
  console.log(`   스킵:      ${totalSkipped}건`);
  console.log(`   오류:      ${totalErrors}건`);
  if (DRY_RUN) {
    console.log(`\n⚠️  DRY-RUN 모드: 실제 변경 없음. --dry-run 플래그를 제거하면 실제 변환이 실행됩니다.`);
  }
  console.log();
}

main().catch((err) => {
  console.error("❌ 마이그레이션 실패:", err);
  process.exit(1);
});

/**
 * migrate-equipment2-to-equipment3.mjs
 *
 * equipment2 정적 데이터(treatments-data.ts)에서 equipment3 DB에 누락된 항목을 삽입합니다.
 * - 이미 같은 name이 같은 category에 존재하면 건너뜁니다 (중복 방지)
 * - slug는 name을 URL-safe 형태로 변환하여 생성합니다 (충돌 시 -2, -3 suffix)
 *
 * 실행: node scripts/migrate-equipment2-to-equipment3.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// ── 카테고리 섹션 키 → 한국어 카테고리명 매핑 ────────────────────────────
const CATEGORY_MAP = {
  best: "Best 시술",
  lifting: "리프팅·탄력",
  eye: "눈밑지방재배치",
  rosacea: "홍조·혈관",
  pigment: "색소·문신",
  scar: "흉터·모공",
  volume: "볼륨·부스터",
  botox: "보톡스·필러",
  acne: "여드름",
  fungus: "손·발톱무좀",
  vitiligo: "백반증",
  psoriasis: "건선·아토피",
  stemcell: "줄기세포 치료",
  acne_laser: "여드름",   // acne_laser 항목도 여드름 카테고리로 통합
  stem_cell: "줄기세포 치료",
};

// ── slug 생성 헬퍼 ──────────────────────────────────────────────────────────
function toSlug(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ·+]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[+]/g, "plus")
    .replace(/·/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── treatments-data.ts 파싱 (Node.js에서 TS 파일 직접 파싱) ─────────────
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = resolve(__dirname, "../client/src/data/treatments/treatments-data.ts");
const src = readFileSync(srcPath, "utf-8");

// JSON-safe 변환: TypeScript 객체를 파싱 가능한 형태로 추출
// 각 항목의 name, nameEn, nameJa, nameZh, desc, descEn, descJa, descZh,
// detail, detailEn, detailJa, detailZh, effect, effectEn, caution, cautionEn,
// sessions, image, cardBannerImage 추출

function extractField(obj, field) {
  // 멀티라인 문자열 포함 추출
  const re = new RegExp(`${field}:\\s*["'\`]([\\s\\S]*?)["'\`](?:\\s*,|\\s*[}\n])`, "m");
  const m = obj.match(re);
  return m ? m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'") : "";
}

// 섹션별로 항목 배열 파싱
function parseSections(src) {
  const sections = {};
  // 각 섹션 키 찾기
  const sectionRe = /^\s{2}(\w+):\s*\[/gm;
  let sectionMatch;
  const sectionStarts = [];
  while ((sectionMatch = sectionRe.exec(src)) !== null) {
    sectionStarts.push({ key: sectionMatch[1], pos: sectionMatch.index });
  }

  for (let i = 0; i < sectionStarts.length; i++) {
    const { key, pos } = sectionStarts[i];
    const end = i + 1 < sectionStarts.length ? sectionStarts[i + 1].pos : src.length;
    const sectionSrc = src.slice(pos, end);

    // 각 항목 { ... } 블록 추출
    const items = [];
    let depth = 0;
    let start = -1;
    for (let j = 0; j < sectionSrc.length; j++) {
      if (sectionSrc[j] === "{") {
        if (depth === 0) start = j;
        depth++;
      } else if (sectionSrc[j] === "}") {
        depth--;
        if (depth === 0 && start !== -1) {
          const block = sectionSrc.slice(start, j + 1);
          items.push(block);
          start = -1;
        }
      }
    }

    sections[key] = items.map((block) => ({
      name: extractField(block, "name"),
      nameEn: extractField(block, "nameEn"),
      nameJa: extractField(block, "nameJa"),
      nameZh: extractField(block, "nameZh"),
      desc: extractField(block, "desc"),
      descEn: extractField(block, "descEn"),
      descJa: extractField(block, "descJa"),
      descZh: extractField(block, "descZh"),
      detail: extractField(block, "detail"),
      detailEn: extractField(block, "detailEn"),
      detailJa: extractField(block, "detailJa"),
      detailZh: extractField(block, "detailZh"),
      effect: extractField(block, "effect"),
      effectEn: extractField(block, "effectEn"),
      caution: extractField(block, "caution"),
      cautionEn: extractField(block, "cautionEn"),
      sessions: extractField(block, "sessions"),
      image: extractField(block, "image"),
      cardBannerImage: extractField(block, "cardBannerImage"),
    })).filter((item) => item.name.length > 0);
  }
  return sections;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  const conn = await mysql.createConnection(url);
  console.log("✅ DB 연결 성공");

  // 현재 equipment3 DB 항목 조회 (중복 방지용)
  const [existing] = await conn.execute(
    "SELECT name, category FROM equipment3"
  );
  const existingSet = new Set(
    existing.map((r) => `${r.category}||${r.name}`)
  );
  console.log(`📊 기존 equipment3 항목: ${existing.length}개`);

  // 현재 slug 목록 (충돌 방지)
  const [slugRows] = await conn.execute("SELECT slug FROM equipment3");
  const slugSet = new Set(slugRows.map((r) => r.slug));

  // treatments-data.ts 파싱
  const sections = parseSections(src);
  console.log(`📂 파싱된 섹션: ${Object.keys(sections).join(", ")}`);

  let inserted = 0;
  let skipped = 0;

  for (const [sectionKey, items] of Object.entries(sections)) {
    const category = CATEGORY_MAP[sectionKey];
    if (!category) {
      console.log(`⚠️  섹션 '${sectionKey}' 카테고리 매핑 없음, 건너뜀`);
      continue;
    }

    for (const item of items) {
      if (!item.name) continue;

      const key = `${category}||${item.name}`;
      if (existingSet.has(key)) {
        console.log(`  ⏭  이미 존재: [${category}] ${item.name}`);
        skipped++;
        continue;
      }

      // slug 생성 (충돌 시 suffix)
      let baseSlug = toSlug(item.name);
      if (!baseSlug) baseSlug = `item-${Date.now()}`;
      let slug = baseSlug;
      let suffix = 2;
      while (slugSet.has(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }
      slugSet.add(slug);

      await conn.execute(
        `INSERT INTO equipment3
          (slug, name, nameEn, nameJa, nameZh,
           category,
           \`desc\`, descEn, descJa, descZh,
           detail, detailEn, detailJa, detailZh,
           effect, effectEn,
           caution, cautionEn,
           sessions, imageUrl, modalImage,
           isBest, sortOrder, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '0', 0, '1')`,
        [
          slug,
          item.name,
          item.nameEn || "",
          item.nameJa || "",
          item.nameZh || "",
          category,
          item.desc || "",
          item.descEn || "",
          item.descJa || "",
          item.descZh || "",
          item.detail || "",
          item.detailEn || "",
          item.detailJa || "",
          item.detailZh || "",
          item.effect || "",
          item.effectEn || "",
          item.caution || "",
          item.cautionEn || "",
          item.sessions || "",
          item.image || item.cardBannerImage || "",  // imageUrl
          item.cardBannerImage || item.image || "",  // modalImage
        ]
      );

      existingSet.add(key);
      console.log(`  ✅ 삽입: [${category}] ${item.name} (slug: ${slug})`);
      inserted++;
    }
  }

  await conn.end();
  console.log(`\n🎉 완료: ${inserted}개 삽입, ${skipped}개 건너뜀`);
}

main().catch((err) => {
  console.error("❌ 오류:", err.message);
  process.exit(1);
});

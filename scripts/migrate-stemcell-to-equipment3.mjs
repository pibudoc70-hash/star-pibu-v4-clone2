/**
 * migrate-stemcell-to-equipment3.mjs
 *
 * treatments 테이블의 줄기세포 관련 시술을 equipment3 테이블로 자동 이전합니다.
 * - 이미 equipment3에 동일 slug가 있으면 건너뜁니다 (중복 방지)
 * - treatments.image → equipment3.imageUrl 매핑
 * - slug 없는 경우 name 기반으로 자동 생성
 *
 * 실행: node scripts/migrate-stemcell-to-equipment3.mjs
 */
import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

// ── 1. 이전할 treatments 데이터 조회 ──────────────────────────────────────────
// 줄기세포 관련 시술: name에 '줄기' 포함 OR categoryId에 'stem' 포함
const [sourceRows] = await conn.execute(
  `SELECT
    id, categoryId, slug, name, nameEn, nameJa, nameZh,
    \`desc\`, descEn, descJa, descZh,
    detail, detailEn, detailJa, detailZh,
    effect, effectEn, effectJa, effectZh,
    caution, cautionEn, cautionJa, cautionZh,
    \`time\`, timeEn, timeJa, timeZh,
    recovery, recoveryEn, recoveryJa, recoveryZh,
    sessions, sessionsEn, sessionsJa, sessionsZh,
    image, youtubeUrl, badge, badgeColor, sortOrder, isActive
  FROM treatments
  WHERE name LIKE '%줄기%' OR categoryId LIKE '%stem%'
  ORDER BY sortOrder, id`
);

console.log(`\n✅ 이전 대상: ${sourceRows.length}건`);
if (sourceRows.length === 0) {
  console.log("이전할 데이터가 없습니다.");
  await conn.end();
  process.exit(0);
}

// ── 2. 기존 equipment3 slug 목록 조회 ────────────────────────────────────────
const [existingRows] = await conn.execute("SELECT slug FROM equipment3");
const existingSlugs = new Set(existingRows.map((r) => r.slug));

// ── 3. slug 생성 헬퍼 ─────────────────────────────────────────────────────────
// 한국어 시술명 → 영문 slug 매핑 테이블
const KO_SLUG_MAP = {
  '줄기세포 치료': 'stem-cell-therapy',
  '줄기세포치료': 'stem-cell-therapy',
  '혈액 줄기세포': 'blood-stem-cell',
  '지방 줄기세포': 'fat-stem-cell',
  '볼륨업 프로그램': 'volume-up-program',
  '흉터 치료 프로그램': 'scar-treatment',
  '홍조 치료 프로그램': 'redness-treatment',
};

function toSlug(name) {
  // 한국어 매핑 우선 적용
  if (KO_SLUG_MAP[name]) return KO_SLUG_MAP[name];
  // 영문/숫자/하이픈만 남기기
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  // slug가 비거나 하이픈만 남으면 nameEn 기반으로 생성
  return slug && slug !== '-' ? slug : `item-${Date.now()}`;
}

// slug 중복 방지 (equipment3 내 + 이번 배치 내)
const usedSlugs = new Set(existingSlugs);
function uniqueSlug(base) {
  let slug = base;
  let i = 2;
  while (usedSlugs.has(slug)) {
    slug = `${base}-${i++}`;
  }
  usedSlugs.add(slug);
  return slug;
}

// ── 4. 현재 equipment3 최대 sortOrder 조회 ───────────────────────────────────
const [[{ maxOrder }]] = await conn.execute(
  "SELECT COALESCE(MAX(sortOrder), -1) AS maxOrder FROM equipment3"
);
let nextOrder = maxOrder + 1;

// ── 5. 이전 실행 ──────────────────────────────────────────────────────────────
let inserted = 0;
let skipped = 0;

for (const row of sourceRows) {
  // slug 결정
  const baseSlug = row.slug ? row.slug : toSlug(row.name);
  
  // 이미 equipment3에 존재하면 건너뜀
  if (existingSlugs.has(baseSlug)) {
    console.log(`  ⏭  건너뜀 (이미 존재): ${row.name} (slug: ${baseSlug})`);
    skipped++;
    continue;
  }
  
  const slug = uniqueSlug(baseSlug);
  const category = "줄기세포 치료";  // equipment3의 category 필드에 사용
  
  await conn.execute(
    `INSERT INTO equipment3 (
      slug, name, nameEn, nameJa, nameZh,
      category, categoryEn, categoryJa, categoryZh,
      \`desc\`, descEn, descJa, descZh,
      detail, detailEn, detailJa, detailZh,
      effect, effectEn, effectJa, effectZh,
      caution, cautionEn, cautionJa, cautionZh,
      \`time\`, timeEn, timeJa, timeZh,
      recovery, recoveryEn, recoveryJa, recoveryZh,
      sessions, sessionsEn, sessionsJa, sessionsZh,
      imageUrl, images, youtubeUrl, modalImage,
      badge, badgeColor, sortOrder, isActive,
      createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      NOW(), NOW()
    )`,
    [
      slug,
      row.name ?? "",
      row.nameEn ?? "",
      row.nameJa ?? "",
      row.nameZh ?? "",
      // category (한/영/일/중)
      category,
      "Stem Cell Therapy",
      "幹細胞治療",
      "干细胞治疗",
      // desc
      row.desc ?? "",
      row.descEn ?? "",
      row.descJa ?? "",
      row.descZh ?? "",
      // detail
      row.detail ?? "",
      row.detailEn ?? "",
      row.detailJa ?? "",
      row.detailZh ?? "",
      // effect
      row.effect ?? "",
      row.effectEn ?? "",
      row.effectJa ?? "",
      row.effectZh ?? "",
      // caution
      row.caution ?? "",
      row.cautionEn ?? "",
      row.cautionJa ?? "",
      row.cautionZh ?? "",
      // time
      row.time ?? "",
      row.timeEn ?? "",
      row.timeJa ?? "",
      row.timeZh ?? "",
      // recovery
      row.recovery ?? "",
      row.recoveryEn ?? "",
      row.recoveryJa ?? "",
      row.recoveryZh ?? "",
      // sessions
      row.sessions ?? "",
      row.sessionsEn ?? "",
      row.sessionsJa ?? "",
      row.sessionsZh ?? "",
      // media
      row.image ?? null,   // treatments.image → equipment3.imageUrl
      "[]",                // images JSON 배열
      row.youtubeUrl ?? null,
      null,                // modalImage
      // badge
      row.badge ?? "",
      row.badgeColor ?? "#4A6FA5",
      // order / active
      nextOrder++,
      "1",                 // 활성으로 이전 (원본이 비활성이어도 새 섹션에서는 활성)
    ]
  );
  
  console.log(`  ✅ 이전 완료: ${row.name} → slug: ${slug}`);
  inserted++;
}

console.log(`\n─────────────────────────────────`);
console.log(`완료: ${inserted}건 이전, ${skipped}건 건너뜀`);
console.log(`─────────────────────────────────`);

await conn.end();

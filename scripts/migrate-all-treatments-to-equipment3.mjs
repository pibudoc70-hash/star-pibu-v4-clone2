/**
 * migrate-all-treatments-to-equipment3.mjs
 * treatments 테이블의 활성 항목을 equipment3으로 이전
 * - 이미 equipment3에 있는 항목(slug 또는 name 기준)은 건너뜀
 * - categoryId → category 매핑 포함
 */
import mysql from "mysql2/promise";

// categoryId → 한국어/영어/일어/중국어 카테고리명 매핑
const CATEGORY_MAP = {
  best:       { ko: "Best 시술",     en: "Best Treatments",   ja: "おすすめ施術",    zh: "精选项目" },
  lifting:    { ko: "리프팅·탄력",   en: "Lifting & Firming", ja: "リフティング",    zh: "提升紧致" },
  eye:        { ko: "눈밑지방재배치", en: "Eye Treatment",     ja: "目の下の治療",    zh: "眼部治疗" },
  rosacea:    { ko: "홍조·혈관",     en: "Rosacea & Vascular",ja: "赤ら顔・血管",    zh: "红血丝·血管" },
  pigment:    { ko: "색소·문신",     en: "Pigment & Tattoo",  ja: "色素・タトゥー",  zh: "色素·纹身" },
  scar:       { ko: "흉터·모공",     en: "Scar & Pore",       ja: "傷跡・毛穴",      zh: "疤痕·毛孔" },
  volume:     { ko: "볼륨·부스터",   en: "Volume & Booster",  ja: "ボリューム",      zh: "填充·提升" },
  botox:      { ko: "보톡스·필러",   en: "Botox & Filler",    ja: "ボトックス",      zh: "肉毒素·填充" },
  acne:       { ko: "여드름",        en: "Acne",              ja: "ニキビ",          zh: "痤疮" },
  fungus:     { ko: "액취증·다한증", en: "Hyperhidrosis",     ja: "多汗症",          zh: "多汗症" },
  acne_laser: { ko: "손·발톱무좀",   en: "Nail Fungus",       ja: "爪水虫",          zh: "灰指甲" },
  vitiligo:   { ko: "건선·아토피",   en: "Psoriasis & Atopy", ja: "乾癬・アトピー",  zh: "银屑病·特应性" },
  psoriasis:  { ko: "백반증",        en: "Vitiligo",          ja: "白斑症",          zh: "白癜风" },
  stem_cell:  { ko: "줄기세포 치료", en: "STEM CELL",         ja: "幹細胞治療",      zh: "干细胞治疗" },
};

// slug 생성 헬퍼
function makeSlug(name, nameEn, id) {
  // 영문명이 있으면 영문명 기반 slug
  if (nameEn && nameEn.trim()) {
    return nameEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || `treatment-${id}`;
  }
  return `treatment-${id}`;
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // 현재 equipment3 slug 목록 조회
  const [existing] = await conn.execute("SELECT slug, name FROM equipment3");
  const existingSlugs = new Set(existing.map((r) => r.slug));
  const existingNames = new Set(existing.map((r) => r.name));

  console.log("현재 equipment3 항목:", [...existingNames].join(", "));

  // treatments 활성 항목 조회
  const [treatments] = await conn.execute(
    "SELECT * FROM treatments WHERE isActive='1' ORDER BY sortOrder, id"
  );

  console.log(`\ntreatments 활성 항목 ${treatments.length}건 발견`);

  let inserted = 0;
  let skipped = 0;

  for (const t of treatments) {
    const slug = t.slug || makeSlug(t.name, t.nameEn, t.id);

    // 이미 등록된 항목 건너뜀 (slug 또는 name 기준)
    if (existingSlugs.has(slug) || existingNames.has(t.name)) {
      console.log(`  ⏭ 건너뜀: ${t.name} (slug: ${slug})`);
      skipped++;
      continue;
    }

    const catInfo = CATEGORY_MAP[t.categoryId] ?? CATEGORY_MAP.best;

    // badge 처리 - "배지 텍스트" 같은 기본값은 제거
    const badge = (t.badge && t.badge !== "배지 텍스트") ? t.badge : null;
    const badgeColor = badge ? t.badgeColor : null;

    await conn.execute(
      `INSERT INTO equipment3
        (slug, name, nameEn, nameJa, nameZh,
         category, categoryEn, categoryJa, categoryZh,
         \`desc\`, descEn, descJa, descZh,
         detail, detailEn, detailJa, detailZh,
         effect, effectEn, effectJa, effectZh,
         caution, cautionEn, cautionJa, cautionZh,
         sessions, sessionsEn, sessionsJa, sessionsZh,
         time, timeEn, timeJa, timeZh,
         recovery, recoveryEn, recoveryJa, recoveryZh,
         imageUrl, images, youtubeUrl, modalImage,
         badge, badgeColor,
         sortOrder, isActive, createdAt, updatedAt)
       VALUES (?,?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?, ?,?,NOW(),NOW())`,
      [
        slug,
        t.name || "",
        t.nameEn || "",
        t.nameJa || null,
        t.nameZh || null,
        catInfo.ko,
        catInfo.en,
        catInfo.ja,
        catInfo.zh,
        t.desc || null,
        t.descEn || null,
        t.descJa || null,
        t.descZh || null,
        t.detail || null,
        t.detailEn || null,
        t.detailJa || null,
        t.detailZh || null,
        t.effect || null,
        t.effectEn || null,
        t.effectJa || null,
        t.effectZh || null,
        t.caution || null,
        t.cautionEn || null,
        t.cautionJa || null,
        t.cautionZh || null,
        t.sessions || null,
        t.sessionsEn || null,
        t.sessionsJa || null,
        t.sessionsZh || null,
        t.time || null,
        t.timeEn || null,
        t.timeJa || null,
        t.timeZh || null,
        t.recovery || null,
        t.recoveryEn || null,
        t.recoveryJa || null,
        t.recoveryZh || null,
        t.image || null,
        t.images || null,
        t.youtubeUrl || null,
        t.modalImage || null,
        badge,
        badgeColor,
        inserted + 1,
        "1",
      ]
    );

    console.log(`  ✅ 등록: ${t.name} → /equipment3/${slug} [${catInfo.ko}]`);
    inserted++;
  }

  console.log(`\n완료: ${inserted}건 등록, ${skipped}건 건너뜀`);

  // 최종 equipment3 목록 확인
  const [final] = await conn.execute(
    "SELECT id, name, slug, category FROM equipment3 ORDER BY sortOrder, id"
  );
  console.log("\n최종 equipment3 목록:");
  for (const r of final) {
    console.log(`  [${r.id}] ${r.name} → /equipment3/${r.slug} (${r.category})`);
  }

  await conn.end();
}

main().catch(console.error);

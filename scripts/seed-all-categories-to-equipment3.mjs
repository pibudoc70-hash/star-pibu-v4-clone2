/**
 * seed-all-categories-to-equipment3.mjs
 * equipment2의 모든 카테고리를 equipment3에 추가
 * 각 카테고리별로 1개의 샘플 시술 등록
 */
import mysql from "mysql2/promise";

// equipment2의 모든 카테고리 정의
const CATEGORIES = [
  { id: "best", ko: "Best 시술", en: "Best Treatments", ja: "おすすめ施術", zh: "精选项目" },
  { id: "lifting", ko: "리프팅·탄력", en: "Lifting & Firming", ja: "リフティング", zh: "提升紧致" },
  { id: "eye", ko: "눈밑지방재배치", en: "Eye Treatment", ja: "目の下の治療", zh: "眼部治疗" },
  { id: "vitiligo", ko: "백반증", en: "Vitiligo", ja: "白斑症", zh: "白癜风" },
  { id: "pigment", ko: "색소·문신", en: "Pigment & Tattoo", ja: "色素・タトゥー", zh: "色素·纹身" },
  { id: "scar", ko: "흉터·모공", en: "Scar & Pore", ja: "傷跡・毛穴", zh: "疤痕·毛孔" },
  { id: "acne_laser", ko: "여드름", en: "Acne", ja: "ニキビ", zh: "痤疮" },
  { id: "rosacea", ko: "홍조·혈관", en: "Rosacea & Vascular", ja: "赤ら顔・血管", zh: "红血丝·血管" },
  { id: "acne", ko: "액취증·다한증", en: "Hyperhidrosis", ja: "多汗症", zh: "多汗症" },
  { id: "fungus", ko: "손·발톱무좀", en: "Nail Fungus", ja: "爪水虫", zh: "灰指甲" },
  { id: "psoriasis", ko: "건선·아토피", en: "Psoriasis & Atopy", ja: "乾癬・アトピー", zh: "银屑病·特应性" },
  { id: "volume", ko: "볼륨·부스터", en: "Volume & Booster", ja: "ボリューム", zh: "填充·提升" },
  { id: "botox", ko: "보톡스·필러", en: "Botox & Filler", ja: "ボトックス", zh: "肉毒素·填充" },
  { id: "stem_cell", ko: "줄기세포 치료", en: "STEM CELL", ja: "幹細胞治療", zh: "干细胞治疗" },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // 현재 equipment3 카테고리 확인
  const [existing] = await conn.execute("SELECT DISTINCT category FROM equipment3");
  const existingCats = new Set(existing.map((r) => r.category));

  console.log("현재 equipment3 카테고리:", [...existingCats].join(", "));

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];

    // 이미 등록된 카테고리 건너뜀
    if (existingCats.has(cat.ko)) {
      console.log(`  ⏭ 건너뜀: ${cat.ko}`);
      skipped++;
      continue;
    }

    // 카테고리별 샘플 시술 1개씩 등록
    const slug = cat.id;
    const name = `${cat.ko} 시술`;
    const nameEn = `${cat.en} Treatment`;

    await conn.execute(
      `INSERT INTO equipment3
        (slug, name, nameEn, nameJa, nameZh,
         category, categoryEn, categoryJa, categoryZh,
         \`desc\`, descEn, descJa, descZh,
         time, timeEn, timeJa, timeZh,
         recovery, recoveryEn, recoveryJa, recoveryZh,
         sortOrder, isActive, createdAt, updatedAt)
       VALUES (?,?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,NOW(),NOW())`,
      [
        slug,
        name,
        nameEn,
        null,
        null,
        cat.ko,
        cat.en,
        cat.ja,
        cat.zh,
        `${cat.ko} 시술 설명`,
        `${cat.en} treatment description`,
        null,
        null,
        "60분",
        "60 minutes",
        null,
        null,
        "당일 일상",
        "Same day",
        null,
        null,
        inserted + 1,
        "1",
      ]
    );

    console.log(`  ✅ 등록: ${cat.ko} → /equipment3/${slug}`);
    inserted++;
  }

  console.log(`\n완료: ${inserted}건 등록, ${skipped}건 건너뜀`);

  // 최종 equipment3 카테고리 목록 확인
  const [final] = await conn.execute(
    "SELECT DISTINCT category FROM equipment3 ORDER BY category"
  );
  console.log("\n최종 equipment3 카테고리:");
  for (const r of final) {
    console.log(`  - ${r.category}`);
  }

  await conn.end();
}

main().catch(console.error);

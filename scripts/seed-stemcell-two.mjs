/**
 * seed-stemcell-two.mjs
 *
 * 혈액줄기세포, 지방줄기세포 두 시술을 equipment3에 직접 등록합니다.
 * 이미 slug가 존재하면 건너뜁니다 (중복 방지).
 *
 * 실행: node scripts/seed-stemcell-two.mjs
 */
import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

// 기존 slug 확인
const [existingRows] = await conn.execute("SELECT slug FROM equipment3");
const existingSlugs = new Set(existingRows.map((r) => r.slug));

// 현재 최대 sortOrder 조회
const [[{ maxOrder }]] = await conn.execute(
  "SELECT COALESCE(MAX(sortOrder), -1) AS maxOrder FROM equipment3"
);
let nextOrder = maxOrder + 1;

const items = [
  {
    slug: "blood-stem-cell",
    name: "혈액줄기세포",
    nameEn: "BLOOD STEM CELL THERAPY",
    nameJa: "血液幹細胞療法",
    nameZh: "血液干细胞疗法",
    category: "줄기세포 치료",
    categoryEn: "Stem Cell Therapy",
    categoryJa: "幹細胞治療",
    categoryZh: "干细胞治疗",
    desc: "소량의 혈액에서 줄기세포를 분리·농축하여 피부에 직접 주사하는 자가세포 치료. 채혈만으로 준비되어 시술 과정이 간편하고 이상반응 위험이 낮습니다.",
    descEn: "A self-cell therapy that separates and concentrates stem cells from a small amount of blood and injects them directly into the skin. The procedure is simple as it only requires blood collection, with a low risk of adverse reactions.",
    descJa: "少量の血液から幹細胞を分離・濃縮し、皮膚に直接注射する自家細胞治療。採血のみで準備でき、施術過程が簡単で副作用のリスクが低いです。",
    descZh: "从少量血液中分离、浓缩干细胞后直接注射到皮肤的自体细胞治疗。只需采血即可准备，治疗过程简便，不良反应风险低。",
    detail: "혈액 유래 줄기세포 치료는 소량의 혈액(약 20~30ml)을 채취하여 원심분리 과정을 통해 줄기세포 성분을 농축·분리합니다. 분리된 줄기세포를 피부 노화가 진행된 부위에 정밀하게 주사하여 피부 재생 인자를 직접 공급합니다. 자신의 혈액에서 추출한 세포를 사용하므로 이상반응·거부반응 위험이 낮으며, 피부 탄력·수분·결 개선을 유도합니다. 시술 후 회복 기간이 짧아 일상 복귀가 빠릅니다.",
    detailEn: "Blood-derived stem cell therapy involves collecting a small amount of blood (approximately 20-30ml) and concentrating and separating stem cell components through centrifugation. The separated stem cells are precisely injected into areas of skin aging to directly supply skin regeneration factors. Since cells extracted from your own blood are used, the risk of adverse reactions and rejection is low, promoting improvement in skin elasticity, moisture, and texture. Recovery time after treatment is short, allowing for quick return to daily activities.",
    detailJa: "",
    detailZh: "",
    effect: "피부 재생, 탄력 개선, 수분 보충, 피부결 정돈, 노화 개선",
    effectEn: "Skin regeneration, elasticity improvement, moisture replenishment, skin texture refinement, anti-aging",
    effectJa: "肌再生、弾力改善、水分補充、肌質改善、老化改善",
    effectZh: "皮肤再生、弹力改善、补充水分、改善肤质、抗衰老",
    caution: "시술 전 혈액 채취 과정이 포함됩니다. 시술 후 1~3일간 주사 부위에 경미한 붓기·멍이 나타날 수 있습니다. 시술 후 1주일간 격렬한 운동과 음주는 피하세요. 효과는 개인차가 있으며 담당 의료진과 충분히 상담 후 결정하세요.",
    cautionEn: "The procedure includes a blood collection process beforehand. Mild swelling and bruising may appear at the injection site for 1-3 days after treatment. Avoid strenuous exercise and alcohol for 1 week after treatment. Results vary by individual; please consult thoroughly with your medical staff before deciding.",
    cautionJa: "",
    cautionZh: "",
    time: "60~90분",
    timeEn: "60~90 min",
    timeJa: "60〜90分",
    timeZh: "60~90分钟",
    recovery: "1~3일",
    recoveryEn: "1~3 days",
    recoveryJa: "1〜3日",
    recoveryZh: "1~3天",
    sessions: "1~3회 (담당 의료진 상담 후 결정)",
    sessionsEn: "1~3 sessions (determined after consultation with medical staff)",
    sessionsJa: "1〜3回（担当医療スタッフとの相談後に決定）",
    sessionsZh: "1~3次（经医疗人员咨询后决定）",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/stemcell_treatment_card-oGb7XJiuyUVsc7VGWNioEw.webp",
    badge: "자가세포",
    badgeColor: "#2E7D32",
  },
  {
    slug: "fat-stem-cell",
    name: "지방줄기세포",
    nameEn: "FAT STEM CELL THERAPY",
    nameJa: "脂肪幹細胞療法",
    nameZh: "脂肪干细胞疗法",
    category: "줄기세포 치료",
    categoryEn: "Stem Cell Therapy",
    categoryJa: "幹細胞治療",
    categoryZh: "干细胞治疗",
    desc: "복부·허벅지 등 지방 조직에서 추출한 줄기세포를 피부에 주사하는 자가세포 치료. 혈액 유래 대비 더 많은 줄기세포를 확보할 수 있어 효과가 풍부합니다.",
    descEn: "A self-cell therapy that injects stem cells extracted from adipose tissue such as the abdomen and thighs into the skin. More stem cells can be obtained compared to blood-derived therapy, providing richer effects.",
    descJa: "腹部・太ももなどの脂肪組織から抽出した幹細胞を皮膚に注射する自家細胞治療。血液由来と比べてより多くの幹細胞を確保できるため、効果が豊富です。",
    descZh: "从腹部、大腿等脂肪组织中提取干细胞注射到皮肤的自体细胞治疗。与血液来源相比，可获取更多干细胞，效果更为丰富。",
    detail: "지방 유래 줄기세포 치료는 복부·허벅지 등 소량의 지방을 채취하여 줄기세포를 분리·농축합니다. 지방 조직에는 혈액 대비 훨씬 많은 줄기세포가 포함되어 있어 더 풍부한 재생 효과를 기대할 수 있습니다. 분리된 줄기세포를 노화·손상된 피부 부위에 정밀 주사하여 콜라겐 생성을 촉진하고 피부 재생을 유도합니다. 자가세포를 사용하므로 이상반응·거부반응 위험이 낮으며, 자연스러운 볼륨감과 탄력 개선 효과를 제공합니다.",
    detailEn: "Fat-derived stem cell therapy involves collecting a small amount of fat from the abdomen, thighs, etc., and separating and concentrating stem cells. Adipose tissue contains far more stem cells than blood, allowing for richer regenerative effects. The separated stem cells are precisely injected into aging and damaged skin areas to stimulate collagen production and induce skin regeneration. Since autologous cells are used, the risk of adverse reactions and rejection is low, providing natural volume and elasticity improvement.",
    detailJa: "",
    detailZh: "",
    effect: "피부 재생, 탄력 개선, 볼륨감 회복, 콜라겐 생성 촉진, 피부결 정돈",
    effectEn: "Skin regeneration, elasticity improvement, volume restoration, collagen production stimulation, skin texture refinement",
    effectJa: "肌再生、弾力改善、ボリューム回復、コラーゲン生成促進、肌質改善",
    effectZh: "皮肤再生、弹力改善、恢复丰盈感、促进胶原蛋白生成、改善肤质",
    caution: "시술 전 지방 채취(소량 지방흡입) 과정이 포함됩니다. 채취 부위에 일시적인 멍·붓기가 나타날 수 있습니다. 시술 후 1~2주간 격렬한 운동과 음주는 피하세요. 효과는 개인차가 있으며 담당 의료진과 충분히 상담 후 결정하세요.",
    cautionEn: "The procedure includes a fat collection (small-scale liposuction) process beforehand. Temporary bruising and swelling may appear at the collection site. Avoid strenuous exercise and alcohol for 1-2 weeks after treatment. Results vary by individual; please consult thoroughly with your medical staff before deciding.",
    cautionJa: "",
    cautionZh: "",
    time: "90~120분",
    timeEn: "90~120 min",
    timeJa: "90〜120分",
    timeZh: "90~120分钟",
    recovery: "3~7일",
    recoveryEn: "3~7 days",
    recoveryJa: "3〜7日",
    recoveryZh: "3~7天",
    sessions: "1~2회 (담당 의료진 상담 후 결정)",
    sessionsEn: "1~2 sessions (determined after consultation with medical staff)",
    sessionsJa: "1〜2回（担当医療スタッフとの相談後に決定）",
    sessionsZh: "1~2次（经医疗人员咨询后决定）",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663478405399/QdQ7tySKssCV8bdRzPPxg4/treatments/1779951321735-6zdas2qj9aj.jpg",
    badge: "프리미엄",
    badgeColor: "#9C5FA5",
  },
];

let inserted = 0;
let skipped = 0;

for (const item of items) {
  if (existingSlugs.has(item.slug)) {
    console.log(`  ⏭  건너뜀 (이미 존재): ${item.name} (slug: ${item.slug})`);
    skipped++;
    continue;
  }

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
      item.slug,
      item.name, item.nameEn, item.nameJa, item.nameZh,
      item.category, item.categoryEn, item.categoryJa, item.categoryZh,
      item.desc, item.descEn, item.descJa, item.descZh,
      item.detail, item.detailEn, item.detailJa, item.detailZh,
      item.effect, item.effectEn, item.effectJa, item.effectZh,
      item.caution, item.cautionEn, item.cautionJa, item.cautionZh,
      item.time, item.timeEn, item.timeJa, item.timeZh,
      item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh,
      item.sessions, item.sessionsEn, item.sessionsJa, item.sessionsZh,
      item.imageUrl,
      "[]",
      null,
      null,
      item.badge, item.badgeColor,
      nextOrder++,
      "1",
    ]
  );

  console.log(`  ✅ 등록 완료: ${item.name} → /equipment3/${item.slug}`);
  inserted++;
}

console.log(`\n─────────────────────────────────`);
console.log(`완료: ${inserted}건 등록, ${skipped}건 건너뜀`);
console.log(`─────────────────────────────────`);

await conn.end();

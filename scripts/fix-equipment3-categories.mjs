#!/usr/bin/env node
/**
 * equipment3 category 필드를 모두 한글로 통일
 * 영문 ID → 한글 카테고리명 매핑
 */
import mysql from "mysql2/promise";

const categoryMap = {
  rosacea: "홍조·혈관",
  pigment: "색소·문신",
  fungus: "손·발톱무좀",
  acne: "여드름",
  "줄기세포 치료": "줄기세포 치료",
  acne_laser: "여드름",
  scar: "흉터·모공",
  best: "Best 시술",
  botox: "보톡스·필러",
  volume: "볼륨·부스터",
  vitiligo: "백반증",
  psoriasis: "건선·아토피",
  eye: "눈밑지방재배치",
  "백반증": "백반증",
  "리프팅·탄력": "리프팅·탄력",
  "색소·문신": "색소·문신",
  "눈밑지방재배치": "눈밑지방재배치",
  "흉터·모공": "흉터·모공",
  "Best 시술": "Best 시술",
  "여드름": "여드름",
  "홍조·혈관": "홍조·혈관",
  "액취증·다한증": "액취증·다한증",
  "손·발톱무좀": "손·발톱무좀",
  "건선·아토피": "건선·아토피",
  "볼륨·부스터": "볼륨·부스터",
  "보톡스·필러": "보톡스·필러",
};

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "star_pibu",
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("🔄 equipment3 category 업데이트 시작...\n");

    for (const [oldCat, newCat] of Object.entries(categoryMap)) {
      if (oldCat !== newCat) {
        const query = "UPDATE equipment3 SET category = ? WHERE category = ?";
        const [result] = await connection.execute(query, [newCat, oldCat]);
        if (result.affectedRows > 0) {
          console.log(`✅ ${oldCat} → ${newCat} (${result.affectedRows}개 업데이트)`);
        }
      }
    }

    console.log("\n✅ 모든 category 업데이트 완료!");

    // 최종 확인
    const [rows] = await connection.execute("SELECT DISTINCT category FROM equipment3 ORDER BY category");
    console.log("\n📋 최종 category 목록:");
    rows.forEach((row) => {
      console.log(`  - ${row.category}`);
    });
  } catch (error) {
    console.error("❌ 오류:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();

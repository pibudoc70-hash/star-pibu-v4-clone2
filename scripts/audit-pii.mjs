/**
 * 개인정보 테이블 행 수 감사 (최소 버전).
 *
 * 목적: 사용하지 않는 테이블에 데이터가 남아있는지만 확인한다.
 * 원칙: SELECT COUNT(*) 만 실행. 개인정보 값은 조회·출력하지 않는다.
 *
 * 실행: node scripts/audit-pii.mjs
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const TABLES = [
  { name: "guestOtps",        desc: "게스트 OTP (전화번호 + 평문 인증코드)" },
  { name: "reservations",     desc: "예약 (환자명·전화번호·진료항목)" },
  { name: "users",            desc: "회원 (이름·이메일)" },
  { name: "authIdentities",   desc: "외부 인증 연동" },
  { name: "unavailableSlots", desc: "예약 불가 시간대 (개인정보 없음)" },
];

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error("[FATAL] DATABASE_URL is not set");
    process.exit(1);
  }

  const conn = await mysql.createConnection(uri);

  console.log("=".repeat(64));
  console.log("개인정보 테이블 행 수 감사");
  console.log("실행 시각:", new Date().toISOString());
  console.log("=".repeat(64));

  let totalPii = 0;

  for (const t of TABLES) {
    // 테이블 존재 확인
    const [ex] = await conn.query(
      "SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?",
      [t.name],
    );
    if (Number(ex[0].c) === 0) {
      console.log(`\n[${t.name}]  테이블 없음 (이미 삭제됨)`);
      continue;
    }

    // 행 수만 조회 (개인정보 값은 읽지 않음)
    const [cnt] = await conn.query(`SELECT COUNT(*) AS c FROM \`${t.name}\``);
    const rows = Number(cnt[0].c);

    console.log(`\n[${t.name}]  ${t.desc}`);
    console.log(`  행 수: ${rows}`);

    if (rows === 0) {
      console.log("  → 데이터 없음 (안전)");
    } else {
      console.log(`  → 데이터 ${rows}건 존재 (파기 검토 필요)`);
      if (t.name !== "unavailableSlots") totalPii += rows;

      // 생성 시각 범위만 확인 (개인정보 아님)
      try {
        const [d] = await conn.query(
          `SELECT MIN(createdAt) AS oldest, MAX(createdAt) AS newest FROM \`${t.name}\``,
        );
        console.log(`  최초: ${d[0].oldest}  /  최근: ${d[0].newest}`);
      } catch {
        console.log("  (createdAt 컬럼 없음)");
      }
    }
  }

  console.log("\n" + "=".repeat(64));
  if (totalPii === 0) {
    console.log("결과: 개인정보 데이터 0건 — 안전");
  } else {
    console.log(`결과: 개인정보 총 ${totalPii}건 존재 — 파기 검토 필요`);
  }
  console.log("이 스크립트는 데이터를 수정·삭제하지 않았습니다.");
  console.log("=".repeat(64));

  await conn.end();
}

main().catch((e) => {
  console.error("[ERROR]", e.message);
  process.exit(1);
});

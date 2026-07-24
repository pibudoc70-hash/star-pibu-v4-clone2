/**
 * Pretendard 폰트 자동 다운로드.
 *
 * 사용법:
 *   node scripts/download-fonts.mjs
 *
 * 다운로드 대상:
 *   - PretendardVariable.woff2 (variable font, latin + hangul)
 */
import fs from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";

const FONTS_DIR = "client/public/fonts";

// Pretendard 공식 GitHub Release (jsdelivr 원본)
const FONTS = [
  {
    name: "PretendardVariable.woff2",
    url: "https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function downloadOne({ name, url }) {
  const outPath = path.join(FONTS_DIR, name);
  try {
    await fs.access(outPath);
    const stat = await fs.stat(outPath);
    console.log(`  · 이미 존재: ${name} (${(stat.size / 1024).toFixed(1)} KB, 건너뜀)`);
    return;
  } catch {
    /* 없음 → 다운로드 */
  }

  console.log(`  · 다운로드: ${name}`);
  const resp = await fetch(url, { redirect: "follow" });
  if (!resp.ok || !resp.body) {
    throw new Error(`다운로드 실패 (${resp.status}): ${url}`);
  }
  await pipeline(Readable.fromWeb(resp.body), createWriteStream(outPath));
  const stat = await fs.stat(outPath);
  console.log(`    → ${(stat.size / 1024).toFixed(1)} KB`);
}

async function main() {
  await ensureDir(FONTS_DIR);
  console.log(`[download-fonts] ${FONTS.length}개 폰트 파일 확인/다운로드`);
  for (const font of FONTS) {
    await downloadOne(font);
  }
  console.log("[download-fonts] 완료");
}

main().catch((err) => {
  console.error("[download-fonts] 오류:", err);
  process.exit(1);
});

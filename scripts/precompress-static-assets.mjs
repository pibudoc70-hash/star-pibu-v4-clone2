import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { brotliCompressSync, constants } from "node:zlib";

const assetsDirectory = path.resolve(process.cwd(), "dist", "public", "assets");
const COMPRESSIBLE_ASSET = /\.(?:js|css)$/i;

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  }));
  return nested.flat();
}

async function main() {
  const files = (await listFiles(assetsDirectory)).filter((filePath) => COMPRESSIBLE_ASSET.test(filePath));
  let originalBytes = 0;
  let brotliBytes = 0;

  for (const filePath of files) {
    const source = await readFile(filePath);
    const compressed = brotliCompressSync(source, {
      params: {
        [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
        [constants.BROTLI_PARAM_QUALITY]: 9,
      },
    });
    await writeFile(`${filePath}.br`, compressed);
    originalBytes += source.length;
    brotliBytes += compressed.length;
  }

  console.log(`[precompress] Brotli ${files.length} JS/CSS assets: ${originalBytes} B → ${brotliBytes} B`);
}

main().catch((error) => {
  console.error("[precompress] Failed to generate Brotli static assets", error);
  process.exitCode = 1;
});

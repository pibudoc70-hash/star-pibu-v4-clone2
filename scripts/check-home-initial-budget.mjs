import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publicDir = resolve(root, "dist/public");
const assetsDir = resolve(publicDir, "assets");
const html = readFileSync(resolve(publicDir, "index.html"), "utf8");
const budgets = JSON.parse(readFileSync(resolve(root, ".size-limit.json"), "utf8"));
const homeBudget = budgets.find((budget) => budget.name === "홈 초기 총합 (entry + modulepreload)");

if (!homeBudget || typeof homeBudget.limit !== "string") {
  throw new Error("Missing the home initial-transfer budget in .size-limit.json.");
}

const limitMatch = /^(\d+(?:\.\d+)?) KB$/.exec(homeBudget.limit);
if (!limitMatch) {
  throw new Error(`Unsupported home budget format: ${homeBudget.limit}`);
}

const limitBytes = Number(limitMatch[1]) * 1024;
const assetUrls = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?]+\.js)"/g)]
  .map((match) => match[1])
  .filter((asset, index, values) => values.indexOf(asset) === index);

if (assetUrls.length === 0) {
  throw new Error("No JavaScript entry or modulepreload assets were found in dist/public/index.html.");
}

const assetNames = assetUrls.map((asset) => asset.replace("/assets/", ""));
const blockedInitialChunks = assetNames.filter((asset) => /^(page-landings|data-treatments)-/.test(asset));
if (blockedInitialChunks.length > 0) {
  throw new Error(`Deferred route/data chunks leaked into the home initial HTML: ${blockedInitialChunks.join(", ")}`);
}

const entryAsset = assetNames.find((asset) => /^index-[A-Za-z0-9_-]+\.js$/.test(asset));
if (!entryAsset) {
  throw new Error("Could not identify the Home entry asset.");
}

const entrySource = readFileSync(resolve(assetsDir, entryAsset), "utf8");
if (/from"\.\/(?:page-landings|data-treatments)-/.test(entrySource)) {
  throw new Error("Home entry statically imports a deferred landing or treatment-data chunk.");
}

const totalGzipBytes = assetNames.reduce((total, asset) => {
  return total + gzipSync(readFileSync(resolve(assetsDir, asset)), { level: 9 }).length;
}, 0);

if (totalGzipBytes > limitBytes) {
  throw new Error(
    `Home initial gzip transfer is ${totalGzipBytes} bytes, above the ${limitBytes}-byte budget.`,
  );
}

console.log(
  `Home initial gzip transfer: ${totalGzipBytes} bytes across ${assetNames.length} assets (budget: ${limitBytes} bytes).`,
);

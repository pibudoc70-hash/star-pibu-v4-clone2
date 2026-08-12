/**
 * scripts/gen-treatment-seo.mjs
 *
 * 빌드 전처리: client/src/data/treatments/*.ts 를 파싱해
 * server/_generated/treatment-seo.json 으로 저장한다.
 *
 * esbuild 서버 빌드는 @/ alias 를 해석하지 않으므로,
 * 미들웨어가 import 대신 이 JSON 을 읽는다.
 *
 * 추출 필드:
 *   slug, name, nameEn, category, desc, detail, effect, caution,
 *   time, recovery, sessions, seoTitle, seoDescription,
 *   seoKeywords, schemaBodyLocation, faq, image
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TREATMENTS_DIR = path.resolve(ROOT, "client/src/data/treatments");
const OUT_DIR = path.resolve(ROOT, "server/_generated");
const OUT_FILE = path.resolve(OUT_DIR, "treatment-seo.json");

// 슬러그 목록 (등록 순서)
const SLUGS = [
  "ulthera",
  "thermage",
  "under-eye-fat",
  "ulthera-classic",
  "pico-laser",
  "ruby-pico-laser",
  "rosacea",
];

/**
 * TypeScript 객체 리터럴을 JSON 으로 파싱하는 간이 추출기.
 *
 * 전략:
 *   1) 파일 전체를 읽는다.
 *   2) export const <varName> = { ... }; 블록을 추출한다.
 *   3) 블록 내에서 필요한 필드만 정규식으로 추출한다.
 *
 * 완전한 TS 파서가 아니므로, 필드 값이 복잡한 경우(템플릿 리터럴, 함수 등)
 * 단순 문자열 추출로 처리하고 실패 시 빈 문자열을 반환한다.
 */

/** 백틱 템플릿 리터럴 또는 일반 문자열에서 값을 추출 */
function extractStringValue(src, fieldName) {
  // 백틱 멀티라인
  const backtickRe = new RegExp(
    `\\b${fieldName}\\s*:\\s*\`([\\s\\S]*?)\``,
    "m"
  );
  const btMatch = src.match(backtickRe);
  if (btMatch) return btMatch[1].trim();

  // 단일/이중 따옴표 한 줄
  const quoteRe = new RegExp(
    `\\b${fieldName}\\s*:\\s*["']([^"'\\\\]*(\\\\.[^"'\\\\]*)*)["']`,
    "m"
  );
  const qMatch = src.match(quoteRe);
  if (qMatch) return qMatch[1].replace(/\\n/g, "\n").replace(/\\'/g, "'").replace(/\\"/g, '"');

  return "";
}

/** LocalizedString 객체 { ko, en, ja, zh } 추출 */
function extractLocalized(src, fieldName) {
  // fieldName: { ... } 블록 추출
  const blockRe = new RegExp(
    `\\b${fieldName}\\s*:\\s*\\{([\\s\\S]*?)\\}(?=\\s*[,}])`,
    "m"
  );
  const blockMatch = src.match(blockRe);
  if (!blockMatch) {
    // 단순 문자열인 경우 (nameEn 등)
    const sv = extractStringValue(src, fieldName);
    return sv ? { ko: sv, en: sv, ja: sv, zh: sv } : null;
  }

  const block = blockMatch[1];
  const result = {};
  for (const lang of ["ko", "en", "ja", "zh"]) {
    result[lang] = extractStringValue(block, lang) || "";
  }
  return result;
}

/**
 * faq 필드 추출 — { ko: [...], en: [...], ja: [...], zh: [...] }
 * 각 항목은 { question, answer } 또는 { q, a }
 */
function extractFaq(src) {
  // faq: { ... } 블록 전체 추출 (중첩 중괄호 처리)
  const faqStart = src.indexOf("faq:");
  if (faqStart === -1) return null;

  // faq: { 에서 시작해 중첩 깊이 추적
  let depth = 0;
  let start = -1;
  let end = -1;
  for (let i = faqStart; i < src.length; i++) {
    if (src[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (start === -1 || end === -1) return null;

  const faqBlock = src.slice(start, end);

  const result = {};
  for (const lang of ["ko", "en", "ja", "zh"]) {
    // lang: [ ... ] 배열 추출
    const arrRe = new RegExp(`\\b${lang}\\s*:\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, "m");
    const arrMatch = faqBlock.match(arrRe);
    if (!arrMatch) { result[lang] = []; continue; }

    const arrContent = arrMatch[1];
    // { question/q: "...", answer/a: "..." } 항목 추출
    const items = [];
    const itemRe = /\{([^{}]*)\}/g;
    let itemMatch;
    while ((itemMatch = itemRe.exec(arrContent)) !== null) {
      const item = itemMatch[1];
      const q = extractStringValue(item, "question") || extractStringValue(item, "q");
      const a = extractStringValue(item, "answer") || extractStringValue(item, "a");
      if (q && a) items.push({ question: q, answer: a });
    }
    result[lang] = items;
  }
  return result;
}

function processSlug(slug) {
  const filePath = path.resolve(TREATMENTS_DIR, `${slug}.ts`);
  if (!fs.existsSync(filePath)) {
    console.warn(`[gen-treatment-seo] WARN: ${slug}.ts not found, skipping`);
    return null;
  }

  const src = fs.readFileSync(filePath, "utf8");

  const record = {
    slug,
    nameEn: extractStringValue(src, "nameEn") || slug,
    name: extractLocalized(src, "name"),
    category: extractLocalized(src, "category"),
    desc: extractLocalized(src, "desc"),
    detail: extractLocalized(src, "detail"),
    effect: extractLocalized(src, "effect"),
    caution: extractLocalized(src, "caution"),
    time: extractLocalized(src, "time"),
    recovery: extractLocalized(src, "recovery"),
    sessions: extractLocalized(src, "sessions"),
    seoTitle: extractLocalized(src, "seoTitle"),
    seoDescription: extractLocalized(src, "seoDescription"),
    seoKeywords: extractLocalized(src, "seoKeywords"),
    schemaBodyLocation: extractLocalized(src, "schemaBodyLocation"),
    image: extractStringValue(src, "image") || "",
    faq: extractFaq(src),
  };

  return record;
}

function main() {
  console.log("[gen-treatment-seo] Extracting treatment SEO data...");

  const data = {};
  for (const slug of SLUGS) {
    const record = processSlug(slug);
    if (record) {
      data[slug] = record;
      console.log(`  ✓ ${slug}: seoTitle.ko="${(record.seoTitle?.ko || "").slice(0, 30)}..."`);
    }
  }

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2), "utf8");
  console.log(`[gen-treatment-seo] Written: ${OUT_FILE} (${Object.keys(data).length} treatments)`);
}

main();

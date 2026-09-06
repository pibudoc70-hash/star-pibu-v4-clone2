import { mkdir, writeFile } from "node:fs/promises";

const baseUrl = "https://star-pibu.com";
const slug = "ulthera";
const targets = [
  { locale: "ko", language: "ko", path: `/treatments/${slug}` },
  { locale: "en", language: "en", path: `/en/treatments/${slug}` },
  { locale: "ja", language: "ja", path: `/ja/treatments/${slug}` },
  { locale: "zh", language: "zh", path: `/zh/treatments/${slug}` },
  { locale: "zh-TW", language: "zh-TW", path: `/zh-tw/treatments/${slug}` },
];

function collectMedicalProcedures(value, results = []) {
  if (Array.isArray(value)) value.forEach((item) => collectMedicalProcedures(item, results));
  else if (value && typeof value === "object") {
    if (value["@type"] === "MedicalProcedure") results.push(value);
    Object.values(value).forEach((item) => collectMedicalProcedures(item, results));
  }
  return results;
}

function parseJsonLd(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return scripts.flatMap((match) => {
    try { return [JSON.parse(match[1])]; } catch { return []; }
  });
}

const rows = [];
for (const target of targets) {
  const response = await fetch(`${baseUrl}${target.path}`, { redirect: "follow" });
  const html = await response.text();
  const allProcedures = parseJsonLd(html).flatMap((schema) => collectMedicalProcedures(schema));
  const procedures = allProcedures.filter((candidate) => candidate.url === `${baseUrl}${target.path}`);
  const procedure = procedures[0] ?? {};
  const followup = typeof procedure.followup === "string" ? procedure.followup.trim() : "";
  rows.push({
    locale: target.locale,
    url: `${baseUrl}${target.path}`,
    httpStatus: response.status,
    pageMedicalProcedureCount: procedures.length,
    clinicCatalogMedicalProcedureCount: allProcedures.length - procedures.length,
    providerId: procedure.provider?.["@id"] ?? null,
    imageIsAbsoluteHttps: typeof procedure.image === "string" && procedure.image.startsWith("https://"),
    urlMatchesLocale: procedure.url === `${baseUrl}${target.path}`,
    inLanguageMatchesLocale: procedure.inLanguage === target.language,
    hasUnsupportedStatus: Object.hasOwn(procedure, "status"),
    hasFollowup: followup.length > 0,
    hasKoreanInitialLoadingCopy: html.includes("콘텐츠를 불러오는 중입니다"),
    valid: response.ok && procedures.length === 1 && procedure.provider?.["@id"] === `${baseUrl}/#organization` &&
      typeof procedure.image === "string" && procedure.image.startsWith("https://") &&
      procedure.url === `${baseUrl}${target.path}` && procedure.inLanguage === target.language &&
      !Object.hasOwn(procedure, "status") && followup.length > 0 &&
      (target.locale === "ko" || !html.includes("콘텐츠를 불러오는 중입니다")),
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  scope: "Public raw HTML only; no database reads or writes.",
  treatment: slug,
  criteria: ["one page-URL-matching MedicalProcedure", "organization provider @id", "absolute HTTPS image", "locale URL", "locale inLanguage", "no status", "nonempty followup", "no Korean initial loading label outside ko"],
  rows,
  passed: rows.every((row) => row.valid),
};

await mkdir("reports", { recursive: true });
await writeFile("reports/locale-medicalprocedure-raw-audit.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));

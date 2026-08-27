/** DB 기반 /equipment3/:slug 상세 페이지의 크롤러용 본문 프리렌더링. */
import type { Express, NextFunction, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { getEquipment3BySlug } from "../db/equipment3";
import type { Equipment3Item } from "../../drizzle/schema";
import { injectPageSeoMeta } from "./seoMeta";
import { LIFTING_ANESTHESIA_PREPARATION, LIFTING_DIRECT_CARE_DESCRIPTION, LIFTING_FAQS, isPainSensitiveLifting } from "../../shared/liftingPositioning";
import { getLocalizedEquipmentFaqs } from "../../shared/equipmentFaq";
import { EQUIPMENT_DETAIL_QUOTES } from "../../shared/equipmentDetailQuote";

const BASE_URL = "https://star-pibu.com";
// 관리자에서 상세 정보를 수정할 수 있으므로 장비 페이지는 홈보다 짧은 공유 캐시를 사용한다.
export const EQUIPMENT_PRERENDER_CACHE_CONTROL = "public, max-age=0, s-maxage=60, stale-while-revalidate=120";
type Lang = "ko" | "en" | "ja" | "zh" | "zh-TW";

let cachedHtml: string | null = null;

const CLINIC_AND_PHYSICIAN = [
  {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${BASE_URL}/#organization`,
    name: "스타피부과",
    url: BASE_URL,
    telephone: "+82-51-818-2300",
    medicalSpecialty: "Dermatology",
    address: { "@type": "PostalAddress", streetAddress: "서면로 74 아이온시티빌딩 4층", addressLocality: "부산진구", addressRegion: "부산광역시", postalCode: "47280", addressCountry: "KR" },
    geo: { "@type": "GeoCoordinates", latitude: 35.1579, longitude: 129.0597 },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "19:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:30", closes: "15:00" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${BASE_URL}/#physician-cho-si-hyung`,
    name: "조시형",
    alternateName: "Cho Si-hyung",
    jobTitle: "피부과 전문의 · 의학박사",
    description: `20년 이상의 임상 경험을 보유한 피부과 전문의이며 써마지 FLX 공식 자문의로 활동 중입니다. ${LIFTING_DIRECT_CARE_DESCRIPTION}`,
    medicalSpecialty: "Dermatology",
    knowsAbout: ["리프팅 시술", "통증 관리"],
    memberOf: ["대한피부과학회", "대한피부과의사회", "미국피부과학회(AAD)"].map((name) => ({ "@type": "MedicalOrganization", name })),
    worksFor: { "@id": `${BASE_URL}/#organization` },
  },
] as const;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertHeadTag(html: string, matcher: RegExp, markup: string): string {
  if (matcher.test(html)) return html.replace(matcher, markup);
  return html.replace("</head>", `    ${markup}\n  </head>`);
}

function upsertMetaTag(html: string, attribute: "name" | "property", value: string, markup: string): string {
  const matcher = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}\\s*=\\s*["']${escapeRegExp(value)}["'])[^>]*\\/?>(?:\\s*)`,
    "i",
  );
  return upsertHeadTag(html, matcher, markup);
}

function imageMimeType(url: string): string {
  const pathname = url.split("?")[0]?.toLowerCase() ?? "";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".gif")) return "image/gif";
  return "image/png";
}

function parsePath(pathname: string): { lang: Lang; slug: string } | null {
  const match = pathname.match(/^\/(?:(en|ja|zh|zh-tw)\/)?equipment3\/([^/?#]+)\/?$/);
  if (!match) return null;
  const lang = match[1] === "en" || match[1] === "ja" || match[1] === "zh" ? match[1] : match[1] === "zh-tw" ? "zh-TW" : "ko";
  try {
    const slug = decodeURIComponent(match[2]);
    return !slug || slug.length > 200 || slug.includes("/") || slug.includes("..") ? null : { lang, slug };
  } catch {
    return null;
  }
}

function localized(item: Equipment3Item, base: "name" | "desc" | "detail" | "effect" | "caution" | "sessions" | "time" | "recovery" | "category", lang: Lang): string {
  const suffix = lang === "en" ? "En" : lang === "ja" ? "Ja" : lang === "zh-TW" ? "ZhTw" : lang === "zh" ? "Zh" : "";
  const localizedKey = `${base}${suffix}` as keyof Equipment3Item;
  const localizedValue = item[localizedKey];
  if (typeof localizedValue === "string" && localizedValue.trim()) return localizedValue;
  if (lang === "zh-TW") {
    const simplifiedValue = item[`${base}Zh` as keyof Equipment3Item];
    if (typeof simplifiedValue === "string" && simplifiedValue.trim()) return simplifiedValue;
  }
  const fallback = item[base];
  return typeof fallback === "string" ? fallback : "";
}

function labels(lang: Lang) {
  const all: Record<Lang, Record<string, string>> = {
    ko: { overview: "시술 설명", target: "적합한 대상", duration: "효과 지속 기간", time: "시술 소요 시간", recovery: "회복 기간", caution: "부작용·주의사항", sessions: "권장 횟수·간격", faq: "자주 묻는 질문" },
    en: { overview: "What it is", target: "Who it may suit", duration: "Effect duration", time: "Treatment time", recovery: "Recovery time", caution: "Side effects and precautions", sessions: "Recommended sessions and interval", faq: "Frequently Asked Questions" },
    ja: { overview: "施術説明", target: "適した方", duration: "効果の持続", time: "施術時間", recovery: "回復期間", caution: "副作用・注意事項", sessions: "推奨回数・間隔", faq: "よくある質問" },
    zh: { overview: "治疗说明", target: "适合人群", duration: "效果持续时间", time: "治疗所需时间", recovery: "恢复期", caution: "副作用与注意事项", sessions: "建议次数与间隔", faq: "常见问题" },
    "zh-TW": { overview: "療程說明", target: "適合對象", duration: "效果持續時間", time: "療程所需時間", recovery: "恢復期", caution: "副作用與注意事項", sessions: "建議次數與間隔", faq: "常見問題" },
  };
  return all[lang];
}

function loadIndexHtml(): string | null {
  if (cachedHtml) return cachedHtml;
  for (const candidate of [path.resolve(process.cwd(), "dist/public/index.html"), path.resolve(process.cwd(), "client/index.html")]) {
    try {
      cachedHtml = fs.readFileSync(candidate, "utf8");
      return cachedHtml;
    } catch {
      // 다음 후보 확인
    }
  }
  return null;
}

export function buildEquipmentPrerenderedHtml(template: string, item: Equipment3Item, lang: Lang, pathName: string): string {
  const text = labels(lang);
  const name = localized(item, "name", lang);
  const detail = localized(item, "detail", lang) || localized(item, "desc", lang);
  const seoTitle = item.seoTitle?.trim() || `${name} | 스타피부과`;
  const seoDescription = item.seoDescription?.trim() || localized(item, "desc", lang);
  const seoKeywords = item.seoKeywords?.trim() || [name, item.nameEn, "부산피부과", "서면피부과", "스타피부과"].filter(Boolean).join(", ");
  const effect = localized(item, "effect", lang);
  const duration = localized(item, "sessions", lang) || "개인 피부 상태와 시술 범위에 따라 의료진 상담 후 안내합니다.";
  const target = effect ? `${effect} 개선을 원하는 분은 의료진 상담을 통해 적합성을 확인할 수 있습니다.` : "개인 피부 상태와 고민에 따라 의료진 상담을 통해 적합성을 확인할 수 있습니다.";
  const rows = [
    [text.overview, detail], [text.target, target], [text.duration, duration], [text.time, localized(item, "time", lang)],
    [text.recovery, localized(item, "recovery", lang)], [text.caution, localized(item, "caution", lang)], [text.sessions, localized(item, "sessions", lang)],
  ].filter(([, value]) => value);
  const canonical = `${BASE_URL}${pathName}`;
  const ogImage = item.ogImageUrl?.trim() || item.imageUrl || "";
  const hasLiftingPainCare = isPainSensitiveLifting(item.slug) || isPainSensitiveLifting(item.name);
  const managedFaqs = getLocalizedEquipmentFaqs(item, lang);
  const positioningFaqs = hasLiftingPainCare && managedFaqs.length === 0 ? LIFTING_FAQS[lang] : [];
  const allFaqs = [...managedFaqs, ...positioningFaqs];
  const detailQuote = EQUIPMENT_DETAIL_QUOTES[lang];
  const procedure = {
    "@context": "https://schema.org", "@type": "MedicalProcedure", "@id": `${canonical}#medical-procedure`, name, alternateName: item.nameEn || item.name,
    description: localized(item, "desc", lang), procedureType: "https://schema.org/CosmeticProcedure", image: item.imageUrl || "", url: canonical,
    preparation: hasLiftingPainCare ? LIFTING_ANESTHESIA_PREPARATION[lang] : localized(item, "caution", lang), followup: localized(item, "recovery", lang), howPerformed: detail,
    duration: localized(item, "time", lang), provider: { "@id": `${BASE_URL}/#medical-clinic` }, relevantSpecialty: "https://schema.org/Dermatology",
  };
  const faqSchema = allFaqs.length > 0 ? { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${canonical}#faq`, mainEntity: allFaqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) } : null;
  const jsonLd = JSON.stringify([...CLINIC_AND_PHYSICIAN, procedure, ...(faqSchema ? [faqSchema] : [])]).replace(/</g, "\\u003c");
  const faqBody = allFaqs.length > 0 ? `<section><h2>${escapeHtml(text.faq)}</h2><dl>${allFaqs.map(({ question, answer }) => `<dt>${escapeHtml(question)}</dt><dd>${escapeHtml(answer)}</dd>`).join("")}</dl></section>` : "";
  const quoteBody = `<aside><h2>${escapeHtml(detailQuote.heading)}</h2><dl><dt>${escapeHtml(detailQuote.locationLabel)}</dt><dd>${escapeHtml(detailQuote.location)}</dd><dt>${escapeHtml(detailQuote.hoursLabel)}</dt><dd>${escapeHtml(detailQuote.hours)}</dd><dt>${escapeHtml(detailQuote.providerLabel)}</dt><dd>${escapeHtml(detailQuote.provider)}</dd><dt>${escapeHtml(detailQuote.painManagementLabel)}</dt><dd>${escapeHtml(detailQuote.painManagement)}</dd></dl></aside>`;
  const body = `<main id="crawler-content" lang="${lang}"><article><header><h1>${escapeHtml(name)}</h1><p>${escapeHtml(localized(item, "desc", lang))}</p></header><section><h2>${escapeHtml(text.overview)}</h2><table><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("\n")}</tbody></table></section>${faqBody}${quoteBody}<footer><p>부산 서면 스타피부과 · 부산광역시 부산진구 서면로 74 아이온시티빌딩 4층 · 051-818-2300</p></footer></article></main>`;

  let rendered = upsertHeadTag(template, /<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-rh="true">${escapeHtml(seoTitle)}</title>`);
  rendered = upsertMetaTag(rendered, "name", "description", `<meta data-rh="true" name="description" content="${escapeHtml(seoDescription)}" />`);
  rendered = upsertMetaTag(rendered, "name", "keywords", `<meta data-rh="true" name="keywords" content="${escapeHtml(seoKeywords)}" />`);
  rendered = upsertMetaTag(rendered, "property", "og:title", `<meta data-rh="true" property="og:title" content="${escapeHtml(seoTitle)}" />`);
  rendered = upsertMetaTag(rendered, "property", "og:description", `<meta data-rh="true" property="og:description" content="${escapeHtml(seoDescription)}" />`);
  rendered = upsertMetaTag(rendered, "property", "og:url", `<meta data-rh="true" property="og:url" content="${canonical}" />`);
  rendered = upsertMetaTag(rendered, "name", "twitter:title", `<meta data-rh="true" name="twitter:title" content="${escapeHtml(seoTitle)}" />`);
  rendered = upsertMetaTag(rendered, "name", "twitter:description", `<meta data-rh="true" name="twitter:description" content="${escapeHtml(seoDescription)}" />`);
  if (ogImage) {
    const escapedImage = escapeHtml(ogImage);
    rendered = upsertMetaTag(rendered, "property", "og:image", `<meta data-rh="true" property="og:image" content="${escapedImage}" />`);
    rendered = upsertMetaTag(rendered, "property", "og:image:secure_url", `<meta data-rh="true" property="og:image:secure_url" content="${escapedImage}" />`);
    rendered = upsertMetaTag(rendered, "property", "og:image:type", `<meta data-rh="true" property="og:image:type" content="${imageMimeType(ogImage)}" />`);
    rendered = upsertMetaTag(rendered, "name", "twitter:image", `<meta data-rh="true" name="twitter:image" content="${escapedImage}" />`);
  }
  rendered = rendered
    .replace(/\sdata-seo-fallback=(["'])home\1/gi, "")
    .replace("</head>", `    <script type="application/ld+json" data-prerender="equipment-medical">${jsonLd}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return injectPageSeoMeta(rendered, pathName);
}

export function registerEquipmentPrerender(app: Express): void {
  app.get(["/equipment3/:slug", "/:lang/equipment3/:slug"], async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "production") return next();
    try {
      const parsed = parsePath(req.path);
      const template = parsed ? loadIndexHtml() : null;
      const item = parsed ? await getEquipment3BySlug(parsed.slug) : undefined;
      if (!parsed || !template || !item || item.isActive !== "1") return next();
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", EQUIPMENT_PRERENDER_CACHE_CONTROL);
      res.send(buildEquipmentPrerenderedHtml(template, item, parsed.lang, req.path));
    } catch (error) {
      console.error("[EquipmentPrerender] failed:", error instanceof Error ? error.message : error);
      next();
    }
  });
}

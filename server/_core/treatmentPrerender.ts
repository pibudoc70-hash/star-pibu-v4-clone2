/**
 * server/_core/treatmentPrerender.ts
 *
 * [Step61] 시술 페이지 서버 HTML 주입 — 네이버·AI 크롤러 대응
 *
 * Express 미들웨어가 기존 index.html 의 홈 메타를 시술 메타로 "치환"해 내보낸다.
 * 새 패키지 0개, React 코드 무변경.
 *
 * 핵심 안전장치:
 *   ① 주입 메타에 data-rh="true" → react-helmet-async 가 하이드레이션 시 교체
 *   ② 본문은 React root 안에 미리 주입하고, 클라이언트 React가 기존 화면을 그대로 렌더링한다.
 *   ③ 모든 실패 경로에서 next() → 어떤 경우에도 사이트가 깨지지 않음
 *
 * 데이터 소스: server/_generated/treatment-seo.json
 *   (빌드 전처리 scripts/gen-treatment-seo.mjs 가 생성)
 */

import type { Express, Request, Response, NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";
import { injectPageSeoMeta } from "./seoMeta";
import { LIFTING_ANESTHESIA_PREPARATION, LIFTING_FAQS, isPainSensitiveLifting } from "../../shared/liftingPositioning";
import { buildClinicJsonLd } from "../../client/src/lib/seoHelpers";

// ── 타입 정의 ────────────────────────────────────────────────────────────────

const SUPPORTED_LANGS = ["ko", "en", "ja", "zh", "zh-TW"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

interface LocalizedString {
  ko: string;
  en: string;
  ja: string;
  zh: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface LocalizedFaq {
  ko: FaqItem[];
  en: FaqItem[];
  ja: FaqItem[];
  zh: FaqItem[];
}

interface TreatmentSeoRecord {
  slug: string;
  nameEn: string;
  name: LocalizedString;
  category: LocalizedString | null;
  desc: LocalizedString;
  detail: LocalizedString;
  effect: LocalizedString | null;
  caution: LocalizedString | null;
  time: LocalizedString | null;
  recovery: LocalizedString | null;
  sessions: LocalizedString | null;
  seoTitle: LocalizedString;
  seoDescription: LocalizedString;
  seoKeywords: LocalizedString;
  schemaBodyLocation: LocalizedString | null;
  image: string;
  faq: LocalizedFaq | null;
}

// ── 상수 ─────────────────────────────────────────────────────────────────────

const BASE_URL = "https://star-pibu.com";

const BREADCRUMB_LABELS: Record<Lang, { home: string; treatments: string }> = {
  ko: { home: "홈", treatments: "시술·장비소개" },
  en: { home: "Home", treatments: "Treatments" },
  ja: { home: "ホーム", treatments: "施術・機器紹介" },
  zh: { home: "首页", treatments: "治疗与设备" },
  "zh-TW": { home: "首頁", treatments: "療程與設備" },
};

const LEGACY_TREATMENT_REDIRECTS: Readonly<Record<string, string>> = {
  "울쎄라": "/treatments/ulthera-classic",
  "울쎄라피 프라임": "/treatments/ulthera",
};

export function getLegacyTreatmentRedirectPath(name: string): string | null {
  try {
    return LEGACY_TREATMENT_REDIRECTS[decodeURIComponent(name)] ?? null;
  } catch {
    return LEGACY_TREATMENT_REDIRECTS[name] ?? null;
  }
}

/** Structured data에는 상대 경로 대신 crawler-resolvable HTTPS image URL을 사용한다. */
export function toAbsoluteTreatmentImageUrl(image: string): string {
  return image.startsWith("https://") ? image : new URL(image, BASE_URL).toString();
}

// ── 데이터 로딩 ───────────────────────────────────────────────────────────────

let cachedData: Record<string, TreatmentSeoRecord> | null = null;

function loadTreatmentData(): Record<string, TreatmentSeoRecord> | null {
  if (cachedData) return cachedData;
  const candidates = [
    path.resolve(process.cwd(), "server/_generated/treatment-seo.json"),
    path.resolve(process.cwd(), "dist/server/_generated/treatment-seo.json"),
    path.resolve(process.cwd(), "_generated/treatment-seo.json"),
  ];
  for (const p of candidates) {
    try {
      const raw = fs.readFileSync(p, "utf8");
      cachedData = JSON.parse(raw) as Record<string, TreatmentSeoRecord>;
      return cachedData;
    } catch {
      /* 다음 후보 */
    }
  }
  // [Step65-C] 이 파일이 없으면 모든 시술 페이지가 홈 메타로 되돌아간다.
  // 조용히 넘어가면 SEO가 통째로 꺼진 것을 알 수 없으므로 error로 남긴다.
  console.error(
    "[TreatmentPrerender][CRITICAL] treatment-seo.json not found — " +
    "all treatment pages will fall back to home meta. " +
    "Check that scripts/gen-treatment-seo.mjs ran during build.",
  );
  return null;
}

// ── index.html 캐시 ──────────────────────────────────────────────────────────

let cachedHtml: string | null = null;

function loadIndexHtml(): string | null {
  const isDev = process.env.NODE_ENV !== "production";

  // [Step65-C] 개발 환경에서는 캐시하지 않고 매번 client/index.html을 읽는다.
  // 이전 빌드의 dist/public/index.html이 남아 있으면 낡은 HTML이 영구 캐싱되어,
  // index.html을 수정해도 시술 페이지에만 반영되지 않는 문제가 있었다.
  const candidates = isDev
    ? [path.resolve(process.cwd(), "client/index.html")]
    : [
        path.resolve(process.cwd(), "dist/public/index.html"),
        path.resolve(process.cwd(), "client/index.html"),
      ];

  if (!isDev && cachedHtml) return cachedHtml;

  for (const p of candidates) {
    try {
      const html = fs.readFileSync(p, "utf8");
      if (!isDev) cachedHtml = html;
      return html;
    } catch {
      /* 다음 후보 */
    }
  }
  console.warn("[TreatmentPrerender] index.html not found — prerender disabled");
  return null;
}

// ── 유틸 ─────────────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** LocalizedString 에서 언어값을 뽑는다 (pickLocalized 와 동일 규칙) */
function pick(v: LocalizedString | null | undefined, lang: Lang): string {
  if (!v) return "";
  return lang === "zh-TW" ? v.zh ?? v.ko ?? "" : v[lang] ?? v.ko ?? "";
}

function pickFaq(t: TreatmentSeoRecord, lang: Lang): FaqItem[] {
  const baseLang: keyof LocalizedFaq = lang === "zh-TW" ? "zh" : lang as keyof LocalizedFaq;
  return t.faq?.[baseLang] ?? t.faq?.ko ?? [];
}

/** 경로에서 언어·slug 추출. 실패 시 null */
function parsePath(p: string): { lang: Lang; slug: string } | null {
  const m = p.match(/^\/(?:(en|ja|zh|zh-tw)\/)?treatments\/([^/?#]+)\/?$/);
  if (!m) return null;
  const lang = m[1] === "zh-tw" ? "zh-TW" : (m[1] ?? "ko") as Lang;
  let slug: string;
  try {
    slug = decodeURIComponent(m[2]);
  } catch {
    return null;
  }
  if (!slug || slug.length > 100 || slug.includes("..") || slug.includes("/")) return null;
  return { lang, slug };
}

// ── 메타 치환 ─────────────────────────────────────────────────────────────────

/**
 * index.html 의 홈 메타를 시술 메타로 치환한다.
 * 치환 대상 6개 + twitter 2개 = 8개 태그.
 * data-rh="true" 를 붙여 react-helmet-async 가 하이드레이션 시 재교체하도록 한다.
 */
export function injectTreatmentMeta(
  html: string,
  t: TreatmentSeoRecord,
  lang: Lang,
  slug: string
): string {
  const title = pick(t.seoTitle, lang);
  const desc = pick(t.seoDescription, lang);
  const kw = pick(t.seoKeywords, lang);
  const canonical =
    lang === "ko"
      ? `${BASE_URL}/treatments/${slug}`
      : `${BASE_URL}/${lang === "zh-TW" ? "zh-tw" : lang}/treatments/${slug}`;

  const et = escapeHtml(title);
  const ed = escapeHtml(desc);
  const ek = escapeHtml(kw);

  // [Step61-A] 홈 기본 메타를 시술 메타로 치환. data-rh 로 helmet 이 하이드레이션 시 교체.
  return html
    .replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title data-rh="true">${et}</title>`
    )
    .replace(
      /<meta\b(?=[^>]*\bname="description")[^>]*\/?>/i,
      `<meta data-rh="true" name="description" content="${ed}" />`
    )
    .replace(
      /<meta\b(?=[^>]*\bname="keywords")[^>]*\/?>/i,
      `<meta data-rh="true" name="keywords" content="${ek}" />`
    )
    .replace(
      /<link\b(?=[^>]*\brel="canonical")[^>]*\/?>/i,
      `<link data-rh="true" rel="canonical" href="${canonical}" />`
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty="og:title")[^>]*\/?>/i,
      `<meta data-rh="true" property="og:title" content="${et}" />`
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty="og:description")[^>]*\/?>/i,
      `<meta data-rh="true" property="og:description" content="${ed}" />`
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty="og:url")[^>]*\/?>/i,
      `<meta data-rh="true" property="og:url" content="${canonical}" />`
    )
    .replace(
      /<meta\b(?=[^>]*\bname="twitter:title")[^>]*\/?>/i,
      `<meta data-rh="true" name="twitter:title" content="${et}" />`
    )
    .replace(
      /<meta\b(?=[^>]*\bname="twitter:description")[^>]*\/?>/i,
      `<meta data-rh="true" name="twitter:description" content="${ed}" />`
    )
    // [Step61b-B] 카카오톡 공유 카드. 환자들이 카톡으로 링크를 많이 공유하므로
    // 홈 제목이 아니라 시술 제목이 나와야 한다.
    .replace(
      /<meta\b(?=[^>]*\bproperty="kakao:title")[^>]*\/?>/i,
      `<meta data-rh="true" property="kakao:title" content="${et}" />`
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty="kakao:description")[^>]*\/?>/i,
      `<meta data-rh="true" property="kakao:description" content="${ed}" />`
    )
    // [Step61b-B] og:image / kakao:image / twitter:image — 시술 이미지가 있으면 절대 URL 로 변환 후 치환
    // t.image 는 /api/storage/... 형태의 상대경로이므로 BASE_URL 을 붙인다.
    // 이미지가 없으면 치환하지 않아 홈 이미지가 그대로 유지된다.
    .replace(
      /<meta\b(?=[^>]*\bproperty="og:image")[^>]*\/?>/i,
      t.image
        ? `<meta data-rh="true" property="og:image" content="${t.image.startsWith('http') ? t.image : BASE_URL + t.image}" />`
        : "$&"
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty="kakao:image")[^>]*\/?>/i,
      t.image
        ? `<meta data-rh="true" property="kakao:image" content="${t.image.startsWith('http') ? t.image : BASE_URL + t.image}" />`
        : "$&"
    )
    // [Step62-A] og:image 부가 태그를 실제 시술 이미지에 맞게 치환한다.
    // twitter:image 치환은 [Step68-B3] 블록에서 twitter:image:alt 삽입과 함께 통합 처리한다.
    // 이미지 경로가 /api/storage/... 원격 URL 이라 로컈 파일에서 sharp 로 크기를 읽을 수 없다.
    // 따라서 A-3 에서 width/height 는 제거한다 (잘못된 값보다 없는 편이 낙다).
    // og:image / kakao:image / twitter:image 는 반드시 PNG/JPEG 유지 (카카오톡·페이스북 WebP 지원 불안정).
    .replace(
      /<meta\b(?=[^>]*\bproperty="og:image:type")[^>]*\/?>/i,
      t.image
        ? (() => {
            const imgType = t.image.endsWith(".webp") ? "image/webp"
                          : t.image.endsWith(".png")  ? "image/png"
                          : t.image.endsWith(".jpg") || t.image.endsWith(".jpeg") ? "image/jpeg"
                          : "image/png";
            return `<meta data-rh="true" property="og:image:type" content="${imgType}" />`;
          })()
        : "$&"
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty="og:image:alt")[^>]*\/?>/i,
      t.image
        ? (() => {
            // [Step68-B2] seoTitle 의 " | " 앞부분만 사용해 시술별 alt 생성
            const rawTitle = pick(t.seoTitle, lang);
            const treatmentLabel = rawTitle.split(" | ")[0].trim() || pick(t.name, lang);
            return `<meta data-rh="true" property="og:image:alt" content="${escapeHtml(treatmentLabel)} 시술 안내 - 부산 서면 스타피부과" />`;
          })()
        : "$&"
    )
    // [Step68-B3] twitter:image:alt 동일 값으로 설정 (인덱스.html에 없으므로 삽입 방식 사용)
    // twitter:image 태그 내용을 twitter:image + twitter:image:alt 로 확장
    .replace(
      /<meta\b(?=[^>]*\bname="twitter:image")[^>]*\/?>/i,
      t.image
        ? (() => {
            const rawTitle = pick(t.seoTitle, lang);
            const treatmentLabel = rawTitle.split(" | ")[0].trim() || pick(t.name, lang);
            const imgUrl = t.image.startsWith('http') ? t.image : BASE_URL + t.image;
            return [
              `<meta data-rh="true" name="twitter:image" content="${imgUrl}" />`,
              `<meta data-rh="true" name="twitter:image:alt" content="${escapeHtml(treatmentLabel)} 시술 안내 - 부산 서면 스타피부과" />`,
            ].join("\n    ");
          })()
        : "$&"
    )
    // [Step62-A3] 실제 크기를 알 수 없으므로 잘못된 홈 배경(1200×630) 값을 제거한다.
    // 플랫폼이 이미지 파일에서 직접 크기를 읽는다. 시술 페이지 응답에서만 제거되며 홈 index.html 은 건드리지 않는다.
    .replace(/<meta\b(?=[^>]*\bproperty="og:image:width")[^>]*\/?>/i, t.image ? "" : "$&")
    .replace(/<meta\b(?=[^>]*\bproperty="og:image:height")[^>]*\/?>/i, t.image ? "" : "$&")
    // [Step61b-C] hreflang 을 시술 페이지 기준으로 재작성.
    // 기존 5줄(ko/en/ja/zh/x-default)을 통째로 치환한다.
    .replace(
      /<link\s+rel="alternate"\s+hreflang="ko"[^>]*\/?>([\s\S]*?)<link\s+rel="alternate"\s+hreflang="x-default"[^>]*\/?>/i,
      [
        `<link data-rh="true" rel="alternate" hreflang="ko" href="${BASE_URL}/treatments/${slug}" />`,
        `<link data-rh="true" rel="alternate" hreflang="en" href="${BASE_URL}/en/treatments/${slug}" />`,
        `<link data-rh="true" rel="alternate" hreflang="ja" href="${BASE_URL}/ja/treatments/${slug}" />`,
        `<link data-rh="true" rel="alternate" hreflang="zh" href="${BASE_URL}/zh/treatments/${slug}" />`,
        `<link data-rh="true" rel="alternate" hreflang="zh-TW" href="${BASE_URL}/zh-tw/treatments/${slug}" />`,
        `<link data-rh="true" rel="alternate" hreflang="x-default" href="${BASE_URL}/treatments/${slug}" />`,
      ].join("\n    ")
    );
}

function getTableLabels(lang: Lang) {
  const labels: Record<Lang, Record<string, string>> = {
    ko: { description: "시술 설명", target: "적합한 대상", duration: "효과 지속 기간", recovery: "회복 기간", caution: "부작용·주의사항", time: "시술 소요 시간", sessions: "권장 횟수·간격", faq: "자주 묻는 질문" },
    en: { description: "What it is", target: "Who it may suit", duration: "Effect duration", recovery: "Recovery time", caution: "Side effects and precautions", time: "Treatment time", sessions: "Recommended sessions and interval", faq: "Frequently Asked Questions" },
    ja: { description: "施術説明", target: "適した方", duration: "効果の持続", recovery: "回復期間", caution: "副作用・注意事項", time: "施術時間", sessions: "推奨回数・間隔", faq: "よくある質問" },
    zh: { description: "治疗说明", target: "适合人群", duration: "效果持续时间", recovery: "恢复期", caution: "副作用与注意事项", time: "治疗所需时间", sessions: "建议次数与间隔", faq: "常见问题" },
    "zh-TW": { description: "療程說明", target: "適合對象", duration: "效果持續時間", recovery: "恢復期", caution: "副作用與注意事項", time: "療程所需時間", sessions: "建議次數與間隔", faq: "常見問題" },
  };
  return labels[lang];
}

function findDuration(t: TreatmentSeoRecord, lang: Lang): string {
  const list = pickFaq(t, lang);
  const keywords: Record<Lang, string[]> = {
    ko: ["지속", "언제부터"], en: ["how long", "when will"], ja: ["持続", "いつから"], zh: ["持续", "何时"], "zh-TW": ["持續", "何時"],
  };
  const match = list.find((item) => keywords[lang].some((keyword) => item.question.toLowerCase().includes(keyword)));
  return match?.answer || pick(t.sessions, lang) || "개인 피부 상태와 시술 범위에 따라 의료진 상담 후 안내합니다.";
}

function buildStructuredBody(t: TreatmentSeoRecord, lang: Lang): string {
  const labels = getTableLabels(lang);
  const effect = pick(t.effect, lang);
  const target = effect
    ? `${effect} 개선을 원하는 분은 의료진 상담을 통해 적합성을 확인할 수 있습니다.`
    : "개인 피부 상태와 고민에 따라 의료진 상담을 통해 적합성을 확인할 수 있습니다.";
  const rows = [
    [labels.description, pick(t.detail, lang) || pick(t.desc, lang)],
    [labels.target, target],
    [labels.duration, findDuration(t, lang)],
    [labels.recovery, pick(t.recovery, lang)],
    [labels.caution, pick(t.caution, lang)],
    [labels.time, pick(t.time, lang)],
    [labels.sessions, pick(t.sessions, lang)],
  ].filter(([, value]) => value);
  const hasLiftingPainCare = isPainSensitiveLifting(t.slug);
  const list = [
    ...pickFaq(t, lang),
    ...(hasLiftingPainCare ? LIFTING_FAQS[lang] : []),
  ];
  const faq = list.length
    ? `<section><h2>${escapeHtml(labels.faq)}</h2>${list.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join("\n")}</section>`
    : "";

  return `<main id="crawler-content" lang="${lang}"><article>
    <header><h1>${escapeHtml(pick(t.name, lang))}</h1><p>${escapeHtml(pick(t.desc, lang))}</p></header>
    <section><h2>${escapeHtml(labels.description)}</h2><table><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("\n")}</tbody></table></section>
    ${faq}
    <footer><p>부산 서면 스타피부과 · 부산광역시 부산진구 서면로 74 아이온시티빌딩 4층 · 051-818-2300</p></footer>
  </article></main>`;
}

// ── JSON-LD 주입 (C) ──────────────────────────────────────────────────────────

/**
 * MedicalProcedure + FAQPage JSON-LD 를 </head> 앞에 주입한다.
 * TreatmentPage.tsx 의 buildJsonLd 와 동일한 스키마 구조를 따른다.
 */
function injectJsonLd(
  html: string,
  t: TreatmentSeoRecord,
  lang: Lang,
  pageUrl: string
): string {
  const name = pick(t.name, lang);
  const description = pick(t.seoDescription, lang);
  const detail = pick(t.detail, lang);
  const caution = pick(t.caution, lang);
  const recovery = pick(t.recovery, lang);
  const bodyLocation = pick(t.schemaBodyLocation, lang) || "피부";
  const hasLiftingPainCare = isPainSensitiveLifting(t.slug);
  const langPrefix = lang === "ko" ? "" : `/${lang === "zh-TW" ? "zh-tw" : lang}`;
  const breadcrumbLabels = BREADCRUMB_LABELS[lang];
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", position: 1, name: breadcrumbLabels.home, item: `${BASE_URL}${langPrefix || "/"}` },
      { "@type": "ListItem", position: 2, name: breadcrumbLabels.treatments, item: `${BASE_URL}${langPrefix}/treatments` },
      { "@type": "ListItem", position: 3, name, item: pageUrl },
    ],
  };

  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name,
    alternateName: t.nameEn,
    description,
    procedureType: "https://schema.org/CosmeticProcedure",
    image: toAbsoluteTreatmentImageUrl(t.image),
    url: pageUrl,
    bodyLocation,
    preparation: hasLiftingPainCare ? LIFTING_ANESTHESIA_PREPARATION[lang] : caution,
    followup: recovery ? `회복 기간: ${recovery}. ${caution}` : caution,
    howPerformed: detail,
    status: "https://schema.org/ActiveActionStatus",
    provider: { "@id": `${BASE_URL}/#organization` },
    duration: pick(t.time, lang),
    relevantSpecialty: "https://schema.org/Dermatology",
  };

  const schemas: object[] = [buildClinicJsonLd(), medicalProcedure, breadcrumbList];

  // FAQPage 스키마
  if (t.faq) {
    const list = [
      ...pickFaq(t, lang),
      ...(hasLiftingPainCare ? LIFTING_FAQS[lang] : []),
    ];
    if (Array.isArray(list) && list.length > 0) {
      const faqPage = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: list.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      };
      schemas.push(faqPage);
    }
  }

  // XSS 방지: </script> 가 들어가지 않도록 < 를 \u003c 로 치환
  const jsonStr = JSON.stringify(schemas).replace(/</g, "\\u003c");
  const scriptTag = `    <script type="application/ld+json" data-rh="true">${jsonStr}</script>\n  </head>`;

  return html.replace("</head>", scriptTag);
}

// ── 등록 함수 (A-5) ───────────────────────────────────────────────────────────

export function registerTreatmentPrerender(app: Express): void {
  // JavaScript를 실행하지 않는 crawler도 legacy Korean treatment names를
  // distinct canonical content로 영구 정규화한다. Unknown names stay on the SPA 404 path.
  app.get("/treatment/:name", (req: Request, res: Response, next: NextFunction) => {
    const target = getLegacyTreatmentRedirectPath(req.params.name);
    if (!target) return next();
    return res.redirect(301, target);
  });

  app.get(
    ["/treatments/:slug", "/:lang/treatments/:slug"],
    (req: Request, res: Response, next: NextFunction) => {
      // [Step66-A] dev에서는 Vite의 transformIndexHtml을 반드시 거쳐야 한다.
      // 여기서 원본 HTML을 직접 반환하면 @vite/client와 React Refresh preamble이
      // 주입되지 않아 시술 페이지만 흰 화면이 된다. SEO는 프로덕션에서만 의미가 있으므로
      // dev에서는 프리렌더를 건너뛰고 Vite catch-all에 위임한다.
      if (process.env.NODE_ENV !== "production") {
        return next();
      }
      try {
        const parsed = parsePath(req.path);
        if (!parsed) return next();

        const data = loadTreatmentData();
        if (!data) return next();

        const t = data[parsed.slug];
        if (!t) return next(); // 없는 시술 → SPA 404

        const html = loadIndexHtml();
        if (!html) return next();

        const pageUrl =
          parsed.lang === "ko"
            ? `${BASE_URL}/treatments/${parsed.slug}`
            : `${BASE_URL}/${parsed.lang === "zh-TW" ? "zh-tw" : parsed.lang}/treatments/${parsed.slug}`;

        let out = injectTreatmentMeta(html, t, parsed.lang, parsed.slug);
        out = injectJsonLd(out, t, parsed.lang, pageUrl);
        out = out.replace(
          '<div id="root"></div>',
          `<div id="root">${buildStructuredBody(t, parsed.lang)}</div>`
        );
        out = injectPageSeoMeta(out, req.path);

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        // [Step65-B] HTML은 배포 즉시 반영되어야 하며, 시술 내용 수정이 최대 10분 지연되던 문제를 없앤다.
        res.setHeader("Cache-Control", "no-cache, must-revalidate");
        res.send(out);
      } catch (err) {
        console.error(
          "[TreatmentPrerender] failed:",
          err instanceof Error ? err.message : err
        );
        return next(); // 어떤 예외에도 사이트를 깨뜨리지 않는다
      }
    }
  );
}

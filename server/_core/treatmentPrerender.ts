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
 *   ② 본문은 <noscript> 안에만 → 방문자 화면·레이아웃 영향 0
 *   ③ 모든 실패 경로에서 next() → 어떤 경우에도 사이트가 깨지지 않음
 *
 * 데이터 소스: server/_generated/treatment-seo.json
 *   (빌드 전처리 scripts/gen-treatment-seo.mjs 가 생성)
 */

import type { Express, Request, Response, NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";

// ── 타입 정의 ────────────────────────────────────────────────────────────────

const SUPPORTED_LANGS = ["ko", "en", "ja", "zh"] as const;
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

const CLINIC_PROVIDER = {
  "@type": "MedicalBusiness",
  "@id": `${BASE_URL}/#organization`,
  "name": "스타피부과",
  "url": BASE_URL,
  "telephone": "+82-51-818-2300",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "서면로 74 아이온시티빌딩 4층",
    "addressLocality": "부산진구",
    "addressRegion": "부산광역시",
    "postalCode": "47280",
    "addressCountry": "KR",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 35.1579,
    "longitude": 129.0597,
  },
  "sameAs": [
    "https://place.naver.com/hospital/12020103",
    "https://map.kakao.com/?itemId=1523764",
  ],
} as const;

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
  console.warn("[TreatmentPrerender] treatment-seo.json not found — prerender disabled");
  return null;
}

// ── index.html 캐시 ──────────────────────────────────────────────────────────

let cachedHtml: string | null = null;

function loadIndexHtml(): string | null {
  if (cachedHtml) return cachedHtml;
  const candidates = [
    path.resolve(process.cwd(), "dist/public/index.html"),
    path.resolve(process.cwd(), "client/index.html"),
  ];
  for (const p of candidates) {
    try {
      cachedHtml = fs.readFileSync(p, "utf8");
      return cachedHtml;
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
  return v[lang] ?? v.ko ?? "";
}

/** 경로에서 언어·slug 추출. 실패 시 null */
function parsePath(p: string): { lang: Lang; slug: string } | null {
  const m = p.match(/^\/(?:(en|ja|zh)\/)?treatments\/([^/?#]+)\/?$/);
  if (!m) return null;
  const lang = (m[1] ?? "ko") as Lang;
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
function injectMeta(
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
      : `${BASE_URL}/${lang}/treatments/${slug}`;

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
      /<meta\s+name="description"[^>]*\/?>/i,
      `<meta data-rh="true" name="description" content="${ed}" />`
    )
    .replace(
      /<meta\s+name="keywords"[^>]*\/?>/i,
      `<meta data-rh="true" name="keywords" content="${ek}" />`
    )
    .replace(
      /<link\s+rel="canonical"[^>]*\/?>/i,
      `<link data-rh="true" rel="canonical" href="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:title"[^>]*\/?>/i,
      `<meta data-rh="true" property="og:title" content="${et}" />`
    )
    .replace(
      /<meta\s+property="og:description"[^>]*\/?>/i,
      `<meta data-rh="true" property="og:description" content="${ed}" />`
    )
    .replace(
      /<meta\s+property="og:url"[^>]*\/?>/i,
      `<meta data-rh="true" property="og:url" content="${canonical}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"[^>]*\/?>/i,
      `<meta data-rh="true" name="twitter:title" content="${et}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"[^>]*\/?>/i,
      `<meta data-rh="true" name="twitter:description" content="${ed}" />`
    )
    // [Step61b-B] 카카오톡 공유 카드. 환자들이 카톡으로 링크를 많이 공유하므로
    // 홈 제목이 아니라 시술 제목이 나와야 한다.
    .replace(
      /<meta\s+property="kakao:title"[^>]*\/?>/i,
      `<meta data-rh="true" property="kakao:title" content="${et}" />`
    )
    .replace(
      /<meta\s+property="kakao:description"[^>]*\/?>/i,
      `<meta data-rh="true" property="kakao:description" content="${ed}" />`
    )
    // [Step61b-B] og:image / kakao:image / twitter:image — 시술 이미지가 있으면 절대 URL 로 변환 후 치환
    // t.image 는 /api/storage/... 형태의 상대경로이므로 BASE_URL 을 붙인다.
    // 이미지가 없으면 치환하지 않아 홈 이미지가 그대로 유지된다.
    .replace(
      /<meta\s+property="og:image"[^>]*\/?>/i,
      t.image
        ? `<meta data-rh="true" property="og:image" content="${t.image.startsWith('http') ? t.image : BASE_URL + t.image}" />`
        : "$&"
    )
    .replace(
      /<meta\s+property="kakao:image"[^>]*\/?>/i,
      t.image
        ? `<meta data-rh="true" property="kakao:image" content="${t.image.startsWith('http') ? t.image : BASE_URL + t.image}" />`
        : "$&"
    )
    .replace(
      /<meta\s+name="twitter:image"[^>]*\/?>/i,
      t.image
        ? `<meta data-rh="true" name="twitter:image" content="${t.image.startsWith('http') ? t.image : BASE_URL + t.image}" />`
        : "$&"
    )
    // [Step62-A] og:image 부가 태그를 실제 시술 이미지에 맞게 치환한다.
    // 이미지 경로가 /api/storage/... 원격 URL 이라 로컈 파일에서 sharp 로 크기를 읽을 수 없다.
    // 따라서 A-3 에서 width/height 는 제거한다 (잘못된 값보다 없는 편이 낙다).
    // og:image / kakao:image / twitter:image 는 반드시 PNG/JPEG 유지 (카카오톡·페이스북 WebP 지원 불안정).
    .replace(
      /<meta\s+property="og:image:type"[^>]*\/?>/i,
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
      /<meta\s+property="og:image:alt"[^>]*\/?>/i,
      t.image
        ? `<meta data-rh="true" property="og:image:alt" content="${escapeHtml(pick(t.name, lang))} - 부산 서면 스타피부과" />`
        : "$&"
    )
    // [Step62-A3] 실제 크기를 알 수 없으므로 잘못된 홈 배경(1200×630) 값을 제거한다.
    // 플랫폼이 이미지 파일에서 직접 크기를 읽는다. 시술 페이지 응답에서만 제거되며 홈 index.html 은 건드리지 않는다.
    .replace(/<meta\s+property="og:image:width"[^>]*\/?>/i, t.image ? "" : "$&")
    .replace(/<meta\s+property="og:image:height"[^>]*\/?>/i, t.image ? "" : "$&")
    // [Step61b-C] hreflang 을 시술 페이지 기준으로 재작성.
    // 기존 5줄(ko/en/ja/zh/x-default)을 통째로 치환한다.
    .replace(
      /<link\s+rel="alternate"\s+hreflang="ko"[^>]*\/?>([\s\S]*?)<link\s+rel="alternate"\s+hreflang="x-default"[^>]*\/?>/i,
      [
        `<link data-rh="true" rel="alternate" hreflang="ko" href="${BASE_URL}/treatments/${slug}" />`,
        `<link data-rh="true" rel="alternate" hreflang="en" href="${BASE_URL}/en/treatments/${slug}" />`,
        `<link data-rh="true" rel="alternate" hreflang="ja" href="${BASE_URL}/ja/treatments/${slug}" />`,
        `<link data-rh="true" rel="alternate" hreflang="zh" href="${BASE_URL}/zh/treatments/${slug}" />`,
        `<link data-rh="true" rel="alternate" hreflang="x-default" href="${BASE_URL}/treatments/${slug}" />`,
      ].join("\n    ")
    );
}

// ── noscript 본문 주입 ────────────────────────────────────────────────────────

function buildNoscript(t: TreatmentSeoRecord, lang: Lang): string {
  const parts: string[] = [
    `<h1>${escapeHtml(pick(t.name, lang))}</h1>`,
    `<p>${escapeHtml(pick(t.desc, lang))}</p>`,
    `<p>${escapeHtml(pick(t.detail, lang))}</p>`,
  ];

  const effect = pick(t.effect, lang);
  if (effect) parts.push(`<h2>기대 효과</h2><p>${escapeHtml(effect)}</p>`);

  const caution = pick(t.caution, lang);
  if (caution) parts.push(`<h2>주의사항</h2><p>${escapeHtml(caution)}</p>`);

  const time = pick(t.time, lang);
  const recovery = pick(t.recovery, lang);
  const sessions = pick(t.sessions, lang);
  if (time) parts.push(`<p>시술 시간: ${escapeHtml(time)}</p>`);
  if (recovery) parts.push(`<p>회복 기간: ${escapeHtml(recovery)}</p>`);
  if (sessions) parts.push(`<p>권장 횟수: ${escapeHtml(sessions)}</p>`);

  // FAQ — 최대 5개. AI 검색·구글 FAQ 노출에 효과가 크다.
  if (t.faq) {
    const list = t.faq[lang] ?? t.faq.ko;
    if (Array.isArray(list) && list.length > 0) {
      parts.push("<h2>자주 묻는 질문</h2>");
      for (const item of list.slice(0, 5)) {
        parts.push(
          `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`
        );
      }
    }
  }

  parts.push(
    `<p>부산 서면 스타피부과 · 부산광역시 부산진구 서면로 74 아이온시티빌딩 4층 · 051-818-2300</p>`
  );

  return `<noscript>\n      ${parts.join("\n      ")}\n    </noscript>`;
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

  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name,
    alternateName: t.nameEn,
    description,
    procedureType: "https://schema.org/CosmeticProcedure",
    image: t.image,
    url: pageUrl,
    bodyLocation,
    preparation: caution,
    followup: recovery ? `회복 기간: ${recovery}. ${caution}` : caution,
    howPerformed: detail,
    status: "https://schema.org/ActiveActionStatus",
    provider: CLINIC_PROVIDER,
  };

  const schemas: object[] = [medicalProcedure];

  // FAQPage 스키마
  if (t.faq) {
    const list = t.faq[lang] ?? t.faq.ko;
    if (Array.isArray(list) && list.length > 0) {
      const faqPage = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: list.slice(0, 5).map((item) => ({
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
  app.get(
    ["/treatments/:slug", "/:lang/treatments/:slug"],
    (req: Request, res: Response, next: NextFunction) => {
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
            : `${BASE_URL}/${parsed.lang}/treatments/${parsed.slug}`;

        let out = injectMeta(html, t, parsed.lang, parsed.slug);
        out = injectJsonLd(out, t, parsed.lang, pageUrl);
        out = out.replace(
          "<body>",
          `<body>\n    ${buildNoscript(t, parsed.lang)}`
        );

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=600, s-maxage=300");
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

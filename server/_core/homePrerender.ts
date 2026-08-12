/**
 * JavaScript를 실행하지 않는 검색·AI 크롤러를 위한 홈 본문 프리렌더링.
 *
 * React 앱은 클라이언트에서 기존과 동일하게 createRoot로 렌더링한다. 이 모듈은
 * 프로덕션의 홈 언어 루트에만 의미 있는 HTML과 FAQPage JSON-LD를 먼저 주입해
 * JavaScript 미실행 환경에서도 실제 FAQ·진료 안내를 읽을 수 있게 한다.
 */

import type { Express, NextFunction, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { ko } from "../../client/src/lib/i18n.ko";
import { en } from "../../client/src/lib/i18n.en";
import { ja } from "../../client/src/lib/i18n.ja";
import { zh } from "../../client/src/lib/i18n.zh";
import { zhTW } from "../../client/src/lib/i18n.zh-TW";

const BASE_URL = "https://star-pibu.com";

type Locale = "ko" | "en" | "ja" | "zh" | "zh-TW";

type FaqQuestion = { q: string; a: string };
type FaqItem = { equipment: string; questions: FaqQuestion[] };

const localeContent = { ko, en, ja, zh, "zh-TW": zhTW } as const;

const copy: Record<Locale, {
  clinicIntro: string;
  storyTitle: string;
  locationTitle: string;
  treatmentIntro: string;
  contactLabel: string;
}> = {
  ko: {
    clinicIntro: "부산 서면에서 피부과전문의가 직접 진료하는 스타피부과입니다. 피부 상태와 생활 패턴을 함께 고려해 맞춤 진료 계획을 안내합니다.",
    storyTitle: "피부과전문의가 알려주는 피부이야기",
    locationTitle: "찾아오시는 길",
    treatmentIntro: "리프팅, 색소·문신, 흉터·모공, 볼륨·스킨부스터 등 피부 고민에 맞는 시술과 장비 정보를 제공합니다.",
    contactLabel: "부산광역시 부산진구 서면로 74 아이온시티빌딩 4층 · 051-818-2300",
  },
  en: {
    clinicIntro: "Star Dermatology is a dermatologist-led clinic in Seomyeon, Busan, offering tailored care plans based on each patient's skin condition and lifestyle.",
    storyTitle: "Skin Stories from Our Dermatology Specialists",
    locationTitle: "Directions",
    treatmentIntro: "Explore treatments and devices for lifting, pigmentation, tattoos, scars, pores, volume, and skin boosters.",
    contactLabel: "4F, ION City Building, 74 Seomyeon-ro, Busanjin-gu, Busan · +82-51-818-2300",
  },
  ja: {
    clinicIntro: "スター皮膚科は釜山・西面の皮膚科専門医によるクリニックです。肌状態と生活習慣を考慮した診療計画をご案内します。",
    storyTitle: "皮膚科専門医が伝えるスキンケア情報",
    locationTitle: "アクセス",
    treatmentIntro: "リフティング、色素・タトゥー、傷跡・毛穴、ボリューム・スキンブースターなどの施術・機器情報をご案内します。",
    contactLabel: "釜山広域市釜山鎮区西面路74、アイオンシティビル4階 · +82-51-818-2300",
  },
  zh: {
    clinicIntro: "STAR皮肤科位于釜山西面，由皮肤科专科医生提供诊疗，并根据每位患者的皮肤状态和生活习惯制定方案。",
    storyTitle: "皮肤科专家分享的护肤知识",
    locationTitle: "来院路线",
    treatmentIntro: "提供提拉、色素与纹身、疤痕与毛孔、填充与皮肤增效等治疗和设备信息。",
    contactLabel: "韩国釜山广域市釜山镇区西面路74，爱恩城市大厦4楼 · +82-51-818-2300",
  },
  "zh-TW": {
    clinicIntro: "STAR皮膚科位於釜山西面，由皮膚科專科醫師提供診療，並依每位患者的膚況與生活習慣規劃療程。",
    storyTitle: "皮膚科專家分享的肌膚知識",
    locationTitle: "交通資訊",
    treatmentIntro: "提供拉提、色素與紋身、疤痕與毛孔、填充與肌膚增效等療程和設備資訊。",
    contactLabel: "韓國釜山廣域市釜山鎮區西面路74，愛恩城市大樓4樓 · +82-51-818-2300",
  },
};

let cachedHtml: string | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getLocale(pathname: string): Locale | null {
  if (pathname === "/" || pathname === "") return "ko";
  if (pathname === "/en") return "en";
  if (pathname === "/ja") return "ja";
  if (pathname === "/zh") return "zh";
  if (pathname === "/zh-tw") return "zh-TW";
  return null;
}

function loadIndexHtml(): string | null {
  if (cachedHtml) return cachedHtml;
  const candidates = [
    path.resolve(process.cwd(), "dist/public/index.html"),
    path.resolve(process.cwd(), "client/index.html"),
  ];

  for (const candidate of candidates) {
    try {
      cachedHtml = fs.readFileSync(candidate, "utf8");
      return cachedHtml;
    } catch {
      // 다음 후보를 확인한다.
    }
  }
  return null;
}

export function buildHomePrerenderedHtml(template: string, pathname: string): string | null {
  const locale = getLocale(pathname);
  if (!locale) return null;

  const content = localeContent[locale];
  const localizedCopy = copy[locale];
  const faqItems = content.faq.items as FaqItem[];
  const faqQuestions = faqItems.flatMap((item) => item.questions.map((question) => ({
    equipment: item.equipment,
    ...question,
  })));
  const canonical = locale === "ko" ? BASE_URL : `${BASE_URL}/${pathname.slice(1)}`;
  const lang = locale === "zh-TW" ? "zh-Hant" : locale;

  const faqMarkup = faqItems.map((item) => [
    `<h3>${escapeHtml(item.equipment)}</h3>`,
    "<dl>",
    ...item.questions.map((question) => `<dt>${escapeHtml(question.q)}</dt><dd>${escapeHtml(question.a)}</dd>`),
    "</dl>",
  ].join("\n")).join("\n");

  const noscriptBody = [
    `<main id="crawler-content" lang="${lang}">`,
    `<header><h1>${escapeHtml(content.hero.title)}</h1><p>${escapeHtml(content.hero.subtitle)}</p><p>${escapeHtml(localizedCopy.clinicIntro)}</p></header>`,
    `<section aria-labelledby="crawler-treatments"><h2 id="crawler-treatments">${escapeHtml(content.nav.treatments)}</h2><p>${escapeHtml(localizedCopy.treatmentIntro)}</p><p><a href="${BASE_URL}/treatments">${escapeHtml(content.nav.treatments)}</a></p></section>`,
    `<section aria-labelledby="crawler-story"><h2 id="crawler-story">${escapeHtml(localizedCopy.storyTitle)}</h2><p>${escapeHtml(content.faq.sectionSubtitle)}</p></section>`,
    `<section aria-labelledby="crawler-faq"><h2 id="crawler-faq">${escapeHtml(content.faq.sectionTitle)}</h2><p>${escapeHtml(content.faq.sectionSubtitle)}</p>${faqMarkup}</section>`,
    `<section aria-labelledby="crawler-location"><h2 id="crawler-location">${escapeHtml(localizedCopy.locationTitle)}</h2><address>${escapeHtml(localizedCopy.contactLabel)}</address><p><a href="tel:+82518182300">+82-51-818-2300</a></p></section>`,
    "</main>",
  ].join("\n");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqQuestions.map((question) => ({
      "@type": "Question",
      name: question.q,
      acceptedAnswer: { "@type": "Answer", text: question.a },
    })),
  }).replace(/</g, "\\u003c");

  return template
    .replace(/<html([^>]*)>/i, `<html$1 lang="${lang}">`)
    .replace(/<link\s+rel="canonical"[^>]*\/?>(\s*)/i, `<link data-rh="true" rel="canonical" href="${canonical}" />$1`)
    .replace("</head>", `    <script type="application/ld+json" data-prerender="home-faq">${jsonLd}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">\n    ${noscriptBody}\n  </div>`);
}

export function registerHomePrerender(app: Express): void {
  app.get(["/", "/en", "/ja", "/zh", "/zh-tw"], (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "production") return next();

    try {
      const template = loadIndexHtml();
      const html = template ? buildHomePrerenderedHtml(template, req.path) : null;
      if (!html) return next();

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
      res.send(html);
    } catch (error) {
      console.error("[HomePrerender] failed:", error instanceof Error ? error.message : error);
      return next();
    }
  });
}

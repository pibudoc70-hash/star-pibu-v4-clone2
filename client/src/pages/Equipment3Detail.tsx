/**
 * Equipment3Detail - 시술 상세 페이지 (DB 연동)
 * URL: /equipment3/:slug | /en/equipment3/:slug | /ja/equipment3/:slug | /zh/equipment3/:slug
 *
 * 각 시술별 독립적인 SEO 페이지.
 * pageType="treatment" → noindex 해제, 검색 엔진 인덱싱 허용.
 */
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE, SITE_NAME_LOCALIZED } from "@/components/SeoHead";
import { CLINIC_INFO } from "@/lib/constants";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { useParams, useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Calendar, Moon, Sun } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { LiftingFaqSection } from "@/components/LiftingPositioning";
import { withVersion } from "@/lib/imageUrl";
import { LIFTING_ANESTHESIA_PREPARATION, LIFTING_FAQS, isPainSensitiveLifting } from "@shared/liftingPositioning";
import { getLocalizedEquipmentFaqs } from "@shared/equipmentFaq";
import { EQUIPMENT_DETAIL_QUOTES } from "@shared/equipmentDetailQuote";
import { EQUIPMENT_EXPLANATORY_INFOGRAPHICS } from "@/lib/equipmentInfographics";

import { getLocalizedUrl } from "@/lib/localizedPath";
import { buildBreadcrumbJsonLd, buildFAQPageJsonLd, withSchemaLanguage } from "@/lib/seoHelpers";
import { useChatConfig } from "@/hooks/useChatConfig";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Lazy load Streamdown to avoid bundling it in the initial page load
const Streamdown = lazy(() => import("streamdown").then(m => ({ default: m.Streamdown })));

function hasKatexMarkup(markdown: string) {
  return markdown.includes("\\(") || markdown.includes("\\[") || /(^|[^\\])\$(?=\S)/m.test(markdown);
}

// KaTeX CSS는 실제 수식 Markdown이 있는 상세 페이지에서만 로드한다.
function useKatexCss(markdown: string) {
  useEffect(() => {
    if (!hasKatexMarkup(markdown)) return;

    const linkId = "katex-css-dynamic";
    if (document.getElementById(linkId)) return;
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }, [markdown]);
}

function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

const EQUIPMENT_COLOR_SCHEME_KEY = "equipment3_color_scheme";
type EquipmentColorScheme = "light" | "dark";

function getEquipmentColorScheme(): EquipmentColorScheme {
  if (typeof window === "undefined") return "light";
  try {
    return window.localStorage.getItem(EQUIPMENT_COLOR_SCHEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function EquipmentDetailLoading({ label, isDarkMode }: { label: string; isDarkMode: boolean }) {
  return (
    <div className={`equipment-detail-page min-h-screen${isDarkMode ? " equipment-detail-page--dark" : ""}`}>
      <Header />
      <main id="main-content" aria-busy="true" aria-label={label}>
        <section className="equipment-detail__loading-hero bg-gradient-to-r from-slate-800 to-slate-900 pt-[calc(8rem+env(safe-area-inset-top))] pb-12 md:py-12">
          <div className="container mx-auto px-4 animate-pulse" aria-hidden="true">
            <div className="h-4 w-28 rounded bg-slate-600" />
            <div className="mt-4 h-10 max-w-md rounded bg-slate-600" />
            <div className="mt-3 h-5 w-48 rounded bg-slate-700" />
          </div>
        </section>
        <section className="equipment-detail__loading-content container mx-auto grid grid-cols-1 gap-10 px-4 py-12 md:grid-cols-2" aria-hidden="true">
          <div className="equipment-detail__loading-surface aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse" />
          <div className="space-y-5 pt-2">
            <div className="equipment-detail__loading-surface h-6 w-28 rounded bg-slate-100 animate-pulse" />
            <div className="equipment-detail__loading-surface h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="equipment-detail__loading-surface h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
            <div className="equipment-detail__loading-surface h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="equipment-detail__loading-surface h-12 rounded-xl bg-slate-100 animate-pulse" />
              <div className="equipment-detail__loading-surface h-12 rounded-xl bg-slate-100 animate-pulse" />
            </div>
          </div>
        </section>
        <p className="sr-only" role="status">{label}</p>
      </main>
      <Footer />
    </div>
  );
}

export default function Equipment3Detail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { lang } = useLang();
  const { getText } = useLocalizedText();
  const { chatUrl, reserveUrl, chatBg, chatColor } = useChatConfig();
  const slug = params.slug as string;
  const search = useSearch();
  const [colorScheme, setColorScheme] = useState<EquipmentColorScheme>(getEquipmentColorScheme);
  const isDarkMode = colorScheme === "dark";
  const toggleColorScheme = useCallback(() => {
    setColorScheme((current) => {
      const next: EquipmentColorScheme = current === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem(EQUIPMENT_COLOR_SCHEME_KEY, next);
      } catch {
        // 저장소를 사용할 수 없으면 현재 상세 화면에서만 모드를 전환한다.
      }
      return next;
    });
  }, []);
  // URL에 ?tab= 파라미터가 있으면 그 탭으로, 없으면 item.category로 복원
  const tabFromUrl = new URLSearchParams(search).get("tab") ?? "";

  const { data: item, isLoading, isError } = trpc.equipment3.bySlug.useQuery(
    { slug },
    { enabled: !!slug, retry: 1 }
  );
  const katexContent = item
    ? [
        item.detail, item.detailEn, item.detailJa, item.detailZh, item.detailZhTw,
        item.effect, item.effectEn, item.effectJa, item.effectZh, item.effectZhTw,
        item.caution, item.cautionEn, item.cautionJa, item.cautionZh, item.cautionZhTw,
      ].filter((value): value is string => typeof value === "string").join("\n")
    : "";
  useKatexCss(katexContent);

  // ── UI 레이블 ────────────────────────────────────────────────────────────────
  const LABELS = {
    loading:   getText("로딩 중...",       "Loading...",                    "読み込み中...",      "加载中..."),
    notFound:  getText("시술 정보를 찾을 수 없습니다.", "Treatment information not found.", "施術情報が見つかりませんでした。", "未找到该项目信息。"),
    error:     getText("데이터를 불러오는 중 오류가 발생했습니다.", "Failed to load treatment data.", "データの読み込みに失敗しました。", "加载数据时出错。"),
    time:      getText("시술 시간",         "Duration",                      "施術時間",           "施术时间",           "療程時間"),
    recovery:  getText("회복 기간",         "Recovery",                      "回復期間",           "恢复期",             "恢復期"),
    sessions:  getText("권장 횟수",         "Recommended Sessions",          "推奨回数",           "建议次数",           "建議次數"),
    book:      getText("예약하기",          "Book Now",                      "予約する",           "立即预约"),
    overview:  getText("시술 소개",         "Treatment Overview",            "施術のご紹介",       "项目介绍",           "療程介紹"),
    effect:    getText("기대 효과",         "Expected Results",              "期待できる効果",     "预期效果",           "預期效果"),
    caution:   getText("주의사항",          "Precautions",                   "注意事項",           "注意事项",           "注意事項"),
    gallery:   getText("시술 사례",         "Before & After",                "施術事例",           "施术案例"),
    video:     getText("가이드 영상",         "Guide Video",                   "ガイド動画",         "指南视频"),
    faq:       getText("자주 묻는 질문",     "Frequently Asked Questions",   "よくある質問",       "常见问题"),
    backList:  getText("목록으로 돌아가기",  "Back to list",                  "一覧に戻る",         "返回列表"),
    bodyLoc:   getText("피부",             "Skin",                          "皮膚",               "皮肤"),
    caseAlt:   getText("사례",             "case",                          "事例",               "案例"),
    home:      getText("홈",               "Home",                          "ホーム",             "首页",               "首頁"),
    lightMode: getText("라이트 모드",      "Light mode",                    "ライトモード",       "浅色模式",           "淺色模式"),
    darkMode:  getText("다크 모드",        "Dark mode",                     "ダークモード",       "深色模式",           "深色模式"),
    toLightMode: getText("라이트 모드로 전환", "Switch to light mode",        "ライトモードに切り替え", "切换到浅色模式", "切換至淺色模式"),
    toDarkMode: getText("다크 모드로 전환",   "Switch to dark mode",          "ダークモードに切り替え", "切换到深色模式", "切換至深色模式"),
  } as const;

  // ── 목록 복귀 경로 헬퍼 ─────────────────────────────────────────────────────
  const getBackPath = (category?: string) => {
    const langPrefix = lang === "ko" ? "" : `/${lang}`;
    const tabId = tabFromUrl || category || "";
    return tabId
      ? `${langPrefix}/equipment3?tab=${encodeURIComponent(tabId)}`
      : `${langPrefix}/equipment3`;
  };

  // ── 로딩 ────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <EquipmentDetailLoading label={LABELS.loading} isDarkMode={isDarkMode} />;
  }

  // ── 에러 ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className={`equipment-detail-page equipment-detail__state-page flex flex-col items-center justify-center min-h-screen gap-4${isDarkMode ? " equipment-detail-page--dark" : ""}`}>
        <p className="equipment-detail__state-error text-red-600">{LABELS.error}</p>
        <a
          href={getBackPath()}
          className="equipment-detail__back-button px-4 py-2 rounded-lg"
        >
          {LABELS.backList}
        </a>
      </div>
    );
  }

  // ── notFound ─────────────────────────────────────────────────────────────────
  if (!item) {
    return (
      <div className={`equipment-detail-page equipment-detail__state-page flex flex-col items-center justify-center min-h-screen gap-4${isDarkMode ? " equipment-detail-page--dark" : ""}`}>
        <p className="equipment-detail__state-copy text-gray-600">{LABELS.notFound}</p>
        <a
          href={getBackPath()}
          className="equipment-detail__back-button px-4 py-2 rounded-lg"
        >
          {LABELS.backList}
        </a>
      </div>
    );
  }

  // ── 다국어 텍스트 ────────────────────────────────────────────────────────────
  const localizedName     = lang === "zh-TW"
    ? item.nameZhTw?.trim() || item.name
    : getText(item.name, item.nameEn, item.nameJa, item.nameZh);
  const localized = (ko: string | null | undefined, en: string | null | undefined, ja: string | null | undefined, zh: string | null | undefined, zhTw: string | null | undefined) =>
    lang === "zh-TW" ? zhTw?.trim() || ko || "" : getText(ko ?? "", en ?? "", ja ?? "", zh ?? "");
  const localizedDesc     = localized(item.desc,    item.descEn,    item.descJa,    item.descZh,    item.descZhTw);
  const localizedDetail   = localized(item.detail,  item.detailEn,  item.detailJa,  item.detailZh,  item.detailZhTw);
  const localizedEffect   = localized(item.effect,  item.effectEn,  item.effectJa,  item.effectZh,  item.effectZhTw);
  const localizedCaution  = localized(item.caution, item.cautionEn, item.cautionJa, item.cautionZh, item.cautionZhTw);
  const localizedCategory = getText(item.category, item.categoryEn, item.categoryJa, item.categoryZh);
  const localizedTime     = localized(item.time,    item.timeEn,    item.timeJa,    item.timeZh,    item.timeZhTw);
  const localizedRecovery = localized(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh, item.recoveryZhTw);
  const localizedSessions = localized(item.sessions, item.sessionsEn, item.sessionsJa, item.sessionsZh, item.sessionsZhTw);
  const hasLiftingPainCare = isPainSensitiveLifting(slug) || isPainSensitiveLifting(item.name);
  const managedFaqs = getLocalizedEquipmentFaqs(item, lang);
  const positioningFaqs = hasLiftingPainCare && managedFaqs.length === 0 ? LIFTING_FAQS[lang] : [];
  const allFaqs = [...managedFaqs, ...positioningFaqs];
  const detailQuote = EQUIPMENT_DETAIL_QUOTES[lang];
  const explanatoryInfographic = lang === "ko" ? EQUIPMENT_EXPLANATORY_INFOGRAPHICS[slug as keyof typeof EQUIPMENT_EXPLANATORY_INFOGRAPHICS] : undefined;

  const images = safeParseJson<string[]>(item.images, []);

  // ── SEO ─────────────────────────────────────────────────────────────────────
  const pageUrl = getLocalizedUrl(lang, `/equipment3/${slug}`);
  const normalizeEnglishBrand = (value: string) => lang === "en"
    ? value.replace(/\bStar Dermatology\b/g, "STAR Dermatology")
    : value;
  const schemaFaqs = lang === "en"
    ? allFaqs.map(({ question, answer }) => ({ question: normalizeEnglishBrand(question), answer: normalizeEnglishBrand(answer) }))
    : allFaqs;

  // DB에 저장된 SEO 필드를 우선 사용, 없으면 자동 생성
  const seoTitle = normalizeEnglishBrand(item.seoTitle?.trim() || (() => {
    switch (lang) {
      case "en": return `${localizedName} | STAR Dermatology, Seomyeon, Busan`;
      case "ja": return `${localizedName} | 釜山西面 スター皮膚科`;
      case "zh": return `${localizedName} | 釜山西面 STAR 皮肤科`;
      default:   return `${item.name} | 부산 서면 스타피부과`;
    }
  })());

  const seoDesc = normalizeEnglishBrand(item.seoDescription?.trim() || (() => {
    const d = localizedDesc || "";
    switch (lang) {
      case "en": return `STAR Dermatology Clinic in Seomyeon, Busan offers ${localizedName}. ${d} Performed by board-certified dermatologist.`;
      case "ja": return `釜山西面スター皮膚科の${localizedName}施術案内。${d} 皮膚科専門医が直接施術。`;
      case "zh": return `釜山西面STAR皮肤科${localizedName}项目介绍。${d} 由皮肤科专科医生亲自操作。`;
      default:   return `부산 서면 스타피부과의 ${item.name} 시술 안내. ${item.desc || ""} 피부과 전문의가가 직접 시술합니다.`;
    }
  })());

  const seoKeywords = normalizeEnglishBrand(item.seoKeywords?.trim() || (lang === "ko"
    ? `${item.name}, ${item.nameEn || ""}, 부산피부과, 스타피부과, 서면피부과, 피부과전문의`
    : `${localizedName}, Busan dermatology, STAR Dermatology, Seomyeon`));

  const medicalProcedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${pageUrl}#medical-procedure`,
    "name": localizedName,
    "alternateName": lang === "ko" ? (item.nameEn || "") : item.name,
    "description": normalizeEnglishBrand(localizedDesc || ""),
    "procedureType": "https://schema.org/CosmeticProcedure",
    "image": item.imageUrl || "",
    "url": pageUrl,
    "provider": {
      "@type": "MedicalBusiness",
      "@id": `${CLINIC_INFO.url}/#organization`,
      "name": SITE_NAME_LOCALIZED[lang] ?? CLINIC_INFO.name,
      "url": CLINIC_INFO.url,
      "telephone": CLINIC_INFO.telephone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": CLINIC_INFO.address.streetAddress,
        "addressLocality": CLINIC_INFO.address.addressLocality,
        "addressRegion": CLINIC_INFO.address.addressRegion,
        "postalCode": CLINIC_INFO.address.postalCode,
        "addressCountry": CLINIC_INFO.address.addressCountry,
      },
    },
    "bodyLocation": LABELS.bodyLoc,
    "preparation": normalizeEnglishBrand(hasLiftingPainCare ? LIFTING_ANESTHESIA_PREPARATION[lang] : (localizedCaution || "")),
    "followup": normalizeEnglishBrand(localizedRecovery || ""),
  };
  const breadcrumbJsonLd = withSchemaLanguage({
    ...buildBreadcrumbJsonLd([
      { name: LABELS.home, url: getLocalizedUrl(lang, "/") },
      { name: localizedName, url: pageUrl },
    ]),
    "@id": `${pageUrl}#breadcrumb`,
  }, lang);
  const faqJsonLd = allFaqs.length > 0 ? withSchemaLanguage({
    ...buildFAQPageJsonLd(schemaFaqs),
    "@id": `${pageUrl}#faq`,
  }, lang) : null;
  const jsonLd = [
    medicalProcedureJsonLd,
    breadcrumbJsonLd,
    ...(faqJsonLd ? [faqJsonLd] : []),
  ];

  return (
    <div className={`equipment-detail-page min-h-screen${isDarkMode ? " equipment-detail-page--dark" : ""}`}>
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        canonical={pageUrl}
        ogImage={item.ogImageUrl?.trim() || item.imageUrl || undefined}
        ogUrl={pageUrl}
        ogLocale={LANG_TO_OG_LOCALE[lang] ?? "ko_KR"}
        hreflangs={buildHreflangs(
          `/equipment3/${slug}`,
          `/en/equipment3/${slug}`,
          `/ja/equipment3/${slug}`,
          `/zh/equipment3/${slug}`
        )}
        jsonLd={jsonLd}
        pageType="treatment"
      />

      <Header />

      {/* 히어로 헤더 */}
      <div className="equipment-detail__hero bg-gradient-to-r from-slate-800 to-slate-900 text-white pt-[calc(8rem+env(safe-area-inset-top))] pb-12 md:py-12">
        <div className="container mx-auto px-4">
          {localizedCategory && (
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">
              {localizedCategory}
            </p>
          )}
          <h1 className="text-4xl font-bold mb-2">{localizedName}</h1>
          {item.nameEn && lang === "ko" && (
            <p className="text-slate-300 text-lg">{item.nameEn}</p>
          )}
          <div className="equipment-detail__appearance-control">
            <button
              type="button"
              className="equipment-detail__appearance-toggle"
              onClick={toggleColorScheme}
              aria-pressed={isDarkMode}
              aria-label={isDarkMode ? LABELS.toLightMode : LABELS.toDarkMode}
            >
              {isDarkMode ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              <span>{isDarkMode ? LABELS.lightMode : LABELS.darkMode}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main id="main-content" className="equipment-detail__main container mx-auto px-4 py-12">
        <div className="equipment-detail__primary grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          {/* 이미지 — 한국어: imageUrl 기존 방식 / 비한국어+bgImageUrl: 배경+CSS 텍스트 오버레이 */}
          <div>
            {lang !== "ko" && item.bgImageUrl ? (
              /* ── 비한국어: 배경+텍스트 오버레이 ── */
              <div
                className="relative w-full rounded-2xl shadow-lg overflow-hidden"
                style={{ aspectRatio: "16/8" }}
              >
                {/* 배경 이미지 */}
                <img
                  src={withVersion(item.bgImageUrl, item.updatedAt)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* 반투명 어두운 레이어 — 밝은 배경에서 텍스트 가독성 확보 */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                {/* 텍스트 오버레이 */}
                <div className="relative z-10 flex flex-col justify-center h-full px-8 py-6">
                  {/* 브랜드/영문 소제목 */}
                  {item.nameEn && (
                    <p
                      className="text-sm font-semibold tracking-[0.25em] uppercase mb-2"
                      style={{ color: "rgba(255,255,255,0.9)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
                    >
                      {item.nameEn}
                    </p>
                  )}
                  {/* 메인 시술명 */}
                  <h2
                    className="text-4xl md:text-5xl font-black leading-tight"
                    style={{ color: "#fff", textShadow: "0 2px 16px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)" }}
                  >
                    {localizedName}
                  </h2>
                  {/* 서브 태그라인 — 카테고리 활용 */}
                  {localizedCategory && (
                    <p
                      className="mt-3 text-base font-semibold tracking-wide"
                      style={{ color: "rgba(255,255,255,0.95)", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
                    >
                      ［ {localizedCategory} ］
                    </p>
                  )}
                </div>
              </div>
            ) : item.imageUrl ? (
              /* ── 한국어 또는 bgImageUrl 없음: 기존 이미지 그대로 표시 ── */
              <OptimizedImage
                src={withVersion(item.imageUrl, item.updatedAt)}
                alt={localizedName}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            ) : (
              <div className="equipment-detail__image-placeholder w-full h-72 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <span className="text-slate-400 text-5xl">✦</span>
              </div>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="space-y-6">
            {item.badge && (
              <span
                className="inline-block px-4 py-2 rounded-full text-white font-semibold text-sm"
                style={{ backgroundColor: item.badgeColor || "#4A6FA5" }}
              >
                {item.badge}
              </span>
            )}

            {localizedDesc && (
              <p className="equipment-detail__description text-gray-700 leading-relaxed">{localizedDesc}</p>
            )}

            <div className="space-y-3">
              {localizedTime && (
                <div className="equipment-detail__meta-row flex items-center gap-3 text-sm">
                  <span className="equipment-detail__meta-label font-semibold text-gray-500 w-24">{LABELS.time}</span>
                  <span className="equipment-detail__meta-value text-gray-900">{localizedTime}</span>
                </div>
              )}
              {localizedRecovery && (
                <div className="equipment-detail__meta-row flex items-center gap-3 text-sm">
                  <span className="equipment-detail__meta-label font-semibold text-gray-500 w-24">{LABELS.recovery}</span>
                  <span className="equipment-detail__meta-value text-gray-900">{localizedRecovery}</span>
                </div>
              )}
              {localizedSessions && (
                <div className="equipment-detail__meta-row flex items-center gap-3 text-sm">
                  <span className="equipment-detail__meta-label font-semibold text-gray-500 w-24">{LABELS.sessions}</span>
                  <span className="equipment-detail__meta-value text-gray-900">{localizedSessions}</span>
                </div>
              )}
            </div>

            {/* CTA 버튼 — 카카오톡 상담 + 네이버 예약 */}
            <div className="flex gap-3">
              {/* 카카오톡/LINE/위챗 상담 */}
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="equipment-detail__contact-action flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm shadow-sm"
                style={{ background: chatBg, color: chatColor }}
              >
                <MessageCircle size={17} strokeWidth={2} />
                <span>
                  {lang === "zh" ? getText("", "", "", "微信咨询") :
                   lang === "ja" ? getText("", "", "LINE相談", "") :
                   lang === "en" ? getText("", "KakaoTalk", "", "") :
                   "카카오톡 상담"}
                </span>
              </a>
              {/* 네이버 예약 */}
              <a
                href={reserveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="equipment-detail__contact-action flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm shadow-sm bg-[#03C75A] text-white"
              >
                <Calendar size={17} strokeWidth={2} />
                <span>
                  {lang === "en" ? "Naver Booking" :
                   lang === "ja" ? "ネイバー予約" :
                   lang === "zh" ? "Naver预约" :
                   "네이버 예약"}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* 상세 설명 */}
        {localizedDetail && (
          <section className="mb-12">
            <h2 className="equipment-detail__section-heading text-2xl font-bold mb-5 pb-2 border-b border-gray-100">{LABELS.overview}</h2>
            <div className="equipment-detail__prose prose max-w-none">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-24 rounded" />}>
                <Streamdown>{localizedDetail}</Streamdown>
              </Suspense>
            </div>
          </section>
        )}

        {explanatoryInfographic && (
          <section className="mb-12" aria-labelledby="equipment-infographic-heading">
            <h2 id="equipment-infographic-heading" className="equipment-detail__section-heading text-2xl font-bold mb-5 pb-2 border-b border-gray-100">시술 원리 인포그래픽</h2>
            <figure className="equipment-detail__infographic mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-[#fffdf8] shadow-sm">
              <OptimizedImage
                src={explanatoryInfographic.src}
                alt={explanatoryInfographic.alt}
                width={1440}
                height={1800}
                className="block h-auto w-full"
              />
              <figcaption className="equipment-detail__infographic-caption border-t border-slate-100 bg-white px-5 py-4 text-center text-sm leading-relaxed text-slate-600">
                본 이미지는 시술 원리에 대한 이해를 돕기 위한 자료이며, 적용 방법과 결과는 개인 상태에 따라 달라질 수 있습니다.
              </figcaption>
            </figure>
          </section>
        )}

        {/* 기대 효과 */}
        {localizedEffect && (
          <section className="mb-12">
            <h2 className="equipment-detail__section-heading text-2xl font-bold mb-5 pb-2 border-b border-gray-100">{LABELS.effect}</h2>
            <div className="equipment-detail__prose prose max-w-none">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-24 rounded" />}>
                <Streamdown>{localizedEffect}</Streamdown>
              </Suspense>
            </div>
          </section>
        )}

        {/* 주의사항 */}
        {localizedCaution && (
          <section className="equipment-detail__caution mb-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h2 className="equipment-detail__caution-heading text-xl font-bold text-amber-900 mb-4">{LABELS.caution}</h2>
            <div className="equipment-detail__caution-copy prose max-w-none text-amber-900">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-24 rounded" />}>
                <Streamdown>{localizedCaution}</Streamdown>
              </Suspense>
            </div>
          </section>
        )}

        {managedFaqs.length > 0 && (
          <section className="mb-12" aria-labelledby="equipment-faq-heading">
            <h2 id="equipment-faq-heading" className="equipment-detail__section-heading text-2xl font-bold mb-5 pb-2 border-b border-gray-100">{LABELS.faq}</h2>
            <div className="space-y-3">
              {managedFaqs.map(({ question, answer }, index) => (
                <details key={`${question}-${index}`} className="equipment-detail__faq-item group rounded-xl border px-5 py-4">
                  <summary className="cursor-pointer list-none pr-8 font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-800">
                    <span className="mr-2 text-blue-600" aria-hidden="true">Q.</span>{question}
                  </summary>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700"><span className="mr-2 font-semibold text-blue-600" aria-hidden="true">A.</span>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {positioningFaqs.length > 0 && <LiftingFaqSection lang={lang} />}

        <aside className="equipment-detail__info-card mb-12 rounded-2xl border p-6" aria-labelledby="equipment-detail-quote-heading">
          <h2 id="equipment-detail-quote-heading" className="text-xl font-bold text-slate-900 mb-4">{detailQuote.heading}</h2>
          <dl className="grid gap-4 text-sm leading-relaxed text-slate-700">
            <div><dt className="font-semibold text-slate-900">{detailQuote.locationLabel}</dt><dd>{detailQuote.location}</dd></div>
            <div><dt className="font-semibold text-slate-900">{detailQuote.hoursLabel}</dt><dd>{detailQuote.hours}</dd></div>
            <div><dt className="font-semibold text-slate-900">{detailQuote.providerLabel}</dt><dd>{detailQuote.provider}</dd></div>
            <div><dt className="font-semibold text-slate-900">{detailQuote.painManagementLabel}</dt><dd>{detailQuote.painManagement}</dd></div>
          </dl>
        </aside>

        {/* 추가 이미지 갤러리 */}
        {images.length > 0 && (
          <section className="mb-12">
            <h2 className="equipment-detail__section-heading text-2xl font-bold mb-5 pb-2 border-b border-gray-100">{LABELS.gallery}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {images.map((imgSrc, idx) => (
                <OptimizedImage
                  key={idx}
                  src={imgSrc}
                  alt={`${localizedName} ${LABELS.caseAlt} ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-xl"
                  height={256}
                />
              ))}
            </div>
          </section>
        )}

        {/* YouTube 가이드 영상 */}
        {item.youtubeUrl && (() => {
          const sourceUrl = item.youtubeUrl ?? "";
          const videoId = sourceUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([^?&#/]+)/)?.[1];
          const getEmbedUrl = () => videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : sourceUrl;
          const getWatchUrl = () => videoId ? `https://www.youtube.com/watch?v=${videoId}` : sourceUrl;
          const embedUrl = getEmbedUrl();
          return (
            <section className="equipment-detail__video mt-4 mb-16 py-8 border-t border-b border-gray-100">
              <h2 className="equipment-detail__section-heading text-2xl font-bold mb-8 text-center">{LABELS.video}</h2>
              <div className="md:w-4/5 md:mx-auto">
                <div className="aspect-video rounded-xl overflow-hidden shadow-xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title={localizedName}
                    style={{ border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="equipment-detail__video-caption mt-3 text-sm text-slate-600">
                  <a
                    href={getWatchUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
                  >
                    YouTube
                  </a>
                </p>
              </div>
            </section>
          );
        })()}

        {/* 목록으로 돌아가기 */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setLocation(getBackPath(item.category))}
            className="equipment-detail__back-button px-6 py-3 rounded-xl text-sm font-medium"
          >
            ← {LABELS.backList}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

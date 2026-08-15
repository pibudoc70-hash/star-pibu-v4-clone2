/**
 * TreatmentPage - 시술별 독립 상세 페이지
 * URL: /treatments/:slug
 * SEO: SeoHead로 각 페이지마다 고유 title, description, JSON-LD MedicalProcedure 스키마 적용
 * 다국어: i18nText.ts의 pickLocalized / pickLocalizedFaq 헬퍼로 ko/en/ja/zh 분기
 */
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE, BASE_URL } from "@/components/SeoHead";
import { CLINIC_INFO } from "@/lib/constants";
import { useLang } from "@/contexts/LangContext";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Clock, RefreshCw, CalendarDays, MessageCircle, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { pickLocalized, pickLocalizedFaq } from "@/lib/i18nText";
import type { SupportedLang } from "@/lib/i18nText";
import { getTreatmentBySlug, getAllTreatments } from "@/data/treatments";
import type { TreatmentI18n } from "@/data/treatments";
import { EXTERNAL_BOOKING_URLS } from "@/lib/externalBooking";
import { LIFTING_ANESTHESIA_PREPARATION, LIFTING_FAQS, isPainSensitiveLifting } from "@shared/liftingPositioning";

// ── lang → URL prefix 매핑 ────────────────────────────────────────────────────
const LANG_PREFIX: Record<SupportedLang, string> = {
  ko: "",
  en: "/en",
  ja: "/ja",
  zh: "/zh",
  "zh-TW": "/zh-tw",
};

// ── JSON-LD 구조화 데이터 생성 (MedicalProcedure + FAQ) ──────────────────────
function buildJsonLd(t: TreatmentI18n, lang: SupportedLang, pageUrl: string) {
  const name = pickLocalized(t.name, lang);
  const description = pickLocalized(t.seoDescription, lang);
  const detail = pickLocalized(t.detail, lang);
  const caution = pickLocalized(t.caution, lang);
  const recovery = pickLocalized(t.recovery, lang);
  const bodyLocation = t.schemaBodyLocation ? pickLocalized(t.schemaBodyLocation, lang) : "피부";
  const hasLiftingPainCare = isPainSensitiveLifting(t.slug);

  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": name,
    "alternateName": t.nameEn,
    "description": description,
    "procedureType": "https://schema.org/CosmeticProcedure",
    "image": t.image,
    "url": pageUrl,
    "bodyLocation": bodyLocation,
    "preparation": hasLiftingPainCare ? LIFTING_ANESTHESIA_PREPARATION[lang] : caution,
    "followup": `회복 기간: ${recovery}. ${caution}`,
    "howPerformed": detail,
    "status": "https://schema.org/ActiveActionStatus",
    "provider": {
      "@type": "MedicalBusiness",
      "@id": `${CLINIC_INFO.url}/#organization`,
      "name": CLINIC_INFO.name,
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
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": CLINIC_INFO.geo.latitude,
        "longitude": CLINIC_INFO.geo.longitude,
      },
      "sameAs": [...CLINIC_INFO.sameAs],
    }
  };

  const faqItems = [
    ...pickLocalizedFaq(t.faq, lang),
    ...(hasLiftingPainCare ? LIFTING_FAQS[lang] : []),
  ];
  if (faqItems.length === 0) return [medicalProcedure];

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return [medicalProcedure, faqPage];
}


// ── i18n 레이블 ──────────────────────────────────────────────────────────────
const LABELS = {
  ko: {
    backHome: "홈으로",
    intro: "시술 소개",
    effects: "기대 효과",
    video: "시술 영상",
    caution: "시술 전후 주의사항",
    ctaKakao: "카카오톡 상담",
    ctaCall: "051-818-2300",
    ctaCallIntl: "+82-51-818-2300",
    ctaBook: "예약 신청",
    otherTreatments: "다른 시술 보기",
    recovery: "회복",
    notFound: "시술 정보를 찾을 수 없습니다.",
    notFoundBack: "홈으로 돌아가기",
    faqTitle: "자주 묻는 질문",
  },
  en: {
    backHome: "Back to Home",
    intro: "About This Treatment",
    effects: "Expected Effects",
    video: "Treatment Video",
    caution: "Precautions",
    ctaKakao: "KakaoTalk Consultation",
    ctaCall: "+82-51-818-2300",
    ctaCallIntl: "+82-51-818-2300",
    ctaBook: "Book Now",
    otherTreatments: "Other Treatments",
    recovery: "Recovery",
    notFound: "Treatment information not found.",
    notFoundBack: "Back to Home",
    faqTitle: "Frequently Asked Questions",
  },
  ja: {
    backHome: "ホームへ",
    intro: "施術のご紹介",
    effects: "期待できる効果",
    video: "施術動画",
    caution: "施術前後の注意事項",
    ctaKakao: "LINEで相談",
    ctaCall: "+82-51-818-2300",
    ctaCallIntl: "+82-51-818-2300",
    ctaBook: "予約する",
    otherTreatments: "他の施術を見る",
    recovery: "回復期間",
    notFound: "施術情報が見つかりません。",
    notFoundBack: "ホームへ戻る",
    faqTitle: "よくある質問",
  },
  zh: {
    backHome: "返回首页",
    intro: "治疗介绍",
    effects: "预期效果",
    video: "治疗视频",
    caution: "术前术后注意事项",
    ctaKakao: "微信和误",
    ctaCall: "+82-51-818-2300",
    ctaCallIntl: "+82-51-818-2300",
    ctaBook: "立即预约",
    otherTreatments: "查看其他治疗",
    recovery: "恢复期",
    notFound: "未找到治疗信息。",
    notFoundBack: "返回首页",
    faqTitle: "常见问题",
  },
  "zh-TW": {
    backHome: "返回首頁",
    intro: "療程介紹",
    effects: "預期效果",
    video: "療程影片",
    caution: "療程前後注意事項",
    ctaKakao: "微信談詢",
    ctaCall: "+82-51-818-2300",
    ctaCallIntl: "+82-51-818-2300",
    ctaBook: "立即預約",
    otherTreatments: "查看其他療程",
    recovery: "復原期",
    notFound: "找不到療程資訊。",
    notFoundBack: "返回首頁",
    faqTitle: "常見問題",
  },
} as const;

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function TreatmentPage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { lang } = useLang();
  const slug = params.slug;
  const treatment = getTreatmentBySlug(slug);
  const lbl = LABELS[lang as keyof typeof LABELS] ?? LABELS.ko;
  const currentLang = (lang as SupportedLang) ?? "ko";

  // ── URL / SEO 계산 블록 ─────────────────────────────────────────────────────
  const langPrefix = LANG_PREFIX[currentLang];
  const localizedHomePath = langPrefix || "/";
  const pageUrl = `${BASE_URL}${langPrefix}/treatments/${slug}`;
  const treatmentHreflangs = buildHreflangs(
    `/treatments/${slug}`,
    `/en/treatments/${slug}`,
    `/ja/treatments/${slug}`,
    `/zh/treatments/${slug}`,
  );
  const jsonLdArray = treatment ? buildJsonLd(treatment, currentLang, pageUrl) : null;

  // 시술을 찾지 못한 경우
  if (!treatment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">{lbl.notFound}</p>
        <button type="button"
          onClick={() => setLocation(localizedHomePath)}
          className="flex items-center gap-2 text-[#4A6FA5] hover:underline"
        >
          <ArrowLeft size={16} />
          {lbl.notFoundBack}
        </button>
      </div>
    );
  }

  // 다국어 텍스트 추출
  const treatmentName = pickLocalized(treatment.name, currentLang);
  const treatmentDesc = pickLocalized(treatment.desc, currentLang);
  const treatmentDetail = pickLocalized(treatment.detail, currentLang);
  const treatmentEffect = pickLocalized(treatment.effect, currentLang);
  const treatmentCaution = pickLocalized(treatment.caution, currentLang);
  const treatmentTime = pickLocalized(treatment.time, currentLang);
  const treatmentRecovery = pickLocalized(treatment.recovery, currentLang);
  const treatmentSessions = pickLocalized(treatment.sessions, currentLang);
  const treatmentCategory = pickLocalized(treatment.category, currentLang);
  const treatmentBadge = treatment.badge ? pickLocalized(treatment.badge, currentLang) : undefined;
  const seoTitle = pickLocalized(treatment.seoTitle, currentLang);
  const seoDescription = pickLocalized(treatment.seoDescription, currentLang);
  const seoKeywords = pickLocalized(treatment.seoKeywords, currentLang);
  const faqItems = [
    ...pickLocalizedFaq(treatment.faq, currentLang),
    ...(isPainSensitiveLifting(treatment.slug) ? LIFTING_FAQS[currentLang] : []),
  ];

  const effectItems = treatmentEffect.split(",").map((s) => s.trim()).filter(Boolean);
  const cautionItems = treatmentCaution.split(".").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* ── SeoHead: 페이지별 고유 메타 태그 ── */}
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={pageUrl}
        ogImage={treatment.image}
        ogUrl={pageUrl}
        ogLocale={LANG_TO_OG_LOCALE[currentLang] ?? "ko_KR"}
        hreflangs={treatmentHreflangs}
        jsonLd={jsonLdArray ?? undefined}
        pageType="treatment"
      />

      {/* ── 히어로 배너 ── */}
      <div
        className="relative text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a2a4a 0%, #2D4A7A 60%, #4A6FA5 100%)",
          minHeight: "280px",
        }}
      >
        {/* 배경 이미지 */}
        {treatment.cardBannerImage && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${treatment.cardBannerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="relative container mx-auto px-4 py-12">
          {/* 뒤로가기 */}
        <button type="button"
          onClick={() => setLocation(localizedHomePath)}
          className="inline-flex items-center gap-2 mb-6 text-white/80 hover:text-white transition-colors text-sm"
        >
            <ArrowLeft size={16} />
            {lbl.backHome}
          </button>

          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold tracking-widest mb-2 text-white/70 uppercase">
                {treatmentCategory} · {treatment.nameEn}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{treatmentName}</h1>
              <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl">
                {treatmentDesc}
              </p>
            </div>
            {treatmentBadge && (
              <span
                className="px-4 py-2 rounded-full text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: treatment.badgeColor || "#4A6FA5", opacity: 0.95 }}
              >
                {treatmentBadge}
              </span>
            )}
          </div>

          {/* 핵심 정보 3종 */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Clock size={15} className="text-white/70" />
              <span className="text-sm text-white/90">{treatmentTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <RefreshCw size={15} className="text-white/70" />
              <span className="text-sm text-white/90">{lbl.recovery} {treatmentRecovery}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <CalendarDays size={15} className="text-white/70" />
              <span className="text-sm text-white/90">{treatmentSessions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid md:grid-cols-5 gap-10 mb-14">
          {/* 이미지 */}
          <div className="md:col-span-2">
            <div className="rounded-2xl overflow-hidden bg-gray-50 shadow-md">
              <OptimizedImage
                src={treatment.image}
                alt={`${treatmentName} 시술 이미지`}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ color: "#1F2937" }}>
                {lbl.intro}
              </h2>
              <p className="text-gray-600 leading-relaxed">{treatmentDetail}</p>
            </div>

            {/* 기대 효과 */}
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ color: "#1F2937" }}>
                {lbl.effects}
              </h2>
              <ul className="space-y-2">
                {effectItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#4A6FA5" }} />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* YouTube 영상 */}
        {treatment.youtubeUrl && (
          <div className="mb-14">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#1F2937" }}>
              {lbl.video}
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-md">
              <iframe
                width="100%"
                height="100%"
                src={treatment.youtubeUrl}
                title={`${treatmentName} 시술 영상`}
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* 주의사항 */}
        <div className="mb-14 rounded-2xl p-6 border border-amber-200 bg-amber-50">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "#92400E" }}>
            <AlertCircle size={20} />
            {lbl.caution}
          </h2>
          <ul className="space-y-2">
            {cautionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-amber-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ 섹션 */}
        {faqItems.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xl font-bold mb-6" style={{ color: "#1F2937" }}>
              {lbl.faqTitle}
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-5">
                  <p className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                    <span className="text-[#4A6FA5] font-bold flex-shrink-0">Q.</span>
                    {item.question}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed pl-6">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={currentLang === "ja" ? "https://lin.ee/tyuRdUc" : currentLang === "zh" ? "#wechat" : "https://pf.kakao.com/_HNyGC"}
            target={currentLang === "zh" ? undefined : "_blank"}
            rel={currentLang === "zh" ? undefined : "noopener noreferrer"}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 shadow-md"
            style={{
              background: currentLang === "zh" ? "#07C160" : currentLang === "ja" ? "#06C755" : "#FEE500",
              color: currentLang === "zh" || currentLang === "ja" ? "white" : "#1F2937"
            }}
          >
            <MessageCircle size={20} />
            {lbl.ctaKakao}
          </a>
          <a
            href={currentLang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 shadow-md text-white"
            style={{ background: "linear-gradient(135deg, #2D4A7A 0%, #4A6FA5 100%)" }}
          >
            <span>📞</span>
            {currentLang === "ko" ? lbl.ctaCall : lbl.ctaCallIntl}
          </a>
          <a
            href={EXTERNAL_BOOKING_URLS.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 shadow-md text-white"
            style={{ background: "linear-gradient(135deg, #C8860A 0%, #e6a832 100%)" }}
          >
            <CalendarDays size={20} />
            {lbl.ctaBook}
          </a>
        </div>

        {/* 다른 시술 보기 */}
        <div className="mt-14 pt-10 border-t">
          <h2 className="text-lg font-bold mb-6" style={{ color: "#1F2937" }}>
            {lbl.otherTreatments}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getAllTreatments()
              .filter((t) => t.slug !== slug)
              .map((t) => (
                <button type="button"
                  key={t.slug}
                  onClick={() => setLocation(`${langPrefix}/treatments/${t.slug}`)}
                  className="text-left p-4 rounded-xl border border-gray-200 hover:border-[#4A6FA5] hover:shadow-md transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{pickLocalized(t.category, currentLang)}</p>
                  <p className="font-bold text-gray-800 group-hover:text-[#4A6FA5] transition-colors">
                    {pickLocalized(t.name, currentLang)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pickLocalized(t.desc, currentLang)}</p>
                </button>
              ))}
          </div>
        </div>

        {/* 의료광고 가이드 문구 */}
        <div className="mt-10 p-4 rounded-xl text-xs leading-relaxed" style={{ background: "#F8F9FA", border: "1px solid #E5E7EB", color: "#6B7280" }}>
          <p className="font-semibold mb-1" style={{ color: "#374151" }}>⚠️ 의료광고 안내</p>
          <p>• 시술 효과는 개인의 피부 상태, 생활 습관, 시술 횟수 등에 따라 다를 수 있습니다.</p>
          <p>• 본 페이지의 시술 정보는 일반적인 안내를 목적으로 하며, 실제 진료 결과와 다를 수 있습니다.</p>
          <p>• 정확한 진단과 시술 계획은 전문의 상담 후 결정됩니다.</p>
          <p className="mt-1">• 의료법 제56조(의료광고의 금지 등) 및 관련 규정을 준수합니다.</p>
        </div>
      </div>
    </div>
  );
}

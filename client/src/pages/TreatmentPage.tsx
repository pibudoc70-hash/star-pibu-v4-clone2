/**
 * TreatmentPage - 시술별 독립 상세 페이지
 * URL: /treatments/:slug
 * SEO: react-helmet-async로 각 페이지마다 고유 title, description, JSON-LD MedicalProcedure 스키마 적용
 * view-source 기준으로도 각 URL에 맞는 메타 태그가 보이도록 Helmet 사용
 */
import { Helmet } from "react-helmet-async";
import { useLang } from "@/contexts/LangContext";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Clock, RefreshCw, CalendarDays, MessageCircle, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { TREATMENT_DATA, TreatmentData, FAQItem } from "@/data/treatmentData";

// ── JSON-LD 구조화 데이터 생성 (MedicalProcedure + FAQ) ──────────────────────
function buildJsonLd(t: TreatmentData) {
  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": t.name,
    "alternateName": t.nameEn,
    "description": t.seoDescription,
    "procedureType": "https://schema.org/CosmeticProcedure",
    "image": t.image,
    "url": `https://www.star-pibu.com/treatments/${t.slug}`,
    "bodyLocation": t.schemaBodyLocation || "피부",
    "preparation": t.caution,
    "followup": `회복 기간: ${t.recovery}. ${t.caution}`,
    "howPerformed": t.detail,
    "status": "https://schema.org/ActiveActionStatus",
    "provider": {
      "@type": "MedicalBusiness",
      "name": "스타피부과",
      "url": "https://www.star-pibu.com",
      "telephone": "051-818-2300",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "서면로 74 아이온시티빌딩 4층",
        "addressLocality": "부산진구",
        "addressRegion": "부산광역시",
        "postalCode": "47252",
        "addressCountry": "KR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 35.1567,
        "longitude": 129.0596
      },
      "sameAs": [
        "https://place.naver.com/hospital/12020103",
        "https://www.instagram.com/starpibu",
        "https://www.youtube.com/@starpibu"
      ]
    }
  };

  if (!t.faq || t.faq.length === 0) return [medicalProcedure];

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": t.faq.map(item => ({
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
    ctaKakao: "微信咨询",
    ctaCall: "+82-51-818-2300",
    ctaCallIntl: "+82-51-818-2300",
    ctaBook: "立即预约",
    otherTreatments: "查看其他治疗",
    recovery: "恢复期",
    notFound: "未找到治疗信息。",
    notFoundBack: "返回首页",
    faqTitle: "常见问题",
  },
} as const;

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function TreatmentPage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { lang } = useLang();
  const slug = params.slug;
  const treatment = TREATMENT_DATA[slug];
  const lbl = LABELS[lang as keyof typeof LABELS] ?? LABELS.ko;

  const pageUrl = `https://www.star-pibu.com/treatments/${slug}`;
  const jsonLdArray = treatment ? buildJsonLd(treatment) : null;

  // 시술을 찾지 못한 경우
  if (!treatment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">{lbl.notFound}</p>
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-[#4A6FA5] hover:underline"
        >
          <ArrowLeft size={16} />
          {lbl.notFoundBack}
        </button>
      </div>
    );
  }

  const effectItems = treatment.effect.split(",").map((s) => s.trim()).filter(Boolean);
  const cautionItems = treatment.caution.split(".").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{treatment.seoTitle}</title>
        <meta name="description" content={treatment.seoDescription} />
        <meta name="keywords" content={treatment.seoKeywords} />
        <meta property="og:title" content={treatment.seoTitle} />
        <meta property="og:description" content={treatment.seoDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={treatment.image} />
        <link rel="canonical" href={pageUrl} />
        {jsonLdArray?.map((jsonLd, idx) => (
          <script key={idx} type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* ── 헤더 ──────────────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="container flex items-center justify-between h-16">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-gray-700 hover:text-[#4A6FA5] transition"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">{lbl.backHome}</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">{treatment.name}</h1>
            <div className="w-20" />
          </div>
        </div>

        {/* ── 히어로 섹션 ────────────────────────────────────────────────────────── */}
        <div className="relative w-full h-80 md:h-96 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
          <OptimizedImage
            src={treatment.image}
            alt={treatment.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {treatment.badge && (
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: treatment.badgeColor }}
            >
              {treatment.badge}
            </div>
          )}
        </div>

        {/* ── 메인 콘텐츠 ────────────────────────────────────────────────────────── */}
        <div className="container py-8 md:py-12">
          {/* 기본 정보 */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="p-4 md:p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-[#4A6FA5]" />
                <span className="text-xs md:text-sm font-medium text-gray-600">{lbl.intro}</span>
              </div>
              <p className="text-sm md:text-base font-semibold text-gray-900">{treatment.time}</p>
            </div>
            <div className="p-4 md:p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw size={18} className="text-[#4A6FA5]" />
                <span className="text-xs md:text-sm font-medium text-gray-600">{lbl.recovery}</span>
              </div>
              <p className="text-sm md:text-base font-semibold text-gray-900">{treatment.recovery}</p>
            </div>
            <div className="p-4 md:p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays size={18} className="text-[#4A6FA5]" />
                <span className="text-xs md:text-sm font-medium text-gray-600">Sessions</span>
              </div>
              <p className="text-sm md:text-base font-semibold text-gray-900">{treatment.sessions}</p>
            </div>
          </div>

          {/* 설명 */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{lbl.intro}</h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">{treatment.detail}</p>
          </div>

          {/* 기대 효과 */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{lbl.effects}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {effectItems.map((effect, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{effect}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{lbl.caution}</h2>
            <div className="space-y-3">
              {cautionItems.map((caution, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-orange-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{caution}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 유튜브 영상 */}
          {treatment.youtubeUrl && (
            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{lbl.video}</h2>
              <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={treatment.youtubeUrl}
                  title={treatment.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* FAQ */}
          {treatment.faq && treatment.faq.length > 0 && (
            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{lbl.faqTitle}</h2>
              <div className="space-y-4">
                {treatment.faq.map((item, idx) => (
                  <details key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <summary className="cursor-pointer font-semibold text-gray-900 flex items-center justify-between">
                      {item.question}
                      <ChevronRight size={20} className="text-gray-500" />
                    </summary>
                    <p className="mt-4 text-gray-700 leading-relaxed">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* CTA 버튼 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 md:mb-12">
            <a
              href={`tel:${lang === 'ko' ? '051-818-2300' : '+82-51-818-2300'}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              <MessageCircle size={18} />
              <span className="hidden md:inline">{lbl.ctaCall}</span>
            </a>
            <a
              href="https://pf.kakao.com/_HNyGC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
            >
              <MessageCircle size={18} />
              <span className="hidden md:inline">{lbl.ctaKakao}</span>
            </a>
            <a
              href="#booking"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#4A6FA5] text-white font-semibold rounded-lg hover:bg-[#3a5a8a] transition col-span-2 md:col-span-1"
            >
              <CalendarDays size={18} />
              <span className="hidden md:inline">{lbl.ctaBook}</span>
            </a>
          </div>

          {/* 다른 시술 보기 */}
          <div className="text-center">
            <button
              onClick={() => setLocation("/")}
              className="inline-flex items-center gap-2 text-[#4A6FA5] font-semibold hover:underline"
            >
              {lbl.otherTreatments}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

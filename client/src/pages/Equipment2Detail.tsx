/**
 * Equipment2Detail - 시술 상세 페이지
 * URL: /equipment2/:slug
 * 각 시술별 독립적인 페이지로 SEO 최적화
 */
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE } from "@/components/SeoHead";
import { CLINIC_INFO } from "@/lib/constants";
import { getEquipmentSeoText } from "@/lib/equipmentSeoText";
import { useLang } from "@/contexts/LangContext";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader } from "lucide-react";
import { Streamdown } from "streamdown";
import OptimizedImage from "@/components/OptimizedImage";
import type { Treatment } from "@shared/types";
import { getReservationPath } from "@/lib/reservationPath";

// safe JSON parser
function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

interface TreatmentStep { title: string; description: string; }
interface RelatedTreatment { id?: number; slug: string; name: string; desc?: string; image?: string; }

export default function Equipment2Detail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { lang } = useLang();
  const slug = params.slug as string;
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 시술 목록 조회
  const { data: allTreatments } = trpc.treatments.all.useQuery({ section: "v2" });

  useEffect(() => {
    if (allTreatments && slug) {
      const found = allTreatments.find((t) => t.slug === slug);
      if (found) {
        setTreatment(found);
      } else {
        setLocation("/equipment2");
      }
      setIsLoading(false);
    }
  }, [allTreatments, slug, setLocation]);

  // Commit 25-3: locale별 로딩/not-found 문구
  const LABELS = {
    loading: {
      ko: "로딩 중...",
      en: "Loading...",
      ja: "読み込み中...",
      zh: "加载中...",
    },
    notFound: {
      ko: "시술 정보를 찾을 수 없습니다.",
      en: "Treatment information not found.",
      ja: "施術情報が見つかりませんでした。",
      zh: "未找到该项目信息。",
    },
    time: {
      ko: "시술 시간",
      en: "Duration",
      ja: "施術時間",
      zh: "施术时间",
    },
    recovery: {
      ko: "회복 기간",
      en: "Recovery",
      ja: "回復期間",
      zh: "恢复期",
    },
    sessions: {
      ko: "권장 횟수",
      en: "Recommended Sessions",
      ja: "推奨回数",
      zh: "建议次数",
    },
    book: {
      ko: "예약하기",
      en: "Book Now",
      ja: "予約する",
      zh: "立即预约",
    },
    overview: {
      ko: "시술 소개",
      en: "Treatment Overview",
      ja: "施術のご紹介",
      zh: "项目介绍",
    },
    effect: {
      ko: "기대 효과",
      en: "Expected Results",
      ja: "期待できる効果",
      zh: "预期效果",
    },
    steps: {
      ko: "시술 과정",
      en: "Procedure Steps",
      ja: "施術の流れ",
      zh: "施术步骤",
    },
    caution: {
      ko: "주의사항",
      en: "Precautions",
      ja: "注意事項",
      zh: "注意事项",
    },
    gallery: {
      ko: "시술 사례",
      en: "Before & After",
      ja: "施術事例",
      zh: "施术案例",
    },
    video: {
      ko: "시술 영상",
      en: "Treatment Video",
      ja: "施術動画",
      zh: "施术视频",
    },
    related: {
      ko: "연관 시술",
      en: "Related Treatments",
      ja: "関連施術",
      zh: "相关项目",
    },
  } as const;
  const L = (key: keyof typeof LABELS) => LABELS[key][lang] ?? LABELS[key].ko;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
        <span className="ml-3 text-gray-600">{LABELS.loading[lang]}</span>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">{LABELS.notFound[lang]}</p>
      </div>
    );
  }

  // safe JSON 파싱
  const images = safeParseJson<string[]>(treatment.images, []);
  const relatedTreatments = safeParseJson<RelatedTreatment[]>(treatment.related, []);
  const steps = safeParseJson<TreatmentStep[]>(treatment.steps, []);

  const langPrefix = lang === "ko" ? "" : `/${lang}`;
  const pageUrl = `https://www.star-pibu.com${langPrefix}/equipment2/${slug}`;

  // Commit 25-2: SEO 메타 텍스트를 헬퍼 함수로 위임
  const { title: seoTitle, description: seoDescription, keywords: seoKeywords } =
    getEquipmentSeoText(treatment, lang);
  // Commit 25-4: JSON-LD name/description 언어별 fallback
  const jsonLdName =
    lang === "en" ? (treatment.nameEn || treatment.name)
    : lang === "ja" ? (treatment.nameJa || treatment.nameEn || treatment.name)
    : lang === "zh" ? (treatment.nameZh || treatment.nameEn || treatment.name)
    : treatment.name;
  const jsonLdDesc =
    lang === "en" ? (treatment.descEn || treatment.desc || "")
    : lang === "ja" ? (treatment.descJa || treatment.descEn || treatment.desc || "")
    : lang === "zh" ? (treatment.descZh || treatment.descEn || treatment.desc || "")
    : (treatment.desc || "");

  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": jsonLdName,
    "alternateName": lang === "ko" ? (treatment.nameEn || "") : treatment.name,
    "description": jsonLdDesc,
    "procedureType": "https://schema.org/CosmeticProcedure",
    "image": treatment.image || '',
    "url": pageUrl,
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
    },
    "bodyLocation": "피부",
    "preparation": treatment.caution || '',
    "followup": treatment.recovery || ''
  }];

  return (
    <div className="min-h-screen bg-white">
      {/* SeoHead: 선언적 SEO 메타태그 */}
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={pageUrl}
        ogImage={treatment.image || undefined}
        ogUrl={pageUrl}
        ogLocale={LANG_TO_OG_LOCALE[lang] ?? "ko_KR"}
        hreflangs={buildHreflangs(
          `/equipment2/${slug}`,
          `/en/equipment2/${slug}`,
          `/ja/equipment2/${slug}`,
          `/zh/equipment2/${slug}`
        )}
        jsonLd={jsonLd}
        includeMedicalSchema={false}
      />

      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">
            {lang === "en" ? (treatment.nameEn || treatment.name)
              : lang === "ja" ? (treatment.nameJa || treatment.nameEn || treatment.name)
              : lang === "zh" ? (treatment.nameZh || treatment.nameEn || treatment.name)
              : treatment.name}
          </h1>
          <p className="text-blue-100">
            {lang === "ko" ? (treatment.nameEn || "") : (treatment.name)}
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 이미지 */}
          <div>
            {treatment.image && (
              <OptimizedImage
                src={treatment.image}
                alt={treatment.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* 기본 정보 */}
          <div className="space-y-6">
            {treatment.badge && (
              <div
                className="inline-block px-4 py-2 rounded-full text-white font-semibold"
                style={{ backgroundColor: treatment.badgeColor || "#4A6FA5" }}
              >
                {treatment.badge}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">{L("time")}</h3>
                <p className="text-lg text-gray-900">{treatment.time}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">{L("recovery")}</h3>
                <p className="text-lg text-gray-900">{treatment.recovery}</p>
              </div>

              {treatment.sessions && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">{L("sessions")}</h3>
                  <p className="text-lg text-gray-900">{treatment.sessions}</p>
                </div>
              )}
            </div>

            <button type="button"
              onClick={() => window.location.href = getReservationPath(lang)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {L("book")}
            </button>
          </div>
        </div>

        {/* 상세 설명 */}
        {(lang === "en" ? (treatment.detailEn || treatment.detail) : lang === "ja" ? (treatment.detailJa || treatment.detail) : lang === "zh" ? (treatment.detailZh || treatment.detail) : treatment.detail) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{L("overview")}</h2>
            <div className="prose max-w-none">
              <Streamdown>
                {lang === "en" ? (treatment.detailEn || treatment.detail || "")
                  : lang === "ja" ? (treatment.detailJa || treatment.detail || "")
                  : lang === "zh" ? (treatment.detailZh || treatment.detail || "")
                  : (treatment.detail || "")}
              </Streamdown>
            </div>
          </div>
        )}

        {/* 기대 효과 */}
        {(lang === "en" ? (treatment.effectEn || treatment.effect) : lang === "ja" ? (treatment.effectJa || treatment.effect) : lang === "zh" ? (treatment.effectZh || treatment.effect) : treatment.effect) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{L("effect")}</h2>
            <div className="prose max-w-none">
              <Streamdown>
                {lang === "en" ? (treatment.effectEn || treatment.effect || "")
                  : lang === "ja" ? (treatment.effectJa || treatment.effect || "")
                  : lang === "zh" ? (treatment.effectZh || treatment.effect || "")
                  : (treatment.effect || "")}
              </Streamdown>
            </div>
          </div>
        )}

        {/* 치료 단계 */}
        {steps.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{L("steps")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{idx + 1}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주의사항 */}
        {(lang === "en" ? (treatment.cautionEn || treatment.caution) : lang === "ja" ? (treatment.cautionJa || treatment.caution) : lang === "zh" ? (treatment.cautionZh || treatment.caution) : treatment.caution) && (
          <div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-4">{L("caution")}</h2>
            <div className="prose max-w-none text-yellow-900">
              <Streamdown>
                {lang === "en" ? (treatment.cautionEn || treatment.caution || "")
                  : lang === "ja" ? (treatment.cautionJa || treatment.caution || "")
                  : lang === "zh" ? (treatment.cautionZh || treatment.caution || "")
                  : (treatment.caution || "")}
              </Streamdown>
            </div>
          </div>
        )}

        {/* 추가 이미지 갤러리 */}
        {images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{L("gallery")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {images.map((imgSrc, idx) => (
                <OptimizedImage
                  key={idx}
                  src={imgSrc}
                  alt={`${treatment.name} 사례 ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                  height={256}
                />
              ))}
            </div>
          </div>
        )}

        {/* YouTube 영상 */}
        {treatment.youtubeUrl && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{L("video")}</h2>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={treatment.youtubeUrl}
                title={treatment.name}
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {/* 연관 시술 */}
        {relatedTreatments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{L("related")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTreatments.map((related) => (
                <div
                  key={related.slug}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => setLocation(`/equipment2/${related.slug}`)}
                >
                  {related.image && (
                    <OptimizedImage
                      src={related.image}
                      alt={related.name}
                      className="w-full h-48 object-cover"
                      height={192}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{related.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{related.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Equipment2Detail - 시술 상세 페이지
 * URL: /equipment2/:slug
 * 각 시술별 독립적인 페이지로 SEO 최적화
 *
 * [Round-10 C항목] 전체 목록 조회 후 find(slug) → bySlug 단건 조회로 개선
 * - isLoading / isError / notFound 상태를 명시적으로 분리
 * - useEffect + setState 패턴 제거 (tRPC 쿼리 상태 직접 활용)
 */
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE } from "@/components/SeoHead";
import { CLINIC_INFO } from "@/lib/constants";
import { getEquipmentSeoText } from "@/lib/equipmentSeoText";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader } from "lucide-react";
import { lazy, Suspense, useEffect } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { EXTERNAL_BOOKING_URLS } from "@/lib/externalBooking";
import { getLocalizedUrl } from "@/lib/localizedPath";

// Lazy load Streamdown to avoid bundling it in the initial page load
const Streamdown = lazy(() => import("streamdown").then(m => ({ default: m.Streamdown })));

function hasKatexMarkup(markdown: string) {
  return markdown.includes("\\(") || markdown.includes("\\[") || /(^|[^\\])\$(?=\S)/m.test(markdown);
}

function getYouTubeVideoId(url: string) {
  return url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([^?&#/]+)/)?.[1];
}

function getYouTubeEmbedUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : url;
}

function getYouTubeWatchUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
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
  const { getText } = useLocalizedText();
  const slug = params.slug as string;

  // [C항목] bySlug 단건 조회 — 전체 목록 fetch 후 find() 패턴 제거
  const {
    data: treatment,
    isLoading,
    isError,
  } = trpc.treatments.bySlug.useQuery(
    { slug },
    { enabled: !!slug, retry: 1 }
  );
  const katexContent = treatment
    ? [
        treatment.detail, treatment.detailEn, treatment.detailJa, treatment.detailZh,
        treatment.effect, treatment.effectEn, treatment.effectJa, treatment.effectZh,
        treatment.caution, treatment.cautionEn, treatment.cautionJa, treatment.cautionZh,
      ].filter((value): value is string => typeof value === "string").join("\n")
    : "";
  useKatexCss(katexContent);

  // locale별 UI 레이블 (getText 훅 활용)
  const LABELS = {
    loading:   getText("로딩 중...",       "Loading...",                    "読み込み中...",      "加载中..."),
    notFound:  getText("시술 정보를 찾을 수 없습니다.", "Treatment information not found.", "施術情報が見つかりませんでました。", "未找到该项目信息。"),
    error:     getText("데이터를 불러오는 중 오류가 발생했습니다.", "Failed to load treatment data.", "データの読み込みに失敗しました。", "加载数据时出错。"),
    time:      getText("시술 시간",         "Duration",                      "施術時間",           "施术时间"),
    recovery:  getText("회복 기간",         "Recovery",                      "回復期間",           "恢复期"),
    sessions:  getText("권장 횟수",         "Recommended Sessions",          "推奨回数",           "建议次数"),
    book:      getText("예약하기",          "Book Now",                      "予約する",           "立即预约"),
    overview:  getText("시술 소개",         "Treatment Overview",            "施術のご紹介",       "项目介绍"),
    effect:    getText("기대 효과",         "Expected Results",              "期待できる効果",     "预期效果"),
    steps:     getText("시술 과정",         "Procedure Steps",               "施術の流れ",         "施术步骤"),
    caution:   getText("주의사항",          "Precautions",                   "注意事項",           "注意事项"),
    gallery:   getText("시술 사례",         "Before & After",                "施術事例",           "施术案例"),
    video:     getText("시술 영상",         "Treatment Video",               "施術動画",           "施术视频"),
    videoFallback: getText("영상을 재생할 수 없으면 YouTube에서 보기", "If the video does not play, watch it on YouTube", "動画を再生できない場合はYouTubeで見る", "如无法播放视频，请在 YouTube 观看"),
    related:   getText("연관 시술",         "Related Treatments",            "関連施術",           "相关项目"),
    bodyLoc:   getText("피부",             "Skin",                          "皮膚",               "皮肤"),
    caseAlt:   getText("사례",             "case",                          "事例",               "案例"),
  } as const;

  // ── 로딩 상태 ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
        <span className="ml-3 text-gray-600">{LABELS.loading}</span>
      </div>
    );
  }

  // ── 에러 상태 ──────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600">{LABELS.error}</p>
        <button
          type="button"
          onClick={() => setLocation("/equipment2")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {getText("목록으로 돌아가기", "Back to list", "一覧に戻る", "返回列表")}
        </button>
      </div>
    );
  }

  // ── notFound 상태 (쿼리 성공했지만 slug에 해당하는 데이터 없음) ──────────
  if (!treatment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-600">{LABELS.notFound}</p>
        <button
          type="button"
          onClick={() => setLocation("/equipment2")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {getText("목록으로 돌아가기", "Back to list", "一覧に戻る", "返回列表")}
        </button>
      </div>
    );
  }

  // safe JSON 파싱
  const images = safeParseJson<string[]>(treatment.images, []);
  const relatedTreatments = safeParseJson<RelatedTreatment[]>(treatment.related, []);
  const steps = safeParseJson<TreatmentStep[]>(treatment.steps, []);

  // [R11-F] langPrefix 인라인 삼항 → getLocalizedUrl 유틸로 교체
  const pageUrl = getLocalizedUrl(lang, `/equipment2/${slug}`);

  // 다국어 이름/설명 (getText 훅 활용)
  const localizedName = getText(treatment.name, treatment.nameEn, treatment.nameJa, treatment.nameZh);
  const localizedDesc = getText(treatment.desc ?? "", treatment.descEn, treatment.descJa, treatment.descZh);
  const localizedDetail = getText(treatment.detail ?? "", treatment.detailEn, treatment.detailJa, treatment.detailZh);
  const localizedEffect = getText(treatment.effect ?? "", treatment.effectEn, treatment.effectJa, treatment.effectZh);
  const localizedCaution = getText(treatment.caution ?? "", treatment.cautionEn, treatment.cautionJa, treatment.cautionZh);

  // SEO 메타 텍스트
  const { title: seoTitle, description: seoDescription, keywords: seoKeywords } =
    getEquipmentSeoText(treatment, lang);

  // JSON-LD name/description 언어별 fallback
  const jsonLdAlternateName = lang === "ko" ? (treatment.nameEn || "") : treatment.name;

  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": localizedName,
    "alternateName": jsonLdAlternateName,
    "description": localizedDesc,
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
    "bodyLocation": LABELS.bodyLoc,
    "preparation": localizedCaution,
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
        pageType="treatment"
      />

      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{localizedName}</h1>
          <p className="text-blue-100">
            {getText(treatment.nameEn || "", treatment.name, treatment.name, treatment.name)}
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
                alt={localizedName}
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
                <h3 className="text-sm font-semibold text-gray-600 mb-1">{LABELS.time}</h3>
                <p className="text-lg text-gray-900">{treatment.time}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">{LABELS.recovery}</h3>
                <p className="text-lg text-gray-900">{treatment.recovery}</p>
              </div>

              {treatment.sessions && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">{LABELS.sessions}</h3>
                  <p className="text-lg text-gray-900">{treatment.sessions}</p>
                </div>
              )}
            </div>

            <a
              href={EXTERNAL_BOOKING_URLS.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {LABELS.book}
            </a>
          </div>
        </div>

        {/* 상세 설명 */}
        {localizedDetail && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{LABELS.overview}</h2>
            <div className="prose max-w-none">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-24 rounded" />}>
                <Streamdown>{localizedDetail}</Streamdown>
              </Suspense>
            </div>
          </div>
        )}

        {/* 기대 효과 */}
        {localizedEffect && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{LABELS.effect}</h2>
            <div className="prose max-w-none">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-24 rounded" />}>
                <Streamdown>{localizedEffect}</Streamdown>
              </Suspense>
            </div>
          </div>
        )}

        {/* 치료 단계 */}
        {steps.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{LABELS.steps}</h2>
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
        {localizedCaution && (
          <div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-4">{LABELS.caution}</h2>
            <div className="prose max-w-none text-yellow-900">
              <Suspense fallback={<div className="animate-pulse bg-yellow-200 h-24 rounded" />}>
                <Streamdown>{localizedCaution}</Streamdown>
              </Suspense>
            </div>
          </div>
        )}

        {/* 추가 이미지 갤러리 */}
        {images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{LABELS.gallery}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {images.map((imgSrc, idx) => (
                <OptimizedImage
                  key={idx}
                  src={imgSrc}
                  alt={`${localizedName} ${LABELS.caseAlt} ${idx + 1}`}
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
            <h2 className="text-2xl font-bold mb-4">{LABELS.video}</h2>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(treatment.youtubeUrl)}
                title={localizedName}
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
            <p className="mt-3 text-sm text-slate-600">
              <a
                href={getYouTubeWatchUrl(treatment.youtubeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
              >
                {LABELS.videoFallback}
              </a>
            </p>
          </div>
        )}

        {/* 연관 시술 */}
        {relatedTreatments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{LABELS.related}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTreatments.map((related) => (
                <button
                  type="button"
                  key={related.slug}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
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
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

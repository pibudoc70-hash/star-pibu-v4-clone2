/**
 * EventDetail Page - STAR 피부과
 * 디자인: 모던 클리니컬 엣지 - 민트-네이비 듀오톤
 * 이벤트 상세 페이지 - /events/:id (DB 연동)
 */
import { useEffect } from "react";
import { toast } from "sonner";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Calendar, Eye, Tag, Zap, Sparkles, Bell, MessageCircle, Phone, MapPin, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";
import { withVersion } from "@/lib/imageUrl";
import SeoHead, { BASE_URL, SITE_NAME_LOCALIZED, OG_IMAGE_LOCALIZED, LANG_TO_OG_LOCALE, buildHreflangs, buildEventJsonLd, buildBreadcrumbJsonLd } from "@/components/SeoHead";
import { parseEventError } from "@/lib/errorMessages";

const KAKAO_URL = "https://pf.kakao.com/_HNyGC";

function IconByType({ type, size = 20 }: { type?: string; size?: number }) {
  if (type === "zap") return <Zap size={size} />;
  if (type === "sparkles") return <Sparkles size={size} />;
  if (type === "bell") return <Bell size={size} />;
  return <Tag size={size} />;
}

export default function EventDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { t, lang } = useLang();
  const ed = t.eventDetail;
  const eventId = parseInt(params.id, 10);

  // tRPC 쿼리로 이벤트 데이터 로드
  const { data: event, isLoading, error } = trpc.events.getById.useQuery({ id: eventId });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [params.id]);

  // 에러 발생 시 토스트 알림 — NOT_FOUND는 별도 화면, 그 외는 토스트
  useEffect(() => {
    if (!error) return;
    const trpcCode = (error.data as { code?: string } | undefined)?.code ?? "";
    const isNotFound = trpcCode === "NOT_FOUND" || (error.message ?? "").includes("NOT_FOUND");
    if (!isNotFound) {
      toast.error(parseEventError(error, lang), { duration: 5000 });
    }
  }, [error, lang]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7FA]">
        <Loader2 className="animate-spin text-[#4A6FA5] mb-3" size={32} />
        <p className="text-[#6B7280]">{ed.loading}</p>
      </div>
    );
  }

  // NOT_FOUND: 전용 안내 화면
  const isNotFoundError = (() => {
    if (!error) return false;
    const trpcCode = (error.data as { code?: string } | undefined)?.code ?? "";
    return trpcCode === "NOT_FOUND" || (error.message ?? "").includes("NOT_FOUND");
  })();

  if (isNotFoundError || (!event && !isLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7FA]">
        <p className="text-[#4A6FA5] text-lg font-semibold mb-4">{ed.notFound}</p>
        <button type="button"
          onClick={() => navigate("/#events")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A6FA5] text-white text-sm font-medium hover:bg-[#2D4A7A] transition-colors"
        >
          <ArrowLeft size={16} /> {ed.backToList}
        </button>
      </div>
    );
  }

  if (!event) return null;

  const accentColor = event.accent ?? "#4A6FA5";
  const accentDark = event.accentDark ?? "#2D4A7A";

  // 다국어 OG 메타 태그용 값 계산
  const eventTitle =
    (lang === "en" ? (event as Record<string, unknown>).titleEn as string | undefined :
     lang === "ja" ? (event as Record<string, unknown>).titleJa as string | undefined :
     lang === "zh" ? (event as Record<string, unknown>).titleZh as string | undefined :
     undefined) ?? event.title;
  const eventDesc =
    (lang === "en" ? (event as Record<string, unknown>).descriptionEn as string | undefined :
     lang === "ja" ? (event as Record<string, unknown>).descriptionJa as string | undefined :
     lang === "zh" ? (event as Record<string, unknown>).descriptionZh as string | undefined :
     undefined) ?? event.desc ?? event.content ?? "";
  const ogLocale = LANG_TO_OG_LOCALE[lang] ?? "ko_KR";
  const siteName = SITE_NAME_LOCALIZED[lang] ?? SITE_NAME_LOCALIZED.ko;
  const ogImg = event.imageUrl ?? OG_IMAGE_LOCALIZED[lang] ?? OG_IMAGE_LOCALIZED.ko;
  const koPath = `/events/${eventId}`;

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col">
      <SeoHead
        title={`${eventTitle} | ${siteName}`}
        description={String(eventDesc).slice(0, 160)}
        canonical={`${BASE_URL}${lang === "ko" ? koPath : `/${lang}${koPath}`}`}
        ogImage={ogImg}
        ogSiteName={siteName}
        ogLocale={ogLocale}
        ogLocaleAlternates={((["ko_KR", "en_US", "ja_JP", "zh_CN"] as const).filter((l) => l !== ogLocale))}
        ogType="article"
        hreflangs={buildHreflangs(koPath, `/en${koPath}`, `/ja${koPath}`, `/zh${koPath}`)}
        pageType="treatment"
        jsonLd={[
          buildEventJsonLd({
            name: eventTitle,
            description: String(eventDesc).slice(0, 300),
            url: `${BASE_URL}${lang === "ko" ? koPath : `/${lang}${koPath}`}`,
            ...(ogImg && { image: ogImg }),
            startDate: (event as Record<string, unknown>).startDate as string | undefined,
            endDate: (event as Record<string, unknown>).endDate as string | undefined,
          }),
          buildBreadcrumbJsonLd([
            { name: lang === "en" ? "Home" : lang === "ja" ? "ホーム" : lang === "zh" ? "首页" : "홈", url: BASE_URL + "/" },
            { name: lang === "en" ? "Events" : lang === "ja" ? "イベント" : lang === "zh" ? "活动" : "이벤트", url: `${BASE_URL}/events` },
            { name: eventTitle, url: `${BASE_URL}${koPath}` },
          ]),
        ]}
      />
      <Header />

      {/* ── 히어로 배너 ── */}
      <section
        className="relative pt-24 pb-12 overflow-hidden"
        style={{ background: event.accentBg ?? "linear-gradient(135deg, #EEF2FA 0%, #D6E1F5 100%)" }}
      >
        {/* 장식 원 */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-0 left-8 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: accentDark }}
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          {/* 뒤로가기 버튼 */}
          <button type="button"
            onClick={() => navigate("/#events")}
            className="flex items-center gap-2 text-sm font-semibold mb-6 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
            style={{ color: accentColor }}
          >
            <ArrowLeft size={16} /> {ed.backToList}
          </button>

          {/* 배지 + 제목 */}
          <div className="mb-6">
            {event.badge && (
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white mb-3"
                style={{ backgroundColor: event.badgeColor || accentColor }}
              >
                {event.badge}
              </span>
            )}
            <h1
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{ color: accentColor }}
            >
              {event.title}
            </h1>
            <p className="text-lg text-[#6B7280]">{event.subtitle}</p>
          </div>

          {/* 메타 정보 */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2" style={{ color: accentColor }}>
              <Calendar size={16} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B7280]">
              <Eye size={16} />
              <span>{ed.views} {event.views}</span>
            </div>
            {event.tag && (
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Tag size={16} />
                <span>{event.tag}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 메인 콘텐츠 ── */}
      <section className="flex-1 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* 이미지 */}
          {event.imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
              <OptimizedImage
                src={withVersion(event.imageUrl, event.updatedAt)}
                alt={event.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* 설명 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm border border-[#E5E7EB]">
            <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
              {ed.intro}
            </h2>
            <p className="text-[#4B5563] leading-relaxed whitespace-pre-wrap">
              {event.content}
            </p>
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: accentColor }}
            >
              <MessageCircle size={18} />
              {ed.cta_kakao}
            </a>
            <a
              href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border-2"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              <Phone size={18} />
              {ed.cta_call}
            </a>
          </div>

          {/* 위치 정보 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E5E7EB]">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: accentColor }}>
              <MapPin size={20} />
              {ed.directions}
            </h3>
            <p className="text-[#6B7280] mb-2">{ed.address}</p>
            <p className="text-[#6B7280] mb-4">{ed.tel}</p>
            <button type="button"
              onClick={() => navigate("/#contact")}
              className="px-4 py-2 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
              {ed.viewMap}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

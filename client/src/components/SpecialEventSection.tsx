/**
 * SpecialEventSection - SPECIAL EVENT 섹션
 *
 * 리팩토링 내역:
 * - 모바일: EventTableMobile (하나의 카드에 모든 시술 목록 + 상세 모달)
 * - 데스크톱: EventCard 그리드 (기존 카드 레이아웃 유지)
 */
import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedEvent, type SpecialEvent } from "@/hooks/useLocalizedEvent";
import { i18n } from "@/lib/i18n";
import EventCard from "@/components/events/EventCard";
import EventTableMobile from "@/components/events/EventTableMobile";
import { parseEventListError } from "@/lib/errorMessages";

// ── Empty State ───────────────────────────────────────────────────────────────
function EventEmptyState({ lang }: { lang: string }) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full mb-2 event-empty-icon-wrap"
      >
        <Sparkles size={28} className="text-brand-gold" strokeWidth={1.5} />
      </div>
      <p className="text-lg font-medium text-brand">
        {i18n[lang as keyof typeof i18n]?.events.specialEmptyTitle}
      </p>
      <p className="text-sm text-brand-mid">
        {i18n[lang as keyof typeof i18n]?.events.specialEmptyDesc}
      </p>
    </div>
  );
}

// ── 섹션 헤더 ─────────────────────────────────────────────────────────────────
function SectionHeader({ lang }: { lang: string }) {
  const subtitleMap: Record<string, React.ReactNode> = {
    en: "Experience premium skin care at Star's exclusive prices.",
    ja: "スターの特別価格で、ワンランク上のスキンケアを。",
    zh: "以STAR独家优惠价，享受顶级皮肤护理。",
    ko: <><span>스타만의 특별한 가격으로,</span><br /><span>한 단계 높은 피부 관리를 시작해보세요.</span></>,
  };
  return (
    <div className="section-header-block">
      <span className="section-eyebrow font-montserrat">FOR YOU</span>
      <h2 className="section-title">SPECIAL EVENT</h2>
      <div className="star-divider mx-auto" />
      <p className="section-subtitle">
        {subtitleMap[lang] ?? subtitleMap.ko}
      </p>
    </div>
  );
}

// ── 스켈레톤 카드 ─────────────────────────────────────────────────────────────
function EventCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden${index > 0 ? ' hidden md:block' : ''}`}
      style={{
        background: '#ffffff',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        border: '1px solid color-mix(in srgb, var(--color-gold-primary) 20%, transparent)',
      }}
      aria-hidden="true"
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/2' }}>
        <div className="skeleton-shimmer absolute inset-0" />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.22) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10px', left: '12px',
          height: '22px', width: '4rem', borderRadius: '4px',
          background: 'color-mix(in srgb, var(--color-gold-primary) 55%, transparent)',
        }} />
      </div>
      <div className="p-4 md:p-5 flex flex-col gap-2.5">
        <div style={{ height: '11px', width: '3.2rem', borderRadius: '999px', background: 'color-mix(in srgb, var(--color-gold-primary) 35%, transparent)' }} />
        <div className="skeleton-shimmer rounded" style={{ height: '19px', width: '80%', animationDelay: `${index * 0.08 + 0.06}s` }} />
        <div className="flex items-center gap-2 mt-0.5">
          <div className="skeleton-shimmer rounded" style={{ height: '13px', width: '3rem', animationDelay: `${index * 0.08 + 0.12}s` }} />
          <div style={{ height: '13px', width: '3.5rem', borderRadius: '4px', background: 'color-mix(in srgb, var(--color-gold-primary) 30%, transparent)' }} />
        </div>
        <div className="skeleton-shimmer rounded" style={{ height: '13px', width: '55%', animationDelay: `${index * 0.08 + 0.16}s` }} />
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function SpecialEventSection() {
  const { lang, t } = useLang();
  const { getLocalizedText } = useLocalizedEvent();
  const { data: specialEvents = [], isLoading, error, refetch } = trpc.events.special.useQuery({ lang });
  const [showMore, setShowMore] = useState(false);

  // 에러 발생 시 토스트 알림
  useEffect(() => {
    if (!error) return;
    toast.error(parseEventListError(error, lang), { duration: 5000 });
  }, [error, lang]);

  if (isLoading) {
    return (
      <section className="py-20 md:py-28 section-bg-offwhite" aria-label="스페셜 이벤트" aria-busy="true">
        <div className="container">
          <SectionHeader lang={lang} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start">
            <EventCardSkeleton index={0} />
            <EventCardSkeleton index={1} />
            <EventCardSkeleton index={2} />
          </div>
        </div>
      </section>
    );
  }

  // 에러 상태: 재시도 버튼 표시
  if (error && (specialEvents as SpecialEvent[]).length === 0) {
    const retryLabel: Record<string, string> = {
      ko: "다시 시도",
      en: "Retry",
      ja: "再試行",
      zh: "重试",
    };
    return (
      <section id="events" className="py-20 md:py-28 section-bg-offwhite" aria-label="스페셜 이벤트">
        <div className="container">
          <SectionHeader lang={lang} />
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <p className="text-base text-brand-mid">{parseEventListError(error, lang)}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "var(--color-gold-primary)" } as React.CSSProperties}
            >
              <RefreshCw size={15} />
              {retryLabel[lang] ?? retryLabel.ko}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const allEvents = specialEvents as SpecialEvent[];
  const visibleDesktopEvents = showMore ? allEvents : allEvents.slice(0, 6);
  const hasMoreDesktop = allEvents.length > 6;

  return (
    <section id="events" className="py-20 md:py-28 section-bg-offwhite" aria-label="스페셜 이벤트">
      <div className="container">
        <SectionHeader lang={lang} />
        {allEvents.length === 0 ? (
          <EventEmptyState lang={lang} />
        ) : (
          <>
            {/* 모바일: 하나의 카드에 모든 시술 목록 + 상세 모달 */}
            <div className="md:hidden">
              <EventTableMobile
                events={allEvents}
                getLocalizedText={getLocalizedText}
              />
            </div>

            {/* 데스크톱: 카드 그리드 */}
            <div className="hidden md:grid grid-cols-3 gap-12 items-start">
              {visibleDesktopEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  getLocalizedText={getLocalizedText}
                />
              ))}
            </div>

            {/* 데스크톱 더보기 버튼 */}
            {hasMoreDesktop && (
              <div className="hidden md:flex justify-center mt-10">
                <button
                  type="button"
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: "var(--color-gold-primary)" } as React.CSSProperties}
                >
                  {showMore ? (
                    <>
                      {lang === "ko" ? "접기" : lang === "en" ? "Show Less" : lang === "ja" ? "閉じる" : "隐藏"}
                      <ChevronDown size={18} className="rotate-180" />
                    </>
                  ) : (
                    <>
                      {lang === "ko" ? "더보기" : lang === "en" ? "Show More" : lang === "ja" ? "もっと見る" : "更多"}
                      <ChevronDown size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

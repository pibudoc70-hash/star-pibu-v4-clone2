/**
 * SpecialEventSection - SPECIAL EVENT 섹션
 *
 * 리팩토링 내역:
 * - 모바일: EventTableMobile (하나의 카드에 모든 시술 목록 + 상세 모달)
 * - 데스크톱: 동일 규격의 3열 이벤트 쇼케이스 카드
 */
import { useEffect, useRef, useState, type RefObject } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedEvent, type SpecialEvent } from "@/hooks/useLocalizedEvent";
import { i18n } from "@/lib/i18n";
import EventCard from "@/components/events/EventCard";
import EventTableMobile from "@/components/events/EventTableMobile";
import PainManagementGuide from "@/components/PainManagementGuide";
import { parseEventListError } from "@/lib/errorMessages";
import { useEventSkeletonTiming } from "@/hooks/useEventSkeletonTiming";

/** 뷰포트 근접 시점까지 데이터 조회를 미뤄 초기 홈 요청을 줄인다. */
function useVisibleFetch(rootMargin = "300px 0px"): [RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement>(null!);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return [ref, visible];
}

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
    "zh-TW": "以STAR獨家優惠價，享受頂級皮膚護理。",
    ko: (
      <>
        <span className="hidden md:inline md:whitespace-nowrap">스타만의 특별한 가격으로 한 단계 높은 피부 관리를 시작해보세요.</span>
        <span className="md:hidden">스타만의 특별한 가격으로,<br />한 단계 높은 피부 관리를 시작해보세요.</span>
      </>
    ),
  };
  return (
    <div className="section-header-block !text-left md:!mx-auto md:!max-w-[720px] md:!text-center">
      <span className="section-eyebrow font-montserrat">FOR YOU</span>
      <h2 className="section-title">SPECIAL EVENT</h2>
      <p className="section-subtitle body-text !mx-0 mt-5 md:!mx-auto md:whitespace-nowrap">
        {subtitleMap[lang] ?? subtitleMap.ko}
      </p>
    </div>
  );
}

// ── 스켈레톤 카드 ─────────────────────────────────────────────────────────────
function EventCardSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div
        className="flex min-h-14 items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--color-gold-primary)_20%,transparent)] px-4 py-3"
        aria-hidden="true"
      >
        <div className="skeleton-shimmer h-4 w-2/5 rounded" />
        <div className="skeleton-shimmer h-4 w-20 rounded" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--color-white, #ffffff)',
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
        <div className="skeleton-shimmer rounded" style={{ height: '19px', width: '80%' }} />
        <div className="flex items-center gap-2 mt-0.5">
          <div className="skeleton-shimmer rounded" style={{ height: '13px', width: '3rem' }} />
          <div style={{ height: '13px', width: '3.5rem', borderRadius: '4px', background: 'color-mix(in srgb, var(--color-gold-primary) 30%, transparent)' }} />
        </div>
        <div className="skeleton-shimmer rounded" style={{ height: '13px', width: '55%' }} />
      </div>
    </div>
  );
}

function MobileEventListSkeleton() {
  return (
    <div
      data-testid="mobile-event-list-skeleton"
      className="rounded-2xl overflow-hidden border md:hidden"
      style={{
        borderColor: "var(--color-gold-light)",
        background: "var(--brand-bg-card, #FDFAF7)",
      }}
      aria-hidden="true"
    >
      <div
        className="flex items-center gap-2 px-5 py-4 border-b"
        style={{
          borderColor: "var(--color-gold-light)",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--color-gold-primary) 12%, transparent) 0%, color-mix(in srgb, var(--color-gold-primary) 4%, transparent) 100%)",
        }}
      >
        <div className="h-3.5 w-3.5 rounded-full" style={{ background: "color-mix(in srgb, var(--color-gold-primary) 45%, transparent)" }} />
        <div className="skeleton-shimmer h-3 w-24 rounded" />
      </div>
      <div className="divide-y" style={{ borderColor: "var(--color-gold-light)" }}>
        {[0, 1, 2].map((index) => (
          <div key={index} data-testid="mobile-event-list-skeleton-row" className="flex items-center gap-3 px-5 py-4">
            <div className="skeleton-shimmer h-4 w-2/5 rounded" />
            <div className="skeleton-shimmer ml-auto h-11 w-11 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function SpecialEventSection() {
  const { lang } = useLang();
  const { getLocalizedText } = useLocalizedEvent();
  const [fetchRef, isFetchVisible] = useVisibleFetch();
  const { data: specialEvents = [], isLoading, error, refetch } = trpc.events.special.useQuery(
    { lang },
    { enabled: isFetchVisible, staleTime: 10 * 60 * 1000 },
  );
  const allEvents = specialEvents as SpecialEvent[];
  const isInitialSkeletonVisible = !isFetchVisible || isLoading;
  useEventSkeletonTiming(isInitialSkeletonVisible);

  // 에러 발생 시 토스트 알림
  useEffect(() => {
    if (!error) return;
    toast.error(parseEventListError(error, lang), { duration: 5000 });
  }, [error, lang]);

  if (isInitialSkeletonVisible) {
    return (
      <section id="events" className="py-20 md:py-28 scroll-mt-24 md:scroll-mt-40" aria-label="스페셜 이벤트" aria-busy="true">
        <span ref={fetchRef} aria-hidden="true" />
        <div className="container">
          <SectionHeader lang={lang} />
          <MobileEventListSkeleton />
          <div className="hidden md:grid md:grid-cols-3 md:gap-6">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
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
      "zh-TW": "重試",
    };
    return (
      <section id="events" className="py-20 md:py-28 scroll-mt-24 md:scroll-mt-40" aria-label="스페셜 이벤트">
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

  return (
    <section id="events" className="py-20 md:py-28 scroll-mt-24 md:scroll-mt-40" aria-label="스페셜 이벤트">
      <span ref={fetchRef} aria-hidden="true" />
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
            {/* 데스크톱: 모든 이벤트를 동일한 정보 밀도의 3열 카드로 표시 */}
            <div data-testid="special-event-desktop-grid" className="hidden md:grid md:auto-rows-fr md:grid-cols-3 md:gap-6">
              {allEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  getLocalizedText={getLocalizedText}
                  variant="showcase"
                />
              ))}
            </div>
            <PainManagementGuide lang={lang} presentation="event-accordion" />
            <div className="mt-10 hidden md:block">
              <PainManagementGuide lang={lang} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

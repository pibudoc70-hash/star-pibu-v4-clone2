/**
 * SpecialEventSection - SPECIAL EVENT 섹션
 *
 * 리팩토링 내역:
 * - 모바일: EventTableMobile (하나의 카드에 모든 시술 목록 + 상세 모달)
 * - 데스크톱: 우측 이벤트 선택 목록 + 좌측 hover/focus 연동 상세 패널
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
    ko: <><span>스타만의 특별한 가격으로,</span><br /><span>한 단계 높은 피부 관리를 시작해보세요.</span></>,
  };
  return (
    <div className="section-header-block !text-left">
      <span className="section-eyebrow font-montserrat">FOR YOU</span>
      <h2 className="section-title">SPECIAL EVENT</h2>
      <p className="section-subtitle !mx-0">
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

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function SpecialEventSection() {
  const { lang } = useLang();
  const { getLocalizedText } = useLocalizedEvent();
  const [fetchRef, isFetchVisible] = useVisibleFetch();
  const { data: specialEvents = [], isLoading, error, refetch } = trpc.events.special.useQuery(
    { lang },
    { enabled: isFetchVisible, staleTime: 10 * 60 * 1000 },
  );
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const isInitialSkeletonVisible = !isFetchVisible || isLoading;
  useEventSkeletonTiming(isInitialSkeletonVisible);

  // 에러 발생 시 토스트 알림
  useEffect(() => {
    if (!error) return;
    toast.error(parseEventListError(error, lang), { duration: 5000 });
  }, [error, lang]);

  if (isInitialSkeletonVisible) {
    return (
      <section id="events" className="py-20 md:py-28 scroll-mt-24 md:scroll-mt-40" aria-label="스페셔 이벤트" aria-busy="true">
        <span ref={fetchRef} aria-hidden="true" />
        <div className="container">
          <SectionHeader lang={lang} />
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5"><EventCardSkeleton /></div>
            <div className="hidden overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-gold-primary)_20%,transparent)] bg-white md:col-span-7 md:block">
              <EventCardSkeleton compact />
              <EventCardSkeleton compact />
              <EventCardSkeleton compact />
            </div>
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
      <section id="events" className="py-20 md:py-28 scroll-mt-24 md:scroll-mt-40" aria-label="스페셔 이벤트">
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
  const desktopEvents = allEvents;
  const selectedEvent = allEvents.find((event) => event.id === selectedEventId) ?? allEvents[0];
  const compactHintMap: Record<string, { title: string; hint: string }> = {
    ko: {
      title: "이벤트 선택",
      hint: "항목에 커서를 올리거나 선택해 상세 조건을 확인하세요. 모든 이벤트 금액은 VAT 포함입니다.",
    },
    en: {
      title: "Select an event",
      hint: "Hover over or select a row to view details. All event prices include VAT.",
    },
    ja: {
      title: "イベントを選択",
      hint: "行にカーソルを合わせるか選択して詳細をご確認ください。すべての料金はVAT込みです。",
    },
    zh: {
      title: "选择活动",
      hint: "悬停或点击条目查看详情。所有活动价格均含增值税。",
    },
    "zh-TW": {
      title: "選擇活動",
      hint: "將游標移至項目上或點選查看詳細內容。所有活動價格均含增值稅。",
    },
  };
  const compactHint = compactHintMap[lang] ?? compactHintMap.ko;

  return (
    <section id="events" className="py-20 md:py-28 scroll-mt-24 md:scroll-mt-40" aria-label="스페셔 이벤트">
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

             {/* 데스크톱: 우측 목록의 hover/focus 선택 이벤트를 좌측 패널에 표시 */}
             <div data-testid="event-compact-context" className="mb-3 hidden items-end justify-between gap-4 md:flex">
               <div>
                 <p className="text-sm font-semibold text-brand">{compactHint.title}</p>
                 <p data-testid="event-compact-hint" className="mt-1 max-w-md text-xs leading-relaxed text-brand-mid">
                   {compactHint.hint}
                 </p>
               </div>
               <span data-testid="event-vat-notice" className="shrink-0 text-xs font-medium text-brand-mid">VAT 포함</span>
             </div>
             <div className="hidden md:grid md:grid-cols-12 md:items-start md:gap-8">
              {selectedEvent && (
                <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
                  <div key={selectedEvent.id} className="event-card__preview">
                    <EventCard
                      event={selectedEvent}
                      getLocalizedText={getLocalizedText}
                      variant="lead"
                      alwaysExpanded
                      previewPanelId="special-event-desktop-preview"
                    />
                  </div>
                </div>
              )}
              <div className="md:col-span-7">
                <div className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-gold-primary)_20%,transparent)] bg-white">
                  {desktopEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      getLocalizedText={getLocalizedText}
                      variant="selector"
                      isSelected={selectedEvent?.id === event.id}
                      onPreview={() => setSelectedEventId(event.id)}
                      previewPanelId="special-event-desktop-preview"
                    />
                  ))}
                </div>
              </div>
            </div>

          </>
        )}
        <div className="mt-10">
          <PainManagementGuide lang={lang} />
        </div>
      </div>
    </section>
  );
}

import EventCard from "@/components/events/EventCard";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedEvent, type SpecialEvent } from "@/hooks/useLocalizedEvent";
import { trpc } from "@/lib/trpc";

const MOBILE_EVENT_PAGE_COPY = {
  ko: { empty: "현재 진행 중인 이벤트가 없습니다.", retry: "다시 시도" },
  en: { empty: "There are no current events.", retry: "Retry" },
  ja: { empty: "現在 진행中のイベントはありません。", retry: "再試行" },
  zh: { empty: "目前没有正在进行的活动。", retry: "重试" },
  "zh-TW": { empty: "目前沒有正在進行的活動。", retry: "重試" },
} as const;

/**
 * Standalone /event mobile presentation.
 *
 * The homepage retains its compact event accordion. This page instead
 * uses the existing showcase card renderer, keeping every event image and price
 * table visible with the same shared event data used by the desktop grid.
 */
export default function EventPageMobileCards() {
  const { lang } = useLang();
  const { getLocalizedText } = useLocalizedEvent();
  const { data: specialEvents = [], isLoading, error, refetch } = trpc.events.special.useQuery(
    { lang },
    { staleTime: 10 * 60 * 1000 },
  );
  const events = specialEvents as SpecialEvent[];
  const copy = MOBILE_EVENT_PAGE_COPY[lang] ?? MOBILE_EVENT_PAGE_COPY.ko;

  if (isLoading) {
    return (
      <div data-testid="event-page-mobile-card-list" aria-busy="true" className="event-page-mobile-card-list">
        {[0, 1, 2].map((index) => (
          <div key={index} aria-hidden="true" className="event-page-mobile-card-skeleton">
            <div className="skeleton-shimmer aspect-[3/2] w-full" />
            <div className="space-y-3 p-5">
              <div className="skeleton-shimmer h-5 w-2/5 rounded" />
              <div className="skeleton-shimmer h-3 w-4/5 rounded" />
              <div className="skeleton-shimmer h-5 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div data-testid="event-page-mobile-card-error" className="py-12 text-center">
        <p className="text-sm text-brand-mid">{copy.empty}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-full bg-[var(--color-gold-primary)] px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-gold-primary)]"
        >
          {copy.retry}
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return <p data-testid="event-page-mobile-card-empty" className="py-12 text-center text-sm text-brand-mid">{copy.empty}</p>;
  }

  return (
    <div data-testid="event-page-mobile-card-list" className="event-page-mobile-card-list" aria-label="스페셜 이벤트">
      {events.map((event) => (
        <div key={event.id} data-testid={`event-page-mobile-card-${event.id}`} className="event-page-mobile-card">
          <EventCard event={event} getLocalizedText={getLocalizedText} variant="showcase" />
        </div>
      ))}
    </div>
  );
}

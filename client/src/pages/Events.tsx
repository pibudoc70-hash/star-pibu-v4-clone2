/**
 * [DORMANT PAGE - NOT ROUTED]
 *
 * STATUS: dormant/orphan — not registered in App.tsx.
 * Individual event detail pages are live at /events/:id (EventDetail component).
 * This events LIST page is not currently routed.
 *
 * CLASSIFICATION: dormant (high activation priority)
 *   The /events list page was deferred when the home EventSection was built.
 *   EventDetail (/events/:id) IS live. This list page is a natural companion
 *   and is the most likely of the dormant pages to be activated next.
 *
 * TO ACTIVATE:
 *   Add <Route path="/events" component={Events} /> to App.tsx
 *   (place before the /events/:id route to avoid shadowing)
 *   and add a nav link in Header.tsx.
 *
 * DO NOT:
 *   - Treat the SeoHead canonical below as an active SEO signal
 *     (canonical is preserved for reference only; page is not live)
 */
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLang } from '@/contexts/LangContext';
import MainLayout from '@/components/MainLayout';
import SeoHead, { COMMON_HREFLANGS } from '@/components/SeoHead';
import { trpc } from '@/lib/trpc';
import { Loader2, Calendar, Eye, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';
import OptimizedImage from '@/components/OptimizedImage';
import { parseEventListError } from '@/lib/errorMessages';

export default function Events() {
  const { t, lang } = useLang();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { data: allEvents, isLoading, error, refetch } = trpc.events.list.useQuery();
  const events = selectedCategory
    ? allEvents?.filter((e) => e.category === selectedCategory)
    : allEvents;

  // 에러 발생 시 토스트 알림
  useEffect(() => {
    if (!error) return;
    toast.error(parseEventListError(error, lang), { duration: 5000 });
  }, [error, lang]);

  const categories = [
    { value: undefined, label: t.events.filterAll },
    { value: 'event', label: t.events.filterEvent },
    { value: 'notice', label: t.events.filterNotice },
    { value: 'etc', label: t.events.filterEtc },
  ];

  return (
    <MainLayout>
      {/* NOTE: canonical below is inactive — this page is not routed in App.tsx */}
      <SeoHead
        title="이벤트 · 안내 | 부산 서면 스타피부과"
        description="부산 서면 스타피부과 이벤트 안내. 시술 할인, 신규 이벤트, 진료 공지 등 최신 소식을 확인하세요."
        keywords="스타피부과 이벤트, 서면피부과 할인, 부산피부과 이벤트, 스타피부과 공지"
        canonical="https://star-pibu.com/events"
        ogLocale="ko_KR"
        hreflangs={COMMON_HREFLANGS}
        pageType="treatment"
      />
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-2">{t.events.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t.events.sectionTitle}</h1>
          <p className="text-gray-600 mt-4">{t.events.sectionSubtitle}</p>
        </div>
      </section>

      <section className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {categories.map((cat) => (
              <button type="button"
                key={String(cat.value)}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-amber-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-amber-500" size={40} />
            </div>
          ) : error && (!events || events.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-gray-500 text-base">{parseEventListError(error, lang)}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
              >
                <RefreshCw size={15} />
                {(({ ko: "다시 시도", en: "Retry", ja: "再試行", zh: "重试", "zh-TW": "重試" }) as Record<string, string>)[lang] ?? "다시 시도"}
              </button>
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                    {event.imageUrl ? (
                      <OptimizedImage
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        height={192}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <span className="text-4xl">🏥</span>
                      </div>
                    )}
                    <div className="p-5">
                      {event.category && (
                        <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-full">
                          {event.category}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                        {event.date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(event.date).toLocaleDateString('ko-KR')}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {event.views ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t.events.noEvents}</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

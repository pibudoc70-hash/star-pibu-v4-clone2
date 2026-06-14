/**
 * EventsSection - 이벤트 & 공지사항 (데이터베이스 연동)
 * 디자인: 진행 중 이벤트(Featured)를 상단에 입체 카드로 분리
 *         나머지 이벤트/공지는 하단 리스트 카드로 표시
 * 반응형: 모바일 1열 → 태블릿/데스크탑 2열 Featured 카드
 * 데이터: tRPC events.featured, events.listEvents에서 동적 로드
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Calendar, Bell, ArrowRight, Tag, Zap, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";

interface Event {
  id: number;
  type: "이벤트" | "공지";
  category: "신규시술" | "이벤트" | "공지사항" | "기타";
  title: string;
  subtitle: string;
  desc: string;
  badge: string;
  tag: string;
  hot: "0" | "1";
  cta: string;
  accent: string;
  accentDark: string;
  accentBg: string;
  iconBg: string;
  iconType: string;
  badgeColor: string;
  date: string;
  views: number;
  sortOrder: number;
  isActive: "0" | "1";
  isFeatured: "0" | "1";
}

function EventIcon({ type, size = 22 }: { type?: string; size?: number }) {
  if (type === "zap") return <Zap size={size} />;
  if (type === "sparkles") return <Sparkles size={size} />;
  if (type === "bell") return <Bell size={size} />;
  return <Tag size={size} />;
}

export default function EventsSection() {
  const { t } = useLang();
  const ev_t = t.events;

  const [activeCategory, setActiveCategory] = useState(ev_t.filterAll);
  const [, navigate] = useLocation();
  const [filteredList, setFilteredList] = useState<Event[]>([]);

  // tRPC 쿼리
  const { data: featuredData, isLoading: featuredLoading, error: featuredError } = trpc.events.featured.useQuery();
  const { data: listData, isLoading: listLoading, error: listError } = trpc.events.listEvents.useQuery();

  // 언어 변경 시 activeCategory 리셋
  useEffect(() => {
    setActiveCategory(ev_t.filterAll);
  }, [ev_t.filterAll]);

  // 필터링 로직 - DB 카테고리 값은 고정(한국어)이므로 카테고리 매핑 사용
  const categoryMap: Record<string, string> = {
    [ev_t.filterAll]: "전체",
    [ev_t.filterNew]: "신규시술",
    [ev_t.filterEvent]: "이벤트",
    [ev_t.filterNotice]: "공지사항",
    [ev_t.filterEtc]: "기타",
  };

  useEffect(() => {
    if (!listData) {
      setFilteredList([]);
      return;
    }
    const dbCategory = categoryMap[activeCategory] ?? "전체";
    if (dbCategory === "전체") {
      setFilteredList(listData);
    } else {
      setFilteredList(listData.filter((e) => e.category === dbCategory));
    }
  }, [activeCategory, listData]);

  const dbActiveCategory = categoryMap[activeCategory] ?? "전체";
  const showFeatured =
    dbActiveCategory === "전체" || dbActiveCategory === "이벤트" || dbActiveCategory === "신규시술";

  const isLoading = featuredLoading || listLoading;
  const isError = !isLoading && (!!featuredError || !!listError);

  const filterTabs = [
    ev_t.filterAll,
    ev_t.filterNew,
    ev_t.filterEvent,
    ev_t.filterNotice,
    ev_t.filterEtc,
  ];

  return (
    <section id="events-legacy" className="py-16 sm:py-24 star-section-alt">
      <div className="container">
        {/* ── Section Header ── */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="section-eyebrow">{ev_t.eyebrow}</span>
          <h2 className="section-title mb-4">{ev_t.sectionTitle}</h2>
          <div className="star-divider mx-auto mb-4" />
          <p className="section-subtitle">{ev_t.sectionSubtitle}</p>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {filterTabs.map((category) => (
            <button type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={
                activeCategory === category
                  ? { background: "var(--brand-gold, #C4A882)", color: "white", boxShadow: "0 2px 8px rgba(196,168,130,0.35)" }
                  : { background: "var(--brand-bg, #FAF8F5)", color: "var(--brand-text-mid, #666666)", border: "1px solid rgba(196,168,130,0.2)" }
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* ── Loading State — Skeleton UI ── */}
        {isLoading && (
          <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#F5F0EB", minHeight: 220 }}>
                <div className="animate-pulse">
                  <div style={{ height: 140, background: "linear-gradient(90deg, #EDE8E0 25%, #F0EAE0 50%, #EDE8E0 75%)", backgroundSize: "200% 100%" }} />
                  <div className="p-5 space-y-3">
                    <div style={{ height: 14, width: "60%", background: "#E8E0D5", borderRadius: 4 }} />
                    <div style={{ height: 10, width: "80%", background: "#EDE8E0", borderRadius: 4 }} />
                    <div style={{ height: 10, width: "45%", background: "#EDE8E0", borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error State ── */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-gray-500">{ev_t.empty}</p>
          </div>
        )}

        {/* ── Featured 이벤트 카드 (상단) ── */}
        {!isLoading && !isError && showFeatured && featuredData && featuredData.length > 0 && (
          <div
            className="grid gap-6 mb-8"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}
          >
            {featuredData.map((ev) => (
              <div
                key={ev.id}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: ev.accentBg }}
                onClick={() => navigate(`/events/${ev.id}`)}
              >
                {/* 배경 그래디언트 */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${ev.accent} 0%, ${ev.accentDark} 100%)`,
                  }}
                />

                <div className="relative p-6 sm:p-8">
                  {/* Badge + Hot */}
                  <div className="flex items-center gap-2 mb-3">
                    {ev.badge && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: ev.badgeColor }}
                      >
                        {ev.badge}
                      </span>
                    )}
                    {ev.hot === "1" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500">
                        🔥 HOT
                      </span>
                    )}
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: ev.iconBg }}
                    >
                      <EventIcon type={ev.iconType} size={24} />
                    </div>
                    <div>
                      <h3
                        className="text-lg sm:text-xl font-bold mb-1"
                        style={{ color: ev.accent }}
                      >
                        {ev.title}
                      </h3>
                      <p className="text-sm" style={{ color: "#6B7280" }}>
                        {ev.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-4" style={{ color: "#4B5563" }}>
                    {ev.desc}
                  </p>

                  {/* Date + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: ev.accentBg }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: ev.accent }}>
                      <Calendar size={16} />
                      <span>{ev.date}</span>
                    </div>
                    <button type="button"
                      className="flex items-center gap-1 px-4 py-2 rounded-lg font-semibold text-white transition-all group-hover:gap-2"
                      style={{ backgroundColor: ev.accent }}
                    >
                      {ev_t.viewDetail}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 일반 이벤트/공지 리스트 (하단) ── */}
        {!isLoading && !isError && filteredList.length > 0 && (
          <div className="space-y-4">
            {filteredList.map((ev) => (
              <div
                key={ev.id}
                className="group p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
                onClick={() => navigate(`/events/${ev.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Icon + Content */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: ev.iconBg }}
                    >
                      <EventIcon type={ev.iconType} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className="font-bold text-base sm:text-lg"
                          style={{ color: ev.accent }}
                        >
                          {ev.title}
                        </h3>
                        {ev.tag && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {ev.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {ev.desc}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {ev.date}
                        </span>
                        <span>{ev_t.views} {ev.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Arrow */}
                  <ChevronRight
                    size={20}
                    className="flex-shrink-0 text-gray-500 group-hover:text-gray-600 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!isLoading && !isError && filteredList.length === 0 && (!showFeatured || !featuredData || featuredData.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">{ev_t.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}

import { useLocation } from "wouter";
import { Tag, Zap, Sparkles, Bell, Eye, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/useLang";
import { trpc } from "@/lib/trpc";

const iconMap: Record<string, React.ElementType> = {
  tag: Tag,
  zap: Zap,
  sparkles: Sparkles,
  bell: Bell,
};

export default function EventsSection() {
  const { t } = useLang();
  const [, navigate] = useLocation();
  const { data: events = [], isLoading } = trpc.events.list.useQuery();

  const featured = events.filter(e => e.isFeatured === "1").slice(0, 3);
  const regular = events.filter(e => e.isFeatured === "0").slice(0, 6);

  return (
    <section id="events" className="py-20 bg-[var(--star-bg-section)]">
      <div className="container">
        {/* 섹션 헤더 */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">{t.events.label}</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#1a2744] gold-underline inline-block">
              {t.events.title}
            </h2>
          </div>
          <button
            onClick={() => navigate("/events")}
            className="flex items-center gap-1 text-sm text-[#c9a96e] hover:text-[#1a2744] font-semibold transition-colors"
          >
            {t.events.viewAll} <ArrowRight size={14} />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>등록된 이벤트가 없습니다.</p>
          </div>
        ) : (
          <>
            {/* Featured 이벤트 */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {featured.map(ev => {
                  const Icon = iconMap[ev.iconType || "tag"] || Tag;
                  return (
                    <button
                      key={ev.id}
                      onClick={() => navigate(`/events/${ev.id}`)}
                      className="group text-left rounded-2xl overflow-hidden shadow-md card-hover"
                      style={{ background: `linear-gradient(135deg, ${ev.accent}, ${ev.accentDark})` }}
                    >
                      <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: ev.accentBg, color: ev.accent }}
                          >
                            {ev.badge}
                          </span>
                          {ev.hot === "1" && (
                            <span className="text-xs font-bold text-red-400">🔥 HOT</span>
                          )}
                        </div>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: ev.iconBg }}
                        >
                          <Icon size={20} style={{ color: ev.accent }} />
                        </div>
                        {ev.tag && (
                          <p className="text-xs font-semibold text-white/60 mb-1">{ev.tag}</p>
                        )}
                        <h3 className="text-lg font-black text-white mb-1 group-hover:text-[#c9a96e] transition-colors">
                          {ev.title}
                        </h3>
                        <p className="text-sm text-white/70 flex-1 line-clamp-2">{ev.desc}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                          <span className="text-xs text-white/50">{ev.date}</span>
                          <span className="text-xs text-white/70 flex items-center gap-1">
                            <Eye size={11} /> {ev.views}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 일반 이벤트 목록 */}
            {regular.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {regular.map(ev => (
                  <button
                    key={ev.id}
                    onClick={() => navigate(`/events/${ev.id}`)}
                    className="group text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-[#c9a96e]/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                        style={{ background: `${ev.badgeColor}15`, color: ev.badgeColor }}
                      >
                        {ev.badge || ev.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1a2744] text-sm group-hover:text-[#c9a96e] transition-colors truncate">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ev.desc}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-300">
                          <span>{ev.date}</span>
                          <span className="flex items-center gap-0.5"><Eye size={10} /> {ev.views}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

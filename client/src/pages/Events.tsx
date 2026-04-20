import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, Tag, Zap, Sparkles, Bell, Search } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useLang } from "@/contexts/useLang";
import { trpc } from "@/lib/trpc";

const iconMap: Record<string, React.ElementType> = {
  tag: Tag, zap: Zap, sparkles: Sparkles, bell: Bell,
};

const CATEGORIES = ["전체", "이벤트", "공지사항", "신규시술", "기타"];

export default function Events() {
  const { t } = useLang();
  const [, navigate] = useLocation();
  const [category, setCategory] = useState("전체");
  const [search, setSearch] = useState("");
  const { data: events = [], isLoading } = trpc.events.list.useQuery();

  const filtered = events.filter(ev => {
    const matchCat = category === "전체" || ev.category === category || ev.type === category;
    const matchSearch = !search || ev.title.includes(search) || ev.desc.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <MainLayout>
      <div className="pt-24 pb-16 min-h-screen bg-[var(--star-bg-section)]">
        <div className="container">
          {/* 헤더 */}
          <div className="mb-10">
            <p className="section-label mb-2">{t.events.label}</p>
            <h1 className="text-3xl md:text-4xl font-black text-[#1a2744]">{t.events.title}</h1>
          </div>

          {/* 필터 & 검색 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    category === cat
                      ? "bg-[#1a2744] text-white"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-[#c9a96e]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative ml-auto">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="이벤트 검색..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#c9a96e] bg-white"
              />
            </div>
          </div>

          {/* 이벤트 목록 */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Bell size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">등록된 이벤트가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(ev => {
                const Icon = iconMap[ev.iconType || "tag"] || Tag;
                const isFeatured = ev.isFeatured === "1";
                return (
                  <button
                    key={ev.id}
                    onClick={() => navigate(`/events/${ev.id}`)}
                    className={`group text-left rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all card-hover ${
                      isFeatured ? "md:col-span-2" : ""
                    }`}
                  >
                    {isFeatured ? (
                      <div
                        className="p-6 h-full min-h-[180px] flex flex-col"
                        style={{ background: `linear-gradient(135deg, ${ev.accent}, ${ev.accentDark})` }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                            {ev.badge}
                          </span>
                          {ev.hot === "1" && <span className="text-xs text-red-300 font-bold">🔥 HOT</span>}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                          <Icon size={18} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-1 group-hover:text-[#c9a96e] transition-colors">
                          {ev.title}
                        </h3>
                        <p className="text-sm text-white/70 flex-1 line-clamp-2">{ev.desc}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-xs text-white/50">
                          <span>{ev.date}</span>
                          <span className="flex items-center gap-1"><Eye size={11} /> {ev.views}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-5 h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${ev.badgeColor}18`, color: ev.badgeColor }}
                          >
                            {ev.badge || ev.type}
                          </span>
                          {ev.hot === "1" && <span className="text-xs text-red-400 font-bold">🔥</span>}
                        </div>
                        <h3 className="font-bold text-[#1a2744] mb-1.5 group-hover:text-[#c9a96e] transition-colors line-clamp-2">
                          {ev.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{ev.desc}</p>
                        <div className="flex items-center justify-between text-xs text-gray-300">
                          <span>{ev.date}</span>
                          <span className="flex items-center gap-1"><Eye size={11} /> {ev.views}</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

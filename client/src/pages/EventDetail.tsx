import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Eye, Calendar, Tag } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useLang } from "@/contexts/useLang";
import { trpc } from "@/lib/trpc";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { t } = useLang();
  const eventId = parseInt(id || "0");

  const { data: ev, isLoading } = trpc.events.getById.useQuery({ id: eventId }, { enabled: !!eventId });
  const incrementViews = trpc.events.incrementViews.useMutation();

  useEffect(() => {
    if (eventId) incrementViews.mutate({ id: eventId });
  }, [eventId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!ev) {
    return (
      <MainLayout>
        <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-gray-400">이벤트를 찾을 수 없습니다.</p>
          <button onClick={() => navigate("/events")} className="text-[#c9a96e] hover:underline">
            이벤트 목록으로 돌아가기
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16 min-h-screen bg-[var(--star-bg-section)]">
        <div className="container max-w-3xl">
          {/* 뒤로가기 */}
          <button
            onClick={() => navigate("/events")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1a2744] mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> {t.events.viewAll}
          </button>

          {/* 이벤트 헤더 */}
          <div
            className="rounded-2xl p-8 mb-6 text-white"
            style={{ background: `linear-gradient(135deg, ${ev.accent}, ${ev.accentDark})` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: ev.accentBg, color: ev.accent }}
              >
                {ev.badge || ev.type}
              </span>
              {ev.hot === "1" && <span className="text-xs font-bold text-red-300">🔥 HOT</span>}
              {ev.tag && <span className="text-xs text-white/60">{ev.tag}</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-black mb-2">{ev.title}</h1>
            {ev.subtitle && <p className="text-white/70 text-sm mb-4">{ev.subtitle}</p>}
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1"><Calendar size={11} /> {ev.date}</span>
              <span className="flex items-center gap-1"><Eye size={11} /> {ev.views} {t.events.views}</span>
            </div>
          </div>

          {/* 본문 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {ev.desc && (
              <p className="text-gray-600 leading-relaxed mb-6 text-base">{ev.desc}</p>
            )}
            {ev.content && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line mb-6">
                {ev.content}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
              <a
                href="https://pf.kakao.com/_xkxnxmxj"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FEE500] text-[#3A1D1D] text-sm font-bold rounded-full hover:bg-[#FFD700] transition-colors"
              >
                {t.cta.kakao}
              </a>
              <a
                href="https://booking.naver.com/booking/13/bizes/1166145"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#03C75A] text-white text-sm font-bold rounded-full hover:bg-[#02b050] transition-colors"
              >
                {t.cta.naver}
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

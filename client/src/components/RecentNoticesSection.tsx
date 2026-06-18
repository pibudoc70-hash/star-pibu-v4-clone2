/**
 * RecentNoticesSection.tsx
 * 메인 페이지에서 최근 공지사항 3개를 썸네일과 함께 보여주는 섹션
 */
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Bell, ChevronRight, Pin, ImageOff } from "lucide-react";

interface Props {
  lang: "ko" | "en" | "ja" | "zh";
}

function formatDate(date: Date | string, lang: string) {
  const d = new Date(date);
  if (lang === "ja") return d.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
  if (lang === "zh") return d.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
  if (lang === "en") return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

const LABELS = {
  ko: {
    section: "공지사항",
    subtitle: "스타피부과 최신 소식을 확인하세요",
    more: "전체 보기",
    pinned: "고정",
    noNotice: "등록된 공지사항이 없습니다.",
  },
  en: {
    section: "Notice",
    subtitle: "Check the latest news from STAR Dermatology",
    more: "View All",
    pinned: "Pinned",
    noNotice: "No notices available.",
  },
  ja: {
    section: "お知らせ",
    subtitle: "スター皮膚科の最新情報をご確認ください",
    more: "一覧を見る",
    pinned: "固定",
    noNotice: "公開中のお知らせはありません。",
  },
  zh: {
    section: "公告",
    subtitle: "查看STAR皮肤科最新消息",
    more: "查看全部",
    pinned: "置顶",
    noNotice: "暂无公告。",
  },
};

export default function RecentNoticesSection({ lang }: Props) {
  const { data: allNotices = [], isLoading } = trpc.notices.list.useQuery();
  const langPrefix = lang === "ko" ? "" : `/${lang}`;
  const labels = LABELS[lang];

  // 최근 3개만 표시
  const notices = allNotices.slice(0, 3);

  return (
    <section className="py-16 md:py-20" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
      <div className="max-w-5xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bell size={16} style={{ color: "var(--brand-gold, #C4A882)" }} />
              <span
                className="text-xs tracking-[0.18em] uppercase font-semibold"
                style={{ color: "var(--brand-gold, #C4A882)" }}
              >
                {labels.section}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1A2744" }}>
              {labels.subtitle}
            </h2>
          </div>
          <Link
            href={`${langPrefix}/notice`}
            className="hidden sm:flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: "var(--brand-gold, #C4A882)" }}
          >
            {labels.more}
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* 공지 카드 그리드 */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
                <div className="w-full aspect-[4/3] bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">{labels.noNotice}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {notices.map((notice) => (
              <Link
                key={notice.id}
                href={`${langPrefix}/notice/${notice.id}`}
                className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                {/* 썸네일 */}
                <div className="w-full aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center relative">
                  {notice.thumbnail ? (
                    <img
                      src={notice.thumbnail}
                      alt={notice.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <ImageOff size={32} />
                    </div>
                  )}
                  {/* 고정 배지 */}
                  {notice.isPinned === "1" && (
                    <span
                      className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--brand-gold, #C4A882)", color: "#fff" }}
                    >
                      {labels.pinned}
                    </span>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div className="p-4">
                  <p className="font-semibold text-gray-800 line-clamp-2 text-sm leading-snug group-hover:text-[#2D4A7B] transition-colors mb-2">
                    {notice.title}
                  </p>
                  <span className="text-xs text-gray-400">{formatDate(notice.createdAt, lang)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 모바일 전체보기 버튼 */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`${langPrefix}/notice`}
            className="flex items-center gap-1 text-sm font-medium px-5 py-2 rounded-full border transition-colors"
            style={{ borderColor: "var(--brand-gold, #C4A882)", color: "var(--brand-gold, #C4A882)" }}
          >
            {labels.more}
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

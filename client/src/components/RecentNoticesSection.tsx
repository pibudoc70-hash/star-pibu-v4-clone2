/**
 * RecentNoticesSection.tsx
 * 메인 페이지에서 최근 공지사항 3개를 제목 리스트로 보여주는 섹션
 */
import { memo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Bell, ChevronRight, Pin } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";

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
  ko: { section: "공지사항", more: "전체 보기", pinned: "고정", noNotice: "등록된 공지사항이 없습니다." },
  en: { section: "Notice", more: "View All", pinned: "Pinned", noNotice: "No notices available." },
  ja: { section: "お知らせ", more: "一覧を見る", pinned: "固定", noNotice: "公開中のお知らせはありません。" },
  zh: { section: "公告", more: "查看全部", pinned: "置顶", noNotice: "暂无公告。" },
};

function RecentNoticesSection({ lang }: Props) {
  const { data: allNotices = [], isLoading } = trpc.notices.list.useQuery({ lang });
  const langPrefix = lang === "ko" ? "" : `/${lang}`;
  const labels = LABELS[lang];
  const sectionRef = useSectionReveal(0); // [Step64]

  const notices = allNotices.slice(0, 3);

  // 공지가 없으면 섹션 자체를 숨김
  if (!isLoading && notices.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-8 border-t border-gray-100 reveal" style={{ background: "#FAF8F5" }}>
      <div className="max-w-5xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={15} style={{ color: "var(--color-gold-primary)" }} />
            <span
              className="text-xs tracking-[0.15em] uppercase font-semibold"
              style={{ color: "var(--color-gold-primary)" }}
            >
              {labels.section}
            </span>
          </div>
          <Link
            href={`${langPrefix}/notice`}
            className="flex items-center gap-0.5 text-xs font-medium transition-colors hover:opacity-70"
            style={{ color: "var(--color-gold-primary)" }}
          >
            {labels.more}
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* 리스트 */}
        {isLoading ? (
          // [P3-FINAL] animate-pulse bg-gray-200 → skeleton-shimmer + 골드 픽스드 힌트
          <div className="space-y-2.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2.5 py-2.5 border-b" style={{ borderColor: 'color-mix(in srgb, var(--color-gold-primary) 10%, transparent)' }}>
                {/* 핀 아이콘 힌트 — 골드 픽스드 */}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: 'color-mix(in srgb, var(--color-gold-primary) 32%, transparent)' }} />
                <div className="skeleton-shimmer rounded flex-1" style={{ height: '12px', width: `${55 + i * 10}%`, animationDelay: `${i * 0.08}s` }} />
                <div className="skeleton-shimmer rounded" style={{ height: '11px', width: '3rem', flexShrink: 0, animationDelay: `${i * 0.08 + 0.05}s` }} />
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notices.map((notice) => (
              <li key={notice.id}>
                <Link
                  href={`${langPrefix}/notice/${notice.id}`}
                  className="flex items-center gap-2 py-3 group hover:opacity-80 transition-opacity"
                >
                  {/* 고정 아이콘 */}
                  {notice.isPinned === "1" && (
                    <Pin
                      size={12}
                      className="shrink-0"
                      style={{ color: "var(--color-gold-primary)" }}
                    />
                  )}
                  {/* 제목 */}
                  <span className="flex-1 text-sm text-gray-700 truncate group-hover:text-gray-900 font-medium">
                    {notice.title}
                  </span>
                  {/* 날짜 */}
                  <span className="shrink-0 text-xs text-gray-400 ml-2">
                    {formatDate(notice.createdAt, lang)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// [P1-OPT] React.memo로 memoization 내보내
export default memo(RecentNoticesSection);

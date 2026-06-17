/**
 * NoticeDetail.tsx — 공지사항 상세 페이지
 */
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLang } from "@/contexts/LangContext";
import { Bell, Pin, ArrowLeft, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SeoHead from "@/components/SeoHead";

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

interface NoticeDetailProps {
  id: string;
}

export default function NoticeDetail({ id }: NoticeDetailProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { lang } = useLang();
  const [, navigate] = useLocation();

  const noticeId = parseInt(id, 10);
  const { data: notice, isLoading, error } = trpc.notices.getById.useQuery(
    { id: noticeId },
    { enabled: !isNaN(noticeId) }
  );

  const langPrefix = lang === "ko" ? "" : `/${lang}`;

  const backLabel =
    lang === "ja" ? "一覧に戻る" :
    lang === "zh" ? "返回列表" :
    lang === "en" ? "Back to List" :
    "목록으로";
  const editLabel =
    lang === "ja" ? "編集" :
    lang === "zh" ? "编辑" :
    lang === "en" ? "Edit" :
    "수정";
  const pinnedLabel =
    lang === "ja" ? "固定" :
    lang === "zh" ? "置顶" :
    lang === "en" ? "Pinned" :
    "고정";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
        <Header />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">불러오는 중...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
        <Header />
        <main className="flex-1 pt-24 flex flex-col items-center justify-center gap-4">
          <Bell size={40} className="text-gray-300" />
          <p className="text-gray-400">공지사항을 찾을 수 없습니다.</p>
          <Button variant="outline" onClick={() => navigate(`${langPrefix}/notice`)}>
            {backLabel}
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
      <SeoHead
        title={`${notice.title} | STAR DERMATOLOGY`}
        description={notice.content.slice(0, 150)}
        noindex={false}
      />
      <Header />

      <main className="flex-1 pt-24 pb-20">
        {/* 상단 배너 */}
        <div
          className="py-10 md:py-14 text-center"
          style={{ background: "linear-gradient(135deg, #1A2744 0%, #2D4A7B 100%)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell size={18} style={{ color: "var(--brand-gold, #C4A882)" }} />
            <span
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ color: "var(--brand-gold, #C4A882)" }}
            >
              NOTICE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white px-4">{notice.title}</h1>
        </div>

        {/* 본문 컨테이너 */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* 메타 정보 */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {notice.isPinned === "1" && (
                <Badge variant="outline" className="text-[11px] border-amber-400 text-amber-600 flex items-center gap-1">
                  <Pin size={10} />
                  {pinnedLabel}
                </Badge>
              )}
              <span className="text-sm text-gray-500">{formatDate(notice.createdAt)}</span>
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <Eye size={13} />
                {notice.views}
              </span>
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => navigate(`${langPrefix}/notice/${notice.id}/edit`)}
              >
                <Pencil size={13} />
                {editLabel}
              </Button>
            )}
          </div>

          {/* 본문 */}
          <div
            className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {notice.content}
          </div>

          {/* 목록으로 버튼 */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link href={`${langPrefix}/notice`}>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={15} />
                {backLabel}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

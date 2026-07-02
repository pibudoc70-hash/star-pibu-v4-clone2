/**
 * Notice.tsx — 공지사항 목록 페이지
 * 일반 방문자: 읽기 전용
 * 관리자: 작성 버튼 표시
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLang } from "@/contexts/LangContext";
import { Bell, Pin, ChevronRight, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE } from "@/components/SeoHead";

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function Notice() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: notices = [], refetch } = trpc.notices.list.useQuery({ lang });
  const deleteMutation = trpc.notices.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteId(null);
    },
  });

  const langPrefix = lang === "ko" ? "" : `/${lang}`;

  const pageTitle = lang === "ja" ? "お知らせ" : lang === "zh" ? "公告" : lang === "en" ? "Notice" : "공지사항";
  const pageSubtitle =
    lang === "ja" ? "スター皮膚科からのお知らせ" :
    lang === "zh" ? "STAR皮肤科公告" :
    lang === "en" ? "Announcements from STAR Dermatology" :
    "스타피부과 공지사항";
  const writeLabel = lang === "ja" ? "新規作成" : lang === "zh" ? "新建" : lang === "en" ? "New Post" : "글쓰기";
  const emptyLabel =
    lang === "ja" ? "公開中のお知らせはありません。" :
    lang === "zh" ? "暂无公告。" :
    lang === "en" ? "No notices available." :
    "등록된 공지사항이 없습니다.";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
      <SeoHead
        title={`${pageTitle} | STAR DERMATOLOGY`}
        description={pageSubtitle}
        canonical={`https://star-pibu.com${langPrefix}/notice`}
        ogUrl={`https://star-pibu.com${langPrefix}/notice`}
        ogLocale={LANG_TO_OG_LOCALE[lang as keyof typeof LANG_TO_OG_LOCALE] ?? "ko_KR"}
        hreflangs={buildHreflangs("/notice")}
        noindex={false}
      />
      <Header />

      <main className="flex-1 pt-24 pb-20">
        {/* 페이지 헤더 */}
        <div
          className="py-12 md:py-16 text-center"
          style={{ background: "linear-gradient(135deg, #1A2744 0%, #2D4A7B 100%)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Bell size={20} style={{ color: "var(--color-gold-primary)" }} />
            <span
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ color: "var(--color-gold-primary)" }}
            >
              NOTICE
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{pageTitle}</h1>
          <p className="text-white/60 text-sm">{pageSubtitle}</p>
        </div>

        {/* 목록 컨테이너 */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* 관리자 글쓰기 버튼 */}
          {isAdmin && (
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => navigate(`${langPrefix}/notice/new`)}
                className="flex items-center gap-2"
                style={{ background: "var(--color-gold-primary)", color: "#fff" }}
              >
                <Plus size={16} />
                {writeLabel}
              </Button>
            </div>
          )}

          {/* 공지 목록 */}
          {notices.length === 0 ? (
            <div className="text-center py-20 text-gray-400">{emptyLabel}</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notices.map((notice) => (
                <li key={notice.id} className="group">
                  <div className="flex items-start gap-3 py-5 hover:bg-white/60 rounded-lg px-3 transition-colors">
                    {/* 고정 아이콘 */}
                    {notice.isPinned === "1" && (
                      <Pin size={15} className="mt-1 shrink-0" style={{ color: "var(--color-gold-primary)" }} />
                    )}

                    {/* 본문 */}
                    <Link
                      href={`${langPrefix}/notice/${notice.id}`}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        {/* 썸네일 이미지 */}
                        {(notice as any).thumbnail && (
                          <img
                            src={(notice as any).thumbnail}
                            alt={notice.title}
                            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-gray-100"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {notice.isPinned === "1" && (
                              <Badge
                                variant="gold-outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {lang === "ja" ? "固定" : lang === "zh" ? "置顶" : lang === "en" ? "Pinned" : "고정"}
                              </Badge>
                            )}
                            <span className="font-medium text-gray-800 group-hover:text-[#2D4A7B] transition-colors line-clamp-1">
                              {notice.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            <span>{formatDate(notice.createdAt)}</span>
                            <span className="flex items-center gap-1">
                              <Eye size={11} />
                              {notice.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* 관리자 액션 */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => navigate(`${langPrefix}/notice/${notice.id}/edit`)}
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:text-red-600"
                          onClick={() => setDeleteId(notice.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    )}

                    <ChevronRight size={16} className="text-gray-300 shrink-0 mt-1" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 공지사항을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteId !== null && deleteMutation.mutate({ id: deleteId })}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

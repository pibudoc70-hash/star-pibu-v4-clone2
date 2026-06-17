/**
 * NoticeEdit.tsx — 공지사항 작성/수정 페이지 (관리자 전용)
 * id="new" → 새 글 작성
 * id=숫자  → 기존 글 수정
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLang } from "@/contexts/LangContext";
import { Bell, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface NoticeEditProps {
  id: string; // "new" 또는 숫자 문자열
}

export default function NoticeEdit({ id }: NoticeEditProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const isNew = id === "new";
  const noticeId = isNew ? null : parseInt(id, 10);
  const langPrefix = lang === "ko" ? "" : `/${lang}`;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  // 수정 모드: 기존 데이터 로드
  const { data: existing } = trpc.notices.getById.useQuery(
    { id: noticeId! },
    { enabled: !isNew && noticeId !== null && !isNaN(noticeId) }
  );

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content);
      setIsPinned(existing.isPinned === "1");
    }
  }, [existing]);

  const createMutation = trpc.notices.create.useMutation({
    onSuccess: () => {
      toast.success("공지사항이 등록되었습니다.");
      navigate(`${langPrefix}/notice`);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.notices.update.useMutation({
    onSuccess: () => {
      toast.success("공지사항이 수정되었습니다.");
      navigate(`${langPrefix}/notice/${noticeId}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }
    if (isNew) {
      createMutation.mutate({ title, content, isPinned: isPinned ? "1" : "0" });
    } else {
      updateMutation.mutate({ id: noticeId!, title, content, isPinned: isPinned ? "1" : "0" });
    }
  };

  // 관리자가 아니면 목록으로 리다이렉트
  if (!isAdmin) {
    navigate(`${langPrefix}/notice`);
    return null;
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isNew ? "공지사항 작성" : "공지사항 수정"}
          </h1>
        </div>

        {/* 폼 컨테이너 */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="notice-title" className="text-sm font-medium text-gray-700">
                제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="notice-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지사항 제목을 입력하세요"
                maxLength={300}
                className="bg-white"
                required
              />
            </div>

            {/* 내용 */}
            <div className="space-y-2">
              <Label htmlFor="notice-content" className="text-sm font-medium text-gray-700">
                내용 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="notice-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="공지사항 내용을 입력하세요"
                rows={14}
                className="bg-white resize-y"
                required
              />
            </div>

            {/* 고정 여부 */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <Switch
                id="notice-pinned"
                checked={isPinned}
                onCheckedChange={setIsPinned}
              />
              <Label htmlFor="notice-pinned" className="cursor-pointer text-sm text-gray-700">
                상단 고정 (중요 공지사항에 사용)
              </Label>
            </div>

            {/* 버튼 */}
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate(isNew ? `${langPrefix}/notice` : `${langPrefix}/notice/${noticeId}`)}
              >
                <ArrowLeft size={15} />
                취소
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
                style={{ background: "var(--brand-gold, #C4A882)", color: "#fff" }}
              >
                <Save size={15} />
                {isLoading ? "저장 중..." : isNew ? "등록하기" : "수정하기"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

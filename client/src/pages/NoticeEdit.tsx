/**
 * NoticeEdit.tsx — 공지사항 작성/수정 페이지 (관리자 전용)
 * id="new" → 새 글 작성
 * id=숫자  → 기존 글 수정
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLang } from "@/contexts/LangContext";
import { Bell, Save, ArrowLeft, ImagePlus, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NoticeEditProps {
  id: string; // "new" 또는 숫자 문자열
}

interface ImagePreview {
  /** 로컬 미리보기 URL (아직 업로드 안 된 경우) 또는 서버 URL */
  previewUrl: string;
  /** 업로드 완료 후 서버 URL */
  serverUrl?: string;
  /** DB의 imageId (수정 모드에서 기존 이미지) */
  imageId?: number;
  /** 아직 업로드 중인지 여부 */
  uploading?: boolean;
  /** 업로드할 base64 데이터 (신규 이미지) */
  base64?: string;
  mimeType?: string;
  sortOrder: number;
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
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // 기존 이미지 로드
      if (existing.images && existing.images.length > 0) {
        setImages(
          existing.images.map((img) => ({
            previewUrl: img.url,
            serverUrl: img.url,
            imageId: img.id,
            sortOrder: img.sortOrder,
          }))
        );
      }
    }
  }, [existing]);

  // 관리자가 아니면 목록으로 리다이렉트 (useEffect 안에서 처리)
  useEffect(() => {
    if (user !== undefined && !isAdmin) {
      navigate(`${langPrefix}/notice`);
    }
  }, [user, isAdmin, navigate, langPrefix]);

  const utils = trpc.useUtils();

  const createMutation = trpc.notices.create.useMutation({
    onSuccess: async (data) => {
      // 신규 이미지 업로드
      const newImages = images.filter((img) => !img.imageId && img.base64);
      if (newImages.length > 0 && data.id) {
        await uploadImages(data.id, newImages);
      }
      toast.success("공지사항이 등록되었습니다.");
      utils.notices.list.invalidate();
      navigate(`${langPrefix}/notice`);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.notices.update.useMutation({
    onSuccess: async () => {
      // 신규 이미지 업로드 (기존 이미지는 이미 서버에 있음)
      const newImages = images.filter((img) => !img.imageId && img.base64);
      if (newImages.length > 0 && noticeId) {
        await uploadImages(noticeId, newImages);
      }
      toast.success("공지사항이 수정되었습니다.");
      utils.notices.list.invalidate();
      utils.notices.getById.invalidate({ id: noticeId! });
      navigate(`${langPrefix}/notice/${noticeId}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const uploadImageMutation = trpc.notices.uploadImage.useMutation();
  const deleteImageMutation = trpc.notices.deleteImage.useMutation();

  /** 신규 이미지들을 S3에 업로드 */
  const uploadImages = async (targetNoticeId: number, newImgs: ImagePreview[]) => {
    for (let i = 0; i < newImgs.length; i++) {
      const img = newImgs[i];
      if (!img.base64) continue;
      try {
        await uploadImageMutation.mutateAsync({
          noticeId: targetNoticeId,
          base64: img.base64,
          mimeType: img.mimeType ?? "image/jpeg",
          sortOrder: img.sortOrder,
        });
      } catch (e) {
        toast.error(`이미지 ${i + 1} 업로드 실패`);
      }
    }
  };

  /** 파일을 base64로 변환 */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** 이미지 파일 추가 */
  const addImageFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const validFiles = fileArr.filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (images.length + validFiles.length > 10) {
      toast.error("이미지는 최대 10개까지 첨부할 수 있습니다.");
      return;
    }

    for (const file of validFiles) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: 10MB 이하 이미지만 업로드 가능합니다.`);
        continue;
      }
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      setImages((prev) => [
        ...prev,
        {
          previewUrl,
          base64,
          mimeType: file.type,
          sortOrder: prev.length,
        },
      ]);
    }
  }, [images.length]);

  /** 이미지 제거 */
  const removeImage = async (index: number) => {
    const img = images[index];
    // 기존 이미지(DB에 있는 것)는 서버에서도 삭제
    if (img.imageId) {
      try {
        await deleteImageMutation.mutateAsync({ imageId: img.imageId });
      } catch {
        toast.error("이미지 삭제에 실패했습니다.");
        return;
      }
    }
    // 로컬 미리보기 URL 해제
    if (!img.imageId) {
      URL.revokeObjectURL(img.previewUrl);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /** 드래그앤드롭 핸들러 */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addImageFiles(e.dataTransfer.files);
  };

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

  // 아직 인증 확인 중이거나 관리자가 아니면 빈 화면
  if (user === undefined || !isAdmin) return null;

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
                rows={10}
                className="bg-white resize-y"
                required
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  이미지 첨부
                </Label>
                <span className="text-xs text-gray-400">({images.length}/10 · 파일당 최대 10MB)</span>
              </div>

              {/* 드래그앤드롭 영역 */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  isDragging
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-300 bg-white hover:border-amber-300 hover:bg-amber-50/30"
                }`}
              >
                <Upload size={28} className="text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    클릭하거나 이미지를 드래그해서 업로드
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, GIF, WEBP 지원 · 최대 10장
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && addImageFiles(e.target.files)}
                />
              </div>

              {/* 이미지 미리보기 그리드 */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      <img
                        src={img.previewUrl}
                        alt={`첨부 이미지 ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* 삭제 버튼 */}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label={`이미지 ${idx + 1} 삭제`}
                      >
                        <X size={14} />
                      </button>
                      {/* 업로드 중 오버레이 */}
                      {img.uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Loader2 size={20} className="text-white animate-spin" />
                        </div>
                      )}
                      {/* 순서 표시 */}
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-xs bg-black/50 text-white">
                        {idx + 1}
                      </div>
                    </div>
                  ))}

                  {/* 추가 버튼 (10장 미만일 때) */}
                  {images.length < 10 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-amber-300 hover:bg-amber-50/30 transition-colors"
                      style={{ aspectRatio: "1 / 1" }}
                      aria-label="이미지 추가"
                    >
                      <ImagePlus size={22} className="text-gray-400" />
                      <span className="text-xs text-gray-400">추가</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 고정 여부 */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
              <button
                type="button"
                role="switch"
                aria-checked={isPinned}
                onClick={() => setIsPinned(!isPinned)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isPinned ? "bg-amber-500 focus:ring-amber-500" : "bg-gray-200 focus:ring-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    isPinned ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <label
                onClick={() => setIsPinned(!isPinned)}
                className="cursor-pointer text-sm text-gray-700"
              >
                상단 고정 (중요 공지사항에 사용)
              </label>
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
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
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

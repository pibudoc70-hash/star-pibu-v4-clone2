import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Pin, Languages, Loader2, ImagePlus, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';

type TargetLang = 'all' | 'ko' | 'en' | 'ja' | 'zh';

interface Notice {
  id: number;
  title: string;
  content: string;
  isPinned: string;
  views: number;
  targetLang: TargetLang;
  sourceNoticeId?: number | null;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string | null;
}

interface PendingImage {
  previewUrl: string;
  base64: string;
  mimeType: string;
  fileName: string;
}

const LANG_OPTIONS: { value: TargetLang; label: string; flag: string }[] = [
  { value: 'all', label: '🌐 전체 언어', flag: '🌐' },
  { value: 'ko', label: '🇰🇷 한국어', flag: '🇰🇷' },
  { value: 'en', label: '🇺🇸 English', flag: '🇺🇸' },
  { value: 'ja', label: '🇯🇵 日本語', flag: '🇯🇵' },
  { value: 'zh', label: '🇨🇳 中文', flag: '🇨🇳' },
];

const LANG_BADGE_COLORS: Record<TargetLang, string> = {
  all: 'bg-gray-100 text-gray-700',
  ko: 'bg-blue-100 text-blue-700',
  en: 'bg-green-100 text-green-700',
  ja: 'bg-red-100 text-red-700',
  zh: 'bg-yellow-100 text-yellow-700',
};

export default function AdminNotices() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPinned: '0' as '0' | '1',
    targetLang: 'all' as TargetLang,
  });

  // 이미지 관련 상태
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);   // 신규 등록 시 업로드 대기 이미지
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]); // 수정 시 기존 이미지
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);     // 수정 시 삭제 예약 ID
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 언어 탭 필터
  const [activeTab, setActiveTab] = useState<TargetLang | 'all'>('all');

  // 자동번역 상태
  const [translateTargetId, setTranslateTargetId] = useState<number | null>(null);
  const [selectedTranslateLangs, setSelectedTranslateLangs] = useState<('en' | 'ja' | 'zh')[]>(['en', 'ja', 'zh']);
  const [showTranslateModal, setShowTranslateModal] = useState(false);

  const utils = trpc.useUtils();

  // 관리자 전체 목록 조회
  const { data: notices = [], refetch } = trpc.notices.adminList.useQuery();

  // 이미지 업로드 뮤테이션
  const uploadImageMutation = trpc.notices.uploadImage.useMutation();
  const deleteImageMutation = trpc.notices.deleteImage.useMutation();

  // 공지사항 생성
  const createMutation = trpc.notices.create.useMutation({
    onSuccess: async (data) => {
      // 생성 후 대기 이미지 업로드
      if (pendingImages.length > 0 && data.id) {
        setImageUploading(true);
        try {
          for (let i = 0; i < pendingImages.length; i++) {
            const img = pendingImages[i];
            await uploadImageMutation.mutateAsync({
              noticeId: data.id,
              base64: img.base64,
              mimeType: img.mimeType,
              fileName: img.fileName,
              sortOrder: i,
            });
          }
        } finally {
          setImageUploading(false);
        }
      }
      refetch();
      resetForm();
    },
  });

  // 공지사항 수정
  const updateMutation = trpc.notices.update.useMutation({
    onSuccess: async () => {
      // 삭제 예약된 이미지 처리
      for (const imgId of deletedImageIds) {
        await deleteImageMutation.mutateAsync({ imageId: imgId });
      }
      // 신규 이미지 업로드
      if (pendingImages.length > 0 && editingId) {
        setImageUploading(true);
        try {
          const startOrder = existingImages.filter(img => !deletedImageIds.includes(img.id)).length;
          for (let i = 0; i < pendingImages.length; i++) {
            const img = pendingImages[i];
            await uploadImageMutation.mutateAsync({
              noticeId: editingId,
              base64: img.base64,
              mimeType: img.mimeType,
              fileName: img.fileName,
              sortOrder: startOrder + i,
            });
          }
        } finally {
          setImageUploading(false);
        }
      }
      refetch();
      resetForm();
    },
  });

  // 공지사항 삭제
  const deleteMutation = trpc.notices.delete.useMutation({
    onSuccess: () => { refetch(); },
  });

  // LLM 자동번역
  const translateMutation = trpc.notices.autoTranslate.useMutation({
    onSuccess: (data) => {
      const langNames = data.created.map((c) => {
        const opt = LANG_OPTIONS.find((o) => o.value === c.lang);
        return opt ? opt.flag : c.lang;
      }).join(' ');
      alert(`✅ 자동번역 완료!\n${langNames} 공지사항이 등록되었습니다.`);
      setShowTranslateModal(false);
      setTranslateTargetId(null);
      refetch();
      utils.notices.list.invalidate();
    },
    onError: (err) => { alert(`번역 실패: ${err.message}`); },
  });

  // 관리자 권한 확인
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한 없음</h1>
          <p className="text-gray-600">관리자만 접근할 수 있습니다.</p>
          <button type="button"
            onClick={() => setLocation('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', isPinned: '0', targetLang: 'all' });
    setPendingImages([]);
    setExistingImages([]);
    setDeletedImageIds([]);
    setShowForm(false);
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const MAX_TOTAL = 5;
    const currentCount = existingImages.filter(img => !deletedImageIds.includes(img.id)).length + pendingImages.length;
    const remaining = MAX_TOTAL - currentCount;
    if (remaining <= 0) {
      alert(`이미지는 최대 ${MAX_TOTAL}장까지 첨부할 수 있습니다.`);
      return;
    }

    const toAdd = files.slice(0, remaining);
    toAdd.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}: 파일 크기는 10MB 이하여야 합니다.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = (ev.target?.result as string) ?? '';
        setPendingImages((prev) => [...prev, {
          previewUrl: base64,
          base64,
          mimeType: file.type || 'image/jpeg',
          fileName: file.name,
        }]);
      };
      reader.readAsDataURL(file);
    });

    // 파일 input 초기화 (같은 파일 재선택 허용)
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        title: formData.title,
        content: formData.content,
        isPinned: formData.isPinned,
        targetLang: formData.targetLang,
      });
    } else {
      createMutation.mutate({
        title: formData.title,
        content: formData.content,
        isPinned: formData.isPinned,
        targetLang: formData.targetLang,
      });
    }
  };

  const handleEdit = async (notice: Notice) => {
    setEditingId(notice.id);
    setFormData({
      title: notice.title,
      content: notice.content,
      isPinned: (notice.isPinned as '0' | '1'),
      targetLang: notice.targetLang ?? 'all',
    });
    setPendingImages([]);
    setDeletedImageIds([]);
    // 기존 이미지 로드
    try {
      const imgs = await utils.notices.getImages.fetch({ noticeId: notice.id });
      setExistingImages(imgs.map((img: any) => ({ id: img.id, url: img.url })));
    } catch {
      setExistingImages([]);
    }
    setShowForm(true);
  };

  const handleCancel = () => resetForm();

  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleOpenTranslate = (notice: Notice) => {
    setTranslateTargetId(notice.id);
    setSelectedTranslateLangs(['en', 'ja', 'zh']);
    setShowTranslateModal(true);
  };

  const handleTranslate = () => {
    if (!translateTargetId || selectedTranslateLangs.length === 0) return;
    if (!confirm(`선택한 언어(${selectedTranslateLangs.join(', ')})로 자동번역하여 새 공지사항을 등록합니다.\n계속하시겠습니까?`)) return;
    translateMutation.mutate({ sourceId: translateTargetId, targetLangs: selectedTranslateLangs });
  };

  const toggleTranslateLang = (lang: 'en' | 'ja' | 'zh') => {
    setSelectedTranslateLangs((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const isPending = createMutation.isPending || updateMutation.isPending || imageUploading;

  // 현재 표시할 이미지 수 (기존 유지 + 신규 대기)
  const activeExisting = existingImages.filter(img => !deletedImageIds.includes(img.id));
  const totalImageCount = activeExisting.length + pendingImages.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">공지사항 관리</h1>
          <button type="button"
            onClick={() => {
              if (showForm && !editingId) { resetForm(); return; }
              setShowForm(!showForm);
              if (editingId) resetForm();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            새 공지사항
          </button>
        </div>

        {/* 작성/수정 폼 */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? '공지사항 수정' : '새 공지사항 작성'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 제목 */}
              <div>
                <label htmlFor="notice-title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  id="notice-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="공지사항 제목을 입력하세요"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/300</p>
              </div>

              {/* 내용 */}
              <div>
                <label htmlFor="notice-content" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  id="notice-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-64"
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>

              {/* 이미지 첨부 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 첨부
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    최대 5장 · JPG/PNG/WebP · 10MB 이하
                  </span>
                </label>

                {/* 이미지 미리보기 그리드 */}
                {(activeExisting.length > 0 || pendingImages.length > 0) && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {/* 기존 이미지 (수정 시) */}
                    {activeExisting.map((img) => (
                      <div key={img.id} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={img.url} alt="첨부 이미지" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setDeletedImageIds((prev) => [...prev, img.id])}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="이미지 삭제"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {/* 신규 대기 이미지 */}
                    {pendingImages.map((img, idx) => (
                      <div key={`pending-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-blue-300 border-dashed group">
                        <img src={img.previewUrl} alt="업로드 예정" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500/70 text-white text-xs text-center py-0.5">
                          업로드 예정
                        </div>
                        <button
                          type="button"
                          onClick={() => setPendingImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="취소"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 이미지 추가 버튼 */}
                {totalImageCount < 5 && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <ImagePlus size={18} />
                      이미지 추가 ({totalImageCount}/5)
                    </button>
                  </>
                )}
                {totalImageCount >= 5 && (
                  <p className="text-xs text-amber-600 mt-1">이미지는 최대 5장까지 첨부할 수 있습니다.</p>
                )}
              </div>

              {/* 표시 대상 언어 선택 */}
              <div>
                <label htmlFor="notice-lang" className="block text-sm font-medium text-gray-700 mb-1">표시 대상 언어</label>
                <select
                  id="notice-lang"
                  value={formData.targetLang}
                  onChange={(e) => setFormData({ ...formData, targetLang: e.target.value as TargetLang })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {LANG_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.targetLang === 'all'
                    ? '모든 언어 페이지에 표시됩니다.'
                    : `선택한 언어(${LANG_OPTIONS.find((o) => o.value === formData.targetLang)?.label}) 페이지에만 표시됩니다.`}
                </p>
              </div>

              {/* 상단 고정 */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPinned === '1'}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked ? '1' : '0' })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">상단 고정</span>
                </label>
              </div>

              {/* 업로드 진행 표시 */}
              {imageUploading && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 size={16} className="animate-spin" />
                  이미지 업로드 중...
                </div>
              )}

              <div className="flex gap-2">
                <button type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? '수정' : '작성'}
                </button>
                <button type="button"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 언어별 탭 */}
        <div className="flex gap-1 mb-4 bg-white rounded-xl shadow-sm p-1 border border-gray-200">
          {([
            { value: 'all' as const, label: '전체', count: (notices as Notice[]).length },
            { value: 'ko' as const, label: '🇰🇷 한국어', count: (notices as Notice[]).filter((n) => n.targetLang === 'ko' || n.targetLang === 'all').length },
            { value: 'en' as const, label: '🇺🇸 English', count: (notices as Notice[]).filter((n) => n.targetLang === 'en').length },
            { value: 'ja' as const, label: '🇯🇵 日本語', count: (notices as Notice[]).filter((n) => n.targetLang === 'ja').length },
            { value: 'zh' as const, label: '🇨🇳 中文', count: (notices as Notice[]).filter((n) => n.targetLang === 'zh').length },
          ]).map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {(notices as Notice[]).filter((notice) => {
            if (activeTab === 'all') return true;
            if (activeTab === 'ko') return notice.targetLang === 'ko' || notice.targetLang === 'all';
            return notice.targetLang === activeTab;
          }).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {activeTab === 'all' ? '공지사항이 없습니다.' : `${LANG_OPTIONS.find((o) => o.value === activeTab)?.label} 공지사항이 없습니다.`}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">제목</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">이미지</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">언어</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">조회수</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작성일</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작업</th>
                </tr>
              </thead>
              <tbody>
                {(notices as Notice[]).filter((notice) => {
                  if (activeTab === 'all') return true;
                  if (activeTab === 'ko') return notice.targetLang === 'ko' || notice.targetLang === 'all';
                  return notice.targetLang === activeTab;
                }).map((notice) => (
                  <tr key={notice.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {notice.isPinned === '1' && <Pin size={16} className="text-red-500 shrink-0" />}
                        <span className="line-clamp-2 max-w-xs">{notice.title}</span>
                        {notice.sourceNoticeId && (
                          <span className="text-xs text-gray-400 shrink-0">(번역본)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {notice.thumbnail ? (
                        <img
                          src={notice.thumbnail}
                          alt="썸네일"
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">없음</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${LANG_BADGE_COLORS[notice.targetLang ?? 'all']}`}>
                        {LANG_OPTIONS.find((o) => o.value === (notice.targetLang ?? 'all'))?.label ?? '🌐 전체'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{notice.views}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        notice.isPinned === '1' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notice.isPinned === '1' ? '고정' : '일반'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 items-center">
                        <button type="button"
                          onClick={() => handleEdit(notice)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="수정"
                        >
                          <Edit2 size={18} />
                        </button>
                        {(notice.targetLang === 'ko' || notice.targetLang === 'all') && !notice.sourceNoticeId && (
                          <button type="button"
                            onClick={() => handleOpenTranslate(notice)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                            title="자동번역"
                          >
                            <Languages size={18} />
                          </button>
                        )}
                        <button type="button"
                          onClick={() => handleDelete(notice.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 자동번역 모달 */}
      {showTranslateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-label="자동번역 설정"
          onClick={(e) => { if (e.target === e.currentTarget) setShowTranslateModal(false); }}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowTranslateModal(false); }}
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🌐 자동번역 등록</h3>
            <p className="text-sm text-gray-600 mb-4">
              한글 공지사항을 AI가 자동으로 번역하여 각 언어 페이지에 등록합니다.
            </p>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">번역할 언어 선택</p>
              <div className="flex flex-col gap-2">
                {(['en', 'ja', 'zh'] as const).map((lang) => {
                  const opt = LANG_OPTIONS.find((o) => o.value === lang)!;
                  return (
                    <label key={lang} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedTranslateLangs.includes(lang)}
                        onChange={() => toggleTranslateLang(lang)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button"
                onClick={handleTranslate}
                disabled={translateMutation.isPending || selectedTranslateLangs.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {translateMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                번역 시작
              </button>
              <button type="button"
                onClick={() => setShowTranslateModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

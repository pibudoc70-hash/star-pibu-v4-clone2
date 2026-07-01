'use client';
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Video, Zap, X, Play, ExternalLink } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';

interface YouTubeVideo {
  id: number;
  title: string;
  videoId: string;
  type: 'video' | 'shorts';
  sortOrder: number;
  isActive: string;
}

type TabType = 'all' | 'video' | 'shorts';

/** 유튜브 썸네일 URL */
function getThumbUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/** 유튜브 임베드 URL (일반/쇼츠 공통) */
function getEmbedUrl(video: YouTubeVideo) {
  const base = video.type === 'shorts'
    ? `https://www.youtube.com/embed/${video.videoId}?autoplay=1&loop=1&playlist=${video.videoId}`
    : `https://www.youtube.com/embed/${video.videoId}?autoplay=1`;
  return base;
}

/** 유튜브 원본 URL */
function getYouTubeUrl(video: YouTubeVideo) {
  return video.type === 'shorts'
    ? `https://www.youtube.com/shorts/${video.videoId}`
    : `https://www.youtube.com/watch?v=${video.videoId}`;
}

// ─── 미리보기 모달 ───────────────────────────────────────────────
function PreviewModal({
  video,
  onClose,
}: {
  video: YouTubeVideo;
  onClose: () => void;
}) {
  const isShorts = video.type === 'shorts';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative bg-black rounded-xl shadow-2xl overflow-hidden ${
          isShorts ? 'w-[360px]' : 'w-[800px] max-w-[95vw]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <div className="flex items-center gap-2 min-w-0">
            {isShorts ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-600 text-white shrink-0">
                <Zap size={11} /> 쇼츠
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shrink-0">
                <Video size={11} /> 일반
              </span>
            )}
            <span className="text-white text-sm font-medium truncate">{video.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <a
              href={getYouTubeUrl(video)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              title="YouTube에서 열기"
            >
              <ExternalLink size={16} />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              title="닫기"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 영상 임베드 */}
        <div className={isShorts ? 'aspect-[9/16]' : 'aspect-video'}>
          <iframe
            src={getEmbedUrl(video)}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-xs text-gray-400">
          <span>영상 ID: <code className="text-gray-300 font-mono">{video.videoId}</code></span>
          <span>정렬 순서: {video.sortOrder}</span>
        </div>
      </div>
    </div>
  );
}

// ─── 썸네일 셀 ───────────────────────────────────────────────────
function ThumbnailCell({
  video,
  onClick,
}: {
  video: YouTubeVideo;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 text-left w-full"
      title="클릭하여 미리보기"
    >
      {/* 썸네일 */}
      <div className="relative shrink-0 w-20 h-[45px] rounded overflow-hidden bg-gray-200">
        <img
          src={getThumbUrl(video.videoId)}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* 재생 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
          <Play
            size={18}
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white"
          />
        </div>
      </div>
      {/* 제목 */}
      <span className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
        {video.title}
      </span>
    </button>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────
export default function AdminYouTube() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [previewVideo, setPreviewVideo] = useState<YouTubeVideo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    videoId: '',
    type: 'video' as 'video' | 'shorts',
    sortOrder: 0,
  });

  const { data: videos = [], refetch } = trpc.youtube.getAll.useQuery();

  const createMutation = trpc.admin.youtube.create.useMutation({
    onSuccess: () => {
      refetch();
      setFormData({ title: '', videoId: '', type: 'video', sortOrder: 0 });
    },
  });

  const updateMutation = trpc.admin.youtube.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingId(null);
      setFormData({ title: '', videoId: '', type: 'video', sortOrder: 0 });
    },
  });

  const deleteMutation = trpc.admin.youtube.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한 없음</h1>
          <p className="text-gray-600">관리자만 접근할 수 있습니다.</p>
          <button type="button" onClick={() => setLocation('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.videoId) {
      alert('제목과 영상 ID를 입력해주세요.');
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (video: YouTubeVideo) => {
    setEditingId(video.id);
    setFormData({ title: video.title, videoId: video.videoId, type: video.type, sortOrder: video.sortOrder });
    setActiveTab(video.type);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', videoId: '', type: 'video', sortOrder: 0 });
  };

  const filteredVideos = (videos as YouTubeVideo[]).filter((v) =>
    activeTab === 'all' ? true : v.type === activeTab
  );

  const videoCount = (videos as YouTubeVideo[]).filter((v) => v.type === 'video').length;
  const shortsCount = (videos as YouTubeVideo[]).filter((v) => v.type === 'shorts').length;

  const tabs: { key: TabType; label: string; count: number; icon: React.ReactNode; color: string }[] = [
    { key: 'all',    label: '전체',     count: (videos as YouTubeVideo[]).length, icon: null,               color: 'blue'   },
    { key: 'video',  label: '일반 영상', count: videoCount,                        icon: <Video size={15} />, color: 'indigo' },
    { key: 'shorts', label: '쇼츠',     count: shortsCount,                        icon: <Zap size={15} />,   color: 'rose'   },
  ];

  const tabActiveClass = (key: TabType, color: string) => {
    if (activeTab !== key) return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
    const m: Record<string, string> = { blue: 'border-blue-600 text-blue-600', indigo: 'border-indigo-600 text-indigo-600', rose: 'border-rose-500 text-rose-500' };
    return m[color] ?? 'border-blue-600 text-blue-600';
  };

  const badgeClass = (key: TabType, color: string) => {
    if (activeTab !== key) return 'bg-gray-100 text-gray-500';
    const m: Record<string, string> = { blue: 'bg-blue-100 text-blue-700', indigo: 'bg-indigo-100 text-indigo-700', rose: 'bg-rose-100 text-rose-600' };
    return m[color] ?? 'bg-blue-100 text-blue-700';
  };

  return (
    <>
      {/* 미리보기 모달 */}
      {previewVideo && (
        <PreviewModal video={previewVideo} onClose={() => setPreviewVideo(null)} />
      )}

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">YouTube 영상 관리</h1>

          {/* 폼 섹션 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? '영상 수정' : '새 영상 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input type="text" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="영상 제목을 입력하세요" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube 영상 ID</label>
                <input type="text" value={formData.videoId}
                  onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: dQw4w9WgXcQ" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">타입</label>
                  <select value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'video' | 'shorts' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="video">일반 영상</option>
                    <option value="shorts">쇼츠</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                  <input type="number" value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus size={18} />
                  {editingId ? '수정' : '추가'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancel}
                    className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400">
                    취소
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* 영상 목록 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 탭 헤더 */}
            <div className="border-b border-gray-200 px-6">
              <nav className="-mb-px flex gap-6" aria-label="영상 타입 탭">
                {tabs.map((tab) => (
                  <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tabActiveClass(tab.key, tab.color)}`}>
                    {tab.icon}
                    {tab.label}
                    <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass(tab.key, tab.color)}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* 안내 문구 */}
            <div className="px-6 py-2 bg-gray-50 border-b text-xs text-gray-400">
              썸네일 또는 제목을 클릭하면 페이지 이동 없이 영상을 미리볼 수 있습니다.
            </div>

            {/* 테이블 */}
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">제목 / 썸네일</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">영상 ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-24">타입</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-20">정렬</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-36">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                      {activeTab === 'all' ? '등록된 영상이 없습니다.' :
                       activeTab === 'video' ? '등록된 일반 영상이 없습니다.' :
                       '등록된 쇼츠가 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  filteredVideos.map((video) => (
                    <tr key={video.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <ThumbnailCell video={video} onClick={() => setPreviewVideo(video)} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{video.videoId}</td>
                      <td className="px-6 py-4 text-sm">
                        {video.type === 'video' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                            <Video size={11} /> 일반
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-600">
                            <Zap size={11} /> 쇼츠
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{video.sortOrder}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleEdit(video)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            <Edit2 size={14} /> 수정
                          </button>
                          <button type="button"
                            onClick={() => { if (confirm('정말 이 영상을 삭제하시겠습니까?')) deleteMutation.mutate({ id: video.id }); }}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                            <Trash2 size={14} /> 삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

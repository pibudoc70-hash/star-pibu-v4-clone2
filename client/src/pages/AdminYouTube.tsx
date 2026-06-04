'use client';
import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
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

export default function AdminYouTube() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    videoId: '',
    type: 'video' as 'video' | 'shorts',
    sortOrder: 0,
  });

  // YouTube 영상 조회
  const { data: videos = [], refetch } = trpc.youtube.getAll.useQuery();

  // YouTube 영상 생성
  const createMutation = trpc.youtube.create.useMutation({
    onSuccess: () => {
      refetch();
      setFormData({ title: '', videoId: '', type: 'video', sortOrder: 0 });
    },
  });

  // YouTube 영상 수정
  const updateMutation = trpc.youtube.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingId(null);
      setFormData({ title: '', videoId: '', type: 'video', sortOrder: 0 });
    },
  });

  // YouTube 영상 삭제
  const deleteMutation = trpc.youtube.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.videoId) {
      alert('제목과 영상 ID를 입력해주세요.');
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (video: YouTubeVideo) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      videoId: video.videoId,
      type: video.type,
      sortOrder: video.sortOrder,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', videoId: '', type: 'video', sortOrder: 0 });
  };

  return (
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="영상 제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube 영상 ID
              </label>
              <input
                type="text"
                value={formData.videoId}
                onChange={(e) =>
                  setFormData({ ...formData, videoId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: dQw4w9WgXcQ"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  타입
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'video' | 'shorts',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="video">일반 영상</option>
                  <option value="shorts">쇼츠</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  정렬 순서
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                {editingId ? '수정' : '추가'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                >
                  취소
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 영상 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  영상 ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  타입
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  정렬 순서
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video: YouTubeVideo) => (
                <tr key={video.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {video.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {video.videoId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {video.type === 'video' ? '일반 영상' : '쇼츠'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {video.sortOrder}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button type="button"
                        onClick={() => handleEdit(video)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <Edit2 size={16} />
                        수정
                      </button>
                      <button type="button"
                        onClick={() => {
                          if (
                            confirm(
                              '정말 이 영상을 삭제하시겠습니까?'
                            )
                          ) {
                            deleteMutation.mutate({ id: video.id });
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <Trash2 size={16} />
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

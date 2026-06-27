import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Pin } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';

interface Notice {
  id: number;
  title: string;
  content: string;
  isPinned: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminNotices() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPinned: '0' as '0' | '1',
  });

  // 공지사항 목록 조회
  const { data: notices = [], refetch } = trpc.notices.list.useQuery();

  // 공지사항 생성
  const createMutation = trpc.notices.create.useMutation({
    onSuccess: () => {
      refetch();
      setFormData({ title: '', content: '', isPinned: '0' });
      setShowForm(false);
    },
  });

  // 공지사항 수정
  const updateMutation = trpc.notices.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingId(null);
      setFormData({ title: '', content: '', isPinned: '0' });
      setShowForm(false);
    },
  });

  // 공지사항 삭제
  const deleteMutation = trpc.notices.delete.useMutation({
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
    if (!formData.title || !formData.content) {
      alert('제목과 내용을 입력해주세요.');
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

  const handleEdit = (notice: Notice) => {
    setEditingId(notice.id);
    setFormData({
      title: notice.title,
      content: notice.content,
      isPinned: (notice.isPinned as '0' | '1'),
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', isPinned: '0' });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">공지사항 관리</h1>
          <button type="button"
            onClick={() => {
              setShowForm(!showForm);
              if (editingId) setEditingId(null);
              if (showForm) setFormData({ title: '', content: '', isPinned: '0' });
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="공지사항 제목을 입력하세요"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/300
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-64"
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPinned === '1'}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked ? '1' : '0' })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">상단 고정</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {editingId ? '수정' : '작성'}
                </button>
                <button type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {notices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              공지사항이 없습니다.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">제목</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">조회수</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작성일</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작업</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice: any) => (
                  <tr key={notice.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {notice.isPinned === '1' && (
                          <Pin size={16} className="text-red-500" />
                        )}
                        {notice.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {notice.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        notice.isPinned === '1'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notice.isPinned === '1' ? '고정' : '일반'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button type="button"
                          onClick={() => handleEdit(notice)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="수정"
                        >
                          <Edit2 size={18} />
                        </button>
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
    </div>
  );
}

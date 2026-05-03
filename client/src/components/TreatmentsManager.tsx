/**
 * TreatmentsManager - 시술·장비 관리 컴포넌트
 * 관리자가 시술 및 장비 정보를 추가, 수정, 삭제할 수 있는 UI
 */
import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload, Loader } from "lucide-react";

interface TreatmentForm {
  id?: number;
  categoryId: string;
  name: string;
  nameEn: string;
  desc: string;
  time: string;
  recovery: string;
  badge?: string;
  badgeColor?: string;
  image?: string;
  detail?: string;
  caution?: string;
  youtubeUrl?: string;
  best?: "0" | "1";
  section?: "v1" | "v2";
  sortOrder?: number;
  isActive?: "0" | "1";
}

const CATEGORIES = [
  { id: "best", label: "Best 시술" },
  { id: "lifting", label: "리프팅" },
  { id: "eye", label: "눈밑지방재배치" },
  { id: "vitiligo", label: "백반증" },
  { id: "pigment", label: "색소치료" },
  { id: "scar", label: "흉터치료" },
  { id: "acne_laser", label: "여드름 레이저" },
  { id: "rosacea", label: "주사" },
  { id: "acne", label: "여드름" },
  { id: "fungus", label: "손발톱무좀" },
  { id: "psoriasis", label: "건선" },
  { id: "volume", label: "보톡스/필러" },
  { id: "botox", label: "보톡스" },
];

interface TreatmentsManagerProps {
  section?: "v1" | "v2";
}

export default function TreatmentsManager({ section = "v1" }: TreatmentsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState<TreatmentForm>({
    section: section,
    categoryId: "best",
    name: "",
    nameEn: "",
    desc: "",
    time: "",
    recovery: "",
    badge: "",
    badgeColor: "#4A6FA5",
    image: "",
    detail: "",
    caution: "",
    youtubeUrl: "",
    best: "0",
    sortOrder: 0,
    isActive: "1",
  });

  // 시술 목록 조회
  const { data: allTreatments, refetch: refetchTreatments, isLoading } = trpc.treatments.all.useQuery({ section });
  
  // section별 필터링
  const treatments = useMemo(() => {
    if (!allTreatments) return [];
    return allTreatments.filter((t: any) => (t.section || "v1") === section);
  }, [allTreatments, section]);

  // 시술 생성
  const createMutation = trpc.treatments.create.useMutation({
    onSuccess: () => {
      refetchTreatments();
      toast.success("시술이 추가되었습니다.");
      resetForm();
    },
    onError: (err) => {
      toast.error(`추가 실패: ${err.message}`);
    },
  });

  // 시술 수정
  const updateMutation = trpc.treatments.update.useMutation({
    onSuccess: () => {
      refetchTreatments();
      toast.success("시술이 수정되었습니다.");
      resetForm();
    },
    onError: (err) => {
      toast.error(`수정 실패: ${err.message}`);
    },
  });

  // 시술 삭제
  const deleteMutation = trpc.treatments.delete.useMutation({
    onSuccess: () => {
      refetchTreatments();
      toast.success("시술이 삭제되었습니다.");
    },
    onError: (err) => {
      toast.error(`삭제 실패: ${err.message}`);
    },
  });

  // 이미지 업로드
  const uploadImageMutation = trpc.treatments.uploadImage.useMutation({
    onSuccess: (data) => {
      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success("이미지가 업로드되었습니다.");
      setImageUploading(false);
    },
    onError: (err) => {
      toast.error(`업로드 실패: ${err.message}`);
      setImageUploading(false);
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      uploadImageMutation.mutate({
        base64,
        fileName: file.name,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.nameEn || !form.desc || !form.time || !form.recovery) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...form,
      });
    } else {
      createMutation.mutate({ ...form, section });
    }
  };

  const handleEdit = (treatment: any) => {
    setForm({
      id: treatment.id,
      categoryId: treatment.categoryId,
      name: treatment.name,
      nameEn: treatment.nameEn,
      desc: treatment.desc,
      time: treatment.time,
      recovery: treatment.recovery,
      badge: treatment.badge || "",
      badgeColor: treatment.badgeColor || "#4A6FA5",
      image: treatment.image || "",
      detail: treatment.detail || "",
      caution: treatment.caution || "",
      youtubeUrl: treatment.youtubeUrl || "",
      best: treatment.best || "0",
      sortOrder: treatment.sortOrder || 0,
      isActive: treatment.isActive || "1",
    });
    setEditingId(treatment.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate({ id });
    }
  };

  const resetForm = () => {
    setForm({
      categoryId: "best",
      name: "",
      nameEn: "",
      desc: "",
      time: "",
      recovery: "",
      badge: "",
      badgeColor: "#4A6FA5",
      image: "",
      detail: "",
      caution: "",
      youtubeUrl: "",
      best: "0",
      sortOrder: 0,
      isActive: "1",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getCategoryLabel = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId;
  };

  const filteredTreatments = treatments || [];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">시술·장비 관리</h2>
          <p className="text-sm text-gray-600 mt-1">시술 및 장비 정보를 추가, 수정, 삭제합니다</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          새 시술 추가
        </button>
      </div>

      {/* 폼 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editingId ? "시술 수정" : "새 시술 추가"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 이름 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시술명 (한글) *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 눈밑지방재배치"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시술명 (영문) *
                  </label>
                  <input
                    type="text"
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: Under Eye Fat Repositioning"
                  />
                </div>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  짧은 설명 *
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="시술에 대한 간단한 설명"
                  rows={3}
                />
              </div>

              {/* 시간, 회복 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시술 시간 *
                  </label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 60~90분"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회복 기간 *
                  </label>
                  <input
                    type="text"
                    value={form.recovery}
                    onChange={(e) => setForm({ ...form, recovery: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 당일 일상"
                  />
                </div>
              </div>

              {/* 배지 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배지 텍스트
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 인기"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배지 색상
                  </label>
                  <input
                    type="color"
                    value={form.badgeColor || "#4A6FA5"}
                    onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition">
                    <Upload size={18} />
                    {imageUploading ? "업로드 중..." : "이미지 선택"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                      className="hidden"
                    />
                  </label>
                  {form.image && (
                    <div className="flex items-center gap-2">
                      <img
                        src={form.image}
                        alt="preview"
                        className="max-w-xs h-auto max-h-32 object-contain rounded border border-gray-200"
                      />
                      <button
                        onClick={() => setForm({ ...form, image: "" })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 상세 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세 설명
                </label>
                <textarea
                  value={form.detail}
                  onChange={(e) => setForm({ ...form, detail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="시술에 대한 상세한 설명"
                  rows={4}
                />
              </div>

              {/* 주의사항 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기대효과
                </label>
                <textarea
                  value={form.caution}
                  onChange={(e) => setForm({ ...form, caution: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="기대되는 효과"
                  rows={3}
                />
              </div>

              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube 영상 URL
                </label>
                <input
                  type="url"
                  value={form.youtubeUrl}
                  onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Section, Best, 정렬순서, 활성화 */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    섹션 *
                  </label>
                  <select
                    value={form.section || "v1"}
                    onChange={(e) => setForm({ ...form, section: e.target.value as "v1" | "v2" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="v1">시술·장비소개 1</option>
                    <option value="v2">시술·장비소개 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Best 시술
                  </label>
                  <select
                    value={form.best}
                    onChange={(e) => setForm({ ...form, best: e.target.value as "0" | "1" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0">아니오</option>
                    <option value="1">예</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    정렬 순서
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    활성화
                  </label>
                  <select
                    value={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value as "0" | "1" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">활성화</option>
                    <option value="0">비활성화</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex gap-3 justify-end">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    처리 중...
                  </>
                ) : (
                  editingId ? "수정" : "추가"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 시술 목록 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">로드 중...</div>
        ) : filteredTreatments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">등록된 시술이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">카테고리</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">시술명</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">시간</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">회복</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTreatments.map((treatment: any) => (
                  <tr key={treatment.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getCategoryLabel(treatment.categoryId)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {treatment.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{treatment.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{treatment.recovery}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          treatment.isActive === "1"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {treatment.isActive === "1" ? "활성화" : "비활성화"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(treatment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(treatment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function AdminEquipment2Edit() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/admin/equipment2/:id/edit");
  const treatmentId = params?.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    categoryId: "1",
    desc: "",
    detail: "",
    time: "60분",
    recovery: "당일 일상",
    slug: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 시술 데이터 조회
  const { data: treatment, isLoading } = trpc.treatments.byId.useQuery(
    { id: treatmentId! },
    { enabled: !!treatmentId }
  );

  // 시술 데이터 로드
  useEffect(() => {
    if (treatment) {
      setFormData({
        name: treatment.name || "",
        nameEn: treatment.nameEn || "",
        categoryId: treatment.categoryId || "1",
        desc: treatment.desc || "",
        detail: treatment.detail || "",
        time: treatment.time || "60분",
        recovery: treatment.recovery || "당일 일상",
        slug: treatment.slug || "",
        image: treatment.image || "",
      });
    }
  }, [treatment]);

  const updateTreatment = trpc.treatments.update.useMutation();
  const deleteTreatment = trpc.treatments.delete.useMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!treatmentId) {
        alert("시술 ID가 없습니다.");
        return;
      }

      await updateTreatment.mutateAsync({
        id: treatmentId,
        categoryId: formData.categoryId,
        name: formData.name,
        nameEn: formData.nameEn,
        desc: formData.desc,
        detail: formData.detail,
        time: formData.time,
        recovery: formData.recovery,
        slug: formData.slug,
        image: formData.image,
      });

      alert("시술이 성공적으로 수정되었습니다!");
      navigate("/admin");
    } catch (error) {
      console.error("수정 실패:", error);
      alert("시술 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 시술을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setIsDeleting(true);

    try {
      if (!treatmentId) {
        alert("시술 ID가 없습니다.");
        return;
      }

      await deleteTreatment.mutateAsync({ id: treatmentId });

      alert("시술이 성공적으로 삭제되었습니다!");
      navigate("/admin");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("시술 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">페이지를 찾을 수 없습니다</h1>
          <Button onClick={() => navigate("/admin")} variant="outline">
            관리자 대시보드로 이동
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">시술을 찾을 수 없습니다</h1>
          <Button onClick={() => navigate("/admin")} variant="outline">
            관리자 대시보드로 이동
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button type="button"
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-gray-200 rounded-md transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold">시술 수정</h1>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "삭제 중..." : "삭제"}
          </Button>
        </div>

        {/* 폼 */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">기본 정보</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">시술명 *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="예: 울쎄라"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">영문명 *</label>
                  <Input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleChange}
                    placeholder="예: Ulthera"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">카테고리 ID *</label>
                  <Input
                    type="text"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    placeholder="예: 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL 슬러그</label>
                  <Input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="예: ulthera"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    /equipment2/{formData.slug || "slug"}로 접근 가능
                  </p>
                </div>
              </div>
            </div>

            {/* 설명 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">설명</h2>

              <div>
                <label className="block text-sm font-medium mb-2">짧은 설명 (한 줄) *</label>
                <Input
                  type="text"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  placeholder="예: 고주파 에너지로 피부를 탄력있게 만드는 시술"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">상세 설명</label>
                <Textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  placeholder="시술에 대한 상세한 설명을 입력하세요..."
                  rows={6}
                />
              </div>
            </div>

            {/* 시술 정보 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">시술 정보</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">시술 시간</label>
                  <Input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="예: 60분"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">회복 기간</label>
                  <Input
                    type="text"
                    name="recovery"
                    value={formData.recovery}
                    onChange={handleChange}
                    placeholder="예: 당일 일상"
                  />
                </div>
              </div>
            </div>

            {/* 이미지 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">이미지</h2>

              <div>
                <label className="block text-sm font-medium mb-2">이미지 URL</label>
                <Input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">미리보기:</p>
                    <img
                      src={formData.image}
                      alt="미리보기"
                      className="max-w-xs h-auto rounded-md"
                      onError={() => alert("이미지를 불러올 수 없습니다.")}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.desc}
                className="flex-1"
              >
                {isSubmitting ? "수정 중..." : "시술 수정"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin")}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

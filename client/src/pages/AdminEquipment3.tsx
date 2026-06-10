/**
 * AdminEquipment3 - 시술·장비 관리 목록 페이지
 * URL: /admin/equipment3
 *
 * 기능:
 *  - 카테고리(탭) 순서 변경
 *  - 전체 시술 목록 표시 (비활성 포함)
 *  - 드래그 없이 ↑↓ 버튼으로 순서 변경
 *  - 활성/비활성 토글
 *  - 삭제
 *  - 신규 등록 / 수정 페이지로 이동
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  Eye, EyeOff, GripVertical,
} from "lucide-react";

export default function AdminEquipment3() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [categoryReordering, setCategoryReordering] = useState(false);

  function toast({ title, description, variant }: { title: string; description?: string; variant?: string }) {
    if (variant === "destructive") {
      alert(`❌ ${title}\n${description || ""}`);
    } else {
      alert(`✅ ${title}${description ? "\n" + description : ""}`);
    }
  }

  const { data: items = [], isLoading, error } = trpc.equipment3.all.useQuery();
  const [reordering, setReordering] = useState(false);

  const deleteMutation = trpc.equipment3.delete.useMutation({
    onSuccess: () => {
      utils.equipment3.all.invalidate();
      toast({ title: "삭제 완료", description: "시술이 삭제되었습니다." });
    },
    onError: (err) => toast({ title: "삭제 실패", description: err.message, variant: "destructive" }),
  });

  const updateMutation = trpc.equipment3.update.useMutation({
    onSuccess: () => utils.equipment3.all.invalidate(),
    onError: (err) => toast({ title: "업데이트 실패", description: err.message, variant: "destructive" }),
  });

  const reorderMutation = trpc.equipment3.reorder.useMutation({
    onSuccess: () => {
      utils.equipment3.all.invalidate();
      setReordering(false);
      setCategoryReordering(false);
      toast({ title: "순서 저장 완료" });
    },
    onError: (err) => toast({ title: "순서 저장 실패", description: err.message, variant: "destructive" }),
  });

  // 카테고리별 그룹화
  const categoriesMap = new Map<string, typeof items>();
  items.forEach(item => {
    const cat = item.category || "기타";
    if (!categoriesMap.has(cat)) {
      categoriesMap.set(cat, []);
    }
    categoriesMap.get(cat)!.push(item);
  });

  // 카테고리 순서 (첫 항목의 sortOrder 기준)
  const categories = Array.from(categoriesMap.entries())
    .map(([name, items]) => ({
      name,
      items,
      sortOrder: Math.min(...items.map(i => i.sortOrder)),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const [localCategoryOrder, setLocalCategoryOrder] = useState<typeof categories>([]);
  const displayCategories = categoryReordering ? localCategoryOrder : categories;

  function startCategoryReorder() {
    setLocalCategoryOrder([...categories]);
    setCategoryReordering(true);
  }

  function cancelCategoryReorder() {
    setCategoryReordering(false);
    setLocalCategoryOrder([]);
  }

  function moveCategoryItem(index: number, direction: "up" | "down") {
    const arr = [...localCategoryOrder];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setLocalCategoryOrder(arr);
  }

  function saveCategoryOrder() {
    const updates: Array<{ id: number; sortOrder: number }> = [];
    let currentSortOrder = 0;
    
    localCategoryOrder.forEach(category => {
      category.items.forEach(item => {
        updates.push({ id: item.id, sortOrder: currentSortOrder });
        currentSortOrder++;
      });
    });

    reorderMutation.mutate({ items: updates });
  }

  // 로컬 순서 상태 (순서 변경 편집 모드용)
  const [localOrder, setLocalOrder] = useState<typeof items>([]);
  const displayItems = reordering ? localOrder : items;

  function startReorder() {
    setLocalOrder([...items]);
    setReordering(true);
  }

  function cancelReorder() {
    setReordering(false);
    setLocalOrder([]);
  }

  function moveItem(index: number, direction: "up" | "down") {
    const arr = [...localOrder];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setLocalOrder(arr);
  }

  function saveOrder() {
    reorderMutation.mutate({
      items: localOrder.map((item, idx) => ({ id: item.id, sortOrder: idx })),
    });
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`"${name}" 시술을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
    deleteMutation.mutate({ id });
  }

  function toggleActive(id: number, current: "0" | "1") {
    updateMutation.mutate({ id, isActive: current === "1" ? "0" : "1" });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-gray-200 rounded-md transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">시술·장비 관리</h1>
              <p className="text-gray-500 text-sm mt-1">
                /equipment3 페이지에 표시되는 시술 목록을 관리합니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {categoryReordering ? (
              <>
                <Button variant="outline" size="sm" onClick={cancelCategoryReorder}>취소</Button>
                <Button size="sm" onClick={saveCategoryOrder} disabled={reorderMutation.isPending}>
                  {reorderMutation.isPending ? "저장 중..." : "탭 순서 저장"}
                </Button>
              </>
            ) : reordering ? (
              <>
                <Button variant="outline" size="sm" onClick={cancelReorder}>취소</Button>
                <Button size="sm" onClick={saveOrder} disabled={reorderMutation.isPending}>
                  {reorderMutation.isPending ? "저장 중..." : "순서 저장"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={startCategoryReorder}>
                  <GripVertical className="h-4 w-4 mr-1" />
                  탭 순서 변경
                </Button>
                <Button variant="outline" size="sm" onClick={startReorder}>
                  <GripVertical className="h-4 w-4 mr-1" />
                  항목 순서 변경
                </Button>
                <Button size="sm" onClick={() => navigate("/admin/equipment3/new")}>
                  <Plus className="h-4 w-4 mr-1" />
                  새 시술 등록
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 카테고리 순서 관리 */}
        {categoryReordering && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-3">탭(카테고리) 순서 변경</h2>
            <p className="text-blue-800 text-sm mb-4">
              ↑↓ 버튼으로 탭의 순서를 변경하세요. 변경 후 "탭 순서 저장" 버튼을 클릭하면 /equipment3 페이지에 반영됩니다.
            </p>
            <div className="space-y-2">
              {displayCategories.map((category, idx) => (
                <div key={category.name} className="bg-white rounded-lg p-3 flex items-center gap-3">
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveCategoryItem(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCategoryItem(idx, "down")}
                      disabled={idx === displayCategories.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-gray-400 text-sm font-mono w-6 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-gray-900">{category.name}</span>
                  <span className="text-gray-500 text-sm ml-auto">({category.items.length}개 항목)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 목록 */}
        {categoryReordering ? null : isLoading ? (
          <div className="text-center py-20 text-gray-500">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p className="mb-4">⚠️ 데이터 로드 실패</p>
            <p className="text-sm">{error.message}</p>
          </div>
        ) : !categoryReordering && items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-4">등록된 시술이 없습니다.</p>
            <Button onClick={() => navigate("/admin/equipment3/new")}>
              <Plus className="h-4 w-4 mr-1" />
              첫 시술 등록하기
            </Button>
          </div>
        ) : !categoryReordering ? (
          <div className="space-y-3">
            {displayItems.map((item, idx) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${
                  item.isActive === "0" ? "opacity-60" : ""
                }`}
              >
                {/* 순서 변경 버튼 */}
                {reordering && (
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveItem(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, "down")}
                      disabled={idx === displayItems.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* 순서 번호 */}
                <span className="text-gray-400 text-sm font-mono w-6 text-center shrink-0">
                  {idx + 1}
                </span>

                {/* 썸네일 */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                      ✦
                    </div>
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    {item.nameEn && (
                      <span className="text-gray-400 text-sm">{item.nameEn}</span>
                    )}
                    {item.badge && (
                      <Badge
                        style={{ backgroundColor: item.badgeColor || "#4A6FA5", color: "#fff" }}
                        className="text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {String(item.isBest) === "1" && (
                      <Badge style={{ backgroundColor: "#d1ab67", color: "#fff" }} className="text-xs">
                        ★ Best
                      </Badge>
                    )}
                    <Badge variant={item.isActive === "1" ? "default" : "secondary"}>
                      {item.isActive === "1" ? "활성" : "비활성"}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm mt-0.5 truncate">
                    {item.category && <span className="mr-2 text-blue-500">[{item.category}]</span>}
                    {item.desc || <span className="italic text-gray-300">설명 없음</span>}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    slug: <code className="bg-gray-100 px-1 rounded">{item.slug}</code>
                  </p>
                </div>

                {/* 액션 버튼 */}
                {!reordering && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      title={item.isActive === "1" ? "비활성화" : "활성화"}
                      onClick={() => toggleActive(item.id, item.isActive as "0" | "1")}
                      className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
                    >
                      {item.isActive === "1" ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      title="수정"
                      onClick={() => navigate(`/admin/equipment3/${item.id}/edit`)}
                      className="p-2 rounded-lg hover:bg-blue-50 transition text-blue-500"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="삭제"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 rounded-lg hover:bg-red-50 transition text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* 하단 안내 */}
        {!reordering && !categoryReordering && items.length > 0 && (
          <p className="text-center text-gray-400 text-sm mt-6">
            총 {items.length}개 시술 (활성: {items.filter(i => i.isActive === "1").length}개) | 탭(카테고리): {categories.length}개
          </p>
        )}
      </div>
    </div>
  );
}

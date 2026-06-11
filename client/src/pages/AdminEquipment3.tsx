/**
 * AdminEquipment3 - 시술·장비 관리 목록 페이지
 * URL: /admin/equipment3
 *
 * 기능:
 *  - 카테고리(탭) 순서 변경
 *  - 메뉴탭별 시술 필터링
 *  - 드래그 앤 드롭으로 탭 내 항목 순서 변경 (자동 저장)
 *  - 활성/비활성 토글
 *  - 삭제
 *  - 신규 등록 / 수정 페이지로 이동
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft, Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  Eye, EyeOff, GripVertical, Save,
} from "lucide-react";

// ── 드래그 가능한 시술 카드 ──────────────────────────────────────
type Item = {
  id: number;
  name: string;
  nameEn?: string | null;
  category?: string | null;
  desc?: string | null;
  slug: string;
  imageUrl?: string | null;
  badge?: string | null;
  badgeColor?: string | null;
  isBest?: string | number | null;
  isActive: string;
  sortOrder: number;
};

function SortableItem({
  item,
  idx,
  isDragging,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  item: Item;
  idx: number;
  isDragging: boolean;
  onToggleActive: (id: number, current: "0" | "1") => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSelfDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSelfDragging ? 0.35 : 1,
    zIndex: isSelfDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-shadow ${
        item.isActive === "0" ? "opacity-60" : ""
      } ${isSelfDragging ? "shadow-2xl" : "hover:shadow-sm"}`}
    >
      {/* 드래그 핸들 */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="p-1.5 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 shrink-0 touch-none"
        title="드래그하여 순서 변경"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* 순서 번호 */}
      <span className="text-gray-400 text-sm font-mono w-6 text-center shrink-0">
        {idx + 1}
      </span>

      {/* 썸네일 */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">✦</div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900">{item.name}</span>
          {item.nameEn && <span className="text-gray-400 text-sm">{item.nameEn}</span>}
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
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          title={item.isActive === "1" ? "비활성화" : "활성화"}
          onClick={() => onToggleActive(item.id, item.isActive as "0" | "1")}
          className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
        >
          {item.isActive === "1" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        <button
          type="button"
          title="수정"
          onClick={() => onEdit(item.id)}
          className="p-2 rounded-lg hover:bg-blue-50 transition text-blue-500"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="삭제"
          onClick={() => onDelete(item.id, item.name)}
          className="p-2 rounded-lg hover:bg-red-50 transition text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ── 드래그 오버레이용 미니 카드 ──────────────────────────────────
function DragOverlayCard({ item }: { item: Item }) {
  return (
    <div className="bg-white rounded-xl border shadow-2xl p-4 flex items-center gap-4 opacity-95 rotate-1">
      <GripVertical className="h-5 w-5 text-gray-400 shrink-0" />
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">✦</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-gray-900">{item.name}</span>
        {item.nameEn && <span className="text-gray-400 text-sm ml-2">{item.nameEn}</span>}
      </div>
    </div>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────────
export default function AdminEquipment3() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [categoryReordering, setCategoryReordering] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("__all__");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [localItems, setLocalItems] = useState<Item[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const initializedRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function toast({ title, description, variant }: { title: string; description?: string; variant?: string }) {
    if (variant === "destructive") {
      alert(`❌ ${title}\n${description || ""}`);
    } else {
      alert(`✅ ${title}${description ? "\n" + description : ""}`);
    }
  }

  const { data: items = [], isLoading, error } = trpc.equipment3.all.useQuery();

  // 서버 데이터 → localItems 동기화
  // - 최초 로드 시 무조건 동기화
  // - 저장 완료(isDirty=false로 리셋) 직후 서버 데이터로 갱신
  useEffect(() => {
    if (items.length === 0) return;
    if (!initializedRef.current) {
      // 최초 1회 초기화
      initializedRef.current = true;
      setLocalItems(items as Item[]);
      return;
    }
    // isDirty가 false일 때만 서버 데이터로 덮어씀 (저장 완료 후 갱신)
    if (!isDirty) {
      setLocalItems(items as Item[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

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
      setCategoryReordering(false);
      setIsDirty(false);
      setSaving(false);
      toast({ title: "순서 저장 완료" });
    },
    onError: (err) => {
      setSaving(false);
      toast({ title: "순서 저장 실패", description: err.message, variant: "destructive" });
    },
  });

  // 카테고리별 그룹화 (localItems 기준)
  const categoriesMap = new Map<string, Item[]>();
  localItems.forEach(item => {
    const cat = item.category || "기타";
    if (!categoriesMap.has(cat)) categoriesMap.set(cat, []);
    categoriesMap.get(cat)!.push(item);
  });

  const categories = Array.from(categoriesMap.entries())
    .map(([name, catItems]) => ({
      name,
      items: catItems,
      sortOrder: Math.min(...catItems.map(i => i.sortOrder)),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const [localCategoryOrder, setLocalCategoryOrder] = useState<typeof categories>([]);
  const displayCategories = categoryReordering ? localCategoryOrder : categories;

  // 현재 탭에서 보여줄 항목
  const filteredItems = activeTab === "__all__"
    ? localItems
    : localItems.filter(item => (item.category || "기타") === activeTab);

  // 드래그 중인 아이템
  const draggingItem = activeId ? localItems.find(i => i.id === activeId) ?? null : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as number);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setLocalItems(prev => {
      const oldIdx = prev.findIndex(i => i.id === active.id);
      const newIdx = prev.findIndex(i => i.id === over.id);
      if (oldIdx === -1 || newIdx === -1) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
    setIsDirty(true);
  }

  function saveOrder() {
    setSaving(true);
    reorderMutation.mutate({
      items: localItems.map((item, idx) => ({ id: item.id, sortOrder: idx })),
    });
  }

  function discardOrder() {
    setLocalItems(items as Item[]);
    setIsDirty(false);
  }

  // 카테고리 순서 변경
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
    let cur = 0;
    localCategoryOrder.forEach(category => {
      category.items.forEach(item => {
        updates.push({ id: item.id, sortOrder: cur++ });
      });
    });
    reorderMutation.mutate({ items: updates });
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
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={startCategoryReorder}>
                  <GripVertical className="h-4 w-4 mr-1" />
                  탭 순서 변경
                </Button>
                <Button size="sm" onClick={() => navigate("/admin/equipment3/new")}>
                  <Plus className="h-4 w-4 mr-1" />
                  새 시술 등록
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 카테고리 순서 관리 패널 */}
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
                  <span className="text-gray-400 text-sm font-mono w-6 text-center shrink-0">{idx + 1}</span>
                  <span className="font-semibold text-gray-900">{category.name}</span>
                  <span className="text-gray-500 text-sm ml-auto">({category.items.length}개 항목)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 메뉴 탭 필터 */}
        {!categoryReordering && !isLoading && !error && localItems.length > 0 && (
          <div className="mb-5">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("__all__")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeTab === "__all__"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-900"
                }`}
              >
                전체
                <span className={`ml-1.5 text-xs ${activeTab === "__all__" ? "text-gray-300" : "text-gray-400"}`}>
                  {localItems.length}
                </span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setActiveTab(cat.name)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    activeTab === cat.name
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {cat.name}
                  <span className={`ml-1.5 text-xs ${activeTab === cat.name ? "text-blue-200" : "text-gray-400"}`}>
                    {cat.items.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 변경사항 저장 배너 */}
        {isDirty && !categoryReordering && (
          <div className="mb-4 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <p className="text-amber-800 text-sm font-medium">
              순서가 변경되었습니다. 저장하지 않으면 새로고침 시 초기화됩니다.
            </p>
            <div className="flex gap-2 shrink-0 ml-4">
              <Button variant="outline" size="sm" onClick={discardOrder}>되돌리기</Button>
              <Button size="sm" onClick={saveOrder} disabled={saving}>
                <Save className="h-3.5 w-3.5 mr-1" />
                {saving ? "저장 중..." : "순서 저장"}
              </Button>
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
        ) : localItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-4">등록된 시술이 없습니다.</p>
            <Button onClick={() => navigate("/admin/equipment3/new")}>
              <Plus className="h-4 w-4 mr-1" />
              첫 시술 등록하기
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>이 카테고리에 등록된 시술이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 드래그 안내 */}
            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
              <GripVertical className="h-3.5 w-3.5" />
              왼쪽 핸들을 드래그하여 순서를 변경하세요. 변경 후 상단 배너에서 저장하세요.
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredItems.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {filteredItems.map((item, idx) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      idx={idx}
                      isDragging={activeId === item.id}
                      onToggleActive={toggleActive}
                      onEdit={(id) => navigate(`/admin/equipment3/${id}/edit`)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {draggingItem ? <DragOverlayCard item={draggingItem} /> : null}
              </DragOverlay>
            </DndContext>
          </>
        )}

        {/* 하단 안내 */}
        {!categoryReordering && localItems.length > 0 && (
          <p className="text-center text-gray-400 text-sm mt-6">
            {activeTab === "__all__"
              ? `총 ${localItems.length}개 시술 (활성: ${localItems.filter(i => i.isActive === "1").length}개) | 탭(카테고리): ${categories.length}개`
              : `${activeTab} — ${filteredItems.length}개 시술 (활성: ${filteredItems.filter(i => i.isActive === "1").length}개)`
            }
          </p>
        )}
      </div>
    </div>
  );
}

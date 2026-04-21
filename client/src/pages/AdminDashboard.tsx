/**
 * AdminDashboard - STAR 피부과 관리자 대시보드
 * - 회원 관리 탭: 회원 목록, 역할 변경
 * - 예약 관리 탭: 예약 목록, 상태 변경
 */
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  Users, Shield, TrendingUp, ChevronLeft, ChevronRight,
  Crown, LogOut, Home, RefreshCw, Calendar, Clock,
  CheckCircle, XCircle, AlertCircle, ClipboardList, Megaphone, Plus, Pencil, Trash2, Eye, EyeOff, GripVertical
} from "lucide-react";
import StarLogo from "@/components/StarLogo";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type AdminTab = "users" | "popup" | "events";
type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";
type ReservationFilter = "all" | "member" | "guest";

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "대기 중", color: "#D97706", bg: "#FEF3C7" },
  confirmed: { label: "확정", color: "#059669", bg: "#D1FAE5" },
  completed: { label: "완료", color: "#6B7280", bg: "#F3F4F6" },
  cancelled: { label: "취소됨", color: "#EF4444", bg: "#FEE2E2" },
};

// 드래그 가능한 이벤트 아이템 컴포넌트
function DraggableEventItem({ event, onEdit, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 -ml-2 mr-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
      >
        <GripVertical size={18} className="text-[#9CA3AF]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4 className="font-bold text-[#1F2937]">{event.title}</h4>
          {event.featured && <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] text-xs font-semibold rounded">Featured</span>}
          {event.isActive === '1' && <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold rounded">활성화</span>}
          {event.isActive === '0' && <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold rounded">비활성화</span>}
        </div>
        <p className="text-sm text-[#6B7280]">{event.subtitle}</p>
        <div className="flex gap-4 text-xs text-[#9CA3AF] mt-2 flex-wrap">
          <span>{event.date}</span>
          <span>카테고리: {event.category || '이벤트'}</span>
          <span>조회수: {event.views || 0}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(event)}
          className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
        >
          <Pencil size={16} className="text-[#6B7280]" />
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="p-2 rounded-lg hover:bg-[#FEE2E2] transition-colors"
        >
          <Trash2 size={16} className="text-[#EF4444]" />
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("popup");
  const [userPage, setUserPage] = useState(1);
  const [popupEditId, setPopupEditId] = useState<number | null>(null);

  const [imageUploading, setImageUploading] = useState(false);
  const [popupForm, setPopupForm] = useState<{
    tab: string; badge: string; title: string; subtitle: string;
    desc: string; note: string; imageUrl: string;
    accent: string; accentLight: string; sortOrder: number; isActive: "0" | "1";
    priceItems: { label: string; original: string; price: string }[];
    startAt: number | null; endAt: number | null;
  } | null>(null);
  const pageSize = 15;

  // 드래그 앤 드롭 상태
  const [sortedEvents, setSortedEvents] = useState<any[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        window.location.href = getLoginUrl();
      } else if (user && user.role !== "admin") {
        window.location.href = "/";
      }
    }
  }, [loading, isAuthenticated, user]);

  const { data: stats, refetch: refetchStats } = trpc.admin.stats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = trpc.admin.listUsers.useQuery(
    { page: userPage, pageSize },
    { enabled: !!user && user.role === "admin" && activeTab === "users" }
  );

  // reservations query removed

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => { refetchUsers(); refetchStats(); toast.success("역할이 변경되었습니다."); },
    onError: () => toast.error("역할 변경에 실패했습니다."),
  });

  // updateStatusMutation removed

  const { data: popupList, refetch: refetchPopup } = trpc.popup.adminList.useQuery(undefined, {
    enabled: !!user && user.role === "admin" && activeTab === "popup",
  });

  const createPopupMutation = trpc.popup.create.useMutation({
    onSuccess: () => { refetchPopup(); toast.success("이벤트가 추가되었습니다."); setPopupForm(null); },
    onError: () => toast.error("추가에 실패했습니다."),
  });

  // 이벤트 관리
  const [eventForm, setEventForm] = useState<any>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const { data: eventsList, refetch: refetchEvents } = trpc.events.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin" && activeTab === "events",
  });

  // eventsList 변경 시 sortedEvents 업데이트
  useEffect(() => {
    if (eventsList) {
      setSortedEvents(eventsList);
    }
  }, [eventsList]);

  const createEventMutation = trpc.events.create.useMutation({
    onSuccess: () => { refetchEvents(); toast.success("이벤트가 추가되었습니다."); setEventForm(null); },
    onError: () => toast.error("추가에 실패했습니다."),
  });

  const updateEventMutation = trpc.events.update.useMutation({
    onSuccess: () => { refetchEvents(); toast.success("이벤트가 수정되었습니다."); setEventForm(null); setEditingEventId(null); },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const deleteEventMutation = trpc.events.delete.useMutation({
    onSuccess: () => { refetchEvents(); toast.success("이벤트가 삭제되었습니다."); },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  // 드래그 앤 드롭 정렬 업데이트 뮤테이션
  const updateSortOrderMutation = trpc.events.updateSortOrder.useMutation({
    onSuccess: () => {
      toast.success("순서가 저장되었습니다.");
      refetchEvents();
    },
    onError: () => toast.error("순서 저장에 실패했습니다."),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedEvents.findIndex((item) => item.id === active.id);
      const newIndex = sortedEvents.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(sortedEvents, oldIndex, newIndex);
      setSortedEvents(newItems);

      // 정렬 순서 업데이트
      const itemsToUpdate = newItems.map((item, index) => ({
        id: item.id,
        sortOrder: index,
      }));

      updateSortOrderMutation.mutate({ items: itemsToUpdate });
    }
  };

  // 나머지 코드는 동일...
  const handleCreateEvent = async () => {
    if (!eventForm) return;
    const { id, ...data } = eventForm;
    if (editingEventId) {
      updateEventMutation.mutate({ id: editingEventId, ...data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* 헤더 */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StarLogo />
            <div>
              <h1 className="text-xl font-bold text-[#1F2937]">관리자 대시보드</h1>
              <p className="text-sm text-[#6B7280]">{user?.name || "관리자"}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors"
          >
            <LogOut size={18} />
            로그아웃
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 탭 */}
        <div className="flex gap-4 mb-8 border-b border-[#E5E7EB]">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "users"
                ? "border-[#3B82F6] text-[#3B82F6]"
                : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <Users size={18} className="inline mr-2" />
            회원 관리
          </button>
          <button
            onClick={() => setActiveTab("popup")}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "popup"
                ? "border-[#3B82F6] text-[#3B82F6]"
                : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <Megaphone size={18} className="inline mr-2" />
            팝업 이벤트
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "events"
                ? "border-[#3B82F6] text-[#3B82F6]"
                : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <ClipboardList size={18} className="inline mr-2" />
            이벤트 관리
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F2937]">
              {activeTab === "users" ? "회원 관리" : activeTab === "popup" ? "팝업 이벤트 관리" : "이벤트 관리"}
            </h2>
            {activeTab !== "users" && (
              <button
                onClick={() => {
                  if (activeTab === "popup") {
                    setPopupForm({
                      tab: "",
                      badge: "",
                      title: "",
                      subtitle: "",
                      desc: "",
                      note: "",
                      imageUrl: "",
                      accent: "#4A6FA5",
                      accentLight: "#EEF4FF",
                      sortOrder: 0,
                      isActive: "1",
                      priceItems: [],
                      startAt: null,
                      endAt: null,
                    });
                  } else {
                    setEventForm({
                      title: "",
                      subtitle: "",
                      desc: "",
                      content: "",
                      badge: "",
                      tag: "",
                      date: "",
                      category: "이벤트",
                      isActive: "1",
                      sortOrder: 0,
                      isSpecialEvent: "0",
                      productName: "",
                      normalPrice: 0,
                      discountPrice: 0,
                      priceRows: [],
                      anesthesiaFee: "",
                    });
                  }
                  setEditingEventId(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-colors"
              >
                <Plus size={18} />
                새 {activeTab === "popup" ? "팝업 이벤트" : "이벤트"} 추가
              </button>
            )}
          </div>

          {/* 이벤트 관리 탭 */}
          {activeTab === "events" && (
            <div>
              {eventForm ? (
                <div className="mb-6 p-4 bg-[#F3F4F6] rounded-lg">
                  <h3 className="font-bold mb-4">{editingEventId ? "이벤트 수정" : "새 이벤트 추가"}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="제목"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="col-span-2 px-3 py-2 border border-[#D1D5DB] rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="부제목"
                      value={eventForm.subtitle}
                      onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
                      className="col-span-2 px-3 py-2 border border-[#D1D5DB] rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="배지"
                      value={eventForm.badge}
                      onChange={(e) => setEventForm({ ...eventForm, badge: e.target.value })}
                      className="px-3 py-2 border border-[#D1D5DB] rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="태그"
                      value={eventForm.tag}
                      onChange={(e) => setEventForm({ ...eventForm, tag: e.target.value })}
                      className="px-3 py-2 border border-[#D1D5DB] rounded-lg"
                    />
                    <textarea
                      placeholder="설명"
                      value={eventForm.desc}
                      onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })}
                      className="col-span-2 px-3 py-2 border border-[#D1D5DB] rounded-lg"
                    />
                    <textarea
                      placeholder="상세 내용"
                      value={eventForm.content}
                      onChange={(e) => setEventForm({ ...eventForm, content: e.target.value })}
                      className="col-span-2 px-3 py-2 border border-[#D1D5DB] rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="날짜"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="px-3 py-2 border border-[#D1D5DB] rounded-lg"
                    />
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      className="px-3 py-2 border border-[#D1D5DB] rounded-lg"
                    >
                      <option value="신규시술">신규시술</option>
                      <option value="이벤트">이벤트</option>
                      <option value="공지사항">공지사항</option>
                      <option value="기타">기타</option>
                    </select>
                    <select
                      value={eventForm.isActive}
                      onChange={(e) => setEventForm({ ...eventForm, isActive: e.target.value })}
                      className="px-3 py-2 border border-[#D1D5DB] rounded-lg"
                    >
                      <option value="1">활성화</option>
                      <option value="0">비활성화</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateEvent}
                      className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB]"
                    >
                      {editingEventId ? "수정" : "추가"}
                    </button>
                    <button
                      onClick={() => { setEventForm(null); setEditingEventId(null); }}
                      className="px-4 py-2 bg-[#E5E7EB] text-[#1F2937] rounded-lg hover:bg-[#D1D5DB]"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : null}

              {/* 이벤트 목록 */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedEvents.map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedEvents && sortedEvents.length > 0 ? (
                    <div className="space-y-3">
                      {sortedEvents.map((event: any) => (
                        <DraggableEventItem
                          key={event.id}
                          event={event}
                          onEdit={(e: any) => {
                            const formData = {
                              ...e,
                              priceRows: typeof e.priceRows === 'string' ? JSON.parse(e.priceRows || '[]') : (e.priceRows || []),
                              isSpecialEvent: e.isSpecialEvent || "0",
                              anesthesiaFee: e.anesthesiaFee || ""
                            };
                            setEventForm(formData);
                            setEditingEventId(e.id);
                          }}
                          onDelete={(id: number) => {
                            if (confirm("정말 삭제하시겠습니까?")) {
                              deleteEventMutation.mutate({ id });
                            }
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[#6B7280]">이벤트가 없습니다.</p>
                    </div>
                  )}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  CheckCircle, XCircle, AlertCircle, ClipboardList, Megaphone, Plus, Pencil, Trash2, Eye, EyeOff, Stethoscope, Youtube, ChevronUp, ChevronDown
} from "lucide-react";
import StarLogo from "@/components/StarLogo";
import TreatmentsManager from "@/components/TreatmentsManager";
import { toast } from "sonner";

type AdminTab = "users" | "popup" | "events" | "treatments" | "treatmentsV2" | "reservations" | "unavailableSlots" | "youtube";
type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";
type ReservationFilter = "all" | "member" | "guest";

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "대기 중", color: "#D97706", bg: "#FEF3C7" },
  confirmed: { label: "확정", color: "#059669", bg: "#D1FAE5" },
  completed: { label: "완료", color: "#6B7280", bg: "#F3F4F6" },
  cancelled: { label: "취소됨", color: "#EF4444", bg: "#FEE2E2" },
};

export default function AdminDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("treatments");
  const [userPage, setUserPage] = useState(1);
  const [reservationPage, setReservationPage] = useState(1);
  const [popupEditId, setPopupEditId] = useState<number | null>(null);
  const [unavailableSlotForm, setUnavailableSlotForm] = useState<{ date: string; reason: string } | null>(null);

  const [imageUploading, setImageUploading] = useState(false);
  const [popupForm, setPopupForm] = useState<{
    tab: string; badge: string; title: string; subtitle: string;
    desc: string; note: string; imageUrl: string;
    accent: string; accentLight: string; sortOrder: number; isActive: "0" | "1";
    priceItems: { label: string; original: string; price: string }[];
    startAt: number | null; endAt: number | null;
  } | null>(null);
  const pageSize = 15;
  const reservationPageSize = 20;

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

  // 예약 관리 쿼리
  const { data: reservationsData, isLoading: reservationsLoading, refetch: refetchReservations } = trpc.admin.listReservations.useQuery(
    { page: reservationPage, pageSize: reservationPageSize },
    { enabled: !!user && user.role === "admin" && activeTab === "reservations" }
  );
  // 예약 불가능 날짜 쿼리
  const { data: unavailableSlotsData, refetch: refetchUnavailableSlots } = trpc.admin.unavailableSlots.list.useQuery(
    { date: undefined },
    { enabled: !!user && user.role === "admin" && activeTab === "unavailableSlots" }
  );

  const createUnavailableSlot = trpc.admin.unavailableSlots.create.useMutation({
    onSuccess: () => { refetchUnavailableSlots(); toast.success("예약 불가능 날짜가 추가되었습니다."); },
    onError: () => toast.error("추가에 실패했습니다."),
  });

  const deleteUnavailableSlot = trpc.admin.unavailableSlots.delete.useMutation({
    onSuccess: () => { refetchUnavailableSlots(); toast.success("예약 불가능 날짜가 삭제되었습니다."); },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => { refetchUsers(); refetchStats(); toast.success("역할이 변경되었습니다."); },
    onError: () => toast.error("역할 변경에 실패했습니다."),
  });

  const updateReservationStatusMutation = trpc.admin.updateReservationStatus.useMutation({
    onSuccess: () => { refetchReservations(); refetchStats(); toast.success("예약 상태가 변경되었습니다."); },
    onError: (err) => toast.error("상태 변경 실패: " + err.message),
  });

  const handleStatusChange = (reservationId: number, newStatus: ReservationStatus) => {
    updateReservationStatusMutation.mutate({ id: reservationId, status: newStatus });
  };

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

  const uploadEventImageMutation = trpc.events.uploadImage.useMutation({
    onError: () => toast.error("이미지 업로드에 실패했습니다."),
  });

  const updatePopupMutation = trpc.popup.update.useMutation({
    onSuccess: () => { refetchPopup(); toast.success("이벤트가 수정되었습니다."); setPopupEditId(null); setPopupForm(null); },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const deletePopupMutation = trpc.popup.delete.useMutation({
    onSuccess: () => { refetchPopup(); toast.success("이벤트가 삭제되었습니다."); },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const uploadImageMutation = trpc.popup.uploadImage.useMutation({
    onSuccess: (data) => {
      setPopupForm(f => f ? { ...f, imageUrl: data.url } : f);
      toast.success("이미지가 업로드되었습니다.");
      setImageUploading(false);
    },
    onError: (err) => {
      toast.error("이미지 업로드 실패: " + err.message);
      setImageUploading(false);
    },
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기가 5MB를 초과합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImageUploading(true);
      uploadImageMutation.mutate({
        base64,
        fileName: file.name,
        mimeType: file.type || "image/jpeg",
      });
    };
    reader.readAsDataURL(file);
    // input 초기화 (동일 파일 재선택 가능)
    e.target.value = "";
  };

  const togglePopupActive = (id: number, current: "0" | "1") => {
    updatePopupMutation.mutate({ id, isActive: current === "1" ? "0" : "1" });
  };

  const openNewPopupForm = () => {
    setPopupEditId(null);
    setPopupForm({ tab: "", badge: "", title: "", subtitle: "", desc: "", note: "", imageUrl: "", accent: "#4A6FA5", accentLight: "#EEF4FF", sortOrder: 0, isActive: "1", priceItems: [{ label: "", original: "", price: "" }], startAt: null, endAt: null });
  };

  const openEditPopupForm = (ev: typeof popupList extends (infer T)[] | undefined ? T : never) => {
    if (!ev) return;
    setPopupEditId((ev as any).id);
    setPopupForm({
      tab: (ev as any).tab, badge: (ev as any).badge, title: (ev as any).title,
      subtitle: (ev as any).subtitle, desc: (ev as any).desc ?? "",
      note: (ev as any).note, imageUrl: (ev as any).imageUrl ?? "",
      accent: (ev as any).accent, accentLight: (ev as any).accentLight,
      sortOrder: (ev as any).sortOrder, isActive: (ev as any).isActive,
      priceItems: (ev as any).priceItems?.length ? (ev as any).priceItems : [{ label: "", original: "", price: "" }],
      startAt: (ev as any).startAt ?? null,
      endAt: (ev as any).endAt ?? null,
    });
  };

  const submitPopupForm = () => {
    if (!popupForm) return;
    if (popupEditId !== null) {
      updatePopupMutation.mutate({ id: popupEditId, ...popupForm });
    } else {
      createPopupMutation.mutate(popupForm);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D2B4E]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#4A9FA5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-white/60">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") return null;

  const userTotalPages = usersData ? Math.ceil(usersData.total / pageSize) : 1;

  const loginMethodBadge: Record<string, { bg: string; color: string; label: string }> = {
    kakao: { bg: "#FEF9C3", color: "#92400E", label: "카카오" },
    naver: { bg: "#DCFCE7", color: "#166534", label: "네이버" },
    google: { bg: "#EFF6FF", color: "#1D4ED8", label: "Google" },
    manus: { bg: "#F3F4F6", color: "#374151", label: "Manus" },
  };

  // handleStatusChange removed - reservations feature disabled

  return (
    <div className="min-h-screen flex" style={{ background: "#F1F5F9" }}>
      {/* 사이드바 */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{ background: "linear-gradient(180deg, #0D2B4E 0%, #1A4A7A 100%)", minHeight: "100vh" }}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div style={{ padding: "2px", borderRadius: "10px", background: "linear-gradient(135deg, #F5D78E 0%, #C9A84C 50%, #E8C96A 100%)" }}>
              <div style={{ background: "white", borderRadius: "8px", padding: "3px 6px" }}>
                <StarLogo variant="color" height={28} />
              </div>
            </div>
            <div>
              <p className="text-white text-xs font-bold">STAR 피부과</p>
              <p className="text-white/50 text-xs">관리자 대시보드</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {/* 시술·장비 관리 탭 */}
          <button
            onClick={() => setActiveTab("treatments")}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{
              background: activeTab === "treatments" ? "rgba(255,255,255,0.15)" : "transparent",
              color: activeTab === "treatments" ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            <Stethoscope size={16} />
            시술·장비 관리
          </button>
          {/* 시술·장비소개 2 관리 탭 */}
          <button
            onClick={() => setActiveTab("treatmentsV2")}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{
              background: activeTab === "treatmentsV2" ? "rgba(255,255,255,0.15)" : "transparent",
              color: activeTab === "treatmentsV2" ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            <Stethoscope size={16} />
            시술·장비소개 2 관리
          </button>
          {/* 팝업 이벤트 탭 */}
          <button
            onClick={() => setActiveTab("popup")}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{
              background: activeTab === "popup" ? "rgba(255,255,255,0.15)" : "transparent",
              color: activeTab === "popup" ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            <Megaphone size={16} />
            팝업 이벤트
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{
              background: activeTab === "events" ? "rgba(255,255,255,0.15)" : "transparent",
              color: activeTab === "events" ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            <Calendar size={16} />
            이벤트 관리
          </button>
          {/* 예약 관리 탭 */}
          <button
            onClick={() => setActiveTab("reservations")}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{
              background: activeTab === "reservations" ? "rgba(255,255,255,0.15)" : "transparent",
              color: activeTab === "reservations" ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            <ClipboardList size={16} />
            예약 관리
          </button>
          {/* 예약 불가능 시간 탭 */}
          <button
            onClick={() => setActiveTab("unavailableSlots")}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{
              background: activeTab === "unavailableSlots" ? "rgba(255,255,255,0.15)" : "transparent",
              color: activeTab === "unavailableSlots" ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            <Clock size={16} />
            예약 불가능 날짜
          </button>
          {/* 유튜브 관리 탭 */}
          <button
            onClick={() => window.location.href = "/admin/youtube"}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <Youtube size={16} />
            유튜브 관리
          </button>
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm">
            <Home size={16} />홈페이지로
          </a>
          <button
            onClick={async () => { await logout(); window.location.href = "/"; }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            <LogOut size={16} />로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-[#1F2937]">
              {activeTab === "treatments" ? "시술·장비 관리" : activeTab === "treatmentsV2" ? "시술·장비소개 2 관리" : activeTab === "users" ? "회원 관리" : activeTab === "popup" ? "팩업 이벤트 관리" : activeTab === "reservations" ? "예약 관리"  : activeTab === "unavailableSlots" ? "예약 불가능 날짜" : "이벤트 관리"}
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              {activeTab === "treatments" ? "시술 및 장비 정보를 추가·수정·삭제합니다" : activeTab === "treatmentsV2" ? "시술·장비소개 2에 표시될 시술를 추가·수정·삭제합니다" : activeTab === "users" ? "가입 회원 목록 및 역할 관리" : activeTab === "popup" ? "홍 팩업에 표시될 이벤트를 추가·수정·삭제합니다" : activeTab === "reservations" ? "고객 예약을 관리하고 상태를 변경합니다"  : activeTab === "unavailableSlots" ? "스단 날짜와 시간을 예약 불가능하도록 설정합니다" : "이벤트를 추가·수정·삭제합니다"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "#FEF3C7", color: "#92400E" }}>
              <Crown size={13} />
              {user.name ?? "관리자"}
            </div>
            <button
              onClick={() => { refetchUsers(); refetchStats(); }}
              className="p-2 rounded-xl hover:bg-[#F3F4F6] transition-colors text-[#6B7280]"
              title="새로고침"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* 통계 카드 */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Users size={20} />, label: "전체 회원", value: stats?.totalUsers ?? "-", bg: "#EFF6FF", color: "#1D4ED8", iconBg: "#DBEAFE" },
              { icon: <TrendingUp size={20} />, label: "최근 7일 가입", value: stats?.recentSignups ?? "-", bg: "#F0FDF4", color: "#166534", iconBg: "#DCFCE7" },
              { icon: <ClipboardList size={20} />, label: "대기 예약", value: (stats as any)?.reservations?.pending ?? "-", bg: "#FEF3C7", color: "#D97706", iconBg: "#FDE68A" },
              { icon: <CheckCircle size={20} />, label: "확정 예약", value: (stats as any)?.reservations?.confirmed ?? "-", bg: "#F0FDF4", color: "#059669", iconBg: "#DCFCE7" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl p-5 flex items-center gap-4" style={{ background: stat.bg }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: stat.iconBg, color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: stat.color + "99" }}>{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ─── 시술·장비 관리 탭 ─── */}
          {activeTab === "treatments" && (
            <TreatmentsManager />
          )}

          {/* ─── 시술·장비소개 2 관리 탭 ─── */}
          {activeTab === "treatmentsV2" && (
            <TreatmentsManager section="v2" />
          )}

          {/* ─── 회원 관리 탭 ─── */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
              <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1F2937]">
                  회원 목록
                  {usersData && <span className="ml-2 text-xs font-normal text-[#9CA3AF]">총 {usersData.total}명</span>}
                </h2>
              </div>

              {usersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-[#4A9FA5] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#F3F4F6]" style={{ background: "#F9FAFB" }}>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">ID</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">이름</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">이메일</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">가입 방법</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">역할</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">가입일</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F3F4F6]">
                        {usersData?.users.map((member) => {
                          const badge = loginMethodBadge[member.loginMethod ?? "manus"] ?? loginMethodBadge.manus;
                          return (
                            <tr key={member.id} className="hover:bg-[#F9FAFB] transition-colors">
                              <td className="px-6 py-4 text-[#9CA3AF] text-xs font-mono">#{member.id}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#EEF7F7", color: "#4A9FA5" }}>
                                    {(member.name ?? "?")[0]?.toUpperCase()}
                                  </div>
                                  <span className="font-medium text-[#1F2937]">{member.name ?? "-"}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-[#6B7280] text-xs">{member.email ?? "-"}</td>
                              <td className="px-6 py-4">
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: badge.bg, color: badge.color }}>
                                  {badge.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {member.role === "admin" ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#FEF3C7", color: "#92400E" }}>
                                    <Crown size={10} />관리자
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#EEF7F7", color: "#4A9FA5" }}>
                                    일반 회원
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-[#6B7280] text-xs">
                                {member.createdAt ? new Date(member.createdAt).toLocaleDateString("ko-KR") : "-"}
                              </td>
                              <td className="px-6 py-4">
                                {member.id !== user.id && (
                                  <button
                                    onClick={() => updateRoleMutation.mutate({ userId: member.id, role: member.role === "admin" ? "user" : "admin" })}
                                    disabled={updateRoleMutation.isPending}
                                    className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
                                    style={{
                                      background: member.role === "admin" ? "#FEE2E2" : "#EEF7F7",
                                      color: member.role === "admin" ? "#EF4444" : "#4A9FA5",
                                    }}
                                  >
                                    {member.role === "admin" ? "일반으로" : "관리자로"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* 페이지네이션 */}
                  {userTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-[#F3F4F6]">
                      <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1} className="p-2 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors">
                        <ChevronLeft size={16} className="text-[#6B7280]" />
                      </button>
                      <span className="text-sm text-[#6B7280]">{userPage} / {userTotalPages}</span>
                      <button onClick={() => setUserPage(p => Math.min(userTotalPages, p + 1))} disabled={userPage === userTotalPages} className="p-2 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors">
                        <ChevronRight size={16} className="text-[#6B7280]" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ─── 팝업 이벤트 관리 탭 ─── */}
          {activeTab === "popup" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-[#6B7280]">팝업에 표시되는 이벤트 목록입니다. 비활성 이벤트는 팝업에서 숨겨집니다.</p>
                <button
                  onClick={openNewPopupForm}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "#4A9FA5" }}
                >
                  <Plus size={15} /> 이벤트 추가
                </button>
              </div>

              <div className="space-y-3">
                {!popupList || popupList.length === 0 ? (
                  <div className="text-center py-12 text-[#9CA3AF] text-sm">등록된 이벤트가 없습니다.</div>
                ) : (
                  (popupList || []).map((ev: any) => (
                    <div key={ev.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-4">
                      {ev.imageUrl ? (
                        <img src={ev.imageUrl} alt={ev.title} className="w-16 h-16 object-contain rounded-xl border border-[#F3F4F6] flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: ev.accentLight }}>
                          <Megaphone size={24} style={{ color: ev.accent }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: ev.accentLight, color: ev.accent }}>{ev.badge}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ ev.isActive === "1" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500" }`}>
                            {ev.isActive === "1" ? "활성" : "비활성"}
                          </span>
                        </div>
                        <p className="font-bold text-[#1F2937] text-sm truncate">{ev.title}</p>
                        <p className="text-xs text-[#9CA3AF] truncate">{ev.tab} · 순서 {ev.sortOrder}</p>
                        {/* 유효기간 표시 */}
                        {((ev as any).endAt || (ev as any).startAt) && (
                          <p className="text-xs mt-0.5">
                            {(ev as any).endAt && Date.now() > (ev as any).endAt ? (
                              <span className="text-red-500 font-semibold">⚠️ 기간 만료 ({new Date((ev as any).endAt).toLocaleDateString("ko-KR")})</span>
                            ) : (ev as any).startAt && Date.now() < (ev as any).startAt ? (
                              <span className="text-amber-500 font-semibold">⏳ {new Date((ev as any).startAt).toLocaleDateString("ko-KR")} 시작</span>
                            ) : (ev as any).endAt ? (
                              <span className="text-[#6B7280]">~ {new Date((ev as any).endAt).toLocaleDateString("ko-KR")} 종료</span>
                            ) : null}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => togglePopupActive(ev.id, ev.isActive)}
                          className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                          title={ev.isActive === "1" ? "비활성화" : "활성화"}
                        >
                          {ev.isActive === "1" ? <Eye size={15} className="text-green-600" /> : <EyeOff size={15} className="text-gray-400" />}
                        </button>
                        <button
                          onClick={() => openEditPopupForm(ev)}
                          className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                          title="수정"
                        >
                          <Pencil size={15} className="text-[#6B7280]" />
                        </button>
                        <button
                          onClick={() => { if (confirm("이벤트를 삭제하시겠습니까?")) deletePopupMutation.mutate({ id: ev.id }); }}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="삭제"
                        >
                          <Trash2 size={15} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {popupForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                      <h2 className="font-bold text-[#1F2937]">{popupEditId !== null ? "이벤트 수정" : "새 이벤트 추가"}</h2>
                      <button onClick={() => { setPopupForm(null); setPopupEditId(null); }} className="text-[#9CA3AF] hover:text-[#374151] text-xl leading-none">&times;</button>
                    </div>
                    <div className="px-6 py-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">탭 레이블 *</label>
                          <input className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm" value={popupForm.tab} onChange={e => setPopupForm(f => f && ({ ...f, tab: e.target.value }))} placeholder="세르프 이벤트" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">배지</label>
                          <input className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm" value={popupForm.badge} onChange={e => setPopupForm(f => f && ({ ...f, badge: e.target.value }))} placeholder="확장기념 특가" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">제목 *</label>
                          <input className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm" value={popupForm.title} onChange={e => setPopupForm(f => f && ({ ...f, title: e.target.value }))} placeholder="세르프 리프팅" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">영문 부제목</label>
                          <input className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm" value={popupForm.subtitle} onChange={e => setPopupForm(f => f && ({ ...f, subtitle: e.target.value }))} placeholder="XERF Lifting" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#374151] mb-1 block">설명</label>
                        <textarea className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm resize-none" rows={3} value={popupForm.desc} onChange={e => setPopupForm(f => f && ({ ...f, desc: e.target.value }))} placeholder="이벤트 설명 (줄바꿈 가능)" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#374151] mb-1 block">이미지</label>
                        {/* 이미지 미리보기 */}
                        {popupForm.imageUrl && (
                          <div className="relative mb-2 inline-block">
                            <img
                              src={popupForm.imageUrl}
                              alt="미리보기"
                              className="h-24 w-auto rounded-xl border border-[#E5E7EB] object-contain bg-[#F9FAFB]"
                            />
                            <button
                              type="button"
                              onClick={() => setPopupForm(f => f ? { ...f, imageUrl: "" } : f)}
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                              title="이미지 제거"
                            >
                              &times;
                            </button>
                          </div>
                        )}
                        {/* 파일 업로드 버튼 */}
                        <label
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-all text-sm ${
                            imageUploading
                              ? "border-[#4A9FA5] bg-[#F0FAFA] text-[#4A9FA5]"
                              : "border-[#D1D5DB] hover:border-[#4A9FA5] hover:bg-[#F0FAFA] text-[#6B7280] hover:text-[#4A9FA5]"
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageFileChange}
                            disabled={imageUploading}
                          />
                          {imageUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-[#4A9FA5] border-t-transparent rounded-full animate-spin" />
                              업로드 중...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {popupForm.imageUrl ? "다른 이미지 선택" : "이미지 파일 선택 (JPG/PNG/WEBP, 최대 5MB)"}
                            </>
                          )}
                        </label>
                        {/* URL 직접 입력 (선택사항) */}
                        <input
                          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs mt-2 text-[#9CA3AF]"
                          value={popupForm.imageUrl}
                          onChange={e => setPopupForm(f => f && ({ ...f, imageUrl: e.target.value }))}
                          placeholder="또는 URL 직접 입력 (https://...)"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#374151] mb-1 block">가격 항목</label>
                        {(popupForm?.priceItems || []).map((item, i) => (
                          <div key={i} className="flex gap-2 mb-2">
                            <input className="flex-1 border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-xs" value={item.label} onChange={e => setPopupForm(f => { if (!f) return f; const p = [...f.priceItems]; p[i] = { ...p[i], label: e.target.value }; return { ...f, priceItems: p }; })} placeholder="300샷" />
                            <input className="flex-1 border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-xs" value={item.original} onChange={e => setPopupForm(f => { if (!f) return f; const p = [...f.priceItems]; p[i] = { ...p[i], original: e.target.value }; return { ...f, priceItems: p }; })} placeholder="원가(선택)" />
                            <input className="flex-1 border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-xs" value={item.price} onChange={e => setPopupForm(f => { if (!f) return f; const p = [...f.priceItems]; p[i] = { ...p[i], price: e.target.value }; return { ...f, priceItems: p }; })} placeholder="80만원" />
                            {popupForm.priceItems.length > 1 && (
                              <button onClick={() => setPopupForm(f => { if (!f) return f; return { ...f, priceItems: f.priceItems.filter((_, j) => j !== i) }; })} className="text-red-400 hover:text-red-600 px-1">&times;</button>
                            )}
                          </div>
                        ))}
                        <button onClick={() => setPopupForm(f => f && ({ ...f, priceItems: [...f.priceItems, { label: "", original: "", price: "" }] }))} className="text-xs text-[#4A9FA5] hover:underline">+ 항목 추가</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">하단 노트</label>
                          <input className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm" value={popupForm.note} onChange={e => setPopupForm(f => f && ({ ...f, note: e.target.value }))} placeholder="* VAT 포함" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">표시 순서</label>
                          <input type="number" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm" value={popupForm.sortOrder} onChange={e => setPopupForm(f => f && ({ ...f, sortOrder: Number(e.target.value) }))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">강조색 (hex)</label>
                          <div className="flex gap-2">
                            <input type="color" className="w-10 h-9 rounded border border-[#E5E7EB] cursor-pointer" value={popupForm.accent} onChange={e => setPopupForm(f => f && ({ ...f, accent: e.target.value }))} />
                            <input className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm" value={popupForm.accent} onChange={e => setPopupForm(f => f && ({ ...f, accent: e.target.value }))} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">배경색 (hex)</label>
                          <div className="flex gap-2">
                            <input type="color" className="w-10 h-9 rounded border border-[#E5E7EB] cursor-pointer" value={popupForm.accentLight} onChange={e => setPopupForm(f => f && ({ ...f, accentLight: e.target.value }))} />
                            <input className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm" value={popupForm.accentLight} onChange={e => setPopupForm(f => f && ({ ...f, accentLight: e.target.value }))} />
                          </div>
                        </div>
                      </div>
                      {/* 유효기간 설정 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">시작일 <span className="font-normal text-[#9CA3AF]">(\ube44워두면 즉시 시작)</span></label>
                          <input
                            type="date"
                            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                            value={popupForm.startAt ? new Date(popupForm.startAt).toISOString().slice(0, 10) : ""}
                            onChange={e => {
                              const val = e.target.value;
                              setPopupForm(f => f && ({ ...f, startAt: val ? new Date(val + "T00:00:00").getTime() : null }));
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#374151] mb-1 block">종료일 <span className="font-normal text-[#9CA3AF]">(\ube44워두면 무기한)</span></label>
                          <input
                            type="date"
                            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                            value={popupForm.endAt ? new Date(popupForm.endAt).toISOString().slice(0, 10) : ""}
                            onChange={e => {
                              const val = e.target.value;
                              setPopupForm(f => f && ({ ...f, endAt: val ? new Date(val + "T23:59:59").getTime() : null }));
                            }}
                          />
                        </div>
                      </div>
                      {/* 기간 상태 표시 */}
                      {(popupForm.startAt || popupForm.endAt) && (
                        <div className="text-xs text-[#6B7280] bg-[#F9FAFB] rounded-lg px-3 py-2 border border-[#E5E7EB]">
                          {popupForm.startAt && popupForm.endAt ? (
                            <>
                              표시 기간: <strong>{new Date(popupForm.startAt).toLocaleDateString("ko-KR")}</strong> ~ <strong>{new Date(popupForm.endAt).toLocaleDateString("ko-KR")}</strong>
                              {Date.now() > popupForm.endAt && <span className="ml-2 text-red-500 font-semibold">⚠️ 기간 만료 (팝업에 표시 안 됨)</span>}
                              {Date.now() < popupForm.startAt && <span className="ml-2 text-amber-500 font-semibold">⏳ 시작 전 (팝업에 표시 안 됨)</span>}
                            </>
                          ) : popupForm.endAt ? (
                            <>종료일: <strong>{new Date(popupForm.endAt).toLocaleDateString("ko-KR")}</strong>{Date.now() > popupForm.endAt && <span className="ml-2 text-red-500 font-semibold">⚠️ 기간 만료</span>}</>
                          ) : (
                            <>시작일: <strong>{new Date(popupForm.startAt!).toLocaleDateString("ko-KR")}</strong></>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="isActiveCheck" checked={popupForm.isActive === "1"} onChange={e => setPopupForm(f => f && ({ ...f, isActive: e.target.checked ? "1" : "0" }))} className="w-4 h-4" />
                        <label htmlFor="isActiveCheck" className="text-sm text-[#374151]">팝업에 표시 (활성화)</label>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-3">
                      <button onClick={() => { setPopupForm(null); setPopupEditId(null); }} className="px-4 py-2 rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">취소</button>
                      <button
                        onClick={submitPopupForm}
                        disabled={createPopupMutation.isPending || updatePopupMutation.isPending}
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                        style={{ background: "#4A9FA5" }}
                      >
                        {createPopupMutation.isPending || updatePopupMutation.isPending ? "저장 중..." : popupEditId !== null ? "수정 저장" : "추가"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* 이벤트 관리 탭 */}
          {activeTab === "events" && (
            <div className="flex-1 flex flex-col">
              <div className="px-8 py-6 border-b border-[#E5E7EB] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1F2937]">이벤트 관리</h2>
                <button
                  onClick={() => { setEventForm({ type: "이벤트", title: "", subtitle: "", desc: "", content: "", date: "", badge: "", badgeColor: "#4A6FA5", accent: "#4A6FA5", accentDark: "#2D4A7A", accentBg: "#EEF3FA", iconBg: "#E0EBF7", iconType: "tag", tag: "", hot: "0", cta: "자세히 보기", views: 0, isFeatured: "0", sortOrder: 0, isActive: "1", category: "이벤트", imageUrl: "", productName: "", normalPrice: 0, discountPrice: 0, priceRows: [], isSpecialEvent: "0", anesthesiaFee: "" }); setEditingEventId(null); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all"
                  style={{ background: "#4A6FA5" }}
                >
                  <Plus size={16} />
                  새 이벤트 추가
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-4">
                  {/* 이벤트 추가/수정 폼 */}
                  {eventForm && (
                    <div className="bg-white border-2 border-[#4A6FA5] rounded-xl p-6 space-y-4 mb-6">
                      <h3 className="font-bold text-[#1F2937]">{editingEventId ? "이벤트 수정" : "새 이벤트 추가"}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="제목"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          placeholder="부제목"
                          value={eventForm.subtitle}
                          onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
                          className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                        />
                      </div>
                      <textarea
                        placeholder="내용 (상세 설명, 선택사항)"
                        value={eventForm.content}
                        onChange={(e) => setEventForm({ ...eventForm, content: e.target.value })}
                        className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                        rows={4}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="날짜 (예: 2026년 3월 28일) *필수"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                        />
                        <select
                          value={eventForm.category || "이벤트"}
                          onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                          className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                        >
                          <option value="신규시술">신규시술</option>
                          <option value="이벤트">이벤트</option>
                          <option value="공지사항">공지사항</option>
                          <option value="기타">기타</option>
                        </select>
                      </div>

                      {/* 가격 행 관리 */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-[#1F2937]">가격 정보</label>
                          <button
                            type="button"
                            onClick={() => {
                              const priceRows = eventForm.priceRows || [];
                              setEventForm({ ...eventForm, priceRows: [...priceRows, { label: "", normalPrice: 0, discountPrice: 0 }] });
                            }}
                            className="text-xs px-3 py-1 rounded-lg bg-[#4A6FA5] text-white hover:bg-[#3A5A95] transition-colors"
                          >
                            + 가격 행 추가
                          </button>
                        </div>
                        {(eventForm.priceRows || []).length > 0 ? (
                          <div className="space-y-2 bg-[#F9FAFB] p-4 rounded-lg">
                            {(eventForm.priceRows || []).map((row: any, idx: number) => (
                              <div key={idx} className="grid grid-cols-4 gap-2 items-end">
                                <input
                                  type="text"
                                  placeholder="상품명 (예: 세르프 300샷)"
                                  value={row.label || ""}
                                  onChange={(e) => {
                                    const rows = [...(eventForm.priceRows || [])];
                                    rows[idx] = { ...rows[idx], label: e.target.value };
                                    setEventForm({ ...eventForm, priceRows: rows });
                                  }}
                                  className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                                />
                                <input
                                  type="number"
                                  placeholder="정상가 (원)"
                                  value={row.normalPrice || ""}
                                  onChange={(e) => {
                                    const rows = [...(eventForm.priceRows || [])];
                                    rows[idx] = { ...rows[idx], normalPrice: parseInt(e.target.value) || 0 };
                                    setEventForm({ ...eventForm, priceRows: rows });
                                  }}
                                  className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                                />
                                <input
                                  type="number"
                                  placeholder="할인가 (원)"
                                  value={row.discountPrice || ""}
                                  onChange={(e) => {
                                    const rows = [...(eventForm.priceRows || [])];
                                    rows[idx] = { ...rows[idx], discountPrice: parseInt(e.target.value) || 0 };
                                    setEventForm({ ...eventForm, priceRows: rows });
                                  }}
                                  className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const rows = (eventForm.priceRows || []).filter((_: any, i: number) => i !== idx);
                                    setEventForm({ ...eventForm, priceRows: rows });
                                  }}
                                  className="px-3 py-2 text-red-600 hover:text-red-700 font-semibold text-sm"
                                >
                                  삭제
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#9CA3AF] italic">가격 행을 추가하려면 위의 "+ 가격 행 추가" 버튼을 클릭하세요.</p>
                        )}
                      </div>
                      {/* 이미지 업로드 */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#1F2937]">이미지 업로드</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setImageUploading(true);
                              try {
                                const reader = new FileReader();
                                reader.onload = async (event) => {
                                  const fileData = event.target?.result as string;
                                  try {
                                    const result = await uploadEventImageMutation.mutateAsync({
                                      fileData,
                                      fileName: file.name,
                                      mimeType: file.type || 'image/jpeg',
                                    });
                                    if (result.url) {
                                      setEventForm({ ...eventForm, imageUrl: result.url });
                                      toast.success('이미지가 업로드되었습니다.');
                                    }
                                  } catch (error) {
                                    console.error('Upload error:', error);
                                  } finally {
                                    setImageUploading(false);
                                  }
                                };
                                reader.onerror = () => {
                                  toast.error('파일 읽기에 실패했습니다.');
                                  setImageUploading(false);
                                };
                                reader.readAsDataURL(file);
                              } catch (error) {
                                toast.error('이미지 업로드에 실패했습니다.');
                                setImageUploading(false);
                              }
                            }
                          }}
                          className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                          disabled={imageUploading}
                        />
                        {eventForm.imageUrl && (
                          <div className="mt-2">
                            <img src={eventForm.imageUrl} alt="미리보기" className="w-full h-32 object-cover rounded-lg" />
                            <button
                              onClick={() => setEventForm({ ...eventForm, imageUrl: '' })}
                              className="mt-2 text-sm text-red-600 hover:text-red-700"
                            >
                              이미지 제거
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#1F2937]">이벤트 유형</label>
                        <select
                          value={eventForm.isSpecialEvent === "1" ? "special" : eventForm.isFeatured === "1" ? "featured" : "normal"}
                          onChange={(e) => {
                            if (e.target.value === "special") {
                              setEventForm({ ...eventForm, isSpecialEvent: "1", isFeatured: "0" });
                            } else if (e.target.value === "featured") {
                              setEventForm({ ...eventForm, isSpecialEvent: "0", isFeatured: "1" });
                            } else {
                              setEventForm({ ...eventForm, isSpecialEvent: "0", isFeatured: "0" });
                            }
                          }}
                          className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                        >
                          <option value="normal">일반 이벤트</option>
                          <option value="featured">Featured 이벤트</option>
                          <option value="special">SPECIAL EVENT</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#1F2937]">수면마취비 정보</label>
                        <input
                          type="text"
                          placeholder="예: 수면마취비 별도"
                          value={eventForm.anesthesiaFee || ""}
                          onChange={(e) => setEventForm({ ...eventForm, anesthesiaFee: e.target.value })}
                          className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={eventForm.isActive === "1"}
                          onChange={(e) => setEventForm({ ...eventForm, isActive: e.target.checked ? "1" : "0" })}
                          className="w-4 h-4"
                        />
                        <label className="text-sm text-[#6B7280]">활성화</label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEventForm(null); setEditingEventId(null); }}
                          className="flex-1 px-4 py-2 rounded-lg font-semibold text-[#6B7280] border border-[#D1D5DB] transition-colors hover:bg-[#F3F4F6]"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => {
                            if (eventForm.title && eventForm.date) {
                              if (editingEventId) {
                                const updateData = { id: editingEventId, ...eventForm };
                                if (!updateData.imageUrl) {
                                  delete updateData.imageUrl;
                                }
                                updateEventMutation.mutate(updateData);
                              } else {
                                createEventMutation.mutate(eventForm);
                              }
                            } else {
                              toast.error("제목과 날짜를 입력해주세요.");
                            }
                          }}
                          className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors"
                          style={{ background: "#4A6FA5" }}
                        >
                          {editingEventId ? "수정" : "추가"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 이벤트 목록 */}
                  {eventsList && eventsList.length > 0 ? (
                    <div className="space-y-3">
                      {(eventsList || []).map((event: any) => (
                        <div key={event.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between">
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
                              onClick={() => {
                                const currentIndex = eventsList.findIndex((e: any) => e.id === event.id);
                                if (currentIndex > 0) {
                                  const prevEvent = eventsList[currentIndex - 1];
                                  updateEventMutation.mutate({ id: event.id, sortOrder: prevEvent.sortOrder - 1 });
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                              title="위로 이동"
                            >
                              <ChevronUp size={16} className="text-[#6B7280]" />
                            </button>
                            <button
                              onClick={() => {
                                const currentIndex = eventsList.findIndex((e: any) => e.id === event.id);
                                if (currentIndex < eventsList.length - 1) {
                                  const nextEvent = eventsList[currentIndex + 1];
                                  updateEventMutation.mutate({ id: event.id, sortOrder: nextEvent.sortOrder + 1 });
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                              title="아래로 이동"
                            >
                              <ChevronDown size={16} className="text-[#6B7280]" />
                            </button>
                            <button
                              onClick={() => {
                                const formData = {
                                  ...event,
                                  priceRows: typeof event.priceRows === 'string' ? JSON.parse(event.priceRows || '[]') : (event.priceRows || []),
                                  isSpecialEvent: event.isSpecialEvent || "0",
                                  anesthesiaFee: event.anesthesiaFee || ""
                                };
                                setEventForm(formData);
                                setEditingEventId(event.id);
                              }}
                              className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                            >
                              <Pencil size={16} className="text-[#6B7280]" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("정말 삭제하시겠습니까?")) {
                                  deleteEventMutation.mutate({ id: event.id });
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-[#FEE2E2] transition-colors"
                            >
                              <Trash2 size={16} className="text-[#EF4444]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[#6B7280]">이벤트가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── 예약 관리 탭 ─── */}
          {activeTab === "reservations" && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
              <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1F2937]">
                  예약 목록
                  {reservationsData && <span className="ml-2 text-xs font-normal text-[#9CA3AF]">총 {reservationsData.total}건</span>}
                </h2>
              </div>

              {reservationsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-[#4A9FA5] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#F3F4F6]" style={{ background: "#F9FAFB" }}>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">ID</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">환자명</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">연락처</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">시술명</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">희망일시</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">상태</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">관리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F3F4F6]">
                        {(reservationsData?.items || []).map((reservation: any) => {
                          const statusConfig = STATUS_CONFIG[reservation.status as ReservationStatus];
                          return (
                            <tr key={reservation.id} className="hover:bg-[#F9FAFB] transition-colors">
                              <td className="px-6 py-4 text-[#9CA3AF] text-xs font-mono">#{reservation.id}</td>
                              <td className="px-6 py-4 font-medium text-[#1F2937]">{reservation.patientName}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-xs">{reservation.phone}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-xs">{reservation.treatmentName}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-xs">
                                {new Date(reservation.preferredDate).toLocaleDateString("ko-KR")} {reservation.preferredTime}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                                  {statusConfig.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={reservation.status}
                                  onChange={(e) => handleStatusChange(reservation.id, e.target.value as ReservationStatus)}
                                  className="px-2 py-1 rounded-lg border border-[#E5E7EB] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                                  style={{ color: statusConfig.color }}
                                >
                                  <option value="pending">대기 중</option>
                                  <option value="confirmed">확정</option>
                                  <option value="completed">완료</option>
                                  <option value="cancelled">취소됨</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* 페이지네이션 */}
                  {reservationsData && reservationsData.total > reservationPageSize && (
                    <div className="px-6 py-4 border-t border-[#F3F4F6] flex items-center justify-center gap-2">
                      <button
                        onClick={() => setReservationPage(p => Math.max(1, p - 1))}
                        disabled={reservationPage === 1}
                        className="p-2 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 transition-colors"
                      >
                        <ChevronLeft size={16} className="text-[#6B7280]" />
                      </button>
                      <span className="text-xs text-[#6B7280]">
                        {reservationPage} / {Math.ceil(reservationsData.total / reservationPageSize)}
                      </span>
                      <button
                        onClick={() => setReservationPage(p => p + 1)}
                        disabled={reservationPage >= Math.ceil(reservationsData.total / reservationPageSize)}
                        className="p-2 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 transition-colors"
                      >
                        <ChevronRight size={16} className="text-[#6B7280]" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {/* 예약 불가능 시간 탭 */}
          {activeTab === "unavailableSlots" && (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1F2937]">예약 불가능 날짜 설정</h2>
                  <button
                    onClick={() => setUnavailableSlotForm({ date: "", reason: "" })}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    추가
                  </button>
                </div>
                {unavailableSlotForm && (
                  <div className="mb-6 p-4 bg-[#F3F4F6] rounded-lg border border-[#E5E7EB]">
                    <h3 className="font-semibold text-[#1F2937] mb-4">예약 불가능 날짜 추가</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#1F2937] mb-2">날짜 *</label>
                        <input
                          type="date"
                          value={unavailableSlotForm.date}
                          onChange={(e) => setUnavailableSlotForm({ ...unavailableSlotForm, date: e.target.value })}
                          className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#1F2937] mb-2">사유 (선택)</label>
                        <input
                          type="text"
                          placeholder="예: 의료 회의, 시설 점검 등"
                          value={unavailableSlotForm.reason}
                          onChange={(e) => setUnavailableSlotForm({ ...unavailableSlotForm, reason: e.target.value })}
                          className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!unavailableSlotForm.date) {
                              toast.error("날짜를 선택해주세요.");
                              return;
                            }
                            createUnavailableSlot.mutate({
                              date: unavailableSlotForm.date,
                              reason: unavailableSlotForm.reason || undefined
                            });
                            setUnavailableSlotForm(null);
                          }}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setUnavailableSlotForm(null)}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {unavailableSlotsData?.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                      <div>
                        <p className="font-semibold text-[#1F2937]">{slot.date}</p>
                        {slot.reason && <p className="text-sm text-[#6B7280]">{slot.reason}</p>}
                      </div>
                      <button
                        onClick={() => deleteUnavailableSlot.mutate({ id: slot.id })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

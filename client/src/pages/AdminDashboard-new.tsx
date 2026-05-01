/**
 * AdminDashboard - STAR 피부과 관리자 대시보드
 * - 회원 관리 탭: 회원 목록, 역할 변경
 * - 팝업 이벤트 탭: 팝업 이벤트 관리
 * - 이벤트 탭: 이벤트 관리
 * - 시술·장비 탭: 시술 및 장비 정보 관리
 */
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  Users, Shield, TrendingUp, ChevronLeft, ChevronRight,
  Crown, LogOut, Home, RefreshCw, Calendar, Clock,
  CheckCircle, XCircle, AlertCircle, ClipboardList, Megaphone, Plus, Pencil, Trash2, Eye, EyeOff, Stethoscope
} from "lucide-react";
import StarLogo from "@/components/StarLogo";
import TreatmentsManager from "@/components/TreatmentsManager";
import { toast } from "sonner";

type AdminTab = "users" | "popup" | "events" | "treatments";
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

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => { refetchUsers(); refetchStats(); toast.success("역할이 변경되었습니다."); },
    onError: () => toast.error("역할 변경에 실패했습니다."),
  });

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

  const uploadImageMutation = trpc.popup.uploadImage.useMutation({
    onSuccess: (data) => {
      setPopupForm((prev) => prev ? { ...prev, imageUrl: data.url } : null);
      toast.success("이미지가 업로드되었습니다.");
      setImageUploading(false);
    },
    onError: () => {
      toast.error("이미지 업로드에 실패했습니다.");
      setImageUploading(false);
    },
  });

  const updatePopupMutation = trpc.popup.update.useMutation({
    onSuccess: () => { refetchPopup(); toast.success("이벤트가 수정되었습니다."); setPopupForm(null); setPopupEditId(null); },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const deletePopupMutation = trpc.popup.delete.useMutation({
    onSuccess: () => { refetchPopup(); toast.success("이벤트가 삭제되었습니다."); },
    onError: () => toast.error("삭제에 실패했습니다."),
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>로드 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
        {/* 로고 */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <StarLogo />
            <div>
              <h1 className="font-bold text-lg">STAR 관리</h1>
              <p className="text-xs text-blue-200">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* 통계 */}
        {stats && (
          <div className="p-4 space-y-3 border-b border-blue-700">
            <div className="bg-blue-700/50 rounded-lg p-3">
              <div className="text-xs text-blue-200 mb-1">총 회원</div>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </div>
            <div className="bg-blue-700/50 rounded-lg p-3">
              <div className="text-xs text-blue-200 mb-1">관리자</div>
              <div className="text-2xl font-bold">{stats.adminUsers}</div>
            </div>
          </div>
        )}

        {/* 네비게이션 */}
        <nav className="flex-1 px-4 py-4 space-y-1">
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
          <button
            onClick={() => setActiveTab("users")}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{
              background: activeTab === "users" ? "rgba(255,255,255,0.15)" : "transparent",
              color: activeTab === "users" ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            <Users size={16} />
            회원 관리
          </button>
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
        </nav>

        {/* 하단 */}
        <div className="px-4 py-4 border-t border-blue-700 space-y-2">
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm">
            <Home size={16} />홈페이지로
          </a>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            <LogOut size={16} />로그아웃
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "users" ? "회원 관리" : activeTab === "popup" ? "팩업 이벤트 관리" : activeTab === "events" ? "이벤트 관리" : "시술·장비 관리"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {activeTab === "users" ? "가입 회원 목록 및 역할 관리" : activeTab === "popup" ? "홈 팩업에 표시될 이벤트를 추가·수정·삭제합니다" : activeTab === "events" ? "이벤트를 추가·수정·삭제합니다" : "시술 및 장비 정보를 추가·수정·삭제합니다"}
            </p>
          </div>
          <button
            onClick={() => refetchStats()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "treatments" && (
            <TreatmentsManager />
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {usersLoading ? (
                  <div className="p-8 text-center text-gray-500">로드 중...</div>
                ) : !usersData || usersData.users.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">회원이 없습니다.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">이름</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">이메일</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">역할</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">가입일</th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">작업</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {usersData.users.map((u: any) => (
                          <tr key={u.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name || "이름 없음"}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{u.email || "-"}</td>
                            <td className="px-6 py-4 text-sm">
                              <select
                                value={u.role}
                                onChange={(e) => updateRoleMutation.mutate({ userId: u.id, role: e.target.value as "user" | "admin" })}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="user">사용자</option>
                                <option value="admin">관리자</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString("ko-KR") : "-"}
                            </td>
                            <td className="px-6 py-4 text-right text-sm text-gray-600">-</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 페이지네이션 */}
              {usersData && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    총 {usersData.total}명 중 {(userPage - 1) * pageSize + 1}-{Math.min(userPage * pageSize, usersData.total)}명
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUserPage(Math.max(1, userPage - 1))}
                      disabled={userPage === 1}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setUserPage(userPage + 1)}
                      disabled={!usersData || userPage * pageSize >= usersData.total}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "popup" && (
            <div className="space-y-6">
              <button
                onClick={() => setPopupForm({ tab: "", badge: "", title: "", subtitle: "", desc: "", note: "", imageUrl: "", accent: "#4A6FA5", accentLight: "#EEF3FA", sortOrder: 0, isActive: "1", priceItems: [], startAt: null, endAt: null })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                팝업 이벤트 추가
              </button>

              {popupForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold mb-4">{popupEditId ? "팝업 수정" : "팝업 추가"}</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="제목"
                      value={popupForm.title}
                      onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="설명"
                      value={popupForm.desc}
                      onChange={(e) => setPopupForm({ ...popupForm, desc: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPopupForm(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => {
                          if (popupEditId) {
                            updatePopupMutation.mutate({ id: popupEditId, ...popupForm });
                          } else {
                            createPopupMutation.mutate(popupForm);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        {popupEditId ? "수정" : "추가"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {popupList && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {popupList.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">팝업 이벤트가 없습니다.</div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {popupList.map((item: any) => (
                        <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setPopupEditId(item.id);
                                setPopupForm(item);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => deletePopupMutation.mutate({ id: item.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-6">
              <button
                onClick={() => setEventForm({ title: "", desc: "", imageUrl: "", sortOrder: 0, isActive: "1" })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                이벤트 추가
              </button>

              {eventForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold mb-4">{editingEventId ? "이벤트 수정" : "이벤트 추가"}</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="제목"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="설명"
                      value={eventForm.desc}
                      onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEventForm(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => {
                          if (editingEventId) {
                            updateEventMutation.mutate({ id: editingEventId, ...eventForm });
                          } else {
                            createEventMutation.mutate(eventForm);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        {editingEventId ? "수정" : "추가"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {eventsList && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {eventsList.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">이벤트가 없습니다.</div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {eventsList.map((item: any) => (
                        <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingEventId(item.id);
                                setEventForm(item);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => deleteEventMutation.mutate({ id: item.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

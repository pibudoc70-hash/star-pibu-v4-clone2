/**
 * MyPage - STAR 피부과 회원 마이페이지
 * - 프로필 정보
 * - 예약 내역 탭 (trpc.reservation.myReservations)
 * - 빠른 상담 메뉴
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  User, LogOut, Phone, MessageCircle, Star, Calendar,
  Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Plus
} from "lucide-react";
import { toast } from "sonner";

type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "대기 중", color: "#D97706", bg: "#FEF3C7", icon: <Clock size={13} /> },
  confirmed: { label: "확정", color: "#059669", bg: "#D1FAE5", icon: <CheckCircle size={13} /> },
  completed: { label: "완료", color: "#6B7280", bg: "#F3F4F6", icon: <CheckCircle size={13} /> },
  cancelled: { label: "취소됨", color: "#EF4444", bg: "#FEE2E2", icon: <XCircle size={13} /> },
};

export default function MyPage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "reservations">("profile");

  const { data: reservations, isLoading: reservationsLoading, refetch } = trpc.reservation.myReservations.useQuery(
    undefined,
    { enabled: isAuthenticated && activeTab === "reservations" }
  );

  const cancelMutation = trpc.reservation.cancel.useMutation({
    onSuccess: () => {
      toast.success("예약이 취소되었습니다.");
      refetch();
    },
    onError: (err) => toast.error("취소 실패: " + err.message),
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#4A9FA5", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) return null;

  const loginMethodLabel: Record<string, string> = {
    kakao: "카카오", naver: "네이버", google: "Google", manus: "Manus",
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleCancel = (id: number) => {
    if (confirm("예약을 취소하시겠습니까?")) {
      cancelMutation.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">

          {/* 프로필 배너 */}
          <div className="rounded-3xl overflow-hidden mb-5" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <div className="px-8 pt-8 pb-6" style={{ background: "linear-gradient(160deg, #0D2B4E 0%, #1A4A7A 100%)" }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-white text-xl font-bold">{user.name ?? "회원"}</h1>
                  <p className="text-white/60 text-sm mt-0.5">{user.email ?? ""}</p>
                  {user.loginMethod && (
                    <span className="inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}>
                      {loginMethodLabel[user.loginMethod] ?? user.loginMethod} 로그인
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mb-5">
            {[
              { key: "profile", label: "프로필" },
              { key: "reservations", label: "예약 내역" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "profile" | "reservations")}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: activeTab === tab.key ? "#0D2B4E" : "white",
                  color: activeTab === tab.key ? "white" : "#6B7280",
                  boxShadow: activeTab === tab.key ? "0 2px 8px rgba(13,43,78,0.2)" : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 프로필 탭 */}
          {activeTab === "profile" && (
            <>
              {/* 회원 정보 */}
              <div className="bg-white rounded-3xl overflow-hidden mb-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="px-6 py-4 border-b border-[#F3F4F6]">
                  <h2 className="text-sm font-bold text-[#1F2937]">회원 정보</h2>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3">
                  <div className="text-center py-3 rounded-xl" style={{ background: "#F0F7FF" }}>
                    <p className="text-xs text-[#9CA3AF] mb-1">회원 등급</p>
                    <p className="text-sm font-bold text-[#4A6FA5] flex items-center justify-center gap-1">
                      <Star size={13} fill="#4A6FA5" />
                      {user.role === "admin" ? "관리자" : "일반 회원"}
                    </p>
                  </div>
                  <div className="text-center py-3 rounded-xl" style={{ background: "#F0FDF4" }}>
                    <p className="text-xs text-[#9CA3AF] mb-1">가입일</p>
                    <p className="text-sm font-bold text-[#059669]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 예약 신청 버튼 */}
              <a
                href="/reserve"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white mb-5 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #4A9FA5 0%, #0D2B4E 100%)", boxShadow: "0 4px 16px rgba(74,159,165,0.3)" }}
              >
                <Plus size={18} />
                시술 예약 신청하기
              </a>

              {/* 빠른 상담 */}
              <div className="bg-white rounded-3xl overflow-hidden mb-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="px-6 py-4 border-b border-[#F3F4F6]">
                  <h2 className="text-sm font-bold text-[#1F2937]">빠른 상담</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  <a
                    href="https://pf.kakao.com/_HNyGC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm hover:opacity-90 transition-all"
                    style={{ background: "#FEE500", color: "#1F2937" }}
                  >
                    <MessageCircle size={18} />
                    카카오 상담
                  </a>
                  <a
                    href="tel:051-818-2300"
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm hover:opacity-90 transition-all"
                    style={{ background: "#EEF7F7", color: "#4A9FA5" }}
                  >
                    <Phone size={18} />
                    전화 상담
                  </a>
                </div>
              </div>

              {/* 내 활동 */}
              <div className="bg-white rounded-3xl overflow-hidden mb-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="px-6 py-4 border-b border-[#F3F4F6]">
                  <h2 className="text-sm font-bold text-[#1F2937]">내 활동</h2>
                </div>
                <div className="divide-y divide-[#F3F4F6]">
                  <button
                    onClick={() => setActiveTab("reservations")}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EEF7F7", color: "#4A9FA5" }}>
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-[#1F2937]">예약 내역</p>
                      <p className="text-xs text-[#9CA3AF]">시술 예약 현황 확인</p>
                    </div>
                    <ChevronRight size={16} className="text-[#D1D5DB]" />
                  </button>
                  <a
                    href="/#events"
                    className="flex items-center gap-4 px-6 py-4 hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EEF7F7", color: "#4A9FA5" }}>
                      <Star size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1F2937]">이벤트 혜택</p>
                      <p className="text-xs text-[#9CA3AF]">진행 중인 이벤트 보기</p>
                    </div>
                    <ChevronRight size={16} className="text-[#D1D5DB]" />
                  </a>
                </div>
              </div>

              {/* 로그아웃 */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold hover:opacity-80 transition-all"
                style={{ background: "#FEF2F2", color: "#EF4444" }}
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </>
          )}

          {/* 예약 내역 탭 */}
          {activeTab === "reservations" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold" style={{ color: "#0D2B4E" }}>예약 내역</h2>
                <a
                  href="/reserve"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "#4A9FA5" }}
                >
                  <Plus size={14} />
                  새 예약
                </a>
              </div>

              {reservationsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#4A9FA5", borderTopColor: "transparent" }} />
                </div>
              ) : !reservations || reservations.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#EEF7F7" }}>
                    <Calendar size={28} style={{ color: "#4A9FA5" }} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#374151" }}>예약 내역이 없습니다</p>
                  <p className="text-xs mb-5" style={{ color: "#9CA3AF" }}>원하시는 시술을 예약해 보세요</p>
                  <a
                    href="/reserve"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "#0D2B4E" }}
                  >
                    <Plus size={15} />
                    예약 신청하기
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {reservations.map((res) => {
                    const status = STATUS_CONFIG[res.status];
                    const dateStr = new Date(res.preferredDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
                    return (
                      <div key={res.id} className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full mr-2" style={{ background: "#EEF7F7", color: "#4A9FA5" }}>
                              {res.treatmentCategory}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: status.bg, color: status.color }}>
                              {status.icon}
                              {status.label}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">#{res.id}</span>
                        </div>

                        <h3 className="font-bold text-base mb-2" style={{ color: "#0D2B4E" }}>{res.treatmentName}</h3>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {dateStr}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} />
                            {res.preferredTime}
                          </span>
                        </div>

                        {res.adminNote && (
                          <div className="rounded-xl p-3 mb-3 text-sm" style={{ background: "#F0F9F9", color: "#374151" }}>
                            <span className="font-semibold text-xs" style={{ color: "#4A9FA5" }}>병원 메모: </span>
                            {res.adminNote}
                          </div>
                        )}

                        {res.notes && (
                          <p className="text-xs text-gray-400 mb-3">요청사항: {res.notes}</p>
                        )}

                        {(res.status === "pending" || res.status === "confirmed") && (
                          <button
                            onClick={() => handleCancel(res.id)}
                            disabled={cancelMutation.isPending}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            style={{ background: "#FEE2E2", color: "#EF4444" }}
                          >
                            예약 취소
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

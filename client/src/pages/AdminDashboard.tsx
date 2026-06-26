/**
 * AdminDashboard - STAR 피부과 관리자 대시보드
 * 탭별 로직은 각 컴포넌트로 분리됨:
 *   AdminUsersTab / AdminPopupTab / AdminEventsTab
 *   AdminReservationsTab / AdminUnavailableSlotsTab
 */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import type { AdminTab, AdminStats } from "@/types/admin";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  Users, TrendingUp, ChevronLeft, ChevronRight,
  Crown, LogOut, Home, RefreshCw, Calendar, Clock,
  CheckCircle, ClipboardList, Megaphone, Stethoscope, Youtube,
} from "lucide-react";
import StarLogo from "@/components/StarLogo";
import TreatmentsManager from "@/components/TreatmentsManager";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminPopupTab from "@/components/admin/AdminPopupTab";
import AdminEventsTab from "@/components/admin/AdminEventsTab";
import AdminReservationsTab from "@/components/admin/AdminReservationsTab";
import AdminUnavailableSlotsTab from "@/components/admin/AdminUnavailableSlotsTab";
import { KeywordTrendsDashboard } from "@/components/KeywordTrendsDashboard";

const TAB_META: Record<AdminTab, { label: string; desc: string }> = {
  treatments:      { label: "시술·장비 관리",       desc: "시술 및 장비 정보를 추가·수정·삭제합니다" },
  treatmentsV2:    { label: "시술·장비소개 2 관리",  desc: "시술·장비소개 2에 표시될 시술을 추가·수정·삭제합니다" },
  popup:           { label: "팝업 이벤트 관리",      desc: "홈 팝업에 표시될 이벤트를 추가·수정·삭제합니다" },
  events:          { label: "이벤트 관리",           desc: "이벤트를 추가·수정·삭제합니다" },
  reservations:    { label: "예약 관리",             desc: "고객 예약을 관리하고 상태를 변경합니다" },
  unavailableSlots:{ label: "예약 불가능 날짜",      desc: "특정 날짜를 예약 불가능하도록 설정합니다" },
  users:           { label: "회원 관리",             desc: "가입 회원 목록 및 역할 관리" },
  youtube:          { label: "유튜브 관리",            desc: "유튜브 영상을 추가·수정·삭제합니다" },
  keywords:        { label: "키워드 트렌드 대시보드", desc: "최신 검색 트렌드를 모니터링합니다" },
};

export default function AdminDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("treatments");

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        window.location.href = getLoginUrl();
      } else if (user && user.role !== "admin") {
        navigate("/");
      }
    }
  }, [loading, isAuthenticated, user]);

  const { data: stats, refetch: refetchStats } = trpc.admin.stats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

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

  const NAV_ITEMS: { tab: AdminTab; icon: React.ReactNode; label: string }[] = [
    { tab: "popup",            icon: <Megaphone size={16} />,   label: "팝업 이벤트" },
    { tab: "events",           icon: <Calendar size={16} />,    label: "이벤트 관리" },
    { tab: "reservations",     icon: <ClipboardList size={16} />, label: "예약 관리" },
    { tab: "unavailableSlots", icon: <Clock size={16} />,       label: "예약 불가능 날짜" },
    { tab: "users",            icon: <Users size={16} />,       label: "회원 관리" },
    { tab: "treatments",       icon: <Stethoscope size={16} />, label: "시술·장비 관리" },
    { tab: "treatmentsV2",     icon: <Stethoscope size={16} />, label: "시술·장비소개 2 관리" },
    { tab: "keywords",         icon: <TrendingUp size={16} />,  label: "키워드 트렌드" },
  ];

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
              <p className="text-white/70 text-xs">관리자 대시보드</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {/* 팝업 이벤트 */}
          {["popup", "events"].map((tabKey) => {
            const item = NAV_ITEMS.find(n => n.tab === tabKey)!;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => setActiveTab(item.tab)}
                className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
                style={{
                  background: activeTab === item.tab ? "rgba(255,255,255,0.15)" : "transparent",
                  color: activeTab === item.tab ? "white" : "rgba(255,255,255,0.6)",
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
          {/* 시술·장비소개 3 관리 (별도 페이지) */}
          <button
            type="button"
            onClick={() => navigate("/admin/equipment3")}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{ background: "transparent", color: "rgba(255,255,255,0.6)" }}
          >
            <Stethoscope size={16} />
            시술·장비소개 3 관리
          </button>
          {/* 유튜브 관리 (별도 페이지) */}
          <button
            type="button"
            onClick={() => navigate("/admin/youtube")}
            className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
            style={{ background: "transparent", color: "rgba(255,255,255,0.6)" }}
          >
            <Youtube size={16} />
            유튜브 관리
          </button>
          {/* 구분선 */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", margin: "8px 4px" }} />
          {/* 예약·회원·시술 관리 */}
          {["reservations", "unavailableSlots", "users", "treatments", "treatmentsV2"].map((tabKey) => {
            const item = NAV_ITEMS.find(n => n.tab === tabKey)!;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => setActiveTab(item.tab)}
                className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold"
                style={{
                  background: activeTab === item.tab ? "rgba(255,255,255,0.15)" : "transparent",
                  color: activeTab === item.tab ? "white" : "rgba(255,255,255,0.6)",
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm">
            <Home size={16} />홈페이지로
          </a>
          <button
            type="button"
            onClick={async () => { await logout(); navigate("/"); }}
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
            <h1 className="text-lg font-bold text-[#1F2937]">{TAB_META[activeTab].label}</h1>
            <p className="text-xs text-[#9CA3AF]">{TAB_META[activeTab].desc}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "#FEF3C7", color: "#92400E" }}>
              <Crown size={13} />
              {user.name ?? "관리자"}
            </div>
            <button
              type="button"
              onClick={() => refetchStats()}
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
              { icon: <Users size={20} />,        label: "전체 회원",    value: stats?.totalUsers ?? "-",                                          bg: "#EFF6FF", color: "#1D4ED8", iconBg: "#DBEAFE" },
              { icon: <TrendingUp size={20} />,    label: "최근 7일 가입", value: stats?.recentSignups ?? "-",                                      bg: "#F0FDF4", color: "#166534", iconBg: "#DCFCE7" },
              { icon: <ClipboardList size={20} />, label: "대기 예약",    value: (stats as AdminStats | undefined)?.reservations?.pending ?? "-",   bg: "#FEF3C7", color: "#D97706", iconBg: "#FDE68A" },
              { icon: <CheckCircle size={20} />,   label: "확정 예약",    value: (stats as AdminStats | undefined)?.reservations?.confirmed ?? "-", bg: "#F0FDF4", color: "#059669", iconBg: "#DCFCE7" },
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

          {/* ─── 탭 콘텐츠 ─── */}
          {activeTab === "treatments"       && <TreatmentsManager />}
          {activeTab === "treatmentsV2"     && <TreatmentsManager section="v2" />}
          {activeTab === "users"            && <AdminUsersTab currentUser={user} />}
          {activeTab === "popup"            && <AdminPopupTab currentUser={user} />}
          {activeTab === "events"           && <AdminEventsTab currentUser={user} />}
          {activeTab === "reservations"     && <AdminReservationsTab currentUser={user} />}
          {activeTab === "unavailableSlots" && <AdminUnavailableSlotsTab currentUser={user} />}
          {activeTab === "keywords"         && <KeywordTrendsDashboard />}
        </div>
      </div>
    </div>
  );
}

/**
 * MyReservations - 내 예약 조회 페이지
 * - 로그인한 회원의 예약 목록 표시
 * - 예약 상태 확인 및 취소 기능
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Calendar, Clock, Phone, User, AlertCircle, CheckCircle, XCircle, Loader } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { getReservationPath } from "@/lib/reservationPath";
import type { Reservation } from "../../../drizzle/schema";

const STATUS_CONFIG = {
  pending: { label: "대기 중", color: "#D97706", bg: "#FEF3C7", icon: AlertCircle },
  confirmed: { label: "확정", color: "#059669", bg: "#D1FAE5", icon: CheckCircle },
  completed: { label: "완료", color: "#6B7280", bg: "#F3F4F6", icon: CheckCircle },
  cancelled: { label: "취소됨", color: "#EF4444", bg: "#FEE2E2", icon: XCircle },
};

export default function MyReservations() {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: reservations, isLoading } = trpc.reservation.myReservations.useQuery(undefined, {
    enabled: !!user,
  });

  const cancelMutation = trpc.reservation.cancel.useMutation({
    onSuccess: () => {
      toast.success("예약이 취소되었습니다.");
      // 목록 새로고침
      window.location.reload();
    },
    onError: (err) => toast.error("취소 실패: " + err.message),
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-8 h-8 border-4 border-[#4A6FA5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-[#1F2937]">내 예약</h1>
          <p className="text-[#6B7280] mt-2">예약 현황을 확인하고 관리하세요.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!reservations || reservations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E7EB]">
            <Calendar size={48} className="mx-auto text-[#D1D5DB] mb-4" />
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">예약이 없습니다</h2>
            <p className="text-[#6B7280] mb-6">아직 예약하신 내역이 없습니다.</p>
            <a
              href={getReservationPath("ko")}
              className="inline-block px-6 py-2 rounded-lg font-semibold text-white transition-colors"
              style={{ background: "#4A6FA5" }}
            >
              예약 신청하기
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation: Reservation) => {
              const statusConfig = STATUS_CONFIG[reservation.status as keyof typeof STATUS_CONFIG];
              const StatusIcon = statusConfig.icon;
              const preferredDate = new Date(reservation.preferredDate);
              const isUpcoming = preferredDate > new Date();

              return (
                <div
                  key={reservation.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow"
                >
                  {/* 상단: 상태 및 기본 정보 */}
                  <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-lg font-bold text-[#1F2937]">{reservation.treatmentName}</h2>
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: statusConfig.bg, color: statusConfig.color }}
                        >
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280]">예약 ID: #{reservation.id}</p>
                    </div>
                  </div>

                  {/* 중단: 예약 정보 */}
                  <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#F3F4F6]">
                    {/* 환자 정보 */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6B7280] mb-1 uppercase">환자명</label>
                      <div className="flex items-center gap-2 text-[#1F2937]">
                        <User size={16} className="text-[#9CA3AF]" />
                        {reservation.patientName}
                      </div>
                    </div>

                    {/* 연락처 */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6B7280] mb-1 uppercase">연락처</label>
                      <div className="flex items-center gap-2 text-[#1F2937]">
                        <Phone size={16} className="text-[#9CA3AF]" />
                        {reservation.phone}
                      </div>
                    </div>

                    {/* 희망 날짜 */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6B7280] mb-1 uppercase">희망 날짜</label>
                      <div className="flex items-center gap-2 text-[#1F2937]">
                        <Calendar size={16} className="text-[#9CA3AF]" />
                        {preferredDate.toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        })}
                      </div>
                    </div>

                    {/* 희망 시간 */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6B7280] mb-1 uppercase">희망 시간</label>
                      <div className="flex items-center gap-2 text-[#1F2937]">
                        <Clock size={16} className="text-[#9CA3AF]" />
                        {reservation.preferredTime}
                      </div>
                    </div>
                  </div>

                  {/* 추가 정보 */}
                  {reservation.notes && (
                    <div className="px-6 py-4 border-b border-[#F3F4F6]">
                      <label className="block text-xs font-semibold text-[#6B7280] mb-2 uppercase">추가 사항</label>
                      <p className="text-[#1F2937] text-sm">{reservation.notes}</p>
                    </div>
                  )}

                  {/* 상태 정보 */}
                  <div className="px-6 py-4 bg-[#F9FAFB]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#6B7280] mb-1">신청일</label>
                        <p className="text-sm text-[#1F2937]">
                          {new Date(reservation.createdAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {reservation.adminNote && (
                        <div>
                          <label className="block text-xs font-semibold text-[#6B7280] mb-1">관리자 메모</label>
                          <p className="text-sm text-[#1F2937]">{reservation.adminNote}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 하단: 액션 버튼 */}
                  {reservation.status === "pending" && isUpcoming && (
                    <div className="px-6 py-4 border-t border-[#F3F4F6] flex gap-2">
                      <button type="button"
                        onClick={() => {
                          if (confirm("정말로 예약을 취소하시겠습니까?")) {
                            cancelMutation.mutate({ id: reservation.id });
                          }
                        }}
                        disabled={cancelMutation.isPending}
                        className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2"
                        style={{ background: cancelMutation.isPending ? "#D1D5DB" : "#EF4444" }}
                      >
                        {cancelMutation.isPending ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            취소 중...
                          </>
                        ) : (
                          "예약 취소"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

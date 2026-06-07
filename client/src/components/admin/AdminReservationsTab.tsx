/**
 * AdminReservationsTab - 예약 관리 탭
 * AdminDashboard.tsx에서 분리 (P1-2)
 */
import { useState } from "react";
import { Fragment } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { ReservationItem, ReservationStatus } from "@/types/admin";
import { exportReservationsToExcel } from "@/utils/excelExport";

interface CurrentUser {
  role: string;
}

interface Props {
  currentUser: CurrentUser;
}

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "대기 중", color: "#D97706", bg: "#FEF3C7" },
  confirmed: { label: "확정", color: "#059669", bg: "#D1FAE5" },
  completed: { label: "완료", color: "#6B7280", bg: "#F3F4F6" },
  cancelled: { label: "취소됨", color: "#EF4444", bg: "#FEE2E2" },
};

const PAGE_SIZE = 20;

export default function AdminReservationsTab({ currentUser }: Props) {
  const [page, setPage] = useState(1);
  const [reservationNotes, setReservationNotes] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.listReservations.useQuery(
    { page, pageSize: PAGE_SIZE },
    { enabled: currentUser.role === "admin" }
  );

  const updateStatusMutation = trpc.admin.updateReservationStatus.useMutation({
    onSuccess: () => {
      utils.admin.listReservations.invalidate();
      utils.admin.stats.invalidate();
      toast.success("예약 상태가 변경되었습니다.");
    },
    onError: (err) => toast.error("상태 변경 실패: " + err.message),
  });

  const handleStatusChange = (id: number, status: ReservationStatus) => {
    updateStatusMutation.mutate({ id, status, adminNote: reservationNotes[id] ?? "" });
  };

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
      <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#1F2937]">
          예약 목록
          {data && (
            <span className="ml-2 text-xs font-normal text-[#9CA3AF]">총 {data.total}건</span>
          )}
        </h2>
        <button
          type="button"
          onClick={() => {
            if (data?.items?.length) {
              exportReservationsToExcel(data.items);
              toast.success("엑셀 파일이 다운로드되었습니다.");
            } else {
              toast.error("다운로드할 예약 데이터가 없습니다.");
            }
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#4A6FA5] text-white text-xs font-semibold hover:bg-[#3A5A95] transition-colors"
        >
          <Download size={16} />
          엑셀 다운로드
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#4A9FA5] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F3F4F6]" style={{ background: "#F9FAFB" }}>
                  {["예약 등록 일시", "환자명", "연락처", "시술명", "희망일시", "추가사항", "상태", "관리"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {(data?.items ?? []).map((reservation: ReservationItem) => {
                  const statusConfig = STATUS_CONFIG[reservation.status as ReservationStatus];
                  const isExpanded = expandedId === reservation.id;
                  return (
                    <Fragment key={reservation.id}>
                      <tr className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-6 py-4 text-[#6B7280] text-xs">
                          {new Date(reservation.createdAt).toLocaleString("ko-KR")}
                        </td>
                        <td className="px-6 py-4 font-medium text-[#1F2937]">
                          {reservation.patientName}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280] text-xs">{reservation.phone}</td>
                        <td className="px-6 py-4 text-[#6B7280] text-xs">
                          {reservation.treatmentName}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280] text-xs">
                          {new Date(reservation.preferredDate).toLocaleDateString("ko-KR")}{" "}
                          {reservation.preferredTime}
                        </td>
                        <td
                          className="px-6 py-4 text-[#6B7280] text-xs max-w-xs truncate"
                          title={reservation.notes ?? undefined}
                        >
                          {reservation.notes || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: statusConfig.bg, color: statusConfig.color }}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <select
                            value={reservation.status}
                            onChange={(e) =>
                              handleStatusChange(reservation.id, e.target.value as ReservationStatus)
                            }
                            className="px-2 py-1 rounded-lg border border-[#E5E7EB] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                            style={{ color: statusConfig.color }}
                          >
                            <option value="pending">대기 중</option>
                            <option value="confirmed">확정</option>
                            <option value="completed">완료</option>
                            <option value="cancelled">취소됨</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : reservation.id)}
                            className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                            title="메모 추가"
                          >
                            {isExpanded ? (
                              <ChevronUp size={16} className="text-[#6B7280]" />
                            ) : (
                              <ChevronDown size={16} className="text-[#6B7280]" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#F9FAFB]">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                                  관리자 메모
                                </label>
                                <textarea
                                  value={
                                    reservationNotes[reservation.id] ??
                                    reservation.adminNote ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    setReservationNotes((prev) => ({
                                      ...prev,
                                      [reservation.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="예약자를 위한 메모를 남기세요"
                                  className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] resize-none"
                                  rows={3}
                                />
                              </div>
                              <div className="text-xs text-[#9CA3AF]">
                                메모 내용:{" "}
                                {(
                                  reservationNotes[reservation.id] ??
                                  reservation.adminNote ??
                                  ""
                                ).length}
                                /500
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {data && data.total > PAGE_SIZE && (
            <div className="px-6 py-4 border-t border-[#F3F4F6] flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={16} className="text-[#6B7280]" />
              </button>
              <span className="text-xs text-[#6B7280]">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={16} className="text-[#6B7280]" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * AdminUsersTab - 회원 관리 탭
 * AdminDashboard.tsx에서 분리 (P1-2)
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight, Crown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CurrentUser {
  id: number;
  role: string;
  name?: string | null;
}

interface Props {
  currentUser: CurrentUser;
}

const loginMethodBadge: Record<string, { bg: string; color: string; label: string }> = {
  kakao: { bg: "#FEF9C3", color: "#92400E", label: "카카오" },
  naver: { bg: "#DCFCE7", color: "#166534", label: "네이버" },
  google: { bg: "#EFF6FF", color: "#1D4ED8", label: "Google" },
  manus: { bg: "#F3F4F6", color: "#374151", label: "Manus" },
};

const PAGE_SIZE = 15;

export default function AdminUsersTab({ currentUser }: Props) {
  const [page, setPage] = useState(1);
  const utils = trpc.useUtils();

  const { data: usersData, isLoading } = trpc.admin.listUsers.useQuery(
    { page, pageSize: PAGE_SIZE },
    { enabled: currentUser.role === "admin" }
  );

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate();
      utils.admin.stats.invalidate();
      toast.success("역할이 변경되었습니다.");
    },
    onError: () => toast.error("역할 변경에 실패했습니다."),
  });

  const totalPages = usersData ? Math.ceil(usersData.total / PAGE_SIZE) : 1;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
      <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#1F2937]">
          회원 목록
          {usersData && (
            <span className="ml-2 text-xs font-normal text-[#9CA3AF]">총 {usersData.total}명</span>
          )}
        </h2>
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
                  {["ID", "이름", "이메일", "가입 방법", "역할", "가입일", "관리"].map((h) => (
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
                {usersData?.users.map((member) => {
                  const badge =
                    loginMethodBadge[member.loginMethod ?? "manus"] ?? loginMethodBadge.manus;
                  return (
                    <tr key={member.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4 text-[#9CA3AF] text-xs font-mono">#{member.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: "#EEF7F7", color: "#4A9FA5" }}
                          >
                            {(member.name ?? "?")[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-[#1F2937]">{member.name ?? "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6B7280] text-xs">{member.email ?? "-"}</td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {member.role === "admin" ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: "#FEF3C7", color: "#92400E" }}
                          >
                            <Crown size={10} />
                            관리자
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: "#EEF7F7", color: "#4A9FA5" }}
                          >
                            일반 회원
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#6B7280] text-xs">
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString("ko-KR")
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {member.id !== currentUser.id && (
                          <button
                            type="button"
                            onClick={() =>
                              updateRoleMutation.mutate({
                                userId: member.id,
                                role: member.role === "admin" ? "user" : "admin",
                              })
                            }
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

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={16} className="text-[#6B7280]" />
              </button>
              <span className="text-sm text-[#6B7280]">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors"
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

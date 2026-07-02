/**
 * AdminUnavailableSlotsTab - 예약 불가능 날짜 관리 탭
 * AdminDashboard.tsx에서 분리 (P1-2)
 */
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CurrentUser {
  role: string;
}

interface Props {
  currentUser: CurrentUser;
}

export default function AdminUnavailableSlotsTab({ currentUser }: Props) {
  const [form, setForm] = useState<{ date: string; reason: string } | null>(null);
  const utils = trpc.useUtils();

  const { data } = trpc.admin.unavailableSlots.list.useQuery(
    { date: undefined },
    { enabled: currentUser.role === "admin" }
  );

  const createMutation = trpc.admin.unavailableSlots.create.useMutation({
    onSuccess: () => {
      utils.admin.unavailableSlots.list.invalidate();
      toast.success("예약 불가능 날짜가 추가되었습니다.");
      setForm(null);
    },
    onError: () => toast.error("추가에 실패했습니다."),
  });

  const deleteMutation = trpc.admin.unavailableSlots.delete.useMutation({
    onSuccess: () => {
      utils.admin.unavailableSlots.list.invalidate();
      toast.success("예약 불가능 날짜가 삭제되었습니다.");
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const handleSubmit = () => {
    if (!form?.date) {
      toast.error("날짜를 선택해주세요.");
      return;
    }
    createMutation.mutate({ date: form.date, reason: form.reason || undefined });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1F2937]">예약 불가능 날짜 설정</h2>
          <button
            type="button"
            onClick={() => setForm({ date: "", reason: "" })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            추가
          </button>
        </div>

        {form && (
          <div className="mb-6 p-4 bg-[#F3F4F6] rounded-lg border border-[#E5E7EB]">
            <h3 className="font-semibold text-[#1F2937] mb-4">예약 불가능 날짜 추가</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="unavailable-date" className="block text-sm font-semibold text-[#1F2937] mb-2">날짜 *</label>
                <input
                  id="unavailable-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                />
              </div>
              <div>
                <label htmlFor="unavailable-reason" className="block text-sm font-semibold text-[#1F2937] mb-2">
                  사유 (선택)
                </label>
                <input
                  id="unavailable-reason"
                  type="text"
                  placeholder="예: 의료 회의, 시설 점검 등"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {data?.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]"
            >
              <div>
                <p className="font-semibold text-[#1F2937]">{slot.date}</p>
                {slot.reason && <p className="text-sm text-[#6B7280]">{slot.reason}</p>}
              </div>
              <button
                type="button"
                onClick={() => deleteMutation.mutate({ id: slot.id })}
                disabled={deleteMutation.isPending}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {data?.length === 0 && (
            <p className="text-sm text-[#9CA3AF] text-center py-8">
              설정된 예약 불가능 날짜가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

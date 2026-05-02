/**
 * ReservationForm - 예약 신청 폼
 * - 회원 예약 (로그인 필요)
 * - 비회원 예약 (OTP 인증)
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Calendar, Clock, User, Phone, FileText, Send, AlertCircle } from "lucide-react";

interface ReservationFormProps {
  onSuccess?: () => void;
}

export default function ReservationForm({ onSuccess }: ReservationFormProps) {
  const { user } = useAuth();
  const [isGuest, setIsGuest] = useState(!user);
  const [step, setStep] = useState<"info" | "otp" | "verify" | "confirm">(isGuest ? "info" : "info");

  // 회원 예약 폼
  const [reservationForm, setReservationForm] = useState({
    patientName: user?.name ?? "",
    phone: "",
    treatmentCategory: "",
    treatmentName: "",
    preferredDate: "",
    preferredTime: "10:00",
    notes: "",
  });

  // 비회원 예약 폼
  const [guestForm, setGuestForm] = useState({
    phone: "",
    otpCode: "",
    patientName: "",
    treatmentCategory: "",
    treatmentName: "",
    preferredDate: "",
    preferredTime: "10:00",
    notes: "",
  });

  // 시술 카테고리 및 시술명 (DB에서 조회)
  const { data: treatments } = trpc.treatments.list.useQuery();
  const { data: categories } = trpc.treatments.categories.useQuery();

  // 시술 카테고리별 시술명 매핑
  const treatmentsByCategory = treatments?.reduce((acc, t) => {
    if (!acc[t.categoryId]) acc[t.categoryId] = [];
    acc[t.categoryId].push({ id: t.id, name: t.name });
    return acc;
  }, {} as Record<string, Array<{ id: number; name: string }>>) ?? {};

  // tRPC 뮤테이션
  const createReservationMutation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      toast.success("예약이 신청되었습니다. 곧 연락드리겠습니다.");
      setReservationForm({
        patientName: user?.name ?? "",
        phone: "",
        treatmentCategory: "",
        treatmentName: "",
        preferredDate: "",
        preferredTime: "10:00",
        notes: "",
      });
      onSuccess?.();
    },
    onError: (err) => toast.error("예약 신청 실패: " + err.message),
  });

  const sendOtpMutation = trpc.reservation.sendOtp.useMutation({
    onSuccess: () => {
      toast.success("인증번호가 발송되었습니다. (개발 모드: 콘솔 확인)");
      setStep("verify");
    },
    onError: (err) => toast.error("OTP 발송 실패: " + err.message),
  });

  const verifyOtpMutation = trpc.reservation.verifyOtp.useMutation({
    onSuccess: () => {
      toast.success("인증되었습니다.");
      setStep("confirm");
    },
    onError: (err) => toast.error("인증 실패: " + err.message),
  });

  const createGuestReservationMutation = trpc.reservation.createGuest.useMutation({
    onSuccess: () => {
      toast.success("예약이 신청되었습니다. 곧 연락드리겠습니다.");
      setGuestForm({
        phone: "",
        otpCode: "",
        patientName: "",
        treatmentCategory: "",
        treatmentName: "",
        preferredDate: "",
        preferredTime: "10:00",
        notes: "",
      });
      setStep("info");
      onSuccess?.();
    },
    onError: (err) => toast.error("예약 신청 실패: " + err.message),
  });

  // 회원 예약 제출
  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 항목 검증
    if (!reservationForm.patientName.trim()) {
      toast.error("환자명을 입력해주세요.");
      return;
    }
    if (!reservationForm.phone.trim()) {
      toast.error("연락처를 입력해주세요.");
      return;
    }
    if (!reservationForm.treatmentCategory) {
      toast.error("시술 카테고리를 선택해주세요.");
      return;
    }
    if (!reservationForm.treatmentName) {
      toast.error("시술명을 선택해주세요.");
      return;
    }
    if (!reservationForm.preferredDate) {
      toast.error("희망 날짜를 선택해주세요.");
      return;
    }

    const preferredDateMs = new Date(reservationForm.preferredDate).getTime();
    createReservationMutation.mutate({
      patientName: reservationForm.patientName,
      phone: reservationForm.phone,
      treatmentCategory: reservationForm.treatmentCategory,
      treatmentName: reservationForm.treatmentName,
      preferredDate: preferredDateMs,
      preferredTime: reservationForm.preferredTime,
      notes: reservationForm.notes || undefined,
    });
  };

  // 비회원 OTP 요청
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.phone.trim()) {
      toast.error("휴대폰 번호를 입력해주세요.");
      return;
    }
    sendOtpMutation.mutate({ phone: guestForm.phone });
  };

  // 비회원 OTP 검증
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.otpCode.trim()) {
      toast.error("인증번호를 입력해주세요.");
      return;
    }
    verifyOtpMutation.mutate({ phone: guestForm.phone, code: guestForm.otpCode });
  };

  // 비회원 예약 제출
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 항목 검증
    if (!guestForm.patientName.trim()) {
      toast.error("환자명을 입력해주세요.");
      return;
    }
    if (!guestForm.treatmentCategory) {
      toast.error("시술 카테고리를 선택해주세요.");
      return;
    }
    if (!guestForm.treatmentName) {
      toast.error("시술명을 선택해주세요.");
      return;
    }
    if (!guestForm.preferredDate) {
      toast.error("희망 날짜를 선택해주세요.");
      return;
    }

    const preferredDateMs = new Date(guestForm.preferredDate).getTime();
    createGuestReservationMutation.mutate({
      patientName: guestForm.patientName,
      phone: guestForm.phone,
      otpCode: guestForm.otpCode,
      treatmentCategory: guestForm.treatmentCategory,
      treatmentName: guestForm.treatmentName,
      preferredDate: preferredDateMs,
      preferredTime: guestForm.preferredTime,
      notes: guestForm.notes || undefined,
    });
  };

  // 회원 예약 폼 렌더링
  if (user && !isGuest) {
    return (
      <form onSubmit={handleMemberSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 환자명 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              <User size={16} className="inline mr-2" />
              환자명 *
            </label>
            <input
              type="text"
              value={reservationForm.patientName}
              onChange={(e) => setReservationForm({ ...reservationForm, patientName: e.target.value })}
              placeholder="이름을 입력해주세요"
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
            />
          </div>

          {/* 연락처 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              <Phone size={16} className="inline mr-2" />
              연락처 *
            </label>
            <input
              type="tel"
              value={reservationForm.phone}
              onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
              placeholder="010-1234-5678"
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 시술 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">시술 카테고리 *</label>
            <select
              value={reservationForm.treatmentCategory}
              onChange={(e) => setReservationForm({ ...reservationForm, treatmentCategory: e.target.value, treatmentName: "" })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
            >
              <option value="">선택해주세요</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 시술명 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">시술명 *</label>
            <select
              value={reservationForm.treatmentName}
              onChange={(e) => setReservationForm({ ...reservationForm, treatmentName: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
              disabled={!reservationForm.treatmentCategory}
            >
              <option value="">선택해주세요</option>
              {treatmentsByCategory[reservationForm.treatmentCategory]?.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 희망 날짜 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              <Calendar size={16} className="inline mr-2" />
              희망 날짜 *
            </label>
            <input
              type="date"
              value={reservationForm.preferredDate}
              onChange={(e) => setReservationForm({ ...reservationForm, preferredDate: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
            />
          </div>

          {/* 희망 시간 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              <Clock size={16} className="inline mr-2" />
              희망 시간 *
            </label>
            <select
              value={reservationForm.preferredTime}
              onChange={(e) => setReservationForm({ ...reservationForm, preferredTime: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
            >
              {Array.from({ length: 24 }, (_, i) => {
                const hour = String(i).padStart(2, "0");
                return (
                  <option key={hour} value={`${hour}:00`}>
                    {hour}:00
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* 추가 사항 */}
        <div>
          <label className="block text-sm font-semibold text-[#1F2937] mb-2">
            <FileText size={16} className="inline mr-2" />
            추가 사항
          </label>
          <textarea
            value={reservationForm.notes}
            onChange={(e) => setReservationForm({ ...reservationForm, notes: e.target.value })}
            placeholder="특이사항이나 추가 요청사항을 입력해주세요"
            rows={3}
            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
          />
        </div>

        <button
          type="submit"
          disabled={createReservationMutation.isPending}
          className="w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2"
          style={{ background: createReservationMutation.isPending ? "#D1D5DB" : "#4A6FA5" }}
        >
          <Send size={16} />
          {createReservationMutation.isPending ? "예약 중..." : "예약 신청"}
        </button>
      </form>
    );
  }

  // 비회원 예약 폼 렌더링
  return (
    <div className="space-y-6">
      {/* Step 1: OTP 발송 */}
      {step === "info" && (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#D97706] flex-shrink-0" />
            <p className="text-sm text-[#92400E]">비회원으로 예약하시려면 휴대폰 인증이 필요합니다.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              <Phone size={16} className="inline mr-2" />
              휴대폰 번호 *
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={guestForm.phone}
                onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                placeholder="010-1234-5678"
                className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                disabled={sendOtpMutation.isPending}
              />
              <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="px-4 py-2 rounded-lg font-semibold text-white transition-colors"
                style={{ background: sendOtpMutation.isPending ? "#D1D5DB" : "#4A6FA5" }}
              >
                {sendOtpMutation.isPending ? "발송 중..." : "인증번호 발송"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Step 2: OTP 검증 */}
      {step === "verify" && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#D97706] flex-shrink-0" />
            <p className="text-sm text-[#92400E]">발송된 인증번호를 입력해주세요.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">인증번호 *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={guestForm.otpCode}
                onChange={(e) => setGuestForm({ ...guestForm, otpCode: e.target.value })}
                placeholder="6자리 인증번호"
                maxLength={6}
                className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                disabled={verifyOtpMutation.isPending}
              />
              <button
                type="submit"
                disabled={verifyOtpMutation.isPending}
                className="px-4 py-2 rounded-lg font-semibold text-white transition-colors"
                style={{ background: verifyOtpMutation.isPending ? "#D1D5DB" : "#4A6FA5" }}
              >
                {verifyOtpMutation.isPending ? "검증 중..." : "인증"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("info")}
            className="w-full py-2 rounded-lg font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
          >
            다시 입력
          </button>
        </form>
      )}

      {/* Step 3: 예약 정보 입력 */}
      {step === "confirm" && (
        <form onSubmit={handleGuestSubmit} className="space-y-6">
          <div className="bg-[#D1FAE5] border border-[#6EE7B7] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#059669] flex-shrink-0" />
            <p className="text-sm text-[#065F46]">인증이 완료되었습니다. 예약 정보를 입력해주세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 환자명 */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                <User size={16} className="inline mr-2" />
                환자명 *
              </label>
              <input
                type="text"
                value={guestForm.patientName}
                onChange={(e) => setGuestForm({ ...guestForm, patientName: e.target.value })}
                placeholder="이름을 입력해주세요"
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
              />
            </div>

            {/* 휴대폰 번호 (읽기 전용) */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                <Phone size={16} className="inline mr-2" />
                연락처
              </label>
              <input
                type="tel"
                value={guestForm.phone}
                disabled
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#6B7280]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 시술 카테고리 */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">시술 카테고리 *</label>
              <select
                value={guestForm.treatmentCategory}
                onChange={(e) => setGuestForm({ ...guestForm, treatmentCategory: e.target.value, treatmentName: "" })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
              >
                <option value="">선택해주세요</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 시술명 */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">시술명 *</label>
              <select
                value={guestForm.treatmentName}
                onChange={(e) => setGuestForm({ ...guestForm, treatmentName: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                disabled={!guestForm.treatmentCategory}
              >
                <option value="">선택해주세요</option>
                {treatmentsByCategory[guestForm.treatmentCategory]?.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 희망 날짜 */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                <Calendar size={16} className="inline mr-2" />
                희망 날짜 *
              </label>
              <input
                type="date"
                value={guestForm.preferredDate}
                onChange={(e) => setGuestForm({ ...guestForm, preferredDate: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
              />
            </div>

            {/* 희망 시간 */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                <Clock size={16} className="inline mr-2" />
                희망 시간 *
              </label>
              <select
                value={guestForm.preferredTime}
                onChange={(e) => setGuestForm({ ...guestForm, preferredTime: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = String(i).padStart(2, "0");
                  return (
                    <option key={hour} value={`${hour}:00`}>
                      {hour}:00
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* 추가 사항 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              <FileText size={16} className="inline mr-2" />
              추가 사항
            </label>
            <textarea
              value={guestForm.notes}
              onChange={(e) => setGuestForm({ ...guestForm, notes: e.target.value })}
              placeholder="특이사항이나 추가 요청사항을 입력해주세요"
              rows={3}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
            />
          </div>

          <button
            type="submit"
            disabled={createGuestReservationMutation.isPending}
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2"
            style={{ background: createGuestReservationMutation.isPending ? "#D1D5DB" : "#4A6FA5" }}
          >
            <Send size={16} />
            {createGuestReservationMutation.isPending ? "예약 중..." : "예약 신청"}
          </button>

          <button
            type="button"
            onClick={() => setStep("info")}
            className="w-full py-2 rounded-lg font-semibold text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
          >
            처음부터 시작
          </button>
        </form>
      )}
    </div>
  );
}

import { useState } from "react";
import { AlertCircle, Phone, Send } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ReservationFormProps {
  onSuccess?: () => void;
}

export function ReservationForm({ onSuccess }: ReservationFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"info" | "verify" | "confirm">("info");

  // 회원 예약 폼 상태
  const [reservationForm, setReservationForm] = useState({
    patientName: user?.name ?? "",
    phone: "",
    treatmentCategory: "",
    treatmentName: "",
    preferredDate: "",
    preferredTime: "10:00",
    notes: "",
  });

  // 비회원 예약 폼 상태
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

  // 시술 카테고리 (TreatmentsEquipmentSection과 동일)
  const CATEGORIES = [
    { id: "1", label: "Best 시술" },
    { id: "2", label: "리프팅·탄력" },
    { id: "3", label: "눈밑지방" },
    { id: "4", label: "백반증" },
    { id: "5", label: "색소·문신" },
    { id: "6", label: "흉터·모공" },
    { id: "7", label: "여드름" },
    { id: "8", label: "홍조·혈관" },
    { id: "9", label: "액취증·다한증" },
    { id: "10", label: "손·발톱무좀" },
    { id: "11", label: "건선·아토피" },
    { id: "12", label: "볼륨·부스터" },
    { id: "13", label: "보톡스·필러" },
  ];

  // 카테고리별 시술명
  const TREATMENTS_BY_CATEGORY: Record<string, string[]> = {
    "1": [
      "울써마지 리프팅 + 리쥬란",
      "프로파운드 RF 리프팅",
      "볼륨업 프로그램",
      "줄기세포 치료",
      "흉터 치료 프로그램",
      "홍조 치료 프로그램",
      "기미 치료 프로그램",
    ],
    "2": [
      "울쎄라피 프라임",
      "써마지 FLX",
      "세르프",
      "울쎄라",
      "프로파운드",
      "텐쎄라",
      "버츄RF",
      "슈링크 유니버스",
      "온다",
      "텐써마",
      "BBL 스킨타이트",
      "트리니티 리프토닝",
    ],
    "3": [
      "눈밑지방재배치",
      "런치타임 눈밑레이저",
    ],
    "4": [
      "백반증 치료 프로그램",
      "엑셀V+ 백반증 치료",
    ],
    "5": [
      "기미 치료 프로그램",
      "엑셀V+ 색소 치료",
      "문신 제거",
    ],
    "6": [
      "흉터 치료 프로그램",
      "여드름 흉터 치료",
      "패인 흉터 치료",
    ],
    "7": [
      "여드름 치료 프로그램",
      "여드름 흉터 치료",
      "여드름 관리",
    ],
    "8": [
      "홍조 치료 프로그램",
      "엑셀V+ 홍조 치료",
      "모세혈관 확장 치료",
    ],
    "9": [
      "액취증 치료",
      "다한증 치료",
      "미라드라이",
    ],
    "10": [
      "손톱무좀 치료",
      "발톱무좀 치료",
      "레이저 무좀 치료",
    ],
    "11": [
      "건선 치료",
      "아토피 치료",
      "가려움증 관리",
    ],
    "12": [
      "볼륨업 프로그램",
      "스컬트라",
      "필러 시술",
      "지방이식",
    ],
    "13": [
      "보톡스 시술",
      "필러 시술",
      "콤비네이션 시술",
    ],
  };

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

  // 회원 예약 처리
  const handleMemberReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationForm.treatmentCategory || !reservationForm.treatmentName) {
      toast.error("시술 카테고리와 시술명을 선택해주세요.");
      return;
    }
    if (!reservationForm.preferredDate) {
      toast.error("희망 날짜를 선택해주세요.");
      return;
    }
    if (!reservationForm.phone) {
      toast.error("연락처를 입력해주세요.");
      return;
    }

    await createReservationMutation.mutateAsync({
      patientName: reservationForm.patientName,
      phone: reservationForm.phone,
      treatmentCategory: reservationForm.treatmentCategory,
      treatmentName: reservationForm.treatmentName,
      preferredDate: new Date(reservationForm.preferredDate).getTime(),
      preferredTime: reservationForm.preferredTime,
      notes: reservationForm.notes,
    });
  };

  // 비회원 OTP 발송
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.phone) {
      toast.error("휴대폰 번호를 입력해주세요.");
      return;
    }
    await sendOtpMutation.mutateAsync({ phone: guestForm.phone });
  };

  // 비회원 OTP 검증
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.otpCode) {
      toast.error("인증번호를 입력해주세요.");
      return;
    }
    await verifyOtpMutation.mutateAsync({
      phone: guestForm.phone,
      otpCode: guestForm.otpCode,
    });
  };

  // 비회원 예약 제출
  const handleGuestReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.treatmentCategory || !guestForm.treatmentName) {
      toast.error("시술 카테고리와 시술명을 선택해주세요.");
      return;
    }
    if (!guestForm.preferredDate) {
      toast.error("희망 날짜를 선택해주세요.");
      return;
    }

    await createGuestReservationMutation.mutateAsync({
      phone: guestForm.phone,
      patientName: guestForm.patientName,
      treatmentCategory: guestForm.treatmentCategory,
      treatmentName: guestForm.treatmentName,
      preferredDate: new Date(guestForm.preferredDate).getTime(),
      preferredTime: guestForm.preferredTime,
      notes: guestForm.notes,
    });
  };

  // 회원 예약 폼 렌더링
  if (user) {
    return (
      <form onSubmit={handleMemberReservation} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 환자명 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
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
              {CATEGORIES.map((cat) => (
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
              {(TREATMENTS_BY_CATEGORY[reservationForm.treatmentCategory] || []).map((treatment) => (
                <option key={treatment} value={treatment}>
                  {treatment}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 희망 날짜 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">희망 날짜 *</label>
            <input
              type="date"
              value={reservationForm.preferredDate}
              onChange={(e) => setReservationForm({ ...reservationForm, preferredDate: e.target.value })}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
            />
          </div>

          {/* 희망 시간 */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">희망 시간</label>
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
          <label className="block text-sm font-semibold text-[#1F2937] mb-2">추가 사항</label>
          <textarea
            value={reservationForm.notes}
            onChange={(e) => setReservationForm({ ...reservationForm, notes: e.target.value })}
            placeholder="특별한 요청사항이 있으시면 입력해주세요"
            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
            rows={3}
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
              />
              <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
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
          <div className="bg-[#DBEAFE] border border-[#93C5FD] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#0284C7] flex-shrink-0" />
            <p className="text-sm text-[#0C4A6E]">휴대폰으로 받은 인증번호를 입력해주세요.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">인증번호 *</label>
            <input
              type="text"
              value={guestForm.otpCode}
              onChange={(e) => setGuestForm({ ...guestForm, otpCode: e.target.value })}
              placeholder="123456"
              maxLength={6}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] text-center text-2xl tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
            style={{ background: verifyOtpMutation.isPending ? "#D1D5DB" : "#4A6FA5" }}
          >
            {verifyOtpMutation.isPending ? "인증 중..." : "인증"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("info");
              setGuestForm({ ...guestForm, otpCode: "" });
            }}
            className="w-full py-2 rounded-lg font-semibold text-[#4A6FA5] border border-[#4A6FA5] transition-colors hover:bg-[#F3F4F6]"
          >
            다시 입력
          </button>
        </form>
      )}

      {/* Step 3: 예약 정보 입력 */}
      {step === "confirm" && (
        <form onSubmit={handleGuestReservation} className="space-y-6">
          <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#15803D] flex-shrink-0" />
            <p className="text-sm text-[#166534]">인증되었습니다. 예약 정보를 입력해주세요.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">환자명 *</label>
            <input
              type="text"
              value={guestForm.patientName}
              onChange={(e) => setGuestForm({ ...guestForm, patientName: e.target.value })}
              placeholder="이름을 입력해주세요"
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
            />
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
                {CATEGORIES.map((cat) => (
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
                {(TREATMENTS_BY_CATEGORY[guestForm.treatmentCategory] || []).map((treatment) => (
                  <option key={treatment} value={treatment}>
                    {treatment}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 희망 날짜 */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">희망 날짜 *</label>
              <input
                type="date"
                value={guestForm.preferredDate}
                onChange={(e) => setGuestForm({ ...guestForm, preferredDate: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
              />
            </div>

            {/* 희망 시간 */}
            <div>
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">희망 시간</label>
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
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">추가 사항</label>
            <textarea
              value={guestForm.notes}
              onChange={(e) => setGuestForm({ ...guestForm, notes: e.target.value })}
              placeholder="특별한 요청사항이 있으시면 입력해주세요"
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
              rows={3}
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
            onClick={() => {
              setStep("info");
              setGuestForm({
                phone: guestForm.phone,
                otpCode: "",
                patientName: "",
                treatmentCategory: "",
                treatmentName: "",
                preferredDate: "",
                preferredTime: "10:00",
                notes: "",
              });
            }}
            className="w-full py-2 rounded-lg font-semibold text-[#4A6FA5] border border-[#4A6FA5] transition-colors hover:bg-[#F3F4F6]"
          >
            처음부터 시작
          </button>
        </form>
      )}
    </div>
  );
}

export default ReservationForm;

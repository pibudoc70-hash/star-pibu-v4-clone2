import { useState } from "react";
import { AlertCircle, Phone, Send } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/useMobile";
import { useLang } from "@/contexts/LangContext";

// ── i18n 레이블 ────────────────────────────────────────────────────────────────
const FORM_LABELS = {
  ko: {
    patientName: "환자명 *",
    patientNamePlaceholder: "이름을 입력해주세요",
    phone: "연락처 *",
    phonePlaceholder: "010-1234-5678",
    phoneIntlPlaceholder: "+82-10-1234-5678",
    category: "시술 카테고리 *",
    categoryPlaceholder: "선택해주세요",
    treatment: "시술명 *",
    treatmentPlaceholder: "선택해주세요",
    date: "희망 날짜 *",
    time: "희망 시간",
    timePlaceholder: "날짜를 먼저 선택해주세요",
    notes: "추가 사항",
    notesPlaceholder: "특별한 요청사항이 있으시면 입력해주세요",
    submit: "예약 신청",
    submitting: "예약 중...",
    restart: "처음부터 시작",
    reenter: "다시 입력",
    otpTitle: "비회원으로 예약하시려면 휴대폰 인증이 필요합니다.",
    otpSend: "인증번호 발송",
    otpSending: "발송 중...",
    otpLabel: "인증번호 *",
    otpPlaceholder: "123456",
    otpVerify: "인증",
    otpVerifying: "인증 중...",
    otpVerifyMsg: "휴대폰으로 받은 인증번호를 입력해주세요.",
    confirmedMsg: "인증되었습니다. 예약 정보를 입력해주세요.",
    phoneInvalid: "올바른 휴대폰 번호 형식이 아닙니다. (010-1234-5678 형식)",
    phoneValid: "올바른 휴대폰 번호 형식입니다.",
    dateUnavailable: "예약 불가능한 날짜입니다. (당일, 일요일, 공휴일 제외)",
    validationCategory: "시술 카테고리와 시술명을 선택해주세요.",
    validationDate: "희망 날짜를 선택해주세요.",
    validationPhone: "연락처를 입력해주세요.",
    validationPhoneFormat: "올바른 휴대폰 번호를 입력해주세요. (010-1234-5678 또는 01012345678 형식)",
    successMsg: "예약이 신청되었습니다. 곧 연락드리겠습니다.",
    errorMsg: "예약 신청 실패: ",
    otpSentMsg: "인증번호가 발송되었습니다. (개발 모드: 콘솔 확인)",
    otpSentError: "OTP 발송 실패: ",
    otpVerifiedMsg: "인증되었습니다.",
    otpVerifyError: "인증 실패: ",
  },
  en: {
    patientName: "Patient Name *",
    patientNamePlaceholder: "Enter your name",
    phone: "Phone Number *",
    phonePlaceholder: "+82-10-1234-5678",
    phoneIntlPlaceholder: "+82-10-1234-5678",
    category: "Treatment Category *",
    categoryPlaceholder: "Please select",
    treatment: "Treatment Name *",
    treatmentPlaceholder: "Please select",
    date: "Preferred Date *",
    time: "Preferred Time",
    timePlaceholder: "Please select a date first",
    notes: "Additional Notes",
    notesPlaceholder: "Any special requests or concerns",
    submit: "Request Booking",
    submitting: "Submitting...",
    restart: "Start Over",
    reenter: "Re-enter",
    otpTitle: "Phone verification is required for guest booking.",
    otpSend: "Send Verification Code",
    otpSending: "Sending...",
    otpLabel: "Verification Code *",
    otpPlaceholder: "123456",
    otpVerify: "Verify",
    otpVerifying: "Verifying...",
    otpVerifyMsg: "Enter the verification code sent to your phone.",
    confirmedMsg: "Verified. Please enter your booking details.",
    phoneInvalid: "Invalid phone number format.",
    phoneValid: "Valid phone number.",
    dateUnavailable: "This date is unavailable. (Same day, Sunday, and holidays excluded)",
    validationCategory: "Please select a treatment category and name.",
    validationDate: "Please select a preferred date.",
    validationPhone: "Please enter your phone number.",
    validationPhoneFormat: "Please enter a valid phone number.",
    successMsg: "Your booking request has been submitted. We will contact you shortly.",
    errorMsg: "Booking failed: ",
    otpSentMsg: "Verification code sent.",
    otpSentError: "Failed to send OTP: ",
    otpVerifiedMsg: "Verified successfully.",
    otpVerifyError: "Verification failed: ",
  },
  ja: {
    patientName: "お名前 *",
    patientNamePlaceholder: "お名前を入力してください",
    phone: "電話番号 *",
    phonePlaceholder: "+82-10-1234-5678",
    phoneIntlPlaceholder: "+82-10-1234-5678",
    category: "施術カテゴリ *",
    categoryPlaceholder: "選択してください",
    treatment: "施術名 *",
    treatmentPlaceholder: "選択してください",
    date: "ご希望の日付 *",
    time: "ご希望の時間",
    timePlaceholder: "まず日付を選択してください",
    notes: "備考",
    notesPlaceholder: "ご要望があればご記入ください",
    submit: "予約を申し込む",
    submitting: "送信中...",
    restart: "最初からやり直す",
    reenter: "再入力",
    otpTitle: "ゲスト予約には電話番号の認証が必要です。",
    otpSend: "認証コードを送信",
    otpSending: "送信中...",
    otpLabel: "認証コード *",
    otpPlaceholder: "123456",
    otpVerify: "認証する",
    otpVerifying: "認証中...",
    otpVerifyMsg: "お電話に届いた認証コードを入力してください。",
    confirmedMsg: "認証されました。予約情報を入力してください。",
    phoneInvalid: "電話番号の形式が正しくありません。",
    phoneValid: "正しい電話番号形式です。",
    dateUnavailable: "この日付は予約できません。（当日・日曜・祝日を除く）",
    validationCategory: "施術カテゴリと施術名を選択してください。",
    validationDate: "ご希望の日付を選択してください。",
    validationPhone: "電話番号を入力してください。",
    validationPhoneFormat: "正しい電話番号を入力してください。",
    successMsg: "ご予約のお申し込みを受け付けました。まもなくご連絡いたします。",
    errorMsg: "予約の申し込みに失敗しました: ",
    otpSentMsg: "認証コードを送信しました。",
    otpSentError: "OTP送信失敗: ",
    otpVerifiedMsg: "認証されました。",
    otpVerifyError: "認証失敗: ",
  },
  zh: {
    patientName: "患者姓名 *",
    patientNamePlaceholder: "请输入您的姓名",
    phone: "联系电话 *",
    phonePlaceholder: "+82-10-1234-5678",
    phoneIntlPlaceholder: "+82-10-1234-5678",
    category: "治疗类别 *",
    categoryPlaceholder: "请选择",
    treatment: "治疗项目 *",
    treatmentPlaceholder: "请选择",
    date: "希望日期 *",
    time: "希望时间",
    timePlaceholder: "请先选择日期",
    notes: "备注",
    notesPlaceholder: "如有特殊要求请填写",
    submit: "提交预约",
    submitting: "提交中...",
    restart: "重新开始",
    reenter: "重新输入",
    otpTitle: "访客预约需要手机验证。",
    otpSend: "发送验证码",
    otpSending: "发送中...",
    otpLabel: "验证码 *",
    otpPlaceholder: "123456",
    otpVerify: "验证",
    otpVerifying: "验证中...",
    otpVerifyMsg: "请输入发送到您手机的验证码。",
    confirmedMsg: "验证成功。请填写预约信息。",
    phoneInvalid: "电话号码格式不正确。",
    phoneValid: "电话号码格式正确。",
    dateUnavailable: "该日期无法预约。（当天、周日及节假日除外）",
    validationCategory: "请选择治疗类别和项目。",
    validationDate: "请选择希望日期。",
    validationPhone: "请输入联系电话。",
    validationPhoneFormat: "请输入正确的电话号码。",
    successMsg: "预约申请已提交，我们将尽快与您联系。",
    errorMsg: "预约失败: ",
    otpSentMsg: "验证码已发送。",
    otpSentError: "OTP发送失败: ",
    otpVerifiedMsg: "验证成功。",
    otpVerifyError: "验证失败: ",
  },
} as const;

// ── 시술 카테고리 (한국어 고정 - 예약 DB 기준) ─────────────────────────────────
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

// ── 카테고리별 시술명 (한국어 고정 - 예약 DB 기준) ────────────────────────────
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

interface ReservationFormProps {
  onSuccess?: () => void;
}

export function ReservationForm({ onSuccess }: ReservationFormProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { lang } = useLang();
  const lbl = FORM_LABELS[lang as keyof typeof FORM_LABELS] ?? FORM_LABELS.ko;
  const isKo = lang === "ko";

  // 모바일에서는 인증 단계 건너뛰고 바로 confirm 단계로
  const [step, setStep] = useState<"info" | "verify" | "confirm">("confirm");

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

  // 휴대폰번호 자동 포맷팅 함수 (한국 번호 전용)
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length > 11) return numbers.slice(0, 11);
    if (numbers.length <= 3) return numbers;
    else if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    else return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 진료시간 설정
  const CLINIC_HOURS = {
    "1": { start: 10, end: 19, name: "월" },
    "2": { start: 10, end: 19, name: "화" },
    "3": { start: 10, end: 19, name: "수" },
    "4": { start: 10, end: 19, name: "목" },
    "5": { start: 10, end: 19, name: "금" },
    "6": { start: 9.5, end: 15, name: "토" },
    "0": { start: null, end: null, name: "일" },
  };

  // 공휴일 목록 (2026년 기준)
  const HOLIDAYS = [
    "2026-01-01", "2026-02-17", "2026-03-01", "2026-04-15",
    "2026-05-05", "2026-05-24", "2026-06-06", "2026-08-15",
    "2026-09-24", "2026-10-03", "2026-10-09", "2026-12-25",
  ];

  const { data: unavailableSlotsData } = trpc.admin.unavailableSlots.list.useQuery(
    { date: undefined },
    { enabled: false }
  );

  const isAvailableDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const now = new Date();
    const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const today = new Date(koreaTime.getFullYear(), koreaTime.getMonth(), koreaTime.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date < tomorrow) return false;
    if (HOLIDAYS.includes(dateStr)) return false;
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return false;
    if (unavailableSlotsData?.some(slot => slot.date === dateStr)) return false;
    return true;
  };

  const getClinicHours = (dateStr: string): { start: number; end: number } | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const hours = CLINIC_HOURS[String(dayOfWeek) as keyof typeof CLINIC_HOURS];
    if (hours.start === null) return null;
    return { start: Math.ceil(hours.start), end: hours.end - 1 };
  };

  const getAvailableTimes = (dateStr: string): string[] => {
    const hours = getClinicHours(dateStr);
    if (!hours) return [];
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const times: string[] = [];
    for (let h = hours.start; h <= hours.end; h++) {
      if (isWeekday && h >= 13 && h < 14) continue;
      times.push(`${String(h).padStart(2, "0")}:00`);
    }
    return times;
  };

  // tRPC 뮤테이션
  const createReservationMutation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      toast.success(lbl.successMsg);
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
    onError: (err) => toast.error(lbl.errorMsg + err.message),
  });

  const sendOtpMutation = trpc.reservation.sendOtp.useMutation({
    onSuccess: () => {
      toast.success(lbl.otpSentMsg);
      setStep("verify");
    },
    onError: (err) => toast.error(lbl.otpSentError + err.message),
  });

  const verifyOtpMutation = trpc.reservation.verifyOtp.useMutation({
    onSuccess: () => {
      toast.success(lbl.otpVerifiedMsg);
      setStep("confirm");
    },
    onError: (err) => toast.error(lbl.otpVerifyError + err.message),
  });

  const createGuestReservationMutation = trpc.reservation.createGuest.useMutation({
    onSuccess: () => {
      toast.success(lbl.successMsg);
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
    onError: (err) => toast.error(lbl.errorMsg + err.message),
  });

  // 회원 예약 처리
  const handleMemberReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationForm.treatmentCategory || !reservationForm.treatmentName) {
      toast.error(lbl.validationCategory);
      return;
    }
    if (!reservationForm.preferredDate) {
      toast.error(lbl.validationDate);
      return;
    }
    if (!reservationForm.phone) {
      toast.error(lbl.validationPhone);
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
      toast.error(lbl.validationPhone);
      return;
    }
    const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(guestForm.phone)) {
      toast.error(lbl.validationPhoneFormat);
      return;
    }
    await sendOtpMutation.mutateAsync({ phone: guestForm.phone });
  };

  // 비회원 OTP 검증
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.otpCode) {
      toast.error(lbl.otpLabel);
      return;
    }
    await verifyOtpMutation.mutateAsync({
      phone: guestForm.phone,
      code: guestForm.otpCode,
    });
  };

  // 비회원 예약 제출
  const handleGuestReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.treatmentCategory || !guestForm.treatmentName) {
      toast.error(lbl.validationCategory);
      return;
    }
    if (!guestForm.preferredDate) {
      toast.error(lbl.validationDate);
      return;
    }
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$|^01[0-9]\d{7,8}$/;
    if (isKo && !phoneRegex.test(guestForm.phone)) {
      toast.error(lbl.validationPhoneFormat);
      return;
    }
    await createGuestReservationMutation.mutateAsync({
      phone: guestForm.phone,
      patientName: guestForm.patientName,
      otpCode: guestForm.otpCode,
      treatmentCategory: guestForm.treatmentCategory,
      treatmentName: guestForm.treatmentName,
      preferredDate: new Date(guestForm.preferredDate).getTime(),
      preferredTime: guestForm.preferredTime,
      notes: guestForm.notes,
    });
  };

  // 공통 인풋 스타일
  const inputCls = "w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]";
  const labelCls = "block text-sm font-semibold text-[#1F2937] mb-2";

  // ── 회원 예약 폼 ──
  if (user) {
    return (
      <form onSubmit={handleMemberReservation} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="res-patient-name" className={labelCls}>{lbl.patientName}</label>
            <input
              id="res-patient-name"
              type="text"
              value={reservationForm.patientName}
              onChange={(e) => setReservationForm({ ...reservationForm, patientName: e.target.value })}
              placeholder={lbl.patientNamePlaceholder}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="res-phone" className={labelCls}>
              <Phone size={16} className="inline mr-2" />
              {lbl.phone}
            </label>
            <input
              id="res-phone"
              type="tel"
              value={reservationForm.phone}
              onChange={(e) => setReservationForm({ ...reservationForm, phone: isKo ? formatPhoneNumber(e.target.value) : e.target.value })}
              placeholder={isKo ? lbl.phonePlaceholder : lbl.phoneIntlPlaceholder}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="res-category" className={labelCls}>{lbl.category}</label>
            <select
              id="res-category"
              value={reservationForm.treatmentCategory}
              onChange={(e) => setReservationForm({ ...reservationForm, treatmentCategory: e.target.value, treatmentName: "" })}
              className={inputCls}
            >
              <option value="">{lbl.categoryPlaceholder}</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="res-treatment" className={labelCls}>{lbl.treatment}</label>
            <select
              id="res-treatment"
              value={reservationForm.treatmentName}
              onChange={(e) => setReservationForm({ ...reservationForm, treatmentName: e.target.value })}
              className={inputCls}
              disabled={!reservationForm.treatmentCategory}
            >
              <option value="">{lbl.treatmentPlaceholder}</option>
              {(TREATMENTS_BY_CATEGORY[reservationForm.treatmentCategory] || []).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="res-date" className={labelCls}>{lbl.date}</label>
            <input
              id="res-date"
              type="date"
              value={reservationForm.preferredDate}
              onChange={(e) => {
                if (isAvailableDate(e.target.value)) {
                  setReservationForm({ ...reservationForm, preferredDate: e.target.value, preferredTime: "10:00" });
                } else {
                  toast.error(lbl.dateUnavailable);
                }
              }}
              min={(() => {
                const now = new Date();
                const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
                const tomorrow = new Date(koreaTime.getFullYear(), koreaTime.getMonth(), koreaTime.getDate() + 1);
                return tomorrow.toISOString().split('T')[0];
              })()}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="res-time" className={labelCls}>{lbl.time}</label>
            <select
              id="res-time"
              value={reservationForm.preferredTime}
              onChange={(e) => setReservationForm({ ...reservationForm, preferredTime: e.target.value })}
              className={inputCls}
            >
              {getAvailableTimes(reservationForm.preferredDate).length > 0 ? (
                getAvailableTimes(reservationForm.preferredDate).map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))
              ) : (
                <option value="">{lbl.timePlaceholder}</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="res-notes" className={labelCls}>{lbl.notes}</label>
          <textarea
            id="res-notes"
            value={reservationForm.notes}
            onChange={(e) => setReservationForm({ ...reservationForm, notes: e.target.value })}
            placeholder={lbl.notesPlaceholder}
            className={inputCls}
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
          {createReservationMutation.isPending ? lbl.submitting : lbl.submit}
        </button>
      </form>
    );
  }

  // ── 비회원 예약 폼 ──
  return (
    <div className="space-y-6">
      {/* Step 1: OTP 발송 - 숨김 처리 */}
      {step === "info" && (
        <form onSubmit={handleSendOtp} className="space-y-6" style={{ display: 'none' }}>
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#D97706] flex-shrink-0" />
            <p className="text-sm text-[#92400E]">{lbl.otpTitle}</p>
          </div>
          <div>
            <label htmlFor="guest-phone-otp" className={labelCls}>
              <Phone size={16} className="inline mr-2" />
              {lbl.phone}
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  id="guest-phone-otp"
                  type="tel"
                  value={guestForm.phone}
                  onChange={(e) => setGuestForm({ ...guestForm, phone: formatPhoneNumber(e.target.value) })}
                  placeholder={lbl.phonePlaceholder}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    guestForm.phone && !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(guestForm.phone)
                      ? 'border-[#EF4444] focus:ring-[#EF4444]'
                      : 'border-[#E5E7EB] focus:ring-[#4A6FA5]'
                  }`}
                />
                <button
                  type="submit"
                  disabled={sendOtpMutation.isPending || !!(guestForm.phone && !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(guestForm.phone))}
                  className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
                  style={{
                    background:
                      sendOtpMutation.isPending || (guestForm.phone && !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(guestForm.phone))
                        ? "#D1D5DB"
                        : "#4A6FA5",
                  }}
                >
                  {sendOtpMutation.isPending ? lbl.otpSending : lbl.otpSend}
                </button>
              </div>
              {guestForm.phone && !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(guestForm.phone) && (
                <p className="text-sm text-[#EF4444]">{lbl.phoneInvalid}</p>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Step 2: OTP 검증 - 숨김 처리 */}
      {step === "verify" && (
        <form onSubmit={handleVerifyOtp} className="space-y-6" style={{ display: 'none' }}>
          <div className="bg-[#DBEAFE] border border-[#93C5FD] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#0284C7] flex-shrink-0" />
            <p className="text-sm text-[#0C4A6E]">{lbl.otpVerifyMsg}</p>
          </div>
          <div>
            <label htmlFor="guest-otp-code" className={labelCls}>{lbl.otpLabel}</label>
            <input
              id="guest-otp-code"
              type="text"
              value={guestForm.otpCode}
              onChange={(e) => setGuestForm({ ...guestForm, otpCode: e.target.value })}
              placeholder={lbl.otpPlaceholder}
              maxLength={6}
              className={`${inputCls} text-center text-2xl tracking-widest`}
            />
          </div>
          <button
            type="submit"
            disabled={verifyOtpMutation.isPending}
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
            style={{ background: verifyOtpMutation.isPending ? "#D1D5DB" : "#4A6FA5" }}
          >
            {verifyOtpMutation.isPending ? lbl.otpVerifying : lbl.otpVerify}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("info");
              setGuestForm({ ...guestForm, otpCode: "" });
            }}
            className="w-full py-2 rounded-lg font-semibold text-[#4A6FA5] border border-[#4A6FA5] transition-colors hover:bg-[#F3F4F6]"
          >
            {lbl.reenter}
          </button>
        </form>
      )}

      {/* Step 3: 예약 정보 입력 - 항상 표시 */}
      {step === "confirm" && (
        <form onSubmit={handleGuestReservation} className="space-y-6">
          <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#15803D] flex-shrink-0" />
            <p className="text-sm text-[#166534]">{lbl.confirmedMsg}</p>
          </div>

          <div>
            <label htmlFor="guest-phone" className={labelCls}>{lbl.phone}</label>
            <div className="space-y-2">
              <input
                id="guest-phone"
                type="tel"
                value={guestForm.phone}
                onChange={(e) => setGuestForm({ ...guestForm, phone: isKo ? formatPhoneNumber(e.target.value) : e.target.value })}
                placeholder={isKo ? lbl.phonePlaceholder : lbl.phoneIntlPlaceholder}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isKo && guestForm.phone && !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(guestForm.phone)
                    ? 'border-[#EF4444] focus:ring-[#EF4444]'
                    : 'border-[#E5E7EB] focus:ring-[#4A6FA5]'
                }`}
              />
              {isKo && guestForm.phone && !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(guestForm.phone) && (
                <p className="text-sm text-[#EF4444]">{lbl.phoneInvalid}</p>
              )}
              {isKo && guestForm.phone && /^01[0-9]-?\d{3,4}-?\d{4}$/.test(guestForm.phone) && (
                <p className="text-sm text-[#16A34A]">{lbl.phoneValid}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="guest-patient-name" className={labelCls}>{lbl.patientName}</label>
            <input
              id="guest-patient-name"
              type="text"
              value={guestForm.patientName}
              onChange={(e) => setGuestForm({ ...guestForm, patientName: e.target.value })}
              placeholder={lbl.patientNamePlaceholder}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guest-category" className={labelCls}>{lbl.category}</label>
              <select
                id="guest-category"
                value={guestForm.treatmentCategory}
                onChange={(e) => setGuestForm({ ...guestForm, treatmentCategory: e.target.value, treatmentName: "" })}
                className={inputCls}
              >
                <option value="">{lbl.categoryPlaceholder}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="guest-treatment" className={labelCls}>{lbl.treatment}</label>
              <select
                id="guest-treatment"
                value={guestForm.treatmentName}
                onChange={(e) => setGuestForm({ ...guestForm, treatmentName: e.target.value })}
                className={inputCls}
                disabled={!guestForm.treatmentCategory}
              >
                <option value="">{lbl.treatmentPlaceholder}</option>
                {(TREATMENTS_BY_CATEGORY[guestForm.treatmentCategory] || []).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guest-date" className={labelCls}>{lbl.date}</label>
              <input
                id="guest-date"
                type="date"
                value={guestForm.preferredDate}
                onChange={(e) => {
                  if (isAvailableDate(e.target.value)) {
                    setGuestForm({ ...guestForm, preferredDate: e.target.value, preferredTime: "10:00" });
                  } else {
                    toast.error(lbl.dateUnavailable);
                  }
                }}
                min={new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="guest-time" className={labelCls}>{lbl.time}</label>
              <select
                id="guest-time"
                value={guestForm.preferredTime}
                onChange={(e) => setGuestForm({ ...guestForm, preferredTime: e.target.value })}
                className={inputCls}
              >
                {getAvailableTimes(guestForm.preferredDate).length > 0 ? (
                  getAvailableTimes(guestForm.preferredDate).map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))
                ) : (
                  <option value="">{lbl.timePlaceholder}</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="guest-notes" className={labelCls}>{lbl.notes}</label>
            <textarea
              id="guest-notes"
              value={guestForm.notes}
              onChange={(e) => setGuestForm({ ...guestForm, notes: e.target.value })}
              placeholder={lbl.notesPlaceholder}
              className={inputCls}
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
            {createGuestReservationMutation.isPending ? lbl.submitting : lbl.submit}
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
            {lbl.restart}
          </button>
        </form>
      )}
    </div>
  );
}

export default ReservationForm;

/**
 * 비회원 예약 폼 (OTP 3단계: info → verify → confirm)
 * - Step 2(verify)에 남은 유효 시간 타이머 UI 추가
 */
import { useState } from "react";
import { AlertCircle, Clock, Phone, RefreshCw, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLang } from "@/contexts/LangContext";
import { FORM_LABELS, CATEGORIES, TREATMENTS_BY_CATEGORY } from "./constants";
import { formatPhoneNumber, useReservationHelpers } from "./useReservationHelpers";
import { useOtpTimer } from "./useOtpTimer";
import { parseOtpSendError, parseOtpVerifyError, parseReservationError, type Lang } from "./errorMessages";

interface Props {
  onSuccess?: () => void;
}

const inputCls = "w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-primary)]";
const labelCls = "block text-sm font-semibold text-[#1F2937] mb-2";

const EMPTY_GUEST_FORM = {
  phone: "",
  otpCode: "",
  patientName: "",
  treatmentCategory: "",
  treatmentName: "",
  preferredDate: "",
  preferredTime: "10:00",
  notes: "",
};

const KO_PHONE_RE = /^01[0-9]-?\d{3,4}-?\d{4}$/;

export function GuestReservationForm({ onSuccess }: Props) {
  const { lang } = useLang();
  const lbl = FORM_LABELS[lang as keyof typeof FORM_LABELS] ?? FORM_LABELS.ko;
  const isKo = lang === "ko";
  const { isAvailableDate, getAvailableTimes, tomorrowStr } = useReservationHelpers();
  const timer = useOtpTimer();

  const [step, setStep] = useState<"info" | "verify" | "confirm">("info");
  const [form, setForm] = useState(EMPTY_GUEST_FORM);

  const currentLang = (lang as Lang) ?? "ko";

  const sendOtpMutation = trpc.reservation.sendOtp.useMutation({
    onSuccess: () => {
      toast.success(lbl.otpSentMsg);
      timer.start();
      setStep("verify");
    },
    onError: (err) => toast.error(parseOtpSendError(err, currentLang)),
  });

  const verifyOtpMutation = trpc.reservation.verifyOtp.useMutation({
    onSuccess: () => {
      toast.success(lbl.otpVerifiedMsg);
      timer.reset();
      setStep("confirm");
    },
    onError: (err) => toast.error(parseOtpVerifyError(err, currentLang)),
  });

  const createGuestMutation = trpc.reservation.createGuest.useMutation({
    onSuccess: () => {
      toast.success(lbl.successMsg);
      setForm(EMPTY_GUEST_FORM);
      timer.reset();
      setStep("info");
      onSuccess?.();
    },
    onError: (err) => toast.error(parseReservationError(err, currentLang)),
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone) { toast.error(lbl.validationPhone); return; }
    if (!KO_PHONE_RE.test(form.phone)) { toast.error(lbl.validationPhoneFormat); return; }
    await sendOtpMutation.mutateAsync({ phone: form.phone });
  };

  const handleResendOtp = async () => {
    if (!form.phone) return;
    setForm({ ...form, otpCode: "" });
    await sendOtpMutation.mutateAsync({ phone: form.phone });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.otpCode) { toast.error(lbl.otpLabel); return; }
    if (timer.isExpired) { toast.error(lbl.otpExpiredMsg); return; }
    await verifyOtpMutation.mutateAsync({ phone: form.phone, code: form.otpCode });
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.treatmentCategory || !form.treatmentName) { toast.error(lbl.validationCategory); return; }
    if (!form.preferredDate) { toast.error(lbl.validationDate); return; }
    const fullPhoneRe = /^01[0-9]-\d{3,4}-\d{4}$|^01[0-9]\d{7,8}$/;
    if (isKo && !fullPhoneRe.test(form.phone)) { toast.error(lbl.validationPhoneFormat); return; }
    await createGuestMutation.mutateAsync({
      phone: form.phone,
      patientName: form.patientName,
      otpCode: form.otpCode,
      treatmentCategory: form.treatmentCategory,
      treatmentName: form.treatmentName,
      preferredDate: new Date(form.preferredDate).getTime(),
      preferredTime: form.preferredTime,
      notes: form.notes,
    });
  };

  const phoneInvalid = !!form.phone && !KO_PHONE_RE.test(form.phone);

  // 타이머 색상: 60초 이하 → 빨간색, 60~120초 → 주황색, 120초 이상 → 파란색
  const timerColor =
    timer.remaining <= 60 ? "#EF4444" :
    timer.remaining <= 120 ? "#F97316" :
    "#0284C7";

  return (
    <div className="space-y-6">
      {/* Step 1: 전화번호 입력 + OTP 발송 */}
      {step === "info" && (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#D97706] flex-shrink-0" />
            <p className="text-sm text-[#92400E]">{lbl.otpTitle}</p>
          </div>
          <div>
            <label htmlFor="guest-phone-otp" className={labelCls}>
              <Phone size={16} className="inline mr-2" />{lbl.phone}
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input id="guest-phone-otp" type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhoneNumber(e.target.value) })}
                  placeholder={lbl.phonePlaceholder}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    phoneInvalid ? "border-[#EF4444] focus:ring-[#EF4444]" : "border-[#E5E7EB] focus:ring-[var(--color-gold-primary)]"
                  }`} />
                <button type="submit"
                  disabled={sendOtpMutation.isPending || phoneInvalid}
                  className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
                  style={{ background: sendOtpMutation.isPending || phoneInvalid ? "#D1D5DB" : "var(--color-gold-primary)", color: sendOtpMutation.isPending || phoneInvalid ? "#6B7280" : "#1a1a1a" }}>
                  {sendOtpMutation.isPending ? lbl.otpSending : lbl.otpSend}
                </button>
              </div>
              {phoneInvalid && <p className="text-sm text-[#EF4444]">{lbl.phoneInvalid}</p>}
            </div>
          </div>
        </form>
      )}

      {/* Step 2: OTP 검증 */}
      {step === "verify" && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          {/* 안내 배너 */}
          {!timer.isExpired ? (
            <div className="bg-[#DBEAFE] border border-[#93C5FD] rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-[#0284C7] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#0C4A6E]">{lbl.otpVerifyMsg}</p>
            </div>
          ) : (
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#7F1D1D]">{lbl.otpExpiredMsg}</p>
            </div>
          )}

          {/* 타이머 영역 */}
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-sm font-medium text-[#374151]">
                <Clock size={15} style={{ color: timerColor }} />
                {lbl.otpTimerLabel}
              </span>
              <span
                className="text-xl font-mono font-bold tabular-nums"
                style={{ color: timerColor }}
              >
                {timer.isExpired ? "00:00" : timer.formatted}
              </span>
            </div>

            {/* 프로그레스 바 */}
            <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${timer.isExpired ? 0 : timer.progress}%`,
                  background: timerColor,
                }}
              />
            </div>
          </div>

          {/* OTP 입력 */}
          <div>
            <label htmlFor="guest-otp-code" className={labelCls}>{lbl.otpLabel}</label>
            <input
              id="guest-otp-code"
              type="text"
              value={form.otpCode}
              onChange={(e) => setForm({ ...form, otpCode: e.target.value })}
              placeholder={lbl.otpPlaceholder}
              maxLength={6}
              disabled={timer.isExpired}
              className={`${inputCls} text-center text-2xl tracking-widest ${
                timer.isExpired ? "opacity-40 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* 인증 버튼 */}
          <button
            type="submit"
            disabled={verifyOtpMutation.isPending || timer.isExpired}
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
            style={{
              background: verifyOtpMutation.isPending || timer.isExpired ? "#D1D5DB" : "var(--color-gold-primary)",
            }}
          >
            {verifyOtpMutation.isPending ? lbl.otpVerifying : lbl.otpVerify}
          </button>

          {/* 재발송 버튼 (만료 시 강조, 미만료 시 서브) */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={sendOtpMutation.isPending}
            className={`w-full py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              timer.isExpired
                ? "text-white"
                : "border hover:bg-[#F9F7F4]"
            }`}
            style={timer.isExpired ? { background: "var(--color-gold-primary)", color: "#1a1a1a" } : {}}
          >
            <RefreshCw size={15} className={sendOtpMutation.isPending ? "animate-spin" : ""} />
            {sendOtpMutation.isPending ? lbl.otpResending : lbl.otpResend}
          </button>

          {/* 번호 다시 입력 */}
          <button
            type="button"
            onClick={() => { timer.reset(); setStep("info"); setForm({ ...form, otpCode: "" }); }}
            className="w-full py-2 rounded-lg font-semibold text-[#6B7280] border border-[#D1D5DB] transition-colors hover:bg-[#F3F4F6] text-sm"
          >
            {lbl.reenter}
          </button>
        </form>
      )}

      {/* Step 3: 예약 정보 입력 */}
      {step === "confirm" && (
        <form onSubmit={handleGuestSubmit} className="space-y-6">
          <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#15803D] flex-shrink-0" />
            <p className="text-sm text-[#166534]">{lbl.confirmedMsg}</p>
          </div>

          <div>
            <label htmlFor="guest-phone" className={labelCls}>{lbl.phone}</label>
            <div className="space-y-2">
              <input id="guest-phone" type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: isKo ? formatPhoneNumber(e.target.value) : e.target.value })}
                placeholder={isKo ? lbl.phonePlaceholder : lbl.phoneIntlPlaceholder}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  isKo && form.phone && !KO_PHONE_RE.test(form.phone)
                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#E5E7EB] focus:ring-[var(--color-gold-primary)]"
                }`} />
              {isKo && form.phone && !KO_PHONE_RE.test(form.phone) && (
                <p className="text-sm text-[#EF4444]">{lbl.phoneInvalid}</p>
              )}
              {isKo && form.phone && KO_PHONE_RE.test(form.phone) && (
                <p className="text-sm text-[#16A34A]">{lbl.phoneValid}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="guest-patient-name" className={labelCls}>{lbl.patientName}</label>
            <input id="guest-patient-name" type="text" value={form.patientName}
              onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              placeholder={lbl.patientNamePlaceholder} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guest-category" className={labelCls}>{lbl.category}</label>
              <select id="guest-category" value={form.treatmentCategory}
                onChange={(e) => setForm({ ...form, treatmentCategory: e.target.value, treatmentName: "" })}
                className={inputCls}>
                <option value="">{lbl.categoryPlaceholder}</option>
                {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="guest-treatment" className={labelCls}>{lbl.treatment}</label>
              <select id="guest-treatment" value={form.treatmentName}
                onChange={(e) => setForm({ ...form, treatmentName: e.target.value })}
                disabled={!form.treatmentCategory} className={inputCls}>
                <option value="">{lbl.treatmentPlaceholder}</option>
                {(TREATMENTS_BY_CATEGORY[form.treatmentCategory] ?? []).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guest-date" className={labelCls}>{lbl.date}</label>
              <input id="guest-date" type="date" value={form.preferredDate}
                onChange={(e) => {
                  if (isAvailableDate(e.target.value)) {
                    setForm({ ...form, preferredDate: e.target.value, preferredTime: "10:00" });
                  } else {
                    toast.error(lbl.dateUnavailable);
                  }
                }}
                min={tomorrowStr()} className={inputCls} />
            </div>
            <div>
              <label htmlFor="guest-time" className={labelCls}>{lbl.time}</label>
              <select id="guest-time" value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                className={inputCls}>
                {getAvailableTimes(form.preferredDate).length > 0
                  ? getAvailableTimes(form.preferredDate).map((t) => <option key={t} value={t}>{t}</option>)
                  : <option value="">{lbl.timePlaceholder}</option>}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="guest-notes" className={labelCls}>{lbl.notes}</label>
            <textarea id="guest-notes" value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder={lbl.notesPlaceholder} className={inputCls} rows={3} />
          </div>

          <button type="submit" disabled={createGuestMutation.isPending}
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2"
            style={{ background: createGuestMutation.isPending ? "#D1D5DB" : "var(--color-gold-primary)", color: createGuestMutation.isPending ? "#6B7280" : "#1a1a1a" }}>
            <Send size={16} />
            {createGuestMutation.isPending ? lbl.submitting : lbl.submit}
          </button>

          <button type="button"
            onClick={() => {
              timer.reset();
              setStep("info");
              setForm({ ...EMPTY_GUEST_FORM, phone: form.phone });
            }}
            className="w-full py-2 rounded-lg font-semibold border transition-colors hover:bg-[#F9F7F4]" style={{ color: "var(--color-gold-deep)", borderColor: "var(--color-gold-primary)" }}>
            {lbl.restart}
          </button>
        </form>
      )}
    </div>
  );
}

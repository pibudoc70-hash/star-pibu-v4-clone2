/**
 * 비회원 예약 폼 (OTP 3단계: info → verify → confirm)
 */
import { useState } from "react";
import { AlertCircle, Phone, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLang } from "@/contexts/LangContext";
import { FORM_LABELS, CATEGORIES, TREATMENTS_BY_CATEGORY } from "./constants";
import { formatPhoneNumber, useReservationHelpers } from "./useReservationHelpers";

interface Props {
  onSuccess?: () => void;
}

const inputCls = "w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]";
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

  const [step, setStep] = useState<"info" | "verify" | "confirm">("info");
  const [form, setForm] = useState(EMPTY_GUEST_FORM);

  const sendOtpMutation = trpc.reservation.sendOtp.useMutation({
    onSuccess: () => { toast.success(lbl.otpSentMsg); setStep("verify"); },
    onError: (err) => toast.error(lbl.otpSentError + err.message),
  });

  const verifyOtpMutation = trpc.reservation.verifyOtp.useMutation({
    onSuccess: () => { toast.success(lbl.otpVerifiedMsg); setStep("confirm"); },
    onError: (err) => toast.error(lbl.otpVerifyError + err.message),
  });

  const createGuestMutation = trpc.reservation.createGuest.useMutation({
    onSuccess: () => {
      toast.success(lbl.successMsg);
      setForm(EMPTY_GUEST_FORM);
      setStep("info");
      onSuccess?.();
    },
    onError: (err) => toast.error(lbl.errorMsg + err.message),
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone) { toast.error(lbl.validationPhone); return; }
    if (!KO_PHONE_RE.test(form.phone)) { toast.error(lbl.validationPhoneFormat); return; }
    await sendOtpMutation.mutateAsync({ phone: form.phone });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.otpCode) { toast.error(lbl.otpLabel); return; }
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
                    phoneInvalid ? "border-[#EF4444] focus:ring-[#EF4444]" : "border-[#E5E7EB] focus:ring-[#4A6FA5]"
                  }`} />
                <button type="submit"
                  disabled={sendOtpMutation.isPending || phoneInvalid}
                  className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
                  style={{ background: sendOtpMutation.isPending || phoneInvalid ? "#D1D5DB" : "#4A6FA5" }}>
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
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="bg-[#DBEAFE] border border-[#93C5FD] rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-[#0284C7] flex-shrink-0" />
            <p className="text-sm text-[#0C4A6E]">{lbl.otpVerifyMsg}</p>
          </div>
          <div>
            <label htmlFor="guest-otp-code" className={labelCls}>{lbl.otpLabel}</label>
            <input id="guest-otp-code" type="text" value={form.otpCode}
              onChange={(e) => setForm({ ...form, otpCode: e.target.value })}
              placeholder={lbl.otpPlaceholder} maxLength={6}
              className={`${inputCls} text-center text-2xl tracking-widest`} />
          </div>
          <button type="submit" disabled={verifyOtpMutation.isPending}
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
            style={{ background: verifyOtpMutation.isPending ? "#D1D5DB" : "#4A6FA5" }}>
            {verifyOtpMutation.isPending ? lbl.otpVerifying : lbl.otpVerify}
          </button>
          <button type="button"
            onClick={() => { setStep("info"); setForm({ ...form, otpCode: "" }); }}
            className="w-full py-2 rounded-lg font-semibold text-[#4A6FA5] border border-[#4A6FA5] transition-colors hover:bg-[#F3F4F6]">
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
                    : "border-[#E5E7EB] focus:ring-[#4A6FA5]"
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
            style={{ background: createGuestMutation.isPending ? "#D1D5DB" : "#4A6FA5" }}>
            <Send size={16} />
            {createGuestMutation.isPending ? lbl.submitting : lbl.submit}
          </button>

          <button type="button"
            onClick={() => {
              setStep("info");
              setForm({ ...EMPTY_GUEST_FORM, phone: form.phone });
            }}
            className="w-full py-2 rounded-lg font-semibold text-[#4A6FA5] border border-[#4A6FA5] transition-colors hover:bg-[#F3F4F6]">
            {lbl.restart}
          </button>
        </form>
      )}
    </div>
  );
}

/**
 * 회원 예약 폼 (로그인 상태)
 */
import { useState } from "react";
import { Phone, Send } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
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

export function MemberReservationForm({ onSuccess }: Props) {
  const { user } = useAuth();
  const { lang } = useLang();
  const lbl = FORM_LABELS[lang as keyof typeof FORM_LABELS] ?? FORM_LABELS.ko;
  const isKo = lang === "ko";
  const { isAvailableDate, getAvailableTimes, tomorrowStr } = useReservationHelpers();

  const [form, setForm] = useState({
    patientName: user?.name ?? "",
    phone: "",
    treatmentCategory: "",
    treatmentName: "",
    preferredDate: "",
    preferredTime: "10:00",
    notes: "",
  });

  const createReservationMutation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      toast.success(lbl.successMsg);
      setForm({ patientName: user?.name ?? "", phone: "", treatmentCategory: "", treatmentName: "", preferredDate: "", preferredTime: "10:00", notes: "" });
      onSuccess?.();
    },
    onError: (err) => toast.error(lbl.errorMsg + err.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.treatmentCategory || !form.treatmentName) { toast.error(lbl.validationCategory); return; }
    if (!form.preferredDate) { toast.error(lbl.validationDate); return; }
    if (!form.phone) { toast.error(lbl.validationPhone); return; }
    await createReservationMutation.mutateAsync({
      patientName: form.patientName,
      phone: form.phone,
      treatmentCategory: form.treatmentCategory,
      treatmentName: form.treatmentName,
      preferredDate: new Date(form.preferredDate).getTime(),
      preferredTime: form.preferredTime,
      notes: form.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="res-patient-name" className={labelCls}>{lbl.patientName}</label>
          <input id="res-patient-name" type="text" value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            placeholder={lbl.patientNamePlaceholder} className={inputCls} />
        </div>
        <div>
          <label htmlFor="res-phone" className={labelCls}>
            <Phone size={16} className="inline mr-2" />{lbl.phone}
          </label>
          <input id="res-phone" type="tel" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: isKo ? formatPhoneNumber(e.target.value) : e.target.value })}
            placeholder={isKo ? lbl.phonePlaceholder : lbl.phoneIntlPlaceholder} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="res-category" className={labelCls}>{lbl.category}</label>
          <select id="res-category" value={form.treatmentCategory}
            onChange={(e) => setForm({ ...form, treatmentCategory: e.target.value, treatmentName: "" })}
            className={inputCls}>
            <option value="">{lbl.categoryPlaceholder}</option>
            {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="res-treatment" className={labelCls}>{lbl.treatment}</label>
          <select id="res-treatment" value={form.treatmentName}
            onChange={(e) => setForm({ ...form, treatmentName: e.target.value })}
            disabled={!form.treatmentCategory} className={inputCls}>
            <option value="">{lbl.treatmentPlaceholder}</option>
            {(TREATMENTS_BY_CATEGORY[form.treatmentCategory] ?? []).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="res-date" className={labelCls}>{lbl.date}</label>
          <input id="res-date" type="date" value={form.preferredDate}
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
          <label htmlFor="res-time" className={labelCls}>{lbl.time}</label>
          <select id="res-time" value={form.preferredTime}
            onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
            className={inputCls}>
            {getAvailableTimes(form.preferredDate).length > 0
              ? getAvailableTimes(form.preferredDate).map((t) => <option key={t} value={t}>{t}</option>)
              : <option value="">{lbl.timePlaceholder}</option>}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="res-notes" className={labelCls}>{lbl.notes}</label>
        <textarea id="res-notes" value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder={lbl.notesPlaceholder} className={inputCls} rows={3} />
      </div>

      <button type="submit" disabled={createReservationMutation.isPending}
        className="w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2"
        style={{ background: createReservationMutation.isPending ? "#D1D5DB" : "#4A6FA5" }}>
        <Send size={16} />
        {createReservationMutation.isPending ? lbl.submitting : lbl.submit}
      </button>
    </form>
  );
}

/**
 * [LEGACY PAGE - NOT ROUTED]
 *
 * STATUS: legacy — removed from App.tsx in PR-27 (2025-04).
 * Reservation entry is now the #reservation anchor on each landing page:
 *   ko => /#reservation | en => /en#reservation
 *   ja => /ja#reservation | zh => /zh#reservation
 *
 * TO REACTIVATE: add <Route path="/reserve" component={Reserve} /> to App.tsx
 *   and re-evaluate OTP flow before going live.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead"; // COMMON_HREFLANGS 제거: NOT ROUTED legacy file — hreflangs 불필요
import { useLang } from "@/contexts/LangContext";
import {
  Calendar, Clock, User, Phone, FileText,
  ChevronRight, CheckCircle, MessageSquare, LogIn,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

// ─── 다국어 레이블 ────────────────────────────────────────────────────────────
const RESERVE_LABELS = {
  ko: {
    badge: "온라인 예약",
    title: "시술 예약 신청",
    subtitle: "원하시는 시술과 날짜를 선택해 주세요",
    memberTab: "회원 예약",
    guestTab: "비회원 간편 예약",
    loginTitle: "로그인 후 예약하기",
    loginDesc: "회원 예약은 예약 내역 조회 및 관리가 가능합니다.",
    loginBtn: "로그인 / 회원가입",
    guestBtn: "비회원으로 예약하기",
    guestNotice: "전화번호 인증 후 예약이 가능합니다. 예약 내역은 문자로 안내드립니다.",
    steps: { treatment: "시술 선택", datetime: "날짜·시간", info: "정보 입력", verify: "인증·예약" },
    treatmentCategory: "시술 카테고리 선택",
    treatmentItem: "시술 항목 선택",
    next: "다음 단계",
    back: "이전",
    date: "희망 날짜",
    time: "희망 시간",
    timeHint: "직접 입력하거나 아래 버튼으로 선택하세요",
    confirm: "예약 내용 확인",
    treatment: "시술",
    dateLabel: "날짜",
    timeLabel: "시간",
    name: "이름",
    namePlaceholder: "예약자 이름",
    contact: "연락처",
    contactPlaceholder: "010-0000-0000",
    contactHint: "예약 확정 문자를 받으실 번호를 입력해주세요",
    notes: "요청 사항",
    notesOptional: "(선택)",
    notesPlaceholder: "알레르기, 시술 경험, 특이사항 등",
    submit: "예약 신청 완료",
    submitting: "신청 중...",
    phoneVerify: "휴대폰 번호 인증",
    sendOtp: "인증번호 발송",
    resendOtp: "재발송",
    sending: "발송 중...",
    otpInput: "인증번호 입력",
    otpPlaceholder: "6자리 숫자",
    otpHint: "인증번호가 오지 않으면 재발송 버튼을 눌러주세요",
    verify: "확인",
    verifying: "확인 중...",
    verified: "전화번호 인증 완료",
    successTitle: "예약 신청 완료!",
    successDesc: "예약이 접수되었습니다.",
    successNotice: "휴대폰으로 접수 확인 문자를 발송했습니다.",
    successDetail: "예약 확정은 담당자 확인 후 별도 문자로 안내드립니다.",
    successDays: "(영업일 기준 1~2일 내)",
    successContact: "문의: 051-818-2300",
    viewHistory: "예약 내역 보기",
    goHome: "홈으로",
  },
  en: {
    badge: "Online Booking",
    title: "Book a Treatment",
    subtitle: "Select your desired treatment and preferred date",
    memberTab: "Member Booking",
    guestTab: "Guest Booking",
    loginTitle: "Login to Book",
    loginDesc: "Members can view and manage their booking history.",
    loginBtn: "Login / Sign Up",
    guestBtn: "Continue as Guest",
    guestNotice: "Phone verification required. Booking details will be sent via SMS.",
    steps: { treatment: "Treatment", datetime: "Date & Time", info: "Your Info", verify: "Verify & Book" },
    treatmentCategory: "Select Category",
    treatmentItem: "Select Treatment",
    next: "Next",
    back: "Back",
    date: "Preferred Date",
    time: "Preferred Time",
    timeHint: "Type directly or select from the buttons below",
    confirm: "Booking Summary",
    treatment: "Treatment",
    dateLabel: "Date",
    timeLabel: "Time",
    name: "Full Name",
    namePlaceholder: "Your name",
    contact: "Phone Number",
    contactPlaceholder: "+82-10-0000-0000",
    contactHint: "We will send a confirmation SMS to this number",
    notes: "Special Requests",
    notesOptional: "(Optional)",
    notesPlaceholder: "Allergies, previous treatments, special conditions, etc.",
    submit: "Confirm Booking",
    submitting: "Submitting...",
    phoneVerify: "Phone Verification",
    sendOtp: "Send Code",
    resendOtp: "Resend",
    sending: "Sending...",
    otpInput: "Enter Verification Code",
    otpPlaceholder: "6-digit code",
    otpHint: "Didn't receive the code? Click Resend.",
    verify: "Verify",
    verifying: "Verifying...",
    verified: "Phone Verified",
    successTitle: "Booking Submitted!",
    successDesc: "Your booking has been received.",
    successNotice: "A confirmation SMS has been sent to your phone.",
    successDetail: "Booking confirmation will be sent via SMS after staff review.",
    successDays: "(Within 1-2 business days)",
    successContact: "Inquiries: +82-51-818-2300",
    viewHistory: "View My Bookings",
    goHome: "Go Home",
  },
  ja: {
    badge: "オンライン予約",
    title: "施術予約申請",
    subtitle: "ご希望の施術と日時をお選びください",
    memberTab: "会員予約",
    guestTab: "非会員予約",
    loginTitle: "ログインして予約",
    loginDesc: "会員予約は予約履歴の確認・管理が可能です。",
    loginBtn: "ログイン / 会員登録",
    guestBtn: "非会員として予約",
    guestNotice: "電話番号認証後に予約が可能です。予約内容はSMSでご案内します。",
    steps: { treatment: "施術選択", datetime: "日時選択", info: "情報入力", verify: "認証・予約" },
    treatmentCategory: "施術カテゴリー選択",
    treatmentItem: "施術項目選択",
    next: "次へ",
    back: "戻る",
    date: "ご希望の日付",
    time: "ご希望の時間",
    timeHint: "直接入力するか、下のボタンで選択してください",
    confirm: "予約内容確認",
    treatment: "施術",
    dateLabel: "日付",
    timeLabel: "時間",
    name: "お名前",
    namePlaceholder: "予約者のお名前",
    contact: "電話番号",
    contactPlaceholder: "010-0000-0000",
    contactHint: "予約確認SMSをお送りする番号を入力してください",
    notes: "ご要望",
    notesOptional: "（任意）",
    notesPlaceholder: "アレルギー、施術経験、特記事項など",
    submit: "予約申請完了",
    submitting: "申請中...",
    phoneVerify: "電話番号認証",
    sendOtp: "認証番号送信",
    resendOtp: "再送信",
    sending: "送信中...",
    otpInput: "認証番号入力",
    otpPlaceholder: "6桁の数字",
    otpHint: "認証番号が届かない場合は再送信ボタンを押してください",
    verify: "確認",
    verifying: "確認中...",
    verified: "電話番号認証完了",
    successTitle: "予約申請完了！",
    successDesc: "予約が受け付けられました。",
    successNotice: "携帯電話に受付確認SMSをお送りしました。",
    successDetail: "予約確定はスタッフ確認後、別途SMSでご案内します。",
    successDays: "（営業日1〜2日以内）",
    successContact: "お問い合わせ: +82-51-818-2300",
    viewHistory: "予約履歴を見る",
    goHome: "ホームへ",
  },
  zh: {
    badge: "在线预约",
    title: "申请治疗预约",
    subtitle: "请选择您希望的治疗项目和日期",
    memberTab: "会员预约",
    guestTab: "非会员预约",
    loginTitle: "登录后预约",
    loginDesc: "会员可以查看和管理预约记录。",
    loginBtn: "登录 / 注册",
    guestBtn: "以非会员身份预约",
    guestNotice: "需要手机号验证后才能预约。预约详情将通过短信通知。",
    steps: { treatment: "选择治疗", datetime: "选择日期", info: "填写信息", verify: "验证·预约" },
    treatmentCategory: "选择治疗类别",
    treatmentItem: "选择治疗项目",
    next: "下一步",
    back: "返回",
    date: "希望日期",
    time: "希望时间",
    timeHint: "直接输入或从下方按钮选择",
    confirm: "预约内容确认",
    treatment: "治疗项目",
    dateLabel: "日期",
    timeLabel: "时间",
    name: "姓名",
    namePlaceholder: "预约者姓名",
    contact: "联系电话",
    contactPlaceholder: "010-0000-0000",
    contactHint: "请输入接收预约确认短信的号码",
    notes: "特殊要求",
    notesOptional: "（选填）",
    notesPlaceholder: "过敏史、治疗经历、特殊情况等",
    submit: "完成预约申请",
    submitting: "申请中...",
    phoneVerify: "手机号验证",
    sendOtp: "发送验证码",
    resendOtp: "重新发送",
    sending: "发送中...",
    otpInput: "输入验证码",
    otpPlaceholder: "6位数字",
    otpHint: "未收到验证码？请点击重新发送",
    verify: "确认",
    verifying: "确认中...",
    verified: "手机号验证完成",
    successTitle: "预约申请完成！",
    successDesc: "您的预约已受理。",
    successNotice: "已向您的手机发送受理确认短信。",
    successDetail: "预约确认将在工作人员审核后通过短信另行通知。",
    successDays: "（工作日1-2天内）",
    successContact: "咨询: +82-51-818-2300",
    viewHistory: "查看预约记录",
    goHome: "返回首页",
  },
};

// ─── 시술 카테고리 ────────────────────────────────────────────────────────────
const TREATMENT_CATEGORIES = [
  { category: "Best 시술", items: ["세르프 리프팅 (XERF)", "울쎄라피 프라임", "써마지 FLX", "보톡스 (이마/눈가/사각턱)", "필러 (팔자/입술/볼륨)"] },
  { category: "리프팅·탄력", items: ["세르프 리프팅 (XERF)", "울쎄라피 프라임", "써마지 FLX", "인모드 FX", "실리프팅"] },
  { category: "눈밑지방", items: ["눈밑지방 재배치", "눈밑 필러", "눈밑 레이저 토닝"] },
  { category: "홍조·혈관확장", items: ["IPL 포토페이셜", "브이빔 레이저", "엑셀V 레이저"] },
  { category: "색소·문신제거", items: ["피코슈어 레이저", "루트로닉 레이저", "문신 제거"] },
  { category: "흉터치료", items: ["프락셀 레이저", "CO2 레이저", "흉터 필러"] },
  { category: "볼륨회복·스킨부스터", items: ["쥬베룩 볼륨", "리쥬란 힐러", "엑소좀 스킨부스터"] },
  { category: "보톡스·필러", items: ["보톡스 (이마/눈가/사각턱/종아리)", "필러 (팔자/입술/볼륨/코)", "실 리프팅"] },
  { category: "여드름·액취증·다한증·발톱무좀", items: ["여드름 레이저", "액취증 치료", "다한증 보톡스", "발톱무좀 레이저"] },
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

const today = new Date().toISOString().split('T')[0];

const inputCls = "w-full px-4 py-4 rounded-xl border-2 outline-none transition-colors";
const inputStyle = (hasValue: boolean): React.CSSProperties => ({
  borderColor: hasValue ? "#4A9FA5" : "#E5E7EB",
  fontSize: "16px",
  lineHeight: "1.5",
});

// ─── 예약 완료 화면 ───────────────────────────────────────────────────────────
function SuccessScreen({ treatmentName, selectedDate, selectedTime, isGuest, L }: {
  treatmentName: string; selectedDate: string; selectedTime: string; isGuest: boolean;
  L: typeof RESERVE_LABELS["ko"];
}) {
  const [, navigate] = useLocation();
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center bg-white rounded-2xl shadow-lg p-10 max-w-sm w-full">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#EEF7F7" }}>
          <CheckCircle size={40} style={{ color: "#4A9FA5" }} />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: "#0D2B4E" }}>{L.successTitle}</h2>
        <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
          <strong style={{ color: "#0D2B4E" }}>{treatmentName}</strong> {L.successDesc}
        </p>
        <div className="text-sm mb-4 p-3 rounded-xl" style={{ background: "#FFF8E7", border: "1px solid #F5D78E" }}>
          <p className="font-semibold mb-1" style={{ color: "#B8892A" }}>{L.successNotice}</p>
          <p style={{ color: "#6B7280" }}>{L.successDetail}</p>
          <p className="mt-1" style={{ color: "#9CA3AF" }}>{L.successDays}</p>
        </div>
        <p className="text-xs mb-6" style={{ color: "#9CA3AF" }}>{L.successContact}</p>
        <div className="flex gap-3">
          {!isGuest && (
            <button onClick={() => navigate("/mypage")} className="flex-1 py-3 rounded-xl font-semibold text-sm" style={{ background: "#EEF7F7", color: "#4A9FA5" }}>
              {L.viewHistory}
            </button>
          )}
          <button onClick={() => navigate("/")} className="flex-1 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: "#0D2B4E" }}>
            {L.goHome}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 진행 단계 표시 ───────────────────────────────────────────────────────────
function StepIndicator({ step, steps }: { step: number; steps: { label: string }[] }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: step > i ? "#4A9FA5" : step === i ? "#0D2B4E" : "#E5E7EB", color: step >= i ? "white" : "#9CA3AF" }}>
              {step > i ? "✓" : i + 1}
            </div>
            <span className="text-xs font-medium" style={{ color: step >= i ? "#0D2B4E" : "#9CA3AF" }}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <ChevronRight size={12} style={{ color: "#D1D5DB" }} />}
        </div>
      ))}
    </div>
  );
}

// ─── 시술 선택 단계 ───────────────────────────────────────────────────────────
function TreatmentStep({ selectedCategory, selectedTreatment, onCategoryChange, onTreatmentChange, onNext, L }: {
  selectedCategory: string; selectedTreatment: string;
  onCategoryChange: (v: string) => void; onTreatmentChange: (v: string) => void; onNext: () => void;
  L: typeof RESERVE_LABELS["ko"];
}) {
  const currentItems = TREATMENT_CATEGORIES.find(c => c.category === selectedCategory)?.items ?? [];
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
      <h2 className="font-bold text-lg mb-4" style={{ color: "#0D2B4E" }}>{L.treatmentCategory}</h2>
      <div className="grid grid-cols-1 gap-3 mb-6">
        {TREATMENT_CATEGORIES.map((cat) => (
          <button key={cat.category} onClick={() => { onCategoryChange(cat.category); onTreatmentChange(""); }}
            className="text-left px-4 py-4 rounded-xl border-2 transition-all text-sm font-medium active:scale-[0.98]"
            style={{ borderColor: selectedCategory === cat.category ? "#4A9FA5" : "#E5E7EB", background: selectedCategory === cat.category ? "#EEF7F7" : "white", color: selectedCategory === cat.category ? "#0D2B4E" : "#374151", minHeight: "52px" }}>
            {cat.category}
          </button>
        ))}
      </div>
      {selectedCategory && (
        <>
          <h2 className="font-bold text-lg mb-4" style={{ color: "#0D2B4E" }}>{L.treatmentItem}</h2>
          <div className="grid grid-cols-1 gap-3">
            {currentItems.map((item) => (
              <button key={item} onClick={() => onTreatmentChange(item)}
                className="text-left px-4 py-4 rounded-xl border-2 transition-all text-sm active:scale-[0.98]"
                style={{ borderColor: selectedTreatment === item ? "#4A9FA5" : "#E5E7EB", background: selectedTreatment === item ? "#EEF7F7" : "white", color: selectedTreatment === item ? "#0D2B4E" : "#374151", minHeight: "52px" }}>
                {item}
              </button>
            ))}
          </div>
        </>
      )}
      <button onClick={onNext} disabled={!selectedTreatment}
        className="w-full mt-6 py-4 rounded-xl font-semibold text-white transition-opacity disabled:opacity-40 text-base"
        style={{ background: "#4A9FA5", minHeight: "56px" }}>
        {L.next}
      </button>
    </div>
  );
}

// ─── 날짜/시간 선택 단계 ──────────────────────────────────────────────────────
function DateTimeStep({ selectedCategory, selectedTreatment, selectedDate, selectedTime, onDateChange, onTimeChange, onNext, onBack, L }: {
  selectedCategory: string; selectedTreatment: string;
  selectedDate: string; selectedTime: string;
  onDateChange: (v: string) => void; onTimeChange: (v: string) => void;
  onNext: () => void; onBack: () => void;
  L: typeof RESERVE_LABELS["ko"];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#EEF7F7", color: "#4A9FA5" }}>{selectedCategory}</span>
      </div>
      <h2 className="font-bold text-lg mb-5" style={{ color: "#0D2B4E" }}>{selectedTreatment}</h2>
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: "#374151" }}>
          <Calendar size={15} style={{ color: "#4A9FA5" }} /> {L.date}
        </label>
        <input type="date" min={today} value={selectedDate} onChange={e => onDateChange(e.target.value)}
          className={inputCls} style={inputStyle(!!selectedDate)} />
        {selectedDate && (
          <p className="text-xs mt-2 font-medium" style={{ color: "#4A9FA5" }}>
            {new Date(selectedDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
          </p>
        )}
      </div>
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: "#374151" }}>
          <Clock size={15} style={{ color: "#4A9FA5" }} /> {L.time}
        </label>
        <div className="mb-3 sm:hidden">
          <input type="time" value={selectedTime} onChange={e => onTimeChange(e.target.value)} min="09:00" max="17:30"
            className={inputCls} style={inputStyle(!!selectedTime)} />
          <p className="text-xs mt-1.5" style={{ color: "#9CA3AF" }}>{L.timeHint}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((time) => (
            <button key={time} onClick={() => onTimeChange(time)}
              className="py-3 rounded-xl text-sm font-medium border-2 transition-all active:scale-95"
              style={{ borderColor: selectedTime === time ? "#4A9FA5" : "#E5E7EB", background: selectedTime === time ? "#4A9FA5" : "white", color: selectedTime === time ? "white" : "#374151", minHeight: "48px" }}>
              {time}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-xl font-semibold text-sm" style={{ background: "#F3F4F6", color: "#374151", minHeight: "56px" }}>{L.back}</button>
        <button onClick={onNext} disabled={!selectedDate || !selectedTime}
          className="flex-1 py-4 rounded-xl font-semibold text-white transition-opacity disabled:opacity-40 text-base"
          style={{ background: "#4A9FA5", minHeight: "56px" }}>
          {L.next}
        </button>
      </div>
    </div>
  );
}

// ─── 회원 정보 입력 단계 ──────────────────────────────────────────────────────
function MemberInfoStep({ selectedTreatment, selectedDate, selectedTime, patientName, phone, notes, onNameChange, onPhoneChange, onNotesChange, onSubmit, onBack, isPending, L }: {
  selectedTreatment: string; selectedDate: string; selectedTime: string;
  patientName: string; phone: string; notes: string;
  onNameChange: (v: string) => void; onPhoneChange: (v: string) => void; onNotesChange: (v: string) => void;
  onSubmit: () => void; onBack: () => void; isPending: boolean;
  L: typeof RESERVE_LABELS["ko"];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="rounded-xl p-4 mb-6" style={{ background: "#F0F9F9" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "#4A9FA5" }}>{L.confirm}</p>
        <div className="space-y-2 text-sm" style={{ color: "#374151" }}>
          <div className="flex justify-between"><span className="text-gray-500">{L.treatment}</span><span className="font-semibold">{selectedTreatment}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{L.dateLabel}</span><span className="font-semibold">{new Date(selectedDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{L.timeLabel}</span><span className="font-semibold">{selectedTime}</span></div>
        </div>
      </div>
      <div className="space-y-5 mb-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-2.5" style={{ color: "#374151" }}>
            <User size={14} style={{ color: "#4A9FA5" }} /> {L.name}
          </label>
          <input type="text" placeholder={L.namePlaceholder} value={patientName} onChange={e => onNameChange(e.target.value)}
            autoComplete="name" className={inputCls} style={inputStyle(!!patientName)} />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-2.5" style={{ color: "#374151" }}>
            <Phone size={14} style={{ color: "#4A9FA5" }} /> {L.contact}
          </label>
          <input type="tel" placeholder={L.contactPlaceholder} value={phone} onChange={e => onPhoneChange(e.target.value)}
            autoComplete="tel" inputMode="tel" className={inputCls} style={inputStyle(!!phone)} />
          <p className="text-xs mt-1.5" style={{ color: "#9CA3AF" }}>{L.contactHint}</p>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-2.5" style={{ color: "#374151" }}>
            <FileText size={14} style={{ color: "#4A9FA5" }} /> {L.notes} <span className="font-normal text-gray-500">{L.notesOptional}</span>
          </label>
          <textarea placeholder={L.notesPlaceholder} value={notes} onChange={e => onNotesChange(e.target.value)}
            rows={3} className={`${inputCls} resize-none`} style={{ ...inputStyle(!!notes), lineHeight: "1.6" }} />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-xl font-semibold text-sm" style={{ background: "#F3F4F6", color: "#374151", minHeight: "56px" }}>{L.back}</button>
        <button onClick={onSubmit} disabled={isPending}
          className="flex-1 py-4 rounded-xl font-semibold text-white transition-opacity disabled:opacity-60 text-base"
          style={{ background: "#0D2B4E", minHeight: "56px" }}>
          {isPending ? L.submitting : L.submit}
        </button>
      </div>
    </div>
  );
}

// ─── 비회원 OTP 인증 + 정보 입력 단계 ────────────────────────────────────────
function GuestInfoStep({ selectedTreatment, selectedDate, selectedTime, onBack, onSuccess, L }: {
  selectedTreatment: string; selectedDate: string; selectedTime: string;
  onBack: () => void; onSuccess: () => void;
  L: typeof RESERVE_LABELS["ko"];
}) {
  const [guestPhone, setGuestPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [notes, setNotes] = useState("");
  const [countdown, setCountdown] = useState(0);

  const sendOtp = trpc.reservation.sendOtp.useMutation({
    onSuccess: () => {
      setOtpSent(true);
      setOtpCode("");
      toast.success(L.sendOtp + " ✓");
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
      }, 1000);
    },
    onError: (err) => toast.error(err.message),
  });

  const verifyOtp = trpc.reservation.verifyOtp.useMutation({
    onSuccess: () => { setOtpVerified(true); toast.success(L.verified + " ✓"); },
    onError: (err) => toast.error(err.message),
  });

  const createGuest = trpc.reservation.createGuest.useMutation({
    onSuccess: onSuccess,
    onError: (err) => toast.error(err.message),
  });

  const handleSendOtp = () => {
    const phone = guestPhone.replace(/-/g, "").trim();
    if (phone.length < 9) { toast.error(L.contactPlaceholder); return; }
    sendOtp.mutate({ phone });
  };

  const handleVerifyOtp = () => {
    if (otpCode.length !== 6) { toast.error(L.otpPlaceholder); return; }
    verifyOtp.mutate({ phone: guestPhone.replace(/-/g, "").trim(), code: otpCode });
  };

  const handleSubmit = () => {
    if (!guestName.trim()) { toast.error(L.namePlaceholder); return; }
    createGuest.mutate({
      patientName: guestName.trim(),
      phone: guestPhone.replace(/-/g, "").trim(),
      otpCode,
      treatmentCategory: TREATMENT_CATEGORIES.find(c => c.items.includes(selectedTreatment))?.category ?? "",
      treatmentName: selectedTreatment,
      preferredDate: new Date(selectedDate).getTime(),
      preferredTime: selectedTime,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
      {/* 예약 내용 요약 */}
      <div className="rounded-xl p-4 mb-6" style={{ background: "#F0F9F9" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "#4A9FA5" }}>{L.confirm}</p>
        <div className="space-y-2 text-sm" style={{ color: "#374151" }}>
          <div className="flex justify-between"><span className="text-gray-500">{L.treatment}</span><span className="font-semibold">{selectedTreatment}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{L.dateLabel}</span><span className="font-semibold">{new Date(selectedDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{L.timeLabel}</span><span className="font-semibold">{selectedTime}</span></div>
        </div>
      </div>

      {/* 전화번호 입력 + OTP 발송 */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-sm font-semibold mb-2.5" style={{ color: "#374151" }}>
          <Phone size={14} style={{ color: "#4A9FA5" }} /> {L.phoneVerify}
        </label>
        <div className="flex gap-2">
          <input type="tel" placeholder={L.contactPlaceholder} value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
            disabled={otpVerified} inputMode="tel" autoComplete="tel"
            className={`flex-1 px-4 py-4 rounded-xl border-2 outline-none transition-colors`}
            style={{ ...inputStyle(!!guestPhone), opacity: otpVerified ? 0.6 : 1 }} />
          <button onClick={handleSendOtp} disabled={sendOtp.isPending || countdown > 0 || otpVerified}
            className="px-4 py-4 rounded-xl font-semibold text-sm text-white whitespace-nowrap disabled:opacity-50"
            style={{ background: "#4A9FA5", minWidth: "90px" }}>
            {sendOtp.isPending ? L.sending : countdown > 0 ? `${countdown}s` : otpSent ? L.resendOtp : L.sendOtp}
          </button>
        </div>
      </div>

      {/* OTP 입력 */}
      {otpSent && !otpVerified && (
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm font-semibold mb-2.5" style={{ color: "#374151" }}>
            <ShieldCheck size={14} style={{ color: "#4A9FA5" }} /> {L.otpInput}
          </label>
          <div className="flex gap-2">
            <input type="text" placeholder={L.otpPlaceholder} value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric" maxLength={6}
              className="flex-1 px-4 py-4 rounded-xl border-2 outline-none transition-colors text-center tracking-[0.3em] font-bold text-lg"
              style={{ borderColor: otpCode.length === 6 ? "#4A9FA5" : "#E5E7EB", fontSize: "18px" }} />
            <button onClick={handleVerifyOtp} disabled={verifyOtp.isPending || otpCode.length !== 6}
              className="px-4 py-4 rounded-xl font-semibold text-sm text-white disabled:opacity-50"
              style={{ background: "#0D2B4E", minWidth: "80px" }}>
              {verifyOtp.isPending ? L.verifying : L.verify}
            </button>
          </div>
          <p className="text-xs mt-1.5" style={{ color: "#9CA3AF" }}>{L.otpHint}</p>
        </div>
      )}

      {/* 인증 완료 표시 */}
      {otpVerified && (
        <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl" style={{ background: "#EEF7F7" }}>
          <CheckCircle size={16} style={{ color: "#4A9FA5" }} />
          <span className="text-sm font-semibold" style={{ color: "#4A9FA5" }}>{L.verified}</span>
          <span className="text-xs ml-auto" style={{ color: "#9CA3AF" }}>{guestPhone}</span>
        </div>
      )}

      {/* 이름 + 요청사항 (인증 완료 후) */}
      {otpVerified && (
        <div className="space-y-5 mb-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2.5" style={{ color: "#374151" }}>
              <User size={14} style={{ color: "#4A9FA5" }} /> {L.name}
            </label>
            <input type="text" placeholder={L.namePlaceholder} value={guestName} onChange={e => setGuestName(e.target.value)}
              autoComplete="name" className={inputCls} style={inputStyle(!!guestName)} />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2.5" style={{ color: "#374151" }}>
              <FileText size={14} style={{ color: "#4A9FA5" }} /> {L.notes} <span className="font-normal text-gray-500">{L.notesOptional}</span>
            </label>
            <textarea placeholder={L.notesPlaceholder} value={notes} onChange={e => setNotes(e.target.value)}
              rows={3} className={`${inputCls} resize-none`} style={{ ...inputStyle(!!notes), lineHeight: "1.6" }} />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-xl font-semibold text-sm" style={{ background: "#F3F4F6", color: "#374151", minHeight: "56px" }}>{L.back}</button>
        {otpVerified && (
          <button onClick={handleSubmit} disabled={createGuest.isPending || !guestName.trim()}
            className="flex-1 py-4 rounded-xl font-semibold text-white transition-opacity disabled:opacity-60 text-base"
            style={{ background: "#0D2B4E", minHeight: "56px" }}>
            {createGuest.isPending ? L.submitting : L.submit}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── 메인 예약 페이지 ─────────────────────────────────────────────────────────
export default function Reserve() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const { lang } = useLang();

  // 다국어 레이블 (ko/en/ja/zh 지원)
  const L = RESERVE_LABELS[lang as keyof typeof RESERVE_LABELS] ?? RESERVE_LABELS.ko;

  // 회원/비회원 모드
  const [mode, setMode] = useState<"member" | "guest">("member");

  // 공통 예약 상태
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 회원 전용 상태
  const [patientName, setPatientName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const createReservation = trpc.reservation.create.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => toast.error(err.message),
  });

  const handleMemberSubmit = () => {
    if (!patientName.trim()) { toast.error(L.namePlaceholder); return; }
    if (!phone.trim()) { toast.error(L.contactPlaceholder); return; }
    createReservation.mutate({
      patientName: patientName.trim(),
      phone: phone.trim(),
      treatmentCategory: selectedCategory,
      treatmentName: selectedTreatment,
      preferredDate: new Date(selectedDate).getTime(),
      preferredTime: selectedTime,
      notes: notes.trim() || undefined,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#4A9FA5" }} />
      </div>
    );
  }

  const memberSteps = [{ label: L.steps.treatment }, { label: L.steps.datetime }, { label: L.steps.info }];
  const guestSteps = [{ label: L.steps.treatment }, { label: L.steps.datetime }, { label: L.steps.verify }];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
      {/*
       * NOTE: This page is NOT ROUTED in App.tsx (legacy since PR-27).
       * noindex={true} prevents accidental search engine indexing if this
       * component were ever rendered.
       * canonical is intentionally omitted (PR-39): not-routed + noindex page
       * does not need a canonical signal. noindex-only is sufficient.
       * Active reservation entry points:
       *   ko => /#reservation  |  en => /en#reservation
       *   ja => /ja#reservation  |  zh => /zh#reservation
       */}
      <SeoHead
        title="시술 예약 | 부산 서면 스타피부과"
        description="부산 서면 스타피부과 온라인 예약. 원하는 시술을 선택하고 날짜와 시간을 선택하세요. 회원/비회원 모두 예약 가능."
        keywords="스타피부과 예약, 서면피부과 예약, 부산피부과 온라인 예약, 스타피부과 시술 예약"
        noindex={true}
        ogLocale="ko_KR"
      />
      <Header />

      <div className="flex-1 pt-24 pb-24 px-4 sm:pb-16">
        <div className="max-w-2xl mx-auto">

          {submitted ? (
            <SuccessScreen
              treatmentName={selectedTreatment}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              isGuest={mode === "guest"}
              L={L}
            />
          ) : (
            <>
              {/* 헤더 */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3" style={{ background: "#EEF7F7", color: "#4A9FA5" }}>
                  <Calendar size={14} /> {L.badge}
                </div>
                <h1 className="text-2xl font-bold" style={{ color: "#0D2B4E" }}>{L.title}</h1>
                <p className="text-sm mt-2" style={{ color: "#6B7280" }}>{L.subtitle}</p>
              </div>

              {/* 회원/비회원 탭 */}
              <div className="flex rounded-2xl p-1 mb-6" style={{ background: "#E5E7EB" }}>
                <button
                  onClick={() => { setMode("member"); setStep(0); setSelectedCategory(""); setSelectedTreatment(""); setSelectedDate(""); setSelectedTime(""); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: mode === "member" ? "white" : "transparent", color: mode === "member" ? "#0D2B4E" : "#6B7280", boxShadow: mode === "member" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                  <LogIn size={15} />
                  {L.memberTab}
                </button>
                <button
                  onClick={() => { setMode("guest"); setStep(0); setSelectedCategory(""); setSelectedTreatment(""); setSelectedDate(""); setSelectedTime(""); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: mode === "guest" ? "white" : "transparent", color: mode === "guest" ? "#0D2B4E" : "#6B7280", boxShadow: mode === "guest" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                  <MessageSquare size={15} />
                  {L.guestTab}
                </button>
              </div>

              {/* 회원 탭: 비로그인 안내 */}
              {mode === "member" && !isAuthenticated && (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#EEF7F7" }}>
                    <User size={28} style={{ color: "#4A9FA5" }} />
                  </div>
                  <h2 className="text-lg font-bold mb-2" style={{ color: "#0D2B4E" }}>{L.loginTitle}</h2>
                  <p className="text-sm mb-6" style={{ color: "#6B7280" }}>{L.loginDesc}</p>
                  <div className="flex flex-col gap-3">
                    <a href={getLoginUrl()} className="block w-full py-3.5 rounded-xl font-semibold text-white text-center text-sm" style={{ background: "#0D2B4E" }}>
                      {L.loginBtn}
                    </a>
                    <button onClick={() => setMode("guest")} className="w-full py-3.5 rounded-xl font-semibold text-sm" style={{ background: "#EEF7F7", color: "#4A9FA5" }}>
                      {L.guestBtn}
                    </button>
                  </div>
                </div>
              )}

              {/* 회원 탭: 로그인 상태 */}
              {mode === "member" && isAuthenticated && (
                <>
                  <StepIndicator step={step} steps={memberSteps} />
                  {step === 0 && (
                    <TreatmentStep
                      selectedCategory={selectedCategory} selectedTreatment={selectedTreatment}
                      onCategoryChange={setSelectedCategory} onTreatmentChange={setSelectedTreatment}
                      onNext={() => setStep(1)} L={L} />
                  )}
                  {step === 1 && (
                    <DateTimeStep
                      selectedCategory={selectedCategory} selectedTreatment={selectedTreatment}
                      selectedDate={selectedDate} selectedTime={selectedTime}
                      onDateChange={setSelectedDate} onTimeChange={setSelectedTime}
                      onNext={() => setStep(2)} onBack={() => setStep(0)} L={L} />
                  )}
                  {step === 2 && (
                    <MemberInfoStep
                      selectedTreatment={selectedTreatment} selectedDate={selectedDate} selectedTime={selectedTime}
                      patientName={patientName} phone={phone} notes={notes}
                      onNameChange={setPatientName} onPhoneChange={setPhone} onNotesChange={setNotes}
                      onSubmit={handleMemberSubmit} onBack={() => setStep(1)} isPending={createReservation.isPending} L={L} />
                  )}
                </>
              )}

              {/* 비회원 탭 */}
              {mode === "guest" && (
                <>
                  <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: "#FFF8E7", border: "1px solid #F5D78E" }}>
                    <ShieldCheck size={15} style={{ color: "#B8892A" }} />
                    <span style={{ color: "#B8892A" }}>{L.guestNotice}</span>
                  </div>
                  <StepIndicator step={step} steps={guestSteps} />
                  {step === 0 && (
                    <TreatmentStep
                      selectedCategory={selectedCategory} selectedTreatment={selectedTreatment}
                      onCategoryChange={setSelectedCategory} onTreatmentChange={setSelectedTreatment}
                      onNext={() => setStep(1)} L={L} />
                  )}
                  {step === 1 && (
                    <DateTimeStep
                      selectedCategory={selectedCategory} selectedTreatment={selectedTreatment}
                      selectedDate={selectedDate} selectedTime={selectedTime}
                      onDateChange={setSelectedDate} onTimeChange={setSelectedTime}
                      onNext={() => setStep(2)} onBack={() => setStep(0)} L={L} />
                  )}
                  {step === 2 && (
                    <GuestInfoStep
                      selectedTreatment={selectedTreatment} selectedDate={selectedDate} selectedTime={selectedTime}
                      onBack={() => setStep(1)} onSuccess={() => setSubmitted(true)} L={L} />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

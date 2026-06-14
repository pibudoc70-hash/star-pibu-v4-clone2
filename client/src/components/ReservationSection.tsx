/**
 * ReservationSection - 홈페이지 예약 섹션
 * 고객이 예약을 신청할 수 있는 섹션
 */
import { useState } from "react";
import ReservationForm from "./ReservationForm";
import { Calendar, CheckCircle } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export default function ReservationSection() {
  const { t, lang } = useLang();
  const r = t.reservation;
  const [showSuccess, setShowSuccess] = useState(false);

  // 예약 안내 텍스트 (언어별)
  const infoItems = lang === 'ko' ? [
    { title: "빠른 응답", description: "예약 신청 후 1시간 내에 전화로 연락드립니다.", icon: "⚡" },
    { title: "유연한 일정", description: "원하시는 날짜와 시간을 선택하실 수 있습니다.", icon: "📅" },
    { title: "전문가 상담", description: "피부 상태에 맞는 최적의 시술을 추천해드립니다.", icon: "👨‍⚕️" },
  ] : lang === 'en' ? [
    { title: "Quick Response", description: "We will contact you by phone within 1 hour of your request.", icon: "⚡" },
    { title: "Flexible Schedule", description: "Choose your preferred date and time.", icon: "📅" },
    { title: "Expert Consultation", description: "We recommend the best treatment for your skin condition.", icon: "👨‍⚕️" },
  ] : lang === 'ja' ? [
    { title: "迅速な対応", description: "予約申請後1時間以内にお電話でご連絡いたします。", icon: "⚡" },
    { title: "柔軟なスケジュール", description: "ご希望の日時をお選びいただけます。", icon: "📅" },
    { title: "専門家カウンセリング", description: "お肌の状態に合わせた最適な施術をご提案します。", icon: "👨‍⚕️" },
  ] : [
    { title: "快速响应", description: "预约申请后1小时内电话联系您。", icon: "⚡" },
    { title: "灵活安排", description: "可选择您方便的日期和时间。", icon: "📅" },
    { title: "专家咨询", description: "根据您的皮肤状况推荐最适合的治疗方案。", icon: "👨‍⚕️" },
  ];

  return (
    <section
      id="reservation"
      className="py-20 px-4"
      style={{ background: "var(--brand-bg, #FAF8F5)", position: "relative" }}
    >
      {/* 상단 구분선 */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(196,168,130,0.3), transparent)"
      }} />

      <div className="max-w-4xl mx-auto">
        {/* 섹션 제목 */}
        <div className="text-center mb-12">
          <span className="section-eyebrow">ONLINE RESERVATION</span>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calendar size={22} style={{ color: "var(--brand-gold, #C4A882)" }} />
            <h2 className="section-title" style={{ margin: 0 }}>{r.sectionTitle}</h2>
          </div>
          <p className="section-subtitle" style={{ maxWidth: "480px", margin: "0 auto" }}>
            {r.sectionSubtitle}
          </p>
        </div>

        {/* 예약 폼 또는 성공 메시지 */}
        <div
          className="rounded-2xl p-4 sm:p-8 md:p-10"
          style={{
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(196,168,130,0.10), 0 0 0 1px rgba(196,168,130,0.12)",
          }}
        >
          {showSuccess ? (
            <div className="text-center py-10">
              {/* 성공 아이콘 */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(196,168,130,0.12)", border: "1px solid rgba(196,168,130,0.3)" }}
                >
                  <CheckCircle size={32} style={{ color: "var(--brand-gold, #C4A882)" }} />
                </div>
              </div>
              <h3
                className="text-2xl font-medium mb-3"
                style={{ color: "var(--brand-text, #2C2C2C)", fontFamily: "'Noto Serif KR', 'Cormorant Garamond', serif", fontWeight: 400 }}
              >
                {lang === 'ko' ? '예약 신청이 완료되었습니다' : lang === 'en' ? 'Reservation Request Submitted' : lang === 'ja' ? '予約申請が完了しました' : '预约申请已提交'}
              </h3>
              <p style={{ color: "var(--brand-text-mid, #666666)", marginBottom: "1rem", wordBreak: "keep-all" }}>
                {lang === 'ko' ? '예약 신청이 완료되었습니다. 빠른 시간 내에 전화로 연락드리겠습니다.' : lang === 'en' ? 'Your reservation request has been submitted. We will contact you by phone shortly.' : lang === 'ja' ? '予約申請が完了しました。早急にお電話でご連絡いたします。' : '预约申请已提交。我们将尽快致电联系您。'}
              </p>
              {/* 예약 안내 박스 — 브랜드 골드 톤 */}
              <div
                className="rounded-xl p-4 mb-6 text-left"
                style={{
                  background: "rgba(196,168,130,0.07)",
                  border: "1px solid rgba(196,168,130,0.22)",
                }}
              >
                <p
                  className="text-sm font-normal mb-2"
                  style={{ color: "var(--brand-gold-deep, #A8895E)" }}
                >
                  {lang === 'ko' ? '예약 안내' : lang === 'en' ? 'Booking Guide' : lang === 'ja' ? '予約のご案内' : '预约说明'}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--brand-text-mid, #666666)", wordBreak: "keep-all" }}>
                  {lang === 'ko' ? (
                    <>현재 상태는 <span className="font-normal" style={{ color: "var(--brand-text, #2C2C2C)" }}>예약 신청</span>입니다. 병원 관리자가 확인 후 예약이 <span className="font-normal" style={{ color: "var(--brand-gold-deep, #A8895E)" }}>확정</span>됩니다. 확정 여부는 전화로 안내드리겠습니다.</>
                  ) : lang === 'en' ? (
                    <>Your status is currently <span className="font-normal" style={{ color: "var(--brand-text, #2C2C2C)" }}>Pending</span>. Once confirmed by our staff, your reservation will be <span className="font-normal" style={{ color: "var(--brand-gold-deep, #A8895E)" }}>confirmed</span>. We will notify you by phone.</>
                  ) : lang === 'ja' ? (
                    <>現在の状態は<span className="font-normal" style={{ color: "var(--brand-text, #2C2C2C)" }}>予約申請中</span>です。スタッフが確認後、予約が<span className="font-normal" style={{ color: "var(--brand-gold-deep, #A8895E)" }}>確定</span>されます。電話でご連絡いたします。</>
                  ) : (
                    <>当前状态为<span className="font-normal" style={{ color: "var(--brand-text, #2C2C2C)" }}>待确认</span>。工作人员确认后，预约将<span className="font-normal" style={{ color: "var(--brand-gold-deep, #A8895E)" }}>确定</span>。我们将致电通知您。</>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSuccess(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3 rounded-lg font-normal text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, var(--brand-gold, #C4A882) 0%, var(--brand-gold-dark, #9a7a3a) 100%)",
                  boxShadow: "0 4px 16px rgba(196,168,130,0.35)",
                  minHeight: "44px",
                }}
              >
                {lang === 'ko' ? '처음으로 돌아가기' : lang === 'en' ? 'Back to Top' : lang === 'ja' ? 'トップへ戻る' : '返回首页'}
              </button>
            </div>
          ) : (
            <ReservationForm
              onSuccess={() => {
                setShowSuccess(true);
              }}
            />
          )}
        </div>

        {/* 예약 안내 3개 항목 */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoItems.map((item, idx) => (
            <div
              key={idx}
              className="text-center p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "var(--brand-bg-alt, #F5F0EB)",
                border: "1px solid rgba(196,168,130,0.15)",
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4
                className="font-normal mb-2"
                style={{ color: "var(--brand-text, #2C2C2C)", fontSize: "0.9375rem" }}
              >
                {item.title}
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--brand-text-mid, #666666)", wordBreak: "keep-all" }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

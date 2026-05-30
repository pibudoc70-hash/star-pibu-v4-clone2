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
    <section id="reservation" className="py-20 px-4" style={{ background: "#F8FAFC" }}>
      <div className="max-w-4xl mx-auto">
        {/* 섹션 제목 */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar size={24} style={{ color: "#4A6FA5" }} />
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937]">{r.sectionTitle}</h2>
          </div>
          <p className="text-lg text-[#6B7280]">
            {r.sectionSubtitle}
          </p>
        </div>

        {/* 예약 폼 또는 성공 메시지 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-[#E5E7EB]">
          {showSuccess ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#D1FAE5" }}>
                  <CheckCircle size={32} style={{ color: "#059669" }} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-4">
                {lang === 'ko' ? '예약 신청이 완료되었습니다!' : lang === 'en' ? 'Reservation Request Submitted!' : lang === 'ja' ? '予約申請が完了しました！' : '预约申请已提交！'}
              </h3>
              <p className="text-[#6B7280] mb-4">
                {lang === 'ko' ? '예약 신청이 완료되었습니다. 빠른 시간 내에 전화로 연락드리겠습니다.' : lang === 'en' ? 'Your reservation request has been submitted. We will contact you by phone shortly.' : lang === 'ja' ? '予約申請が完了しました。早急にお電話でご連絡いたします。' : '预约申请已提交。我们将尽快致电联系您。'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-[#1F2937] font-semibold mb-2">
                  {lang === 'ko' ? '📋 예약 안내' : lang === 'en' ? '📋 Booking Guide' : lang === 'ja' ? '📋 予約のご案内' : '📋 预约说明'}
                </p>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {lang === 'ko' ? (
                    <>현재 상태는 <span className="font-semibold text-[#1F2937]">예약 신청</span>입니다. 병원 관리자가 확인 후 예약이 <span className="font-semibold text-[#059669]">확정</span>됩니다. 확정 여부는 전화로 안내드리겠습니다.</>
                  ) : lang === 'en' ? (
                    <>Your status is currently <span className="font-semibold text-[#1F2937]">Pending</span>. Once confirmed by our staff, your reservation will be <span className="font-semibold text-[#059669]">confirmed</span>. We will notify you by phone.</>
                  ) : lang === 'ja' ? (
                    <>現在の状態は<span className="font-semibold text-[#1F2937]">予約申請中</span>です。スタッフが確認後、予約が<span className="font-semibold text-[#059669]">確定</span>されます。電話でご連絡いたします。</>
                  ) : (
                    <>当前状态为<span className="font-semibold text-[#1F2937]">待确认</span>。工作人员确认后，预约将<span className="font-semibold text-[#059669]">确定</span>。我们将致电通知您。</>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "#4A6FA5" }}
              >
                {lang === 'ko' ? '예약 안내 확인' : lang === 'en' ? 'View Booking Guide' : lang === 'ja' ? '予約案内を確認' : '查看预约说明'}
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

        {/* 예약 안내 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoItems.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-[#1F2937] mb-2">{item.title}</h4>
              <p className="text-sm text-[#6B7280]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * ReservationSection - 홈페이지 예약 섹션
 * 고객이 예약을 신청할 수 있는 섹션
 */
import { useState } from "react";
import ReservationForm from "./ReservationForm";
import { Calendar, CheckCircle } from "lucide-react";

export default function ReservationSection() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <section id="reservation" className="py-20 px-4" style={{ background: "#F8FAFC" }}>
      <div className="max-w-4xl mx-auto">
        {/* 섹션 제목 */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar size={24} style={{ color: "#4A6FA5" }} />
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937]">예약 신청</h2>
          </div>
          <p className="text-lg text-[#6B7280]">
            편한 시간에 예약하세요. 곧 연락드리겠습니다.
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
              <h3 className="text-2xl font-bold text-[#1F2937] mb-4">예약 신청이 완료되었습니다!</h3>
              <p className="text-[#6B7280] mb-4">
                예약 신청이 완료되었습니다. 빠른 시간 내에 전화로 연락드리겠습니다.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-[#1F2937] font-semibold mb-2">📋 예약 안내</p>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  현재 상태는 <span className="font-semibold text-[#1F2937]">예약 신청</span>입니다. 병원 관리자가 확인 후 예약이 <span className="font-semibold text-[#059669]">확정</span>됩니다. 확정 여부는 전화로 안내드리겠습니다.
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
                예약 안내 확인
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
          {[
            {
              title: "빠른 응답",
              description: "예약 신청 후 1시간 내에 전화로 연락드립니다.",
              icon: "⚡",
            },
            {
              title: "유연한 일정",
              description: "원하시는 날짜와 시간을 선택하실 수 있습니다.",
              icon: "📅",
            },
            {
              title: "전문가 상담",
              description: "피부 상태에 맞는 최적의 시술을 추천해드립니다.",
              icon: "👨‍⚕️",
            },
          ].map((item, idx) => (
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

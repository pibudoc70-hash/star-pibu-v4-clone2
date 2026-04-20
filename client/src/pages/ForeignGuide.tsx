import { Globe, Phone, MessageCircle, Calendar } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useLang } from "@/contexts/useLang";

const KAKAO_URL = "https://pf.kakao.com/_xkxnxmxj";
const NAVER_URL = "https://booking.naver.com/booking/13/bizes/1166145";
const PHONE = "051-818-2300";

export default function ForeignGuide() {
  const { t } = useLang();

  return (
    <MainLayout>
      <div className="pt-24 pb-16 min-h-screen bg-[var(--star-bg-section)]">
        <div className="container max-w-3xl">
          <div className="mb-10">
            <p className="section-label mb-2">FOREIGN PATIENT GUIDE</p>
            <h1 className="text-3xl md:text-4xl font-black text-[#1a2744]">외국인 환자 안내</h1>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Globe size={20} className="text-[#c9a96e]" />
                <h2 className="font-black text-[#1a2744] text-lg">다국어 상담 서비스</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                스타피부과는 한국어·영어·일본어·중국어 상담이 가능합니다. 외국인 환자분들도 편안하게 진료를 받으실 수 있도록 전담 코디네이터가 도와드립니다.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["한국어", "English", "日本語", "中文"].map((lang) => (
                  <div key={lang} className="text-center py-3 bg-[var(--star-bg-section)] rounded-xl text-sm font-semibold text-[#1a2744]">
                    {lang}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-[#1a2744] text-lg mb-4">예약 및 방문 안내</h2>
              <ol className="space-y-3">
                {[
                  "카카오톡 또는 네이버를 통해 사전 예약",
                  "방문 시 여권 지참 필요",
                  "전담 코디네이터와 1:1 상담",
                  "피부과 전문의 진료 및 시술",
                  "사후 관리 안내 제공",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-[#1a2744] text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-[#0d1b2a] rounded-2xl p-6 text-center">
              <p className="text-white font-bold mb-1">Contact Us</p>
              <p className="text-white/50 text-sm mb-4">We speak your language</p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={`tel:${PHONE}`} className="flex items-center gap-2 px-4 py-2.5 border border-white/30 text-white text-sm font-semibold rounded-full hover:bg-white/10 transition-colors">
                  <Phone size={14} /> {PHONE}
                </a>
                <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FEE500] text-[#3A1D1D] text-sm font-bold rounded-full">
                  <MessageCircle size={14} /> KakaoTalk
                </a>
                <a href={NAVER_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#03C75A] text-white text-sm font-bold rounded-full">
                  <Calendar size={14} /> Naver Booking
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

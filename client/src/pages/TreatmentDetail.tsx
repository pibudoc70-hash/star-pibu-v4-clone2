import { useParams, useLocation } from "wouter";
import { ArrowLeft, Phone, MessageCircle, Calendar, Clock, CheckCircle } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useLang } from "@/contexts/useLang";

const KAKAO_URL = "https://pf.kakao.com/_xkxnxmxj";
const NAVER_URL = "https://booking.naver.com/booking/13/bizes/1166145";
const PHONE = "051-818-2300";

const treatmentData: Record<string, {
  name: string;
  category: string;
  desc: string;
  features: string[];
  duration: string;
  recovery: string;
  color: string;
}> = {
  "ulthermage": {
    name: "울써마지 리프팅",
    category: "리프팅·탄력",
    desc: "울쎄라피+써마지 복합 리프팅에 피부 재생 리쥬란을 더한 프리미엄 프로그램입니다. 리프팅의 끝판왕이라 불리는 울써마지 복합 리프팅으로 탁월한 효과를 경험하세요.",
    features: ["울쎄라피+써마지 복합 시술", "피부 재생 리쥬란 추가", "피부과 전문의 직접 시술", "개인별 맞춤 파라미터"],
    duration: "90~120분",
    recovery: "당일 일상 복귀",
    color: "#1a2744",
  },
  "ultherapy-prime": {
    name: "울쎄라피 프라임",
    category: "리프팅·탄력",
    desc: "기존 울쎄라보다 한 단계 업그레이드된 울쎄라피 프라임입니다. 더 정밀한 초음파 기술과 선명한 이미징으로 개인별 맞춤 리프팅이 가능합니다.",
    features: ["차세대 초음파 리프팅", "정밀 이미징 기술", "개인별 맞춤 시술", "향상된 효과·낮은 부작용"],
    duration: "60~90분",
    recovery: "당일 일상 복귀",
    color: "#2d4a7b",
  },
  "thermage-flx": {
    name: "써마지 FLX",
    category: "리프팅·탄력",
    desc: "4세대 고주파 리프팅의 정점. 피부 깊은 층 콜라겐을 자극해 탄력 개선과 주름 완화에 탁월합니다. 조시형 원장 공식 자문의로 최적의 파라미터 노하우를 보유합니다.",
    features: ["4세대 고주파 리프팅", "콜라겐 재생 촉진", "조시형 원장 공식 자문의", "탄력·주름 개선"],
    duration: "45~90분",
    recovery: "당일 일상 복귀",
    color: "#1e3a5f",
  },
  "profound-rf": {
    name: "프로파운드 RF 리프팅",
    category: "리프팅·탄력",
    desc: "마이크로니들 RF로 진피층에 직접 에너지를 전달하는 고효과 리프팅 시술입니다. 1회 시술로 강력한 탄력 개선을 원하는 분께 권장합니다.",
    features: ["마이크로니들 RF 기술", "진피층 직접 에너지 전달", "1회 시술 고효과", "강력한 탄력 개선"],
    duration: "60~90분",
    recovery: "10일",
    color: "#3a5a8a",
  },
  "stem-cell": {
    name: "줄기세포 치료",
    category: "재생·특수",
    desc: "자신의 혈액·지방에서 추출한 줄기세포를 피부에 직접 주사하는 자가세포 치료입니다. 이상반응 위험이 낮고 피부 재생·탄력 개선 효과를 기대할 수 있습니다.",
    features: ["자가세포 치료", "혈액·지방 추출 줄기세포", "낮은 이상반응 위험", "피부 재생·탄력 개선"],
    duration: "60~120분",
    recovery: "개인별 상이",
    color: "#1a4a3a",
  },
  "eyebag-repositioning": {
    name: "눈밑지방재배치",
    category: "눈밑지방",
    desc: "수술 없이 레이저로 눈밑 지방을 개선하는 스타피부과 대표 시술입니다. 4,000건 이상의 시술 경험으로 안전하고 자연스러운 결과를 제공합니다.",
    features: ["비수술 레이저 시술", "4,000건+ 시술 경험", "자연스러운 결과", "빠른 회복"],
    duration: "30~60분",
    recovery: "3~7일",
    color: "#5a3a7a",
  },
  "cerf": {
    name: "세르프 리프팅",
    category: "리프팅·탄력",
    desc: "고강도 집속 RF 에너지를 피부 깊은 층에 전달하여 콜라겐 재생을 촉진하는 차세대 리프팅 장비입니다. 절개 없이 자연스러운 리프팅 효과를 제공합니다.",
    features: ["고강도 집속 RF", "비침습적 리프팅", "콜라겐 재생 촉진", "당일 일상 복귀"],
    duration: "30~60분",
    recovery: "당일 일상 복귀",
    color: "#4a6a2a",
  },
  "melasma": {
    name: "기미 치료 프로그램",
    category: "색소·문신",
    desc: "엑셀V+의 혈관 선택성 레이저와 엔라이튼3의 피코초 레이저를 복합한 기미 전문 프로그램입니다.",
    features: ["Excel V+ 혈관 레이저", "엔라이튼3 피코초 레이저", "복합 기미 치료", "피부 톤 개선"],
    duration: "30~60분",
    recovery: "3~5일",
    color: "#6a3a2a",
  },
  "rosacea": {
    name: "홍조 치료 프로그램",
    category: "홍조·혈관",
    desc: "Excel V+·ADVATX 듀얼 레이저로 안면홍조·모세혈관 확장을 전문 치료합니다.",
    features: ["Excel V+ 레이저", "ADVATX 레이저", "듀얼 레이저 치료", "안면홍조 개선"],
    duration: "30~60분",
    recovery: "3~5일",
    color: "#7a2a2a",
  },
};

export default function TreatmentDetail() {
  const { name } = useParams<{ name: string }>();
  const [, navigate] = useLocation();
  const { t } = useLang();

  const treatment = treatmentData[name || ""] || {
    name: name || "시술 안내",
    category: "시술",
    desc: "해당 시술에 대한 자세한 안내는 상담을 통해 확인하실 수 있습니다.",
    features: ["피부과 전문의 직접 시술", "개인별 맞춤 상담", "안전한 시술 환경"],
    duration: "상담 후 결정",
    recovery: "개인별 상이",
    color: "#1a2744",
  };

  return (
    <MainLayout>
      <div className="pt-24 pb-16 min-h-screen bg-[var(--star-bg-section)]">
        <div className="container max-w-3xl">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#1a2744] mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> 홈으로
          </button>

          {/* 시술 헤더 */}
          <div
            className="rounded-2xl p-8 mb-6 text-white"
            style={{ background: `linear-gradient(135deg, ${treatment.color}, ${treatment.color}cc)` }}
          >
            <p className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-widest">
              {treatment.category}
            </p>
            <h1 className="text-2xl md:text-3xl font-black mb-3">{treatment.name}</h1>
            <div className="flex gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1"><Clock size={11} /> 시술 시간: {treatment.duration}</span>
              <span className="flex items-center gap-1"><CheckCircle size={11} /> 회복 기간: {treatment.recovery}</span>
            </div>
          </div>

          {/* 시술 설명 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <h2 className="text-lg font-black text-[#1a2744] mb-4">시술 소개</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{treatment.desc}</p>

            <h3 className="text-base font-bold text-[#1a2744] mb-3">주요 특징</h3>
            <ul className="space-y-2">
              {treatment.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={15} className="text-[#c9a96e] mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-[#0d1b2a] rounded-2xl p-6 text-center">
            <p className="text-white font-bold mb-1">시술 상담 문의</p>
            <p className="text-white/50 text-sm mb-4">피부과 전문의와 1:1 맞춤 상담을 받아보세요</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`tel:${PHONE}`}
                className="flex items-center gap-2 px-4 py-2.5 border border-white/30 text-white text-sm font-semibold rounded-full hover:bg-white/10 transition-colors">
                <Phone size={14} /> {PHONE}
              </a>
              <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FEE500] text-[#3A1D1D] text-sm font-bold rounded-full hover:bg-[#FFD700] transition-colors">
                <MessageCircle size={14} /> {t.cta.kakao}
              </a>
              <a href={NAVER_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#03C75A] text-white text-sm font-bold rounded-full hover:bg-[#02b050] transition-colors">
                <Calendar size={14} /> {t.cta.naver}
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

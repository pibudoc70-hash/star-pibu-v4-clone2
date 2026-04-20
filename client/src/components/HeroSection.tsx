import { Phone, MessageCircle, Calendar, ChevronDown } from "lucide-react";
import { useLang } from "@/contexts/useLang";

const KAKAO_URL = "https://pf.kakao.com/_xkxnxmxj";
const NAVER_URL = "https://booking.naver.com/booking/13/bizes/1166145";
const PHONE = "051-818-2300";

export default function HeroSection() {
  const { t } = useLang();

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, rgba(13,27,42,0.85) 0%, rgba(13,27,42,0.7) 60%, rgba(13,27,42,0.9) 100%), url('https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-bg-new-desktop.jpg') center/cover no-repeat`
      }}
    >
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#c9a96e]/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-[#4ecdc4]/5 blur-3xl" />
        {/* 별 장식 */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-2xl">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/30 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-pulse" />
            <span className="text-[#c9a96e] text-xs font-semibold tracking-widest uppercase">
              STAR Dermatologic Clinic
            </span>
          </div>

          {/* 타이틀 */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-4 fade-in-up">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-light mb-8 fade-in-up" style={{ animationDelay: "0.1s" }}>
            {t.hero.subtitle}
          </p>

          {/* 통계 */}
          <div className="flex flex-wrap gap-6 mb-10 fade-in-up" style={{ animationDelay: "0.2s" }}>
            {t.hero.stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-[#c9a96e]">{stat.num}</span>
                <span className="text-xs text-white/50 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-wrap gap-3 fade-in-up" style={{ animationDelay: "0.3s" }}>
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              <Phone size={16} />
              {t.hero.cta_call}
            </a>
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FEE500] text-[#3A1D1D] text-sm font-bold hover:bg-[#FFD700] transition-all"
            >
              <MessageCircle size={16} />
              {t.hero.cta_kakao}
            </a>
            <a
              href={NAVER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#03C75A] text-white text-sm font-bold hover:bg-[#02b050] transition-all"
            >
              <Calendar size={16} />
              {t.hero.cta_reserve}
            </a>
          </div>

          {/* 위치 정보 */}
          <p className="mt-6 text-xs text-white/40 fade-in-up" style={{ animationDelay: "0.4s" }}>
            📍 {t.hero.floor}
          </p>
        </div>
      </div>

      {/* 스크롤 다운 버튼 */}
      <button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors"
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
}

/**
 * ResultsSection - 시술 결과 & 통계
 * 디자인: 프리미엄 스타일 - 그래디언트 배경, 입체 카드, 인터랙티브 요소
 */
// [FM-P2-3] React.memo: 부모 리렌더 시 불필요한 재렌더 방지 (통계 카드 카운팅 애니메이션 보호)
import { memo } from "react";
import { CheckCircle, TrendingUp, Users, Star, Award, Sparkles, Heart, Shield } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { useLang } from "@/contexts/LangContext";

const statIcons = [Award, Star, TrendingUp, Users];
const statColors = ["#4A6FA5", "#81C7C9", "#4A6FA5", "#81C7C9"];
const statBgs = ["#EEF3FA", "#EEF7F7", "#EEF3FA", "#EEF7F7"];
const whyIcons = [Shield, Heart, Sparkles];
const whyColors = ["#4A6FA5", "#81C7C9", "#4A6FA5"];
const treatmentAccents = ["#4A6FA5", "#81C7C9", "#4A6FA5", "#81C7C9", "#4A6FA5", "#81C7C9"];
const treatmentBgs = ["#EEF3FA", "#EEF7F7", "#EEF3FA", "#EEF7F7", "#EEF3FA", "#EEF7F7"];

function ResultsSection() {
  const sectionRef = useSectionReveal(60) // [FM-P1-7] 100 → 60;
  const { t } = useLang();
  const r = t.results;

  // 카운팅 애니메이션 적용
  const { value: countValue1 } = useCountUp("20", 2000, "년+");
  const { value: countValue2 } = useCountUp("98", 2000, "%");
  const { value: countValue3 } = useCountUp("5", 2000, "만+");

  const countValues = [countValue1, countValue2, countValue3, "1:1"];

  return (
    <section ref={sectionRef} id="results" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-teal-50 rounded-full opacity-30 -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal-50 to-blue-50 rounded-full opacity-20 -ml-40 -mb-40 blur-3xl" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 reveal-heading">
          <p
            className="font-montserrat font-semibold text-sm tracking-widest mb-3 inline-block px-4 py-2 rounded-full"
            style={{ color: "#81C7C9", backgroundColor: "rgba(129, 199, 201, 0.1)" }}
          >
            ✨ RESULTS & STATISTICS
          </p>
          <h2
            className="mb-4"
            style={{ color: "#1F2937", fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 900, letterSpacing: "-0.5px" }}
          >
            {r.sectionTitle}
          </h2>
          <div className="star-divider mx-auto mb-6" />
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "#6B7280", lineHeight: 1.6 }}>
            {r.sectionSubtitle}
          </p>
        </div>

        {/* 선택 이유 3가지 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {r.whyItems.map((item, i) => {
            const Icon = whyIcons[i];
            const color = whyColors[i];
            return (
              <div
                key={i}
                className="reveal-card group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-white"
                style={{
                  transitionDelay: `${i * 0.1}s`,
                  borderColor: `${color}20`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={32} style={{ color }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#1F2937" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                  {item.desc}
                </p>
                <div
                  className="mt-4 h-1 w-12 rounded-full group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: color }}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {r.stats.map((s, i) => {
            const Icon = statIcons[i];
            const color = statColors[i];
            const bg = statBgs[i];
            return (
              <div
                key={i}
                className="reveal-card group relative rounded-2xl p-6 sm:p-8 text-center overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-default"
                style={{
                  background: bg,
                  transitionDelay: `${i * 0.1}s`,
                  border: `1px solid ${color}22`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${color}08 0%, ${color}04 100%)` }}
                />
                <div className="relative z-10">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `${color}18` }}
                  >
                    <Icon size={24} style={{ color }} />
                  </div>
                  <div
                    className="font-montserrat font-bold mb-2 group-hover:scale-105 transition-transform duration-300"
                    style={{ fontSize: "clamp(1.8rem, 5vw, 2.4rem)", color }}
                  >
                    {countValues[i]}
                  </div>
                  <div className="font-semibold text-sm mb-1" style={{ color: "#1F2937" }}>
                    {s.label}
                  </div>
                  <div className="text-xs" style={{ color: "#9CA3AF" }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Treatment Results Grid */}
        <div className="mb-12">
          <h3
            className="text-center font-bold mb-10"
            style={{ color: "#1F2937", fontSize: "clamp(1.3rem, 4vw, 1.6rem)" }}
          >
            {r.treatmentResultsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {r.treatmentResults.map((tr, i) => {
              const accentColor = treatmentAccents[i % treatmentAccents.length];
              const bgColor = treatmentBgs[i % treatmentBgs.length];
              const isHighlight = i === 0;
              return (
                <div
                  key={i}
                  className="reveal-card group rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    transitionDelay: `${i * 0.08}s`,
                    background: bgColor,
                    border: isHighlight ? `2px solid ${accentColor}` : `1px solid ${accentColor}22`,
                  }}
                >
                  <div
                    className="px-6 py-5"
                    style={{ borderBottom: `1px solid ${accentColor}22` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-base" style={{ color: "#1F2937" }}>
                        {tr.treatment}
                      </h4>
                      {isHighlight && (
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full text-white flex items-center gap-1"
                          style={{ background: accentColor }}
                        >
                          <Sparkles size={12} /> 인기
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold" style={{ color: accentColor }}>
                      ⏱️ {tr.period}
                    </p>
                  </div>
                  <div className="px-6 py-5">
                    <ul className="space-y-3">
                      {tr.improvements.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "#374151" }}>
                          <CheckCircle
                            size={16}
                            style={{ color: accentColor, flexShrink: 0, marginTop: "2px" }}
                          />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notices */}
        <div
          className="rounded-2xl p-6 sm:p-8 border-2"
          style={{ background: "#F0F9FF", borderColor: "#0EA5E9" }}
        >
          <div className="flex gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#0EA5E9" }}
            >
              <CheckCircle size={20} style={{ color: "white" }} />
            </div>
            <span className="font-bold text-base" style={{ color: "#0C4A6E" }}>
              {r.disclaimer}
            </span>
          </div>
          <ul className="space-y-3 text-sm sm:text-base" style={{ color: "#0369A1" }}>
            {r.notices.map((notice, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span style={{ color: "#0EA5E9", fontWeight: "bold" }}>•</span>
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// [FM-P2-3] memo: 언어 컨텍스트 변경 외 리렌더 차단
export default memo(ResultsSection);

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
import { useClinicStats } from "@/hooks/useClinicStats";
import { STAR_COLORS } from "../../../shared/colors";

const statIcons = [Award, Star, TrendingUp, Users];
const { dark, gray, muted } = STAR_COLORS;
/* 브랜드 웜 뉴트럴 컬러 시스템 */
const brandGold = 'var(--color-gold-primary)';
const brandGoldPale = '#F0EAE0';
const brandGoldDeep = '#A8895E';
const brandBg = '#FAF8F5';
const brandBgAlt = '#F5F0EB';
const statColors = [brandGold, brandGoldDeep, brandGold, brandGoldDeep];
const statBgs = [brandBgAlt, brandBg, brandBgAlt, brandBg];
const whyIcons = [Shield, Heart, Sparkles];
const whyColors = [brandGold, brandGoldDeep, brandGold];
const treatmentAccents = [brandGold, brandGoldDeep, brandGold, brandGoldDeep, brandGold, brandGoldDeep];
const treatmentBgs = [brandBgAlt, brandBg, brandBgAlt, brandBg, brandBgAlt, brandBg];

function ResultsSection() {
  const sectionRef = useSectionReveal(60) // [FM-P1-7] 100 → 60;
  const { t, lang } = useLang();
  const r = t.results;
  // [STATS-P1-1] CLINIC_STATS 하드코딩 제거 → useClinicStats 연동
  const clinicStats = useClinicStats();

  // 카운팅 애니메이션 적용
  const { value: countValue1 } = useCountUp(clinicStats.years.value, 2000, clinicStats.years.unit, 0, undefined, lang);
  const { value: countValue2 } = useCountUp(clinicStats.satisfaction.value, 2000, clinicStats.satisfaction.unit, 0, undefined, lang);
  const { value: countValue3 } = useCountUp(clinicStats.cases.value, 2000, clinicStats.cases.unit, 0, undefined, lang);

  const countValues = [countValue1, countValue2, countValue3, `1:${clinicStats.ratio.value}`];

  return (
    <section ref={sectionRef} id="results" className="py-20 sm:py-28 relative overflow-hidden" style={{ background: '#FAF8F5' }}>
      {/* 배경 장식 — 절제된 웜 글로우 */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 -mr-48 -mt-48 blur-3xl" style={{ background: 'radial-gradient(ellipse, #F0EAE0, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 -ml-40 -mb-40 blur-3xl" style={{ background: 'radial-gradient(ellipse, #EDE8E0, transparent)' }} />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 reveal-heading">
          <span className="section-eyebrow">RESULTS &amp; STATISTICS</span>
          <h2 className="section-title">
            {r.sectionTitle}
          </h2>
          <p className="section-subtitle">
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
                className="reveal-card group p-8 rounded-2xl transition-all duration-300"
                style={{
                  transitionDelay: `${i * 0.1}s`,
                  background: '#FFFFFF',
                  border: `1px solid color-mix(in srgb, var(--color-gold-primary) 18%, transparent)`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: brandGoldPale }}
                >
                  <Icon size={28} style={{ color: brandGoldDeep }} />
                </div>
                <h3 className="text-base font-normal mb-2" style={{ color: dark, fontFamily: "'Noto Serif KR', 'Cormorant Garamond', serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: gray }}>
                  {item.desc}
                </p>
                <div
                  className="mt-5 h-px w-10 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: `color-mix(in srgb, var(--color-gold-primary) 40%, transparent)` }}
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
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300"
                    style={{ background: brandGoldPale }}
                  >
                    <Icon size={22} style={{ color: brandGoldDeep }} />
                  </div>
                  <div
                    className="font-montserrat font-normal mb-2 group-hover:scale-105 transition-transform duration-300"
                    style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.2rem)", color: brandGoldDeep }}
                  >
                    {countValues[i]}
                  </div>
                  <div className="font-normal text-sm mb-1" style={{ color: dark }}>
                    {s.label}
                  </div>
                  <div className="text-xs" style={{ color: muted }}>
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
            className="text-center font-medium mb-10"
            style={{ color: dark, fontSize: "clamp(1.3rem, 4vw, 1.6rem)" }}
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
                      <h4 className="font-normal text-base" style={{ color: dark, fontFamily: "'Noto Serif KR', 'Cormorant Garamond', serif" }}>
                        {tr.treatment}
                      </h4>
                      {isHighlight && (
                        <span
                          className="text-xs font-normal px-3 py-1 rounded-full flex items-center gap-1"
                          style={{ background: brandGoldPale, color: brandGoldDeep }}
                        >
                          <Sparkles size={11} /> 인기
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-normal" style={{ color: accentColor }}>
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
          className="rounded-xl p-6 sm:p-8"
          style={{ background: '#F5F0EB', border: '1px solid color-mix(in srgb, var(--color-gold-primary) 20%, transparent)' }}
        >
          <div className="flex gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: brandGoldPale }}
            >
              <CheckCircle size={18} style={{ color: brandGoldDeep }} />
            </div>
            <span className="font-normal text-sm" style={{ color: '#2C2C2C' }}>
              {r.disclaimer}
            </span>
          </div>
          <ul className="space-y-2.5 text-sm" style={{ color: '#666666' }}>
            {r.notices.map((notice, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span style={{ color: brandGold, fontWeight: 'bold', flexShrink: 0 }}>·</span>
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

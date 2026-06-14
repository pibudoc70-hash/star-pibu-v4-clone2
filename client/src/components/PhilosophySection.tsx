/**
 * PhilosophySection - STAR 피부과 철학 소개
 * [Premium Redesign] 다크/라이트 교차 섹션 패턴 도입
 * - 상단: 다크 배경 + 에디토리얼 통계 인터루드
 * - 하단: 라이트 배경 + 2컬럼 브랜드 서사
 */
import { ScanEye, Award, Cpu } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useClinicStats } from "@/hooks/useClinicStats";

const NEW_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/patient-consultation-mobile_e2474e05.jpg";
const PATIENT_IMAGE_MOBILE_JPG = NEW_IMAGE;
const PATIENT_IMAGE_MOBILE_WEBP = NEW_IMAGE;
const PATIENT_IMAGE_TABLET_WEBP = NEW_IMAGE;
const PATIENT_IMAGE_TABLET_JPG = NEW_IMAGE;
const PATIENT_IMAGE_DESKTOP_WEBP = NEW_IMAGE;
const PATIENT_IMAGE_DESKTOP_JPG = NEW_IMAGE;

const statIcons = [Award, ScanEye, Cpu];

export default function PhilosophySection() {
  const { t, lang } = useLang();
  const stats = useClinicStats();
  const leftRef = useScrollReveal<HTMLDivElement>();
  const rightRef = useScrollReveal<HTMLDivElement>();
  const statsRef = useScrollReveal<HTMLDivElement>();

  return (
    <>
      {/* ── 다크 인터루드 — 신뢰지표 에디토리얼 스트립 ── */}
      <div
        ref={statsRef}
        className="reveal"
        style={{
          background: "linear-gradient(135deg, #1a1410 0%, #2a1f14 50%, #1a1410 100%)",
          padding: "clamp(3rem, 8vw, 5rem) 0",
        }}
      >
        <div className="container">
          <p
            className="text-center font-montserrat mb-8 sm:mb-12"
            style={{
              color: "rgba(196,168,130,0.7)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            TRUSTED BY PATIENTS SINCE 2006
          </p>
          <div className="grid grid-cols-3 gap-0">
            {[
              { num: stats.years.value, suffix: stats.years.unit, label: t.about.stats[0].label, Icon: Award },
              { num: stats.cases.value, suffix: stats.cases.unit, label: t.about.stats[1].label, Icon: ScanEye },
              { num: stats.types.value, suffix: stats.types.unit, label: t.about.stats[2].label, Icon: Cpu },
            ].map((s, idx) => (
              <div
                key={s.label}
                className="text-center flex flex-col items-center"
                style={{
                  padding: "clamp(1rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1.5rem)",
                  borderRight: idx < 2 ? "1px solid rgba(196,168,130,0.15)" : "none",
                }}
              >
                <s.Icon
                  size={20}
                  style={{ color: "rgba(196,168,130,0.5)", marginBottom: "0.75rem" }}
                  strokeWidth={1.2}
                />
                <div className="philosophy-stat-num" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
                  {s.num}
                  <span style={{ fontSize: "55%", fontWeight: 300, opacity: 0.75, letterSpacing: "0.02em" }}>
                    {s.suffix}
                  </span>
                </div>
                <div className="philosophy-stat-label">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 라이트 섹션 — 브랜드 서사 + 이미지 ── */}
      <section id="about" className="py-16 sm:py-24 overflow-hidden" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">

            {/* Left: Text */}
            <div ref={leftRef} className="reveal-left">
              <span className="section-eyebrow">OUR PHILOSOPHY</span>
              <h2 className="section-title mb-4">
                {t.about.title}
              </h2>
              <p className="section-eyebrow mb-3" style={{ letterSpacing: "0.18em" }}>
                20년의 안목, 한결같은 신뢰
              </p>
              <p className="section-subtitle leading-relaxed mb-10" style={{ maxWidth: "none", textAlign: "left", fontSize: "0.95rem", lineHeight: 1.85 }}>
                {t.about.desc}
              </p>

              {/* S.T.A.R. Values — 에디토리얼 리스트 스타일 */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {t.about.values.map((v) => (
                  <div
                    key={v.letter}
                    className="philosophy-value-card flex items-start gap-3 cursor-default"
                  >
                    <div className="min-w-0">
                      <div
                        className="font-montserrat font-bold mb-1 flex items-baseline gap-0"
                      >
                        <span style={{ color: "var(--brand-gold, #C4A882)", fontSize: "clamp(14px, 4vw, 18px)", fontWeight: 700, lineHeight: 1 }}>
                          {v.title[0]}
                        </span>
                        <span style={{ color: "var(--brand-text-mid, #666666)", fontSize: "clamp(11px, 3vw, 14px)", fontWeight: 300 }}>
                          {v.title.slice(1)}
                        </span>
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: "var(--brand-text-mid, #666666)", lineHeight: 1.6 }}>
                        {v.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image */}
            <div
              ref={rightRef}
              className="hidden lg:block reveal-right relative overflow-hidden"
              style={{ transitionDelay: "0.15s" }}
            >
              <div className="relative">
                {/* Since 2006 오버레이 배지 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "24px",
                    left: "24px",
                    zIndex: 20,
                    background: "rgba(26,20,16,0.75)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(196,168,130,0.3)",
                    borderRadius: "8px",
                    padding: "10px 16px",
                  }}
                >
                  <p
                    style={{
                      color: "rgba(196,168,130,0.9)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      fontFamily: "Montserrat, sans-serif",
                      marginBottom: "2px",
                    }}
                  >
                    ESTABLISHED
                  </p>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      color: "#EDD98A",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    2006
                  </p>
                </div>
                <picture>
                  <source media="(min-width: 1024px)" srcSet={PATIENT_IMAGE_DESKTOP_WEBP} type="image/webp" />
                  <source media="(min-width: 1024px)" srcSet={PATIENT_IMAGE_DESKTOP_JPG} />
                  <source media="(min-width: 768px)" srcSet={PATIENT_IMAGE_TABLET_WEBP} type="image/webp" />
                  <source media="(min-width: 768px)" srcSet={PATIENT_IMAGE_TABLET_JPG} />
                  <source srcSet={PATIENT_IMAGE_MOBILE_WEBP} type="image/webp" />
                  <img
                    src={PATIENT_IMAGE_MOBILE_JPG}
                    alt={t.about.consultationAlt}
                    className="relative z-10 w-full object-cover"
                    style={{
                      height: "560px",
                      objectPosition: "center top",
                      borderRadius: "16px",
                      marginTop: "55px",
                      boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

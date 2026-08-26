/**
 * PhilosophySection - STAR 피부과 철학 소개
 * [Premium Redesign] 다크/라이트 교차 섹션 패턴 도입
 * - 상단: 다크 배경 + 에디토리얼 통계 인터루드
 * - 하단: 라이트 배경 + 2컬럼 브랜드 서사
 */
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

const NEW_IMAGE = "/manus-storage/patient-consultation-mobile_e2474e05_fb420943_2114c946.webp";
const PATIENT_IMAGE_MOBILE_JPG = NEW_IMAGE;
const PATIENT_IMAGE_MOBILE_WEBP = NEW_IMAGE;
const PATIENT_IMAGE_TABLET_WEBP = NEW_IMAGE;
const PATIENT_IMAGE_TABLET_JPG = NEW_IMAGE;
const PATIENT_IMAGE_DESKTOP_WEBP = NEW_IMAGE;
const PATIENT_IMAGE_DESKTOP_JPG = NEW_IMAGE;

export default function PhilosophySection() {
  const { t, lang } = useLang();
  const leftRef = useScrollReveal<HTMLDivElement>();
  const rightRef = useScrollReveal<HTMLDivElement>();

  return (
    <>
      {/* ── 라이트 섹션 — 브랜드 서사 + 이미지 ── */}
      <section id="about" className="py-16 sm:py-24 overflow-hidden" aria-label="클리닉 철학 및 소개">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">

            {/* Left: Text */}
            <div ref={leftRef} className="reveal-left">
              <span className="section-eyebrow">{t.about.sectionLabels?.philosophy ?? "OUR PHILOSOPHY"}</span>
              <h2 className="section-title mb-4">
                {t.about.title}
              </h2>
              <p className="section-eyebrow mb-3" style={{ letterSpacing: "0.18em" }}>
                {t.about.philosophyTagline ?? "20년의 안목, 한결같은 신뢰"}
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
                        className="font-montserrat font-normal mb-1 flex items-baseline gap-0"
                      >
                        <span style={{ color: "var(--color-gold-primary)", fontSize: "clamp(14px, 4vw, 18px)", fontWeight: 400, lineHeight: 1 }}>
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
                    border: "1px solid color-mix(in srgb, var(--color-gold-primary) 30%, transparent)",
                    borderRadius: "8px",
                    padding: "10px 16px",
                  }}
                >
                  <p
                    style={{
                      color: "color-mix(in srgb, var(--color-gold-primary) 90%, transparent)",
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
                      fontFamily: "'Montserrat', 'Noto Sans KR', sans-serif",
                      fontSize: "1.6rem",
                      fontWeight: 400,
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

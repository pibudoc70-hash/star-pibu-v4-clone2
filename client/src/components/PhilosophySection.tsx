/**
 * PhilosophySection - STAR 피부과 철학 소개
 * [Premium Redesign] 다크/라이트 교차 섹션 패턴 도입
 * - 상단: 다크 배경 + 에디토리얼 통계 인터루드
 * - 하단: 라이트 배경 + 2컬럼 브랜드 서사
 */
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

const NEW_IMAGE = "/manus-storage/patient-consultation-mobile_e2474e05_fb420943_2114c946-opt-q78_fbcc2b8c.webp";
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
  const starValuesCopy = {
    ko: { label: "STAR VALUES", summary: "스타피부과가 지키는 네 가지 약속" },
    en: { label: "STAR VALUES", summary: "Four promises that define STAR Dermatology" },
    ja: { label: "STAR VALUES", summary: "スター皮膚科が大切にする4つの約束" },
    zh: { label: "STAR VALUES", summary: "STAR皮肤科坚持的四项承诺" },
    "zh-TW": { label: "STAR VALUES", summary: "STAR皮膚科堅持的四項承諾" },
  }[lang] ?? { label: "STAR VALUES", summary: "스타피부과가 지키는 네 가지 약속" };

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
              <p className="section-subtitle body-text leading-relaxed mb-10" style={{ maxWidth: "none", textAlign: "left", fontSize: "0.95rem", lineHeight: 1.85 }}>
                {t.about.desc}
              </p>

              {/* S.T.A.R. Values — 브랜드 이니셜을 병원의 네 가지 약속으로 연결 */}
              <div className="mt-8" aria-labelledby="star-values-heading">
                <div className="mb-4 flex items-baseline gap-3">
                  <span
                    id="star-values-heading"
                    className="font-montserrat text-[10px] font-medium tracking-[0.25em]"
                    style={{ color: "var(--color-gold-primary)" }}
                  >
                    {starValuesCopy.label}
                  </span>
                  <span className="text-xs sm:text-sm" style={{ color: "var(--brand-text-mid, #666666)" }}>
                    {starValuesCopy.summary}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {t.about.values.map((v) => (
                  <article
                    key={v.letter}
                    aria-label={`${v.letter} — ${v.title}`}
                    className="philosophy-value-card flex items-start gap-3 cursor-default"
                  >
                    <span
                      data-testid="star-value-letter"
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-montserrat text-sm font-medium"
                      style={{
                        color: "var(--color-gold-primary)",
                        background: "color-mix(in srgb, var(--color-gold-primary) 10%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--color-gold-primary) 30%, transparent)",
                      }}
                    >
                      {v.letter}
                    </span>
                    <div className="min-w-0">
                      <p className="font-montserrat mb-1 text-[11px] font-normal sm:text-sm" style={{ color: "var(--brand-text-mid, #666666)" }}>
                        {v.title}
                      </p>
                      <div className="text-xs leading-relaxed" style={{ color: "var(--brand-text-mid, #666666)", lineHeight: 1.6 }}>
                        {v.desc}
                      </div>
                    </div>
                  </article>
                ))}
                </div>
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

/**
 * PhilosophySection - STAR 피부과 철학 소개
 * 디자인: 2컬럼 (텍스트 좌측 + 이미지 우측), S.T.A.R. 아크로님 카드
 * 배경: 흰색
 */
import { ScanEye, Award, Cpu } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

const NEW_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/patient-consultation-mobile_e2474e05.jpg";
const PATIENT_IMAGE_MOBILE_JPG = NEW_IMAGE;
const PATIENT_IMAGE_MOBILE_WEBP = NEW_IMAGE;
const PATIENT_IMAGE_TABLET_WEBP = NEW_IMAGE;
const PATIENT_IMAGE_TABLET_JPG = NEW_IMAGE;
const PATIENT_IMAGE_DESKTOP_WEBP = NEW_IMAGE;
const PATIENT_IMAGE_DESKTOP_JPG = NEW_IMAGE;

// 통계 픽토그램 아이콘 (순서: 피부과전문의 경력, 눈밑지방재배치, 레이저 장비)
// Award = 전문의 경력, ScanEye(눈 모양) = 눈밑 시술, Cpu = 첨단 장비
const statIcons = [Award, ScanEye, Cpu];

// starValues is now sourced from i18n t.about.values

export default function PhilosophySection() {
  const { t } = useLang();
  const leftRef = useScrollReveal<HTMLDivElement>();
  const rightRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left: Text */}
          <div ref={leftRef} className="reveal-left">
            <p
              className="font-montserrat text-sm tracking-widest mb-3"
              style={{ color: '#d2ac67', fontWeight: 100 }}
            >
              {t.about.label}
            </p>
            <h2
              className="mb-2 leading-tight"
              style={{ color: "#1F2937", fontSize: "clamp(1.5rem, 5vw, 2.8rem)", fontWeight: 800 }}
            >
              {t.about.title}
            </h2>
            <p
              className="mb-6 font-montserrat"
              style={{ color: "#d2ac67", fontSize: "clamp(1rem, 3vw, 1.6rem)", letterSpacing: "0.05em", fontWeight: 500 }}
            >
              STAR DERMATOLOGY
            </p>
            <p className="leading-relaxed mb-8" style={{ color: "#6B7280", fontSize: '15px', fontWeight: '400' }}>
              {t.about.desc}
            </p>

            {/* Stats - 픽토그램 포함 */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
              {[
                { num: t.about.stats[0].num, label: t.about.stats[0].label },
                { num: t.about.stats[1].num, label: t.about.stats[1].label },
                { num: t.about.stats[2].num, label: t.about.stats[2].label },
              ].map((s, idx) => {
                const Icon = statIcons[idx];
                const numMain = s.num.replace(/(례\+|회\+|년\+|대\+|종\+|\+)$/, '');
                const numSuffix = s.num.match(/(례\+|회\+|년\+|대\+|종\+|\+)$/)?.[0] ?? '';
                return (
                  <div
                    key={s.label}
                    className="text-center p-2 sm:p-4 flex flex-col items-center justify-center"
                    style={{ backgroundColor: '#f6efe0', borderRadius: '10px', height: '133px' }}
                  >
                    {/* 픽토그램 - 눈 모양(ScanEye) 포함 24px */}
                    <div className="flex justify-center mb-1 sm:mb-2">
                      <Icon size={24} style={{ color: '#d1ab67', opacity: 0.85 }} strokeWidth={1.5} />
                    </div>
                    <div
                      className="font-montserrat font-extrabold text-lg sm:text-2xl mb-1"
                      style={{ color: '#d1ab67' }}
                    >
                      {numMain}
                      <span style={{ fontSize: '70%', fontWeight: 400, opacity: 0.8 }}>
                        {numSuffix}
                      </span>
                    </div>
                    <div className="leading-tight" style={{ color: "#6B7280", fontSize: 'clamp(10px, 2.5vw, 13px)', wordBreak: 'keep-all' }}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* S.T.A.R. Values - 골드 왼쪽 보더 라인, 글자 2배 크게 */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {t.about.values.map((v) => (
                <div
                  key={v.letter}
                  className="flex items-start gap-3 p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                  style={{
                    borderLeft: '2px solid #d2ac6740',
                    background: 'transparent',
                    paddingRight: '16px',
                  }}
                >
                  <div className="min-w-0">
                    <div
                      className="font-montserrat font-bold mb-0.5 flex items-baseline gap-0"
                      style={{ marginTop: '-9px' }}
                    >
                      {/* 첫 대문자: 골드, 20% 크게 */}
                      <span style={{ color: '#d2ac67', fontSize: 'clamp(14px, 4vw, 19.2px)', fontWeight: 700, lineHeight: 1 }}>
                        {v.title[0]}
                      </span>
                      {/* 나머지 소문자: 그레이 */}
                      <span style={{ color: '#9CA3AF', fontSize: 'clamp(12px, 3.2vw, 16px)', fontWeight: 300 }}>
                        {v.title.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs leading-relaxed mt-1" style={{ color: "#9CA3AF" }}>
                      {v.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image - 모바일에서 숨김 */}
          <div
            ref={rightRef}
            className="hidden lg:block reveal-right relative overflow-hidden"
            style={{ transitionDelay: "0.15s" }}
          >
            <div className="relative">
              {/* Since 2006 오버레이 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  zIndex: 20,
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textShadow: '0 1px 6px rgba(0,0,0,0.55)',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Since 2006
              </div>
              <picture>
                <source media="(min-width: 1024px)" srcSet={PATIENT_IMAGE_DESKTOP_WEBP} type="image/webp" />
                <source media="(min-width: 1024px)" srcSet={PATIENT_IMAGE_DESKTOP_JPG} />
                <source media="(min-width: 768px)" srcSet={PATIENT_IMAGE_TABLET_WEBP} type="image/webp" />
                <source media="(min-width: 768px)" srcSet={PATIENT_IMAGE_TABLET_JPG} />
                <source srcSet={PATIENT_IMAGE_MOBILE_WEBP} type="image/webp" />
                <img
                  src={PATIENT_IMAGE_MOBILE_JPG}
                  alt="스타피부과 환자 상담"
                  className="relative z-10 w-full object-cover"
                  style={{
                    height: '520px',
                    objectPosition: 'center top',
                    borderRadius: '12px',
                    marginTop: '55px',
                  }}
                  loading="lazy"
                />
              </picture>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/**
 * DoctorsSection — STAR 피부과 (Luxury Minimal Medical Redesign)
 *
 * 디자인 원칙:
 * - Editorial portrait: 의사 사진이 콘텐츠의 중심
 * - 정제된 탭 네비게이션: 골드 언더라인 + 부드러운 전환
 * - DS 토큰 기반: DesignSystem.tsx의 color/shadow/radius/motion 사용
 * - 여백 강화: 정보 밀도 감소, 각 요소 간 충분한 breathing room
 * - 기존 기능 유지: i18n, 스와이프, 자격증 토글, 스와이프 힌트
 */
import React, { memo, useState, useEffect, useRef, useMemo } from "react";
import { Award, GraduationCap, Stethoscope, ChevronDown, Zap } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";
import { DS } from "@/components/ui/DesignSystem";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

const DR_JO_IMAGE_DESKTOP_JPG  = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/01_5e3176cb.png";
const DR_JO_IMAGE_MOBILE_WEBP  = `${CDN}/dr_jo_profile-mobile_ee5a7e09.webp`;

const DR_WOO_IMAGE_DESKTOP_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/0211_8cfcf452.png";
const DR_WOO_IMAGE_MOBILE_WEBP = `${CDN}/sub_01_02_img2-mobile_ceacc144.webp`;

const DR_LEE_IMAGE_DESKTOP_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/03_46691618.png";
const DR_LEE_IMAGE_MOBILE_WEBP = `${CDN}/sub_01_02_img5-mobile_2e57f5ca.webp`;

interface Doctor {
  id: number;
  name: string;
  nameEn: string;
  title: string;
  image: string;
  cardImage?: string;
  cardImagePosition?: string;
  mobileImage?: string;
  mobileObjectPosition?: string;
  badge: string;
  intro: string[];
  credentials: { icon: React.ElementType; label: string; text: string }[];
  specialties: string[];
}

const doctors: Doctor[] = [
  {
    id: 0,
    name: "조시형 원장",
    nameEn: "Dr. JO SI-HYUNG",
    title: "피부과 전문의 · 의학박사",
    image: DR_JO_IMAGE_DESKTOP_JPG,
    cardImage: DR_JO_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    mobileImage: DR_JO_IMAGE_MOBILE_WEBP,
    mobileObjectPosition: "center 15%",
    badge: "원장",
    intro: [
      "2006년 부산 서면에서 첫 진료를 시작한 이래, 어느덧 20년이 넘는 시간 동안 수많은 환자분들의 피부 고민을 마주해 왔습니다.",
      "피부 치료는 단순히 장비를 사용하는 기술이 아니라, 환자의 피부 상태를 정확히 읽어내는 '안목'에서 시작됩니다. 무리한 시술보다는 가장 안전하고 자연스러운 결과를 지향합니다.",
      "앞으로도 변함없이 정직하고 숙련된 진료로 여러분의 피부 건강을 지켜드리겠습니다."
    ],
    credentials: [
      { icon: Award,        label: "자격",   text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력",  text: "부산대학병원 피부과 수련" },
      { icon: GraduationCap, label: "학력",  text: "인제대 피부과 교수역임" },
      { icon: GraduationCap, label: "학력",  text: "인제대, 부산대 외래교수역임" },
      { icon: Award,        label: "경력",   text: "부산경남울산피부과의사회 회장 역임" },
      { icon: Zap,          label: "자문의", text: "써마지 FLX 자문의" },
      { icon: Award,        label: "경력",   text: "미국 피부과 학회 정회원(AAD)" },
      { icon: Stethoscope,  label: "현직",   text: "현) 스타피부과 원장" },
    ],
    specialties: ["눈밑지방재배치", "리프팅", "울쎄라", "써마지", "흉터치료", "색소치료", "백반증", "문신제거", "보톡스", "필러"],
  },
  {
    id: 1,
    name: "우혜진 원장",
    nameEn: "Dr. WOO HYE-JIN",
    title: "피부과 전문의",
    image: DR_WOO_IMAGE_DESKTOP_JPG,
    cardImage: DR_WOO_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    mobileImage: DR_WOO_IMAGE_MOBILE_WEBP,
    mobileObjectPosition: "center 15%",
    badge: "원장",
    intro: [
      "피부과 전문의로서 환자분들의 피부 건강을 최우선으로 생각합니다.",
      "정확한 진단과 맞춤형 치료를 통해 최고의 결과를 제공하기 위해 노력하겠습니다."
    ],
    credentials: [
      { icon: Award,        label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 수련" },
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 외래교수 역임" },
      { icon: Stethoscope,  label: "학회", text: "대한 피부과 학회 정회원" },
      { icon: Stethoscope,  label: "학회", text: "미국 피부과 학회 정회원(AAD)" },
      { icon: Award,        label: "경력", text: "전) 고운세상 김양제 피부과원장" },
    ],
    specialties: ["리프팅", "울쎄라", "써마지", "흉터치료", "색소치료", "피부질환", "문신제거", "손발톱무좀", "보톡스"],
  },
  {
    id: 2,
    name: "이기욱 원장",
    nameEn: "Dr. LEE GI-WOOK",
    title: "피부과 전문의 · 의학박사",
    image: DR_LEE_IMAGE_DESKTOP_JPG,
    cardImage: DR_LEE_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    mobileImage: DR_LEE_IMAGE_MOBILE_WEBP,
    mobileObjectPosition: "center 15%",
    badge: "원장",
    intro: [
      "의학박사로서 최신 피부과학 지식을 바탕으로 환자분들께 최고 수준의 의료 서비스를 제공합니다.",
      "안전하고 효과적인 치료를 통해 여러분의 피부 건강을 지켜드리겠습니다."
    ],
    credentials: [
      { icon: Award,        label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 의학박사" },
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 피부과 외래교수" },
      { icon: Stethoscope,  label: "학회", text: "대한 피부과학회 정회원" },
      { icon: Stethoscope,  label: "학회", text: "대한 피부과의사회 정회원" },
      { icon: Award,        label: "경력", text: "전) 아름다운피부과 원장" },
    ],
    specialties: ["리프팅", "울쎄라", "써마지", "색소치료", "백반증", "피부질환", "문신제거", "손발톱무좀"],
  },
];

const preloadImages = () => {
  [DR_JO_IMAGE_DESKTOP_JPG, DR_WOO_IMAGE_DESKTOP_JPG, DR_LEE_IMAGE_DESKTOP_JPG].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

// ── DoctorTabButton ────────────────────────────────────────────────────────────
interface DoctorTabButtonProps {
  doctor: Doctor;
  isActive: boolean;
  badgeLabel: string;
  selectDoctorLabel: string;
  onSelect: (id: number) => void;
  onImageLoad: (id: number) => void;
  variant: "sidebar" | "mobile";
}

function DoctorTabButton({ doctor: d, isActive, badgeLabel, selectDoctorLabel, onSelect, onImageLoad, variant }: DoctorTabButtonProps) {
  if (variant === "sidebar") {
    return (
      <button
        type="button"
        key={d.id}
        onClick={() => onSelect(d.id)}
        aria-label={selectDoctorLabel.replace("{name}", d.name)}
        aria-pressed={isActive}
        className="flex flex-col items-center gap-3 px-4 py-5 transition-all relative w-full"
        style={{
          background: isActive
            ? `linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.05) 100%)`
            : "transparent",
          borderBottom: `1px solid rgba(201,168,76,0.18)`,
          transition: `background ${DS.motion.base} ${DS.motion.ease}`,
        }}
      >
        {/* 썸네일 */}
        <div
          style={{
            width: "88px", height: "88px",
            borderRadius: "50%", overflow: "hidden", flexShrink: 0,
            border: isActive ? `2px solid ${DS.color.gold}` : `2px solid rgba(201,168,76,0.3)`,
            transition: `border ${DS.motion.base} ${DS.motion.ease}`,
            boxShadow: isActive ? DS.shadow.gold : "none",
          }}
        >
          <OptimizedImage
            src={d.cardImage || d.image}
            alt={d.name}
            priority
            usePicture={false}
            onLoad={() => onImageLoad(d.id)}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: d.cardImagePosition || "center top",
            }}
          />
        </div>
        {/* 이름/직책 */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <span style={{
              color: isActive ? DS.color.charcoal : "#5a3e16",
              fontWeight: isActive ? 700 : 500,
              fontSize: "1.1rem",
              transition: `color ${DS.motion.base} ${DS.motion.ease}`,
              letterSpacing: "0.02em",
            }}>
              {d.name}
            </span>
            <span style={{
              color: isActive ? DS.color.charcoal : "#7a5e36",
              fontWeight: 400,
              fontSize: "0.82rem",
              transition: `color ${DS.motion.base} ${DS.motion.ease}`,
            }}>
              {badgeLabel}
            </span>
          </div>
          {/* 골드 언더라인 */}
          <div style={{
            height: "1.5px",
            background: DS.color.gold,
            margin: "5px auto 0",
            borderRadius: "2px",
            width: isActive ? "24px" : "0px",
            transition: `width ${DS.motion.base} ${DS.motion.spring}`,
          }} />
        </div>
      </button>
    );
  }

  // mobile variant
  return (
    <button
      type="button"
      onClick={() => onSelect(d.id)}
      aria-label={selectDoctorLabel.replace("{name}", d.name)}
      aria-pressed={isActive}
      className="flex flex-col items-center py-4 px-2 transition-all relative"
      style={{
        background: isActive ? DS.color.goldLight : "white",
        borderBottom: isActive ? `2px solid ${DS.color.gold}` : "2px solid transparent",
        transition: `all ${DS.motion.base} ${DS.motion.ease}`,
      }}
    >
      <div style={{
        width: "56px", height: "56px",
        borderRadius: "50%", overflow: "hidden",
        border: isActive ? `2px solid ${DS.color.gold}` : "2px solid #e5e7eb",
        marginBottom: "6px", flexShrink: 0,
        boxShadow: isActive ? DS.shadow.gold : "none",
        transition: `all ${DS.motion.base} ${DS.motion.ease}`,
      }}>
        <OptimizedImage
          src={d.cardImage || d.image}
          alt={d.name}
          priority
          usePicture={false}
          onLoad={() => onImageLoad(d.id)}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: d.cardImagePosition || "center 15%",
          }}
        />
      </div>
      <div style={{
        color: isActive ? DS.color.charcoal : "#9CA3AF",
        fontWeight: isActive ? 700 : 400,
        fontSize: "0.78rem", textAlign: "center",
        transition: `color ${DS.motion.base} ${DS.motion.ease}`,
      }}>
        {d.name}
      </div>
      <div style={{
        color: isActive ? DS.color.gold : "#C4C4C4",
        fontSize: "0.62rem", marginTop: "1px", textAlign: "center",
        transition: `color ${DS.motion.base} ${DS.motion.ease}`,
      }}>
        {badgeLabel}
      </div>
    </button>
  );
}

// ── DoctorDetail (공통 텍스트 패널) ────────────────────────────────────────────
interface DoctorDetailProps {
  doctor: Doctor;
  t: any;
  expandedCredentials: boolean;
  onToggleCredentials: () => void;
  isMobile?: boolean;
}

function DoctorDetail({ doctor, t, expandedCredentials, onToggleCredentials, isMobile = false }: DoctorDetailProps) {
  const p = isMobile ? "p-5" : "p-10 xl:p-12";
  const nameSize = isMobile ? "1.3rem" : "clamp(1.6rem, 3vw, 2rem)";
  const introSize = isMobile ? "0.9rem" : "0.95rem";

  return (
    <div className={`flex flex-col gap-5 overflow-y-auto ${p}`} style={{ flex: 1 }}>
      {/* 이름 헤더 */}
      <div className="flex items-start justify-between" style={{ marginTop: isMobile ? 0 : "8px" }}>
        <div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 style={{
              color: DS.color.charcoal,
              fontSize: nameSize,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}>
              {doctor.name}
            </h3>
            <span className="font-montserrat" style={{
              color: DS.color.gold,
              fontSize: isMobile ? "0.75rem" : "0.9rem",
              fontWeight: 300,
              letterSpacing: "0.06em",
            }}>
              {doctor.nameEn}
            </span>
          </div>
          <p style={{
            color: DS.color.midGray,
            fontSize: "0.8rem",
            marginTop: "4px",
            letterSpacing: "0.03em",
          }}>
            {doctor.title}
          </p>
        </div>
        {/* 피부과 전문의 배지 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#C0392B", color: "white",
          fontSize: isMobile ? "10px" : "13px",
          fontWeight: 700,
          width: isMobile ? "44px" : "52px",
          height: isMobile ? "44px" : "52px",
          borderRadius: DS.radius.sm,
          lineHeight: 1.3, textAlign: "center", flexShrink: 0,
        }}>
          {t.doctors.dermBadge.split('\n').map((line: string, i: number) =>
            i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>
          )}
        </div>
      </div>

      {/* 골드 구분선 */}
      <div style={{
        height: "1px",
        background: `linear-gradient(to right, ${DS.color.gold}44, transparent)`,
      }} />

      {/* 소개 */}
      <div style={{
        color: DS.color.midGray,
        fontSize: introSize,
        lineHeight: 1.85,
      }}>
        {Array.isArray(doctor.intro) ? (
          doctor.intro.map((para, idx) => (
            <p key={idx} style={{ margin: "0 0 0.9em 0", whiteSpace: "normal", wordBreak: "break-word" }}>
              {para}
            </p>
          ))
        ) : (
          <p>{doctor.intro as string}</p>
        )}
      </div>

      {/* 전문 시술 태그 */}
      <div>
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <Zap size={15} style={{ color: DS.color.gold, flexShrink: 0 }} />
          <p style={{
            color: DS.color.gold,
            fontWeight: 600,
            fontSize: "0.72rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            margin: 0,
          }}>
            {t.doctors.specialtyTitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {doctor.specialties.map((s) => (
            <span
              key={s}
              style={{
                background: DS.color.goldLight,
                color: DS.color.midGray,
                fontWeight: 500,
                border: `1px solid rgba(201,168,76,0.25)`,
                borderRadius: DS.radius.pill,
                fontSize: "0.75rem",
                padding: "5px 12px",
                lineHeight: 1.4,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div style={{
        height: "1px",
        background: `linear-gradient(to right, rgba(201,168,76,0.2), transparent)`,
      }} />

      {/* 학력·경력·자격 */}
      {isMobile ? (
        // 모바일: 접기/펼치기
        <div style={{
          border: `1px solid rgba(201,168,76,0.25)`,
          borderRadius: DS.radius.md,
          overflow: "hidden",
        }}>
          <button
            type="button"
            onClick={onToggleCredentials}
            aria-expanded={expandedCredentials}
            aria-label={expandedCredentials
              ? t.doctors.collapseCredentialsLabel!
              : t.doctors.expandCredentialsLabel!}
            className="w-full flex items-center justify-between px-4 py-3"
            style={{
              background: expandedCredentials ? DS.color.goldLight : DS.color.warmWhite,
              transition: `background ${DS.motion.base} ${DS.motion.ease}`,
            }}
          >
            <span style={{
              fontSize: "0.78rem", fontWeight: 600,
              color: DS.color.deepGray, letterSpacing: "0.05em",
            }}>
              {`${t.doctors.credentialsTitle} (${doctor.credentials.length})`}
            </span>
            <ChevronDown
              size={16}
              style={{
                color: DS.color.gold,
                transition: `transform ${DS.motion.base} ${DS.motion.ease}`,
                transform: expandedCredentials ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
          {expandedCredentials && (
            <div className="px-4 py-4 grid grid-cols-1 gap-2">
              {doctor.credentials.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.text}
                    className="flex items-start gap-2.5 py-2 px-2 rounded-lg"
                    style={{ background: DS.color.warmWhite }}
                  >
                    <Icon size={13} style={{ color: DS.color.gold, flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: DS.color.midGray, fontSize: "0.8rem", lineHeight: 1.6 }}>
                      {c.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // 데스크톱: 항상 펼침
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: "14px" }}>
            <GraduationCap size={15} style={{ color: DS.color.gold, flexShrink: 0 }} />
            <p style={{
              color: DS.color.gold, fontWeight: 600,
              fontSize: "0.72rem", letterSpacing: "0.15em",
              textTransform: "uppercase", margin: 0,
            }}>
              {t.doctors.credentialsTitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {doctor.credentials.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.text}
                  className="flex items-start gap-2.5 py-2"
                  style={{ borderBottom: `1px solid rgba(201,168,76,0.1)` }}
                >
                  <Icon size={13} style={{ color: DS.color.gold, flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ color: DS.color.midGray, fontSize: "0.82rem", lineHeight: 1.65 }}>
                    {c.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DoctorsSection ─────────────────────────────────────────────────────────────
function DoctorsSection() {
  const [activeDoctor, setActiveDoctor] = useState(0);
  const [expandedCredentials, setExpandedCredentials] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => { preloadImages(); }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) {
        setActiveDoctor((prev) => (prev + 1) % doctors.length);
        setExpandedCredentials(false);
      } else {
        setActiveDoctor((prev) => (prev - 1 + doctors.length) % doctors.length);
        setExpandedCredentials(false);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleDoctorSelect = (i: number) => {
    setActiveDoctor(i);
    setExpandedCredentials(false);
  };
  const handleImageLoad = (id: number) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const { t } = useLang();
  const badgeLabel = t.doctors.badge;

  // [D항목] index 기반 merge → id 기반 find로 전환 (의사 순서 변경 시 불일치 방지)
  const mergedDoctors = useMemo(() => doctors.map((d) => {
    const locale = t.doctors.list.find((item) => item.id === d.id);
    return {
      ...d,
      name: locale?.name ?? d.name,
      title: locale?.title ?? d.title,
      intro: (locale?.intro ?? d.intro) as string[],
      // [R11-A] locale.careers 텍스트만 교체, icon/label은 원본 credentials에서 유지
      credentials: locale?.careers
        ? d.credentials.map((cred, i) => ({
            ...cred,
            text: locale.careers![i] ?? cred.text,
          }))
        : d.credentials,
      specialties: locale?.specialties ?? d.specialties,
      badge: badgeLabel,
    };
  }), [t.doctors, badgeLabel]);

  const doctor = mergedDoctors[activeDoctor];
  const sectionRef = useSectionReveal(60);

  return (
    <section
      ref={sectionRef}
      id="doctors"
      className="py-16 sm:py-24"
      style={{ background: DS.color.ivory }}
      role="region"
      aria-label={t.doctors.label}
    >
      <div className="container">
        {/* ── Section Header ── */}
        <div className="text-center mb-10 sm:mb-14 reveal-heading">
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: DS.color.gold,
            fontWeight: 400,
            marginBottom: "12px",
          }}>
            {t.doctors.label}
          </p>
          <h2 style={{
            color: DS.color.charcoal,
            fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "10px",
          }}>
            {t.doctors.title}
          </h2>
          {/* 골드 룰 */}
          <div style={{
            width: "40px", height: "1.5px",
            background: `linear-gradient(90deg, transparent, ${DS.color.gold}, transparent)`,
            margin: "0 auto 14px",
          }} />
          <p style={{
            color: DS.color.gold,
            fontSize: "clamp(0.88rem, 2.2vw, 1.05rem)",
            maxWidth: "540px",
            margin: "0 auto",
            lineHeight: 1.65,
          }}>
            {t.doctors.tagline}
          </p>
        </div>

        {/* ── 메인 패널 ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: DS.color.white,
            boxShadow: `${DS.shadow.lg}, ${DS.shadow.gold}`,
            border: `1px solid rgba(201,168,76,0.18)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 데스크톱: 좌측 사이드바 탭 + 우측 상세 */}
          <div className="hidden lg:flex" style={{ minHeight: "560px" }}>
            {/* 좌측 사이드바 */}
            <div
              className="flex flex-col"
              style={{
                width: "200px",
                flexShrink: 0,
                background: `linear-gradient(170deg, #ede0b8 0%, #dfc99a 60%, #d4b87a 100%)`,
                borderRight: `1px solid rgba(201,168,76,0.3)`,
              }}
            >
              {/* 브랜드 영역 */}
              <div className="px-5 py-7 text-center" style={{
                borderBottom: `1px solid rgba(201,168,76,0.22)`,
              }}>
                <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(120,90,40,0.7)",
                  fontWeight: 300,
                  fontSize: "0.72rem",
                  marginBottom: "8px",
                }}>
                  {t.doctors.teamLabel}
                </div>
                <div style={{
                  color: "#7a5520",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}>
                  {t.doctors.specialistCount}
                </div>
              </div>

              {/* 의사 탭 목록 */}
              <div className="flex flex-col flex-1 justify-center">
                {mergedDoctors.map((d) => (
                  <DoctorTabButton
                    key={d.id}
                    doctor={d}
                    isActive={activeDoctor === d.id}
                    badgeLabel={badgeLabel}
                    selectDoctorLabel={t.doctors.selectDoctorLabel ?? ""}
                    onSelect={handleDoctorSelect}
                    onImageLoad={handleImageLoad}
                    variant="sidebar"
                  />
                ))}
              </div>
            </div>

            {/* 우측 상세 패널 */}
            <div className="flex flex-1 overflow-hidden">
              {/* 사진 영역 */}
              <div
                className="relative flex-shrink-0"
                style={{ width: "380px", background: "#0d0d0d", overflow: "hidden" }}
              >
                {mergedDoctors.map((d) => (
                  <OptimizedImage
                    key={d.id}
                    src={d.image}
                    alt={d.name}
                    priority
                    usePicture={false}
                    onLoad={() => handleImageLoad(d.id)}
                    style={{
                      position: "absolute", top: 0, left: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", objectPosition: "top 0%",
                      opacity: activeDoctor === d.id ? 1 : 0,
                      transition: `opacity ${DS.motion.slow} ${DS.motion.ease}`,
                      zIndex: activeDoctor === d.id ? 1 : 0,
                    }}
                  />
                ))}
                {/* 우측 페이드 */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "80px", height: "100%",
                  background: `linear-gradient(to right, transparent, ${DS.color.white})`,
                  zIndex: 2,
                }} />
                {/* 하단 그라디언트 */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: "100px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                  zIndex: 2,
                }} />
              </div>

              {/* 텍스트 상세 */}
              <DoctorDetail
                doctor={doctor}
                t={t}
                expandedCredentials={expandedCredentials}
                onToggleCredentials={() => setExpandedCredentials(!expandedCredentials)}
                isMobile={false}
              />
            </div>
          </div>

          {/* ── 모바일 레이아웃 ── */}
          <div className="lg:hidden">
            {/* 모바일 탭 헤더 */}
            <div className="grid grid-cols-3" style={{
              borderBottom: `1px solid rgba(201,168,76,0.25)`,
            }}>
              {mergedDoctors.map((d) => (
                <DoctorTabButton
                  key={d.id}
                  doctor={d}
                  isActive={activeDoctor === d.id}
                  badgeLabel={badgeLabel}
                  selectDoctorLabel={t.doctors.selectDoctorLabel ?? ""}
                  onSelect={handleDoctorSelect}
                  onImageLoad={handleImageLoad}
                  variant="mobile"
                />
              ))}
            </div>

            {/* 모바일 상세 */}
            <div>
              {/* 사진 */}
              <div style={{
                position: "relative",
                height: "clamp(320px, 70vw, 420px)",
                background: "#0d0d0d",
                overflow: "hidden",
              }}>
                {mergedDoctors.map((d) => (
                  <OptimizedImage
                    key={d.id}
                    src={d.mobileImage || d.image}
                    alt={d.name}
                    priority
                    usePicture={false}
                    onLoad={() => handleImageLoad(d.id)}
                    style={{
                      position: "absolute", top: 0, left: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover",
                      objectPosition: d.mobileObjectPosition || "center 15%",
                      opacity: activeDoctor === d.id ? 1 : 0,
                      transition: `opacity ${DS.motion.slow} ${DS.motion.ease}`,
                      zIndex: activeDoctor === d.id ? 1 : 0,
                    }}
                  />
                ))}
                {/* 하단 그라디언트 */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: "80px",
                  background: `linear-gradient(to top, ${DS.color.white} 0%, transparent 100%)`,
                  zIndex: 2,
                }} />
              </div>

              {/* 텍스트 */}
              <DoctorDetail
                doctor={doctor}
                t={t}
                expandedCredentials={expandedCredentials}
                onToggleCredentials={() => setExpandedCredentials(!expandedCredentials)}
                isMobile={true}
              />

              {/* 스와이프 힌트 + 도트 네비게이션 */}
              <div className="flex flex-col items-center gap-2 pb-5 px-5">
                <p style={{ color: DS.color.lightGray, fontSize: "0.72rem" }}>
                  {t.doctors.swipeHint}
                </p>
                <div className="flex justify-center gap-2">
                  {doctors.map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => handleDoctorSelect(d.id)}
                      aria-label={(t.doctors.dotNavLabel ?? "").replace("{name}", doctors[d.id]?.name ?? String(d.id + 1))}
                      aria-current={activeDoctor === d.id ? "true" : undefined}
                      style={{
                        width: activeDoctor === d.id ? "24px" : "6px",
                        height: "6px",
                        borderRadius: "3px",
                        background: activeDoctor === d.id ? DS.color.gold : "#D1D5DB",
                        transition: `all ${DS.motion.base} ${DS.motion.spring}`,
                        border: "none",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// [FM-P2-4] memo: 언어 컨텍스트 변경 외 리렌더 차단
export default memo(DoctorsSection);

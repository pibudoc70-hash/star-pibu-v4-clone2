/**
 * DoctorsSection - 의료진 소개 (프리미엄 리디자인)
 * - 메인 컬러 #d2ac67 (골드)
 * - 카드 선택 + 상세 패널이 하나의 섹션으로 자연스럽게 연결
 * - 고급스러운 레이아웃: 좌측 세로 탭 + 우측 상세 정보
 */
import { useState, useEffect, useRef } from "react";
import { Award, GraduationCap, Stethoscope, ChevronDown, Zap } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

const DR_JO_IMAGE_DESKTOP_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/01_5e3176cb.png";
const DR_JO_IMAGE_DESKTOP_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/01_5e3176cb.png";
const DR_JO_IMAGE_MOBILE_WEBP = `${CDN}/dr_jo_profile-mobile_ee5a7e09.webp`;
const DR_JO_IMAGE_MOBILE_JPG = `${CDN}/dr_jo_profile-mobile_ee5a7e09.webp`;

const DR_WOO_IMAGE_DESKTOP_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/0211_8cfcf452.png";
const DR_WOO_IMAGE_DESKTOP_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/0211_8cfcf452.png";
const DR_WOO_IMAGE_MOBILE_WEBP = `${CDN}/sub_01_02_img2-mobile_ceacc144.webp`;
const DR_WOO_IMAGE_MOBILE_JPG = `${CDN}/sub_01_02_img2-mobile_ceacc144.webp`;

const DR_LEE_IMAGE_DESKTOP_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/03_46691618.png";
const DR_LEE_IMAGE_DESKTOP_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/03_46691618.png";
const DR_LEE_IMAGE_MOBILE_WEBP = `${CDN}/sub_01_02_img5-mobile_2e57f5ca.webp`;
const DR_LEE_IMAGE_MOBILE_JPG = `${CDN}/sub_01_02_img5-mobile_2e57f5ca.webp`;

const DR_JO_IMAGE = DR_JO_IMAGE_DESKTOP_JPG;
const DR_JO_CARD_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/01_5e3176cb.png";
const DR_WOO_IMAGE = DR_WOO_IMAGE_DESKTOP_JPG;
const DR_LEE_IMAGE = DR_LEE_IMAGE_DESKTOP_JPG;

const GOLD = "#d2ac67";
const GOLD_LIGHT = "#f9f3e8";
const GOLD_MID = "#e8d5a3";

const doctors = [
  {
    id: 0,
    name: "조시형 원장",
    nameEn: "Dr. JO SI-HYEONG",
    title: "피부과 전문의 · 의학박사",
    image: DR_JO_IMAGE,
    cardImage: DR_JO_CARD_IMAGE,
    cardImagePosition: "center 15%",
    badge: "원장",
    intro: "2006년 부산 서면에서 첫 진료를 시작한 이래, 어느덧 20년이 넘는 시간 동안 수많은 환자분들의 피부 고민을 마주해 왔습니다. 피부 치료는 단순히 장비를 사용하는 기술이 아니라, 환자의 피부 상태를 정확히 읽어내는 '안목'에서 시작됩니다. 무리한 시술보다는 가장 안전하고 자연스러운 결과를 지향합니다. 앞으로도 변함없이 정직하고 숙련된 진료로 여러분의 피부 건강을 지켜드리겠습니다.",
    credentials: [
      { icon: GraduationCap, label: "학력", text: "부산대학교병원 피부과 수련" },
      { icon: GraduationCap, label: "학력", text: "인제대학교 피부과 교수 역임" },
      { icon: GraduationCap, label: "학력", text: "인제대·부산대 외래교수 역임" },
      { icon: Award, label: "자격", text: "피부과 전문의 · 의학박사" },
      { icon: Award, label: "자격", text: "써마지 FLX 공식 자문의" },
      { icon: Award, label: "경력", text: "전) 부산경남울산 피부과의사회 회장" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과 학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 레이저 학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "미국 피부과 학회(AAD) 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 코스메틱 피부과 학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 비만학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 미용 피부외과 학회 정회원" },
      { icon: Award, label: "경력", text: "전) 대우병원 피부과 과장" },
      { icon: Award, label: "경력", text: "전) 부산 고운세상 피부과 대표원장" },
    ],
    specialties: ["눈밑지방재배치", "울쎄라 프라임", "써마지", "흉터치료"],
  },
  {
    id: 1,
    name: "우혜진 원장",
    nameEn: "Dr. WOO HYE-JIN",
    title: "피부과 전문의",
    image: DR_WOO_IMAGE,
    cardImage: DR_WOO_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    badge: "원장",
    intro: "가톨릭의대 피부과 수련과 고운세상 피부과에서의 폭넓은 임상 경험을 바탕으로, 한 분 한 분의 피부 고민에 공감하며 진료합니다. 단순히 증상만을 보는 것이 아니라 환자분의 피부 상태를 세심하게 체크하여 가장 조화롭고 효과적인 치료 솔루션을 제안해 드립니다. 특히 여드름과 색소 치료, 체계적인 피부 관리를 통해 건강한 아름다움을 되찾아 드리는 데 앞장서겠습니다.",
    credentials: [
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 수련" },
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 외래교수" },
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과 학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "미국 피부과 학회(AAD) 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 코스메틱 피부과 학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 비만학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 임상 메조테라피 연구회 회원" },
      { icon: Award, label: "경력", text: "전) 고운세상 김양제 피부과" },
      { icon: Award, label: "경력", text: "전) 부산 고운세상 피부과 원장" },
    ],
    specialties: ["여드름·흉터", "색소 치료", "피부 관리", "리프팅", "보톡스·필러", "피부질환"],
  },
  {
    id: 2,
    name: "이기욱 원장",
    nameEn: "Dr. LEE GI-WOOK",
    title: "피부과 전문의 · 의학박사",
    image: DR_LEE_IMAGE,
    cardImage: DR_LEE_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    badge: "원장",
    intro: "의학박사의 전문적인 식견과 현장에서 다져진 풍부한 임상 데이터를 바탕으로 환자 한 분 한 분께 집중합니다. 레이저 시술부터 까다로운 피부질환 치료까지, 무엇보다 환자의 안전과 만족을 최우선으로 생각하며 세심하게 진단합니다. 풍부한 경험이 증명하는 차별화된 진료로 여러분의 피부 건강을 든든하게 지켜드리겠습니다.",
    credentials: [
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 의학박사" },
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 피부과 외래교수" },
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과의사회 정회원" },
      { icon: Award, label: "경력", text: "전) 아름다운김스피부과 원장" },
      { icon: Award, label: "경력", text: "전) 해맑은피부과 원장" },
      { icon: Award, label: "경력", text: "전) 아름다운피부과 원장" },
    ],
    specialties: ["레이저 시술", "피부질환", "손발톱무좀", "흉터 치료", "색소 레이저", "피부 관리"],
  },
];

const preloadImages = () => {
  [DR_JO_IMAGE, DR_WOO_IMAGE, DR_LEE_IMAGE].forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

export default function DoctorsSection() {
  const [activeDoctor, setActiveDoctor] = useState(0);
  const [expandedCredentials, setExpandedCredentials] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    preloadImages();
  }, []);

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

  const { t, lang } = useLang();

  const mergedDoctors = doctors.map((d, idx) => ({
    ...d,
    name: t.doctors.list[idx]?.name ?? d.name,
    title: t.doctors.list[idx]?.title ?? d.title,
    credentials: t.doctors.list[idx]?.careers?.map((c) => ({ icon: Award, label: "경력", text: c })) ?? d.credentials,
    specialties: lang === "ko" ? d.specialties : (t.treatments.categories[idx % t.treatments.categories.length]?.items?.slice(0, 4) ?? d.specialties),
  }));

  const doctor = mergedDoctors[activeDoctor];
  const sectionRef = useSectionReveal(90);

  return (
    <section
      ref={sectionRef}
      id="doctors"
      className="py-16 sm:py-24"
      style={{ background: "#faf7f0" }}
      role="region"
      aria-label="의료진 소개"
    >
      <div className="container">
        {/* ── Section Header ── */}
        <div className="text-center mb-10 sm:mb-16 reveal-heading">
          <p
            className="font-montserrat text-xs tracking-[0.3em] mb-3 uppercase"
            style={{ color: GOLD, fontWeight: 300 }}
          >
            {t.doctors.label}
          </p>
          <h2
            className="mb-3"
            style={{ color: "#1a1a1a", fontSize: "clamp(1.6rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            {t.doctors.title}
          </h2>

          <p className="text-sm leading-snug sm:leading-normal" style={{ color: '#d1ab67', fontSize: '18px', marginTop: '13px', maxWidth: '577px', margin: '13px auto 0' }}>
            {lang === "ko" ? <><span className="sm:hidden">피부의 격(格)이 바뀌는 순간,<br />전문의의 안목이 차이를 만듭니다.</span><span className="hidden sm:inline">피부의 격(格)이 바뀌는 순간, 전문의의 안목이 차이를 만듭니다.</span></> : lang === "ja" ? "皮膚構造を理解する専門医のみが安全な結果を作ります。" : "只有了解皮肤结构的专科医生才能带来安全的效果。"}
          </p>
        </div>

        {/* ── 메인 패널: 좌측 의사 탭 + 우측 상세 ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "white",
            boxShadow: "0 20px 60px rgba(210,172,103,0.15), 0 4px 20px rgba(0,0,0,0.06)",
            border: `1px solid ${GOLD_MID}55`,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 데스크톱: 좌측 탭 + 우측 상세 */}
          <div className="hidden lg:flex" style={{ minHeight: "520px" }}>
            {/* 좌측 탭 패널 */}
            <div
              className="flex flex-col"
              style={{
                width: "220px",
                flexShrink: 0,
                background: `linear-gradient(170deg, #ede0b8 0%, #dfc99a 60%, #d4b87a 100%)`,
                borderRight: `1px solid ${GOLD}44`,
              }}
            >
              {/* 상단 브랜드 영역 */}
              <div
                className="px-5 py-7 border-b text-center"
                style={{ borderColor: `${GOLD}33` }}
              >
                <div
                  className="font-montserrat tracking-[0.3em] uppercase mb-3"
                  style={{ color: '#af9e74', fontWeight: 300, fontSize: "0.84rem", letterSpacing: "0.3em" }}
                >
                  Medical Team
                </div>
                <div
                  style={{
                    color: '#997d4d',
                    fontSize: "1.26rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  피부과전문의 3인
                </div>

              </div>

              {/* 의사 탭 목록 */}
              <div className="flex flex-col flex-1 justify-center">
                {mergedDoctors.map((d) => {
                  const isActive = activeDoctor === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleDoctorSelect(d.id)}
                      className="flex flex-col items-center gap-3 px-4 py-5 transition-all duration-300 relative w-full"
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${GOLD}33 0%, ${GOLD}08 100%)`
                          : "transparent",
                        borderBottom: `1px solid ${GOLD}22`,
                      }}
                    >
                      {/* 썸네일 */}
                      <div
                        style={{
                          width: "88px",
                          height: "88px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: isActive ? `2px solid ${GOLD}` : `2px solid ${GOLD}44`,
                          transition: "border 0.3s ease",
                        }}
                      >
                        <img
                          src={(d as any).cardImage || d.image}
                          alt={d.name}
                          loading="eager"
                          onLoad={() => handleImageLoad(d.id)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: (d as any).cardImagePosition || ((d as any).cardImage ? "center top" : "top 10%"),
                          }}
                        />
                      </div>
                      {/* 이름/직책 */}
                      <div className="text-center">
                        <div
                          className="flex items-baseline justify-center gap-1.5"
                        >
                          <span
                            style={{
                              color: isActive ? "#2c1f08" : "#5a3e16",
                              fontWeight: isActive ? 700 : 500,
                              fontSize: "1.2rem",
                              transition: "color 0.3s ease",
                              letterSpacing: "0.03em",
                            }}
                          >
                            {d.name}
                          </span>
                          <span
                            style={{
                              color: isActive ? "#2c1f08" : "#5a3e16",
                              fontWeight: 400,
                              fontSize: "0.86rem",
                              transition: "color 0.3s ease",
                              letterSpacing: "0.05em",
                            }}
                          >
                            원장
                          </span>
                        </div>
                        {isActive && (
                          <div
                            style={{
                              width: "20px",
                              height: "1.5px",
                              background: GOLD,
                              margin: "5px auto 0",
                              borderRadius: "2px",
                            }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>


            </div>

            {/* 우측 상세 패널 */}
            <div className="flex flex-1">
              {/* 사진 영역 */}
              <div
                className="relative flex-shrink-0"
                style={{
                  width: "420px",
                  background: "#111",
                  overflow: "hidden",
                }}
              >
                {mergedDoctors.map((d) => (
                  <img
                    key={d.id}
                    src={d.image}
                    alt={d.name}
                    loading="eager"
                    fetchPriority="high"
                    onLoad={() => handleImageLoad(d.id)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top 0%",
                      opacity: activeDoctor === d.id ? 1 : 0,
                      transition: "opacity 0.5s ease",
                      zIndex: activeDoctor === d.id ? 1 : 0,
                    }}
                  />
                ))}
                {/* 우측 그라디언트 페이드 */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "80px",
                    height: "100%",
                    background: "linear-gradient(to right, transparent, white)",
                    zIndex: 2,
                  }}
                />
                {/* 하단 그라디언트 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "120px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
                    zIndex: 2,
                  }}
                />
              </div>

              {/* 텍스트 상세 */}
              <div className="flex-1 p-12 flex flex-col gap-5 overflow-y-auto">
                {/* 이름 헤더 */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-baseline gap-3 flex-wrap" style={{marginTop: '23px'}}>
                      <h3
                        style={{
                          color: "#1a1a1a",
                          fontSize: '34px',
                          fontWeight: 800,
                          lineHeight: 1.15,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {doctor.name}
                      </h3>
                      <span
                        className="font-montserrat"
                        style={{ color: GOLD, fontSize: '18px', fontWeight: 100, letterSpacing: "0.05em" }}
                      >
                        {doctor.nameEn}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#C0392B",
                      color: "white",
                      fontSize: '15px',
                      fontWeight: 700,
                      width: '55px',
                      height: '55px',
                      borderRadius: "6px",
                      lineHeight: 1.3,
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    피부과<br />전문의
                  </div>
                </div>

                {/* 골드 구분선 */}
                <div style={{ height: "1px", background: `linear-gradient(to right, ${GOLD}33, transparent)`, margin: "0 0 20px 0" }} />

                {/* 소개 */}
                <p className="text-sm leading-relaxed" style={{ color: "#555", lineHeight: 1.8, paddingBottom: '26px', whiteSpace: 'pre-line', fontSize: '15px' }}>
                  {doctor.intro}
                </p>

                {/* 전문 시술 태그 */}
                <div style={{ marginBottom: "32px" }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
                    <Zap size={18} style={{ color: GOLD }} />
                    <p
                      className="text-xs tracking-widest uppercase"
                      style={{ color: GOLD, fontWeight: 600, fontSize: '15px', margin: 0 }}
                    >
                      {lang === "ko" ? "전문 시술" : lang === "ja" ? "専門施術" : "专业项目"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2" style={{marginTop: '-6px'}}>
                    {doctor.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 text-xs font-semibold"
                        style={{
                          background: GOLD_LIGHT,
                          color: '#737373',
                          fontWeight: 500,
                          border: '1px solid #ffffff',
                          borderRadius: "20px",
                          paddingTop: '8px',
                          height: '35px',
                          textAlign: 'center',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 구분선 */}
                <div style={{ height: "1px", background: `linear-gradient(to right, ${GOLD}22, transparent)`, margin: "0 0 32px 0" }} />

                {/* 학력·경력·자격 - 항상 펼침 */}
                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
                    <GraduationCap size={18} style={{ color: GOLD }} />
                    <p
                      className="text-xs tracking-widest uppercase"
                      style={{ color: GOLD, fontWeight: 600, fontSize: '15px', margin: 0 }}
                    >
                      {lang === "ko"
                        ? `학력 · 경력 · 자격`
                        : lang === "ja"
                        ? `学歴・経歴・資格`
                        : `学历·经历·资质`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {doctor.credentials.map((c) => {
                      const Icon = c.icon;
                      return (
                        <div
                          key={c.text}
                          className="flex items-start gap-2.5 py-2"
                          style={{ borderBottom: `1px solid ${GOLD}15` }}
                        >
                          <Icon size={14} style={{ color: GOLD, flexShrink: 0, marginTop: "3px" }} />
                          <span className="text-xs leading-relaxed" style={{ color: "#555", lineHeight: 1.6, fontSize: '13px' }}>
                            {c.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 모바일 레이아웃 ── */}
          <div className="lg:hidden">
            {/* 모바일 탭 헤더 */}
            <div
              className="grid grid-cols-3"
              style={{ borderBottom: `1px solid ${GOLD}33` }}
            >
              {mergedDoctors.map((d) => {
                const isActive = activeDoctor === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => handleDoctorSelect(d.id)}
                    className="flex flex-col items-center py-4 px-2 transition-all duration-300 relative"
                    style={{
                      background: isActive ? GOLD_LIGHT : "white",
                      borderBottom: isActive ? `2px solid ${GOLD}` : "2px solid transparent",
                    }}
                  >
                    {/* 썸네일 */}
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: isActive ? `2px solid ${GOLD}` : "2px solid #e5e7eb",
                        marginBottom: "6px",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={(d as any).cardImage || d.image}
                        alt={d.name}
                        loading="eager"
                        onLoad={() => handleImageLoad(d.id)}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: (d as any).cardImagePosition || ((d as any).cardImage ? "center 15%" : "top 10%"),
                        }}
                      />
                    </div>

                    <div
                      style={{
                        color: isActive ? "#1a1a1a" : "#9CA3AF",
                        fontWeight: isActive ? 700 : 400,
                        fontSize: "0.78rem",
                        textAlign: "center",
                      }}
                    >
                      {d.name}
                    </div>
                    <div
                      style={{
                        color: isActive ? GOLD : "#C4C4C4",
                        fontSize: "0.62rem",
                        marginTop: "1px",
                        textAlign: "center",
                      }}
                    >
                      원장
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 모바일 상세 패널 */}
            <div>
              {/* 사진 */}
              <div
                style={{
                  position: "relative",
                  height: "clamp(320px, 70vw, 420px)",
                  background: "#111",
                  overflow: "hidden",
                }}
              >
                {mergedDoctors.map((d) => (
                  <img
                    key={d.id}
                    src={(d as any).mobileImage || d.image}
                    alt={d.name}
                    loading="eager"
                    fetchPriority="high"
                    onLoad={() => handleImageLoad(d.id)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: (d as any).mobileObjectPosition || "center 15%",
                      opacity: activeDoctor === d.id ? 1 : 0,
                      transition: "opacity 0.5s ease",
                      zIndex: activeDoctor === d.id ? 1 : 0,
                    }}
                  />
                ))}
                {/* 하단 그라디언트 오버레이 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "100px",
                    background: "linear-gradient(to top, white 0%, transparent 100%)",
                    zIndex: 2,
                  }}
                />
              </div>

              {/* 텍스트 */}
              <div className="p-5 flex flex-col gap-4">
                {/* 이름 헤더 */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 style={{ color: "#1a1a1a", fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                      {doctor.name}
                    </h3>
                    <p className="font-montserrat mt-0.5" style={{ color: GOLD, fontSize: "0.75rem", fontWeight: 400 }}>
                      {doctor.nameEn}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#C0392B",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: 700,
                      width: "44px",
                      height: "44px",
                      borderRadius: "6px",
                      lineHeight: 1.3,
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    피부과<br />전문의
                  </div>
                </div>

                {/* 골드 구분선 */}
                <div style={{ height: "1px", background: `linear-gradient(to right, ${GOLD}33, transparent)`, margin: "0 0 20px 0" }} />

                {/* 소개 */}
                <p className="text-sm leading-relaxed" style={{ color: "#555", lineHeight: 1.8 }}>
                  {doctor.intro}
                </p>

                {/* 전문 시술 태그 */}
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: GOLD, fontWeight: 600 }}>
                    {lang === "ko" ? "전문 시술" : lang === "ja" ? "専門施術" : "专业项目"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 text-xs font-semibold"
                        style={{
                          background: GOLD_LIGHT,
                          color: "#8B6914",
                          border: `1px solid ${GOLD}44`,
                          borderRadius: "20px",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 학력·경력·자격 */}
                <div
                  style={{
                    border: `1px solid ${GOLD}33`,
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setExpandedCredentials(!expandedCredentials)}
                    className="w-full flex items-center justify-between px-4 py-3"
                    style={{
                      background: expandedCredentials ? GOLD_LIGHT : "#FAFAFA",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span className="text-xs font-bold tracking-wider" style={{ color: "#666" }}>
                      {lang === "ko"
                        ? `학력 · 경력 · 자격 (${doctor.credentials.length}건)`
                        : lang === "ja"
                        ? `学歴・経歴・資格 (${doctor.credentials.length}件)`
                        : `学历·经历·资质 (${doctor.credentials.length}项)`}
                    </span>
                    <div
                      style={{
                        color: GOLD,
                        transition: "transform 0.3s ease",
                        transform: expandedCredentials ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  {expandedCredentials && (
                    <div className="px-4 py-4 grid grid-cols-1 gap-2">
                      {doctor.credentials.map((c) => {
                        const Icon = c.icon;
                        return (
                          <div
                            key={c.text}
                            className="flex items-start gap-2 py-1.5 px-2 rounded-lg"
                            style={{ background: "#FAFAFA" }}
                          >
                            <Icon size={13} style={{ color: GOLD, flexShrink: 0, marginTop: "2px" }} />
                            <span className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
                              {c.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 스와이프 힌트 */}
                <div className="flex flex-col items-center gap-2 pt-2">
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>
                    {lang === "ko" ? "← 탭하여 의료진 보기 →" : lang === "ja" ? "← タップで医師を見る →" : "← 点击查看医生 →"}
                  </p>
                  <div className="flex justify-center gap-2">
                    {doctors.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handleDoctorSelect(d.id)}
                        style={{
                          width: activeDoctor === d.id ? "24px" : "6px",
                          height: "6px",
                          borderRadius: "3px",
                          background: activeDoctor === d.id ? GOLD : "#D1D5DB",
                          transition: "all 0.3s ease",
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
      </div>
    </section>
  );
}

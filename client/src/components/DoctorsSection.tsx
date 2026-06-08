/**
 * DoctorsSection - 의료진 소개 (프리미엄 리디자인)
 * - 메인 컬러 #d2ac67 (골드)
 * - 카드 선택 + 상세 패널이 하나의 섹션으로 자연스럽게 연결
 * - 고급스러운 레이아웃: 좌측 세로 탭 + 우측 상세 정보
 *
 * [R13-P1-2] 뷰모델 로직 분리:
 * - 상태/핸들러/locale merge → hooks/useDoctorViewModel.ts
 * - DoctorsSection은 렌더링만 담당
 */
// [FM-P2-4] React.memo: 의료진 섹션은 언어 변경 시만 리렌더 필요
import React, { memo } from "react";
import { ChevronDown, Zap, GraduationCap } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";
// [R12-P1-2] 데이터/표현 분리: 의료진 데이터는 lib/doctors-data.ts에서 관리
import { doctors, GOLD, GOLD_LIGHT, GOLD_MID } from "@/lib/doctors-data";
// [R13-P1-2] 뷰모델 훅 import
import { useDoctorViewModel } from "@/hooks/useDoctorViewModel";

function DoctorsSection() {
  const { t } = useLang();
  const {
    mergedDoctors,
    doctor,
    activeDoctor,
    expandedCredentials,
    handleDoctorSelect,
    handleImageLoad,
    toggleCredentials,
    handleTouchStart,
    handleTouchEnd,
    handleTabKeyDown,
  } = useDoctorViewModel(t);

  const badgeLabel = t.doctors.badge;
  const sectionRef = useSectionReveal(60); // [FM-P1-7] 90 → 60

  return (
    <section
      ref={sectionRef}
      id="doctors"
      className="py-16 sm:py-24 dr-section-bg"
      role="region"
      aria-label={t.doctors.label}
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
            {t.doctors.tagline}
          </p>
        </div>

        {/* ── 메인 패널: 좌측 의사 탭 + 우측 상세 ── */}
        <div
          className="rounded-3xl overflow-hidden dr-panel-card"
          style={{ border: `1px solid ${GOLD_MID}55` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 데스크톱: 좌측 탭 + 우측 상세 */}
          <div className="hidden lg:flex" style={{ minHeight: "520px" }}
          >
            {/* 좌측 탭 패널 */}
            <div
              className="flex flex-col dr-tab-sidebar"
              style={{ borderRight: `1px solid ${GOLD}44` }}
            >
              {/* 상단 브랜드 영역 */}
              <div
                className="px-5 py-7 border-b text-center"
                style={{ borderColor: `${GOLD}33` }}
              >
                <div className="font-montserrat tracking-[0.3em] uppercase mb-3 dr-brand-label">
                  {t.doctors.teamLabel}
                </div>
                <div className="dr-brand-count">
                  {t.doctors.specialistCount}
                </div>

              </div>

              {/* 의사 탭 목록 */}
              {/* [R15-P0-3] WAI-ARIA tablist (vertical) */}
              <div
                role="tablist"
                aria-orientation="vertical"
                aria-label={t.doctors.label}
                className="flex flex-col flex-1 justify-center"
              >
                {mergedDoctors.map((d) => {
                  const isActive = activeDoctor === d.id;
                  return (
                    <button type="button"
                      key={d.id}
                      role="tab"
                      id={`doctor-tab-${d.id}`}
                      aria-controls={`doctor-panel-${d.id}`}
                      aria-selected={activeDoctor === d.id}
                      tabIndex={activeDoctor === d.id ? 0 : -1}
                      onClick={() => handleDoctorSelect(d.id)}
                      onKeyDown={(e) => handleTabKeyDown(e, "vertical")}
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
                        className="dr-thumb-desktop"
                        style={{ border: isActive ? `2px solid ${GOLD}` : `2px solid ${GOLD}44` }}
                      >
                        <OptimizedImage
                          src={d.cardImage || d.image}
                          alt={d.name}
                          priority
                          usePicture={false}
                          onLoad={() => handleImageLoad(d.id)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: d.cardImagePosition || (d.cardImage ? "center top" : "top 10%"),
                          }}
                        />
                      </div>
                      {/* 이름/직책 */}
                      <div className="text-center">
                        <div
                          className="flex items-baseline justify-center gap-1.5"
                        >
                          <span
                            className="dr-tab-name-desktop"
                            style={{ color: isActive ? "#2c1f08" : "#5a3e16", fontWeight: isActive ? 700 : 500 }}
                          >
                            {d.name}
                          </span>
                          <span
                            className="dr-tab-badge-desktop"
                            style={{ color: isActive ? "#2c1f08" : "#5a3e16" }}
                          >
                            {badgeLabel}
                          </span>
                        </div>
                        {isActive && (
                          <div
                            className="dr-active-underline"
                            style={{ background: GOLD }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>


            </div>

            {/* 우측 상세 패널 */}
            {/* [R15-P0-3] WAI-ARIA tabpanel */}
            <div
              role="tabpanel"
              id={`doctor-panel-${activeDoctor}`}
              aria-labelledby={`doctor-tab-${activeDoctor}`}
              className="flex flex-1"
            >
              {/* 사진 영역 */}
              <div className="relative flex-shrink-0 dr-photo-panel">
                {mergedDoctors.map((d) => (
                  <OptimizedImage
                    key={d.id}
                    src={d.image}
                    alt={d.name}
                    priority
                    usePicture={false}
                    onLoad={() => handleImageLoad(d.id)}
                    className="dr-photo-img"
                    style={{
                      objectPosition: "top 0%",
                      opacity: activeDoctor === d.id ? 1 : 0,
                      zIndex: activeDoctor === d.id ? 1 : 0,
                    }}
                  />
                ))}
                {/* 우측 그라디언트 페이드 */}
                <div className="dr-photo-fade-right" />
                {/* 하단 그라디언트 */}
                <div className="dr-photo-fade-bottom" />
              </div>

              {/* 텍스트 상세 */}
              <div className="flex-1 p-12 flex flex-col gap-5 overflow-y-auto">
                {/* 이름 헤더 */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-baseline gap-3 flex-wrap" style={{marginTop: '23px'}}>
                      <h3 className="dr-name-h3-desktop">{doctor.name}</h3>
                      <span
                        className="font-montserrat"
                        style={{ color: GOLD, fontSize: '18px', fontWeight: 100, letterSpacing: "0.05em" }}
                      >
                        {doctor.nameEn}
                      </span>
                    </div>
                  </div>
                  <div className="dr-derm-badge dr-derm-badge-desktop">
                    {t.doctors.dermBadge.split('\n').map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>)}
                  </div>
                </div>

                {/* 골드 구분선 */}
                <div className="dr-gold-divider" style={{ background: `linear-gradient(to right, ${GOLD}33, transparent)` }} />

                {/* 소개 */}
                <div className="text-sm leading-relaxed dr-intro-desktop">
                  {doctor.intro && (Array.isArray(doctor.intro) ? (
                    doctor.intro.map((para, idx) => (
                      <p key={idx} style={{ margin: '0 0 1em 0', whiteSpace: 'normal', wordBreak: 'break-word' }}>{para}</p>
                    ))
                  ) : (
                    (doctor.intro as string).split('\n').map((line: string, idx: number, arr: string[]) => (
                      <React.Fragment key={idx}>
                        <p style={{ margin: '0 0 0.5em 0', whiteSpace: 'pre-wrap' }}>{line}</p>
                        {idx < arr.length - 1 && <div style={{ height: '0.5em' }} />}
                      </React.Fragment>
                    ))
                  ))}
                </div>

                {/* 전문 시술 태그 */}
                <div className="mb-8">
                  <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
                    <Zap size={18} style={{ color: GOLD }} />
                    <p
                      className="text-xs tracking-widest uppercase"
                      style={{ color: GOLD, fontWeight: 600, fontSize: '15px', margin: 0 }}
                    >
                      {t.doctors.specialtyTitle}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2" style={{marginTop: '-6px', maxWidth: '420px'}}>
                    {doctor.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 text-xs dr-specialty-chip-desktop"
                        style={{ background: GOLD_LIGHT, color: '#737373' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 구분선 */}
                <div className="dr-gold-divider" style={{ background: `linear-gradient(to right, ${GOLD}22, transparent)`, marginBottom: '32px' }} />

                {/* 학력·경력·자격 - 항상 펼침 */}
                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
                    <GraduationCap size={18} style={{ color: GOLD }} />
                    <p
                      className="text-xs tracking-widest uppercase"
                      style={{ color: GOLD, fontWeight: 600, fontSize: '15px', margin: 0 }}
                    >
                      {t.doctors.credentialsTitle}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {doctor.credentials.map((c) => {
                      const Icon = c.icon;
                      return (
                        <div
                          key={c.text}
                          className="dr-credentials-item-desktop"
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
            {/* [R15-P0-3] WAI-ARIA tablist (horizontal) */}
            <div
              role="tablist"
              aria-orientation="horizontal"
              aria-label={t.doctors.label}
              className="grid grid-cols-3"
              style={{ borderBottom: `1px solid ${GOLD}33` }}
            >
              {mergedDoctors.map((d) => {
                const isActive = activeDoctor === d.id;
                return (
                  <button type="button"
                    key={d.id}
                    role="tab"
                    id={`doctor-mob-tab-${d.id}`}
                    aria-controls={`doctor-mob-panel-${d.id}`}
                    aria-selected={activeDoctor === d.id}
                    tabIndex={activeDoctor === d.id ? 0 : -1}
                    onClick={() => handleDoctorSelect(d.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, "horizontal")}
                    className="flex flex-col items-center py-4 px-2 transition-all duration-300 relative"
                    style={{
                      background: isActive ? GOLD_LIGHT : "white",
                      borderBottom: isActive ? `2px solid ${GOLD}` : "2px solid transparent",
                    }}
                  >
                    {/* 썸네일 */}
                    <div
                      className="dr-thumb-mobile"
                      style={{ border: isActive ? `2px solid ${GOLD}` : "2px solid #e5e7eb" }}
                    >
                      <OptimizedImage
                        src={d.cardImage || d.image}
                        alt={d.name}
                        priority
                        usePicture={false}
                        onLoad={() => handleImageLoad(d.id)}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: d.cardImagePosition || (d.cardImage ? "center 15%" : "top 10%"),
                        }}
                      />
                    </div>

                    <div
                      className="text-center text-[0.78rem]"
                      style={{ color: isActive ? "#1a1a1a" : "#9CA3AF", fontWeight: isActive ? 700 : 400 }}
                    >
                      {d.name}
                    </div>
                    <div
                      className="text-center text-[0.62rem] mt-[1px]"
                      style={{ color: isActive ? GOLD : "#C4C4C4" }}
                    >
                      {badgeLabel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 모바일 상세 패널 */}
            {/* [R15-P0-3] WAI-ARIA tabpanel */}
            <div
              role="tabpanel"
              id={`doctor-mob-panel-${activeDoctor}`}
              aria-labelledby={`doctor-mob-tab-${activeDoctor}`}
            >
              {/* 사진 */}
              <div className="dr-mob-photo-wrap">
                {mergedDoctors.map((d) => (
                  <OptimizedImage
                    key={d.id}
                    src={d.mobileImage || d.image}
                    alt={d.name}
                    priority
                    usePicture={false}
                    onLoad={() => handleImageLoad(d.id)}
                    className="dr-photo-img"
                    style={{
                      objectPosition: d.mobileObjectPosition || "center 15%",
                      opacity: activeDoctor === d.id ? 1 : 0,
                      zIndex: activeDoctor === d.id ? 1 : 0,
                    }}
                  />
                ))}
                {/* 하단 그라디언트 오버레이 */}
                <div className="dr-mob-photo-fade" />
              </div>

              {/* 텍스트 */}
              <div className="p-5 flex flex-col gap-4">
                {/* 이름 헤더 */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="dr-mob-name-h3">{doctor.name}</h3>
                    <p className="font-montserrat mt-0.5" style={{ color: GOLD, fontSize: "0.75rem", fontWeight: 400 }}>
                      {doctor.nameEn}
                    </p>
                  </div>
                  <div className="dr-derm-badge dr-derm-badge-mobile">
                    {t.doctors.dermBadge.split('\n').map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>)}
                  </div>
                </div>

                {/* 골드 구분선 */}
                <div className="dr-gold-divider" style={{ background: `linear-gradient(to right, ${GOLD}33, transparent)` }} />

                {/* 소개 */}
                <div className="text-sm leading-relaxed dr-intro-mobile">
                  {Array.isArray(doctor.intro) ? (
                    doctor.intro.map((para, idx) => (
                      <p key={idx} style={{ margin: '0 0 1em 0', whiteSpace: 'normal', wordBreak: 'break-word' }}>{para}</p>
                    ))
                  ) : (
                    <p>{doctor.intro}</p>
                  )}
                </div>

                {/* 전문 시술 태그 */}
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: GOLD, fontWeight: 600 }}>
                    {t.doctors.specialtyTitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 text-xs font-semibold dr-specialty-chip-mobile"
                        style={{ background: GOLD_LIGHT, color: "#8B6914", border: `1px solid ${GOLD}44` }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 학력·경력·자격 */}
                <div
                  className="dr-credentials-accordion"
                  style={{ border: `1px solid ${GOLD}33` }}
                >
                  <button type="button"
                    onClick={toggleCredentials}
                    aria-expanded={expandedCredentials}
                    aria-label={expandedCredentials
                      ? t.doctors.collapseCredentialsLabel!
                      : t.doctors.expandCredentialsLabel!}
                    className="w-full flex items-center justify-between px-4 py-3"
                    style={{
                      background: expandedCredentials ? GOLD_LIGHT : "#FAFAFA",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span className="text-xs font-bold tracking-wider" style={{ color: "#666" }}>
                      {`${t.doctors.credentialsTitle} (${doctor.credentials.length})`}
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
                            className="flex items-start gap-2 py-1.5 px-2 rounded-lg dr-credentials-item-mobile"
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
                  <p className="text-xs dr-dot-hint">
                    {t.doctors.swipeHint}
                  </p>
                  <div className="flex justify-center gap-2">
                    {doctors.map((d) => (
                      <button type="button"
                        key={d.id}
                        onClick={() => handleDoctorSelect(d.id)}
                        aria-label={(t.doctors.dotNavLabel ?? "").replace("{name}", doctors[d.id]?.name ?? String(d.id + 1))}
                        aria-current={activeDoctor === d.id ? "true" : undefined}
                        className="border-none cursor-pointer rounded-[3px] transition-all duration-300"
                        style={{
                          width: activeDoctor === d.id ? "24px" : "6px",
                          height: "6px",
                          background: activeDoctor === d.id ? GOLD : "#D1D5DB",
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

// [FM-P2-4] memo: 언어 컨텍스트 변경 외 리렌더 차단
export default memo(DoctorsSection);

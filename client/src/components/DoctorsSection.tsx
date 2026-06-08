/**
 * DoctorsSection - 의료진 소개 (프리미엄 리디자인)
 * - 메인 컬러 #d2ac67 (골드)
 * - 카드 선택 + 상세 패널이 하나의 섹션으로 자연스럽게 연결
 * - 고급스러운 레이아웃: 좌측 세로 탭 + 우측 상세 정보
 *
 * [R13-P1-2] 뷰모델 로직 분리:
 * - 상태/핸들러/locale merge → hooks/useDoctorViewModel.ts
 * - DoctorsSection은 렌더링만 담당
 *
 * [R17-P0-3] 인라인 style 51곳 → CSS 클래스/data attribute 교체
 * - GOLD/GOLD_LIGHT/GOLD_MID 상수 import 제거 (CSS 변수 --dr-gold 등으로 이관)
 * - isActive 조건부 스타일 → data-active attribute + CSS 선택자
 * - objectPosition (데이터 기반) → 인라인 style 유지 (데이터 주도 값)
 * - opacity/zIndex (activeDoctor 비교) → Tailwind conditional class
 */
// [FM-P2-4] React.memo: 의료진 섹션은 언어 변경 시만 리렌더 필요
import React, { memo } from "react";
import { ChevronDown, Zap, GraduationCap } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";
// [R12-P1-2] 데이터/표현 분리: 의료진 데이터는 lib/doctors-data.ts에서 관리
// [R17-P0-3] GOLD/GOLD_LIGHT/GOLD_MID 상수 제거 — CSS 변수 --dr-gold 등으로 이관
import { doctors } from "@/lib/doctors-data";
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
          <p className="font-montserrat text-xs tracking-[0.3em] mb-3 uppercase dr-section-eyebrow">
            {t.doctors.label}
          </p>
          <h2 className="mb-3 dr-section-title">
            {t.doctors.title}
          </h2>
          <p className="text-sm leading-snug sm:leading-normal dr-section-tagline">
            {t.doctors.tagline}
          </p>
        </div>

        {/* ── 메인 패널: 좌측 의사 탭 + 우측 상세 ── */}
        <div
          className="rounded-3xl overflow-hidden dr-panel-card dr-panel-border"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 데스크톱: 좌측 탭 + 우측 상세 */}
          <div className="hidden lg:flex dr-desktop-panel">
            {/* 좌측 탭 패널 */}
            <div className="flex flex-col dr-tab-sidebar dr-tab-sidebar-border">
              {/* 상단 브랜드 영역 */}
              <div className="px-5 py-7 border-b text-center dr-brand-border">
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
                      data-active={String(isActive)}
                      className="flex flex-col items-center gap-3 px-4 py-5 transition-all duration-300 relative w-full dr-tab-btn dr-tab-btn-border"
                    >
                      {/* 썸네일 */}
                      <div
                        className="dr-thumb-desktop dr-thumb-border"
                        data-active={String(isActive)}
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
                        <div className="flex items-baseline justify-center gap-1.5">
                          <span
                            className="dr-tab-name-desktop"
                            data-active={String(isActive)}
                          >
                            {d.name}
                          </span>
                          <span
                            className="dr-tab-badge-desktop"
                            data-active={String(isActive)}
                          >
                            {badgeLabel}
                          </span>
                        </div>
                        {isActive && (
                          <div className="dr-active-underline" />
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
                    className={`dr-photo-img ${activeDoctor === d.id ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
                    style={{ objectPosition: "top 0%" }}
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
                    <div className="flex items-baseline gap-3 flex-wrap dr-name-header">
                      <h3 className="dr-name-h3-desktop">{doctor.name}</h3>
                      <span className="font-montserrat dr-name-en">
                        {doctor.nameEn}
                      </span>
                    </div>
                  </div>
                  <div className="dr-derm-badge dr-derm-badge-desktop">
                    {t.doctors.dermBadge.split('\n').map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>)}
                  </div>
                </div>

                {/* 골드 구분선 */}
                <div className="dr-gold-divider dr-gold-divider-strong" />

                {/* 소개 */}
                <div className="text-sm leading-relaxed dr-intro-desktop">
                  {doctor.intro && (Array.isArray(doctor.intro) ? (
                    doctor.intro.map((para, idx) => (
                      <p key={idx} className="dr-intro-para">{para}</p>
                    ))
                  ) : (
                    (doctor.intro as string).split('\n').map((line: string, idx: number, arr: string[]) => (
                      <React.Fragment key={idx}>
                        <p className="dr-intro-para-pre">{line}</p>
                        {idx < arr.length - 1 && <div className="dr-intro-spacer" />}
                      </React.Fragment>
                    ))
                  ))}
                </div>

                {/* 전문 시술 태그 */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 dr-sub-header-wrap">
                    <Zap size={18} className="dr-sub-header-icon" />
                    <p className="text-xs tracking-widest uppercase dr-sub-header-text">
                      {t.doctors.specialtyTitle}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 dr-specialty-wrap">
                    {doctor.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 text-xs dr-specialty-chip-desktop"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 구분선 */}
                <div className="dr-gold-divider dr-gold-divider-light" />

                {/* 학력·경력·자격 - 항상 펼침 */}
                <div>
                  <div className="flex items-center gap-2 dr-sub-header-wrap">
                    <GraduationCap size={18} className="dr-sub-header-icon" />
                    <p className="text-xs tracking-widest uppercase dr-sub-header-text">
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
                        >
                          <Icon size={14} className="dr-credentials-icon" />
                          <span className="text-xs leading-relaxed dr-credentials-text-desktop">
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
              className="grid grid-cols-3 dr-mob-tablist-border"
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
                    data-active={String(isActive)}
                    className="flex flex-col items-center py-4 px-2 transition-all duration-300 relative dr-mob-tab-btn"
                  >
                    {/* 썸네일 */}
                    <div
                      className="dr-thumb-mobile dr-mob-thumb-border"
                      data-active={String(isActive)}
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
                      className="text-center text-[0.78rem] dr-mob-tab-name"
                      data-active={String(isActive)}
                    >
                      {d.name}
                    </div>
                    <div
                      className="text-center text-[0.62rem] mt-[1px] dr-mob-tab-badge"
                      data-active={String(isActive)}
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
                    className={`dr-photo-img ${activeDoctor === d.id ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
                    style={{ objectPosition: d.mobileObjectPosition || "center 15%" }}
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
                    <p className="font-montserrat mt-0.5 dr-mob-name-en">
                      {doctor.nameEn}
                    </p>
                  </div>
                  <div className="dr-derm-badge dr-derm-badge-mobile">
                    {t.doctors.dermBadge.split('\n').map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>)}
                  </div>
                </div>

                {/* 골드 구분선 */}
                <div className="dr-gold-divider dr-gold-divider-strong" />

                {/* 소개 */}
                <div className="text-sm leading-relaxed dr-intro-mobile">
                  {Array.isArray(doctor.intro) ? (
                    doctor.intro.map((para, idx) => (
                      <p key={idx} className="dr-intro-para">{para}</p>
                    ))
                  ) : (
                    <p>{doctor.intro}</p>
                  )}
                </div>

                {/* 전문 시술 태그 */}
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2 dr-mob-specialty-title">
                    {t.doctors.specialtyTitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 text-xs font-semibold dr-specialty-chip-mobile"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 학력·경력·자격 */}
                <div className="dr-credentials-accordion dr-accordion-border">
                  <button type="button"
                    onClick={toggleCredentials}
                    aria-expanded={expandedCredentials}
                    aria-label={expandedCredentials
                      ? t.doctors.collapseCredentialsLabel!
                      : t.doctors.expandCredentialsLabel!}
                    data-expanded={String(expandedCredentials)}
                    className="w-full flex items-center justify-between px-4 py-3 dr-accordion-btn"
                  >
                    <span className="text-xs font-bold tracking-wider dr-accordion-label">
                      {`${t.doctors.credentialsTitle} (${doctor.credentials.length})`}
                    </span>
                    <div
                      className="dr-accordion-chevron"
                      data-expanded={String(expandedCredentials)}
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
                            <Icon size={13} className="dr-credentials-icon-mobile" />
                            <span className="text-xs leading-relaxed dr-credentials-text-mobile">
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
                        data-active={String(activeDoctor === d.id)}
                        className="dr-dot-nav"
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

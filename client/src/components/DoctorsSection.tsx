// DoctorsSection - 의료진 소개 (조립자 역할)
// [P1-PERF] isLoading 상태 완전 제거: deferMount로 뷰포트 근처에서만 마운트되므로
//           내부 가짜 타이머/스켈레톤 불필요. 마운트 즉시 콘텐츠 렌더링.
import React, { memo } from "react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useDoctorViewModel } from "@/hooks/useDoctorViewModel";
import { DoctorDesktopLayout } from "./doctors/DoctorDesktopLayout";
import { DoctorMobileLayout } from "./doctors/DoctorMobileLayout";

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
  const sectionRef = useSectionReveal(60);

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
            {t.doctors.teamLabel ?? t.doctors.label}
          </p>
          <h2 className="mb-3 dr-section-title">{t.doctors.title}</h2>
          <p className="text-sm leading-snug sm:leading-normal dr-section-tagline">
            {t.doctors.tagline}
          </p>
        </div>

        {/* ── 메인 패널 ── */}
        <div
          className="rounded-3xl overflow-hidden dr-panel-card dr-panel-border"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 데스크톱 레이아웃 (lg 이상) */}
          <DoctorDesktopLayout
            mergedDoctors={mergedDoctors}
            doctor={doctor}
            activeDoctor={activeDoctor}
            badgeLabel={badgeLabel}
            t={t}
            onSelect={handleDoctorSelect}
            onKeyDown={(e) => handleTabKeyDown(e, "vertical")}
            onImageLoad={handleImageLoad}
          />

          {/* 모바일 레이아웃 (lg 미만) */}
          <DoctorMobileLayout
            mergedDoctors={mergedDoctors}
            doctor={doctor}
            activeDoctor={activeDoctor}
            badgeLabel={badgeLabel}
            t={t}
            expandedCredentials={expandedCredentials}
            onSelect={handleDoctorSelect}
            onKeyDown={(e) => handleTabKeyDown(e, "horizontal")}
            onImageLoad={handleImageLoad}
            onToggleCredentials={toggleCredentials}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(DoctorsSection);

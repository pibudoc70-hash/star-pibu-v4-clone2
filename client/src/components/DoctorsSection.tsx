/**
 * DoctorsSection - 의료진 소개 (프리미엄 리디자인)
 *
 * [R13-P1-2] 뷰모델 로직 분리: hooks/useDoctorViewModel.ts
 * [R17-P0-3] 인라인 style → CSS 클래스/data attribute 교체
 * [R18-P0-3] swipe 로직 → useDoctorSwipe 훅으로 분리
 * [R19-P0-2] 서브컴포넌트 분리:
 *   - DoctorTabButton: 데스크톱/모바일 공통 탭 버튼
 *   - DoctorDesktopLayout: 데스크톱 전용 패널 (좌측 탭 + 우측 상세)
 *   - DoctorMobileLayout: 모바일 전용 패널 (상단 탭 + 하단 상세)
 *   - DoctorCredentials: 학력/경력 공통 컴포넌트
 *
 * DoctorsSection은 조립자(assembler) 역할만 담당한다.
 */
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

// [FM-P2-4] memo: 언어 컨텍스트 변경 외 리렌더 차단
export default memo(DoctorsSection);

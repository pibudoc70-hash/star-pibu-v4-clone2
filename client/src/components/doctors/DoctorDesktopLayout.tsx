/**
 * DoctorDesktopLayout
 *
 * [R19-P0-2] DoctorsSection 서브컴포넌트 분리
 * - 데스크톱 전용 레이아웃: 좌측 세로 탭 사이드바 + 우측 상세 패널
 * - lg:flex hidden 으로 DoctorsSection에서 조건부 렌더링
 */
import React from "react";
import { Zap } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { DoctorTabButton } from "./DoctorTabButton";
import { DoctorCredentials } from "./DoctorCredentials";
import type { DoctorViewModel } from "@/hooks/useDoctorViewModel";
import type { I18nContent } from "@/lib/i18n.types";

interface DoctorDesktopLayoutProps {
  mergedDoctors: DoctorViewModel[];
  doctor: DoctorViewModel;
  activeDoctor: number;
  badgeLabel: string;
  t: I18nContent;
  onSelect: (id: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onImageLoad: (id: number) => void;
}

export function DoctorDesktopLayout({
  mergedDoctors,
  doctor,
  activeDoctor,
  badgeLabel,
  t,
  onSelect,
  onKeyDown,
  onImageLoad,
}: DoctorDesktopLayoutProps) {
  return (
    <div className="hidden lg:flex dr-desktop-panel">
      {/* 좌측 탭 사이드바 */}
      <div className="flex flex-col dr-tab-sidebar dr-tab-sidebar-border">
        {/* 상단 브랜드 영역 */}
        <div className="px-5 py-7 border-b text-center dr-brand-border">
          <p className="font-montserrat text-[0.6rem] tracking-[0.25em] uppercase dr-brand-label">
            STAR DERMATOLOGY
          </p>
          <p className="text-[0.6rem] mt-0.5 dr-brand-sub">
            {t.doctors.label}
          </p>
        </div>
        {/* 탭 목록 */}
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={t.doctors.label}
          className="flex flex-col flex-1 justify-center"
        >
          {mergedDoctors.map((d) => (
            <DoctorTabButton
              key={d.id}
              doctor={d}
              isActive={activeDoctor === d.id}
              variant="desktop"
              badgeLabel={badgeLabel}
              onSelect={onSelect}
              onKeyDown={onKeyDown}
            />
          ))}
        </div>
      </div>

      {/* 우측 상세 패널 */}
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
              onLoad={() => onImageLoad(d.id)}
              className={`dr-photo-img ${activeDoctor === d.id ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
              style={{ objectPosition: "top 0%" }}
            />
          ))}
          <div className="dr-photo-fade-right" />
          <div className="dr-photo-fade-bottom" />
        </div>

        {/* 텍스트 상세 */}
        <div className="flex-1 p-12 flex flex-col gap-5 overflow-y-auto">
          {/* 이름 헤더 */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-3 flex-wrap dr-name-header">
                <h3 className="dr-name-h3-desktop">{doctor.name}</h3>
                <span className="font-montserrat dr-name-en">{doctor.nameEn}</span>
              </div>
            </div>
            <div className="dr-derm-badge dr-derm-badge-desktop">
              {t.doctors.dermBadge.split("\n").map((line, i) =>
                i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>
              )}
            </div>
          </div>

          {/* 소개 */}
          <div className="text-sm leading-relaxed dr-intro-desktop">
            {Array.isArray(doctor.intro) ? (
              doctor.intro.map((para, idx) => (
                <p key={idx} className="dr-intro-para">{para}</p>
              ))
            ) : (
              <p>{doctor.intro as string}</p>
            )}
          </div>

          {/* 전문 시술 태그 */}
          <div>
            <div className="flex items-center gap-2 mb-3 dr-sub-header-wrap">
              <Zap size={16} className="dr-sub-header-icon" />
              <p className="text-xs tracking-widest uppercase dr-sub-header-text">
                {t.doctors.specialtyTitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 dr-specialty-wrap">
              {doctor.specialties.map((s) => (
                <span key={s} className="px-3 py-1.5 text-xs dr-specialty-chip-desktop">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <div className="dr-gold-divider dr-gold-divider-light" />

          {/* 학력·경력·자격 */}
          <DoctorCredentials
            doctor={doctor}
            variant="desktop"
            credentialsTitle={t.doctors.credentialsTitle}
          />
        </div>
      </div>
    </div>
  );
}

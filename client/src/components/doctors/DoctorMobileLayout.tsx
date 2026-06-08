/**
 * DoctorMobileLayout
 *
 * [R19-P0-2] DoctorsSection 서브컴포넌트 분리
 * - 모바일 전용 레이아웃: 상단 수평 탭 그리드 + 하단 상세 패널
 * - lg:hidden 으로 DoctorsSection에서 조건부 렌더링
 */
import React from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { DoctorTabButton } from "./DoctorTabButton";
import { DoctorCredentials } from "./DoctorCredentials";
import type { DoctorViewModel } from "@/hooks/useDoctorViewModel";
import type { I18nContent } from "@/lib/i18n.types";
import { doctors } from "@/lib/doctors-data";

interface DoctorMobileLayoutProps {
  mergedDoctors: DoctorViewModel[];
  doctor: DoctorViewModel;
  activeDoctor: number;
  badgeLabel: string;
  t: I18nContent;
  expandedCredentials: boolean;
  onSelect: (id: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onImageLoad: (id: number) => void;
  onToggleCredentials: () => void;
}

export function DoctorMobileLayout({
  mergedDoctors,
  doctor,
  activeDoctor,
  badgeLabel,
  t,
  expandedCredentials,
  onSelect,
  onKeyDown,
  onImageLoad,
  onToggleCredentials,
}: DoctorMobileLayoutProps) {
  return (
    <div className="lg:hidden">
      {/* 모바일 탭 헤더 */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        aria-label={t.doctors.label}
        className="grid grid-cols-3 dr-mob-tablist-border"
      >
        {mergedDoctors.map((d) => (
          <DoctorTabButton
            key={d.id}
            doctor={d}
            isActive={activeDoctor === d.id}
            variant="mobile"
            badgeLabel={badgeLabel}
            onSelect={onSelect}
            onKeyDown={onKeyDown}
          />
        ))}
      </div>

      {/* 모바일 상세 패널 */}
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
              onLoad={() => onImageLoad(d.id)}
              className={`dr-mob-photo-img ${activeDoctor === d.id ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
              style={{ objectPosition: d.mobileObjectPosition || "center 15%" }}
            />
          ))}
          <div className="dr-mob-photo-fade" />
        </div>

        {/* 텍스트 */}
        <div className="p-5 flex flex-col gap-4">
          {/* 이름 헤더 */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="dr-mob-name-h3">{doctor.name}</h3>
              <p className="font-montserrat mt-0.5 dr-mob-name-en">{doctor.nameEn}</p>
            </div>
            <img
              src="/manus-storage/derm-specialist-badge_9b9bcf96.png"
              alt={t.doctors.dermBadge.replace("\n", " ")}
              className="dr-derm-badge-img dr-derm-badge-img-mobile"
              draggable={false}
            />
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
              <p>{doctor.intro as string}</p>
            )}
          </div>

          {/* 전문 시술 태그 */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-2 dr-mob-specialty-title">
              {t.doctors.specialtyTitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map((s) => (
                <span key={s} className="px-3 py-1.5 text-xs font-semibold dr-specialty-chip-mobile">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* 학력·경력·자격 */}
          <DoctorCredentials
            doctor={doctor}
            variant="mobile"
            credentialsTitle={t.doctors.credentialsTitle}
            expanded={expandedCredentials}
            onToggle={onToggleCredentials}
            collapseLabel={t.doctors.collapseCredentialsLabel}
            expandLabel={t.doctors.expandCredentialsLabel}
          />

          {/* 스와이프 힌트 */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <p className="text-xs dr-dot-hint">{t.doctors.swipeHint}</p>
            <div className="flex justify-center gap-2">
              {doctors.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => onSelect(d.id)}
                  aria-label={(t.doctors.dotNavLabel ?? "").replace(
                    "{name}",
                    doctors[d.id]?.name ?? String(d.id + 1)
                  )}
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
  );
}

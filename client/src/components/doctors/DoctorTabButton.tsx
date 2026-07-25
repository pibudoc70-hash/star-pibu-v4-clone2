/**
 * DoctorTabButton
 *
 * [R19-P0-2] DoctorsSection 서브컴포넌트 분리
 * - 데스크톱(vertical) / 모바일(horizontal) 탭 버튼 공통 컴포넌트
 * - variant prop으로 레이아웃 차이를 처리하고 마크업 이원화 제거
 */
import React from "react";
import OptimizedImage from "@/components/OptimizedImage";
import type { DoctorViewModel } from "@/hooks/useDoctorViewModel";

interface DoctorTabButtonProps {
  doctor: DoctorViewModel;
  isActive: boolean;
  variant: "desktop" | "mobile";
  badgeLabel: string;
  onSelect: (id: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function DoctorTabButton({
  doctor,
  isActive,
  variant,
  badgeLabel,
  onSelect,
  onKeyDown,
}: DoctorTabButtonProps) {
  const isDesktop = variant === "desktop";
  const tabIdPrefix = isDesktop ? "doctor-tab" : "doctor-mob-tab";
  const panelIdPrefix = isDesktop ? "doctor-panel" : "doctor-mob-panel";

  return (
    <button
      type="button"
      role="tab"
      id={`${tabIdPrefix}-${doctor.id}`}
      aria-controls={`${panelIdPrefix}-${doctor.id}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      aria-label={doctor.name}
      onClick={() => onSelect(doctor.id)}
      onKeyDown={onKeyDown}
      data-active={String(isActive)}
      className={
        isDesktop
          ? "flex flex-col items-center gap-3 px-4 py-5 transition-all duration-300 relative w-full dr-tab-btn dr-tab-btn-border"
          : "flex flex-col items-center py-4 px-2 transition-all duration-300 relative dr-mob-tab-btn"
      }
    >
      {/* 썸네일 */}
      <div
        className={isDesktop ? "dr-thumb-desktop dr-thumb-border" : "dr-thumb-mobile dr-mob-thumb-border"}
        data-active={String(isActive)}
      >
        <OptimizedImage
          src={doctor.cardImage || doctor.image}
          alt={doctor.name}
          priority={isActive}
          usePicture={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: doctor.cardImagePosition || (doctor.cardImage ? "center top" : "top 10%"),
          }}
        />
      </div>

      {/* 이름 / 배지 */}
      {isDesktop ? (
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="dr-tab-name-desktop whitespace-nowrap" data-active={String(isActive)}>
              {doctor.name}
            </span>
            <span className="dr-tab-badge-desktop" data-active={String(isActive)}>
              {badgeLabel}
            </span>
          </div>
          {isActive && <div className="dr-active-underline" />}
        </div>
      ) : (
        <>
          <div
            className="text-center text-[0.78rem] dr-mob-tab-name"
            data-active={String(isActive)}
          >
            {doctor.name}
          </div>
          <div
            className="text-center text-[0.62rem] mt-[1px] dr-mob-tab-badge"
            data-active={String(isActive)}
          >
            {badgeLabel}
          </div>
        </>
      )}
    </button>
  );
}

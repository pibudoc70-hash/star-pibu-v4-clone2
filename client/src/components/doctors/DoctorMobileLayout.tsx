/**
 * DoctorMobileLayout
 *
 * [R20] 모바일 의료진 슬라이더 리디자인
 * - 상단 탭 그리드 제거 → 카드 전체(사진+정보)가 좌우 슬라이드
 * - CSS transform translateX 기반 슬라이더 (Embla 미사용)
 * - 하단 dot indicator + 좌우 화살표 버튼
 * - 기존 useDoctorSwipe 터치 스와이프 훅 그대로 활용
 */
import React, { useRef } from "react";
import OptimizedImage from "@/components/OptimizedImage";
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
  const total = mergedDoctors.length;

  const goPrev = () => onSelect((activeDoctor - 1 + total) % total);
  const goNext = () => onSelect((activeDoctor + 1) % total);

  // 터치 스와이프 (DoctorsSection에서 onTouchStart/End 이미 처리 중이므로 여기서는 별도 처리 불필요)

  return (
    <div className="lg:hidden">
      {/* ── 슬라이더 뷰포트 ── */}
      <div className="relative overflow-hidden">
        {/* 슬라이드 트랙 */}
        <div
          className="flex transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${activeDoctor * 100}%)` }}
        >
          {mergedDoctors.map((d) => (
            <div
              key={d.id}
              className="w-full flex-shrink-0"
              role="tabpanel"
              id={`doctor-mob-panel-${d.id}`}
              aria-labelledby={`doctor-mob-tab-${d.id}`}
              aria-hidden={activeDoctor !== d.id}
            >
              {/* 사진 */}
              <div className="dr-mob-photo-wrap">
                <OptimizedImage
                  src={d.mobileImage || d.image}
                  alt={d.name}
                  priority
                  usePicture={false}
                  onLoad={() => onImageLoad(d.id)}
                  className="dr-mob-photo-img opacity-100 z-[1]"
                  style={{ objectPosition: d.mobileObjectPosition || "center 15%" }}
                />
                <div className="dr-mob-photo-fade" />
              </div>

              {/* 텍스트 */}
              <div className="p-5 flex flex-col gap-4">
                {/* 이름 헤더 */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="dr-mob-name-h3">{d.name}</h3>
                    <p className="font-montserrat mt-0.5 dr-mob-name-en">{d.nameEn}</p>
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
                  {Array.isArray(d.intro) ? (
                    d.intro.map((para, idx) => (
                      <p key={idx} className="dr-intro-para">{para}</p>
                    ))
                  ) : (
                    <p>{d.intro as string}</p>
                  )}
                </div>

                {/* 전문 시술 태그 */}
                <div>
                  <p className="text-xs tracking-widest uppercase mb-2 dr-mob-specialty-title">
                    {t.doctors.specialtyTitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {d.specialties.map((s) => (
                      <span key={s} className="px-3 py-1.5 text-xs font-semibold dr-specialty-chip-mobile">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 학력·경력·자격 (활성 슬라이드만 렌더) */}
                {activeDoctor === d.id && (
                  <DoctorCredentials
                    doctor={d}
                    variant="mobile"
                    credentialsTitle={t.doctors.credentialsTitle}
                    expanded={expandedCredentials}
                    onToggle={onToggleCredentials}
                    collapseLabel={t.doctors.collapseCredentialsLabel}
                    expandLabel={t.doctors.expandCredentialsLabel}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 좌우 화살표 버튼 (사진 위 오버레이) */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="이전 의료진"
          className="absolute left-3 top-[120px] z-10 w-9 h-9 rounded-full flex items-center justify-center dr-slider-arrow"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="다음 의료진"
          className="absolute right-3 top-[120px] z-10 w-9 h-9 rounded-full flex items-center justify-center dr-slider-arrow"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Dot Indicator + 이름 네비게이션 ── */}
      <div className="flex flex-col items-center gap-3 py-5 border-t dr-mob-tablist-border">
        {/* 의사 이름 버튼 목록 */}
        <div className="flex justify-center gap-4">
          {mergedDoctors.map((d) => (
            <button
              type="button"
              key={d.id}
              role="tab"
              id={`doctor-mob-tab-${d.id}`}
              aria-controls={`doctor-mob-panel-${d.id}`}
              aria-selected={activeDoctor === d.id}
              onClick={() => onSelect(d.id)}
              onKeyDown={onKeyDown}
              className="flex flex-col items-center gap-1.5 px-3 py-1 transition-all duration-200"
            >
              <div
                className="dr-thumb-mobile dr-mob-thumb-border"
                data-active={String(activeDoctor === d.id)}
              >
                <OptimizedImage
                  src={d.cardImage || d.image}
                  alt={d.name}
                  priority
                  usePicture={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: d.cardImagePosition || "center top",
                  }}
                />
              </div>
              <span
                className="text-[0.7rem] dr-mob-tab-name whitespace-nowrap"
                data-active={String(activeDoctor === d.id)}
              >
                {d.name}
              </span>
            </button>
          ))}
        </div>

        {/* Dot indicator */}
        <div className="flex justify-center items-center gap-2">
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
  );
}

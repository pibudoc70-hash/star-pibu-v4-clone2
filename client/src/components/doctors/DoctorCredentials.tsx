/**
 * DoctorCredentials
 *
 * [R19-P0-2] DoctorsSection 서브컴포넌트 분리
 * - 학력·경력·자격 표시 컴포넌트
 * - variant="desktop": 항상 펼침 그리드 레이아웃
 * - variant="mobile": 아코디언 토글 레이아웃
 */
import React from "react";
import { ChevronDown, GraduationCap } from "lucide-react";
import type { DoctorViewModel } from "@/hooks/useDoctorViewModel";

interface DoctorCredentialsProps {
  doctor: DoctorViewModel;
  variant: "desktop" | "mobile";
  credentialsTitle: string;
  expanded?: boolean;
  onToggle?: () => void;
  collapseLabel?: string;
  expandLabel?: string;
}

export function DoctorCredentials({
  doctor,
  variant,
  credentialsTitle,
  expanded,
  onToggle,
  collapseLabel,
  expandLabel,
}: DoctorCredentialsProps) {
  if (variant === "desktop") {
    return (
      <div>
        <div className="flex items-center gap-2 dr-sub-header-wrap">
          <GraduationCap size={18} className="dr-sub-header-icon" />
          <p className="text-xs tracking-widest uppercase dr-sub-header-text">
            {credentialsTitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {doctor.credentials.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.text} className="dr-credentials-item-desktop">
                <Icon size={14} className="dr-credentials-icon" />
                <span className="text-xs leading-relaxed dr-credentials-text-desktop">
                  {c.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // mobile: accordion
  return (
    <div className="dr-credentials-accordion dr-accordion-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={expanded ? collapseLabel : expandLabel}
        data-expanded={String(expanded)}
        className="w-full flex items-center justify-between px-4 py-3 dr-accordion-btn"
      >
        <span className="text-xs font-bold tracking-wider dr-accordion-label">
          {`${credentialsTitle} (${doctor.credentials.length})`}
        </span>
        <div className="dr-accordion-chevron" data-expanded={String(expanded)}>
          <ChevronDown size={16} />
        </div>
      </button>
      {expanded && (
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
  );
}

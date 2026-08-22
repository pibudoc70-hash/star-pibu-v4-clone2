/**
 * DoctorCredentials
 *
 * [R19-P0-2] DoctorsSection 서브컴포넌트 분리
 * - 학력·경력·자격 표시 컴포넌트
 * - variant="desktop": 항상 펼침 그리드 레이아웃
 * - variant="mobile": 아코디언 토글 레이아웃
 */
import React from "react";
import { BookOpen, ChevronDown, ExternalLink, GraduationCap } from "lucide-react";
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

function DoctorResearchActivities({ doctor }: Pick<DoctorCredentialsProps, "doctor">) {
  if (!doctor.researchActivities || doctor.researchActivities.length === 0) return null;

  return (
    <details className="group mt-5 rounded-xl border border-stone-200 bg-stone-50/70 open:bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-stone-800 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d2ac67] focus-visible:ring-inset">
        <BookOpen size={16} aria-hidden="true" className="text-[#b8924c]" />
        <span>연구·발표 및 연수 활동</span>
        <ChevronDown size={16} aria-hidden="true" className="ml-auto transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="space-y-3 border-t border-stone-200 px-4 py-4">
        {doctor.researchActivities.map((activity) => (
          <article key={`${activity.sourceUrl}-${activity.title}`} className="border-l-2 border-[#d2ac67]/70 pl-3">
            <h4 className="text-sm font-semibold text-stone-800">{activity.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">{activity.detail}</p>
            <a href={activity.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8f6b31] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d2ac67]">
              {activity.sourceLabel}<ExternalLink size={12} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </details>
  );
}

export function DoctorCredentials({
  doctor,
  variant,
  credentialsTitle,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
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
        <DoctorResearchActivities doctor={doctor} />
      </div>
    );
  }

  // mobile: credentials stay visible; research remains the only disclosure.
  return (
    <div className="dr-credentials-accordion dr-accordion-border">
      <div className="flex items-center justify-between px-4 py-3 dr-accordion-btn">
        <span className="text-xs font-bold tracking-wider dr-accordion-label">
          {credentialsTitle}
        </span>
        <span className="text-xs text-stone-500">{doctor.credentials.length}</span>
      </div>
      <div className="px-4 py-4 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
        {doctor.credentials.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.text}
              className="flex items-start gap-2.5 py-3 px-3 rounded-lg dr-credentials-item-mobile"
            >
              <Icon size={15} className="dr-credentials-icon-mobile" />
              <span className="dr-credentials-text-mobile">
                {c.text}
              </span>
            </div>
          );
        })}
      </div>
      <DoctorResearchActivities doctor={doctor} />
    </div>
  );
}

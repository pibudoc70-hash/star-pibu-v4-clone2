/**
 * SkeletonSection.tsx
 * 브랜드 컬러(#FAF8F5 / #F0EAE0 / #E8E0D5) 기반 shimmer 스켈레톤 컴포넌트 모음
 * 각 섹션의 실제 레이아웃을 모방하여 레이아웃 시프트 최소화
 */
import { cn } from "@/lib/utils";

// ── 기본 shimmer 블록 ────────────────────────────────────────────────────────
interface SkeletonBlockProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SkeletonBlock({ className, style }: SkeletonBlockProps) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-md", className)}
      style={style}
      aria-hidden="true"
    />
  );
}

// ── 섹션 헤더 스켈레톤 (eyebrow + title + subtitle) ──────────────────────────
export function SectionHeaderSkeleton({ centered = true }: { centered?: boolean }) {
  return (
    <div className={cn("mb-12 md:mb-16", centered && "text-center flex flex-col items-center")} aria-hidden="true">
      <SkeletonBlock className="h-3 w-24 mb-4" style={{ borderRadius: 2 }} />
      <SkeletonBlock className="h-8 w-64 mb-4" />
      <SkeletonBlock className="h-4 w-80" />
    </div>
  );
}

// ── 카드 스켈레톤 (이미지 + 텍스트 3줄) ──────────────────────────────────────
export function CardSkeleton({ imageHeight = 200 }: { imageHeight?: number }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--brand-bg-alt, #F5F0EB)" }} aria-hidden="true">
      <SkeletonBlock style={{ height: imageHeight }} />
      <div className="p-5 space-y-3">
        <SkeletonBlock className="h-3 w-1/3" />
        <SkeletonBlock className="h-5 w-4/5" />
        <SkeletonBlock className="h-4 w-3/5" />
      </div>
    </div>
  );
}

// ── 이벤트 섹션 스켈레톤 ──────────────────────────────────────────────────────
export function EventsSectionSkeleton() {
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--brand-bg, #FAF8F5)" }} aria-busy="true" aria-label="이벤트 로딩 중">
      <div className="container">
        <SectionHeaderSkeleton />
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}>
          {[0, 1, 2].map((i) => (
            <CardSkeleton key={i} imageHeight={180} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 유튜브 섹션 스켈레톤 ──────────────────────────────────────────────────────
export function YouTubeSectionSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-white" aria-busy="true" aria-label="영상 로딩 중">
      <div className="container">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden" aria-hidden="true">
              <SkeletonBlock style={{ aspectRatio: "16/9" }} />
              <div className="p-3 space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 후기 섹션 스켈레톤 ────────────────────────────────────────────────────────
export function ReviewsSectionSkeleton() {
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--brand-bg, #FAF8F5)" }} aria-busy="true" aria-label="후기 로딩 중">
      <div className="container">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl p-6 space-y-4" style={{ background: "white" }} aria-hidden="true">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-3 w-16" />
                </div>
              </div>
              <SkeletonBlock className="h-3 w-20" />
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <SkeletonBlock className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 의료진 섹션 스켈레톤 ──────────────────────────────────────────────────────
export function DoctorsSectionSkeleton() {
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--brand-bg-alt, #F5F0EB)" }} aria-busy="true" aria-label="의료진 로딩 중">
      <div className="container">
        <SectionHeaderSkeleton />
        {/* 데스크톱: 탭 + 패널 */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
          <div className="col-span-3 rounded-2xl overflow-hidden" aria-hidden="true">
            <SkeletonBlock style={{ height: 400 }} />
            <div className="p-8 space-y-4">
              <SkeletonBlock className="h-7 w-48" />
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-4/5" />
            </div>
          </div>
        </div>
        {/* 모바일: 슬라이더 */}
        <div className="md:hidden rounded-2xl overflow-hidden" aria-hidden="true">
          <SkeletonBlock style={{ height: 280 }} />
          <div className="p-5 space-y-3">
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 예약 섹션 스켈레톤 ────────────────────────────────────────────────────────
export function ReservationSectionSkeleton() {
  return (
    <section className="py-20 md:py-28" style={{ background: "white" }} aria-busy="true" aria-label="예약 로딩 중">
      <div className="container max-w-2xl mx-auto">
        <SectionHeaderSkeleton />
        <div className="rounded-2xl p-8 space-y-6" style={{ background: "var(--brand-bg, #FAF8F5)" }} aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-12 w-full rounded-lg" />
            </div>
          ))}
          <SkeletonBlock className="h-14 w-full rounded-full" />
        </div>
      </div>
    </section>
  );
}

/**
 * SkeletonUI.tsx - 공통 스켈레톤 UI 컴포넌트
 *
 * 다양한 섹션에서 재사용 가능한 스켈레톤 로딩 상태 컴포넌트
 * - StatisticCardSkeleton: 통계 카드 (아이콘 + 숫자 + 라벨)
 * - ReviewCardSkeleton: 후기 카드 (별점 + 텍스트)
 * - FAQItemSkeleton: FAQ 항목 (질문 + 답변)
 * - DoctorCardSkeleton: 의료진 카드 (이미지 + 이름 + 설명)
 * - DeviceCardSkeleton: 장비 카드 (이미지 + 제목 + 설명)
 */

/**
 * 통계 카드 스켈레톤
 * 아이콘, 숫자, 라벨, 설명을 포함한 카드 로딩 상태
 */
export function StatisticCardSkeleton() {
  return (
    <div
      className="text-center p-4 sm:p-6 rounded-2xl"
      // [P3-FINAL] border 0.15 → 0.20, shadow 강화
      style={{ background: 'var(--brand-bg-alt, #F5F0EB)', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', border: '1px solid rgba(196,168,130,0.20)' }}
      aria-hidden="true"
    >
      {/* 아이콘 영역 — 골드 픽스드 원형 힌트 */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full" style={{ background: 'rgba(196,168,130,0.22)' }} />
      </div>

      {/* 숫자 영역 */}
      <div className="mb-2 h-8 skeleton-shimmer rounded" style={{ width: '60%', margin: '0 auto' }} />

      {/* 라벨 영역 */}
      <div className="mb-3 h-4 skeleton-shimmer rounded" style={{ width: '70%', margin: '0 auto' }} />

      {/* 설명 영역 */}
      <div className="h-3 skeleton-shimmer rounded" style={{ width: '80%', margin: '0 auto' }} />
    </div>
  );
}

/**
 * 후기 카드 스켈레톤
 * 별점, 텍스트, 작성자 정보를 포함한 카드 로딩 상태
 */
export function ReviewCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
      // [P3-FINAL] border 0.15 → 0.20, shadow 강화
      style={{ background: 'var(--brand-bg-alt, #F5F0EB)', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', border: '1px solid rgba(196,168,130,0.20)' }}
      aria-hidden="true"
    >
      {/* 별점 영역 — 골드 픽스드 원형 힌트 */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-4 h-4 rounded-full" style={{ background: 'rgba(196,168,130,0.30)' }} />
        ))}
      </div>

      {/* 텍스트 영역 */}
      <div className="space-y-2">
        <div className="h-4 skeleton-shimmer rounded w-full" />
        <div className="h-4 skeleton-shimmer rounded w-5/6" />
        <div className="h-4 skeleton-shimmer rounded w-4/5" />
      </div>

      {/* 작성자 정보 */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-10 h-10 skeleton-shimmer rounded-full" />
        <div className="flex-1">
          <div className="h-3 skeleton-shimmer rounded w-24 mb-1" />
          <div className="h-3 skeleton-shimmer rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * FAQ 항목 스켈레톤
 * 질문과 답변 구조의 로딩 상태
 */
export function FAQItemSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: 'rgba(196,168,130,0.2)', background: 'var(--brand-bg-alt, #F5F0EB)' }}
      aria-hidden="true"
    >
      {/* 질문 버튼 영역 */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 skeleton-shimmer rounded w-3/4" />
        </div>
        <div className="w-5 h-5 skeleton-shimmer rounded flex-shrink-0" />
      </div>

      {/* 답변 영역 (초기 숨김) */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t space-y-2" style={{ borderColor: 'rgba(196,168,130,0.1)' }}>
        <div className="h-3 skeleton-shimmer rounded w-full" />
        <div className="h-3 skeleton-shimmer rounded w-5/6" />
        <div className="h-3 skeleton-shimmer rounded w-4/5" />
      </div>
    </div>
  );
}

/**
 * 의료진 카드 스켈레톤
 * 이미지, 이름, 설명을 포함한 카드 로딩 상태
 */
export function DoctorCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      // [P3-FINAL] border 0.15 → 0.20, shadow 강화
      style={{ background: 'var(--brand-bg-alt, #F5F0EB)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid rgba(196,168,130,0.20)' }}
      aria-hidden="true"
    >
      {/* 이미지 영역 — 그라디언트 오버레이 + 인물 실루엣 힌트 */}
      <div className="relative h-64 md:h-72 overflow-hidden" style={{ background: 'var(--brand-bg-warm, #EDE8E0)' }}>
        <div className="skeleton-shimmer absolute inset-0" />
        {/* 하단 그라디언트 오버레이 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.12) 100%)',
          pointerEvents: 'none',
        }} />
        {/* 인물 실루엣 힌트 — 의사 카드 구조 반영 */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '52%', height: '72%',
          background: 'rgba(196,168,130,0.09)',
          borderRadius: '50% 50% 0 0',
        }} />
      </div>

      {/* 정보 영역 */}
      <div className="p-4 sm:p-6 text-center">
        {/* 전문의 표시 힌트 — 골드 픽스드 배지 */}
        <div style={{ height: '10px', width: '3rem', borderRadius: '999px', background: 'rgba(196,168,130,0.32)', margin: '0 auto 10px' }} />
        {/* 이름 */}
        <div className="h-5 skeleton-shimmer rounded mb-3 w-2/3 mx-auto" />

        {/* 설명 */}
        <div className="space-y-2">
          <div className="h-3 skeleton-shimmer rounded w-full" />
          <div className="h-3 skeleton-shimmer rounded w-5/6 mx-auto" />
        </div>
      </div>
    </div>
  );
}

/**
 * 장비 카드 스켈레톤
 * 이미지, 제목, 설명을 포함한 카드 로딩 상태
 */
export function DeviceCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      // [P3-FINAL] border 0.15 → 0.20, shadow 강화
      style={{ background: 'var(--brand-bg-alt, #F5F0EB)', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', border: '1px solid rgba(196,168,130,0.20)' }}
      aria-hidden="true"
    >
      {/* 이미지 영역 — 그라디언트 오버레이 */}
      <div className="relative h-48 md:h-56 overflow-hidden" style={{ background: 'var(--brand-bg-warm, #EDE8E0)' }}>
        <div className="skeleton-shimmer absolute inset-0" />
        {/* 하단 그라디언트 오버레이 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.12) 100%)',
          pointerEvents: 'none',
        }} />
        {/* 장비 실루엣 힌트 — 중앙 원형 */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40%', height: '50%',
          background: 'rgba(196,168,130,0.09)',
          borderRadius: '8px',
        }} />
      </div>

      {/* 정보 영역 */}
      <div className="p-4 sm:p-5">
        {/* 장비 카테고리 힌트 — 골드 픽스드 배지 */}
        <div style={{ height: '9px', width: '2.5rem', borderRadius: '999px', background: 'rgba(196,168,130,0.32)', marginBottom: '8px' }} />
        {/* 제목 */}
        <div className="h-5 skeleton-shimmer rounded mb-3 w-3/4" />

        {/* 설명 */}
        <div className="space-y-2">
          <div className="h-3 skeleton-shimmer rounded w-full" />
          <div className="h-3 skeleton-shimmer rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

/**
 * 탭 버튼 스켈레톤
 * FAQ/장비 섹션의 탭 버튼 로딩 상태
 */
export function TabButtonSkeleton() {
  return (
    <div className="h-10 skeleton-shimmer rounded-full w-24" />
  );
}

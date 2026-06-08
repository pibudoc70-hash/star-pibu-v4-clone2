/**
 * EmptyResultView
 * 시술 목록 필터 결과가 없을 때 표시하는 빈 상태 컴포넌트.
 *
 * [R24-P0-2] TreatmentsEquipmentSection 인라인 JSX → 재사용 가능한 컴포넌트로 분리.
 */

interface EmptyResultViewProps {
  /** 빈 결과 메인 메시지 */
  message: string;
  /** 빈 결과 힌트 메시지 */
  hint: string;
}

export default function EmptyResultView({ message, hint }: EmptyResultViewProps) {
  return (
    <div className="col-span-full text-center py-16 text-gray-400">
      <svg
        className="w-12 h-12 mx-auto mb-4 opacity-40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-1">{hint}</p>
    </div>
  );
}

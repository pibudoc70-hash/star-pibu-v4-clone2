/**
 * TreatmentMeta — EquipmentTreatmentCard 텍스트 메타 영역 서브컴포넌트
 *
 * [R20-P1-5] EquipmentTreatmentCard에서 텍스트 정보 렌더링 로직을 분리
 * - 시술명 (h3)
 * - 설명 (line-clamp-2)
 * - 시간 + 회복 기간 (아이콘 포함)
 */
import { Clock, RefreshCw } from "lucide-react";

interface TreatmentMetaProps {
  name: string;
  desc: string;
  time: string;
  recovery: string;
  recoveryPrefix: string;
}

export function TreatmentMeta({
  name,
  desc,
  time,
  recovery,
  recoveryPrefix,
}: TreatmentMetaProps) {
  return (
    <div className="p-3">
      <h3 className="font-bold text-sm leading-tight mb-1" style={{ color: 'var(--brand-text, #2C2C2C)' }}>
        {name}
      </h3>
      <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--brand-text-mid, #666666)' }}>
        {desc}
      </p>
      <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--brand-text-muted, #999999)' }}>
        <span className="flex items-center gap-0.5">
          <Clock size={10} />
          {time}
        </span>
        <span className="flex items-center gap-0.5">
          <RefreshCw size={10} />
          {recoveryPrefix}{" "}
          {recovery}
        </span>
      </div>
    </div>
  );
}

/**
 * EquipmentTreatmentCard
 * TreatmentsEquipmentSection(V1 정적 데이터 전용)의 시술 카드 컴포넌트.
 *
 * V2 DB 연동 카드는 @/components/treatments/TreatmentCard 를 사용한다.
 * 이 컴포넌트는 TREATMENTS 정적 데이터 객체와 함께 사용되며,
 * TreatmentsEquipmentSection.tsx 에서 인라인으로 정의되어 있던 함수를 분리한 것이다.
 *
 * [R18-P1-5] 모달 콘텐츠 → EquipmentTreatmentModal 컴포넌트로 분리
 *   - 카드 컴포넌트는 카드 UI + 모달 열기 상태만 담당
 *   - 모달 내용은 EquipmentTreatmentModal에서 관리
 *
 * [R20-P1-5] 서브컴포넌트 분리
 *   - TreatmentCardMedia: 이미지 영역 (배너/복수/단수 + 배지)
 *   - TreatmentMeta: 텍스트 메타 영역 (시술명/설명/시간/회복)
 *   - 카드 셰(button + CSS custom property 주입)은 이 파일에 유지
 */
import React, { useState } from "react";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { useLang } from "@/contexts/LangContext";
import type { Treatment } from "@/types/treatment";
import { DETAIL_PAGE_SLUGS } from "@/data/treatments/categories";
import { EquipmentTreatmentModal } from "@/components/treatments/EquipmentTreatmentModal";
import { TreatmentCardMedia } from "@/components/treatments/TreatmentCardMedia";
import { TreatmentMeta } from "@/components/treatments/TreatmentMeta";

interface EquipmentTreatmentCardProps {
  item: Treatment;
  index: number;
  imgBg: string;
  catTextColor: string;
}

export default function EquipmentTreatmentCard({
  item,
  index,
  imgBg,
  catTextColor,
}: EquipmentTreatmentCardProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const tr = t.treatments;
  const detailSlug = DETAIL_PAGE_SLUGS[item.name];
  const { getText } = useLocalizedText();

  // [R15-P1-1] CSS custom property 기반: 동적 색상/딜레이를 CSS 변수로 전달
  const cardStyle = {
    "--card-img-bg": imgBg,
    "--card-accent": catTextColor,
    "--delay": `${Math.min(index * 0.07, 0.42)}s`,
  } as React.CSSProperties;

  const localizedName = getText(item.name, item.nameEn, item.nameJa, item.nameZh);
  const localizedDesc = getText(item.desc, item.descEn, item.descJa, item.descZh);
  const localizedTime = getText(item.time, item.timeEn, item.timeJa, item.timeZh);
  const localizedRecovery = getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh);

  return (
    <>
      {/* [R19-P1-5] div → button 요소 전환 (WAI-ARIA 네이티브 시맨틱) */}
      <button
        type="button"
        className="treatment-card card card--treatment group cursor-pointer animate-card-fade w-full text-left"
        style={cardStyle}
        onClick={() => setOpen(true)}
        aria-label={`${localizedName} ${tr.modalDetailBtn}`}
      >
        {/* [R20-P1-5] 이미지 영역 → TreatmentCardMedia 서브컴포넌트 */}
        <TreatmentCardMedia item={item} name={localizedName} />

        {/* [R20-P1-5] 텍스트 메타 영역 → TreatmentMeta 서브컴포넌트 */}
        <TreatmentMeta
          name={localizedName}
          desc={localizedDesc}
          time={localizedTime}
          recovery={localizedRecovery}
          recoveryPrefix={tr.recoveryPrefix}
        />
      </button>

      {/* [R18-P1-5] 상세 모달 → EquipmentTreatmentModal 컴포넌트로 분리 */}
      <EquipmentTreatmentModal
        item={item}
        open={open}
        onOpenChange={setOpen}
        detailSlug={detailSlug}
      />
    </>
  );
}

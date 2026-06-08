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
 */
import React, { useState } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/LangContext";
import type { Treatment } from "@/types/treatment";
import { DETAIL_PAGE_SLUGS } from "@/data/treatments/categories";
import { EquipmentTreatmentModal } from "@/components/treatments/EquipmentTreatmentModal";

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

  return (
    <>
      <div
        className="treatment-card group cursor-pointer animate-card-fade"
        style={cardStyle}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`${getText(item.name, item.nameEn, item.nameJa, item.nameZh)} ${tr.modalDetailBtn}`}
        // [R17-P1-2] Space key 지원 추가 + focus-visible 링 보강
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {/* 이미지 영역 */}
        <div
          className={[
            "relative overflow-hidden",
            item.cardBannerImage ? "h-auto bg-transparent" : "h-48 bg-[#f6efe0]",
          ].join(" ")}
        >
          {item.cardBannerImage ? (
            <OptimizedImage
              src={item.cardBannerImage}
              alt={item.name}
              className="w-full object-cover"
            />
          ) : item.images && item.images.length > 1 ? (
            <div className="flex h-full">
              {item.images.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-1 overflow-hidden bg-[var(--card-img-bg)]"
                >
                  <OptimizedImage
                    src={img}
                    alt={`${item.name} ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <OptimizedImage
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 bg-[var(--card-img-bg)]"
            />
          )}
          {item.badge && (
            <span
              className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow bg-[var(--card-accent)]"
              style={item.badgeColor ? { "--card-accent": item.badgeColor } as React.CSSProperties : undefined}
            >
              {item.badge}
            </span>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div className="p-3">
          <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">
            {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-2">
            {getText(item.desc, item.descEn, item.descJa, item.descZh)}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-0.5">
              <Clock size={10} />
              {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}
            </span>
            <span className="flex items-center gap-0.5">
              <RefreshCw size={10} />
              {tr.recoveryPrefix}{" "}
              {getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}
            </span>
          </div>
        </div>
      </div>

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

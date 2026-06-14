/**
 * TreatmentCardMedia — EquipmentTreatmentCard 이미지 영역 서브컴포넌트
 *
 * [R20-P1-5] EquipmentTreatmentCard에서 이미지 렌더링 로직을 분리
 * - cardBannerImage: 전체 너비 배너 이미지
 * - images (복수): 분할 레이아웃 (flex)
 * - image (단수): 단일 이미지 (hover scale)
 * - badge: 절대 위치 배지 (--card-accent CSS variable 사용, 다국어 지원)
 */
import OptimizedImage from "@/components/OptimizedImage";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import type { Treatment } from "@/types/treatment";

interface TreatmentCardMediaProps {
  item: Treatment;
  name: string; // 현재 언어로 변환된 이름 (alt 텍스트용)
}

export function TreatmentCardMedia({ item, name }: TreatmentCardMediaProps) {
  const { getText } = useLocalizedText();
  const localizedBadge = item.badge
    ? getText(item.badge, item.badgeEn, item.badgeJa, item.badgeZh)
    : null;

  return (
    <div
      className={[
        "relative overflow-hidden",
        item.cardBannerImage ? "h-auto bg-transparent" : "h-48 bg-[#f6efe0]",
      ].join(" ")}
    >
      {item.cardBannerImage ? (
        <OptimizedImage
          src={item.cardBannerImage}
          alt={name}
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
                alt={`${name} ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      ) : (
        <OptimizedImage
          src={item.image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 bg-[var(--card-img-bg)]"
        />
      )}
      {localizedBadge && (
        <span
          className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow bg-[var(--card-accent)]"
          style={item.badgeColor ? { "--card-accent": item.badgeColor } as React.CSSProperties : undefined}
        >
          {localizedBadge}
        </span>
      )}
    </div>
  );
}

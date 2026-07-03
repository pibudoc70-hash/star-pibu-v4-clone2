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
import { useLang } from "@/contexts/LangContext";
import type { Treatment } from "@/types/treatment";

interface TreatmentCardMediaProps {
  item: Treatment;
  name: string; // 현재 언어로 변환된 이름 (alt 텍스트용)
}

export function TreatmentCardMedia({ item, name }: TreatmentCardMediaProps) {
  const { getText } = useLocalizedText();
  const { lang } = useLang();
  const localizedBadge = item.badge
    ? getText(item.badge, item.badgeEn, item.badgeJa, item.badgeZh)
    : null;

  // 비한국어 + bgImageUrl 있음 → equipment3 카드와 동일한 오버레이 방식
  const showBgOverlay = lang !== "ko" && !!item.bgImageUrl;

  return (
    <div
      className={[
        "relative overflow-hidden",
        item.cardBannerImage ? "h-auto bg-transparent" : "h-48 bg-[#f6efe0]",
      ].join(" ")}
    >
      {showBgOverlay ? (
        /* 비한국어: bgImageUrl 풀배경 + 텍스트 오버레이 (equipment3 카드와 동일) */
        <>
          <img
            src={item.bgImageUrl!}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 py-3">
            {item.nameEn && (
              <p
                className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1"
                style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
              >
                {item.nameEn}
              </p>
            )}
            <h3
              className="text-xl font-black leading-tight"
              style={{ color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              {name}
            </h3>
          </div>
        </>
      ) : item.cardBannerImage ? (
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

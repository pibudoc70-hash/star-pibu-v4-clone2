/**
 * EquipmentTreatmentCard
 * TreatmentsEquipmentSection(V1 정적 데이터 전용)의 시술 카드 컴포넌트.
 *
 * V2 DB 연동 카드는 @/components/treatments/TreatmentCard 를 사용한다.
 * 이 컴포넌트는 TREATMENTS 정적 데이터 객체와 함께 사용되며,
 * TreatmentsEquipmentSection.tsx 에서 인라인으로 정의되어 있던 함수를 분리한 것이다.
 */
import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Clock, RefreshCw, AlertCircle, Repeat, Sparkles, ExternalLink,
} from "lucide-react";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/LangContext";
import type { Treatment } from "@/types/treatment";
import { DETAIL_PAGE_SLUGS } from "@/data/treatments/categories";

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
  const [, setLocation] = useLocation();
  const { t } = useLang();
  const tr = t.treatments;
  const detailSlug = DETAIL_PAGE_SLUGS[item.name];
  const { getText } = useLocalizedText();

  // [R15-P1-1] CSS custom property 기반: 동적 색상/딥레이를 CSS 변수로 전달
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
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        {/* 이미지 */}
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

        {/* 텍스트 */}
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

      {/* 상세 모달 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}{" "}
            {tr.modalDetailBtn}
          </DialogTitle>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                <OptimizedImage
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {tr.modalTime}:{" "}
                    {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw size={12} />
                    {tr.modalRecovery}:{" "}
                    {getText(
                      item.recovery,
                      item.recoveryEn,
                      item.recoveryJa,
                      item.recoveryZh,
                    )}
                  </span>
                </div>
              </div>
            </div>

            {item.youtubeUrl && (
              <div className="rounded-xl overflow-hidden aspect-video">
                <iframe
                  src={item.youtubeUrl}
                  title={item.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {!item.youtubeUrl && item.modalImage && (
              <div className="rounded-xl overflow-hidden">
                <OptimizedImage
                  src={item.modalImage}
                  alt={`${getText(item.name, item.nameEn, item.nameJa, item.nameZh)} ${tr.modalDetailBtn}`}
                  className="w-full object-contain"
                />
              </div>
            )}

            {getText(item.detail, item.detailEn, item.detailJa, item.detailZh) && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {getText(item.detail, item.detailEn, item.detailJa, item.detailZh)}
              </p>
            )}

            {getText(item.effect, item.effectEn, item.effectJa, item.effectZh) && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Sparkles size={14} className="text-amber-500" />
                  {tr.modalEffect}
                </h4>
                <p className="text-sm text-slate-600">
                  {getText(item.effect, item.effectEn, item.effectJa, item.effectZh)}
                </p>
              </div>
            )}

            {getText(
              item.sessions,
              item.sessionsEn,
              item.sessionsJa,
              item.sessionsZh,
            ) && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Repeat size={14} className="text-blue-500" />
                  {tr.modalSessions}
                </h4>
                <p className="text-sm text-slate-600">
                  {getText(
                    item.sessions,
                    item.sessionsEn,
                    item.sessionsJa,
                    item.sessionsZh,
                  )}
                </p>
              </div>
            )}

            {(item.caution || item.cautionEn || item.cautionJa || item.cautionZh) && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <AlertCircle size={14} className="text-red-400" />
                  {tr.caution}
                </h4>
                <p className="text-sm text-slate-600">
                  {getText(
                    item.caution ?? "",
                    item.cautionEn ?? "",
                    item.cautionJa ?? "",
                    item.cautionZh ?? "",
                  )}
                </p>
              </div>
            )}

            {detailSlug && (
              <button
                onClick={() => {
                  setOpen(false);
                  setLocation(`/treatment/${detailSlug}`);
                }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 bg-[var(--card-accent)]"
              >
                <ExternalLink size={14} />
                {tr.modalDetailBtn}
              </button>
            )}

            <a
              href="tel:051-818-7582"
              className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {tr.modalConsultBtn}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

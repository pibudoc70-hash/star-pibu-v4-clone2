/**
 * EquipmentTreatmentCard — STAR 피부과 (Luxury Minimal Medical Redesign)
 *
 * 디자인 원칙:
 * - 카드: 흰색 배경 + 골드 테두리(subtle) + 부드러운 hover elevation
 * - hover: scale 없이 shadow/border 변화만 (더 정제된 느낌)
 * - 이미지 영역: 더 넓은 여백, 골드 배경 tint
 * - 텍스트: DS 토큰 기반 색상 계층
 * - 모달: 기존 기능 100% 유지
 *
 * TreatmentsEquipmentSection(V1 정적 데이터 전용)의 시술 카드 컴포넌트.
 * V2 DB 연동 카드는 @/components/treatments/TreatmentCard 를 사용한다.
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
import { DS } from "@/components/ui/DesignSystem";

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
  const [hovered, setHovered] = useState(false);
  const [, setLocation] = useLocation();
  const { t } = useLang();
  const tr = t.treatments;
  const detailSlug = DETAIL_PAGE_SLUGS[item.name];
  const { getText } = useLocalizedText();

  return (
    <>
      <div
        className="treatment-card cursor-pointer"
        style={{
          animation: `cardFadeIn 0.35s ease ${Math.min(index * 0.07, 0.42)}s both`,
          background: DS.color.white,
          borderRadius: DS.radius.md,
          border: `1px solid ${hovered ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.15)"}`,
          boxShadow: hovered ? DS.shadow.md : DS.shadow.sm,
          overflow: "hidden",
          transition: `box-shadow ${DS.motion.base} ${DS.motion.ease}, border-color ${DS.motion.base} ${DS.motion.ease}`,
        }}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        tabIndex={0}
        aria-label={`${getText(item.name, item.nameEn, item.nameJa, item.nameZh)} ${tr.modalDetailBtn}`}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        {/* ── 이미지 영역 ── */}
        <div
          className="relative overflow-hidden"
          style={{
            height: item.cardBannerImage ? "auto" : "200px",
            background: item.cardBannerImage ? "transparent" : DS.color.ivory,
          }}
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
                  className="flex-1 overflow-hidden"
                  style={{ background: imgBg }}
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
              className="w-full h-full object-contain"
              style={{
                background: imgBg,
                transition: `transform ${DS.motion.slow} ${DS.motion.ease}`,
                transform: hovered ? "scale(1.03)" : "scale(1)",
              }}
            />
          )}
          {item.badge && (
            <span
              className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm"
              style={{ background: item.badgeColor ?? catTextColor }}
            >
              {item.badge}
            </span>
          )}
        </div>

        {/* ── 텍스트 영역 ── */}
        <div className="p-4">
          <h3 style={{
            fontWeight: 700,
            color: DS.color.charcoal,
            fontSize: "0.9rem",
            lineHeight: 1.35,
            marginBottom: "6px",
          }}>
            {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
          </h3>
          <p style={{
            color: DS.color.midGray,
            fontSize: "0.78rem",
            lineHeight: 1.6,
            marginBottom: "12px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {getText(item.desc, item.descEn, item.descJa, item.descZh)}
          </p>
          {/* 메타 정보 */}
          <div className="flex items-center gap-3" style={{ color: DS.color.lightGray, fontSize: "0.72rem" }}>
            <span className="flex items-center gap-1">
              <Clock size={10} style={{ color: DS.color.gold }} />
              {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw size={10} style={{ color: DS.color.gold }} />
              {tr.recoveryPrefix}{" "}
              {getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}
            </span>
          </div>
        </div>
      </div>

      {/* ── 상세 모달 ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}{" "}
            {tr.modalDetailBtn}
          </DialogTitle>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div
                className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                style={{
                  background: DS.color.ivory,
                  border: `1px solid rgba(201,168,76,0.2)`,
                }}
              >
                <OptimizedImage
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: DS.color.charcoal,
                  marginBottom: "6px",
                }}>
                  {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
                </h3>
                <div className="flex items-center gap-3" style={{ color: DS.color.midGray, fontSize: "0.75rem" }}>
                  <span className="flex items-center gap-1">
                    <Clock size={12} style={{ color: DS.color.gold }} />
                    {tr.modalTime}:{" "}
                    {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw size={12} style={{ color: DS.color.gold }} />
                    {tr.modalRecovery}:{" "}
                    {getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}
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
              <p style={{ color: DS.color.midGray, fontSize: "0.875rem", lineHeight: 1.75 }}>
                {getText(item.detail, item.detailEn, item.detailJa, item.detailZh)}
              </p>
            )}

            {getText(item.effect, item.effectEn, item.effectJa, item.effectZh) && (
              <div>
                <h4 className="text-sm font-semibold mb-1 flex items-center gap-1" style={{ color: DS.color.deepGray }}>
                  <Sparkles size={14} style={{ color: DS.color.gold }} />
                  {tr.modalEffect}
                </h4>
                <p style={{ color: DS.color.midGray, fontSize: "0.875rem" }}>
                  {getText(item.effect, item.effectEn, item.effectJa, item.effectZh)}
                </p>
              </div>
            )}

            {getText(item.sessions, item.sessionsEn, item.sessionsJa, item.sessionsZh) && (
              <div>
                <h4 className="text-sm font-semibold mb-1 flex items-center gap-1" style={{ color: DS.color.deepGray }}>
                  <Repeat size={14} style={{ color: "#60A5FA" }} />
                  {tr.modalSessions}
                </h4>
                <p style={{ color: DS.color.midGray, fontSize: "0.875rem" }}>
                  {getText(item.sessions, item.sessionsEn, item.sessionsJa, item.sessionsZh)}
                </p>
              </div>
            )}

            {(item.caution || item.cautionEn || item.cautionJa || item.cautionZh) && (
              <div>
                <h4 className="text-sm font-semibold mb-1 flex items-center gap-1" style={{ color: DS.color.deepGray }}>
                  <AlertCircle size={14} style={{ color: "#F87171" }} />
                  {tr.caution}
                </h4>
                <p style={{ color: DS.color.midGray, fontSize: "0.875rem" }}>
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
                className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
                style={{
                  background: catTextColor,
                  boxShadow: `0 4px 16px ${catTextColor}44`,
                }}
              >
                <ExternalLink size={14} />
                {tr.modalDetailBtn}
              </button>
            )}

            <a
              href="tel:051-818-7582"
              className="block w-full py-3 rounded-xl text-sm font-semibold text-center transition-colors"
              style={{
                border: `1.5px solid rgba(201,168,76,0.3)`,
                color: DS.color.deepGray,
                background: DS.color.warmWhite,
              }}
            >
              {tr.modalConsultBtn}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

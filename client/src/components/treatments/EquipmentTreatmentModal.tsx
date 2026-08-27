/**
 * EquipmentTreatmentModal — 시술 상세 모달 컴포넌트
 *
 * [R18-P1-5] EquipmentTreatmentCard.tsx에서 모달 콘텐츠를 별도 컴포넌트로 분리
 *
 * 책임:
 * - Dialog 열림/닫힘 상태 수신 (open, onOpenChange)
 * - 시술 상세 정보 표시 (이미지, 유튜브, 시간/회복, 효과, 주의사항)
 * - 확인된 Equipment3 상세 페이지 이동 버튼 (detailUrl 있을 때만)
 * - 전화 상담 버튼
 */
import {
  Clock, RefreshCw, AlertCircle, Repeat, Sparkles, ExternalLink,
} from "lucide-react";

// YouTube URL → embed URL 변환 (watch?v= / youtu.be / shorts 모두 지원)
function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}?rel=0`;
  return null; // 알 수 없는 URL은 null 반환
}
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import OptimizedImage from "@/components/OptimizedImage";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { useLang } from "@/contexts/LangContext";
import type { Treatment } from "@/types/treatment";

interface EquipmentTreatmentModalProps {
  item: Treatment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detailUrl: string | undefined;
}

export function EquipmentTreatmentModal({
  item,
  open,
  onOpenChange,
  detailUrl,
}: EquipmentTreatmentModalProps) {
  const { t, lang } = useLang();
  const tr = t.treatments;
  const { getText } = useLocalizedText();
  const [, setLocation] = useLocation();

  // 언어별 헤더 이미지: ko는 imageUrl 썬네일, 비ko는 bgImageUrl 풀배경
  const isNonKo = lang !== "ko";
  const showBgOverlay = isNonKo && !!item.bgImageUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogTitle className="sr-only">
          {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}{" "}
          {tr.modalDetailBtn}
        </DialogTitle>
        <div className="space-y-4">
          {/* 헤더: 언어별 이미지 + 이름 + 시간/회복 */}
          {showBgOverlay ? (
            /* 비한국어: bgImageUrl 풀배경 + 텍스트 오버레이 */
            <div className="relative rounded-xl overflow-hidden" style={{ height: "160px" }}>
              <img
                src={item.bgImageUrl!}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
              <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 py-3">
                {item.nameEn && (
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1"
                    style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                    {item.nameEn}
                  </p>
                )}
                <h3 className="text-xl font-black leading-tight"
                  style={{ color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                  {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
                </h3>
                <div className="flex items-center gap-3 text-xs mt-1.5"
                  style={{ color: "rgba(255,255,255,0.85)" }}>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {tr.modalTime}: {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw size={11} />
                    {tr.modalRecovery}: {getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* 한국어 또는 bgImageUrl 없음: 기존 썬네일 + 텍스트 */
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
                    {getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 유튜브 임베드 */}
          {toEmbedUrl(item.youtubeUrl) && (
            <div className="rounded-xl overflow-hidden aspect-video">
              <iframe
                src={toEmbedUrl(item.youtubeUrl)!}
                title={item.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}

          {/* 모달 이미지 (유튜브 embed 불가능하거나 없을 때) */}
          {!toEmbedUrl(item.youtubeUrl) && item.modalImage && (
            <div className="rounded-xl overflow-hidden">
              <OptimizedImage
                src={item.modalImage}
                alt={`${getText(item.name, item.nameEn, item.nameJa, item.nameZh)} ${tr.modalDetailBtn}`}
                className="w-full object-contain"
              />
            </div>
          )}

          {/* 상세 페이지 이동 버튼 */}
          {detailUrl && (
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                setLocation(detailUrl);
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 bg-[var(--card-accent)]"
            >
              <ExternalLink size={14} />
              {tr.modalDetailBtn}
            </button>
          )}

          {/* 상세 설명 */}
          {getText(item.detail, item.detailEn, item.detailJa, item.detailZh) && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {getText(item.detail, item.detailEn, item.detailJa, item.detailZh)}
            </p>
          )}

          {/* 효과 */}
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

          {/* 시술 횟수 */}
          {getText(item.sessions, item.sessionsEn, item.sessionsJa, item.sessionsZh) && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Repeat size={14} className="text-blue-500" />
                {tr.modalSessions}
              </h4>
              <p className="text-sm text-slate-600">
                {getText(item.sessions, item.sessionsEn, item.sessionsJa, item.sessionsZh)}
              </p>
            </div>
          )}

          {/* 주의사항 */}
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

        </div>
      </DialogContent>
    </Dialog>
  );
}

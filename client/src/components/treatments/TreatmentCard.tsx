/**
 * TreatmentCard
 * TreatmentsEquipmentSectionV2에서 추출한 시술 카드 컴포넌트.
 * 카드 클릭 시 상세 Dialog를 열고, 언어별 텍스트를 표시한다.
 */
import { useState } from "react";
import { Clock, RefreshCw, Sparkles, ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import OptimizedImage from "@/components/OptimizedImage";

// ─── 타입 ────────────────────────────────────────────────────────────────────
export interface Treatment {
  id: number;
  categoryId: string;
  name: string;
  nameEn: string;
  nameJa?: string | null;
  nameZh?: string | null;
  desc: string;
  descEn?: string | null;
  descJa?: string | null;
  descZh?: string | null;
  time: string;
  timeEn?: string | null;
  timeJa?: string | null;
  timeZh?: string | null;
  recovery: string;
  recoveryEn?: string | null;
  recoveryJa?: string | null;
  recoveryZh?: string | null;
  badge?: string | null;
  badgeEn?: string | null;
  badgeJa?: string | null;
  badgeZh?: string | null;
  detail?: string | null;
  detailEn?: string | null;
  detailJa?: string | null;
  detailZh?: string | null;
  caution?: string | null;
  cautionEn?: string | null;
  cautionJa?: string | null;
  cautionZh?: string | null;
  sessions?: string | null;
  sessionsEn?: string | null;
  sessionsJa?: string | null;
  sessionsZh?: string | null;
  effect?: string | null;
  effectEn?: string | null;
  effectJa?: string | null;
  effectZh?: string | null;
  badgeColor?: string | null;
  image?: string | null;
  youtubeUrl?: string | null;
  best?: string | null;
  isActive?: string | null;
  images?: string | null;
  imgBg?: string | null;
  cardBannerImage?: string | null;
  related?: string | null;
  steps?: string | null;
  section?: string | null;
  sortOrder?: number;
  modalImage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── YouTube URL 변환 ─────────────────────────────────────────────────────────
function convertYoutubeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return url;
}

// ─── 언어별 텍스트 헬퍼 ──────────────────────────────────────────────────────
// [MAINT-P1-1] useLocalizedText → @/hooks/useLocalizedText 공유 hook으로 이동됨

// ─── 카드 이미지 영역 ─────────────────────────────────────────────────────────
function TreatmentCardImage({
  item,
  imgBg,
}: {
  item: Treatment;
  imgBg: string;
}) {
  let imageArray: string[] = [];
  if (item.images) {
    try {
      imageArray = typeof item.images === "string" ? JSON.parse(item.images) : [];
    } catch {
      imageArray = [];
    }
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: item.cardBannerImage ? "auto" : "200px",
        background: item.cardBannerImage ? "transparent" : item.imgBg || imgBg,
      }}
    >
      {item.cardBannerImage ? (
        <OptimizedImage
          src={item.cardBannerImage}
          alt={item.name}
          className="w-full h-full object-contain block transition-transform duration-400 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0.5";
          }}
        />
      ) : imageArray.length >= 2 ? (
        <div
          className="w-full h-full flex items-center justify-center gap-2 transition-transform duration-400 group-hover:scale-105"
          style={{ padding: "8px 6px" }}
        >
          {imageArray.map((src, i) => (
            <OptimizedImage
              key={i}
              src={src}
              alt={`${item.name} ${i + 1}`}
              className="object-contain flex-none"
              style={{
                height: "85%",
                maxWidth: "48%",
                filter: "drop-shadow(1px 2px 4px rgba(0,0,0,0.08))",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.5";
              }}
            />
          ))}
        </div>
      ) : item.image ? (
        <OptimizedImage
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0.5";
          }}
        />
      ) : null}
    </div>
  );
}

// ─── 모달 상세 내용 ───────────────────────────────────────────────────────────
function TreatmentModalContent({
  item,
  onClose,
}: {
  item: Treatment;
  onClose: () => void;
}) {
  const { getText } = useLocalizedText();
  const { t } = useLang();
  const { chatUrl, chatBg, chatColor } = useChatConfig();
  const embedUrl = convertYoutubeUrl(item.youtubeUrl);

  // i18n 키 사용 — 언어별 채팅 채널(KakaoTalk/LINE/WeChat)은 각 언어 파일에서 관리
  const ctaLabel = t.treatments.modalConsultBtn;
  const ctaAriaLabel = t.floatingCta.kakaoAria;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* 모달 이미지 */}
      {item.modalImage && (
        <OptimizedImage
          src={item.modalImage}
          alt={item.name}
          className="w-full object-contain mb-4 rounded-xl"
          style={{ maxHeight: "240px" }}
        />
      )}
      {/* YouTube */}
      {embedUrl && (
        <div className="mb-4 rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={embedUrl}
            title={item.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            style={{ border: "none" }}
          />
        </div>
      )}
      {/* 뱃지 */}
      {item.badge && (
        <p
          className="text-xs font-bold mb-1 uppercase tracking-wider"
          style={{ color: item.badgeColor || "#d1ab67" }}
        >
          {getText(item.badge, item.badgeEn, item.badgeJa, item.badgeZh) || "TREATMENT"}
        </p>
      )}
      <h2 className="text-xl font-bold mb-3" style={{ color: "#1F2937" }}>
        {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
      </h2>
      {/* 기본 정보 */}
      <div className="flex gap-4 mb-4 p-3 rounded-xl" style={{ background: "#f6efe0" }}>
        <div className="flex items-center gap-1.5">
          <Clock size={14} style={{ color: "#d1ab67" }} />
          <div>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              {t.treatments.modalTime}
            </p>
            <p className="text-sm font-bold" style={{ color: "#1F2937" }}>
              {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}
            </p>
          </div>
        </div>
        <div className="w-px" style={{ background: "#E5E7EB" }} />
        <div className="flex items-center gap-1.5">
          <RefreshCw size={14} style={{ color: "#d1ab67" }} />
          <div>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              {t.treatments.modalRecovery}
            </p>
            <p className="text-sm font-semibold" style={{ color: "#374151" }}>
              {getText(item.recovery, item.recoveryEn || "", item.recoveryJa || "", item.recoveryZh || "")}
            </p>
          </div>
        </div>
        {item.sessions && (
          <>
            <div className="w-px" style={{ background: "#E5E7EB" }} />
            <div className="flex items-center gap-1.5">
              <RefreshCw size={14} style={{ color: "#d1ab67" }} />
              <div>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  {t.treatments.modalSessions}
                </p>
                <p className="text-sm font-semibold" style={{ color: "#374151" }}>
                  {getText(item.sessions || "", item.sessionsEn || "", item.sessionsJa || "", item.sessionsZh || "")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      {/* 상세 설명 */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#4B5563" }}>
        {getText(
          item.detail || item.desc,
          item.detailEn || item.descEn,
          item.detailJa || item.descJa,
          item.detailZh || item.descZh
        )}
      </p>
      {/* 기대 효과 */}
      {item.effect && (
        <div className="mb-4" style={{ borderTop: "1px solid #f0e8d4", paddingTop: "14px" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={12} style={{ color: "#d1ab67" }} />
            <p className="text-xs font-bold" style={{ color: "#d1ab67" }}>
              {t.treatments.modalEffect}
            </p>
          </div>
          <p className="text-sm" style={{ color: "#374151", lineHeight: 1.6 }}>
            {getText(item.effect || "", item.effectEn || "", item.effectJa || "", item.effectZh || "")}
          </p>
        </div>
      )}
      {/* 주의사항/기대효과(caution) */}
      {item.caution && (
        <div className="mb-4" style={{ borderTop: "1px solid #f0e8d4", paddingTop: "14px" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold" style={{ color: "#d1ab67" }}>
              ✨ {t.treatments.modalEffect}
            </span>
          </div>
          <p className="text-sm" style={{ color: "#374151", lineHeight: 1.6 }}>
            {item.caution}
          </p>
        </div>
      )}
      {/* CTA 버튼 */}
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:brightness-95 active:scale-95 mt-4 flex-shrink-0"
        style={{ background: chatBg, color: chatColor }}
        aria-label={ctaAriaLabel}
        onClick={onClose}
      >
        {ctaLabel}
      </a>
    </div>
  );
}

// ─── 카드 하단 정보 영역 ──────────────────────────────────────────────────────
function TreatmentCardBody({ item }: { item: Treatment }) {
  const { getText } = useLocalizedText();
  const { t } = useLang();
  return (
    <div className="p-4 flex flex-col flex-1">
      {item.badge && (
        <p
          className="text-xs font-bold mb-1 uppercase tracking-wider"
          style={{ color: item.badgeColor || "#d1ab67" }}
        >
          {getText(item.badge, item.badgeEn, item.badgeJa, item.badgeZh)}
        </p>
      )}
      <h3 className="font-bold text-base mb-1 line-clamp-2" style={{ color: "#1F2937" }}>
        {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
      </h3>
      <p className="text-xs line-clamp-2 mb-3 flex-1" style={{ color: "#6B7280" }}>
        {getText(item.desc, item.descEn, item.descJa, item.descZh)}
      </p>
      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#d1ab67" }}>
        <span>{t.events.viewDetail}</span>
        <ChevronRight size={13} />
      </div>
    </div>
  );
}

// ─── 메인 TreatmentCard ───────────────────────────────────────────────────────
export default function TreatmentCard({
  item,
  index,
  imgBg,
}: {
  item: Treatment;
  index: number;
  imgBg: string;
}) {
  const [open, setOpen] = useState(false);
  const { getText } = useLocalizedText();
  const { t } = useLang();

  return (
    <>
      {/* 카드 */}
      <div
        className="treatment-card group cursor-pointer flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{
          animation: `cardFadeIn 0.35s ease ${Math.min(index * 0.07, 0.42)}s both`,
          minHeight: "380px",
          background: "#fff",
        }}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`${getText(item.name, item.nameEn, item.nameJa, item.nameZh)} ${t.events.viewDetail}`}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        <TreatmentCardImage item={item} imgBg={imgBg} />
        <TreatmentCardBody item={item} />
      </div>

      {/* 상세 Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
          aria-labelledby={`treatment-modal-title-${item.id}`}
        >
          <DialogTitle id={`treatment-modal-title-${item.id}`} className="sr-only">
            {getText(item.name, item.nameEn, item.nameJa, item.nameZh)} {t.treatments.modalDetailBtn}
          </DialogTitle>
          <TreatmentModalContent item={item} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

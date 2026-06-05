/**
 * TreatmentsEquipmentSectionV2 - 시술·장비소개2 (DB 연동)
 *
 * 리팩토링 내역 (654줄 → 약 110줄):
 * - useTreatmentFilter Hook으로 탭 필터·정렬·스크롤 로직 추출
 *   → client/src/hooks/useTreatmentFilter.ts
 * - TreatmentCard 컴포넌트 분리
 *   → client/src/components/treatments/TreatmentCard.tsx
 * - CategoryTabButton 컴포넌트 분리 (모바일/데스크탑 중복 버튼 통합)
 *   → client/src/components/treatments/CategoryTabButton.tsx
 */
import { trpc } from "@/lib/trpc";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useTreatmentFilter } from "@/hooks/useTreatmentFilter";
import TreatmentCard, { type Treatment } from "@/components/treatments/TreatmentCard";
import CategoryTabButton from "@/components/treatments/CategoryTabButton";

// ─── 카테고리 정의 ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "best",       label: "Best 시술",     labelEn: "BEST" },
  { id: "lifting",    label: "리프팅·탄력",    labelEn: "LIFTING" },
  { id: "eye",        label: "눈밑지방",       labelEn: "EYE" },
  { id: "vitiligo",   label: "백반증",         labelEn: "VITILIGO" },
  { id: "pigment",    label: "색소·문신",      labelEn: "PIGMENT" },
  { id: "scar",       label: "흉터·모공",      labelEn: "SCAR" },
  { id: "acne_laser", label: "여드름",         labelEn: "ACNE" },
  { id: "rosacea",    label: "홍조·혈관",      labelEn: "ROSACEA" },
  { id: "acne",       label: "액취증·다한증",  labelEn: "HYPERHIDROSIS" },
  { id: "fungus",     label: "손·발톱무좀",    labelEn: "NAIL FUNGUS" },
  { id: "psoriasis",  label: "건선·아토피",    labelEn: "PSORIASIS" },
  { id: "volume",     label: "볼륨·부스터",    labelEn: "VOLUME" },
  { id: "botox",      label: "보톡스·필러",    labelEn: "BOTOX" },
  { id: "stemcell",   label: "줄기세포·재생",  labelEn: "STEM CELL" },
];

// ─── 카테고리별 카드 배경색 ───────────────────────────────────────────────────
const CAT_IMG_BG: Record<string, string> = {
  best: "#F0F6F8", lifting: "#F0F6F8", eye: "#F0F6F8",
  rosacea: "#FFFFFF", pigment: "#F0F6F8", scar: "#F0F6F8",
  volume: "#F0F6F8", botox: "#F0F6F8", acne_laser: "#F0F6F8",
  acne: "#F0F6F8", fungus: "#F0F6F8", vitiligo: "#F0F6F8",
  psoriasis: "#F0F6F8",
  stemcell:  "#F0F6F8",
};

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full text-center py-16" style={{ color: "#9CA3AF" }}>
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
      <p className="text-sm font-medium">등록된 시술이 없습니다</p>
      <p className="text-xs mt-1">관리자에서 시술을 추가해주세요</p>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function TreatmentsEquipmentSectionV2() {
  const sectionRef = useSectionReveal(60);
  const { data: treatments = [], isLoading } = trpc.treatments.all.useQuery({ section: "v2" });

  const {
    activeId,
    filteredTreatments,
    tabContainerRef,
    handleTabChange,
  } = useTreatmentFilter<Treatment>({ treatments });

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-16 sm:py-24" style={{ background: "#ffffff" }}>
        <div className="container">
          <p className="text-center" style={{ color: "#9CA3AF" }}>로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="treatments-v2" className="py-16 sm:py-24" style={{ background: "#ffffff" }}>
      <div className="container">
        {/* ── 탭 네비게이션 ── */}
        <div className="mb-8">
          {/* 모바일: 가로 스크롤 */}
          <div
            ref={tabContainerRef}
            className="flex sm:hidden gap-2 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {CATEGORIES.map((cat) => (
              <CategoryTabButton
                key={cat.id}
                id={cat.id}
                label={cat.label}
                isActive={activeId === cat.id}
                onClick={handleTabChange}
                size="sm"
              />
            ))}
          </div>
          {/* 데스크탑: flex-wrap */}
          <div
            className="hidden sm:flex sm:flex-wrap gap-2"
            style={{ marginTop: "9px", marginRight: "5px", marginBottom: "-4px", marginLeft: "16px" }}
          >
            {CATEGORIES.map((cat) => (
              <CategoryTabButton
                key={cat.id}
                id={cat.id}
                label={cat.label}
                isActive={activeId === cat.id}
                onClick={handleTabChange}
                size="md"
              />
            ))}
          </div>
        </div>

        {/* ── 시술 카드 그리드 ── */}
        <div
          key={`content-${activeId}`}
          className="rounded-2xl mb-8 overflow-hidden"
          style={{ background: "#FAF6EF", animation: "cardFadeIn 0.4s ease both" }}
        >
          <div className="px-5 pt-5 pb-5" style={{ background: "white", borderRadius: "0 0 1rem 1rem" }}>
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTreatments.length === 0 ? (
                <EmptyState />
              ) : (
                filteredTreatments.map((item, i) => (
                  <TreatmentCard
                    key={`${activeId}-t-${i}`}
                    item={item}
                    index={i}
                    imgBg={CAT_IMG_BG[activeId] ?? "#F0F6F8"}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

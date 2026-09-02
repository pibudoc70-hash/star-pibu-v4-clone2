/**
 * CategoryTabList
 * TreatmentsEquipmentSection의 모바일(2열 그리드) + 데스크탑(flex-wrap) 탭 렌더 중복을
 * 단일 컴포넌트로 통합한다. 반응형 표시는 Tailwind CSS 클래스로 처리한다.
 *
 * 같은 카드 collection을 필터링하는 native button group으로 렌더링한다.
 * - 선택 상태는 aria-pressed로 전달한다.
 * - native button의 Tab/Shift+Tab 및 Space/Enter 동작을 그대로 보존한다.
 */
import { Fragment, type ReactNode } from "react";
import { ChevronUp, Star } from "lucide-react";
import type { Category } from "@/types/treatment";
import CategoryTabButton from "./CategoryTabButton";
import { CATEGORY_ICON_MAP, getCatLabel } from "@/data/treatments/categories";
import type { Lang } from "@/lib/i18n.types";
import type { TreatmentTabId } from "@/hooks/useStaticTreatmentFilter";

interface CategoryTabListProps {
  categories: Category[];
  /** [R24-P1-6] TreatmentTabId 타입으로 강화 — string보다 의미 명확 */
  activeId: TreatmentTabId;
  lang: Lang;
  onTabChange: (id: TreatmentTabId) => void;
  /** 모바일에서만 선택한 카테고리의 inline detail을 연다. null이면 모두 닫힌 상태다. */
  mobileActiveId?: TreatmentTabId | null;
  /** 닫힘 fade-out이 끝날 때까지 detail을 유지할 category id. */
  mobileClosingId?: TreatmentTabId | null;
  onMobileTabToggle?: (id: TreatmentTabId) => void;
  /** 모바일 inline detail의 접기 동작. 제공되면 카테고리 grid 복귀를 담당한다. */
  onMobileDetailClose?: () => void;
  /** 상단 close control의 현재 언어 label. */
  mobileCloseLabel?: string;
  renderMobileDetail?: (id: TreatmentTabId) => ReactNode;
  mobileContainerRef?: React.RefObject<HTMLDivElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  /** WAI-ARIA: tablist의 aria-label */
  ariaLabel?: string;
}

export default function CategoryTabList({
  categories,
  activeId,
  lang,
  onTabChange,
  mobileActiveId = activeId,
  mobileClosingId = null,
  onMobileTabToggle,
  onMobileDetailClose,
  mobileCloseLabel = "접기",
  renderMobileDetail,
  mobileContainerRef,
  containerRef,
  ariaLabel = "시술 카테고리",
}: CategoryTabListProps) {
  const renderTabs = (sizeVariant: "sm" | "md") =>
    categories.map((cat) => (
      <CategoryTabButton
        key={cat.id}
        id={cat.id}
        label={getCatLabel(cat, lang)}
        isActive={activeId === cat.id}
        onClick={onTabChange}
        icon={CATEGORY_ICON_MAP[cat.id] ?? Star}
        size={sizeVariant}
      />
    ));

  const renderMobileTabs = () =>
    categories.map((cat) => {
      const isMobileActive = mobileActiveId === cat.id;
      const isClosing = mobileClosingId === cat.id;
      const shouldRenderMobileDetail = (isMobileActive || isClosing) && renderMobileDetail;

      return (
        <Fragment key={cat.id}>
              <CategoryTabButton
                id={cat.id}
                label={getCatLabel(cat, lang)}
            isActive={isMobileActive}
            onClick={isMobileActive ? () => onMobileDetailClose?.() : onMobileTabToggle ?? onTabChange}
            icon={CATEGORY_ICON_MAP[cat.id] ?? Star}
            size="sm"
          />
          {shouldRenderMobileDetail ? (
            <div
              className="col-span-2 mobile-category-detail-shell"
              data-state={isClosing ? "closing" : "open"}
              aria-hidden={isClosing || undefined}
            >
              {isMobileActive && (
                <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={onMobileDetailClose ?? (() => onMobileTabToggle?.(cat.id))}
                  data-testid="mobile-category-detail-close-top"
                  className="flex min-h-11 items-center gap-1 rounded-xl border border-[var(--color-gold-light)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-star-text-mid)] transition-colors hover:bg-[var(--color-gold-pale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)]"
                >
                  <ChevronUp size={14} aria-hidden="true" />
                  {mobileCloseLabel}
                </button>
              </div>
              )}
              <div data-testid={`mobile-category-detail-${cat.id}`}>
                {renderMobileDetail(cat.id)}
              </div>
            </div>
          ) : null}
        </Fragment>
      );
    });

  return (
    <div className="mb-4">
      {/* 모바일: 2열 그리드 */}
      <div
        ref={mobileContainerRef}
        id="treatment-mobile-category-list"
        role="group"
        aria-label={ariaLabel}
        className="grid grid-cols-2 gap-2 sm:hidden"
      >
        {renderMobileTabs()}
      </div>
      {/* 데스크탑: flex-wrap */}
      {/* [R15-P1-1] margin inline style → Tailwind 클래스 치환 */}
      {/* mt-2 ≈ 8px (9px 근사), mr-1 ≈ 4px (5px 근사) — 표준 Tailwind 토큰 사용 */}
      <div
        ref={containerRef}
        role="group"
        aria-label={ariaLabel}
        className="hidden sm:flex sm:flex-wrap gap-2 mt-2 mr-1 -mb-1 ml-4"
      >
        {renderTabs("md")}
      </div>
    </div>
  );
}

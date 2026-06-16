/**
 * Equipment3 - 시술·장비 소개 목록 페이지 (DB 연동)
 * URL: /equipment3 | /en/equipment3 | /ja/equipment3 | /zh/equipment3
 *
 * equipment2와 동일한 탭+카드+모달 구조.
 * - category 필드 기반 동적 탭 생성
 * - TreatmentCard 컴포넌트(모달 포함) 재사용
 * - CategoryTabList + CategoryTabButton 재사용
 */
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE, OG_IMAGE_LOCALIZED, SITE_NAME_LOCALIZED } from "@/components/SeoHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { getLocalizedUrl, getLangPrefix } from "@/lib/localizedPath";
import { Loader, ChevronDown, ChevronUp, Clock, RefreshCw } from "lucide-react";
import { CATEGORY_ICON_MAP, CAT_IMG_BG } from "@/data/treatments/categories";
import CategoryTabButton from "@/components/treatments/CategoryTabButton";
import OptimizedImage from "@/components/OptimizedImage";
import { Dna } from "lucide-react";
import StemCellGuide from "@/components/treatments/StemCellGuide";

// ── 더보기 표시 개수 ──────────────────────────────────────────────────────────
const INITIAL_SHOW = 9;

// ── sessionStorage 키 헬퍼 ────────────────────────────────────────────────────
const SESSION_KEY = "equipment3_expanded_tabs";

function getExpandedTabs(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function setExpandedTabs(tabs: Set<string>): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(tabs)));
  } catch {
    // sessionStorage 사용 불가 환경에서는 무시
  }
}

// ── Equipment3 전용 카드 컴포넌트 (클릭 시 상세 페이지 이동) ─────────────────
function Equipment3Card({
  item,
  index,
  imgBg,
  detailPath,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>;
  index: number;
  imgBg: string;
  detailPath: string;
}) {
  const [, setLocation] = useLocation();
  const { getText } = useLocalizedText();

  const name     = getText(item.name, item.nameEn, item.nameJa, item.nameZh);
  const desc     = getText(item.desc, item.descEn, item.descJa, item.descZh);
  const time     = getText(item.time, item.timeEn, item.timeJa, item.timeZh);
  const recovery = getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh);
  const detail   = getText("자세히 보기", "Learn More", "詳しく見る", "了解详情");

  return (
    <div
      className="treatment-card group cursor-pointer flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{
        animation: `cardFadeIn 0.35s ease ${Math.min(index * 0.07, 0.42)}s both`,
        minHeight: "380px",
        background: "#fff",
      }}
      onClick={() => setLocation(detailPath)}
      role="button"
      tabIndex={0}
      aria-label={`${name} ${detail}`}
      onKeyDown={(e) => e.key === "Enter" && setLocation(detailPath)}
    >
      {/* 이미지 */}
      <div className="relative overflow-hidden" style={{ height: "200px", background: imgBg }}>
        {item.imageUrl ? (
          <OptimizedImage
            src={item.imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : null}
        {/* 뱃지 */}
        {item.badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-bold"
            style={{ backgroundColor: item.badgeColor || "#d1ab67" }}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* 카드 본문 */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-base mb-1 line-clamp-2" style={{ color: "#1F2937" }}>
          {name}
        </h3>
        <p className="text-xs line-clamp-2 mb-3 flex-1" style={{ color: "#6B7280" }}>
          {desc}
        </p>
        {/* 메타 정보 */}
        <div className="flex gap-3 text-xs mb-3" style={{ color: "#9CA3AF" }}>
          {time && (
            <span className="flex items-center gap-1">
              <Clock size={12} />{time}
            </span>
          )}
          {recovery && (
            <span className="flex items-center gap-1">
              <RefreshCw size={12} />{recovery}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#d1ab67" }}>
          <span>{detail}</span>
          <span style={{ fontSize: 13 }}>›</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Equipment3() {
  const { lang } = useLang();
  const { getText } = useLocalizedText();

  const { data: rawItems = [], isLoading } = trpc.equipment3.list.useQuery();

  // ── 탭: category 필드 기반 동적 생성 + Best 시술 탭 ─────────────────────────
  const tabs = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ id: string; label: string; labelEn: string; labelJa: string; labelZh: string }> = [];
    
    // Best 시술 탭 (isBest=1인 항목이 있으면 추가)
    const hasBest = rawItems.some((item) => String(item.isBest) === "1");
    if (hasBest) {
      result.push({
        id: "best",
        label: "Best 시술",
        labelEn: "Best Treatments",
        labelJa: "ベスト施術",
        labelZh: "最佳项目",
      });
      seen.add("best");
    }
    
    // 카테고리 탭
    // "Best 시술" 카테고리는 isBest 체크박스 기반 탭과 중복이므로 제외
    const BEST_CATEGORY_LABELS = new Set(["best", "Best", "Best 시술", "best 시술", "BEST", "BEST 시술"]);
    for (const item of rawItems) {
      const catId = item.category ?? "stem_cell";
      if (BEST_CATEGORY_LABELS.has(catId)) continue;
      if (!seen.has(catId)) {
        seen.add(catId);
        result.push({
          id: catId,
          label: item.category ?? "줄기세포 치료",
          labelEn: item.categoryEn ?? "STEM CELL",
          labelJa: item.categoryJa ?? "幹細胞治疗",
          labelZh: item.categoryZh ?? "干细胞治疗",
        });
      }
    }
    return result;
  }, [rawItems]);

  const search = useSearch();
  const urlTab = useMemo(() => new URLSearchParams(search).get("tab") ?? "", [search]);
  const [activeId, setActiveId] = useState<string>("");
  // sessionStorage에서 초기 expanded 탭 목록 복원
  const [expandedTabs, setExpandedTabsState] = useState<Set<string>>(() => getExpandedTabs());

  // 현재 탭이 expanded 상태인지 여부
  const showAll = activeId ? expandedTabs.has(activeId) : false;
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // 탭 목록이 로드되면 URL ?tab= 파라미터 또는 첫 번째 탭 자동 선택
  useEffect(() => {
    if (tabs.length === 0) return;
    if (urlTab && tabs.some((t) => t.id === urlTab)) {
      setActiveId(urlTab);
    } else if (!activeId) {
      setActiveId(tabs[0].id);
    }
  // activeId는 의도적으로 제외 — URL 파라미터 변경 시에만 재실행
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, urlTab]);

  const handleTabChange = useCallback((id: string) => {
    setActiveId(id);
    // 탭 변경 시 showAll은 해당 탭의 sessionStorage 상태를 따름 (별도 리셋 없음)
    // URL ?tab= 파라미터를 동기화하여 뒤로가기 시 올바른 탭으로 복귀
    const newSearch = id ? `?tab=${encodeURIComponent(id)}` : "";
    window.history.replaceState(null, "", window.location.pathname + newSearch);
  }, []);

  const handleShowMore = useCallback(() => {
    if (!activeId) return;
    setExpandedTabsState((prev) => {
      const next = new Set(prev);
      if (next.has(activeId)) {
        // 접기: 해당 탭 제거
        next.delete(activeId);
      } else {
        // 더보기: 해당 탭 추가
        next.add(activeId);
      }
      setExpandedTabs(next);
      return next;
    });
  }, [activeId]);

  // 활성 탭 자동 스크롤
  useEffect(() => {
    const container = tabContainerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    const containerWidth = container.offsetWidth;
    const btnLeft = activeBtn.offsetLeft;
    const btnWidth = activeBtn.offsetWidth;
    container.scrollTo({ left: btnLeft - containerWidth / 2 + btnWidth / 2, behavior: "smooth" });
  }, [activeId]);

  // 현재 탭 필터링
  const filteredItems = useMemo(() => {
    if (!activeId) return rawItems;
    if (activeId === "best") {
      // Best 시술 탭: isBest=1의 항목만
      return rawItems.filter((item) => String(item.isBest) === "1");
    }
    // 다른 카테고리 탭: category 필드로 필터링
    return rawItems.filter((item) => (item.category ?? "stem_cell") === activeId);
  }, [rawItems, activeId]);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, INITIAL_SHOW);

  // ── 탭 레이블 헬퍼 ──────────────────────────────────────────────────────────
  const getTabLabel = (tab: typeof tabs[number]) => {
    if (lang === "en") return tab.labelEn;
    if (lang === "ja") return tab.labelJa;
    if (lang === "zh") return tab.labelZh;
    return tab.label;
  };

  // ── SEO ─────────────────────────────────────────────────────────────────────
  const pageUrl = getLocalizedUrl(lang, "/equipment3");
  const seoTitle = getText(
    "시술·장비 소개 | 부산 서면 스타피부과",
    "Treatments & Equipment | Star Dermatology Busan",
    "施術・機器のご案内 | 釜山西面スター皮膚科",
    "项目与设备介绍 | 釜山西面STAR皮肤科"
  );
  const seoDesc = getText(
    "부산 서면 스타피부과의 다양한 시술과 장비를 소개합니다. 피부과 전문의가 직접 시술합니다.",
    "Explore our wide range of treatments and equipment at Star Dermatology Clinic, Seomyeon, Busan. Performed by board-certified dermatologists.",
    "釜山西面スター皮膚科の施術・機器をご紹介します。皮膚科専門医が直接施術します。",
    "介绍釜山西面STAR皮肤科的各种项目与设备。由皮肤科专科医生亲自操作。"
  );

  const pageTitle = getText(
    "시술·장비 소개",
    "Treatments & Equipment",
    "施術・機器のご案内",
    "项目与设备介绍"
  );
  const pageSubtitle = getText(
    "부산 서면 스타피부과의 다양한 시술과 장비를 소개합니다.",
    "Explore our wide range of treatments and equipment at Star Dermatology, Seomyeon, Busan.",
    "釜山西面スター皮膚科の施術・機器をご紹介します。",
    "介绍釜山西面STAR皮肤科的各种项目与设备。"
  );

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        canonical={pageUrl}
        ogUrl={pageUrl}
        ogImage={OG_IMAGE_LOCALIZED[lang] ?? OG_IMAGE_LOCALIZED.ko}
        ogSiteName={SITE_NAME_LOCALIZED[lang] ?? SITE_NAME_LOCALIZED.ko}
        ogLocale={LANG_TO_OG_LOCALE[lang] ?? "ko_KR"}
        hreflangs={buildHreflangs(
          "/equipment3",
          "/en/equipment3",
          "/ja/equipment3",
          "/zh/equipment3"
        )}
        pageType="treatment"
      />

      <Header />

      <main className="pt-20">
        <h1 className="sr-only">{pageTitle}</h1>

        <section className="py-16 sm:py-24 bg-white" aria-label={pageTitle}>
          <div className="container">
            {/* 섹션 헤더 */}
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-[12px] tracking-widest mb-3 font-montserrat text-[var(--color-gold-primary)] font-light">
                TREATMENTS & EQUIPMENT
              </p>
              <h2 className="mb-4 text-gray-800 font-extrabold text-[clamp(1.4rem,5vw,2.6rem)]">
                {pageTitle}
              </h2>
              <p className="text-base max-w-2xl mx-auto leading-snug sm:leading-normal text-[var(--color-gold-primary)] pt-2">
                <span className="text-lg">{pageSubtitle}</span>
              </p>
            </div>

            {/* 로딩 */}
            {isLoading && (
              <div className="flex items-center justify-center py-24">
                <Loader className="animate-spin mr-3" size={32} />
              </div>
            )}

            {/* 탭 + 카드 */}
            {!isLoading && (
              <>
                {/* 카테고리 탭 */}
                <div className="rounded-2xl px-4 py-6 mb-4 bg-white overflow-hidden">
                  {/* 모바일: 2열 그리드 */}
                  <div
                    role="tablist"
                    aria-label="시술 카테고리"
                    className="grid grid-cols-2 gap-3 sm:hidden mb-4"
                  >
                    {tabs.map((tab) => (
                      <CategoryTabButton
                        key={tab.id}
                        id={tab.id}
                        label={getTabLabel(tab)}
                        isActive={activeId === tab.id}
                        onClick={handleTabChange}
                        icon={CATEGORY_ICON_MAP[tab.id] ?? Dna}
                        size="sm"
                        role="tab"
                        aria-selected={activeId === tab.id}
                        tabIndex={activeId === tab.id ? 0 : -1}
                      />
                    ))}
                  </div>
                  {/* 데스크탑: 2줄 래핑 */}
                  <div
                    ref={tabContainerRef}
                    role="tablist"
                    aria-label="시술 카테고리"
                    className="hidden sm:flex sm:flex-wrap gap-2 mt-2 mr-1 -mb-1 ml-4 pb-2"
                  >
                    {tabs.map((tab) => (
                      <CategoryTabButton
                        key={tab.id}
                        id={tab.id}
                        label={getTabLabel(tab)}
                        isActive={activeId === tab.id}
                        onClick={handleTabChange}
                        icon={CATEGORY_ICON_MAP[tab.id] ?? Dna}
                        size="md"
                        role="tab"
                        aria-selected={activeId === tab.id}
                        tabIndex={activeId === tab.id ? 0 : -1}
                      />
                    ))}
                  </div>
                </div>

                {/* 줄기세포 치료 탭 전용 안내 섹션 */}
                {(activeId === "stem_cell" || activeId === "줄기세포 치료") && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <StemCellGuide />
                    </div>
                  </div>
                )}

                {/* 카드 그리드 */}
                {activeId && (
                  <div className="rounded-2xl mb-8 overflow-hidden bg-[var(--color-gold-pale)] animate-card-fade">
                    <div className="px-5 pt-5 pb-5 bg-white rounded-b-2xl">
                      {filteredItems.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                          {getText("등록된 시술이 없습니다.", "No treatments available.", "施術情報がありません。", "暂无项目信息。")}
                        </div>
                      ) : (
                        <div
                          aria-live="polite"
                          aria-atomic="false"
                          className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        >
                          {displayedItems.map((item, i) => {
                              const langPrefix = getLangPrefix(lang);
                              const detailPath = `${langPrefix}/equipment3/${item.slug}?tab=${encodeURIComponent(activeId)}`;
                              return (
                            <Equipment3Card
                              key={item.id}
                              item={item}
                              index={i}
                              imgBg={CAT_IMG_BG[item.category ?? "stem_cell"] ?? "#F0F4FF"}
                              detailPath={detailPath}
                            />
                              );
                            })}
                        </div>
                      )}

                      {/* 더보기 / 접기 */}
                      {filteredItems.length > INITIAL_SHOW && (
                        <div className="flex justify-center mt-16">
                          <button
                            type="button"
                            onClick={handleShowMore}
                            className={[
                              "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:shadow-md active:scale-95",
                              showAll
                                ? "bg-white text-[var(--color-star-text-mid)] border border-[1.5px] border-[var(--color-gold-light)]"
                                : "bg-[var(--color-gold-primary)] text-white border-none",
                            ].join(" ")}
                          >
                            {showAll ? (
                              <><ChevronUp size={16} />{getText("접기", "Show Less", "閉じる", "收起")}</>
                            ) : (
                              <><ChevronDown size={16} />{getText(`+${filteredItems.length - INITIAL_SHOW}개 더보기`, `+${filteredItems.length - INITIAL_SHOW} More`, `+${filteredItems.length - INITIAL_SHOW}件を表示`, `+${filteredItems.length - INITIAL_SHOW}个更多`)}</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

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
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE, OG_IMAGE_LOCALIZED, SITE_NAME_LOCALIZED } from "@/components/SeoHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ContactSection from "@/components/ContactSection";
import { getLocalizedUrl } from "@/lib/localizedPath";
import { Loader, ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORY_ICON_MAP, CAT_IMG_BG } from "@/data/treatments/categories";
import CategoryTabButton from "@/components/treatments/CategoryTabButton";
import TreatmentCard from "@/components/treatments/TreatmentCard";
import type { Treatment } from "@/components/treatments/TreatmentCard";
import { Dna } from "lucide-react";

// ── 더보기 표시 개수 ──────────────────────────────────────────────────────────
const INITIAL_SHOW = 6;

// ── equipment3 item → TreatmentCard Treatment 타입 변환 헬퍼 ─────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTreatment(item: Record<string, any>): Treatment {
  return {
    id: item.id,
    categoryId: item.category ?? "stem_cell",
    name: item.name ?? "",
    nameEn: item.nameEn ?? "",
    nameJa: item.nameJa ?? null,
    nameZh: item.nameZh ?? null,
    desc: item.desc ?? "",
    descEn: item.descEn ?? null,
    descJa: item.descJa ?? null,
    descZh: item.descZh ?? null,
    detail: item.detail ?? null,
    detailEn: item.detailEn ?? null,
    detailJa: item.detailJa ?? null,
    detailZh: item.detailZh ?? null,
    effect: item.effect ?? null,
    effectEn: item.effectEn ?? null,
    effectJa: item.effectJa ?? null,
    effectZh: item.effectZh ?? null,
    caution: item.caution ?? null,
    cautionEn: item.cautionEn ?? null,
    cautionJa: item.cautionJa ?? null,
    cautionZh: item.cautionZh ?? null,
    sessions: item.sessions ?? null,
    sessionsEn: item.sessionsEn ?? null,
    sessionsJa: item.sessionsJa ?? null,
    sessionsZh: item.sessionsZh ?? null,
    time: item.time ?? "",
    timeEn: item.timeEn ?? null,
    timeJa: item.timeJa ?? null,
    timeZh: item.timeZh ?? null,
    recovery: item.recovery ?? "",
    recoveryEn: item.recoveryEn ?? null,
    recoveryJa: item.recoveryJa ?? null,
    recoveryZh: item.recoveryZh ?? null,
    badge: item.badge ?? null,
    badgeColor: item.badgeColor ?? null,
    image: item.imageUrl ?? null,
    images: item.images ?? null,
    youtubeUrl: item.youtubeUrl ?? null,
    modalImage: item.modalImage ?? null,
    isActive: item.isActive ?? "1",
    sortOrder: item.sortOrder ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Equipment3() {
  const { lang } = useLang();
  const { getText } = useLocalizedText();

  const { data: rawItems = [], isLoading } = trpc.equipment3.list.useQuery();

  // ── 탭: category 필드 기반 동적 생성 ─────────────────────────────────────
  const tabs = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ id: string; label: string; labelEn: string; labelJa: string; labelZh: string }> = [];
    for (const item of rawItems) {
      const catId = item.category ?? "stem_cell";
      if (!seen.has(catId)) {
        seen.add(catId);
        result.push({
          id: catId,
          label: item.category ?? "줄기세포 치료",
          labelEn: item.categoryEn ?? "STEM CELL",
          labelJa: item.categoryJa ?? "幹細胞治療",
          labelZh: item.categoryZh ?? "干细胞治疗",
        });
      }
    }
    return result;
  }, [rawItems]);

  const [activeId, setActiveId] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // 탭 목록이 로드되면 첫 번째 탭 자동 선택
  useEffect(() => {
    if (tabs.length > 0 && !activeId) {
      setActiveId(tabs[0].id);
    }
  }, [tabs, activeId]);

  const handleTabChange = useCallback((id: string) => {
    setActiveId(id);
    setShowAll(false);
  }, []);

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
                <div className="rounded-2xl px-4 py-4 mb-4 bg-white">
                  {/* 모바일: 2열 그리드 */}
                  <div
                    role="tablist"
                    aria-label="시술 카테고리"
                    className="grid grid-cols-2 gap-2 sm:hidden mb-4"
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
                  {/* 데스크탑: flex-wrap */}
                  <div
                    ref={tabContainerRef}
                    role="tablist"
                    aria-label="시술 카테고리"
                    className="hidden sm:flex sm:flex-wrap gap-2 mt-2 mr-1 -mb-1 ml-4"
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
                          {displayedItems.map((item, i) => (
                            <TreatmentCard
                              key={item.id}
                              item={toTreatment(item)}
                              index={i}
                              imgBg={CAT_IMG_BG[item.category ?? "stem_cell"] ?? "#F0F4FF"}
                            />
                          ))}
                        </div>
                      )}

                      {/* 더보기 / 접기 */}
                      {filteredItems.length > INITIAL_SHOW && (
                        <div className="flex justify-center mt-16">
                          <button
                            type="button"
                            onClick={() => setShowAll((v) => !v)}
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
      <FloatingCTA />
    </div>
  );
}

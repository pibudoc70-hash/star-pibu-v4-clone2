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
import { useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import SeoHead, { buildHreflangs, buildBreadcrumbJsonLd, LANG_TO_OG_LOCALE, OG_IMAGE_LOCALIZED, SITE_NAME_LOCALIZED, BASE_URL } from "@/components/SeoHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { getLocalizedUrl, getLangPrefix } from "@/lib/localizedPath";
import { Loader, ChevronDown, ChevronUp, Clock, RefreshCw, Search, X } from "lucide-react";
import { CATEGORY_ICON_MAP, CAT_IMG_BG } from "@/data/treatments/categories";
import CategoryTabButton from "@/components/treatments/CategoryTabButton";
import OptimizedImage from "@/components/OptimizedImage";
import { withVersion } from "@/lib/imageUrl";
import { Dna } from "lucide-react";
import StemCellGuide from "@/components/treatments/StemCellGuide";
import AcneGuide from "@/components/treatments/AcneGuide";
import LiftingGuide from "@/components/treatments/LiftingGuide";
import UnderEyeGuide from "@/components/treatments/UnderEyeGuide";
import ScarGuide from "@/components/treatments/ScarGuide";
import PigmentGuide from "@/components/treatments/PigmentGuide";
import VolumeGuide from "@/components/treatments/VolumeGuide";
import BotoxGuide from "@/components/treatments/BotoxGuide";
import RosaceaGuide from "@/components/treatments/RosaceaGuide";
import PsoriasisGuide from "@/components/treatments/PsoriasisGuide";
import NailFungusGuide from "@/components/treatments/NailFungusGuide";
import HyperhidrosisGuide from "@/components/treatments/HyperhidrosisGuide";

// ── 더보기 표시 개수 ──────────────────────────────────────────────────────────
const INITIAL_SHOW = 9;

// ── 카테고리 번역 폴백 맵 (DB에 번역이 없을 때 사용) ─────────────────────────
const CATEGORY_TRANS: Record<string, { en: string; ja: string; zh: string }> = {
  "Best 시술":     { en: "Best Treatments",           ja: "ベスト施術",         zh: "最佳项目" },
  "리프팅·탄력":   { en: "Lifting & Elasticity",       ja: "リフティング・弾力",  zh: "提升·弹力" },
  "눈밑지방재배치": { en: "Under-eye Fat Repositioning", ja: "目の下の脂肪再配置",  zh: "眼袋脂肪重置" },
  "백반증":        { en: "Vitiligo",                   ja: "白斑症",             zh: "白癜风" },
  "색소·문신":     { en: "Pigmentation·Tattoo",        ja: "色素・タトゥー",      zh: "色素·纹身" },
  "홍조·혈관":     { en: "Rosacea·Vascular",           ja: "紅潮・血管",          zh: "红斑·血管" },
  "여드름":        { en: "Acne",                       ja: "ニキビ",             zh: "痤疮" },
  "액취증·다한증": { en: "Osmidrosis·Hyperhidrosis",   ja: "腋臭症・多汗症",      zh: "腋臭·多汗症" },
  "손·발톱무좀":   { en: "Nail Fungus",                ja: "爪水虫",             zh: "灰指甲" },
  "건선·아토피":   { en: "Psoriasis·Atopy",            ja: "乾癬・アトピー",      zh: "银屑病·特应性" },
  "볼륨·부스터":   { en: "Volume·Booster",             ja: "ボリューム・ブースター", zh: "填充·促进" },
  "보톡스·필러":   { en: "Botox·Filler",               ja: "ボトックス・フィラー",  zh: "肉毒素·填充" },
  "줄기세포 치료": { en: "Stem Cell Therapy",          ja: "幹細胞治療",          zh: "干细胞治疗" },
  "흉터·모공":     { en: "Scar·Pores",                 ja: "傷跡・毛穴",          zh: "疤痕·毛孔" },
  "피부관리":      { en: "Skin Care",                  ja: "スキンケア",           zh: "皮肤护理" },
};

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
  showCategory = false,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>;
  index: number;
  imgBg: string;
  detailPath: string;
  showCategory?: boolean;
}) {
  const { getText } = useLocalizedText();
  const { lang } = useLang();  // 현재 언어 감지

  const name     = getText(item.name, item.nameEn, item.nameJa, item.nameZh);
  const desc     = getText(item.desc, item.descEn, item.descJa, item.descZh);
  const time     = getText(item.time, item.timeEn, item.timeJa, item.timeZh);
  const recovery = getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh);
  const detail   = getText("자세히 보기", "Learn More", "詳しく見る", "了解详情");
  const catLabel = getText(item.category, item.categoryEn, item.categoryJa, item.categoryZh);

  return (
    <a
      href={detailPath}
      className="equipment-list__card treatment-card group cursor-pointer flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
      style={{
        animation: `cardFadeIn 0.35s ease ${Math.min(index * 0.07, 0.42)}s both`,
        minHeight: "380px",
      }}
      aria-label={`${name} ${detail}`}
    >
      {/* 이미지 — 한국어: imageUrl 기존 방식 / 비한국어: bgImageUrl+텍스트 오버레이 */}
      <div className="relative overflow-hidden" style={{ height: "200px", background: imgBg }}>
        {lang !== "ko" && item.bgImageUrl ? (
          /* ── 비한국어: 배경+텍스트 오버레이 ── */
          <>
            <img
              src={withVersion(item.bgImageUrl, item.updatedAt)}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
            />
            {/* 반투명 어두운 그라디언트 */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
            {/* 텍스트 오버레이 */}
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
              {catLabel && (
                <p
                  className="mt-1 text-xs font-semibold"
                  style={{ color: "rgba(255,255,255,0.9)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
                >
                  ［ {catLabel} ］
                </p>
              )}
            </div>
          </>
        ) : item.imageUrl ? (
          /* ── 한국어 또는 bgImageUrl 없음: 기존 이미지 ── */
          <OptimizedImage
            src={withVersion(item.imageUrl, item.updatedAt)}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : null}
        {/* badge 필드 — isBest/isNew 없을 때만 좌상단, 있으면 우상단 */}
        {item.badge && !String(item.isBest) && !String(item.isNew) && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-bold z-20"
            style={{ backgroundColor: item.badgeColor || "#d1ab67" }}
          >
            {item.badge}
          </span>
        )}
        {item.badge && (String(item.isBest) === "1" || String(item.isNew) === "1") && (
          <span
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-white text-xs font-bold z-20"
            style={{ backgroundColor: item.badgeColor || "#d1ab67" }}
          >
            {item.badge}
          </span>
        )}
        {/* isBest / isNew 시스템 뱃지 — 가로 나란히 */}
        {(String(item.isBest) === "1" || String(item.isNew) === "1") && (
          <div className="absolute top-3 left-3 flex flex-row gap-1 z-20">
            {String(item.isBest) === "1" && (
              <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: "#d1ab67" }}>
                ★ BEST
              </span>
            )}
            {String(item.isNew) === "1" && (
              <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: "#2d9e6b" }}>
                ✨ 신규
              </span>
            )}
          </div>
        )}
        {/* 검색 결과에서 카테고리 태그 표시 */}
        {showCategory && catLabel && (
          <span
            className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium z-20"
            style={{ background: "rgba(0,0,0,0.45)", color: "#fff", backdropFilter: "blur(4px)" }}
          >
            {catLabel}
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
        <div className="equipment-list__detail-link flex items-center gap-1 text-xs font-semibold">
          <span>{detail}</span>
          <span style={{ fontSize: 13 }}>›</span>
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Equipment3() {
  const { lang, t } = useLang();
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
        const fallback = CATEGORY_TRANS[catId] ?? { en: catId, ja: catId, zh: catId };
        result.push({
          id: catId,
          label: item.category ?? catId,
          labelEn: (item.categoryEn && item.categoryEn.trim()) ? item.categoryEn : fallback.en,
          labelJa: (item.categoryJa && item.categoryJa.trim()) ? item.categoryJa : fallback.ja,
          labelZh: (item.categoryZh && item.categoryZh.trim()) ? item.categoryZh : fallback.zh,
        });
      }
    }
    return result;
  }, [rawItems]);

  const search = useSearch();
  const urlTab = useMemo(() => new URLSearchParams(search).get("tab") ?? "", [search]);
  const [requestedTabId, setActiveId] = useState<string>("");
  const activeId = useMemo(() => {
    if (requestedTabId && tabs.some((tab) => tab.id === requestedTabId)) return requestedTabId;
    if (urlTab && tabs.some((tab) => tab.id === urlTab)) return urlTab;
    return tabs[0]?.id ?? "";
  }, [requestedTabId, tabs, urlTab]);
  // sessionStorage에서 초기 expanded 탭 목록 복원
  const [expandedTabs, setExpandedTabsState] = useState<Set<string>>(() => getExpandedTabs());

  // 현재 탭이 expanded 상태인지 여부
  const showAll = activeId ? expandedTabs.has(activeId) : false;
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // ── 검색 상태 ────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 탭 전환 시 검색어 초기화
  const handleTabChange = useCallback((id: string) => {
    setActiveId(id);
    setSearchQuery("");
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

  // 현재 탭 필터링 (검색 없을 때 사용)
  const tabFilteredItems = useMemo(() => {
    if (!activeId) return rawItems;
    if (activeId === "best") {
      return rawItems.filter((item) => String(item.isBest) === "1");
    }
    return rawItems.filter((item) => (item.category ?? "stem_cell") === activeId);
  }, [rawItems, activeId]);

  // 검색어 필터링: 검색 중에는 전체(rawItems) 대상, 아닐 때는 탭 필터 결과
  const isSearching = searchQuery.trim().length > 0;
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tabFilteredItems;
    // 전체 rawItems에서 검색
    return rawItems.filter((item) => {
      const name = [
        item.name, item.nameEn, item.nameJa, item.nameZh,
      ].filter(Boolean).join(" ").toLowerCase();
      const desc = [
        item.desc, item.descEn, item.descJa, item.descZh,
      ].filter(Boolean).join(" ").toLowerCase();
      const badge = (item.badge ?? "").toLowerCase();
      const cat = [
        item.category, item.categoryEn, item.categoryJa, item.categoryZh,
      ].filter(Boolean).join(" ").toLowerCase();
      return name.includes(q) || desc.includes(q) || badge.includes(q) || cat.includes(q);
    });
  }, [rawItems, tabFilteredItems, searchQuery]);

  // 검색 중이면 항상 전체 표시, 아닐 때는 더보기 상태 적용
  const displayedItems = (isSearching || showAll) ? filteredItems : filteredItems.slice(0, INITIAL_SHOW);

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
    <div className="equipment-list-page min-h-screen">
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
        jsonLd={[buildBreadcrumbJsonLd([
          { name: lang === "en" ? "Home" : lang === "ja" ? "ホーム" : lang === "zh" ? "首页" : "홈", url: BASE_URL + "/" },
          { name: lang === "en" ? "Treatments & Equipment" : lang === "ja" ? "施術・機器" : lang === "zh" ? "项目与设备" : "시술 및 장비", url: pageUrl },
        ])]}
      />

      <Header />

      <main className="pt-20">
        <h1 className="sr-only">{pageTitle}</h1>

        <section className="equipment-list__content-surface py-16 sm:py-24" aria-label={pageTitle}>
          <div className="container">
            {/* 섹션 헤더 */}
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-[12px] tracking-widest mb-3 font-montserrat text-[var(--color-gold-primary)] font-light">
                {t.about.sectionLabels?.treatmentsEquipment ?? "TREATMENTS & EQUIPMENT"}
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
              <div
                className="flex flex-col items-center justify-center gap-3 py-24 text-center"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <Loader className="animate-spin text-[var(--color-gold-primary)]" size={32} aria-hidden="true" />
                <p className="text-sm text-gray-500">
                  {getText(
                    "시술·장비 정보를 불러오는 중입니다.",
                    "Loading treatments and equipment.",
                    "施術・機器情報を読み込んでいます。",
                    "正在加载项目与设备信息。"
                  )}
                </p>
              </div>
            )}

            {/* 탭 + 카드 */}
            {!isLoading && (
              <>
                {/* 카테고리 탭 */}
                <div className="equipment-list__tab-panel rounded-2xl px-4 py-6 mb-4 overflow-hidden">
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
                    className="hidden sm:flex sm:flex-wrap gap-2 mt-2 mr-1 -mb-1 ml-4 pb-2 w-full overflow-x-auto px-0 scrollbar-hide"
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

                {/* 검색창 */}
                <div className="mb-4">
                  <div
                    className="equipment-list__search relative flex items-center rounded-2xl shadow-sm overflow-hidden"
                    style={{ transition: "box-shadow 0.2s" }}
                  >
                    <span className="pl-4 pr-2 text-gray-400 flex-shrink-0">
                      <Search size={18} />
                    </span>
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={getText(
                        "전체 시술·장비 검색 (이름, 특징, 카테고리)",
                        "Search all treatments & equipment",
                        "全施術・機器を検索",
                        "搜索全部项目与设备"
                      )}
                      aria-label={getText(
                        "시술 검색",
                        "Search treatments",
                        "施術を検索",
                        "搜索项目"
                      )}
                      className="flex-1 py-3.5 pr-4 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                      style={{ minWidth: 0 }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
                        className="equipment-list__search-clear min-w-11 min-h-11 inline-flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                        aria-label={getText("검색어 지우기", "Clear search", "検索をクリア", "清除搜索")}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {/* 검색 결과 수 표시 */}
                  {isSearching && (
                    <p className="mt-2 text-xs text-gray-400 pl-1">
                      {getText(
                        `전체 시술·장비 검색 — "${searchQuery}" 결과 ${filteredItems.length}건`,
                        `All treatments search — ${filteredItems.length} result${filteredItems.length !== 1 ? "s" : ""} for "${searchQuery}"`,
                        `全施術検索 — 「${searchQuery}」 ${filteredItems.length}件`,
                        `全部搜索 — "${searchQuery}" ${filteredItems.length} 条`
                      )}
                    </p>
                  )}
                </div>

                {/* 리프팅·탄력 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "리프팅·탄력" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <LiftingGuide />
                    </div>
                  </div>
                )}
                {/* 눈밑지방재배치 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "눈밑지방재배치" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <UnderEyeGuide />
                    </div>
                  </div>
                )}
                {/* 여드름 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "여드름" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <AcneGuide />
                    </div>
                  </div>
                )}
                {/* 흉터·모공 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "흉터·모공" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <ScarGuide />
                    </div>
                  </div>
                )}
                {/* 색소·문신 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "색소·문신" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <PigmentGuide />
                    </div>
                  </div>
                )}
                {/* 볼륨·부스터 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "볼륨·부스터" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <VolumeGuide />
                    </div>
                  </div>
                )}
                {/* 보톡스·필러 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "보톡스·필러" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <BotoxGuide />
                    </div>
                  </div>
                )}
                {/* 홍조·혈관 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "홍조·혈관" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <RosaceaGuide />
                    </div>
                  </div>
                )}
                {/* 건선·아토피 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "건선·아토피" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <PsoriasisGuide />
                    </div>
                  </div>
                )}
                {/* 손·발톱무좀 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "손·발톱무좀" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <NailFungusGuide />
                    </div>
                  </div>
                )}
                {/* 액취증·다한증 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && activeId === "액취증·다한증" && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <HyperhidrosisGuide />
                    </div>
                  </div>
                )}
                {/* 줄기세포 치료 탭 전용 안내 섹션 — 검색 중에는 숨김 */}
                {!isSearching && (activeId === "stem_cell" || activeId === "줄기세포 치료") && (
                  <div className="rounded-2xl mb-4 overflow-hidden bg-white animate-card-fade">
                    <div className="px-5 pt-6 pb-2">
                      <StemCellGuide />
                    </div>
                  </div>
                )}

                {/* 카드 그리드 — 검색 중에는 탭에 관계없이 표시 */}
                {(activeId || isSearching) && (
                  <div className="equipment-list__card-panel rounded-2xl mb-8 overflow-hidden animate-card-fade">
                    <div className="equipment-list__card-grid px-5 pt-5 pb-5 rounded-b-2xl">
                      {filteredItems.length === 0 ? (
                        <div className="text-center py-16">
                          {searchQuery.trim() ? (
                            <>
                              <Search size={36} className="mx-auto mb-3 text-gray-300" />
                              <p className="text-gray-400 text-sm">
                                {lang === "en"
                                  ? `No results found for "${searchQuery}".`
                                  : lang === "ja"
                                  ? `「${searchQuery}」に該当する施術がありません。`
                                  : lang === "zh"
                                  ? `未找到与"${searchQuery}"相关的项目。`
                                  : `"${searchQuery}"에 해당하는 시술이 없습니다.`}
                              </p>
                              <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="mt-3 text-xs text-[var(--color-gold-primary)] underline underline-offset-2"
                              >
                                {getText("검색어 초기화", "Clear search", "検索をリセット", "重置搜索")}
                              </button>
                            </>
                          ) : (
                            <p className="text-gray-400">
                              {getText("등록된 시술이 없습니다.", "No treatments available.", "施術情報がありません。", "暂无项目信息。")}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div
                          aria-live="polite"
                          aria-atomic="false"
                          className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        >
                          {displayedItems.map((item, i) => {
                              const langPrefix = getLangPrefix(lang);
                              // 검색 중에는 해당 아이템의 실제 카테고리를 tab으로 사용
                              const tabForPath = isSearching ? (item.category ?? "") : activeId;
                              const detailPath = `${langPrefix}/equipment3/${item.slug}?tab=${encodeURIComponent(tabForPath)}`;
                              return (
                            <Equipment3Card
                              key={item.id}
                              item={item}
                              index={i}
                              imgBg={CAT_IMG_BG[item.category ?? "stem_cell"] ?? "#F0F4FF"}
                              detailPath={detailPath}
                              showCategory={isSearching}
                            />
                              );
                            })}
                        </div>
                      )}

                      {/* 더보기 / 접기 — 검색 중에는 숨김 */}
                      {!searchQuery.trim() && tabFilteredItems.length > INITIAL_SHOW && (
                        <div className="flex justify-center mt-16">
                          <button
                            type="button"
                            onClick={handleShowMore}
                            className={[
                              "equipment-list__more-button flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:shadow-md active:scale-95",
                              showAll
                                ? "equipment-list__more-button--expanded"
                                : "",
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

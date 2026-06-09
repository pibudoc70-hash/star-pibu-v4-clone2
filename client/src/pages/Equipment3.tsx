/**
 * Equipment3 - 시술·장비 소개 목록 페이지 (DB 연동)
 * URL: /equipment3 | /en/equipment3 | /ja/equipment3 | /zh/equipment3
 *
 * 관리자가 등록한 시술을 카드 형태로 표시.
 * 카드 클릭 시 /equipment3/:slug 개별 상세 페이지로 이동.
 */
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE } from "@/components/SeoHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import OptimizedImage from "@/components/OptimizedImage";
import { getLocalizedUrl, getLangPrefix } from "@/lib/localizedPath";
import { Loader } from "lucide-react";

export default function Equipment3() {
  const [, setLocation] = useLocation();
  const { lang } = useLang();
  const { getText } = useLocalizedText();

  const { data: items = [], isLoading } = trpc.equipment3.list.useQuery();

  const langPrefix = getLangPrefix(lang);

  // ── 다국어 UI 레이블 ────────────────────────────────────────────────────────
  const LABELS = {
    pageTitle:   getText("시술·장비 소개",      "Treatments & Equipment",     "施術・機器のご案内",    "项目与设备介绍"),
    pageDesc:    getText(
      "부산 서면 스타피부과의 다양한 시술과 장비를 소개합니다.",
      "Explore our wide range of treatments and equipment at Star Dermatology, Seomyeon, Busan.",
      "釜山西面スター皮膚科の施術・機器をご紹介します。",
      "介绍釜山西面STAR皮肤科的各种项目与设备。"
    ),
    loading:     getText("로딩 중...",           "Loading...",                 "読み込み中...",         "加载中..."),
    empty:       getText(
      "등록된 시술이 없습니다.",
      "No treatments available yet.",
      "施術情報がありません。",
      "暂无项目信息。"
    ),
    detail:      getText("자세히 보기",          "Learn More",                 "詳しく見る",            "了解详情"),
    book:        getText("예약하기",             "Book Now",                   "予約する",              "立即预约"),
    time:        getText("시술 시간",            "Duration",                   "施術時間",              "施术时间"),
    recovery:    getText("회복 기간",            "Recovery",                   "回復期間",              "恢复期"),
    sessions:    getText("권장 횟수",            "Sessions",                   "推奨回数",              "建议次数"),
  } as const;

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

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        canonical={pageUrl}
        ogUrl={pageUrl}
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

      {/* 히어로 헤더 */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{LABELS.pageTitle}</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">{LABELS.pageDesc}</p>
        </div>
      </div>

      {/* 목록 */}
      <main id="main-content" className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader className="animate-spin mr-3" size={32} />
            <span className="text-gray-500">{LABELS.loading}</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg">{LABELS.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => {
              const localName = getText(item.name, item.nameEn, item.nameJa, item.nameZh);
              const localDesc = getText(item.desc, item.descEn, item.descJa, item.descZh);
              const localCategory = getText(item.category, item.categoryEn, item.categoryJa, item.categoryZh);
              const detailPath = `${langPrefix}/equipment3/${item.slug}`;

              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                  onClick={() => setLocation(detailPath)}
                >
                  {/* 이미지 */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {item.imageUrl ? (
                      <OptimizedImage
                        src={item.imageUrl}
                        alt={localName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        height={224}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <span className="text-slate-400 text-4xl font-light">✦</span>
                      </div>
                    )}
                    {/* 뱃지 */}
                    {item.badge && (
                      <span
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-semibold"
                        style={{ backgroundColor: item.badgeColor || "#4A6FA5" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* 콘텐츠 */}
                  <div className="p-6">
                    {localCategory && (
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {localCategory}
                      </p>
                    )}
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {localName}
                    </h2>
                    {localDesc && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {localDesc}
                      </p>
                    )}

                    {/* 메타 정보 */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-5">
                      {item.time && (
                        <span className="flex items-center gap-1">
                          <span className="text-slate-400">⏱</span>
                          {LABELS.time}: {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}
                        </span>
                      )}
                      {item.recovery && (
                        <span className="flex items-center gap-1">
                          <span className="text-slate-400">🔄</span>
                          {LABELS.recovery}: {getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                      onClick={(e) => { e.stopPropagation(); setLocation(detailPath); }}
                    >
                      {LABELS.detail}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <FloatingCTA />
    </div>
  );
}

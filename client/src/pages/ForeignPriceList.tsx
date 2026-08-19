import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, CircleDollarSign, Info, ListFilter, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead, { BASE_URL, LANG_TO_OG_LOCALE, OG_IMAGE_LOCALIZED, SITE_NAME_LOCALIZED } from "@/components/SeoHead";
import { FOREIGN_PRICE_CATEGORIES, FOREIGN_PRICE_LIST_UPDATED, getLocalizedForeignPriceCategories, type ForeignPriceLocale } from "@/lib/foreignPriceList";
import { useLang } from "@/contexts/LangContext";

type FilterId = "all" | (typeof FOREIGN_PRICE_CATEGORIES)[number]["id"];

const PRICE_COPY: Record<ForeignPriceLocale, {
  eyebrow: string; title: string; description: string; updated: string; vat: string; back: string;
  noteTitle: string; noteText: string; careTitle: string; careText: string; sectionEyebrow: string;
  sectionTitle: string; listed: string; all: string; treatment: string; details: string; price: string;
  reference: string; seoTitle: string; seoDescription: string; seoKeywords: string;
}> = {
  en: {
    eyebrow: "Foreign patient information", title: "Price List", description: "A clear overview of treatment pricing for international patients. All amounts are shown in Korean won (KRW).",
    updated: "Last updated", vat: "Prices include VAT unless a row specifically notes otherwise.", back: "Back to English home",
    noteTitle: "Please note:", noteText: "Treatment suitability and the final care plan are determined after an in-person consultation.", careTitle: "Included care", careText: "is shown only where it appears in the source price list.",
    sectionEyebrow: "Treatment pricing", sectionTitle: "Find a treatment category", listed: "listed prices", all: "All treatments", treatment: "Treatment", details: "Details", price: "Price (VAT incl.)",
    reference: "Price information is provided for reference. Please confirm the most current treatment plan and any applicable additional fees during your consultation.",
    seoTitle: "Foreign Patient Price List | Star Dermatology Busan", seoDescription: "Foreign patient treatment prices at Star Dermatology in Busan. Prices are shown in KRW and include VAT unless noted.", seoKeywords: "Busan dermatology price list, foreign patient skin clinic price, Ultherapy Prime price Busan, Thermage FLX price Korea, Star Dermatology",
  },
  ja: {
    eyebrow: "患者向け情報", title: "料金表", description: "すべての金額は韓国ウォン（KRW）で表示しています。",
    updated: "最終更新日", vat: "特記がない限り、料金はVAT込みです。", back: "ホームへ戻る",
    noteTitle: "ご案内：", noteText: "施術の適応と最終的なケアプランは、ご来院後の診察で決定します。", careTitle: "含まれるケア", careText: "は、料金表に記載がある場合に限ります。",
    sectionEyebrow: "施術料金", sectionTitle: "施術カテゴリーを選択", listed: "件の料金", all: "すべての施術", treatment: "施術", details: "詳細", price: "料金（VAT込み）",
    reference: "料金はご案内用です。最新の施術プランおよび追加費用の有無は、診察時にご確認ください。",
    seoTitle: "外国人患者料金表｜釜山STAR皮膚科", seoDescription: "釜山STAR皮膚科の外国人患者向け施術料金表です。金額は韓国ウォン表示、特記がない限りVAT込みです。", seoKeywords: "釜山皮膚科料金, 外国人患者料金表, ウルセラピー釜山, サーマジFLX韓国, STAR皮膚科",
  },
  zh: {
    eyebrow: "外籍患者信息", title: "价格表", description: "为国际患者提供清晰的治疗价格参考。所有金额均以韩元（KRW）标示。",
    updated: "最后更新", vat: "除非特别注明，价格均含增值税。", back: "返回首页",
    noteTitle: "请注意：", noteText: "治疗适用性及最终护理方案将在到院面诊后确定。", careTitle: "含管理", careText: "仅在价格表明确标示时提供。",
    sectionEyebrow: "治疗价格", sectionTitle: "选择治疗分类", listed: "项价格", all: "全部治疗", treatment: "治疗项目", details: "详情", price: "价格（含税）",
    reference: "价格信息仅供参考。请在咨询时确认最新治疗方案及可能产生的额外费用。",
    seoTitle: "外籍患者价格表｜釜山STAR皮肤科", seoDescription: "釜山STAR皮肤科外籍患者治疗价格表。金额以韩元标示，除非另有说明均含增值税。", seoKeywords: "釜山皮肤科价格, 外籍患者价格表, 超声刀釜山, 热玛吉FLX韩国, STAR皮肤科",
  },
  "zh-TW": {
    eyebrow: "外國患者資訊", title: "價格表", description: "為國際患者提供清晰的療程價格參考。所有金額均以韓元（KRW）標示。",
    updated: "最後更新", vat: "除非特別註明，價格均含加值稅。", back: "返回首頁",
    noteTitle: "請注意：", noteText: "療程適用性及最終照護方案將於到院面診後確認。", careTitle: "含管理", careText: "僅於價格表明確標示時提供。",
    sectionEyebrow: "療程價格", sectionTitle: "選擇療程分類", listed: "項價格", all: "全部療程", treatment: "療程項目", details: "詳細內容", price: "價格（含稅）",
    reference: "價格資訊僅供參考。請於諮詢時確認最新療程方案及可能產生的額外費用。",
    seoTitle: "外國患者價格表｜釜山STAR皮膚科", seoDescription: "釜山STAR皮膚科外國患者療程價格表。金額以韓元標示，除非另有說明均含加值稅。", seoKeywords: "釜山皮膚科價格, 外國患者價格表, Ultherapy釜山, Thermage FLX韓國, STAR皮膚科",
  },
};

function getPriceLocale(location: string): ForeignPriceLocale {
  if (location.startsWith("/zh-tw")) return "zh-TW";
  if (location.startsWith("/zh")) return "zh";
  if (location.startsWith("/ja")) return "ja";
  return "en";
}

export default function ForeignPriceList() {
  const [location, navigate] = useLocation();
  const { setLang } = useLang();
  const locale = getPriceLocale(location);
  const copy = PRICE_COPY[locale];
  const categories = getLocalizedForeignPriceCategories(locale);
  const pageUrl = `${BASE_URL}/${locale === "zh-TW" ? "zh-tw" : locale}/price-list`;
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const visibleCategories = activeFilter === "all"
    ? categories
    : categories.filter((category) => category.id === activeFilter);

  useEffect(() => {
    setLang(locale, false);
  }, [locale, setLang]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033]">
      <SeoHead
        title={copy.seoTitle}
        description={copy.seoDescription}
        keywords={copy.seoKeywords}
        canonical={pageUrl}
        ogUrl={pageUrl}
        ogImage={OG_IMAGE_LOCALIZED[locale] ?? OG_IMAGE_LOCALIZED.en}
        ogSiteName={SITE_NAME_LOCALIZED[locale] ?? SITE_NAME_LOCALIZED.en}
        ogLocale={LANG_TO_OG_LOCALE[locale] ?? "en_US"}
        hreflangs={[
          { hreflang: "en", href: `${BASE_URL}/en/price-list` },
          { hreflang: "ja", href: `${BASE_URL}/ja/price-list` },
          { hreflang: "zh", href: `${BASE_URL}/zh/price-list` },
          { hreflang: "zh-TW", href: `${BASE_URL}/zh-tw/price-list` },
          { hreflang: "x-default", href: `${BASE_URL}/en/price-list` },
        ]}
        pageType="treatment"
      />
      <Header />

      <main>
        <section className="relative overflow-hidden bg-[#101C38] px-5 pb-14 pt-32 text-white md:px-8 md:pb-20 md:pt-36">
          <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" style={{ background: "radial-gradient(circle at 84% 12%, rgba(201,169,98,.34), transparent 32%), radial-gradient(circle at 5% 100%, rgba(59,130,246,.26), transparent 42%)" }} />
          <div className="relative mx-auto max-w-6xl">
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#E6D4A1]">
              <CircleDollarSign size={17} aria-hidden="true" />
              {copy.eyebrow}
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
              <div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.035em] md:text-6xl">{copy.title}</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
                  {copy.description}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#F0DFAF]"><CalendarDays size={17} aria-hidden="true" /> {copy.updated}</div>
                <p className="mt-1 text-xl font-bold">{FOREIGN_PRICE_LIST_UPDATED}</p>
                <p className="mt-2 text-sm leading-5 text-slate-300">{copy.vat}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
          <button
            type="button"
            onClick={() => navigate(`/${locale === "zh-TW" ? "zh-tw" : locale}`)}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-[#A57F2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A57F2D]"
          >
            <ArrowLeft size={16} aria-hidden="true" /> {copy.back}
          </button>

          <div className="mb-8 grid gap-4 rounded-2xl border border-[#DCE3EC] bg-white p-5 shadow-[0_10px_30px_rgba(23,32,51,.05)] md:grid-cols-2">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#A57F2D]" size={22} aria-hidden="true" />
              <p className="text-sm leading-6 text-slate-600"><strong className="text-slate-800">{copy.noteTitle}</strong> {copy.noteText}</p>
            </div>
            <div className="flex gap-3">
              <Info className="mt-0.5 shrink-0 text-[#A57F2D]" size={22} aria-hidden="true" />
              <p className="text-sm leading-6 text-slate-600"><strong className="text-slate-800">{copy.careTitle}</strong> {copy.careText}</p>
            </div>
          </div>

          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A57F2D]">{copy.sectionEyebrow}</p>
              <h2 className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[#172033]">{copy.sectionTitle}</h2>
            </div>
            <p className="text-sm text-slate-500">{visibleCategories.reduce((count, category) => count + category.items.length, 0)} {copy.listed}</p>
          </div>

          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter price categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A57F2D] ${activeFilter === "all" ? "bg-[#172033] text-white" : "border border-slate-300 bg-white text-slate-600 hover:border-[#A57F2D] hover:text-[#A57F2D]"}`}
            >
              <ListFilter className="mr-1.5 inline" size={15} aria-hidden="true" /> {copy.all}
            </button>
            {categories.map((category) => (
              <button
                type="button"
                role="tab"
                key={category.id}
                aria-selected={activeFilter === category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A57F2D] ${activeFilter === category.id ? "bg-[#172033] text-white" : "border border-slate-300 bg-white text-slate-600 hover:border-[#A57F2D] hover:text-[#A57F2D]"}`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {visibleCategories.map((category) => (
              <section key={category.id} aria-labelledby={`price-category-${category.id}`} className="overflow-hidden rounded-2xl border border-[#DCE3EC] bg-white shadow-[0_10px_30px_rgba(23,32,51,.05)]">
                <header className="border-b border-[#E8EDF3] bg-[#FCFBF8] px-5 py-4 md:px-7">
                  <h3 id={`price-category-${category.id}`} className="text-xl font-bold tracking-[-0.02em] text-[#172033]">{category.label}</h3>
                </header>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left">
                    <thead className="bg-[#F7F9FC] text-xs uppercase tracking-[0.12em] text-slate-500">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold md:px-7">{copy.treatment}</th>
                        <th scope="col" className="px-5 py-3 font-semibold">{copy.details}</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold md:px-7">{copy.price}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item) => (
                        <tr key={`${item.name}-${item.details ?? ""}`} className="border-t border-[#EDF1F5] align-top">
                          <td className="px-5 py-4 text-sm font-semibold text-[#172033] md:px-7">{item.name}</td>
                          <td className="px-5 py-4 text-sm leading-5 text-slate-600">
                            {item.details ?? "—"}
                            {item.note && <span className="mt-1 block text-xs leading-5 text-[#9A7123]">{item.note}</span>}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-bold text-[#172033] md:px-7">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-xl bg-[#EEF4FB] p-5 text-sm leading-6 text-slate-600">
            <CheckCircle2 className="mt-0.5 shrink-0 text-[#356EA8]" size={19} aria-hidden="true" />
            <p>{copy.reference}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, CircleDollarSign, Info, ListFilter, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead, { BASE_URL, OG_IMAGE_LOCALIZED, SITE_NAME_LOCALIZED } from "@/components/SeoHead";
import { FOREIGN_PRICE_CATEGORIES, FOREIGN_PRICE_LIST_UPDATED } from "@/lib/foreignPriceList";

type FilterId = "all" | (typeof FOREIGN_PRICE_CATEGORIES)[number]["id"];

const PAGE_URL = `${BASE_URL}/en/price-list`;

export default function ForeignPriceList() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const visibleCategories = activeFilter === "all"
    ? FOREIGN_PRICE_CATEGORIES
    : FOREIGN_PRICE_CATEGORIES.filter((category) => category.id === activeFilter);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033]">
      <SeoHead
        title="Foreign Patient Price List | Star Dermatology Busan"
        description="Foreign patient treatment prices at Star Dermatology in Busan. Prices are shown in KRW and include VAT unless noted."
        keywords="Busan dermatology price list, foreign patient skin clinic price, Ultherapy Prime price Busan, Thermage FLX price Korea, Star Dermatology"
        canonical={PAGE_URL}
        ogUrl={PAGE_URL}
        ogImage={OG_IMAGE_LOCALIZED.en}
        ogSiteName={SITE_NAME_LOCALIZED.en}
        ogLocale="en_US"
        hreflangs={[
          { hreflang: "en", href: PAGE_URL },
          { hreflang: "x-default", href: PAGE_URL },
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
              Foreign patient information
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
              <div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.035em] md:text-6xl">Price List</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
                  A clear overview of treatment pricing for international patients. All amounts are shown in Korean won (KRW).
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#F0DFAF]"><CalendarDays size={17} aria-hidden="true" /> Last updated</div>
                <p className="mt-1 text-xl font-bold">{FOREIGN_PRICE_LIST_UPDATED}</p>
                <p className="mt-2 text-sm leading-5 text-slate-300">Prices include VAT unless a row specifically notes otherwise.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
          <button
            type="button"
            onClick={() => navigate("/en")}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-[#A57F2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A57F2D]"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to English home
          </button>

          <div className="mb-8 grid gap-4 rounded-2xl border border-[#DCE3EC] bg-white p-5 shadow-[0_10px_30px_rgba(23,32,51,.05)] md:grid-cols-2">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#A57F2D]" size={22} aria-hidden="true" />
              <p className="text-sm leading-6 text-slate-600"><strong className="text-slate-800">Please note:</strong> Treatment suitability and the final care plan are determined after an in-person consultation.</p>
            </div>
            <div className="flex gap-3">
              <Info className="mt-0.5 shrink-0 text-[#A57F2D]" size={22} aria-hidden="true" />
              <p className="text-sm leading-6 text-slate-600"><strong className="text-slate-800">Included care</strong> is shown only where it appears in the source price list.</p>
            </div>
          </div>

          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A57F2D]">Treatment pricing</p>
              <h2 className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[#172033]">Find a treatment category</h2>
            </div>
            <p className="text-sm text-slate-500">{visibleCategories.reduce((count, category) => count + category.items.length, 0)} listed prices</p>
          </div>

          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter price categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A57F2D] ${activeFilter === "all" ? "bg-[#172033] text-white" : "border border-slate-300 bg-white text-slate-600 hover:border-[#A57F2D] hover:text-[#A57F2D]"}`}
            >
              <ListFilter className="mr-1.5 inline" size={15} aria-hidden="true" /> All treatments
            </button>
            {FOREIGN_PRICE_CATEGORIES.map((category) => (
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
                        <th scope="col" className="px-5 py-3 font-semibold md:px-7">Treatment</th>
                        <th scope="col" className="px-5 py-3 font-semibold">Details</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold md:px-7">Price (VAT incl.)</th>
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
            <p>Price information is provided for reference. Please confirm the most current treatment plan and any applicable additional fees during your consultation.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

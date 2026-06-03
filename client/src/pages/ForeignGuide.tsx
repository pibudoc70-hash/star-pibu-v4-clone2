/**
 * ForeignGuide Page - STAR 피부과 외국어 안내
 * 디자인: 모던 클리니컬 엣지 - 민트-네이비 듀오톤
 * 영어·일본어·중국어 방문객을 위한 전용 안내 페이지 (3개 언어 지원)
 */
import { useState, useEffect } from "react";
import { Phone, Clock, MapPin, ChevronRight, ArrowLeft, Globe, Plane, DollarSign, Headphones } from "lucide-react";
import Header from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { useLang } from "@/contexts/LangContext";
import { Lang, langCodes, langLabels, i18n } from "@/lib/i18n";

type ForeignLang = "en" | "ja" | "zh";

const FOREIGN_LANGS: ForeignLang[] = ["en", "ja", "zh"];

const LANG_COLORS: Record<ForeignLang, { bg: string; text: string; accent: string }> = {
  en: { bg: "linear-gradient(135deg, #1a3a5c 0%, #2563EB 60%, #60A5FA 100%)", text: "#2563EB", accent: "#DBEAFE" },
  ja: { bg: "linear-gradient(135deg, #1F2937 0%, #4A6FA5 60%, #81C7C9 100%)", text: "#4A6FA5", accent: "#EEF7F7" },
  zh: { bg: "linear-gradient(135deg, #7f1d1d 0%, #DC2626 60%, #F87171 100%)", text: "#DC2626", accent: "#FEE2E2" },
};

export default function ForeignGuide() {
  const { lang: globalLang, setLang } = useLang();
  const [activeLang, setActiveLang] = useState<ForeignLang>(
    globalLang === "en" || globalLang === "ja" || globalLang === "zh"
      ? (globalLang as ForeignLang)
      : "en"
  );

  // 전역 언어가 외국어로 바뀌면 activeLang도 동기화
  useEffect(() => {
    if (globalLang === "en" || globalLang === "ja" || globalLang === "zh") {
      setActiveLang(globalLang as ForeignLang);
    }
  }, [globalLang]);

  const t = i18n[activeLang];
  const colors = LANG_COLORS[activeLang];

  const handleLangSwitch = (l: ForeignLang) => {
    setActiveLang(l);
    setLang(l);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <SeoHead
        title="외국인 안내 | 부산 스타피부과 - 영어·일본어·중국어 진료 안내"
        description="부산 서면 스타피부과는 외국인 환자를 위한 영어·일본어·중국어 진료 안내를 제공합니다. Ultherapy, Thermage FLX, Under-Eye Fat Repositioning 등 프리미엄 시술 가능."
        keywords="부산피부과외국인, Busan dermatology, 釜山皮肤科, 釜山皮膚科, 울쎄라피, Ultherapy Busan, 써마지부산"
        canonical="https://www.star-pibu.com/foreign-guide"
        ogImage="https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/울쎄라피프라임_1_0daba485.png"
        hreflangs={[
          { hreflang: "en", href: "https://www.star-pibu.com/en" },
          { hreflang: "ja", href: "https://www.star-pibu.com/ja" },
          { hreflang: "zh", href: "https://www.star-pibu.com/zh" },
        ]}
      />
      <Header />

      {/* Hero Banner */}
      <section
        className="relative flex items-center justify-center"
        style={{
          paddingTop: "72px",
          minHeight: "280px",
          background: colors.bg,
          transition: "background 0.4s ease",
        }}
      >
        <div className="text-center text-white px-6 py-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe size={20} className="opacity-70" />
            <span className="text-sm font-medium opacity-70 tracking-widest uppercase">
              Foreign Patient Guide
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t.foreignGuide.title}
          </h1>
          <p className="text-base opacity-80 max-w-xl mx-auto">
            {t.foreignGuide.subtitle}
          </p>

          {/* Language Toggle - EN / JP / CN */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {FOREIGN_LANGS.map((l) => (
              <button
                key={l}
                onClick={() => handleLangSwitch(l)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200"
                style={{
                  background: l === activeLang ? "white" : "rgba(255,255,255,0.15)",
                  color: l === activeLang ? colors.text : "white",
                  border: "2px solid",
                  borderColor: l === activeLang ? "white" : "rgba(255,255,255,0.3)",
                  transform: l === activeLang ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span className="font-bold tracking-wider">{langCodes[l]}</span>
                <span className="hidden sm:inline">{langLabels[l]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
          style={{ color: "#6B7280" }}
        >
          <ArrowLeft size={16} />
          {activeLang === "ja" ? "ホームへ戻る" : activeLang === "zh" ? "返回首页" : "Back to Home"}
        </a>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* Steps */}
        <section>
          <h2 className="text-xl font-bold mb-6" style={{ color: "#1F2937" }}>
            {activeLang === "ja" ? "ご来院の流れ" : activeLang === "zh" ? "就诊流程" : "How to Visit"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.foreignGuide.steps.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl p-6 border transition-all duration-200 hover:shadow-md"
                style={{
                  background: "white",
                  borderColor: "#E5E7EB",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="text-4xl font-black mb-3 leading-none"
                  style={{ color: colors.accent }}
                >
                  {step.step}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#1F2937" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Hours & Access */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hours */}
          <section
            className="rounded-2xl p-6 border"
            style={{ background: "white", borderColor: "#E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock size={18} style={{ color: colors.text }} />
              <h2 className="text-base font-bold" style={{ color: "#1F2937" }}>
                {t.hours.title}
              </h2>
            </div>
            <div className="space-y-3">
              {t.hours.rows.map((row, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "#F3F4F6" }}>
                  <span className="text-sm font-medium" style={{ color: "#374151" }}>{row.day}</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: (row.time.includes("休") || row.time.includes("Closed") || row.time.includes("休息")) ? "#EF4444" : colors.text }}
                  >
                    {row.time}
                  </span>
                </div>
              ))}
              <p className="text-xs pt-1" style={{ color: "#9CA3AF" }}>{t.hours.note}</p>
            </div>
          </section>

          {/* Access */}
          <section
            className="rounded-2xl p-6 border"
            style={{ background: "white", borderColor: "#E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={18} style={{ color: colors.text }} />
              <h2 className="text-base font-bold" style={{ color: "#1F2937" }}>
                {t.access.title}
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
                  {activeLang === "ja" ? "住所" : activeLang === "zh" ? "地址" : "Address"}
                </p>
                <p className="text-sm" style={{ color: "#374151" }}>{t.access.address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
                  {activeLang === "ja" ? "地下鉄" : activeLang === "zh" ? "地铁" : "Subway"}
                </p>
                <p className="text-sm" style={{ color: "#374151" }}>{t.access.subway}</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
                  {activeLang === "ja" ? "駐車場" : activeLang === "zh" ? "停车场" : "Parking"}
                </p>
                <p className="text-sm" style={{ color: "#374151" }}>{t.access.parking}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Transportation Section */}
        <section
          className="rounded-2xl p-6 border"
          style={{ background: "white", borderColor: "#E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Plane size={18} style={{ color: colors.text }} />
            <h2 className="text-base font-bold" style={{ color: "#1F2937" }}>
              {t.foreignGuide.transportation.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {t.foreignGuide.transportation.methods.map((method, idx) => (
              <div key={idx} className="p-4 rounded-lg" style={{ background: colors.accent }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: colors.text }}>
                  {method.name}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
                  {method.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Currency & Payment Section */}
        <section
          className="rounded-2xl p-6 border"
          style={{ background: "white", borderColor: "#E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={18} style={{ color: colors.text }} />
            <h2 className="text-base font-bold" style={{ color: "#1F2937" }}>
              {t.foreignGuide.currency.title}
            </h2>
          </div>
          <p className="text-sm mb-4 p-3 rounded-lg" style={{ background: colors.accent, color: "#374151" }}>
            {t.foreignGuide.currency.info}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {t.foreignGuide.currency.methods.map((method, idx) => (
              <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: "#E5E7EB", background: "#FAFBFC" }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: colors.text }}>
                  {method.name}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
                  {method.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interpretation Services Section */}
        <section
          className="rounded-2xl p-6 border"
          style={{ background: "white", borderColor: "#E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Headphones size={18} style={{ color: colors.text }} />
            <h2 className="text-base font-bold" style={{ color: "#1F2937" }}>
              {t.foreignGuide.interpretation.title}
            </h2>
          </div>
          <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
            {t.foreignGuide.interpretation.desc}
          </p>
          <div className="space-y-3">
            {t.foreignGuide.interpretation.services.map((service, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-lg border"
                style={{ borderColor: "#E5E7EB", background: "#FAFBFC" }}
              >
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: colors.text }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1" style={{ color: colors.text }}>
                    {service.name}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Treatments */}
        <section>
          <h2 className="text-xl font-bold mb-6" style={{ color: "#1F2937" }}>
            {t.treatments.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.treatments.categories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-md"
                style={{
                  background: "white",
                  borderColor: "#E5E7EB",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <h3 className="font-bold text-sm mb-3 pb-2 border-b" style={{ color: colors.text, borderColor: colors.accent }}>
                  {cat.name}
                </h3>
                <ul className="space-y-1.5">
                  {cat.items.map((item, ii) => (
                    <li key={ii} className="flex items-center gap-2 text-xs" style={{ color: "#374151" }}>
                      <ChevronRight size={11} style={{ color: colors.text, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section
          className="rounded-2xl p-6 border"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}, #F0F7FF)`,
            borderColor: "#D1E8E8",
          }}
        >
          <h2 className="text-base font-bold mb-4" style={{ color: "#1F2937" }}>
            {activeLang === "ja" ? "ご来院前にご確認ください" : activeLang === "zh" ? "就诊前请注意" : "Before Your Visit"}
          </h2>
          <ul className="space-y-3">
            {t.foreignGuide.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "#374151" }}>
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                  style={{ background: colors.text }}
                >
                  {idx + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#1F2937" }}>
            {activeLang === "ja" ? "ご予約・お問い合わせ" : activeLang === "zh" ? "预约与咨询" : "Book Your Appointment"}
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
            {activeLang === "ja"
              ? "お気軽にお問い合わせください。日本語対応はOTOMOをご利用ください。"
              : activeLang === "zh"
              ? "欢迎随时联系我们，我们提供中文咨询服务。"
              : "Contact us anytime. We offer consultation services in English."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={globalLang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: colors.text, color: "white" }}
            >
              <Phone size={16} />
              {globalLang === "ko" ? "051-818-2300" : "+82-51-818-2300"}
            </a>
            <a
              href="https://pf.kakao.com/_HNyGC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "#FEE500", color: "#1F2937" }}
            >
              KakaoTalk
            </a>
            {activeLang === "ja" && (
              <a
                href="https://otomo-busan.com/star/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 border"
                style={{ background: "white", color: "#4A6FA5", borderColor: "#4A6FA5" }}
              >
                🇯🇵 OTOMO 日本語予約
              </a>
            )}
            {activeLang === "en" && (
              <a
                href="https://booking.naver.com/booking/13/bizes/1122956"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 border"
                style={{ background: "white", color: colors.text, borderColor: colors.text }}
              >
                Online Booking (Naver)
              </a>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center" style={{ borderColor: "#E5E7EB", background: "white" }}>
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          {t.footer.address}
        </p>
        <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
          Tel. {t.footer.tel} · {t.footer.copyright}
        </p>
      </footer>
    </div>
  );
}

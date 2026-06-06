/**
 * ForeignGuide Page - STAR 피부과 외국어 안내
 * 디자인: 모던 클리니컬 엣지 - 민트-네이비 듀오톤
 * 영어·일본어·중국어 방문객을 위한 전용 안내 페이지 (3개 언어 지원)
 *
 * [PAGE LIFECYCLE] localized live page (PR-39 alias 정책 확정)
 * - route: /foreign-guide, /en/foreign-guide, /ja/foreign-guide, /zh/foreign-guide (App.tsx live)
 *
 * [ALIAS POLICY] /foreign-guide = /en/foreign-guide 의 영어 alias
 * - 이 페이지는 en/ja/zh 전용 콘텐츠로, ko 콘텐츠가 없음
 * - /foreign-guide 접근 시 activeLang = en (영어 alias 정책)
 * - canonical = `/${activeLang}/foreign-guide` 로 자동 정렬
 *   · /foreign-guide 접근 → canonical = /en/foreign-guide (영어 alias 자동 정렬)
 *   · /en/foreign-guide → canonical = /en/foreign-guide
 *   · /ja/foreign-guide → canonical = /ja/foreign-guide
 *   · /zh/foreign-guide → canonical = /zh/foreign-guide
 * - 별도 HTTP redirect 없음: SPA 환경에서 canonical 자동 정렬으로 충분
 *
 * - ogUrl: canonical과 동일
 * - ogLocale: LANG_TO_OG_LOCALE[activeLang] (언어별 정렬)
 * - hreflangs: custom 배열 (ko 없음, x-default=/en/foreign-guide)
 *   · en  -> /en/foreign-guide
 *   · ja  -> /ja/foreign-guide
 *   · zh  -> /zh/foreign-guide
 *   · x-default -> /en/foreign-guide
 *   · ko hreflang 없음 (ko 콘텐츠 없는 페이지이므로 sitemap 정책과 동일)
 * - 본문: en/ja/zh 3개 언어 전체 제공 (한국어 콘텐츠 없음)
 * - noindex: 없음 (전체 색인 허용)
 */
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Phone, Clock, MapPin, ChevronRight, ArrowLeft, Globe, Plane, DollarSign, Headphones } from "lucide-react";
import Header from "@/components/Header";
import SeoHead, { BASE_URL, LANG_TO_OG_LOCALE, OG_IMAGE_LOCALIZED, SITE_NAME_LOCALIZED } from "@/components/SeoHead";
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
  const { setLang } = useLang();
  const [location, navigate] = useLocation();

  /**
   * activeLang: route(URL)가 진실의 원천
   * - wouter location 변화 시마다 재계산 → back/forward 시 stale state 없음
   * - /foreign-guide = /en/foreign-guide alias → en
   * - 상태(useState)가 아닌 computed value이므로 동기화 불일치 불가
   */
  const activeLang: ForeignLang = (() => {
    if (location.startsWith("/ja")) return "ja";
    if (location.startsWith("/zh")) return "zh";
    return "en"; // /foreign-guide 또는 /en/foreign-guide → en
  })();

  // LangContext를 route 기준으로 항상 동기화 (persist=false: localStorage 오염 방지)
  useEffect(() => {
    setLang(activeLang, false);
  }, [activeLang, setLang]);

  const t = i18n[activeLang];
  const colors = LANG_COLORS[activeLang];

  // SEO: 현재 언어 route 기준 pageUrl 계산 (localized live page 정책)
  // ForeignGuide는 en/ja/zh만 지원 (한국어 route 없음)
  const langPrefix = `/${activeLang}`;
  const pageUrl = `https://www.star-pibu.com${langPrefix}/foreign-guide`;

  // 언어별 SEO 메타 (title/description/keywords)
  const SEO_META: Record<ForeignLang, { title: string; description: string; keywords: string }> = {
    en: {
      title: "Foreign Patient Guide | Star Dermatology Clinic Busan",
      description: "Star Dermatology Clinic in Seomyeon, Busan offers English-language consultations. Ultherapy Prime, Thermage FLX, Under-Eye Fat Repositioning and more.",
      keywords: "Busan dermatology, Star Dermatology Clinic, Ultherapy Busan, Thermage Busan, skin clinic Busan, foreign patient guide",
    },
    ja: {
      title: "外国人患者ガイド | 釜山スター皮膚科",
      description: "釜山西面のスター皮膚科では日本語対応の診療案内を提供しています。ウルセラピープライム・サーマジFLX・目の下の脂肪再配置など。",
      keywords: "釜山皮膚科, スター皮膚科, ウルセラピー釜山, サーマジ釜山, 外国人診療, 日本語対応",
    },
    zh: {
      title: "外国患者就诊指南 | 釜山星皮肤科",
      description: "釜山西面星皮肤科提供中文就诊服务。热玛吉FLX、皮秒激光、眼袋脂肪重置等高端医疗项目，欢迎中文咨询。",
      keywords: "釜山皮肤科, 星皮肤科, 热玛吉釜山, 皮秒激光釜山, 外国患者, 中文咨询",
    },
  };
  const seo = SEO_META[activeLang];

  /**
   * 내부 언어 토글: 실제 route 이동 + 사용자 선호 저장
   *
   * [PERSIST 정책]
   *   - useEffect의 setLang(activeLang, false): route 기준 동기화 (localStorage 오염 방지)
   *   - handleLangSwitch의 setLang(l, true (default)): 사용자가 직접 클릭한 언어는
   *     선호로 간주하여 localStorage에 저장.
   *     다른 페이지로 이동 후 foreign-guide로 돌아왔을 때
   *     선호 언어를 유지하는 용도.
   *   → route가 진실 원체이므로 activeLang은 언제나 URL에서 재계산됨.
   */
  const handleLangSwitch = (l: ForeignLang) => {
    setLang(l); // persist=true (default): 사용자 선호 저장
    navigate(`/${l}/foreign-guide`);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <SeoHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={pageUrl}
        ogUrl={pageUrl}
        ogImage={OG_IMAGE_LOCALIZED[activeLang] ?? OG_IMAGE_LOCALIZED.en}
        ogSiteName={SITE_NAME_LOCALIZED[activeLang] ?? SITE_NAME_LOCALIZED.en}
        ogLocale={LANG_TO_OG_LOCALE[activeLang] ?? "ko_KR"}
        hreflangs={[
          // ko hreflang 없음 — ko 콘텐츠가 없는 페이지 (sitemap 정책과 동일)
          { hreflang: "en",        href: `${BASE_URL}/en/foreign-guide` },
          { hreflang: "ja",        href: `${BASE_URL}/ja/foreign-guide` },
          { hreflang: "zh",        href: `${BASE_URL}/zh/foreign-guide` },
          { hreflang: "x-default", href: `${BASE_URL}/en/foreign-guide` },
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
              <button type="button"
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

      {/* Back Button - locale-aware: /en, /ja, /zh 홈으로 이동 */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <a
          href={`/${activeLang}`}
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
              href="tel:+82-51-818-2300"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: colors.text, color: "white" }}
            >
              <Phone size={16} />
              {"+82-51-818-2300"}
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

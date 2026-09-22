import MainLayout from "@/components/MainLayout";
import SpecialEventSection from "@/components/SpecialEventSection";
import ContactSection from "@/components/ContactSection";
import SeoHead, {
  BASE_URL,
  buildBreadcrumbJsonLd,
  buildHreflangs,
  LANG_TO_OG_LOCALE,
  OG_IMAGE_LOCALIZED,
  SITE_NAME_LOCALIZED,
} from "@/components/SeoHead";
import { useLang } from "@/contexts/LangContext";
import { getLocalizedUrl } from "@/lib/localizedPath";

const EVENT_COPY = {
  ko: {
    eyebrow: "STAR DERMATOLOGY",
    title: "EVENT",
    subtitle: "스타피부과의 특별한 혜택과 최신 이벤트를 확인해보세요.",
    seoTitle: "스페셜 이벤트 | 부산 서면 스타피부과",
    seoDescription: "부산 서면 스타피부과의 스페셜 이벤트를 확인하세요. 울쎄라피 프라임, 써마지 FLX 등 다양한 피부 관리 혜택을 안내합니다.",
    breadcrumb: "이벤트",
  },
  en: {
    eyebrow: "STAR DERMATOLOGY",
    title: "EVENT",
    subtitle: "Explore STAR Dermatology's latest special benefits and events.",
    seoTitle: "Special Events | STAR Dermatology Clinic Busan",
    seoDescription: "Explore the latest special events and benefits at STAR Dermatology Clinic in Seomyeon, Busan.",
    breadcrumb: "Events",
  },
  ja: {
    eyebrow: "STAR DERMATOLOGY",
    title: "EVENT",
    subtitle: "スター皮膚科の特別な特典と最新イベントをご確認ください。",
    seoTitle: "スペシャルイベント | 釜山西面スター皮膚科",
    seoDescription: "釜山西面スター皮膚科の最新スペシャルイベントと特典をご案内します。",
    breadcrumb: "イベント",
  },
  zh: {
    eyebrow: "STAR DERMATOLOGY",
    title: "EVENT",
    subtitle: "查看STAR皮肤科的特别优惠和最新活动。",
    seoTitle: "特别活动 | 釜山西面STAR皮肤科",
    seoDescription: "查看釜山西面STAR皮肤科的最新特别活动与优惠。",
    breadcrumb: "活动",
  },
  "zh-TW": {
    eyebrow: "STAR DERMATOLOGY",
    title: "EVENT",
    subtitle: "查看STAR皮膚科的特別優惠與最新活動。",
    seoTitle: "特別活動｜釜山西面STAR皮膚科",
    seoDescription: "查看釜山西面STAR皮膚科的最新特別活動與優惠。",
    breadcrumb: "活動",
  },
} as const;

export default function Event() {
  const { lang } = useLang();
  const copy = EVENT_COPY[lang] ?? EVENT_COPY.ko;
  const pageUrl = getLocalizedUrl(lang, "/event");
  const siteName = SITE_NAME_LOCALIZED[lang] ?? SITE_NAME_LOCALIZED.ko;

  return (
    <MainLayout>
      <SeoHead
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={pageUrl}
        ogUrl={pageUrl}
        ogImage={OG_IMAGE_LOCALIZED[lang] ?? OG_IMAGE_LOCALIZED.ko}
        ogSiteName={siteName}
        ogLocale={LANG_TO_OG_LOCALE[lang] ?? "ko_KR"}
        hreflangs={buildHreflangs("/event", "/en/event", "/ja/event", "/zh/event", "/zh-tw/event")}
        pageType="treatment"
        jsonLd={[buildBreadcrumbJsonLd([
          { name: lang === "en" ? "Home" : lang === "ja" ? "ホーム" : lang === "zh" ? "首页" : lang === "zh-TW" ? "首頁" : "홈", url: BASE_URL + "/" },
          { name: copy.breadcrumb, url: BASE_URL + pageUrl },
        ])]}
      />

      <section className="dr-page-header pt-28 pb-12 sm:pt-32 sm:pb-16 text-center" aria-labelledby="event-page-title">
        <div className="container">
          <p className="dr-page-header-eyebrow font-montserrat text-xs tracking-[0.3em] uppercase mb-3">
            {copy.eyebrow}
          </p>
          <h1 id="event-page-title" className="dr-page-header-title text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            {copy.title}
          </h1>
          <p className="dr-page-header-tagline text-sm sm:text-base">
            {copy.subtitle}
          </p>
        </div>
      </section>

      <div className="section-bg-cream">
        <SpecialEventSection />
      </div>
      <ContactSection />
    </MainLayout>
  );
}

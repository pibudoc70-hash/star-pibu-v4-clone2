import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider, useLang } from "./contexts/LangContext";
import { lazy, Suspense, useEffect } from "react";
import Home from "./pages/Home";

// 동적 import로 라우트별 코드 스플리팅
const NotFound = lazy(() => import("@/pages/NotFound"));
const ForeignGuide = lazy(() => import("@/pages/ForeignGuide"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const TreatmentDetail = lazy(() => import("@/pages/TreatmentDetail"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminYouTube = lazy(() => import("@/pages/AdminYouTube"));
const MyReservations = lazy(() => import("@/pages/MyReservations"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const NonCoveredGuide = lazy(() => import("@/pages/NonCoveredGuide"));
const About = lazy(() => import("@/pages/About"));
const Equipment2 = lazy(() => import("@/pages/Equipment2"));
const Equipment2Detail = lazy(() => import("@/pages/Equipment2Detail"));
const AdminEquipment2New = lazy(() => import("@/pages/AdminEquipment2New"));
const AdminEquipment2Edit = lazy(() => import("@/pages/AdminEquipment2Edit"));
const TreatmentPage = lazy(() => import("@/pages/TreatmentPage"));
const LandingEN = lazy(() => import("@/pages/LandingEN"));
const LandingJA = lazy(() => import("@/pages/LandingJA"));
const LandingZH = lazy(() => import("@/pages/LandingZH"));
// 로그인·마이페이지·예약 페이지는 네이버예약·카카오톡 외부 링크로 대체됨

// 로드 중 로딩 스폰너
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
function HtmlLangUpdater() {
  const [location] = useLocation();
  const { lang } = useLang();

  useEffect(() => {
    // URL 기반으로 html lang 설정
    let htmlLang = "ko";
    if (location === "/en" || location.startsWith("/en/")) {
      htmlLang = "en";
    } else if (location === "/ja" || location.startsWith("/ja/")) {
      htmlLang = "ja";
    } else if (location === "/zh" || location.startsWith("/zh/")) {
      htmlLang = "zh";
    }
    document.documentElement.lang = htmlLang;
    
    // hreflang 태그 업데이트 (각 페이지에서 모든 언어 버전 참조)
    const baseUrl = "https://www.star-pibu.com";
    const hreflangs = [
      { hreflang: "ko", href: `${baseUrl}/` },
      { hreflang: "en", href: `${baseUrl}/en` },
      { hreflang: "ja", href: `${baseUrl}/ja` },
      { hreflang: "zh", href: `${baseUrl}/zh` },
      { hreflang: "x-default", href: `${baseUrl}/` }
    ];
    
    hreflangs.forEach(({ hreflang, href }) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
      if (!el) {
        el = document.createElement("link");
        el.rel = "alternate";
        el.hreflang = hreflang;
        document.head.appendChild(el);
      }
      el.href = href;
    });
    
    // canonical 태그 설정
    let canonicalEl = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    
    let canonicalUrl = `${baseUrl}/`;
    if (htmlLang === "en") canonicalUrl = `${baseUrl}/en`;
    else if (htmlLang === "ja") canonicalUrl = `${baseUrl}/ja`;
    else if (htmlLang === "zh") canonicalUrl = `${baseUrl}/zh`;
    
    canonicalEl.href = canonicalUrl;
  }, [location]);

  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HtmlLangUpdater />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/foreign-guide"} component={ForeignGuide} />
        <Route path={"/events/:id"} component={EventDetail} />
        <Route path={"/treatment/:name"} component={TreatmentDetail} />
        <Route path={"/treatments/:slug"} component={TreatmentPage} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/admin/equipment2/new"} component={AdminEquipment2New} />
        <Route path={"/admin/equipment2/:id/edit"} component={AdminEquipment2Edit} />
        <Route path={"/admin/youtube"} component={AdminYouTube} />
        <Route path={"/my-reservations"} component={MyReservations} />
        <Route path={"/equipment2"} component={Equipment2} />
        <Route path={"/equipment2/:slug"} component={Equipment2Detail} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/non-covered"} component={NonCoveredGuide} />
        <Route path={"/about"} component={About} />
        <Route path={"/en"} component={LandingEN} />
        <Route path={"/ja"} component={LandingJA} />
        <Route path={"/zh"} component={LandingZH} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LangProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { lazy, Suspense, useEffect, Component, ReactNode } from "react";
import Home from "./pages/Home";

// ErrorBoundary for Map component
class MapErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[MapErrorBoundary] Map component failed to load:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl">
          <a
            href="https://map.kakao.com/link/search/부산광역시 부산진구 서면로 74 아이온시티빌딩"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-center px-6 py-8 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#FFCD00" }}>
              <span className="text-2xl font-bold" style={{ color: "#3C1E1E" }}>K</span>
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">카카오맵에서 보기</p>
              <p className="text-gray-500 text-sm mt-1">부산 서면 아이온시티빌딩 2·4층</p>
            </div>
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

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

// Map 로드 실패 시 폴백 UI
function MapLoadingFallback() {
  return (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl">
      <div className="text-center">
        <p className="text-gray-500">지도를 불러오는 중입니다...</p>
      </div>
    </div>
  );
}
// HtmlLangUpdater: html[lang] 속성만 URL 기반으로 업데이트
// hreflang/canonical은 각 페이지의 SeoHead 컴포넌트에서 선언적으로 관리
function HtmlLangUpdater() {
  const [location] = useLocation();

  useEffect(() => {
    let htmlLang = "ko";
    if (location === "/en" || location.startsWith("/en/")) htmlLang = "en";
    else if (location === "/ja" || location.startsWith("/ja/")) htmlLang = "ja";
    else if (location === "/zh" || location.startsWith("/zh/")) htmlLang = "zh";
    document.documentElement.lang = htmlLang;
  }, [location]);

  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HtmlLangUpdater />
      <MapErrorBoundary>
        <Suspense fallback={<MapLoadingFallback />}>
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
        <Route path={"/en/privacy"} component={Privacy} />
        <Route path={"/ja/privacy"} component={Privacy} />
        <Route path={"/zh/privacy"} component={Privacy} />
        <Route path={"/non-covered"} component={NonCoveredGuide} />
        <Route path={"/en/non-covered"} component={NonCoveredGuide} />
        <Route path={"/ja/non-covered"} component={NonCoveredGuide} />
        <Route path={"/zh/non-covered"} component={NonCoveredGuide} />
        <Route path={"/foreign-guide"} component={ForeignGuide} />
        <Route path={"/en/foreign-guide"} component={ForeignGuide} />
        <Route path={"/ja/foreign-guide"} component={ForeignGuide} />
        <Route path={"/zh/foreign-guide"} component={ForeignGuide} />
        <Route path={"/about"} component={About} />
        <Route path={"/en/about"} component={About} />
        <Route path={"/ja/about"} component={About} />
        <Route path={"/zh/about"} component={About} />
        <Route path={"/en"} component={LandingEN} />
        <Route path={"/ja"} component={LandingJA} />
        <Route path={"/zh"} component={LandingZH} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
          </Switch>
        </Suspense>
      </MapErrorBoundary>
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

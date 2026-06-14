import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider, useLang } from "./contexts/LangContext";
import { Suspense, useEffect } from "react";
import Home from "./pages/Home";
import MapErrorBoundary from "./components/MapErrorBoundary";
import {
  NotFound, ForeignGuide, EventDetail, TreatmentRedirect,
  AdminDashboard, AdminYouTube, MyReservations, Privacy, NonCoveredGuide,
  About, Equipment2, Equipment2Detail, AdminEquipment2New, AdminEquipment2Edit,
  Equipment3, Equipment3Detail, AdminEquipment3, AdminEquipment3New, AdminEquipment3Edit,
  TreatmentPage, LandingEN, LandingJA, LandingZH, Research,
  LANG_ROUTES, withLangPrefixes,
} from "./routes";

// ─── 공통 UI ─────────────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ background: 'var(--brand-bg, #FAF8F5)' }}
      aria-busy="true"
      aria-label="페이지 로딩 중"
    >
      {/* 브랜드 로고 스켈레톤 */}
      <div className="flex flex-col items-center gap-4 mb-12" aria-hidden="true">
        <div className="skeleton-shimmer rounded-full" style={{ width: 64, height: 64 }} />
        <div className="skeleton-shimmer rounded" style={{ width: 160, height: 24 }} />
        <div className="skeleton-shimmer rounded" style={{ width: 220, height: 14 }} />
      </div>
      {/* Hero 영역 스켈레톤 */}
      <div className="w-full max-w-lg px-8 flex flex-col gap-3" aria-hidden="true">
        <div className="skeleton-shimmer rounded" style={{ height: 14, width: '40%' }} />
        <div className="skeleton-shimmer rounded" style={{ height: 52, width: '90%' }} />
        <div className="skeleton-shimmer rounded" style={{ height: 14, width: '70%' }} />
        <div className="flex gap-3 mt-4">
          <div className="skeleton-shimmer rounded-full" style={{ height: 44, width: 140 }} />
          <div className="skeleton-shimmer rounded-full" style={{ height: 44, width: 100 }} />
        </div>
      </div>
    </div>
  );
}

function MapLoadingFallback() {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden" aria-hidden="true">
      <div className="skeleton-shimmer w-full h-full" />
    </div>
  );
}

// ─── 라우트 변경 시 상단 이동 ─────────────────────────────────────────────────
// sessionStorage에 스크롤 대상이 있으면 Home.tsx가 처리하므로 여기서는 건드리지 않음
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    if (!sessionStorage.getItem("__star_scroll_to")) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);
  return null;
}

// ─── html[lang] + LangContext 동기화 ─────────────────────────────────────────
// /foreign-guide (prefix 없음) = /en/foreign-guide 의 영어 alias
function HtmlLangUpdater() {
  const [location] = useLocation();
  const { lang, setLang } = useLang();
  useEffect(() => {
    let urlLang: "ko" | "en" | "ja" | "zh" = "ko";
    if (location === "/en" || location.startsWith("/en/"))           urlLang = "en";
    else if (location === "/ja" || location.startsWith("/ja/"))      urlLang = "ja";
    else if (location === "/zh" || location.startsWith("/zh/"))      urlLang = "zh";
    else if (location === "/foreign-guide" || location.startsWith("/foreign-guide/")) urlLang = "en";
    document.documentElement.lang = urlLang;
    const isManagedLangPath =
      location === "/en" || location.startsWith("/en/") ||
      location === "/ja" || location.startsWith("/ja/") ||
      location === "/zh" || location.startsWith("/zh/") ||
      location === "/foreign-guide" || location.startsWith("/foreign-guide/");
    if (isManagedLangPath && lang !== urlLang) setLang(urlLang, false);
  }, [location, lang, setLang]);
  return null;
}

// ─── 라우터 ───────────────────────────────────────────────────────────────────
function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <HtmlLangUpdater />
      <MapErrorBoundary>
        <Suspense fallback={<MapLoadingFallback />}>
          <Switch>
            {/* 홈 / 언어별 루트 */}
            <Route path="/"    component={Home} />
            <Route path="/en"  component={LandingEN} />
            <Route path="/ja"  component={LandingJA} />
            <Route path="/zh"  component={LandingZH} />

            {/* 이벤트 상세 */}
            <Route path="/events/:id" component={EventDetail} />

            {/* /treatment/:name → /treatments/:slug redirect (legacy URL 호환 브릿지) */}
            <Route path="/treatment/:name" component={TreatmentRedirect} />

            {/* 다국어 라우트 — LANG_ROUTES 배열 기반 자동 생성 */}
            {LANG_ROUTES.flatMap(({ path, component: Comp }) =>
              withLangPrefixes(path).map(fullPath => (
                <Route key={fullPath} path={fullPath} component={Comp} />
              ))
            )}

            {/* 사용자 페이지 */}
            <Route path="/my-reservations" component={MyReservations} />

            {/* 관리자 페이지 — 구체적 경로(new/edit)를 파라미터 경로보다 먼저 선언 */}
            <Route path="/admin/equipment2/new"        component={AdminEquipment2New} />
            <Route path="/admin/equipment2/:id/edit"   component={AdminEquipment2Edit} />
            <Route path="/admin/equipment3/new"        component={AdminEquipment3New} />
            <Route path="/admin/equipment3/:id/edit"   component={AdminEquipment3Edit} />
            <Route path="/admin/equipment3"            component={AdminEquipment3} />
            <Route path="/admin/youtube"               component={AdminYouTube} />
            <Route path="/admin"                       component={AdminDashboard} />

            {/* 폴백 — 반드시 마지막 */}
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </MapErrorBoundary>
    </Suspense>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
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

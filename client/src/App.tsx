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
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}

function MapLoadingFallback() {
  return (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl">
      <p className="text-gray-500">지도를 불러오는 중입니다...</p>
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

            {/*
             * TREATMENT DETAIL — 두 구조 공존 (PR-31)
             * CANONICAL: /treatments/:slug (TreatmentPage) — 다국어 포함
             * LEGACY BRIDGE: /treatment/:name (TreatmentRedirect) → /treatments/:slug 로 replace
             *   - PR-32: 7개 시술 모두 slug 파일 완비
             *   - PR-33: 미지정 slug → /404 redirect
             *   - TreatmentDetail.tsx 는 참조용으로만 보존, 라우트 미연결
             */}
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

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider, useLang } from "./contexts/LangContext";
import { Suspense, useEffect, lazy } from "react";
import Home from "./pages/Home";
import MapErrorBoundary from "./components/MapErrorBoundary";
import {
  LANG_ROUTES, withLangPrefixes,
} from "./routes";

// [P1-OPT] 페이지별 lazy import로 메인 엔트리 크기 감소
// NotFound, Notice, NoticeDetail, NoticeEdit는 자주 사용되므로 eager import 유지
import NotFound from "./pages/NotFound";
import Notice from "./pages/Notice";
import NoticeDetail from "./pages/NoticeDetail";
import NoticeEdit from "./pages/NoticeEdit";

// 나머지 페이지는 lazy import
const EventDetail = lazy(() => import("./pages/EventDetail"));
const TreatmentRedirect = lazy(() => import("./pages/TreatmentRedirect"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminYouTube = lazy(() => import("./pages/AdminYouTube"));
const AdminNotices = lazy(() => import("./pages/AdminNotices"));
const MyReservations = lazy(() => import("./pages/MyReservations"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NonCoveredGuide = lazy(() => import("./pages/NonCoveredGuide"));
const About = lazy(() => import("./pages/About"));
const Equipment2 = lazy(() => import("./pages/Equipment2"));
const Equipment2Detail = lazy(() => import("./pages/Equipment2Detail"));
const AdminEquipment2New = lazy(() => import("./pages/AdminEquipment2New"));
const AdminEquipment2Edit = lazy(() => import("./pages/AdminEquipment2Edit"));
const Equipment3 = lazy(() => import("./pages/Equipment3"));
const Equipment3Detail = lazy(() => import("./pages/Equipment3Detail"));
const AdminEquipment3 = lazy(() => import("./pages/AdminEquipment3"));
const AdminEquipment3New = lazy(() => import("./pages/AdminEquipment3New"));
const AdminEquipment3Edit = lazy(() => import("./pages/AdminEquipment3Edit"));
const TreatmentPage = lazy(() => import("./pages/TreatmentPage"));
const LandingEN = lazy(() => import("./pages/LandingEN"));
const LandingJA = lazy(() => import("./pages/LandingJA"));
const LandingZH = lazy(() => import("./pages/LandingZH"));
const LandingZHTW = lazy(() => import("./pages/LandingZHTW"));
const Research = lazy(() => import("./pages/Research"));
const ForeignGuide = lazy(() => import("./pages/ForeignGuide"));
const Directions = lazy(() => import("./pages/Directions"));

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
    // hash 앵커(#dr-, #section-, #faq- 등)가 있으면 스크롤 리셋 skip
    if (window.location.hash) return;
    // sessionStorage에 스크롤 대상이 있으면 Home.tsx / useDoctorViewModel이 처리
    if (sessionStorage.getItem("__star_scroll_to")) return;
    if (sessionStorage.getItem("__star_dr_target")) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

// ─── html[lang] + LangContext 동기화 ─────────────────────────────────────────
// /foreign-guide (prefix 없음) = /en/foreign-guide 의 영어 alias
function HtmlLangUpdater() {
  const [location] = useLocation();
  const { lang, setLang } = useLang();
  useEffect(() => {
    let urlLang: "ko" | "en" | "ja" | "zh" | "zh-TW" = "ko";
    if (location === "/en" || location.startsWith("/en/"))               urlLang = "en";
    else if (location === "/ja" || location.startsWith("/ja/"))          urlLang = "ja";
    else if (location === "/zh-tw" || location.startsWith("/zh-tw/"))    urlLang = "zh-TW";
    else if (location === "/zh" || location.startsWith("/zh/"))          urlLang = "zh";
    else if (location === "/foreign-guide" || location.startsWith("/foreign-guide/")) urlLang = "en";
    document.documentElement.lang = urlLang === "zh-TW" ? "zh-Hant" : urlLang;
    const isManagedLangPath =
      location === "/en" || location.startsWith("/en/") ||
      location === "/ja" || location.startsWith("/ja/") ||
      location === "/zh-tw" || location.startsWith("/zh-tw/") ||
      location === "/zh" || location.startsWith("/zh/") ||
      location === "/foreign-guide" || location.startsWith("/foreign-guide/");
    if (isManagedLangPath && lang !== urlLang) {
      // 외국어 경로: URL에 맞는 언어로 동기화 (저장 안함)
      setLang(urlLang, false);
    } else if (!isManagedLangPath && lang !== "ko") {
      // 한국어 경로(/): 외국어에서 한국어로 돌아왔을 때 localStorage에 남은
      // 외국어 상태를 ko로 초기화 (저장 포함)
      setLang("ko", true);
    }
  }, [location, lang, setLang]);
  return null;
}

// ─── 라우터 ───────────────────────────────────────────────────────────────────
function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <HtmlLangUpdater />
      <Switch>
        {/* 공지사항 — MapErrorBoundary 밖에서 렌더링 (AlertDialog 훅 충돌 방지) */}
        <Route path="/notice/new"         component={() => <NoticeEdit id="new" />} />
        <Route path="/notice/:id/edit"    component={({ params }) => <NoticeEdit id={params.id} />} />
        <Route path="/notice/:id"         component={({ params }) => <NoticeDetail id={params.id} />} />
        <Route path="/notice"             component={Notice} />
        {(["en", "ja", "zh"] as const).map(l => [
          <Route key={`${l}-notice-new`}    path={`/${l}/notice/new`}         component={() => <NoticeEdit id="new" />} />,
          <Route key={`${l}-notice-edit`}   path={`/${l}/notice/:id/edit`}    component={({ params }) => <NoticeEdit id={params.id} />} />,
          <Route key={`${l}-notice-detail`} path={`/${l}/notice/:id`}         component={({ params }) => <NoticeDetail id={params.id} />} />,
          <Route key={`${l}-notice`}        path={`/${l}/notice`}             component={Notice} />,
        ])}
        <Route>
          <MapErrorBoundary>
            <Suspense fallback={<MapLoadingFallback />}>
              <Switch>
                {/* 홈 / 언어별 루트 */}
                <Route path="/"    component={Home} />
                <Route path="/en"  component={LandingEN} />
                <Route path="/ja"  component={LandingJA} />
                <Route path="/zh"    component={LandingZH} />
                <Route path="/zh-tw" component={LandingZHTW} />

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

                {/* 다국어 찾아오시는 길 */}
                {(["en", "ja", "zh", "zh-TW"] as const).map(l => (
                  <Route key={`${l}-directions`} path={`/${l === "zh-TW" ? "zh-tw" : l}/directions`} component={Directions} />
                ))}

                {/* 사용자 페이지 */}
                <Route path="/my-reservations" component={MyReservations} />
                <Route path="/directions" component={Directions} />

                {/* 관리자 페이지 — 구체적 경로(new/edit)를 파라미터 경로보다 먼저 선언 */}
            <Route path="/admin/equipment2/new"        component={AdminEquipment2New} />
            <Route path="/admin/equipment2/:id/edit"   component={AdminEquipment2Edit} />
            <Route path="/admin/equipment3/new"        component={AdminEquipment3New} />
            <Route path="/admin/equipment3/:id/edit"   component={AdminEquipment3Edit} />
            <Route path="/admin/equipment3"            component={AdminEquipment3} />
            <Route path="/admin/youtube"               component={AdminYouTube} />
            <Route path="/admin/notices"               component={AdminNotices} />
            <Route path="/admin"                       component={AdminDashboard} />

                {/* 폴백 — 반드시 마지막 */}
                <Route path="/404" component={NotFound} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </MapErrorBoundary>
        </Route>
      </Switch>
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

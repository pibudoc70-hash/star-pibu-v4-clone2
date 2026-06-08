import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider, useLang } from "./contexts/LangContext";
import { lazy, Suspense, useEffect } from "react";
import Home from "./pages/Home";
import MapErrorBoundary from "./components/MapErrorBoundary";

// 동적 import로 라우트별 코드 스플리팅
const NotFound = lazy(() => import("@/pages/NotFound"));
const ForeignGuide = lazy(() => import("@/pages/ForeignGuide"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const TreatmentRedirect = lazy(() => import("@/pages/TreatmentRedirect"));
// TreatmentDetail is kept as a reference file but no longer routed (PR-33)
// const TreatmentDetail = lazy(() => import("@/pages/TreatmentDetail"));
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
const Research = lazy(() => import("@/pages/Research"));
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
// HtmlLangUpdater: URL 기반으로 html[lang] 속성 + LangContext lang 상태 동기화
// hreflang/canonical은 각 페이지의 SeoHead 컴포넌트에서 선언적으로 관리
//
// /foreign-guide special-case:
//   이 경로는 /en/foreign-guide 의 영어 alias 이므로 en으로 처리.
//   LangContext / html[lang] / ForeignGuide.activeLang 이 모두 en 으로 일치하도록 보장.
function HtmlLangUpdater() {
  const [location] = useLocation();
  const { lang, setLang } = useLang();
  useEffect(() => {
    let urlLang: "ko" | "en" | "ja" | "zh" = "ko";
    if (location === "/en" || location.startsWith("/en/")) urlLang = "en";
    else if (location === "/ja" || location.startsWith("/ja/")) urlLang = "ja";
    else if (location === "/zh" || location.startsWith("/zh/")) urlLang = "zh";
    // /foreign-guide (prefix 없음) = /en/foreign-guide 의 영어 alias
    else if (location === "/foreign-guide" || location.startsWith("/foreign-guide/")) urlLang = "en";
    document.documentElement.lang = urlLang;
    // URL이 명시적 다국어 경로(또는 foreign-guide alias)인 경우 LangContext도 동기화
    // persist=false: localStorage 오염 방지 (URL이 바뀌면 다시 재동기화)
    const isManagedLangPath =
      location === "/en" || location.startsWith("/en/") ||
      location === "/ja" || location.startsWith("/ja/") ||
      location === "/zh" || location.startsWith("/zh/") ||
      location === "/foreign-guide" || location.startsWith("/foreign-guide/");
    if (isManagedLangPath && lang !== urlLang) {
      setLang(urlLang, false);
    }
  }, [location, lang, setLang]);
  return null;
}
function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HtmlLangUpdater />
      <MapErrorBoundary>
        <Suspense fallback={<MapLoadingFallback />}>
          <Switch>
            {/*
             * PAGE LIFECYCLE POLICY
             * Only pages registered here are live and canonical.
             * Files in client/src/pages/ that are NOT listed below are:
             *   - dormant  : kept for future activation (Doctors, Directions, Facilities, Events)
             *   - legacy   : superseded by current UX (Reserve, Login, Equipment)
             *   - candidate: dev-only or removal candidate (ComponentShowcase, MyPage)
             * To activate a dormant page, add its <Route> here and update Header.tsx.
             * Do NOT connect page files to routes without reviewing their status comment.
             */}
            {/* Home / language roots */}
            <Route path={"/"} component={Home} />
            <Route path={"/en"} component={LandingEN} />
            <Route path={"/ja"} component={LandingJA} />
            <Route path={"/zh"} component={LandingZH} />

            {/* Detail pages — specific routes before generic params */}
            <Route path={"/events/:id"} component={EventDetail} />

            {/*
             * TREATMENT DETAIL ROUTES — TWO STRUCTURES COEXIST (PR-31)
             *
             * CANONICAL OWNER: /treatments/:slug (TreatmentPage)
             *   - Multilingual: /[lang]/treatments/:slug
             *   - Data: client/src/data/treatments/*.ts
             *   - SEO: full hreflang + MedicalProcedure JSON-LD
             *   - Treatments: ulthera, thermage, under-eye-fat
             *
             * LEGACY BRIDGE ROUTE: /treatment/:name (TreatmentRedirect)
             *   - PR-32: All 7 treatments now have slug data files
             *   - PR-33: Redirects to /treatments/:slug (replace history)
             *   - Unknown names redirect to /404
             *   - TreatmentDetail.tsx kept as reference, no longer routed
             */}
            <Route path={"/treatment/:name"} component={TreatmentRedirect} />
            <Route path={"/treatments/:slug"} component={TreatmentPage} />
            <Route path={"/en/treatments/:slug"} component={TreatmentPage} />
            <Route path={"/ja/treatments/:slug"} component={TreatmentPage} />
            <Route path={"/zh/treatments/:slug"} component={TreatmentPage} />
            <Route path={"/equipment2/:slug"} component={Equipment2Detail} />
            <Route path={"/en/equipment2/:slug"} component={Equipment2Detail} />
            <Route path={"/ja/equipment2/:slug"} component={Equipment2Detail} />
            <Route path={"/zh/equipment2/:slug"} component={Equipment2Detail} />

            {/* Info / policy / list pages — add new info pages in this group */}
            <Route path={"/equipment2"} component={Equipment2} />
            <Route path={"/en/equipment2"} component={Equipment2} />
            <Route path={"/ja/equipment2"} component={Equipment2} />
            <Route path={"/zh/equipment2"} component={Equipment2} />
            {/* About: localized live — canonical/hreflangs 4개 언어 정렬 (PR-36) */}
            <Route path={"/about"} component={About} />
            <Route path={"/en/about"} component={About} />
            <Route path={"/ja/about"} component={About} />
            <Route path={"/zh/about"} component={About} />
            {/*
             * ForeignGuide: localized live — en/ja/zh 전용 외국어 안내 페이지 (PR-39 alias 정책 확정)
             * - /foreign-guide: /en/foreign-guide 의 영어 alias (ko 콘텐츠 없음)
             *   · activeLang 기본값 en → canonical = /en/foreign-guide 로 자동 정렬
             *   · 별도 redirect 없이 alias 유지 (SPA 특성상 HTTP redirect 불필요)
             * - /en/foreign-guide, /ja/foreign-guide, /zh/foreign-guide: 각 언어 canonical
             */}
            <Route path={"/foreign-guide"} component={ForeignGuide} />
            <Route path={"/en/foreign-guide"} component={ForeignGuide} />
            <Route path={"/ja/foreign-guide"} component={ForeignGuide} />
            <Route path={"/zh/foreign-guide"} component={ForeignGuide} />
            {/* Research: 연구 및 발표 활동 — 한국어 전용 정적 페이지 */}
            <Route path={"/research"} component={Research} />
            {/* Privacy: noindex live — ko 원문 단일 운영, 법률 문서 특성상 번역 미제공 (PR-36) */}
            <Route path={"/privacy"} component={Privacy} />
            <Route path={"/en/privacy"} component={Privacy} />
            <Route path={"/ja/privacy"} component={Privacy} />
            <Route path={"/zh/privacy"} component={Privacy} />
            <Route path={"/non-covered"} component={NonCoveredGuide} />
            <Route path={"/en/non-covered"} component={NonCoveredGuide} />
            <Route path={"/ja/non-covered"} component={NonCoveredGuide} />
            <Route path={"/zh/non-covered"} component={NonCoveredGuide} />

            {/* User pages */}
            <Route path={"/my-reservations"} component={MyReservations} />

            {/* Admin pages — specific routes (new/edit) before generic param */}
            <Route path={"/admin/equipment2/new"} component={AdminEquipment2New} />
            <Route path={"/admin/equipment2/:id/edit"} component={AdminEquipment2Edit} />
            <Route path={"/admin/youtube"} component={AdminYouTube} />
            <Route path={"/admin"} component={AdminDashboard} />

            {/* Fallback — keep these last */}
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

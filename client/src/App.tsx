import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { lazy, Suspense } from "react";
import Home from "./pages/Home";

// 동적 import로 라우트별 코드 스플리팅
const NotFound = lazy(() => import("@/pages/NotFound"));
const ForeignGuide = lazy(() => import("@/pages/ForeignGuide"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const TreatmentDetail = lazy(() => import("@/pages/TreatmentDetail"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const MyReservations = lazy(() => import("@/pages/MyReservations"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const NonCoveredGuide = lazy(() => import("@/pages/NonCoveredGuide"));
const About = lazy(() => import("@/pages/About"));
// 로그인·마이페이지·예약 페이지는 네이버예약·카카오톡 외부 링크로 대체됨

// 로드 중 로딩 스폰너
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/foreign-guide"} component={ForeignGuide} />
        <Route path={"/events/:id"} component={EventDetail} />
        <Route path={"/treatment/:name"} component={TreatmentDetail} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/my-reservations"} component={MyReservations} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/non-covered"} component={NonCoveredGuide} />
        <Route path={"/about"} component={About} />
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

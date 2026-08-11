import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

// Core Web Vitals 모니터링
import { initWebVitals } from './lib/webVitals';
import { registerServiceWorker } from './lib/swRegister';

// [FIX] 브라우저 자동 스크롤 복원 비활성화
// 브라우저가 이전 스크롤 위치를 기억해 자동 복원하는 기능을 끔
// 이로 인해 홈 접속 시 이벤트 섹션으로 자동 이동되는 문제 해결
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      initWebVitals();
    }, 0);
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 캐시 유지 — 페이지 이동/포커스 시 불필요한 재요청 방지
      staleTime: 5 * 60 * 1000,
      // 창 포커스 시 자동 재요청 비활성화 (병원 사이트는 실시간 데이터 불필요)
      refetchOnWindowFocus: false,
      // 재시도 1회로 제한 (기본 3회 → 실패 시 빠른 에러 표시)
      retry: 1,
    },
  },
});

// S1-T1: redirect 중복 방지 플래그 — QueryCache + MutationCache 두 곳에서 동시에 발화해도 한 번만 실행
let isRedirecting = false;

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;
  if (error.message !== UNAUTHED_ERR_MSG) return;
  if (isRedirecting) return;
  isRedirecting = true;
  // S1-T7: replace 사용 — 히스토리 오염 방지 (로그인 후 뒤로가기 시 인증 오류 페이지로 돌아가지 않음)
  window.location.replace(getLoginUrl());
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    // S1-T1: console.error dev-only — production 노출 차단
    if (import.meta.env.DEV) console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    if (import.meta.env.DEV) console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// S1-T2: analytics 조건부 동적 삽입 — 환경변수 미설정 시 404 에러 방지
if (
  import.meta.env.VITE_ANALYTICS_ENDPOINT &&
  import.meta.env.VITE_ANALYTICS_WEBSITE_ID
) {
  const analyticsScript = document.createElement('script');
  analyticsScript.async = true;
  analyticsScript.defer = true;
  analyticsScript.src = `${import.meta.env.VITE_ANALYTICS_ENDPOINT}/umami`;
  analyticsScript.dataset.websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  document.head.appendChild(analyticsScript);
}

// Service Worker 등록 (프로덕션 환경에서만 활성화, 개발 환경 캐시 문제 방지)
registerServiceWorker();

// OpenAI 픽셀 페이지 뷰 이벤트 추적
if (typeof window !== 'undefined' && (window as any).oaiq) {
  (window as any).oaiq("measure", "page_viewed", { type: "contents" });
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </HelmetProvider>
);

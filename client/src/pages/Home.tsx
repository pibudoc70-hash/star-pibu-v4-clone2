/**
 * Home Page - STAR 피부과
 * 디자인: 모던 클리니컬 엣지 - 민트-네이비 듀오톤
 * TreatmentsSection + EquipmentSection → TreatmentsEquipmentSection 통합
 *
 * 성능 최적화:
 * - 폴드 위 섹션(Hero, SpecialEvent, Doctors, Treatments): eager import
 * - 폴드 아래 섹션: React.lazy + Suspense로 코드 스플리팅
 * - 배경색: inline style → CSS 유틸리티 클래스 (bg-white / bg-[#F5F1ED])
 */
import { lazy, Suspense, useEffect } from "react";
import SeoHead, { COMMON_HREFLANGS, buildBreadcrumbJsonLd, buildFAQPageJsonLd, buildLocalBusinessJsonLd, SITE_NAME_LOCALIZED, OG_IMAGE_LOCALIZED } from "@/components/SeoHead";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MobileBottomCTA from "@/components/MobileBottomCTA";
// [P1-OPT] SpecialEventSection, DoctorsSection을 lazy import로 전환
// 폴드 아래 섹션이므로 초기 로딩 시 필요 없음
const SpecialEventSection = lazy(() => import("@/components/SpecialEventSection"));
const DoctorsSection = lazy(() => import("@/components/DoctorsSection"));
const TreatmentsEquipmentSection = lazy(() => import("@/components/TreatmentsEquipmentSection"));
import Footer from "@/components/Footer";
const WelcomePopup = lazy(() => import("@/components/WelcomePopup"));

// 폴드 아래 섹션 — lazy loading으로 초기 번들 크기 감소
const ManagementDevicesSection = lazy(() => import("@/components/ManagementDevicesSection"));
const PhilosophySection = lazy(() => import("@/components/PhilosophySection"));
const ResultsStatisticsSection = lazy(() => import("@/components/ResultsStatisticsSection"));
const FacilitySection = lazy(() => import("@/components/FacilitySection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const YouTubeSection = lazy(() => import("@/components/YouTubeSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
import RecentNoticesSection from "@/components/RecentNoticesSection";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";

/** 섹션 로딩 중 표시할 스켈레톤 — CLS 방지 + perceived performance 개선 */
// S2-T4: CLS 감소 — 서스펜스 폴백에 min-h 지정으로 레이아웃 시프트 방지
function SectionFallback({ minH = "min-h-[320px]" }: { minH?: string } = {}) {
  return (
    <div
      className={`${minH} py-16 md:py-24 flex flex-col items-center justify-center gap-6`}
      aria-hidden="true"
      style={{ background: "var(--brand-bg, #FAF8F5)" }}
    >
      {/* 섹션 헤더 skeleton */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <div
          className="h-2.5 w-16 rounded-full animate-pulse"
          style={{ background: "rgba(196,168,130,0.25)" }}
        />
        <div
          className="h-6 w-48 rounded animate-pulse"
          style={{ background: "rgba(196,168,130,0.2)" }}
        />
        <div
          className="h-4 w-64 rounded animate-pulse"
          style={{ background: "rgba(196,168,130,0.15)" }}
        />
      </div>
      {/* 콘텐츠 skeleton 행 */}
      <div className="flex gap-4 w-full max-w-2xl justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-32 rounded-xl animate-pulse"
            style={{
              background: "rgba(196,168,130,0.12)",
              animationDelay: `${i * 0.12}s`,
              maxWidth: "200px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {

  // 다른 페이지에서 섹션 메뉴 클릭 시 해당 섹션으로 자동 스크롤
  // lazy 섹션은 300ms 내 렌더링이 보장되지 않으므로 MutationObserver로 DOM 대기
  //
  // [FIX v2] URL hash 대신 sessionStorage(__star_scroll_to)를 사용해
  // URL에 hash가 남지 않도록 한다. hash가 URL에 남으면 다음 방문 시
  // 자동 스크롤이 발생하는 버그가 있었음.
  // 외부 직접 진입(새 탭, 북마크, 외부 링크)이나 새로고침 시에는
  // hash를 무시하고 상단으로 이동한다.
  useEffect(() => {
    // [FIX v3] 완전 재작성 - 초기 진입 시 무조건 상단으로 이동
    // URL hash는 일체 무시하고 sessionStorage만 사용
    //
    // 문제 원인:
    // 1. useHeaderState에서 history.replaceState로 URL에 #events 등 hash 저장
    // 2. 브라우저 scroll restoration이 이전 스크롤 위치 복원
    // 3. Home.tsx의 hash 스크롤 useEffect가 이를 읽어 자동 스크롤
    //
    // 해결 방법:
    // - 진입 시 URL hash를 즉시 제거하고 상단으로 이동
    // - 다른 페이지에서 메뉴 클릭 시 sessionStorage로 스크롤 대상 전달

    // [FIX v4] 언어 변경 시 scroll restoration 무시
    // sessionStorage에 "__star_force_scroll_top" 플래그가 있으면
    // 브라우저의 scroll restoration을 무시하고 상단으로 이동
    const forceScrollTop = sessionStorage.getItem("__star_force_scroll_top");
    if (forceScrollTop) {
      sessionStorage.removeItem("__star_force_scroll_top");
      // 브라우저의 scroll restoration 무시
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // URL에 hash가 있으면 즉시 제거 + 상단으로 이동 (어떤 경우든 hash를 URL에 남기지 않음)
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // sessionStorage에서 스크롤 대상 확인 (다른 페이지에서 메뉴 클릭 시)
    const sessionTarget = sessionStorage.getItem("__star_scroll_to");
    if (!sessionTarget) {
      // 스크롤 대상이 없으면 상단으로 이동 (이미 ScrollToTop이 처리하지만 이중 보장)
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // sessionStorage에 스크롤 대상이 있으면 해당 섹션으로 스크롤
    sessionStorage.removeItem("__star_scroll_to");
    const id = sessionTarget;

    const scrollToElement = (el: Element) => {
      const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
      const offset = header ? header.offsetHeight + 8 : 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };

    const existing = document.getElementById(id);
    if (existing) { scrollToElement(existing); return; }

    // lazy 섹션이 마운트될 때까지 MutationObserver로 대기 (최대 5초)
    const observer = new MutationObserver(() => {
      const el = document.getElementById(id);
      if (el) { observer.disconnect(); clearTimeout(timeout); scrollToElement(el); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 5000);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

  return (
    <div className="min-h-screen">
      {/*
       * [PROD-P2-2] 홈페이지에만 pageType="home" 설정 (WebSite + MedicalBusiness 스키마 모두 포함)
       * 이유: WebSite 스키마(SearchAction)는 사이트 전체를 대표하는 루트 URL에만
       * 삽입하는 것이 Google 권장 사항. 내부 페이지에 중복 삽입되면
       * 신호 희석이 분산되어 Sitelinks Searchbox 인식률이 낮아집니다.
       */}
      <SeoHead
        title="부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅, 색소질환, 다양한 레이저 보유"
        description="부산 서면 스타피부과(서면로 74 아이온시티빌딩 4F)는 20년 이상 경력 피부과 전문의 3인이 울세라피·써마지 FLX·눈밑지방재배치·리주란힐러·피코레이저 등 50종 프리미엄 레이저를 직접 담당합니다. 영어·일본어·중국어 외국인 환자 진료 가능. 전화 051-818-2300."
        keywords="부산피부과, 울쎄라, 써마지, 리프팅, 색소질환, 레이저치료, 리주란, 눈밑지방, 피부과전문의, 부산리프팅, 피부관리"
        canonical="https://star-pibu.com/"
        ogImage={OG_IMAGE_LOCALIZED.ko}
        ogSiteName={SITE_NAME_LOCALIZED.ko}
        ogLocale="ko_KR"
        ogLocaleAlternates={["en_US", "ja_JP", "zh_CN"]}
        hreflangs={COMMON_HREFLANGS}
        pageType="home"
        jsonLd={[
          buildLocalBusinessJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "홈", url: "https://star-pibu.com/" },
          ]),
          buildFAQPageJsonLd([
            /* ── 병원 기본 정보 ── */
            {
              question: "스타피부과는 어디에 위치하나요?",
              answer: "부산광역시 부산진구 서면로 74 아이온시티빌딩 4층에 위치합니다. 부산 지하철 1·2호선 서면역에서 도보 5분 거리입니다. 전화: 051-818-2300"
            },
            {
              question: "스타피부과 진료 시간은 어떻게 되나요?",
              answer: "월요일~금요일 오전 10시~오후 7시, 토요일 오전 9시 30분~오후 3시입니다. 일요일과 공휴일은 휴진합니다."
            },
            {
              question: "스타피부과는 어떤 시술을 전문으로 하나요?",
              answer: "울쎄라피 프라임, 써마지 FLX, 눈밑지방재배치, 리쥬란힐러, 피코레이저 토닝, 색소질환 치료, 여드름 치료 등 50종 이상의 프리미엄 레이저 시술을 보유하고 있습니다. 20년 이상 경력의 피부과 전문의 3인이 모든 시술을 직접 담당합니다."
            },
            {
              question: "스타피부과에서 외국인 환자도 진료가 가능한가요?",
              answer: "네, 영어·일본어·중국어 안내를 제공합니다. 외국인 환자 전용 안내 페이지(https://star-pibu.com/en/foreign-guide)를 참고하세요."
            },
            /* ── 울쎄라피 ── */
            {
              question: "울쎄라피 프라임이란 무엇인가요?",
              answer: "울쎄라피 프라임(Ultherapy Prime)은 집속 초음파(HIFU) 기술로 피부 깊은 SMAS층까지 자극하는 FDA 승인 비수술 리프팅 시술입니다. 기존 울쎄라 대비 에너지 전달 효율이 향상되어 더 적은 횟수로 효과적인 리프팅이 가능합니다."
            },
            {
              question: "울쎄라피 프라임과 기존 울쎄라의 차이는 무엇인가요?",
              answer: "울쎄라피 프라임은 기존 울쎄라 대비 에너지 전달 효율이 개선된 차세대 버전입니다. 동일한 HIFU 원리를 사용하지만 더 정밀한 초음파 조사가 가능하여 콜라겐 재생 효과가 높고, 시술 시 불편감이 줄어든 것이 특징입니다."
            },
            {
              question: "울쎄라피 시술 후 효과는 얼마나 지속되나요?",
              answer: "울쎄라피 효과는 시술 후 2~3개월에 걸쳐 서서히 나타나며, 6개월~1년 이상 지속됩니다. 개인의 피부 상태, 나이, 생활 습관에 따라 차이가 있을 수 있으며, 연 1회 유지 시술을 권장합니다."
            },
            {
              question: "울쎄라피 시술 후 일상생활이 바로 가능한가요?",
              answer: "네, 울쎄라피는 비수술 시술로 별도의 회복 기간이 필요하지 않습니다. 시술 직후 약간의 붓기나 홍조가 있을 수 있으나 대부분 당일 일상생활 복귀가 가능합니다."
            },
            /* ── 써마지 FLX ── */
            {
              question: "써마지 FLX란 무엇인가요?",
              answer: "써마지 FLX는 4세대 고주파(RF) 에너지를 이용해 피부 깊은 층의 콜라겐을 재생시키는 리프팅 시술입니다. 피부 탄력 개선, 피부결 정돈, 모공 축소, 주름 개선 효과가 있으며 FDA 승인을 받은 안전한 장비입니다."
            },
            {
              question: "써마지 FLX 시술은 통증이 있나요?",
              answer: "써마지 FLX는 진동(Vibration) 기능이 탑재되어 기존 써마지 대비 통증이 크게 줄었습니다. 시술 중 따뜻한 열감과 약간의 따끔함이 느껴질 수 있으나 대부분의 환자가 충분히 견딜 수 있는 수준입니다."
            },
            {
              question: "써마지 FLX는 몇 회 시술해야 하나요?",
              answer: "써마지 FLX는 1회 시술로도 효과를 볼 수 있으며, 효과는 시술 후 2~6개월에 걸쳐 서서히 나타납니다. 유지를 위해 6개월~1년 간격으로 재시술을 권장합니다."
            },
            {
              question: "울쎄라피와 써마지를 함께 받을 수 있나요?",
              answer: "네, 울쎄라피(HIFU)와 써마지 FLX(RF)는 작용 원리가 달라 병행 시술 시 시너지 효과를 낼 수 있습니다. 울쎄라피는 SMAS층 리프팅에, 써마지는 피부 표층 콜라겐 재생에 특화되어 있어 함께 받으면 더욱 입체적인 리프팅 효과를 기대할 수 있습니다."
            },
            /* ── 눈밑지방재배치 ── */
            {
              question: "눈밑지방재배치술이란 무엇인가요?",
              answer: "눈밑지방재배치술은 눈 아래 과잉 지방을 제거하지 않고 꺼진 눈물고랑 부위로 재배치하여 자연스러운 눈밑 라인을 형성하는 시술입니다. 스타피부과 조시형 원장은 4,000례 이상의 시술 경험을 보유하고 있습니다."
            },
            {
              question: "눈밑지방재배치 회복 기간은 얼마나 걸리나요?",
              answer: "눈밑지방재배치 후 붓기는 보통 1~2주 내에 대부분 빠지며, 완전한 회복까지는 1~3개월이 소요됩니다. 시술 후 1주일은 격렬한 운동과 음주를 삼가고, 자외선 차단에 주의해야 합니다."
            },
            /* ── 리쥬란힐러 ── */
            {
              question: "리쥬란힐러란 무엇인가요?",
              answer: "리쥬란힐러는 연어에서 추출한 폴리뉴클레오타이드(PDRN) 성분을 피부에 주입하여 피부 재생 및 탄력 개선을 돕는 시술입니다. 피부 보습, 탄력 증가, 미세 주름 개선, 피부결 정돈 효과가 있으며 자연스러운 피부 개선을 원하는 분들에게 적합합니다."
            },
            {
              question: "리쥬란힐러는 몇 회 시술해야 효과가 있나요?",
              answer: "리쥬란힐러는 보통 2~4주 간격으로 3~4회 기본 시술 후 3~6개월 간격으로 유지 시술을 권장합니다. 개인 피부 상태에 따라 시술 횟수와 간격이 달라질 수 있으며, 시술 전 전문의 상담을 통해 맞춤 계획을 세우는 것이 좋습니다."
            },
            /* ── 피코레이저 ── */
            {
              question: "피코레이저 토닝이란 무엇인가요?",
              answer: "피코레이저 토닝은 피코초(1조분의 1초) 단위의 초고속 레이저로 멜라닌 색소를 미세하게 분쇄하여 피부 톤을 균일하게 개선하는 시술입니다. 기미, 잡티, 색소침착, 모공 축소, 피부결 개선에 효과적이며 열 손상이 적어 안전합니다."
            },
            {
              question: "피코레이저 시술 후 주의사항은 무엇인가요?",
              answer: "피코레이저 시술 후 자외선 차단제를 철저히 사용해야 합니다. 시술 후 1~2일간 세안 시 자극을 최소화하고, 사우나·찜질방·격렬한 운동은 1주일 정도 삼가는 것이 좋습니다. 딱지가 생긴 경우 억지로 떼지 않도록 주의하세요."
            },
            /* ── 기타 ── */
            {
              question: "스타피부과는 피부과 전문의가 직접 시술하나요?",
              answer: "네, 스타피부과는 20년 이상 경력의 피부과 전문의 3인(조시형·우혜진·이기욱 원장)이 모든 시술을 직접 담당합니다. 전문의 직접 시술로 안전하고 정확한 결과를 보장합니다."
            },
            {
              question: "시술 전 상담은 어떻게 받을 수 있나요?",
              answer: "전화(051-818-2300), 네이버 예약, 카카오톡 채널(@스타피부과)을 통해 상담 예약이 가능합니다. 방문 상담 시 피부 상태를 직접 확인하고 맞춤 시술 계획을 안내해 드립니다."
            },
            {
              question: "비급여 진료비는 어디서 확인할 수 있나요?",
              answer: "스타피부과 비급여 진료비는 홈페이지 비급여 진료안내 페이지(https://star-pibu.com/non-covered-guide)에서 확인하실 수 있습니다. 시술별 정확한 가격은 상담 후 안내해 드립니다."
            },
          ]),
        ]}
      />

      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* 1. Hero - Full Screen (eager) */}
        <HeroSection />
        <MobileBottomCTA />

        {/* 2. SPECIAL EVENT — 순수 흰색, 상단 여백 증가로 허로 이후 숨 포인트 */}
        <div style={{ background: "#FFFFFF" }}>
          <SpecialEventSection />
        </div>

        {/* 3. Doctors — 따뜻한 크림 오프화이트, 시각적 질감 전환 */}
        <ScrollAnimationWrapper animationType="fade-in">
          <div style={{ background: "linear-gradient(180deg, #F9F6F2 0%, #F5F1ED 100%)" }}>
            <DoctorsSection />
          </div>
        </ScrollAnimationWrapper>

        {/* 4. Treatments + Equipment — 순수 흰색, 콘텐츠 밀도 높음 */}
        <ScrollAnimationWrapper animationType="fade-in">
          <div style={{ background: "#FFFFFF" }}>
            <Suspense fallback={<SectionFallback minH="min-h-[600px]" />}>
              <TreatmentsEquipmentSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 5. Management Devices — 열린 어두운 배경으로 시각적 리듬 전환 */}
        <ScrollAnimationWrapper animationType="fade-in-slow">
          <div style={{ background: "linear-gradient(180deg, #1A2744 0%, #243358 100%)" }}>
            <Suspense fallback={<SectionFallback minH="min-h-[480px]" />}>
              <ManagementDevicesSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 6. Philosophy — 미니멀 흰색, 여백 강조 */}
        <ScrollAnimationWrapper animationType="fade-in">
          <div style={{ background: "#FAFAFA" }}>
            <Suspense fallback={<SectionFallback minH="min-h-[400px]" />}>
              <PhilosophySection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 6-2. Results & Statistics — 연한 골드 톤 */}
        <ScrollAnimationWrapper animationType="fade-in">
          <div style={{ background: "linear-gradient(135deg, #F5F1ED 0%, #EDE8E2 100%)" }}>
            <Suspense fallback={<SectionFallback minH="min-h-[320px]" />}>
              <ResultsStatisticsSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 7. Facility Gallery — 순수 흰색, 이미지 중심 */}
        <ScrollAnimationWrapper animationType="fade-in">
          <div style={{ background: "#FFFFFF" }}>
            <Suspense fallback={<SectionFallback minH="min-h-[560px]" />}>
              <FacilitySection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 8. Patient Reviews — 연한 웸아이보리 */}
        <ScrollAnimationWrapper animationType="fade-in">
          <div style={{ background: "linear-gradient(180deg, #F9F6F2 0%, #F5F1ED 100%)" }}>
            <Suspense fallback={<SectionFallback minH="min-h-[480px]" />}>
              <ReviewsSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 8-2. YouTube Channel — 어두운 에디토리얼 톤 */}
        <ScrollAnimationWrapper animationType="fade-in-slow">
          <div style={{ background: "linear-gradient(180deg, #1A2744 0%, #0F1A30 100%)" }}>
            <Suspense fallback={<SectionFallback minH="min-h-[400px]" />}>
              <YouTubeSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 9. FAQ — 순수 흰색 */}
        <ScrollAnimationWrapper animationType="fade-in">
          <div style={{ background: "#FFFFFF" }}>
            <Suspense fallback={<SectionFallback minH="min-h-[400px]" />}>
              <FAQSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 최근 공지사항 섹션 */}
        <ScrollAnimationWrapper animationType="fade-in">
          <RecentNoticesSection lang="ko" />
        </ScrollAnimationWrapper>


        {/* 10. Location & Contact — 다크 네이비 마무리 */}
        <ScrollAnimationWrapper animationType="fade-in-slow">
          <div style={{ background: "linear-gradient(180deg, #1A2744 0%, #0F1A30 100%)" }}>
            <Suspense fallback={<SectionFallback minH="min-h-[400px]" />}>
              <ContactSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>
      </main>

      {/* Footer */}
      <Footer />

      {/* Welcome Popup — lazy loaded, 초기 번들에서 제외 */}
      <Suspense fallback={null}>
        <WelcomePopup />
      </Suspense>
    </div>
  );
}

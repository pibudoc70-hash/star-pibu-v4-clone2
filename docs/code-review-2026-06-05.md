# Star Pibu v4 Clone — 전체 코드 검수 리뷰

**기준 커밋:** `994bac051d49a04cda6eb3e0c52d1dbf179b00cb`  
**검수 일자:** 2026-06-05  
**검수 범위:** YouTubeSection, main.tsx, window.location 전수, analytics placeholder, 접근성, 라우팅 일관성, 성능/번들, 테스트 품질

---

## 1. Executive Summary

전반적으로 이전 세션 대비 코드 품질이 크게 향상되었다. TypeScript 에러 0건, 테스트 168개 전부 통과, OTP 잠금·SeoHead 일괄 적용·useClinicStats Hook 중앙화 등 핵심 이슈들이 잘 처리되어 있다.

그러나 이번 검수에서 **즉시 수정이 필요한 실제 문제** 6건, **빠른 개선 권장** 8건, **관찰/유지보수 수준** 5건을 확인했다.

| 수준 | 건수 | 핵심 내용 |
|---|---|---|
| 당장 수정 필요 (P1) | 6 | YouTubeSection isError 미처리, modal focus trap 미구현, main.tsx redirect 중복 방지 플래그 없음, WelcomePopup dialog role 누락, analytics placeholder 배포 리스크, MyReservations window.location.reload |
| 빠른 개선 권장 (P2) | 8 | window.location.href SPA 전환 가능 지점, SpecialEventSection 카드 접근성, Header 언어 드롭다운 listbox role 불일치, TreatmentsManager navigate 미사용, AdminDashboard youtube 이동, YouTubeSection 이중 state 패턴, SectionFallback CLS, 테스트 파일 부재 |
| 관찰만 필요 (P3) | 5 | manualChunks 전략 유지보수성, webVitals dev-only 로깅, sw.js 캐시 버전 관리, console.error production 노출, Header 언어 드롭다운 focus restore |

---

## 2. Critical Issues (P1)

### P1-1. YouTubeSection — isError 분기 완전 누락

**파일:** `client/src/components/YouTubeSection.tsx:23`

**문제 설명.** `trpc.youtube.getAll.useQuery()`에서 `isError`를 구조분해하지 않았다. 현재 `allVideos === undefined` 조건만으로 로딩 상태를 판단하므로, 쿼리가 실패해도 `allVideos`는 `undefined`로 남아 `isLoading` 상태가 영구히 `true`로 유지된다. 즉, DB 연결 오류나 네트워크 장애 시 사용자는 무한 스피너를 보게 된다.

**왜 위험한지.** tRPC의 기본 `retry` 횟수는 3회이므로, 실패 후 약 30초간 스피너가 지속되다가 그대로 멈춘다. 사용자 관점에서 페이지가 깨진 것처럼 보인다.

**추천 수정 방향:**

```tsx
// 현재 (문제)
const { data: allVideos } = trpc.youtube.getAll.useQuery();
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  if (allVideos === undefined) return; // 에러 상태도 여기서 걸림
  // ...
  setIsLoading(false);
}, [allVideos]);

// 수정 후
const { data: allVideos, isLoading, isError, refetch } = trpc.youtube.getAll.useQuery();

// useEffect + 이중 state 제거, 직접 파생 상태 사용
const videoList = allVideos?.filter(v => v.type === 'video') ?? [];
const shortsList = allVideos?.filter(v => v.type === 'shorts') ?? [];

if (isLoading) return <LoadingSkeleton />;
if (isError) return <ErrorState onRetry={refetch} />;
if (!videoList.length && !shortsList.length) return <EmptyState />;
```

---

### P1-2. YouTubeSection — modal focus trap 및 focus restore 미구현

**파일:** `client/src/components/YouTubeSection.tsx:169-250`

**문제 설명.** 모달에 `role="dialog"`, `aria-modal="true"`, ESC 닫기까지는 구현되어 있으나, **focus trap**(Tab 키가 모달 외부로 나가지 않도록 제한)과 **focus restore**(모달 닫힌 후 트리거 버튼으로 포커스 복귀)가 전혀 없다. WCAG 2.1 SC 2.1.2와 ARIA Authoring Practices Guide의 Dialog Pattern 필수 요건이다.

**왜 위험한지.** 스크린 리더 사용자가 Tab을 누르면 모달 뒤 페이지 콘텐츠로 포커스가 이동한다. 모달을 닫아도 포커스가 어디로 가는지 알 수 없어 키보드 사용자가 현재 위치를 잃는다.

**추천 수정 방향:**

```tsx
// 모달 열 때 트리거 버튼 ref 저장 + 닫기 버튼 자동 포커스
const triggerRef = useRef<HTMLButtonElement | null>(null);
const closeButtonRef = useRef<HTMLButtonElement>(null);

const openModal = (video: YouTubeVideo, btn: HTMLButtonElement) => {
  triggerRef.current = btn;
  setSelectedVideo(video);
};

useEffect(() => {
  if (selectedVideo) {
    closeButtonRef.current?.focus();
  } else {
    triggerRef.current?.focus(); // 포커스 복귀
    triggerRef.current = null;
  }
}, [selectedVideo]);

// focus trap: Tab/Shift+Tab을 모달 내부로 제한
useEffect(() => {
  if (!selectedVideo || !modalRef.current) return;
  const focusable = modalRef.current.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const onTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  };
  document.addEventListener('keydown', onTab);
  return () => document.removeEventListener('keydown', onTab);
}, [selectedVideo]);
```

---

### P1-3. main.tsx — unauthorized redirect 중복 방지 플래그 없음

**파일:** `client/src/main.tsx:25-50`

**문제 설명.** `QueryCache`와 `MutationCache` 두 곳에서 모두 `redirectToLoginIfUnauthorized`를 호출한다. 한 요청이 실패하면 두 캐시 이벤트가 동시에 발화할 수 있고, 동일 요청에서 query + mutation이 함께 실패하면 `window.location.href`가 연속으로 두 번 실행된다. 또한 `console.error`가 production에서도 무조건 출력된다.

**왜 위험한지.** 중복 redirect는 브라우저 히스토리를 오염시키고, 일부 브라우저에서 redirect 루프를 유발할 수 있다. production console.error는 사용자 DevTools에 노출된다.

**추천 수정 방향:**

```ts
// 중복 방지 플래그 추가
let isRedirecting = false;

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;
  if (error.message !== UNAUTHED_ERR_MSG) return;
  if (isRedirecting) return; // 중복 방지
  isRedirecting = true;
  window.location.replace(getLoginUrl()); // replace 사용 (히스토리 오염 방지)
};

// console.error를 dev-only로 제한
queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    if (import.meta.env.DEV) console.error("[API Query Error]", error);
  }
});
```

---

### P1-4. WelcomePopup — role="dialog" 및 aria-modal 누락

**파일:** `client/src/components/WelcomePopup.tsx`

**문제 설명.** WelcomePopup은 팝업 모달임에도 `role="dialog"`, `aria-modal="true"`, `aria-labelledby`가 전혀 없다. YouTubeSection 모달에는 이 속성들이 있는데 WelcomePopup에는 없어 일관성도 깨진다.

**왜 위험한지.** 스크린 리더가 팝업을 일반 콘텐츠로 인식해 페이지 전체를 읽어나간다. 팝업이 열린 상태에서 배경 콘텐츠가 스크린 리더에 노출된다.

**추천 수정 방향:**

```tsx
// 모바일/데스크톱 모달 컨테이너에 추가
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="welcome-popup-title"
  // ...
>
  <h2 id="welcome-popup-title" className="sr-only">스페셜 이벤트 팝업</h2>
  {/* 기존 내용 */}
</div>
```

---

### P1-5. index.html — analytics placeholder 배포 리스크

**파일:** `client/index.html:50-53`

**문제 설명.** `%VITE_ANALYTICS_ENDPOINT%`와 `%VITE_ANALYTICS_WEBSITE_ID%`는 Vite 빌드 시 환경변수로 치환된다. 그러나 이 값들이 설정되지 않으면 빌드 결과물에 리터럴 문자열 `%VITE_ANALYTICS_ENDPOINT%`가 그대로 남아 `<script src="%VITE_ANALYTICS_ENDPOINT%/umami">`가 된다. 이 URL로 스크립트 로드를 시도하면 브라우저 콘솔에 404 에러가 발생한다.

**왜 위험한지.** 환경변수 미설정 시 빌드는 성공하지만 배포된 페이지에서 매 방문마다 404 네트워크 에러가 발생한다. 실제 배포 리스크다.

**추천 수정 방향:** 조건부 렌더링 방식으로 전환하거나, 빌드 시 값이 없으면 스크립트 태그 자체를 제거하는 Vite 플러그인 로직을 추가한다.

```html
<!-- 방법 1: 빌드 시 값이 없으면 태그 제거 (vite.config.ts에서 처리) -->
<!-- 방법 2: 런타임 조건부 삽입으로 이동 (index.html에서 제거, main.tsx에서 처리) -->
```

```ts
// main.tsx에서 조건부 삽입
if (import.meta.env.VITE_ANALYTICS_ENDPOINT && import.meta.env.VITE_ANALYTICS_WEBSITE_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = `${import.meta.env.VITE_ANALYTICS_ENDPOINT}/umami`;
  script.dataset.websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  document.head.appendChild(script);
}
```

---

### P1-6. MyReservations — 예약 취소 후 window.location.reload()

**파일:** `client/src/pages/MyReservations.tsx:32`

**문제 설명.** 예약 취소 성공 후 `window.location.reload()`를 호출한다. 이는 전체 페이지 새로고침으로, SPA에서 불필요한 full reload다. tRPC mutation의 `onSuccess`에서 `trpc.useUtils().myReservations.invalidate()`를 호출하면 캐시만 무효화되어 부드럽게 목록이 갱신된다.

**왜 위험한지.** 페이지 새로고침은 React 상태를 초기화하고, 스크롤 위치를 잃으며, 불필요한 네트워크 요청을 유발한다. 특히 모바일에서 체감 성능이 나빠진다.

**추천 수정 방향:**

```tsx
const utils = trpc.useUtils();
const cancelMutation = trpc.reservation.cancel.useMutation({
  onSuccess: () => {
    toast.success("예약이 취소되었습니다.");
    utils.reservation.myReservations.invalidate(); // reload 대신 캐시 무효화
  },
  onError: (err) => toast.error("취소 실패: " + err.message),
});
```

---

## 3. Important Issues (P2)

### P2-1. window.location.href — SPA navigation으로 교체 가능한 지점들

**파일:** 여러 파일

아래 표는 각 `window.location.href` 사용처를 분류한 것이다.

| 파일 | 위치 | 현재 방식 | 권장 방식 | 이유 |
|---|---|---|---|---|
| `AdminDashboard.tsx:492` | YouTube 관리 이동 | `window.location.href = "/admin/youtube"` | `useLocation` + `navigate` | 동일 SPA 내 이동 |
| `AdminDashboard.tsx:509` | 로그아웃 후 홈 이동 | `window.location.href = "/"` | `navigate("/")` | 로그아웃은 이미 서버 처리 완료 |
| `TreatmentsManager.tsx:240` | 장비 신규 등록 이동 | `window.location.href = '/admin/equipment2/new'` | `navigate('/admin/equipment2/new')` | 동일 SPA 내 이동 |
| `MyPage.tsx:68` | 로그아웃 후 홈 이동 | `window.location.href = "/"` | `navigate("/")` | 동일 SPA 내 이동 |
| `Header.tsx:75` | 언어 변경 | `window.location.href` | **유지** (full reload 필요) | 언어 컨텍스트 완전 초기화 필요 |
| `Footer.tsx:30-56` | 내부 링크 | `window.location.href` | `navigate()` + `scrollIntoView` | 해시 스크롤은 SPA로 처리 가능 |
| `useAuth.ts:70` | 미인증 redirect | `window.location.href` | **유지** (OAuth flow 필요) | OAuth redirect는 full reload 필수 |
| `main.tsx:33` | 미인증 redirect | `window.location.href` | `window.location.replace` | 히스토리 오염 방지 |

---

### P2-2. SpecialEventSection — 이벤트 카드 접근성 완전 누락

**파일:** `client/src/components/SpecialEventSection.tsx`

이벤트 카드가 클릭 가능하지만 `role`, `aria-label`, `tabIndex`가 전혀 없다. 키보드 사용자가 카드를 선택할 수 없다.

```tsx
// 수정 방향: 카드를 button 또는 <a>로 교체
<button
  type="button"
  onClick={() => navigate(`/events/${event.id}`)}
  className="..."
  aria-label={`${event.title} 이벤트 상세 보기`}
>
```

---

### P2-3. Header 언어 드롭다운 — listbox role 불일치

**파일:** `client/src/components/Header.tsx:347`

트리거 버튼에 `aria-haspopup="listbox"`가 설정되어 있으나, 드롭다운 컨테이너에 `role="listbox"`가 없고 각 옵션에 `role="option"`도 없다. ARIA 스펙상 `aria-haspopup="listbox"`를 선언했으면 실제 `role="listbox"` 요소가 있어야 한다.

```tsx
// 수정 방향
<div role="listbox" aria-label="언어 선택">
  {langOptions.map(option => (
    <button
      role="option"
      aria-selected={option.lang === lang}
      // ...
    />
  ))}
</div>
```

---

### P2-4. YouTubeSection — 이중 state 패턴 (파생 상태 문제)

**파일:** `client/src/components/YouTubeSection.tsx:18-32`

`isLoading` state와 `videos`/`shorts` state가 `useEffect` + `allVideos` 데이터를 통해 동기화된다. 이는 tRPC의 `isLoading`, `data`를 직접 사용하면 제거 가능한 불필요한 중간 상태다. P1-1 수정 시 함께 제거해야 한다.

---

### P2-5. SectionFallback — CLS(Cumulative Layout Shift) 유발 가능성

**파일:** `client/src/pages/Home.tsx:34-36`

```tsx
function SectionFallback() {
  return <div className="py-16 md:py-24" aria-hidden="true" />;
}
```

각 섹션의 실제 높이와 fallback 높이가 다를 경우 섹션 로드 시 레이아웃이 튀는 CLS가 발생한다. 특히 `ReviewsSection`과 `YouTubeSection`은 높이가 크다. 각 섹션의 예상 높이에 맞는 스켈레톤 UI를 사용하거나, `min-h-[600px]` 등 최소 높이를 지정하는 것이 좋다.

---

### P2-6. ReviewsSection 캐러셀 — 키보드 방향키 미지원

**파일:** `client/src/components/ReviewsSection.tsx`

캐러셀 이전/다음 버튼에 `aria-label`은 있으나 방향키(`ArrowLeft`/`ArrowRight`) 키보드 이벤트가 없다. ARIA Carousel Pattern에서는 방향키 지원을 권장한다.

---

### P2-7. AdminDashboard — YouTube 관리 페이지 이동 방식

**파일:** `client/src/pages/AdminDashboard.tsx:492`

```tsx
onClick={() => window.location.href = "/admin/youtube"}
```

같은 SPA 내 이동임에도 full reload를 사용한다. `useLocation`의 `navigate("/admin/youtube")`로 교체하면 상태 유지와 성능이 개선된다.

---

### P2-8. YouTubeSection 테스트 파일 완전 부재

**파일:** 없음 (신규 생성 필요)

요청 문서에서 `client/src/components/YouTubeSection.test.tsx`가 통과했다고 명시되어 있으나, 현재 프로젝트에 해당 파일이 존재하지 않는다. 이번 수정에서 추가된 loading/error/empty state 분기, ESC 닫기, modal 접근성에 대한 테스트가 전혀 없는 상태다.

---

## 4. Minor / Maintenance Issues (P3)

### P3-1. manualChunks 전략 — `streamdown` 패키지 누락

**파일:** `vite.config.ts:172-195`

현재 `manualChunks`에 `react`, `@trpc`, `lucide-react`, `katex`만 명시되어 있다. `streamdown`(마크다운 스트리밍 렌더러)은 별도 청크로 분리되지 않아 메인 번들에 포함될 수 있다. 사용 빈도가 낮은 패키지라면 별도 청크로 분리하는 것이 좋다.

---

### P3-2. console.error — production 노출

**파일:** `client/src/main.tsx:40, 48`

```ts
console.error("[API Query Error]", error);
console.error("[API Mutation Error]", error);
```

P1-3에서 언급한 것처럼, 이 로그들은 production에서도 출력된다. `import.meta.env.DEV` 조건으로 감싸야 한다.

---

### P3-3. sw.js — 캐시 버전 관리 주석만 있고 자동화 없음

**파일:** `client/public/sw.js`

`CACHE_NAME`을 수동으로 bump해야 한다는 주석이 있으나, 실제 배포 시 잊어버리기 쉽다. Vite 빌드 시 `__BUILD_HASH__`를 주입하거나, `vite-plugin-pwa`를 사용하는 것이 더 안전하다.

---

### P3-4. Header 언어 드롭다운 — ESC 닫기 후 focus restore 없음

**파일:** `client/src/components/Header.tsx:100-108`

ESC로 드롭다운을 닫을 때 트리거 버튼으로 포커스가 복귀하지 않는다. 드롭다운 트리거 버튼에 `ref`를 달고 닫을 때 `.focus()`를 호출해야 한다.

---

### P3-5. TreatmentsEquipmentSection.copy.test.ts — 파일명 `.copy.` 잔존

**파일:** `client/src/components/TreatmentsEquipmentSection.copy.test.ts`

파일명에 `.copy.`가 남아 있어 임시 파일처럼 보인다. 정식 테스트 파일이라면 `.copy.` 없이 `TreatmentsEquipmentSection.test.ts`로 이름을 변경해야 한다.

---

## 5. Recommended Fixes for the Current Patch

이번 수정된 `YouTubeSection` / `main.tsx` 기준으로 추가로 손보면 더 좋아지는 부분만 정리한다.

**YouTubeSection:**

1. `isError` 구조분해 추가 + error state UI 구현 (P1-1)
2. `isLoading` / `videos` / `shorts` state 제거, tRPC 직접 파생 상태 사용 (P2-4)
3. modal `ref` 추가 + focus trap + focus restore 구현 (P1-2)
4. 모달 닫기 버튼에 `ref={closeButtonRef}` 추가
5. 비디오 카드 버튼에 `aria-label={video.title + " 영상 재생"}` 추가

**main.tsx:**

1. `isRedirecting` 플래그 추가로 중복 redirect 방지 (P1-3)
2. `window.location.href` → `window.location.replace` 교체 (P1-3)
3. `console.error` → `import.meta.env.DEV && console.error` 교체 (P3-2)
4. analytics 스크립트를 `index.html`에서 제거하고 `main.tsx`에서 조건부 삽입 (P1-5)

---

## 6. Regression Test Recommendations

아래 테스트들을 `client/src/components/YouTubeSection.test.tsx` 신규 파일에 추가해야 한다.

```
describe("YouTubeSection", () => {
  // 상태 분기
  it("로딩 중에는 스피너를 표시해야 한다")
  it("쿼리 실패 시 에러 메시지와 재시도 버튼을 표시해야 한다")
  it("영상이 없을 때 empty state를 표시해야 한다")
  it("영상 데이터가 있으면 비디오 카드를 렌더링해야 한다")

  // 모달 접근성
  it("비디오 카드 클릭 시 모달이 열려야 한다")
  it("ESC 키로 모달이 닫혀야 한다")
  it("모달 닫기 버튼 클릭으로 모달이 닫혀야 한다")
  it("모달 배경 클릭으로 모달이 닫혀야 한다")
  it("모달 열릴 때 닫기 버튼에 포커스가 이동해야 한다")
  it("모달 닫힐 때 트리거 버튼으로 포커스가 복귀해야 한다")

  // error → retry flow
  it("재시도 버튼 클릭 시 refetch가 호출되어야 한다")
})
```

`server/main.redirect.test.ts` 신규 파일에 추가해야 한다.

```
describe("main.tsx redirect deduplication", () => {
  it("UNAUTHORIZED 에러가 연속으로 발생해도 redirect는 한 번만 실행되어야 한다")
  it("UNAUTHORIZED 외 에러는 redirect를 트리거하지 않아야 한다")
})
```

---

## 7. Suggested Implementation Order

리스크가 낮은 순서로 수정하면 다음과 같다.

1. **P1-3** `main.tsx` — 중복 redirect 플래그 + `console.error` dev-only (영향 범위 최소, 테스트 없어도 안전)
2. **P1-5** `index.html` analytics placeholder → `main.tsx` 조건부 삽입 (배포 리스크 제거)
3. **P1-6** `MyReservations` `window.location.reload()` → `invalidate()` (단순 교체)
4. **P1-1 + P2-4** `YouTubeSection` isError 처리 + 이중 state 제거 (함께 수정)
5. **P1-2** `YouTubeSection` focus trap + focus restore (P1-1 수정 후 진행)
6. **P1-4** `WelcomePopup` dialog role 추가 (단순 마크업 추가)
7. **P2-1** `window.location.href` SPA navigate 교체 (AdminDashboard, MyPage, TreatmentsManager)
8. **P2-2** `SpecialEventSection` 카드 접근성 (button 교체)
9. **P2-3** Header 언어 드롭다운 listbox role 정합성
10. **P3-5** 테스트 파일명 `.copy.` 제거
11. **P2-8** `YouTubeSection.test.tsx` 신규 작성

---

## 8. Final Deliverable

### PR Title Suggestions

1. `fix: YouTubeSection isError 처리 및 modal focus trap 구현 (P1-1, P1-2)`
2. `fix: main.tsx redirect 중복 방지 및 analytics placeholder 런타임 조건부 삽입 (P1-3, P1-5)`
3. `fix: WelcomePopup dialog role 추가 및 window.location SPA navigate 교체 (P1-4, P2-1)`

### Must-fix Files

| 파일 | 이유 |
|---|---|
| `client/src/components/YouTubeSection.tsx` | isError 미처리, focus trap 없음 |
| `client/src/main.tsx` | redirect 중복, console.error production 노출 |
| `client/index.html` | analytics placeholder 배포 리스크 |
| `client/src/pages/MyReservations.tsx` | window.location.reload → invalidate |
| `client/src/components/WelcomePopup.tsx` | dialog role 누락 |

### Optional Cleanup Files

- `client/src/pages/AdminDashboard.tsx` — YouTube 이동 navigate 교체
- `client/src/pages/MyPage.tsx` — 로그아웃 후 navigate 교체
- `client/src/components/TreatmentsManager.tsx` — navigate 교체
- `client/src/components/Header.tsx` — 드롭다운 listbox role, focus restore
- `client/src/components/SpecialEventSection.tsx` — 카드 접근성
- `client/src/components/TreatmentsEquipmentSection.copy.test.ts` — 파일명 정리

### 예상 회귀 리스크

- `YouTubeSection` 수정 시 기존 `isLoading` state 제거로 인한 렌더링 타이밍 변화 가능 → 수정 후 실제 브라우저에서 로딩 → 데이터 표시 전환 확인 필요
- `main.tsx` redirect 플래그는 모듈 스코프 변수이므로 HMR 시 초기화되지 않음 → dev 환경에서 테스트 시 주의

### 최종 체크리스트

- [ ] `YouTubeSection` isError 분기 추가 및 이중 state 제거
- [ ] `YouTubeSection` modal focus trap + focus restore 구현
- [ ] `YouTubeSection.test.tsx` 신규 작성 (최소 10개 테스트)
- [ ] `main.tsx` `isRedirecting` 플래그 추가
- [ ] `main.tsx` `console.error` → dev-only
- [ ] `main.tsx` `window.location.href` → `window.location.replace`
- [ ] `index.html` analytics placeholder → `main.tsx` 조건부 삽입
- [ ] `MyReservations` `window.location.reload()` → `invalidate()`
- [ ] `WelcomePopup` `role="dialog"` + `aria-modal="true"` 추가
- [ ] `AdminDashboard`, `MyPage`, `TreatmentsManager` SPA navigate 교체
- [ ] `pnpm test` 전체 통과 확인
- [ ] TypeScript 에러 0건 확인

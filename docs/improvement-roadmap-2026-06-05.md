# Star Pibu v4 Clone — 개선 작업 로드맵

**기준 문서:** 코드 검수 리뷰 2026-06-05 (`docs/code-review-2026-06-05.md`)  
**작성 일자:** 2026-06-05  
**총 이슈:** P1 6건 · P2 8건 · P3 5건 = 19건

---

## 로드맵 개요

이 로드맵은 코드 검수 보고서의 19개 이슈를 **3개 Sprint**로 묶어 순차적으로 해결하는 계획이다. 각 Sprint는 독립적으로 배포 가능하며, 이전 Sprint 완료 여부와 관계없이 P3 작업은 여유 시간에 병행 진행할 수 있다.

| Sprint | 기간 목표 | 핵심 목표 | 이슈 수 |
|---|---|---|---|
| Sprint 1 | 즉시 (1~2일) | 배포 리스크 제거 + 핵심 버그 수정 | P1 6건 |
| Sprint 2 | 단기 (3~5일) | UX 품질 향상 + SPA 일관성 | P2 8건 |
| Sprint 3 | 중기 (1~2주) | 유지보수성 강화 + 테스트 보강 | P3 5건 |

---

## Sprint 1 — 배포 리스크 제거 및 핵심 버그 수정

**목표:** 현재 배포된 사이트에서 사용자가 실제로 겪을 수 있는 문제를 제거한다. 이 Sprint의 모든 항목은 기능 결함 또는 배포 리스크에 해당하므로 가장 먼저 처리해야 한다.

### S1-T1. main.tsx — redirect 중복 방지 및 console.error dev-only 처리

**대상 파일:** `client/src/main.tsx`  
**우선순위:** P1-3  
**예상 소요:** 30분

`QueryCache`와 `MutationCache` 두 곳에서 동시에 `redirectToLoginIfUnauthorized`가 발화할 경우 `window.location.href`가 연속으로 두 번 실행되는 문제를 수정한다. 모듈 스코프에 `isRedirecting` 플래그를 추가하고, `window.location.href` 대신 `window.location.replace`를 사용해 히스토리 오염을 방지한다. 아울러 `console.error` 두 곳을 `import.meta.env.DEV` 조건으로 감싸 production 노출을 차단한다.

**완료 기준:** 동일 요청에서 UNAUTHORIZED 에러가 두 번 발생해도 redirect가 한 번만 실행되는 것을 확인한다.

---

### S1-T2. index.html — analytics placeholder 배포 리스크 제거

**대상 파일:** `client/index.html`, `client/src/main.tsx`  
**우선순위:** P1-5  
**예상 소요:** 30분

`%VITE_ANALYTICS_ENDPOINT%`와 `%VITE_ANALYTICS_WEBSITE_ID%`가 환경변수로 설정되지 않으면 빌드 결과물에 리터럴 문자열이 그대로 남아 매 방문마다 404 네트워크 에러가 발생한다. `index.html`에서 analytics 스크립트 태그를 제거하고, `main.tsx`에서 두 환경변수가 모두 존재할 때만 동적으로 스크립트를 삽입하는 방식으로 전환한다.

**완료 기준:** 환경변수 미설정 상태에서 빌드 후 브라우저 콘솔에 analytics 관련 404 에러가 없다.

---

### S1-T3. MyReservations — window.location.reload() 제거

**대상 파일:** `client/src/pages/MyReservations.tsx`  
**우선순위:** P1-6  
**예상 소요:** 20분

예약 취소 성공 후 `window.location.reload()`를 호출해 전체 페이지를 새로고침한다. `trpc.useUtils().reservation.myReservations.invalidate()`로 교체하면 React 상태를 유지하면서 목록만 갱신된다. 스크롤 위치 유지, 불필요한 네트워크 요청 제거, 모바일 체감 성능 개선 효과가 있다.

**완료 기준:** 예약 취소 후 페이지 새로고침 없이 목록이 갱신되고 스크롤 위치가 유지된다.

---

### S1-T4. YouTubeSection — isError 처리 및 이중 state 제거

**대상 파일:** `client/src/components/YouTubeSection.tsx`  
**우선순위:** P1-1 + P2-4 (함께 수정)  
**예상 소요:** 1시간

`trpc.youtube.getAll.useQuery()`에서 `isError`를 구조분해하지 않아 쿼리 실패 시 무한 스피너가 발생한다. 동시에 `isLoading` state, `videos` state, `shorts` state를 별도로 관리하는 이중 state 패턴도 제거한다. tRPC의 `isLoading`, `isError`, `data`를 직접 사용하고, `videoList`와 `shortsList`를 파생 상태로 계산하는 방식으로 단순화한다. 에러 상태에서는 재시도 버튼이 있는 에러 UI를 표시한다.

**완료 기준:** 네트워크 오류 시 에러 메시지와 재시도 버튼이 표시되고, 재시도 버튼 클릭 시 `refetch`가 호출된다.

---

### S1-T5. YouTubeSection — modal focus trap 및 focus restore 구현

**대상 파일:** `client/src/components/YouTubeSection.tsx`  
**우선순위:** P1-2  
**예상 소요:** 1시간

모달에 `role="dialog"`, `aria-modal="true"`, ESC 닫기는 이미 구현되어 있으나 focus trap과 focus restore가 없다. WCAG 2.1 SC 2.1.2 필수 요건이다. 트리거 버튼 `ref`를 저장해 모달 닫힌 후 포커스를 복귀시키고, Tab/Shift+Tab이 모달 내부에서만 순환하도록 focus trap을 구현한다. 모달 열릴 때 닫기 버튼에 자동으로 포커스가 이동하도록 한다.

**완료 기준:** 모달 열릴 때 닫기 버튼에 포커스가 이동하고, Tab 키가 모달 외부로 나가지 않으며, 모달 닫힌 후 트리거 버튼으로 포커스가 복귀한다.

---

### S1-T6. WelcomePopup — dialog role 및 aria-modal 추가

**대상 파일:** `client/src/components/WelcomePopup.tsx`  
**우선순위:** P1-4  
**예상 소요:** 20분

WelcomePopup 모달 컨테이너에 `role="dialog"`, `aria-modal="true"`, `aria-labelledby`를 추가한다. 모바일과 데스크톱 두 버전 모두 수정해야 한다. 스크린 리더가 팝업을 일반 콘텐츠가 아닌 다이얼로그로 인식하게 되어 배경 콘텐츠 읽기를 중단한다.

**완료 기준:** 스크린 리더(VoiceOver 또는 NVDA)에서 팝업 열릴 때 "대화상자" 역할이 안내된다.

---

### Sprint 1 완료 기준

- [ ] TypeScript 에러 0건
- [ ] 전체 vitest 테스트 통과 (168개 이상)
- [ ] `main.tsx` redirect 중복 방지 테스트 추가
- [ ] `YouTubeSection` isError/loading/empty 분기 테스트 추가
- [ ] 체크포인트 저장

---

## Sprint 2 — UX 품질 향상 및 SPA 일관성

**목표:** 사용자 경험의 일관성을 높이고, SPA 패턴을 통일한다. 기능 결함은 아니지만 품질 지표에 직접 영향을 미치는 항목들이다.

### S2-T1. window.location.href → navigate() 교체 (SPA 내부 이동)

**대상 파일:** `AdminDashboard.tsx`, `MyPage.tsx`, `TreatmentsManager.tsx`  
**우선순위:** P2-1  
**예상 소요:** 30분

동일 SPA 내 이동임에도 full reload를 사용하는 3개 지점을 wouter의 `useLocation` navigate로 교체한다. `Header.tsx`의 언어 변경과 `useAuth.ts`의 OAuth redirect는 full reload가 필수이므로 유지한다.

| 파일 | 위치 | 변경 내용 |
|---|---|---|
| `AdminDashboard.tsx:492` | YouTube 관리 이동 | `navigate("/admin/youtube")` |
| `AdminDashboard.tsx:509` | 로그아웃 후 홈 | `navigate("/")` |
| `TreatmentsManager.tsx:240` | 장비 신규 등록 | `navigate("/admin/equipment2/new")` |
| `MyPage.tsx:68` | 로그아웃 후 홈 | `navigate("/")` |

**완료 기준:** 해당 이동 시 페이지 새로고침 없이 라우팅되고, React DevTools에서 컴포넌트 트리가 유지된다.

---

### S2-T2. SpecialEventSection — 이벤트 카드 키보드 접근성

**대상 파일:** `client/src/components/SpecialEventSection.tsx`  
**우선순위:** P2-2  
**예상 소요:** 30분

이벤트 카드가 클릭 가능하지만 `role`, `aria-label`, `tabIndex`가 없어 키보드 사용자가 접근할 수 없다. 카드 컨테이너를 `<button>` 또는 `<a>`로 교체하고 `aria-label`을 추가한다. 기존 `onClick` 핸들러는 그대로 유지한다.

**완료 기준:** Tab 키로 이벤트 카드에 포커스가 이동하고, Enter/Space로 카드를 활성화할 수 있다.

---

### S2-T3. Header 언어 드롭다운 — listbox role 정합성 수정

**대상 파일:** `client/src/components/Header.tsx`  
**우선순위:** P2-3  
**예상 소요:** 30분

트리거 버튼에 `aria-haspopup="listbox"`가 선언되어 있으나 실제 드롭다운에 `role="listbox"`와 각 옵션의 `role="option"`이 없다. 드롭다운 컨테이너에 `role="listbox"`, `aria-label="언어 선택"`을 추가하고 각 옵션 버튼에 `role="option"`, `aria-selected`를 추가한다. 아울러 ESC로 드롭다운 닫힌 후 트리거 버튼으로 포커스가 복귀하도록 `ref`를 추가한다.

**완료 기준:** 스크린 리더에서 드롭다운 열릴 때 "목록 상자" 역할이 안내되고, 현재 선택된 언어에 "선택됨" 상태가 표시된다.

---

### S2-T4. SectionFallback — 섹션별 최소 높이 지정으로 CLS 감소

**대상 파일:** `client/src/pages/Home.tsx`  
**우선순위:** P2-5  
**예상 소요:** 30분

현재 `SectionFallback`은 `py-16 md:py-24`만 적용해 섹션 로드 시 레이아웃이 튀는 CLS가 발생한다. 각 섹션의 예상 높이에 맞는 `min-h` 값을 지정하거나, 섹션별로 다른 fallback 컴포넌트를 사용한다. `ReviewsSection`(약 600px)과 `YouTubeSection`(약 700px)이 특히 중요하다.

**완료 기준:** Lighthouse CLS 점수가 0.1 이하로 유지된다.

---

### S2-T5. ReviewsSection 캐러셀 — 방향키 키보드 지원

**대상 파일:** `client/src/components/ReviewsSection.tsx`  
**우선순위:** P2-6  
**예상 소요:** 30분

캐러셀 이전/다음 버튼에 `aria-label`은 있으나 방향키(`ArrowLeft`/`ArrowRight`) 이벤트가 없다. 캐러셀 컨테이너에 `onKeyDown` 핸들러를 추가해 방향키로 슬라이드를 전환할 수 있도록 한다.

**완료 기준:** 캐러셀에 포커스가 있을 때 방향키로 슬라이드가 전환된다.

---

### S2-T6. Footer 내부 링크 — SPA 해시 스크롤로 교체

**대상 파일:** `client/src/components/Footer.tsx`  
**우선순위:** P2-1 (Footer 부분)  
**예상 소요:** 30분

Footer의 내부 링크들이 `window.location.href`로 구현되어 있어 full reload가 발생한다. wouter의 `<Link>`와 `scrollIntoView`를 조합하거나, `Home.tsx`의 `MutationObserver` 기반 해시 스크롤 로직을 재사용한다.

**완료 기준:** Footer 내부 링크 클릭 시 페이지 새로고침 없이 해당 섹션으로 스크롤된다.

---

### S2-T7. main.tsx — window.location.href → window.location.replace

**대상 파일:** `client/src/main.tsx`  
**우선순위:** P1-3 후속 (S1-T1에서 플래그 추가 후 이 작업 진행)  
**예상 소요:** 5분

S1-T1에서 `isRedirecting` 플래그를 추가한 이후, `window.location.href = getLoginUrl()` 부분을 `window.location.replace(getLoginUrl())`로 교체한다. `replace`는 현재 히스토리 항목을 교체하므로 로그인 후 뒤로가기 시 인증 오류 페이지로 돌아가는 문제를 방지한다.

**완료 기준:** 미인증 상태에서 로그인 후 뒤로가기 버튼이 인증 오류 페이지가 아닌 이전 페이지로 이동한다.

---

### S2-T8. YouTubeSection 테스트 파일 신규 작성

**대상 파일:** `client/src/components/YouTubeSection.test.tsx` (신규)  
**우선순위:** P2-8  
**예상 소요:** 1.5시간

S1-T4, S1-T5에서 수정된 내용에 대한 테스트를 작성한다. 최소 10개 테스트 케이스를 포함한다.

```
- 로딩 중 스피너 표시
- 쿼리 실패 시 에러 메시지 + 재시도 버튼 표시
- 영상 없을 때 empty state 표시
- 영상 데이터 있을 때 카드 렌더링
- 비디오 카드 클릭 시 모달 열림
- ESC 키로 모달 닫힘
- 닫기 버튼 클릭으로 모달 닫힘
- 모달 열릴 때 닫기 버튼에 포커스 이동
- 모달 닫힐 때 트리거 버튼으로 포커스 복귀
- 재시도 버튼 클릭 시 refetch 호출
```

**완료 기준:** 10개 이상 테스트 전부 통과.

---

### Sprint 2 완료 기준

- [ ] TypeScript 에러 0건
- [ ] 전체 vitest 테스트 통과 (178개 이상)
- [ ] Lighthouse 접근성 점수 95 이상
- [ ] 체크포인트 저장

---

## Sprint 3 — 유지보수성 강화 및 테스트 보강

**목표:** 코드베이스의 장기 유지보수성을 높이고, 회귀 방지 테스트를 보강한다. 기능 결함이 아닌 기술 부채 항목들이다.

### S3-T1. TreatmentsEquipmentSection.copy.test.ts 파일명 정리

**대상 파일:** `client/src/components/TreatmentsEquipmentSection.copy.test.ts`  
**우선순위:** P3-5  
**예상 소요:** 5분

파일명에 `.copy.`가 남아 있어 임시 파일처럼 보인다. `TreatmentsEquipmentSection.test.ts`로 이름을 변경하고, 관련 import 경로를 확인한다.

---

### S3-T2. manualChunks — streamdown 패키지 별도 청크 분리

**대상 파일:** `vite.config.ts`  
**우선순위:** P3-1  
**예상 소요:** 20분

`streamdown` 패키지가 `manualChunks`에 포함되지 않아 메인 번들에 합산될 수 있다. 사용 빈도가 낮은 페이지(관리자 대시보드 등)에서만 사용된다면 별도 청크로 분리해 초기 로드 번들 크기를 줄인다.

```ts
if (id.includes('streamdown')) return 'vendor-streamdown';
```

---

### S3-T3. sw.js — 캐시 버전 자동화

**대상 파일:** `client/public/sw.js`, `vite.config.ts`  
**우선순위:** P3-3  
**예상 소요:** 1시간

`CACHE_NAME`을 수동으로 bump해야 한다는 주석이 있으나 배포 시 잊어버리기 쉽다. Vite 빌드 시 `define`으로 `__BUILD_HASH__`를 주입하거나, `vite-plugin-pwa`를 도입해 캐시 버전 관리를 자동화한다.

```ts
// vite.config.ts
define: {
  __BUILD_HASH__: JSON.stringify(Date.now().toString(36)),
}

// sw.js
const CACHE_NAME = `star-pibu-v${__BUILD_HASH__}`;
```

---

### S3-T4. Header 언어 드롭다운 — ESC 닫기 후 focus restore

**대상 파일:** `client/src/components/Header.tsx`  
**우선순위:** P3-4  
**예상 소요:** 20분

ESC로 드롭다운을 닫을 때 트리거 버튼으로 포커스가 복귀하지 않는다. S2-T3에서 listbox role을 추가할 때 함께 처리하거나, 별도로 트리거 버튼 `ref`를 추가해 닫을 때 `.focus()`를 호출한다.

> **참고:** S2-T3에서 이미 처리했다면 이 항목은 생략한다.

---

### S3-T5. main.tsx redirect 회귀 테스트 추가

**대상 파일:** `server/main.redirect.test.ts` (신규)  
**우선순위:** P3 보강  
**예상 소요:** 30분

S1-T1에서 추가한 `isRedirecting` 플래그의 동작을 검증하는 회귀 테스트를 작성한다.

```
- UNAUTHORIZED 에러가 연속으로 발생해도 redirect는 한 번만 실행
- UNAUTHORIZED 외 에러는 redirect를 트리거하지 않음
- redirect 후 isRedirecting 플래그가 true로 유지됨
```

---

### Sprint 3 완료 기준

- [ ] TypeScript 에러 0건
- [ ] 전체 vitest 테스트 통과 (185개 이상)
- [ ] `TreatmentsEquipmentSection.copy.test.ts` 파일명 변경
- [ ] 체크포인트 저장

---

## 전체 이슈 추적표

| ID | 파일 | 이슈 | 우선순위 | Sprint | 상태 |
|---|---|---|---|---|---|
| S1-T1 | `main.tsx` | redirect 중복 방지 + console.error dev-only | P1-3 | Sprint 1 | ⬜ 미완료 |
| S1-T2 | `index.html`, `main.tsx` | analytics placeholder 배포 리스크 | P1-5 | Sprint 1 | ⬜ 미완료 |
| S1-T3 | `MyReservations.tsx` | window.location.reload → invalidate | P1-6 | Sprint 1 | ⬜ 미완료 |
| S1-T4 | `YouTubeSection.tsx` | isError 처리 + 이중 state 제거 | P1-1, P2-4 | Sprint 1 | ⬜ 미완료 |
| S1-T5 | `YouTubeSection.tsx` | modal focus trap + focus restore | P1-2 | Sprint 1 | ⬜ 미완료 |
| S1-T6 | `WelcomePopup.tsx` | dialog role + aria-modal 추가 | P1-4 | Sprint 1 | ⬜ 미완료 |
| S2-T1 | `AdminDashboard.tsx`, `MyPage.tsx`, `TreatmentsManager.tsx` | window.location.href → navigate() | P2-1 | Sprint 2 | ⬜ 미완료 |
| S2-T2 | `SpecialEventSection.tsx` | 이벤트 카드 키보드 접근성 | P2-2 | Sprint 2 | ⬜ 미완료 |
| S2-T3 | `Header.tsx` | listbox role 정합성 + focus restore | P2-3, P3-4 | Sprint 2 | ⬜ 미완료 |
| S2-T4 | `Home.tsx` | SectionFallback CLS 감소 | P2-5 | Sprint 2 | ⬜ 미완료 |
| S2-T5 | `ReviewsSection.tsx` | 캐러셀 방향키 지원 | P2-6 | Sprint 2 | ⬜ 미완료 |
| S2-T6 | `Footer.tsx` | 내부 링크 SPA 해시 스크롤 교체 | P2-1 | Sprint 2 | ⬜ 미완료 |
| S2-T7 | `main.tsx` | window.location.href → replace | P1-3 후속 | Sprint 2 | ⬜ 미완료 |
| S2-T8 | `YouTubeSection.test.tsx` | 테스트 파일 신규 작성 | P2-8 | Sprint 2 | ⬜ 미완료 |
| S3-T1 | `TreatmentsEquipmentSection.copy.test.ts` | 파일명 정리 | P3-5 | Sprint 3 | ⬜ 미완료 |
| S3-T2 | `vite.config.ts` | streamdown 청크 분리 | P3-1 | Sprint 3 | ⬜ 미완료 |
| S3-T3 | `sw.js`, `vite.config.ts` | 캐시 버전 자동화 | P3-3 | Sprint 3 | ⬜ 미완료 |
| S3-T4 | `Header.tsx` | 드롭다운 focus restore | P3-4 | Sprint 3 | ⬜ 미완료 |
| S3-T5 | `main.redirect.test.ts` | redirect 회귀 테스트 | P3 보강 | Sprint 3 | ⬜ 미완료 |

---

## 의존 관계 다이어그램

```
S1-T1 (main.tsx 플래그)
  └─► S2-T7 (window.location.replace 교체)

S1-T4 (YouTubeSection isError + state 정리)
  └─► S1-T5 (focus trap — 같은 파일, 연속 작업)
        └─► S2-T8 (YouTubeSection 테스트 작성)

S2-T3 (Header listbox role)
  └─► S3-T4 (Header focus restore — S2-T3에서 함께 처리 가능)
```

나머지 작업들은 독립적으로 진행 가능하다.

---

## 참고: 각 Sprint 시작 전 체크리스트

**Sprint 시작 전:**
1. `pnpm test` 전체 통과 확인
2. `npx tsc --noEmit` 에러 0건 확인
3. 해당 Sprint의 작업 항목을 `todo.md`에 `[ ]`로 추가

**Sprint 완료 후:**
1. `pnpm test` 전체 통과 확인
2. `npx tsc --noEmit` 에러 0건 확인
3. 완료된 항목을 `todo.md`에서 `[x]`로 표시
4. `webdev_save_checkpoint` 체크포인트 저장

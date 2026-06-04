# 스타피부과 홈페이지 코드 리뷰 보고서
> 기준 커밋: `994bac05` | 작성일: 2026-06-05 | 검토자: 시니어 개발자 관점

---

## 요약

전체적으로 코드 품질이 높고, 이전 PR 시리즈(PR-44~47)를 통해 SEO, 접근성, 성능 최적화가 상당 수준 완성되었습니다. 아래 이슈들은 **실제 사용자 경험 또는 SEO에 직접 영향을 주는** 잔여 문제들입니다.

---

## 🔴 Critical (즉시 수정 필요)

### C-1. `index.html` MedicalBusiness 스키마 중복
**파일**: `client/index.html` + `client/src/components/SeoHead.tsx`

홈페이지 로드 시 `MedicalBusiness` JSON-LD가 **2개** 삽입됩니다.
- `index.html` (정적): MedicalBusiness 1개
- `SeoHead` (동적, `includeClinicSchema=true`): MedicalBusiness + WebSite 2개

Google Search Console은 중복 스키마를 경고로 처리하며, 어느 스키마가 권위 있는지 판단하지 못합니다.

**수정 방향**: `index.html`의 `<script type="application/ld+json">` 블록 전체 제거. `SeoHead`의 동적 스키마가 단일 소스가 됩니다.

---

### C-2. Hash Navigation + Lazy Loading 타이밍 버그
**파일**: `client/src/pages/Home.tsx` (line 41-51)

`/#about`, `/#faq`, `/#contact` 등 해시 링크로 진입 시 `setTimeout(300ms)` 안에 lazy 섹션이 아직 렌더링되지 않아 `document.querySelector(hash)`가 `null`을 반환합니다. 결과적으로 **스크롤이 동작하지 않습니다**.

`PhilosophySection` (`id="about"`), `FAQSection` (`id="faq"`), `ContactSection` (`id="contact"`)이 모두 lazy로 처리되어 있어 300ms 내 렌더링 보장이 없습니다.

**수정 방향**: `MutationObserver`로 해당 id가 DOM에 나타날 때까지 대기 후 스크롤.

```tsx
// 수정 예시
useEffect(() => {
  const hash = window.location.hash;
  if (!hash) return;
  const id = hash.slice(1);
  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
      return true;
    }
    return false;
  };
  if (tryScroll()) return;
  const observer = new MutationObserver(() => {
    if (tryScroll()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  const timeout = setTimeout(() => observer.disconnect(), 5000);
  return () => { observer.disconnect(); clearTimeout(timeout); };
}, []);
```

---

## 🟠 High (이번 릴리즈 전 수정 권장)

### H-1. Header 모바일 메뉴 ESC 키 미처리
**파일**: `client/src/components/Header.tsx`

모바일 메뉴가 열린 상태에서 `Escape` 키를 눌러도 닫히지 않습니다. WCAG 2.1 SC 2.1.2 (No Keyboard Trap) 위반.

**수정 방향**:
```tsx
useEffect(() => {
  if (!mobileOpen) return;
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobileMenu(); };
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [mobileOpen]);
```

### H-2. Header 모바일 메뉴 버튼 `aria-expanded` 누락
**파일**: `client/src/components/Header.tsx` (line ~394)

메뉴 토글 버튼에 `aria-expanded` 속성이 없어 스크린리더가 메뉴 상태를 알 수 없습니다.

```tsx
// 수정 예시
<button
  type="button"
  aria-label="메뉴 열기"
  aria-expanded={mobileOpen}
  aria-controls="mobile-menu-panel"
  onClick={() => openMobileMenu()}
>
```

### H-3. Language Dropdown `aria-expanded` 누락
**파일**: `client/src/components/Header.tsx` (line ~324)

언어 선택 드롭다운 버튼에도 `aria-expanded={langDropOpen}` 누락.

### H-4. YouTubeSection 모달 ESC 키 미처리
**파일**: `client/src/components/YouTubeSection.tsx`

`role="dialog"` 모달이 있으나 `Escape` 키로 닫는 기능이 없습니다. WCAG 2.1 SC 2.1.2 위반.

```tsx
useEffect(() => {
  if (!selectedVideo) return;
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedVideo(null); };
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [selectedVideo]);
```

---

## 🟡 Medium (다음 스프린트 수정)

### M-1. `scripts/` 폴더 임시 스크립트 잔류
**파일**: `scripts/fix_rel.py`, `scripts/fix_button_type.py`

일회성 마이그레이션 스크립트가 레포지토리에 남아 있습니다. 재실행 시 의도치 않은 파일 수정 위험이 있습니다.

**수정 방향**: 삭제 또는 `scripts/archive/`로 이동.

### M-2. `sw.js` CACHE_NAME 버전 고정
**파일**: `client/public/sw.js` (line ~22)

`CACHE_NAME = "star-pibu-v2"` 가 하드코딩되어 있습니다. 배포 시 캐시 무효화를 위해 버전을 올려야 하는데, 수동 변경을 잊으면 구 캐시가 계속 서빙됩니다.

**수정 방향**: Vite 빌드 시 `__APP_VERSION__` 환경 변수를 주입하거나, 배포 체크리스트에 명시.

### M-3. `console.error` 프로덕션 노출
**파일**: `client/src/main.tsx` (line ~30, ~37)

`console.error("[API Query Error]", error)` / `console.error("[API Mutation Error]", error)` 가 프로덕션에서도 출력됩니다. 민감한 에러 정보가 브라우저 콘솔에 노출될 수 있습니다.

**수정 방향**: `import.meta.env.DEV` 조건부 처리 또는 Sentry 등 에러 모니터링 서비스로 전환.

### M-4. `SectionFallback` aria-hidden 개선
**파일**: `client/src/pages/Home.tsx` (line ~35)

```tsx
function SectionFallback() {
  return <div className="py-16 md:py-24" aria-hidden="true" />;
}
```

`aria-hidden="true"`는 올바르나, `role="status"` + `aria-label="로딩 중"` 조합이 스크린리더 UX에 더 적합합니다.

---

## 🟢 Low (선택적 개선)

### L-1. `index.html` `<html lang>` 속성 고정
**파일**: `client/index.html`

`<html lang="ko">`로 고정되어 있습니다. 다국어(en/ja/zh) 페이지에서도 동일한 `index.html`이 서빙되므로, 언어별 `lang` 속성이 맞지 않습니다. SPA 특성상 완전한 해결은 어렵지만, `SeoHead`에서 `document.documentElement.lang`을 동적으로 업데이트하는 방법으로 개선 가능합니다.

### L-2. `SeoHead` `og:image` 한글 파일명
**파일**: `client/src/pages/Home.tsx` (line ~62)

`ogImage` URL에 `울쎄라피프라임_1_0daba485.png` 같은 한글 파일명이 포함되어 있습니다. 일부 OG 파서(특히 구형 Facebook 크롤러)에서 URL 인코딩 문제가 발생할 수 있습니다.

### L-3. `scripts/` 폴더 임시 파일 정리
`activate-all-special-events.mjs`, `seed-special-events.mjs`, `seed-events.mjs` 등 시딩 스크립트도 프로덕션 레포에 남아 있습니다. `.gitignore` 처리 또는 `scripts/archive/`로 이동 권장.

---

## 수정 우선순위 요약

| 우선순위 | 항목 | 예상 작업 시간 |
|---|---|---|
| 🔴 C-1 | `index.html` MedicalBusiness 중복 스키마 제거 | 5분 |
| 🔴 C-2 | Hash navigation MutationObserver 수정 | 20분 |
| 🟠 H-1 | Header 모바일 메뉴 ESC 처리 | 10분 |
| 🟠 H-2 | Header 모바일 메뉴 `aria-expanded` 추가 | 5분 |
| 🟠 H-3 | Language Dropdown `aria-expanded` 추가 | 5분 |
| 🟠 H-4 | YouTubeSection 모달 ESC 처리 | 10분 |
| 🟡 M-1 | `scripts/` 임시 파일 정리 | 5분 |
| 🟡 M-3 | `console.error` 프로덕션 노출 처리 | 10분 |
| 🟢 L-1 | `html lang` 동적 업데이트 | 15분 |

---

*이 보고서는 정적 코드 분석 기반입니다. 런타임 동작 검증은 브라우저 테스트를 통해 추가 확인하세요.*

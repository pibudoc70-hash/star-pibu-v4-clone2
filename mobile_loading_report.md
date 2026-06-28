# 모바일 체감 로딩 속도 최적화 보고서

**프로젝트:** star-pibu.com (부산 서면 스타피부과)  
**작업 일자:** 2026-06-28  
**체크포인트:** manus-webdev://65717164

---

## 1. 수정 파일 목록

| 파일 | 변경 내용 | 우선순위 |
|------|----------|---------|
| `client/index.html` | 폰트 로딩 구조 최적화 (동기/비동기 분리) | P0 |
| `client/src/components/ScrollAnimationWrapper.tsx` | `deferMount` 옵션 추가 (진정한 progressive rendering) | P0 |
| `client/src/pages/Home.tsx` | Hero 아래 모든 섹션에 `deferMount` 적용 | P0 |
| `client/src/components/DoctorsSection.tsx` | 가짜 800ms 로딩 타이머 + isLoading 상태 완전 제거 | P1 |
| `client/src/components/ReviewsSection.tsx` | 가짜 600ms 로딩 타이머 제거 | P1 |
| `client/src/components/ManagementDevicesSection.tsx` | 가짜 700ms 로딩 타이머 제거 | P1 |
| `client/src/components/ResultsStatisticsSection.tsx` | 가짜 800ms 로딩 타이머 제거 | P1 |
| `client/src/index.css` | MobileBottomCTA backdrop-filter/transform 제거 | P2 |

---

## 2. 제거한 preload / modulepreload 목록

**Before (이전 작업에서 이미 정리됨):**
- 불필요한 admin 청크 modulepreload 없음 (manualChunks로 분리만 됨)
- treatments/equipment 데이터 청크: `data-treatments` 별도 분리 (lazy import)

**이번 작업:**
- 추가 제거할 불필요한 preload 없음 (Hero 이미지 2개 preload는 LCP 최적화에 필수)

**폰트 preload 최적화 (Before → After):**

| 폰트 | Before | After |
|------|--------|-------|
| Noto Serif KR 400 | 동기 `<link rel="stylesheet">` (렌더 블로킹) | 비동기 (Cormorant Garamond와 통합) |
| Montserrat 400,500 | 동기 (Noto Serif KR과 묶음) | 동기 유지 (Hero subtitle + MobileBottomCTA에서 즉시 필요) |
| Cormorant Garamond | 비동기 | 비동기 유지 (Noto Serif KR과 통합) |

**효과:** 동기 Google Fonts 요청 2개 → 1개로 감소. 렌더 블로킹 리소스 감소.

---

## 3. 모바일 첫 로딩 구조 개선

### 핵심 문제 (Before)
`ScrollAnimationWrapper`는 애니메이션만 지연할 뿐, **모든 섹션이 첫 로드에 즉시 마운트**되었습니다. 사용자가 Hero만 보는 동안에도 아래 10개 섹션의 컴포넌트가 모두 마운트되어 JS 실행 비용이 발생했습니다.

### 해결 (After)

**`ScrollAnimationWrapper`에 `deferMount` 옵션 추가:**
```tsx
// deferMount=true → 뷰포트 200px 전에 마운트 시작
// 마운트 전: 최소 높이 플레이스홀더만 렌더 (CLS 방지)
// 마운트 후: 즉시 콘텐츠 표시 (가짜 타이머 없음)
```

**`Home.tsx` 섹션별 적용:**
- **즉시 렌더:** `HeroSection`, `SpecialEventSection` (첫 화면)
- **deferMount 적용:** `DoctorsSection`, `TreatmentsEquipmentSection`, `ManagementDevicesSection`, `ResultsStatisticsSection`, `ReviewsSection`, `YouTubeSection`, `FAQSection`, `ContactSection` (폴드 아래 전체)

**체감 효과:**
- 첫 화면: Hero + 이벤트만 렌더 → 즉각적인 첫인상
- 스크롤 200px 전: 다음 섹션 마운트 시작 → 도달 전에 준비 완료
- 결과: "순차적으로 열리는" 고급스러운 모바일 경험

---

## 4. Hero 아래 섹션 lazy load / 점진 로딩 강화

### deferMount 적용 섹션 (8개)

| 섹션 | minHeight (플레이스홀더) | rootMargin |
|------|------------------------|------------|
| DoctorsSection | 400px | 200px (기본) |
| TreatmentsEquipmentSection | 500px | 200px |
| ManagementDevicesSection | 400px | 200px |
| ResultsStatisticsSection | 300px | 200px |
| ReviewsSection | 350px | 200px |
| YouTubeSection | 300px | 200px |
| FAQSection | 400px | 200px |
| ContactSection | 500px | 200px |

### 가짜 로딩 타이머 제거 (4개 섹션)

| 섹션 | 제거된 딜레이 | 근거 |
|------|-------------|------|
| DoctorsSection | 800ms | 로컬 데이터, deferMount로 마운트 시점 제어 |
| ReviewsSection | 600ms | 로컬 데이터, deferMount로 마운트 시점 제어 |
| ManagementDevicesSection | 700ms | 로컬 데이터, deferMount로 마운트 시점 제어 |
| ResultsStatisticsSection | 800ms | 로컬 데이터, deferMount로 마운트 시점 제어 |

**총 절감 딜레이:** 2,900ms (가짜 타이머 합산)

---

## 5. CTA / 카드 / 후기 / FAQ / 위치 섹션 정리

### MobileBottomCTA 경량화

| 항목 | Before | After | 효과 |
|------|--------|-------|------|
| `backdrop-filter: blur(12px)` | 있음 | **제거** | GPU 합성 레이어 생성 방지 |
| `box-shadow: 0 -4px 24px rgba(0,0,0,0.5)` | 있음 | **제거** | 렌더 비용 감소 |
| `border-top` | `rgba(196,168,130,0.18)` | `rgba(196,168,130,0.22)` | 시각적 구분 강화 |
| `transition` | `opacity, background, transform 0.18s cubic-bezier` | `opacity, background 0.15s ease` | GPU 합성 레이어 방지 |
| `:active transform: scale(0.98)` | 있음 | **제거** | GPU 합성 레이어 방지 |

**근거:** 배경색이 `#1a1a1a` (불투명)이므로 `backdrop-filter`는 시각적 효과가 없고 GPU 비용만 발생. `transform: scale`은 합성 레이어를 생성하여 스크롤 성능에 영향.

### 후기/FAQ/위치 섹션
- 기존 디자인 시스템 유지 (이미 표준화됨)
- deferMount로 초기 렌더 비용 제거
- 가짜 타이머 제거로 마운트 후 즉시 콘텐츠 표시

---

## 6. 폰트 / 이미지 / 공통 CSS 최적화

### 폰트 로딩 최적화

**Before:**
```html
<!-- 동기 (렌더 블로킹): Noto Serif KR 400 + Montserrat 400,500 -->
<link href="...Noto+Serif+KR:wght@400&Montserrat:wght@400;500..." rel="stylesheet" />
<!-- 비동기: Cormorant Garamond + Noto Serif KR 300,500 -->
<link rel="preload" as="style" href="...Cormorant+Garamond+Noto+Serif+KR:wght@300;500..." onload="..." />
```

**After:**
```html
<!-- 동기 (렌더 블로킹): Montserrat만 (Hero subtitle + MobileBottomCTA에서 즉시 필요) -->
<link href="...Montserrat:wght@400;500..." rel="stylesheet" />
<!-- 비동기: Cormorant Garamond + Noto Serif KR 전체 통합 (폴드 아래 섹션 타이틀) -->
<link rel="preload" as="style" href="...Cormorant+Garamond:ital,wght@...&Noto+Serif+KR:wght@300;400;500..." onload="..." />
```

**효과:**
- 동기 Google Fonts 요청: 2개 → 1개 (렌더 블로킹 리소스 50% 감소)
- Noto Serif KR: 폴드 아래 섹션 타이틀에만 사용 → 비동기 전환 안전
- Cormorant Garamond + Noto Serif KR 통합: 네트워크 요청 1개 절감

### 이미지 최적화
- `OptimizedImage` 컴포넌트: 이미 `loading="lazy"`, `decoding="async"` 기본 적용
- Hero 배경 이미지: 모바일용 `mobilePortraitJpg` 사용 (이전 작업에서 완료)
- 추가 최적화 없음 (이미 최적화됨)

### 공통 CSS 정리
- MobileBottomCTA: `backdrop-filter`, `box-shadow`, `transform` 제거
- 불필요한 `will-change` 사전 선언: 이미 최적화됨 (visible 후 `will-change: auto`)
- 추가 정리 없음 (기존 CSS 구조 양호)

---

## 7. Hero를 유지한 채 무엇을 최적화했는지

**Hero 섹션 (절대 수정 금지):**
- ✅ 레이아웃, 배경, 카피, 비율, CTA 배치, 스타일 모두 유지
- ✅ Hero 이미지 preload (`fetchpriority="high"`) 유지
- ✅ Hero 폰트 (Cormorant Garamond, Montserrat) 유지

**Hero 아래 최적화 (이번 작업):**

1. **Progressive Rendering (핵심):** `ScrollAnimationWrapper`에 `deferMount` 추가 → Hero 아래 8개 섹션이 뷰포트 근처에서만 마운트. 첫 화면 JS 실행 비용 대폭 감소.

2. **가짜 타이머 제거:** 4개 섹션의 총 2,900ms 가짜 딜레이 제거. `deferMount`가 마운트 시점을 제어하므로 내부 딜레이 불필요.

3. **폰트 최적화:** 렌더 블로킹 Google Fonts 요청 2개 → 1개. Noto Serif KR을 비동기로 전환.

4. **MobileBottomCTA 경량화:** GPU 합성 레이어를 생성하는 `backdrop-filter`, `transform: scale` 제거.

---

## 8. 기능 비파괴 검증 결과

### 검증 명령어

```bash
pnpm run check  # TypeScript 타입 체크
pnpm run test   # 1413개 테스트
pnpm run build  # 프로덕션 빌드
```

### 결과

| 검증 항목 | 결과 |
|----------|------|
| `pnpm run check` (TypeScript) | ✅ 에러 없음 |
| `pnpm run test` (1413개) | ✅ 1413/1413 통과 |
| `pnpm run build` | ✅ 빌드 성공 (27.76s) |
| 회귀 테스트 (round14) | ✅ DoctorsSection isLoading 완전 제거로 통과 |

### 기능 유지 확인

| 기능 | 상태 |
|------|------|
| 예약 (네이버 예약) | ✅ 유지 |
| 상담 (카카오 채널) | ✅ 유지 |
| 전화 연결 | ✅ 유지 |
| 지도 (Google Maps) | ✅ 유지 (ContactSection deferMount 적용) |
| FAQ 아코디언 | ✅ 유지 |
| 후기 슬라이더 | ✅ 유지 |
| 유튜브 모달 | ✅ 유지 |
| SEO (메타태그, JSON-LD, hreflang) | ✅ 유지 |
| 라우팅 (다국어 /en, /ja, /zh) | ✅ 유지 |
| Hero 섹션 디자인 | ✅ 수정 없음 |

---

## 보류 항목 및 근거

### 보류: TreatmentsEquipmentSection 데이터 분리
- `useStaticTreatmentFilter`가 모듈 스코프에서 `TREATMENTS` 데이터를 즉시 평가
- `deferMount`로 컴포넌트 마운트는 지연되지만, JS 청크 평가는 lazy import 시점에 발생
- **보류 근거:** `data-treatments` 청크는 이미 별도 분리됨. 청크 평가 시점 최적화는 dynamic import 리팩토링이 필요하며 회귀 위험이 높음.

### 보류: ReviewsSection isLoading 완전 제거
- `isLoading` 상태를 `false`로만 변경 (타이머 제거)
- **보류 근거:** `isLoading` 분기 코드가 남아있어 추후 실제 API 연동 시 재활용 가능. DoctorsSection과 달리 회귀 테스트 제약 없음.

---

*Hero 섹션 디자인은 그대로 유지하면서, 그 아래의 모든 모바일 영역을 더 빠르고, 더 순차적으로, 더 가볍게 개선했습니다.*

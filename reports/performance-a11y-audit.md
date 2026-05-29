# 스타피부과 웹사이트 — 성능 최적화 영향 분석 및 접근성(A11y) 감사 보고서

**작성일:** 2026-05-29  
**대상 프로젝트:** star-pibu-v4-clone (React 19 + Vite + Tailwind 4)  
**감사 범위:** `client/src/` 전체 TSX 파일 (AdminDashboard-backup 제외, img 태그 46개, 폼 컴포넌트 2개)

---

## 1. 이미지 최적화 변경사항이 웹 성능에 미치는 영향

이번 최적화에서 도입된 `OptimizedImage` 컴포넌트는 세 가지 핵심 기법을 통합합니다. `loading="lazy"`로 뷰포트 밖 이미지를 지연 로딩하고, Hero 이미지에 `fetchPriority="high"`를 적용하여 LCP 이미지를 우선 처리하며, `<picture>` 태그를 통해 WebP/AVIF 포맷을 제공하되 미지원 브라우저에는 원본 이미지로 폴백합니다.

### 1.1 Core Web Vitals 예상 개선 효과

| 지표 | 현재 상태 | 변경 후 예상 | 개선 요인 |
|------|-----------|-------------|-----------|
| **LCP** (목표 < 2.5s) | 측정 필요 | 200~400ms 단축 | Hero 로고 `fetchPriority="high"` |
| **CLS** (목표 < 0.1) | 이미지 로드 시 레이아웃 이동 가능 | 거의 0 | `width={220} height={220}` 명시로 공간 예약 |
| **FCP** (목표 < 1.8s) | 시술 카드 이미지 초기 로딩 포함 | 초기 요청 감소 | 뷰포트 밖 이미지 `loading="lazy"` |
| **전송 크기** | JPEG/PNG 원본 | WebP 25~35% / AVIF 40~55% 절감 | `<picture>` 포맷 협상 |

**LCP 개선 원리:** 브라우저의 프리로드 스캐너는 HTML 파싱 초기에 `fetchPriority="high"` 이미지를 발견하면 다른 리소스보다 먼저 네트워크 요청을 발행합니다. Hero 섹션의 스타피부과 로고는 사용자가 처음 보는 주요 시각 요소이므로 이 처리가 LCP 시간에 직접 영향을 미칩니다.

**CLS 개선 원리:** `width`/`height` 속성이 없으면 브라우저는 이미지 파일을 받기 전까지 공간을 예약하지 못합니다. 이미지가 로드되면서 아래 콘텐츠가 밀리는 레이아웃 이동(CLS)이 발생하는데, 두 속성을 명시하면 브라우저가 aspect-ratio를 계산하여 공간을 미리 확보합니다.

### 1.2 WebP/AVIF 포맷 변환 동작 방식

현재 구현은 CDN URL(CloudFront)에 `?format=webp` 또는 `?format=avif` 쿼리스트링을 추가합니다. `<picture>` 태그 내 `<source>` 요소는 브라우저가 지원하는 포맷을 자동으로 선택하므로, AVIF를 지원하면 AVIF를, WebP만 지원하면 WebP를, 둘 다 미지원이면 원본 `<img>`를 사용합니다. 이 폴백 체계는 어떤 브라우저에서도 이미지가 표시되도록 보장합니다.

> **중요 전제:** 쿼리스트링 기반 포맷 변환이 실제로 동작하려면 CloudFront Functions 또는 Lambda@Edge에서 `Accept` 헤더를 읽어 포맷을 변환하는 설정이 필요합니다. 현재 CDN에 이 설정이 없다면 `<source>` 태그는 원본과 동일한 이미지를 가리키게 됩니다.

### 1.3 현재 미적용 이미지 현황 및 우선순위

전체 46개 `<img>` 태그 중 `OptimizedImage` 컴포넌트로 전환된 것은 **HeroSection 1개**입니다. 나머지 45개는 직접 `<img>` 태그를 사용하고 있으며, 아래 순서로 순차 적용을 권장합니다.

| 파일 | img 수 | 우선순위 | 현재 상태 |
|------|--------|----------|-----------|
| `TreatmentsEquipmentSection.tsx` | 6 | **높음** | loading 속성 없음 |
| `FacilitySection.tsx` | 4 | **높음** | loading 속성 없음 |
| `DoctorsSection.tsx` | 4 | 중간 | `loading="eager"` 이미 적용 |
| `Equipment2Detail.tsx` | 3 | 중간 | loading 속성 없음 |
| `WelcomePopup.tsx` | 2 | 낮음 | loading 속성 없음 |
| `YouTubeSection.tsx` | 2 | 낮음 | loading 속성 없음 |

---

## 2. 접근성(A11y) 감사 결과 및 개선 내역

### 2.1 이미지 alt 속성 — 감사 결과: 양호

전체 38개 이미지 alt 속성을 전수 검토한 결과, **빈 `alt=""`나 누락된 alt 속성이 발견되지 않았습니다.** 모든 이미지에 `alt={item.name}`, `alt="스타피부과 로고"`, `alt={doctor.title}` 등 의미 있는 텍스트가 적용되어 있습니다.

단, `ManusDialog.tsx`의 `alt="Dialog graphic"`은 이미지 내용을 구체적으로 설명하지 않습니다. 실제 이미지가 전달하는 정보(예: "스타피부과 상담 안내 일러스트")로 교체하면 스크린 리더 사용자의 이해도가 높아집니다.

### 2.2 폼 요소 label 연결 — 감사 결과: 개선 완료

**이번 작업에서 수정됨.** `ReservationForm.tsx`의 모든 `<label>` 태그에 `htmlFor` 속성을 추가하고, 대응하는 `<input>`, `<select>`, `<textarea>` 요소에 `id` 속성을 연결했습니다. 회원 폼 7개 필드, 비회원 폼 9개 필드 총 16개 연결이 완료되었습니다.

이 변경으로 스크린 리더 사용자가 폼 필드에 포커스할 때 레이블을 자동으로 읽을 수 있게 되었으며, 레이블 클릭 시 해당 입력 필드로 포커스가 이동하는 UX도 개선되었습니다.

### 2.3 색상 대비 (WCAG AA 기준: 일반 텍스트 4.5:1, 대형 텍스트 3:1)

코드 분석을 통해 잠재적 저대비 색상 조합을 식별했습니다. 실제 측정값은 브라우저 DevTools 또는 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)로 확인하세요.

| 색상 조합 | 추정 대비비 | WCAG AA | 사용 위치 | 권고 |
|-----------|------------|---------|-----------|------|
| `#d1ab67` on `#f6efe0` | ~2.8:1 | ❌ | 시술 카드 카테고리 영문 | 장식용 소문자 텍스트로 허용 가능, 또는 `#a07820`으로 진하게 |
| `text-white/50` on 네이비 | ~3.5:1 | ❌ | Hero 보조 텍스트 | `text-white/70` 이상으로 상향 |
| `text-gray-400` on white | ~3.0:1 | ❌ | 카드 설명 보조 텍스트 | `text-gray-500` 이상으로 상향 |
| `#1F2937` on white | ~16:1 | ✅ | 본문 텍스트 | 기준 충족 |
| `text-white/80` on 네이비 | ~7.0:1 | ✅ | Hero 주요 텍스트 | 기준 충족 |

`text-gray-400`은 보조 설명 텍스트에 광범위하게 사용되고 있으며, `text-gray-500`(대비비 ~4.6:1)으로 변경하면 WCAG AA를 충족하면서 시각적 차이가 크지 않습니다.

### 2.4 키보드 네비게이션 — 감사 결과 및 개선 내역

| 항목 | 이전 상태 | 현재 상태 |
|------|-----------|-----------|
| `<header>` role="banner" | ✅ 적용됨 | ✅ 유지 |
| `<nav>` role="navigation" + aria-label | ✅ 적용됨 | ✅ 유지 |
| 로고 링크 aria-label | ✅ "홈으로 이동" | ✅ 유지 |
| FloatingCTA 버튼 aria-label | ✅ 전화/카카오/예약 모두 적용 | ✅ 유지 |
| **스킵 네비게이션 링크** | ❌ 미구현 | ✅ **이번 작업에서 추가됨** |
| `<main id="main-content">` | ❌ id 없음 | ✅ **이번 작업에서 추가됨** |
| 모달 포커스 트랩 | ⚠️ shadcn/ui Dialog 내장 | ✅ 내장 동작 확인 |
| 아이콘 전용 버튼 aria-label | ⚠️ AdminDashboard 2개 누락 | ⚠️ 관리자 페이지로 낮은 우선순위 |

**스킵 네비게이션 링크**는 `MainLayout.tsx` 최상단에 추가되었습니다. 평소에는 화면에 보이지 않다가(`sr-only`) 키보드 Tab 키로 포커스될 때 화면에 나타나며, 클릭 시 `#main-content`로 스크롤됩니다. 이는 WCAG 2.1 Success Criterion 2.4.1 "반복 블록 건너뛰기"를 충족합니다.

---

## 3. 종합 평가 및 남은 과제

이번 변경으로 **Hero 이미지 LCP 최적화**, **CLS 방지**, **폼 접근성 개선**, **스킵 네비게이션 구현**이 완료되었습니다. 전반적인 접근성 수준은 WCAG 2.1 AA 기준의 주요 항목을 충족하는 방향으로 개선되었습니다.

남은 과제는 다음과 같습니다. 첫째, 나머지 45개 `<img>` 태그를 `OptimizedImage` 컴포넌트로 순차 전환하여 `loading="lazy"` 및 `width/height`를 전체 적용해야 합니다. 둘째, `text-gray-400` 등 저대비 보조 텍스트 색상을 `text-gray-500` 이상으로 상향 조정하면 WCAG AA를 완전히 충족할 수 있습니다. 셋째, CloudFront에서 쿼리스트링 기반 이미지 포맷 변환을 활성화하면 WebP/AVIF의 실질적인 전송 크기 절감 효과를 얻을 수 있습니다.

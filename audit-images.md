# Step 13 이미지 감사 결과 (audit-images.md)

생성일: 2026-07-24

---

## 1. 이미지 사용처 감사

### 재생의료 배너

| 파일명 | 사용 컴포넌트 | img 태그 원문 | loading 속성 |
|---|---|---|---|
| `regen-medicine-banner-pc2_e6271aa5.png` | `Home.tsx` (picture > source) | `<img loading="eager" fetchPriority="high">` | `eager` ✅ (LCP 후보, 정상) |
| `regen-medicine-banner-mobile_1fe7ea14.png` | `Home.tsx` (picture > source) | 동일 img 태그 공유 | `eager` ✅ |

### 의사 이미지 (시술 이미지로 잘못 분류됨 — 실제 의사 프로필 이미지)

| 파일명 | 사용 컴포넌트 | loading 속성 |
|---|---|---|
| `01_5e3176cb_69bdbf43.png` | `Doctors.tsx`, `doctors-data.ts` (DR_JO_IMAGE_DESKTOP_JPG, DR_JO_CARD_IMAGE) | `OptimizedImage` → `loading="lazy"` ✅ |
| `0211_8cfcf452_31628e98.png` | `Doctors.tsx`, `doctors-data.ts` (DR_WOO_IMAGE_DESKTOP_JPG) | `OptimizedImage` → `loading="lazy"` ✅ |
| `03_46691618_e287e8e1.png` | `Doctors.tsx`, `doctors-data.ts` (DR_LEE_IMAGE_DESKTOP_JPG) | `OptimizedImage` → `loading="lazy"` ✅ |

### 이벤트 이미지

| 파일명 | 사용 컴포넌트 | loading 속성 |
|---|---|---|
| `event_*.png` (DB 동적) | `EventCard.tsx`, `EventTableMobile.tsx`, `SpecialEventSection.tsx` | `OptimizedImage` → `loading="lazy"` ✅ |

---

## 2. loading="lazy" 감사 결과

**추가 필요한 항목: 없음**

`OptimizedImage` 컴포넌트가 `priority=false` (기본값)일 때 이미 `loading="lazy"` + `decoding="async"`를 자동 적용합니다.
이벤트·의사·시술 이미지 모두 `OptimizedImage`를 사용하므로 별도 수정 불필요.

재생의료 배너는 `<img loading="eager">` 사용 — 첫 화면 LCP 후보로 정상입니다.

---

## 3. WebP 변환 결과

| 원본 파일 | 원본 크기 | WebP 크기 | 절감률 | 업로드 경로 |
|---|---|---|---|---|
| `regen-medicine-banner-pc2_e6271aa5.png` | 374 KB | 36 KB | **90%** | `/manus-storage/regen-medicine-banner-pc2_e6271aa5_5f2ea459.webp` |
| `regen-medicine-banner-mobile_1fe7ea14.png` | 273 KB | 24 KB | **91%** | `/manus-storage/regen-medicine-banner-mobile_1fe7ea14_b3d1a716.webp` |
| `01_5e3176cb_69bdbf43.png` | 1,183 KB | 28 KB | **98%** | `/manus-storage/01_5e3176cb_69bdbf43_e8e22b42.webp` |
| `0211_8cfcf452_31628e98.png` | 1,165 KB | 22 KB | **98%** | `/manus-storage/0211_8cfcf452_31628e98_2a57d4d8.webp` |
| `03_46691618_e287e8e1.png` | 1,154 KB | 17 KB | **99%** | `/manus-storage/03_46691618_e287e8e1_dc958eaf.webp` |
| **합계** | **4,149 KB** | **127 KB** | **97%** | |

> 변환 설정: `quality: 82`, `effort: 6`, `width: 1600 (최대)`, `withoutEnlargement: true`

---

## 4. 이벤트 이미지 최적화 방법

이벤트 이미지(`event_*.png`)는 관리자 패널에서 업로드된 URL을 DB에 저장하는 **동적 구조**입니다.
코드 레벨에서 URL 교체가 불가능하며, 다음 방법으로 최적화해야 합니다:

**방법 A (권장)**: 관리자 패널(`/admin` → 이벤트 관리)에서 각 이벤트의 이미지를 WebP로 재업로드
**방법 B**: `scripts/convert-images.mjs`를 수정하여 이벤트 이미지도 변환 후, DB의 `imageUrl` 필드를 직접 업데이트

---

## 5. 적용된 변경사항

### client/index.html
- 재생의료 배너 preload 추가 (PC/모바일 각각, `fetchpriority="high"`)

### client/src/pages/Home.tsx
- 재생의료 배너 `<picture>` 태그에 WebP `<source>` 추가 (PNG 폴백 유지)
- `<img>` 태그에 `fetchPriority="high"` 추가

### client/src/lib/doctors-data.ts
- `DR_JO_IMAGE_DESKTOP_JPG`, `DR_WOO_IMAGE_DESKTOP_JPG`, `DR_LEE_IMAGE_DESKTOP_JPG`, `DR_JO_CARD_IMAGE` → WebP URL로 교체

### client/src/pages/Doctors.tsx
- `DOCTOR_IMAGES` 배열 → WebP URL로 교체

---

## 6. 미적용 항목

| 항목 | 이유 |
|---|---|
| `clinic-data.ts` 이미지 URL | JSON-LD 스키마 전용, 검색 엔진 크롤러 호환성을 위해 PNG 유지 |
| 이벤트 이미지 URL | DB 동적 구조, 코드 레벨 교체 불가 → 관리자 패널에서 재업로드 필요 |
| AVIF 변환 | 지시서 범위 외 (WebP만 처리) |

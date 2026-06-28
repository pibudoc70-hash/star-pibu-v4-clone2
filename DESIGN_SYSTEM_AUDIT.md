# Design System Audit & Unification Plan (Phase 5)

## 현재 상태 분석

### 1. 섹션 헤더 시스템 (Section Headers)

#### 타이포그래피
- **`.section-title`**: Noto Serif KR, `clamp(1.7rem, 4.2vw, 2.6rem)`, font-weight: 400
  - 모바일: `clamp(1.4rem, 6vw, 1.9rem)` (md 이상)
  - 일본어/중국어: `clamp(1.2rem, 5vw, 1.6rem)`
- **`.section-subtitle`**: Pretendard Variable, `clamp(0.83rem, 1.7vw, 0.93rem)`, font-weight: 300
  - 모바일: `clamp(0.75rem, 3.2vw, 0.85rem)`
- **`.section-eyebrow`**: 0.55rem, letter-spacing: 0.3em, uppercase, font-weight: 700

#### 색상
- 텍스트: `var(--brand-text, #2C2C2C)` (제목), `var(--brand-text-mid, #666666)` (부제)
- 배경: 섹션별로 다양 (warm, offwhite, gold-soft, dark-navy, dark-deep)

#### 여백
- 제목 하단: 1.2rem
- 부제 최대 너비: 520px (중앙 정렬)

---

### 2. 카드 시스템 (Card Components)

#### Treatment Card
```css
.treatment-card {
  background: var(--brand-bg, #FAF8F5);
  border-radius: 0.875rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04);
  border: 1px solid rgba(196,168,130,0.15);
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.32s;
}

.treatment-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 48px rgba(196,168,130,0.18), 0 6px 16px rgba(0,0,0,0.07);
  border-color: rgba(196,168,130,0.38);
}
```

#### Review Card
```css
.review-card {
  background: var(--brand-bg, #FAF8F5);
  border-radius: 1.125rem;
  padding: 2rem;
  box-shadow: 0 2px 20px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.03);
  border: 1px solid rgba(196,168,130,0.15);
  border-top: 2px solid rgba(196,168,130,0.5);
  transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 44px rgba(196,168,130,0.15), 0 4px 14px rgba(0,0,0,0.06);
  border-color: rgba(196,168,130,0.3);
  border-top-color: rgba(196,168,130,0.7);
}
```

#### Event Card (EventCard.tsx)
- 인라인 스타일 사용 (CSS 클래스 미정의)
- 배경: 동적 (섹션 배경색에 따라 다름)
- 테두리/그림자: 인라인 스타일

#### Doctor Card (DoctorsSection)
- 인라인 스타일 사용
- 배경: 투명 또는 동적

---

### 3. 섹션 배경색 시스템

| 클래스 | 색상 | 사용 섹션 |
|--------|------|---------|
| `.section-bg-warm` | #F9F6F2 → #F5F1ED (gradient) | Doctors, Reviews |
| `.section-bg-offwhite` | #FAFAFA | Philosophy |
| `.section-bg-gold-soft` | #F5F1ED → #EDE8E2 (gradient) | Results & Statistics |
| `.section-bg-dark-navy` | #1A2744 → #243358 (gradient) | Management Devices |
| `.section-bg-dark-deep` | #1A2744 → #0F1A30 (gradient) | YouTube, Contact |
| `.faq-section-bg` | #F5F0EB | FAQ |

---

## 문제점 & 개선 기회

### 1. 카드 시스템 불일치
- **Treatment Card**: 0.875rem 테두리, 6px 호버 이동
- **Review Card**: 1.125rem 테두리, 5px 호버 이동, 상단 2px 강조 테두리
- **Event Card**: 인라인 스타일 (CSS 클래스 미정의)
- **Doctor Card**: 인라인 스타일 (CSS 클래스 미정의)

**→ 통일 필요**: 모든 카드를 `.card` 기본 클래스 + 변형 클래스로 표준화

### 2. 섹션 헤더 일관성
- 섹션별로 헤더 구조가 다름 (eyebrow, title, subtitle 조합)
- 여백/정렬이 일관되지 않음

**→ 통일 필요**: `.section-header` 컨테이너 클래스 + 표준 구조

### 3. 섹션 패딩/마진
- 섹션별로 다양한 padding 값 사용
- 모바일 반응형 패딩이 일관되지 않음

**→ 통일 필요**: 표준 섹션 패딩 시스템 (desktop: 6rem, tablet: 4rem, mobile: 2rem)

### 4. 색상 토큰 중복
- `var(--brand-bg)`, `var(--brand-bg-alt)`, `#FAF8F5` 등 다양한 표현
- 골드 색상도 `#C4A882`, `var(--brand-gold)`, `var(--dr-gold)` 등으로 분산

**→ 통일 필요**: CSS 변수 중심 사용, 하드코딩 제거

---

## Phase 5 실행 계획

### Step 1: 카드 시스템 통일
1. `.card` 기본 클래스 정의 (공통 스타일)
2. `.card--treatment`, `.card--review`, `.card--event`, `.card--doctor` 변형 클래스
3. EventCard.tsx, DoctorsSection.tsx에 클래스 적용
4. 인라인 스타일 제거

### Step 2: 섹션 헤더 표준화
1. `.section-header` 컨테이너 클래스 정의
2. 모든 섹션에 표준 구조 적용
3. 여백/정렬 통일

### Step 3: 섹션 패딩 시스템
1. `.section-container` 클래스 정의 (표준 패딩)
2. 모든 섹션에 적용

### Step 4: 색상 토큰 정리
1. CSS 변수 중심 사용
2. 하드코딩된 색상 제거

---

## 예상 효과

- ✅ 코드 일관성 향상 (유지보수 용이)
- ✅ 시각적 통일감 (프리미엄 느낌)
- ✅ 번들 크기 감소 (인라인 스타일 제거)
- ✅ 접근성 향상 (일관된 대비/여백)

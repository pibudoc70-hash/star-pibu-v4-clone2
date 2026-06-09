# star-pibu.com 실운영 품질 마무리 작업 (2026-06-02)

## Phase 1: 다국어 SEO 완성
### 1.1 html lang 속성 동적 설정
- [ ] App.tsx에서 현재 URL 기반으로 document.documentElement.lang 설정
  - `/` → lang="ko"
  - `/en` → lang="en"
  - `/ja` → lang="ja"
  - `/zh` → lang="zh"

### 1.2 각 언어 페이지 메타 태그 분리
- [ ] LandingKO.tsx (또는 Home.tsx)
  - title: "부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅"
  - meta description: 한국어 설명
  - og:title, og:description, og:url (한국어 기준)
  - twitter:card, twitter:title, twitter:description (한국어)

- [ ] LandingEN.tsx
  - title: "Star Dermatology Busan | Ultherapy Thermage FLX Lifting"
  - meta description: 영어 설명
  - og:title, og:description, og:url (영어)
  - twitter:card, twitter:title, twitter:description (영어)

- [ ] LandingJA.tsx
  - title: "釜山スター皮膚科 | 超音波リフティング サーマジFLX"
  - meta description: 일본어 설명
  - og:title, og:description, og:url (일본어)
  - twitter:card, twitter:title, twitter:description (일본어)

- [ ] LandingZH.tsx
  - title: "釜山星皮肤科 | 超声刀热玛吉提升"
  - meta description: 중국어 설명
  - og:title, og:description, og:url (중국어)
  - twitter:card, twitter:title, twitter:description (중국어)

### 1.3 hreflang 태그 설정
- [ ] 각 페이지에 hreflang 태그 추가 (Helmet 또는 index.html)
  - `/` → hreflang="ko"
  - `/en` → hreflang="en"
  - `/ja` → hreflang="ja"
  - `/zh` → hreflang="zh"
  - 각 페이지에서 다른 언어 버전 상호 참조

### 1.4 canonical 태그 일치
- [ ] 각 페이지의 canonical이 정확한 URL을 가리키는지 확인
  - `/` → canonical="https://star-pibu.com/"
  - `/en` → canonical="https://star-pibu.com/en"
  - `/ja` → canonical="https://star-pibu.com/ja"
  - `/zh` → canonical="https://star-pibu.com/zh"

### 1.5 view-source 검증
- [ ] 각 언어 페이지 view-source에서 메타 태그 확인
  - 한국어 페이지에 한국어 메타만 보임
  - 영어 페이지에 영어 메타만 보임
  - 일본어 페이지에 일본어 메타만 보임
  - 중국어 페이지에 중국어 메타만 보임

---

## Phase 2: 숫자/통계 일관성 정리
### 2.1 단일 데이터 소스 설정 (i18n.ts)
- [ ] i18n.ts에 stats 배열 통일
  ```
  about.stats = [
    { num: "20년+", label: "피부과전문의 경력" },
    { num: "4,000례+", label: "누적 시술 건수" },
    { num: "50종+", label: "프리미엄 레이저 장비" }
  ]
  ```
- [ ] 모든 언어(ko/en/ja/zh)에서 동일한 숫자 사용

### 2.2 메인 비주얼 (HeroSection) 동기화
- [ ] HeroSection.tsx에서 i18n.ts의 stats 사용
  - 숫자 추출: "20" (정규식으로 숫자만 추출)
  - 단위: 언어별로 "년+", "+yrs", "年+", "年+" 등 적용

### 2.3 소개 섹션 (PhilosophySection) 동기화
- [ ] PhilosophySection.tsx에서 i18n.ts의 stats 사용
  - 3개 통계 카드 표시

### 2.4 통계 섹션 (ResultsStatisticsSection) 동기화
- [ ] ResultsStatisticsSection.tsx 수정
  - 첫 3개: about.stats에서 가져오기
  - 4번째: results.stats에서 가져오기 (1:1 상담)

### 2.5 다국어 페이지 동기화
- [ ] LandingEN/JA/ZH에서 i18n.ts의 stats 사용
  - 각 페이지에서 t.about.stats 참조

### 2.6 검증
- [ ] 모든 페이지에서 "20", "4,000", "50" 동일하게 표시되는지 확인
- [ ] 2006년 개원 표현이 일관성 있는지 확인

---

## Phase 3: 시술 상세페이지 SEO 분리
### 3.1 TreatmentPage.tsx 메타 태그 분리
- [ ] 각 시술별 고유 메타 태그 설정 (Helmet 사용)
  - /treatments/ulthera
    - title: "울쎄라피 프라임 | 부산 스타피부과 - 리프팅 만족도 1위"
    - description: 울쎄라 전용 설명
    - og:title, og:description, og:url, og:image
    - twitter:card, twitter:title, twitter:description
    - canonical: https://star-pibu.com/treatments/ulthera

  - /treatments/thermage
    - title: "써마지 FLX | 부산 스타피부과 - 조시형 원장 공식 자문의"
    - description: 써마지 전용 설명
    - 기타 메타 태그 동일

  - /treatments/under-eye-fat
    - title: "눈밑 지방 재배치 | 부산 스타피부과"
    - description: 눈밑 지방 재배치 전용 설명
    - 기타 메타 태그 동일

### 3.2 JSON-LD 구조화 (MedicalProcedure + FAQPage)
- [ ] 각 시술별 MedicalProcedure 스키마
  ```json
  {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": "울쎄라피 프라임",
    "description": "...",
    "procedureType": "Lifting",
    "bodyLocation": "얼굴, 목, 데콜테",
    "expectedResult": "얼굴 리프팅, 턱선 개선, ...",
    "risksFactor": "일시적 열감, 붓기, ...",
    "faqPage": { ... }
  }
  ```

- [ ] 각 시술별 FAQPage 스키마
  ```json
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "울쎄라피 프라임 시술 시간은?",
        "acceptedAnswer": { "@type": "Answer", "text": "..." }
      }
    ]
  }
  ```

### 3.3 view-source 검증
- [ ] 각 상세페이지 view-source에서 고유 메타 태그 확인
  - 홈페이지 메타가 아닌 시술별 메타만 보임
  - JSON-LD가 MedicalProcedure 스키마로 표시됨

---

## Phase 4: 메인페이지 카피/UX 정리
### 4.1 중복 문장 제거
- [ ] 각 섹션 제목과 본문 중복 확인 및 제거
- [ ] 반복 표현 정리 (예: "시술", "피부", "효과" 등 과도한 반복)

### 4.2 톤앤매너 통일
- [ ] 의료진 소개 섹션: 전문성 + 친근함
- [ ] 브랜드 소개 섹션: 신뢰감 + 고급스러움
- [ ] 통계 섹션: 객관적 + 설득력
- [ ] 후기 섹션: 실제감 + 공감

### 4.3 이벤트 empty state 개선
- [ ] SpecialEventSection의 empty state 문구
  - 현재: "진행중인 이벤트가 없습니다"
  - 개선: "단기 스페셜 이벤트를 준비 중입니다. 다시 방문해 주세요." (다국어 지원)

### 4.4 후기 영역 포맷 통일
- [ ] 이름, 평점, 시술명, 플랫폼 표기 일관성
- [ ] 플랫폼 로고 (Naver, Instagram 등) 표시
- [ ] 후기 → 상담/예약 CTA로 자연스럽게 연결

---

## Phase 5: 상세페이지 전환 최적화
### 5.1 상단 CTA 강화
- [ ] TreatmentPage 상단에 명확한 CTA 버튼
  - 카카오톡 상담
  - 전화 상담
  - 예약 신청

### 5.2 하단 CTA 강화
- [ ] TreatmentPage 하단 (FAQ 이후)에 CTA 버튼
  - 같은 3개 버튼 반복 배치

### 5.3 관련 시술 연결
- [ ] "다른 시술 보기" 섹션
  - 현재 시술 제외한 다른 시술 3개 표시
  - 클릭 시 해당 상세페이지로 이동

### 5.4 FAQ 개선
- [ ] FAQ 항목별 Q&A 카드 형식
- [ ] 접기/펼치기 기능 (선택사항)
- [ ] 시술별 FAQ 5~7개 추가

### 5.5 영상/주의사항/FAQ 순서 정리
- [ ] 현재 순서: 영상 → 효과 → 회복 → 주의사항 → FAQ → CTA
- [ ] 사용자 관점에서 읽기 쉬운 순서 유지

---

## Phase 6: 비급여 안내 페이지 보강
### 6.1 실제 정보 페이지로 확장
- [ ] NonCoveredGuide.tsx 개선
  - Hero 섹션 (제목, 부제)
  - HIRA 심사평가원 외부 링크 카드
  - 비급여 항목 카테고리별 표시 (리프팅, 볼륨, 색소, 여드름, 눈가 등)

### 6.2 비급여 항목 정보
- [ ] 각 항목별 예상 가격 표시
- [ ] 카테고리별 구분 (5~6개 카테고리)

### 6.3 안내 문구 추가
- [ ] 갱신일 표시 (예: "2026년 6월 기준")
- [ ] 비용 변동 가능성 안내
- [ ] 상담 전 참고 문구

### 6.4 CTA 추가
- [ ] 전화 상담 버튼
- [ ] 카카오톡 상담 버튼
- [ ] 상담 유도 박스

### 6.5 푸터 연결
- [ ] Footer에서 /non-covered 페이지 링크 추가
- [ ] 예약/상담 흐름에서 자연스럽게 접근 가능

---

## Phase 7: 최종 검수
### 7.1 다국어 SEO 검증
- [ ] 각 언어 페이지 html lang 속성 확인
  - Chrome DevTools → Elements → <html lang="...">
- [ ] 각 언어 페이지 view-source 메타 태그 확인
  - 한국어 페이지: 한국어 메타만
  - 영어 페이지: 영어 메타만
  - 일본어 페이지: 일본어 메타만
  - 중국어 페이지: 중국어 메타만
- [ ] hreflang 태그 상호 참조 확인
- [ ] canonical 태그 정확성 확인

### 7.2 숫자/통계 일관성 검증
- [ ] 모든 페이지에서 "20년+", "4,000례+", "50종+" 동일 표시
- [ ] 모든 언어에서 동일한 숫자 확인
- [ ] 2006년 개원 표현 일관성 확인

### 7.3 상세페이지 SEO 검증
- [ ] 각 상세페이지 view-source 메타 태그 확인
  - /treatments/ulthera: 울쎄라 전용 메타
  - /treatments/thermage: 써마지 전용 메타
  - /treatments/under-eye-fat: 눈밑 지방 전용 메타
- [ ] JSON-LD 스키마 검증
  - Google Rich Results Test에서 MedicalProcedure 확인
  - FAQPage 스키마 확인

### 7.4 메인페이지 카피 검증
- [ ] 중복 문장 제거 확인
- [ ] 톤앤매너 통일 확인
- [ ] empty state 문구 개선 확인
- [ ] 후기 영역 포맷 통일 확인

### 7.5 전환 최적화 검증
- [ ] 상세페이지 상단/하단 CTA 배치 확인
- [ ] 관련 시술 연결 작동 확인
- [ ] FAQ 표시 확인
- [ ] 영상/주의사항/FAQ 순서 확인

### 7.6 비급여 안내 검증
- [ ] /non-covered 페이지 정보 페이지 역할 확인
- [ ] 비급여 항목 카테고리별 표시 확인
- [ ] HIRA 링크 작동 확인
- [ ] CTA 버튼 배치 확인

### 7.7 기술 검증
- [ ] 빌드 성공 확인
- [ ] 모든 테스트 통과 확인
- [ ] 콘솔 에러 없음 확인
- [ ] 모바일 반응형 확인

---

## 우선순위
1. **Phase 1**: 다국어 SEO (검색 엔진 최적화)
2. **Phase 2**: 숫자 일관성 (신뢰도)
3. **Phase 3**: 상세페이지 SEO (검색 엔진 최적화)
4. **Phase 4**: 메인페이지 카피 (사용자 경험)
5. **Phase 5**: 전환 최적화 (비즈니스 목표)
6. **Phase 6**: 비급여 안내 (정보 제공)
7. **Phase 7**: 최종 검수 (품질 보증)

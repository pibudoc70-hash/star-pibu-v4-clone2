# 개선 4: 홈 유지보수성 책임 분리

## 변경 범위

홈 화면의 공개 콘텐츠·URL·FAQ 문구·JSON-LD schema·외부 예약 CTA를 유지한 채, 아래 책임만 분리했다.

| 책임 | 분리 위치 | 보존한 동작 |
|---|---|---|
| 초기 스크롤 복원 | `client/src/hooks/useHomeInitialScrollRestore.ts` | `__star_force_scroll_top`, `__star_doctor_tab`, `__star_dr_target`, `__star_scroll_to`, URL hash 처리 |
| 지연 섹션 fallback 구성 | `client/src/lib/homeSectionFallbacks.ts` | 모든 섹션의 skeleton 높이·테마·레이아웃·배경 |
| 홈 SEO 메타·JSON-LD 조합 | `client/src/lib/homeSeo.ts` | canonical, 6개 hreflang, LocalBusiness/MedicalBusiness, Breadcrumb, FAQPage, 의료진 ItemList |

## 검증

TypeScript와 ESLint(오류 0), 홈 유지보수성·SEO helper·홈 prerender·메인 redirect 회귀 테스트 15개를 통과했다. 개발 홈에서 헤더·FAQ·공지·Footer·네이버 예약 CTA를 확인했고, `sessionStorage.__star_scroll_to=faq` 설정 뒤 새로고침 시 FAQ 섹션으로 이동하는 실제 스크롤 복원을 확인했다.

## 보호 범위

예약·OTP 구현과 테스트, 외부 예약 URL·CTA, 운영 DB, URL 경로, FAQ 문구, JSON-LD의 데이터 내용은 변경하지 않았다. 홈 FAQ 원문 배열은 의료 검수 이력을 보존하기 위해 페이지 가까이에 남기고, 메타·schema 조합 책임만 helper로 분리했다.

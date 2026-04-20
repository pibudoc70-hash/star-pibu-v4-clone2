# 스타피부과 복제 프로젝트 TODO

## Phase 1: DB 스키마 & 마이그레이션
- [x] drizzle/schema.ts에 events, popupEvents 테이블 추가
- [x] DB 마이그레이션 실행

## Phase 2: 서버 라우터
- [x] server/db.ts에 이벤트, 팝업 쿼리 헬퍼 추가
- [x] server/routers.ts에 events, popup, admin 라우터 추가
- [x] 이미지 업로드 엔드포인트 추가 (S3 스토리지)

## Phase 3: 프론트엔드 핵심 구조
- [x] 다국어 컨텍스트 (LangContext, i18n 데이터 ko/en/ja/zh)
- [x] StarLogo 컴포넌트
- [x] Header 컴포넌트 (네비게이션, 언어전환, 모바일 메뉴)
- [x] Footer 컴포넌트 (병원정보, 언어전환, 링크)
- [x] FloatingCTA 컴포넌트
- [x] App.tsx 라우팅 구성
- [x] index.css 전역 스타일 (다크 클리니컬 테마)

## Phase 4: 홈페이지 섹션
- [x] HeroSection (히어로 배경 이미지, 통계, CTA 버튼)
- [x] EventsSection (이벤트 카드 목록)
- [x] DoctorsSection (조시형·우혜진·이기욱 원장, CDN 이미지 적용)
- [x] TreatmentsSection (시술 카테고리 탭)
- [x] FacilitySection (시설 갤러리)
- [x] ReviewsSection (후기)
- [x] WelcomePopup (팝업 표시)
- [x] Home.tsx 조합

## Phase 5: 서브 페이지
- [x] Events.tsx (이벤트 목록 페이지)
- [x] EventDetail.tsx (이벤트 상세 페이지)
- [x] TreatmentDetail.tsx (시술 상세 페이지)
- [x] Directions.tsx (오시는 길 + Google Maps)
- [x] ForeignGuide.tsx (외국인 안내)
- [x] Privacy.tsx (개인정보처리방침)
- [x] NonCoveredGuide.tsx (비급여 진료안내)

## Phase 6: 관리자 대시보드
- [x] AdminDashboard.tsx (관리자 메인)
- [x] 이벤트 CRUD UI
- [x] 팝업 CRUD UI
- [x] 사용자 권한 관리 UI (role: user ↔ admin 변경)

## Phase 7: 정적 에셋 업로드
- [x] 기존 CDN 이미지 URL 코드에 적용 (의사 사진, 히어로 배경 등)

## Phase 8: 테스트 & 배포
- [x] vitest 테스트 작성 (12개 테스트 통과)
- [x] 체크포인트 저장

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

## Phase 9: 기존 사이트 비교 수정 (Ver 4.0)
- [x] 헤더 메뉴 텍스트 수정 (의료진→피부과전문의, 시술 안내·장비 소개→시술·장비소개, 병원 소개→피부과 소개, 시설 안내→시설안내)
- [x] 홈페이지 섹션 순서 수정 (이벤트 섹션을 히어로 바로 다음으로 이동)
- [x] 샘플 이벤트 데이터 6개 DB 삽입 (세르프/울쎄라피/써마지/눈밑지방/온다/텐써마)
- [x] 최종 체크포인트 저장


## Phase 10: SPECIAL EVENT 섹션 재구성 (기존 사이트 동일 형태)
- [x] 기존 사이트 SPECIAL EVENT 섹션 구조 분석
- [x] events 테이블 스키마 확장 (가격, 할인율, 이미지 URL 등)
- [x] DB 마이그레이션 실행
- [x] 관리자 대시보드 SPECIAL EVENT 관리 UI 추가 (이미지 업로드 기능 완성)
- [x] SpecialEventSection 컴포넌트 구현 (PC: 이미지 카드 포함, 모바일: 이미지 미포함)
- [x] 홈페이지에 SPECIAL EVENT 섹션 추가
- [x] 샘플 데이터 추가 (6개 스페셔 이벤트 데이터 삽입)
- [x] 최종 테스트 및 체크포인트 저장


## Phase 11: 이벤트 & 공지사항 섹션 숨김처리
- [x] EventsSection을 홈페이지에서 제거/숨김처리
- [x] 최종 테스트 및 체크포인트 저장

## Phase 12: 관리자 이미지 업로드 실패 문제 해결
- [x] 관리자 대시보드 SPECIAL EVENT 이미지 업로드 실패 원인 파악 (events.uploadImage 라우터 추가)
- [x] 이미지 업로드 기능 수정 (tRPC 라우터로 변경)
- [x] 최종 테스트 및 체크포인트 저장

## Phase 13: imageUrl null 에러 수정
- [x] AdminDashboard.tsx에서 imageUrl이 null인 경우 제거하도록 수정
- [x] 이벤트 업데이트 성공 테스트 완료
- [x] 12개 vitest 테스트 모두 통과


## Phase 14: SPECIAL EVENT 6개 모두 표시 문제 해결
- [x] DB에서 SPECIAL EVENT 데이터 확인 (isSpecialEvent 값 확인)
- [x] 모든 활성 이벤트를 isSpecialEvent = "1"로 업데이트 (6개 행 업데이트)
- [x] 웹페이지에서 6개 이벤트 모두 표시 확인 (완벽하게 작동)
- [x] 최종 테스트 및 체크포인트 저장

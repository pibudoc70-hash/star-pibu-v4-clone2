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


## Phase 15: SPECIAL EVENT 이미지 비율 수정 (가로 기준)
- [x] SpecialEventSection.tsx에서 이미지 비율을 aspect-ratio 16/9로 수정
- [x] CSS aspect-ratio 조정 (aspect-square 대신 16:9 비율 적용)
- [x] 웹페이지에서 이미지 가로 비율 정상 표시 확인
- [x] 최종 테스트 및 체크포인트 저장

## Phase 16: 관리자 대시보드 SPECIAL EVENT 폼 재구성 (기존 사이트 동일 형태)
- [x] AdminDashboard.tsx에 정상가(normalPrice)와 할인가(discountPrice) 입력 필드 추가
- [x] 이벤트 폼 초기화 시 normalPrice와 discountPrice 필드 포함
- [x] 가격 행 추가/삭제 기능 구현 (단일 또는 여러 가지 가격 옵션 지원)
- [x] DB 스키마에 priceRows 필드 추가 (가격 행 JSON 저장)
- [x] 백엔드 라우터에 priceRows 필드 추가 (생성/수정)
- [x] priceRows JSON 문자열 파싱 수정 (이벤트 수정 시 오류 수정)
- [x] 12개 vitest 테스트 모두 통과
- [x] SpecialEventSection.tsx에 상세페이지 기능 추가 (자세히 보기 버튼 클릭 시 전개/접기)
- [x] 가격 행 데이터 상세 페이지에 표시
- [x] 자세히 보기/접기 버튼 색상 변경 (노란색 -> 회색)
- [x] 12개 vitest 테스트 모두 통과

## Phase 17: 상세페이지 라우팅 및 스타일 개선
- [x] 자세히 보기 버튼 색상을 기존 사이트 상색(#f7f4ee)으로 변경
- [x] 토글 방식 구현 (초기: 첫 가격 행만, 클릭: 모든 가격 행)
- [x] 12개 vitest 테스트 모두 통과

## Phase 18: SEO 최적화
- [x] HTML 언어 속성 변경 (en → ko)
- [x] 페이지 제목 업데이트 (30-60 글자: "스타피부과 | 부산 피부과 전문의 울쎼라피 써마지 시술")
- [x] 메타 설명 추가 (50-160 글자)
- [x] 메타 키워드 추가 (부산피부과, 울쎼라피, 써마지, 리쥬란, 눈밑지방, 피부과전문의, 서면피부과)
- [x] 이미지 alt 태그 확인 (모든 주요 컴포넌트 검증 완료 - 62개 이미지 모두 alt 속성 보유 확인)
- [x] 구조화된 데이터 (Schema.org) 추가 (JSON-LD MedicalBusiness 스키마 추가 완료)

## Phase 19: Ulthera 이벤트 등록 및 검증
- [x] 관리자 대시보드에서 Ulthera Prime 이벤트 등록
- [x] SPECIAL EVENT 체크박스 활성화
- [x] 홈페이지에서 SPECIAL EVENT 섹션에 표시 확인
- [x] 가격 정보 및 수면마취비 정보 정상 표시


## Phase 20: SEO 키워드 수정
- [x] 메타 키워드 "울쎼라피" → "울쎄라" 변경
- [x] 메타 키워드 "부산리프팅" 추가
- [x] JSON-LD knowsAbout 필드 업데이트


## Phase 21: SEO 문제 해결
- [x] 페이지 제목 확장 (11자 → 43자, document.title 사용)
- [x] 누락된 alt 태그 찾기 및 추가 (50개 중 1개 만 남음 - Google Maps 동적 지도, aria-label 추가)
- [x] 나머지 SEO 메타 데이터 일관성 검증 (울쎼라피 → 울쎼라 통일)


## Phase 22: 검색 엔진 등록
- [x] 네이버 웹마스터도구 메타 태그 추가
- [x] robots.txt 및 sitemap.xml 생성 및 배포
- [x] Google Search Console 등록 (단계: robots.txt 및 sitemap.xml 중비 완료, 사용자 직접 등록 필요)
- [x] 네이버 웹마스터도구 사이트맨 제출 (단계: 메타 태그 중비 완료, 사용자 직접 등록 필요)


## Phase 23: 네이버 웹마스터도구 인증
- [x] 네이버 HTML 확인 파일 다운로드 및 업로드
- [x] 메타 태그 검증 방법으로 변경 (HTML 파일 업로드 방식 불가)
- [x] 네이버 웹마스터도구 메타 태그 인증 (사용자 직접 진행)
- [x] 네이버 웹마스터도구 사이트맵 제출 (인증 완료 후)

## Phase 24: Google Search Console 등록
- [x] Google Search Console 메타 태그 추가 (a7QxxU_tlMvQCrJLQ9oCwuoQwmoaWr64mF2t5b40EdU)
- [x] Google Search Console 메타 태그 인증 (사용자 직접 진행 완료)
- [x] Google Search Console 사이트맵 제출 (인증 완료 후 완료)


## Phase 25: 최종 단계 - 사이트맵 도메인 오류 수정
- [x] sitemap.xml 도메인 star-pibu.com으로 수정
- [x] 배포 완료
- [x] 네이버 웹마스터도구 인증 및 사이트맵 제출 완료
- [x] Google Search Console 인증 및 사이트맵 제출 (사용자 직접 진행 완료)


## Phase 26: 파비콘 추가
- [x] 별 모양 로고를 favicon.ico로 변환
- [x] favicon.ico를 client/public 디렉토리에 저장
- [x] index.html에 favicon 링크 추가


## Phase 27: 의사 정보 수정 (기존 사이트와 일치)
- [x] 조시형 원장: 14개 → 8개 항목 수정
- [x] 우혜진 원장: 10개 → 6개 항목 수정
- [x] 이기욱 원장: 9개 → 6개 항목 수정

## Phase 28: 의사 정보 최종 수정 (기존 사이트와 완벽 일치)
- [x] 조시형 원장: 정확한 8개 항목으로 수정 완료
- [x] 우혜진 원장: 정확한 6개 항목으로 수정 완료
- [x] 이기욱 원장: 정확한 6개 항목으로 수정 완료

## Phase 29: 이벤트 레이아웃 개선 (기존 사이트와 일치)
- [x] 이벤트 카드 구조 변경: 초기에는 핵심 정보만 표시
- [x] 자세히 보기 클릭 시 카드 내에서 확장되는 형태로 변경
- [x] 할인가 색상을 주황색(#FF9500 또는 유사)으로 변경
- [x] 정상가와 할인가 레이아웃 정렬
- [x] 개발 서버에서 테스트 및 검증
- [x] 최종 배포 및 체크포인트 저장

## Phase 30: FAQ 스키마 구성 (AEO 최적화)
- [x] react-helmet-async 패키지 설치
- [x] main.tsx에서 HelmetProvider 설정
- [x] FAQSection.tsx 수정 - FAQ 스키마 로직 추가
- [x] 개발 서버에서 테스트 및 검증
- [x] 최종 배포 및 체크포인트 저장

## Phase 31: 카카오톡 상담 링크 업데이트
- [x] FAQSection.tsx의 카카오늤 링크 변경 (https://pf.kakao.com/_HNyGC)
- [x] 개발 서버에서 링크 동작 확인
- [x] 최종 배포 및 체크포인트 저장

## Phase 32: 이벤트 카드 높이 독립성 확보
- [x] 기존 사이트 이벤트 레이아웃 분석 (높이 관리 방식)
- [x] SpecialEventSection.tsx 수정 - 각 카드 독립적 높이 유지
- [x] 개발 서버에서 테스트 및 검증
- [x] 최종 배포 및 체크포인트 저장

## Phase 33: 이벤트 제목 색상 및 수면마취비 정보 제거
- [x] 이벤트 제목 색상을 할인가와 동일한 골드색(#d4af6c)으로 변경
- [x] 확장 상태에서 수면마취비 정보 탭 제거
- [x] 개발 서버에서 테스트 및 검증
- [x] 최종 배포 및 체크포인트 저장

## Phase 34: 이벤트 상세 페이지 개선 (2026-04-23)
- [x] 이벤트 상세 페이지 레이아웃 개선: 정상가/할인가 옆에 금액 표시
- [x] 상세 페이지 높이 축소하여 더 컴팩트한 레이아웃 구현
- [x] 상세 페이지 하단(접기 버튼 바로 위)에 카카오 상담 + 전화 상담 버튼 추가

## Phase 35: SEO 제목 변경 (2026-04-29)
- [x] SEO 제목 변경: "부산 서면 스타피부과 | 피부과 전문의 울쎼라 써마지 리프팅 시술"

## Phase 36: 상단 메뉴 버튼 액션 수정 (2026-04-29)
- [x] 상단 메뉴의 "이벤트" 버튼 액션 수정 - SpecialEventSection에 id="events" 추가
- [x] 상단 메뉴의 "피부과 소개" 버튼 액션 수정 - FacilitySection에 id="about" 추가

## Phase 37: Treatment Section 2 DB 연동 (2026-05-02)
- [x] TreatmentsEquipmentSection.tsx의 JSX 에러 수정 (1854 라인 중복 닫기 태그 제거)
- [x] TreatmentsEquipmentSectionV2.tsx 컴포넌트 생성 (DB 연동 버전)
- [x] Home.tsx에 TreatmentsEquipmentSectionV2 import 및 렌더링 추가
- [x] 개발 서버 정상 작동 확인
- [x] 관리자 대시보드에서 시술 데이터 추가 테스트 (피코레이저 토닝 추가)
- [x] Treatment Section 2 페이지에서 데이터 표시 확인 (Best 시술 카운트 5→6 증가)
- [x] 최종 테스트 및 체크포인트 저장 (버전: 6d5af679)

## Phase 38: 예약 시스템 구현 (2026-05-02) - 완료
- [x] DB 스키마 확인: reservations 테이블 이미 존재 (예약 정보 저장)
- [x] 서버 라우터 확인: 예약 CRUD 프로시저 이미 구현
- [x] 관리자 대시보드: 예약 관리 탭 추가 (AdminDashboard.tsx)
- [x] 프론트엔드: ReservationForm.tsx 컴포넌트 생성 (회원/비회원 예약 + OTP 인증)
- [x] 예약 센 추가: ReservationSection.tsx 생성 (홍페이지에 내재)
- [x] Home.tsx에 ReservationSection import 및 렌더링 추가
- [x] DB 헬퍼 함수 수정: 반환값 추가 (createReservation, updateReservationStatus, cancelReservation)
- [x] Vitest 예약 테스트 작성 및 실행 (9개 테스트 모두 통과)
- [x] 이메일/SMS 알림 기능 추가 (선택사항) - Phase 40, 41에서 완료
- [x] 최종 체크포인트 저장

## Phase 39: 예약 시스템 최종 단계 (2026-05-02) - 완료
- [x] 예약 관리 대시보드: 예약 목록, 상태 변경 기능 이미 구현
- [x] 예약 상세 조회 페이지: MyReservations.tsx 생성 (/my-reservations)
- [x] 예약 상태 나타내기: 대기 중, 확정, 완료, 취소 상태 표시
- [x] 예약 취소 기능: 대기 중 예약만 취소 가능
- [x] App.tsx에 MyReservations 라우트 추가
- [x] 최종 테스트 및 체크포인트 저장

## Bug Fix: AdminDashboard .map() undefined 에러 (2026-05-02)
- [x] popupList.map() 에러 수정: (popupList || []).map()
- [x] eventsList.map() 에러 수정: (eventsList || []).map()
- [x] popupForm.priceItems.map() 에러 수정: (popupForm?.priceItems || []).map()
- [x] reservationsData.items.map() 에러 수정: (reservationsData?.items || []).map()
- [x] 모든 테스트 통과 (26개 테스트)
- [x] 개발 서버 정상 작동
- [x] 최종 체크포인트 저장 (948eb6bc)

## Phase 40: 이메일 알림 기능 구현 (2026-05-02) - 완료
- [x] 이메일 발송 서비스 구현: server/email.ts 생성
- [x] 예약 생성 시 이메일 발송: 고객 및 관리자 알림
- [x] 예약 상태 변경 시 이메일 발송: 상태별 메시지
- [x] HTML 이메일 템플릿 작성: 3가지 날린 디자인 이메일
- [x] server/routers.ts 수정: 예약 생성/상태 변경 시 이메일 발송 기능 추가
- [x] 모든 테스트 통과 (26개 테스트)
- [x] 최종 체크포인트 저장

## Phase 41: Manus SMS API를 사용한 OTP 인증 구현 (2026-05-02)
- [x] SMS 발송 서비스 구현: server/sms.ts 생성 (Manus 내장 API)
- [x] OTP 발송 프로시저 수정: SMS 연동 (sendOtp)
- [x] SMS 템플릿 작성: OTP, 예약 확인/확정/취소 메시지
- [x] 모든 테스트 통과 (26개 테스트)
- [x] 개발 서버 정상 작동
- [x] 최종 체크포인트 저장

## Phase 42: 휴대폰 번호 형식 검증 및 타입 에러 수정 (2026-05-02)
- [x] ReservationForm.tsx에 휴대폰 번호 형식 검증 추가 (010-1234-5678 또는 01012345678)
- [x] server/email.ts에서 불필요한 import 제거 (invokeLLM)
- [x] MyReservations.tsx에서 cancel 프로시저 호출 수정 (reservationId → id)
- [x] AdminDashboard.tsx에서 reservationsData.items 접근 수정
- [x] server/db.ts의 getAllReservations 함수 반환값 수정 (reservations → items)
- [x] TreatmentsEquipmentSectionV2.tsx의 Treatment 인터페이스 타입 수정 (null 가능한 필드)
- [x] server/routers.ts에 getReservationStatusEmail import 추가
- [x] server/reservation.test.ts 테스트 코드 업데이트 (getAllReservations 함수 시그니처 변경에 맞게 수정)
- [x] 모든 TypeScript 컴파일 에러 해결
- [x] 모든 테스트 통과 (26개 테스트)
- [x] 개발 서버 정상 작동

## Phase 43: 예약 상태 변경 이메일 발송 로직 수정 (2026-05-02)
- [x] server/routers.ts의 updateReservationStatus에서 ctx 참조 제거
- [x] 비회원 예약은 전화번호로만 저장되어 있어 이메일 발송 불가 (콘솔 로그로 표시)
- [x] 회원 예약은 사용자 정보가 데이터베이스에 저장되지 않아 이메일 발송 스킵 (TODO 주석 추가)
- [x] 모든 TypeScript 컴파일 에러 해결
- [x] 모든 테스트 통과 (26개 테스트)
- [x] 개발 서버 정상 작동

## Phase 44: 예약 시간 제한 기능 구현 (2026-05-02)
- [x] 진료시간 기반 예약 날짜 제한 (당일 예약 불가, 일요일/공휴일 예약 불가)
- [x] 진료시간 기반 예약 시간 제한 (진료 끝나기 1시간 전까지만 예약)
- [x] 평일 점심시간(13:00 ~ 14:00) 예약 불가 설정
- [x] 회원 예약 폼에 날짜/시간 제한 적용
- [x] 비회원 예약 폼에 날짜/시간 제한 적용
- [x] 날짜 입력 필드에 min 속성 추가 (당일 예약 방지)
- [x] 시간 선택 드롭다운 동적 생성 (선택된 날짜에 따라 가능한 시간만 표시)
- [x] TypeScript 타입 에러 수정
- [x] 모든 테스트 통과 (26개 테스트)
- [x] 개발 서버 정상 작동

## Phase 45: 관리자 예약 불가능 시간 설정 기능 (2026-05-02)
- [x] 데이터베이스 스키마 추가 (unavailableSlots 테이블)
- [x] 서버 API 구현 (CRUD 프로시저)
- [x] 관리자 대시보드 UI 추가
- [x] 예약 폼에 불가능 시간대 반영
- [x] 테스트 작성 및 검증 (26개 테스트 모두 통과)

## Phase 46: 예약 불가능 기능 수정 (2026-05-02)
- [x] unavailableSlots 스키마 수정 (시간 필드 제거, 날짜만 유지)
- [x] 서버 API 수정 (CRUD 프로시저 업데이트)
- [x] 관리자 대시보드 UI 수정 (날짜만 입력)
- [x] 예약 폼에 불가능 날짜 반영
- [x] 테스트 및 검증 (26개 테스트 모두 통과)


## Phase 47: 예약 불가능 날짜 기능 버그 수정 (2026-05-02)
- [x] 예약 폼에서 불가능 날짜 필터링 오류 수정 (5-25 날짜 예약 불가 확인)
- [x] 관리자 대시보드 텍스트 변경 (예약 불가능 시간 → 예약 불가능 날짜)
- [x] 추가 후 바로 목록에 표시되도록 UI 개선 (invalidate 추가)

## Phase 48: 시술·장비소개 2 DB 연동 완성 (2026-05-02)
- [x] TreatmentsEquipmentSectionV2.tsx를 기존 레이아웃과 동일하게 재구현
- [x] 카테고리 탭 + 시술 카드 그리드 레이아웃 (기존과 동일)
- [x] DB 데이터 활용 (관리자 등록 시술)
- [x] 상세 모달 기능 (YouTube, 효과, 주의사항 등)
- [x] 정렬 기능 (인기도, 이름, 시간)
- [x] 반응형 디자인 (모바일/태블릿/데스크톱)
- [x] 관리자에서 새 시술 추가 테스트 (테스트 시술 추가 성공)
- [x] 홈페이지에서 실시간 반영 확인 (테스트 시술 표시 확인)
- [x] 모든 테스트 통과 (26개 테스트)
- [x] 최종 체크포인트 저장

## Phase 49: 시술·장비소개 2 관리 탭 추가 (2026-05-02)
- [x] DB 스키마에 section 필드 추가 (treatments 테이블)
- [x] DB 마이그레이션 실행
- [x] 서버 라우터 수정 - section 필터링 추가
- [x] 관리자 대시보드에 "시술·장비소개 2 관리" 탭 추가
- [x] 새 시술 추가 시 section 값 자동 설정
- [x] 기존 시술 데이터 section 값 업데이트
- [x] 테스트 및 검증 (26개 테스트 통과 확인)
- [x] 최종 체크포인트 저장
- [x] 홈페이지에서 실시간 반영 확인 (V2 신규 시술 표시 확인)

## Phase 50: V2 섹션 시술 표시 문제 해결 (2026-05-03)
- [x] 기존 V2 시술들의 section 값을 'v2'로 업데이트 필요
- [x] 홈페이지 V2 섹션에서 시술 표시 확인
- [x] 새로 추가한 시술이 section='v2'로 저장되는지 검증
- [x] 최종 테스트 및 체크포인트 저장
- [x] 관리자 폼에 "섹션" 선택 필드 추가
- [x] Best 시술 탭 필터링 로직 수정 (categoryId → isBest)
- [x] Best 시술 탭에 2개의 시술 표시 확인 완료


## Phase 51: YouTube 영상 URL 임베드 문제 해결 (2026-05-03)
- [x] YouTube URL 자동 변환 함수 구현 (convertYoutubeUrl)
- [x] 표준 YouTube URL → embed 형식 자동 변환
- [x] 짧은 URL (youtu.be) → embed 형식 자동 변환
- [x] 이미 embed 형식인 URL은 그대로 유지
- [x] TreatmentsEquipmentSectionV2.tsx에 convertYoutubeUrl 함수 적용
- [x] 관리자 대시보드에서 표준 YouTube URL 입력 후 자동 변환 테스트 완료
- [x] 홈페이지 V2 섹션에서 YouTube 임베드 영상 정상 재생 확인
- [x] 최종 테스트 및 체크포인트 준비

## Phase 52: 관리자 대시보드 이미지 미리보기 사이즈 개선 (2026-05-03)
- [x] TreatmentsManager.tsx 이미지 미리보기 스타일 수정
- [x] 이전: w-16 h-16 object-cover (고정 크기, 가로 짧김)
- [x] 변경: max-w-xs h-auto max-h-32 object-contain (최대 너비 320px, 높이 자동, 가로 짧김 없음)
- [x] 이미지 테두리 추가 (border border-gray-200)
- [x] 개발 서버 재시작 및 변경사항 적용 확인
- [x] 홈페이지 V2 섹션에서 이미지 가로 전체 표시 확인
- [x] 최종 테스트 및 체크포인트 준비

## Phase 53: V2 섹션 카드 이미지 높이 개선 (2026-05-03)
- [x] TreatmentsEquipmentSectionV2.tsx 카드 이미지 높이 조정
- [x] 이전: height: 280px (세로 짤림)
- [x] 변경: height: 380px (가로 넓고 세로 충분)
- [x] 개발 서버 재시작 및 변경사항 적용 확인
- [x] 홈페이지 V2 섹션에서 카드 이미지 크기 확인
- [x] 울써마지 리프팅 + 리쥬란 카드 이미지 정상 표시 확인
- [x] 눈밑지방재배치 카드 이미지 정상 표시 확인
- [x] 최종 테스트 및 체크포인트 준비

## Phase 54: V2 섹션 카드 이미지 높이 최종 조정 (2026-05-03)
- [x] 카드 이미지 높이 380px → 320px → 306px로 조정
- [x] 이미지와 텍스트의 비율 균형 확인
- [x] 홈페이지에서 V2 섹션 카드 레이아웃 검증
- [x] 최종 높이 306px로 확정 (가로 넓고 세로도 적절한 높이)

## Phase 55: V2 섹션 카드 이미지 높이 최종 조정 - 167px (2026-05-03)
- [x] 카드 이미지 높이 306px → 320px → 167px로 조정
- [x] 이미지 세로 짤림 문제 해결
- [x] 홈페이지에서 V2 섹션 카드 레이아웃 검증
- [x] 최종 높이 167px로 확정 (가로 넓고 이미지 완전 표시)

## Phase 56: V2 섹션 카드 이미지 aspect ratio 적용 (2026-05-03)
- [x] 카드 이미지 컨테이너에 aspect ratio 600:306 적용
- [x] 이미지 원본 비율 유지하면서 가로 세로 모두 표시
- [x] 홈페이지에서 V2 섹션 카드 이미지 완전 표시 확인
- [x] 이미지 세로 짤림 문제 완벽히 해결

## Phase 57: PC 페이지 V2 섹션 이미지 위아래 짤림 문제 해결 (2026-05-03)
- [x] 이미지 컨테이너 object-cover → object-contain으로 변경
- [x] 고정 aspectRatio 제거 (600/306 제거)
- [x] 고정 높이 280px 설정으로 모든 기기에서 일관된 표시
- [x] PC 3열 그리드에서 이미지 위아래 짤림 완벽히 해결
- [x] 모바일과 PC 모두에서 이미지 완전 표시 확인

## Phase 58: V2 섹션 카드 높이 V1과 동일하게 조정 (2026-05-03)
- [x] V2 카드 이미지 높이 280px → 192px로 조정 (V1과 동일)
- [x] V2 카드 컨테이너에 minHeight: 360px 추가 (텍스트 영역 충분히 확보)
- [x] V1과 V2 카드 크기 일관성 확인
- [x] 홈페이지에서 V2 섹션 카드 레이아웃 검증
- [x] 이미지 위아래 짤림 없이 완전 표시 확인

## Phase 59: V2 섹션 카드 높이 365px 조정 (2026-05-03)
- [x] V2 카드 전체 높이 360px → 365px로 조정
- [x] 개발 서버 재시작
- [x] 카드 레이아웃 확인 (텍스트 영역 약 173px)

## Phase 60: V2 카드 높이 및 테스트 이벤트 중복 등록 문제 해결 (2026-05-03)
- [x] V2 카드 컨테이너에 flex flex-col 클래스 추가
- [x] V2 텍스트 영역에 flex flex-col flex-1 추가 (카드 높이 365px 유지)
- [x] events.special.test.ts에 cleanupTestEvents() 함수 추가
- [x] afterEach() 훅으로 각 테스트 후 테스트 이벤트 자동 삭제
- [x] 모든 vitest 테스트 통과 (26개)
- [x] 테스트 이벤트 중복 생성 문제 해결

## Phase 61: V2 섹션 카드 높이 380px 조정 (2026-05-03)
- [x] V2 카드 전체 높이 365px → 380px로 조정
- [x] 개발 서버 재시작
- [x] 카드 레이아웃 확인 (텍스트 영역 약 188px)

## Phase 62: V2 섹션 카드 이미지 높이 200px 조정 (2026-05-03)
- [x] V2 카드 이미지 높이 192px → 200px로 조정
- [x] 개발 서버 재시작
- [x] 카드 이미지 영역 8px 증가

## Phase 66: 시설안내 섹션 최종 검토 및 배포 준비 (2026-05-04)
- [x] FacilitySection.tsx 컴포넌트 코드 검토 완료
- [x] 참조 사이트와 개발 사이트의 슬라이드 콘텐츠 비교 및 일치 확인
- [x] 슬라이드 제목/설명 텍스트 정확성 검증 (6개 슬라이드 확인)
- [x] 디자인 스타일 (색상, 테두리, 배경) 참조 사이트와 일치 확인
- [x] 반응형 디자인 및 모바일 호환성 검증
- [x] vitest 테스트 작성 및 실행 (FacilitySection.test.tsx 작성 완료)
- [x] 최종 체크포인트 저장 (버전: 32d5576e)
- [x] 배포 준비 완료 (모든 언어 i18n 데이터 6개 슬라이드로 통일)

## Phase 67: 시설안내 섹션 반응형 레이아웃 수정 (2026-05-04)
- [x] FacilitySection.tsx 반응형 레이아웃 분석 (PC: 3개×2행 그리드, 모바일: 슬라이드 캠래셀)
- [x] PC 버전 3개×2행 그리드 레이아웃 구현 (md 이상 해상도)
- [x] 모바일 버전 슬라이드 캠래셀 레이아웃 구현 (md 미만 해상도)
- [x] 반응형 디자인 테스트 (데스크탑, 태블릿, 모바일 뜀포트) - PC 3×2 그리드 검증 완료
- [x] vitest 테스트 업데이트 (반응형 레이아웃 검증) - 기존 테스트 검증 완료
- [x] 최종 체크포인트 저장 및 배포 (버전: ebee5a8a)

## Phase 60: 관리장비 섹션 캐러셀 최적화 (2026-05-04)
- [x] ManagementDevicesSection.tsx 클릭 기능 제거 (순수 캐러셀로 변경)
- [x] 모든 16개 장비 정보 카드 형태로 표시 (이미지 + 아이콘 + 장비명 + 영문명 + 설명)
- [x] 1줄 가로 캐러셀 형태로 변경 (4개 카드 한 번에 보임)
- [x] 모바일 반응형 최적화 (모바일 50%, 태블릿 33.333%, 데스크톱 25%)
- [x] 스크롤 양 반응형 조정 (모바일 200px, 데스크톱 320px)
- [x] 버튼/아이콘 크기 반응형 조정
- [x] 접근성 개선 (aria-label 추가)
- [x] 개발 서버 정상 작동 확인
- [x] 최종 체크포인트 저장

## Phase 61: 관리장비 카드 스타일 복원 (2026-05-04)
- [x] 기존 카드 스타일 분석 (원형 아이콘 + 금선 + 장비명 + 영문명 + 설명)
- [x] ManagementDevicesSection.tsx 카드 크기 복원 (calc(25% - 12px) 유지)
- [x] 카드 이미지 크기 복원 (원형 w-16 h-16 유지)
- [x] 페이지에 4개 카드만 보이도록 설정
- [x] 캐러셀 스크롤 기능 유지 (좌우 화살표)
- [x] 모바일 반응형 조정 (2개 카드 보이도록)
- [x] 최종 테스트 및 체크포인트 저장

## Phase 62: 관리장비 카드 너비 최종 최적화 (2026-05-04)
- [x] 카드 너비 inline style 제거 (래퍼의 w-1/4로만 제어)
- [x] 카드 높이 통일 (h-full 추가)
- [x] 설명 텍스트 3줄 제한 (line-clamp-3 추가)
- [x] 브라우저 검증 (관리장비 섹션 카드 4개 균등 배치)
- [x] 최종 체크포인트 저장

## Phase 63: 관리장비 카드 레이아웃 변경 (2026-05-04)
- [x] 카드 내부 레이아웃 변경 (세로 → 가로)
- [x] 이미지 왼쪽, 타이틀 오른쪽 배치
- [x] 설명 텍스트 이미지 아래 배치 및 왼쪽 정렬
- [x] 브라우저 검증 (레이아웃 변경 확인)
- [x] 최종 체크포인트 저장

## Phase 64: 관리장비 이미지 CDN 경로 복구 (2026-05-04)
- [x] S3 CDN 경로 확인 (d2xsxph8kpxj0f.cloudfront.net)
- [x] ManagementDevicesSection.tsx CDN 경로 업데이트
- [x] 이미지 파일명 수정 (_new 형식)
- [x] 브라우저 검증 (이미지 로딩 확인)
- [x] 최종 체크포인트 저장

## Phase 65: 관리장비 이미지 URL 완전 경로 적용 (2026-05-04)
- [x] 16개 장비 이미지 완전 URL 수집
- [x] ManagementDevicesSection.tsx에 모든 이미지 URL 적용
- [x] 모든 16개 장비 이미지 정상 로드 확인
- [x] 최종 체크포인트 저장

## Phase 66: 시술·장비소개2 페이지 분리 (2026-05-04)
- [x] 홈페이지에서 TreatmentsEquipmentSectionV2 숨기기
- [x] 헤더 메뉴에 "장비2" 추가 (오시는 길 옆)
- [x] Equipment2.tsx 페이지 생성 (/equipment2)
- [x] App.tsx에 라우트 추가
- [x] 네비게이션 링크 연결
- [x] 최종 테스트 및 체크포인트 저장

## Phase 67: 헤더 메뉴 "장비2" 위치 및 색상 조정 (2026-05-04)
- [x] 헤더 메뉴에서 "장비2"를 오시는 길 다음으로 이동
- [x] "장비2" 테스트 색상을 희색으로 변경 (일반인들이 클릭하지 않도록)
- [x] 최종 테스트 및 체크포인트 저장

## Phase 68: 헤더 메뉴 "장비2" 관리자 권한 제어 (2026-05-04)
- [x] 장비2 메뉴를 관리자 로그인 시에만 표시하도록 변경
- [x] 장비2 메뉴 테스트 색상을 원래대로 복원 (#4f4f4f)
- [x] 최종 테스트 및 체크포인트 저장

## Phase 69: SEO 제목 오타 수정 (2026-05-04)
- [x] 페이지 제목에서 "울쎼라"를 "울쎄라"로 수정
- [x] 최종 테스트 및 체크포인트 저장

## Phase 70: 관리장비 센션 자동 캠러셀 기능 추가 (2026-05-04)
- [x] ManagementDevicesSection.tsx에서 3초마다 자동으로 기능 추가
- [x] useEffect로 자동 스크롤 로직 구옄
- [x] 최종 테스트 및 체크포인트 저장

## Phase 71: 스크롤 막대 크기 조정 (2026-05-05)
- [x] 하단 스크롤 막대의 가로 크기를 반으로 줄이기
- [x] 최종 테스트 및 체크포인트 저장

## Phase 72: 캠러셀 인디케이터 추가 (2026-05-05)
- [x] ManagementDevicesSection.tsx에 현재 기능 추적 로직 추가
- [x] 캠러셀 하단에 인디케이터 (도트/번호) 추가
- [x] 인디케이터 클릭으로 해당 기능 추가
- [x] 최종 테스트 및 체크포인트 저장

## Phase 73: 캠러셀 스크롤 막대 숨김 처리 (2026-05-05)
- [x] ManagementDevicesSection.tsx의 스크롤 컨테이너 스크롤 막대 숨김
- [x] CSS에서 scrollbar 숨김 처리
- [x] 최종 테스트 및 체크포인트 저장

## Phase 74: 모바일 캠러셀 중앙 정렬 수정 (2026-05-05)
- [x] ManagementDevicesSection.tsx에서 모바일 스냉 정렬 설정 추가
- [x] scroll-snap-align: center 적용
- [x] 모바일 뜀에서 기능 중앙 정렬 확인
- [x] 최종 테스트 및 체크포인트 저장

## Phase 75: 모바일 화살표 버튼 숨김 처리 (2026-05-05)
- [x] ManagementDevicesSection.tsx에서 이전/다음 버튼 모바일 숨김 설정
- [x] 데스크탑에서는 화살표 표시, 모바일에서는 숨김
- [x] 최종 테스트 및 체크포인트 저장

## Phase 76: "스타피부과를 선택하는 이유" 센션 추가 (2026-05-05)
- [x] 의료진 사진 3장 S3 업로드
- [x] ResultsStatisticsSection.tsx 컴포넌트 생성
- [x] Home.tsx에 시설안내 위에 센션 추가
- [x] 의료진 정보 및 통계 데이터 입력
- [x] 최종 테스트 및 체크포인트 저장

## Phase 77: 통계 센션 아이콘 변경 (2026-05-05)
- [x] 원본 사이트의 아이콘 스타일 분석 및 적용
- [x] 20년 경력 아이콘 변경 (병원/의료 관련 아이콘)
- [x] 95% 만족도 아이콘 변경 (별/평점 관련 아이콘)
- [x] 4,000례 아이콘 변경 (그래프/통계 관련 아이콘)
- [x] 1:1 진료 아이콘 변경 (사람/상담 관련 아이콘)
- [x] 최종 테스트 및 체크포인트 저장

## Phase 78: 통계 섹션 아이콘 색상 변경 (2026-05-05)
- [x] ResultsStatisticsSection.tsx의 SVG 아이콘 색상을 #D1AB67로 변경
- [x] 최종 테스트 및 체크포인트 저장

## Phase 79: 의료진 카드 제목 색상 변경 (2026-05-05)
- [x] ResultsStatisticsSection.tsx의 의료진 카드 제목(doctor.title) 색상을 #D1AB67로 변경
- [x] 최종 테스트 및 체크포인트 저장

## Phase 80: RESULTS & STATISTICS 테스트 색상 변경 (2026-05-05)
- [x] ResultsStatisticsSection.tsx의 "RESULTS & STATISTICS" 테스트 색상을 #D1AB67로 변경
- [x] 최종 테스트 및 체크포인트 저장

## Phase 81: 전체 센션 가로 너비 제약 추가 (2026-05-05)
- [x] index.css의 .container 클래스에 max-width 설정
- [x] 모든 센션에 양쏽 여백 추가 (기존 사이트와 동일)
- [x] 반응형 디자인 유지 (모바일에서는 전체 너비 사용)
- [x] 최종 테스트 및 체크포인트 저장

## Phase 82: 의료진 카드 이름 삭제 (2026-05-05)
- [x] ResultsStatisticsSection.tsx에서 의료진 카드의 이름(doctor.name) 렌더링 부분 삭제
- [x] 최종 테스트 및 체크포인트 저장

## Phase 83: 의료진 카드 직책 텍스트 크기 증가 (2026-05-05)
- [x] ResultsStatisticsSection.tsx에서 의료진 카드의 직책(title) 텍스트 크기를 14px(text-sm)에서 24px로 증가
- [x] 최종 테스트 및 체크포인트 저장

## Phase 84: 통계 섹션 unit 글자 크기 70%로 축소 (2026-05-05)
- [x] ResultsStatisticsSection.tsx에서 통계 데이터 구조 수정 (number와 unit 분리)
- [x] 렌더링 부분에서 unit을 70% 크기로 표시하여 숫자 강조
- [x] 최종 테스트 및 체크포인트 저장

## Phase 85: 통계 섹션 카드 레이아웃 변경 (2026-05-05)
- [x] ResultsStatisticsSection.tsx에서 통계 섹션을 시설안내 카드 스타일로 변경
- [x] 배경색 카드(#F5F1ED) + 아이콘 유지 + 2x2 그리드(모바일), 4열 그리드(데스크톱)
- [x] 아이콘 배경을 흰색으로 변경하여 카드와 구분
- [x] 최종 테스트 및 체크포인트 저장

## Phase 86: 시설안내 highlights 카드 섹션 삭제 (2026-05-05)
- [x] FacilitySection.tsx에서 "50+", "3인", "2·4층", "전체" 카드 섹션 삭제
- [x] 최종 테스트 및 체크포인트 저장

## Phase 87: 스킨케어 카드 높이 조정 (2026-05-05)
- [x] ManagementDevicesSection.tsx의 DeviceCard 높이를 PC에서 더 크게 조정
- [x] py-3에서 py-4 md:py-5로 변경 (상단 패딩)
- [x] pb-3에서 pb-4 md:pb-5로 변경 (하단 패딩)
- [x] 최종 테스트 및 체크포인트 저장
## Phase 88 초기: YouTube 채널 센션 기초 구조 (2026-05-05)
- [x] YouTubeSection.tsx 컴포넌트 기초 구조 생성
- [x] 상단 4개 영상 + 하단 6개 쇼츠 레이아웃
- [x] 모달 재생 기능 구현

## Phase 88 완료: YouTube 채널 섹션 DB 연동 (2026-05-05)
- [x] youtubeVideos DB 테이블 생성
- [x] YouTubeSection.tsx 컴포넌트 DB 데이터로 연동
- [x] server/db.ts에 YouTube CRUD 함수 추가
- [x] server/routers.ts에 YouTube API 라우터 추가
- [x] Home.tsx에 YouTubeSection 임포트 및 추가
- [x] DB에 샘플 데이터 (4개 영상 + 6개 쇼츠) 등록
- [x] 관리자 대시보드 YouTube 관리 UI 추가 (AdminYouTube.tsx)
- [x] App.tsx에 /admin/youtube 라우트 추가
- [x] 최종 테스트 및 체크포인트 저장

## Phase 90: 모바일 예약신청 페이지 인증 단계 제거 (2026-05-06)
- [x] 모바일에서 휴대폰 인증 단계 건너뛰기
- [x] 바로 예약 페이지 표시 (PC와 동일)
- [x] 최종 테스트 및 체크포인트 저장

## Phase 91: 의료진 소개 텍스트 모바일 줄 간격 개선 (2026-05-06)
- [x] ResultsStatisticsSection.tsx에서 의료진 설명 텍스트에 모바일 반응형 줄 간격 적용
- [x] leading-relaxed (모바일) → leading-loose (PC) 변경
- [x] 최종 테스트 및 체크포인트 저장

## Phase 92: 조시형 원장 소개 텍스트 3단락 분리 (2026-05-06)
- [x] 조시형 원장의 description을 배열로 변경 (3개 문단)
- [x] 의료진 카드 렌더링에서 배열 처리 로직 추가
- [x] 모바일에서도 각 문단이 줄바꿈되어 표시
- [x] 최종 테스트 및 체크포인트 저장

## Phase 93: 모바일 히어로 섹션 버튼 간격 개선 (2026-05-06)
- [x] HeroSection.tsx의 CTA 버튼 컨테이너 gap 값 수정
- [x] 모바일에서 전화 버튼과 카카오/네이버 버튼 사이 간격 증가 (clamp(0.4rem, 1.5vw, 0.6rem) → clamp(1rem, 1.5vw, 0.6rem))
- [x] 최종 테스트 및 체크포인트 준비

## Phase 94: TypeScript 에러 수정 (2026-05-06)
- [x] db.ts의 getTreatmentsByCategory 함수에서 section 타입 캐스팅 추가
- [x] db.ts의 getTreatmentsByBest 함수에서 section 타입 캐스팅 추가
- [x] TreatmentsEquipmentSectionV2.tsx의 Treatment 인터페이스에 section, sortOrder, modalImage 필드 추가
- [x] AdminYouTube.tsx의 useRouter 에러 수정 (wouter의 useLocation 사용)
- [x] 남은 TypeScript 에러: FacilitySection.test.tsx의 vitest 타입 정의 문제 (toBeInTheDocument 매처 타입 누락)

## Phase 95: 모바일 배경 이미지 정렬 수정 (2026-05-06)
- [x] HeroSection.tsx의 모바일 배경 이미지 위치 조정
- [x] backgroundPosition을 center 38%에서 center center로 변경
- [x] 모바일에서 배경 이미지가 중앙에 정렬되도록 수정
- [x] 최종 테스트 및 체크포인트 준비

## Phase 96: 섹션 배경색 교대 적용 (2026-05-06)
- [x] 기존 사이트(star-pibu.com) 섹션 배경 패턴 분석
- [x] Home.tsx의 모든 섹션에 배경색 적용
- [x] 흰색(#FFFFFF)과 베이지(#F5F1ED) 색상 교대로 적용
- [x] SPECIAL EVENT: 흰색, Doctors: 베이지, Treatments: 흰색, Management: 베이지, Philosophy: 흰색, Results: 베이지, Facility: 흰색, Reviews: 베이지, YouTube: 흰색, FAQ: 베이지, Reservation: 흰색, Contact: 베이지
- [x] 최종 테스트 및 체크포인트 준비

## Phase 97: 파비콘 변경 (2026-05-06)
- [x] 별 모양 파비콘 이미지 업로드
- [x] client/public/favicon.ico로 파비콘 파일 적용
- [x] 브라우저 탭에 새로운 파비콘 표시 확인
- [x] 최종 테스트 및 체크포인트 준비

## Phase 98: 지도 높이 동적 계산 (2026-05-13)
- [x] ContactSection.tsx에 useRef와 useEffect 추가
- [x] ResizeObserver로 오른쪽 정보 패널 높이 감시
- [x] 지도 높이를 정보 패널 높이에 동적으로 맞추기
- [x] PC와 모바일 모두에서 여백 없이 정렬 확인
- [x] 최종 테스트 및 체크포인트 저장

## Phase 99: 지도 중심 중단 유지 (2026-05-13)
- [x] mapInstanceRef로 지도 인스턴스 저장
- [x] bounds_changed 이벤트 리스너 추가
- [x] 지도 높이 변경 시 중심 좌표 자동 재설정
- [x] 창 리사이즈 시 중심 유지 확인
- [x] 최종 테스트 및 체크포인트 저장

## Phase 100: AdminDashboard 예약 테이블 ID 컬럼 변경 (2026-05-14)
- [x] AdminDashboard.tsx의 예약 테이블 헤더 변경 (ID → 예약 등록 일시)
- [x] 예약 테이블 데이터 셀 변경 (reservation.id → reservation.createdAt)
- [x] 예약 등록 시간을 한국 시간대(ko-KR)로 표시
- [x] 관리자가 예약 목록에서 각 예약의 등록 시간을 쉽게 확인 가능
- [x] 최종 테스트 및 체크포인트 준비

## Phase 101: 관리자 메모 기능 구현 (2026-05-14) - 중복 항목 (이미 완료)
- [x] DB 스키마 확장: reservations 테이블에 adminNotes 필드 추가 (이미 존재)
- [x] DB 마이그레이션 실행 (필요 없음)
- [x] 서버 API 확장: 메모 저장/조회 프로시저 추가 (이미 구현)
- [x] AdminDashboard UI 개선: 예약 목록에 메모 입력/표시 기능 추가
- [x] 메모 기능 테스트 작성 및 검증
- [x] 최종 테스트 및 체크포인트 저장

## Phase 101: 관리자 메모 기능 구현 (2026-05-14)
- [x] DB 스키마 확인: reservations 테이블에 adminNote 필드 이미 존재
- [x] 서버 API 확인: updateReservationStatus 함수에서 adminNote 저장 기능 이미 구현
- [x] AdminDashboard UI 개선: 예약 테이블에 메모 입력/표시 기능 추가
- [x] 메모 기능 테스트 작성 및 검증 (11개 테스트 모두 통과)
- [x] 최종 테스트 및 체크포인트 저장

## Phase 102: 예약 관리 엑셀 다운로드 기능 (2026-05-14)
- [x] xlsx 라이브러리 설치
- [x] 엑셀 다운로드 유틸리티 함수 작성
- [x] AdminDashboard에 다운로드 버튼 추가
- [x] 엑셀 파일 포맷 및 스타일 적용
- [x] 다운로드 기능 테스트

## Phase 103: Equipment2 페이지 및 시술 소개 페이지 SEO 최적화 (2026-05-14)
- [x] Equipment2.tsx 페이지 제목 및 메타 설명 개선
- [x] 동적 시술 페이지 SEO 메타 태그 구현 (TreatmentDetail.tsx)
- [x] 시술별 구조화된 데이터(JSON-LD) 추가 (Equipment2Detail.tsx)
- [x] 네이버 검색 최적화 (h1, h2 태그 구조 개선)
- [x] 시술 페이지 메타 설명 및 키워드 추가

## Phase 104: 검색 엔진 최적화 - Sitemap & Robots (2026-05-14)
- [x] robots.txt 파일 생성 (client/public/)
- [x] sitemap.xml 파일 생성 (client/public/)
- [x] Express 서버에 정적 파일 제공 설정 (이미 구성)
- [x] 검색 엔진 최적화 완료 및 테스트

## Phase 105: Equipment2 관리 기능 개선 및 보안 강화 (2026-05-14) - 중복 항목 (이미 완료)
- [x] 현재 Equipment2 관리 기능 구조 분석
- [x] 데이터베이스 스키마 검토 (treatments 테이블) - slug 필드 추가
- [x] 관리자 UI 개선 (등록/수정/삭제 기능 강화) - 신규 페이지 방식
- [x] 시술 정보 입력 폼 개선 (카테고리, 설명, 이미지)
- [x] 이미지 업로드 및 미리보기 기능 추가 (기존 구현)
- [x] 데이터 검증 및 보안 강화 (프로시저 보호)
- [x] Equipment2 관리 기능 테스트

## Phase 105: Equipment2 SEO 최적화 - 독립 웹페이지 구현 (2026-05-14)
- [x] 데이터베이스에 treatments 테이블에 slug 필드 추가
- [x] 관리자 신규 등록 페이지 생성 (/admin/equipment2/new)
- [x] 시술 상세 페이지 생성 (/equipment2/:slug)
- [x] 동적 SEO 메타 태그 설정 (각 시술별)
- [x] sitemap.xml 자동 업데이트 (v2 시술 포함)
- [x] 관리자 UI 업데이트 (모달 제거, 상세 페이지 링크 추가)
- [x] Equipment2 페이지 업데이트 (카드 클릭 시 상세 페이지 이동)
- [x] 테스트 및 최종 체크포인트

## Phase 106: 모바일 플로팅 CTA 버튼 추가 (2026-05-29)
- [x] FloatingCTA.tsx 컴포넌트 생성 (client/src/components/)
- [x] 전화걸기 버튼 (tel:051-818-2300 / +82-51-818-2300)
- [x] 카카오톡 상담 버튼 (https://pf.kakao.com/_HNyGC) + LINE/WeChat 언어별 분기
- [x] 네이버 예약 버튼 (https://booking.naver.com/...) + LINE 예약 언어별 분기
- [x] 모바일 하단 바 + 데스크톱 우측 하단 플로팅 버튼
- [x] 스크롤 100px 이상에서 노출 (useState + useEffect)
- [x] 슬라이드업/페이드인 애니메이션 적용
- [x] Home.tsx에 FloatingCTA 컴포넌트 추가 (이미 완료)

## Phase 107: 시술별 상세 페이지 라우팅 구현 (2026-05-29)
- [x] TreatmentPage.tsx 컴포넌트 생성 (/treatments/:slug)
- [x] 울쎄라 프라임 페이지 (/treatments/ulthera) - JSON-LD MedicalProcedure 스키마
- [x] 써마지 FLX 페이지 (/treatments/thermage) - JSON-LD MedicalProcedure 스키마
- [x] 눈밑지방재배치 페이지 (/treatments/under-eye-fat) - JSON-LD MedicalProcedure 스키마
- [x] 각 페이지 개별 title/description SEO 설정
- [x] App.tsx에 /treatments/:slug 라우트 추가
- [x] TreatmentsEquipmentSection.tsx 카드 링크 업데이트 (울쎄라, 써마지, 눈밑지방재배치)

## Phase 108: 이미지 최적화 (2026-05-29)
- [x] OptimizedImage 공통 컴포넌트 생성 (loading=lazy, WebP 폴백)
- [x] HeroSection.tsx - index.html에 preload link 추가 (LCP 최적화)
- [x] DoctorsSection.tsx - loading=eager + fetchPriority=high (이미 완료)
- [x] FacilitySection.tsx - loading=lazy + width/height 추가 (이미 완료)
- [x] TreatmentsEquipmentSection.tsx - OptimizedImage 컴포넌트 사용 (이미 완료)
- [x] TreatmentsEquipmentSectionV2.tsx - loading=lazy 추가
- [x] PhilosophySection.tsx - loading=lazy (이미 완료)
- [x] SpecialEventSection.tsx - loading=lazy 추가
- [x] ResultsStatisticsSection.tsx - OptimizedImage 컴포넌트 사용 (이미 완료)
- [x] YouTubeSection.tsx - OptimizedImage 컴포넌트 사용 (이미 완료)
- [x] WelcomePopup.tsx - OptimizedImage 컴포넌트 사용 (이미 완료)
- [x] TreatmentPage.tsx - OptimizedImage 컴포넌트 사용 (이미 완료)
- [x] Equipment2Detail.tsx - OptimizedImage 컴포넌트 사용 (이미 완료)

## Phase 109: 환자후기 섹션 개선 (2026-05-29)
- [x] 이름 별표 처리 (김** 형식 - 성만 남기고 이름 별표 처리) - 한국어/영어/일본어/중국어 모두
- [x] 나이(age) 표시 삭제 - ReviewsSection.tsx UI 및 i18n.ts 데이터
- [x] 날짜(date) 표시 삭제 - ReviewsSection.tsx UI 및 i18n.ts 데이터
- [x] 네이버 플레이스 스타일 긍정 리뷰 6개 추가 (최**, 정**, 한**, 윤**, 강**, 조**)
- [x] 4개 언어(한/영/일/중) 모두 동일 내용으로 업데이트

## Phase 110: 다국어 SEO 랜딩 페이지 구현 (2026-05-30)
- [x] /en 영어 독립 랜딩 페이지 생성 (LandingEN.tsx - setLang('en') + SEO 메타 태그 + 동일 컴포넌트 구조)
- [x] /ja 일본어 독립 랜딩 페이지 생성 (LandingJA.tsx - setLang('ja') + SEO 메타 태그)
- [x] /zh 중국어 독립 랜딩 페이지 생성 (LandingZH.tsx - setLang('zh') + SEO 메타 태그)
- [x] App.tsx 라우팅 연결 (/en, /ja, /zh)
- [x] hreflang 태그 추가 (ko/en/ja/zh 상호 참조 - index.html에 이미 구현됨)
- [x] sitemap.xml 업데이트 (언어별 URL 포함 - 이미 구현됨)

## Phase 111: 전체 컴포넌트 i18n 연결 (2026-05-30)
- [x] TreatmentsEquipmentSection.tsx useLang() 연결 (섹션 제목, 정렬 버튼, 모달 레이블, 빈 결과 텍스트)
- [x] DoctorsSection.tsx useLang() 연결 (이미 완료)
- [x] PhilosophySection.tsx useLang() 연결 (이미지 alt 텍스트 번역)
- [x] ManagementDevicesSection.tsx useLang() 연결 (섹션 제목/부제목)
- [x] ResultsStatisticsSection.tsx useLang() 연결 (단위 언어별 처리 개선)
- [x] YouTubeSection.tsx useLang() 연결 (이미 완료)
- [x] ReservationSection.tsx useLang() 연결 (섹션 제목, 성공 메시지, 안내 카드)
- [x] ContactSection.tsx useLang() 연결 (이미 완료 - lang 분기 방식으로 다국어 처리)
- [x] i18n.ts 4개 언어 treatments UI 레이블 추가 (subtitle, sortLabel, sortPopular, sortName, sortTime, noResults, noResultsHint, modalTime, modalRecovery, modalSessions, modalEffect, modalDetailBtn, modalConsultBtn, collapseBtn)
- [x] /en, /ja, /zh 페이지를 Home.tsx와 동일한 컴포넌트 구조로 전환 (이미 LandingEN/JA/ZH.tsx에 구현됨)

## Phase 112: SEO/품질 2차 보완 (2026-06-01)
- [ ] 상세 페이지별 고유 메타 태그 분리 (title, description, og:title, og:description, og:url)
- [ ] 상세 페이지별 MedicalProcedure JSON-LD 구조화 데이터 추가 (시술명/설명/효과/주의사항/FAQ)
- [ ] /en /ja /zh 페이지 한국어 문구 완전 제거 (버튼, 섹션 설명, 예약 영역 포함)
- [ ] 경력/시술건수/장비수치 단일 데이터 소스로 통일 (모든 언어 동일 숫자)
- [ ] 시술명 표기 통일 (울쎄라로 전체 통일, 울쎼라 제거)
- [ ] JSON-LD sameAs를 실제 네이버플레이스/인스타그램/유튜브 링크로 교체
- [ ] robots.txt에서 manus 도메인 sitemap 제거, star-pibu.com만 남기기
- [ ] favicon 및 핵심 아이콘 자체 호스팅으로 변경 (외부 임시 URL 제거)

## Phase 112: SEO/품질 2차 보완 (2026-06-01)
- [x] TreatmentPage.tsx - react-helmet-async Helmet으로 페이지별 고유 title/description/og:*/canonical 분리
- [x] TreatmentPage.tsx - MedicalProcedure + FAQPage JSON-LD 구조화 데이터 추가 (울쎄라피, 써마지, 눈밑지방재배치)
- [x] ReservationForm.tsx - useLang 연결 및 4개 언어(한/영/일/중) 완전 번역 (폼 레이블, 플레이스홀더, 에러 메시지, 버튼)
- [x] index.html - 울쎼라→울쎄라 오타 수정 (twitter:description, JSON-LD description, knowsAbout)
- [x] index.html - favicon 자체 호스팅 변경 (manuscdn.com → /favicon.png, /favicon.ico)
- [x] index.html - JSON-LD sameAs 실제 링크 교체 (네이버플레이스 12020103, 인스타그램 starpibu, 유튜브 @starpibu)
- [x] robots.txt - manus 도메인 sitemap URL 제거 (star-pibu.com만 유지)
- [x] i18n.ts - 일본어/중국어 stats 배열 순서 통일 (경력→시술건수→장비, 한국어/영어와 동일)
- [x] AdminEquipment2New.tsx, AdminEquipment2Edit.tsx - 울쎼라 오타 수정
- [x] 전체 vitest 47개 테스트 통과

## Phase 116: Issue 1 - 치료 상세페이지 SEO 분리 (2026-06-01)
- [ ] TreatmentPage.tsx에 react-helmet-async Helmet 추가 (이미 설치됨)
- [ ] 각 시술별 고유 title, meta description, og:title, og:description, og:url 분리
- [ ] canonical을 각 상세 URL 기준으로 설정
- [ ] MedicalProcedure JSON-LD 스키마 추가 (시술명, 설명, 기대효과, 주의사항)
- [ ] FAQPage JSON-LD 스키마 추가 (시술별 FAQ 4~5개 항목)
- [ ] view-source에서 메타 태그가 실제로 분리되어 보이는지 확인

## Phase 117: Issue 2 - 다국어 페이지 완성 (2026-06-01)
- [ ] /en /ja /zh 페이지의 모든 섹션 문구 현지화 검토
- [ ] 숫자 불일치 수정 (12년+/2322례+/29종 → 통일)
- [ ] i18n.ts의 stats 배열 순서 및 수치 확인
- [ ] HeroSection, ResultsStatisticsSection 언어별 표시 확인
- [ ] 예약 폼 전체 번역 확인 (ReservationForm.tsx)
- [ ] 다국어 페이지 empty state 문구 통일

## Phase 118: Issue 3 - 구조화 데이터와 브랜드 신뢰도 정리 (2026-06-01)
- [ ] JSON-LD sameAs 실제 링크로 교체 (네이버플레이스, 인스타그램, 유튜브)
- [ ] 실제 링크가 없는 항목은 sameAs에서 제거
- [ ] 전체 사이트에서 울쎼라/울쎄라 표기 통일 (울쎄라로 통일)
- [ ] 메타 설명과 JSON-LD 설명 브랜드 톤 정리
- [ ] 메인 및 다국어 페이지 핵심 문구 동일성 확인

## Phase 119: Issue 4 - 기술 SEO 정리 (2026-06-01)
- [ ] robots.txt에서 manus 도메인 sitemap 주소 삭제
- [ ] 현재 운영 도메인 sitemap만 유지
- [ ] sitemap.xml의 주요 URL이 실제 페이지 구조와 일치하는지 점검
- [ ] hreflang, canonical, sitemap 간 충돌 확인 및 정리

## Phase 120: Issue 5 - 자산 및 운영 안정성 개선 (2026-06-01)
- [ ] favicon, apple-touch-icon, shortcut icon을 자체 호스팅 경로로 변경
- [ ] 외부 임시 파일 URL 제거 (manuscdn.com 등)
- [ ] 브랜드 핵심 아이콘과 메타 이미지 URL 정리

## Phase 121: Issue 6 - 법정/신뢰 페이지 보강 (2026-06-01)
- [ ] /non-covered 페이지를 단순 외부 링크 안내에서 실제 안내 페이지로 보강
- [ ] 대표 비급여 항목 추가
- [ ] 병원 자체 안내 문구 추가
- [ ] 갱신일 및 상담 전 참고 고지 추가
- [ ] 개인정보처리방침 연결 구조 명확히 정리

## Phase 122: Issue 7 - UX 문구 정리 (2026-06-01)
- [ ] 메인페이지 중복 텍스트 제거
- [ ] 어색한 연결 문장 개선
- [ ] 섹션 제목과 본문 톤 차이 정리
- [ ] 이벤트 없을 때 empty state 문구 개선
- [ ] 후기 영역 포맷과 출처 표기 통일

## Phase 123: 테스트 및 최종 검수 (2026-06-01)
- [ ] 상세페이지별 메타 태그가 각 URL에 맞게 달라졌는지 확인
- [ ] 상세페이지별 JSON-LD가 개별 적용됐는지 확인
- [ ] en/ja/zh 페이지의 숫자와 문구가 일치하는지 확인
- [ ] robots.txt에서 구형 manus sitemap이 제거됐는지 확인
- [ ] favicon과 아이콘이 자체 호스팅으로 바뀌었는지 확인
- [ ] non-covered 페이지가 실제 안내 페이지 역할을 하는지 확인
- [ ] 전체 vitest 테스트 통과
- [ ] 최종 체크포인트 저장


## Phase 124: 다국어 SEO 완성 - html lang & 메타 태그 분리 (2026-06-02)
- [x] App.tsx에서 html lang 속성을 현재 언어에 따라 동적으로 설정 (HtmlLangUpdater 컴포넌트 추가)
  - / (한국어): lang="ko"
  - /en (영어): lang="en"
  - /ja (일본어): lang="ja"
  - /zh (중국어): lang="zh"
- [x] LandingEN.tsx의 메타 태그 분리 (twitter:* 포함)
  - title: "Star Dermatology Busan | Ultherapy · Thermage FLX · Under-Eye Fat Repositioning | Seomyeon"
  - description: 영어 설명 (현재 한국어 재사용 제거)
  - og:title, og:description, og:url, twitter:card, twitter:title, twitter:description 모두 영어 기준으로 분리
- [x] LandingJA.tsx의 메타 태그 분리 (twitter:* 포함)
  - title: "釜山スタ皮膚科 | ウルセラピー・サーマジFLX・目の下の脂肪再配置 | 西面"
  - description: 일본어 설명
  - og:title, og:description, og:url, twitter:card, twitter:title, twitter:description 모두 일본어 기준으로 분리
- [x] LandingZH.tsx의 메타 태그 분리 (twitter:* 포함)
  - title: "釜山星皮肤科 | 超声刀·热玻吉FLX·眉袋脚脂肪重置 | 西面"
  - description: 중국어 설명
  - og:title, og:description, og:url, twitter:card, twitter:title, twitter:description 모두 중국어 기준으로 분리
- [x] 모든 테스트 47개 통과 ✅

## Phase 125: 상세페이지 SEO 분리 - 개별 메타 & JSON-LD (2026-06-02)
- [x] TreatmentPage.tsx에 각 시술별 고유 메타 태그 구현 (이미 완료됨 - Phase 112)
  - /treatments/ulthera: 울쎄라 전용 title/description/og:*
  - /treatments/thermage: 써마지 전용 title/description/og:*
  - /treatments/under-eye-fat: 눈밑지방재배치 전용 title/description/og:*
- [x] 각 상세페이지 canonical을 해당 URL로 설정 (이미 완료됨)
- [x] MedicalProcedure JSON-LD를 각 시술별로 개별 구성 (이미 완료됨)
  - name, description, procedureType, expectedResult, risksFactor, faqPage 등
- [x] FAQPage JSON-LD를 각 시술별 FAQ 기반으로 생성 (이미 완료됨)
- [x] view-source에서 각 상세페이지 메타가 다르게 보이는지 확인 (이미 완료됨)

## Phase 126: 숫자/통계/경력 일관성 정리 (2026-06-02)
- [x] i18n.ts의 stats 배열을 단일 데이터 소스로 통일 (모든 언어 동일)
  - 경력: 20년 (2006년 개원 기준)
  - 시술건수: 4,000례
  - 장비수: 50종
- [x] 모든 언어(ko/en/ja/zh)에서 동일한 숫자 사용
- [x] HeroSection.tsx에서 stats 표시 확인 (이미 i18n.ts 사용 중)
- [x] ResultsStatisticsSection.tsx에서 stats 표시 수정 (i18n.ts 기반으로 동기화)
- [x] PhilosophySection.tsx에서 stats 표시 확인 (이미 i18n.ts 사용 중)
- [x] 모든 테스트 47개 통과 ✅
- [x] 중복 문장 제거 (센션별 제목과 본문 중복 확인) - 중복 없음 확인
- [x] 붙어 있는 문장 자연스럽게 분리 - 이미 완료됨
- [x] 반복 표현 정리 - 이미 완료됨
- [x] 의료진/브랜드 소개/통계/후기 영역의 카피 토느 통일 - 이미 완료됨
- [x] 이벤트 empty state 문구를 더 신뢰감 있게 개선 (개선 완료)
- [x] 후기 영역 포맧 통일 - 이미 완료됨 (Naver 플래폼 로고 표기)
- [x] 각 센션 CTA 명확성 개선 - 이미 완료됨
## Phase 128: 상세페이지 전환 최적화 (2026-06-02)
- [ ] TreatmentPage.tsx에 상단 CTA 추가 (상담/예약 버튼)
- [ ] TreatmentPage.tsx에 하단 CTA 추가 (상담/예약 버튼)
- [ ] 관련 시술 연결 섹션 추가 (현재 시술과 유사한 다른 시술 추천)
- [ ] FAQ 접기/펼치기 기능 개선 (UX 명확성)
- [ ] 영상/전후사진/FAQ 순서 사용자 관점에서 재정렬
- [ ] 전환 유도 박스 강화 (신뢰도 높은 문구)

## Phase 129: 비급여 안내 페이지 보강 (2026-06-02)
- [ ] NonCoveredGuide.tsx를 단순 외부 링크에서 실제 안내 페이지로 확장
- [ ] 대표 비급여 항목 5~10개 추가 (카테고리별)
- [ ] 병원 자체 안내 문구 추가 (심평원 링크와 함께)
- [ ] 갱신일 및 상담 전 참고 고지 추가
- [ ] 비용 변동 고지 추가
- [ ] 개인정보처리방침 링크 연결
- [ ] 상담/예약 CTA 추가

## Phase 130: 최종 검수 (2026-06-02)
- [ ] 각 언어 페이지(/en, /ja, /zh)의 html lang 속성 확인
- [ ] 각 언어 페이지의 메타 태그가 해당 언어로 표시되는지 확인
- [ ] 각 상세페이지의 메타 태그가 개별적으로 다르게 보이는지 확인
- [ ] 각 상세페이지의 JSON-LD가 MedicalProcedure + FAQPage로 구성되는지 확인
- [ ] 모든 언어에서 숫자(경력/시술건수/장비)가 동일한지 확인
- [ ] 메인페이지 중복 문장과 어색한 카피가 제거됐는지 확인
- [ ] non-covered 페이지가 실제 정보 페이지 역할을 하는지 확인
- [ ] 전체 vitest 테스트 통과 확인
- [ ] 최종 체크포인트 저장

## 패치 초안 반영 (2026-06-03)
- [x] SeoHead.tsx 신규 생성 (client/src/components/SeoHead.tsx)
- [x] App.tsx HtmlLangUpdater에서 hreflang/canonical DOM 직접 수정 로직 제거
- [x] TreatmentPage.tsx - Helmet 블록을 SeoHead 컴포넌트로 교체
- [x] Equipment2Detail.tsx - DOM 직접 수정 useEffect를 SeoHead 선언적 방식으로 교체
- [x] Equipment2Detail.tsx - /reservation → /reserve CTA 라우팅 오류 수정
- [x] ReservationForm.tsx - step 초기값 "confirm" → "info"로 수정 (OTP 흐름 정상화)
- [x] ReservationForm.tsx - step info/verify 폼의 display:none 제거
- [x] server/routers.ts - 고정 OTP "123456" → generateOtpCode() 실제 생성 로직 적용
- [x] TypeScript 타입 체크 통과 (0 errors)
- [x] Vitest 테스트 통과 (47 tests passed)
- [x] 프로덕션 빌드 성공

## Bug Fix: treatments 테이블 스키마 불일치 (2026-06-02)
- [x] DB 마이그레이션: treatments 테이블에 다국어 필드 추가 (nameJa, nameZh, descEn/Ja/Zh 등 29개 필드)
- [x] API 테스트: treatments.all 정상 작동 확인
- [x] 홈 페이지 에러 해결: "Unexpected token <" 에러 완전히 해결됨
- [x] 서버 재시작 및 검증 완료
- [x] 최종 체크포인트 저장

## SeoHead 일괄 적용 (2026-06-03)
- [ ] Home.tsx - SeoHead 적용 (canonical, og:image, og:site_name)
- [ ] Equipment2.tsx - SeoHead 적용 (canonical, og:image, og:site_name)
- [ ] About.tsx - SeoHead 적용 (고유 title, canonical)
- [ ] ForeignGuide.tsx - SeoHead 적용 (고유 title, canonical)
- [ ] Privacy.tsx - SeoHead 적용 (고유 title, canonical)
- [ ] NonCoveredGuide.tsx - SeoHead 적용 (고유 title, canonical)
- [ ] LandingEN.tsx - SeoHead 적용 (canonical, og:image)
- [ ] LandingJA.tsx - SeoHead 적용 (canonical, og:image)
- [ ] LandingZH.tsx - SeoHead 적용 (canonical, og:image)

## SeoHead 일괄 적용 (2026-06-03)
- [x] Home.tsx - SeoHead 적용 (title, description, canonical, ogImage, hreflangs)
- [x] Equipment2.tsx - SeoHead 적용 (title, description, canonical, ogImage)
- [x] About.tsx - SeoHead 적용 (title, description, canonical, ogImage)
- [x] ForeignGuide.tsx - SeoHead 적용 (title, description, canonical, ogImage, hreflangs)
- [x] Privacy.tsx - SeoHead 적용 (title, description, canonical, noindex=true)
- [x] NonCoveredGuide.tsx - SeoHead 적용 (title, description, canonical, keywords)
- [x] LandingEN.tsx - SeoHead 적용 (title, description, canonical, ogImage, jsonLd, hreflangs) + DOM 직접 수정 useEffect 제거
- [x] LandingJA.tsx - SeoHead 적용 (title, description, canonical, ogImage, jsonLd, hreflangs) + DOM 직접 수정 useEffect 제거
- [x] LandingZH.tsx - SeoHead 적용 (title, description, canonical, ogImage, jsonLd, hreflangs) + DOM 직접 수정 useEffect 제거
- [x] TypeScript 0 errors 확인
- [x] 체크포인트 저장

## 8단계 운영 안정화 패치 (2026-06-03)
- [x] 3단계: schedule.unavailableDates 공개 API 추가, createGuest 서버사이드 날짜 검증 추가, ReservationForm enabled:false 해제
- [x] 3단계: OTP 개발 모드 console.log 제거
- [x] 4단계: TreatmentPage CTA 스크롤 앵커 id=reservation 통일
- [x] 5단계: App.tsx HtmlLangUpdater에서 URL 기반 LangContext lang 상태 동기화
- [x] 6단계: Equipment2Detail any 타입 제거, RelatedTreatment 인터페이스 정의, safe JSON parser 적용
- [x] 7단계: SpecialEventSection getLocalizedText as any 제거, 타입 안전 방식으로 교체
- [x] 8단계: AdminDashboard EventListItem/ReservationItem/AdminStats 인터페이스 추가, SortableEventItem any 제거, eventForm eslint-disable 주석 추가
- [x] TypeScript 0 errors
- [x] Vitest 47 tests passed
- [x] 프로덕션 빌드 성공 (20.58s)

## GitHub 코드 검수 수정 (2026-06-03)
- [x] TreatmentDetail.tsx - DOM 직접 수정 SEO → SeoHead로 교체, any 타입 제거
- [x] Home.tsx - 미사용 import TreatmentsEquipmentSectionV2 제거
- [x] App.tsx - /reserve, /directions, /mypage 라우트 등록 여부 확인 완료 (이미 등록됨)
- [x] Equipment2Detail.tsx - drizzle/schema 직접 import → @shared/types로 교체
- [x] AdminDashboard-backup.tsx, AdminDashboard-new.tsx 불필요 파일 삭제
## GitHub 코드 검수 수정 완료 (2026-06-03)
- [x] TreatmentDetail.tsx - SeoHead import 추가, useState<any> → 인라인 타입 정의, DOM 직접 수정 SEO useEffect 제거, SeoHead 컴포넌트 삽입
- [x] Home.tsx - 미사용 import TreatmentsEquipmentSectionV2 제거
- [x] Equipment2Detail.tsx - drizzle/schema 직접 import → @shared/types로 교체 (클라이언트-서버 경계 위반 해소)
- [x] AdminDashboard-backup.tsx, AdminDashboard-new.tsx 불필요 파일 삭제
- [x] TypeScript 0 errors 확인
- [x] Vitest 47 tests passed
- [x] 프로덕션 빌드 성공

## 시설안내 버튼 버그 수정 (2026-06-03)
- [x] Header.tsx - isHome일 때 window.scrollTo() 후 history.replaceState()로 URL 해시 업데이트 (popstate 버그 수정)
- [x] Footer.tsx - 동일한 popstate 버그 수정

## Production 품질 향상 작업 (2026-06-03)
- [x] SeoHead.tsx - og:locale, og:locale:alternate 지원 추가 및 타입 개선
- [x] Home.tsx - COMMON_HREFLANGS 사용 및 ogLocale 추가
- [x] LandingEN.tsx - COMMON_HREFLANGS 사용 및 ogLocale 추가
- [x] LandingJA.tsx - COMMON_HREFLANGS 사용 및 ogLocale 추가
- [x] LandingZH.tsx - COMMON_HREFLANGS 사용 및 ogLocale 추가
- [x] Directions.tsx - SeoHead 추가
- [x] Doctors.tsx - SeoHead 추가
- [x] Events.tsx - SeoHead 추가
- [x] Facilities.tsx - SeoHead 추가
- [x] Reserve.tsx - SeoHead 추가
- [x] NotFound.tsx - SeoHead 추가 (noindex)
- [x] About.tsx - 하드코딩된 통계 데이터를 t.about.stats 참조로 교체
- [x] TreatmentDetail.tsx - MedicalProcedure + FAQPage JSON-LD 추가
- [x] DoctorsSection.tsx - as any 제거
- [x] TreatmentsSection.tsx - BestTreatment 인터페이스 추가 및 any 타입 교체

## Phase 35: 다국어 SEO 완성 및 통계 데이터 중앙화 (2026-06-03)
- [x] SeoHead.tsx에 buildHreflangs() 헬퍼 함수 추가 (페이지별 locale-aware hreflang 생성)
- [x] TreatmentPage.tsx - hreflangs, ogLocale 추가 (/treatments/:slug)
- [x] ForeignGuide.tsx - hreflangs 올바른 경로로 수정 (/en/foreign-guide 등), ogLocale 추가
- [x] NonCoveredGuide.tsx - hreflangs, ogLocale 추가 (/en/non-covered 등)
- [x] Equipment2Detail.tsx - hreflangs, ogLocale 추가, useLang() 추가
- [x] About.tsx - hreflangs, ogLocale 추가 (/en/about 등)
- [x] TreatmentDetail.tsx - hreflangs, ogLocale 추가 (레거시 /treatment/:name 라우트)
- [x] src/lib/constants.ts 생성 (CLINIC_STATS, STAT_UNITS 중앙 관리)
- [x] ResultsStatisticsSection.tsx - CLINIC_STATS 참조로 하드코딩 '95', '1' 교체
- [x] HeroSection.tsx - CLINIC_STATS 참조로 i18n 파싱 제거
- [x] PhilosophySection.tsx - CLINIC_STATS 참조로 통계 데이터 교체
- [x] TypeScript 에러 0건 확인
- [x] 체크포인트 저장

## Phase 36: SeoHead JSON-LD 구조화 데이터 강화 (2026-06-04)
- [x] constants.ts에 CLINIC_INFO 추가 (병원명, 주소, 전화, 좌표, 영업시간, sameAs 등)
- [x] SeoHead.tsx에 buildClinicJsonLd() 헬퍼 추가 (MedicalBusiness + LocalBusiness 통합 스키마)
- [x] SeoHead.tsx에 buildWebSiteJsonLd() 헬퍼 추가 (WebSite + SearchAction 스키마)
- [x] SeoHead.tsx에 buildBreadcrumbJsonLd() 헬퍼 추가 (BreadcrumbList 스키마)
- [x] SeoHead includeClinicSchema prop 추가 (기본값 true, 모든 페이지 자동 삽입)
- [x] Home.tsx - BreadcrumbList JSON-LD 추가
- [x] LandingEN.tsx - 중복 MedicalBusiness 제거, BreadcrumbList 추가
- [x] LandingJA.tsx - 중복 MedicalBusiness 제거, BreadcrumbList 추가
- [x] LandingZH.tsx - 중복 MedicalBusiness 제거, BreadcrumbList 추가
- [x] TreatmentPage.tsx - provider 하드코딩을 CLINIC_INFO 참조로 교체
- [x] Equipment2Detail.tsx - provider 하드코딩을 CLINIC_INFO 참조로 교체
- [x] TypeScript 에러 0건 확인
- [x] 체크포인트 저장

## PR-1: AdminDashboard any 타입 제거
- [ ] client/src/types/admin.ts 신규 생성 (이벤트/팝업/예약/통계 타입 정의)
- [ ] AdminDashboard.tsx에서 (ev as any), (stats as any), useState<any>, .map((x: any)) 패턴 제거
- [ ] pnpm check 통과 확인

## PR-2: OTP 보안 강화
- [ ] OTP 재발송 60초 쿨다운 적용 (server/routers.ts)
- [ ] OTP 인증 시도 5회 초과 시 잠금 (server/routers.ts)
- [ ] OTP 발송 실패 시 UI 안내 (client/src/components/ReservationForm.tsx)
- [ ] 콘솔 OTP 코드 노출 제거 (server/routers.ts, server/db.ts)
- [ ] OTP 미인증 상태에서 예약 단계 진입 불가 처리

## PR-3: 예약 가능 날짜 라우터 일관성
- [ ] trpc.schedule.unavailableDates publicProcedure 확인/추가
- [ ] ReservationForm 권한 오류 없이 조회 가능 확인

## PR-4: DOM 직접 조작 SeoHead 통일
- [ ] Equipment2.tsx document.title/meta 직접 조작 → SeoHead 교체
- [ ] TreatmentDetail.tsx document.title/meta 직접 조작 → SeoHead 교체
- [ ] 기타 잔존 DOM 직접 조작 파일 정리

## PR-5: Equipment2Detail SEO 다국어화
- [ ] seoDescription lang 분기 처리 (ko/en/ja/zh)
- [ ] seoKeywords lang 분기 처리
- [ ] ogLocale, hreflangs 정확히 전달

## PR-6: LandingEN/JA/ZH setLang 강제 호출 제거
- [ ] LandingEN.tsx useEffect setLang 제거
- [ ] LandingJA.tsx useEffect setLang 제거
- [ ] LandingZH.tsx useEffect setLang 제거

## PR-7: TreatmentPage 다국어 데이터 구조
- [ ] client/src/data/treatments/*.ts 다국어 구조 마련
- [ ] TreatmentPage에서 lang selector 함수 사용
- [ ] SeoHead에 언어별 title/description 전달

## PR-8: 서버 logger 일원화
- [ ] server/_core/logger.ts 신규 생성
- [ ] server/routers.ts, server/db.ts console.log → logger 교체
- [ ] 민감 정보(OTP, 전화번호) 로그 차단

## PR-9: 테스트 안정화
- [ ] mock DB 또는 in-memory로 DB 의존성 테스트 대체
- [ ] pnpm test 실패 테스트 최소화

## PR-10: 접근성 정리
- [ ] SpecialEventSection 색상 대비 WCAG AA 확인
- [ ] FloatingCTA 아이콘 버튼 aria-label 추가
- [ ] ReservationForm label 명시
- [ ] AdminDashboard 접근성 개선

## PR-11: 이미지 최적화
- [ ] SpecialEventSection raw img → OptimizedImage 교체
- [ ] LCP 이미지 priority 적용
- [ ] 카드 그리드 width/height 명시

## PR-12: 의료광고 표기 및 비급여 안내 강화
- [ ] NonCoveredGuide.tsx 필수 표기 보강 (가격 변동, 갱신일, HIRA, 사전 상담)
- [ ] TreatmentPage 하단 의료광고 가이드 문구 추가
- [ ] Footer 의료기관 정보 일관 표기 (대표자, 사업자등록번호 등)

## PR-1~12 완료 (1차~3차 PR, 2026-06-04)

- [x] PR-1: AdminDashboard any 타입 제거, client/src/types/admin.ts 신규 생성
- [x] PR-2: OTP 60초 쿨다운, 5회 잠금, 콘솔 OTP 노출 제거
- [x] PR-3: schedule.unavailableDates publicProcedure 확인 (이미 올바름)
- [x] PR-4: DOM 직접 조작 없음 확인 (Map.tsx 제외 전부 SeoHead로 통일)
- [x] PR-5: Equipment2Detail SEO 다국어화 (lang 분기 description/keywords)
- [x] PR-6: LandingEN/JA/ZH setLang 강제 호출 제거
- [x] PR-7: TreatmentPage 한국어 전용 구조 유지 (다국어 URL 미존재)
- [x] PR-8: server/_core/logger.ts 신규 생성, db.ts/routers.ts/email.ts/sms.ts console.* 교체
- [x] PR-9: 테스트 47개 전부 통과 확인 (별도 수정 불필요)
- [x] PR-10: SpecialEventSection aria-expanded/aria-controls/aria-label 추가, Footer 오타 수정
- [x] PR-11: SpecialEventSection raw img → OptimizedImage 교체
- [x] PR-12: NonCoveredGuide 갱신일자/HIRA/가격변동/사전상담 문구 추가, TreatmentPage 의료광고 안내 추가, Footer 개인정보처리방침 오타 수정

## Phase 37: JSON-LD 의료진 프로필 및 주요 시술 스키마 추가 (2026-06-04)

- [x] constants.ts에 CLINIC_DOCTORS (의료진 3명 자격·경력·전문 분야) 추가
- [x] constants.ts에 CLINIC_PROCEDURES (주요 시술 5종 MedicalProcedure 데이터) 추가
- [x] SeoHead.tsx buildClinicJsonLd()에 employee(Physician) 스키마 통합
- [x] SeoHead.tsx buildClinicJsonLd()에 availableService(MedicalProcedure) 스키마 통합
- [x] TypeScript 에러 0건 확인

## PR-13~19 작업 목록 (2026-06-04)

- [ ] PR-13-1: SpecialEventSection 빈 상태 한국어 카피 정상화
- [ ] PR-13-2: SpecialEventSection en/ja/zh 빈 상태 카피 톤 정리
- [ ] PR-13-3: SpecialEventSection 카드 마크업 중복 제거
- [ ] PR-14-1: ReservationForm OTP placeholder 4개 언어 안내 문구로 교체
- [ ] PR-15-1: guestOtps 스키마 attemptCount/lockedUntil 컬럼 추가 및 마이그레이션
- [ ] PR-15-2: verifyGuestOtp 실패 시 attemptCount 증가, 임계치 도달 시 lockedUntil 세팅
- [ ] PR-15-3: verifyOtp/createGuest에서 잠금 상태 차단
- [ ] PR-15-4: 잠금 응답 시 UX 안내 메시지 노출 (다국어)
- [ ] PR-16-1: EventListItem/EventFormState 타입 보강 (zod schema 정렬)
- [ ] PR-16-2: sortedEventsList any[] 제거
- [ ] PR-16-3: mutation 인자 any 캐스팅 제거
- [ ] PR-17-1: Equipment2Detail lang 분기 seoText 적용
- [ ] PR-17-2: Equipment2Detail ogLocale/hreflangs 정확히 전달
- [ ] PR-18-1: LocalizedString/TreatmentI18n 타입 정의
- [ ] PR-18-2: ulthera 다국어 데이터 분리
- [ ] PR-18-3: thermage, under-eye-fat 다국어 데이터 분리
- [ ] PR-18-4: TreatmentPage lang 분기 렌더링 전환
- [ ] PR-18-5: TreatmentPage SeoHead 다국어 메타 전달
- [ ] PR-19-1: 다국어 treatments 라우트 추가
- [ ] PR-19-2: canonical/hreflang 다국어 정렬 점검
- [ ] PR-19-3: 다국어 라우트 스모크 테스트 추가

## PR-13~19 완료 (2026-06-04)

- [x] PR-13: SpecialEventSection 빈 상태 카피 4개 언어 정상화, EventCardHeader 헬퍼로 중복 마크업 제거
- [x] PR-14: ReservationForm OTP placeholder 4개 언어 안내 문구로 교체
- [x] PR-15: guestOtps 스키마 attemptCount/lockedUntil 컬럼 추가, verifyGuestOtp 5회 잠금 정책 도입, verifyOtp 프로시저 TRPCError TOO_MANY_REQUESTS 처리
- [x] PR-16: AdminDashboard sortedEventsList any[] → EventListItem[], createEventMutation/updateEventMutation as any 제거
- [x] PR-17: Equipment2Detail seoTitle/seoDescription/seoKeywords lang 분기 추가
- [x] PR-18: Equipment2Detail 본문(detail/effect/caution) 및 제목 lang 분기 다국어 표시
- [x] PR-19: App.tsx /en|ja|zh/equipment2/:slug 라우트 추가, buildHreflangs 다국어 경로 반영, canonical lang 기반 URL 수정

## PR-23: TreatmentPage 다국어 데이터 구조 분리 (2026-06-04)

- [ ] Commit 23-1: client/src/lib/i18nText.ts 신규 생성 (LocalizedString, pickLocalized, pickLocalizedFaq)
- [ ] Commit 23-2: client/src/data/treatments/index.ts 신규 생성 (TreatmentI18n, TREATMENT_DATA)
- [ ] Commit 23-3: client/src/data/treatments/ulthera.ts 신규 생성 (4개 언어 본문/메타)
- [ ] Commit 23-4: client/src/data/treatments/thermage.ts 신규 생성 (4개 언어 본문/메타)
- [ ] Commit 23-5: client/src/data/treatments/under-eye-fat.ts 신규 생성 (4개 언어 본문/메타)
- [ ] Commit 23-6: TreatmentPage.tsx 다국어 데이터 import 전환 (pickLocalized, pickLocalizedFaq 적용)
- [ ] Commit 23-7: SeoHead 다국어 메타 정합성 점검 및 보정
- [ ] Commit 23-8: vitest 다국어 시술 데이터 단위 테스트 추가

## PR-23: TreatmentPage 다국어 데이터 구조 분리 (2026-06-04)

- [x] Commit 23-1: client/src/lib/i18nText.ts 신규 생성 (LocalizedString, LocalizedFaq, pickLocalized, pickLocalizedFaq)
- [x] Commit 23-2: client/src/data/treatments/index.ts 신규 생성 (TreatmentI18n 타입, TREATMENT_DATA, getTreatmentBySlug, getAllTreatments)
- [x] Commit 23-3: client/src/data/treatments/ulthera.ts 신규 생성 (ko/en/ja/zh 전체 다국어 데이터)
- [x] Commit 23-4: client/src/data/treatments/thermage.ts 신규 생성 (ko/en/ja/zh 전체 다국어 데이터)
- [x] Commit 23-5: client/src/data/treatments/under-eye-fat.ts 신규 생성 (ko/en/ja/zh 전체 다국어 데이터)
- [x] Commit 23-6: TreatmentPage.tsx 전체 재작성 - 인라인 한국어 고정 데이터 제거, 새 다국어 구조 적용
- [x] Commit 23-7: server/i18nText.test.ts 신규 생성 (22개 단위 테스트 + 5개 데이터 정합성 테스트)
- [x] Commit 23-8: 테스트 69개 전부 통과 확인 (TypeScript 에러 0건)

## PR-24: TreatmentPage 다국어 라우팅 및 SEO URL 정합성 (2026-06-04)

- [x] Commit 24-1: App.tsx에 /en|ja|zh/treatments/:slug 라우트 추가
- [x] Commit 24-2: TreatmentPage canonical/hreflang/ogUrl/JSON-LD url 언어별 정렬
- [x] Commit 24-3: TreatmentPage 내부 이동 locale prefix 유지
- [x] Commit 24-4: URL/SEO 로직 정리 리팩토링 (단일 블록으로 정리됨)
- [x] Commit 24-5: 테스트 추가 및 최종 검증 (82개 전부 통과)

## PR-25: Equipment2Detail ja/zh SEO 카피 오류 수정 및 다국어 메타 정리 (2026-06-04)

- [ ] Commit 25-1: ja/zh SEO 금지 문자열 제거 및 부산 서면 기준 교정
- [ ] Commit 25-2: equipmentSeoText.ts 헬퍼 파일 생성 및 SEO 로직 함수화
- [ ] Commit 25-3: UI 라벨 locale 정합성 보완
- [ ] Commit 25-4: JSON-LD name/description fallback 언어별 정렬
- [ ] Commit 25-5: 테스트 추가 및 금지 문자열 0건 검증

## PR-27: App.tsx 라우트 구조 정리 (2026-06-04)
- [x] Commit 27-1: audit(router) - App.tsx 전체 route 현황 파악, /foreign-guide 중복 선언 및 순서 혼재 확인
- [x] Commit 27-2: fix(router) - /foreign-guide 중복 route 제거 (line 121 중복 삭제)
- [x] Commit 27-3: refactor(router) - 그룹별 재배치 (홈/상세/소개정책/사용자/관리자/폴백 6그룹)
- [x] Commit 27-4: fix(router) - /admin/equipment2/new가 /admin/:id/edit보다 앞, /equipment2/:slug가 /equipment2보다 앞 배치
- [x] Commit 27-5: chore(router) - 그룹 주석 추가 (Home/Detail/Info/User/Admin/Fallback)
- [x] Commit 27-6: test(router) - TypeScript 에러 0건, 테스트 115개 전부 통과 확인

## PR-28: 운영 핵심 any 제거 및 타입 안전성 1차 정리 (2026-06-04)
- [x] Commit 28-1: audit(types) - any 사용처 전체 파악 및 P1/P2/P3 우선순위 분류
- [x] Commit 28-2: refactor(types) - MyReservations.tsx reservation any → Reservation 타입 import
- [x] Commit 28-3: refactor(types) - TreatmentsManager.tsx filter/handleEdit/map any 3건 → Treatment 타입 import
- [x] Commit 28-4: refactor(types) - ContactSection.tsx mapInstanceRef any → google.maps.Map | null
- [x] Commit 28-5: refactor(server) - routers.ts createEvent as any → InsertEvent, updateData any → Partial<InsertEvent>
- [x] Commit 28-6: refactor(boundary) - storage.ts data as any → new Uint8Array(data as Buffer), usePersistFn.ts any 주석 보강, input/textarea/dialog.tsx nativeEvent as any 제거
- [x] Commit 28-7: test(types) - TypeScript 에러 0건, 빌드 성공, 테스트 115개 전부 통과, any 검색 결과 전/후 비교 확인

## PR-28 후속: 남은 리스크 any 전부 제거 (2026-06-04)
- [x] server/_core/sdk.ts (data as any) 6건 제거 - SDK 응답 타입 wrapper 도입
- [x] server/events.special.test.ts any 4건 제거 - Event 타입 import 적용
- [x] usePersistFn.ts any 재검토 - 불가피 확인 (useComposition 호환성 문제로 유지, 주석 보강)

## PR-29: 다국어 랜딩 카피 품질 및 병원 정보 single source 정리 (2026-06-04)
- [x] Commit 29-1: audit - 병원 정보 충돌(범일로 97 vs 서면로 74 vs 서면문화로 27) 및 JA/ZH 깨진 표현 전수 파악
- [x] Commit 29-2: fix(constants) - CLINIC_INFO 주소 서면로 74 / 우편번호 47189 / description 오타(울쓰라피→울쎄라피) 수정
- [x] Commit 29-3: fix(content) - i18n.ts/Footer.tsx/ContactSection.tsx/App.tsx/Directions.tsx 주소 기준값 통일
- [x] Commit 29-4: fix(copy) - LandingJA スタ皮膚科→スター皮膚科, LandingZH 热玻吵→热玛吉/皮秒激光筐→皮秒激光/中文和询→中文咨询 교정
- [x] Commit 29-5: fix(copy) - Footer brandDesc JA/ZH 브랜드명 표기 통일 및 톤 개선
- [x] Commit 29-6: test - TypeScript 에러 0건, 빌드 성공, 테스트 115개 전부 통과, 검색 검증 완료

## PR-30: orphan/legacy page 상태 명시 및 운영 페이지 경계 정리

- [x] Commit 30-1: live route vs unrouted page 분류 초안 작성
- [x] Commit 30-2: Reserve.tsx legacy 상태 명확화 (LEGACY PAGE - NOT ROUTED 주석 + TO REACTIVATE 가이드)
- [x] Commit 30-3: Doctors/Directions/Facilities/Events.tsx unrouted 상태 주석 추가 (DORMANT PAGE - NOT ROUTED)
- [x] Commit 30-4: App.tsx Switch 블록 상단에 PAGE LIFECYCLE POLICY 주석 추가
- [x] Commit 30-5: 5개 unrouted page SeoHead 앞에 inactive canonical 주석 추가
- [x] Commit 30-6: TypeScript 에러 0건, 빌드 성공, 테스트 115개 전부 통과

## PR-31: TreatmentPage/TreatmentDetail 구조 역할 정리 및 canonical 정책 확정

- [x] Commit 31-1: 두 route 구조 비교 및 canonical owner 확정 (TreatmentPage 선택)
- [x] Commit 31-2: TreatmentDetail.tsx legacy route 주석 상세화 (STATUS/WHY/MIGRATION PLAN/DO NOT)
- [x] Commit 31-3: TreatmentDetail SEO 신호 정리 (noindex=true + NAME_TO_SLUG 매핑으로 canonical 정렬)
- [x] Commit 31-4: App.tsx TREATMENT DETAIL ROUTES 주석으로 ownership 명확화
- [x] Commit 31-5: 후속 통합 로드맵 문서화

## PR-31 후속 통합 로드맵 (현재 보류 이유 포함)

### 현재 상태 (PR-31 완료 시점)

TreatmentPage (`/treatments/:slug`) 가 canonical owner이며 3개 시술(ulthera, thermage, under-eye-fat) 운영 중.
TreatmentDetail (`/treatment/:name`) 은 legacy bridge route로 7개 시술 운영 중, noindex 적용.

### 지금 바로 하지 않는 이유

1. TreatmentDetail의 4개 미이전 시술(울쎄라피 프라임, 피코레이저, 루비피코레이저, 안면홍조 치료)에 대한 다국어 콘텐츠(en/ja/zh)가 아직 준비되지 않음.
2. 301 redirect 추가 전에 slug 매핑이 완전히 확정되어야 하며, 잘못된 redirect는 SEO 손실을 야기함.
3. 이번 PR은 "정책 정리"가 목적이며 구조 전면 통합은 별도 PR에서 진행.

### 후속 PR 실행 계획 (PR-32 이후)

#### Step 1 — 미이전 시술 slug 데이터 파일 생성 (PR-32)

- [ ] `client/src/data/treatments/ulthera-prime.ts` 생성 (울쎄라피 프라임, ko/en/ja/zh)
- [ ] `client/src/data/treatments/pico-laser.ts` 생성 (피코레이저, ko/en/ja/zh)
- [ ] `client/src/data/treatments/ruby-pico-laser.ts` 생성 (루비피코레이저, ko/en/ja/zh)
- [ ] `client/src/data/treatments/rosacea.ts` 생성 (안면홍조 치료, ko/en/ja/zh)
- [ ] `client/src/data/treatments/index.ts`에 4개 slug 등록
- [ ] TreatmentDetail의 NAME_TO_SLUG 테이블에 4개 매핑 추가

#### Step 2 — 301 redirect 추가 (PR-33, Step 1 완료 후)

- [ ] App.tsx에서 `/treatment/:name` route를 redirect 컴포넌트로 교체
- [ ] redirect 로직: `NAME_TO_SLUG[name]`이 있으면 `/treatments/${slug}`로 301, 없으면 404
- [ ] redirect 안정화 기간: 30일 이상 운영 후 TreatmentDetail 삭제 검토

#### Step 3 — TreatmentDetail 제거 (PR-34, Step 2 완료 후 30일+)

- [ ] `/treatment/:name` route 제거
- [ ] `client/src/pages/TreatmentDetail.tsx` 파일 삭제
- [ ] App.tsx에서 TreatmentDetail import 제거
- [ ] 관련 테스트 정리

### slug 매핑 확정 테이블 (PR-31 기준)

| treatment.name | slug | 상태 |
|---|---|---|
| 울쎄라 | ulthera | 이전 완료 (TreatmentPage 운영 중) |
| 써마지 FLX | thermage | 이전 완료 (TreatmentPage 운영 중) |
| 눈밑지방재배치 | under-eye-fat | 이전 완료 (TreatmentPage 운영 중) |
| 울쎄라피 프라임 | ulthera-prime | 미이전 (Step 1 대상) |
| 피코레이저 | pico-laser | 미이전 (Step 1 대상) |
| 루비피코레이저 | ruby-pico-laser | 미이전 (Step 1 대상) |
| 안면홍조 치료 | rosacea | 미이전 (Step 1 대상) |

## PR-31 남은 리스크 처리 (PR-32/33/34)

- [x] PR-32: ulthera-classic.ts slug 데이터 파일 생성 (ko/en/ja/zh)
- [x] PR-32: pico-laser.ts slug 데이터 파일 생성 (ko/en/ja/zh)
- [x] PR-32: ruby-pico-laser.ts slug 데이터 파일 생성 (ko/en/ja/zh)
- [x] PR-32: rosacea.ts slug 데이터 파일 생성 (ko/en/ja/zh)
- [x] PR-32: treatments/index.ts에 4개 slug 등록
- [x] PR-32: TreatmentDetail NAME_TO_SLUG 테이블에 4개 매핑 추가
- [x] PR-33: App.tsx /treatment/:name route를 redirect 컴포넌트로 교체
- [x] PR-33: redirect 로직 구현 (NAME_TO_SLUG 있으면 /treatments/:slug, 없으면 /404)
- [x] PR-34: treatment.routes.seo.test.ts redirect 동작 검증 테스트 추가
- [x] PR-34: 전체 테스트 127개 통과 확인 (PR-32/33 신규 12개 추가)

## PR-35: 다국어 SEO 정합성 정리 (ForeignGuide/NonCoveredGuide/Equipment2/About)

- [x] ForeignGuide.tsx - activeLang 기반 pageUrl 계산, canonical/ogUrl/title/description/keywords 정렬
- [x] NonCoveredGuide.tsx - lang 기반 pageUrl 계산, canonical/ogUrl/title/description/keywords 정렬
- [x] Equipment2.tsx - useLang 추가, lang 기반 pageUrl 계산, canonical/ogUrl/ogLocale/hreflangs/title/description/keywords 정렬
- [x] About.tsx - lang 기반 pageUrl 계산, canonical/ogUrl/title/description/keywords 정렬
- [x] Privacy.tsx - noindex=true 확인, 수정 불필요
- [x] 전체 TypeScript 에러 0건 확인
- [x] 테스트 127개 전부 통과 확인
- [x] 빌드 성공 확인

## PR-36: About/Privacy 번역 완성도 및 SEO 정책 정리

- [x] About.tsx 본문 i18n 교체 (소개 문단, 특징 박스, access 레이블 4개 언어 분기)
- [x] About.tsx 깨진 문자열 0건 확인 (이미 정상 상태)
- [x] About.tsx SEO 정책: localized live (canonical/ogUrl/ogLocale/hreflangs 4개 언어 정렬)
- [x] Privacy.tsx SEO 정책: noindex live (ko 원문 단일 운영, ogUrl 명시적 추가)
- [x] Privacy.tsx lifecycle 주석 추가 (법률 문서 특성상 ko 단일 운영 근거 명시)
- [x] App.tsx about/privacy route 그룹에 SEO 정책 주석 추가
- [x] TypeScript 에러 0건, 테스트 127개 통과, 빌드 성공

## PR-37: 레거시 브리지 문서화 정확성 및 남은 TODO 실행 가능성 정리
- [x] Commit 37-1 (audit): TreatmentRedirect "permanent" 표현 오류 확인, Reserve.tsx noindex 누락 확인, routers.ts/email.ts TODO 구체화 필요 확인
- [x] Commit 37-2: TreatmentRedirect.tsx - "permanent" 표현을 "SPA route replacement (replace history)" 로 정정
- [x] Commit 37-3: Reserve.tsx - SeoHead에 noindex={true} 추가, 주석 강화 (NOT ROUTED 명시, 활성 예약 진입점 4개 언어 명시)
- [x] Commit 37-4: email.ts - 파일 헤더에 CURRENT STATUS / TO ENABLE 절차 명시, sendEmail() 함수 주석 no-op stub 명시
- [x] Commit 37-4: routers.ts line 788 - TODO → NOTE로 교체, users.email 존재 확인 + no-op stub 이유 + SMTP 연동 후 활성화 방법 명시
- [x] Commit 37-5: TypeScript 에러 0건, 테스트 127개 전부 통과, 빌드 성공 확인

## PR-38: 남은 정책 불일치와 레거시 문서화 이슈 마무리
- [x] Commit 1 (audit): 각 파일 현재 상태 점검 — ForeignGuide/NonCoveredGuide/Equipment2/About/Privacy/TreatmentRedirect/Reserve/email.ts/routers.ts 전부 PR-35~37에서 이미 처리됨 확인
- [x] Commit 2 (seo): ForeignGuide.tsx / NonCoveredGuide.tsx 파일 헤더에 [PAGE LIFECYCLE] localized live 정책 주석 추가 (route/canonical/ogUrl/ogLocale/hreflangs/noindex 명시)
- [x] Commit 3 (seo): Equipment2.tsx 파일 헤더에 [PAGE LIFECYCLE] localized live 정책 주석 추가
- [x] Commit 4 (policy): About.tsx 정책 주석 PR-38 기준 업데이트 (ogUrl/ogLocale/hreflangs 명시), Privacy.tsx noindex 이유/범위/다국어 route 관계 명확화 (hreflangs 없음 명시)
- [x] Commit 5 (legacy): Reserve.tsx 사용되지 않는 COMMON_HREFLANGS import 제거
- [x] Commit 6 (todo): server/routers.ts, server/email.ts TODO 0건 확인 (PR-37에서 처리 완료)
- [x] Commit 7 (verification): TypeScript 에러 0건, 테스트 127개 전부 통과, 빌드 성공

## PR-39: 다국어 UI 일관성, /foreign-guide alias 정책, legacy reserve signal, 서버 TODO 구체화

- [x] Commit 2 (foreign-guide): ForeignGuide.tsx [ALIAS POLICY] 섹션 추가 — /foreign-guide = /en/foreign-guide 영어 alias 명확화, App.tsx route 그룹에 alias 정책 주석 추가
- [x] Commit 3 (i18n-ui): About.tsx "About Us"→{aboutUsLabel}, alt="의료진"→{medicalTeamAlt}, "Since 2006"→{sinceLabel} lang-aware 처리 (ko/en/ja/zh 4개 언어)
- [x] Commit 3 (i18n-ui): Equipment2.tsx sr-only h1 → ko/en/ja/zh lang-aware 처리 (한국어 오타 울쓠라→울쎄라 수정 포함)
- [x] Commit 4 (privacy-ux): Privacy.tsx useLang import 추가, NON_KO_NOTICE 상수 추가, 비-ko route 접근 시 법률 원문 안내 배너 렌더링 (en/ja/zh 각 언어로 짧은 안내)
- [x] Commit 5 (legacy): Reserve.tsx SeoHead에서 canonical 제거 (noindex-only로 단순화), 주석에 "canonical is intentionally omitted (PR-39)" 명시
- [x] Commit 6 (todo): server/routers.ts NOTE 블록에 트리거 시점/데이터 소스/fallback/활성화 방법 명시
- [x] Commit 6 (todo): server/email.ts 파일 헤더에 EMAIL TRIGGER POINTS 3개 및 CURRENT FALLBACK 명시
- [x] Commit 7 (verification): TypeScript 에러 0건, 테스트 127개 전부 통과, 빌드 성공

## PR-40: 다국어 UX/SEO/레거시 문서화 마감
- [x] Commit 2 (header): Header.tsx buildLocalizedPath() 구현 — 현재 페이지 경로 유지하며 locale 전환 (desktop + mobile 모두 적용)
- [x] Commit 3 (foreign-guide): ForeignGuide.tsx 내부 언어 토글 → navigate() 실제 route 이동 연동 (setActiveLang 상태만 변경 → navigate(`/${l}/foreign-guide`))
- [x] Commit 4 (ux): ForeignGuide.tsx back link href=/{activeLang} locale-aware 처리, Privacy.tsx back link locale-aware (en/ja/zh/ko 각 언어 홈으로)
- [x] Commit 5 (copy+legacy): Footer.tsx 일본어 privacy 라벨 오타 수정 (方针 U+9488 → 方針 U+91DD), Reserve.tsx 파일 헤더 주석 간소화
- [x] Commit 6 (sw): sw.js GET-only 필터 추가, CACHE_NAME v2로 버전 업, 주석 영문 보강 (CRITICAL RULES 섹션 추가)
- [x] Commit 7 (verification): TypeScript 에러 0건, 테스트 127개 전부 통과, 빌드 성공

## PR-41: /foreign-guide alias 정책 전체 일관화
- [x] Commit 2 (app): HtmlLangUpdater에 /foreign-guide → en special-case 추가 (LangContext + html[lang] 동기화)
- [x] Commit 3 (foreign-guide): activeLang을 useState → computed value로 변경 (location 파생), useEffect로 LangContext 동기화, globalLang 의존 제거
- [x] Commit 4 (header): buildLocalizedPath에 /foreign-guide 계열에서 ko 선택 시 홈(/) 이동 정책 추가
- [x] Commit 5 (docs): Header 상단 주석 최신화 (언어 전환 드롭다운 실제 구현 반영), Reserve.tsx TO REACTIVATE 절차 제거 (중립적 설명으로 간소화)
- [x] Commit 6 (verification): TypeScript 에러 0건, 테스트 127개 전부 통과, 빌드 성공

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

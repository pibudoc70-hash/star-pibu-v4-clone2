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
- [ ] Google Search Console 메타 태그 인증 (사용자 직접 진행)
- [ ] Google Search Console 사이트맵 제출 (인증 완료 후)


## Phase 25: 최종 단계 - 사이트맵 도메인 오류 수정
- [x] sitemap.xml 도메인 star-pibu.com으로 수정
- [x] 배포 완료
- [x] 네이버 웹마스터도구 인증 및 사이트맵 제출 완료
- [ ] Google Search Console 인증 및 사이트맵 제출 (사용자 직접 진행)

# 모바일 팝업 위치 및 닫기 아이콘 검증

## 적용 범위

`UltheraThermagePromotionPopup`의 최상위 오버레이는 기본적으로 모바일에서만 `items-start` 및 `pt-[max(3rem,env(safe-area-inset-top))]`을 사용하도록 변경했다. `md:items-center md:py-6`을 명시해 768px 이상 데스크톱에서는 기존 중앙 정렬과 여백을 계속 사용한다.

모바일 X 버튼의 배경, 테두리, outline, shadow 제거는 `@media (max-width: 767px)` 내부의 `.promotion-popup-close` 상태 선택자에만 적용했다. 기존 데스크톱 분리 규칙은 `@media (min-width: 768px)` 내부에 그대로 남아 있다. 버튼의 JSX 크기(`size-[52px]`), 컨트롤 위치, 클릭 핸들러는 변경하지 않았다.

## 검증 결과

TypeScript 검사와 팝업 집중 Vitest 7개가 통과했다. 테스트는 모바일 상단 배치 클래스, 데스크톱 중앙 배치 클래스, 모바일/데스크톱 상태별 X 장식 제거 규칙, 52px 클릭 영역, 오늘 하루 숨김, 닫기, 배경 클릭, Esc 및 reduced-motion 동작을 확인한다.

2026-09-17에 390×844 및 1280×720 화면 캡처를 각각 시도했으나 현재 캡처 런타임 오류로 이미지가 생성되지 않았다. 따라서 시각 결과를 과장하지 않으며, CSS 미디어쿼리 분리 및 자동 회귀 테스트로 데스크톱 불변 계약을 확인했다.

# 모바일 이벤트·통증관리 컴팩트 정돈

## 적용 내용

390px 모바일 스페셜 이벤트 목록은 구분선만 연속된 구조에서 벗어나, 각 이벤트를 10px 간격의 독립된 white card로 분리했다. 상단에는 한 번만 보이는 locale-aware `VAT 포함` 안내를 배치하고, 각 행·가격표에서 반복되던 VAT badge는 제거했다. 가격·정상가·할인가·상담/전화 링크는 그대로 유지한다.

통증관리의 세 단계와 FAQ는 기존 native disclosure를 보존했다. 세 단계 아래의 세 개 관리 안내 행은 모바일에서 접힌 `details` 요약으로 바꾸어 초기 세로 길이를 줄였다. 필요할 때만 `관리 안내 보기`를 눌러 기존 안내 행을 확인할 수 있으며, 데스크톱은 계속 3열 안내 strip으로 표시된다.

## 검증

390px Chrome 재측정에서 `scrollWidth`는 390px으로 가로 overflow가 없었다. 통증관리 안내 요약은 터치 후 열렸고 summary 높이는 44px이었다. 모바일 이벤트 데이터는 이 자동 세션에서 지연 skeleton으로 남아 실제 행 탭은 다시 측정하지 못했지만, 행별 상세 토글·공통 VAT 표기·VAT badge 제거는 32개 focused test로 검증했다.

`pnpm check`, `pnpm lint`, `pnpm test:unit`, `pnpm build`를 통과했고 전체 unit test는 1,974개가 통과했다.

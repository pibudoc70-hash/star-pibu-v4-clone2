# 관리장비 FAQ 페이지 검증 기록

## 2026-09-15

- 로컬 미리보기 `/management-device-faq`의 텍스트 추출에서 소노필, 포어덤, 에어버블, 옥시젯, 인바이오, 플로리스, 광선조사기, 에프레이, 이온자임, 힐링브라이트, 메조스킨, 울트라듀오, 트리플물광젯, LDM, 일루미, 트랜스킨의 FAQ 콘텐츠가 순서대로 확인되었다.
- 각 장비는 기존의 두 FAQ 구조를 사용한다. 첫 번째 답변은 `MANAGEMENT_DEVICES`의 locale별 `shortDesc`이며, 두 번째 질문·답변은 기존 인라인 FAQ의 locale별 상담 안내 문구다.
- 동적 DOM 수량 확인은 브라우저 하위 시스템의 crash-loop 제한으로 실행할 수 없었다. 이 수량은 `ManagementDeviceFaq.test.tsx`에서 16개의 `h2`와 16개의 공통 준비 안내 질문으로 검증한다.
- 메인 장비 섹션의 FAQ 버튼과 인라인 영역 부재는 `ManagementDevicesSection.test.tsx` 및 `round5.regression.test.ts`에서 별도로 검증한다.

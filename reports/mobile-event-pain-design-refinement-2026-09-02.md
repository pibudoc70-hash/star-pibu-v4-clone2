# 390px 모바일 스페셜 이벤트·통증관리 디자인 재진단

## 캡처 조건

2026-09-02에 390px CSS viewport, 3x device scale의 실제 Chrome 전체 페이지 캡처를 타일로 나누어 위에서 아래 순서로 확인했다.

## 초기 관찰

| 타일 | 확인 내용 | 판단 |
|---|---|---|
| 001 | Hero·리프팅 이후 Special Event heading과 skeleton 상태가 연결된다. | 초기 skeleton의 카드 높이·여백과 실제 이벤트 목록을 분리해 검토해야 한다. |
| 002 | 이벤트 skeleton 직후 통증관리 panel이 시작된다. 통증관리의 어두운 3개 stage는 제목·아이콘·상태가 한 카드에 충분히 읽히지만, 외곽 panel·trust guide·FAQ의 연속 카드 표면이 길게 이어져 리듬이 무거워 보인다. | 콘텐츠나 target 크기를 줄이지 않고, 모바일 전용 panel hierarchy·surface contrast·카드 간 결속을 정돈할 후보로 기록한다. |
| 003 | 통증관리 FAQ의 답변·행 구분·하단 고지 전환은 읽히지만, trust guide와 FAQ가 모두 큰 밝은 card surface여서 상단 stage의 명확한 리듬과 대비된다. | FAQ의 container chrome을 줄이고 heading·divider 중심의 더 가벼운 정보 묶음으로 정돈할 후보로 기록한다. |
| 004 | 의료진 이후 대형 빈 화면은 콘텐츠 카드가 아닌 아래 지연 섹션 mount 전 캡처 상태로 확인된다. | 이번 스페셜 이벤트·통증관리 디자인 수정 범위 밖이며, 고정 여백 축소로 오인해 변경하지 않는다. |
| 005–006 | 캡처의 후반부는 지연 섹션이 아직 mount되지 않은 백색 영역이다. | 스페셜 이벤트·통증관리와 관계없는 비정상 캡처 상태로 분류한다. |
| 007–008 | 후속 타일도 동일한 지연 mount 전 공백만 표시한다. | 해당 상태를 디자인 대상이나 모바일 고정 여백으로 간주하지 않는다. |
| 009–010 | 남은 하단 capture도 백색 지연 mount 상태다. | 이벤트·통증관리의 디자인 개선 판단에는 상단 실제 콘텐츠 타일과 source/DOM 측정만 사용한다. |
| 011–012 | 마지막 타일도 지연 mount 전의 빈 상태다. | 타일 전체를 순서대로 확인했으며, 신뢰할 수 있는 시각 판단 구간은 001–003으로 한정한다. |

이 문서는 이후 타일 전체 확인과 실제 데이터 로드 상태를 반영해 보완한다.

## 변경 후 390px 재확인

| 타일 | 재확인 결과 |
|---|---|
| 001 | 이벤트 영역은 여전히 지연 로드 skeleton 상태로 캡처됐다. 변경한 실제 event row는 이 세션의 데이터 로드 시점에는 표시되지 않아 화면 비교 범위에서 제외했다. |
| 002 | 통증관리 heading은 좌측 gold rule과 짧아진 type scale로 시작점이 명확해졌다. stage 3개는 한 덩어리로 읽히고, warm trust guide와 white FAQ가 surface를 달리해 이전보다 연속된 큰 카드 느낌이 줄었다. FAQ header와 질문 분리도 선명하게 유지된다. |
| 003 | FAQ 하단의 고지와 다음 의료진 섹션 전환은 과도한 간격 없이 이어진다. 열린 FAQ 답변의 줄 길이와 질문 행 구분도 유지된다. |
| 004 | 의료진 이후 공백은 여전히 지연 mount 전 영역이며, 통증관리 종료부의 고정 margin으로 발생한 것이 아니다. |
| 005–006 | 후속 구간은 지연 mount 전의 빈 상태다. 이벤트·통증관리의 mobile surface 재정돈 판단에는 영향을 주지 않는다. |
| 007–008 | 후속 구간은 지연 mount 전의 빈 상태가 이어진다. |
| 009–010 | 후속 구간은 지연 mount 전의 빈 상태가 이어진다. |
| 011–012 | 마지막 구간도 지연 mount 전의 빈 상태다. 전체 타일 순차 검토를 완료했다. |

## 적용한 재정돈

모바일 Special Event는 한 개의 두꺼운 표면 안에서 header, 안내, 행, 상세가 분명히 구분되도록 정리했다. header·안내·행의 가로 padding을 16px로 맞추고, 행의 action을 텍스트 pill 대신 40px icon control로 축약했다. 상세는 차가운 회색 표면 대신 white surface, 16:9 이미지, 더 짧은 pricing row·CTA 간격을 사용한다. 이벤트 데이터가 이 자동 캡처 세션에서 skeleton으로 남아 실제 row의 시각 비교는 불가했지만, 카드별 inline detail 상태와 desktop 보존은 회귀 테스트로 검증했다.

통증관리는 warm white outer panel, left-aligned mobile heading, 세 단계 navy disclosure, warm trust guide, white FAQ surface라는 다섯 단계의 위계를 사용한다. 각 묶음의 목적이 색과 border로 구분되며, 큰 여백은 늘리지 않았다. 390px 실제 캡처에서 heading·stage·guide·FAQ의 순서, question row, opened answer, 다음 섹션 전환을 확인했다.

## 품질 확인

focused 이벤트·통증관리 테스트 32개와 전체 타입·lint·unit test·production build를 통과했다. 전체 unit test는 1,974개를 통과했다. 모바일 자동 캡처의 event data는 지연 로드 skeleton으로 남아, 실제 데이터 행의 최종 390px 탭 확인은 운영 QA에서 다시 확인할 항목으로 남긴다.

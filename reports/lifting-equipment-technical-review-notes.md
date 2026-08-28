# 리프팅 장비 기술 점검 근거 메모

| 장비 | 공식 확인 내용 | FAQ 점검 반영 |
|---|---|---|
| XERF(세르프) | Cynosure는 다주파 모노폴라 RF(6.78MHz·2MHz), 세 깊이 설정, 냉각 기술을 설명합니다. | “고강도 RF 집중 조사”보다 다주파 모노폴라 RF와 개별 설정이라는 표현이 정확합니다. |
| 텐쎄라 | Tentech는 2라인 HIFU 기술과 SMAS 관련 적용을 설명합니다. | HIFU·SMAS 언급 자체의 사실 오류는 확인되지 않았습니다. 다만 대상 적합성·통증을 단정하는 표현은 최소화합니다. |
| 온다 | DEKA는 2.45GHz Coolwaves® 마이크로웨이브, 목적별 Deep·Shallow 핸드피스, 표적 조직에 제어된 에너지 전달을 설명합니다. | “피부 깊은 층까지 균일하게”라는 포괄적 표현은 공식 설명보다 넓어, 용도·핸드피스·의료진 설정 중심으로 다듬는 것이 적절합니다. |
| BBL 스킨타이트 | Sciton은 SkinTyte가 적외선 광 기술을 이용해 피부 이완의 외관을 개선한다고 설명합니다. | 기존 FAQ의 광 기반 에너지·피부 탄력 관리 설명은 이 범위를 벗어나지 않아 변경하지 않았습니다. |

## 실제 페이지 렌더링 확인

| 경로 | 결과 |
|---|---|
| `/equipment3/울쎄라피프라임` | 짧은 소개와 시술 소개 본문에 기존 장비 대비 최신 플랫폼·1.5mm/3.0mm/4.5mm 치료 깊이·최대 8mm 영상 범위 구분이 렌더링됨을 확인했습니다. |
| `/equipment3/써마지FLX` | 써마지 FLX와 세르프 비교 FAQ에 모노폴라 RF·두 주파수·냉각 기술 중심의 정정 문구가 렌더링됨을 확인했습니다. |
| `/equipment3/슈링크-유니버스` | HIFU 에너지·샷 수를 부위별로 조정한다는 FAQ가 공식 카트리지·개별 계획 설명과 어긋나지 않음을 확인해 변경하지 않았습니다. |
| `/equipment3/온다` | 지방·셀룰라이트·피부 탄력 관리, 2.45GHz Coolwaves®, Deep·Shallow 핸드피스, 의료진 계획 중심의 정정 FAQ가 렌더링됨을 확인했습니다. |
| `/equipment3/텐쎄라` | 기존의 검증되지 않은 장비 간 강도 우열 표현 없이, 2라인 HIFU와 개인별 에너지·샷 수 계획을 설명하는 정정 FAQ가 렌더링됨을 확인했습니다. |

## 출처

[1]: https://www.cynosure.com/xerf/ "Cynosure — XERF"
[2]: https://www.tenlaser.co.kr/default/09/01.php?com_board_basic=read_form&com_board_search_code=&com_board_search_value1=&com_board_page=3&com_board_id=28&com_board_idx=96 "Tentech — 텐쎄라 2라인 HIFU 발표"
[3]: https://dekalaser.com/products/onda/ "DEKA — Onda"
[4]: https://sciton.com/treatment/skintyte-treatments/ "Sciton — SkinTyte"

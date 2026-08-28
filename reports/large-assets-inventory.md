# 프로덕션 홈 대형 이미지 인벤토리

## 수집 방법

`https://star-pibu.com/`을 실제 Chromium 브라우저에서 로드한 뒤 끝까지 순차 스크롤했습니다. 완전히 로드된 DOM 이미지의 `currentSrc`를 수집하고, 각 URL의 최종 HEAD 응답에서 콘텐츠 길이·형식을 측정했습니다. 100KiB 이상인 이미지 11건만 아래 표에 포함했습니다.

## 요약

| 항목 | 값 |
|---|---:|
| 100KiB 이상 실제 로드 이미지 | 11건 |
| 총 전송 용량 | 3,078,570 bytes (3,006.4 KiB) |
| 형식 | WebP 11건 |
| 최대 단일 자산 | 391,020 bytes (상담실) |

## 다음 성능 작업의 표적 목록

| 우선순위 | 표시 역할 | URL | bytes | KiB | 형식 |
|---:|---|---|---:|---:|---|
| 1 | 상담실 | `https://star-pibu.com/manus-storage/facility-multi-skincare-room_ebebe73e_6e67b69a.webp` | 391,020 | 381.9 | webp |
| 2 | 대기실 | `https://star-pibu.com/manus-storage/facility-waiting-room_ce355737_f1c9c5e4.webp` | 372,106 | 363.4 | webp |
| 3 | 스타피부과 환자 상담 | `https://star-pibu.com/manus-storage/patient-consultation-mobile_e2474e05_fb420943_2114c946.webp` | 349,622 | 341.4 | webp |
| 4 | 외관 | `https://star-pibu.com/manus-storage/facility-metaview-room_535d3491_540aa29f.webp` | 348,832 | 340.7 | webp |
| 5 | 시술실 상세 | `https://star-pibu.com/manus-storage/facility-reception-desk_f4dd56dc_df6ccf98.webp` | 334,116 | 326.3 | webp |
| 6 | 최신 장비 | `https://star-pibu.com/manus-storage/choosing-star-03_a440359e_f67b000c.webp` | 273,586 | 267.2 | webp |
| 7 | 대기실 상세 | `https://star-pibu.com/manus-storage/facility-reception-desk-02_1fe4bedc_49736365.webp` | 261,780 | 255.6 | webp |
| 8 | 검증된 경험 | `https://star-pibu.com/manus-storage/choosing-star-01_cd3dce52_18c438e7.webp` | 214,752 | 209.7 | webp |
| 9 | 환자 중심 진료 | `https://star-pibu.com/manus-storage/choosing-star-02_92c1e337_7f575d87.webp` | 213,606 | 208.6 | webp |
| 10 | 시술실 | `https://star-pibu.com/manus-storage/facility-laser-corridor_9e114a15_8ce233f3.webp` | 163,892 | 160.1 | webp |
| 11 | 관리 장비 이미지 | `https://star-pibu.com/manus-storage/mesoskin_new_32137830_3a93cfe5_190392e4.webp` | 155,258 | 151.6 | webp |

## 적용 경계

이 목록은 다음 성능 작업에서 압축·반응형 소스·지연 로딩 우선순위를 정하기 위한 **측정 기반 후보 목록**입니다. 이번 단계에서는 이미지 변환, 스토리지 쓰기, URL 교체, 마크업 변경을 수행하지 않았습니다.

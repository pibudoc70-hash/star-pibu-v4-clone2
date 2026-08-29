# Event·Video JSON-LD 사실성 개선 결과

## 구현 요약

현재 활성 이벤트 11건은 행사 시작·종료일을 담는 DB 컬럼이 없고, 화면 표시용 `date` 값도 서로 다른 형식의 등록/표시 정보일 뿐 실제 행사 기간으로 검증되지 않았습니다. 이에 따라 모두 **날짜 근거가 없는 상시 프로모션**으로 분류했습니다. 더 이상 실행일을 임의로 `Event.startDate`·`Offer.validFrom`에 넣지 않으며, 유효한 ISO `startDate`가 실제로 전달될 때만 Event JSON-LD를 생성합니다. 종료일은 유효하고 시작일보다 이르지 않을 때만 선택적으로 포함합니다.

홈 VideoObject는 기존에 생성기만 있고 실제 homepage JSON-LD에 연결되지 않았습니다. 공식 YouTube watch page에서 채널·제목·공개일을 확인한 한국어 원본 4개만 client homepage schema와 production home prerender schema에 추가했습니다. 공개일·현재 접근성이 확인되지 않은 영상에는 기존 고정값 `2024-01-01`을 대입하지 않고 제외했습니다.

| 항목 | 이전 | 개선 후 |
|---|---|---|
| 날짜 없는 이벤트 | 실행일을 만들어 `EventScheduled`·Offer 출력 | Event schema를 생략하고 breadcrumb·화면·CTA 유지 |
| 실제 시작일이 있는 미래 데이터 | startDate fallback과 혼재 | 유효한 ISO `startDate`만 사용 |
| 종료일 | 값이 있으면 검증 없이 출력 | 유효하고 startDate 이후일 때만 출력 |
| VideoObject uploadDate | 모든 유효 ID에 `2024-01-01` 고정 | 공식 공개일이 확인된 4건의 실제 날짜만 출력 |
| 홈 VideoObject 출력 | helper 미연결 | 한국어 홈 client + server prerender에서만 출력 |
| 비한국어 홈 | 해당 없음 | 한국어 원본 VideoObject를 의도적으로 제외 |

## 실제 분류 및 VideoObject 대상

| 분류 | 수량 | 처리 |
|---|---:|---|
| 날짜 기반 Event | 0 | Event JSON-LD 생성 없음 |
| 날짜 미확인 상시 프로모션 | 11 | Event·EventScheduled·Offer.validFrom 미생성 |
| 실제 공개일 확인 YouTube 영상 | 4 | VideoObject에 실제 uploadDate 반영 |
| 공개일·제목·현재 접근 중 하나 이상 미확인 활성 영상 | 16 | VideoObject에서 제외, 관리자 확인 후 별도 추가 |

| videoId | VideoObject uploadDate | 확인 근거 |
|---|---|---|
| `XiOTXhPx7qw` | `2024-09-06` | 공식 [YouTube watch page][1] |
| `s2ny6-qC9go` | `2025-07-09` | 공식 [YouTube watch page][2] |
| `b49aByjIskc` | `2026-06-24` | 공식 [YouTube watch page][3] |
| `6g2ngrso1uw` | `2026-01-14` | 공식 [YouTube watch page][4] |

검증 과정에서 `RuJSEpsvy_Q`는 등록 제목과 다른 페이지가 반환됐고, `No4MdF4XqGg`는 해당 시점에 content unavailable이 표시됐습니다. 두 ID를 포함한 미확인 16건은 날짜를 추측해 포함하지 않았습니다. 세부 증거·전체 제외 목록은 `reports/event-video-seo-evidence-2026-08-29.md`에 보존했습니다.

## 보존한 계약

Event 상세의 제목·이미지·가격·본문·외부 상담/예약 CTA, 이벤트 라우트, canonical/hreflang, sitemap, 장비 목록·상세의 라이트/다크 테마, 의료·다국어 데이터는 변경하지 않았습니다. DB 스키마·events 행·youtubeVideos 행도 변경하지 않았습니다. Google은 실제 이벤트가 아닌 할인·프로모션을 Event로 표시하지 말라고 명시하므로, 이번 Event 생략 처리의 근거가 됩니다.[5]

## 검증

| 게이트 | 결과 |
|---|---|
| Event/Video·home prerender·SeoHead ownership 집중 테스트 | 5개 파일, 111개 테스트 통과 |
| 상세 스켈레톤·FAQ 순서 기존 회귀 | 2개 파일, 7개 테스트 통과 |
| 전체 테스트 | 211개 파일, 1,925개 테스트 통과 |
| TypeScript | `pnpm check` 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| 개발 미리보기 이벤트 상세 | `/events/10560001`에서 제목·이미지·이벤트 상세·카카오톡/전화 CTA·footer 표시 유지 |

전체 테스트의 첫 실행에서 이전 장비 상세 다크 모드 변경 뒤 남아 있던 문자열 단언 2건이 현재 class/prop 표현과 달라 실패했습니다. 실제 접근성 스켈레톤과 FAQ→정보 카드 순서는 유지돼 있어, 테스트만 현재의 동작 동등한 표현으로 갱신한 뒤 전체 1,925개가 통과했습니다.

## 후속 운영 과제

실제 일회성 행사 Event schema를 운영하려면 `events`에 검수된 ISO 시작일(필수)과 선택 종료일을 별도 데이터로 관리하고, 일반 할인·장비 프로모션과 구분하는 운영 상태가 필요합니다. VideoObject를 확대하려면 관리자 화면에서 각 YouTube ID의 공식 URL·공개일·공식 제목을 확인해 `VERIFIED_YOUTUBE_VIDEO_SEO`에만 추가해야 합니다. `VideoObject`는 노출 보장이 아니라, 사실에 맞는 동영상 정보를 제공하기 위한 메타데이터입니다.[5]

## References

[1]: https://www.youtube.com/watch?v=XiOTXhPx7qw "눈밑지방재배치 부작용 무서워서 할까말까 고민이신 분!!"
[2]: https://www.youtube.com/watch?v=s2ny6-qC9go "울쎄라, 써마지 효과 제대로 보려면 샷수와 함께 이것도 체크하세요!"
[3]: https://www.youtube.com/watch?v=b49aByjIskc "피부에 줄기세포 주사는 어떤 효과가?"
[4]: https://www.youtube.com/watch?v=6g2ngrso1uw "울쎄라, 써마지 둘 다 리프팅이면 뭐가 달라요?"
[5]: https://developers.google.com/search/docs/appearance/structured-data/event "Google Search Central — Event structured data"

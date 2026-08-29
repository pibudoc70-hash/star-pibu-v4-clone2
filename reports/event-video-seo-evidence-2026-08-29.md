# Event·Video 구조화 데이터 근거 및 분류 기록

## Event 읽기 전용 분류

활성 `events` 11건을 DB의 type·category·special flag·표시 date·설명·본문과 공개 상세 화면으로 대조했습니다. 모든 행은 `type=이벤트`, `category=이벤트`, `isSpecialEvent=1`이지만, `startDate`·`endDate` 컬럼이 없고 표시 date는 `2026.07.08`, `26.06.25`, `20260507`, `날짜`처럼 형식이 일관되지 않으며 행사 기간·시각을 나타내는 근거가 아닙니다. 본문과 설명에도 행사 기간은 확인되지 않았습니다.

| 분류 | 건수 | 대상 | JSON-LD 처리 |
|---|---:|---|---|
| 실제 날짜 기반 행사 | 0 | 없음 | Event 생성 대상 없음 |
| 상시 프로모션·날짜 미확인 이벤트 | 11 | 스타 메타셀 MCT, ULTHERAPY PRIME, ウルセラプライ, 울쎄라피 프라임, 써마지 FLX, 벨로테로 리바이브, 리투오 이벤트, 눈밑지방재배치, 세르프 리프팅, 텐써마 리프팅, 온다 리프팅 | Event·EventScheduled·Offer.validFrom을 생성하지 않음 |

개발 미리보기의 `/events/10560001`은 `스타 메타셀 MCT`, 표시 date `2026.07.08`, 이미지, 이벤트 상세 제목, 카카오톡 상담·전화 예약 CTA를 정상 표시했습니다. Event JSON-LD 생략은 화면 본문·CTA·breadcrumb과 무관하게 처리해야 합니다.

## 공식 YouTube 공개일 근거

홈 VideoObject에는 공식 YouTube watch page에서 채널 표기·제목·공개일을 함께 확인한 4개만 포함합니다. `youtubeVideos`의 활성 20건 중 나머지 16건은 이번 수집에서 공개일이 확인되지 않았거나, 해당 시점에서 영상 접근/제목 일치가 확인되지 않아 임의 날짜를 넣지 않았습니다.

| videoId | 확인된 공개일 | 출처 | 반영 |
|---|---|---|---|
| `XiOTXhPx7qw` | 2024-09-06 | [YouTube watch page][1] — 부산피부과전문의 조시형 채널 표기·영상 제목·공개일 확인 | 포함 |
| `s2ny6-qC9go` | 2025-07-09 | [YouTube watch page][2] — 부산피부과전문의 조시형 채널 표기·영상 제목·공개일 확인 | 포함 |
| `b49aByjIskc` | 2026-06-24 | [YouTube watch page][3] — 부산피부과전문의 조시형 채널 표기·공개일 확인 | 포함 |
| `6g2ngrso1uw` | 2026-01-14 | [YouTube watch page][4] — 부산피부과전문의 조시형 채널 표기·공개일 확인 | 포함 |
| `RuJSEpsvy_Q` | 미확인 | [YouTube watch page][5]에서 등록 제목과 다른 `Sublocade DTC Moments 2026` 페이지가 반환됨 | 제외·관리자 확인 필요 |
| `No4MdF4XqGg` | 미확인 | [YouTube watch page][6]에서 과거 제목·채널 표기는 보이나 현재 content unavailable 표시 | 제외·관리자 확인 필요 |
| 기타 활성 14건 | 미확인 | watch page가 제목만 제공하거나 공개일을 반환하지 않음 | 제외 |

공식 채널 검색 결과는 `https://www.youtube.com/channel/UChXTq-7qSDvLcxtzsm5LKUQ` 및 `@starpibu`를 부산피부과전문의 조시형 채널로 표시합니다.[7]

## 구조화 데이터 적용 원칙

Google Event 가이드라인은 각 Event에 실제 이름·시작일·장소를 정확히 표시하고, 단기 할인·쿠폰·구매 기회를 Event로 표시하지 말 것을 요구합니다.[8] 따라서 활성 프로모션 11건에는 Event schema를 생략합니다. VideoObject는 실제 공개일을 확인한 공식 영상만 포함하고, 한국어 원본 영상이므로 한국어 홈의 client JSON-LD 및 server prerender에만 포함합니다.

## References

[1]: https://www.youtube.com/watch?v=XiOTXhPx7qw "눈밑지방재배치 부작용 무서워서 할까말까 고민이신 분!!"
[2]: https://www.youtube.com/watch?v=s2ny6-qC9go "울쎄라, 써마지 효과 제대로 보려면 샷수와 함께 이것도 체크하세요!"
[3]: https://www.youtube.com/watch?v=b49aByjIskc "피부에 줄기세포 주사는 어떤 효과가?"
[4]: https://www.youtube.com/watch?v=6g2ngrso1uw "울쎄라, 써마지 둘 다 리프팅이면 뭐가 달라요?"
[5]: https://www.youtube.com/watch?v=RuJSEpsvy_Q "YouTube watch page"
[6]: https://www.youtube.com/watch?v=No4MdF4XqGg "YouTube watch page"
[7]: https://www.youtube.com/channel/UChXTq-7qSDvLcxtzsm5LKUQ "부산피부과전문의 조시형 YouTube channel"
[8]: https://developers.google.com/search/docs/appearance/structured-data/event "Google Search Central — Event structured data"

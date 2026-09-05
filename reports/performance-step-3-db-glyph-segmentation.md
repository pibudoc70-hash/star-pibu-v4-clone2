# STEP 3 — 운영 글리프 기반 Pretendard 2단 분할

## 결론

단일 548,764B Korean face와 전체 `U+AC00-D7AF` 선언을 중단했다. 새 정책은 **1차**에 실제 client/shared source와 운영 DB에서 관측된 한글 음절, 그리고 실제 홈 DOM에서 확인된 추가 한 글자를 넣고, **2차**에 나머지 한글 음절을 정확히 보완한다. 두 face는 Hangul syllable 영역에서 겹치지 않으며, `font-display: swap`, variable weight, Noto Sans KR 폴백은 유지된다.

| 항목 | 결과 |
|---|---:|
| source 한글 음절 | 831 |
| 운영 DB 한글 음절 | 660 |
| source+DB+runtime 1차 집합 | 852 |
| 1차 WOFF2 | 153,344B |
| 2차 WOFF2 | 1,615,696B |
| Hangul 전체 | 11,172 |
| 2차 보완 음절 | 10,320 |
| overlap / missing | 0 / 0 |
| 생성 WOFF2 cmap 누락 | 1차 0 / 2차 0 |

과거 814자 수치는 이전 소스 기준이었다. 최신 `client/src`와 `shared`를 다시 감사한 결과 source만 831자이며, 운영 DB 합집합 및 실제 홈 runtime에서 확인된 `툼`까지 넣어 1차 852자로 확정했다. DB 읽기는 `information_schema` 메타데이터와 SELECT로만 수행했고, 문구 원문은 보고서·로그에 기록하지 않았다.

| 읽기 전용 DB 대상 | 행 수 | 고유 한글 음절 |
|---|---:|---:|
| notices | 12 | 370 |
| events | 753 | 113 |
| popupEvents | 0 | 0 |
| treatments | 8 | 248 |
| equipment3 | 73 | 637 |

## 홈 네트워크 및 기호 QA

새 Chromium 세션 세 번에서 홈 전체를 스크롤해 지연 섹션까지 mount한 뒤 Resource Timing을 확인했다. 매번 1차 WOFF2만 요청됐고 2차 WOFF2 요청, audited primary 밖 한글, 누락 text node는 모두 0이었다. `/equipment3`에서 후보 13개 중 `✨`는 실제 DOM에 표시되었다. 원본 Pretendard와 Latin·1차·2차 cmap 모두 해당 기호를 보유하지 않으므로, 이 기호는 기존 Noto/system fallback이 의도대로 렌더한다. 폰트에 존재하지 않는 emoji를 억지로 한국어 subset에 넣지 않았다.

최종 공개 `https://star-pibu.com/`에서도 독립 Chromium 세션 3회가 모두 primary URL만 Resource Timing에 기록했고 secondary는 0회였다. 두 storage URL은 각각 최종 307 뒤 `font/woff2` 200으로 확인됐다. primary는 153,344B, secondary는 1,615,696B이며, secondary는 실제 필요할 때만 받을 수 있다.

`audit-korean-glyphs.mjs`, `build-pretendard-db-segments.py`, `audit-pretendard-symbol-cmap.py`는 재감사·disjoint range 압축·생성 font cmap 검증을 재현한다. `PretendardDbSegmentManifest.test.ts`는 11,172 전체 coverage와 output missing 0을 CI에서 확인한다.

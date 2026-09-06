# WebMCP 광고·전환 적합성 평가

**결론:** 현재 스타피부과 홈페이지에는 **즉시 적용을 권장하지 않습니다.** WebMCP는 광고 플랫폼의 입찰·타기팅·광고 품질점수를 직접 개선하는 기능이 아니라, 사용자가 이미 사이트를 연 뒤 AI 에이전트가 사이트 기능을 더 신뢰성 있게 실행하도록 돕는 제안 단계의 브라우저 API입니다.[1] Google Ads의 Quality Score 진단 요소는 예상 CTR, 광고 관련성, 랜딩페이지 경험이며 WebMCP는 명시된 직접 요소가 아닙니다.[2]

| 관점 | 현재 효과 | 판단 |
|---|---|---|
| Google·Naver·Kakao 광고 입찰/노출 | 직접 신호 또는 입찰 가산 근거 없음 | **도입 근거 없음** |
| AI 검색·추천에서의 노출 | 에이전트가 직접 사이트를 방문하고 해당 브라우저가 지원해야 tool을 발견 가능 | 초기 단계의 간접 가능성만 있음 |
| 상담 정보 찾기 | `find_treatment` 같은 읽기 전용 tool은 향후 탐색 실패를 줄일 수 있음 | **2순위 파일럿 후보** |
| 예약·상담 접수 | 개인정보·의료 상담·외부 네이버/카카오 예약 handoff가 포함됨 | 현재는 **미도입** |
| 운영·보안 | 공식 문서상 origin isolation 및 Permissions Policy가 필요하고, Chrome 149 origin trial 단계 | 브라우저 지원·운영 비용 대비 불확실성 큼[1] |

현재 공개 응답은 CSP와 `Cross-Origin-Opener-Policy: same-origin-allow-popups`를 사용하고 있으며 WebMCP origin isolation을 위한 추가 보안 헤더 검증·외부 iframe 영향 분석이 필요합니다. 따라서 단순 코드 삽입은 안전하지 않습니다. 또한 현행 전환은 전화, KakaoTalk, Naver 예약처럼 외부 서비스 handoff를 사용하므로, agent tool이 예약을 자동 완료하거나 개인·건강 정보를 수집해서는 안 됩니다.

권장 순서는 다음과 같습니다. 먼저 광고 효과는 속도, 광고 키워드-랜딩페이지 일치, 연락 수단의 명료성, 전환 측정으로 개선합니다. WebMCP는 Chrome 지원이 확대된 뒤 별도 origin에서 읽기 전용 `find_treatment` 또는 `open_contact_options`처럼 의료 판단·예약 실행·개인정보 입력이 없는 tool 하나로 2주 파일럿을 진행하는 것이 적절합니다. 파일럿은 일반 사용자와 기존 예약 CTA를 바꾸지 않고, tool 발견·호출·상담 CTA 도달률만 익명 집계해야 합니다.

> WebMCP는 **광고 최적화 도구가 아니라 agent-assisted site use의 점진적 기능 강화**로 분리해서 판단해야 합니다.

## References

[1]: https://developer.chrome.com/docs/ai/webmcp "WebMCP | AI in Chrome — Chrome for Developers"
[2]: https://support.google.com/google-ads/answer/6167118?hl=en "About Quality Score for Search campaigns — Google Ads Help"

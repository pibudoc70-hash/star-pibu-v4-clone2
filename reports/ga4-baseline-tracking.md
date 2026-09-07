# GA4 기본 추적 설정 기록

**적용 도메인:** `star-pibu.com`  
**측정 ID:** `G-3CFK5RHK4T`  
**범위:** GA4 기본 페이지 조회만 적용했습니다. Google Ads 태그 ID와 전환 라벨이 제공되지 않았으므로 Google Ads 전환 이벤트·리마케팅·광고 개인화는 적용하지 않았습니다.

| 항목 | 구현 상태 | 개인정보·중복 방지 원칙 |
|---|---|---|
| Google tag | `https://www.googletagmanager.com/gtag/js?id=G-3CFK5RHK4T`를 비동기로 1회 삽입 | 구 측정 ID는 배포 번들에 포함하지 않음 |
| GA4 config | 자동 pageview는 끄고 SPA tracker가 명시 전송 | HMR/재초기화 시 config 중복 차단 |
| Page view | 첫 진입 및 client route 변경마다 1회 | query string·hash 제거, `page_path`·origin·제목·언어만 전송 |
| 광고 신호 | `allow_google_signals: false`, `allow_ad_personalization_signals: false` | Ads ID·동의 범위가 확정되기 전 광고 개인화 비활성 |
| 전환 이벤트 | 미적용 | 전화번호, 상담본문, 건강정보, 예약정보, 해시 식별자는 전송하지 않음 |
| CSP | Google tag script와 GA collection endpoint만 추가 허용 | 기존 Maps·Umami 출처 및 다른 보안 지시문 유지 |
| 개인정보처리방침 | Google Analytics의 웹 이용 통계·성능 측정 수탁 항목을 추가 | 실제 사용 중인 분석 도구 고지와 일치 |

production-like Chromium 검증에서 태그 script 1회, GA4 config 1회, `page_view` 1회를 확인했습니다. 테스트 URL에는 query string과 hash가 있었으나 전송 `page_path`에는 포함되지 않았습니다. Google 태그 script가 `G-3CFK5RHK4T`로 요청되는 것도 확인했습니다.

> 법률 자문이 아닙니다. GA4를 지속 운영하기 전에는 병원의 개인정보처리방침, 쿠키 고지 및 국외 이전·위탁 고지의 구체적 적합성을 개인정보 담당자 또는 법률 전문가와 검토해야 합니다.

## Google Ads 후속 입력값

Google Ads 전환 수신까지 검증하려면 `AW-...` Ads 태그 ID, 각 전환의 label, 그리고 Primary로 둘 전환 1개(초기에는 모두 Secondary 권장)가 필요합니다. 값이 제공되기 전에는 외부 예약·전화·Kakao/WeChat 클릭을 Ads 전환으로 송신하지 않습니다.

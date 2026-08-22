# Genspark v2 6-action 선별 적용 감사

## 결론

현재 홈페이지에는 병원·의료진·시술·FAQ·WebSite JSON-LD, 다국어 canonical/hreflang, treatment SSR metadata, WebP 기반 이미지 파이프라인, hero preload가 이미 구현되어 있다. 따라서 제안 전체를 새 폴더·대량 콘텐츠로 그대로 적용하면 기존 책임과 중복되거나, 검증되지 않은 의료·가격·비교 문구를 대량 추가하는 위험이 크다.

이번에는 유일하게 빠져 있던 **시술 상세 JSON-LD의 BreadcrumbList**를 client와 crawler-facing SSR에 함께 추가했다. 이 변경은 URL·표시 콘텐츠·의료 표현을 바꾸지 않으며, 홈 → 시술 목록 → 현재 시술의 canonical 관계만 구조화 데이터로 명시한다.

| 제안 액션 | 현재 상태 | 이번 판정 | 근거와 재개 조건 |
|---|---|---|---|
| ① JSON-LD 6종 | MedicalClinic, Physician, MedicalProcedure, FAQPage, WebSite가 기존 helper/SSR에 존재 | **부분 적용 완료** | BreadcrumbList만 누락되어 추가. 별도 schema 파일 6개 생성은 중복 구조가 됨. |
| ② 자사 콘텐츠 허브·초기 20편 | `/blog/` route와 검증된 20편 원고 없음 | **보류** | 각 글의 의료 근거, 작성자/검수자, 이미지 권리, 광고 표현 검토 후 정보구조부터 별도 설계 필요. |
| ③ 롱테일 랜딩 12개 | 신규 URL·다국어·sitemap·canonical 작업 필요 | **보류** | 기존 URL 안정성 원칙상 검증 없는 대량 route 생성 금지. 검색 수요와 시술 제공 범위를 먼저 확인해야 함. |
| ④ 중립 비교 5편 | 경쟁 비교·효과·회복·가격 근거 자료 없음 | **보류** | 의료광고 및 사실 검증 검토가 끝난 approved source brief가 필요. |
| ⑤ 네이버 이중 발행 | 네이버 계정·발행 권한·원문 검수 workflow 미확인 | **보류** | 사이트 코드가 아니라 외부 채널 운영 작업. 승인된 원고와 Naver access 후 진행. |
| ⑥ CWV 목표 | WebP/AVIF 허용, image optimization, hero preload가 존재 | **보류** | LCP/INP/CLS 목표치는 실측 데이터가 없으므로 코드만으로 달성 선언 불가. PageSpeed Insights와 Search Console field data가 필요. |

## 다음 안전 순서

먼저 Google Search Console과 네이버 서치어드바이저의 실제 query/page/index 데이터를 확보한다. 그 다음 검색 수요와 제공 시술이 확인된 한 개의 주제만 선택해, 의료광고 검수 완료 원고를 기반으로 콘텐츠 정보구조와 route 정책을 별도 작업으로 설계한다. Core Web Vitals는 실측 결과에서 LCP 요소나 CLS 원인이 확인된 경우에만 한 항목씩 고친다.

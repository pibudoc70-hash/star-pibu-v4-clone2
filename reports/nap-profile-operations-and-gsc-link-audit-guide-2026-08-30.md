# 스타피부과 NAP 대조표·URL 연결 문의·Search Console 90일 링크 감사 가이드

> **운영·의료광고 유의:** 이 문서는 공개 정보와 운영 절차에 기반한 실무 가이드이며 법률 자문이 아닙니다. 병원 소개·시술·할인·후기와 결합된 외부 프로필/문의 문구는 게시 또는 변경 전에 의료광고 심의 기준과 플랫폼 정책을 병원 담당자 또는 자문 전문가가 확인해야 합니다. 이 가이드는 프로필 변경·메일 발송·Search Console 데이터 내보내기를 대신 실행하지 않습니다.

## 1. 정본 NAP (변경 기준)

공식 `https://star-pibu.com/directions`에 공개된 정보만 기준으로 삼습니다. 모든 외부 프로필에서 이 정본과 **의미·숫자·공식 URL**이 일치해야 하며, 문장부호·층 표기는 플랫폼 형식에 맞게 축약할 수 있지만 다른 주소나 이전 도메인을 쓰면 안 됩니다.[1]

| 항목 | 외부 프로필에 입력할 정본 | 허용 가능한 표기 | 사용하지 않을 표기 |
|---|---|---|---|
| 상호 | 스타피부과의원 | 스타피부과의원 | 스타피부과, STAR피부과를 단독 법적 상호처럼 사용 |
| 대표 전화 | 051-818-2300 | 051 818 2300, `+82-51-818-2300` | 다른 상담 번호·개인 휴대전화 |
| 도로명 주소 | 부산광역시 부산진구 서면로 74 아이온시티빌딩 4층(접수·진료) / 2층(줄기세포 연구센터) | 플랫폼 분리 입력 시 “부산 부산진구 서면로 74”, 상세 위치에 층별 안내 | 지번만 단독 표기, 다른 건물명, 오래된 주소 |
| 지번 보조 주소 | 부산 부산진구 부전동 257-3 | 지도 서비스의 보조/검색 주소에만 사용 | 도로명과 상충하는 층·호수 |
| 공식 웹사이트 | `https://star-pibu.com` | `https://www.star-pibu.com`은 리디렉션 확인 시에만 보조 허용 | `http://www.star-pibu.co.kr`, preview/관리자/파라미터 URL |
| 대표 예약/상담 | 플랫폼의 공식 예약/연락 field에만 현재 승인된 링크 사용 | 카카오톡 채널 `https://pf.kakao.com/_HNyGC`, 네이버 예약은 기존 공식 연결 유지 | 링크 구매 페이지·추적 파라미터가 붙은 임시 URL |
| 진료시간 | 월–금 10:00–19:00, 토 09:30–15:00, 일·공휴일 휴진; 평일 점심 13:00–14:00 | 플랫폼의 별도 점심시간/휴무 field 사용 | 확인하지 않은 공휴일·시즌성 시간 |

## 2. 5개 핵심 프로필 NAP 대조표

아래 표는 **2026-08-30 공개 표본**과 운영자 로그인이 필요한 값을 구분합니다. `확인 필요`는 틀렸다는 뜻이 아니라, 공개 페이지 또는 소유자 권한 없이 정확한 field 값을 검증할 수 없다는 뜻입니다. 수정 전에는 반드시 소유자 계정에서 현재 값을 캡처하고 이 표에 수정일·담당자·증빙을 적으십시오.

| 프로필 | 공개 확인 결과 | 상호 | 주소 | 전화 | 웹사이트 URL | 정합성 판정·다음 조치 |
|---|---|---|---|---|---|---|
| Google Business Profile | 공개 지점 URL/소유권을 이번 점검에서 확정하지 못함 | **확인 필요** | **확인 필요** | **확인 필요** | **확인 필요** | 오너 계정에서 profile URL과 NAP·website·hours·category를 정본과 대조. Google은 완전하고 정확한 정보가 지역 검색 노출에 유리하다고 안내함.[2] |
| 네이버 스마트플레이스 | 소유자 관리 화면 확인 필요 | **확인 필요** | **확인 필요** | **확인 필요** | **확인 필요** | 사업자/주인 권한으로 기본 정보·지도 핀·외부 URL·진료시간을 대조. 네이버는 사업자 확인 후 업체 정보를 등록·관리하도록 안내함.[3] |
| 카카오맵·카카오톡채널 | 채널 `@스타피부과의원`/`_HNyGC` 공개 확인. 채널 검색 결과의 주소 표기는 정본의 2층·4층 안내와 의미상 일치 | 일치 추정 | 일치 추정 | **확인 필요** | 채널 URL은 확인, 병원 website field는 **확인 필요** | 카카오톡채널 관리자와 카카오맵 장소 관리자에서 전화·웹사이트 field·지도 pin을 별도 확인. 채널은 지도 프로필을 대체하지 않음. |
| 굿닥 | 병원 페이지 `hospitals/7777`에서 상호·주소·전화·피부과·의료진 3명 표시 | 일치 | 도로명·지번 및 2/4층 안내가 정본과 일치 | 일치 | **미연결:** “웹사이트 연결 정보 없음” | 우선 수정 요청. 아래 템플릿으로 `https://star-pibu.com` 연결을 요청하고, 반영 후 모바일/PC link target을 직접 확인.[4] |
| 모두닥 | 병원 페이지 `hospital/39319/...`에서 상호·주소·대표 전화·홈페이지 action 표시 | 일치 | “부산광역시 부산진구 서면로 74”는 정본의 핵심 도로명과 일치. 층별 안내는 **확인 필요** | 공개 화면에 전화 action 표시, 숫자 field는 **확인 필요** | 홈페이지 button은 보이나 최종 href는 이번 공개 점검에서 확인 불가 | 관계자 권한으로 URL·층별 안내·의료진·진료시간을 확인 후 필요 시 수정 요청. `홈페이지` button이 정확히 `https://star-pibu.com`으로 가는지 모바일과 PC에서 확인.[5] |

### 매월 15분 NAP 점검 체크리스트

| 점검 순서 | 확인할 항목 | 완료 기준 |
|---|---|---|
| 1 | 각 프로필을 비로그인 브라우저와 소유자 계정에서 각각 연다 | 검색 결과 캐시와 관리자 입력값의 차이를 구분 |
| 2 | 상호·전화·도로명·지번·층별 안내·진료시간을 정본 표와 대조한다 | 전화 숫자와 주소 건물/층 정보의 불일치 0건 |
| 3 | `홈페이지/웹사이트` button을 PC·모바일에서 눌러 본다 | 최종 URL이 `https://star-pibu.com`이며 오류·임시 도메인·파라미터 없음 |
| 4 | 수정 전/후 screenshot, profile URL, 요청 번호, 담당자, 반영일을 ledger에 기록한다 | 후속 담당자도 변경 근거를 추적 가능 |
| 5 | 페이지의 의료진·가격·후기·시술 문구가 바뀌었다면 광고성 표현/사실 근거를 별도 검토한다 | NAP 수정과 의료광고 카피 수정을 섞지 않음 |

## 3. 굿닥 공식 URL 연결 요청 템플릿

아래 문안은 이메일·고객센터 문의·병원 관계자 수정 요청에 사용할 수 있습니다. 대괄호 부분만 실제 계정 정보로 바꾸고, 사업자등록증·관계자 권한 증빙은 플랫폼의 보안 업로드 절차가 있을 때만 제출하십시오. 이메일 본문에 주민등록번호·로그인 비밀번호·환자정보를 넣지 마십시오.

```text
제목: [스타피부과의원] 병원 프로필 공식 홈페이지 URL 연결 요청 (병원 ID 7777)

안녕하세요. 굿닥 병원 정보 담당자님.

부산광역시 부산진구 서면로 74에 위치한 스타피부과의원 [병원 관계자 성명/직책]입니다.

굿닥 병원 프로필(https://www.goodoc.co.kr/hospitals/7777)을 확인한 결과,
“병원 주소·연락처·웹사이트 연결” 영역에 웹사이트 연결 정보가 없는 것으로 표시됩니다.

아래의 공식 홈페이지를 병원 프로필의 웹사이트 링크로 등록 또는 수정해 주시기를 요청드립니다.

- 병원명: 스타피부과의원
- 대표 전화: 051-818-2300
- 주소: 부산광역시 부산진구 서면로 74 아이온시티빌딩 4층(접수·진료) / 2층(줄기세포 연구센터)
- 공식 홈페이지 URL: https://star-pibu.com

필요한 관계자 확인 또는 증빙 절차가 있다면 안전한 제출 방법을 안내 부탁드립니다.
반영 후 실제 연결 URL과 처리 완료 여부도 회신해 주시면 감사하겠습니다.

감사합니다.
[성명]
[직책]
[공식 대표전화 또는 업무용 이메일]
```

## 4. 모두닥 공식 URL 확인·수정 요청 템플릿

모두닥은 공개 페이지에 `홈페이지` action이 보이므로, “새 링크 추가”보다 **현재 목적지 확인과 정정**을 우선 요청합니다. 의료진 정보가 공개 화면에서 현재 홈페이지와 다르게 보이면, URL 요청과 별개로 사실 확인 후 각 field를 따로 수정 요청하십시오.

```text
제목: [스타피부과의원] 병원 페이지 공식 홈페이지 URL 확인 및 정정 요청 (병원 ID 39319)

안녕하세요. 모두닥 병원 정보 담당자님.

스타피부과의원 [병원 관계자 성명/직책]입니다.

병원 페이지(https://www.modoodoc.com/hospital/39319/)의 “홈페이지” 연결 정보에 대해
아래 공식 URL이 정확히 등록되어 있는지 확인을 요청드립니다.

- 병원명: 스타피부과의원
- 대표 전화: 051-818-2300
- 도로명 주소: 부산광역시 부산진구 서면로 74 아이온시티빌딩 4층(접수·진료) / 2층(줄기세포 연구센터)
- 공식 홈페이지 URL: https://star-pibu.com

현재 홈페이지 버튼의 최종 연결 URL이 위 URL과 다르거나, URL 정보가 비어 있다면
위 공식 URL로 수정해 주시기를 요청드립니다.

필요한 관계자 인증 또는 증빙이 있다면 안전한 제출 절차를 안내 부탁드립니다.
처리 후 PC와 모바일에서 확인할 수 있는 최종 링크를 회신해 주시면 감사하겠습니다.

감사합니다.
[성명]
[직책]
[공식 대표전화 또는 업무용 이메일]
```

두 플랫폼 모두 5영업일 안에 회신이 없으면, 새 요청을 중복 등록하기보다 기존 문의 번호를 인용한 한 번의 follow-up을 보냅니다. 유료 노출 상품 제안과 공식 URL/NAP 정정 요청은 분리해 판단하고, `dofollow`나 특정 키워드 anchor를 요청하지 마십시오.

```text
제목: Re: [스타피부과의원] 공식 홈페이지 URL 연결/정정 요청 [기존 문의번호]

안녕하세요. [문의일]에 요청드린 스타피부과의원 공식 홈페이지 URL 확인 건의 처리 상태를 확인 부탁드립니다.
공식 URL은 https://star-pibu.com 이며, 추가 확인 절차가 필요하면 회신 부탁드립니다.
감사합니다.
```

## 5. Google Search Console로 하는 3개월 링크 프로필 감사

### 먼저 이해할 점

Search Console의 **Links** 보고서는 현재 Google이 보여 주는 상위 external-link 데이터를 확인하는 실무 출발점입니다. 이 보고서에서는 `Top linked pages`, `Top linking sites`, `Top linking text`, 특정 page의 linking sites, 특정 site→page backlinks를 drill down하고 export할 수 있습니다.[6] 하지만 링크 권위 점수(DR/Authority Score), 과거 first/lost date, 전체 웹의 완전한 backlink index는 제공하지 않으므로, 이를 Ahrefs/Semrush/DataForSEO의 대체물로 취급하지 않습니다.

> **중요:** Google은 대부분의 사이트에서 Disavow Tool이 필요하지 않으며, 상당한 양의 스팸/인위적/저품질 링크가 있고 수동 조치가 발생했거나 발생할 가능성이 있을 때만 사용하라고 안내합니다. 이 가이드의 감사 결과는 **검토 큐**이며 disavow 파일이 아닙니다.[7]

### 사전 준비

| 준비 항목 | 해야 할 일 | 완료 기준 |
|---|---|---|
| property | `sc-domain:star-pibu.com` Domain property에서 작업. `https://star-pibu.com/` URL-prefix property만 있으면 함께 확인하되 export 기준은 하나로 고정 | property owner 권한 확인 |
| 담당자 | 1명은 owner, 1명은 data entry/reviewer로 지정 | export와 수정 권한을 분리 |
| 보관 위치 | Drive/사내 보안 폴더에 `seo/link-audit/YYYY-MM-DD/` 생성 | 원본 CSV/XLSX, PDF/screenshot, change log를 함께 저장 |
| 기준일 | 매월 첫 영업일(예: 9/1, 10/1, 11/1, 12/1)에 같은 순서로 snapshot | 90일 비교를 위한 최소 4개 snapshot 확보 |
| 파일명 | `YYYY-MM-DD_gsc-top-linking-sites.csv` 등 날짜+보고서명으로 저장 | 덮어쓰기 없이 시점 비교 가능 |

### Step-by-step: 매월 snapshot 추출

| 단계 | Search Console에서 할 일 | 저장할 파일·필드 | 해석 주의 |
|---|---|---|---|
| 1 | 좌측 메뉴 **Links**를 연다 | 해당 날짜의 dashboard screenshot/PDF | 다른 property를 보고 있지 않은지 확인 |
| 2 | **Top linked pages → More**를 열고 `Export External Links` 또는 다운로드 메뉴로 export | `top-linked-pages` | page별 link 수는 일관된 snapshot 지표로 보되, 페이지별 수치를 합산해 전체 live backlinks로 단정하지 않음 |
| 3 | **Top linking sites → More**를 열어 export | `top-linking-sites` | domain·links 수, export 시각, source type 열을 ledger에 추가 |
| 4 | **Top linking text → More**를 열어 export | `top-linking-text` | 브랜드/URL/일반/주제/의심 anchor로 사람이 분류. 자동 결론 금지 |
| 5 | 상위 20개 linking site를 하나씩 열어 **More sample links**와 target page를 export | `sample-backlinks-top20` | sample은 발견용이지 전체 link inventory가 아님 |
| 6 | 핵심 deep page(`/doctors`, `/research`, `/directions`, 대표 치료 URL)를 선택해 **Top linking sites for a given page** 확인 | `deep-page-linking-sites` | homepage에만 몰린 링크와 독립적으로 인용되는 deep page를 구분 |
| 7 | **Security & Manual Actions → Manual actions**를 확인 | `manual-actions-status.pdf` | 결과가 “No issues detected”여도 링크 품질이 자동 보증되는 것은 아님 |
| 8 | export 파일과 source URL·수집일·담당자·특이 사항을 `link-audit-ledger.xlsx`에 기록 | ledger | 원본 export는 수정하지 않고, 분석용 탭을 따로 생성 |

### 90일 비교: Day 0, 30, 60, 90

정확한 3개월 전/후 비교를 하려면 지금 한 번만 export하는 것으로 충분하지 않습니다. Day 0을 기준선으로 저장한 뒤 30일 간격으로 동일한 보고서를 총 4회 저장합니다. Google Links report는 기간 필터형 성과 보고서가 아니므로, 이 비교는 “Search Console에 표시되는 링크 표본의 변화”로 해석합니다.

| 지표 | Day 0 | Day 30 | Day 60 | Day 90 | 판단 방식 |
|---|---:|---:|---:|---:|---|
| Top linking sites export의 unique domain 수 |  |  |  |  | 중복 제거한 domain 수의 증감. quality는 별도 수동 분류 |
| 신규로 처음 보인 관련성 높은 domain |  |  |  |  | source URL·target page·획득 방식·공개일을 ledger에 기록 |
| 더 이상 보이지 않는 domain |  |  |  |  | truly lost라고 단정하지 말고 다음 snapshot과 source URL을 재확인 |
| homepage 이외 target page 수 |  |  |  |  | `/doctors`, `/research`, 실제 안내 page의 독립 인용 여부 확인 |
| 브랜드/URL anchor 비중 |  |  |  |  | 자연스러운 brand anchor의 유지 여부. exact-match 과다 여부는 실제 원문 표본으로 검토 |
| P0 프로필 공식 URL 연결 |  |  |  |  | Goodoc/Modoodoc/지도 profile의 link target을 직접 클릭해 확인 |
| Manual actions |  |  |  |  | 문제가 있으면 원인 확인→외부 source 제거 요청→전문 검토. 단순 low-quality 목록만으로 disavow 금지 |

### 분석 ledger 권장 열

| 열 | 입력 예시 | 목적 |
|---|---|---|
| snapshot_date | `2026-09-01` | 90일 시점 비교 |
| report_type | `top_linking_sites` | 데이터 출처 구분 |
| source_domain | `example.org` | 중복 제거 기준 |
| source_url | 원문 URL 또는 Search Console sample URL | 실제 문맥 점검 |
| target_url | `https://star-pibu.com/research` | deep link 가치 확인 |
| anchor | `스타피부과의원` | anchor 분류 |
| source_type | 공식기관/학회/의료플랫폼/지역매체/소셜/미확인 | 품질 판단의 근거 |
| relation_evidence | 발표 주최/프로필 소유/편집 링크/미확인 | 링크 획득의 사실성 |
| link_attribute | follow/nofollow/sponsored/미확인 | 보이는 정보만 기록 |
| action | 유지/정보수정 요청/삭제 요청 후보/추가 확인 | disavow 이전의 운영 단계 |
| reviewer | 담당자 이니셜 | 책임 추적 |
| notes | NAP 불일치, broken link 등 | 맥락 보존 |

### 감사 판정과 다음 행동

| 발견 | 할 일 | 하지 말 일 |
|---|---|---|
| 굿닥·모두닥의 공식 URL 미연결/오연결 | owner proof로 수정 요청, 반영 후 final URL 캡처 | 검색 순위 목적으로 follow link를 요구 |
| 학회/대학/공식 행사 페이지의 실제 이력 링크 | source·날짜·주최 근거를 보존하고 correct deep page로 연결 | 경력·논문을 새로 만들거나 확대 해석 |
| 낯선 저품질 domain 1–2개 | 원문을 열어 문맥·link attribute·반복성 확인 후 ledger에 “검토” | 자동 disavow 또는 “negative SEO” 단정 |
| 대량의 명백한 인위적 링크 + 수동 조치 가능성 | 과거 대행사/계약 확인, source removal 요청, 전문 검토 후에만 disavow 여부 판단 | domain property에 임의 disavow 업로드 |
| 매우 적은 신규 link | P0 profile 정확성과 실제 연구/의료진/안내 자료의 인용 가능성을 먼저 개선 | 링크 패키지·PBN·자동 등록 구매 |

## 6. 3개월 감사 완료 기준

90일 종료 시에는 “backlink가 몇 개 늘었다”보다 다음 질문에 답할 수 있으면 운영상 유의미합니다. 첫째, 5개 핵심 프로필의 공식 URL·NAP이 정합한가. 둘째, 신규 referring domain 중 실제 지역·의료·연구 문맥에서 출처를 설명할 수 있는 것이 무엇인가. 셋째, homepage 이외 의료진·연구·안내 page가 독립적으로 인용되기 시작했는가. 넷째, manual action이나 근거 있는 인위적 링크 문제가 있는가. 다섯째, 다음 분기에 확대할 신뢰 채널이 무엇인가.

정량적 독성 점수, lost-link date, authority distribution, 경쟁 병원 2곳과의 link gap이 필요하면 Ahrefs/Semrush/DataForSEO export를 추가로 연결해야 합니다. 그때는 Search Console snapshot과 결합하되, 서로 다른 도구의 수치를 합산하지 말고 출처별로 분리해 해석하십시오.

## References

[1]: https://star-pibu.com/directions "스타피부과 — 찾아오시는 길"
[2]: https://support.google.com/business/answer/7091?hl=en "Google Business Profile Help — Tips to improve your local ranking on Google"
[3]: https://new.smartplace.naver.com/help/guide?menu=register "네이버 스마트플레이스 — 업체 등록 안내"
[4]: https://www.goodoc.co.kr/hospitals/7777 "굿닥 — 스타피부과의원"
[5]: https://www.modoodoc.com/hospital/39319/%EC%8A%A4%ED%83%80%ED%94%BC%EB%B6%80%EA%B3%BC%EC%9D%98%EC%9B%90-%EB%B6%80%EC%82%B0-%EB%B6%80%EC%A0%84%EB%8F%99 "모두닥 — 스타피부과의원"
[6]: https://support.google.com/webmasters/answer/9049606?hl=en "Google Search Console Help — Links report"
[7]: https://support.google.com/webmasters/answer/2648487?hl=en "Google Search Console Help — Disavow links to your site"

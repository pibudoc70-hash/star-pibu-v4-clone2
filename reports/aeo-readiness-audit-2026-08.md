# 스타피부과 AEO 상태 진단

**진단일:** 2026-08-28  
**작성:** Manus AI  
**대상:** `https://star-pibu.com/` 및 공개 장비 상세 페이지 표본

## Executive Summary

**스타피부과는 답변 엔진이 읽을 수 있는 기본 토대는 갖췄지만, 정적 JSON-LD의 사실성·대표 이미지 접근성·다국어 상세 페이지 발견성을 먼저 정리해야 인용 신뢰도를 높일 수 있습니다.** 공개 홈과 울쎄라피 프라임 상세 페이지는 HTTP 200, self-canonical, robots 허용, FAQ·MedicalProcedure·로컬 진료 정보가 포함된 원시 HTML을 제공하므로 JavaScript에만 의존하는 사이트보다 출발점이 좋습니다. 장비 상세에는 실제 사용자에게 보이는 H1·시술 설명·FAQ·지역·전문의 정보도 존재합니다. 반면 홈의 정적 JSON-LD에는 `@type`에 부적절한 `Dermatology` 값, 실제 장비 설명과 충돌하는 세르프 리프팅 설명, GET 403을 반환한 구 CloudFront 대표 이미지가 남아 있습니다. 이는 AI 답변·검색 스니펫의 근거 데이터가 사용자 화면과 달라질 위험입니다. 또한 브라우저 하이드레이션 뒤 홈 JSON-LD가 3개에서 9개로 중복되며, 다국어 장비·시술 상세 URL은 지원되지만 sitemap에는 0건입니다. FAQ rich result 자체는 더 이상 Google Search에 표시되지 않으므로, 추가 마크업보다 정확한 가시 답변·정합된 entity 데이터·인용 성과 계측이 우선입니다.[1] [2]

## 진단 기준과 데이터 한계

Google은 AI Overviews와 AI Mode에 별도 AEO 마크업을 요구하지 않으며, 색인 가능한 페이지, 크롤링 허용, 내부 링크, 텍스트 기반의 중요한 콘텐츠, 보이는 내용과 일치하는 구조화 데이터가 기본 요건이라고 설명합니다.[3] Bing도 명확한 제목·표·FAQ, 근거, 최신성, 텍스트·이미지·영상 간의 일관성을 인용 개선을 위한 관찰 지표로 제시합니다.[4]

이번 진단은 공개 HTTP/브라우저 렌더링, 현재 소스, sitemap·robots·LLM 안내 파일, 구조화 데이터와 외부 공식 지침을 근거로 합니다. Google Search Console, Bing Webmaster Tools AI Performance, Naver Search Advisor의 실제 노출·클릭·인용·크롤 오류 데이터는 제공되지 않았으므로 **인용량·순위·트래픽 효과는 판정하지 않았습니다.** 배포 후 측정은 URL Inspection, Rich Results Test, Search Console Performance, Bing AI Performance에서 별도로 해야 합니다.[3] [4] [5]

## 현재 강점

| 항목 | 확인된 증거 | AEO 의미 |
|---|---|---|
| 크롤링 접근성 | 홈의 원시 HTML은 HTTP 200과 `index, follow, max-snippet:-1`을 반환하며 `robots.txt`는 주요 검색·AI 크롤러를 차단하지 않습니다. | 답변 엔진이 공개 콘텐츠를 수집할 기본 접근 경로가 열려 있습니다. |
| 서버 프리렌더 | 홈은 FAQ와 지역 정보, 장비 상세는 H1·표·FAQ·MedicalProcedure를 원시 HTML에 주입합니다. 울쎄라피 프라임 원시 HTML에서 JSON-LD 3개, FAQPage 1개, MedicalProcedure 9개 토큰, self-canonical, H1을 확인했습니다. | JavaScript 렌더링 여부와 관계없이 텍스트 기반 근거를 제공할 수 있습니다. |
| 답변형 콘텐츠 | 실제 장비 상세 페이지에는 시술 소개·기대 효과·주의사항·7개 FAQ·위치·진료 시간·시술 주체·통증 관리·영상이 보입니다. | 비교·지속기간·통증·회복 등 긴 질의에 인용 가능한 질문–답변 구조가 있습니다. |
| 로컬 entity 신호 | 이름, 주소, 좌표, 전화, 영업시간, 의료 전문분야, 의료진, `sameAs`, 서비스 카탈로그가 JSON-LD와 보이는 푸터에 있습니다. | 지역 기반 질의에서 병원 엔티티를 식별할 정보가 비교적 풍부합니다. LocalBusiness에는 주소·이름이 필수이고 전화·영업시간·좌표·URL이 권장됩니다.[5] |
| URL 관리 | 루트·영문 홈과 장비 상세 표본에서 self-canonical을 확인했고, 5개 하위 sitemap이 있는 sitemap index와 6개 hreflang 링크가 공개됩니다. | 중복·언어 버전의 수집 기준이 이미 존재합니다. |

## AEO 기술·엔터티 무결성 진단

### P0 — 정적 JSON-LD의 사실성 및 이미지 접근성

홈의 `client/index.html` 기본 JSON-LD는 상단 `@type` 배열에 `Dermatology`를 포함합니다. 같은 객체에 이미 `medicalSpecialty`가 있으므로, 의료 전문분야는 해당 속성에만 유지하고 `@type`에는 실제 조직 유형만 남기는 편이 명확합니다. Google은 가능한 한 구체적인 type을 사용하되, 마크업은 페이지의 실제 내용을 정확하게 대표해야 한다고 안내합니다.[5] [6]

더 큰 문제는 같은 정적 JSON-LD의 `availableService`가 세르프 리프팅을 “실을 이용한 리프팅 시술”로 설명한다는 점입니다. 현재 사이트의 세르프 FAQ는 RF 장비 기준으로 정정되어 있어, 한 도메인 안의 사용자용 설명과 기계용 설명이 충돌합니다. 구조화 데이터의 부정확성은 rich result 자격을 잃거나 수동 조치 검토 대상이 될 수 있으므로, 이 항목은 **의료진이 확인한 사실로 즉시 정정**해야 합니다.[6]

정적 스키마와 OG 메타가 쓰는 구 CloudFront hero URL은 실제 GET 요청에서 HTTP 403을 반환했습니다. 반면 현재 `/manus-storage/hero-background-0000_d3dee03d.webp`는 최종 응답 200 `image/webp`였습니다. 구조화 데이터의 이미지는 크롤 가능하고 색인 가능한 URL이어야 하므로, 정적 JSON-LD와 OG의 오래된 이미지 URL을 현재 공개 자산으로 통일해야 합니다.[5]

| 안전한 코드 수정 범위 | 의료·운영 승인 필요 범위 | 검증 |
|---|---|---|
| `Dermatology`를 `@type` 배열에서 제거하고 `medicalSpecialty`만 유지; 정적 hero/OG 이미지 URL을 200 자산으로 교체 | 세르프 서비스 설명은 의료진이 실제 장비·시술 범위를 승인한 문장으로 교체 | Rich Results Test, `curl -I/-L`, 원시 HTML의 JSON-LD·OG URL 200 확인, 사용자 화면의 문구 일치 확인 |

### P1 — 정적·프리렌더·클라이언트 스키마의 단일 소유권

원시 홈 HTML에는 JSON-LD 3개가 있지만, 실제 브라우저 렌더링 뒤에는 9개 script와 `MedicalBusiness`, `WebSite`, `FAQPage`의 중복 유형이 확인됐습니다. `client/index.html`의 정적 기본 스키마, 서버 프리렌더, `SeoHead`가 같은 엔터티와 FAQ를 각각 생성하기 때문입니다. Google은 여러 항목을 허용하지만, 관련 데이터는 `@id`로 연결하고 중복 객체의 값이 일관돼야 한다고 설명합니다.[6] 현재처럼 세 계층이 별도 값과 이미지 URL을 보유하면 수정 누락이 재발할 가능성이 큽니다.

권장 방향은 **정적 기본 스키마를 최소 fallback으로 축소하고, 서버 프리렌더를 검색용 정본, `SeoHead`를 하이드레이션 뒤 정본 갱신 역할로 명확히 분리**하는 것입니다. `@id`는 조직 `/#organization`, 병원 `/#medical-clinic`, 의료진 `/#physician-*`의 하나의 규칙으로 통일해야 합니다. 이 작업은 구조 변경이므로 짧은 정적 교정과 분리된 승인 단위로 진행하는 것이 안전합니다.

| 문제 | 비즈니스 영향 | 수정 방식 | 검증 |
|---|---|---|---|
| 동일 엔터티·FAQ의 JSON-LD가 3계층에서 중복 생성 | 값·이미지·의료 설명이 달라질 때 AI와 검색 엔진에 모순 신호를 줄 수 있음 | schema builder 단일화, prerender에 data marker 부여, hydration 시 중복 제거 | 원시 HTML과 hydration DOM에서 `@id`별 객체 수·핵심 값 비교 테스트 |
| 조직·의료진 ID 규칙이 생성기마다 다름 | 의료진 전문성·소속 관계 그래프가 분절될 수 있음 | `CLINIC_INFO` 중심의 constants와 builder를 단일 정본으로 통합 | JSON-LD snapshot 및 Schema Markup Validator |

### P1 — 다국어 상세 페이지의 발견성은 구현보다 sitemap이 뒤처짐

`equipmentPrerender.ts`는 `/en|ja|zh|zh-tw/equipment3/:slug`의 canonical·본문·FAQ를 지원합니다. 표본으로 울쎄라피 프라임의 영문·일문·중문·번체 URL은 self-canonical을 반환했고, 영어와 일본어 H1은 현지 언어로 제공됐습니다. 그러나 공개 `sitemap-global.xml`은 다국어 장비 상세와 다국어 시술 상세 URL을 각각 **0건** 포함하며, sitemap에는 한국어 장비 URL만 73개, global URL은 44개였습니다.

다만 중문과 번체 표본 H1은 `Ultherapy Prime`으로 나타났고, 이전 데이터 점검에서 번체·중문 장비 콘텐츠의 DB 번역 과제도 남아 있었습니다. 따라서 지금 다국어 상세 전체를 sitemap에 넣는 방식은 권장하지 않습니다. 먼저 언어별 제목·설명·FAQ·canonical의 품질 기준을 통과한 공개 페이지만 선별해 넣어야 합니다. Google도 구조화 데이터·페이지 정보가 실제 보이는 내용을 사실적으로 표현해야 한다고 명시합니다.[6]

| 운영 수정 | 선행 조건 | 검증 |
|---|---|---|
| 언어별 완성 장비·시술 상세만 sitemap-global에 포함 | 제목·소개·FAQ·OG·canonical이 해당 언어로 실제 렌더링되고 self-canonical 200 | 각 URL의 HTTP 200, canonical, hreflang reciprocity, 문장 언어 판별, sitemap count 비교 |
| 미완성 번역은 색인 대상에서 제외 또는 우선 번역 | DB 현지화 품질·의료진 승인 | GSC URL Inspection과 Naver 수집 상태 확인 |

### P2 — `SearchAction`은 실제 검색 기능과 일치하지 않음

홈 `WebSite` JSON-LD는 `/treatments?q={search_term_string}`을 `SearchAction` 대상으로 제시합니다. 그러나 클라이언트의 시술 목록 경로에서는 `q`를 읽어 결과를 바꾸는 구현을 찾지 못했고, 장비 목록은 `tab`만 사용합니다. 구현되지 않은 검색 action은 답변 엔진에 도움이 되지 않으므로 제거하거나 실제 사이트 검색을 만들고 난 뒤 되살리는 것이 안전합니다. 기능이 있다면 사용자 화면에도 검색 입력·결과를 제공해야 합니다. Google은 구조화 데이터가 주된 보이는 콘텐츠를 사실적으로 나타내야 한다고 규정합니다.[6]

### P2 — 이벤트 프로모션의 시간 정보는 실제 기간과 연결해야 함

`buildEventJsonLd`는 `startDate`가 없을 때 실행일을 기본값으로 생성합니다. EventDetail은 DB event의 실제 시작·종료일이 없으면 이 값을 사용합니다. 기간이 없는 프로모션을 매일 새 Event로 표현하면 날짜 신호가 흔들릴 수 있습니다. 시작·종료일·가격 유효기간이 실제 데이터로 관리될 때만 Event/Offer를 출력하고, 그렇지 않으면 `WebPage`와 공개된 프로모션 본문으로 표현하는 설계가 더 정확합니다. 시점이 중요한 구조화 데이터는 최신·사실 정보여야 합니다.[6]

## 답변 콘텐츠·전문성·지역성 진단

장비 상세 페이지의 기본 형식은 매우 적절합니다. 각 페이지에서 질문형 H2·FAQ, 비교 설명, 기대 효과, 주의사항, 시술 시간과 회복, 진료 주체와 위치를 묶어 제공하므로 AI가 복잡한 비교·후속 질문을 분해해 찾는 데 도움이 됩니다. Google은 AI Mode와 AI Overviews가 하위 주제에 대해 여러 관련 검색을 수행해 다양한 유용한 링크를 제시한다고 설명합니다.[3]

다만 의료 콘텐츠에서는 “더 강하다”, “효과가 보장된다”, 고정된 회복·지속기간 같은 단정을 피하고, 장비 공식 자료와 의료진 검토일에 연결되는 **관리 가능한 사실성**이 인용 가능성보다 우선합니다. 최근 리프팅 장비 FAQ에서 일부 깊이·에너지 표현을 정정한 사실은 이 통제의 필요성을 보여 줍니다. FAQ를 더 많이 만드는 것보다, 실제 상담에서 반복되는 질문의 답을 짧은 결론–근거–개인차–다음 행동 순서로 유지하는 것이 안전합니다.

| 콘텐츠 영역 | 현재 상태 | 권장 보완 | 소유자 |
|---|---|---|---|
| 장비 비교 FAQ | 울쎄라피 프라임 등 핵심 비교 질의가 존재 | 비교 기준(에너지 방식, 목표, 계획 수립)을 중립적으로 표준화하고 의료진 검수일·근거 URL을 내부 관리 | 의료진 + 콘텐츠 담당 |
| 지역 질문 | 홈·상세에 주소, 역 접근성, 전화, 시간, 전문의 직접 진료가 존재 | “어디에 있나요”, “주차/접근”, “외국인 안내”, “상담 전 준비”를 별도 지역 FAQ 또는 안내 페이지에 가시 텍스트로 확장 | 운영 담당 |
| 전문성 신호 | 의료진, 자격, 논문·영상·직접 진료 정보가 존재 | 의료진별 논문·발표는 동명이인 검증과 원문 URL을 유지하고, 페이지에 최신 검수일을 표시 | 의료진 + 콘텐츠 담당 |
| 미디어 | 장비별 영상·새 인포그래픽이 존재 | 핵심 결론을 이미지 안에만 두지 말고, 바로 위·아래에 같은 의미의 짧은 텍스트 요약과 의미 있는 alt를 유지 | 프런트엔드 + 콘텐츠 담당 |

## 발견성·측정·운영 항목

robots와 sitemap은 현재 수집 경로가 열려 있어 유지할 가치가 있습니다. 반면 `llms.txt`와 `llms-full.txt`는 공개 응답에서 바이트 단위로 동일했습니다. Google은 llms.txt가 Google Search의 가시성·순위에 긍정적 또는 부정적 영향을 주지 않는다고 안내하므로, 두 파일을 늘리는 일은 우선순위가 아닙니다.[1] 필요하다면 `llms.txt`를 짧은 안내·대표 URL로, `llms-full.txt`를 실제 검증된 상세 요약으로 분리하되 의료진의 정기 검수 체계가 있을 때만 유지합니다.

가장 큰 측정 공백은 AI 인용 데이터입니다. Bing AI Performance는 총 인용, 일평균 인용 URL, grounding query, URL별 인용 활동을 제공하므로, Bing Webmaster Tools를 연결한 뒤 먼저 현재 인용되는 페이지와 질의를 확인하는 것이 좋습니다.[4] Google은 AI 기능 트래픽을 Search Console Web Performance 안에 집계한다고 설명하므로, Google Search Console에서는 장비 상세·의료진·지역 안내 URL의 노출·클릭·쿼리를 전후 비교합니다.[3]

## 최종 우선순위

1. **Problem:** 홈의 정적 JSON-LD가 부적절한 type, 세르프 리프팅의 사실과 다른 설명, HTTP 403 대표 이미지 URL을 포함해 답변 근거의 신뢰성을 훼손합니다. **Fix:** 의료진 검수 후 정적 스키마의 type·세르프 설명을 정정하고, 현재 200을 반환하는 managed hero 자산으로 모든 schema·OG image URL을 통일합니다.
2. **Problem:** 정적 HTML·서버 프리렌더·클라이언트 Helmet이 같은 조직·FAQ 스키마를 중복 생성해 값 불일치와 ID 분절 위험이 있습니다. **Fix:** 구조화 데이터 builder와 `@id` 규칙을 단일 정본으로 합치고 원시 HTML·hydration DOM의 중복·핵심 값 일치 테스트를 추가합니다.
3. **Problem:** 다국어 장비·시술 상세 경로는 구현돼도 sitemap에 0건이고, 중문·번체 일부 표본은 현지화 완성도를 보장하지 못합니다. **Fix:** 언어별 제목·소개·FAQ·canonical·200 상태를 검수한 페이지부터 sitemap-global에 단계적으로 추가하고 미완성 번역은 먼저 데이터에서 보완합니다.
4. **Problem:** `SearchAction`은 실제 사이트 검색으로 연결되지 않고, 기간 없는 프로모션은 실행일 기반 Event 날짜를 만들 수 있습니다. **Fix:** 작동하지 않는 SearchAction을 제거하거나 검색 UX를 구현하고, 실제 시작·종료 데이터가 없는 프로모션에는 Event schema 대신 정확한 공개 본문과 WebPage 표현을 사용합니다.
5. **Problem:** AEO 성과의 기준선이 없어 어떤 페이지·질의가 AI 답변에 인용되는지 판단할 수 없습니다. **Fix:** Bing AI Performance와 Search Console URL·쿼리 단위 측정을 연결하고, 의료진 검수일·근거 URL·문구 변경 이력을 관리합니다.

## References

[1]: https://developers.google.com/search/updates "Google Search Central — Latest documentation updates (FAQ rich result removal and llms.txt clarification)"
[2]: https://developers.google.com/search/docs/appearance/structured-data/faqpage "Google Search Central — FAQPage documentation updates"
[3]: https://developers.google.com/search/docs/appearance/ai-features "Google Search Central — AI features and your website"
[4]: https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview "Bing Webmaster Blog — AI Performance in Bing Webmaster Tools"
[5]: https://developers.google.com/search/docs/appearance/structured-data/local-business "Google Search Central — LocalBusiness structured data"
[6]: https://developers.google.com/search/docs/appearance/structured-data/sd-policies "Google Search Central — General structured data guidelines"

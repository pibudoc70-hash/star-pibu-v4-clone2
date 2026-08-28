# AEO 진단 증거 작업 메모

## 공개 홈페이지 관찰

2026-08-28에 `https://star-pibu.com/`을 실제 브라우저로 확인했습니다. 첫 응답은 `콘텐츠를 불러오는 중입니다`라는 초기 로더만 보였고, 후속 확인에서 페이지가 정상적으로 렌더링됐습니다. 공개 렌더링 본문에는 다음 AEO 관련 신호가 확인됐습니다.

| 관찰 | 의미 |
|---|---|
| 단일 H1에 지역·핵심 진료·전문의 정보를 포함 | 병원 정체성과 지역 의도를 즉시 전달합니다. |
| `피부과 전문의 직접 리프팅 진료` H2와 짧은 설명 | 리프팅 관련 대표 질의에 대한 직접 답변 형식의 근거가 있습니다. |
| 주소, 역 접근성, 전화, 진료 시간, 전문의 직접 진료 문구 | 지역 엔티티·연락처 신호가 본문과 푸터에 존재합니다. |
| 장비·시술 영역이 `시술·장비 정보를 불러오는 중입니다` 상태로 관찰됨 | 해당 영역의 답변 콘텐츠는 초기 HTML보다는 클라이언트 데이터 로드에 의존할 가능성이 있어, 원시 HTML과 프리렌더 경로를 추가 확인해야 합니다. |
| 첫 로더 노출 후 콘텐츠 렌더링 | 사용자 경험에는 문제가 없었으나, 답변 엔진의 원시 HTML 수집 관점에서는 로더만 보이는 시간과 서버 프리렌더·메타 주입 여부를 구분해서 점검해야 합니다. |

## 검색 엔진 공식 기준

Google은 AI Overviews와 AI Mode를 위한 별도 기술 요건이나 특수한 AEO 마크업을 요구하지 않으며, 검색에 색인되고 snippet 자격을 갖춘 페이지가 기본 대상이라고 설명합니다. 따라서 이 진단은 새 AI 전용 파일·스키마를 제안하는 대신, 크롤링 허용·내부 링크·텍스트 기반 중요 콘텐츠·일치하는 구조화 데이터·최신 로컬 비즈니스 정보를 핵심 기준으로 사용합니다.[1]

Google은 구조화 데이터가 해당 페이지의 보이는 내용을 설명해야 하며, 적지만 완전하고 정확한 속성이 과도하거나 부정확한 마크업보다 낫다고 안내합니다. LocalBusiness 계열은 주소·이름을 필수로, 전화·영업시간·좌표·URL 등을 권장합니다.[2] [3]

Bing은 AI Performance에서 인용 횟수·인용된 페이지·grounding query를 보며, 명확한 headings·tables·FAQ, 근거 제시, 최신 정보와 형식 간 일관성을 AI 응답 인용 개선의 관찰 가능한 방향으로 제시합니다.[4]

## 원시 HTML 및 프리렌더 확인

2026-08-28 공개 홈 HTML을 `curl`로 확인한 결과 HTTP 200, `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` robots 메타, JSON-LD 3개, `FAQPage` 1개, `MedicalBusiness` 1개가 확인됐습니다. 원시 HTML의 H1은 `스타피부과`로 짧았고, 브라우저 렌더링의 H1은 지역·핵심 시술·전문의 정보를 포함한 긴 문구였습니다.

`server/_core/homePrerender.ts`는 프로덕션 홈 언어 루트의 React root 안에 텍스트 본문과 FAQPage JSON-LD를 주입합니다. `server/_core/treatmentPrerender.ts`는 `/treatments/:slug` 계열에 MedicalProcedure·FAQPage·BreadcrumbList와 표 기반 본문을 주입합니다. 반면 현재 사용자에게 노출하는 `/equipment3/:slug` 장비 상세 경로가 같은 수준의 서버 프리렌더 계약을 갖는지는 별도 확인이 필요합니다.

후속 코드 점검 결과 `server/_core/equipmentPrerender.ts`가 `/equipment3/:slug`와 다국어 변형에 MedicalProcedure·FAQPage·텍스트 본문을 주입하는 계약을 확인했습니다. 실제 울쎄라피 프라임 장비 상세 페이지를 브라우저로 열었을 때 최초 화면은 초기 로더만 보였으므로, 사용자 브라우저의 첫 페인트와 무관하게 원시 HTML 검증을 분리해 수행했습니다. 원시 HTML에서는 canonical, H1, FAQPage, MedicalProcedure가 확인됐습니다.

초기 로더 해제 후 같은 페이지의 사용자 렌더링도 확인했습니다. H1 `울쎄라피 프라임`, `시술 소개`·`기대 효과`·`주의사항`·`자주 묻는 질문` H2, 7개 질문, 지역·진료 시간·전문의·통증 관리 정보, YouTube 가이드 영상이 확인됐습니다. 즉 장비 상세 페이지는 핵심 답변 텍스트가 실제 사용자에게도 보이며, JSON-LD와 가시 콘텐츠를 맞출 수 있는 기본 구조를 갖추고 있습니다.

다만 임상적 효과·샷 수·회복 기간·통증 관리·장비 비교를 단정적으로 표현하는 FAQ와 소개문은 AEO 자체의 기술 문제가 아니라 **의료진 정기 검수와 가시 문구·JSON-LD 동기화가 필요한 콘텐츠 거버넌스 항목**입니다. Google은 구조화 데이터가 보이는 페이지 내용을 사실적으로 대표해야 한다고 안내합니다.[2]

## References

[1]: https://developers.google.com/search/docs/appearance/ai-features "Google Search Central — AI features and your website"
[2]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Google Search Central — Introduction to structured data markup"
[3]: https://developers.google.com/search/docs/appearance/structured-data/local-business "Google Search Central — LocalBusiness structured data"
[4]: https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview "Bing Webmaster Blog — AI Performance in Bing Webmaster Tools"

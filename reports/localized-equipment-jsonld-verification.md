# 다국어 장비 상세 JSON-LD 검증 기록

## 브라우저 관찰

2026-08-28 개발 미리보기의 영문 울쎄라피 프라임 상세 페이지에서 초기 로딩 해제 후 영문 H1, 영문 시술 소개, 영문 FAQ 7개가 렌더링되는 것을 확인했습니다. 이는 locale별 장비 콘텐츠가 실제 상세 페이지에 전달되는지 확인하기 위한 관찰이며, JSON-LD의 type·ID·breadcrumb URL·FAQ 질문/답변은 이어지는 DOM 검사와 자동 테스트로 확인합니다.

브라우저에 표시된 기존 영문 FAQ 문구의 의료적 정확성은 이번 SEO 구조화 데이터 테스트 범위에 포함하지 않았습니다. 유효한 locale 데이터는 기본 언어로 덮어쓰지 않는 현재 폴백 정책을 보존합니다.

## DOM JSON-LD 검사

하이드레이션 뒤 같은 영문 페이지의 JSON-LD script를 직접 파싱했습니다. `BreadcrumbList`와 `FAQPage`는 각각 하나이며, 모두 page self-canonical과 언어 코드 `en`을 사용했습니다.

| type | `@id` | 확인값 |
|---|---|---|
| `BreadcrumbList` | `https://star-pibu.com/en/equipment3/울쎄라피프라임#breadcrumb` | 마지막 item: `https://star-pibu.com/en/equipment3/울쎄라피프라임`, `inLanguage: en` |
| `FAQPage` | `https://star-pibu.com/en/equipment3/울쎄라피프라임#faq` | FAQ 7개, 첫 질문은 영문, `inLanguage: en` |

이 결과는 server prerender의 모든 지원 locale 회귀 테스트와 별도로, 실제 클라이언트 하이드레이션 결과가 같은 self URL 계약을 유지함을 보여 줍니다.

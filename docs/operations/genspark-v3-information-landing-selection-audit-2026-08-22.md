# Genspark v3 정보형 랜딩·도메인 네트워크 선별 감사

## 결론

첨부안의 핵심인 `부산 울쎄라`·`부산 써마지`·`부산 울써마지` 별도 도메인 세 개, 상호 링크, 그리고 클리닉 홈페이지로의 트래픽 이송은 이 프로젝트에 적용하지 않는다. 이 구조는 사용자에게 독립적으로 충분한 가치를 제공한다는 증거 없이 유사 지역·시술 검색어를 위한 여러 도메인을 만들고 최종 클리닉으로 유도하는 형태가 될 수 있다.

Google은 유사 검색어 순위를 위해 여러 웹사이트 또는 지역별 도메인을 만들고 다른 페이지로 유도하는 방식을 doorway abuse의 예시로 든다. 또한 순위 조작 목적의 과도한 상호 링크 교환을 link spam 예시로 명시한다.[1] 의료처럼 신뢰가 특히 중요한 주제에서는 실제 작성자·검수자·근거·독자 효용이 확인된 people-first 콘텐츠가 우선이다.[2]

| 첨부 제안 | 현 사이트 판정 | 이유 |
|---|---|---|
| 3개 별도 정보 도메인 | 배제 | doorway·브랜드 혼동·운영 책임 분산 위험. 도메인·감수자·독립 콘텐츠 소유권도 미확정. |
| 6방향 cross-link 네트워크 | 배제 | 링크의 주 목적이 순위 신호 조작으로 해석될 위험. |
| 5,000~7,000자 랜딩 3종 | 보류 | 글자 수는 품질 기준이 아니며, 시술 정보·효과·주의사항은 전문 검수와 출처가 필요. |
| “의료광고 아님” 선언 | 배제 | 선언 자체가 실제 콘텐츠의 성격이나 법적 적합성을 보장하지 않음. |
| TOC·FAQ·텍스트 우선 | 기존 구현 우선 | 시술 상세 FAQ·SSR 구조화 데이터가 이미 존재. 화면 구조 개편은 실제 사용자 요구와 CWV 실측 뒤 별도 판단. |
| Article·MedicalWebPage schema | 보류 | 검증된 독립 article과 작성자·발행일·검수 정보가 생긴 후 해당 콘텐츠에 한해 적용. |

## 현 사이트에 적용한 항목

이번 제안의 구조화 데이터 취지 중, 기존 체계와 중복되지 않고 사실·표시 콘텐츠를 바꾸지 않는 treatment BreadcrumbList만 이미 별도 checkpoint에서 적용했다. 그 외 항목은 새 경로·새 도메인·새 의료 콘텐츠 또는 외부 계정·실측 데이터가 필요하므로 적용하지 않았다.

## 안전한 후속 방향

새로운 정보 콘텐츠는 별도 위성 도메인 대신 `star-pibu.com` 안에서 실제 진료 범위와 일치하는 한 주제부터 시작해야 한다. 먼저 전문의 검수 완료 원고, 출처, 작성·검수자 표시, 마지막 검토일, 이용자에게 유용한 질문 범위를 준비한다. 이후 독립된 route·canonical·sitemap·Article schema를 하나씩 설계하고 Search Console의 색인·성과 데이터를 확인한다.

## References

[1] [Google Search Central, Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies)

[2] [Google Search Central, Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

# AEO 정적 schema 정정·정본 통합·다국어 sitemap 구현 결과

## 구현 요약

이번 변경은 2026-08 AEO 진단에서 우선순위로 제시한 세 항목을 구현했습니다. 사용자에게 보이지 않는 오래된 정적 JSON-LD를 유지·수정하는 대신 제거하고, `seoHelpers.ts`의 타입 있는 builder를 홈·상세 프리렌더와 클라이언트 head의 단일 schema 정본으로 확정했습니다. 또한 한국어 fallback 없이 언어별 제목·소개·FAQ가 모두 있는 장비 상세 페이지만 글로벌 sitemap에 포함했습니다.

| 목표 | 구현 | 결과 |
|---|---|---|
| 정적 JSON-LD 사실성 | `client/index.html`의 중복·오래된 하드코딩 JSON-LD 두 개를 제거했습니다. 정적 소셜 이미지 fallback은 200을 반환하는 managed hero URL을 사용합니다. | 부적절한 `Dermatology` type, 403 CloudFront 대표 이미지, 오래된 세르프 서비스 설명이 정적 응답에서 제거됐습니다. |
| 공통 entity 정본 | `buildClinicJsonLd`와 `buildWebSiteJsonLd`를 server home/equipment/treatment prerender 및 client `SeoHead`가 재사용하도록 연결했습니다. 기존 `buildLocalBusinessJsonLd`는 호환용 alias로만 남겼습니다. | 조직 entity의 `@id`가 `https://star-pibu.com/#organization`으로 통일되고, logo는 200 `favicon.png`, 대표 이미지는 200 managed asset을 사용합니다. |
| 하이드레이션 중복 | 클라이언트 mount 시 `data-prerender="home-schema"`을 제거하고, 다국어 Landing 컴포넌트와 `buildHomeJsonLd`에서 중복 clinic 전달을 제거했습니다. | 개발 preview DOM에서 organization 1개, website 1개, 총 JSON-LD 5개, prerender home marker 0개를 확인했습니다. |
| SearchAction 사실성 | 실제 UI 검색과 연결되지 않은 `SearchAction`을 공유 WebSite schema에서 제거했습니다. | 검색 기능이 존재하는 것처럼 선언하는 구조화 데이터가 남지 않습니다. |
| 다국어 발견성 | `buildLocalizedEquipmentEntries`가 locale별 `name*`, `desc*`, `faqs*`의 비어 있지 않은 값과 parsable FAQ를 확인한 뒤 URL을 생성합니다. | 개발 sitemap의 현행 active data에서 언어별 72건, 합계 288건의 장비 상세 URL이 추가됐습니다. |

## 구조와 안전장치

공통 clinic builder는 의료기관의 조직 ID, 주소, 진료 시간, 전문분야, 로고, 대표 이미지, 의료진 및 제공 서비스를 한 곳에서 생성합니다. static HTML은 브라우저가 실행되기 전의 title·description·OG fallback만 제공합니다. 운영 환경에서 server prerender가 동일한 정본 schema를 원시 HTML에 주입하고, 클라이언트 `SeoHead`는 하이드레이션 완료 뒤 그 server marker를 제거한 후 같은 builder 결과를 유지합니다. 따라서 static·server·client가 서로 다른 조직 설명·대표 이미지·서비스 문구를 독립적으로 보유하지 않습니다.

다국어 sitemap은 단순히 라우트가 존재한다는 이유로 페이지를 추가하지 않습니다. 각 레코드는 해당 언어의 제목, 소개, FAQ가 모두 비어 있지 않고 FAQ가 정상 파싱될 때만 포함됩니다. 이 검사는 활성 장비 목록에서 실행되며, 언어별 값이 부족한 레코드는 자동으로 제외됩니다. URL 형식은 `/en`, `/ja`, `/zh`, `/zh-tw` prefix와 기존 self-canonical 라우팅 계약을 그대로 사용합니다.

## 검증 결과

| 검증 | 결과 |
|---|---|
| 집중 schema·hydration·sitemap 테스트 | PASS — 7개 파일, 104개 테스트 |
| 전체 회귀 테스트 | PASS — 205개 파일, 1,876개 테스트 |
| TypeScript | PASS — `pnpm check` |
| Lint | PASS — 오류 0건, 기존 경고 104건 외 신규 경고 없음 |
| 개발 home DOM | PASS — organization 1개, website 1개, JSON-LD 5개, prerender marker 0개 |
| 개발 sitemap XML | PASS — UTF-8 XML, 다국어 장비 상세 288건 (각 locale 72건) |
| 대표 이미지 | PASS — public favicon `200 image/png`, managed hero `200 image/webp` |
| 공백·변경 범위 | PASS — `git diff --check` 통과. 신규 의존성·DB 스키마·DB 콘텐츠·예약/OTP 로직·리뷰 데이터는 변경하지 않았습니다. |

## 운영상 남은 항목

이번 작업은 개발 환경의 코드와 active 데이터에 대한 sitemap 생성 결과를 검증했습니다. 공개 운영 도메인은 체크포인트 검토 뒤 사용자가 Publish할 때 반영됩니다. 반영 후에는 Google Search Console URL Inspection, Bing Webmaster Tools AI Performance, Naver Search Advisor에서 대표 홈·언어별 장비 URL의 canonical·수집·발견 상태를 측정해야 합니다. Google은 AI 검색에 특별한 추가 마크업을 요구하지 않고, 정확한 사용자 가시 콘텐츠·크롤링 가능성·구조화 데이터 정합성을 기본으로 안내합니다.[1]

구조화 데이터의 세르프 서비스 설명은 오래된 정적 block과 함께 제거됐습니다. 향후 서비스 설명을 다시 추가하려면 실제 장비·의료진 승인·공개 페이지의 문구를 모두 확인한 뒤 `CLINIC_PROCEDURES` 또는 활성 장비 데이터의 단일 정본만 수정해야 합니다. 검증되지 않은 후기·평점은 이번에도 추가하지 않았습니다.

## References

[1]: https://developers.google.com/search/docs/appearance/ai-features "Google Search Central — AI features and your website"

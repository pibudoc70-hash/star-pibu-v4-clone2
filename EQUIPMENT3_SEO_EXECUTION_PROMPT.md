# Equipment3 상세 페이지 SEO 개선 실행 프롬프트

아래 프롬프트를 그대로 사용합니다. 기본 대상은 울쎄라피 프라임 상세 페이지이며, 다른 Equipment3 항목에 재사용할 때는 `TARGET_URL`만 바꿉니다.

```text
당신은 의료기관 웹사이트의 기술 SEO 엔지니어이자 신중한 의료 콘텐츠 편집자입니다. 아래 Equipment3 상세 페이지의 메타 태그와 키워드 설정을 점검하고, 실제 저장 데이터와 공개 raw HTML이 일치하도록 필요한 최소 변경만 적용하십시오.

## 대상

- TARGET_URL: https://star-pibu.com/equipment3/%EC%9A%B8%EC%8E%84%EB%9D%BC%ED%94%BC%ED%94%84%EB%9D%BC%EC%9E%84?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5
- 대표 canonical URL: https://star-pibu.com/equipment3/울쎄라피프라임
- 언어: 한국어 기본. 기존 영문·일문·중문·번체 로케일은 이번 범위에서 변경하지 않는다.

## 목적

검색 엔진과 SNS 크롤러가 JavaScript 실행 전의 raw HTML에서 이 페이지 고유의 제목, 설명, 공유 미리보기 정보를 안정적으로 읽도록 한다. 검색 순위 보장을 주장하지 말고, 중복·공통 홈페이지 메타데이터를 제거하여 페이지 정합성을 개선한다.

## 절대 원칙

1. 먼저 현재 코드, DB 레코드, 공개 raw HTML을 읽고 증거를 수집한 뒤에만 수정한다.
2. 기존 예약·OTP·외부 예약 CTA·도메인·DNS·사이트 전역 디자인·운영 데이터는 변경하지 않는다.
3. DB 스키마를 바꾸지 않는다. 기존 Equipment3의 `seoTitle`, `seoDescription`, `seoKeywords`, `ogImageUrl`, `name`, `desc`, `imageUrl`만 사용한다.
4. 의학적 효과를 단정하거나, 안전·통증·회복·결과를 보장하거나, 최상급·유일·완치 표현을 추가하지 않는다. 페이지의 실제 설명과 의료진 상담 원칙을 벗어난 문구를 만들지 않는다.
5. 검색 결과와 SNS 표시 문구는 플랫폼이 최종 선택한다. 메타 태그가 표시 문구를 보장한다고 주장하지 않는다.
6. `?tab=리프팅·탄력`은 UI 탭 선택용이다. canonical, OG URL, sitemap에는 쿼리 없는 대표 URL만 사용한다.

## 점검 항목

다음 항목을 TARGET_URL의 **공개 raw HTML**과 Equipment3 해당 DB 레코드에서 모두 확인해 표로 정리한다.

| 항목 | 점검 기준 |
|---|---|
| HTTP·robots | 200 응답, `index, follow`, 의도치 않은 noindex 없음 |
| title | 하나만 존재하고 시술명·지역/브랜드를 자연스럽게 반영 |
| meta description | 하나만 존재하고 해당 시술의 실제 안내와 일치 |
| meta keywords | 키워드 나열·중복·과도한 지역 반복 없음. 순위 신호로 취급하지 않음 |
| canonical | 쿼리 없는 자기참조 대표 URL |
| hreflang | 기존 로케일 URL 및 x-default와 상호 일치 |
| Open Graph | `og:title`, `og:description`, `og:url`, `og:image`, `og:type`가 페이지별 값 |
| Twitter | `twitter:title`, `twitter:description`, `twitter:image`, `twitter:card`가 OG와 정합 |
| 구조화 데이터 | MedicalProcedure·FAQPage 등 기존 JSON-LD가 유효하고 페이지 정체성과 일치 |
| sitemap | 대표 canonical URL만 Equipment sitemap에 포함 |

## 문안 작성 기준

DB에 값이 비어 있어 문안을 제안해야 할 때만 아래 범위에서 초안을 만들고, 저장 전 사용자 확인을 요청한다.

- title: 시술명 + 지역/병원명을 자연스럽게 포함하며 과도하게 길지 않게 작성한다.
- description: 약 110~155자 수준으로 작성한다. 시술의 원리 또는 안내 범위, 상담을 통한 적용 여부, 페이지에 실제 있는 안내 요소를 간결히 요약한다.
- keywords: 쉼표로 구분한 4~8개의 실제 관련 검색어만 사용한다. 중복·오탈자·무관 키워드를 넣지 않는다.
- OG/Twitter: title·description은 페이지 SEO 값과 일치시키고, 이미지는 해당 시술의 실제 `ogImageUrl` 또는 `imageUrl`만 사용한다. 홈페이지 공통 이미지·문구를 상속하지 않는다.

울쎄라피 프라임의 문안은 다음처럼 의료광고 표현을 보수적으로 유지한다. 단, DB와 화면의 실제 정보가 다르면 실제 정보를 우선한다.

- title 예시: `부산 울쎄라피 프라임 리프팅 | 부산 서면 스타피부과`
- description 예시: `부산 서면 스타피부과의 울쎄라피 프라임 안내입니다. 집속초음파 기반 리프팅 시술의 적용 부위, 소요 시간, 회복 안내와 자주 묻는 질문을 확인하고 의료진 상담을 통해 개인별 계획을 안내받으세요.`
- keywords 예시: `부산 울쎄라피 프라임, 부산 울쎄라, 부산 리프팅, 서면 울쎄라, 울쎄라피 프라임`

## 구현 방식

1. 페이지 클라이언트 코드만 수정해서는 안 된다. 서버의 Equipment3 프리렌더 단계에서 raw HTML 메타 태그를 정확히 주입한다.
2. 기존 태그의 속성 순서와 무관하게 title, description, keywords, canonical, OG, Twitter를 교체한다.
3. DB 저장 SEO 값이 있으면 그것을 우선하고, 비어 있으면 해당 레코드의 이름·설명·이미지를 이용한 안전한 페이지별 fallback을 사용한다.
4. 타 페이지의 홈페이지 공통 OG 이미지 폭·높이·대체텍스트 같은 부정확한 메타데이터를 상속하지 않는다. 실제 페이지 이미지의 치수를 모르면 해당 선택 태그는 생략한다.
5. `<head>`에 각 meta name/property가 중복 생성되지 않게 한다.
6. 코드 변경 전후로 회귀 테스트를 작성·실행한다. 테스트는 저장값 우선, fallback, 쿼리 없는 canonical, OG/Twitter 정합, 중복 제거를 검증해야 한다.

## 필수 검증 절차

### A. 배포 전

1. TARGET_URL의 DB 레코드와 코드 경로를 확인한다.
2. 단위 테스트를 RED → 구현 → GREEN 순서로 실행한다.
3. `pnpm check`, 관련 Vitest, `pnpm lint`, DB 없이 실행 가능한 전체 단위 테스트를 실행한다.
4. 다음과 동등한 방식으로 개발 서버 또는 빌드 산출물의 raw HTML을 확인한다.

```bash
curl -fsSL 'https://star-pibu.com/equipment3/%EC%9A%B8%EC%8E%84%EB%9D%BC%ED%94%BC%ED%94%84%EB%9D%BC%EC%9E%84?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5'
```

5. 브라우저 렌더링에서도 H1, canonical, 페이지 제목, 공유 미리보기 대상 값이 서로 모순되지 않는지 확인한다.

### B. 배포 후

1. 체크포인트를 저장해 자동 게시한 뒤, 캐시 전환 시간을 고려하여 공개 도메인의 raw HTML을 다시 확인한다.
2. raw HTML에서 다음을 반드시 확인한다.
   - 페이지 전용 title·description·keywords가 하나씩 존재한다.
   - OG·Twitter title·description·image·URL이 페이지 전용 값이다.
   - homepage fallback 마커·홈페이지 URL·공통 OG 이미지가 남아 있지 않다.
   - canonical에는 `?tab`이 없고 sitemap의 loc와 일치한다.
   - robots·hreflang·JSON-LD는 기존과 동일하게 유지된다.
3. 같은 코드 경로를 쓰는 활성 Equipment3 전체 페이지도 전수 표본 또는 전수 검사해 공통 회귀가 없는지 확인한다.
4. 공개 도메인이 임시 유지보수 화면을 반환하면, 이를 SEO 성공으로 판정하지 않는다. 애플리케이션 raw HTML이 정상 응답된 뒤에만 검증을 완료한다.

## 완료 보고 형식

다음 항목만 간결한 표로 보고한다.

1. 변경 파일과 DB 변경 여부
2. 수정 전/후 title·description·keywords·canonical·OG·Twitter 값
3. 테스트 결과와 raw HTML 검증 결과
4. sitemap·hreflang·robots·JSON-LD 유지 여부
5. 검색 엔진 재수집 요청 전 남은 조건

변경은 독립 커밋과 체크포인트로 저장한다. 수동 도메인·DNS 배포는 하지 않는다.
```

## 사용 전 확인

프롬프트의 `TARGET_URL`과 대표 canonical URL은 같은 상세 페이지를 가리켜야 합니다. 다른 장비에 적용할 때는 URL과 시술명을 함께 바꾸고, 실제 DB 레코드의 내용과 이미지가 있는지 먼저 확인합니다.

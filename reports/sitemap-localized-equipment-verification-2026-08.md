# 다국어 장비 상세 sitemap 전수 검증

**검증일:** 2026-08-28  
**대상:** `https://star-pibu.com/sitemap.xml`, `https://star-pibu.com/sitemap-global.xml` 및 활성 `equipment3` 데이터

## 결론

다국어 장비 상세 URL은 누락·중복·예상 밖 URL 없이 올바르게 포함되어 있습니다. sitemap 생성기와 같은 활성 상태·번역 완결성 조건으로 계산한 기대 URL 288개가 개발 서버에서 생성된 `sitemap-global.xml`의 실제 URL 288개와 정확히 일치했습니다. 공개 sitemap에서도 글로벌 sitemap 참조 1건, 다국어 장비 상세 URL 288건, 중복 0건을 확인했습니다.

## 데이터 적격성 대조

`getEquipment3List()`와 동일하게 `isActive = '1'`인 장비만 대상으로 했습니다. 각 locale의 제목·소개가 비어 있지 않고, 해당 locale FAQ가 유효 JSON이며 최소 1개 이상일 때만 sitemap에 포함하는 `buildLocalizedEquipmentEntries()` 조건을 그대로 적용했습니다.

| 항목 | 영어 | 일본어 | 중국어 간체 | 중국어 번체 | 합계 |
|---|---:|---:|---:|---:|---:|
| 활성 장비 수 | 72 | 72 | 72 | 72 | 72개 레코드 |
| locale 제목·소개·FAQ 완결 장비 | 72 | 72 | 72 | 72 | 288개 locale URL |
| 생성된 상세 URL | 72 | 72 | 72 | 72 | 288개 |
| 기대 집합에서 누락 | 0 | 0 | 0 | 0 | 0개 |
| 기대 집합 밖 URL | 0 | 0 | 0 | 0 | 0개 |
| 중복 URL | 0 | 0 | 0 | 0 | 0개 |

현재 활성 장비 72개는 네 locale 모두 제목·소개·FAQ 요건을 충족하므로, 데이터 부족으로 제외된 장비는 없습니다. 향후 번역 필드가 비거나 FAQ JSON이 유효하지 않으면 해당 언어의 URL만 자동 제외되고, 한국어 콘텐츠를 대체 삽입하지 않습니다.

## XML·URL 형식 검증

| 검사 | 결과 |
|---|---|
| sitemap index XML 선언 | PASS — `<?xml version="1.0" encoding="UTF-8"?>` |
| global sitemap XML 선언 | PASS — `<?xml version="1.0" encoding="UTF-8"?>` |
| index의 global sitemap 참조 | PASS — `https://star-pibu.com/sitemap-global.xml` 1건 |
| 공개 global sitemap 전체 URL | PASS — 332개 (locale core 44개 + locale equipment detail 288개) |
| 모든 장비 상세 URL 형식 | PASS — 절대 HTTPS URL, `/en|ja|zh|zh-tw/equipment3/:slug`, query·fragment·trailing slash 없음 |
| 다국어 장비 상세 URL 중복 | PASS — 0개 |

## 원시 URL 대조

임시 검증 스크립트는 DB에서 기대 경로를 직접 만들고, 개발 서버의 `sitemap-global.xml`에서 `<loc>`를 파싱해 집합 비교했습니다. 다음 값이 모두 일치했습니다.

```text
expectedCount: 288
actualCount: 288
uniqueActualCount: 288
counts: { en: 72, ja: 72, zh: 72, zh-tw: 72 }
missing: []
unexpected: []
duplicates: []
```

## 공개 URL 표본 검증

공개 도메인에서 네 locale의 울쎄라피 프라임 상세 URL을 표본으로 요청했습니다. 모두 HTTP 200을 반환했고, canonical은 요청한 자기 URL이며, 원시 JSON-LD의 `inLanguage`도 locale 계약과 일치했습니다.

| locale | HTTP | canonical | JSON-LD `inLanguage` |
|---|---:|---|---|
| `/en` | 200 | `/en/equipment3/울쎄라피프라임` | `en` |
| `/ja` | 200 | `/ja/equipment3/울쎄라피프라임` | `ja` |
| `/zh` | 200 | `/zh/equipment3/울쎄라피프라임` | `zh` |
| `/zh-tw` | 200 | `/zh-tw/equipment3/울쎄라피프라임` | `zh-TW` |

## 회귀 검증 및 변경 범위

`pnpm test -- --run server/sitemap.localizedEquipment.test.ts server/sitemap.indexArchitecture.test.ts` 실행은 프로젝트 설정상 전체 회귀를 수행했고, 최종 결과는 **205개 테스트 파일·1,891개 테스트 통과**였습니다. `sitemap.localizedEquipment.test.ts`는 제목·소개·FAQ가 모두 있는 locale만 포함하고, 한 locale의 FAQ가 빠지면 그 locale URL만 제외하는 생성 계약을 보호합니다.

이번 작업은 검증 전용입니다. sitemap 코드, locale 데이터, 구조화 데이터, DB, 라우터, 패키지, 생성물은 변경하지 않았습니다. 임시 대조 스크립트도 검증 뒤 삭제했습니다.

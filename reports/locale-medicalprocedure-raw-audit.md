# 5개 Locale MedicalProcedure Raw JSON-LD 재감사

**감사 일시:** 2026-09-06 UTC  
**대상 시술:** `ulthera`  
**범위:** 공개 raw HTML만 읽기 전용으로 검사했으며 DB·콘텐츠·라우트는 수정하지 않았습니다.

| Locale | 공개 URL | HTTP | 페이지 URL 일치 MedicalProcedure | provider `@id` | image | `inLanguage` | `status` | followup | 결과 |
|---|---|---:|---:|---|---|---|---|---|---|
| ko | <https://star-pibu.com/treatments/ulthera> | 200 | 1 | organization | HTTPS absolute | ko | 없음 | 있음 | 통과 |
| en | <https://star-pibu.com/en/treatments/ulthera> | 200 | 1 | organization | HTTPS absolute | en | 없음 | 있음 | 통과 |
| ja | <https://star-pibu.com/ja/treatments/ulthera> | 200 | 1 | organization | HTTPS absolute | ja | 없음 | 있음 | 통과 |
| zh | <https://star-pibu.com/zh/treatments/ulthera> | 200 | 1 | organization | HTTPS absolute | zh | 없음 | 있음 | 통과 |
| zh-TW | <https://star-pibu.com/zh-tw/treatments/ulthera> | 200 | 1 | organization | HTTPS absolute | zh-TW | 없음 | 있음 | 통과 |

각 응답의 페이지 고유 MedicalProcedure는 해당 locale canonical URL과 일치했고, provider는 모두 `https://star-pibu.com/#organization` 단일 참조를 사용했습니다. image는 root-relative 경로가 아닌 HTTPS absolute URL이었으며, 지원되지 않는 `status` 필드는 없었습니다. `followup`은 빈 값 없이 존재했고 `inLanguage`도 대상 locale과 맞았습니다.

응답에는 진료소 offer catalog에 속한 29개의 추가 MedicalProcedure 항목이 함께 있습니다. 이 항목들은 페이지 canonical URL과 다르므로 상세 페이지 MedicalProcedure의 중복이 아닙니다. 따라서 이 감사의 고유 상세 대상은 **URL이 해당 locale page URL과 일치하는 항목 1개**로 판정했습니다.

비한국어 raw HTML은 한국어 초기 로딩 문구를 포함하지 않았습니다. 재감사 원본 수치와 평가 기준은 `reports/locale-medicalprocedure-raw-audit.json` 및 `scripts/audit-raw-treatment-jsonld.mjs`에서 재현할 수 있습니다.

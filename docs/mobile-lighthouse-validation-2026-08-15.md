# 모바일 Lighthouse 측정 및 개선 기록

## 측정 대상

운영 홈 `https://star-pibu.com/`을 Lighthouse 모바일 프리셋으로 측정했다.

| 카테고리 | 개선 전 | 재측정 |
|---|---:|---:|
| Performance | 99 | 99 |
| Accessibility | 91 | 91 |
| Best Practices | 93 | 93 |
| SEO | 92 | 85 |

점수는 외부 CDN·Cloudflare 캐시·운영 응답 시간의 영향을 받으므로 단일 실행으로 품질을 단정하지 않는다. 재측정에서 FCP는 1.8초에서 1.5초로 개선됐고 LCP는 1.8초 수준을 유지했다.

## 반영한 저위험 개선

- 모바일 의사 탭의 `tablist` 의미 구조를 보정했다.
- 관리 장비 카드의 중복 대체 텍스트를 정리했다.
- 공지 전체보기 링크에 설명 가능한 접근성 이름을 제공했다.
- 홈 배너 이미지에 실제 비율의 `width`·`height`를 추가해 레이아웃 이동 위험을 줄였다.
- 푸터의 영업시간·사업자 정보·법적 링크 등 낮은 대비 텍스트 색상을 보정했다.

## 재측정 해석

`star-pibu.com` 재측정에는 CDN 캐시와 기존 `robots.txt` 응답이 포함됐다. 실제 `robots.txt`는 HTTP 200, `text/plain`, 표준 `Sitemap: https://star-pibu.com/sitemap.xml` 지시자를 반환함을 별도로 확인했다. Lighthouse의 robots 경고는 운영 응답·파서 상황을 함께 검토해야 하며, 코드상 robots 파일을 임의로 변경하지 않았다.

# 390px 다국어 시술 제목 줄바꿈 최적화

## 적용 원칙

canonical 시술 상세의 hero H1과 관련 시술 card 제목은 페이지·버튼의 핵심 의미를 담고 있어, 말줄임표보다 **완전한 제목을 유지한 자연스러운 줄바꿈**이 적절합니다. 따라서 제목에 `text-wrap: balance`, `word-break: keep-all`, `overflow-wrap: anywhere`, `min-inline-size: 0`을 함께 적용했습니다. 이는 한국어·일본어·중국어의 불필요한 어절 분리를 줄이고, 영문처럼 공백 기반 단어가 긴 경우에도 카드 폭을 넘지 않게 하는 보완입니다.

요약 설명에는 기존 `line-clamp-2`를 유지했습니다. 설명은 반복되는 보조 정보인 반면 title은 button의 접근 가능한 이름에 포함되므로, 제목까지 말줄임표로 잘라서 의미를 숨기지 않았습니다. 별도의 `aria-label`이나 데이터 복제는 추가하지 않았고 기존 완전한 DOM text를 보존했습니다.

| 영역 | 390px 처리 | 목적 |
|---|---|---|
| hero eyebrow | 11px, line-height 1.45, letter-spacing 축소 | 언어별 카테고리·영문명 조합의 가로 overflow 방지 |
| canonical H1 | `clamp(1.6rem, 7.4vw, 1.875rem)`, line-height 1.25, balanced wrapping | SEO/H1 문구를 생략하지 않고 2~3줄에서 읽기 쉽게 유지 |
| hero summary | 14px, line-height 1.65, `text-wrap: pretty` | 긴 다국어 소개의 문단 호흡 유지 |
| badge | max inline width + emergency wrapping | 긴 현지화 badge가 hero 너비를 밀어내지 않음 |
| related card title | balanced/pretty wrapping, line-height 1.45 | button 이름을 온전히 노출 |
| related card description | 기존 2줄 clamp 유지 | 카드 높이와 반복 목록 밀도 유지 |

## 검증

| 검증 | 결과 |
|---|---|
| 모바일 제목 전용 회귀 | H1 full-text, title non-truncation, 390px CSS wrapping 규칙 3개 테스트 통과 |
| 시술 테마·SEO·다국어·FAQ 회귀 | 8개 파일, 82개 테스트 통과 |
| 전체 회귀 | 213개 파일, 1,931개 테스트 통과 |
| TypeScript | `pnpm check` 통과 |
| Lint | 오류 0건, 기존 경고 106건 |
| 390px capture | 캡처 서비스가 1회 실패. CSS의 fixed 639px breakpoint, full H1 DOM text, 기존 mobile CTA/grid 소스 계약 및 전용 회귀로 검증했으며, 실제 단말 QA는 다음 운영 검증 시 권장 |

시술명·번역 데이터, H1/SEO/JSON-LD 값, URL·canonical/hreflang, CTA·예약 동작, 장비 페이지 스타일은 변경하지 않았습니다.

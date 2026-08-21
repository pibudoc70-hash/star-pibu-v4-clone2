# 스타피부과 Senior Design Audit

**검토일:** 2026-08-21  
**대상:** 공개 홈페이지 desktop 화면과 현재 component/CSS 패턴  
**범위:** 디자인 감사 및 제안만 포함한다. 이 문서는 코드, 수치, 의료 문구, CTA, 예약 기능을 변경하지 않는다.

## 총평

현재 사이트에는 좋은 재료가 충분하다. 어두운 클리닉 hero, 실제 의사 portrait, warm-white background, gold accent, 카드형 이벤트 정보가 이미 의료기관에 맞는 신뢰감을 만든다. 특히 의사 section의 yellow rail–portrait–content panel 구성은 단순한 템플릿보다 더 고유한 장면을 만든다.

다만 page 전체가 **중앙 정렬 eyebrow → 큰 제목 → subtitle → gold divider → rounded card/shadow**라는 문법을 반복한다. 이런 문법은 개별 section에서는 정돈돼 보이지만, 누적되면 AI가 범용 landing-page 패턴을 조합한 듯한 인상을 준다. 개선의 핵심은 장식 요소를 늘리는 것이 아니라, 각 section에 다른 **정보 역할과 편집 리듬**을 부여하는 것이다.

> **디자인 방향:** “프리미엄처럼 보이기 위해 모두를 card로 만들지 말고, 전문성·증거·상담·시술 선택의 서로 다른 장면을 다른 밀도와 다른 레이아웃으로 보여준다.”

## 현재 강점: 반드시 유지할 요소

| 요소 | 현재 장점 | 유지 원칙 |
|---|---|---|
| Hero의 실제 공간 이미지 | 추상 gradient보다 실제 클리닉의 물성을 보여 줌 | image-led 첫인상과 깊은 dark tone 유지 |
| Doctors panel | side rail, portrait, biography의 비대칭 구성이 고유함 | 기존 interaction과 의사 data는 유지하고 hierarchy만 다듬기 |
| Event의 실제 프로모션 이미지 | 시술별 visual cue가 다름 | 상품 이미지의 개성은 유지하고 card chrome의 반복만 줄이기 |
| Warm white + restrained gold | 차갑지 않은 clinical premium tone을 만듦 | gold를 기본 장식이 아니라 상태·증거·핵심 가격 signal에 한정 |
| 접근성·loading 기본기 | skip link, focus, skeleton, error state가 존재 | 시각 개선이 keyboard/reading order를 해치지 않게 유지 |

## AI 생성물처럼 보일 수 있는 지점

| 우선순위 | 관찰 | 왜 범용적으로 보이는가 | 개선 방향 | 동결/주의 |
|---|---|---|---|---|
| P0 | 모든 주요 section이 centered eyebrow·heading·subtitle·divider를 반복 | section의 내용이 달라도 같은 템플릿으로 읽힘 | section header를 3가지 역할로 구분: **editorial intro**, **proof strip**, **utility heading** | Header/Hero/Footer는 현 동결 범위라 직접 변경하지 않음 |
| P0 | 6개 Event card가 같은 white radius·shadow·price·VAT pill·outline CTA 조합 | supplier promo 이미지만 바뀌고 나머지가 동일한 catalogue chrome으로 반복 | 1개는 editorial lead, 나머지는 compact price list 또는 group별 rhythm으로 분리 | 가격·상세 진입·CTA destination은 보존; 시각 pilot은 별도 승인 필요 |
| P1 | gold divider, pill, shadow, hover scale이 다수 component에서 반복 | “premium UI kit”의 효과를 여러 곳에 적용한 인상 | gold는 emphasis 1개 역할, shadow는 elevation 1개 역할로 축소; hover는 scale보다 tone/border 변화 중심 | global token 일괄 교체가 아니라 component별 pilot 권장 |
| P1 | Doctors panel 내부에 label, 영문명, badge, chip, credential list가 한 화면에 밀집 | 좋은 정보도 우선순위가 같으면 ‘카드 안에 카드’처럼 보임 | 첫 화면은 한 문장 전문성·핵심 credential 2개, 나머지는 progressive disclosure 또는 낮은 대비의 list로 구분 | 의사 profile claim/경력 텍스트는 검증 없이 변경하지 않음 |
| P1 | Hero 위에 menu, location microcopy, 외부 CTA 두 개, language control이 공존 | 첫 화면의 brand/space보다 utility layer가 먼저 경쟁함 | desktop header의 content priority를 별도 visual audit으로 다루고, CTA 색 대비·spacing을 재정렬 | Header·외부 CTA는 현재 완전 동결; 사용자 승인 전 수정 금지 |
| P2 | 인증 banner가 narrative 중간에 단일 이미지 block으로 삽입 | section과 다른 visual grammar라 editorial flow가 끊김 | image를 그대로 유지하며 proof strip 또는 contextual annotation으로 연결 | 인증 문구·이미지·link의 진위/내용은 변경하지 않음 |
| P2 | doctor 뒤 treatments skeleton이 바로 이어짐 | polished clinical story 뒤에 generic placeholder가 드러남 | loading surface에 section context와 tonal continuity를 부여 | data flow/skeleton timing은 이미 측정 중이며 UX 변경은 별도 작업 |

## 제안하는 레이아웃 문법

### 1. Section을 “모두 같은 제목”에서 “다른 장면”으로 나누기

앞으로 각 section은 아래 세 가지 중 하나만 선택하는 것이 좋다. 이벤트처럼 선택을 돕는 영역은 **utility heading**을 사용해 heading을 작게 하고 filter/price hierarchy를 먼저 보여준다. 의사나 시설처럼 신뢰를 만드는 영역은 **editorial intro**로 여백과 이미지의 비중을 높인다. 인증·연혁·전문의 수 같은 근거는 **proof strip**으로 짧고 수평적인 구조를 쓴다. 이렇게 하면 같은 color와 font를 쓰더라도 화면이 기계적으로 반복되지 않는다.

### 2. Event section은 ‘프로모션 카드 벽’이 아니라 선택을 돕는 가격 편집면으로 만들기

가장 영향이 큰 변화 후보는 Event다. 첫 카드 하나만 크게 두고, 나머지를 과도한 shadow 없이 정렬된 compact card/list로 바꾸면 동일한 6개 상품도 편집된 인상을 준다. 가격은 image보다 먼저 읽히는 position으로 정리하고, `VAT 포함`은 pill 대신 price metadata로 낮춘다. `자세히 보기`는 현재 destination을 유지하되 card footer의 넓은 outline button 대신 quiet inline action으로 낮추는 편이 더 성숙하다.

이 작업은 **현재 Event data·가격·CTA 경로를 바꾸지 않는 visual-only pilot**으로도 가능하지만, desktop/mobile table이 분리된 구조이므로 EventCard와 EventTableMobile을 함께 검증해야 한다.

### 3. Doctors panel은 더 적은 장식으로 더 많은 신뢰를 보여주기

Doctors의 layout을 새로 만들 필요는 없다. 현재 비대칭 composition을 유지하고, 첫 viewport에는 name, specialty statement, 핵심 경력 2개, portrait를 명확히 둔다. tag/chip과 전체 credential은 2차 읽기 계층으로 내려보내면 portrait와 원장의 언어가 중심이 된다. 이 방식은 content를 삭제하는 것이 아니라 읽는 순서를 디자인하는 것이다.

### 4. Shadow·radius·motion은 ‘브랜드 효과’가 아니라 의미를 가져야 한다

현재 여러 영역에서 `rounded-2xl/3xl`, `shadow-lg/2xl`, `hover:scale-105`, gold outline이 반복된다. 앞으로 shadow는 overlay, clickable elevation, static information을 구분하는 데만 쓰고, static card에는 hairline border 또는 background tone만 사용한다. hover scale은 gallery thumbnail처럼 zoom의 의미가 있는 곳에만 남기고, event/utility card는 border·text tone 변화로 충분하다.

## 안전한 실행 우선순위

| 순서 | 작업 | 예상 변경 범위 | 사용자 결정 필요 여부 |
|---|---|---|---|
| 1 | **Event visual rhythm pilot**: lead card 1개 + compact card/list의 desktop composition prototype | EventCard, Event section styles, focused tests; mobile table는 no-change 검증 | 필요 — 첫 visual redesign이므로 layout 승인 권장 |
| 2 | **Doctors information hierarchy pilot**: profile 첫 viewport의 text priority와 credential grouping만 조정 | doctor desktop/mobile layout, CSS, focused a11y tests | 필요 — 의료진 presentation 변경 승인 권장 |
| 3 | **Section header grammar pilot**: Event/Facilities 중 1개에 utility heading 또는 editorial intro를 적용 | 1~2 component + styles + visual QA | 필요 — 전면 통일은 금지, one-section pilot만 권장 |
| 4 | **Header utility density audit** | read-only 후 별도 제안 | 필수 — Header/CTA는 현재 동결 |

## 실행하지 말아야 할 것

현 단계에서 전체 페이지에 새 gradient, glassmorphism, noise texture, oversized typography, rounded card를 추가로 덧씌우는 방식은 피해야 한다. 이런 변화는 AI 생성물 같은 인상을 줄이기보다 강화한다. 또한 의료 문구·수치·외부 상담 CTA·예약 flow를 시각 개선의 명분으로 바꾸지 않는다.

## 결론

사이트가 덜 AI처럼 보이려면 “더 화려한 디자인”보다 **선택의 일관성**이 필요하다. Hero는 공간, Doctors는 사람, Event는 선택, 인증은 증거라는 역할을 분명히 하여 같은 visual grammar를 반복하지 않으면 된다. 가장 안전하면서 영향이 큰 다음 단계는 Event section 한 곳의 visual rhythm pilot이며, 전면 디자인 통일은 그 결과를 확인한 뒤에만 검토하는 것이 적절하다.

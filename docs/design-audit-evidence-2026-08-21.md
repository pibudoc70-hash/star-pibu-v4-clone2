# Design Audit Evidence — 2026-08-21

**검토 URL:** `https://star-pibu.com/`  
**검토 viewport:** desktop browser  
**용도:** 현재 공개 화면의 관찰 근거를 보존하며, 본 문서는 디자인 변경 제안 전용이다.

| 화면 구간 | 관찰된 구성 | 디자인 감사에서 확인할 지점 |
|---|---|---|
| Hero | 어두운 클리닉 내부 이미지 위에 흰색 wordmark, 영문 tagline, 3개 수치, 전화 CTA가 중앙 정렬됨 | 브랜드 이미지와 수치·CTA의 동시 경쟁, generic luxury-clinic composition 여부 |
| Header | 작은 텍스트 메뉴·두 개의 고채도 외부 상담 CTA·language control이 hero 위에 놓임 | 정보 밀도, 시선 우선순위, brand tone과 CTA 색의 관계 |
| 리프팅 안내 | 짧은 eyebrow, 큰 한 줄 heading, 본문 단락이 넓은 warm-white section에 배치됨 | heading/eyebrow 패턴의 반복성과 paragraph density |
| 인증 배너 | 중앙에 넓은 외부 이미지 banner가 독립 block으로 배치됨 | 이미지 banner가 narrative flow를 끊는지, section rhythm과의 관계 |
| Special Event | 중앙 정렬 eyebrow/heading/subtitle, 넓은 vertical whitespace, 3열 카드 skeleton/카드 grid | repeated centered title formula, section spacing, card pattern의 고유성 |
| Doctors | centered eyebrow/heading/subtitle, 3개 의사 tab, 대형 portrait·bio·credential list | content hierarchy, tab/portrait treatment의 브랜드 고유성, text wall risk |
| Treatments/Equipment | event/doctor 뒤에 initial skeleton이 노출됨 | section boundary, loading state가 polished editorial tone을 훼손하는지 |

## 직접 관찰한 콘텐츠 밀도

이벤트 카드에는 이미지, 제목, subtitle, 세부 항목, 가격, VAT, 상세 CTA가 반복된다. 의사 섹션에는 3개 tab, portrait, 영문명, badge, 장문 인사말, 전문 시술 chip, 경력 목록이 함께 배치된다. 따라서 후속 제안은 데이터를 줄이기보다 **표시 밀도와 hierarchy를 단계화**하는 방향을 우선 검토한다.

## 추가 desktop 관찰

이벤트 desktop grid는 6개 card가 같은 rounded white panel, shadow, image, 두 줄 text, gold price, `VAT 포함` pill, outline `자세히 보기` button의 조합을 반복한다. 이벤트 이미지 자체는 다양하지만, panel 내부 hierarchy와 여백이 거의 같아 카탈로그형 인상이 강하다.

의사 section은 yellow side rail·portrait·white content panel이라는 비대칭 구성이어서 이벤트 grid보다 고유한 장면을 만든다. 다만 eyebrow, headline, long bio, chips, credential rows가 한 화면에 모여 있고 작은 gold/gray label이 반복된다. 이 section은 구성 자체를 교체하기보다, 첫 시선에서 읽힐 한 문장과 credential 정보의 계층을 분리하는 것이 적절한 후보다.

의사 section 직후 시술·장비 section은 별도 heading과 initial skeleton으로 시작한다. rich doctor profile 뒤에 skeleton이 바로 노출되면 editorial 흐름이 잠시 끊기므로, skeleton 자체의 기능을 바꾸지 않는 범위에서 section transition의 시각적 연결성을 검토할 필요가 있다.

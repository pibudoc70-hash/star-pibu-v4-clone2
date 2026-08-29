# Event JSON-LD 제안 검토 및 보수적 실행 프롬프트

## 검토 결론

제안의 **핵심 문제 인식은 타당**합니다. 현재 `buildEventJsonLd`는 실제 `startDate`가 없을 때 실행일을 `startDate`와 `Offer.validFrom`으로 생성하고 `EventScheduled`를 선언합니다. 그러나 현재 `events` 테이블에는 `startDate`와 `endDate` 컬럼이 없고, `EventDetail`은 raw event를 타입 단언으로만 읽습니다. 따라서 현 데이터 모델에서는 이벤트 상세가 보이는 날마다 “오늘 시작하는 예정 Event”가 생성될 수 있습니다.

다만 원안은 그대로 실행하면 안 됩니다. 프로젝트 경로가 `star-pibu-v4-clone2`로 잘못 적혀 있고, managed workspace의 실제 경로는 `star-pibu-v4-clone`입니다. 또한 **시작일과 종료일이 모두 있어야만 Event를 만들도록 강제하는 조건은 과도합니다.** Google의 Event 문서에서 `startDate`는 필수이고 `endDate`는 권장 속성입니다. 실제로 하루짜리 Event는 유효한 시작일만으로 표현할 수 있으므로, 보수적 기준은 “유효한 실제 `startDate`가 있을 때만 Event 생성, `endDate`는 존재하고 유효할 때만 추가”입니다.[1]

Google은 단기 할인·쿠폰·구매 기회를 Event로 마크업하지 말라고 안내합니다. 이 사이트의 현 `events` 행은 일반 프로모션 성격도 포함하므로, 날짜가 있더라도 **실제 공개 참여형 행사인지 별도 운영 확인 전에는 Event schema를 추가·확대하지 않는 방식**이 안전합니다.[1]

## 현재 증거

| 점검 항목 | 관찰 결과 | 판단 |
|---|---|---|
| 기준 커밋 | `4fdf4e10c54614b64728aaf0cc4c01c03b70c6b9` | 제안의 기준 SHA와 일치 |
| 현재 작업 트리 | 이 검토 문서 작성용 `todo.md` 변경만 존재 | 기능 구현 전이며, Event/테마 코드 변경 없음 |
| 목록 다크 모드 공개 반영 | 공개 `/equipment3`의 JS 렌더링에서 `다크 모드` control, 웜 그레이지 표면, native card 링크 확인 | 이미 반영됨. 재구현 금지 |
| 목록 raw HTML | HTTP 200, self-canonical, JSON-LD 0개, 초기 HTML에는 control 문구 없음 | control은 client hydration 후 확인해야 하며 raw HTML 부재만으로 미반영 판정 금지 |
| 장비 상세 raw HTML | HTTP 200, self-canonical, JSON-LD 1개, raw title은 비어 있음 | 상세 SEO는 별도 prerender/client handoff 계약을 유지해야 함 |
| 글로벌 sitemap | HTTP 200, localized equipment URL 288건 | 기존 다국어 sitemap 계약은 변경 금지 |
| Event 생성기 | `new Date().toISOString().split("T")[0]` fallback이 `startDate`와 `validFrom` 양쪽에 존재 | 사실성 P0 대상 |
| Event 호출부 | `EventDetail.tsx` 단일 호출 | 최소 수정 가능하나 null schema filtering 필요 |
| 이벤트 데이터 모델 | `events` 테이블에 `startDate`/`endDate` 없음; test fixture는 두 값을 `null`로 보유 | DB 변경·날짜 역추론 없이 Event schema를 생략해야 함 |

공개 HTML에서 Event schema가 raw response에 노출되는지까지는 이번 점검에서 확인되지 않았습니다. `EventDetail`은 client-side `SeoHead`로 Event JSON-LD를 구성하므로, 후속 최소 수정은 **페이지 표시와 client-side schema injection 양쪽**을 검사하되 서버 prerender를 새로 도입하지 않아야 합니다.

## 원안에서 수정할 지점

| 원안 항목 | 검토 | 보수적 조정 |
|---|---|---|
| Step 0 후 자동으로 Step 1 진행 | 부적절 | evidence report 후 반드시 사용자 승인 대기. 이 프로젝트는 checkpoint가 자동 게시되므로 무승인 코드 저장 금지 |
| 시작일·종료일 모두 있어야 Event 생성 | 과도 | 실제·유효한 `startDate`만 필수. `endDate`는 유효하고 startDate보다 이르지 않을 때만 선택적으로 포함 |
| 날짜 없는 경우 WebPage 추가 | 불필요 | `SeoHead pageType="treatment"`의 기존 MedicalBusiness 및 페이지 메타를 유지. Event만 제거하고 새 WebPage schema는 만들지 않음 |
| `buildEventJsonLd`만 수정 | 불충분 | nullable return에 맞춰 `EventDetail.tsx`에서 Event schema만 조건부 배열에 추가. Breadcrumb은 항상 유지 |
| `event.date`를 시작일로 재활용 | 위험 | 표시용 문자열의 의미·형식이 보장되지 않으므로 사용 금지 |
| 사용자가 Publish | 현재 환경과 불일치 | checkpoint 저장 시 자동 게시됨. 승인된 최소 범위가 아니면 checkpoint도 만들지 않음 |
| Event rich result 기대 | 과장 위험 | Google 문서의 지원 지역 목록에 대한민국은 포함되지 않는다. 사실성·정합성 개선으로만 다루고 노출·순위는 약속하지 않음.[1] |

## 승인용 실행 프롬프트

아래 프롬프트는 **사용자의 별도 승인 후에만** 실행합니다. Step 0은 읽기 전용이며, Step 1은 Step 0 증거와 범위가 일치할 때만 진행합니다.

```text
당신은 star-pibu.com의 시니어 풀스택·SEO 엔지니어다.

이번 작업의 유일한 목표는 Event JSON-LD가 실제 날짜 없이 오늘 날짜를 만들어 내지 않도록 사실성을 바로잡는 것이다. 이미 공개된 장비 목록/상세의 웜 그레이지·다크 모드, 390px 카드 밀도, 장비 SEO/AEO/sitemap은 재구현하거나 수정하지 않는다.

프로젝트 기준
- 경로: /home/ubuntu/star-pibu-v4-clone
- 예상 HEAD: 4fdf4e10c54614b64728aaf0cc4c01c03b70c6b9. 다르면 실제 SHA와 이유만 기록한다.
- 운영 도메인: https://star-pibu.com
- 체크포인트 저장은 자동 게시를 유발할 수 있다. 승인 범위를 벗어난 변경이 있으면 저장하지 않는다.

절대 동결 — 읽기만 허용
- 예약·OTP·스키마·마이그레이션·seed·fixture·관리자 예약·/my-reservations
- 네이버·카카오·위챗·OTOMO·전화 CTA, reserveUrl, chatUrl, phoneHref, MobileBottomCTA, FloatingCTA, useChatConfig
- Header, HeroSection, Footer의 디자인·카피·배치
- route, canonical, hreflang, locale path
- 운영 DB 콘텐츠, 의료 카피·수치, 장비 FAQ 본문, 인포그래픽 자산
- 장비 목록/상세의 warm-greige·dark mode CSS, toggle, localStorage key `equipment3_color_scheme`
- 신규 dependency, lint 완화, eslint-disable, any 추가, force push/reset --hard

## Step 0 — 읽기 전용 증거 수집 (코드·DB·checkpoint 변경 금지)

1. 다음을 기록한다.
   - `git rev-parse HEAD`, `git status --short`, 최근 checkpoint
   - `client/src/lib/seoHelpers.ts`의 `buildEventJsonLd`
   - `client/src/pages/EventDetail.tsx`의 JSON-LD 배열과 `SeoHead`의 jsonLd 타입
   - `drizzle/schema.ts`의 events 정의와 event create/update input
   - buildEventJsonLd의 모든 호출부와 기존 `seoHelpers.test.ts` 범위
2. 공개 도메인과 개발 미리보기를 읽기 전용으로 확인한다.
   - `/`, `/equipment3`, 대표 장비 상세, `/sitemap-global.xml`, 실제 접근 가능한 event detail 1개
   - raw HTML과 JS 렌더링을 구분해서 HTTP, title, self-canonical, JSON-LD 개수, 장비 dark control, sitemap localized equipment URL 수를 표로 기록한다.
   - raw HTML에 dark control 문구가 없더라도 hydration 뒤 실제 control이 있으면 “공개 반영”으로 기록한다. 이를 미반영으로 판정해 테마를 재작성하지 않는다.
3. 다음 중 하나라도 맞지 않으면 코드 변경 없이 보고하고 중단한다.
   - Event builder에 실행일 fallback이 없거나 EventDetail 외 호출부가 발견됨
   - startDate/endDate가 이미 DB 스키마에서 다른 의미·형식으로 관리됨
   - 현 작업 트리에 이번 범위와 무관한 변경이 있음
   - event detail이 실제 단일 public event가 아니라 일반 프로모션/공지라는 근거가 확인됨
4. Step 0 보고 후 반드시 사용자 승인을 기다린다. 자동으로 Step 1로 진행하지 않는다.

## Step 1 — 승인 후 최소 사실성 수정

목적: 실제 시작일이 없는 프로모션을 오늘 시작하는 Event로 출력하지 않는다.

허용 파일은 원칙적으로 다음으로 제한한다.
- `client/src/lib/seoHelpers.ts`
- `client/src/pages/EventDetail.tsx`
- `client/src/lib/seoHelpers.test.ts`
- 필요 시 EventDetail의 schema 배열을 보호하는 새 focused test 1개
- `reports/event-jsonld-factuality.md`, `reports/event-jsonld-factuality.diff`, `todo.md`

구현 규칙
1. `buildEventJsonLd`는 `JsonLdSchema | null`을 반환한다.
2. 신뢰 가능한 ISO 8601 날짜/날짜시간 형식의 실제 `startDate`가 있을 때만 Event schema를 만든다. `new Date()`, 현재 시각, `createdAt`, `updatedAt`, 표시용 `event.date`를 fallback으로 사용하거나 추론하지 않는다.
3. `endDate`는 실제·유효하고 startDate보다 이르지 않을 때만 추가한다. endDate가 없다고 유효한 단일 시작일 Event를 제거하지 않는다.
4. startDate가 없거나 잘못됐으면 `null`을 반환한다. EventScheduled, Offer, validFrom도 출력하지 않는다.
5. EventDetail에서는 nullable 결과를 `jsonLd` 배열에 넣지 않는다. Breadcrumb은 항상 유지한다. 새 WebPage/Review/Rating/SearchAction schema를 추가하지 않는다.
6. `buildClinicJsonLd`, `buildWebSiteJsonLd`, FAQPage, MedicalProcedure, canonical/hreflang, sitemap, 모든 공개 문구와 CTA 목적지는 바꾸지 않는다.
7. `VideoObject.uploadDate = "2024-01-01"`은 발견만 기록하고 수정하지 않는다.

테스트는 반드시 RED → 구현 → GREEN 순으로 수행한다.
- 유효한 startDate와 endDate: exact value가 Event에 들어가며 실행일 fallback이 없다.
- 유효한 startDate만: Event는 생성하고 endDate/validFrom은 실제 정책에 맞는 값만 포함한다.
- startDate 없음: null을 반환하고 Event/Offer/현재 날짜가 만들어지지 않는다.
- endDate만 존재 또는 잘못된 날짜: null을 반환하고 날짜를 추론하지 않는다.
- EventDetail JSON-LD 배열: 날짜 없는 event에서도 Breadcrumb과 기존 페이지 UI는 유지되고 null schema가 전달되지 않는다.
- 기존 clinic/website/FAQ/equipment SEO 테스트, EventDetail의 제목·이미지·가격·외부 CTA가 유지된다.

검증 및 중단 규칙
1. focused Vitest → `pnpm check` → `pnpm lint` → 전체 `pnpm test` 순으로 실행한다. 전체 테스트가 환경·기존 실패로 끝나면 새 실패와 기존 실패를 구분해 기록하고 임의로 약화하지 않는다.
2. 개발 미리보기에서 날짜 없는 event를 실제로 확인할 수 있을 때, 화면의 제목·이미지·가격·외부 CTA와 JSON-LD absence를 함께 확인한다. 날짜 있는 event는 DB를 수정하지 말고, 기존 데이터에 있는 경우에만 검사한다.
3. `git diff --check`, `git diff --stat`을 확인한다. 허용 파일 외 변경, 특히 DB/예약/CTA/Header/Hero/Footer/장비 테마 변경이 있으면 즉시 해당 변경을 되돌리고 중단한다.
4. 보고서에는 raw HTML과 hydration의 차이, 실제 Event schema 대상 수, 날짜가 없는 행의 처리, 테스트 결과, VideoObject 후속 과제를 표로 기록한다.
5. 위 게이트를 통과하고 변경 파일이 허용 범위에만 있을 때만 checkpoint 1개를 저장한다.

완료 보고는 표만 사용한다.
1. HEAD와 Step 0 공개 반영 증거
2. 변경/비변경 파일 및 동결 범위 확인
3. 날짜 있는 Event / 날짜 없는 event의 JSON-LD 전후 비교
4. focused·typecheck·lint·full test 결과
5. P1 보류: 이벤트 날짜 데이터 모델·운영 입력 승인, image focal 데이터 이관, VideoObject uploadDate 사실 확인
```

## 이번에 보류할 항목

| 보류 항목 | 이유 |
|---|---|
| events 테이블에 날짜 컬럼 추가·백필 | 운영 데이터 정의와 관리자 입력/검수 절차가 필요하며 이번 사실성 수정 범위를 넘음 |
| `event.date`의 자동 파싱 | 표시 문자열은 기간·문구·포맷이 보장되지 않아 날짜를 만들어 내는 또 다른 fallback이 될 수 있음 |
| Event schema의 raw SSR/prerender 도입 | crawl architecture를 넓히는 별도 설계·테스트 과제이며 최소 수정이 아님 |
| VideoObject `uploadDate` 수정 | 실제 원본 업로드일 출처가 없어 값 대체 시 또 다른 사실성 위험이 생김 |
| 장비 테마·다크 모드 재수정 | 공개 JS 렌더링에 이미 반영됐고 Event 사실성 작업과 무관함 |
| 이벤트 이미지 focal point DB 이관 | 데이터 스키마·관리자 UX·migration 승인 전 장기 계획에 해당 |

## References

[1]: https://developers.google.com/search/docs/appearance/structured-data/event "Google Search Central — Event structured data"
[2]: https://schema.org/Event "Schema.org — Event"
